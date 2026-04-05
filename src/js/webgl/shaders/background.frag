uniform float uTime;
uniform float uScroll;
uniform vec2  uResolution;

varying vec2  vUv;
varying float vDisplacement;

// kprverse-style cubic pulse — soft bright spots at grid intersections
float cubicPulse(float c, float w, float x) {
  x = abs(x - c);
  if (x > w) return 0.0;
  x /= w;
  return 1.0 - x * x * (3.0 - 2.0 * x);
}

void main() {
  // Grid coordinates — scale UV to create a visible grid pattern
  float gridScale = 28.0; // number of grid cells across
  vec2 grid = vUv * gridScale;
  vec2 gridFrac = fract(grid);

  // Anti-aliased dot at each grid intersection using cubicPulse
  float dotX = cubicPulse(0.5, 0.08, gridFrac.x);
  float dotY = cubicPulse(0.5, 0.08, gridFrac.y);
  float dot  = dotX * dotY;

  // Anti-aliased grid lines (very thin)
  float lineWidth = 0.02;
  float lineX = cubicPulse(0.0, lineWidth, gridFrac.x) + cubicPulse(1.0, lineWidth, gridFrac.x);
  float lineY = cubicPulse(0.0, lineWidth, gridFrac.y) + cubicPulse(1.0, lineWidth, gridFrac.y);
  float lines = max(lineX, lineY);

  // Combine dots and lines
  float pattern = dot * 0.6 + lines * 0.15;

  // Displacement glow — brighter where mesh is displaced more
  float glow = smoothstep(0.0, 0.2, abs(vDisplacement)) * 0.25;

  // Fade edges (vignette)
  float vignette = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x)
                 * smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);

  // Final composite
  float alpha = (pattern + glow) * vignette * 0.35;

  // Subtle blue-white colour shift based on displacement
  vec3 color = mix(
    vec3(0.7, 0.75, 0.85),  // cool blue-grey
    vec3(1.0, 1.0, 1.0),    // white
    smoothstep(-0.1, 0.15, vDisplacement)
  );

  gl_FragColor = vec4(color, alpha);
}
