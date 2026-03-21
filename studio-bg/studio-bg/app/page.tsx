import Link from 'next/link'
import { TOOLS, TOOL_CATEGORIES, getToolsByCategory } from '@/lib/tools'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Studio BG — Free Background & Pattern Generator',
  description: 'Generate stunning backgrounds free. 32+ tools: mesh gradients, perlin noise, voronoi, SVG patterns, typography. Download PNG, JPEG, WebP instantly. No signup.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--t1)' }}>

      {/* Header */}
      <header style={{ background: 'var(--s1)', borderBottom: '1px solid var(--b1)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, letterSpacing: '0.05em' }}>
            Studio<span style={{ color: 'var(--acc)' }}>/</span>bg
          </div>
          <nav className="flex items-center gap-6">
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>32+ Free Tools</span>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>No Signup</span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-semibold mb-4" style={{ letterSpacing: '-0.03em', color: 'var(--t1)' }}>
          Free Background Generator
        </h1>
        <p style={{ fontSize: 16, color: 'var(--t2)', maxWidth: 520, margin: '0 auto 40px' }}>
          32+ generative tools. Mesh gradients, noise, patterns, SVG.
          Download PNG, JPEG, WebP. No signup required.
        </p>
        <Link
          href="/tool/mesh-gradient"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--acc)', color: '#fff',
            padding: '12px 28px', borderRadius: 10, fontWeight: 600, fontSize: 14,
            textDecoration: 'none',
          }}
        >
          Open Studio →
        </Link>
      </div>

      {/* Tool Grid by Category */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        {TOOL_CATEGORIES.map(category => {
          const tools = getToolsByCategory(category)
          if (!tools.length) return null
          return (
            <div key={category} className="mb-12">
              <h2 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 16 }}>
                {category}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {tools.map(tool => (
                  <Link
                    key={tool.slug}
                    href={`/tool/${tool.slug}`}
                    style={{
                      display: 'block', padding: '14px',
                      background: 'var(--s1)', borderRadius: 10,
                      border: '1px solid var(--b1)', textDecoration: 'none',
                      transition: 'border-color 0.15s, transform 0.15s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--acc)'
                      ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--b1)'
                      ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                    }}
                  >
                    {/* Thumbnail placeholder — replaced by canvas previews in production */}
                    <div style={{
                      height: 72, borderRadius: 6, marginBottom: 10,
                      background: 'var(--s2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
                        {tool.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--t1)', marginBottom: 3 }}>
                      {tool.name}
                      {tool.isNew && (
                        <span style={{
                          marginLeft: 6, fontSize: 9, fontWeight: 600,
                          background: 'rgba(91,124,246,0.2)', color: 'var(--acc)',
                          padding: '1px 5px', borderRadius: 4,
                        }}>NEW</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>{tool.description}</div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* SEO Footer */}
      <footer style={{ background: 'var(--s1)', borderTop: '1px solid var(--b1)', padding: '40px 24px' }}>
        <div className="max-w-6xl mx-auto">
          <p style={{ fontSize: 12, color: 'var(--t3)', textAlign: 'center' }}>
            Free online background generator. Create mesh gradients, Perlin noise, voronoi patterns, SVG designs and more.
            Download high-resolution PNG, JPEG, or WebP. No account needed.
          </p>
        </div>
      </footer>

    </div>
  )
}
