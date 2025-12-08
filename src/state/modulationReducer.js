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
      return { ...state, fmActive: true };
    }
    case "setAm1Active":
      return { ...state, am1Active: action.payload };
    case "setAm2Active":
      return { ...state, am2Active: action.payload };
    case "setAm3Active":
      return { ...state, am3Active: action.payload };
    case "setFm1Active":
      return { ...state, fm1Active: action.payload };
    case "setFm2Active":
      return { ...state, fm2Active: action.payload };
    case "setFm3Active":
      return { ...state, fm3Active: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}
