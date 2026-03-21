import type { Params } from '../types'
import { hexWithAlpha } from '../palettes'
export function drawCrosshatch(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  ctx.fillStyle = p.bg as string||'#050810'; ctx.fillRect(0,0,w,h)
  const spacing=p.spacing as number||12, lw=p.lw as number||0.8
  const lineCol=p.lineCol as string||'#1a2540', opacity=p.opacity as number||0.85
  const a1=((p.a1 as number)||45)*Math.PI/180, a2=((p.a2 as number)||135)*Math.PI/180
  const layers=p.layers as number||2
  ctx.strokeStyle=hexWithAlpha(lineCol,opacity); ctx.lineWidth=lw
  const D=Math.hypot(w,h)
  for (const ang of [a1,a2].slice(0,layers)) {
    ctx.save(); ctx.translate(w/2,h/2); ctx.rotate(ang); ctx.translate(-w/2,-h/2)
    for (let x=-D;x<w+D;x+=spacing) { ctx.beginPath(); ctx.moveTo(x,-D); ctx.lineTo(x,h+D); ctx.stroke() }
    ctx.restore()
  }
}
