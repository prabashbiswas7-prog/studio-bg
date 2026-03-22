import type { ToolSlug, Params } from './types'
import { randInt } from './utils'
import { PALETTES } from './palettes'

// Global params added to every tool
const GLOBAL = {
  brightness: 100,
  contrast:   100,
  saturation: 100,
  depth:      0,
  highlights: 50,
  shadows:    50,
  foldScale:  60,
}

export function getDefaultParams(slug: ToolSlug): Params {
  const g = { ...GLOBAL }
  switch (slug) {
    case 'mesh-gradient':
      return { ...g, colors: [...PALETTES.aurora], points: 7, softness: 78, spread: 50, intensity: 90, blend: 50, grain: 8, grainSize: 1, seed: randInt() }
    case 'linear-gradient':
      return { ...g, colors: [...PALETTES.aurora], angle: 135, smooth: 50, midpoint: 50 }
    case 'conic-sweep':
      return { ...g, colors: [...PALETTES.aurora], angle: 0, cx: 50, cy: 50, spread: 100, softness: 0 }
    case 'light-aura':
      return { ...g, colors: [...PALETTES.cosmic], count: 4, size: 68, softness: 80, brightness: 0.75, spread: 50, glowRadius: 80, scatter: 85, cx: 50, cy: 50, bg: '#04050d', seed: randInt() }
    case 'duotone':
      return { ...g, colorA: '#0a0025', colorB: '#ff6b9d', noiseScale: 3, noiseOct: 4, contrast: 1.2, duoAngle: 0, smooth: 50, seed: randInt() }
    case 'blobs':
      return { ...g, colors: [...PALETTES.ocean], count: 6, size: 60, softness: 70, blur: 8, opacity: 0.9, wobble: 50, complexity: 6, bg: '#030414', seed: randInt() }
    case 'waves':
      return { ...g, colors: [...PALETTES.aurora], count: 6, amp: 38, freq: 2.2, phase: 0, curve: 1, opacity: 1, lineWidth: 0, waveWarp: 0, bg: '#080616', seed: randInt() }
    case 'fluid':
      return { ...g, colors: [...PALETTES.nordic], scale: 2.2, warp: 3.5, octaves: 5, brightness: 1.1, curveDist: 50, detail: 2, flowSpeed: 50, turbulence: 30, seed: randInt() }
    case 'bokeh':
      return { ...g, colors: [...PALETTES.cosmic], count: 70, minR: 15, maxR: 140, opacity: 0.8, rings: 1, bokehBlur: 0, scatter: 100, glow: 50, bg: '#030415', seed: randInt() }
    case 'starburst':
      return { ...g, colors: ['#4f8ef7', '#fffbe6'], rays: 14, length: 82, cx: 50, cy: 50, width: 1.4, glow: 1, rotation: 0, glowInt: 50, falloff: 50, bg: '#04050d', seed: randInt() }
    case 'perlin-noise':
      return { ...g, colors: [...PALETTES.nordic], scale: 3.2, octaves: 5, contrast: 1.3, offX: 0, offY: 0, noiseInt: 55, curveDist: 70, detail: 2, pDepth: 60, pHighlights: 50, pShadows: 55, seed: randInt() }
    case 'marble':
      return { ...g, colors: ['#1a1a2e', '#e8e8d0', '#c8b89a'], scale: 2.8, turb: 5.5, angle: 45, veinDensity: 40, veinWidth: 50, swirl: 30, polish: 70, grain: 5, grainSize: 1, seed: randInt() }
    case 'smoke':
      return { ...g, colors: [...PALETTES.ocean], scale: 2.2, octaves: 6, bright: 1.15, density: 60, turbulence: 40, drift: 30, curl: 50, seed: randInt() }
    case 'dither':
      return { ...g, colors: [...PALETTES.chrome], scale: 3, octaves: 4, ditherSize: 2, mode: 'ordered', contrast: 1.4, noiseInt: 55, curveDist: 70, threshold: 50, seed: randInt() }
    case 'grid':
      return { ...g, bg: '#050810', lineCol: '#1a2540', glowCol: '#4f8ef7', cell: 55, lw: 1, angle: 0, iso: 0, glow: 1, fade: 1, dotCorners: 0, gridOp: 85, glowSize: 8 }
    case 'hex-grid':
      return { ...g, bg: '#050810', lineCol: '#1a2540', glowCol: '#4f8ef7', size: 38, gap: 2, fill: 0, fillOp: 0.14, glow: 1, variant: 'hex', hexRotation: 0, glowSize: 10 }
    case 'crosshatch':
      return { ...g, bg: '#050810', lineCol: '#1a2540', spacing: 12, a1: 45, a2: 135, lw: 0.8, opacity: 0.85, layers: 2, variation: 0 }
    case 'plotter':
      return { ...g, bg: '#f5f0e8', lineCol: '#1a1a2e', count: 120, amp: 35, freq: 3.5, thick: 0.8, warp: 1.4, style: 'wave', noiseMix: 30, lineSpacing: 0, seed: randInt() }
    case '3d-shapes':
      return { ...g, colors: ['#050a20', ...PALETTES.cosmic.slice(1)], count: 20, minSz: 28, maxSz: 185, opacity: 0.88, shape: 'mixed', glow: 1, scatter: 100, glowSize: 30, shapeRot: 0, shapeDepth: 60, shapeHL: 50, shapeShadow: 55, bg: '#040414', seed: randInt() }
    case 'dot-matrix':
      return { ...g, bg: '#050810', dotCol: '#1a2540', glowCol: '#4f8ef7', spacing: 26, minR: 1, maxR: 5.5, fade: 1, shape: 'circle', noise: 0, fadeAmt: 50, dotOp: 100 }
    case 'halftone':
      return { ...g, bg: '#050810', dotCol: '#e0e4f0', size: 16, angle: 45, gamma: 1.3, cmyk: 0, density: 50, halftSoft: 50 }
    case 'blocks':
      return { ...g, colors: [...PALETTES.cosmic], blockW: 40, blockH: 40, gap: 2, roundness: 4, noiseScale: 2.8, noiseInt: 55, curveDist: 70, opacity: 1, variation: 0, seed: randInt() }
    case 'topography':
      return { ...g, bg: '#080c18', lineCol: '#1a2d4a', glowCol: '#4a90d9', levels: 26, scale: 2.6, lw: 1.1, glow: 1, fill: 0, fillOp: 0.04, noiseInt: 55, curveDist: 70, topoDetail: 2, seed: randInt() }
    case 'voronoi':
      return { ...g, colors: [...PALETTES.forest], count: 20, borders: 1, fill: 1, borderOp: 0.2, borderW: 1, cellFill: 0.6, scatter: 100, bg: '#060f0c', dots: 1, seed: randInt() }
    case 'custom-tile':
      return { ...g, tileW: 100, tileH: 100, tintCol: '#ffffff', tintAmt: 0, scale: 1, rotation: 0, bg: '#050810', offX: 0, offY: 0, opacity: 1 }
    case 'chevron':
      return { ...g, fg: '#5b7cf6', bg: '#0e0f11', size: 40, strokeWidth: 2, opacity: 1, angle: 0, spacing: 0, variation: 0 }
    case 'diamonds':
      return { ...g, fg: '#5b7cf6', bg: '#0e0f11', size: 40, strokeWidth: 1.5, filled: 0, opacity: 1, angle: 0, variation: 0 }
    case 'triangles':
      return { ...g, fg: '#5b7cf6', bg: '#0e0f11', size: 50, strokeWidth: 1.5, filled: 0, opacity: 1, alternate: 1, angle: 0, variation: 0 }
    case 'zigzag':
      return { ...g, fg: '#5b7cf6', bg: '#0e0f11', size: 30, strokeWidth: 2, amplitude: 15, opacity: 1, angle: 0, variation: 0 }
    case 'circles':
      return { ...g, fg: '#5b7cf6', bg: '#0e0f11', size: 60, strokeWidth: 1.5, opacity: 1, fill: 0, angle: 0, variation: 0 }
    case 'text-pattern':
      return { ...g, text: 'STUDIO', fg: '#5b7cf6', bg: '#0e0f11', fontSize: 32, fontWeight: '700', opacity: 0.15, angle: -30, spacing: 20, fontFamily: 'sans-serif' }
    case 'symbol-pattern':
      return { ...g, symbol: '✦', fg: '#5b7cf6', bg: '#0e0f11', fontSize: 28, opacity: 0.2, spacing: 40, angle: 0 }
    default:
      return { ...g }
  }
}

export const CANVAS_PRESETS = [
  { label: 'HD',       width: 1920, height: 1080 },
  { label: '2K',       width: 2560, height: 1440 },
  { label: '4K',       width: 3840, height: 2160 },
  { label: '720p',     width: 1280, height: 720  },
  { label: 'Square',   width: 1080, height: 1080 },
  { label: 'Portrait', width: 1080, height: 1920 },
  { label: 'OG Image', width: 1200, height: 628  },
  { label: 'Twitter',  width: 1500, height: 500  },
  { label: 'YouTube',  width: 2048, height: 1152 },
  { label: 'Instagram Story', width: 1080, height: 1920 },
] as const
