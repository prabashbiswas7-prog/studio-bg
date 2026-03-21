'use client'

import { useEffect, useRef } from 'react'
import type { ToolSlug } from '@/lib/types'
import { TOOL_CATEGORIES, getToolsByCategory } from '@/lib/tools'
import { draw } from '@/lib/draw'
import { getDefaultParams } from '@/lib/defaults'

interface Props {
  activeTool: ToolSlug
  onPick: (slug: ToolSlug) => void
  mobile?: boolean
}

export default function ToolPicker({ activeTool, onPick, mobile }: Props) {
  const thumbsDrawn = useRef(false)

  // Draw thumbnails after mount
  useEffect(() => {
    if (thumbsDrawn.current) return
    thumbsDrawn.current = true
    setTimeout(() => {
      document.querySelectorAll<HTMLCanvasElement>('.tool-thumb').forEach(cv => {
        const slug = cv.dataset.slug as ToolSlug
        if (!slug) return
        cv.width = 36; cv.height = 36
        const off = document.createElement('canvas')
        off.width = 180; off.height = 180
        try { draw(off.getContext('2d')!, 180, 180, slug, getDefaultParams(slug)) } catch {}
        cv.getContext('2d')!.drawImage(off, 0, 0, 36, 36)
      })
    }, 80)
  }, [])

  if (mobile) {
    // Mobile: stacked list
    return (
      <div>
        {TOOL_CATEGORIES.map(cat => {
          const tools = getToolsByCategory(cat)
          if (!tools.length) return null
          return (
            <div key={cat}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--t3)', padding: '12px 14px 5px' }}>
                {cat}
              </div>
              {tools.map(tool => (
                <div
                  key={tool.slug}
                  onClick={() => onPick(tool.slug)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', cursor: 'pointer',
                    background: activeTool === tool.slug ? 'var(--accs)' : 'transparent',
                    borderLeft: `3px solid ${activeTool === tool.slug ? 'var(--acc)' : 'transparent'}`,
                  }}
                >
                  <canvas className="tool-thumb" data-slug={tool.slug} style={{ width: 36, height: 36, borderRadius: 6, border: '1px solid var(--b1)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: activeTool === tool.slug ? 'var(--acc)' : 'var(--t1)' }}>
                      {tool.name}
                      {tool.isNew && <span style={{ marginLeft: 5, fontSize: 9, background: 'var(--accs)', color: 'var(--acc)', padding: '1px 5px', borderRadius: 3, fontWeight: 600 }}>NEW</span>}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>{tool.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    )
  }

  // Desktop: fixed left panel
  return (
    <div style={{
      width: 216, borderRight: '1px solid var(--b1)', background: 'var(--s1)',
      overflowY: 'auto', flexShrink: 0,
    }}>
      {TOOL_CATEGORIES.map(cat => {
        const tools = getToolsByCategory(cat)
        if (!tools.length) return null
        return (
          <div key={cat}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--t3)', padding: '14px 12px 5px' }}>
              {cat}
            </div>
            {tools.map(tool => (
              <div
                key={tool.slug}
                onClick={() => onPick(tool.slug)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '6px 8px', margin: '1px 5px', borderRadius: 10, cursor: 'pointer',
                  background: activeTool === tool.slug ? 'var(--accs)' : 'transparent',
                  border: `1.5px solid ${activeTool === tool.slug ? 'var(--acc)' : 'transparent'}`,
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (activeTool !== tool.slug) (e.currentTarget as HTMLElement).style.background = 'var(--s3)' }}
                onMouseLeave={e => { if (activeTool !== tool.slug) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <canvas
                  className="tool-thumb"
                  data-slug={tool.slug}
                  style={{ width: 36, height: 36, borderRadius: 7, flexShrink: 0, border: '1px solid var(--b1)' }}
                />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: activeTool === tool.slug ? 'var(--acc)' : 'var(--t1)', lineHeight: 1.25 }}>
                    {tool.name}
                    {tool.isNew && <span style={{ marginLeft: 5, fontSize: 9, background: 'var(--accs)', color: 'var(--acc)', padding: '1px 4px', borderRadius: 3, fontWeight: 600 }}>NEW</span>}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 1 }}>{tool.description}</div>
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
