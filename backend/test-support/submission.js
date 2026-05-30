import { request, requestJson, withMockedFetch } from "./http.js";

export function postJson(server, path, payload) {
  return requestJson(server, path, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function requestWithOptions(server, path, options) {
  return request(server, path, options);
}

export function mockResendFetch(response) {
  return async (url) => {
    if (url !== "https://api.resend.com/emails") {
      return undefined;
    }

    if (response instanceof Error) {
      throw response;
    }

    if (response?.type === "network-error") {
      throw new Error("network error");
    }

    return new Response(JSON.stringify(response.body ?? { id: "email-test-id" }), {
      status: response.status ?? 200,
      headers: {
        "content-type": "application/json",
      },
    });
  };
}

export function mockTwilioFetch(response) {
  return async (url) => {
    if (!url.startsWith("https://api.twilio.com/2010-04-01/Accounts/") || !url.endsWith("/Messages.json")) {
      return undefined;
    }

    if (response instanceof Error) {
      throw response;
    }

    if (response?.type === "network-error") {
      throw new Error("network error");
    }

    return new Response(JSON.stringify(response.body ?? { sid: "sms-test-id" }), {
      status: response.status ?? 200,
      headers: {
        "content-type": "application/json",
      },
    });
  };
}

export function mockTurnstileFetch(url) {
  if (url !== "https://challenges.cloudflare.com/turnstile/v0/siteverify") {
    return undefined;
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}

export { withMockedFetch };
