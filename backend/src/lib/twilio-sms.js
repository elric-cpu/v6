const twilioMessagesUrl = "https://api.twilio.com/2010-04-01/Accounts";

function formatSubmissionLocation(submission) {
  const parts = [submission.address, submission.city, submission.zipCode].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Not provided";
}

function buildSmsText({ submission, title }) {
  const lines = [
    title,
    `Name: ${submission.name}`,
    `Phone: ${submission.phone}`,
    `Service: ${submission.serviceType}`,
    `Urgency: ${submission.urgency}`,
    `Location: ${formatSubmissionLocation(submission)}`,
    "",
    "Message:",
    submission.message,
  ];

  return lines.join("\n");
}

function truncateSmsText(text, maxLength = 1200) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 22)}\n\n[message truncated]`;
}

function resolveFetch(fetchImpl) {
  return fetchImpl ?? globalThis.fetch.bind(globalThis);
}

function isConfigured(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function getTwilioConfig() {
  return {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_FROM_NUMBER,
    to: process.env.SMS_TO,
  };
}

function buildTwilioBody({ from, to, text }) {
  return new URLSearchParams({
    From: from,
    To: to,
    Body: text,
  });
}

export function createTwilioSmsSender({ fetchImpl = null } = {}) {
  return async function sendSubmissionSms({ submission, title }) {
    const { accountSid, authToken, from, to } = getTwilioConfig();

    if (!isConfigured(accountSid) || !isConfigured(authToken) || !isConfigured(from) || !isConfigured(to)) {
      return { delivered: false, reason: "sms_not_configured" };
    }

    const messageBody = truncateSmsText(buildSmsText({ submission, title }));
    const transport = resolveFetch(fetchImpl);

    try {
      const response = await transport(`${twilioMessagesUrl}/${accountSid}/Messages.json`, {
        method: "POST",
        headers: {
          authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "content-type": "application/x-www-form-urlencoded",
        },
        body: buildTwilioBody({ from, to, text: messageBody }),
      });

      if (!response.ok) {
        return { delivered: false, reason: "sms_delivery_failed" };
      }

      const payload = await response.json().catch(() => null);

      return {
        delivered: true,
        provider: "twilio",
        messageId: payload?.sid ?? null,
      };
    } catch {
      return { delivered: false, reason: "sms_delivery_failed" };
    }
  };
}

export async function sendSubmissionSms(args) {
  return createTwilioSmsSender()(args);
}

export function getSmsHealthStatus() {
  const { accountSid, authToken, from, to } = getTwilioConfig();

  if (isConfigured(accountSid) && isConfigured(authToken) && isConfigured(from) && isConfigured(to)) {
    return {
      status: "healthy",
      provider: "twilio",
    };
  }

  return {
    status: "unhealthy",
    provider: null,
  };
}
