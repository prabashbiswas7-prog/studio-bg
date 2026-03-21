'use client'

import { useState } from 'react'
import type { Layer } from '@/lib/types'

interface Props {
  layers: Layer[]
  onChange: (layers: Layer[]) => void
}

export default function LayerPanel({ layers, onChange }: Props) {
  const [open, setOpen] = useState(false)

  function toggle(id: string) {
    onChange(layers.map(l => l.id === id ? { ...l, enabled: !l.enabled } : l))
  }

  function setOpacity(id: string, val: number) {
    onChange(layers.map(l => l.id === id ? { ...l, opacity: val } : l))
  }

  function setParam(id: string, key: string, val: unknown) {
    onChange(layers.map(l => l.id === id ? { ...l, params: { ...l.params, [key]: val } } : l))
  }

  return (
    <div style={{ borderTop: '1px solid var(--b1)' }}>
      {/* Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', cursor: 'pointer', userSelect: 'none' }}
      >
        <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--t3)' }}>Overlays</span>
        <span style={{ color: 'var(--t3)', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div style={{ padding: '0 14px 14px' }}>
          {layers.map(layer => (
            <div key={layer.id} style={{ marginBottom: 14 }}>
              {/* Toggle + label */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: layer.enabled ? 8 : 0 }}>
                <span style={{ fontSize: 11, color: 'var(--t2)' }}>{layer.label}</span>
                <div
                  onClick={() => toggle(layer.id)}
                  style={{
                    width: 32, height: 18, borderRadius: 9,
                    background: layer.enabled ? 'var(--acc)' : 'var(--s4)',
                    border: '1px solid var(--b2)', position: 'relative', cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{
                    position: 'absolute', width: 12, height: 12, borderRadius: '50%',
                    background: '#fff', top: 2,
                    left: layer.enabled ? 16 : 2,
                    transition: 'left 0.15s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  }} />
                </div>
              </div>

              {/* Opacity slider when enabled */}
              {layer.enabled && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: 'var(--t3)' }}>Opacity</span>
                    <span style={{ fontSize: 10, color: 'var(--acc)', fontFamily: 'var(--font-mono)' }}>{layer.opacity}%</span>
                  </div>
                  <input
                    type="range" min={0} max={100} value={layer.opacity}
                    onChange={e => setOpacity(layer.id, +e.target.value)}
                    style={{ width: '100%' }}
                  />
                  {/* Extra params per layer type */}
                  {layer.type === 'blur' && (
                    <div style={{ marginTop: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: 'var(--t3)' }}>Amount (px)</span>
                        <span style={{ fontSize: 10, color: 'var(--acc)', fontFamily: 'var(--font-mono)' }}>{layer.params.amount}</span>
                      </div>
                      <input
                        type="range" min={1} max={40} value={layer.params.amount as number}
                        onChange={e => setParam(layer.id, 'amount', +e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </div>
                  )}
                  {layer.type === 'scanlines' && (
                    <div style={{ marginTop: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: 'var(--t3)' }}>Spacing (px)</span>
                        <span style={{ fontSize: 10, color: 'var(--acc)', fontFamily: 'var(--font-mono)' }}>{layer.params.spacing}</span>
                      </div>
                      <input
                        type="range" min={2} max={20} value={layer.params.spacing as number}
                        onChange={e => setParam(layer.id, 'spacing', +e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
