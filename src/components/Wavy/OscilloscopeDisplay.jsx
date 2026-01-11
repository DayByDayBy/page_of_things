import React, { useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
import katex from "katex";

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
            let minY = Infinity;
            let maxY = -Infinity;
            for (let i = 0; i < ys.length; i++) {
                if (ys[i] < minY) minY = ys[i];
                if (ys[i] > maxY) maxY = ys[i];
            }
            if (!isFinite(minY) || !isFinite(maxY)) {
                minY = 0;
                maxY = 0;
            }
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

        // Polling redraw every 100ms to capture samplesRef.current updates
        // samplesRef is excluded from dependency array since ref changes don't trigger re-renders
        draw();
        const id = setInterval(draw, 100);

        return () => clearInterval(id);
    }, []);

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

            <div
                className="oscilloscope-formula"
                dangerouslySetInnerHTML={{
                    __html: katex.renderToString(
                        "y = A(1 + AM) \\cdot \\allowbreak \\sin((x + \\phi)(f + FM))",
                        {
                            displayMode: true,
                            throwOnError: false,
                        }
                    ),
                }}
            />
    </div>
)
}
export default OscilloscopeDisplay;
