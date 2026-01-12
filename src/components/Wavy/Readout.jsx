import React, { useEffect, useState } from "react";

function formatAlgoLabel(prefix, one, two, three) {
  const parts = [];
  if (one) parts.push(`${prefix}1`);
  if (two) parts.push(`${prefix}2`);
  if (three) parts.push(`${prefix}3`);
  if (parts.length === 0) return "None";
  return parts.join(" + ");
}

const Readout = ({ samplesRef, flags }) => {
  const {
    amActive = false,
    am1Active = false,
    am2Active = false,
    am3Active = false,
    fmActive = false,
    fm1Active = false,
    fm2Active = false,
    fm3Active = false,
  } = flags || {};

  const [stats, setStats] = useState({
    amplitudePx: 0,
    peakToPeak: 0,
    cycles: 0,
    amDepthPx: 0,
    fmShift: 0,
  });

  useEffect(() => {
    const id = setInterval(() => {
      const pts = (samplesRef?.current) || [];
      if (pts.length < 2) {
        return;
      }

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
      const peakToPeak = maxY - minY;
      const amplitudePx = peakToPeak / 2;

      let zeroCrossings = 0;
      let prevNonZero = null;
      for (let i = 0; i < ys.length; i++) {
        const curr = ys[i];
        if (curr === 0) continue;
        if (prevNonZero !== null && prevNonZero * curr < 0) zeroCrossings++;
        prevNonZero = curr;
      }
      const cycles = zeroCrossings / 2;

      let totalAbsDy = 0;
      for (let i = 1; i < ys.length; i++) {
        totalAbsDy += Math.abs(ys[i] - ys[i - 1]);
      }
      const fmShiftRaw = ys.length > 1 ? totalAbsDy / (ys.length - 1) : 0;

      const amDepthPx = amActive ? amplitudePx : 0;
      const fmShift = fmActive ? fmShiftRaw : 0;

      setStats({
        amplitudePx,
        peakToPeak,
        cycles,
        amDepthPx,
        fmShift,
      });
    }, 100);

    return () => clearInterval(id);
  }, [amActive, fmActive]);

  const amAlgo = amActive
    ? formatAlgoLabel("AM", am1Active, am2Active, am3Active)
    : "Off";
  const fmAlgo = fmActive
    ? formatAlgoLabel("FM", fm1Active, fm2Active, fm3Active)
    : "Off";

  const formatPx = (value) => `${value.toFixed(1)} px`;

  return (
    <div className="modulation-readout-container" aria-live="polite">
      <div className={`modulation-card am-card ${amActive ? "visible" : ""}`}>
        <div className="modulation-card-title">AM Modulation</div>
        <div className="modulation-card-body">
          <div className="modulation-card-row">
            <span className="modulation-card-label">Depth</span>
            <span className="modulation-card-value">
              {amActive ? `±${stats.amDepthPx.toFixed(1)} px` : "-"}
            </span>
          </div>
          <div className="modulation-card-row">
            <span className="modulation-card-label">Peak-to-Peak</span>
            <span className="modulation-card-value">
              {formatPx(stats.peakToPeak)}
            </span>
          </div>
          <div className="modulation-card-row">
            <span className="modulation-card-label">Algo</span>
            <span className="modulation-card-value">{amAlgo}</span>
          </div>
        </div>
      </div>

      <div className={`modulation-card fm-card ${fmActive ? "visible" : ""}`}>
        <div className="modulation-card-title">FM Modulation</div>
        <div className="modulation-card-body">
          <div className="modulation-card-row">
            <span className="modulation-card-label">Cycles</span>
            <span className="modulation-card-value">
              {stats.cycles.toFixed(2)}
            </span>
          </div>
          <div className="modulation-card-row">
            <span className="modulation-card-label">FM Shift</span>
            <span className="modulation-card-value">
              {fmActive ? stats.fmShift.toFixed(2) : "-"}
            </span>
          </div>
          <div className="modulation-card-row">
            <span className="modulation-card-label">Algo</span>
            <span className="modulation-card-value">{fmAlgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Readout;