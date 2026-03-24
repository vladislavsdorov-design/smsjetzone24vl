import React, { useEffect, useRef } from "react";

const FloatingParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];
    let lastScrollY = 0;
    let scrollVelocity = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const particleCount = 100;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          color: `rgba(241, 241, 241, ${Math.random() * 0.1 + 0.1})`,
          // Добавляем индивидуальные свойства для каждой частицы
          resistance: Math.random() * 0.5 + 0.5, // Сопротивление движению
          inertia: Math.random() * 0.3 + 0.2, // Инерция
        });
      }
    };

    const drawParticles = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Рисуем линии
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            const opacity = 0.3 * (1 - distance / 100);
            ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
            ctx.lineWidth = 0.3;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Рисуем частицы
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Разнообразное влияние прокрутки
        const scrollImpact = scrollVelocity * particle.inertia;

        // Разные направления движения при скролле
        const scrollDirection =
          Math.sin(particle.y * 0.02) * scrollImpact * 0.5;

        // Применяем движение
        particle.x += particle.vx + scrollDirection * 0.1;
        particle.y += particle.vy + scrollImpact * 0.3;

        // Добавляем затухание скорости
        particle.vx *= 0.7;
        particle.vy *= 0.7;

        // Случайные микродвижения для разнообразия
        if (Math.random() < 0.02) {
          particle.vx += (Math.random() - 0.5) * 0.05;
          particle.vy += (Math.random() - 0.5) * 0.05;
        }

        // Отскок от краев
        if (particle.x < 0) {
          particle.x = 0;
          particle.vx = -particle.vx * 0.8;
        }
        if (particle.x > canvas.width) {
          particle.x = canvas.width;
          particle.vx = -particle.vx * 0.8;
        }
        if (particle.y < 0) {
          particle.y = 0;
          particle.vy = -particle.vy * 0.8;
        }
        if (particle.y > canvas.height) {
          particle.y = canvas.height;
          particle.vy = -particle.vy * 0.8;
        }

        // Ограничение скорости
        const maxSpeed = 2;
        particle.vx = Math.min(maxSpeed, Math.max(-maxSpeed, particle.vx));
        particle.vy = Math.min(maxSpeed, Math.max(-maxSpeed, particle.vy));
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      // Вычисляем скорость прокрутки с затуханием
      scrollVelocity = delta * 0.1;

      // Добавляем разнообразие: разные частицы реагируют по-разному
      particles.forEach((particle) => {
        // Разные направления движения в зависимости от позиции
        const direction = Math.sin(particle.x * 0.01) * (delta * 0.02);
        const verticalForce = delta * (0.05 + Math.random() * 0.03);

        particle.vx += direction * particle.resistance;
        particle.vy += verticalForce * particle.resistance;

        // Эффект "волны" при прокрутке
        if (Math.abs(delta) > 10) {
          const waveForce =
            Math.sin(Date.now() * 0.005 + particle.x * 0.01) *
            Math.abs(delta) *
            0.02;
          particle.vx += waveForce;
          particle.vy += waveForce * 0.5;
        }
      });

      lastScrollY = currentScrollY;

      // Плавное затухание скорости прокрутки
      setTimeout(() => {
        scrollVelocity *= 0.5;
      }, 50);
    };

    const init = () => {
      resizeCanvas();
      createParticles();
      drawParticles();
    };

    window.addEventListener("resize", () => {
      resizeCanvas();
      particles = [];
      createParticles();
    });

    window.addEventListener("scroll", handleScroll);

    init();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

export default FloatingParticles;
