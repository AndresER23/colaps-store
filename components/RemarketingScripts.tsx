// app/components/RemarketingScripts.tsx
"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export function RemarketingScripts() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Google Analytics pageview
      try {
        if (window.gtag) {
          window.gtag("config", "G-WS8NJXHDH1", {
            page_path: pathname + (searchParams?.toString() ? "?" + searchParams.toString() : ""),
          });
        }
      } catch (e) {
        console.error("Error tracking GA pageview:", e);
      }

      // Meta Pixel pageview
      try {
        if (window.fbq) {
          window.fbq("track", "PageView");
        }
      } catch (e) {
        console.error("Error tracking Meta PageView:", e);
      }
    }
  }, [pathname, searchParams]);

  return (
    <>
      {/* Google Analytics - IMPORTANTE: usar componente Script de Next.js */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-WS8NJXHDH1"
      />

      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WS8NJXHDH1', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `,
        }}
      />

      {/* Meta Pixel (Facebook) - IMPORTANTE: usar componente Script de Next.js */}
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '3086637538197950');
            fbq('track', 'PageView');
          `,
        }}
      />

      {/* Meta Pixel noscript fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=3086637538197950&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
    </>
  );
}

// ============================================
// HOOKS DE TRACKING PARA USAR EN TUS COMPONENTES
// ============================================

// Hook para trackear eventos custom
export function useTracking() {
  const trackEvent = (eventName: string, params?: Record<string, any>) => {
    // Google Analytics
    if (typeof window !== "undefined" && window.gtag) {
      try {
        window.gtag("event", eventName, params);
        console.log("✅ GA Event:", eventName, params);
      } catch (e) {
        console.error("❌ GA Error:", e);
      }
    } else {
      console.warn("⚠️ GA not loaded yet");
    }

    // Meta Pixel
    if (typeof window !== "undefined" && window.fbq) {
      try {
        window.fbq("track", eventName, params);
        console.log("✅ Meta Event:", eventName, params);
      } catch (e) {
        console.error("❌ Meta Error:", e);
      }
    } else {
      console.warn("⚠️ Meta Pixel not loaded yet");
    }
  };

  return { trackEvent };
}

// Ejemplos de uso en tus componentes:
/*

// En ProductCard cuando agregan al carrito:
const { trackEvent } = useTracking();

const handleAddToCart = () => {
  trackEvent("AddToCart", {
    content_name: product.title,
    content_ids: [product.id],
    content_type: "product",
    value: product.price,
    currency: "COP",
  });
};

// En Checkout cuando inician checkout:
trackEvent("InitiateCheckout", {
  value: cartTotal,
  currency: "COP",
  num_items: cartItems.length,
});

// Cuando completan una compra:
trackEvent("Purchase", {
  transaction_id: orderId,
  value: total,
  currency: "COP",
  items: orderItems,
});

// Cuando se registran:
trackEvent("CompleteRegistration", {
  value: 0,
  currency: "COP",
});

// Cuando ven un producto:
trackEvent("ViewContent", {
  content_name: product.title,
  content_ids: [product.id],
  content_type: "product",
  value: product.price,
  currency: "COP",
});

*/