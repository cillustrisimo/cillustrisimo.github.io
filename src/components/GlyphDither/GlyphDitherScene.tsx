import { useRef, useMemo } from 'react'
import { useFrame, useThree, createPortal } from '@react-three/fiber'
import * as THREE from 'three'
import MoonPhases from './MoonGeometry'
import GlyphDitherPass from './GlyphDitherPass'

/**
 * Orchestrates the two-pass rendering:
 * 1. Render moon geometry into an offscreen FBO (render target)
 * 2. Render the glyph dither grid reading from that FBO
 */
export default function GlyphDitherScene() {
  const { size } = useThree()
  const aspect = size.width / size.height
  // Keep the moon ring full-size (slightly clips on mobile — intentional)
  const ringRadius = 1.6
  const moonRadius = aspect < 1 ? 0.35 : 0.4

  // Offscreen scene for the moon geometry
  const offscreenScene = useMemo(() => new THREE.Scene(), [])
  const offscreenCamera = useMemo(() => {
    const cam = new THREE.PerspectiveCamera(50, size.width / size.height, 0.1, 100)
    cam.position.set(0, 0, 5)
    return cam
  }, [size])

  // FBO render target
  const fbo = useMemo(() => {
    return new THREE.WebGLRenderTarget(size.width, size.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    })
  }, [size.width, size.height])

  const prevBg = useRef(new THREE.Color())

  // Render the offscreen scene to FBO each frame
  useFrame(({ gl }) => {
    // Update camera aspect
    offscreenCamera.aspect = size.width / size.height
    offscreenCamera.updateProjectionMatrix()

    // Render moon scene to FBO with black background
    prevBg.current.copy(gl.getClearColor(new THREE.Color()))
    const prevAlpha = gl.getClearAlpha()
    gl.setClearColor(0x000000, 1)
    gl.setRenderTarget(fbo)
    gl.clear()
    gl.render(offscreenScene, offscreenCamera)
    gl.setRenderTarget(null)
    gl.setClearColor(prevBg.current, prevAlpha)
  })

  // Slow rotation for the moon arrangement
  const groupRef = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.05
    }
  })

  return (
    <>
      {/* Moon geometry rendered into the offscreen scene via portal */}
      {createPortal(
        <group ref={groupRef}>
          <MoonPhases ringRadius={ringRadius} moonRadius={moonRadius} />
        </group>,
        offscreenScene
      )}

      {/* The glyph dither grid reads from the FBO */}
      <GlyphDitherPass fboTexture={fbo.texture} />
    </>
  )
}
