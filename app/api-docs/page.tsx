"use client";

import Script from "next/script";

export default function ApiDocsPage() {
  function initSwagger() {
    const w = window as any;
    if (!w.SwaggerUIBundle || !w.SwaggerUIStandalonePreset) return;
    w.SwaggerUIBundle({
      url: "/api/swagger",
      dom_id: "#swagger-ui",
      presets: [w.SwaggerUIBundle.presets.apis, w.SwaggerUIStandalonePreset],
      layout: "StandaloneLayout",
    });
  }

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
      <div id="swagger-ui" />
      <Script
        src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"
        strategy="afterInteractive"
        onLoad={initSwagger}
      />
      <Script
        src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"
        strategy="afterInteractive"
        onLoad={initSwagger}
      />
    </>
  );
}
