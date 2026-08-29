import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulseVal: number;
}

interface PulsePacket {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  color: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const ElegantBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = {
      x: -1000,
      y: -1000,
      radius: 170
    };

    let ripples: Ripple[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseDown = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 180,
        alpha: 0.4
      });
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Particles & Data Packets
    let particles: Particle[] = [];
    let packets: PulsePacket[] = [];
    let time = 0;

    const initParticles = () => {
      particles = [];
      packets = [];
      const density = Math.min(Math.floor((width * height) / 16000), 65);
      for (let i = 0; i < density; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.8 + 1.2,
          baseAlpha: Math.random() * 0.4 + 0.2,
          pulseSpeed: Math.random() * 0.02 + 0.015,
          pulseVal: Math.random() * Math.PI * 2
        });
      }
    };

    initParticles();

    // Periodically spawn data packets between close particles
    const spawnPacket = () => {
      if (particles.length < 2) return;
      const i1 = Math.floor(Math.random() * particles.length);
      // find a neighbor within 160px
      for (let j = 0; j < particles.length; j++) {
        if (i1 === j) continue;
        const d = Math.hypot(particles[i1].x - particles[j].x, particles[i1].y - particles[j].y);
        if (d < 160) {
          packets.push({
            fromIndex: i1,
            toIndex: j,
            progress: 0,
            speed: 0.015 + Math.random() * 0.015,
            color: Math.random() > 0.4 ? '#34D399' : '#38BDF8'
          });
          break;
        }
      }
    };

    let packetInterval = setInterval(spawnPacket, 400);

    const render = () => {
      time += 0.008;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Organic Harmonic Topographic Waves in Background
      const numWaves = 3;
      for (let w = 0; w < numWaves; w++) {
        ctx.beginPath();
        const baseHeight = height * (0.35 + w * 0.22);
        const waveOffset = w * 2.2 + time * (0.4 + w * 0.15);

        ctx.moveTo(0, baseHeight + Math.sin(waveOffset) * 45);

        for (let x = 0; x <= width; x += 30) {
          const y =
            baseHeight +
            Math.sin(x * 0.003 + waveOffset) * 40 +
            Math.cos(x * 0.0015 - waveOffset * 0.8) * 25;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle =
          w === 0
            ? 'rgba(16, 185, 129, 0.12)'
            : w === 1
            ? 'rgba(6, 182, 212, 0.10)'
            : 'rgba(52, 211, 153, 0.09)';
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // 2. Draw Subtle Ambient Aurora Glow
      const grad1 = ctx.createRadialGradient(
        width * 0.3 + Math.sin(time * 0.5) * 80,
        height * 0.25 + Math.cos(time * 0.4) * 50,
        20,
        width * 0.3,
        height * 0.25,
        width * 0.45
      );
      grad1.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
      grad1.addColorStop(0.5, 'rgba(6, 182, 212, 0.035)');
      grad1.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.75 + Math.cos(time * 0.3) * 60,
        height * 0.65 + Math.sin(time * 0.5) * 60,
        20,
        width * 0.75,
        height * 0.65,
        width * 0.4
      );
      grad2.addColorStop(0, 'rgba(56, 189, 248, 0.06)');
      grad2.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 3. Render Ripples from User Click
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += 2.5;
        rip.alpha *= 0.95;

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(52, 211, 153, ${rip.alpha * 1.2})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        if (rip.radius > rip.maxRadius || rip.alpha < 0.01) {
          ripples.splice(r, 1);
        }
      }

      // 4. Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Soft bounce on borders
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse displacement
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 0.9;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
        }

        // Pulse
        p.pulseVal += p.pulseSpeed;
        const currentAlpha = p.baseAlpha + Math.sin(p.pulseVal) * 0.2;

        // Particle Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52, 211, 153, ${Math.max(0.22, currentAlpha)})`;
        ctx.fill();

        // Connect with neighbors (darker, crisper lines)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distance = Math.hypot(p.x - p2.x, p.y - p2.y);
          const maxDist = 150;

          if (distance < maxDist) {
            const lineAlpha = (1 - distance / maxDist) * 0.38;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(45, 212, 191, ${lineAlpha})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        }

        // Connect to mouse pointer
        if (dist < mouse.radius) {
          const mouseLineAlpha = (1 - dist / mouse.radius) * 0.55;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(110, 231, 183, ${mouseLineAlpha})`;
          ctx.lineWidth = 1.3;
          ctx.stroke();

          // Small cursor node halo
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(52, 211, 153, ${mouseLineAlpha * 0.8})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      // 5. Update & Draw Data Packets
      for (let k = packets.length - 1; k >= 0; k--) {
        const pkt = packets[k];
        pkt.progress += pkt.speed;

        const p1 = particles[pkt.fromIndex];
        const p2 = particles[pkt.toIndex];

        if (p1 && p2 && pkt.progress <= 1) {
          const curX = p1.x + (p2.x - p1.x) * pkt.progress;
          const curY = p1.y + (p2.y - p1.y) * pkt.progress;

          ctx.beginPath();
          ctx.arc(curX, curY, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = pkt.color;
          ctx.shadowColor = pkt.color;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        } else {
          packets.splice(k, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(packetInterval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background Architectural Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #10B981 1px, transparent 1px),
            linear-gradient(to bottom, #10B981 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px'
        }}
      />

      {/* Elegant Radial Depth Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0D0F]/60 to-[#0B0D0F] pointer-events-none" />

      {/* Dynamic Animated Geometric & Wave Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
};
