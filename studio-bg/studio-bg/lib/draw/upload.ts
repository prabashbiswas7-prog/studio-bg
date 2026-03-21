import type { Params } from '../types'
export function drawCustomTile(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  ctx.fillStyle = p.bg as string||'#050810'; ctx.fillRect(0,0,w,h)
  // uploadImg is passed via params when available
  const img = p._uploadImg as HTMLImageElement | null
  if (!img) {
    ctx.fillStyle='#545968'; ctx.font='16px sans-serif'; ctx.textAlign='center'
    ctx.fillText('Upload an image to tile',w/2,h/2); return
  }
  const scale=p.scale as number||1
  const tw=(p.tileW as number||img.width)*scale, th=(p.tileH as number||img.height)*scale
  const rotation=((p.rotation as number)||0)*Math.PI/180
  const offX=p.offX as number||0, offY=p.offY as number||0
  const opacity=p.opacity as number||1
  ctx.globalAlpha=opacity
  for (let y=-th+offY;y<h+th;y+=th) for (let x=-tw+offX;x<w+tw;x+=tw) {
    ctx.save(); ctx.translate(x+tw/2,y+th/2); ctx.rotate(rotation)
    ctx.drawImage(img,-tw/2,-th/2,tw,th); ctx.restore()
  }
  ctx.globalAlpha=1
}
