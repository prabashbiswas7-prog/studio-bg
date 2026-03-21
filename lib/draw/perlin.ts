import type { Params } from '../types'
import { fbm } from '../utils'
import { multiLerp } from '../palettes'
export function drawPerlin(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  const colors=p.colors as string[], scale=p.scale as number||3.2
  const octaves=p.octaves as number||5, contrast=p.contrast as number||1.3
  const offX=p.offX as number||0, offY=p.offY as number||0
  const img=ctx.createImageData(w,h); const d=img.data
  const step=2
  for (let y=0;y<h;y+=step) for (let x=0;x<w;x+=step) {
    let n=fbm((x+offX)/w*scale,(y+offY)/h*scale,octaves)
    n=(n+1)*.5; n=Math.pow(Math.max(0,Math.min(1,n)),1/contrast)
    const hex=multiLerp(colors,n)
    const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16)
    for (let py=0;py<step&&y+py<h;py++) for (let px=0;px<step&&x+px<w;px++) {
      const idx=((y+py)*w+(x+px))*4; d[idx]=r;d[idx+1]=g;d[idx+2]=b;d[idx+3]=255
    }
  }
  ctx.putImageData(img,0,0)
}
