"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          "timeout-callback"?: () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TURNSTILE_SCRIPT_ID = "turnstile-api-script";
const TURNSTILE_SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileWidgetProps {
  onTokenChange: (token: string | null) => void;
}

export default function TurnstileWidget({ onTokenChange }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) {
      return undefined;
    }

    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => {
          onTokenChange(token);
        },
        "expired-callback": () => {
          onTokenChange(null);
          if (widgetIdRef.current && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current);
          }
        },
        "timeout-callback": () => {
          onTokenChange(null);
        },
        "error-callback": () => {
          onTokenChange(null);
          setStatus("error");
        },
      });

      setStatus("ready");
    };

    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      if (window.turnstile) {
        renderWidget();
      } else {
        existingScript.addEventListener("load", renderWidget, { once: true });
      }
      return () => {
        cancelled = true;
      };
    }

    const script = document.createElement("script");
    script.id = TURNSTILE_SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = TURNSTILE_SCRIPT_SRC;
    script.onload = renderWidget;
    script.onerror = () => {
      setStatus("error");
      onTokenChange(null);
    };
    document.head.appendChild(script);

    return () => {
      cancelled = true;
      script.onload = null;
      script.onerror = null;
    };
  }, [onTokenChange]);

  if (!TURNSTILE_SITE_KEY) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div ref={containerRef} />
      {status === "loading" ? (
        <p className="text-sm text-benson-slate">Loading spam protection…</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-benson-wine">
          Spam protection could not load. Please refresh or use the phone number
          if you need immediate help.
        </p>
      ) : null}
    </div>
  );
}
