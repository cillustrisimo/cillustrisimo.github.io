import * as THREE from 'three'

/**
 * Generates a texture atlas of ASCII characters arranged in a single row.
 * Characters are ordered from least dense (space) to most dense (@).
 * Luminance of the source scene maps to character index.
 */
export const CHARS = ' .,:-=+*#%@'

export function createFontAtlas(
  cellSize = 32,
  fontFamily = 'JetBrains Mono, Courier New, monospace'
): { texture: THREE.Texture; charCount: number } {
  const charCount = CHARS.length
  const canvas = document.createElement('canvas')
  canvas.width = cellSize * charCount
  canvas.height = cellSize

  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = `${cellSize * 0.75}px ${fontFamily}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (let i = 0; i < charCount; i++) {
    ctx.fillText(CHARS[i], i * cellSize + cellSize / 2, cellSize / 2)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.NearestFilter
  texture.magFilter = THREE.NearestFilter
  texture.needsUpdate = true

  return { texture, charCount }
}
