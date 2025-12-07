import React, { forwardRef } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

const OscilloscopeDisplay = forwardRef(function OscilloscopeDisplay(_, ref) {
  return (
    <div className="oscilloscope-container">
      <canvas
        ref={ref}
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
});

export default OscilloscopeDisplay;
