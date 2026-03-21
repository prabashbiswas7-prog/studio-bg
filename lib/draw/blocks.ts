import type { Params } from '../types'
import { seedRng, rng, fbm } from '../utils'
import { multiLerp } from '../palettes'
export function drawBlocks(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  seedRng(p.seed as number)
  const colors=p.colors as string[], bw=p.blockW as number||40, bh=p.blockH as number||40
  const gap=p.gap as number||2, round=p.roundness as number||4
  const noiseScale=p.noiseScale as number||2.8, opacity=p.opacity as number||1
  ctx.fillStyle='#000'; ctx.fillRect(0,0,w,h)
  for (let y=0;y<h;y+=bh+gap) for (let x=0;x<w;x+=bw+gap) {
    const n=(fbm(x/w*noiseScale,y/h*noiseScale,3)+1)*.5
    ctx.fillStyle=multiLerp(colors,n); ctx.globalAlpha=opacity
    ctx.beginPath(); ctx.roundRect(x,y,bw,bh,round); ctx.fill()
  }
  ctx.globalAlpha=1
}
