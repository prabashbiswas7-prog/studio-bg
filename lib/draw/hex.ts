import type { Params } from '../types'
import { hexWithAlpha } from '../palettes'
export function drawHexGrid(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  ctx.fillStyle = p.bg as string||'#050810'; ctx.fillRect(0,0,w,h)
  const size=p.size as number||38, gap=p.gap as number||2
  const lineCol=p.lineCol as string||'#1a2540', glowCol=p.glowCol as string||'#4f8ef7'
  const glow=p.glow as number||1, fill=p.fill as number||0, fillOp=p.fillOp as number||0.14
  const r=size-gap, h3=r*Math.sqrt(3)
  const cols=Math.ceil(w/(r*2))+2, rows=Math.ceil(h/h3)+2
  if (glow) { ctx.shadowColor=glowCol; ctx.shadowBlur=10 }
  for (let row=-1;row<rows;row++) for (let col=-1;col<cols;col++) {
    const cx=col*r*1.5+(row%2)*r*.75+(row%2===0?r:r*.75)
    const cy=row*h3*.5+h3/2
    ctx.beginPath()
    for (let i=0;i<6;i++) { const a=i*Math.PI/3; ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a)) }
    ctx.closePath()
    if (fill) { ctx.fillStyle=hexWithAlpha(lineCol,fillOp); ctx.fill() }
    ctx.strokeStyle=lineCol; ctx.lineWidth=1; ctx.stroke()
  }
}
