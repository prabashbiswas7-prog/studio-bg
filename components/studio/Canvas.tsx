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

// Low quality preview scale — renders at fraction of full size for speed
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

    // Render at low quality for preview speed
    const pw = Math.round(width * PREVIEW_SCALE)
    const ph = Math.round(height * PREVIEW_SCALE)
    canvas.width  = pw
    canvas.height = ph

    draw(ctx, pw, ph, tool, params)

    for (const layer of layers) {
      if (!layer.enabled) continue
      const op = layer.opacity / 100
      if (layer.type === 'grain')    applyGrain(ctx, pw, ph, op * 0.5, Date.now())
      if (layer.type === 'vignette') applyVignette(ctx, pw, ph, op * 100)
      if (layer.type === 'blur') {
        ctx.filter = `blur(${Math.max(1, Math.round(((layer.params.amount as number) || 4) * PREVIEW_SCALE))}px)`
        ctx.drawImage(canvas, 0, 0)
        ctx.filter = 'none'
      }
      if (layer.type === 'scanlines') {
        const spacing = Math.max(1, Math.round(((layer.params.spacing as number) || 4) * PREVIEW_SCALE))
        ctx.fillStyle = `rgba(0,0,0,${op * 0.4})`
        for (let y = 0; y < ph; y += spacing) ctx.fillRect(0, y, pw, 1)
      }
    }

    // Update zoom label based on display size vs full output size
    if (canvasRef.current && wrapRef.current) {
      const displayW = canvasRef.current.getBoundingClientRect().width
      const pct = Math.round((displayW / width) * 100)
      setZoom(`${pct}%`)
    }
  }, [tool, params, layers, width, height])

  // Debounce: 60ms desktop, 120ms mobile
  useEffect(() => {
    if (renderTimer.current) clearTimeout(renderTimer.current)
    renderTimer.current = setTimeout(renderCanvas, mobile ? 120 : 60)
    return () => { if (renderTimer.current) clearTimeout(renderTimer.current) }
  }, [renderCanvas, mobile])

  // Disable right click on canvas
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    return false
  }, [])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Info bar */}
      <div style={{ height: 34, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', background: 'var(--s1)', borderBottom: '1px solid var(--b1)', flexShrink: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--t1)', flex: 1 }}>
          {tool.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t3)' }}>{width}×{height}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t3)' }}>{zoom}</span>
        <span style={{ fontSize: 9, color: 'var(--t3)', fontFamily: 'var(--font-mono)', background: 'var(--s3)', padding: '2px 6px', borderRadius: 4 }}>PREVIEW</span>
      </div>

      {/* Canvas wrapper with padding */}
      <div
        ref={wrapRef}
        style={{
          flex: mobile ? 'none' : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: mobile ? 8 : 24,  // padding around canvas
          overflow: 'hidden',
          background: 'var(--canvas-bg)',
          ...(mobile ? { height: '44vw', minHeight: 150, maxHeight: 300 } : {}),
        }}
      >
        <canvas
          ref={canvasRef}
          onContextMenu={handleContextMenu}
          style={{
            display: 'block',
            borderRadius: 6,
            maxWidth: '100%',
            maxHeight: '100%',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.8)',
            imageRendering: 'auto',
          }}
        />
      </div>
    </div>
  )
}

// Exported full-quality render for download
export function renderFullQuality(
  tool: ToolSlug,
  params: Params,
  layers: Layer[],
  width: number,
  height: number
): HTMLCanvasElement {
  const off = document.createElement('canvas')
  off.width = width
  off.height = height
  const ctx = off.getContext('2d')!

  draw(ctx, width, height, tool, params)

  for (const layer of layers) {
    if (!layer.enabled) continue
    const op = layer.opacity / 100
    if (layer.type === 'grain')    applyGrain(ctx, width, height, op * 0.5, Date.now())
    if (layer.type === 'vignette') applyVignette(ctx, width, height, op * 100)
    if (layer.type === 'blur') {
      ctx.filter = `blur(${(layer.params.amount as number) || 4}px)`
      ctx.drawImage(off, 0, 0)
      ctx.filter = 'none'
    }
    if (layer.type === 'scanlines') {
      const spacing = (layer.params.spacing as number) || 4
      ctx.fillStyle = `rgba(0,0,0,${op * 0.4})`
      for (let y = 0; y < height; y += spacing) ctx.fillRect(0, y, width, 1)
    }
  }

  return off
}
