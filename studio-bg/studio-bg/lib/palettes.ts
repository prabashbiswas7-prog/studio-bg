export const PALETTES: Record<string, string[]> = {
  aurora:    ['#0f0c29', '#302b63', '#7b2ff7', '#e040fb'],
  nordic:    ['#2d3561', '#c05c7e', '#f3826f', '#ffb961'],
  forest:    ['#0d1f10', '#1a3a24', '#2d7d46', '#6ec97f'],
  ocean:     ['#050718', '#0c3060', '#1569c7', '#56ccf2'],
  sunset:    ['#1a0020', '#c2185b', '#ff6b35', '#ffd166'],
  ember:     ['#0f0000', '#8b1a1a', '#d44000', '#ff9f1c'],
  candy:     ['#1a0030', '#6c3483', '#e91e8c', '#ff9eb5'],
  chrome:    ['#0a0a0a', '#1c1c1c', '#3c3c3c', '#b0b8c8'],
  cosmic:    ['#030010', '#0d0040', '#4a00c8', '#b040ff'],
  rose:      ['#1a0010', '#7b0038', '#d4006a', '#ff80c0'],
  mint:      ['#001a10', '#00522a', '#00a86b', '#7fffd4'],
  gold:      ['#1a1000', '#5c3a00', '#c07800', '#ffd700'],
  midnight:  ['#000011', '#000040', '#000088', '#0040cc'],
  paper:     ['#fdf6e3', '#ead9b2', '#c9a96e', '#8b6914'],
  neon:      ['#000000', '#001a33', '#003399', '#00ccff'],
  // 8-colour palettes
  spectrum:  ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#8000ff', '#ff00ff'],
  earth:     ['#1a0a00', '#3d1a00', '#7a3b00', '#b05c00', '#d4882b', '#e8b870', '#f5d9a8', '#fff8f0'],
  ice:       ['#001428', '#002855', '#004080', '#0066b3', '#3399ff', '#80c4ff', '#c0e4ff', '#f0f8ff'],
  fire:      ['#0d0000', '#3d0000', '#800000', '#cc2200', '#ff5500', '#ff8800', '#ffcc00', '#ffff80'],
  forest8:   ['#030f03', '#0a2009', '#143d14', '#1f5c1f', '#2d7d2d', '#4a9e4a', '#7dc47d', '#b8e6b8'],
}

export const PALETTE_NAMES = Object.keys(PALETTES)

// Colour utilities shared across draw functions
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex || '#000000'
  return [
    parseInt(h.slice(1, 3), 16) || 0,
    parseInt(h.slice(3, 5), 16) || 0,
    parseInt(h.slice(5, 7), 16) || 0,
  ]
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0'))
    .join('')
}

export function hexWithAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r},${g},${b},${alpha})`
}

export function lerpColor(c1: string, c2: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(c1)
  const [r2, g2, b2] = hexToRgb(c2)
  return rgbToHex(r1 + t * (r2 - r1), g1 + t * (g2 - g1), b1 + t * (b2 - b1))
}

export function multiLerp(colors: string[], t: number): string {
  if (!colors || !colors.length) return '#000000'
  if (colors.length === 1) return colors[0]
  t = Math.max(0, Math.min(1, t))
  const s = (colors.length - 1) * t
  const i = Math.min(Math.floor(s), colors.length - 2)
  return lerpColor(colors[i], colors[i + 1], s - i)
}

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }
  return rgbToHex(Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255))
}

export function generateRandomPalette(n = 4): string[] {
  const h = Math.random() * 360
  const modes = ['analogous', 'split', 'triadic', 'complementary', 'monochrome']
  const mode = modes[Math.floor(Math.random() * modes.length)]
  const s = 50 + Math.random() * 40
  const lBase = 20 + Math.random() * 20
  return Array.from({ length: n }, (_, i) => {
    let hh = h
    let ll = lBase + i * (55 / n)
    if (mode === 'analogous')      hh = h + i * 25
    else if (mode === 'split')     hh = h + (i % 2 === 0 ? 0 : 150 + Math.random() * 60)
    else if (mode === 'triadic')   hh = h + i * 120
    else if (mode === 'complementary') hh = h + (i < n / 2 ? 0 : 180)
    else ll = lBase + i * (60 / n)
    hh = ((hh % 360) + 360) % 360
    return hslToHex(hh, s, Math.min(75, ll))
  })
}
