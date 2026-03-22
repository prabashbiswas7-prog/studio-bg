'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import type { ToolSlug, Layer, Params } from '@/lib/types'
import { draw } from '@/lib/draw'
import { applyGrain, applyVignette, applyFilters } from '@/lib/utils'

interface Props {
  tool: ToolSlug
  params: Params
  layers: Layer[]
  width: number
  height: number
  mobile?: boolean
}

const PREVIEW_SCALE = 0.25

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

    const pw = Math.max(1, Math.round(width * PREVIEW_SCALE))
    const ph = Math.max(1, Math.round(height * PREVIEW_SCALE))
    canvas.width  = pw
    canvas.height = ph

    draw(ctx, pw, ph, tool, params)

    // Apply global adjustments from params
    const brightness = (params.brightness as number) ?? 100
    const contrast   = (params.contrast   as number) ?? 100
    const saturation = (params.saturation as number) ?? 100
    if (brightness !== 100 || contrast !== 100 || saturation !== 100) {
      applyFilters(ctx, pw, ph, brightness, saturation, contrast)
    }

    // Apply layers
    for (const layer of layers) {
      if (!layer.enabled) continue
      const op = layer.opacity / 100
      if (layer.type === 'grain')    applyGrain(ctx, pw, ph, op * 0.5, Date.now())
      if (layer.type === 'vignette') applyVignette(ctx, pw, ph, op * 100)
      if (layer.type === 'blur') {
        ctx.filter = `blur(${Math.max(1, Math.round(((layer.params.amount as number)||4) * PREVIEW_SCALE))}px)`
        ctx.drawImage(canvas, 0, 0)
        ctx.filter = 'none'
      }
      if (layer.type === 'scanlines') {
        const sp = Math.max(1, Math.round(((layer.params.spacing as number)||4) * PREVIEW_SCALE))
        ctx.fillStyle = `rgba(0,0,0,${op * 0.4})`
        for (let y = 0; y < ph; y += sp) ctx.fillRect(0, y, pw, 1)
      }
    }

    if (wrapRef.current && canvasRef.current) {
      const dw = canvasRef.current.getBoundingClientRect().width
      setZoom(`${Math.round((dw / width) * 100)}%`)
    }
  }, [tool, params, layers, width, height])

  useEffect(() => {
    if (renderTimer.current) clearTimeout(renderTimer.current)
    renderTimer.current = setTimeout(renderCanvas, mobile ? 100 : 50)
    return () => { if (renderTimer.current) clearTimeout(renderTimer.current) }
  }, [renderCanvas, mobile])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ height: 34, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', background: 'var(--s1)', borderBottom: '1px solid var(--b1)', flexShrink: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--t1)', flex: 1, textTransform: 'capitalize' }}>
          {tool.replace(/-/g, ' ')}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t3)' }}>{width}×{height}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t3)' }}>{zoom}</span>
        <span style={{ fontSize: 9, color: 'var(--t4)', background: 'var(--s3)', padding: '2px 5px', borderRadius: 3, fontFamily: 'var(--font-mono)' }}>PREVIEW</span>
      </div>
      <div
        ref={wrapRef}
        style={{
          flex: mobile ? 'none' : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: mobile ? 8 : 24,
          overflow: 'hidden',
          background: 'var(--canvas-bg)',
          ...(mobile ? { height: '44vw', minHeight: 150, maxHeight: 290 } : {}),
        }}
      >
        <canvas
          ref={canvasRef}
          onContextMenu={e => e.preventDefault()}
          style={{
            display: 'block', borderRadius: 6,
            maxWidth: '100%', maxHeight: '100%',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.8)',
          }}
        />
      </div>
    </div>
  )
}

// Full quality render for download
export function renderFullQuality(tool: ToolSlug, params: Params, layers: Layer[], width: number, height: number): HTMLCanvasElement {
  const off = document.createElement('canvas')
  off.width = width; off.height = height
  const ctx = off.getContext('2d')!
  draw(ctx, width, height, tool, params)

  const brightness = (params.brightness as number) ?? 100
  const contrast   = (params.contrast   as number) ?? 100
  const saturation = (params.saturation as number) ?? 100
  if (brightness !== 100 || contrast !== 100 || saturation !== 100) {
    applyFilters(ctx, width, height, brightness, saturation, contrast)
  }

  for (const layer of layers) {
    if (!layer.enabled) continue
    const op = layer.opacity / 100
    if (layer.type === 'grain')    applyGrain(ctx, width, height, op * 0.5, Date.now())
    if (layer.type === 'vignette') applyVignette(ctx, width, height, op * 100)
    if (layer.type === 'blur') {
      ctx.filter = `blur(${(layer.params.amount as number)||4}px)`
      ctx.drawImage(off, 0, 0); ctx.filter = 'none'
    }
    if (layer.type === 'scanlines') {
      const sp = (layer.params.spacing as number)||4
      ctx.fillStyle = `rgba(0,0,0,${op * 0.4})`
      for (let y = 0; y < height; y += sp) ctx.fillRect(0, y, width, 1)
    }
  }
  return off
}
