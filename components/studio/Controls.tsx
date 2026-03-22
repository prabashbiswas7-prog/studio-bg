'use client'

import { useState } from 'react'
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

// ── Global adjustments applied to every tool ──────────────────
const GLOBAL_ADJUSTMENTS = [
  { key: 'brightness', label: 'Brightness', min: 0,   max: 200, step: 1,   default: 100 },
  { key: 'contrast',   label: 'Contrast',   min: 50,  max: 200, step: 1,   default: 100 },
  { key: 'saturation', label: 'Saturation', min: 0,   max: 200, step: 1,   default: 100 },
]

// ── Depth & Light applied to every tool ───────────────────────
const DEPTH_LIGHT = [
  { key: 'depth',      label: 'Depth',       min: 0,  max: 100, step: 1, default: 0  },
  { key: 'highlights', label: 'Highlights',  min: 0,  max: 100, step: 1, default: 50 },
  { key: 'shadows',    label: 'Shadows',     min: 0,  max: 100, step: 1, default: 50 },
  { key: 'foldScale',  label: 'Fold Scale',  min: 0,  max: 100, step: 1, default: 60 },
]

export default function Controls({ tool, params, onUpdateParam, onUpdateParams, onShuffle, uploadImgRef }: Props) {
  const p = params

  // Ensure global params have defaults
  const brightness = (p.brightness as number) ?? 100
  const contrast   = (p.contrast   as number) ?? 100
  const saturation = (p.saturation as number) ?? 100

  return (
    <div style={{ paddingBottom: 20 }}>

      {/* ── Variation button ── */}
      {p.seed !== undefined && (
        <div style={{ padding: '12px 14px 0' }}>
          <button
            onClick={() => onUpdateParam('seed', Math.floor(Math.random() * 99999) + 1)}
            style={{
              width: '100%', padding: '10px', borderRadius: 8,
              background: 'var(--acc)', color: '#fff', border: 'none',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'var(--font-sans)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <span style={{ fontSize: 16 }}>⟳</span> New Variation
          </button>
        </div>
      )}

      {/* ── Shuffle button ── */}
      <div style={{ padding: '8px 14px 0' }}>
        <button
          onClick={onShuffle}
          style={{
            width: '100%', padding: '8px', borderRadius: 8,
            background: 'var(--s3)', color: 'var(--t2)',
            border: '1px solid var(--b2)',
            fontSize: 11, fontWeight: 500, cursor: 'pointer',
            fontFamily: 'var(--font-sans)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <span>⇄</span> Shuffle Everything
        </button>
      </div>

      {/* ── Colour palette (always visible at top) ── */}
      {Array.isArray(p.colors) && (
        <PaletteSection
          colors={p.colors as string[]}
          onChange={c => onUpdateParam('colors', c)}
        />
      )}
      {p.colorA !== undefined && (
        <Section title="Colours" defaultOpen>
          <ColorRow label="Shadow"    value={p.colorA as string} onChange={v => onUpdateParam('colorA', v)} />
          <ColorRow label="Highlight" value={p.colorB as string} onChange={v => onUpdateParam('colorB', v)} />
        </Section>
      )}
      {(p.fg !== undefined) && (
        <Section title="Colours" defaultOpen>
          <ColorRow label="Foreground"  value={p.fg as string} onChange={v => onUpdateParam('fg', v)} />
          <ColorRow label="Background"  value={p.bg as string} onChange={v => onUpdateParam('bg', v)} />
        </Section>
      )}
      {(p.bg !== undefined && p.fg === undefined && p.colorA === undefined && !Array.isArray(p.colors)) && (
        <Section title="Colours" defaultOpen>
          <ColorRow label="Background" value={p.bg as string} onChange={v => onUpdateParam('bg', v)} />
          {p.lineCol !== undefined && <ColorRow label="Lines"      value={p.lineCol as string} onChange={v => onUpdateParam('lineCol', v)} />}
          {p.glowCol !== undefined && <ColorRow label="Glow"       value={p.glowCol as string} onChange={v => onUpdateParam('glowCol', v)} />}
          {p.dotCol  !== undefined && <ColorRow label="Dots"       value={p.dotCol  as string} onChange={v => onUpdateParam('dotCol',  v)} />}
        </Section>
      )}

      {/* ── Tool-specific controls ── */}
      <ToolControls tool={tool} params={params} up={onUpdateParam} uploadImgRef={uploadImgRef} />

      {/* ── Depth & Light ── */}
      <Section title="Depth & Light">
        {DEPTH_LIGHT.map(ctrl => (
          <Slider key={ctrl.key} label={ctrl.label}
            value={(p[ctrl.key] as number) ?? ctrl.default}
            min={ctrl.min} max={ctrl.max} step={ctrl.step}
            onChange={v => onUpdateParam(ctrl.key, v)}
          />
        ))}
      </Section>

      {/* ── Adjustments ── */}
      <Section title="Adjustments">
        {GLOBAL_ADJUSTMENTS.map(ctrl => (
          <Slider key={ctrl.key} label={ctrl.label}
            value={(p[ctrl.key] as number) ?? ctrl.default}
            min={ctrl.min} max={ctrl.max} step={ctrl.step}
            onChange={v => onUpdateParam(ctrl.key, v)}
          />
        ))}
      </Section>

    </div>
  )
}

// ── Tool-specific controls ──────────────────────────────────────
function ToolControls({ tool, params: p, up, uploadImgRef }: {
  tool: ToolSlug; params: Params
  up: (k: string, v: unknown) => void
  uploadImgRef: React.MutableRefObject<HTMLImageElement | null>
}) {
  switch (tool) {

    case 'mesh-gradient': return <>
      <Section title="Mesh">
        <Slider label="Points"      value={n(p,'points',7)}    min={1}   max={20}  step={1}   onChange={v=>up('points',v)} />
        <Slider label="Softness"    value={n(p,'softness',78)} min={10}  max={100} step={1}   onChange={v=>up('softness',v)} />
        <Slider label="Spread"      value={n(p,'spread',50)}   min={10}  max={100} step={1}   onChange={v=>up('spread',v)} />
        <Slider label="Intensity"   value={n(p,'intensity',90)} min={10} max={100} step={1}   onChange={v=>up('intensity',v)} />
        <Slider label="Blend"       value={n(p,'blend',50)}    min={0}   max={100} step={1}   onChange={v=>up('blend',v)} />
      </Section>
      <Section title="Grain">
        <Slider label="Amount" value={n(p,'grain',8)}      min={0} max={100} step={1}   onChange={v=>up('grain',v)} />
        <Slider label="Size"   value={n(p,'grainSize',1)}  min={0} max={5}   step={0.1} onChange={v=>up('grainSize',v)} />
      </Section>
    </>

    case 'linear-gradient': return <>
      <Section title="Flow">
        <AngleSlider label="Angle"   value={n(p,'angle',135)}   onChange={v=>up('angle',v)} />
        <Slider label="Smoothness"   value={n(p,'smooth',50)}   min={0} max={100} step={1} onChange={v=>up('smooth',v)} />
        <Slider label="Midpoint"     value={n(p,'midpoint',50)} min={0} max={100} step={1} onChange={v=>up('midpoint',v)} />
      </Section>
    </>

    case 'conic-sweep': return <>
      <Section title="Shape">
        <AngleSlider label="Start Angle" value={n(p,'angle',0)} onChange={v=>up('angle',v)} />
        <Slider label="Spread"  value={n(p,'spread',100)} min={10} max={360} step={1} onChange={v=>up('spread',v)} />
        <Slider label="Softness" value={n(p,'softness',0)} min={0} max={100} step={1} onChange={v=>up('softness',v)} />
      </Section>
      <Section title="Position">
        <Slider label="Center X" value={n(p,'cx',50)} min={0} max={100} step={0.5} onChange={v=>up('cx',v)} />
        <Slider label="Center Y" value={n(p,'cy',50)} min={0} max={100} step={0.5} onChange={v=>up('cy',v)} />
      </Section>
    </>

    case 'light-aura': return <>
      <Section title="Aura">
        <Slider label="Count"       value={n(p,'count',4)}      min={1}    max={16}  step={1}    onChange={v=>up('count',v)} />
        <Slider label="Size %"      value={n(p,'size',68)}      min={10}   max={100} step={1}    onChange={v=>up('size',v)} />
        <Slider label="Softness"    value={n(p,'softness',80)}  min={10}   max={100} step={1}    onChange={v=>up('softness',v)} />
        <Slider label="Brightness"  value={n(p,'brightness',.75)*100} min={5} max={200} step={1} onChange={v=>up('brightness',v/100)} />
        <Slider label="Spread"      value={n(p,'spread',50)}    min={0}    max={100} step={1}    onChange={v=>up('spread',v)} />
        <Slider label="Glow Radius" value={n(p,'glowRadius',80)} min={10}  max={200} step={1}    onChange={v=>up('glowRadius',v)} />
      </Section>
      <Section title="Position">
        <Slider label="Base X" value={n(p,'cx',50)} min={0} max={100} step={0.5} onChange={v=>up('cx',v)} />
        <Slider label="Base Y" value={n(p,'cy',50)} min={0} max={100} step={0.5} onChange={v=>up('cy',v)} />
        <Slider label="Scatter" value={n(p,'scatter',85)} min={0} max={200} step={1} onChange={v=>up('scatter',v)} />
      </Section>
    </>

    case 'duotone': return <>
      <Section title="Flow">
        <Slider label="Noise Scale"   value={n(p,'noiseScale',3)}   min={0.5} max={15}  step={0.1} onChange={v=>up('noiseScale',v)} />
        <Slider label="Noise Intensity" value={n(p,'noiseOct',4)}   min={1}   max={8}   step={1}   onChange={v=>up('noiseOct',v)} />
        <Slider label="Contrast"      value={n(p,'contrast',1.2)*50} min={15} max={200} step={1}   onChange={v=>up('contrast',v/50)} />
        <Slider label="Angle"         value={n(p,'duoAngle',0)}      min={0}  max={360} step={1}   onChange={v=>up('duoAngle',v)} />
        <Slider label="Smoothness"    value={n(p,'smooth',50)}       min={0}  max={100} step={1}   onChange={v=>up('smooth',v)} />
      </Section>
    </>

    case 'blobs': return <>
      <Section title="Blobs">
        <Slider label="Count"     value={n(p,'count',6)}     min={1}   max={30}  step={1}    onChange={v=>up('count',v)} />
        <Slider label="Size %"    value={n(p,'size',60)}     min={5}   max={100} step={1}    onChange={v=>up('size',v)} />
        <Slider label="Softness"  value={n(p,'softness',70)} min={10}  max={100} step={1}    onChange={v=>up('softness',v)} />
        <Slider label="Blur"      value={n(p,'blur',8)}      min={0}   max={60}  step={1}    onChange={v=>up('blur',v)} />
        <Slider label="Opacity"   value={n(p,'opacity',.9)*100} min={10} max={100} step={1}  onChange={v=>up('opacity',v/100)} />
        <Slider label="Wobble"    value={n(p,'wobble',50)}   min={0}   max={100} step={1}    onChange={v=>up('wobble',v)} />
        <Slider label="Complexity" value={n(p,'complexity',6)} min={3} max={12}  step={1}    onChange={v=>up('complexity',v)} />
      </Section>
    </>

    case 'waves': return <>
      <Section title="Flow">
        <Slider label="Layers"     value={n(p,'count',6)}   min={2}   max={20}  step={1}    onChange={v=>up('count',v)} />
        <Slider label="Amplitude"  value={n(p,'amp',38)}    min={1}   max={100} step={1}    onChange={v=>up('amp',v)} />
        <Slider label="Frequency"  value={n(p,'freq',2.2)*10} min={1} max={100} step={1}    onChange={v=>up('freq',v/10)} />
        <Slider label="Phase"      value={n(p,'phase',0)}   min={0}   max={360} step={1}    onChange={v=>up('phase',v)} />
        <Slider label="Curve Mix"  value={n(p,'curve',1)*50} min={0}  max={100} step={1}    onChange={v=>up('curve',v/50)} />
        <Slider label="Opacity"    value={n(p,'opacity',1)*100} min={10} max={100} step={1} onChange={v=>up('opacity',v/100)} />
        <Slider label="Wave Width"  value={n(p,'lineWidth',0)} min={0} max={10}  step={0.5} onChange={v=>up('lineWidth',v)} />
        <Slider label="Warp"       value={n(p,'waveWarp',0)} min={0}  max={100} step={1}    onChange={v=>up('waveWarp',v)} />
      </Section>
    </>

    case 'fluid': return <>
      <Section title="Flow">
        <Slider label="Noise Scale"      value={n(p,'scale',2.2)*10}  min={5}   max={80}  step={1} onChange={v=>up('scale',v/10)} />
        <Slider label="Warp"             value={n(p,'warp',3.5)*10}   min={0}   max={100} step={1} onChange={v=>up('warp',v/10)} />
        <Slider label="Noise Intensity"  value={n(p,'octaves',5)}     min={1}   max={8}   step={1} onChange={v=>up('octaves',v)} />
        <Slider label="Curve Distortion" value={n(p,'curveDist',50)}  min={0}   max={100} step={1} onChange={v=>up('curveDist',v)} />
        <Slider label="Detail"           value={n(p,'detail',2)}      min={1}   max={8}   step={1} onChange={v=>up('detail',v)} />
        <Slider label="Flow Speed"       value={n(p,'flowSpeed',50)}  min={0}   max={100} step={1} onChange={v=>up('flowSpeed',v)} />
        <Slider label="Turbulence"       value={n(p,'turbulence',30)} min={0}   max={100} step={1} onChange={v=>up('turbulence',v)} />
        <Slider label="Brightness"       value={n(p,'brightness',1.1)*100} min={50} max={200} step={1} onChange={v=>up('brightness',v/100)} />
      </Section>
    </>

    case 'bokeh': return <>
      <Section title="Bokeh">
        <Slider label="Count"       value={n(p,'count',70)}     min={5}   max={300} step={5}    onChange={v=>up('count',v)} />
        <Slider label="Min Radius"  value={n(p,'minR',15)}      min={2}   max={200} step={1}    onChange={v=>up('minR',v)} />
        <Slider label="Max Radius"  value={n(p,'maxR',140)}     min={10}  max={600} step={5}    onChange={v=>up('maxR',v)} />
        <Slider label="Opacity"     value={n(p,'opacity',.8)*100} min={5} max={100} step={1}    onChange={v=>up('opacity',v/100)} />
        <Slider label="Blur"        value={n(p,'bokehBlur',0)}  min={0}   max={30}  step={1}    onChange={v=>up('bokehBlur',v)} />
        <Slider label="Scatter"     value={n(p,'scatter',100)}  min={10}  max={200} step={1}    onChange={v=>up('scatter',v)} />
        <Slider label="Glow"        value={n(p,'glow',50)}      min={0}   max={100} step={1}    onChange={v=>up('glow',v)} />
        <Toggle label="Rings"       value={n(p,'rings',1)}      onChange={v=>up('rings',v)} />
      </Section>
    </>

    case 'starburst': return <>
      <Section title="Rays">
        <Slider label="Ray Count"   value={n(p,'rays',14)}      min={3}   max={128} step={1}    onChange={v=>up('rays',v)} />
        <Slider label="Length %"    value={n(p,'length',82)}    min={10}  max={100} step={1}    onChange={v=>up('length',v)} />
        <Slider label="Width px"    value={n(p,'width',1.4)*10} min={1}   max={80}  step={1}    onChange={v=>up('width',v/10)} />
        <AngleSlider label="Rotation" value={n(p,'rotation',0)} onChange={v=>up('rotation',v)} />
        <Slider label="Glow Intensity" value={n(p,'glowInt',50)} min={0}  max={100} step={1}    onChange={v=>up('glowInt',v)} />
        <Slider label="Falloff"     value={n(p,'falloff',50)}   min={0}   max={100} step={1}    onChange={v=>up('falloff',v)} />
        <Toggle label="Glow"        value={n(p,'glow',1)}       onChange={v=>up('glow',v)} />
      </Section>
      <Section title="Position">
        <Slider label="Origin X" value={n(p,'cx',50)} min={0} max={100} step={0.5} onChange={v=>up('cx',v)} />
        <Slider label="Origin Y" value={n(p,'cy',50)} min={0} max={100} step={0.5} onChange={v=>up('cy',v)} />
      </Section>
    </>

    case 'perlin-noise': return <>
      <Section title="Flow">
        <Slider label="Noise Scale"   value={n(p,'scale',3.2)*10}     min={5}   max={120} step={1} onChange={v=>up('scale',v/10)} />
        <Slider label="Noise Intensity" value={n(p,'noiseInt',55)}    min={0}   max={100} step={1} onChange={v=>up('noiseInt',v)} />
        <Slider label="Octaves"       value={n(p,'octaves',5)}        min={1}   max={8}   step={1} onChange={v=>up('octaves',v)} />
        <Slider label="Curve Distortion" value={n(p,'curveDist',70)} min={0}   max={100} step={1} onChange={v=>up('curveDist',v)} />
        <Slider label="Detail"        value={n(p,'detail',2)}         min={1}   max={8}   step={1} onChange={v=>up('detail',v)} />
        <Slider label="Contrast"      value={n(p,'contrast',1.3)*50}  min={15}  max={200} step={1} onChange={v=>up('contrast',v/50)} />
        <Slider label="Offset X"      value={n(p,'offX',0)}           min={-200} max={200} step={1} onChange={v=>up('offX',v)} />
        <Slider label="Offset Y"      value={n(p,'offY',0)}           min={-200} max={200} step={1} onChange={v=>up('offY',v)} />
      </Section>
      <Section title="Depth & Colour">
        <Slider label="Depth"       value={n(p,'pDepth',60)}      min={0}  max={100} step={1} onChange={v=>up('pDepth',v)} />
        <Slider label="Highlights"  value={n(p,'pHighlights',50)} min={0}  max={100} step={1} onChange={v=>up('pHighlights',v)} />
        <Slider label="Shadows"     value={n(p,'pShadows',55)}    min={0}  max={100} step={1} onChange={v=>up('pShadows',v)} />
      </Section>
    </>

    case 'marble': return <>
      <Section title="Flow">
        <Slider label="Noise Scale"    value={n(p,'scale',2.8)*10}   min={5}  max={100} step={1} onChange={v=>up('scale',v/10)} />
        <Slider label="Turbulence"     value={n(p,'turb',5.5)*10}    min={0}  max={220} step={1} onChange={v=>up('turb',v/10)} />
        <Slider label="Vein Density"   value={n(p,'veinDensity',40)} min={5}  max={100} step={1} onChange={v=>up('veinDensity',v)} />
        <Slider label="Vein Width"     value={n(p,'veinWidth',50)}   min={5}  max={100} step={1} onChange={v=>up('veinWidth',v)} />
        <AngleSlider label="Angle" value={n(p,'angle',45)} onChange={v=>up('angle',v)} />
        <Slider label="Swirl"          value={n(p,'swirl',30)}       min={0}  max={100} step={1} onChange={v=>up('swirl',v)} />
        <Slider label="Polish"         value={n(p,'polish',70)}      min={0}  max={100} step={1} onChange={v=>up('polish',v)} />
      </Section>
      <Section title="Grain">
        <Slider label="Amount" value={n(p,'grain',5)}     min={0} max={100} step={1}   onChange={v=>up('grain',v)} />
        <Slider label="Size"   value={n(p,'grainSize',1)} min={0} max={5}   step={0.1} onChange={v=>up('grainSize',v)} />
      </Section>
    </>

    case 'smoke': return <>
      <Section title="Flow">
        <Slider label="Noise Scale"   value={n(p,'scale',2.2)*10}  min={5}  max={80}  step={1} onChange={v=>up('scale',v/10)} />
        <Slider label="Octaves"       value={n(p,'octaves',6)}     min={1}  max={8}   step={1} onChange={v=>up('octaves',v)} />
        <Slider label="Brightness"    value={n(p,'bright',1.15)*100} min={50} max={300} step={1} onChange={v=>up('bright',v/100)} />
        <Slider label="Density"       value={n(p,'density',60)}    min={10} max={100} step={1} onChange={v=>up('density',v)} />
        <Slider label="Turbulence"    value={n(p,'turbulence',40)} min={0}  max={100} step={1} onChange={v=>up('turbulence',v)} />
        <Slider label="Drift"         value={n(p,'drift',30)}      min={0}  max={100} step={1} onChange={v=>up('drift',v)} />
        <Slider label="Curl"          value={n(p,'curl',50)}       min={0}  max={100} step={1} onChange={v=>up('curl',v)} />
      </Section>
    </>

    case 'dither': return <>
      <Section title="Flow">
        <Slider label="Noise Scale"    value={n(p,'scale',3)*10}       min={5}  max={80}  step={1} onChange={v=>up('scale',v/10)} />
        <Slider label="Noise Intensity" value={n(p,'noiseInt',55)}     min={0}  max={100} step={1} onChange={v=>up('noiseInt',v)} />
        <Slider label="Curve Distortion" value={n(p,'curveDist',70)}  min={0}  max={100} step={1} onChange={v=>up('curveDist',v)} />
        <Slider label="Detail"          value={n(p,'octaves',4)}       min={1}  max={8}   step={1} onChange={v=>up('octaves',v)} />
        <Slider label="Dither Size"     value={n(p,'ditherSize',2)}    min={1}  max={12}  step={1} onChange={v=>up('ditherSize',v)} />
        <Slider label="Contrast"        value={n(p,'contrast',1.4)*50} min={15} max={200} step={1} onChange={v=>up('contrast',v/50)} />
        <Slider label="Threshold"       value={n(p,'threshold',50)}    min={0}  max={100} step={1} onChange={v=>up('threshold',v)} />
      </Section>
      <SelectCtrl label="Mode" value={s(p,'mode','ordered')} onChange={v=>up('mode',v)} options={[{v:'ordered',l:'Ordered (Bayer)'},{v:'flat',l:'Flat'}]} />
    </>

    case 'grid': return <>
      <Section title="Grid">
        <Slider label="Cell Size"    value={n(p,'cell',55)}      min={4}   max={400} step={1}    onChange={v=>up('cell',v)} />
        <Slider label="Line Width"   value={n(p,'lw',1)*10}      min={1}   max={80}  step={1}    onChange={v=>up('lw',v/10)} />
        <AngleSlider label="Angle" value={n(p,'angle',0)} onChange={v=>up('angle',v)} />
        <Slider label="Opacity"      value={n(p,'gridOp',85)}    min={5}   max={100} step={1}    onChange={v=>up('gridOp',v)} />
        <Slider label="Glow Size"    value={n(p,'glowSize',8)}   min={0}   max={40}  step={1}    onChange={v=>up('glowSize',v)} />
        <Toggle label="Isometric"    value={n(p,'iso',0)}        onChange={v=>up('iso',v)} />
        <Toggle label="Glow"         value={n(p,'glow',1)}       onChange={v=>up('glow',v)} />
        <Toggle label="Fade Edges"   value={n(p,'fade',1)}       onChange={v=>up('fade',v)} />
        <Toggle label="Dot Corners"  value={n(p,'dotCorners',0)} onChange={v=>up('dotCorners',v)} />
      </Section>
    </>

    case 'hex-grid': return <>
      <Section title="Hex">
        <Slider label="Cell Size"    value={n(p,'size',38)}      min={6}   max={200} step={1}    onChange={v=>up('size',v)} />
        <Slider label="Gap"          value={n(p,'gap',2)*10}     min={0}   max={100} step={1}    onChange={v=>up('gap',v/10)} />
        <Slider label="Fill Opacity" value={n(p,'fillOp',.14)*100} min={0} max={100} step={1}   onChange={v=>up('fillOp',v/100)} />
        <Slider label="Glow Size"    value={n(p,'glowSize',10)}  min={0}   max={40}  step={1}    onChange={v=>up('glowSize',v)} />
        <Slider label="Rotation"     value={n(p,'hexRotation',0)} min={0}  max={60}  step={1}    onChange={v=>up('hexRotation',v)} />
        <Toggle label="Fill Cells"   value={n(p,'fill',0)}       onChange={v=>up('fill',v)} />
        <Toggle label="Glow"         value={n(p,'glow',1)}       onChange={v=>up('glow',v)} />
      </Section>
      <SelectCtrl label="Variant" value={s(p,'variant','hex')} onChange={v=>up('variant',v)} options={[{v:'hex',l:'Hexagon'},{v:'triangle',l:'Triangle'}]} />
    </>

    case 'crosshatch': return <>
      <Section title="Lines">
        <Slider label="Spacing"     value={n(p,'spacing',12)}    min={2}   max={150} step={1}    onChange={v=>up('spacing',v)} />
        <Slider label="Line Width"  value={n(p,'lw',.8)*10}      min={1}   max={60}  step={1}    onChange={v=>up('lw',v/10)} />
        <Slider label="Opacity"     value={n(p,'opacity',.85)*100} min={5}  max={100} step={1}   onChange={v=>up('opacity',v/100)} />
        <AngleSlider label="Angle 1" value={n(p,'a1',45)} onChange={v=>up('a1',v)} />
        <AngleSlider label="Angle 2" value={n(p,'a2',135)} onChange={v=>up('a2',v)} />
        <Slider label="Variation"   value={n(p,'variation',0)}   min={0}   max={100} step={1}    onChange={v=>up('variation',v)} />
      </Section>
      <SelectCtrl label="Layers" value={String(n(p,'layers',2))} onChange={v=>up('layers',+v)} options={[{v:'2',l:'2 sets'},{v:'3',l:'3 sets'}]} />
    </>

    case 'plotter': return <>
      <Section title="Lines">
        <Slider label="Line Count"   value={n(p,'count',120)}    min={10}  max={400} step={5}    onChange={v=>up('count',v)} />
        <Slider label="Amplitude %"  value={n(p,'amp',35)}       min={0}   max={100} step={1}    onChange={v=>up('amp',v)} />
        <Slider label="Frequency"    value={n(p,'freq',3.5)*10}  min={1}   max={120} step={1}    onChange={v=>up('freq',v/10)} />
        <Slider label="Line Width"   value={n(p,'thick',.8)*10}  min={1}   max={40}  step={1}    onChange={v=>up('thick',v/10)} />
        <Slider label="Warp"         value={n(p,'warp',1.4)*10}  min={0}   max={40}  step={1}    onChange={v=>up('warp',v/10)} />
        <Slider label="Noise Mix"    value={n(p,'noiseMix',30)}  min={0}   max={100} step={1}    onChange={v=>up('noiseMix',v)} />
        <Slider label="Spacing"      value={n(p,'lineSpacing',0)} min={0}   max={50}  step={1}   onChange={v=>up('lineSpacing',v)} />
      </Section>
      <SelectCtrl label="Style" value={s(p,'style','wave')} onChange={v=>up('style',v)} options={[{v:'wave',l:'Wave'},{v:'ripple',l:'Ripple'},{v:'flow',l:'Flow'},{v:'zigzag',l:'Zigzag'}]} />
    </>

    case '3d-shapes': return <>
      <Section title="Shapes">
        <Slider label="Count"       value={n(p,'count',20)}      min={1}   max={120} step={1}    onChange={v=>up('count',v)} />
        <Slider label="Min Size"    value={n(p,'minSz',28)}      min={5}   max={400} step={5}    onChange={v=>up('minSz',v)} />
        <Slider label="Max Size"    value={n(p,'maxSz',185)}     min={10}  max={800} step={5}    onChange={v=>up('maxSz',v)} />
        <Slider label="Opacity"     value={n(p,'opacity',.88)*100} min={5} max={100} step={1}    onChange={v=>up('opacity',v/100)} />
        <Slider label="Scatter"     value={n(p,'scatter',100)}   min={10}  max={200} step={1}    onChange={v=>up('scatter',v)} />
        <Slider label="Glow Size"   value={n(p,'glowSize',30)}   min={0}   max={100} step={1}    onChange={v=>up('glowSize',v)} />
        <Slider label="Rotation"    value={n(p,'shapeRot',0)}    min={0}   max={360} step={1}    onChange={v=>up('shapeRot',v)} />
        <Toggle label="Glow"        value={n(p,'glow',1)}        onChange={v=>up('glow',v)} />
      </Section>
      <Section title="Depth & Light">
        <Slider label="Depth"      value={n(p,'shapeDepth',60)}  min={0}  max={100} step={1}    onChange={v=>up('shapeDepth',v)} />
        <Slider label="Highlights" value={n(p,'shapeHL',50)}     min={0}  max={100} step={1}    onChange={v=>up('shapeHL',v)} />
        <Slider label="Shadows"    value={n(p,'shapeShadow',55)} min={0}  max={100} step={1}    onChange={v=>up('shapeShadow',v)} />
      </Section>
      <SelectCtrl label="Shape" value={s(p,'shape','mixed')} onChange={v=>up('shape',v)} options={[{v:'mixed',l:'Mixed'},{v:'sphere',l:'Sphere'},{v:'cube',l:'Cube'},{v:'hex',l:'Hexagon'},{v:'tri',l:'Triangle'},{v:'ring',l:'Ring'}]} />
    </>

    case 'dot-matrix': return <>
      <Section title="Dots">
        <Slider label="Spacing"      value={n(p,'spacing',26)}    min={4}   max={150} step={1}    onChange={v=>up('spacing',v)} />
        <Slider label="Min Radius"   value={n(p,'minR',1)*10}     min={1}   max={100} step={1}    onChange={v=>up('minR',v/10)} />
        <Slider label="Max Radius"   value={n(p,'maxR',5.5)*10}   min={5}   max={200} step={1}    onChange={v=>up('maxR',v/10)} />
        <Slider label="Noise Mix"    value={n(p,'noise',0)*100}   min={0}   max={100} step={1}    onChange={v=>up('noise',v/100)} />
        <Slider label="Fade Amount"  value={n(p,'fadeAmt',50)}    min={0}   max={100} step={1}    onChange={v=>up('fadeAmt',v)} />
        <Slider label="Opacity"      value={n(p,'dotOp',100)}     min={10}  max={100} step={1}    onChange={v=>up('dotOp',v)} />
        <Toggle label="Radial Fade"  value={n(p,'fade',1)}        onChange={v=>up('fade',v)} />
      </Section>
      <SelectCtrl label="Shape" value={s(p,'shape','circle')} onChange={v=>up('shape',v)} options={[{v:'circle',l:'Circle'},{v:'square',l:'Square'}]} />
    </>

    case 'halftone': return <>
      <Section title="Pattern">
        <Slider label="Size"         value={n(p,'size',16)}       min={2}   max={80}  step={1}    onChange={v=>up('size',v)} />
        <AngleSlider label="Screen Angle" value={n(p,'angle',45)} onChange={v=>up('angle',v)} />
        <Slider label="Gamma"        value={n(p,'gamma',1.3)*50}  min={15}  max={200} step={1}    onChange={v=>up('gamma',v/50)} />
        <Slider label="Dot Density"  value={n(p,'density',50)}    min={10}  max={100} step={1}    onChange={v=>up('density',v)} />
        <Slider label="Softness"     value={n(p,'halftSoft',50)}  min={0}   max={100} step={1}    onChange={v=>up('halftSoft',v)} />
        <Toggle label="CMYK Mode"    value={n(p,'cmyk',0)}        onChange={v=>up('cmyk',v)} />
      </Section>
    </>

    case 'blocks': return <>
      <Section title="Blocks">
        <Slider label="Block Width"   value={n(p,'blockW',40)}     min={4}   max={200} step={1}    onChange={v=>up('blockW',v)} />
        <Slider label="Block Height"  value={n(p,'blockH',40)}     min={4}   max={200} step={1}    onChange={v=>up('blockH',v)} />
        <Slider label="Gap"           value={n(p,'gap',2)}         min={0}   max={40}  step={1}    onChange={v=>up('gap',v)} />
        <Slider label="Roundness"     value={n(p,'roundness',4)}   min={0}   max={60}  step={1}    onChange={v=>up('roundness',v)} />
        <Slider label="Noise Scale"   value={n(p,'noiseScale',2.8)*10} min={5} max={80} step={1}  onChange={v=>up('noiseScale',v/10)} />
        <Slider label="Noise Intensity" value={n(p,'noiseInt',55)} min={0}  max={100} step={1}    onChange={v=>up('noiseInt',v)} />
        <Slider label="Curve Distortion" value={n(p,'curveDist',70)} min={0} max={100} step={1}  onChange={v=>up('curveDist',v)} />
        <Slider label="Opacity"       value={n(p,'opacity',1)*100} min={10}  max={100} step={1}   onChange={v=>up('opacity',v/100)} />
        <Slider label="Variation"     value={n(p,'variation',0)}   min={0}   max={100} step={1}   onChange={v=>up('variation',v)} />
      </Section>
    </>

    case 'topography': return <>
      <Section title="Contours">
        <Slider label="Levels"        value={n(p,'levels',26)}     min={4}   max={80}  step={1}    onChange={v=>up('levels',v)} />
        <Slider label="Noise Scale"   value={n(p,'scale',2.6)*10}  min={5}   max={80}  step={1}    onChange={v=>up('scale',v/10)} />
        <Slider label="Noise Intensity" value={n(p,'noiseInt',55)} min={0}   max={100} step={1}    onChange={v=>up('noiseInt',v)} />
        <Slider label="Curve Distortion" value={n(p,'curveDist',70)} min={0} max={100} step={1}   onChange={v=>up('curveDist',v)} />
        <Slider label="Detail"        value={n(p,'topoDetail',2)}  min={1}   max={8}   step={1}    onChange={v=>up('topoDetail',v)} />
        <Slider label="Line Width"    value={n(p,'lw',1.1)*10}     min={1}   max={40}  step={1}    onChange={v=>up('lw',v/10)} />
        <Slider label="Fill Opacity"  value={n(p,'fillOp',.04)*100} min={0}  max={30}  step={1}    onChange={v=>up('fillOp',v/100)} />
        <Toggle label="Glow"          value={n(p,'glow',1)}        onChange={v=>up('glow',v)} />
        <Toggle label="Fill Tint"     value={n(p,'fill',0)}        onChange={v=>up('fill',v)} />
      </Section>
    </>

    case 'voronoi': return <>
      <Section title="Cells">
        <Slider label="Cell Count"    value={n(p,'count',20)}      min={3}   max={120} step={1}    onChange={v=>up('count',v)} />
        <Slider label="Border Opacity" value={n(p,'borderOp',.2)*100} min={0} max={100} step={1}  onChange={v=>up('borderOp',v/100)} />
        <Slider label="Border Width"  value={n(p,'borderW',1)*10}  min={1}   max={40}  step={1}    onChange={v=>up('borderW',v/10)} />
        <Slider label="Fill Opacity"  value={n(p,'cellFill',.6)*100} min={0} max={100} step={1}   onChange={v=>up('cellFill',v/100)} />
        <Slider label="Scatter"       value={n(p,'scatter',100)}   min={10}  max={200} step={1}    onChange={v=>up('scatter',v)} />
        <Toggle label="Show Borders"  value={n(p,'borders',1)}     onChange={v=>up('borders',v)} />
        <Toggle label="Fill Cells"    value={n(p,'fill',1)}        onChange={v=>up('fill',v)} />
        <Toggle label="Show Dots"     value={n(p,'dots',1)}        onChange={v=>up('dots',v)} />
      </Section>
    </>

    // SVG Patterns
    case 'chevron': return <>
      <Section title="Pattern">
        <Slider label="Size"         value={n(p,'size',40)}       min={10}  max={200} step={1}    onChange={v=>up('size',v)} />
        <Slider label="Stroke Width" value={n(p,'strokeWidth',2)*10} min={1} max={100} step={1}  onChange={v=>up('strokeWidth',v/10)} />
        <Slider label="Spacing"      value={n(p,'spacing',0)}     min={0}   max={100} step={1}    onChange={v=>up('spacing',v)} />
        <Slider label="Variation"    value={n(p,'variation',0)*100} min={0}  max={100} step={1}  onChange={v=>up('variation',v/100)} />
        <Slider label="Opacity"      value={n(p,'opacity',1)*100} min={5}   max={100} step={1}    onChange={v=>up('opacity',v/100)} />
        <AngleSlider label="Rotation" value={n(p,'angle',0)} onChange={v=>up('angle',v)} />
      </Section>
    </>

    case 'diamonds': return <>
      <Section title="Pattern">
        <Slider label="Size"         value={n(p,'size',40)}       min={10}  max={200} step={1}    onChange={v=>up('size',v)} />
        <Slider label="Stroke Width" value={n(p,'strokeWidth',1.5)*10} min={1} max={80} step={1} onChange={v=>up('strokeWidth',v/10)} />
        <Slider label="Variation"    value={n(p,'variation',0)*100} min={0}  max={100} step={1}  onChange={v=>up('variation',v/100)} />
        <Slider label="Opacity"      value={n(p,'opacity',1)*100} min={5}   max={100} step={1}    onChange={v=>up('opacity',v/100)} />
        <AngleSlider label="Rotation" value={n(p,'angle',0)} onChange={v=>up('angle',v)} />
        <Toggle label="Fill Shapes"  value={n(p,'filled',0)}      onChange={v=>up('filled',v)} />
      </Section>
    </>

    case 'triangles': return <>
      <Section title="Pattern">
        <Slider label="Size"         value={n(p,'size',50)}       min={10}  max={200} step={1}    onChange={v=>up('size',v)} />
        <Slider label="Stroke Width" value={n(p,'strokeWidth',1.5)*10} min={1} max={80} step={1} onChange={v=>up('strokeWidth',v/10)} />
        <Slider label="Variation"    value={n(p,'variation',0)*100} min={0}  max={100} step={1}  onChange={v=>up('variation',v/100)} />
        <Slider label="Opacity"      value={n(p,'opacity',1)*100} min={5}   max={100} step={1}    onChange={v=>up('opacity',v/100)} />
        <AngleSlider label="Rotation" value={n(p,'angle',0)} onChange={v=>up('angle',v)} />
        <Toggle label="Fill Shapes"   value={n(p,'filled',0)}     onChange={v=>up('filled',v)} />
        <Toggle label="Alternate Dir" value={n(p,'alternate',1)}  onChange={v=>up('alternate',v)} />
      </Section>
    </>

    case 'zigzag': return <>
      <Section title="Pattern">
        <Slider label="Size"         value={n(p,'size',30)}       min={5}   max={200} step={1}    onChange={v=>up('size',v)} />
        <Slider label="Amplitude"    value={n(p,'amplitude',15)}  min={2}   max={100} step={1}    onChange={v=>up('amplitude',v)} />
        <Slider label="Stroke Width" value={n(p,'strokeWidth',2)*10} min={1} max={80} step={1}   onChange={v=>up('strokeWidth',v/10)} />
        <Slider label="Variation"    value={n(p,'variation',0)*100} min={0}  max={100} step={1}  onChange={v=>up('variation',v/100)} />
        <Slider label="Opacity"      value={n(p,'opacity',1)*100} min={5}   max={100} step={1}    onChange={v=>up('opacity',v/100)} />
        <AngleSlider label="Rotation" value={n(p,'angle',0)} onChange={v=>up('angle',v)} />
      </Section>
    </>

    case 'circles': return <>
      <Section title="Pattern">
        <Slider label="Size"         value={n(p,'size',60)}       min={10}  max={300} step={1}    onChange={v=>up('size',v)} />
        <Slider label="Stroke Width" value={n(p,'strokeWidth',1.5)*10} min={1} max={80} step={1} onChange={v=>up('strokeWidth',v/10)} />
        <Slider label="Variation"    value={n(p,'variation',0)*100} min={0}  max={100} step={1}  onChange={v=>up('variation',v/100)} />
        <Slider label="Opacity"      value={n(p,'opacity',1)*100} min={5}   max={100} step={1}    onChange={v=>up('opacity',v/100)} />
        <AngleSlider label="Rotation" value={n(p,'angle',0)} onChange={v=>up('angle',v)} />
        <Toggle label="Fill Circles" value={n(p,'fill',0)}        onChange={v=>up('fill',v)} />
      </Section>
    </>

    case 'text-pattern': return <>
      <Section title="Text">
        <TextInput label="Text"      value={String(p.text||'STUDIO')} onChange={v=>up('text',v)} />
        <Slider label="Font Size"    value={n(p,'fontSize',32)}   min={8}   max={200} step={1}    onChange={v=>up('fontSize',v)} />
        <Slider label="Opacity"      value={n(p,'opacity',.15)*100} min={1} max={100} step={1}    onChange={v=>up('opacity',v/100)} />
        <Slider label="Angle"        value={n(p,'angle',-30)+90}  min={0}   max={180} step={1}    onChange={v=>up('angle',v-90)} />
        <Slider label="Spacing"      value={n(p,'spacing',20)}    min={0}   max={200} step={1}    onChange={v=>up('spacing',v)} />
      </Section>
      <SelectCtrl label="Weight" value={String(p.fontWeight||'700')} onChange={v=>up('fontWeight',v)} options={[{v:'300',l:'Light'},{v:'400',l:'Regular'},{v:'600',l:'Semibold'},{v:'700',l:'Bold'},{v:'900',l:'Black'}]} />
    </>

    case 'symbol-pattern': return <>
      <Section title="Symbol">
        <TextInput label="Symbol / Emoji" value={String(p.symbol||'✦')} onChange={v=>up('symbol',v)} />
        <Slider label="Size"    value={n(p,'fontSize',28)}   min={8}   max={200} step={1}    onChange={v=>up('fontSize',v)} />
        <Slider label="Opacity" value={n(p,'opacity',.2)*100} min={1}  max={100} step={1}    onChange={v=>up('opacity',v/100)} />
        <Slider label="Spacing" value={n(p,'spacing',40)}    min={10}  max={200} step={1}    onChange={v=>up('spacing',v)} />
        <Slider label="Angle"   value={n(p,'angle',0)+90}    min={0}   max={180} step={1}    onChange={v=>up('angle',v-90)} />
      </Section>
    </>

    case 'custom-tile': return <UploadSection params={p} up={onUpdateParam} uploadImgRef={uploadImgRef} />

    default: return null
  }
}

// ── Palette Section ───────────────────────────────────────────
function PaletteSection({ colors, onChange }: { colors: string[]; onChange: (c: string[]) => void }) {
  return (
    <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid var(--b1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={sectionLabelStyle}>Colours</span>
        <button onClick={() => onChange(generateRandomPalette(colors.length))}
          style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t2)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          Random
        </button>
      </div>
      {/* Palette presets */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
        {Object.entries(PALETTES).map(([name, pal]) => (
          <div key={name} onClick={() => onChange([...pal].slice(0, Math.max(2, colors.length)))} title={name}
            style={{ display: 'flex', height: 20, borderRadius: 4, overflow: 'hidden', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.1s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--acc)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'transparent'}
          >
            {pal.map((c, i) => <div key={i} style={{ width: 12, background: c }} />)}
          </div>
        ))}
      </div>
      {/* Colour swatches */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'flex-end' }}>
        {colors.map((c, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 9, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{i + 1}</span>
            <input type="color" value={c}
              onChange={e => { const nc = [...colors]; nc[i] = e.target.value; onChange(nc) }}
              style={{ width: 28, height: 28, cursor: 'pointer', border: '1px solid var(--b2)', borderRadius: 5, padding: 2, background: 'none' }} />
          </div>
        ))}
        {colors.length < 8 && (
          <button onClick={() => onChange([...colors, '#ffffff'])}
            style={{ width: 28, height: 28, borderRadius: 5, background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t2)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
        )}
        {colors.length > 2 && (
          <button onClick={() => onChange(colors.slice(0, -1))}
            style={{ width: 28, height: 28, borderRadius: 5, background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t2)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
        )}
      </div>
    </div>
  )
}

// ── Upload Section ────────────────────────────────────────────
function UploadSection({ params: p, up, uploadImgRef }: { params: Params; up: (k: string, v: unknown) => void; uploadImgRef: React.MutableRefObject<HTMLImageElement | null> }) {
  function trigger() {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'
    inp.onchange = (e) => {
      const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return
      const rd = new FileReader()
      rd.onload = ev => { const img = new Image(); img.onload = () => { uploadImgRef.current = img; up('tileW', img.width); up('tileH', img.height) }; img.src = ev.target?.result as string }
      rd.readAsDataURL(f)
    }; inp.click()
  }
  return (
    <Section title="Custom Tile" defaultOpen>
      <div onClick={trigger} style={{ border: '1.5px dashed var(--b2)', borderRadius: 8, padding: 14, textAlign: 'center', cursor: 'pointer', color: 'var(--t3)', fontSize: 12, marginBottom: 10 }}>
        {uploadImgRef.current ? 'Image loaded — click to replace' : '+ Upload tile image'}
      </div>
      <Slider label="Scale"    value={n(p,'scale',1)*100}   min={5}    max={1000} step={5}   onChange={v=>up('scale',v/100)} />
      <Slider label="Rotation" value={n(p,'rotation',0)}    min={0}    max={360}  step={1}   onChange={v=>up('rotation',v)} />
      <Slider label="Opacity"  value={n(p,'opacity',1)*100} min={0}    max={100}  step={1}   onChange={v=>up('opacity',v/100)} />
      <Slider label="Offset X" value={n(p,'offX',0)+500}    min={0}    max={1000} step={1}   onChange={v=>up('offX',v-500)} />
      <Slider label="Offset Y" value={n(p,'offY',0)+500}    min={0}    max={1000} step={1}   onChange={v=>up('offY',v-500)} />
    </Section>
  )
}

// ── Shared UI Components ──────────────────────────────────────

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'var(--t3)',
}

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: '1px solid var(--b1)' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', cursor: 'pointer', userSelect: 'none' }}
      >
        <span style={sectionLabelStyle}>{title}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: 'var(--t4)', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      {open && <div style={{ padding: '0 14px 12px' }}>{children}</div>}
    </div>
  )
}

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  const display = step < 1 ? Number(value).toFixed(1) : Math.round(value)
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: 'var(--t2)' }}>{label}</span>
        <span style={{ fontSize: 11, color: 'var(--t1)', fontFamily: 'var(--font-mono)', minWidth: 32, textAlign: 'right' }}>{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        style={{ width: '100%' }}
      />
    </div>
  )
}

function AngleSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: 'var(--t2)' }}>{label}</span>
        <span style={{ fontSize: 11, color: 'var(--t1)', fontFamily: 'var(--font-mono)', minWidth: 32, textAlign: 'right' }}>{Math.round(value)}°</span>
      </div>
      <input type="range" min={0} max={360} step={1} value={value} onChange={e => onChange(+e.target.value)} style={{ width: '100%' }} />
    </div>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const on = !!value
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <span style={{ fontSize: 12, color: 'var(--t2)' }}>{label}</span>
      <div onClick={() => onChange(on ? 0 : 1)} style={{ width: 34, height: 20, borderRadius: 10, background: on ? 'var(--acc)' : 'var(--s4)', border: '1px solid var(--b2)', position: 'relative', cursor: 'pointer', transition: 'background 0.15s', flexShrink: 0 }}>
        <div style={{ position: 'absolute', width: 14, height: 14, borderRadius: '50%', background: '#fff', top: 2, left: on ? 16 : 2, transition: 'left 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
      </div>
    </div>
  )
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <span style={{ fontSize: 12, color: 'var(--t2)' }}>{label}</span>
      <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)}
        style={{ width: 32, height: 28, cursor: 'pointer', border: '1px solid var(--b2)', borderRadius: 6, padding: 2, background: 'none' }} />
    </div>
  )
}

function SelectCtrl({ label, value, options, onChange }: { label: string; value: string; options: {v:string;l:string}[]; onChange: (v: string) => void }) {
  return (
    <div style={{ padding: '0 0 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--t2)' }}>{label}</span>
      </div>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t1)', padding: '7px 10px', borderRadius: 7, fontSize: 12, fontFamily: 'var(--font-sans)', cursor: 'pointer', outline: 'none', appearance: 'none' }}>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  )
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <span style={{ fontSize: 12, color: 'var(--t2)', display: 'block', marginBottom: 5 }}>{label}</span>
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t1)', padding: '7px 10px', borderRadius: 7, fontSize: 12, fontFamily: 'var(--font-sans)', outline: 'none' }} />
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────
function n(p: Params, key: string, def: number): number {
  const v = p[key]
  return (typeof v === 'number' && !isNaN(v)) ? v : def
}
function s(p: Params, key: string, def: string): string {
  return (typeof p[key] === 'string' ? p[key] : def) as string
}
