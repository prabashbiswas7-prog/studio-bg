'use client'

import Link from 'next/link'
import type { Tool } from '@/lib/types'

interface Props {
  tool?: Tool
  canvasW: number
  canvasH: number
  onCanvasWChange: (w: number) => void
  onCanvasHChange: (h: number) => void
  onShuffle: () => void
  onUndo: () => void
  onRedo: () => void
  onDownload: (fmt: string) => void
  onCopy: () => void
  onToggleTheme: () => void
  isDark: boolean
}

export default function Header({ tool, canvasW, canvasH, onCanvasWChange, onCanvasHChange, onShuffle, onUndo, onRedo, onDownload, onCopy, onToggleTheme, isDark }: Props) {
  return (
    <header style={{
      height: 46, flexShrink: 0,
      background: 'var(--s1)', borderBottom: '1px solid var(--b1)',
      display: 'flex', alignItems: 'center', padding: '0 12px', gap: 5,
    }}>

      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', marginRight: 8, flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--t1)' }}>
          Studio<span style={{ color: 'var(--acc)' }}>/</span>bg
        </span>
      </Link>

      {/* Size inputs — desktop only */}
      <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <span style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>W</span>
        <input
          type="number" value={canvasW}
          onChange={e => onCanvasWChange(+e.target.value)}
          style={{ width: 56, background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t1)', padding: '4px 6px', borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-mono)', textAlign: 'right', outline: 'none' }}
        />
        <span style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>×</span>
        <input
          type="number" value={canvasH}
          onChange={e => onCanvasHChange(+e.target.value)}
          style={{ width: 56, background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t1)', padding: '4px 6px', borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-mono)', textAlign: 'right', outline: 'none' }}
        />
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Action buttons — desktop only */}
      <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 4 }}>
        <Btn onClick={onUndo} title="Undo (Ctrl+Z)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>
        </Btn>
        <Btn onClick={onRedo} title="Redo (Ctrl+Y)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13"/></svg>
        </Btn>
        <div style={{ width: 1, height: 18, background: 'var(--b2)', margin: '0 2px' }} />
        <Btn onClick={onShuffle} title="Shuffle all params">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
          Shuffle
        </Btn>
        <Btn onClick={onCopy} title="Copy image to clipboard">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          Copy
        </Btn>
        <div style={{ width: 1, height: 18, background: 'var(--b2)', margin: '0 2px' }} />
      </div>

      {/* Theme toggle — always visible, properly aligned */}
      <button
        onClick={onToggleTheme}
        title="Toggle theme"
        style={{
          width: 30, height: 30, borderRadius: 7,
          border: '1px solid var(--b2)', background: 'transparent',
          color: 'var(--t2)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isDark
          ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
          : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        }
      </button>

      {/* Download button */}
      <button
        onClick={() => onDownload('png')}
        style={{
          height: 30, padding: '0 12px', borderRadius: 7, border: 'none',
          background: 'var(--acc)', color: '#fff', fontSize: 11, fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
          fontFamily: 'var(--font-sans)', flexShrink: 0,
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
        Save PNG
      </button>
    </header>
  )
}

function Btn({ onClick, title, children }: { onClick: () => void; title?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        height: 30, padding: '0 9px',
        borderRadius: 7, border: '1px solid var(--b2)', background: 'transparent',
        color: 'var(--t2)', fontSize: 11, fontWeight: 500, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}
