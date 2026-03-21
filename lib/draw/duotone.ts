import type { Params } from '../types'
import { fbm } from '../utils'
import { hexToRgb } from '../palettes'
export function drawDuotone(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  const seed = p.seed as number; const sc = (p.noiseScale as number)/1000
  const sx = seed*13.7, sy = seed*7.3, step = 2
  const img = ctx.createImageData(w,h); const d = img.data
  const [r1,g1,b1] = hexToRgb(p.colorA as string || '#000')
  const [r2,g2,b2] = hexToRgb(p.colorB as string || '#fff')
  for (let y=0;y<h;y+=step) for (let x=0;x<w;x+=step) {
    let n = fbm(x*sc+sx,y*sc+sy,p.noiseOct as number||4)
    n=(n+1)*.5; n=Math.pow(Math.max(0,Math.min(1,n)),1/(p.contrast as number||1.2))
    const rv=Math.round(r1+n*(r2-r1)),gv=Math.round(g1+n*(g2-g1)),bv=Math.round(b1+n*(b2-b1))
    for (let py=0;py<step&&y+py<h;py++) for (let px=0;px<step&&x+px<w;px++) {
      const idx=((y+py)*w+(x+px))*4; d[idx]=rv;d[idx+1]=gv;d[idx+2]=bv;d[idx+3]=255
    }
  }
  ctx.putImageData(img,0,0)
}
