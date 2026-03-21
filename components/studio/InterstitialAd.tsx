'use client'

import { useState, useEffect } from 'react'

interface Props {
  onContinue: () => void
  onClose: () => void
}

export default function InterstitialAd({ onContinue, onClose }: Props) {
  const [countdown, setCountdown] = useState(5)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(interval); setReady(true); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 3000,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div style={{
        background: 'var(--s1)', borderRadius: 16, width: '100%', maxWidth: 480,
        border: '1px solid var(--b2)', overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        animation: 'popIn 0.2s cubic-bezier(0.32,0.72,0,1)',
      }}>
        <style>{`@keyframes popIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--b1)' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>Your download is ready</span>
          <button onClick={onClose} style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: 'var(--s3)', color: 'var(--t2)', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* AD PLACEMENT — replace with your interstitial ad tag */}
        <div style={{ margin: '16px', borderRadius: 10, border: '1px dashed var(--b2)', background: 'var(--s2)', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
          {/* Your ad code goes here */}
        </div>
        {/* END AD */}

        <div style={{ padding: '0 16px 16px' }}>
          <button
            onClick={ready ? onContinue : undefined}
            style={{
              width: '100%', padding: '12px', borderRadius: 8, border: 'none',
              background: ready ? 'var(--acc)' : 'var(--s4)',
              color: ready ? '#fff' : 'var(--t3)',
              fontSize: 13, fontWeight: 600,
              cursor: ready ? 'pointer' : 'default',
              transition: 'background 0.3s',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {ready ? '↓ Continue to Download' : `Please wait ${countdown}s…`}
          </button>
        </div>
      </div>
    </div>
  )
}
