import type { ToolSlug, Params } from './types'
import { randInt } from './utils'
import { PALETTES } from './palettes'

export function getDefaultParams(slug: ToolSlug): Params {
  switch (slug) {
    case 'mesh-gradient':
      return { colors: [...PALETTES.aurora], points: 7, softness: 78, grain: 8, seed: randInt() }
    case 'linear-gradient':
      return { colors: [...PALETTES.aurora], angle: 135 }
    case 'conic-sweep':
      return { colors: [...PALETTES.aurora], angle: 0, cx: 50, cy: 50 }
    case 'light-aura':
      return { colors: [...PALETTES.cosmic], count: 4, size: 68, softness: 80, brightness: 0.75, bg: '#04050d', cx: 50, cy: 50, seed: randInt() }
    case 'duotone':
      return { colorA: '#0a0025', colorB: '#ff6b9d', noiseScale: 3, noiseOct: 4, contrast: 1.2, seed: randInt() }
    case 'blobs':
      return { colors: [...PALETTES.ocean], count: 6, size: 60, softness: 70, bg: '#030414', blur: 8, opacity: 0.9, seed: randInt() }
    case 'waves':
      return { colors: [...PALETTES.aurora], count: 6, amp: 38, freq: 2.2, phase: 0, curve: 1, lineWidth: 0, opacity: 1, bg: '#080616', seed: randInt() }
    case 'fluid':
      return { colors: [...PALETTES.nordic], scale: 2.2, warp: 3.5, octaves: 5, brightness: 1.1, contrast: 1.0, seed: randInt() }
    case 'bokeh':
      return { colors: [...PALETTES.cosmic], count: 70, minR: 15, maxR: 140, rings: 1, blur: 0, opacity: 0.8, bg: '#030415', seed: randInt() }
    case 'starburst':
      return { colors: ['#4f8ef7', '#fffbe6'], rays: 14, length: 82, cx: 50, cy: 50, width: 1.4, glow: 1, rotation: 0, bg: '#04050d', seed: randInt() }
    case 'perlin-noise':
      return { colors: [...PALETTES.nordic], scale: 3.2, octaves: 5, contrast: 1.3, offX: 0, offY: 0, seed: randInt() }
    case 'marble':
      return { colors: ['#1a1a2e', '#e8e8d0', '#c8b89a'], scale: 2.8, turb: 5.5, angle: 45, seed: randInt() }
    case 'smoke':
      return { colors: [...PALETTES.ocean], scale: 2.2, octaves: 6, bright: 1.15, seed: randInt() }
    case 'dither':
      return { colors: [...PALETTES.chrome], scale: 3, octaves: 4, ditherSize: 2, mode: 'ordered', contrast: 1.4, seed: randInt() }
    case 'grid':
      return { bg: '#050810', lineCol: '#1a2540', glowCol: '#4f8ef7', cell: 55, lw: 1, angle: 0, iso: 0, glow: 1, fade: 1, dotCorners: 0 }
    case 'hex-grid':
      return { bg: '#050810', lineCol: '#1a2540', glowCol: '#4f8ef7', size: 38, gap: 2, fill: 0, fillOp: 0.14, glow: 1, variant: 'hex' }
    case 'crosshatch':
      return { bg: '#050810', lineCol: '#1a2540', spacing: 12, a1: 45, a2: 135, lw: 0.8, opacity: 0.85, layers: 2 }
    case 'plotter':
      return { bg: '#f5f0e8', lineCol: '#1a1a2e', count: 120, amp: 35, freq: 3.5, thick: 0.8, warp: 1.4, style: 'wave', seed: randInt() }
    case '3d-shapes':
      return { colors: ['#050a20', ...PALETTES.cosmic.slice(1)], count: 20, minSz: 28, maxSz: 185, opacity: 0.88, shape: 'mixed', glow: 1, bg: '#040414', seed: randInt() }
    case 'dot-matrix':
      return { bg: '#050810', dotCol: '#1a2540', glowCol: '#4f8ef7', spacing: 26, minR: 1, maxR: 5.5, fade: 1, shape: 'circle', noise: 0 }
    case 'halftone':
      return { bg: '#050810', dotCol: '#e0e4f0', size: 16, angle: 45, gamma: 1.3, cmyk: 0 }
    case 'blocks':
      return { colors: [...PALETTES.cosmic], blockW: 40, blockH: 40, gap: 2, roundness: 4, noiseScale: 2.8, opacity: 1, seed: randInt() }
    case 'topography':
      return { bg: '#080c18', lineCol: '#1a2d4a', glowCol: '#4a90d9', levels: 26, scale: 2.6, lw: 1.1, glow: 1, fill: 0, fillOp: 0.04, seed: randInt() }
    case 'voronoi':
      return { colors: [...PALETTES.forest], count: 20, borders: 1, fill: 1, borderOp: 0.2, borderW: 1, bg: '#060f0c', dots: 1, seed: randInt() }
    case 'custom-tile':
      return { tileW: 100, tileH: 100, tintCol: '#ffffff', tintAmt: 0, scale: 1, rotation: 0, bg: '#050810', offX: 0, offY: 0, opacity: 1 }
    // SVG Patterns — now with angle, distance, variation
    case 'chevron':
      return { fg: '#5b7cf6', bg: '#0e0f11', size: 40, strokeWidth: 2, opacity: 1, angle: 0, spacing: 0, variation: 0 }
    case 'diamonds':
      return { fg: '#5b7cf6', bg: '#0e0f11', size: 40, strokeWidth: 1.5, filled: 0, opacity: 1, angle: 0, variation: 0 }
    case 'triangles':
      return { fg: '#5b7cf6', bg: '#0e0f11', size: 50, strokeWidth: 1.5, filled: 0, opacity: 1, alternate: 1, angle: 0, variation: 0 }
    case 'zigzag':
      return { fg: '#5b7cf6', bg: '#0e0f11', size: 30, strokeWidth: 2, amplitude: 15, opacity: 1, angle: 0, variation: 0 }
    case 'circles':
      return { fg: '#5b7cf6', bg: '#0e0f11', size: 60, strokeWidth: 1.5, opacity: 1, fill: 0, angle: 0, variation: 0 }
    // Typography
    case 'text-pattern':
      return { text: 'STUDIO', fg: '#5b7cf6', bg: '#0e0f11', fontSize: 32, fontWeight: '700', opacity: 0.15, angle: -30, spacing: 20, fontFamily: 'sans-serif' }
    case 'symbol-pattern':
      return { symbol: '✦', fg: '#5b7cf6', bg: '#0e0f11', fontSize: 28, opacity: 0.2, spacing: 40, angle: 0 }
    default:
      return {}
  }
}

export const CANVAS_PRESETS = [
  { label: 'HD 1080p',        width: 1920, height: 1080 },
  { label: '2K',              width: 2560, height: 1440 },
  { label: '4K',              width: 3840, height: 2160 },
  { label: '720p',            width: 1280, height: 720  },
  { label: 'Square',          width: 1080, height: 1080 },
  { label: 'Portrait',        width: 1080, height: 1920 },
  { label: 'OG Image',        width: 1200, height: 628  },
  { label: 'Twitter Banner',  width: 1500, height: 500  },
  { label: 'YouTube Thumb',   width: 2048, height: 1152 },
  { label: 'Instagram Story', width: 1080, height: 1920 },
  { label: 'LinkedIn Banner', width: 1584, height: 396  },
] as const
