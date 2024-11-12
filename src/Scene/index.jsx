import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import './index.scss';

function ExtrudedShape({ points, width, height, age }) {
  const shape = useMemo(() => {
    const newShape = new THREE.Shape();
    newShape.moveTo((points[0].x / (width / 2)) - 1, (points[0].y / (height / -2)) + 1);
    points.slice(1).forEach((point) => {
      newShape.lineTo((point.x / (width / 2)) - 1, (point.y / (height / -2)) + 1);
    });
    newShape.closePath();
    return newShape;
  }, [points]);

  const extrudeSettings = {
    depth: age / 10,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: 0.2,
    bevelOffset: -0.1,
    bevelSegments: 12,
    steps: 6,
  };

  return (
    <mesh position={[0, 0, 0]}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshPhysicalMaterial
        transmission={0.9}
        metalness={0.3}
        roughness={0.05}
        clearcoat={1}
        clearcoatRoughness={0}
        reflectivity={1}
        envMapIntensity={3}
        ior={1.33}
        attenuationTint={new THREE.Color(0.2, 0.6, 1)}
        attenuationDistance={0.1}
      />
    </mesh>
  );
}

function Bubble({ bubble }) {
  useFrame(() => {
    // move bubble on z axis while it's attached property is true
    // move bubble on y axis when it's attached property is false
    // if it's y position is greater than 1, remove it from the bubble array
  });
}

export default function Scene({ loops, width, height }) {
  const [bubbles, setBubbles] = useState([]);
  const prevLoops = useRef([]);

  useEffect(() => {
    // Check for new loops and lost loops and update bubbles accordingly
    // new loops should add a bubble to the bubble array
    // lost loops should update that bubble's attached property to false
    prevLoops.current = loops;
  }, [loops]);

  return (
    <Canvas className="scene" style={{ width, height }}>
      <Environment preset="city" />
      <PerspectiveCamera makeDefault fov={4} position={[0, 0, 24]} />
      <directionalLight />
      {loops.map((loop, index) => (
        <ExtrudedShape
          key={index}
          points={loop.points}
          width={width}
          height={height}
          age={loop.age}
        />
      ))}
      {bubbles.map((bubble) => (
        <Bubble
          bubble={bubble}
        />
      ))}
    </Canvas>
  );
}
