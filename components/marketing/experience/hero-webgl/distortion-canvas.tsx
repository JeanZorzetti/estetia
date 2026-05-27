'use client'

import { useEffect, useRef } from 'react'

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const FRAGMENT_SHADER = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;

  // Simplex-like noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                     + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);

    // Mouse influence
    vec2 mouse = u_mouse * aspect;
    vec2 uvAspect = uv * aspect;
    float dist = length(uvAspect - mouse);
    float mouseInfluence = smoothstep(0.6, 0.0, dist);

    float t = u_time * 0.18;

    // Layered noise
    float n1 = snoise(uv * 2.8 + vec2(t * 0.5, t * 0.3)) * 0.5 + 0.5;
    float n2 = snoise(uv * 5.2 + vec2(-t * 0.4, t * 0.6) + mouse * 0.3) * 0.5 + 0.5;
    float n3 = snoise(uv * 1.4 + vec2(t * 0.2, -t * 0.5)) * 0.5 + 0.5;

    float blob = n1 * 0.45 + n2 * 0.35 + n3 * 0.2;
    blob = blob + mouseInfluence * 0.25;

    // Color palette: navy deep → teal → gold
    vec3 colA = vec3(0.016, 0.031, 0.059);   // #04080F
    vec3 colB = vec3(0.027, 0.125, 0.212);   // #072035
    vec3 colC = vec3(0.282, 0.624, 0.710);   // #489FB5
    vec3 colD = vec3(0.773, 0.627, 0.349);   // #C5A059

    vec3 col = mix(colA, colB, smoothstep(0.0, 0.4, blob));
    col = mix(col, colC, smoothstep(0.4, 0.72, blob) * 0.55);
    col = mix(col, colD * 0.6, smoothstep(0.7, 1.0, blob) * 0.4);

    // Vignette
    float vignette = smoothstep(0.0, 0.6, 1.0 - length((uv - 0.5) * 1.35));
    col *= vignette * 0.75 + 0.25;

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function DistortionCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl')
    if (!gl) return

    const vert = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vert, VERTEX_SHADER)
    gl.compileShader(vert)

    const frag = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(frag, FRAGMENT_SHADER)
    gl.compileShader(frag)

    if (!gl.getShaderParameter(frag, gl.COMPILE_STATUS)) {
      console.error('[DistortionCanvas] Shader error:', gl.getShaderInfoLog(frag))
      return
    }

    const program = gl.createProgram()!
    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    gl.useProgram(program)

    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    const posAttr = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(posAttr)
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(program, 'u_resolution')
    const uTime = gl.getUniformLocation(program, 'u_time')
    const uMouse = gl.getUniformLocation(program, 'u_mouse')

    let width = 0
    let height = 0

    function resize() {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio, 2)
      width = canvas.clientWidth * dpr
      height = canvas.clientHeight * dpr
      canvas.width = width
      canvas.height = height
      gl!.viewport(0, 0, width, height)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      targetMouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1.0 - (e.clientY - rect.top) / rect.height,
      }
    }
    window.addEventListener('mousemove', onMouseMove)

    const startTime = performance.now()

    function render() {
      // Lerp mouse
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.06
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.06

      const elapsed = (performance.now() - startTime) / 1000
      gl!.uniform2f(uRes, width, height)
      gl!.uniform1f(uTime, elapsed)
      gl!.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y)
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
      rafRef.current = requestAnimationFrame(render)
    }
    rafRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMouseMove)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ display: 'block' }}
    />
  )
}
