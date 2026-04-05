/* ============================================================
   scene.js — Three.js scene, camera, renderer, animation loop
   Matches kprverse: PerspectiveCamera 24° FOV, HiDPI-aware
   ============================================================ */

import * as THREE from 'three';
import { createBackground } from './background.js';

let renderer, scene, camera, clock;
let background;
let mouseX = 0.5, mouseY = 0.5;
let scrollProgress = 0;
let animId;

export function initWebGL() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  // Check WebGL support
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) {
    canvas.style.display = 'none';
    return;
  }

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,        // transparent background — CSS bg shows through
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  // Scene
  scene = new THREE.Scene();

  // Camera — kprverse uses ~24° FOV for that flat-but-3D perspective
  camera = new THREE.PerspectiveCamera(
    24,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 5);

  // Clock
  clock = new THREE.Clock();

  // Background mesh
  background = createBackground();
  scene.add(background.mesh);

  // Events
  window.addEventListener('resize', onResize);
  document.addEventListener('mousemove', onMouseMove);

  // Start loop
  animate();
}

function onResize() {
  if (!renderer) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  if (background) {
    background.uniforms.uResolution.value.set(w, h);
  }
}

function onMouseMove(e) {
  mouseX = e.clientX / window.innerWidth;
  mouseY = 1.0 - e.clientY / window.innerHeight; // flip Y for GL coords
}

export function setScrollProgress(progress) {
  scrollProgress = progress;
}

function animate() {
  animId = requestAnimationFrame(animate);
  if (!renderer) return;

  const elapsed = clock.getElapsedTime();

  if (background) {
    background.uniforms.uTime.value = elapsed;
    background.uniforms.uScroll.value = scrollProgress;
    background.uniforms.uMouse.value.set(mouseX, mouseY);
  }

  renderer.render(scene, camera);
}

export function disposeWebGL() {
  cancelAnimationFrame(animId);
  window.removeEventListener('resize', onResize);
  document.removeEventListener('mousemove', onMouseMove);
  if (background) background.dispose();
  if (renderer) renderer.dispose();
}
