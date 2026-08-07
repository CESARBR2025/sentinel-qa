'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface Tab {
  id: string
  label: string
  count?: number
}

const DEFAULT_ACCENT = '#1f355a'

export function SegmentControl({ tabs, activeTab, paramName = 'tab' }: { tabs: Tab[]; activeTab: string; paramName?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const onTabChange = useCallback(
    (tabId: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (tabId === tabs[0]?.id) {
        params.delete(paramName)
      } else {
        params.set(paramName, tabId)
      }
      // Al cambiar de pestaña se regresa a la página 1 (evita páginas vacías).
      params.delete('page')
      const qs = params.toString()
      router.push(qs ? `?${qs}` : window.location.pathname)
    },
    [router, searchParams, tabs, paramName],
  )

  return (
    <div
      className="scrollbar-hide"
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        gap: 6,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            style={{
              cursor: 'pointer',
              fontFamily: 'var(--apple-font-display)',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '0.01em',
              textTransform: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              padding: '9px clamp(14px, 4vw, 20px)',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: isActive ? DEFAULT_ACCENT : '#f1f5f9',
              color: isActive ? '#ffffff' : '#64748b',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                style={{
                  fontFamily: 'var(--apple-font-display)',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '0 7px',
                  borderRadius: 'var(--radius-full)',
                  lineHeight: '18px',
                  background: isActive ? 'rgba(255,255,255,.22)' : '#e2e8f0',
                  color: isActive ? '#ffffff' : '#64748b',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
