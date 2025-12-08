import React, { useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

const OscilloscopeDisplay = ({ samplesRef }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const pts = (samplesRef && samplesRef.current) || [];
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      if (!pts || pts.length < 2) {
        return;
      }

      const padding = 4;
      const usableHeight = Math.max(1, height - 3 * padding);

      const ys = pts.map((p) => p.y);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const mid = (minY + maxY) / 2;
      const range = maxY - minY || 1;
      const halfRange = range / 2 || 1;

      const count = pts.length;
      const stepX = count > 1 ? width / (count - 1) : 0;

      ctx.beginPath();

      for (let i = 0; i < count; i++) {
        const x = i * stepX;
        const yRaw = pts[i].y;
        const norm = (yRaw - mid) / halfRange; // -1..1
        const y = height / 2 - norm * (usableHeight / 2);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(160, 196, 224, 0.8)";
      ctx.stroke();
    };

    draw();
    const id = setInterval(draw, 100);

    return () => clearInterval(id);
  }, [samplesRef]);

  return (
    <div className="oscilloscope-container">
      <canvas
        ref={canvasRef}
        className="oscilloscope-canvas"
        width={150}
        height={100}
        role="img"
        aria-label="Oscilloscope view of the wave"
      />
      <div className="oscilloscope-formula">
        <BlockMath math={"y = A(1 + AM) \\cdot \\sin((x + \\phi)(f + FM))"} />
      </div>
    </div>
  );
};

export default OscilloscopeDisplay;
