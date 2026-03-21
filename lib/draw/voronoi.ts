import type { Params } from '../types'
import { seedRng, rng } from '../utils'
import { hexWithAlpha } from '../palettes'
export function drawVoronoi(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  seedRng(p.seed as number)
  ctx.fillStyle = p.bg as string||'#060f0c'; ctx.fillRect(0,0,w,h)
  const colors=p.colors as string[], count=p.count as number||20
  const borders=p.borders as number||1, fill=p.fill as number||1
  const borderOp=p.borderOp as number||0.2, borderW=p.borderW as number||1
  const dots=p.dots as number||1
  const pts=Array.from({length:count},()=>({x:rng()*w,y:rng()*h}))
  const step=4
  for (let y=0;y<h;y+=step) for (let x=0;x<w;x+=step) {
    let minD=Infinity, ni=0
    for (let i=0;i<pts.length;i++) { const d=Math.hypot(x-pts[i].x,y-pts[i].y); if(d<minD){minD=d;ni=i} }
    if (fill) { ctx.fillStyle=hexWithAlpha(colors[ni%colors.length],0.6); ctx.fillRect(x,y,step,step) }
  }
  if (borders) {
    ctx.strokeStyle=hexWithAlpha('#ffffff',borderOp); ctx.lineWidth=borderW
    for (let y=0;y<h;y+=step) for (let x=0;x<w;x+=step) {
      let minD=Infinity,ni=0,ni2=0,minD2=Infinity
      for (let i=0;i<pts.length;i++) { const d=Math.hypot(x-pts[i].x,y-pts[i].y); if(d<minD){minD2=minD;ni2=ni;minD=d;ni=i}else if(d<minD2){minD2=d;ni2=i} }
      if (ni!==ni2&&minD2-minD<step*1.5) { ctx.fillStyle=hexWithAlpha('#ffffff',borderOp); ctx.fillRect(x,y,step,step) }
    }
  }
  if (dots) { pts.forEach((pt,i)=>{ ctx.fillStyle=colors[i%colors.length]; ctx.beginPath(); ctx.arc(pt.x,pt.y,3,0,Math.PI*2); ctx.fill() }) }
}
