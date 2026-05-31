"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { readConsent, type ConsentState } from "./CookieConsent";

/* ---------------------------------------------------------------------------
 * Consent-gated tag loading — implements brief §4.6/§4.7.
 * GTM is loaded only when at least one non-necessary category is granted.
 * The Consent Mode v2 defaults are set BEFORE GTM loads so that downstream
 * tags pick up the correct grant state on their first execution.
 * -------------------------------------------------------------------------*/

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export function ConsentScripts() {
  const [consent, setConsent] = useState<ConsentState | null>(null);

  useEffect(() => {
    setConsent(readConsent());
    const handler = (e: Event) =>
      setConsent((e as CustomEvent<ConsentState>).detail);
    window.addEventListener("restorise:consent-changed", handler);
    return () =>
      window.removeEventListener("restorise:consent-changed", handler);
  }, []);

  if (!consent || !GTM_ID) return null;
  const anyGranted =
    consent.analytics || consent.marketing || consent.functional;
  if (!anyGranted) return null;

  const adGrant = consent.marketing ? "granted" : "denied";
  const analyticsGrant = consent.analytics ? "granted" : "denied";
  const functionalGrant = consent.functional ? "granted" : "denied";

  return (
    <>
      <Script id="consent-mode-defaults" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: '${adGrant}',
            ad_user_data: '${adGrant}',
            ad_personalization: '${adGrant}',
            analytics_storage: '${analyticsGrant}',
            functionality_storage: '${functionalGrant}',
            security_storage: 'granted',
            wait_for_update: 500
          });
        `}
      </Script>
      <Script id="gtm-loader" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>
    </>
  );
}
