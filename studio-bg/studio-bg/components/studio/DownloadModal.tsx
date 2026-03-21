'use client'

import { useRef, useState } from 'react'
import type { ToolSlug, Layer, Params } from '@/lib/types'
import { draw } from '@/lib/draw'
import { applyGrain, applyVignette } from '@/lib/utils'

interface Props {
  tool: ToolSlug
  params: Params
  layers: Layer[]
  canvasW: number
  canvasH: number
  quality: number
  initialFormat: string
  onClose: () => void
}

export default function DownloadModal({ tool, params, layers, canvasW, canvasH, quality, initialFormat, onClose }: Props) {
  const [fmt, setFmt] = useState(initialFormat)
  const [downloading, setDownloading] = useState(false)

  function doDownload(format: string) {
    setDownloading(true)
    const mime = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png'
    const ext  = format === 'jpeg' ? 'jpg' : format

    const off = document.createElement('canvas')
    off.width = canvasW; off.height = canvasH
    const ctx = off.getContext('2d')!

    draw(ctx, canvasW, canvasH, tool, params)

    for (const layer of layers) {
      if (!layer.enabled) continue
      const op = layer.opacity / 100
      if (layer.type === 'grain')    applyGrain(ctx, canvasW, canvasH, op * 0.5, Date.now())
      if (layer.type === 'vignette') applyVignette(ctx, canvasW, canvasH, op * 100)
    }

    off.toBlob(blob => {
      if (!blob) { setDownloading(false); return }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `studio-bg-${tool}-${canvasW}x${canvasH}.${ext}`
      document.body.appendChild(a); a.click()
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url) }, 1000)
      setDownloading(false)
      onClose()
    }, mime, quality / 100)
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div style={{
        background: 'var(--s1)', borderRadius: 16, width: '100%', maxWidth: 420,
        border: '1px solid var(--b2)', overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        animation: 'popIn 0.2s cubic-bezier(0.32,0.72,0,1)',
      }}>
        <style>{`@keyframes popIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--b1)' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>Download</span>
          <button onClick={onClose} style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: 'var(--s3)', color: 'var(--t2)', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* AD PLACEMENT — replace this div with your actual ad tag */}
        <div id="dl-ad" style={{ margin: '14px 16px', borderRadius: 10, border: '1px dashed var(--b2)', background: 'var(--s2)', minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
          {/* Your ad code goes here */}
        </div>
        {/* END AD */}

        {/* Format picker */}
        <div style={{ padding: '0 16px 12px', display: 'flex', gap: 6 }}>
          {['png','jpeg','webp'].map(f => (
            <button
              key={f}
              onClick={() => setFmt(f)}
              style={{
                flex: 1, padding: '7px', borderRadius: 7, border: '1px solid',
                borderColor: fmt === f ? 'var(--acc)' : 'var(--b2)',
                background: fmt === f ? 'var(--accs)' : 'var(--s3)',
                color: fmt === f ? 'var(--acc)' : 'var(--t2)',
                fontSize: 11, fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Size info */}
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
            {canvasW} × {canvasH} px
          </div>
        </div>

        {/* Download button */}
        <div style={{ padding: '0 16px 16px' }}>
          <button
            onClick={() => doDownload(fmt)}
            disabled={downloading}
            style={{
              width: '100%', padding: '12px', borderRadius: 8, border: 'none',
              background: downloading ? 'var(--s4)' : 'var(--acc)',
              color: '#fff', fontSize: 13, fontWeight: 600, cursor: downloading ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'var(--font-sans)',
            }}
          >
            {downloading ? 'Preparing…' : `↓ Download ${fmt.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  )
}
