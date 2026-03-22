'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ToolSlug, Layer, Params, HistoryEntry } from '@/lib/types'
import { getDefaultParams } from '@/lib/defaults'
import { getTool } from '@/lib/tools'
import { generateRandomPalette } from '@/lib/palettes'
import Canvas from './Canvas'
import ToolPicker from './ToolPicker'
import Controls from './Controls'
import LayerPanel from './LayerPanel'
import DownloadModal from './DownloadModal'
import InterstitialAd from './InterstitialAd'
import Header from '../layout/Header'
import AdSlot from '../layout/AdSlot'

const DEFAULT_LAYERS: Layer[] = [
  { id: 'grain',     type: 'grain',     label: 'Grain',     enabled: false, opacity: 30,  params: { intensity: 0.3 } },
  { id: 'vignette',  type: 'vignette',  label: 'Vignette',  enabled: false, opacity: 50,  params: {} },
  { id: 'blur',      type: 'blur',      label: 'Blur',      enabled: false, opacity: 100, params: { amount: 4 } },
  { id: 'scanlines', type: 'scanlines', label: 'Scanlines', enabled: false, opacity: 20,  params: { spacing: 4 } },
]

type MobileTab = 'tools' | 'controls' | 'export'

export default function Studio({ initialTool }: { initialTool: ToolSlug }) {
  const router = useRouter()

  const [tool, setTool]       = useState<ToolSlug>(initialTool)
  const [params, setParams]   = useState<Params>(() => getDefaultParams(initialTool))
  const [layers, setLayers]   = useState<Layer[]>(DEFAULT_LAYERS)
  const [canvasW, setCanvasW] = useState(1920)
  const [canvasH, setCanvasH] = useState(1080)
  const [isDark, setIsDark]   = useState(true)
  const [quality, setQuality] = useState(95)
  const [downloadCount, setDownloadCount] = useState(0)
  const [showDownload, setShowDownload]   = useState(false)
  const [showInterstitial, setShowInterstitial] = useState(false)
  const [pendingFmt, setPendingFmt] = useState<string>('png')
  const [mobileTab, setMobileTab]   = useState<MobileTab>('controls')

  // Store canvas size in a ref so tool switches don't reset it
  const canvasWRef = useRef(1920)
  const canvasHRef = useRef(1080)

  // History stored as ref so undo/redo always sees latest
  const histRef = useRef<HistoryEntry[]>([])
  const histIdx = useRef(-1)
  const uploadImgRef = useRef<HTMLImageElement | null>(null)

  // Push to history (called after any meaningful change)
  const histPush = useCallback((t: ToolSlug, p: Params, l: Layer[]) => {
    const entry: HistoryEntry = { tool: t, params: JSON.parse(JSON.stringify(p)), layers: JSON.parse(JSON.stringify(l)) }
    histRef.current.splice(histIdx.current + 1)
    histRef.current.push(entry)
    if (histRef.current.length > 50) histRef.current.shift()
    histIdx.current = histRef.current.length - 1
  }, [])

  // Push initial state
  useEffect(() => {
    histPush(initialTool, getDefaultParams(initialTool), DEFAULT_LAYERS)
  }, []) // eslint-disable-line

  // Switch tool — canvas size PRESERVED
  const switchTool = useCallback((slug: ToolSlug) => {
    const newParams = getDefaultParams(slug)
    setTool(slug)
    setParams(newParams)
    router.push(`/tool/${slug}`, { scroll: false })
    histPush(slug, newParams, layers)
    setMobileTab('controls')
  }, [layers, router, histPush])

  const updateParam = useCallback((key: string, value: unknown) => {
    setParams(prev => {
      const next = { ...prev, [key]: value }
      return next
    })
  }, [])

  const updateParams = useCallback((updates: Params) => {
    setParams(prev => ({ ...prev, ...updates }))
  }, [])

  // Shuffle
  const shuffleAll = useCallback(() => {
    setParams(prev => {
      const next = { ...prev }
      if ('seed' in next) next.seed = Math.floor(Math.random() * 99999) + 1
      if ('colors' in next && Array.isArray(next.colors)) {
        next.colors = generateRandomPalette((next.colors as string[]).length)
      }
      if ('angle' in next) next.angle = Math.round(Math.random() * 360)
      if ('cx' in next) { next.cx = Math.round(15 + Math.random() * 70); next.cy = Math.round(15 + Math.random() * 70) }
      if ('freq' in next) next.freq = +(0.5 + Math.random() * 6).toFixed(1)
      if ('scale' in next && (next.scale as number) < 15) next.scale = +(0.5 + Math.random() * 5).toFixed(1)
      return next
    })
  }, [])

  // Undo
  const undo = useCallback(() => {
    if (histIdx.current <= 0) return
    histIdx.current--
    const entry = histRef.current[histIdx.current]
    if (!entry) return
    setTool(entry.tool)
    setParams(JSON.parse(JSON.stringify(entry.params)))
    setLayers(JSON.parse(JSON.stringify(entry.layers)))
    router.push(`/tool/${entry.tool}`, { scroll: false })
  }, [router])

  // Redo
  const redo = useCallback(() => {
    if (histIdx.current >= histRef.current.length - 1) return
    histIdx.current++
    const entry = histRef.current[histIdx.current]
    if (!entry) return
    setTool(entry.tool)
    setParams(JSON.parse(JSON.stringify(entry.params)))
    setLayers(JSON.parse(JSON.stringify(entry.layers)))
    router.push(`/tool/${entry.tool}`, { scroll: false })
  }, [router])

  // Push to history when params change (debounced)
  const histTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (histTimerRef.current) clearTimeout(histTimerRef.current)
    histTimerRef.current = setTimeout(() => {
      histPush(tool, params, layers)
    }, 600)
    return () => { if (histTimerRef.current) clearTimeout(histTimerRef.current) }
  }, [params]) // eslint-disable-line

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const cm = e.ctrlKey || e.metaKey
      if (cm && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if (cm && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo() }
      if (cm && e.key === 's') { e.preventDefault(); handleDownloadClick('png') }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo]) // eslint-disable-line

  // Canvas size handlers — save to ref too
  const handleCanvasW = useCallback((w: number) => { setCanvasW(w); canvasWRef.current = w }, [])
  const handleCanvasH = useCallback((h: number) => { setCanvasH(h); canvasHRef.current = h }, [])

  // Download
  const handleDownloadClick = useCallback((fmt: string) => {
    setPendingFmt(fmt)
    const nextCount = downloadCount + 1
    setDownloadCount(nextCount)
    if (nextCount % 3 === 0) setShowInterstitial(true)
    else setShowDownload(true)
  }, [downloadCount])

  // Theme
  const toggleTheme = useCallback(() => {
    setIsDark(d => {
      const next = !d
      document.documentElement.classList.toggle('light', next === false)
      return next
    })
  }, [])

  // Copy to clipboard
  const copyToClipboard = useCallback(async () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement
    if (!canvas) return
    canvas.toBlob(async blob => {
      if (!blob) return
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        alert('Copied to clipboard!')
      } catch { alert('Copy not supported in this browser') }
    })
  }, [])

  const currentTool = getTool(tool)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg)', color: 'var(--t1)' }}>

      {/* Header */}
      <Header
        tool={currentTool}
        canvasW={canvasW}
        canvasH={canvasH}
        onCanvasWChange={handleCanvasW}
        onCanvasHChange={handleCanvasH}
        onShuffle={shuffleAll}
        onUndo={undo}
        onRedo={redo}
        onDownload={handleDownloadClick}
        onCopy={copyToClipboard}
        onToggleTheme={toggleTheme}
        isDark={isDark}
      />

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 overflow-hidden">

        {/* Left: Tool Picker */}
        <ToolPicker activeTool={tool} onPick={switchTool} />

        {/* Center: Canvas */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Canvas
            tool={tool}
            params={{ ...params, _uploadImg: uploadImgRef.current }}
            layers={layers}
            width={canvasW}
            height={canvasH}
          />
          <AdSlot placement="banner" style={{ flexShrink: 0 }} />
        </div>

        {/* Right: Controls */}
        <div style={{ width: 268, borderLeft: '1px solid var(--b1)', background: 'var(--s1)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Controls
            tool={tool}
            params={params}
            onUpdateParam={updateParam}
            onUpdateParams={updateParams}
            onShuffle={shuffleAll}
            uploadImgRef={uploadImgRef}
          />
          <LayerPanel layers={layers} onChange={setLayers} />
          <AdSlot placement="sidebar" />
          <ExportSection
            quality={quality}
            onQualityChange={setQuality}
            canvasW={canvasW}
            canvasH={canvasH}
            onCanvasWChange={handleCanvasW}
            onCanvasHChange={handleCanvasH}
            onDownload={handleDownloadClick}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden flex-1 flex-col overflow-hidden">
        <div style={{ flexShrink: 0 }}>
          <Canvas
            tool={tool}
            params={{ ...params, _uploadImg: uploadImgRef.current }}
            layers={layers}
            width={canvasW}
            height={canvasH}
            mobile
          />
          <AdSlot placement="banner" />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as 'auto' }}>
          {mobileTab === 'tools' && <ToolPicker activeTool={tool} onPick={switchTool} mobile />}
          {mobileTab === 'controls' && (
            <>
              <Controls tool={tool} params={params} onUpdateParam={updateParam} onUpdateParams={updateParams} onShuffle={shuffleAll} uploadImgRef={uploadImgRef} />
              <LayerPanel layers={layers} onChange={setLayers} />
            </>
          )}
          {mobileTab === 'export' && (
            <ExportSection quality={quality} onQualityChange={setQuality} canvasW={canvasW} canvasH={canvasH} onCanvasWChange={handleCanvasW} onCanvasHChange={handleCanvasH} onDownload={handleDownloadClick} />
          )}
        </div>
        <MobileTabBar active={mobileTab} onChange={setMobileTab} />
      </div>

      {/* Modals */}
      {showDownload && (
        <DownloadModal
          tool={tool}
          params={{ ...params, _uploadImg: uploadImgRef.current }}
          layers={layers}
          canvasW={canvasW}
          canvasH={canvasH}
          quality={quality}
          initialFormat={pendingFmt}
          onClose={() => setShowDownload(false)}
        />
      )}
      {showInterstitial && (
        <InterstitialAd
          onContinue={() => { setShowInterstitial(false); setShowDownload(true) }}
          onClose={() => setShowInterstitial(false)}
        />
      )}
    </div>
  )
}

// Export Section
function ExportSection({ quality, onQualityChange, canvasW, canvasH, onCanvasWChange, onCanvasHChange, onDownload }: {
  quality: number; onQualityChange: (q: number) => void
  canvasW: number; canvasH: number
  onCanvasWChange: (w: number) => void; onCanvasHChange: (h: number) => void
  onDownload: (fmt: string) => void
}) {
  const PRESETS = [
    { label: 'HD',       w: 1920, h: 1080 },
    { label: '4K',       w: 3840, h: 2160 },
    { label: 'Square',   w: 1080, h: 1080 },
    { label: 'Portrait', w: 1080, h: 1920 },
    { label: 'OG Image', w: 1200, h: 628  },
    { label: 'Twitter',  w: 1500, h: 500  },
    { label: 'YouTube',  w: 2048, h: 1152 },
    { label: 'Instagram',w: 1080, h: 1080 },
  ]
  return (
    <div style={{ padding: 14, borderTop: '1px solid var(--b1)' }}>
      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 12 }}>Export</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <input type="number" value={canvasW} onChange={e => onCanvasWChange(+e.target.value)} style={{ width: 66, background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t1)', padding: '4px 6px', borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-mono)', textAlign: 'right' }} />
        <span style={{ fontSize: 10, color: 'var(--t3)' }}>×</span>
        <input type="number" value={canvasH} onChange={e => onCanvasHChange(+e.target.value)} style={{ width: 66, background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t1)', padding: '4px 6px', borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-mono)', textAlign: 'right' }} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => { onCanvasWChange(p.w); onCanvasHChange(p.h) }} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t2)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            {p.label}
          </button>
        ))}
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--t2)' }}>Quality</span>
          <span style={{ fontSize: 11, color: 'var(--acc)', fontFamily: 'var(--font-mono)' }}>{quality}%</span>
        </div>
        <input type="range" min={1} max={100} value={quality} onChange={e => onQualityChange(+e.target.value)} />
      </div>
      <button onClick={() => onDownload('png')} style={{ width: '100%', padding: '10px', background: 'var(--acc)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 6, fontFamily: 'var(--font-sans)' }}>
        ↓ Download PNG
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
        {['jpeg', 'webp'].map(fmt => (
          <button key={fmt} onClick={() => onDownload(fmt)} style={{ padding: '8px', background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t1)', borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            ↓ {fmt.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}

// Mobile Tab Bar
function MobileTabBar({ active, onChange }: { active: MobileTab; onChange: (t: MobileTab) => void }) {
  const tabs: { id: MobileTab; label: string; icon: string }[] = [
    { id: 'tools',    label: 'Tools',    icon: '⊞' },
    { id: 'controls', label: 'Controls', icon: '◎' },
    { id: 'export',   label: 'Export',   icon: '↓' },
  ]
  return (
    <div style={{ flexShrink: 0, display: 'flex', height: 56, background: 'var(--s1)', borderTop: '1px solid var(--b1)' }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, border: 'none', background: 'transparent', color: active === tab.id ? 'var(--acc)' : 'var(--t3)', fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', cursor: 'pointer', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', borderTop: active === tab.id ? '2px solid var(--acc)' : '2px solid transparent' }}>
          <span style={{ fontSize: 20 }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  )
}
