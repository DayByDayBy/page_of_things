// modulationReducer: manages 9 boolean toggles.
// actions are named to mirror old setter names.
// invariant: turning off a main toggle disables all its sub-toggles
export function modulationReducer(state, action) {
  switch (action.type) {
    case "setSystemActive": {
      if (!action.payload) {
        return {
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
      }
      return { ...state, systemActive: true };
    }
    case "setAmActive": {
      if (!action.payload) {
        return {
          ...state,
          amActive: false,
          am1Active: false,
          am2Active: false,
          am3Active: false,
        };
      }
      if (!state.systemActive) {
        throw new Error("Cannot enable amActive when systemActive is false");
      }
      return { ...state, amActive: true };
    }
    case "setFmActive": {
      if (!action.payload) {
        return {
          ...state,
          fmActive: false,
          fm1Active: false,
          fm2Active: false,
          fm3Active: false,
        };
      }
      return { ...state, systemActive: true, fmActive: true };
    }
    const subToggleConfig = {
      "setAm1Active": { subKey: "am1Active", parentKeys: ["amActive", "systemActive"] },
      "setAm2Active": { subKey: "am2Active", parentKeys: ["amActive", "systemActive"] },
      "setAm3Active": { subKey: "am3Active", parentKeys: ["amActive", "systemActive"] },
      "setFm1Active": { subKey: "fm1Active", parentKeys: ["fmActive", "systemActive"] },
      "setFm2Active": { subKey: "fm2Active", parentKeys: ["fmActive", "systemActive"] },
      "setFm3Active": { subKey: "fm3Active", parentKeys: ["fmActive", "systemActive"] },
    };

    if (subToggleConfig[action.type]) {
      const { subKey, parentKeys } = subToggleConfig[action.type];
      const newState = { ...state, [subKey]: action.payload };
      
      if (action.payload === true) {
        parentKeys.forEach(parentKey => {
          newState[parentKey] = true;
        });
      }
      
      return newState;
    }

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}
