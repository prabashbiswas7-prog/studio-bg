import type { ToolSlug, Params } from '../types'
import { drawMesh }        from './mesh'
import { drawLinear }      from './linear'
import { drawConic }       from './conic'
import { drawAura }        from './aura'
import { drawDuotone }     from './duotone'
import { drawBlobs }       from './blobs'
import { drawWaves }       from './waves'
import { drawFluid }       from './fluid'
import { drawBokeh }       from './bokeh'
import { drawStarburst }   from './starburst'
import { drawPerlin }      from './perlin'
import { drawMarble }      from './marble'
import { drawSmoke }       from './smoke'
import { drawDither }      from './dither'
import { drawGrid }        from './grid'
import { drawHexGrid }     from './hex'
import { drawCrosshatch }  from './crosshatch'
import { drawPlotter }     from './plotter'
import { draw3DShapes }    from './shapes'
import { drawDotMatrix }   from './dots'
import { drawHalftone }    from './halftone'
import { drawBlocks }      from './blocks'
import { drawTopography }  from './topography'
import { drawVoronoi }     from './voronoi'
import { drawCustomTile }  from './upload'
import { drawChevron, drawDiamonds, drawTriangles, drawZigzag, drawCircles } from './svg-patterns'
import { drawTextPattern, drawSymbolPattern } from './text-pattern'

type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) => void

const DRAW_MAP: Partial<Record<ToolSlug, DrawFn>> = {
  'mesh-gradient':   drawMesh,
  'linear-gradient': drawLinear,
  'conic-sweep':     drawConic,
  'light-aura':      drawAura,
  'duotone':         drawDuotone,
  'blobs':           drawBlobs,
  'waves':           drawWaves,
  'fluid':           drawFluid,
  'bokeh':           drawBokeh,
  'starburst':       drawStarburst,
  'perlin-noise':    drawPerlin,
  'marble':          drawMarble,
  'smoke':           drawSmoke,
  'dither':          drawDither,
  'grid':            drawGrid,
  'hex-grid':        drawHexGrid,
  'crosshatch':      drawCrosshatch,
  'plotter':         drawPlotter,
  '3d-shapes':       draw3DShapes,
  'dot-matrix':      drawDotMatrix,
  'halftone':        drawHalftone,
  'blocks':          drawBlocks,
  'topography':      drawTopography,
  'voronoi':         drawVoronoi,
  'custom-tile':     drawCustomTile,
  'chevron':         drawChevron,
  'diamonds':        drawDiamonds,
  'triangles':       drawTriangles,
  'zigzag':          drawZigzag,
  'circles':         drawCircles,
  'text-pattern':    drawTextPattern,
  'symbol-pattern':  drawSymbolPattern,
}

export function draw(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tool: ToolSlug,
  params: Params
): void {
  try {
    const fn = DRAW_MAP[tool]
    if (fn) fn(ctx, w, h, params)
    else {
      // Fallback — grey placeholder
      ctx.fillStyle = '#1c1d21'
      ctx.fillRect(0, 0, w, h)
    }
  } catch (e) {
    console.warn('Draw error:', tool, e)
    ctx.fillStyle = '#1c1d21'
    ctx.fillRect(0, 0, w, h)
  }
}
