'use client'

import { useRef } from 'react'
import type { ToolSlug, Params } from '@/lib/types'
import { PALETTES, generateRandomPalette } from '@/lib/palettes'

interface Props {
  tool: ToolSlug
  params: Params
  onUpdateParam: (key: string, value: unknown) => void
  onUpdateParams: (updates: Params) => void
  onShuffle: () => void
  uploadImgRef: React.MutableRefObject<HTMLImageElement | null>
}

export default function Controls({ tool, params, onUpdateParam, onUpdateParams, onShuffle, uploadImgRef }: Props) {
  return (
    <div>
      {/* Palette section (for colour tools) */}
      {Array.isArray(params.colors) && (
        <PaletteSection
          colors={params.colors as string[]}
          onChange={colors => onUpdateParam('colors', colors)}
        />
      )}

      {/* Duotone colors */}
      {(params.colorA !== undefined) && (
        <Section title="Colours">
          <ColorRow label="Shadow" value={params.colorA as string} onChange={v => onUpdateParam('colorA', v)} />
          <ColorRow label="Highlight" value={params.colorB as string} onChange={v => onUpdateParam('colorB', v)} />
        </Section>
      )}

      {/* Tool-specific controls */}
      <ToolControls tool={tool} params={params} onUpdateParam={onUpdateParam} onUpdateParams={onUpdateParams} uploadImgRef={uploadImgRef} />

      {/* Variation / seed */}
      {params.seed !== undefined && (
        <Section title="Variation">
          <button
            onClick={() => onUpdateParam('seed', Math.floor(Math.random() * 99999) + 1)}
            style={{ ...btnStyle, background: 'var(--acc)', color: '#fff', border: 'none', marginBottom: 8 }}
          >
            ⟳ &nbsp; New Variation
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: 'var(--t2)' }}>Seed</span>
            <input
              type="number"
              value={params.seed as number}
              onChange={e => onUpdateParam('seed', +e.target.value)}
              style={{ ...niStyle, width: 80 }}
            />
          </div>
        </Section>
      )}

      {/* Shuffle */}
      <div style={{ padding: '10px 14px' }}>
        <button onClick={onShuffle} style={{ ...btnStyle }}>
          ⇄ &nbsp; Shuffle Everything
        </button>
      </div>
    </div>
  )
}

// ── Tool-specific controls ─────────────────────────────────────
function ToolControls({ tool, params, onUpdateParam, onUpdateParams, uploadImgRef }: {
  tool: ToolSlug
  params: Params
  onUpdateParam: (k: string, v: unknown) => void
  onUpdateParams: (u: Params) => void
  uploadImgRef: React.MutableRefObject<HTMLImageElement | null>
}) {
  switch (tool) {
    case 'mesh-gradient':
      return <Section title="Settings">
        <Slider label="Points"    value={params.points as number}   min={1}  max={12} step={1}  onChange={v => onUpdateParam('points', v)} />
        <Slider label="Softness"  value={params.softness as number} min={10} max={100} step={1} onChange={v => onUpdateParam('softness', v)} />
        <Slider label="Grain"     value={params.grain as number}    min={0}  max={100} step={1} onChange={v => onUpdateParam('grain', v)} />
      </Section>

    case 'linear-gradient':
      return <Section title="Settings">
        <AngleWheel label="Angle" value={params.angle as number} onChange={v => onUpdateParam('angle', v)} />
      </Section>

    case 'conic-sweep':
      return <Section title="Settings">
        <AngleWheel label="Start Angle" value={params.angle as number} onChange={v => onUpdateParam('angle', v)} />
        <XYPad labelX="Center X" labelY="Center Y" x={params.cx as number} y={params.cy as number} onChangeX={v => onUpdateParam('cx', v)} onChangeY={v => onUpdateParam('cy', v)} />
      </Section>

    case 'light-aura':
      return <Section title="Settings">
        <Slider label="Count"      value={params.count as number}      min={1}  max={12}  step={1}   onChange={v => onUpdateParam('count', v)} />
        <Slider label="Size %"     value={params.size as number}       min={10} max={100} step={1}   onChange={v => onUpdateParam('size', v)} />
        <Slider label="Softness"   value={params.softness as number}   min={10} max={100} step={1}   onChange={v => onUpdateParam('softness', v)} />
        <Slider label="Brightness" value={params.brightness as number} min={0.05} max={2} step={0.05} dec={2} onChange={v => onUpdateParam('brightness', v)} />
        <XYPad labelX="Base X" labelY="Base Y" x={params.cx as number} y={params.cy as number} onChangeX={v => onUpdateParam('cx', v)} onChangeY={v => onUpdateParam('cy', v)} />
        <ColorRow label="Background" value={params.bg as string} onChange={v => onUpdateParam('bg', v)} />
      </Section>

    case 'duotone':
      return <Section title="Settings">
        <Slider label="Noise Scale" value={params.noiseScale as number} min={0.5} max={10} step={0.1} dec={1} onChange={v => onUpdateParam('noiseScale', v)} />
        <Slider label="Octaves"     value={params.noiseOct as number}   min={1}   max={8}  step={1}   onChange={v => onUpdateParam('noiseOct', v)} />
        <Slider label="Contrast"    value={params.contrast as number}   min={0.3} max={4}  step={0.05} dec={2} onChange={v => onUpdateParam('contrast', v)} />
      </Section>

    case 'blobs':
      return <Section title="Settings">
        <Slider label="Count"    value={params.count as number}    min={1}  max={20}  step={1}   onChange={v => onUpdateParam('count', v)} />
        <Slider label="Size %"   value={params.size as number}     min={10} max={100} step={1}   onChange={v => onUpdateParam('size', v)} />
        <Slider label="Softness" value={params.softness as number} min={10} max={100} step={1}   onChange={v => onUpdateParam('softness', v)} />
        <ColorRow label="Background" value={params.bg as string} onChange={v => onUpdateParam('bg', v)} />
      </Section>

    case 'waves':
      return <Section title="Settings">
        <Slider label="Layers"    value={params.count as number} min={2}   max={16} step={1}    onChange={v => onUpdateParam('count', v)} />
        <Slider label="Amplitude" value={params.amp as number}   min={1}   max={100} step={1}   onChange={v => onUpdateParam('amp', v)} />
        <Slider label="Frequency" value={params.freq as number}  min={0.1} max={10}  step={0.1} dec={1} onChange={v => onUpdateParam('freq', v)} />
        <Slider label="Phase°"    value={params.phase as number} min={0}   max={360} step={1}   onChange={v => onUpdateParam('phase', v)} />
        <ColorRow label="Background" value={params.bg as string} onChange={v => onUpdateParam('bg', v)} />
      </Section>

    case 'fluid':
      return <Section title="Settings">
        <Slider label="Scale"      value={params.scale as number}      min={0.5} max={8}  step={0.1} dec={1} onChange={v => onUpdateParam('scale', v)} />
        <Slider label="Warp"       value={params.warp as number}       min={0}   max={10} step={0.1} dec={1} onChange={v => onUpdateParam('warp', v)} />
        <Slider label="Octaves"    value={params.octaves as number}    min={1}   max={8}  step={1}   onChange={v => onUpdateParam('octaves', v)} />
        <Slider label="Brightness" value={params.brightness as number} min={0.5} max={2.5} step={0.05} dec={2} onChange={v => onUpdateParam('brightness', v)} />
      </Section>

    case 'bokeh':
      return <Section title="Settings">
        <Slider label="Count"      value={params.count as number} min={5}   max={200} step={1}  onChange={v => onUpdateParam('count', v)} />
        <Slider label="Min Radius" value={params.minR as number}  min={5}   max={200} step={5}  onChange={v => onUpdateParam('minR', v)} />
        <Slider label="Max Radius" value={params.maxR as number}  min={20}  max={600} step={10} onChange={v => onUpdateParam('maxR', v)} />
        <Toggle label="Rings" value={params.rings as number} onChange={v => onUpdateParam('rings', v)} />
        <ColorRow label="Background" value={params.bg as string} onChange={v => onUpdateParam('bg', v)} />
      </Section>

    case 'starburst':
      return <Section title="Settings">
        <Slider label="Rays"   value={params.rays as number}   min={3}  max={64}  step={1}    onChange={v => onUpdateParam('rays', v)} />
        <Slider label="Length" value={params.length as number} min={10} max={100} step={1}    onChange={v => onUpdateParam('length', v)} />
        <Slider label="Width"  value={params.width as number}  min={0.5} max={8} step={0.5} dec={1} onChange={v => onUpdateParam('width', v)} />
        <Toggle label="Glow" value={params.glow as number} onChange={v => onUpdateParam('glow', v)} />
        <XYPad labelX="Origin X" labelY="Origin Y" x={params.cx as number} y={params.cy as number} onChangeX={v => onUpdateParam('cx', v)} onChangeY={v => onUpdateParam('cy', v)} />
        <ColorRow label="Background" value={params.bg as string} onChange={v => onUpdateParam('bg', v)} />
      </Section>

    case 'perlin-noise':
      return <Section title="Settings">
        <Slider label="Scale"    value={params.scale as number}    min={0.5} max={12} step={0.1} dec={1} onChange={v => onUpdateParam('scale', v)} />
        <Slider label="Octaves"  value={params.octaves as number}  min={1}   max={8}  step={1}   onChange={v => onUpdateParam('octaves', v)} />
        <Slider label="Contrast" value={params.contrast as number} min={0.3} max={4}  step={0.05} dec={2} onChange={v => onUpdateParam('contrast', v)} />
        <Slider label="Offset X" value={params.offX as number}     min={-200} max={200} step={1} onChange={v => onUpdateParam('offX', v)} />
        <Slider label="Offset Y" value={params.offY as number}     min={-200} max={200} step={1} onChange={v => onUpdateParam('offY', v)} />
      </Section>

    case 'marble':
      return <Section title="Settings">
        <Slider label="Scale"       value={params.scale as number} min={0.5} max={10} step={0.1} dec={1} onChange={v => onUpdateParam('scale', v)} />
        <Slider label="Turbulence"  value={params.turb as number}  min={0}   max={22} step={0.1} dec={1} onChange={v => onUpdateParam('turb', v)} />
        <AngleWheel label="Angle" value={params.angle as number} onChange={v => onUpdateParam('angle', v)} />
      </Section>

    case 'smoke':
      return <Section title="Settings">
        <Slider label="Scale"      value={params.scale as number}  min={0.5} max={8} step={0.1} dec={1} onChange={v => onUpdateParam('scale', v)} />
        <Slider label="Octaves"    value={params.octaves as number} min={1}  max={8} step={1}   onChange={v => onUpdateParam('octaves', v)} />
        <Slider label="Brightness" value={params.bright as number} min={0.5} max={3} step={0.05} dec={2} onChange={v => onUpdateParam('bright', v)} />
      </Section>

    case 'grid':
      return <Section title="Settings">
        <Slider label="Cell size" value={params.cell as number} min={4}   max={400} step={1}   onChange={v => onUpdateParam('cell', v)} />
        <Slider label="Line width" value={params.lw as number}  min={0.2} max={8}   step={0.1} dec={1} onChange={v => onUpdateParam('lw', v)} />
        <AngleWheel label="Angle" value={params.angle as number} onChange={v => onUpdateParam('angle', v)} />
        <Toggle label="Isometric" value={params.iso as number} onChange={v => onUpdateParam('iso', v)} />
        <Toggle label="Glow"      value={params.glow as number} onChange={v => onUpdateParam('glow', v)} />
        <Toggle label="Fade edges" value={params.fade as number} onChange={v => onUpdateParam('fade', v)} />
        <ColorRow label="Background" value={params.bg as string}      onChange={v => onUpdateParam('bg', v)} />
        <ColorRow label="Lines"      value={params.lineCol as string} onChange={v => onUpdateParam('lineCol', v)} />
        <ColorRow label="Glow color" value={params.glowCol as string} onChange={v => onUpdateParam('glowCol', v)} />
      </Section>

    case 'hex-grid':
      return <Section title="Settings">
        <Slider label="Cell size"     value={params.size as number}    min={6}  max={200} step={1}    onChange={v => onUpdateParam('size', v)} />
        <Slider label="Gap"           value={params.gap as number}     min={0}  max={20}  step={0.5} dec={1} onChange={v => onUpdateParam('gap', v)} />
        <Slider label="Fill opacity"  value={params.fillOp as number}  min={0}  max={1}   step={0.01} dec={2} onChange={v => onUpdateParam('fillOp', v)} />
        <Toggle label="Fill cells" value={params.fill as number} onChange={v => onUpdateParam('fill', v)} />
        <Toggle label="Glow"       value={params.glow as number} onChange={v => onUpdateParam('glow', v)} />
        <ColorRow label="Background" value={params.bg as string}      onChange={v => onUpdateParam('bg', v)} />
        <ColorRow label="Lines"      value={params.lineCol as string} onChange={v => onUpdateParam('lineCol', v)} />
      </Section>

    case 'dot-matrix':
      return <Section title="Settings">
        <Slider label="Spacing"    value={params.spacing as number} min={4}  max={120} step={1}    onChange={v => onUpdateParam('spacing', v)} />
        <Slider label="Min radius" value={params.minR as number}    min={0.5} max={20} step={0.5} dec={1} onChange={v => onUpdateParam('minR', v)} />
        <Slider label="Max radius" value={params.maxR as number}    min={1}   max={40} step={0.5} dec={1} onChange={v => onUpdateParam('maxR', v)} />
        <Slider label="Noise mix"  value={params.noise as number}   min={0}  max={1}   step={0.01} dec={2} onChange={v => onUpdateParam('noise', v)} />
        <Toggle label="Radial fade" value={params.fade as number} onChange={v => onUpdateParam('fade', v)} />
        <SelectControl label="Shape" value={params.shape as string} options={[{v:'circle',l:'Circle'},{v:'square',l:'Square'}]} onChange={v => onUpdateParam('shape', v)} />
        <ColorRow label="Background" value={params.bg as string}     onChange={v => onUpdateParam('bg', v)} />
        <ColorRow label="Dot color"  value={params.dotCol as string} onChange={v => onUpdateParam('dotCol', v)} />
      </Section>

    case 'voronoi':
      return <Section title="Settings">
        <Slider label="Cell count"     value={params.count as number}    min={3}  max={80}  step={1}    onChange={v => onUpdateParam('count', v)} />
        <Slider label="Border opacity" value={params.borderOp as number} min={0}  max={1}   step={0.01} dec={2} onChange={v => onUpdateParam('borderOp', v)} />
        <Slider label="Border width"   value={params.borderW as number}  min={0.2} max={4}  step={0.1}  dec={1} onChange={v => onUpdateParam('borderW', v)} />
        <Toggle label="Show borders" value={params.borders as number} onChange={v => onUpdateParam('borders', v)} />
        <Toggle label="Fill cells"   value={params.fill as number}    onChange={v => onUpdateParam('fill', v)} />
        <Toggle label="Show dots"    value={params.dots as number}    onChange={v => onUpdateParam('dots', v)} />
        <ColorRow label="Background" value={params.bg as string} onChange={v => onUpdateParam('bg', v)} />
      </Section>

    // SVG Pattern controls
    case 'chevron':
    case 'circles':
      return <Section title="Settings">
        <Slider label="Size"         value={params.size as number}        min={10} max={120} step={1}    onChange={v => onUpdateParam('size', v)} />
        <Slider label="Stroke width" value={params.strokeWidth as number} min={0.5} max={10} step={0.5} dec={1} onChange={v => onUpdateParam('strokeWidth', v)} />
        <Slider label="Opacity"      value={params.opacity as number}     min={0}  max={1}   step={0.01} dec={2} onChange={v => onUpdateParam('opacity', v)} />
        <ColorRow label="Foreground"  value={params.fg as string} onChange={v => onUpdateParam('fg', v)} />
        <ColorRow label="Background"  value={params.bg as string} onChange={v => onUpdateParam('bg', v)} />
      </Section>

    case 'diamonds':
    case 'triangles':
      return <Section title="Settings">
        <Slider label="Size"         value={params.size as number}        min={10} max={120} step={1}    onChange={v => onUpdateParam('size', v)} />
        <Slider label="Stroke width" value={params.strokeWidth as number} min={0.5} max={8}  step={0.5} dec={1} onChange={v => onUpdateParam('strokeWidth', v)} />
        <Slider label="Opacity"      value={params.opacity as number}     min={0}  max={1}   step={0.01} dec={2} onChange={v => onUpdateParam('opacity', v)} />
        <Toggle label="Fill shapes" value={params.filled as number ?? 0} onChange={v => onUpdateParam('filled', v)} />
        <ColorRow label="Foreground" value={params.fg as string} onChange={v => onUpdateParam('fg', v)} />
        <ColorRow label="Background" value={params.bg as string} onChange={v => onUpdateParam('bg', v)} />
      </Section>

    case 'zigzag':
      return <Section title="Settings">
        <Slider label="Size"         value={params.size as number}        min={10} max={100} step={1}    onChange={v => onUpdateParam('size', v)} />
        <Slider label="Amplitude"    value={params.amplitude as number}   min={5}  max={60}  step={1}    onChange={v => onUpdateParam('amplitude', v)} />
        <Slider label="Stroke width" value={params.strokeWidth as number} min={0.5} max={8}  step={0.5} dec={1} onChange={v => onUpdateParam('strokeWidth', v)} />
        <Slider label="Opacity"      value={params.opacity as number}     min={0}  max={1}   step={0.01} dec={2} onChange={v => onUpdateParam('opacity', v)} />
        <ColorRow label="Foreground" value={params.fg as string} onChange={v => onUpdateParam('fg', v)} />
        <ColorRow label="Background" value={params.bg as string} onChange={v => onUpdateParam('bg', v)} />
      </Section>

    // Typography
    case 'text-pattern':
      return <Section title="Settings">
        <TextInput label="Text"      value={params.text as string}      onChange={v => onUpdateParam('text', v)} />
        <Slider label="Font size"   value={params.fontSize as number}  min={8}  max={120} step={1}    onChange={v => onUpdateParam('fontSize', v)} />
        <Slider label="Opacity"     value={params.opacity as number}   min={0}  max={1}   step={0.01} dec={2} onChange={v => onUpdateParam('opacity', v)} />
        <Slider label="Angle°"      value={params.angle as number}     min={-90} max={90} step={1}   onChange={v => onUpdateParam('angle', v)} />
        <Slider label="Spacing"     value={params.spacing as number}   min={0}  max={100} step={1}   onChange={v => onUpdateParam('spacing', v)} />
        <SelectControl label="Weight" value={params.fontWeight as string} options={[{v:'300',l:'Light'},{v:'400',l:'Regular'},{v:'600',l:'Semibold'},{v:'700',l:'Bold'},{v:'900',l:'Black'}]} onChange={v => onUpdateParam('fontWeight', v)} />
        <ColorRow label="Text color"  value={params.fg as string} onChange={v => onUpdateParam('fg', v)} />
        <ColorRow label="Background"  value={params.bg as string} onChange={v => onUpdateParam('bg', v)} />
      </Section>

    case 'symbol-pattern':
      return <Section title="Settings">
        <TextInput label="Symbol / emoji" value={params.symbol as string} onChange={v => onUpdateParam('symbol', v)} />
        <Slider label="Size"    value={params.fontSize as number} min={8}   max={120} step={1}    onChange={v => onUpdateParam('fontSize', v)} />
        <Slider label="Opacity" value={params.opacity as number}  min={0}   max={1}   step={0.01} dec={2} onChange={v => onUpdateParam('opacity', v)} />
        <Slider label="Spacing" value={params.spacing as number}  min={10}  max={150} step={1}   onChange={v => onUpdateParam('spacing', v)} />
        <Slider label="Angle°"  value={params.angle as number}    min={-90} max={90}  step={1}   onChange={v => onUpdateParam('angle', v)} />
        <ColorRow label="Color"      value={params.fg as string} onChange={v => onUpdateParam('fg', v)} />
        <ColorRow label="Background" value={params.bg as string} onChange={v => onUpdateParam('bg', v)} />
      </Section>

    case 'custom-tile':
      return <UploadSection params={params} onUpdateParam={onUpdateParam} uploadImgRef={uploadImgRef} />

    default:
      return null
  }
}

// ── Palette section ─────────────────────────────────────────────
function PaletteSection({ colors, onChange }: { colors: string[]; onChange: (c: string[]) => void }) {
  function addColor()    { if (colors.length < 8) onChange([...colors, '#ffffff']) }
  function removeColor() { if (colors.length > 2) onChange(colors.slice(0, -1)) }
  function updateColor(i: number, v: string) { const c = [...colors]; c[i] = v; onChange(c) }

  return (
    <div style={{ borderBottom: '1px solid var(--b1)' }}>
      {/* Preset palettes */}
      <div style={{ padding: '12px 14px 8px' }}>
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 10 }}>Palette</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
          {Object.entries(PALETTES).map(([name, pal]) => (
            <div
              key={name}
              onClick={() => onChange([...pal].slice(0, colors.length))}
              title={name}
              style={{ display: 'flex', height: 22, borderRadius: 5, overflow: 'hidden', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.1s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--acc)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'transparent'}
            >
              {pal.map((c, i) => <div key={i} style={{ width: 14, background: c }} />)}
            </div>
          ))}
        </div>

        {/* Random palette button */}
        <button
          onClick={() => onChange(generateRandomPalette(colors.length))}
          style={{ ...btnStyle, marginBottom: 10 }}
        >
          ✦ Random Palette
        </button>

        {/* Individual colour swatches */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'flex-end', marginBottom: 8 }}>
          {colors.map((c, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={{ fontSize: 9, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{i + 1}</span>
              <input
                type="color"
                value={c}
                onChange={e => updateColor(i, e.target.value)}
                style={{ width: 28, height: 28, cursor: 'pointer' }}
              />
            </div>
          ))}
          {colors.length < 8 && (
            <button onClick={addColor} style={{ width: 28, height: 28, borderRadius: 5, background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t2)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          )}
          {colors.length > 2 && (
            <button onClick={removeColor} style={{ width: 28, height: 28, borderRadius: 5, background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t2)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Upload section ───────────────────────────────────────────────
function UploadSection({ params, onUpdateParam, uploadImgRef }: { params: Params; onUpdateParam: (k: string, v: unknown) => void; uploadImgRef: React.MutableRefObject<HTMLImageElement | null> }) {
  function triggerUpload() {
    const inp = document.createElement('input')
    inp.type = 'file'; inp.accept = 'image/*'
    inp.onchange = (e) => {
      const f = (e.target as HTMLInputElement).files?.[0]
      if (!f) return
      const rd = new FileReader()
      rd.onload = ev => {
        const img = new Image()
        img.onload = () => {
          uploadImgRef.current = img
          onUpdateParam('tileW', img.width)
          onUpdateParam('tileH', img.height)
        }
        img.src = ev.target?.result as string
      }
      rd.readAsDataURL(f)
    }
    inp.click()
  }
  return (
    <Section title="Custom Tile">
      <div onClick={triggerUpload} style={{ border: '1.5px dashed var(--b2)', borderRadius: 8, padding: 14, textAlign: 'center', cursor: 'pointer', color: 'var(--t3)', fontSize: 12, marginBottom: 10 }}>
        {uploadImgRef.current ? 'Image loaded — click to replace' : 'Click to upload tile image'}
      </div>
      <Slider label="Scale"    value={params.scale as number}    min={0.05} max={10}   step={0.05} dec={2} onChange={v => onUpdateParam('scale', v)} />
      <Slider label="Rotation" value={params.rotation as number} min={0}    max={360}  step={1}   onChange={v => onUpdateParam('rotation', v)} />
      <Slider label="Opacity"  value={params.opacity as number}  min={0}    max={1}    step={0.01} dec={2} onChange={v => onUpdateParam('opacity', v)} />
      <Slider label="Offset X" value={params.offX as number}     min={-500} max={500}  step={1}   onChange={v => onUpdateParam('offX', v)} />
      <Slider label="Offset Y" value={params.offY as number}     min={-500} max={500}  step={1}   onChange={v => onUpdateParam('offY', v)} />
    </Section>
  )
}

// ── Shared control components ───────────────────────────────────
const niStyle: React.CSSProperties = {
  background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t1)',
  padding: '4px 6px', borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-mono)',
  textAlign: 'right' as const, outline: 'none',
}

const btnStyle: React.CSSProperties = {
  width: '100%', padding: '8px', background: 'var(--s3)', border: '1px solid var(--b2)',
  color: 'var(--t1)', borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: 'pointer',
  display: 'block', textAlign: 'center' as const, marginBottom: 5,
  fontFamily: 'var(--font-sans)',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--b1)' }}>
      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  )
}

function Slider({ label, value, min, max, step, dec = 0, onChange }: { label: string; value: number; min: number; max: number; step: number; dec?: number; onChange: (v: number) => void }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--t2)' }}>{label}</span>
        <span style={{ fontSize: 11, color: 'var(--acc)', fontFamily: 'var(--font-mono)' }}>{Number(value).toFixed(dec)}</span>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)} style={{ flex: 1 }} />
        <input type="number" value={Number(value).toFixed(dec)} min={min} max={max} step={step} onChange={e => onChange(+e.target.value)} style={{ ...niStyle, width: 52 }} />
      </div>
    </div>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ fontSize: 11, color: 'var(--t2)' }}>{label}</span>
      <div
        onClick={() => onChange(value ? 0 : 1)}
        style={{ width: 32, height: 18, borderRadius: 9, background: value ? 'var(--acc)' : 'var(--s4)', border: '1px solid var(--b2)', position: 'relative', cursor: 'pointer', transition: 'background 0.15s' }}
      >
        <div style={{ position: 'absolute', width: 12, height: 12, borderRadius: '50%', background: '#fff', top: 2, left: value ? 16 : 2, transition: 'left 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
      </div>
    </div>
  )
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ fontSize: 11, color: 'var(--t2)' }}>{label}</span>
      <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)} style={{ width: 30, height: 26 }} />
    </div>
  )
}

function AngleWheel({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--t2)' }}>{label}</span>
        <span style={{ fontSize: 11, color: 'var(--acc)', fontFamily: 'var(--font-mono)' }}>{Math.round(value)}°</span>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div
          style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--s3)', border: '1px solid var(--b2)', position: 'relative', cursor: 'crosshair', flexShrink: 0 }}
          onMouseDown={e => {
            const el = e.currentTarget
            const move = (ev: MouseEvent) => {
              const r = el.getBoundingClientRect()
              const a = ((Math.atan2(ev.clientY - (r.top + r.height/2), ev.clientX - (r.left + r.width/2)) * 180 / Math.PI) + 90 + 360) % 360
              onChange(a)
            }
            const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
            window.addEventListener('mousemove', move)
            window.addEventListener('mouseup', up)
          }}
        >
          <div style={{
            position: 'absolute', width: 2, height: 12, background: 'var(--acc)', borderRadius: 1,
            left: '50%', bottom: '50%', transformOrigin: 'bottom center',
            marginLeft: -1, transform: `rotate(${value}deg)`,
          }} />
        </div>
        <input type="range" min={0} max={360} step={1} value={value} onChange={e => onChange(+e.target.value)} style={{ flex: 1 }} />
        <input type="number" value={Math.round(value)} min={0} max={360} onChange={e => onChange(+e.target.value)} style={{ ...niStyle, width: 52 }} />
      </div>
    </div>
  )
}

function XYPad({ labelX, labelY, x, y, onChangeX, onChangeY }: { labelX: string; labelY: string; x: number; y: number; onChangeX: (v: number) => void; onChangeY: (v: number) => void }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{ width: '100%', height: 80, background: 'var(--s3)', border: '1px solid var(--b2)', borderRadius: 7, position: 'relative', cursor: 'crosshair', marginBottom: 6, overflow: 'hidden' }}
        onMouseDown={e => {
          const el = e.currentTarget
          const update = (ev: MouseEvent) => {
            const r = el.getBoundingClientRect()
            onChangeX(Math.round(Math.max(0, Math.min(100, (ev.clientX - r.left) / r.width * 100)) * 10) / 10)
            onChangeY(Math.round(Math.max(0, Math.min(100, (ev.clientY - r.top) / r.height * 100)) * 10) / 10)
          }
          update(e.nativeEvent)
          const up = () => { window.removeEventListener('mousemove', update); window.removeEventListener('mouseup', up) }
          window.addEventListener('mousemove', update)
          window.addEventListener('mouseup', up)
          e.preventDefault()
        }}
      >
        <div style={{ position: 'absolute', width: '100%', height: 1, background: 'var(--b2)', top: `${y}%` }} />
        <div style={{ position: 'absolute', height: '100%', width: 1, background: 'var(--b2)', left: `${x}%` }} />
        <div style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: 'var(--acc)', transform: 'translate(-50%,-50%)', left: `${x}%`, top: `${y}%`, pointerEvents: 'none', boxShadow: '0 0 0 3px var(--accs)' }} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>X</span>
          <input type="number" value={x.toFixed(1)} min={0} max={100} step={0.5} onChange={e => onChangeX(+e.target.value)} style={{ ...niStyle, flex: 1, width: 0 }} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>Y</span>
          <input type="number" value={y.toFixed(1)} min={0} max={100} step={0.5} onChange={e => onChangeY(+e.target.value)} style={{ ...niStyle, flex: 1, width: 0 }} />
        </div>
      </div>
    </div>
  )
}

function SelectControl({ label, value, options, onChange }: { label: string; value: string; options: {v:string;l:string}[]; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--t2)' }}>{label}</span>
      </div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t1)', padding: '6px 8px', borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-sans)', cursor: 'pointer', outline: 'none' }}
      >
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  )
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <span style={{ fontSize: 11, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>{label}</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t1)', padding: '6px 8px', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-sans)', outline: 'none' }}
      />
    </div>
  )
}
