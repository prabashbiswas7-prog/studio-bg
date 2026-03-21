// ─── Tool Types ───────────────────────────────────────────────
export type ToolSlug =
  | 'mesh-gradient' | 'linear-gradient' | 'conic-sweep' | 'light-aura' | 'duotone'
  | 'blobs' | 'waves' | 'fluid' | 'bokeh' | 'starburst'
  | 'perlin-noise' | 'marble' | 'smoke' | 'dither'
  | 'grid' | 'hex-grid' | 'crosshatch' | 'plotter' | '3d-shapes'
  | 'dot-matrix' | 'halftone' | 'blocks' | 'topography' | 'voronoi'
  | 'custom-tile'
  | 'chevron' | 'diamonds' | 'triangles' | 'zigzag' | 'circles'
  | 'text-pattern' | 'symbol-pattern'

export type ToolCategory =
  | 'Gradient' | 'Organic' | 'Noise & Texture'
  | 'Lines & Geometry' | 'Blocks & Pattern'
  | 'SVG Patterns' | 'Typography' | 'Custom'

export interface Tool {
  slug: ToolSlug
  name: string
  description: string
  category: ToolCategory
  tags: string[]
  badge?: string
  isNew?: boolean
}

// ─── Params ───────────────────────────────────────────────────
export type Params = Record<string, unknown>

// ─── Layer Types ──────────────────────────────────────────────
export type LayerType = 'grain' | 'vignette' | 'blur' | 'overlay-color' | 'scanlines' | 'noise-overlay'

export interface Layer {
  id: string
  type: LayerType
  label: string
  enabled: boolean
  opacity: number        // 0–100
  params: Params
}

// ─── Canvas Size ──────────────────────────────────────────────
export interface CanvasSize {
  label: string
  width: number
  height: number
  category: 'Standard' | 'Social' | 'Device' | 'Custom'
}

// ─── Export ───────────────────────────────────────────────────
export type ExportFormat = 'png' | 'jpeg' | 'webp' | 'svg' | 'css'

// ─── Studio State ─────────────────────────────────────────────
export interface StudioState {
  tool: ToolSlug
  params: Params
  layers: Layer[]
  canvasWidth: number
  canvasHeight: number
  theme: 'dark' | 'light'
}

// ─── History Entry ────────────────────────────────────────────
export interface HistoryEntry {
  tool: ToolSlug
  params: Params
  layers: Layer[]
}
