import type { Params } from '../types'
import { hexWithAlpha } from '../palettes'
export function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  ctx.fillStyle = p.bg as string || '#050810'; ctx.fillRect(0,0,w,h)
  const cell=p.cell as number||55, lw=p.lw as number||1
  const lineCol=p.lineCol as string||'#1a2540', glowCol=p.glowCol as string||'#4f8ef7'
  const iso=p.iso as number||0, glow=p.glow as number||1
  const angle=((p.angle as number)||0)*Math.PI/180
  ctx.save()
  if (angle) { ctx.translate(w/2,h/2); ctx.rotate(angle); ctx.translate(-w/2,-h/2) }
  if (glow) { ctx.shadowColor=glowCol; ctx.shadowBlur=8 }
  ctx.strokeStyle=lineCol; ctx.lineWidth=lw
  if (iso) {
    const rows=Math.ceil(h/cell)+2, cols=Math.ceil(w/(cell*2))+2
    for (let r=-1;r<rows;r++) for (let c=-1;c<cols;c++) {
      const x=c*cell*2+(r%2)*cell, y=r*cell*.866*2
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+cell,y+cell*.866); ctx.lineTo(x+cell*2,y)
      ctx.moveTo(x+cell,y+cell*.866); ctx.lineTo(x+cell,y+cell*.866*2); ctx.stroke()
    }
  } else {
    for (let x=-cell;x<w+cell;x+=cell) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke() }
    for (let y=-cell;y<h+cell;y+=cell) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke() }
  }
  if (p.fade) {
    const g=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,Math.hypot(w,h)/2)
    g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,hexWithAlpha(p.bg as string||'#050810',.8))
    ctx.shadowBlur=0; ctx.fillStyle=g; ctx.fillRect(0,0,w,h)
  }
  ctx.restore()
}
