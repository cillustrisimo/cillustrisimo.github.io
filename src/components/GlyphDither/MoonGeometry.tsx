import { useMemo } from 'react'
import * as THREE from 'three'

interface MoonPhaseProps {
  phase: number // 0 = new, 0.5 = full, 1 = new again
  radius?: number
  position?: [number, number, number]
}

/**
 * Creates a moon phase as a sphere with a shader that carves the
 * illuminated/shadow boundary based on the phase parameter.
 */
function MoonPhase({ phase, radius = 0.4, position = [0, 0, 0] }: MoonPhaseProps) {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uPhase: { value: phase },
        uLightColor: { value: new THREE.Color('#F5F0E6') },
        uDarkColor: { value: new THREE.Color('#1a1a2e') },
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uPhase;
        uniform vec3 uLightColor;
        uniform vec3 uDarkColor;

        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          // Phase determines the light direction on the x-axis
          // phase 0.0 = new moon (all dark), 0.5 = full moon (all lit)
          float lightAngle = (uPhase - 0.5) * 3.14159;
          vec3 lightDir = normalize(vec3(cos(lightAngle), 0.0, sin(lightAngle)));

          float NdotL = dot(vNormal, lightDir);

          // Soft terminator
          float illumination = smoothstep(-0.05, 0.15, NdotL);

          // Rim lighting for depth — stronger so dark phases pop on black bg
          float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
          rim = pow(rim, 2.5) * 0.5;

          // Ambient so the dark side is never fully invisible
          float ambient = 0.12;

          vec3 color = mix(uDarkColor, uLightColor, illumination);
          color += rim * uLightColor * 0.6;
          color = max(color, uDarkColor * ambient + 0.04);

          // Slight surface variation
          float detail = fract(sin(dot(vPosition.xy, vec2(12.9898, 78.233))) * 43758.5453);
          color += detail * 0.03;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    })
  }, [phase])

  return (
    <mesh position={position} material={material}>
      <sphereGeometry args={[radius, 48, 48]} />
    </mesh>
  )
}

/**
 * Arranges 7 moon phases in a circle.
 */
export default function MoonPhases({ ringRadius = 1.6, moonRadius = 0.4 }: { ringRadius?: number; moonRadius?: number }) {
  const phases = useMemo(() => {
    // 7 phases: new, waxing crescent, first quarter, waxing gibbous, full, waning gibbous, third quarter
    const phaseValues = [0.08, 0.2, 0.3, 0.4, 0.5, 0.65, 0.8]
    return phaseValues.map((phase, i) => {
      const angle = (i / 7) * Math.PI * 2 - Math.PI / 2 // start from top
      const x = Math.cos(angle) * ringRadius
      const y = Math.sin(angle) * ringRadius
      return { phase, position: [x, y, 0] as [number, number, number] }
    })
  }, [ringRadius])

  return (
    <group>
      {phases.map((p, i) => (
        <MoonPhase key={i} phase={p.phase} position={p.position} radius={moonRadius} />
      ))}
    </group>
  )
}
