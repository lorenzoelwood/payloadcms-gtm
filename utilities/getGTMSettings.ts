import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { GtmSetting } from '@/payload-types'

/**
 * Fetch the `gtm-settings` Global from Payload on the server.
 * Uses overrideAccess so no auth token is needed from layout.tsx.
 * Returns null if the global is not found or GTM is not enabled.
 */
export async function getGTMSettings(): Promise<GtmSetting | null> {
  try {
    const payload = await getPayload({ config: configPromise })

    const settings = await payload.findGlobal({
      slug: 'gtm-settings',
      depth: 0,
    })

    if (!settings?.enabled || !settings?.containerId) {
      return null
    }

    return settings
  } catch {
    // During build time or when the DB is unavailable, gracefully return null
    return null
  }
}
