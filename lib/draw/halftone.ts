import type { Params } from '../types'
import { fbm } from '../utils'
import { hexToRgb } from '../palettes'
export function drawHalftone(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  ctx.fillStyle = p.bg as string||'#050810'; ctx.fillRect(0,0,w,h)
  const size=p.size as number||16, angle=((p.angle as number)||45)*Math.PI/180
  const dotCol=p.dotCol as string||'#e0e4f0', gamma=p.gamma as number||1.3
  const [rv,gv,bv]=hexToRgb(dotCol)
  ctx.save(); ctx.translate(w/2,h/2); ctx.rotate(angle); ctx.translate(-w/2,-h/2)
  const D=Math.hypot(w,h)
  for (let y=-D/2;y<h+D/2;y+=size) for (let x=-D/2;x<w+D/2;x+=size) {
    let n=fbm(x/w*3,y/h*3,4); n=(n+1)*.5; n=Math.pow(Math.max(0,Math.min(1,n)),1/gamma)
    const r=n*size*.5
    ctx.fillStyle=`rgba(${rv},${gv},${bv},0.85)`
    ctx.beginPath(); ctx.arc(x+size/2,y+size/2,r,0,Math.PI*2); ctx.fill()
  }
  ctx.restore()
}
