import type { Params } from '../types'
import { seedRng, rng } from '../utils'
import { hexToRgb, hexWithAlpha } from '../palettes'
export function draw3DShapes(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  seedRng(p.seed as number)
  ctx.fillStyle = p.bg as string||'#040414'; ctx.fillRect(0,0,w,h)
  const colors=p.colors as string[], count=p.count as number||20
  const minSz=p.minSz as number||28, maxSz=p.maxSz as number||185
  const opacity=p.opacity as number||0.88, glow=p.glow as number||1
  const shape=p.shape as string||'mixed'
  const shapes=['sphere','cube','hex','tri','ring']
  for (let i=0;i<count;i++) {
    const x=rng()*w, y=rng()*h, s=minSz+rng()*(maxSz-minSz)
    const col=colors[i%colors.length]
    const sh=shape==='mixed'?shapes[Math.floor(rng()*shapes.length)]:shape
    const [rv,gv,bv]=hexToRgb(col)
    ctx.save()
    ctx.globalAlpha=opacity*(0.4+rng()*0.6)
    if (glow) { ctx.shadowColor=col; ctx.shadowBlur=s*.3 }
    if (sh==='sphere') {
      const g=ctx.createRadialGradient(x-s*.2,y-s*.2,0,x,y,s/2)
      g.addColorStop(0,`rgba(${rv},${gv},${bv},1)`); g.addColorStop(1,`rgba(${Math.floor(rv*.3)},${Math.floor(gv*.3)},${Math.floor(bv*.3)},0.8)`)
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,s/2,0,Math.PI*2); ctx.fill()
    } else if (sh==='ring') {
      ctx.strokeStyle=col; ctx.lineWidth=s*.08; ctx.beginPath(); ctx.arc(x,y,s*.35,0,Math.PI*2); ctx.stroke()
    } else if (sh==='tri') {
      ctx.fillStyle=hexWithAlpha(col,.7); ctx.beginPath()
      ctx.moveTo(x,y-s/2); ctx.lineTo(x+s/2,y+s/2); ctx.lineTo(x-s/2,y+s/2); ctx.closePath(); ctx.fill()
    } else {
      ctx.fillStyle=hexWithAlpha(col,.6)
      for (let si=0;si<6;si++) { const a=si*Math.PI/3; ctx[si===0?'moveTo':'lineTo'](x+s/2*Math.cos(a),y+s/2*Math.sin(a)) }
      ctx.closePath(); ctx.fill()
    }
    ctx.restore()
  }
}
