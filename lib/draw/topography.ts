import type { Params } from '../types'
import { fbm } from '../utils'
import { hexWithAlpha } from '../palettes'
export function drawTopography(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  ctx.fillStyle = p.bg as string||'#080c18'; ctx.fillRect(0,0,w,h)
  const lineCol=p.lineCol as string||'#1a2d4a', glowCol=p.glowCol as string||'#4a90d9'
  const levels=p.levels as number||26, scale=p.scale as number||2.6
  const lw=p.lw as number||1.1, glow=p.glow as number||1
  const fill=p.fill as number||0, fillOp=p.fillOp as number||0.04
  const step=3
  const field: number[][] = []
  for (let y=0;y<=Math.ceil(h/step);y++) {
    field[y]=[]
    for (let x=0;x<=Math.ceil(w/step);x++) field[y][x]=fbm(x/Math.ceil(w/step)*scale,y/Math.ceil(h/step)*scale,5)
  }
  if (glow) { ctx.shadowColor=glowCol; ctx.shadowBlur=6 }
  for (let l=0;l<levels;l++) {
    const threshold=-1+l*(2/levels)
    ctx.beginPath()
    for (let y=0;y<field.length-1;y++) for (let x=0;x<field[y].length-1;x++) {
      const v=[[field[y][x]>threshold,field[y][x+1]>threshold],[field[y+1][x]>threshold,field[y+1][x+1]>threshold]]
      const px=x*step, py=y*step
      if (v[0][0]!==v[0][1]) { ctx.moveTo(px+step/2,py); ctx.lineTo(px+step/2,py+step) }
      if (v[0][0]!==v[1][0]) { ctx.moveTo(px,py+step/2); ctx.lineTo(px+step,py+step/2) }
    }
    ctx.strokeStyle=lineCol; ctx.lineWidth=lw; ctx.stroke()
    if (fill) { ctx.fillStyle=hexWithAlpha(glowCol,fillOp); ctx.fill() }
  }
}
