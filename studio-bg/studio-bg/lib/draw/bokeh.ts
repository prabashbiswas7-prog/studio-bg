import type { Params } from '../types'
import { seedRng, rng } from '../utils'
import { hexToRgb } from '../palettes'
export function drawBokeh(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  seedRng(p.seed as number)
  ctx.fillStyle = p.bg as string || '#030415'; ctx.fillRect(0,0,w,h)
  const colors = p.colors as string[]
  for (let i=0;i<(p.count as number||70);i++) {
    const x=rng()*w, y=rng()*h, r=(p.minR as number)+rng()*((p.maxR as number)-(p.minR as number))
    const [rv,gv,bv]=hexToRgb(colors[i%colors.length])
    const al=.05+rng()*.25
    const g=ctx.createRadialGradient(x,y,0,x,y,r)
    g.addColorStop(0,`rgba(${rv},${gv},${bv},${al})`)
    g.addColorStop(.5,`rgba(${rv},${gv},${bv},${al*.4})`)
    g.addColorStop(1,`rgba(${rv},${gv},${bv},0)`)
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill()
    if (p.rings) { ctx.strokeStyle=`rgba(${rv},${gv},${bv},${al*.5})`; ctx.lineWidth=.5+rng()*1.5; ctx.stroke() }
  }
}
