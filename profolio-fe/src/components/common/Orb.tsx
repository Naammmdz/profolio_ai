import { useEffect, useRef } from 'react';

interface OrbProps {
  hue?: number;
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  forceHoverState?: boolean;
  backgroundColor?: string;
  colors?: [string, string, string];
}

const VERT = `
  precision highp float;
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAG = `
  precision highp float;

  uniform float iTime;
  uniform vec3 iResolution;
  uniform float hue;
  uniform float hover;
  uniform float rot;
  uniform float hoverIntensity;
  uniform vec3 backgroundColor;
  uniform vec3 baseColor1;
  uniform vec3 baseColor2;
  uniform vec3 baseColor3;
  varying vec2 vUv;

  vec3 rgb2yiq(vec3 c) {
    float y = dot(c, vec3(0.299, 0.587, 0.114));
    float i = dot(c, vec3(0.596, -0.274, -0.322));
    float q = dot(c, vec3(0.211, -0.523, 0.312));
    return vec3(y, i, q);
  }
  
  vec3 yiq2rgb(vec3 c) {
    float r = c.x + 0.956 * c.y + 0.621 * c.z;
    float g = c.x - 0.272 * c.y - 0.647 * c.z;
    float b = c.x - 1.106 * c.y + 1.703 * c.z;
    return vec3(r, g, b);
  }
  
  vec3 adjustHue(vec3 color, float hueDeg) {
    float hueRad = hueDeg * 3.14159265 / 180.0;
    vec3 yiq = rgb2yiq(color);
    float cosA = cos(hueRad);
    float sinA = sin(hueRad);
    float i = yiq.y * cosA - yiq.z * sinA;
    float q = yiq.y * sinA + yiq.z * cosA;
    yiq.y = i;
    yiq.z = q;
    return yiq2rgb(yiq);
  }
  
  vec3 hash33(vec3 p3) {
    p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
    p3 += dot(p3, p3.yxz + 19.19);
    return -1.0 + 2.0 * fract(vec3(
      p3.x + p3.y,
      p3.x + p3.z,
      p3.y + p3.z
    ) * p3.zyx);
  }
  
  float snoise3(vec3 p) {
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;
    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
    vec3 e = step(vec3(0.0), d0 - d0.yzx);
    vec3 i1 = e * (1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy * (1.0 - e);
    vec3 d1 = d0 - (i1 - K2);
    vec3 d2 = d0 - (i2 - K1);
    vec3 d3 = d0 - 0.5;
    vec4 h = max(0.6 - vec4(
      dot(d0, d0),
      dot(d1, d1),
      dot(d2, d2),
      dot(d3, d3)
    ), 0.0);
    vec4 n = h * h * h * h * vec4(
      dot(d0, hash33(i)),
      dot(d1, hash33(i + i1)),
      dot(d2, hash33(i + i2)),
      dot(d3, hash33(i + 1.0))
    );
    return dot(vec4(31.316), n);
  }
  
  vec4 extractAlpha(vec3 colorIn) {
    float a = max(max(colorIn.r, colorIn.g), colorIn.b);
    return vec4(colorIn.rgb / (a + 1e-5), a);
  }
  
  const float innerRadius = 0.6;
  const float noiseScale = 0.65;
  
  float light1(float intensity, float attenuation, float dist) {
    return intensity / (1.0 + dist * attenuation);
  }
  
  float light2(float intensity, float attenuation, float dist) {
    return intensity / (1.0 + dist * dist * attenuation);
  }
  
  vec4 draw(vec2 uv) {
    vec3 color1 = adjustHue(baseColor1, hue);
    vec3 color2 = adjustHue(baseColor2, hue);
    vec3 color3 = adjustHue(baseColor3, hue);
    
    float ang = atan(uv.y, uv.x);
    float len = length(uv);
    float invLen = len > 0.0 ? 1.0 / len : 0.0;
    
    float bgLuminance = dot(backgroundColor, vec3(0.299, 0.587, 0.114));
    
    float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
    float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
    float d0 = distance(uv, (r0 * invLen) * uv);
    float v0 = light1(1.0, 10.0, d0);

    v0 *= smoothstep(r0 * 1.05, r0, len);
    float innerFade = smoothstep(r0 * 0.8, r0 * 0.95, len);
    v0 *= mix(innerFade, 1.0, bgLuminance * 0.7);
    float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
    
    float a = iTime * -1.0;
    vec2 pos = vec2(cos(a), sin(a)) * r0;
    float d = distance(uv, pos);
    float v1 = light2(1.5, 5.0, d);
    v1 *= light1(1.0, 50.0, d0);
    
    float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
    float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
    
    vec3 colBase = mix(color1, color2, cl);
    float fadeAmount = mix(1.0, 0.1, bgLuminance);
    
    vec3 darkCol = mix(color3, colBase, v0);
    darkCol = (darkCol + v1) * v2 * v3;
    darkCol = clamp(darkCol, 0.0, 1.0);
    
    vec3 lightCol = (colBase + v1) * mix(1.0, v2 * v3, fadeAmount);
    lightCol = mix(backgroundColor, lightCol, v0);
    lightCol = clamp(lightCol, 0.0, 1.0);
    
    vec3 finalCol = mix(darkCol, lightCol, bgLuminance);
    
    return extractAlpha(finalCol);
  }
  
  vec4 mainImage(vec2 fragCoord) {
    vec2 center = iResolution.xy * 0.5;
    float size = min(iResolution.x, iResolution.y);
    vec2 uv = (fragCoord - center) / size * 2.0;
    
    float angle = rot;
    float s = sin(angle);
    float c = cos(angle);
    uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
    
    uv.x += hover * hoverIntensity * 0.1 * sin(uv.y * 10.0 + iTime);
    uv.y += hover * hoverIntensity * 0.1 * sin(uv.x * 10.0 + iTime);
    
    return draw(uv);
  }
  
  void main() {
    vec2 fragCoord = vUv * iResolution.xy;
    vec4 col = mainImage(fragCoord);
    gl_FragColor = vec4(col.rgb * col.a, col.a);
  }
`;

export default function Orb({
  hue = 0,
  hoverIntensity = 0.2,
  rotateOnHover = true,
  forceHoverState = false,
  backgroundColor = '#000000',
  colors = ['#9c43fe', '#4cc2e9', '#101499'],
}: OrbProps) {
  const ctnDom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ctnDom.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
    });
    if (!gl) return;

    container.appendChild(canvas);

    const program = createProgram(gl, VERT, FRAG);
    if (!program) {
      container.removeChild(canvas);
      return;
    }
    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1, 0, 0,
      3, -1, 2, 0,
      -1, 3, 0, 2,
    ]);
    const buffer = gl.createBuffer();
    if (!buffer) {
      container.removeChild(canvas);
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    const uvLoc = gl.getAttribLocation(program, 'uv');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 16, 8);

    const iTimeLoc = gl.getUniformLocation(program, 'iTime');
    const iResolutionLoc = gl.getUniformLocation(program, 'iResolution');
    const hueLoc = gl.getUniformLocation(program, 'hue');
    const hoverLoc = gl.getUniformLocation(program, 'hover');
    const rotLoc = gl.getUniformLocation(program, 'rot');
    const hoverIntensityLoc = gl.getUniformLocation(program, 'hoverIntensity');
    const backgroundColorLoc = gl.getUniformLocation(program, 'backgroundColor');
    const baseColor1Loc = gl.getUniformLocation(program, 'baseColor1');
    const baseColor2Loc = gl.getUniformLocation(program, 'baseColor2');
    const baseColor3Loc = gl.getUniformLocation(program, 'baseColor3');

    let targetHover = 0;
    let currentHover = 0;
    let lastTime = 0;
    let currentRot = 0;
    let rafId = 0;
    const rotationSpeed = 0.3;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.floor(container.clientWidth * dpr));
      const height = Math.max(1, Math.floor(container.clientHeight * dpr));
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform3f(iResolutionLoc, width, height, width / height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;
      const size = Math.min(width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      const uvX = ((x - centerX) / size) * 2.0;
      const uvY = ((y - centerY) / size) * 2.0;
      targetHover = Math.sqrt(uvX * uvX + uvY * uvY) < 0.8 ? 1 : 0;
    };

    const handleMouseLeave = () => {
      targetHover = 0;
    };

    window.addEventListener('resize', resize);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    resize();

    const render = (timeMs: number) => {
      rafId = requestAnimationFrame(render);
      const timeSec = timeMs * 0.001;
      const dt = (timeMs - lastTime) * 0.001;
      lastTime = timeMs;

      const effectiveHover = forceHoverState ? 1 : targetHover;
      currentHover += (effectiveHover - currentHover) * 0.1;

      if (rotateOnHover && effectiveHover > 0.5) {
        currentRot += dt * rotationSpeed;
      }

      const bg = colorToRgb(backgroundColor);
      const c1 = colorToRgb(colors[0]);
      const c2 = colorToRgb(colors[1]);
      const c3 = colorToRgb(colors[2]);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform1f(iTimeLoc, timeSec);
      gl.uniform1f(hueLoc, hue);
      gl.uniform1f(hoverLoc, currentHover);
      gl.uniform1f(rotLoc, currentRot);
      gl.uniform1f(hoverIntensityLoc, hoverIntensity);
      gl.uniform3f(backgroundColorLoc, bg[0], bg[1], bg[2]);
      gl.uniform3f(baseColor1Loc, c1[0], c1[1], c1[2]);
      gl.uniform3f(baseColor2Loc, c2[0], c2[1], c2[2]);
      gl.uniform3f(baseColor3Loc, c3[0], c3[1], c3[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (container.contains(canvas)) container.removeChild(canvas);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [hue, hoverIntensity, rotateOnHover, forceHoverState, backgroundColor, colors]);

  return <div ref={ctnDom} className="w-full h-full" />;
}

function createProgram(gl: WebGLRenderingContext, vertexSrc: string, fragmentSrc: string) {
  const vShader = createShader(gl, gl.VERTEX_SHADER, vertexSrc);
  const fShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
  if (!vShader || !fShader) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);

  const ok = gl.getProgramParameter(program, gl.LINK_STATUS);
  gl.deleteShader(vShader);
  gl.deleteShader(fShader);
  if (!ok) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const ok = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!ok) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) return [l, l, l];

  const hue2rgb = (p: number, q: number, t: number) => {
    let nt = t;
    if (nt < 0) nt += 1;
    if (nt > 1) nt -= 1;
    if (nt < 1 / 6) return p + (q - p) * 6 * nt;
    if (nt < 1 / 2) return q;
    if (nt < 2 / 3) return p + (q - p) * (2 / 3 - nt) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [hue2rgb(p, q, h + 1 / 3), hue2rgb(p, q, h), hue2rgb(p, q, h - 1 / 3)];
}

function colorToRgb(color: string): [number, number, number] {
  if (color.startsWith('#') && color.length >= 7) {
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;
    return [r, g, b];
  }

  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return [parseInt(rgbMatch[1], 10) / 255, parseInt(rgbMatch[2], 10) / 255, parseInt(rgbMatch[3], 10) / 255];
  }

  const hslMatch = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/);
  if (hslMatch) {
    const h = parseInt(hslMatch[1], 10) / 360;
    const s = parseInt(hslMatch[2], 10) / 100;
    const l = parseInt(hslMatch[3], 10) / 100;
    return hslToRgb(h, s, l);
  }

  return [0, 0, 0];
}
