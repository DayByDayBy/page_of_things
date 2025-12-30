// modulationReducer: manages 9 boolean toggles.
// actions are named to mirror old setter names.
// behavior: toggles preserve sub-toggle states (hardware-like memory)

const subToggleConfig = {
  setAm1Active: "am1Active",
  setAm2Active: "am2Active",
  setAm3Active: "am3Active",
  setFm1Active: "fm1Active",
  setFm2Active: "fm2Active",
  setFm3Active: "fm3Active",
};

export function modulationReducer(state, action) {
  switch (action.type) {
    case "setSystemActive": {
      return { ...state, systemActive: action.payload };
    }
    case "setAmActive": {
      return { ...state, amActive: action.payload };
    }
    case "setFmActive": {
      return { ...state, fmActive: action.payload };
    }
    default: {
      const subKey = subToggleConfig[action.type];
      if (subKey) {
        return { ...state, [subKey]: action.payload };
      }
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
