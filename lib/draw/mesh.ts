import type { Params } from '../types'
import { seedRng, rng, applyGrain } from '../utils'
import { hexWithAlpha } from '../palettes'

export function drawMesh(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  const colors = p.colors as string[]
  const points = Math.max(1, (p.points as number) || 6)
  const softness = (p.softness as number) || 78
  const grain = (p.grain as number) || 0
  const seed = (p.seed as number) || 1

  seedRng(seed)
  ctx.fillStyle = colors?.[0] || '#000'
  ctx.fillRect(0, 0, w, h)

  for (let i = 0; i < points; i++) {
    const x = rng() * w, y = rng() * h
    const r = (softness / 100) * Math.max(w, h) * (0.35 + rng() * 0.85)
    const col = (colors || ['#fff'])[i % colors.length]
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, hexWithAlpha(col, 0.9))
    g.addColorStop(1, hexWithAlpha(col, 0))
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  }
  if (grain > 0) applyGrain(ctx, w, h, grain / 100 * 0.45, seed + 1)
}
