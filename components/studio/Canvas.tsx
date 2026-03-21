'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
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

  // Render whenever anything changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width  = width
    canvas.height = height

    // 1. Draw base tool
    draw(ctx, width, height, tool, params)

    // 2. Apply layers in order
    for (const layer of layers) {
      if (!layer.enabled) continue
      const op = layer.opacity / 100
      if (layer.type === 'grain')    applyGrain(ctx, width, height, op * 0.5, Date.now())
      if (layer.type === 'vignette') applyVignette(ctx, width, height, op * 100)
      if (layer.type === 'blur') {
        ctx.filter = `blur(${layer.params.amount}px)`
        ctx.drawImage(canvas, 0, 0)
        ctx.filter = 'none'
      }
      if (layer.type === 'scanlines') {
        const spacing = (layer.params.spacing as number) || 4
        ctx.fillStyle = `rgba(0,0,0,${op * 0.4})`
        for (let y = 0; y < height; y += spacing) {
          ctx.fillRect(0, y, width, 1)
        }
      }
    }

    // Update zoom label
    if (canvasRef.current && wrapRef.current) {
      const displayW = canvasRef.current.getBoundingClientRect().width
      const pct = Math.round((displayW / width) * 100)
      setZoom(`${pct}%`)
    }
  }, [tool, params, layers, width, height])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Canvas bar */}
      <div style={{
        height: 36, display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 12px', background: 'var(--s1)',
        borderBottom: '1px solid var(--b1)', flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--t1)' }} id="canvas-name" />
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t3)' }}>
          {zoom}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t3)' }}>
          {width}×{height}
        </span>
      </div>

      {/* Canvas wrapper */}
      <div
        ref={wrapRef}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: mobile ? 8 : 16,
          overflow: 'hidden',
          background: 'var(--canvas-bg)',
          ...(mobile ? { height: '42vw', minHeight: 160, maxHeight: 300 } : {}),
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            borderRadius: 4,
            maxWidth: '100%',
            maxHeight: '100%',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.85)',
          }}
        />
      </div>
    </div>
  )
}
