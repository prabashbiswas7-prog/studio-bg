import type { Params } from '../types'
import { seedRng, rng } from '../utils'
import { hexToRgb } from '../palettes'
export function drawAura(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  seedRng(p.seed as number)
  ctx.fillStyle = p.bg as string || '#04050d'; ctx.fillRect(0,0,w,h)
  const bx = ((p.cx as number)/100)*w, by = ((p.cy as number)/100)*h
  const colors = p.colors as string[]
  for (let i = 0; i < (p.count as number || 3); i++) {
    const x = bx + (rng()-.5)*w*.85, y = by + (rng()-.5)*h*.85
    const r = ((p.size as number)/100)*Math.max(w,h)*(.32+rng()*.55)
    const [rv,gv,bv] = hexToRgb(colors[i % colors.length])
    const soft = (p.softness as number)/100, br = p.brightness as number || .75
    const g = ctx.createRadialGradient(x,y,0,x,y,r)
    g.addColorStop(0,`rgba(${rv},${gv},${bv},${br})`)
    g.addColorStop(soft*.4,`rgba(${rv},${gv},${bv},${br*.35})`)
    g.addColorStop(soft,`rgba(${rv},${gv},${bv},${br*.05})`)
    g.addColorStop(1,`rgba(${rv},${gv},${bv},0)`)
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h)
  }
}
