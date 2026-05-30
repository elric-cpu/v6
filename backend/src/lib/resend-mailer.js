import { IAMCredentialsClient } from "@google-cloud/iam-credentials";

const resendApiUrl = "https://api.resend.com/emails";
const gmailTokenUrl = "https://oauth2.googleapis.com/token";
const gmailSendUrl = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";
const gmailScope = "https://www.googleapis.com/auth/gmail.send";

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

function buildGmailMimeMessage({ submission, subject, title, from, to }) {
  const headers = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `Reply-To: ${submission.email ?? from}`,
  ];

  return `${headers.join("\r\n")}\r\n\r\n${formatSubmissionText({ submission, title })}\r\n`;
}

function base64UrlEncode(value) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function resolveFetch(fetchImpl) {
  return fetchImpl ?? globalThis.fetch.bind(globalThis);
}

function isConfigured(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function getGmailConfig() {
  return {
    serviceAccountEmail: process.env.GMAIL_SERVICE_ACCOUNT_EMAIL,
    impersonatedUser: process.env.GMAIL_IMPERSONATED_USER,
    from: process.env.EMAIL_FROM ?? process.env.GMAIL_IMPERSONATED_USER,
    to: process.env.LEAD_NOTIFICATION_TO,
  };
}

function getResendConfig() {
  return {
    apiKey: process.env.EMAIL_API_KEY,
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
  };
}

function resolveEmailMode() {
  const gmailConfig = getGmailConfig();
  if (
    isConfigured(gmailConfig.serviceAccountEmail)
    && isConfigured(gmailConfig.impersonatedUser)
    && isConfigured(gmailConfig.from)
    && isConfigured(gmailConfig.to)
  ) {
    return "gmail";
  }

  const resendConfig = getResendConfig();
  if (isConfigured(resendConfig.apiKey) && isConfigured(resendConfig.from) && isConfigured(resendConfig.to)) {
    return "resend";
  }

  return "unconfigured";
}

async function signGmailJwt({ credentialsClient, serviceAccountEmail, impersonatedUser }) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = JSON.stringify({
    iss: serviceAccountEmail,
    sub: impersonatedUser,
    scope: gmailScope,
    aud: gmailTokenUrl,
    iat: issuedAt,
    exp: issuedAt + 3600,
  });

  const [response] = await credentialsClient.signJwt({
    name: `projects/-/serviceAccounts/${serviceAccountEmail}`,
    payload,
  });

  return response?.signedJwt ?? null;
}

async function exchangeGmailAccessToken({ fetchImpl, signedJwt }) {
  const transport = resolveFetch(fetchImpl);
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: signedJwt,
  });

  const response = await transport(gmailTokenUrl, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json().catch(() => null);
  return payload?.access_token ?? null;
}

async function sendGmailMessage({ fetchImpl, accessToken, raw }) {
  const transport = resolveFetch(fetchImpl);
  const response = await transport(gmailSendUrl, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      raw,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json().catch(() => null);
  return payload?.id ?? null;
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

export function createGmailMailer({ credentialsClient = new IAMCredentialsClient(), fetchImpl = null } = {}) {
  return async function sendSubmissionEmail({ submission, subject, title }) {
    const { serviceAccountEmail, impersonatedUser, from, to } = getGmailConfig();

    if (
      !isConfigured(serviceAccountEmail)
      || !isConfigured(impersonatedUser)
      || !isConfigured(from)
      || !isConfigured(to)
    ) {
      return { delivered: false, reason: "email_not_configured" };
    }

    let signedJwt;

    try {
      signedJwt = await signGmailJwt({
        credentialsClient,
        serviceAccountEmail,
        impersonatedUser,
      });
    } catch {
      return { delivered: false, reason: "email_delivery_failed" };
    }

    if (!signedJwt) {
      return { delivered: false, reason: "email_delivery_failed" };
    }

    const accessToken = await exchangeGmailAccessToken({
      fetchImpl,
      signedJwt,
    });

    if (!accessToken) {
      return { delivered: false, reason: "email_delivery_failed" };
    }

    const raw = base64UrlEncode(buildGmailMimeMessage({ submission, subject, title, from, to }));

    try {
      const messageId = await sendGmailMessage({
        fetchImpl,
        accessToken,
        raw,
      });

      if (!messageId) {
        return { delivered: false, reason: "email_delivery_failed" };
      }

      return {
        delivered: true,
        provider: "gmail",
        messageId,
      };
    } catch {
      return { delivered: false, reason: "email_delivery_failed" };
    }
  };
}

export function createSubmissionMailer(options = {}) {
  const mode = resolveEmailMode();

  if (mode === "gmail") {
    return createGmailMailer(options);
  }

  if (mode === "resend") {
    return createResendMailer(options);
  }

  return async function sendSubmissionEmail() {
    return { delivered: false, reason: "email_not_configured" };
  };
}

export async function sendSubmissionEmail(args) {
  return createSubmissionMailer()(args);
}

export function getEmailHealthStatus() {
  const mode = resolveEmailMode();

  if (mode === "gmail") {
    return {
      status: "healthy",
      provider: "gmail",
    };
  }

  if (mode === "resend") {
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
