---
type: execution-plan
created: 2024-12-08
source: Code Review Analysis
strategy: segmented
estimated_tasks: 18
estimated_time: 4-6 hours
---

# Execution Plan: page_of_things Code Cleanup & Consolidation

## Objective

Clean up ~700 lines of dead/duplicate code, consolidate two wave visualization systems into one, and establish maintainable patterns for the page_of_things codebase.

---

## Phase 1: Cleanup (Remove Dead Code)

### Tasks

1. **Audit Wavy usage & keep shared components**  
   - Confirm which parts of `src/components/Wavy` are used by `WaveControls` (e.g. ModButton, OscilloscopeDisplay, Readout).
   - Treat `Wavy.jsx` and its local WaveControls/WaveBackground as an experimental entrypoint, not wired into `App`.
   - Type: auto

2. **Delete Python files**  
   - Remove irrelevant Python artifacts from React project
   - Files: `main.py`, `pyproject.toml`, `.python-version`
   - Type: auto

3. **Remove commented code from CSS**  
   - Clean commented-out CSS blocks
   - Files: `src/App.css` (lines 109–126) and any similar commented wave blocks
   - Type: auto

4. **Clean index.jsx**  
   - Remove commented `reportWebVitals` import and usage
   - File: `src/index.jsx`
   - Type: auto

5. **Checkpoint: Verify app still runs**  
   - Run `pnpm start` (or `npm start`)  
   - Confirm there are no missing import errors or runtime crashes
   - Type: checkpoint:verify

**Verification criteria**:
- App compiles successfully.
- Main wave visualization and controls render.
- No references remain to `src/components/Wavy/*` or Python files.

---

## Phase 2: Consolidation (Merge Files)

### Tasks

6. **Create wave constants file**  
   - Extract magic numbers and domain constants from wave components
   - File: `src/constants/waveConstants.js`  
   - Type: auto

7. **Create wave computation utils**  
   - Extract shared math functions: `normalize`, `updateParameter`, `updateWave`, `computeWaveY`, etc.
   - File: `src/utils/waveComputation.js`  
   - Type: auto

8. **Merge CSS files for wave UI**  
   - Combine `WaveBackground.css` and `WaveControls.css` into a single `Wave.css`
   - Preserve all necessary styles, resolve duplicates (`.wave-canvas`, `.modButton`, grid classes, etc.)
   - Files:
     - Source: `src/styles/WaveBackground.css`, `src/styles/WaveControls.css`
     - Target: `src/styles/Wave.css`
   - Type: auto

9. **Update imports after CSS merge and utils extraction**  
   - Point all components to new CSS and JS modules
   - Files: `App.jsx`, `WaveBackground.jsx`, `WaveControls.jsx`, and any others referencing old paths
   - Type: auto

10. **Checkpoint: Verify styling intact**  
    - Visual inspection of the running app:
      - Wave canvas layout
      - Controls grid and buttons
      - Readouts / oscilloscope display
    - Type: checkpoint:verify

**Verification criteria**:
- UI looks the same as before consolidation.
- No missing styles or broken layouts.
- All components use `Wave.css` and shared utils/constant files.

---

## Phase 3: Refactoring (Improve Patterns)

### Tasks

11. **Implement reducer pattern in App.jsx**  
    - Replace multiple `setState` handlers and 11 separate setter props with a `useReducer` pattern.
    - Adapt logic from the (now deleted) `Wavy.jsx` reducer implementation.
    - Pass a single `dispatch` (or constrained API) to `WaveControls`.
    - Files: `src/App.jsx`, `src/components/WaveControls.jsx`
    - Type: auto

12. **Add mathematical formula tooltips to controls**  
    - Port the tooltip behavior from `src/components/Wavy/WaveControls.jsx` and `FormulaTooltip.jsx`.
    - Show clean mathematical expressions on hover for AM/FM parameters.
    - Files: primarily `src/components/WaveControls.jsx` (and possibly a small `FormulaTooltip` component if reintroduced).
    - Type: auto

13. **Standardize indentation to 2 spaces**  
    - Normalize JSX/JS formatting to 2-space indentation across components.
    - Files: all `.jsx` and relevant `.js` files under `src/`.
    - Type: auto

14. **Remove Vite from devDependencies**  
    - Keep `react-scripts` as the single build tool.
    - File: `package.json`
    - Type: auto

15. **Checkpoint: Full functionality test**  
    - Manually exercise controls:
      - Toggle AM/FM modes
      - Adjust all modulation depths and frequencies
      - Confirm oscilloscope and readouts react as expected
    - Type: checkpoint:verify

**Verification criteria**:
- No regression in wave behavior.
- State transitions handled cleanly by reducer.
- Tooltips show correct formulas.

---

## Phase 4: Documentation

### Tasks

16. **Write README.md**  
    - Document:
      - What the project is (wave modulation visualizer)
      - How to install and run
      - Brief explanation of AM/FM modulation in this context
    - File: `README.md`
    - Type: auto

17. **Add JSDoc comments to wave computation functions**  
    - Document params, return values, and behavior for functions in `waveComputation.js`.
    - File: `src/utils/waveComputation.js`
    - Type: auto

18. **Document constants with inline comments**  
    - Explain magic numbers (e.g., `0.8046`, `CARRIER_FREQ_DIVISOR = 10`, base depths, limits).
    - File: `src/constants/waveConstants.js`
    - Type: auto

19. **Checkpoint: Final verification & cleanup**  
    - Quick scan for:
      - Remaining commented-out legacy code
      - Unused imports or constants
      - Obvious formatting outliers
    - Type: checkpoint:verify

---

## Success Criteria

- [ ] `src/components/Wavy/` shared subcomponents (ModButton, OscilloscopeDisplay, Readout) remain available to `WaveControls`; unused Wavy entry components are clearly marked or removed once features are migrated.
- [ ] Python files (`main.py`, `pyproject.toml`, `.python-version`) removed.
- [ ] `WaveBackground.css` and `WaveControls.css` consolidated into `src/styles/Wave.css` (or another shared wave styles file), with duplication against `Wavy.css` minimized.
- [ ] `App.jsx` uses a reducer pattern, passing a single dispatch-style prop to `WaveControls`.
- [ ] Wave computation logic lives in `src/utils/waveComputation.js`.
- [ ] All magic numbers centralized in `src/constants/waveConstants.js` with comments.
- [ ] README provides clear project overview and setup steps.
- [ ] App runs without errors; all wave controls and visualizations behave correctly.

---

## Overall Verification

Before marking this plan complete, verify:

- The app builds and runs without warnings or errors.
- No dead or duplicate implementations of wave visualization remain.
- The code structure (components, utils, constants, styles) is easy to navigate and understand.
- Future contributors can modify wave behavior in one obvious place.
