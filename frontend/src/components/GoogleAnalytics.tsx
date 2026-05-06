'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      return undefined;
    }

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}');
    `;
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return null;
}

// Export gtag function for event tracking
export const trackEvent = (eventName: string, eventParams?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Common event tracking functions
export const trackPageView = (pagePath: string) => {
  trackEvent('page_view', { page_path: pagePath });
};

export const trackContactFormSubmit = () => {
  trackEvent('contact_form_submit', {
    event_category: 'engagement',
    event_label: 'contact',
  });
};

export const trackServiceRequest = (serviceType: string) => {
  trackEvent('service_request', {
    event_category: 'engagement',
    event_label: serviceType,
  });
};

export const trackPhoneCall = () => {
  trackEvent('phone_call', {
    event_category: 'engagement',
    event_label: 'phone',
  });
};

export const trackEmailClick = () => {
  trackEvent('email_click', {
    event_category: 'engagement',
    event_label: 'email',
  });
};
