'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import type { ToolSlug, Layer, Params } from '@/lib/types'
import { draw } from '@/lib/draw'
import { applyGrain, applyVignette } from '@/lib/utils'

interface Props {
  tool: ToolSlug
  params: Params
  layers: Layer[]
  width: number
  height: number
  mobile?: boolean
}

export default function Canvas({ tool, params, layers, width, height, mobile }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState('')
  const renderTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width  = width
    canvas.height = height

    draw(ctx, width, height, tool, params)

    for (const layer of layers) {
      if (!layer.enabled) continue
      const op = layer.opacity / 100
      if (layer.type === 'grain')    applyGrain(ctx, width, height, op * 0.5, Date.now())
      if (layer.type === 'vignette') applyVignette(ctx, width, height, op * 100)
      if (layer.type === 'blur') {
        ctx.filter = `blur(${(layer.params.amount as number) || 4}px)`
        ctx.drawImage(canvas, 0, 0)
        ctx.filter = 'none'
      }
      if (layer.type === 'scanlines') {
        const spacing = (layer.params.spacing as number) || 4
        ctx.fillStyle = `rgba(0,0,0,${op * 0.4})`
        for (let y = 0; y < height; y += spacing) ctx.fillRect(0, y, width, 1)
      }
    }

    if (canvasRef.current && wrapRef.current) {
      const displayW = canvasRef.current.getBoundingClientRect().width
      const pct = Math.round((displayW / width) * 100)
      setZoom(`${pct}%`)
    }
  }, [tool, params, layers, width, height])

  // Debounce rendering — 80ms on desktop, 150ms on mobile
  useEffect(() => {
    if (renderTimer.current) clearTimeout(renderTimer.current)
    renderTimer.current = setTimeout(renderCanvas, mobile ? 150 : 80)
    return () => { if (renderTimer.current) clearTimeout(renderTimer.current) }
  }, [renderCanvas, mobile])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Canvas info bar */}
      <div style={{ height: 34, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', background: 'var(--s1)', borderBottom: '1px solid var(--b1)', flexShrink: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--t1)', flex: 1 }}>{tool.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t3)' }}>{width}×{height}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t3)' }}>{zoom}</span>
      </div>

      {/* Canvas */}
      <div
        ref={wrapRef}
        style={{
          flex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: mobile ? 8 : 16,
          overflow: 'hidden',
          background: 'var(--canvas-bg)',
          ...(mobile ? { height: '42vw', minHeight: 150, maxHeight: 280, flex: 'none' } : {}),
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: 'block', borderRadius: 4,
            maxWidth: '100%', maxHeight: '100%',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 16px 48px rgba(0,0,0,0.7)',
          }}
        />
      </div>
    </div>
  )
}
