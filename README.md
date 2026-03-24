# @elwood/payload-gtm

Google Tag Manager plugin for Payload CMS with full **Consent Mode v2** support.

## Features

- GTM configuration directly from the Payload admin panel
- **Consent Mode v2** support (ad_storage, analytics_storage, etc.)
- Automatic tracking: `page_view`, clicks, scroll depth (25/50/75/100%), form submissions, internal site searches, file downloads
- GTM Environments support (`gtm_auth`, `gtm_preview`)
- Debug mode
- `pushEvent()` and `updateConsent()` utilities for custom events

## Installation

```bash
pnpm add @elwood/payload-gtm
```

## Usage in Payload

```typescript
// payload.config.ts
import { gtmPlugin } from '@elwood/payload-gtm'

export default buildConfig({
  plugins: [
    gtmPlugin({ enabled: true }),
  ],
})
```

## Next.js Components

```tsx
// app/layout.tsx
import { GTMHead } from '@elwood/payload-gtm/components/GTMHead'
import { GTMBody } from '@elwood/payload-gtm/components/GTMBody'
import { GTMTracker } from '@elwood/payload-gtm/components/GTMTracker'

export default function Layout({ children }) {
  return (
    <html>
      <head>
        <GTMHead />
      </head>
      <body>
        <GTMBody />
        <GTMTracker />
        {children}
      </body>
    </html>
  )
}
```

## Utilities (client-side)

```typescript
import { pushEvent, updateConsent } from '@elwood/payload-gtm/utilities/dataLayer'

// Custom event
pushEvent('purchase', { value: 99.90, currency: 'EUR' })

// Update consent (after CMP interaction)
updateConsent({ analytics_storage: 'granted', ad_storage: 'granted' })
```

## Admin Configuration

After installing the plugin, navigate to **Admin → Settings → Google Tag Manager** to configure:

- **Container ID** (`GTM-XXXXXXX`)
- **Consent Mode v2** — default values for each category
- **Tracking events** — enable/disable specific event triggers
- **GTM Environments** — for staging/preview environments
- **Debug mode**
