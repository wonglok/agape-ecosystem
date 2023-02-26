import { Center, useGLTF } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { MyGLTFLoader } from './MyGLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Environment, Lightformer } from '@react-three/drei'
import { Vector3 } from 'three'
import { useEffect, useState } from 'react'

export function Env() {
  return (
    <Environment preset='night' resolution={2048}>
      {/* Light A */}
      <Lightformer
        visible={true}
        form='ring'
        intensity={1}
        position={new Vector3().setFromSphericalCoords(
          0.49999999999999994, // distance
          0, // phi
          0, // theta
        )}
        rotation={[0, 0, 0]}
        scale={[1.7999999999999996, 1.9999999999999998, 2]}
        target={[0, 0, 0]}
        castShadow={false}
        receiveShadow={false}></Lightformer>

      {/* Light B */}
      <Lightformer
        visible={true}
        form='ring'
        intensity={1}
        position={new Vector3().setFromSphericalCoords(
          4, // distance
          0, // phi
          0, // theta
        )}
        rotation={[0, 0, 0]}
        scale={[2, 2, 2]}
        target={[0, 0, 0]}
        castShadow={false}
        receiveShadow={false}></Lightformer>

      {/* Light C */}
      <Lightformer
        visible={true}
        form='circle'
        intensity={1}
        position={new Vector3().setFromSphericalCoords(
          5.000000000000003, // distance
          0, // phi
          0, // theta
        )}
        rotation={[0, 0, 0]}
        scale={[3.800000000000001, 3.800000000000001, 3.800000000000001]}
        target={[0, 0, 0]}
        castShadow={false}
        receiveShadow={false}></Lightformer>
    </Environment>
  )
}

export function HomeTrim() {
  let [st, setST] = useState(`/date/2022-20-24-mech/ball-4k-webp-each2k.glb`)
  useEffect(() => {
    let hh = ({ detail }) => {
      setST(detail)
    }
    window.addEventListener('loadGLB', hh)
    return () => {
      window.removeEventListener('loadGLB', hh)
    }
  }, [])

  useEffect(() => {
    let defaultItem = localStorage.getItem('defaultItem')

    if (defaultItem !== '' || defaultItem !== null) {
      setST(defaultItem)
    }
  }, [])

  // let gltf = useGLTF(`/date/2022-20-23/UnityVFXRoom.glb`)
  let gltf = useLoader(MyGLTFLoader, st, (loader) => {
    let draco = new DRACOLoader()
    draco.setDecoderPath(`/draco/`)
    loader.setDRACOLoader(draco)
  })

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('needsUpdate', { detail: {} }))
  }, [gltf])
  return (
    <>
      <Center>
        <primitive object={gltf.scene}></primitive>
      </Center>
    </>
  )
}
