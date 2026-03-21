// ─── Seeded RNG (xorshift) ────────────────────────────────────
let _S = 1

export function seedRng(s: number) {
  _S = (s | 0) || 1
}

export function rng(): number {
  _S = Math.imul(_S ^ (_S >>> 17), 0x45d9f3b)
  _S ^= _S >>> 15
  return (_S >>> 0) / 0xffffffff
}

export function randInt(a = 1, b = 99999): number {
  return Math.floor(Math.random() * (b - a + 1)) + a
}

// ─── Perlin Noise ─────────────────────────────────────────────
const _pp = Array.from({ length: 256 }, (_, i) => i).sort(() => Math.random() - 0.5)
const PP = [..._pp, ..._pp]

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function grad(h: number, x: number, y: number): number {
  h &= 3
  const u = h < 2 ? x : y
  const v = h < 2 ? y : x
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v)
}

export function perlin(x: number, y: number): number {
  const xi = Math.floor(x) & 255
  const yi = Math.floor(y) & 255
  const xf = x - Math.floor(x)
  const yf = y - Math.floor(y)
  const u = fade(xf), v = fade(yf)
  return (
    (1 - u) * ((1 - v) * grad(PP[PP[xi] + yi], xf, yf) + v * grad(PP[PP[xi] + yi + 1], xf, yf - 1)) +
    u * ((1 - v) * grad(PP[PP[xi + 1] + yi], xf - 1, yf) + v * grad(PP[PP[xi + 1] + yi + 1], xf - 1, yf - 1))
  )
}

export function fbm(x: number, y: number, octaves = 4): number {
  let v = 0, a = 1, f = 1, t = 0
  for (let i = 0; i < octaves; i++) {
    v += perlin(x * f, y * f) * a
    t += a; a *= 0.5; f *= 2
  }
  return v / t
}

// ─── Canvas Helpers ───────────────────────────────────────────
export function applyGrain(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  intensity: number,
  seed: number
) {
  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data
  seedRng(seed)
  for (let i = 0; i < d.length; i += 4) {
    const n = (rng() - 0.5) * intensity * 255
    d[i] = Math.max(0, Math.min(255, d[i] + n))
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n))
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n))
  }
  ctx.putImageData(img, 0, 0)
}

export function applyVignette(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  strength: number
) {
  const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.hypot(w, h) / 2)
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(1, `rgba(0,0,0,${strength / 100})`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
}

export function applyFilters(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  brightness: number,
  saturation: number,
  contrast: number
) {
  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data
  const b = brightness / 100
  const s = saturation / 100
  const c = contrast / 100
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i + 1], bl = d[i + 2]
    // brightness
    r *= b; g *= b; bl *= b
    // saturation
    const gray = 0.299 * r + 0.587 * g + 0.114 * bl
    r = gray + s * (r - gray)
    g = gray + s * (g - gray)
    bl = gray + s * (bl - gray)
    // contrast
    r = (r - 128) * c + 128
    g = (g - 128) * c + 128
    bl = (bl - 128) * c + 128
    d[i] = Math.max(0, Math.min(255, r))
    d[i + 1] = Math.max(0, Math.min(255, g))
    d[i + 2] = Math.max(0, Math.min(255, bl))
  }
  ctx.putImageData(img, 0, 0)
}

// ─── Misc ──────────────────────────────────────────────────────
export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}
