import { useRef, useMemo, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { createFontAtlas } from './fontAtlas'

// Larger cells on mobile for performance
const CELL_SIZE = window.innerWidth < 768 ? 16 : 10

/**
 * GlyphDitherPass:
 * - Reads from the provided FBO texture (the rendered moon scene)
 * - Draws a fullscreen grid of instanced quads
 * - Each quad picks an ASCII character based on source luminance
 * - Each quad can be displaced by mouse interaction (spring physics)
 */
export default function GlyphDitherPass({
  fboTexture,
}: {
  fboTexture: THREE.Texture
}) {
  const { viewport, size, pointer } = useThree()
  const meshRef = useRef<THREE.InstancedMesh>(null)

  // Grid dimensions in cells
  const cols = Math.ceil(size.width / CELL_SIZE)
  const rows = Math.ceil(size.height / CELL_SIZE)
  const count = cols * rows

  // Font atlas
  const { texture: fontAtlas, charCount } = useMemo(
    () => createFontAtlas(64),
    []
  )

  // Per-instance data: offsets (displacement from interaction)
  const offsets = useMemo(() => new Float32Array(count * 2), [count])
  const velocities = useMemo(() => new Float32Array(count * 2), [count])

  // Instance attribute for displacement
  const offsetAttr = useMemo(() => {
    const attr = new THREE.InstancedBufferAttribute(offsets, 2)
    attr.setUsage(THREE.DynamicDrawUsage)
    return attr
  }, [offsets])

  // Grid positions as instance attribute (in UV space 0..1)
  const gridUVs = useMemo(() => {
    const arr = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      arr[i * 2] = (col + 0.5) / cols
      arr[i * 2 + 1] = (row + 0.5) / rows
    }
    return arr
  }, [count, cols, rows])

  const gridUVAttr = useMemo(() => {
    return new THREE.InstancedBufferAttribute(gridUVs, 2)
  }, [gridUVs])

  // Shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uFBO: { value: fboTexture },
        uFontAtlas: { value: fontAtlas },
        uCharCount: { value: charCount },
        uCols: { value: cols },
        uRows: { value: rows },
        uCellSize: { value: CELL_SIZE },
        uResolution: { value: new THREE.Vector2(size.width, size.height) },
        uViewportSize: { value: new THREE.Vector2(viewport.width, viewport.height) },
      },
      vertexShader: /* glsl */ `
        attribute vec2 aGridUV;
        attribute vec2 aOffset;

        uniform float uCols;
        uniform float uRows;
        uniform float uCellSize;
        uniform vec2 uResolution;
        uniform vec2 uViewportSize;

        varying vec2 vGridUV;
        varying vec2 vLocalUV;

        void main() {
          vGridUV = aGridUV;
          vLocalUV = uv;

          // Cell size in world units
          float cellW = uViewportSize.x / uCols;
          float cellH = uViewportSize.y / uRows;

          // Position: grid cell center + displacement, mapped to world coords
          float worldX = (aGridUV.x - 0.5) * uViewportSize.x + aOffset.x;
          float worldY = (aGridUV.y - 0.5) * uViewportSize.y + aOffset.y;

          // Scale the unit quad to cell size
          vec3 pos = vec3(
            position.x * cellW + worldX,
            position.y * cellH + worldY,
            0.0
          );

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uFBO;
        uniform sampler2D uFontAtlas;
        uniform float uCharCount;

        varying vec2 vGridUV;
        varying vec2 vLocalUV;

        void main() {
          // Sample the source scene at this grid cell's position
          // Flip Y because FBO is flipped
          vec2 sampleUV = vec2(vGridUV.x, vGridUV.y);
          vec4 sceneColor = texture2D(uFBO, sampleUV);

          // Compute luminance
          float lum = dot(sceneColor.rgb, vec3(0.299, 0.587, 0.114));

          // If the scene is basically the background (blue), dim this cell
          float alpha = smoothstep(0.01, 0.05, lum);

          // Map luminance to character index
          float charIdx = floor(lum * (uCharCount - 1.0) + 0.5);
          charIdx = clamp(charIdx, 0.0, uCharCount - 1.0);

          // Sample the font atlas
          float atlasU = (charIdx + vLocalUV.x) / uCharCount;
          float atlasV = vLocalUV.y;
          float glyphAlpha = texture2D(uFontAtlas, vec2(atlasU, atlasV)).r;

          // Color the glyph with the source scene color, brightened
          vec3 color = sceneColor.rgb * 1.5 + 0.1;

          gl_FragColor = vec4(color, glyphAlpha * alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    })
  }, [fboTexture, fontAtlas, charCount, cols, rows, size, viewport])

  // Update uniforms when size changes
  const updateUniforms = useCallback(() => {
    if (!material.uniforms) return
    material.uniforms.uResolution.value.set(size.width, size.height)
    material.uniforms.uViewportSize.value.set(viewport.width, viewport.height)
    material.uniforms.uCols.value = cols
    material.uniforms.uRows.value = rows
  }, [material, size, viewport, cols, rows])

  useFrame(() => {
    updateUniforms()
    if (!meshRef.current) return

    const mouseX = pointer.x * viewport.width * 0.5
    const mouseY = pointer.y * viewport.height * 0.5
    const interactionRadius = 1.2
    const intensity = 0.08
    const momentum = 0.92
    const friction = 0.08

    for (let i = 0; i < count; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const cellW = viewport.width / cols
      const cellH = viewport.height / rows
      const worldX = (col + 0.5 - cols / 2) * cellW
      const worldY = (row + 0.5 - rows / 2) * cellH

      const dx = worldX + offsets[i * 2] - mouseX
      const dy = worldY + offsets[i * 2 + 1] - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)

      // Repulsion from cursor
      if (dist < interactionRadius && dist > 0.001) {
        const force = (1.0 - dist / interactionRadius) * intensity
        velocities[i * 2] += (dx / dist) * force
        velocities[i * 2 + 1] += (dy / dist) * force
      }

      // Spring back to origin + friction
      velocities[i * 2] *= momentum
      velocities[i * 2 + 1] *= momentum
      velocities[i * 2] -= offsets[i * 2] * friction
      velocities[i * 2 + 1] -= offsets[i * 2 + 1] * friction

      offsets[i * 2] += velocities[i * 2]
      offsets[i * 2 + 1] += velocities[i * 2 + 1]
    }

    offsetAttr.needsUpdate = true
  })

  // Quad geometry for each glyph cell
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1)
    geo.setAttribute('aGridUV', gridUVAttr)
    geo.setAttribute('aOffset', offsetAttr)
    return geo
  }, [gridUVAttr, offsetAttr])

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={false}
      renderOrder={10}
    />
  )
}
