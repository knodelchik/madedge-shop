import React, { useEffect, useRef, useCallback } from 'react';
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';

interface ThreadsProps {
  color?: [number, number, number];
  amplitude?: number;
  distance?: number;
  enableMouseInteraction?: boolean;
}

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;

#define PI 3.1415926538

const int u_line_count = 30;
const float u_line_width = 4.0;
const float u_line_blur = 10.0;

float pixel(float count, vec2 resolution) {
  return (1.0 / max(resolution.x, resolution.y)) * count;
}

// Спрощена шумова функція
float SimpleNoise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float lineFn(vec2 st, float width, float perc, float offset, vec2 mouse, float time, float amplitude, float distance) {
  float split_offset = (perc * 0.4);
  float split_point = 0.1 + split_offset;

  float amplitude_normal = smoothstep(split_point, 0.7, st.x);
  float amplitude_strength = 0.5;
  float finalAmplitude = amplitude_normal * amplitude_strength * amplitude * (1.0 + (mouse.y - 0.5) * 0.2);

  float time_scaled = time / 10.0 + (mouse.x - 0.5) * 1.0;
  float blur = smoothstep(split_point, split_point + 0.05, st.x) * perc;

  // Спрощені обчислення шуму
  float xnoise = sin(time_scaled * 2.0 + st.x * 10.0 + perc * 5.0) * 0.1 +
                 sin(time_scaled * 3.0 + st.x * 15.0) * 0.05;

  float y = 0.5 + (perc - 0.5) * distance + xnoise * finalAmplitude;

  float line_start = smoothstep(
    y + (width / 2.0) + (u_line_blur * pixel(1.0, iResolution.xy) * blur),
    y,
    st.y
  );

  float line_end = smoothstep(
    y,
    y - (width / 2.0) - (u_line_blur * pixel(1.0, iResolution.xy) * blur),
    st.y
  );

  return clamp(
    (line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))),
    0.0,
    1.0
  );
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy;

  float line_strength = 1.0;
  for (int i = 0; i < u_line_count; i++) {
    float p = float(i) / float(u_line_count);
    line_strength *= (1.0 - lineFn(
      uv,
      u_line_width * pixel(1.0, iResolution.xy) * (1.0 - p),
      p,
      (PI * 1.0) * p,
      uMouse,
      iTime,
      uAmplitude,
      uDistance
    ));
  }

  float colorVal = 1.0 - line_strength;
  fragColor = vec4(uColor * colorVal, colorVal);
}

void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

const Threads: React.FC<ThreadsProps> = ({
  color = [1, 1, 1],
  amplitude = 1,
  distance = 0,
  enableMouseInteraction = false,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(0);
  const mousePositionRef = useRef<[number, number]>([0.5, 0.5]);
  const targetMouseRef = useRef<[number, number]>([0.5, 0.5]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, 1.0 - (e.clientY - rect.top) / rect.height));
    targetMouseRef.current = [x, y];
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetMouseRef.current = [0.5, 0.5];
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const renderer = new Renderer({ 
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Color()
        },
        uColor: { value: new Color(...color) },
        uAmplitude: { value: amplitude },
        uDistance: { value: distance },
        uMouse: { value: new Float32Array([0.5, 0.5]) }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    const handleResize = () => {
      const { clientWidth, clientHeight } = container;
      const dpr = Math.min(2, window.devicePixelRatio);
      
      renderer.setSize(clientWidth * dpr, clientHeight * dpr);
      renderer.gl.canvas.style.width = `${clientWidth}px`;
      renderer.gl.canvas.style.height = `${clientHeight}px`;
      
      program.uniforms.iResolution.value.set(
        clientWidth,
        clientHeight,
        clientWidth / clientHeight
      );
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    if (enableMouseInteraction) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    let lastTime = 0;
    const fps = 60;
    const interval = 1000 / fps;

    const update = (t: number) => {
      animationFrameId.current = requestAnimationFrame(update);
      
      if (t - lastTime < interval) {
        return;
      }
      lastTime = t;

      // Оновлення позиції миші
      if (enableMouseInteraction) {
        const smoothing = 0.05;
        const [currentX, currentY] = mousePositionRef.current;
        const [targetX, targetY] = targetMouseRef.current;
        
        mousePositionRef.current = [
          currentX + smoothing * (targetX - currentX),
          currentY + smoothing * (targetY - currentY)
        ];
        
        program.uniforms.uMouse.value[0] = mousePositionRef.current[0];
        program.uniforms.uMouse.value[1] = mousePositionRef.current[1];
      }

      program.uniforms.iTime.value = t * 0.001;
      
      // Виправлений виклик render - без параметрів або тільки з scene
      renderer.render({ scene: mesh });
    };

    animationFrameId.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      window.removeEventListener('resize', handleResize);

      if (enableMouseInteraction) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
    };
  }, [color, amplitude, distance, enableMouseInteraction, handleMouseMove, handleMouseLeave]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-8/12 relative"
      style={{ imageRendering: 'auto' }}
      {...rest} 
    />
  );
};

export default Threads;