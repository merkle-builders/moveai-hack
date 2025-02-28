'use client';

import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  color: string;
  hoverColor: string;
  isMoving: boolean;
  opacity: number;
  character: string;
  drop: number;
}

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Combined configuration
    const spacing = 13;
    const fontSize = 11;
    let isPhone = window.innerWidth <= 768;
    
    const rows = isPhone? Math.ceil(window.innerHeight / spacing) + 10 : Math.ceil(window.innerHeight / spacing) + 2;
    const cols = Math.ceil(window.innerWidth / spacing) + 2;
    const maxTravelDistance = spacing / 3;
    const influenceRadius = 125;
    const matrix = 'RUSTOLIDYjacpvweb3{}*></"$@';

    const dimmedGrey = 'rgba(100, 100, 100, 0.1)';
    const fullGrey = 'rgba(100, 100, 100, 0.2)';

    const getRandomCharacter = (): string => {
      return matrix.charAt(Math.floor(Math.random() * matrix.length));
    };

    // Initialize points with both hover and drop behavior
    const points: Point[] = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        points.push({
          x: j * spacing,
          y: i * spacing,
          originalX: j * spacing,
          originalY: i * spacing,
          color: dimmedGrey,
          hoverColor: 'rgba(100, 100, 100, 0.3)',
          isMoving: false,
          opacity: 0,
          character: getRandomCharacter(),
          drop: 1
        });
      }
    }

    let mousePos = { x: 0, y: 0 };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const isMouseOutside = mousePos.x <= 0 || mousePos.y <= 0 || 
                            mousePos.x > canvas.width || mousePos.y > canvas.height;
      const currentInfluenceRadius = isMouseOutside ? 0 : influenceRadius;

      points.forEach((point) => {
        // Mouse interaction effect
        const dx = mousePos.x - point.x;
        const dy = mousePos.y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (point.opacity < 1) {
          point.opacity = Math.min(1, point.opacity + 0.01);
        }

        // Handle hover effect
        if (distance < currentInfluenceRadius) {
          const force = (influenceRadius - distance) / influenceRadius;
          let newX = point.x + dx * force * 0.05;
          let newY = point.y + dy * force * 0.05;

          const travelDistance = Math.sqrt(
            Math.pow(newX - point.originalX, 2) + 
            Math.pow(newY - point.originalY, 2)
          );

          if (travelDistance > maxTravelDistance) {
            const angle = Math.atan2(newY - point.originalY, newX - point.originalX);
            newX = point.originalX + Math.cos(angle) * maxTravelDistance;
            newY = point.originalY + Math.sin(angle) * maxTravelDistance;
          }

          point.isMoving = newX !== point.x || newY !== point.y;
          point.x = newX;
          point.y = newY;
          point.color = point.isMoving ? point.hoverColor : fullGrey;
        } else {
          // Matrix rain effect
        //   point.y = (point.drop * fontSize) % canvas.height;
        //   if (point.y > canvas.height && Math.random() > 0.975) {
        //     point.drop = 0;
        //   }
        //   point.drop++;

          // Reset position if not affected by mouse
          point.x += (point.originalX - point.x) * 0.1;
          point.isMoving = Math.abs(point.x - point.originalX) > 0.01;
          point.color = point.isMoving ? point.hoverColor : dimmedGrey;
        }

        // Randomly change characters
        if ((point.isMoving || Math.random() < 0.02) && Math.random() < 0.2) {
          point.character = getRandomCharacter();
        }

        // Draw the character
        ctx.fillStyle = point.color;
        ctx.globalAlpha = point.opacity;
        ctx.font = `${fontSize}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(point.character, point.x, point.y);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPhone) {
        mousePos = { x: e.clientX, y: e.clientY };
      }
    };

    const handleResize = () => {
      resizeCanvas();
      isPhone = window.innerWidth <= 768;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [year]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default MatrixBackground;