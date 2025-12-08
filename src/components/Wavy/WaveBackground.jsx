import React, { forwardRef } from "react";
import "./Wavy.css";

const WaveBackground = forwardRef(function WaveBackground(
  { width, height },
  canvasRef
) {
  return (
    <div className="wave-background">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="wave-canvas"
        role="img"
        aria-label="Animated wave visualization"
      />
    </div>
  );
});

export default WaveBackground;
