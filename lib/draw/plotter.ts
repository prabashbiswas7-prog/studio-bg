import type { Params } from '../types'
import { seedRng, rng, fbm } from '../utils'
export function drawPlotter(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  seedRng(p.seed as number)
  ctx.fillStyle = p.bg as string||'#f5f0e8'; ctx.fillRect(0,0,w,h)
  const count=p.count as number||120, amp=(p.amp as number)/100*h
  const freq=p.freq as number||3.5, thick=p.thick as number||0.8
  const warp=p.warp as number||1.4, lineCol=p.lineCol as string||'#1a1a2e'
  const style=p.style as string||'wave'
  ctx.strokeStyle=lineCol; ctx.lineWidth=thick
  for (let i=0;i<count;i++) {
    const y0=h*(i/count), ph=rng()*Math.PI*2
    ctx.beginPath()
    for (let x=0;x<=w;x+=2) {
      let y=y0
      if (style==='wave') y+=Math.sin(x/w*freq*Math.PI*2+ph)*amp*(i/count)
      else if (style==='ripple') y+=Math.sin(Math.hypot(x-w/2,y0-h/2)/w*freq*Math.PI*4)*amp*.5
      else if (style==='flow') y+=fbm(x/w*warp+ph,y0/h*warp)*amp
      else y+=Math.abs(((x/w*freq*2)%2)-1)*amp*(i/count)*2-amp*(i/count)
      x===0?ctx.moveTo(x,y):ctx.lineTo(x,y)
    }
    ctx.stroke()
  }
}
