import { Center, useGLTF } from '@react-three/drei'

export function HomeTrim() {
  let gltf = useGLTF(`/date/2022-20-23/UnityVFXRoom.glb`)
  return (
    <>
      <Center>
        <primitive object={gltf.scene}></primitive>
      </Center>
    </>
  )
}
