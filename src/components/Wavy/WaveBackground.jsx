import React, { forwardRef } from "react";
import "./Wavy.css";

const DEFAULT_CANVAS_WIDTH = 800;
const DEFAULT_CANVAS_HEIGHT = 400;

const WaveBackground = forwardRef(function WaveBackground(
  { width, height },
  canvasRef
) {
  const safeWidth = Number.isFinite(Number(width)) && Number(width) > 0 ? Number(width) : DEFAULT_CANVAS_WIDTH;
  const safeHeight =
    Number.isFinite(Number(height)) && Number(height) > 0 ? Number(height) : DEFAULT_CANVAS_HEIGHT;

  return (
    <div className="wave-background">
      <canvas
        ref={canvasRef}
        width={safeWidth}
        height={safeHeight}
        className="wave-canvas"
        role="img"
        aria-label="Animated wave visualization"
      />
    </div>
  );
});

export default WaveBackground;
