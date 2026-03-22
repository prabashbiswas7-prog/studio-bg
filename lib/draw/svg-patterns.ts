import type { Params } from '../types'
import { hexWithAlpha } from '../palettes'

function withRotation(ctx: CanvasRenderingContext2D, w: number, h: number, angle: number, fn: () => void) {
  if (!angle) { fn(); return }
  ctx.save()
  ctx.translate(w / 2, h / 2)
  ctx.rotate((angle * Math.PI) / 180)
  ctx.translate(-w / 2, -h / 2)
  fn()
  ctx.restore()
}

export function drawChevron(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  const fg = (p.fg as string) || '#5b7cf6'
  const bg = (p.bg as string) || '#0e0f11'
  const size = (p.size as number) || 40
  const lw = (p.strokeWidth as number) || 2
  const opacity = (p.opacity as number) ?? 1
  const angle = (p.angle as number) || 0
  const spacing = (p.spacing as number) || 0
  const variation = (p.variation as number) || 0

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  withRotation(ctx, w, h, angle, () => {
    ctx.strokeStyle = hexWithAlpha(fg, opacity)
    ctx.lineWidth = lw
    ctx.lineJoin = 'miter'
    const step = size + spacing
    const D = Math.hypot(w, h)
    const rows = Math.ceil(D / step) + 4
    const cols = Math.ceil(D / step) + 4
    for (let row = -2; row < rows; row++) {
      for (let col = -2; col < cols; col++) {
        const x = col * step - D / 4
        const y = row * step - D / 4
        const half = size / 2
        const jitter = variation * size * 0.3
        const jx = (Math.random() - 0.5) * jitter
        const jy = (Math.random() - 0.5) * jitter
        ctx.beginPath()
        ctx.moveTo(x + jx, y + half + jy)
        ctx.lineTo(x + half + jx, y + jy)
        ctx.lineTo(x + size + jx, y + half + jy)
        ctx.stroke()
      }
    }
  })
}

export function drawDiamonds(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  const fg = (p.fg as string) || '#5b7cf6'
  const bg = (p.bg as string) || '#0e0f11'
  const size = (p.size as number) || 40
  const lw = (p.strokeWidth as number) || 1.5
  const filled = (p.filled as number) || 0
  const opacity = (p.opacity as number) ?? 1
  const angle = (p.angle as number) || 0
  const variation = (p.variation as number) || 0

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  withRotation(ctx, w, h, angle, () => {
    const D = Math.hypot(w, h)
    const cols = Math.ceil(D / size) + 4
    const rows = Math.ceil(D / size) + 4
    const half = size / 2
    for (let row = -2; row < rows; row++) {
      for (let col = -2; col < cols; col++) {
        const cx = col * size + (row % 2 === 0 ? 0 : half) - D / 4
        const cy = row * half - D / 4
        const jitter = variation * size * 0.25
        const sx = cx + (Math.random() - 0.5) * jitter
        const sy = cy + (Math.random() - 0.5) * jitter
        const sh = half * (1 + (Math.random() - 0.5) * variation * 0.4)
        ctx.beginPath()
        ctx.moveTo(sx, sy - sh)
        ctx.lineTo(sx + sh, sy)
        ctx.lineTo(sx, sy + sh)
        ctx.lineTo(sx - sh, sy)
        ctx.closePath()
        if (filled) { ctx.fillStyle = hexWithAlpha(fg, opacity * 0.15); ctx.fill() }
        ctx.strokeStyle = hexWithAlpha(fg, opacity)
        ctx.lineWidth = lw
        ctx.stroke()
      }
    }
  })
}

export function drawTriangles(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  const fg = (p.fg as string) || '#5b7cf6'
  const bg = (p.bg as string) || '#0e0f11'
  const size = (p.size as number) || 50
  const lw = (p.strokeWidth as number) || 1.5
  const filled = (p.filled as number) || 0
  const alternate = (p.alternate as number) ?? 1
  const opacity = (p.opacity as number) ?? 1
  const angle = (p.angle as number) || 0
  const variation = (p.variation as number) || 0

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  withRotation(ctx, w, h, angle, () => {
    const D = Math.hypot(w, h)
    const h3 = size * Math.sqrt(3) / 2
    const cols = Math.ceil(D / (size / 2)) + 4
    const rows = Math.ceil(D / h3) + 4
    for (let row = -2; row < rows; row++) {
      for (let col = -2; col < cols; col++) {
        const x = col * (size / 2) - D / 4
        const y = row * h3 - D / 4
        const isUp = (col + row) % 2 === 0
        const jitter = variation * size * 0.2
        const jx = (Math.random() - 0.5) * jitter
        const jy = (Math.random() - 0.5) * jitter
        ctx.beginPath()
        if (isUp) {
          ctx.moveTo(x + jx, y + h3 + jy)
          ctx.lineTo(x + size / 2 + jx, y + jy)
          ctx.lineTo(x + size + jx, y + h3 + jy)
        } else if (alternate) {
          ctx.moveTo(x + jx, y + jy)
          ctx.lineTo(x + size / 2 + jx, y + h3 + jy)
          ctx.lineTo(x + size + jx, y + jy)
        }
        ctx.closePath()
        if (filled && isUp) { ctx.fillStyle = hexWithAlpha(fg, opacity * 0.1); ctx.fill() }
        ctx.strokeStyle = hexWithAlpha(fg, opacity)
        ctx.lineWidth = lw
        ctx.stroke()
      }
    }
  })
}

export function drawZigzag(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  const fg = (p.fg as string) || '#5b7cf6'
  const bg = (p.bg as string) || '#0e0f11'
  const size = (p.size as number) || 30
  const lw = (p.strokeWidth as number) || 2
  const amplitude = (p.amplitude as number) || 15
  const opacity = (p.opacity as number) ?? 1
  const angle = (p.angle as number) || 0
  const variation = (p.variation as number) || 0

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  withRotation(ctx, w, h, angle, () => {
    ctx.strokeStyle = hexWithAlpha(fg, opacity)
    ctx.lineWidth = lw
    ctx.lineJoin = 'miter'
    const D = Math.hypot(w, h)
    const rowH = amplitude * 2
    const rows = Math.ceil(D / rowH) + 4
    for (let row = -2; row < rows; row++) {
      const y0 = row * rowH - D / 4
      ctx.beginPath()
      let x = -size * 2
      let up = true
      while (x < w + size * 2) {
        const jitter = variation * amplitude * 0.3
        const jy = (Math.random() - 0.5) * jitter
        ctx.lineTo(x, y0 + (up ? 0 : rowH) + jy)
        x += size
        up = !up
      }
      ctx.stroke()
    }
  })
}

export function drawCircles(ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) {
  const fg = (p.fg as string) || '#5b7cf6'
  const bg = (p.bg as string) || '#0e0f11'
  const size = (p.size as number) || 60
  const lw = (p.strokeWidth as number) || 1.5
  const opacity = (p.opacity as number) ?? 1
  const fill = (p.fill as number) || 0
  const angle = (p.angle as number) || 0
  const variation = (p.variation as number) || 0

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  withRotation(ctx, w, h, angle, () => {
    const D = Math.hypot(w, h)
    const cols = Math.ceil(D / size) + 4
    const rows = Math.ceil(D / size) + 4
    for (let row = -2; row < rows; row++) {
      for (let col = -2; col < cols; col++) {
        const cx = col * size + size / 2 - D / 4
        const cy = row * size + size / 2 - D / 4
        const r = Math.max(1, size / 2 - lw + (Math.random() - 0.5) * variation * size * 0.3)
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        if (fill) { ctx.fillStyle = hexWithAlpha(fg, opacity * 0.1); ctx.fill() }
        ctx.strokeStyle = hexWithAlpha(fg, opacity)
        ctx.lineWidth = lw
        ctx.stroke()
      }
    }
  })
}
