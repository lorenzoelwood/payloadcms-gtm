import Script from 'next/script'
import React from 'react'
import { getGTMSettings } from '../utilities/getGTMSettings'
import type { GtmSetting } from '@/payload-types'

function buildConsentModeScript(settings: GtmSetting): string {
  const layerName = settings.dataLayerName || 'dataLayer'
  const waitForUpdate = settings.waitForUpdate ?? 500

  return `
window['${layerName}'] = window['${layerName}'] || [];
function gtag(){window['${layerName}'].push(arguments);}
gtag('consent', 'default', {
  'ad_storage':              '${settings.adStorage || 'denied'}',
  'analytics_storage':       '${settings.analyticsStorage || 'denied'}',
  'functionality_storage':   '${settings.functionalityStorage || 'denied'}',
  'personalization_storage': '${settings.personalizationStorage || 'denied'}',
  'ad_user_data':            '${settings.adUserData || 'denied'}',
  'ad_personalization':      '${settings.adPersonalization || 'denied'}',
  'wait_for_update':         ${waitForUpdate}
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
  `.trim()
}

function buildGTMInitScript(settings: GtmSetting): string {
  const layerName = settings.dataLayerName || 'dataLayer'
  return `
(function(w,d,s,l,i){
  w[l]=w[l]||[];
  w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),
      dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;
  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl${
    settings.useEnvironment && settings.gtmAuth && settings.gtmPreview
      ? `+'&gtm_auth=${settings.gtmAuth}&gtm_preview=${settings.gtmPreview}&gtm_cookies_win=x'`
      : ''
  }${settings.debugMode ? `+'&gtm_debug=x'` : ''};
  f.parentNode.insertBefore(j,f);
})(window,document,'script','${layerName}','${settings.containerId}');
  `.trim()
}

/**
 * Server component — place inside <head>.
 *
 * Injects:
 *   1. (optional) Google Consent Mode v2 defaults — beforeInteractive
 *   2. GTM main snippet — afterInteractive
 *
 * Renders nothing if GTM is disabled or Container ID is missing.
 */
export async function GTMHead() {
  const settings = await getGTMSettings()

  if (!settings) return null

  return (
    <>
      {/* 1. Consent Mode v2 defaults (must run before GTM) */}
      {settings.enableConsentMode && (
        <Script
          id="gtm-consent-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: buildConsentModeScript(settings) }}
        />
      )}

      {/* 2. GTM main loader */}
      <Script
        id="gtm-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: buildGTMInitScript(settings) }}
      />
    </>
  )
}
