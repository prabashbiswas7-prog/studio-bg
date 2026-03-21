import type { Params } from '../types'
import { hexWithAlpha } from '../palettes'
export function drawConic(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  const cx = ((p.cx as number) / 100) * w, cy = ((p.cy as number) / 100) * h
  const start = ((p.angle as number) || 0) * Math.PI / 180
  const cols = p.colors as string[] || ['#000','#fff']
  const n = cols.length, slice = Math.PI * 2 / n
  for (let i = 0; i < n; i++) {
    const a1 = start + i * slice, a2 = a1 + slice, R = Math.hypot(w, h)
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a1, a2); ctx.closePath()
    const gx = cx + Math.cos((a1+a2)/2)*R/2, gy = cy + Math.sin((a1+a2)/2)*R/2
    const g = ctx.createLinearGradient(cx, cy, gx, gy)
    g.addColorStop(0, hexWithAlpha(cols[i], 0.95))
    g.addColorStop(1, hexWithAlpha(cols[(i+1)%n], 0.95))
    ctx.fillStyle = g; ctx.fill()
  }
}
