import {
    NUM_POINTS,
    WAVE_COLOR,
    CARRIER_FREQ_DIVISOR,
    TREMOLO_FREQ,
    AM1_DEPTH,
    AM2_DEPTH,
    AM2_MOUSE_FREQ_SCALE,
    AM2_MOUSE_FREQ_BASE,
    AM3_MOUSE_FREQ_SCALE,
    AM3_MOUSE_FREQ_BASE,
    AM3_INTENSITY_BASE,
    AM3_INTENSITY_VARIATION,
    FM1_BASE_FREQ,
    FM1_INDEX,
    FM2_INDEX,
    FM3_BASE_FREQ,
    FM3_INDEX,
    FM2_MOUSE_FREQ_SCALE,
    FM2_MOUSE_FREQ_BASE,
    FM3_SECOND_HARMONIC_WEIGHT,
    READOUT_SAMPLES,
} from "../constants/waveConstants";

// normalizes a value from [fromMin, fromMax] to [-1, 1]
export function normalize(x, fromMin, fromMax) {
    if (fromMax === fromMin) return 0;
    const clampedX = Math.min(Math.max(x, fromMin), fromMax);
    return ((clampedX - fromMin) / (fromMax - fromMin)) * 2 - 1;
}

// generic parameter updater used for amplitude/frequency oscillation
export function updateParameter(value, maxReached, minReached, change, max, min) {
    if (!maxReached.current) {
        const newValue = Math.min(value + change * Math.random(), max);
        if (newValue === max) {
            maxReached.current = true;
            minReached.current = false;
            return max;
        }
        return newValue;
    } else if (!minReached.current) {
        const newValue = Math.max(value - change, min);
        if (newValue === min) {
            minReached.current = true;
            maxReached.current = false;
            return min;
        }
        return newValue;
    }
    return value;
}

// updates wave amplitude/frequency using oscillation helper
export function updateWave(waveConfig, constants) {
    if (!waveConfig || !waveConfig.current) return;
    if (waveConfig.current.amplitude === undefined || waveConfig.current.frequency === undefined) return;
    if (!waveConfig.current.ampMaxReached || !waveConfig.current.ampMinReached) return;
    if (!waveConfig.current.freqMaxReached || !waveConfig.current.freqMinReached) return;
    waveConfig.current.amplitude = updateParameter(
        waveConfig.current.amplitude,
        waveConfig.current.ampMaxReached,
        waveConfig.current.ampMinReached,
        constants.amplitudeChange,
        constants.ampMax,
        constants.ampMin
    );

    waveConfig.current.frequency = updateParameter(
        waveConfig.current.frequency,
        waveConfig.current.freqMaxReached,
        waveConfig.current.freqMinReached,
        constants.frequencyChange,
        constants.freqMax,
        constants.freqMin
    );
}

// advances carrier phase for slow drift
export function updatePhase(waveConfig) {
    if (!waveConfig || !waveConfig.current) return;
    if (waveConfig.current.phase === undefined) return;
    const random = Math.random();
    waveConfig.current.phase += random < 0.01 ? -0.000012 : 0.0000125;
    const twoPi = 2 * Math.PI;
    waveConfig.current.phase = ((waveConfig.current.phase % twoPi) + twoPi) % twoPi;
}

// compute mouse-derived scalars once per frame
export function computeMouseScalars(canvas, mousePos) {
    const safeMousePos = mousePos || { x: 0, y: 0 };
    const maxMagnitude = Math.max(canvas.width, canvas.height, 1);

    const normMouseX = normalize(safeMousePos.x, 0, canvas.width);
    const mouseDiff = normalize(
        safeMousePos.x - safeMousePos.y,
        -canvas.height,
        canvas.width
    );
    const mouseSum = normalize(
        safeMousePos.x + safeMousePos.y,
        0,
        canvas.width + canvas.height
    );
    const rawQuotient =
        safeMousePos.y !== 0
            ? safeMousePos.x / safeMousePos.y
            : safeMousePos.x >= 0
                ? maxMagnitude
                : -maxMagnitude;
    const bounded = Math.min(Math.abs(rawQuotient), maxMagnitude);
    const boundedSigned = Math.sign(rawQuotient) * bounded;
    const mouseQuotient = normalize(boundedSigned, -maxMagnitude, maxMagnitude);

    return { normMouseX, mouseDiff, mouseSum, mouseQuotient };
}

// computes a single y-value for the current wave configuration at a given x
export function computeWaveY(x, canvas, waveConfig, mouseScalars, modState) {
    if (!waveConfig || !waveConfig.current) {
        return canvas.height / 2;
    }
    const { amplitude, frequency, phase } = waveConfig.current;
    const {
        systemActive,
        amActive,
        fmActive,
        am1Active,
        am2Active,
        am3Active,
        fm1Active,
        fm2Active,
        fm3Active,
    } = modState;

    const { normMouseX, mouseDiff, mouseSum, mouseQuotient } = mouseScalars;
    const carrierFreq = frequency / CARRIER_FREQ_DIVISOR;

    let totalAM = 0;
    let totalFM = 0;

    if (systemActive && amActive) {
        if (am1Active) {
            const tremoloFreq = TREMOLO_FREQ;
            totalAM += AM1_DEPTH * Math.sin(2 * Math.PI * tremoloFreq * x);
        }

        if (am2Active) {
            const ringFreq = mouseSum * AM2_MOUSE_FREQ_SCALE + AM2_MOUSE_FREQ_BASE;
            totalAM +=
                AM2_DEPTH *
                Math.sin(2 * Math.PI * ringFreq * x) *
                Math.sin(2 * Math.PI * carrierFreq * x);
        }

        if (am3Active) {
            const mouseAMFreq = mouseDiff * AM3_MOUSE_FREQ_SCALE + AM3_MOUSE_FREQ_BASE;
            const intensity =
                AM3_INTENSITY_BASE + AM3_INTENSITY_VARIATION * Math.abs(normMouseX);
            totalAM += intensity * Math.sin(2 * Math.PI * mouseAMFreq * x);
        }
    }

    // fm blending three:
    if (systemActive && fmActive) {
        if (fm1Active) {
            const modFreq = FM1_BASE_FREQ;
            const modIndex = FM1_INDEX;
            const mouseInput = mouseDiff ? mouseDiff : 1;
            // sin
            const sineMod = Math.sin(2 * Math.PI * modFreq * x);
            // tri
            const triangleMod = 2 / Math.PI * Math.asin(Math.sin(2 * Math.PI * modFreq * x));
            // squ
            const squareMod = Math.sign(Math.sin(2 * Math.PI * modFreq * x));
            // blending
            const blendedMod = (sineMod + (triangleMod*mouseInput) + (squareMod/mouseInput)) / 3;
            totalFM += modIndex * blendedMod;
        }

        if (fm2Active) {
            const modFreq = normMouseX * FM2_MOUSE_FREQ_SCALE + FM2_MOUSE_FREQ_BASE;
            const modIndex = FM2_INDEX;
            totalFM += -modIndex * Math.sin(2 * Math.PI * modFreq * x);
        }

        if (fm3Active) {
            const safeQuotient = Math.abs(mouseQuotient) < 1e-3
                ? (Math.sign(mouseQuotient) || 1) * 1e-3
                : mouseQuotient;

            const modFreq = FM3_BASE_FREQ / safeQuotient;
            const modIndex = FM3_INDEX;
            const complexMod =
                Math.sin(2 * Math.PI * modFreq * x) +
                FM3_SECOND_HARMONIC_WEIGHT *
                Math.sin(2 * Math.PI * modFreq * 2 * x);
            totalFM += modIndex * complexMod;
        }
    }

    return (
        (canvas.height / 1.67) +
        amplitude * (1 + totalAM) *
        Math.sin((x + phase) * (carrierFreq + totalFM))
    );
}

// main rendering loop: draws the carrier (with any active AM/FM modulation)
export function drawWave(
    ctx,
    canvas,
    waveConfig,
    mousePos,
    modState,
    strokeStyle = WAVE_COLOR
) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(-4, canvas.height / 2);

    const mouseScalars = computeMouseScalars(canvas, mousePos);
    const numPoints = NUM_POINTS;
    const stepSize = canvas.width / numPoints;

    for (let x = 0; x < canvas.width; x += stepSize) {
        const y = computeWaveY(x, canvas, waveConfig, mouseScalars, modState);
        ctx.lineTo(x, y);
    }

    const dpr = window.devicePixelRatio || 1;
    ctx.lineWidth = 1 * dpr;
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
}

// samples a reduced set of main-canvas points for metrics/readout
export function sampleReadoutWave(
    canvas,
    waveConfig,
    mousePos,
    modState,
    samplesRef
) {
    if (!samplesRef) return;
    if (!canvas) {
        samplesRef.current = [];
        return;
    }

    const width = canvas.width;
    const height = canvas.height;
    const count = READOUT_SAMPLES;

    if (count <= 1) {
        samplesRef.current = [];
        return;
    }

    if (!samplesRef.current || samplesRef.current.length !== count) {
        samplesRef.current = new Array(count);
    }

    if (!waveConfig || !waveConfig.current) {
        samplesRef.current = [];
        return;
    }

    const mouseScalars = computeMouseScalars(canvas, mousePos);
    const stepX = width / (count - 1);
    const mid = height / 2;

    for (let i = 0; i < count; i++) {
        const x = i * stepX;
        const y = computeWaveY(x, canvas, waveConfig, mouseScalars, modState);
        samplesRef.current[i] = { x, y: y - mid };
    }
}
