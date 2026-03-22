'use client'

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
      {Array.isArray(params.colors) && (
        <PaletteSection colors={params.colors as string[]} onChange={c => onUpdateParam('colors', c)} />
      )}
      {params.colorA !== undefined && (
        <Section title="Colours">
          <ColorRow label="Shadow"    value={params.colorA as string} onChange={v => onUpdateParam('colorA', v)} />
          <ColorRow label="Highlight" value={params.colorB as string} onChange={v => onUpdateParam('colorB', v)} />
        </Section>
      )}
      <ToolControls tool={tool} params={params} onUpdateParam={onUpdateParam} onUpdateParams={onUpdateParams} uploadImgRef={uploadImgRef} />
      {params.seed !== undefined && (
        <Section title="Variation">
          <Btn onClick={() => onUpdateParam('seed', Math.floor(Math.random() * 99999) + 1)} accent>⟳ &nbsp; New Variation</Btn>
          <Row label="Seed">
            <input type="number" value={params.seed as number} onChange={e => onUpdateParam('seed', +e.target.value)} style={{ ...niStyle, width: 80 }} />
          </Row>
        </Section>
      )}
      <div style={{ padding: '10px 14px 16px' }}>
        <Btn onClick={onShuffle}>⇄ &nbsp; Shuffle Everything</Btn>
      </div>
    </div>
  )
}

function ToolControls({ tool, params, onUpdateParam, onUpdateParams, uploadImgRef }: {
  tool: ToolSlug; params: Params
  onUpdateParam: (k: string, v: unknown) => void
  onUpdateParams: (u: Params) => void
  uploadImgRef: React.MutableRefObject<HTMLImageElement | null>
}) {
  const up = onUpdateParam
  switch (tool) {
    case 'mesh-gradient': return <Section title="Settings">
      <Slider label="Points"   k="points"   p={params} min={1}  max={12}  step={1}  up={up} />
      <Slider label="Softness" k="softness" p={params} min={10} max={100} step={1}  up={up} />
      <Slider label="Grain"    k="grain"    p={params} min={0}  max={100} step={1}  up={up} />
    </Section>

    case 'linear-gradient': return <Section title="Settings">
      <AngleWheel label="Angle" k="angle" p={params} up={up} />
    </Section>

    case 'conic-sweep': return <Section title="Settings">
      <AngleWheel label="Start Angle" k="angle" p={params} up={up} />
      <XYPad labelX="Center X" labelY="Center Y" kx="cx" ky="cy" p={params} up={up} />
    </Section>

    case 'light-aura': return <Section title="Settings">
      <Slider label="Count"      k="count"      p={params} min={1}    max={12}  step={1}    up={up} />
      <Slider label="Size %"     k="size"       p={params} min={10}   max={100} step={1}    up={up} />
      <Slider label="Softness"   k="softness"   p={params} min={10}   max={100} step={1}    up={up} />
      <Slider label="Brightness" k="brightness" p={params} min={0.05} max={2}   step={0.05} dec={2} up={up} />
      <XYPad labelX="Base X" labelY="Base Y" kx="cx" ky="cy" p={params} up={up} />
      <ColorRow label="Background" value={params.bg as string} onChange={v => up('bg', v)} />
    </Section>

    case 'duotone': return <Section title="Settings">
      <Slider label="Noise Scale" k="noiseScale" p={params} min={0.5} max={10} step={0.1} dec={1} up={up} />
      <Slider label="Octaves"     k="noiseOct"   p={params} min={1}   max={8}  step={1}   up={up} />
      <Slider label="Contrast"    k="contrast"   p={params} min={0.3} max={4}  step={0.05} dec={2} up={up} />
    </Section>

    case 'blobs': return <Section title="Settings">
      <Slider label="Count"    k="count"    p={params} min={1}  max={20}  step={1}    up={up} />
      <Slider label="Size %"   k="size"     p={params} min={10} max={100} step={1}    up={up} />
      <Slider label="Softness" k="softness" p={params} min={10} max={100} step={1}    up={up} />
      <Slider label="Blur"     k="blur"     p={params} min={0}  max={40}  step={1}    up={up} />
      <Slider label="Opacity"  k="opacity"  p={params} min={0}  max={1}   step={0.01} dec={2} up={up} />
      <ColorRow label="Background" value={params.bg as string} onChange={v => up('bg', v)} />
    </Section>

    case 'waves': return <Section title="Settings">
      <Slider label="Layers"     k="count"     p={params} min={2}   max={16}  step={1}    up={up} />
      <Slider label="Amplitude"  k="amp"       p={params} min={1}   max={100} step={1}    up={up} />
      <Slider label="Frequency"  k="freq"      p={params} min={0.1} max={10}  step={0.1} dec={1} up={up} />
      <Slider label="Phase°"     k="phase"     p={params} min={0}   max={360} step={1}    up={up} />
      <Slider label="Curve mix"  k="curve"     p={params} min={0}   max={2}   step={0.05} dec={2} up={up} />
      <Slider label="Opacity"    k="opacity"   p={params} min={0}   max={1}   step={0.01} dec={2} up={up} />
      <ColorRow label="Background" value={params.bg as string} onChange={v => up('bg', v)} />
    </Section>

    case 'fluid': return <Section title="Settings">
      <Slider label="Scale"      k="scale"      p={params} min={0.5} max={8}   step={0.1} dec={1} up={up} />
      <Slider label="Warp"       k="warp"       p={params} min={0}   max={10}  step={0.1} dec={1} up={up} />
      <Slider label="Octaves"    k="octaves"    p={params} min={1}   max={8}   step={1}   up={up} />
      <Slider label="Brightness" k="brightness" p={params} min={0.5} max={2.5} step={0.05} dec={2} up={up} />
      <Slider label="Contrast"   k="contrast"   p={params} min={0.5} max={3}   step={0.05} dec={2} up={up} />
    </Section>

    case 'bokeh': return <Section title="Settings">
      <Slider label="Count"      k="count"   p={params} min={5}   max={200} step={1}    up={up} />
      <Slider label="Min Radius" k="minR"    p={params} min={5}   max={200} step={5}    up={up} />
      <Slider label="Max Radius" k="maxR"    p={params} min={20}  max={600} step={10}   up={up} />
      <Slider label="Opacity"    k="opacity" p={params} min={0}   max={1}   step={0.01} dec={2} up={up} />
      <Toggle label="Rings" k="rings" p={params} up={up} />
      <ColorRow label="Background" value={params.bg as string} onChange={v => up('bg', v)} />
    </Section>

    case 'starburst': return <Section title="Settings">
      <Slider label="Rays"      k="rays"     p={params} min={3}  max={64}  step={1}    up={up} />
      <Slider label="Length %"  k="length"   p={params} min={10} max={100} step={1}    up={up} />
      <Slider label="Width px"  k="width"    p={params} min={0.5} max={8}  step={0.5} dec={1} up={up} />
      <AngleWheel label="Rotation" k="rotation" p={params} up={up} />
      <Toggle label="Glow" k="glow" p={params} up={up} />
      <XYPad labelX="Origin X" labelY="Origin Y" kx="cx" ky="cy" p={params} up={up} />
      <ColorRow label="Background" value={params.bg as string} onChange={v => up('bg', v)} />
    </Section>

    case 'perlin-noise': return <Section title="Settings">
      <Slider label="Scale"    k="scale"    p={params} min={0.5} max={12}  step={0.1} dec={1} up={up} />
      <Slider label="Octaves"  k="octaves"  p={params} min={1}   max={8}   step={1}   up={up} />
      <Slider label="Contrast" k="contrast" p={params} min={0.3} max={4}   step={0.05} dec={2} up={up} />
      <Slider label="Offset X" k="offX"     p={params} min={-200} max={200} step={1}  up={up} />
      <Slider label="Offset Y" k="offY"     p={params} min={-200} max={200} step={1}  up={up} />
    </Section>

    case 'marble': return <Section title="Settings">
      <Slider label="Scale"       k="scale" p={params} min={0.5} max={10} step={0.1} dec={1} up={up} />
      <Slider label="Turbulence"  k="turb"  p={params} min={0}   max={22} step={0.1} dec={1} up={up} />
      <AngleWheel label="Angle" k="angle" p={params} up={up} />
    </Section>

    case 'smoke': return <Section title="Settings">
      <Slider label="Scale"      k="scale"   p={params} min={0.5} max={8} step={0.1} dec={1} up={up} />
      <Slider label="Octaves"    k="octaves" p={params} min={1}   max={8} step={1}   up={up} />
      <Slider label="Brightness" k="bright"  p={params} min={0.5} max={3} step={0.05} dec={2} up={up} />
    </Section>

    case 'grid': return <Section title="Settings">
      <Slider label="Cell size"  k="cell"  p={params} min={4}   max={400} step={1}    up={up} />
      <Slider label="Line width" k="lw"    p={params} min={0.2} max={8}   step={0.1} dec={1} up={up} />
      <AngleWheel label="Angle" k="angle" p={params} up={up} />
      <Toggle label="Isometric"  k="iso"        p={params} up={up} />
      <Toggle label="Glow"       k="glow"       p={params} up={up} />
      <Toggle label="Fade edges" k="fade"       p={params} up={up} />
      <Toggle label="Dot corners" k="dotCorners" p={params} up={up} />
      <ColorRow label="Background" value={params.bg as string}      onChange={v => up('bg', v)} />
      <ColorRow label="Lines"      value={params.lineCol as string} onChange={v => up('lineCol', v)} />
      <ColorRow label="Glow color" value={params.glowCol as string} onChange={v => up('glowCol', v)} />
    </Section>

    case 'hex-grid': return <Section title="Settings">
      <Slider label="Cell size"    k="size"    p={params} min={6}  max={200} step={1}    up={up} />
      <Slider label="Gap px"       k="gap"     p={params} min={0}  max={20}  step={0.5} dec={1} up={up} />
      <Slider label="Fill opacity" k="fillOp"  p={params} min={0}  max={1}   step={0.01} dec={2} up={up} />
      <Toggle label="Fill cells" k="fill" p={params} up={up} />
      <Toggle label="Glow"       k="glow" p={params} up={up} />
      <ColorRow label="Background" value={params.bg as string}      onChange={v => up('bg', v)} />
      <ColorRow label="Lines"      value={params.lineCol as string} onChange={v => up('lineCol', v)} />
      <ColorRow label="Glow color" value={params.glowCol as string} onChange={v => up('glowCol', v)} />
    </Section>

    case 'crosshatch': return <Section title="Settings">
      <Slider label="Spacing px"  k="spacing" p={params} min={2}   max={100} step={1}    up={up} />
      <Slider label="Line width"  k="lw"      p={params} min={0.1} max={6}   step={0.1} dec={1} up={up} />
      <Slider label="Opacity"     k="opacity" p={params} min={0.05} max={1}  step={0.01} dec={2} up={up} />
      <AngleWheel label="Angle 1" k="a1" p={params} up={up} />
      <AngleWheel label="Angle 2" k="a2" p={params} up={up} />
      <SelectCtrl label="Layers" k="layers" p={params} up={up} options={[{v:'2',l:'2 sets'},{v:'3',l:'3 sets'}]} />
      <ColorRow label="Background" value={params.bg as string}      onChange={v => up('bg', v)} />
      <ColorRow label="Lines"      value={params.lineCol as string} onChange={v => up('lineCol', v)} />
    </Section>

    case 'plotter': return <Section title="Settings">
      <Slider label="Line count"  k="count" p={params} min={20}  max={300} step={1}    up={up} />
      <Slider label="Amplitude %" k="amp"   p={params} min={0}   max={100} step={1}    up={up} />
      <Slider label="Frequency"   k="freq"  p={params} min={0.1} max={12}  step={0.1} dec={1} up={up} />
      <Slider label="Line width"  k="thick" p={params} min={0.2} max={4}   step={0.1} dec={1} up={up} />
      <Slider label="Warp"        k="warp"  p={params} min={0}   max={4}   step={0.1} dec={1} up={up} />
      <SelectCtrl label="Style" k="style" p={params} up={up} options={[{v:'wave',l:'Wave'},{v:'ripple',l:'Ripple'},{v:'flow',l:'Flow'},{v:'zigzag',l:'Zigzag'}]} />
      <ColorRow label="Background" value={params.bg as string}      onChange={v => up('bg', v)} />
      <ColorRow label="Lines"      value={params.lineCol as string} onChange={v => up('lineCol', v)} />
    </Section>

    case '3d-shapes': return <Section title="Settings">
      <Slider label="Count"    k="count"   p={params} min={1}  max={80}  step={1}    up={up} />
      <Slider label="Min size" k="minSz"   p={params} min={5}  max={500} step={5}    up={up} />
      <Slider label="Max size" k="maxSz"   p={params} min={10} max={800} step={5}    up={up} />
      <Slider label="Opacity"  k="opacity" p={params} min={0.05} max={1} step={0.01} dec={2} up={up} />
      <Toggle label="Glow" k="glow" p={params} up={up} />
      <SelectCtrl label="Shape" k="shape" p={params} up={up} options={[{v:'mixed',l:'Mixed'},{v:'sphere',l:'Sphere'},{v:'cube',l:'Cube'},{v:'hex',l:'Hexagon'},{v:'tri',l:'Triangle'},{v:'ring',l:'Ring'}]} />
      <ColorRow label="Background" value={params.bg as string} onChange={v => up('bg', v)} />
    </Section>

    case 'dot-matrix': return <Section title="Settings">
      <Slider label="Spacing"    k="spacing" p={params} min={4}   max={120} step={1}    up={up} />
      <Slider label="Min radius" k="minR"    p={params} min={0.5} max={20}  step={0.5} dec={1} up={up} />
      <Slider label="Max radius" k="maxR"    p={params} min={1}   max={40}  step={0.5} dec={1} up={up} />
      <Slider label="Noise mix"  k="noise"   p={params} min={0}   max={1}   step={0.01} dec={2} up={up} />
      <Toggle label="Radial fade" k="fade" p={params} up={up} />
      <SelectCtrl label="Shape" k="shape" p={params} up={up} options={[{v:'circle',l:'Circle'},{v:'square',l:'Square'}]} />
      <ColorRow label="Background" value={params.bg as string}     onChange={v => up('bg', v)} />
      <ColorRow label="Dot color"  value={params.dotCol as string} onChange={v => up('dotCol', v)} />
    </Section>

    case 'halftone': return <Section title="Settings">
      <Slider label="Size px"  k="size"  p={params} min={4}  max={80} step={1}    up={up} />
      <AngleWheel label="Screen angle" k="angle" p={params} up={up} />
      <Slider label="Gamma"    k="gamma" p={params} min={0.3} max={4} step={0.05} dec={2} up={up} />
      <Toggle label="CMYK mode" k="cmyk" p={params} up={up} />
      <ColorRow label="Background" value={params.bg as string}     onChange={v => up('bg', v)} />
      <ColorRow label="Dot color"  value={params.dotCol as string} onChange={v => up('dotCol', v)} />
    </Section>

    case 'blocks': return <Section title="Settings">
      <Slider label="Block width"  k="blockW"      p={params} min={4}  max={200} step={1}    up={up} />
      <Slider label="Block height" k="blockH"      p={params} min={4}  max={200} step={1}    up={up} />
      <Slider label="Gap px"       k="gap"         p={params} min={0}  max={20}  step={1}    up={up} />
      <Slider label="Roundness"    k="roundness"   p={params} min={0}  max={40}  step={1}    up={up} />
      <Slider label="Noise scale"  k="noiseScale"  p={params} min={0.5} max={8}  step={0.1} dec={1} up={up} />
      <Slider label="Opacity"      k="opacity"     p={params} min={0.1} max={1}  step={0.01} dec={2} up={up} />
    </Section>

    case 'topography': return <Section title="Settings">
      <Slider label="Levels"       k="levels"  p={params} min={4}   max={60} step={1}    up={up} />
      <Slider label="Scale"        k="scale"   p={params} min={0.5} max={8}  step={0.1} dec={1} up={up} />
      <Slider label="Line width"   k="lw"      p={params} min={0.2} max={4}  step={0.1} dec={1} up={up} />
      <Slider label="Fill opacity" k="fillOp"  p={params} min={0}   max={0.3} step={0.005} dec={3} up={up} />
      <Toggle label="Glow" k="glow" p={params} up={up} />
      <Toggle label="Fill tint" k="fill" p={params} up={up} />
      <ColorRow label="Background" value={params.bg as string}      onChange={v => up('bg', v)} />
      <ColorRow label="Lines"      value={params.lineCol as string} onChange={v => up('lineCol', v)} />
      <ColorRow label="Glow color" value={params.glowCol as string} onChange={v => up('glowCol', v)} />
    </Section>

    case 'voronoi': return <Section title="Settings">
      <Slider label="Cell count"     k="count"    p={params} min={3}  max={80} step={1}    up={up} />
      <Slider label="Border opacity" k="borderOp" p={params} min={0}  max={1}  step={0.01} dec={2} up={up} />
      <Slider label="Border width"   k="borderW"  p={params} min={0.2} max={4} step={0.1} dec={1} up={up} />
      <Toggle label="Show borders" k="borders" p={params} up={up} />
      <Toggle label="Fill cells"   k="fill"    p={params} up={up} />
      <Toggle label="Show dots"    k="dots"    p={params} up={up} />
      <ColorRow label="Background" value={params.bg as string} onChange={v => up('bg', v)} />
    </Section>

    // SVG Patterns — all with angle, distance, variation
    case 'chevron': return <Section title="Settings">
      <Slider label="Size px"      k="size"        p={params} min={10}  max={150} step={1}    up={up} />
      <Slider label="Stroke width" k="strokeWidth" p={params} min={0.5} max={12}  step={0.5} dec={1} up={up} />
      <Slider label="Spacing"      k="spacing"     p={params} min={0}   max={60}  step={1}    up={up} />
      <Slider label="Opacity"      k="opacity"     p={params} min={0}   max={1}   step={0.01} dec={2} up={up} />
      <AngleWheel label="Rotation" k="angle" p={params} up={up} />
      <ColorRow label="Foreground"  value={params.fg as string} onChange={v => up('fg', v)} />
      <ColorRow label="Background"  value={params.bg as string} onChange={v => up('bg', v)} />
    </Section>

    case 'diamonds': return <Section title="Settings">
      <Slider label="Size px"      k="size"        p={params} min={10}  max={150} step={1}    up={up} />
      <Slider label="Stroke width" k="strokeWidth" p={params} min={0.5} max={8}   step={0.5} dec={1} up={up} />
      <Slider label="Variation"    k="variation"   p={params} min={0}   max={1}   step={0.01} dec={2} up={up} />
      <Slider label="Opacity"      k="opacity"     p={params} min={0}   max={1}   step={0.01} dec={2} up={up} />
      <AngleWheel label="Rotation" k="angle" p={params} up={up} />
      <Toggle label="Fill shapes" k="filled" p={params} up={up} />
      <ColorRow label="Foreground" value={params.fg as string} onChange={v => up('fg', v)} />
      <ColorRow label="Background" value={params.bg as string} onChange={v => up('bg', v)} />
    </Section>

    case 'triangles': return <Section title="Settings">
      <Slider label="Size px"      k="size"        p={params} min={10}  max={150} step={1}    up={up} />
      <Slider label="Stroke width" k="strokeWidth" p={params} min={0.5} max={8}   step={0.5} dec={1} up={up} />
      <Slider label="Variation"    k="variation"   p={params} min={0}   max={1}   step={0.01} dec={2} up={up} />
      <Slider label="Opacity"      k="opacity"     p={params} min={0}   max={1}   step={0.01} dec={2} up={up} />
      <AngleWheel label="Rotation" k="angle" p={params} up={up} />
      <Toggle label="Fill shapes"   k="filled"    p={params} up={up} />
      <Toggle label="Alternate dir" k="alternate" p={params} up={up} />
      <ColorRow label="Foreground" value={params.fg as string} onChange={v => up('fg', v)} />
      <ColorRow label="Background" value={params.bg as string} onChange={v => up('bg', v)} />
    </Section>

    case 'zigzag': return <Section title="Settings">
      <Slider label="Size px"      k="size"        p={params} min={10}  max={120} step={1}    up={up} />
      <Slider label="Amplitude"    k="amplitude"   p={params} min={5}   max={80}  step={1}    up={up} />
      <Slider label="Stroke width" k="strokeWidth" p={params} min={0.5} max={8}   step={0.5} dec={1} up={up} />
      <Slider label="Variation"    k="variation"   p={params} min={0}   max={1}   step={0.01} dec={2} up={up} />
      <Slider label="Opacity"      k="opacity"     p={params} min={0}   max={1}   step={0.01} dec={2} up={up} />
      <AngleWheel label="Rotation" k="angle" p={params} up={up} />
      <ColorRow label="Foreground" value={params.fg as string} onChange={v => up('fg', v)} />
      <ColorRow label="Background" value={params.bg as string} onChange={v => up('bg', v)} />
    </Section>

    case 'circles': return <Section title="Settings">
      <Slider label="Size px"      k="size"        p={params} min={10}  max={200} step={1}    up={up} />
      <Slider label="Stroke width" k="strokeWidth" p={params} min={0.5} max={10}  step={0.5} dec={1} up={up} />
      <Slider label="Variation"    k="variation"   p={params} min={0}   max={1}   step={0.01} dec={2} up={up} />
      <Slider label="Opacity"      k="opacity"     p={params} min={0}   max={1}   step={0.01} dec={2} up={up} />
      <AngleWheel label="Rotation" k="angle" p={params} up={up} />
      <Toggle label="Fill circles" k="fill" p={params} up={up} />
      <ColorRow label="Foreground" value={params.fg as string} onChange={v => up('fg', v)} />
      <ColorRow label="Background" value={params.bg as string} onChange={v => up('bg', v)} />
    </Section>

    case 'text-pattern': return <Section title="Settings">
      <TextInput label="Text"       value={params.text as string}      onChange={v => up('text', v)} />
      <Slider label="Font size"    k="fontSize" p={params} min={8}   max={120} step={1}    up={up} />
      <Slider label="Opacity"      k="opacity"  p={params} min={0}   max={1}   step={0.01} dec={2} up={up} />
      <Slider label="Angle°"       k="angle"    p={params} min={-90} max={90}  step={1}    up={up} />
      <Slider label="Spacing"      k="spacing"  p={params} min={0}   max={100} step={1}    up={up} />
      <SelectCtrl label="Weight" k="fontWeight" p={params} up={up} options={[{v:'300',l:'Light'},{v:'400',l:'Regular'},{v:'600',l:'Semibold'},{v:'700',l:'Bold'},{v:'900',l:'Black'}]} />
      <ColorRow label="Text color"  value={params.fg as string} onChange={v => up('fg', v)} />
      <ColorRow label="Background"  value={params.bg as string} onChange={v => up('bg', v)} />
    </Section>

    case 'symbol-pattern': return <Section title="Settings">
      <TextInput label="Symbol / emoji" value={params.symbol as string} onChange={v => up('symbol', v)} />
      <Slider label="Size"    k="fontSize" p={params} min={8}   max={120} step={1}    up={up} />
      <Slider label="Opacity" k="opacity"  p={params} min={0}   max={1}   step={0.01} dec={2} up={up} />
      <Slider label="Spacing" k="spacing"  p={params} min={10}  max={150} step={1}    up={up} />
      <Slider label="Angle°"  k="angle"    p={params} min={-90} max={90}  step={1}    up={up} />
      <ColorRow label="Color"      value={params.fg as string} onChange={v => up('fg', v)} />
      <ColorRow label="Background" value={params.bg as string} onChange={v => up('bg', v)} />
    </Section>

    case 'custom-tile': return <UploadSection params={params} onUpdateParam={onUpdateParam} uploadImgRef={uploadImgRef} />

    default: return null
  }
}

// ── Palette ─────────────────────────────────────────────────────
function PaletteSection({ colors, onChange }: { colors: string[]; onChange: (c: string[]) => void }) {
  return (
    <div style={{ borderBottom: '1px solid var(--b1)', padding: '12px 14px' }}>
      <div style={labelStyle}>Palette</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
        {Object.entries(PALETTES).map(([name, pal]) => (
          <div key={name} onClick={() => onChange([...pal].slice(0, Math.max(2, colors.length)))} title={name}
            style={{ display: 'flex', height: 22, borderRadius: 5, overflow: 'hidden', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.1s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--acc)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'transparent'}
          >
            {pal.map((c, i) => <div key={i} style={{ width: 14, background: c }} />)}
          </div>
        ))}
      </div>
      <button onClick={() => onChange(generateRandomPalette(colors.length))} style={{ ...btnBaseStyle, marginBottom: 10 }}>✦ Random Palette</button>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'flex-end' }}>
        {colors.map((c, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 9, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{i + 1}</span>
            <input type="color" value={c} onChange={e => { const nc = [...colors]; nc[i] = e.target.value; onChange(nc) }} style={{ width: 28, height: 28, cursor: 'pointer' }} />
          </div>
        ))}
        {colors.length < 8 && <button onClick={() => onChange([...colors, '#ffffff'])} style={{ width: 28, height: 28, borderRadius: 5, background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t2)', cursor: 'pointer', fontSize: 16 }}>+</button>}
        {colors.length > 2 && <button onClick={() => onChange(colors.slice(0, -1))} style={{ width: 28, height: 28, borderRadius: 5, background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t2)', cursor: 'pointer', fontSize: 16 }}>−</button>}
      </div>
    </div>
  )
}

// ── Upload ───────────────────────────────────────────────────────
function UploadSection({ params, onUpdateParam, uploadImgRef }: { params: Params; onUpdateParam: (k: string, v: unknown) => void; uploadImgRef: React.MutableRefObject<HTMLImageElement | null> }) {
  function trigger() {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'
    inp.onchange = (e) => {
      const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return
      const rd = new FileReader()
      rd.onload = ev => { const img = new Image(); img.onload = () => { uploadImgRef.current = img; onUpdateParam('tileW', img.width); onUpdateParam('tileH', img.height) }; img.src = ev.target?.result as string }
      rd.readAsDataURL(f)
    }; inp.click()
  }
  return (
    <Section title="Custom Tile">
      <div onClick={trigger} style={{ border: '1.5px dashed var(--b2)', borderRadius: 8, padding: 14, textAlign: 'center', cursor: 'pointer', color: 'var(--t3)', fontSize: 12, marginBottom: 10 }}>
        {uploadImgRef.current ? 'Image loaded — click to replace' : 'Click to upload tile image'}
      </div>
      <Slider label="Scale"    k="scale"    p={params} min={0.05} max={10}  step={0.05} dec={2} up={onUpdateParam} />
      <Slider label="Rotation" k="rotation" p={params} min={0}    max={360} step={1}    up={onUpdateParam} />
      <Slider label="Opacity"  k="opacity"  p={params} min={0}    max={1}   step={0.01} dec={2} up={onUpdateParam} />
      <Slider label="Offset X" k="offX"     p={params} min={-500} max={500} step={1}    up={onUpdateParam} />
      <Slider label="Offset Y" k="offY"     p={params} min={-500} max={500} step={1}    up={onUpdateParam} />
    </Section>
  )
}

// ── Shared UI ────────────────────────────────────────────────────
const niStyle: React.CSSProperties = { background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t1)', padding: '4px 6px', borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-mono)', textAlign: 'right' as const, outline: 'none' }
const btnBaseStyle: React.CSSProperties = { width: '100%', padding: '8px', background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t1)', borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: 'pointer', display: 'block', textAlign: 'center' as const, fontFamily: 'var(--font-sans)' }
const labelStyle: React.CSSProperties = { fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'var(--t3)', marginBottom: 10 }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--b1)' }}>
      <div style={labelStyle}>{title}</div>
      {children}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: 'var(--t2)' }}>{label}</span>
      {children}
    </div>
  )
}

function Btn({ onClick, accent, children }: { onClick: () => void; accent?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ ...btnBaseStyle, marginBottom: 8, ...(accent ? { background: 'var(--acc)', color: '#fff', border: 'none' } : {}) }}>
      {children}
    </button>
  )
}

function Slider({ label, k, p, min, max, step, dec = 0, up }: { label: string; k: string; p: Params; min: number; max: number; step: number; dec?: number; up: (k: string, v: unknown) => void }) {
  const val = p[k] as number ?? 0
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--t2)' }}>{label}</span>
        <span style={{ fontSize: 11, color: 'var(--acc)', fontFamily: 'var(--font-mono)' }}>{Number(val).toFixed(dec)}</span>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input type="range" min={min} max={max} step={step} value={val} onChange={e => up(k, +e.target.value)} style={{ flex: 1 }} />
        <input type="number" value={Number(val).toFixed(dec)} min={min} max={max} step={step} onChange={e => up(k, +e.target.value)} style={{ ...niStyle, width: 52 }} />
      </div>
    </div>
  )
}

function Toggle({ label, k, p, up }: { label: string; k: string; p: Params; up: (k: string, v: unknown) => void }) {
  const val = p[k] as number
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ fontSize: 11, color: 'var(--t2)' }}>{label}</span>
      <div onClick={() => up(k, val ? 0 : 1)} style={{ width: 32, height: 18, borderRadius: 9, background: val ? 'var(--acc)' : 'var(--s4)', border: '1px solid var(--b2)', position: 'relative', cursor: 'pointer', transition: 'background 0.15s' }}>
        <div style={{ position: 'absolute', width: 12, height: 12, borderRadius: '50%', background: '#fff', top: 2, left: val ? 16 : 2, transition: 'left 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
      </div>
    </div>
  )
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ fontSize: 11, color: 'var(--t2)' }}>{label}</span>
      <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)} style={{ width: 30, height: 26, cursor: 'pointer' }} />
    </div>
  )
}

function AngleWheel({ label, k, p, up }: { label: string; k: string; p: Params; up: (k: string, v: unknown) => void }) {
  const val = (p[k] as number) ?? 0
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--t2)' }}>{label}</span>
        <span style={{ fontSize: 11, color: 'var(--acc)', fontFamily: 'var(--font-mono)' }}>{Math.round(val)}°</span>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div
          style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--s3)', border: '1px solid var(--b2)', position: 'relative', cursor: 'crosshair', flexShrink: 0 }}
          onMouseDown={e => {
            const el = e.currentTarget
            const move = (ev: MouseEvent) => { const r = el.getBoundingClientRect(); const a = ((Math.atan2(ev.clientY-(r.top+r.height/2),ev.clientX-(r.left+r.width/2))*180/Math.PI)+90+360)%360; up(k,a) }
            const end = () => { window.removeEventListener('mousemove',move); window.removeEventListener('mouseup',end) }
            window.addEventListener('mousemove',move); window.addEventListener('mouseup',end)
          }}
        >
          <div style={{ position: 'absolute', width: 2, height: 12, background: 'var(--acc)', borderRadius: 1, left: '50%', bottom: '50%', transformOrigin: 'bottom center', marginLeft: -1, transform: `rotate(${val}deg)` }} />
        </div>
        <input type="range" min={0} max={360} step={1} value={val} onChange={e => up(k, +e.target.value)} style={{ flex: 1 }} />
        <input type="number" value={Math.round(val)} min={0} max={360} onChange={e => up(k, +e.target.value)} style={{ ...niStyle, width: 52 }} />
      </div>
    </div>
  )
}

function XYPad({ labelX, labelY, kx, ky, p, up }: { labelX: string; labelY: string; kx: string; ky: string; p: Params; up: (k: string, v: unknown) => void }) {
  const x = (p[kx] as number) ?? 50
  const y = (p[ky] as number) ?? 50
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, color: 'var(--t2)', marginBottom: 6 }}>{labelX} / {labelY}</div>
      <div
        style={{ width: '100%', height: 80, background: 'var(--s3)', border: '1px solid var(--b2)', borderRadius: 7, position: 'relative', cursor: 'crosshair', marginBottom: 6, overflow: 'hidden' }}
        onMouseDown={e => {
          const el = e.currentTarget
          const update = (ev: MouseEvent) => { const r = el.getBoundingClientRect(); up(kx, Math.round(Math.max(0,Math.min(100,(ev.clientX-r.left)/r.width*100))*10)/10); up(ky, Math.round(Math.max(0,Math.min(100,(ev.clientY-r.top)/r.height*100))*10)/10) }
          update(e.nativeEvent)
          const end = () => { window.removeEventListener('mousemove',update); window.removeEventListener('mouseup',end) }
          window.addEventListener('mousemove',update); window.addEventListener('mouseup',end); e.preventDefault()
        }}
      >
        <div style={{ position: 'absolute', width: '100%', height: 1, background: 'var(--b2)', top: `${y}%` }} />
        <div style={{ position: 'absolute', height: '100%', width: 1, background: 'var(--b2)', left: `${x}%` }} />
        <div style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: 'var(--acc)', transform: 'translate(-50%,-50%)', left: `${x}%`, top: `${y}%`, pointerEvents: 'none', boxShadow: '0 0 0 3px var(--accs)' }} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>X</span>
          <input type="number" value={x.toFixed(1)} min={0} max={100} step={0.5} onChange={e => up(kx, +e.target.value)} style={{ ...niStyle, flex: 1, width: 0 }} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>Y</span>
          <input type="number" value={y.toFixed(1)} min={0} max={100} step={0.5} onChange={e => up(ky, +e.target.value)} style={{ ...niStyle, flex: 1, width: 0 }} />
        </div>
      </div>
    </div>
  )
}

function SelectCtrl({ label, k, p, up, options }: { label: string; k: string; p: Params; up: (k: string, v: unknown) => void; options: {v:string;l:string}[] }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <span style={{ fontSize: 11, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>{label}</span>
      <select value={p[k] as string} onChange={e => up(k, e.target.value)} style={{ width: '100%', background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t1)', padding: '6px 8px', borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-sans)', cursor: 'pointer', outline: 'none' }}>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  )
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <span style={{ fontSize: 11, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>{label}</span>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', background: 'var(--s3)', border: '1px solid var(--b2)', color: 'var(--t1)', padding: '6px 8px', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-sans)', outline: 'none' }} />
    </div>
  )
}
