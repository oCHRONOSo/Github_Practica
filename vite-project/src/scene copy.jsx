import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model() {
  const { scene } = useGLTF("/models/Portfolio-named.glb");

  scene.traverse((obj) => {
    if (obj.name.toLowerCase().includes("light")) {
      obj.intensity *= 0.1; // Dim the light
      obj.castShadow = true;
    }

    if (obj.name.toLowerCase().includes("lanternlight")) {
        obj.intensity *= 0.02; // Dim the light
        obj.castShadow = true;
      }
  });
  

  return <primitive object={scene} scale={1} />;
}

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.1} />
      
      <Model />
      <OrbitControls />
    </Canvas>
  );
}
