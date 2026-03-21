import type { Tool, ToolSlug } from './types'

export const TOOLS: Tool[] = [
  // ── Gradient ─────────────────────────────────────────────
  { slug: 'mesh-gradient',   name: 'Mesh Gradient',    description: 'Multi-point radial gradient',     category: 'Gradient',          tags: ['gradient','mesh','smooth'],        badge: 'GRADIENT' },
  { slug: 'linear-gradient', name: 'Linear Gradient',  description: 'Angle-based colour stops',        category: 'Gradient',          tags: ['gradient','linear','simple'],      badge: 'GRADIENT' },
  { slug: 'conic-sweep',     name: 'Conic Sweep',      description: 'Radial rotation gradient',        category: 'Gradient',          tags: ['gradient','conic','radial'],       badge: 'GRADIENT' },
  { slug: 'light-aura',      name: 'Light Aura',       description: 'Radial glow bloom effect',        category: 'Gradient',          tags: ['glow','aura','light'],             badge: 'GLOW' },
  { slug: 'duotone',         name: 'Duotone',          description: 'Two-colour noise field',          category: 'Gradient',          tags: ['duotone','two-colour','film'],     badge: 'GRADIENT' },

  // ── Organic ───────────────────────────────────────────────
  { slug: 'blobs',           name: 'Blobs',            description: 'Metaball organic shapes',         category: 'Organic',           tags: ['blob','organic','fluid'],          badge: 'ORGANIC' },
  { slug: 'waves',           name: 'Waves',            description: 'Layered sine wave flow',          category: 'Organic',           tags: ['wave','flow','layered'],           badge: 'ORGANIC' },
  { slug: 'fluid',           name: 'Fluid',            description: 'Warped ink pour effect',          category: 'Organic',           tags: ['fluid','ink','warp'],              badge: 'ORGANIC' },
  { slug: 'bokeh',           name: 'Bokeh',            description: 'Depth-of-field light orbs',       category: 'Organic',           tags: ['bokeh','light','circles'],         badge: 'LIGHT' },
  { slug: 'starburst',       name: 'Starburst',        description: 'Lens flare ray burst',            category: 'Organic',           tags: ['starburst','rays','flare'],        badge: 'LIGHT' },

  // ── Noise & Texture ───────────────────────────────────────
  { slug: 'perlin-noise',    name: 'Perlin Noise',     description: 'FBM fractal colour field',        category: 'Noise & Texture',   tags: ['perlin','noise','fractal'],        badge: 'NOISE' },
  { slug: 'marble',          name: 'Marble',           description: 'Stone vein texture',              category: 'Noise & Texture',   tags: ['marble','stone','vein'],           badge: 'NOISE' },
  { slug: 'smoke',           name: 'Smoke',            description: 'Turbulence noise clouds',         category: 'Noise & Texture',   tags: ['smoke','cloud','turbulence'],      badge: 'NOISE' },
  { slug: 'dither',          name: 'Dither',           description: 'Bayer matrix quantize',           category: 'Noise & Texture',   tags: ['dither','bayer','retro'],          badge: 'TEXTURE' },

  // ── Lines & Geometry ──────────────────────────────────────
  { slug: 'grid',            name: 'Grid',             description: 'Lines + isometric option',        category: 'Lines & Geometry',  tags: ['grid','lines','isometric'],        badge: 'LINES' },
  { slug: 'hex-grid',        name: 'Hex Grid',         description: 'Honeycomb cell pattern',          category: 'Lines & Geometry',  tags: ['hex','honeycomb','cells'],         badge: 'LINES' },
  { slug: 'crosshatch',      name: 'Crosshatch',       description: 'Angled line set overlay',         category: 'Lines & Geometry',  tags: ['hatch','lines','angle'],           badge: 'LINES' },
  { slug: 'plotter',         name: 'Plotter Art',      description: 'Pen-plotter wave lines',          category: 'Lines & Geometry',  tags: ['plotter','pen','wave'],            badge: 'LINES' },
  { slug: '3d-shapes',       name: '3D Shapes',        description: 'Reflective geometric objects',    category: 'Lines & Geometry',  tags: ['3d','shapes','sphere','cube'],     badge: '3D' },

  // ── Blocks & Pattern ──────────────────────────────────────
  { slug: 'dot-matrix',      name: 'Dot Matrix',       description: 'Density field of dots',           category: 'Blocks & Pattern',  tags: ['dots','matrix','density'],         badge: 'PATTERN' },
  { slug: 'halftone',        name: 'Halftone',         description: 'Print screen dot pattern',        category: 'Blocks & Pattern',  tags: ['halftone','print','dots'],         badge: 'PATTERN' },
  { slug: 'blocks',          name: 'Blocks',           description: 'Pixel mosaic grid',               category: 'Blocks & Pattern',  tags: ['blocks','pixel','mosaic'],         badge: 'PATTERN' },
  { slug: 'topography',      name: 'Topography',       description: 'Contour elevation lines',         category: 'Blocks & Pattern',  tags: ['topo','contour','map'],            badge: 'PATTERN' },
  { slug: 'voronoi',         name: 'Voronoi',          description: 'Cellular tessellation',           category: 'Blocks & Pattern',  tags: ['voronoi','cellular','cells'],      badge: 'PATTERN' },

  // ── SVG Patterns (NEW) ────────────────────────────────────
  { slug: 'chevron',         name: 'Chevron',          description: 'Repeating arrow chevron',         category: 'SVG Patterns',      tags: ['chevron','arrow','zigzag'],        badge: 'SVG', isNew: true },
  { slug: 'diamonds',        name: 'Diamonds',         description: 'Diamond grid pattern',            category: 'SVG Patterns',      tags: ['diamond','grid','geometric'],      badge: 'SVG', isNew: true },
  { slug: 'triangles',       name: 'Triangles',        description: 'Triangle tessellation',           category: 'SVG Patterns',      tags: ['triangle','tessellation','geo'],   badge: 'SVG', isNew: true },
  { slug: 'zigzag',          name: 'Zigzag',           description: 'Repeating zigzag lines',          category: 'SVG Patterns',      tags: ['zigzag','lines','repeat'],         badge: 'SVG', isNew: true },
  { slug: 'circles',         name: 'Circles',          description: 'Concentric circle pattern',       category: 'SVG Patterns',      tags: ['circles','concentric','rings'],    badge: 'SVG', isNew: true },

  // ── Typography (NEW) ──────────────────────────────────────
  { slug: 'text-pattern',    name: 'Text Pattern',     description: 'Repeated text as texture',        category: 'Typography',        tags: ['text','type','repeat','font'],     badge: 'TYPE', isNew: true },
  { slug: 'symbol-pattern',  name: 'Symbol Pattern',   description: 'Emoji or symbol fill',            category: 'Typography',        tags: ['symbol','emoji','fill'],           badge: 'TYPE', isNew: true },

  // ── Custom ────────────────────────────────────────────────
  { slug: 'custom-tile',     name: 'Custom Tile',      description: 'Upload image and tile it',        category: 'Custom',            tags: ['upload','tile','custom'],          badge: 'CUSTOM' },
]

// Group tools by category for the sidebar
export const TOOL_CATEGORIES = [
  'Gradient',
  'Organic',
  'Noise & Texture',
  'Lines & Geometry',
  'Blocks & Pattern',
  'SVG Patterns',
  'Typography',
  'Custom',
] as const

export function getToolsByCategory(category: string): Tool[] {
  return TOOLS.filter(t => t.category === category)
}

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find(t => t.slug === slug)
}

export function getAllSlugs(): ToolSlug[] {
  return TOOLS.map(t => t.slug)
}
