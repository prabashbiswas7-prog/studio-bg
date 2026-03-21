import type { Params } from '../types'
import { seedRng, rng } from '../utils'
import { hexWithAlpha } from '../palettes'
export function drawWaves(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  seedRng(p.seed as number)
  ctx.fillStyle = p.bg as string || '#080616'; ctx.fillRect(0,0,w,h)
  const n = p.count as number || 6, colors = p.colors as string[]
  for (let i=n-1;i>=0;i--) {
    const col = colors[i%colors.length]
    const amp=(p.amp as number)/100*h*(.05+(i/n)*.08), freq=(p.freq as number)*Math.PI*2/w
    const ph=(p.phase as number)*Math.PI/180+rng()*Math.PI*2, curve=p.curve as number||1
    const yb=h*(.18+i/n*.66)
    ctx.beginPath(); ctx.moveTo(0,h); ctx.lineTo(0,yb)
    for (let x=0;x<=w;x+=3) ctx.lineTo(x,yb+Math.sin(x*freq+ph)*amp*curve+Math.sin(x*freq*1.73+ph*1.3)*amp*.38)
    ctx.lineTo(w,h); ctx.closePath()
    const g=ctx.createLinearGradient(0,yb-amp,0,yb+amp*2)
    g.addColorStop(0,hexWithAlpha(col,.85)); g.addColorStop(1,hexWithAlpha(col,.2))
    ctx.fillStyle=g; ctx.fill()
  }
}
