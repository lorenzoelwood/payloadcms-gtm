# @elwood/payload-gtm

Payload CMS plugin per Google Tag Manager con supporto completo a **Consent Mode v2**.

## Funzionalità

- Configurazione GTM dall'admin panel di Payload
- Supporto **Consent Mode v2** (6 parametri: ad_storage, analytics_storage, ecc.)
- Tracking automatico: `page_view`, click, scroll depth (25/50/75/100%), form submit, ricerche interne, download file
- Supporto GTM Environments (`gtm_auth`, `gtm_preview`)
- Modalità debug
- Utility `pushEvent()` e `updateConsent()` per eventi custom

## Installazione

```bash
pnpm add @elwood/payload-gtm
```

## Utilizzo in Payload

```typescript
// payload.config.ts
import { gtmPlugin } from '@elwood/payload-gtm'

export default buildConfig({
  plugins: [
    gtmPlugin({ enabled: true }),
  ],
})
```

## Componenti Next.js

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

## Utility (client-side)

```typescript
import { pushEvent, updateConsent } from '@elwood/payload-gtm/utilities/dataLayer'

// Evento custom
pushEvent('purchase', { value: 99.90, currency: 'EUR' })

// Aggiorna consensi (dopo CMP)
updateConsent({ analytics_storage: 'granted', ad_storage: 'granted' })
```

## Configurazione admin

Dopo aver installato il plugin, vai su **Admin → Settings → Google Tag Manager** e configura:

- **Container ID** (`GTM-XXXXXXX`)
- **Consent Mode v2** — valori di default per ogni categoria
- **Tracking events** — abilita/disabilita singoli eventi
- **GTM Environments** — per ambienti di staging/preview
- **Debug mode**
