'use client'

export type GTMEventParams = Record<string, unknown>

/**
 * Safely push an event to the dataLayer.
 *
 * @param eventName - The GTM event name (e.g. 'page_view', 'click')
 * @param params    - Additional event parameters
 * @param layerName - Custom dataLayer variable name (default: 'dataLayer')
 * @param debug     - When true, log the push to the console
 */
export function pushEvent(
  eventName: string,
  params: GTMEventParams = {},
  layerName = 'dataLayer',
  debug = false,
): void {
  if (typeof window === 'undefined')
    return // Initialise the dataLayer array if it doesn't exist yet
  ;(window as any)[layerName] = (window as any)[layerName] ?? []

  const payload = { event: eventName, ...params }
  ;(window as any)[layerName].push(payload)

  if (debug) {
    // eslint-disable-next-line no-console
    console.debug(`[GTM dataLayer] → ${eventName}`, payload)
  }
}

/**
 * Update Google Consent Mode v2 values at runtime (e.g. after CMP interaction).
 *
 * @param consentParams - Consent state object
 * @param layerName     - Custom dataLayer variable name (default: 'dataLayer')
 */
export function updateConsent(
  consentParams: {
    ad_storage?: 'granted' | 'denied'
    analytics_storage?: 'granted' | 'denied'
    functionality_storage?: 'granted' | 'denied'
    personalization_storage?: 'granted' | 'denied'
    ad_user_data?: 'granted' | 'denied'
    ad_personalization?: 'granted' | 'denied'
  },
  layerName = 'dataLayer',
): void {
  if (typeof window === 'undefined') return
  ;(window as any)[layerName] = (window as any)[layerName] ?? []
  ;(window as any)[layerName].push(['consent', 'update', consentParams])
}
