import type { Params } from '../types'
import { seedRng, fbm } from '../utils'
import { multiLerp } from '../palettes'
export function drawFluid(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  seedRng(p.seed as number)
  const colors=p.colors as string[], scale=p.scale as number||2.2
  const warp=p.warp as number||3.5, octaves=p.octaves as number||5
  const bright=p.brightness as number||1.1
  const img=ctx.createImageData(w,h); const d=img.data; const step=2
  for (let y=0;y<h;y+=step) for (let x=0;x<w;x+=step) {
    const ox=fbm(x/w*scale,y/h*scale,octaves)*warp
    const oy=fbm(x/w*scale+99,y/h*scale+99,octaves)*warp
    let n=fbm(x/w*scale+ox,y/h*scale+oy,octaves)
    n=Math.max(0,Math.min(1,(n+1)*.5*bright))
    const hex=multiLerp(colors,n)
    const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16)
    for (let py=0;py<step&&y+py<h;py++) for (let px=0;px<step&&x+px<w;px++) {
      const idx=((y+py)*w+(x+px))*4; d[idx]=r;d[idx+1]=g;d[idx+2]=b;d[idx+3]=255
    }
  }
  ctx.putImageData(img,0,0)
}
