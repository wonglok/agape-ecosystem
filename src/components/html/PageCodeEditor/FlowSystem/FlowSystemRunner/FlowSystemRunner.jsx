import { Environment, MeshTransmissionMaterial } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

export function FlowSystemRunner() {
  return (
    <div className='w-full h-full bg-gray-100'>
      <Canvas>
        <mesh>
          <sphereGeometry args={[2.5, 32, 32]}></sphereGeometry>
          <MeshTransmissionMaterial
            roughness={0}
            chromaticAberration={0.2}
            transmission={1}
            thickness={2.5 * 2}></MeshTransmissionMaterial>
        </mesh>
        <Environment preset='dawn' background></Environment>
      </Canvas>
    </div>
  )
}
