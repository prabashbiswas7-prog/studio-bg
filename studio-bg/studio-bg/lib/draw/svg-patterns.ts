import type { Params } from '../types'
import { hexWithAlpha } from '../palettes'

export function drawChevron(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  const fg = p.fg as string || '#5b7cf6'
  const bg = p.bg as string || '#0e0f11'
  const size = (p.size as number) || 40
  const lw = (p.strokeWidth as number) || 2
  const opacity = (p.opacity as number) ?? 1

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = hexWithAlpha(fg, opacity)
  ctx.lineWidth = lw
  ctx.lineJoin = 'miter'

  const rows = Math.ceil(h / size) + 2
  const cols = Math.ceil(w / size) + 2
  const half = size / 2

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const x = col * size
      const y = row * size
      ctx.beginPath()
      ctx.moveTo(x, y + half)
      ctx.lineTo(x + half, y)
      ctx.lineTo(x + size, y + half)
      ctx.stroke()
    }
  }
}

export function drawDiamonds(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  const fg = p.fg as string || '#5b7cf6'
  const bg = p.bg as string || '#0e0f11'
  const size = (p.size as number) || 40
  const lw = (p.strokeWidth as number) || 1.5
  const filled = (p.filled as number) || 0
  const opacity = (p.opacity as number) ?? 1

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  const cols = Math.ceil(w / size) + 2
  const rows = Math.ceil(h / size) + 2
  const half = size / 2

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const cx = col * size + (row % 2 === 0 ? 0 : half)
      const cy = row * half
      ctx.beginPath()
      ctx.moveTo(cx, cy - half)
      ctx.lineTo(cx + half, cy)
      ctx.lineTo(cx, cy + half)
      ctx.lineTo(cx - half, cy)
      ctx.closePath()
      if (filled) {
        ctx.fillStyle = hexWithAlpha(fg, opacity * 0.15)
        ctx.fill()
      }
      ctx.strokeStyle = hexWithAlpha(fg, opacity)
      ctx.lineWidth = lw
      ctx.stroke()
    }
  }
}

export function drawTriangles(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  const fg = p.fg as string || '#5b7cf6'
  const bg = p.bg as string || '#0e0f11'
  const size = (p.size as number) || 50
  const lw = (p.strokeWidth as number) || 1.5
  const filled = (p.filled as number) || 0
  const alternate = (p.alternate as number) ?? 1
  const opacity = (p.opacity as number) ?? 1

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  const h3 = size * Math.sqrt(3) / 2
  const cols = Math.ceil(w / size) + 2
  const rows = Math.ceil(h / h3) + 2

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols * 2; col++) {
      const x = col * (size / 2)
      const y = row * h3
      const up = (col + row) % 2 === 0

      ctx.beginPath()
      if (up) {
        ctx.moveTo(x, y + h3)
        ctx.lineTo(x + size / 2, y)
        ctx.lineTo(x + size, y + h3)
      } else if (alternate) {
        ctx.moveTo(x, y)
        ctx.lineTo(x + size / 2, y + h3)
        ctx.lineTo(x + size, y)
      }
      ctx.closePath()

      if (filled && up) {
        ctx.fillStyle = hexWithAlpha(fg, opacity * 0.1)
        ctx.fill()
      }
      ctx.strokeStyle = hexWithAlpha(fg, opacity)
      ctx.lineWidth = lw
      ctx.stroke()
    }
  }
}

export function drawZigzag(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  const fg = p.fg as string || '#5b7cf6'
  const bg = p.bg as string || '#0e0f11'
  const size = (p.size as number) || 30
  const lw = (p.strokeWidth as number) || 2
  const amplitude = (p.amplitude as number) || 15
  const opacity = (p.opacity as number) ?? 1

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = hexWithAlpha(fg, opacity)
  ctx.lineWidth = lw
  ctx.lineJoin = 'miter'

  const rows = Math.ceil(h / (amplitude * 2)) + 2

  for (let row = -1; row < rows; row++) {
    const y = row * amplitude * 2
    ctx.beginPath()
    let x = -size
    let up = true
    while (x < w + size) {
      ctx.lineTo(x, y + (up ? 0 : amplitude * 2))
      x += size
      up = !up
    }
    ctx.stroke()
  }
}

export function drawCircles(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  const fg = p.fg as string || '#5b7cf6'
  const bg = p.bg as string || '#0e0f11'
  const size = (p.size as number) || 60
  const lw = (p.strokeWidth as number) || 1.5
  const opacity = (p.opacity as number) ?? 1
  const fill = (p.fill as number) || 0

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  const cols = Math.ceil(w / size) + 2
  const rows = Math.ceil(h / size) + 2
  const r = size / 2 - lw

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const cx = col * size + size / 2
      const cy = row * size + size / 2
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      if (fill) {
        ctx.fillStyle = hexWithAlpha(fg, opacity * 0.1)
        ctx.fill()
      }
      ctx.strokeStyle = hexWithAlpha(fg, opacity)
      ctx.lineWidth = lw
      ctx.stroke()
    }
  }
}
