const resendApiUrl = "https://api.resend.com/emails";

function formatSubmissionLocation(submission) {
  const parts = [submission.address, submission.city, submission.zipCode].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Not provided";
}

function formatSubmissionText({ submission, title }) {
  return [
    `${title}`,
    `Name: ${submission.name}`,
    `Phone: ${submission.phone}`,
    `Email: ${submission.email ?? "Not provided"}`,
    `Service type: ${submission.serviceType}`,
    `Urgency: ${submission.urgency}`,
    `Location: ${formatSubmissionLocation(submission)}`,
    `Source page: ${submission.sourcePage ?? "Not provided"}`,
    "",
    "Message:",
    submission.message,
  ].join("\n");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function formatSubmissionHtml({ submission, title }) {
  const safeMessage = escapeHtml(submission.message).replaceAll("\n", "<br />");

  return `
    <h1>${escapeHtml(title)}</h1>
    <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(submission.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(submission.email ?? "Not provided")}</p>
    <p><strong>Service type:</strong> ${escapeHtml(submission.serviceType)}</p>
    <p><strong>Urgency:</strong> ${escapeHtml(submission.urgency)}</p>
    <p><strong>Location:</strong> ${escapeHtml(formatSubmissionLocation(submission))}</p>
    <p><strong>Source page:</strong> ${escapeHtml(submission.sourcePage ?? "Not provided")}</p>
    <h2>Message</h2>
    <p>${safeMessage}</p>
  `;
}

function buildResendPayload({ submission, subject, title }) {
  return {
    from: process.env.EMAIL_FROM,
    to: [process.env.EMAIL_TO],
    subject,
    text: formatSubmissionText({ submission, title }),
    html: formatSubmissionHtml({ submission, title }),
    reply_to: submission.email ?? process.env.EMAIL_FROM,
  };
}

function resolveFetch(fetchImpl) {
  return fetchImpl ?? globalThis.fetch.bind(globalThis);
}

function isConfigured(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function getResendConfig() {
  return {
    apiKey: process.env.EMAIL_API_KEY,
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
  };
}

export function createResendMailer({ fetchImpl = null } = {}) {
  return async function sendSubmissionEmail({ submission, subject, title }) {
    const { apiKey, from, to } = getResendConfig();

    if (!isConfigured(apiKey) || !isConfigured(from) || !isConfigured(to)) {
      return { delivered: false, reason: "email_not_configured" };
    }

    let response;

    try {
      const transport = resolveFetch(fetchImpl);

      response = await transport(resendApiUrl, {
        method: "POST",
        headers: {
          authorization: `Bearer ${apiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(buildResendPayload({ submission, subject, title })),
      });
    } catch {
      return { delivered: false, reason: "email_delivery_failed" };
    }

    if (!response.ok) {
      return { delivered: false, reason: "email_delivery_failed" };
    }

    const payload = await response.json().catch(() => null);

    return {
      delivered: true,
      provider: "resend",
      messageId: payload?.id ?? null,
    };
  };
}

export function createSubmissionMailer(options = {}) {
  return createResendMailer(options);
}

export async function sendSubmissionEmail(args) {
  return createSubmissionMailer()(args);
}

export function getEmailHealthStatus() {
  const { apiKey, from, to } = getResendConfig();

  if (isConfigured(apiKey) && isConfigured(from) && isConfigured(to)) {
    return {
      status: "healthy",
      provider: "resend",
    };
  }

  return {
    status: "unhealthy",
    provider: null,
  };
}
