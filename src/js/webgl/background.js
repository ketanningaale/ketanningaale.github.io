/* ============================================================
   background.js — Noise-displaced mesh with grid shader
   Approximates the kprverse Three.js shader aesthetic
   ============================================================ */

import * as THREE from 'three';
import vertexShader from './shaders/background.vert?raw';
import fragmentShader from './shaders/background.frag?raw';

export function createBackground() {
  // Subdivided plane — more segments = smoother displacement
  const isMobile = window.innerWidth < 768;
  const segments = isMobile ? 64 : 128;
  const geometry = new THREE.PlaneGeometry(6, 6, segments, segments);

  const uniforms = {
    uTime:       { value: 0 },
    uScroll:     { value: 0 },
    uMouse:      { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = 0;

  return {
    mesh,
    uniforms,
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
