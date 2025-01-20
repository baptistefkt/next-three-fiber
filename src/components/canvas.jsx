import { useLayoutEffect, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMask, useGLTF, useAnimations, Float, CameraControls, Environment, RandomizedLight, AccumulativeShadows, MeshTransmissionMaterial } from '@react-three/drei'


export default function MyCanvas() {
  return (
    <Canvas shadows camera={{ position: [30, 0, -3], fov: 35, near: 1, far: 50 }}>

      <Aquarium position={[0, 0.025, 0]} >
        <Float rotationIntensity={1} floatIntensity={1} speed={2}>
          <Tuna position={[0, 0.4, 0]} rotation={[0, Math.PI, 0]} scale={3} />
        </Float>
      </Aquarium>

      <AccumulativeShadows temporal frames={100} color="#aaaaaa" colorBlend={2} opacity={0.7} scale={60} position={[0, -5, 0]}>
        <RandomizedLight amount={8} radius={15} ambient={0.5} intensity={1} position={[-5, 10, -5]} size={20} />
      </AccumulativeShadows>

      <Environment resolution={1024} background preset="apartment" blur={0.8} />

      <CameraController />
    </Canvas>
  )
}

const mapRange = (value, inputStart, inputEnd, outputStart, outputEnd) => {
  return outputStart + (outputEnd - outputStart) * ((value - inputStart) / (inputEnd - inputStart));
};

const mapPointerY = (pointerY) => {
  if (pointerY <= 0) {
    return 90;
  } else {
    return 90 + (0 - 90) * pointerY;
  }
};


function CameraController() {
  const cameraRef = useRef();

  useFrame((state) => {
    const angleX = mapRange(state.pointer.x, -1, 1, 0, 180);
    const angleXInRadians = (angleX * Math.PI) / 180;

    const angleYInDegrees = mapPointerY(state.pointer.y);
    const angleYInRadians = (angleYInDegrees * Math.PI) / 180;

    cameraRef.current.rotateTo(angleXInRadians, angleYInRadians, true);
  })

  useEffect(() => {
    cameraRef?.current?.disconnect();
  }, [])

  return (
    <CameraControls ref={cameraRef} truckSpeed={0} dollySpeed={0} />
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
        // color={"#e5eb98"}
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