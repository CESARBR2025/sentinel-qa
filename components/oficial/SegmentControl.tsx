'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface Tab {
  id: string
  label: string
  count?: number
}

export function SegmentControl({ tabs, activeTab }: { tabs: Tab[]; activeTab: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const onTabChange = useCallback(
    (tabId: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (tabId === tabs[0]?.id) {
        params.delete('tab')
      } else {
        params.set('tab', tabId)
      }
      const qs = params.toString()
      router.push(qs ? `?${qs}` : window.location.pathname)
    },
    [router, searchParams, tabs],
  )

  return (
    <div
      style={{
        display: 'inline-flex',
        background: '#f1f5f9',
        borderRadius: 4,
        padding: 3,
        gap: 2,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '8px 16px',
              borderRadius: 3,
              background: isActive ? '#ffffff' : 'transparent',
              color: isActive ? '#1f355a' : '#64748b',
              boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
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
                  background: isActive ? '#1f355a' : '#e2e8f0',
                  color: isActive ? '#ffffff' : '#64748b',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 7px',
                  borderRadius: 10,
                  lineHeight: '16px',
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
