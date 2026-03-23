import React from 'react'
import { getGTMSettings } from '../utilities/getGTMSettings'

/**
 * Server component — place as the first child of <body>.
 *
 * Renders the <noscript><iframe> fallback required by GTM for
 * users who have JavaScript disabled.
 *
 * Renders nothing if GTM is disabled or Container ID is missing.
 */
export async function GTMBody() {
  const settings = await getGTMSettings()

  if (!settings) return null

  const envParams =
    settings.useEnvironment && settings.gtmAuth && settings.gtmPreview
      ? `&gtm_auth=${settings.gtmAuth}&gtm_preview=${settings.gtmPreview}&gtm_cookies_win=x`
      : ''

  const src = `https://www.googletagmanager.com/ns.html?id=${settings.containerId}${envParams}`

  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <iframe
        src={src}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  )
}
