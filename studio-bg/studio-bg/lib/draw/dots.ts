import type { Params } from '../types'
import { fbm } from '../utils'
import { hexToRgb } from '../palettes'
export function drawDotMatrix(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  ctx.fillStyle = p.bg as string||'#050810'; ctx.fillRect(0,0,w,h)
  const spacing=p.spacing as number||26, minR=p.minR as number||1, maxR=p.maxR as number||5.5
  const dotCol=p.dotCol as string||'#1a2540', noise=p.noise as number||0
  const fade=p.fade as number||1, shape=p.shape as string||'circle'
  const [rv,gv,bv]=hexToRgb(dotCol)
  for (let y=spacing/2;y<h;y+=spacing) for (let x=spacing/2;x<w;x+=spacing) {
    const nx=x+fbm(x/w*2,y/h*2)*spacing*noise
    const ny=y+fbm(x/w*2+99,y/h*2+99)*spacing*noise
    const dist=Math.hypot(nx-w/2,ny-h/2)/Math.hypot(w/2,h/2)
    const r=minR+(maxR-minR)*(fade?1-dist:.5+Math.random()*.5)
    const al=fade?0.5+0.5*(1-dist):0.7
    ctx.fillStyle=`rgba(${rv},${gv},${bv},${al})`
    ctx.beginPath()
    if (shape==='circle') { ctx.arc(nx,ny,r,0,Math.PI*2); ctx.fill() }
    else { ctx.fillRect(nx-r,ny-r,r*2,r*2) }
  }
}
