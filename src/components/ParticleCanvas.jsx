import { useEffect, useRef } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery.js';

const BLUE = { r: 59, g: 130, b: 246 };
const CYAN = { r: 34, g: 211, b: 238 };

function lerpColor(a, b, t) {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  };
}

export function ParticleCanvas() {
  const canvasRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width, height;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const particleCount = isMobile ? 35 : 80;
    const connectionDistance = 130;
    const mouseDistance = 180;

    const mouse = { x: null, y: null };
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = null; mouse.y = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.size = Math.random() * 2.2 + 0.8;
        // 70% blue, 30% cyan
        this.colorT = Math.random() < 0.7 ? 0 : 1;
        const c = lerpColor(BLUE, CYAN, this.colorT);
        this.color = c;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x != null && mouse.y != null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseDistance) {
            const force = (mouseDistance - dist) / mouseDistance;
            this.x += dx * force * 0.05;
            this.y += dy * force * 0.05;
          }
        }
      }
      draw(isDark) {
        const alpha = isDark ? 0.8 : 0.6;
        const { r, g, b } = this.color;
        const glowSize = isDark ? this.size * 3.5 : this.size * 2.5;

        ctx.save();
        ctx.shadowBlur = glowSize * 4;
        ctx.shadowColor = `rgba(${r},${g},${b},${isDark ? 0.9 : 0.5})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
        ctx.restore();
      }
    }

    const particles = Array.from({ length: particleCount }, () => new Particle());

    const animate = () => {
      const isDark = document.documentElement.classList.contains('dark');
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(isDark);

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            const t = 1 - dist / connectionDistance;
            const ci = particles[i].color;
            const cj = particles[j].color;
            const grad = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            const a = isDark ? t * 0.35 : t * 0.2;
            grad.addColorStop(0, `rgba(${ci.r},${ci.g},${ci.b},${a})`);
            grad.addColorStop(1, `rgba(${cj.r},${cj.g},${cj.b},${a})`);
            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth = isDark ? 0.8 : 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    />
  );
}
