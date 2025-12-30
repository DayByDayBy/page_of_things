// modulationReducer: manages 9 boolean toggles.
// actions are named to mirror old setter names.
// behavior: toggles preserve sub-toggle states (hardware-like memory)

export const initialModulationState = {
  systemActive: false,
  amActive: false,
  fmActive: false,
  am1Active: false,
  am2Active: false,
  am3Active: false,
  fm1Active: false,
  fm2Active: false,
  fm3Active: false,
};

const subToggleConfig = {
  setAm1Active: "am1Active",
  setAm2Active: "am2Active",
  setAm3Active: "am3Active",
  setFm1Active: "fm1Active",
  setFm2Active: "fm2Active",
  setFm3Active: "fm3Active",
};

export function modulationReducer(state = initialModulationState, action) {
  if (!action || typeof action.type !== "string") {
    return state;
  }

  switch (action.type) {
    case "setSystemActive": {
      if (typeof action.payload !== "boolean") {
        return state;
      }
      return { ...state, systemActive: action.payload };
    }
    case "setAmActive": {
      if (typeof action.payload !== "boolean") {
        return state;
      }
      return { ...state, amActive: action.payload };
    }
    case "setFmActive": {
      if (typeof action.payload !== "boolean") {
        return state;
      }
      return { ...state, fmActive: action.payload };
    }
    default: {
      const subKey = subToggleConfig[action.type];
      if (subKey) {
        if (typeof action.payload !== "boolean") {
          return state;
        }
        return { ...state, [subKey]: action.payload };
      }
      return state;
    }
  }
}
