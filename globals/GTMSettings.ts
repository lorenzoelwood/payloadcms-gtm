import type { GlobalConfig, ValidateOptions } from 'payload'

const consentOptions = [
  { label: 'Granted', value: 'granted' },
  { label: 'Denied', value: 'denied' },
]

export const GTMSettings: GlobalConfig = {
  slug: 'gtm-settings',
  label: 'Google Tag Manager',
  admin: {
    group: 'Settings',
    description: 'Configure Google Tag Manager and event tracking for this site.',
  },
  access: {
    read: () => true, // Settings are read server-side with overrideAccess; also allow public for SSR
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // ─── General ───────────────────────────────────────────────────────────
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable Google Tag Manager',
      defaultValue: false,
      admin: {
        description: 'When disabled, no GTM scripts are injected into the page.',
      },
    },
    {
      name: 'containerId',
      type: 'text',
      label: 'Container ID',
      admin: {
        placeholder: 'GTM-XXXXXXX',
        description: 'Your GTM Container ID, e.g. GTM-XXXXXXX.',
        condition: (data) => Boolean(data?.enabled),
      },
      validate: (
        value: string | null | undefined,
        { data }: ValidateOptions<any, any, any, string>,
      ) => {
        if (data?.enabled && !value) return 'Container ID is required when GTM is enabled.'
        if (value && !/^GTM-[A-Z0-9]+$/.test(value))
          return 'Container ID must match the format GTM-XXXXXXX.'
        return true
      },
    },
    {
      name: 'dataLayerName',
      type: 'text',
      label: 'dataLayer Variable Name',
      defaultValue: 'dataLayer',
      admin: {
        description:
          'Name of the dataLayer variable. Leave as "dataLayer" unless you have a specific reason to change it.',
        condition: (data) => Boolean(data?.enabled),
      },
    },

    // ─── Tracking Events ───────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Tracked Events',
      admin: {
        condition: (data) => Boolean(data?.enabled),
        initCollapsed: false,
        description: 'Choose which user interactions are automatically pushed to the dataLayer.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'trackPageViews',
              type: 'checkbox',
              label: 'Page Views',
              defaultValue: true,
              admin: {
                description: 'Push a page_view event on every route change.',
                width: '50%',
              },
            },
            {
              name: 'trackClicks',
              type: 'checkbox',
              label: 'Click Events',
              defaultValue: true,
              admin: {
                description:
                  'Track outbound links, mailto:, tel: and elements with data-gtm-click="*".',
                width: '50%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'trackScrollDepth',
              type: 'checkbox',
              label: 'Scroll Depth',
              defaultValue: false,
              admin: {
                description: 'Fire events at 25%, 50%, 75% and 100% page scroll.',
                width: '50%',
              },
            },
            {
              name: 'trackForms',
              type: 'checkbox',
              label: 'Form Submissions',
              defaultValue: true,
              admin: {
                description: 'Track all <form> submit events on the page.',
                width: '50%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'trackSearches',
              type: 'checkbox',
              label: 'Searches',
              defaultValue: false,
              admin: {
                description: 'Track search queries (?q= param changes and search form submits).',
                width: '50%',
              },
            },
            {
              name: 'trackDownloads',
              type: 'checkbox',
              label: 'File Downloads',
              defaultValue: false,
              admin: {
                description: 'Track clicks on links to .pdf, .zip, .doc, .xls and similar files.',
                width: '50%',
              },
            },
          ],
        },
      ],
    },

    // ─── Google Consent Mode v2 ────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Google Consent Mode v2',
      admin: {
        condition: (data) => Boolean(data?.enabled),
        initCollapsed: true,
        description:
          'Configure default consent states injected before GTM loads. Update these values via your CMP (e.g. Cookiebot, iubenda) at runtime.',
      },
      fields: [
        {
          name: 'enableConsentMode',
          type: 'checkbox',
          label: 'Enable Consent Mode v2',
          defaultValue: false,
          admin: {
            description:
              'Inject the gtag consent default initialization block before the GTM snippet.',
          },
        },
        {
          name: 'adStorage',
          type: 'select',
          label: 'ad_storage',
          defaultValue: 'denied',
          options: consentOptions,
          admin: {
            condition: (data) => Boolean(data?.enableConsentMode),
            description: 'Enables storage (e.g. cookies) related to advertising.',
          },
        },
        {
          name: 'analyticsStorage',
          type: 'select',
          label: 'analytics_storage',
          defaultValue: 'denied',
          options: consentOptions,
          admin: {
            condition: (data) => Boolean(data?.enableConsentMode),
            description: 'Enables storage (e.g. cookies) related to analytics.',
          },
        },
        {
          name: 'functionalityStorage',
          type: 'select',
          label: 'functionality_storage',
          defaultValue: 'denied',
          options: consentOptions,
          admin: {
            condition: (data) => Boolean(data?.enableConsentMode),
            description: 'Enables storage that supports the functionality of the website or app.',
          },
        },
        {
          name: 'personalizationStorage',
          type: 'select',
          label: 'personalization_storage',
          defaultValue: 'denied',
          options: consentOptions,
          admin: {
            condition: (data) => Boolean(data?.enableConsentMode),
            description: 'Enables storage related to personalization.',
          },
        },
        {
          name: 'adUserData',
          type: 'select',
          label: 'ad_user_data',
          defaultValue: 'denied',
          options: consentOptions,
          admin: {
            condition: (data) => Boolean(data?.enableConsentMode),
            description: 'Sets consent for sending user data to Google for advertising purposes.',
          },
        },
        {
          name: 'adPersonalization',
          type: 'select',
          label: 'ad_personalization',
          defaultValue: 'denied',
          options: consentOptions,
          admin: {
            condition: (data) => Boolean(data?.enableConsentMode),
            description: 'Sets consent for personalized advertising.',
          },
        },
        {
          name: 'waitForUpdate',
          type: 'number',
          label: 'Wait for Update (ms)',
          defaultValue: 500,
          admin: {
            condition: (data) => Boolean(data?.enableConsentMode),
            description:
              'Milliseconds GTM waits for your CMP to update consent before firing tags. Recommended: 500.',
          },
        },
      ],
    },

    // ─── GTM Environments ──────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'GTM Environments',
      admin: {
        condition: (data) => Boolean(data?.enabled),
        initCollapsed: true,
        description:
          'Use a specific GTM environment (e.g. staging). Leave disabled to use the default Live environment.',
      },
      fields: [
        {
          name: 'useEnvironment',
          type: 'checkbox',
          label: 'Use a custom GTM Environment',
          defaultValue: false,
        },
        {
          name: 'gtmAuth',
          type: 'text',
          label: 'gtm_auth',
          admin: {
            condition: (data) => Boolean(data?.useEnvironment),
            description: 'Environment authentication string from GTM.',
          },
        },
        {
          name: 'gtmPreview',
          type: 'text',
          label: 'gtm_preview',
          admin: {
            condition: (data) => Boolean(data?.useEnvironment),
            description: 'Environment preview ID from GTM (e.g. env-4).',
          },
        },
      ],
    },

    // ─── Debug ─────────────────────────────────────────────────────────────
    {
      name: 'debugMode',
      type: 'checkbox',
      label: 'Debug Mode',
      defaultValue: false,
      admin: {
        condition: (data) => Boolean(data?.enabled),
        description:
          'Log all dataLayer pushes to the browser console. Also appends gtm_debug=x to the GTM URL to open the Tag Assistant.',
      },
    },
  ],
}
