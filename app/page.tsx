'use client'

import Link from 'next/link'
import { TOOL_CATEGORIES, getToolsByCategory } from '@/lib/tools'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--t1)' }}>

      <header style={{ background: 'var(--s1)', borderBottom: '1px solid var(--b1)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, letterSpacing: '0.05em' }}>
            Studio<span style={{ color: 'var(--acc)' }}>/</span>bg
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>32+ Free Tools</span>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>No Signup</span>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: 16 }}>
          Free Background Generator
        </h1>
        <p style={{ fontSize: 16, color: 'var(--t2)', maxWidth: 500, margin: '0 auto 36px' }}>
          32+ generative tools. Mesh gradients, noise, patterns, SVG.
          Download PNG, JPEG, WebP. No signup required.
        </p>
        <Link href="/tool/mesh-gradient" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--acc)', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
          Open Studio →
        </Link>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 60px' }}>
        <style>{`.tool-card:hover { border-color: var(--acc) !important; transform: translateY(-2px); } .tool-card { transition: border-color 0.15s, transform 0.15s; }`}</style>
        {TOOL_CATEGORIES.map(category => {
          const tools = getToolsByCategory(category)
          if (!tools.length) return null
          return (
            <div key={category} style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 14 }}>{category}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                {tools.map(tool => (
                  <Link key={tool.slug} href={`/tool/${tool.slug}`} className="tool-card" style={{ display: 'block', padding: '14px', background: 'var(--s1)', borderRadius: 10, border: '1px solid var(--b1)', textDecoration: 'none' }}>
                    <div style={{ height: 64, borderRadius: 6, marginBottom: 10, background: 'var(--s2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 9, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{tool.badge}</span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--t1)', marginBottom: 3 }}>
                      {tool.name}
                      {tool.isNew && <span style={{ marginLeft: 5, fontSize: 9, fontWeight: 600, background: 'rgba(91,124,246,0.2)', color: 'var(--acc)', padding: '1px 5px', borderRadius: 3 }}>NEW</span>}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>{tool.description}</div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <footer style={{ background: 'var(--s1)', borderTop: '1px solid var(--b1)', padding: '32px 24px' }}>
        <p style={{ fontSize: 12, color: 'var(--t3)', textAlign: 'center' }}>Free online background generator. No account needed.</p>
      </footer>
    </div>
  )
}
