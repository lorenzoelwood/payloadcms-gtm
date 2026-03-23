import type { Config, Plugin } from 'payload'
import { GTMSettings } from './globals/GTMSettings'
import type { GTMPluginOptions } from './types'

export { GTMSettings } from './globals/GTMSettings'
export type { GTMPluginOptions, GTMTrackerProps } from './types'

// Re-export components for use in layout.tsx
export { GTMHead } from './components/GTMHead'
export { GTMBody } from './components/GTMBody'
export { GTMTracker } from './components/GTMTracker'

/**
 * Payload plugin that adds a `gtm-settings` Global to the admin panel,
 * allowing editors to configure Google Tag Manager without touching code.
 *
 * Usage in payload.config.ts or plugins/index.ts:
 * ```ts
 * import { gtmPlugin } from '@/plugins/gtm'
 *
 * plugins: [
 *   gtmPlugin({ enabled: true }),
 * ]
 * ```
 *
 * Then add the frontend components to your layout.tsx:
 * ```tsx
 * import { GTMHead, GTMBody, GTMTracker } from '@/plugins/gtm'
 *
 * // In <head>:   <GTMHead />
 * // In <body>:   <GTMBody />
 * // In <body>:   <GTMTracker />
 * ```
 */
export const gtmPlugin =
  (options: GTMPluginOptions = {}): Plugin =>
  (incomingConfig: Config): Config => {
    const { enabled = true } = options

    if (!enabled) {
      return incomingConfig
    }

    const config: Config = { ...incomingConfig }

    config.globals = [...(config.globals || []), GTMSettings]

    return config
  }
