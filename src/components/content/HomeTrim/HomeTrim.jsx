import { Center, useGLTF } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { MyGLTFLoader } from './MyGLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

export function HomeTrim() {
  // let gltf = useGLTF(`/date/2022-20-23/UnityVFXRoom.glb`)
  let gltf = useLoader(MyGLTFLoader, `/date/2022-20-24-mech/ball-4k-webp-each2k.glb`, (loader) => {
    let draco = new DRACOLoader()
    draco.setDecoderPath(`/draco/`)
    loader.setDRACOLoader(draco)
  })
  return (
    <>
      <Center>
        <primitive object={gltf.scene}></primitive>
      </Center>
    </>
  )
}
