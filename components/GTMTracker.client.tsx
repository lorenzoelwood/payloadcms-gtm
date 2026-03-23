'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { pushEvent } from '../utilities/dataLayer'
import type { GTMTrackerProps } from '../types'

// File extensions that count as downloads
const DOWNLOAD_EXTENSIONS = /\.(pdf|zip|docx?|xlsx?|pptx?|csv|txt|rar|7z|tar|gz|mp3|mp4|avi|mov)$/i

/**
 * Client component responsible for all runtime dataLayer pushes.
 * Receives serialized settings from the GTMTracker server wrapper.
 *
 * Events tracked:
 *  - page_view          on every route change (pathname/searchParams)
 *  - click              outbound links, mailto:, tel:, [data-gtm-click] elements
 *  - file_download      links to downloadable file extensions
 *  - scroll_depth       25%, 50%, 75%, 100% milestones (IntersectionObserver)
 *  - form_submit        all <form> submit events
 *  - search             ?q= or ?s= param changes + search form submits
 */
export function GTMTrackerClient({
  containerId,
  dataLayerName = 'dataLayer',
  trackPageViews = true,
  trackClicks = true,
  trackScrollDepth = false,
  trackForms = true,
  trackSearches = false,
  trackDownloads = false,
  debugMode = false,
}: GTMTrackerProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Push helper bound to this instance's settings
  const layerName = dataLayerName ?? 'dataLayer'
  const push = (eventName: string, params: Record<string, unknown> = {}) =>
    pushEvent(eventName, params, layerName, debugMode ?? false)

  // ─── Page Views ──────────────────────────────────────────────────────────
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (!trackPageViews) return

    // Skip the very first mount because GTM itself fires the initial pageview
    // via the gtm.js container load event.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    push('page_view', {
      page_path: pathname,
      page_search: searchParams.toString() ? `?${searchParams.toString()}` : '',
      page_url: window.location.href,
      page_title: document.title,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams])

  // ─── Clicks ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!trackClicks && !trackDownloads) return

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest('a, [data-gtm-click]')
      if (!target) return

      const href = (target as HTMLAnchorElement).href || ''
      const tag = target.tagName.toLowerCase()
      const gtmLabel = target.getAttribute('data-gtm-click')

      // Custom labeled element
      if (gtmLabel) {
        push('click', {
          click_type: 'custom',
          click_label: gtmLabel,
          click_text: target.textContent?.trim() ?? '',
          click_url: href || undefined,
        })
        return
      }

      if (tag !== 'a') return

      // File download
      if (trackDownloads && DOWNLOAD_EXTENSIONS.test(href)) {
        const filename = href.split('/').pop() ?? href
        push('file_download', {
          file_name: filename,
          file_extension: filename.split('.').pop()?.toLowerCase(),
          link_url: href,
          link_text: target.textContent?.trim() ?? '',
        })
        return
      }

      if (!trackClicks) return

      // mailto:
      if (href.startsWith('mailto:')) {
        push('click', {
          click_type: 'mailto',
          click_url: href,
          click_text: target.textContent?.trim() ?? '',
        })
        return
      }

      // tel:
      if (href.startsWith('tel:')) {
        push('click', {
          click_type: 'phone',
          click_url: href,
          click_text: target.textContent?.trim() ?? '',
        })
        return
      }

      // Outbound link (cross-origin)
      try {
        const linkOrigin = new URL(href).origin
        if (linkOrigin !== window.location.origin) {
          push('click', {
            click_type: 'outbound',
            click_url: href,
            click_text: target.textContent?.trim() ?? '',
            click_domain: new URL(href).hostname,
          })
        }
      } catch {
        // Relative URL or invalid href — ignore
      }
    }

    document.addEventListener('click', handleClick, { capture: true })
    return () => document.removeEventListener('click', handleClick, { capture: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackClicks, trackDownloads, dataLayerName, debugMode])

  // ─── Scroll Depth ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!trackScrollDepth) return

    const milestones = [25, 50, 75, 100]
    const reached = new Set<number>()

    const checkScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
      const viewportHeight = window.innerHeight
      const scrollPercent = Math.round(((scrollTop + viewportHeight) / docHeight) * 100)

      for (const milestone of milestones) {
        if (scrollPercent >= milestone && !reached.has(milestone)) {
          reached.add(milestone)
          push('scroll_depth', {
            scroll_depth: milestone,
            page_path: pathname,
          })
        }
      }
    }

    // Reset per route change
    reached.clear()

    window.addEventListener('scroll', checkScroll, { passive: true })
    // Check once on mount (user may have scrolled already via browser history)
    checkScroll()

    return () => window.removeEventListener('scroll', checkScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, trackScrollDepth, dataLayerName, debugMode])

  // ─── Form Submissions ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!trackForms) return

    const handleSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement
      const formId = form.id || form.getAttribute('name') || form.action || 'unknown'
      const formAction = form.action || pathname

      push('form_submit', {
        form_id: formId,
        form_action: formAction,
        form_destination: formAction,
        page_path: pathname,
      })
    }

    document.addEventListener('submit', handleSubmit)
    return () => document.removeEventListener('submit', handleSubmit)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackForms, pathname, dataLayerName, debugMode])

  // ─── Searches ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!trackSearches) return

    // Detect ?q= or ?s= query params (common search param names)
    const query = searchParams.get('q') || searchParams.get('s') || searchParams.get('search')
    if (query) {
      push('search', {
        search_term: query,
        page_path: pathname,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, trackSearches, dataLayerName, debugMode])

  // This component renders nothing visible
  return null
}
