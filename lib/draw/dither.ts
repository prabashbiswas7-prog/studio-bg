import type { Params } from '../types'
import { fbm } from '../utils'
import { multiLerp } from '../palettes'
const BAYER = [[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]]
export function drawDither(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  const colors=p.colors as string[], scale=p.scale as number||3
  const octaves=p.octaves as number||4, ds=p.ditherSize as number||2
  const contrast=p.contrast as number||1.4
  const img=ctx.createImageData(w,h); const d=img.data
  for (let y=0;y<h;y++) for (let x=0;x<w;x++) {
    let n=fbm(x/w*scale,y/h*scale,octaves); n=(n+1)*.5
    n=Math.pow(Math.max(0,Math.min(1,n)),1/contrast)
    const threshold=(BAYER[Math.floor(y/ds)%4][Math.floor(x/ds)%4]+.5)/16
    const q=n>threshold?1:0
    const hex=multiLerp(colors,q)
    const idx=(y*w+x)*4
    d[idx]=parseInt(hex.slice(1,3),16); d[idx+1]=parseInt(hex.slice(3,5),16)
    d[idx+2]=parseInt(hex.slice(5,7),16); d[idx+3]=255
  }
  ctx.putImageData(img,0,0)
}
