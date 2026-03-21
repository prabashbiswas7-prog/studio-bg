import type { Params } from '../types'
import { hexToRgb } from '../palettes'
export function drawStarburst(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  ctx.fillStyle = p.bg as string || '#04050d'; ctx.fillRect(0,0,w,h)
  const cx=(p.cx as number)/100*w, cy=(p.cy as number)/100*h
  const rays=p.rays as number||14, len=(p.length as number)/100*Math.max(w,h)
  const lw=p.width as number||1.4, colors=p.colors as string[]
  const [rv,gv,bv]=hexToRgb(colors[0]||'#4f8ef7')
  for (let i=0;i<rays;i++) {
    const angle=(i/rays)*Math.PI*2
    const x2=cx+Math.cos(angle)*len, y2=cy+Math.sin(angle)*len
    const g=ctx.createLinearGradient(cx,cy,x2,y2)
    g.addColorStop(0,`rgba(${rv},${gv},${bv},.85)`)
    g.addColorStop(1,`rgba(${rv},${gv},${bv},0)`)
    ctx.strokeStyle=g; ctx.lineWidth=lw; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(x2,y2); ctx.stroke()
  }
  if (p.glow) {
    const gc=ctx.createRadialGradient(cx,cy,0,cx,cy,len*.3)
    gc.addColorStop(0,`rgba(${rv},${gv},${bv},.6)`); gc.addColorStop(1,`rgba(${rv},${gv},${bv},0)`)
    ctx.fillStyle=gc; ctx.fillRect(0,0,w,h)
  }
}
