import { useLayoutEffect, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMask, useGLTF, useAnimations, Float, CameraControls, Environment, RandomizedLight, AccumulativeShadows, MeshTransmissionMaterial } from '@react-three/drei'


export default function MyCanvas() {
  return (
    <Canvas shadows camera={{ position: [30, 0, -3], fov: 35, near: 1, far: 50 }}>
      {/* <color attach="background" args={['#c6dde5']} /> */}
      <Aquarium position={[0, 0.025, 0]}>
        <Float rotationIntensity={1} floatIntensity={1} speed={2}>
          <Tuna position={[0, 0.4, 0]} rotation={[0, Math.PI, 0]} scale={3} />
        </Float>
      </Aquarium>
      {/** Soft shadows */}
      <AccumulativeShadows temporal frames={100} color="#aaaaaa" colorBlend={2} opacity={0.7} scale={60} position={[0, -5, 0]}>
        <RandomizedLight amount={8} radius={15} ambient={0.5} intensity={1} position={[-5, 10, -5]} size={20} />
      </AccumulativeShadows>
      {/** Custom environment map */}
      {/* <Environment resolution={1024}>
        <group rotation={[-Math.PI / 3, 0, 0]}>
          <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
            <Lightformer key={i} form="circle" intensity={4} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
          ))}
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
        </group>
      </Environment> */}
      <Environment background preset="sunset" blur={0.8} />

      <CameraControls truckSpeed={0} dollySpeed={0} minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      {/* <CameraController /> */}
    </Canvas>
  )
}

function Aquarium({ children, ...props }) {
  const ref = useRef()
  const { nodes } = useGLTF('/shapes-transformed.glb')
  const stencil = useMask(1, false)
  useLayoutEffect(() => {
    // Apply stencil to all contents
    ref.current.traverse((child) => child.material && Object.assign(child.material, { ...stencil }))
  }, [stencil])
  return (
    <group {...props} dispose={null}>
      <mesh castShadow scale={[0.61 * 6, 0.55 * 6, 1 * 6]} geometry={nodes.Cube.geometry} >
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={3}
          chromaticAberration={0.025}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.2}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          // color={"#d6d14d"}
        />
      </mesh>
      <group ref={ref}>{children}</group>
    </group>
  )
}

function Tuna(props) {
  const { scene, animations } = useGLTF('/tuna/tuna_fish.glb')
  const { actions, mixer } = useAnimations(animations, scene)
  useEffect(() => {
    mixer.timeScale = 0.6
    actions['Swim'].play()
  }, [actions, mixer])
  useFrame((state) => (scene.rotation.z = Math.sin(state.clock.elapsedTime / 4) / 2))
  return <primitive object={scene} {...props} />
}