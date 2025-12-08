---
type: execution-plan
created: 2025-12-08T01:30:00Z
source: prompts/001-wavy-refactor.md
strategy: segmented
estimated_tasks: 7
estimated_time: 4
---

<objective>
Refactor the existing `Wavy` component into a clean separation of concerns: a pure animated wave background and a distinct UI controls layer, integrated into `App.jsx` with a responsive grid layout, while preserving behavior and interactions.
</objective>

<execution_context>
Files to load before executing (keep minimal):
- `prompts/001-wavy-refactor.md`
</execution_context>

<context>
Domain and codebase context needed:
- React-based personal/portfolio app in `page_of_things`.
- Current wave system implemented in `src/components/Wavy/Wavy.jsx` (canvas + controls + layout).
- Global layout and page structure in `src/App.jsx` and associated styles (e.g. `src/App.css` or similar).
- Mouse tracking provided by `src/hooks/useMousePosition.js`.

Goal context:
- New `WaveBackground` handles only canvas rendering + animation as a full-viewport background.
- New `WaveControls` handles only modulation UI, oscilloscope, and readout display.
- `App.jsx` owns shared state (`mousePosition`, `systemActive`, `modulation`, `samplesRef`) and composes both components.
- Layout uses a semantic grid: sticky controls column on desktop, stacked on mobile.
</context>

<tasks>

<task id="01" type="auto">
  <title>Inspect current Wavy implementation and layout</title>
  <description>
  Understand the existing `Wavy` component, including how the canvas animation, modulation controls, oscilloscope, readouts, and layout/styling are wired together. Identify what logic belongs in `WaveBackground` vs `WaveControls` vs `App` state.
  </description>
  <requirements>
  - Open and review `src/components/Wavy/Wavy.jsx` and any associated CSS (e.g. `Wavy.css`).
  - Identify the canvas setup, animation loop, and wave math used to render the waveform.
  - Identify modulation-related state and handlers (AM/FM toggles, etc.).
  - Locate oscilloscope and readout components and how they receive data (e.g. via `samplesRef`).
  - Note all `position: fixed` / `absolute` and layout hacks that will be removed in favor of grid layout.
  </requirements>
  <files>
  - `src/components/Wavy/Wavy.jsx` - Existing combined implementation.
  - `src/components/Wavy/Wavy.css` (or equivalent) - Existing layout/styles.
  </files>
  <verification>
  - You can clearly list which parts of `Wavy` map to `WaveBackground`, which map to `WaveControls`, and which should move to `App` state.
  - You understand where `mousePosition`, modulation flags, and `samplesRef` are currently managed.
  </verification>
</task>

<task id="02" type="auto">
  <title>Implement WaveBackground component and styles</title>
  <description>
  Create a new `WaveBackground.jsx` component and `WaveBackground.css` stylesheet that encapsulate only the canvas-based animated wave background. This component should render behind all content and respect the existing modulation behavior while remaining non-interactive.
  </description>
  <requirements>
  - Create `src/components/WaveBackground.jsx`.
  - Extract/reuse the canvas ref, animation loop (`requestAnimationFrame`), and wave drawing logic from `Wavy` into this component.
  - Accept props: `mousePosition`, `modulationState`, `systemActive`, and (if needed) `samplesRef`.
  - When `systemActive` is false, pause or short-circuit the animation loop to avoid unnecessary work.
  - Render:
    ```jsx
    <div className="wave-background">
      <canvas ref={canvasRef} className="wave-canvas" />
    </div>
    ```
  - Create `src/styles/WaveBackground.css` with:
    - `.wave-background { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; z-index: 0; pointer-events: none; }`
    - `.wave-canvas { display: block; width: 100%; height: 100%; }`
  - Ensure the canvas resizes correctly with the viewport (reusing any existing resize logic).
  </requirements>
  <files>
  - `src/components/WaveBackground.jsx` - New background component.
  - `src/styles/WaveBackground.css` - New background styles.
  </files>
  <verification>
  - The app compiles with `WaveBackground` imported and rendered (even if temporarily wired from `Wavy`/`App` for testing).
  - The background animates when `systemActive` is true and remains idle when false.
  - No UI controls or layout markup exist inside `WaveBackground`.
  </verification>
</task>

<task id="03" type="checkpoint:human-verify">
  <title>Checkpoint: Verify WaveBackground behavior</title>
  <description>
  Pause to confirm that `WaveBackground` behaves correctly as a pure animated background before proceeding to extract controls.
  </description>
  <verification_question>
  Does `WaveBackground` render a full-viewport animated wave background, correctly modulated by state/mouse, without any UI controls or layout responsibilities?
  </verification_question>
  <verification_criteria>
  - The wave is visible and animates smoothly behind content when active.
  - Toggling the wave system off stops or pauses animation without errors.
  - No buttons, oscilloscope, or readouts appear inside `WaveBackground`.
  - No new console errors/warnings are introduced.
  </verification_criteria>
</task>

<task id="04" type="auto">
  <title>Implement WaveControls component and styles</title>
  <description>
  Create a new `WaveControls.jsx` component and `WaveControls.css` stylesheet to encapsulate all modulation UI, oscilloscope, and readout cards, using state passed down from `App`.
  </description>
  <requirements>
  - Create `src/components/WaveControls.jsx`.
  - Extract modulation UI (buttons/toggles, labels, etc.) from `Wavy` into this component.
  - Accept props: `systemActive`, `modulationState`, `onModulationChange`, `samplesRef`, and `mousePosition`.
  - Use `onModulationChange` to update modulation flags instead of keeping them as internal component state.
  - Render structure similar to:
    ```jsx
    <div className="wave-controls-wrapper">
      <ModulationControls ... />
      {systemActive && <OscilloscopeDisplay ... />}
      {systemActive && <Readout ... />}
    </div>
    ```
  - Wire `samplesRef.current` into `OscilloscopeDisplay` and `Readout` so they display the live waveform data.
  - Create `src/styles/WaveControls.css`:
    - `.wave-controls-wrapper { display: flex; flex-direction: column; gap: 1rem; }`
    - Migrate relevant button, oscilloscope, and card styles from `Wavy.css`.
    - Remove `position: fixed` / `absolute` / viewport-level layout rules from top-level containers.
  </requirements>
  <files>
  - `src/components/WaveControls.jsx` - New controls/oscilloscope/readout component.
  - `src/styles/WaveControls.css` - New styles for controls and visualizations.
  </files>
  <verification>
  - Controls render correctly when `WaveControls` is mounted.
  - Modulation buttons toggle the appropriate entries in `modulationState` via `onModulationChange`.
  - Oscilloscope and readouts show reasonable waveform data when `systemActive` is true.
  - No `position: fixed` / `absolute` layout hacks remain in the top-level controls wrapper.
  </verification>
</task>

<task id="05" type="checkpoint:human-verify">
  <title>Checkpoint: Verify WaveControls behavior</title>
  <description>
  Confirm that `WaveControls` provides the expected modulation interactions, oscilloscope display, and readouts before integrating the new layout.
  </description>
  <verification_question>
  Do all modulation controls, oscilloscope visuals, and readouts work as expected when driven from top-level state?
  </verification_question>
  <verification_criteria>
  - All modulation buttons visually reflect their active/inactive state.
  - Changing modulation affects the waveform seen in the oscilloscope/readouts.
  - `systemActive` toggling hides/shows oscilloscope and readouts as designed.
  - No console errors/warnings occur during interaction.
  </verification_criteria>
</task>

<task id="06" type="auto">
  <title>Update App.jsx and layout to compose WaveBackground and WaveControls</title>
  <description>
  Centralize wave-related state in `App.jsx`, compose the new `WaveBackground` and `WaveControls` components, and implement the grid-based layout (including responsive behavior) in the main app styles.
  </description>
  <requirements>
  - In `src/App.jsx`:
    - Initialize `mousePosition = useMousePosition(50);`.
    - Add `systemActive` state and any existing toggle mechanism.
    - Add `modulation` state object (e.g. `{ amActive, am1Active, fm1Active, fm2Active, ... }`).
    - Add `samplesRef = useRef([]);` for waveform samples.
    - Render the new structure:
      ```jsx
      <>
        <WaveBackground 
          mousePosition={mousePosition}
          modulationState={modulation}
          systemActive={systemActive}
          samplesRef={samplesRef}
        />
        
        <main>
          <div className="content-grid">
            <aside className="controls-column">
              <WaveControls 
                systemActive={systemActive}
                modulationState={modulation}
                onModulationChange={setModulation}
                samplesRef={samplesRef}
                mousePosition={mousePosition}
              />
            </aside>
            
            <section className="main-column">
              <div className="page-content">
                {/* Existing profile content: name, links, etc. */}
              </div>
            </section>
          </div>
        </main>
      </>
      ```
    - Ensure imports for `WaveBackground`, `WaveControls`, and `useMousePosition` are correct.
  - In `App.css` or equivalent global stylesheet:
    - Ensure `main` sits above the background and defines page bounds:
      - `position: relative; z-index: 1; padding: 1.5rem; margin: 2rem auto; max-width: 1200px; min-height: 60vh;`
    - Define desktop grid:
      - `.content-grid { display: grid; grid-template-columns: 200px 1fr; gap: 2rem; align-items: start; }`
      - `.controls-column { position: sticky; top: 1.5rem; }`
      - `.main-column { /* move existing .page-content container styles here as needed */ }`
    - Add mobile breakpoint at `max-width: 810px`:
      - `.content-grid { grid-template-columns: 1fr; grid-template-rows: auto 1fr; }`
      - `.controls-column { position: static; }`
  </requirements>
  <files>
  - `src/App.jsx` - Updated to own wave state and compose new components.
  - `src/App.css` or equivalent - Updated layout rules for grid and responsiveness.
  </files>
  <verification>
  - The app compiles and renders with the new `WaveBackground` + `WaveControls` composition.
  - Controls appear in a left column on desktop and above content on mobile.
  - The background wave remains visible behind all content.
  - Interactions still work as before (modulation, oscilloscope, readouts, audio if present).
  </verification>
</task>

<task id="07" type="auto">
  <title>Clean up legacy Wavy component and styles</title>
  <description>
  Remove the deprecated `Wavy` component and its styles now that `WaveBackground` and `WaveControls` fully replace its functionality.
  </description>
  <requirements>
  - Remove `Wavy.jsx` and `Wavy.css` (or equivalent) from the codebase once they are no longer referenced.
  - Search the project for any remaining imports/usages of `Wavy` and replace them with the new composition if needed.
  - Ensure build tooling and routes do not reference the old component.
  </requirements>
  <files>
  - `src/components/Wavy/Wavy.jsx` - Removed or deprecated.
  - `src/components/Wavy/Wavy.css` (or equivalent) - Removed.
  </files>
  <verification>
  - Project builds cleanly with no references to `Wavy`.
  - The UI and behaviors remain correct after removal.
  - No dead or unused CSS remains from the old implementation.
  </verification>
</task>

</tasks>

<verification>
Before marking this plan complete, verify:
- The wave animates correctly as a full-viewport background and respects `systemActive`.
- Controls, oscilloscope, and readout cards all function and update as expected.
- Desktop layout uses a sticky controls column; mobile stacks controls above content.
- No console errors or React warnings are present.
- No references to the old `Wavy` component or its styles remain.
</verification>

<success_criteria>
This plan is successful when:
- `WaveBackground` and `WaveControls` fully replace the old `Wavy` component in `App.jsx`.
- The app visually matches or improves upon the previous experience on both desktop and mobile.
- Wave system state is centralized and easily understandable in `App`.
- Background rendering and UI controls are cleanly separated, with simple, maintainable layout rules.
</success_criteria>

<deviation_rules>
- Minor deviations (e.g., small style tweaks or slightly different prop shapes) are acceptable if they preserve the overall objective and verification criteria. Document any notable changes in comments or commit messages.
- For major deviations (e.g., altering the overall layout strategy, changing how state is structured, or significantly modifying wave math), pause and consult the user before proceeding.
- If you encounter missing files, unexpected project structure, or incompatible existing code, add a checkpoint-style task to clarify the situation before implementing a workaround.
</deviation_rules>
