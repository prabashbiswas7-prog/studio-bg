import type { Params } from '../types'
import { perlin, fbm } from '../utils'
import { multiLerp } from '../palettes'
export function drawMarble(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  const colors=p.colors as string[], scale=p.scale as number||2.8
  const turb=p.turb as number||5.5, angle=((p.angle as number)||45)*Math.PI/180
  const img=ctx.createImageData(w,h); const d=img.data; const step=2
  for (let y=0;y<h;y+=step) for (let x=0;x<w;x+=step) {
    const tx=x/w*scale, ty=y/h*scale
    const t=fbm(tx,ty,5)*turb
    const n=(Math.sin((x/w*Math.cos(angle)+y/h*Math.sin(angle))*Math.PI*4+t)+1)*.5
    const hex=multiLerp(colors,Math.max(0,Math.min(1,n)))
    const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16)
    for (let py=0;py<step&&y+py<h;py++) for (let px=0;px<step&&x+px<w;px++) {
      const idx=((y+py)*w+(x+px))*4; d[idx]=r;d[idx+1]=g;d[idx+2]=b;d[idx+3]=255
    }
  }
  ctx.putImageData(img,0,0)
}
