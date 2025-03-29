import React, { useEffect, useRef } from "react";

const CanvasAnimation = () => {
  const canvasRef = useRef(null);
  const drops = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = 500;
      canvas.height = window.innerHeight;

      // Reset drops for the new canvas size
      drops.current = [];
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speed = Math.random() * 1 + 1;
        const length = Math.random() * 5 + 5;
        drops.current.push(new Drop(x, y, speed, length));
      }
    };

    class Drop {
      x: number;
      y: number;
      speed: number;
      length: number;

      constructor(x: number, y: number, speed: number, length: number) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.length = length;
        this.draw();
      }

      draw() {
        context.beginPath();
        context.strokeStyle = "#0077cc";
        context.moveTo(this.x, this.y);
        context.lineTo(this.x, this.y + this.length);
        context.stroke();
        context.closePath();
      }
    }

    function render() {
      context.clearRect(0, 0, canvas.width, canvas.height);

      drops.current.forEach((drop) => {
        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = 0;
          drop.x = Math.random() * canvas.width;
          drop.speed = Math.random() * 1 + 0.5;
          drop.length = Math.random() * 8 + 2;
        }

        drop.draw();
      });

      requestAnimationFrame(render);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    />
  );
};

export default CanvasAnimation;
