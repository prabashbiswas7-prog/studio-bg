import type { Params } from '../types'
export function drawLinear(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  const colors = p.colors as string[]
  const rad = ((p.angle as number) || 135) * Math.PI / 180
  const cx = w / 2, cy = h / 2, d = Math.hypot(w, h) / 2
  const g = ctx.createLinearGradient(cx - Math.cos(rad)*d, cy - Math.sin(rad)*d, cx + Math.cos(rad)*d, cy + Math.sin(rad)*d)
  ;(colors || ['#000','#fff']).forEach((col, i, arr) => g.addColorStop(i / ((arr.length - 1) || 1), col))
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
}
