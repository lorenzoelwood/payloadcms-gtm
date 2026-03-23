export interface GTMPluginOptions {
  /**
   * Enable or disable the plugin entirely.
   * When false, the Global is still registered in Payload but no scripts are injected.
   * @default true
   */
  enabled?: boolean
}

/** Subset of GtmSetting passed as props to GTMTrackerClient (serializable only) */
export interface GTMTrackerProps {
  containerId?: string | null
  dataLayerName?: string | null
  trackPageViews?: boolean | null
  trackClicks?: boolean | null
  trackScrollDepth?: boolean | null
  trackForms?: boolean | null
  trackSearches?: boolean | null
  trackDownloads?: boolean | null
  debugMode?: boolean | null
}
