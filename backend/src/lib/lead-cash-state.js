const workflowStates = ["lead", "estimate", "draft", "sent", "signed", "invoiced", "qb_synced"];

const eventStateMap = new Map([
  ["lead.intake.received", "lead"],
  ["gmail.message.received", "lead"],
  ["estimate.created", "estimate"],
  ["estimate.ready", "estimate"],
  ["draft.created", "draft"],
  ["draft.ready", "draft"],
  ["message.sent", "sent"],
  ["estimate.sent", "sent"],
  ["resend.email.sent", "sent"],
  ["signature.completed", "signed"],
  ["docusign.envelope.completed", "signed"],
  ["invoice.finalized", "invoiced"],
  ["stripe.payment.captured", "invoiced"],
  ["qb.invoice.synced", "qb_synced"],
  ["quickbooks.invoice.synced", "qb_synced"],
]);

const providerIdKeys = {
  gmail: "gmailMessageId",
  resend: "resendMessageId",
  stripe: "stripeReferenceId",
  docusign: "docusignEnvelopeId",
  quickbooks: "quickbooksInvoiceId",
};

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

export function getWorkflowStateIndex(state) {
  return workflowStates.indexOf(state);
}

export function normalizeProviderIds(providerIds = {}) {
  const normalized = {};

  for (const [provider, key] of Object.entries(providerIdKeys)) {
    const value = providerIds[key] ?? providerIds[provider];
    if (typeof value === "string" && value.trim()) {
      normalized[key] = value.trim();
    }
  }

  for (const [key, value] of Object.entries(providerIds)) {
    if (value == null) {
      continue;
    }

    if (Object.values(providerIdKeys).includes(key) || key.endsWith("Id")) {
      normalized[key] = String(value).trim();
    }
  }

  return normalized;
}

export function createLeadCashWorkflow({
  id,
  sourceKind,
  createdAt = new Date().toISOString(),
  metadata = {},
  providerIds = {},
} = {}) {
  return {
    id,
    sourceKind,
    state: "lead",
    stateIndex: 0,
    createdAt,
    updatedAt: createdAt,
    metadata: clone(metadata) ?? {},
    providerIds: normalizeProviderIds(providerIds),
    events: [],
    lastEventKey: null,
    lastEventType: null,
    lastEventAt: null,
  };
}

export function normalizeLeadCashEvent(input = {}) {
  const providerIds = normalizeProviderIds(input.providerIds);
  const eventType = String(input.eventType ?? input.type ?? "").trim();
  const provider = String(input.provider ?? "").trim() || null;
  const providerEventId = String(input.providerEventId ?? "").trim() || null;
  const eventKey = String(input.eventKey ?? providerEventId ?? "").trim() || null;

  return {
    eventKey,
    eventType,
    provider,
    providerEventId,
    targetState: String(input.targetState ?? eventStateMap.get(eventType) ?? "").trim() || null,
    occurredAt: input.occurredAt ?? new Date().toISOString(),
    payload: clone(input.payload) ?? {},
    providerIds,
  };
}

export function cloneLeadCashWorkflow(workflow) {
  return {
    ...workflow,
    metadata: clone(workflow.metadata) ?? {},
    providerIds: { ...(workflow.providerIds ?? {}) },
    events: Array.isArray(workflow.events)
      ? workflow.events.map((event) => ({
          ...event,
          payload: clone(event.payload) ?? {},
          providerIds: { ...(event.providerIds ?? {}) },
        }))
      : [],
  };
}

export function applyLeadCashEvent(workflow, inputEvent) {
  const event = normalizeLeadCashEvent(inputEvent);

  if (!event.eventKey) {
    throw new Error("Lead cash events require a stable eventKey.");
  }

  const existingEvent = workflow.events.find((entry) => entry.eventKey === event.eventKey || (event.providerEventId && entry.providerEventId === event.providerEventId));
  if (existingEvent) {
    return {
      workflow: cloneLeadCashWorkflow(workflow),
      applied: false,
      reason: "duplicate",
      event: existingEvent,
    };
  }

  if (!event.targetState) {
    throw new Error(`Unable to infer lead-cash target state for event ${event.eventType}.`);
  }

  const currentStateIndex = getWorkflowStateIndex(workflow.state);
  const nextStateIndex = getWorkflowStateIndex(event.targetState);

  if (nextStateIndex === -1) {
    throw new Error(`Unknown lead-cash state ${event.targetState}.`);
  }

  if (nextStateIndex < currentStateIndex) {
    return {
      workflow: cloneLeadCashWorkflow(workflow),
      applied: false,
      reason: "out_of_order",
      event,
    };
  }

  const nextWorkflow = cloneLeadCashWorkflow(workflow);
  nextWorkflow.providerIds = {
    ...nextWorkflow.providerIds,
    ...event.providerIds,
  };
  nextWorkflow.updatedAt = event.occurredAt;
  nextWorkflow.lastEventKey = event.eventKey;
  nextWorkflow.lastEventType = event.eventType;
  nextWorkflow.lastEventAt = event.occurredAt;

  if (nextStateIndex > currentStateIndex) {
    nextWorkflow.state = workflowStates[nextStateIndex];
    nextWorkflow.stateIndex = nextStateIndex;
  }

  const eventRecord = {
    eventKey: event.eventKey,
    eventType: event.eventType,
    provider: event.provider,
    providerEventId: event.providerEventId,
    previousState: workflow.state,
    nextState: nextWorkflow.state,
    occurredAt: event.occurredAt,
    payload: event.payload,
    providerIds: event.providerIds,
  };

  nextWorkflow.events = [...nextWorkflow.events, eventRecord];

  return {
    workflow: nextWorkflow,
    applied: true,
    reason: null,
    event: eventRecord,
  };
}

export function summarizeLeadCashWorkflow(workflow) {
  return {
    id: workflow.id,
    sourceKind: workflow.sourceKind,
    state: workflow.state,
    stateIndex: workflow.stateIndex,
    createdAt: workflow.createdAt,
    updatedAt: workflow.updatedAt,
    providerIds: { ...(workflow.providerIds ?? {}) },
    lastEventKey: workflow.lastEventKey,
    lastEventType: workflow.lastEventType,
    lastEventAt: workflow.lastEventAt,
    eventCount: Array.isArray(workflow.events) ? workflow.events.length : 0,
  };
}

export { workflowStates, providerIdKeys };
