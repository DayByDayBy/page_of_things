import React, { forwardRef } from "react";

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
        y = A(1 + AM) * sin((x + phi)(f + FM))
      </div>
    </div>
  );
});

export default OscilloscopeDisplay;
