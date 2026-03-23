import React, { Suspense } from 'react'
import { getGTMSettings } from '../utilities/getGTMSettings'
import { GTMTrackerClient } from './GTMTracker.client'

/**
 * Server component — place anywhere inside <body> (typically inside <Providers>).
 *
 * Fetches GTM settings server-side and passes them as serializable props
 * to the GTMTrackerClient component, which handles all runtime event tracking.
 *
 * Wraps the client in <Suspense> because the client component uses
 * useSearchParams() which requires a Suspense boundary in Next.js 15.
 */
export async function GTMTracker() {
  const settings = await getGTMSettings()

  if (!settings) return null

  return (
    <Suspense fallback={null}>
      <GTMTrackerClient
        containerId={settings.containerId ?? undefined}
        dataLayerName={settings.dataLayerName ?? 'dataLayer'}
        trackPageViews={settings.trackPageViews ?? true}
        trackClicks={settings.trackClicks ?? true}
        trackScrollDepth={settings.trackScrollDepth ?? false}
        trackForms={settings.trackForms ?? true}
        trackSearches={settings.trackSearches ?? false}
        trackDownloads={settings.trackDownloads ?? false}
        debugMode={settings.debugMode ?? false}
      />
    </Suspense>
  )
}
