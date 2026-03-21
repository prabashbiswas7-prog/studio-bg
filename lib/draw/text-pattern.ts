import type { Params } from '../types'
import { hexWithAlpha } from '../palettes'

export function drawTextPattern(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  const text = (p.text as string) || 'STUDIO'
  const fg = p.fg as string || '#5b7cf6'
  const bg = p.bg as string || '#0e0f11'
  const fontSize = (p.fontSize as number) || 32
  const fontWeight = (p.fontWeight as string) || '700'
  const opacity = (p.opacity as number) ?? 0.15
  const angle = ((p.angle as number) || -30) * Math.PI / 180
  const spacing = (p.spacing as number) || 20
  const fontFamily = (p.fontFamily as string) || 'sans-serif'

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  ctx.save()
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.fillStyle = hexWithAlpha(fg, opacity)
  ctx.textBaseline = 'middle'

  const measured = ctx.measureText(text).width
  const cellW = measured + spacing
  const cellH = fontSize + spacing

  // Rotate around center
  ctx.translate(w / 2, h / 2)
  ctx.rotate(angle)
  ctx.translate(-w / 2, -h / 2)

  const diagLen = Math.hypot(w, h)
  const cols = Math.ceil(diagLen / cellW) + 4
  const rows = Math.ceil(diagLen / cellH) + 4

  for (let row = -rows / 2; row < rows / 2; row++) {
    for (let col = -cols / 2; col < cols / 2; col++) {
      const x = w / 2 + col * cellW + (row % 2 === 0 ? 0 : cellW / 2)
      const y = h / 2 + row * cellH
      ctx.fillText(text, x, y)
    }
  }
  ctx.restore()
}

export function drawSymbolPattern(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  const symbol = (p.symbol as string) || '✦'
  const fg = p.fg as string || '#5b7cf6'
  const bg = p.bg as string || '#0e0f11'
  const fontSize = (p.fontSize as number) || 28
  const opacity = (p.opacity as number) ?? 0.2
  const spacing = (p.spacing as number) || 40
  const angle = ((p.angle as number) || 0) * Math.PI / 180

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  ctx.save()
  ctx.font = `${fontSize}px serif`
  ctx.fillStyle = hexWithAlpha(fg, opacity)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.translate(w / 2, h / 2)
  ctx.rotate(angle)
  ctx.translate(-w / 2, -h / 2)

  const diagLen = Math.hypot(w, h)
  const cols = Math.ceil(diagLen / spacing) + 4
  const rows = Math.ceil(diagLen / spacing) + 4

  for (let row = -rows / 2; row < rows / 2; row++) {
    for (let col = -cols / 2; col < cols / 2; col++) {
      const x = w / 2 + col * spacing + (row % 2 === 0 ? 0 : spacing / 2)
      const y = h / 2 + row * spacing
      ctx.fillText(symbol, x, y)
    }
  }
  ctx.restore()
}
