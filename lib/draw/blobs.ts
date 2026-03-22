import type { Params } from '../types'
import { seedRng, rng } from '../utils'
import { hexWithAlpha } from '../palettes'
export function drawBlobs(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  seedRng(p.seed as number)
  ctx.fillStyle = p.bg as string || '#030414'; ctx.fillRect(0,0,w,h)
  const colors = p.colors as string[]
  const blur = (p.blur as number) || 0
  const opacity = (p.opacity as number) ?? 0.9
  for (let i = 0; i < (p.count as number || 5); i++) {
    const cx = rng()*w, cy = rng()*h, r = ((p.size as number)/100)*Math.min(w,h)*(.25+rng()*.6)
    const col = colors[i % colors.length]
    const pts = 6 + Math.floor(rng()*5), xs: number[] = [], ys: number[] = []
    for (let j = 0; j < pts; j++) { const a=(j/pts)*Math.PI*2,jit=.5+rng()*.6; xs.push(cx+Math.cos(a)*r*jit); ys.push(cy+Math.sin(a)*r*jit) }
    ctx.save()
    if (blur > 0) ctx.filter = `blur(${Math.round(blur * w / 1920)}px)`
    ctx.beginPath()
    ctx.moveTo((xs[0]+xs[pts-1])/2,(ys[0]+ys[pts-1])/2)
    for (let j=0;j<pts;j++){const nx=(j+1)%pts;ctx.quadraticCurveTo(xs[j],ys[j],(xs[j]+xs[nx])/2,(ys[j]+ys[nx])/2)}
    ctx.closePath()
    const g = ctx.createRadialGradient(cx,cy,0,cx,cy,r*1.5)
    g.addColorStop(0,hexWithAlpha(col, opacity))
    g.addColorStop((p.softness as number)/100, hexWithAlpha(col, opacity * 0.3))
    g.addColorStop(1,hexWithAlpha(col,0))
    ctx.fillStyle=g; ctx.fill(); ctx.restore()
  }
}
