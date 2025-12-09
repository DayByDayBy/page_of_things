<objective>
Refactor the existing Wavy component into a clean separation of concerns: a pure animated wave background and a distinct UI controls layer, then integrate them into App.jsx with a responsive grid layout.
</objective>

<context>
- Project: React-based personal site/portfolio in `page_of_things`.
- Current state: A `Wavy` component that mixes canvas-based wave animation, modulation controls, oscilloscope, and readouts in a single, layout-heavy component.
- Goal: Extract two new components, `WaveBackground` (visual-only, canvas) and `WaveControls` (UI-only, controls + oscilloscope + readouts), update `App.jsx` to use them, and modernize layout using a semantic grid.

Key existing pieces (to examine and reuse rather than rewrite):
- `src/components/Wavy/` (or wherever `Wavy.jsx` and `Wavy.css` currently live): contains the wave canvas rendering, modulation controls, and layout CSS.
- `src/hooks/useMousePosition.js`: provides throttled mouse position; should be reused unchanged.
- `OscilloscopeDisplay`, `Readout` and related components: stay conceptually the same but move under `WaveControls` usage.

This refactor should preserve all existing visual behavior and interactions while cleaning up structure and layout.
</context>

<requirements>
- Extract a new `WaveBackground.jsx` responsible only for:
  - Rendering a full-viewport canvas background.
  - Implementing the animation loop with `requestAnimationFrame`.
  - Drawing a sine wave with AM/FM modulation, driven by `mousePosition` and `modulationState` props.
  - Respecting a `systemActive` prop (pause animation or short-circuit if inactive).
  - Rendering:
    ```jsx
    <div className="wave-background">
      <canvas ref={canvasRef} className="wave-canvas" />
    </div>
    ```
- Create `WaveBackground.css` with at least:
  - `.wave-background` fixed to the viewport, behind content, non-interactive:
    - `position: fixed; top: 0; left: 0; width: 100%; height: 100vh; z-index: 0; pointer-events: none;`
  - `.wave-canvas` spanning the container:
    - `display: block; width: 100%; height: 100%;`

- Extract a new `WaveControls.jsx` responsible only for:
  - All modulation UI: buttons/toggles, labels, etc.
  - Wiring modulation state (e.g. `amActive`, `am1Active`, `fm1Active`, `fm2Active`, etc.) to button interactions.
  - Displaying the oscilloscope and readouts using `samplesRef` data.
  - Optionally reading `mousePosition` for live modulation hints or labels.
  - Rendering a wrapper structure like:
    ```jsx
    <div className="wave-controls-wrapper">
      {/* modulation controls component tree */}
      {systemActive && <OscilloscopeDisplay ... />}
      {systemActive && <Readout ... />}
    </div>
    ```
- Create `WaveControls.css`:
  - `.wave-controls-wrapper` as a simple vertical stack:
    - `display: flex; flex-direction: column; gap: 1rem;`
  - Bring over all relevant button, oscilloscope, and card styles from the old Wavy CSS.
  - **Remove** `position: fixed` / `absolute` / viewport-positioning hacks from top-level containers. Positioning is now delegated to the parent layout grid.

- Update `App.jsx` to:
  - Own the following state at the top level:
    - `mousePosition = useMousePosition(50);`
    - `systemActive` (boolean) to control whether the wave system is active.
    - `modulation` object: `{ amActive, am1Active, fm1Active, fm2Active, ... }` with sensible defaults.
    - `samplesRef = useRef([]);` for current waveform samples.
  - Render structure:
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
  - Ensure imports for `WaveBackground`, `WaveControls`, and `useMousePosition` are correctly wired.

- Update `App.css` (or equivalent global styles) to implement the grid layout:
  - `main` should sit above the background:
    - `position: relative; z-index: 1; padding: 1.5rem; margin: 2rem auto; max-width: 1200px; min-height: 60vh;`
  - `.content-grid` should be a two-column layout on desktop:
    - `display: grid; grid-template-columns: 200px 1fr; gap: 2rem; align-items: start;`
  - `.controls-column` should be sticky on desktop:
    - `position: sticky; top: 1.5rem;`
  - `.main-column` should contain existing `.page-content` styles (migrate as needed).
  - Add a mobile breakpoint at `max-width: 810px`:
    - `.content-grid` → `grid-template-columns: 1fr; grid-template-rows: auto 1fr;`
    - `.controls-column` → `position: static;` so controls stack above content.

- Migration / cleanup:
  - Ensure all behaviors from `Wavy` are preserved via the new `WaveBackground` and `WaveControls` composition.
  - Once everything works and tests pass, remove the old `Wavy.jsx` and `Wavy.css` (or equivalent) and update any imports.
  - Keep state management centralized and simple in `App` (or a dedicated `useWaveState` hook if that already exists), with both new components consuming shared state.

- Quality constraints:
  - No regressions in interactivity (modulation buttons, oscilloscope, readouts, audio if present).
  - No new console errors or React warnings.
  - Layout must be responsive and visually at least as clean as the current implementation.
  - Keep diffs minimal where reasonable; reuse logic instead of rewriting math/animation code.
</requirements>

<implementation>
- Identify the current `Wavy` component file(s) and isolate three logical concerns:
  1. Canvas drawing/animation logic.
  2. Modulation state wiring and control handlers.
  3. Display components: oscilloscope, readouts, and any text labels.

- For `WaveBackground.jsx`:
  - Extract or reuse the existing `canvasRef`, `useEffect` animation loop, and wave math functions.
  - Accept `mousePosition`, `modulationState`, `systemActive`, and (if needed) `samplesRef` as props.
  - On `systemActive === false`, either skip drawing or stop scheduling new animation frames.
  - Ensure the canvas resizes with the viewport appropriately (reusing any existing resize handlers).

- For `WaveControls.jsx`:
  - Extract the UI elements and logic that currently live in `Wavy` related to modulation toggles.
  - Replace any internal state for modulation with calls to `onModulationChange` using the provided `modulationState` prop.
  - Wire `samplesRef.current` into `OscilloscopeDisplay` and `Readout` so they visualize the same data as the background.
  - Ensure the component is purely presentational + callbacks; it should not own global/modulation state itself.

- For `App.jsx` and layout:
  - Move any scattered wave-related state into `App` so it is the single source of truth.
  - Pass only the necessary props down to `WaveBackground` and `WaveControls`.
  - Implement the described grid layout and migrate any relevant styles from old `Wavy.css` into `WaveControls.css` or `App.css` as appropriate.

- Keep functions and variable names close to existing ones to minimize churn, unless they are clearly confusing.
- Prefer small, focused diffs: extract logic into new files but avoid broad rewrites.
</implementation>

<output>
- `src/components/WaveBackground.jsx` - Canvas-based animated wave background component.
- `src/components/WaveControls.jsx` - UI controls, oscilloscope, and readout component.
- `src/styles/WaveBackground.css` - Styles for the fixed background canvas.
- `src/styles/WaveControls.css` - Styles for the controls/oscilloscope/readouts.
- `src/App.jsx` - Updated to use `WaveBackground` and `WaveControls` with the new grid layout.
- `src/App.css` (or equivalent global stylesheet) - Updated layout rules for `main`, `.content-grid`, `.controls-column`, `.main-column`, and responsive behavior.
- Removal (once verified): old `Wavy.jsx` and `Wavy.css` (and references) after successful migration.
</output>

<verification>
- Wave background:
  - The animated wave renders full-screen behind the content.
  - Toggling `systemActive` on/off starts/stops animation without errors.
- Controls and UI:
  - All modulation buttons/toggles still work as before and visually indicate state.
  - Oscilloscope shows a live waveform corresponding to the current modulation.
  - Readout cards display expected AM/FM parameters and updates.
- Layout:
  - On desktop widths (> 810px), controls appear in the left column, content on the right, with the controls column sticky while scrolling.
  - On mobile widths (≤ 810px), controls stack above main content, no sticky behavior.
  - Background wave remains visible behind everything, with controls and content clearly readable (z-index layering correct).
- Technical:
  - No console errors/warnings in the browser.
  - No TypeScript/ESLint complaints (if applicable) introduced by the refactor.
  - All imports resolve correctly; no dead references to `Wavy` remain after cleanup.
</verification>

<success_criteria>
- `WaveBackground` and `WaveControls` fully replace the old `Wavy` component in `App.jsx`.
- The app visually matches or improves upon the prior behavior on both desktop and mobile.
- The wave system’s state is centralized and easily understandable in `App`.
- The codebase clearly separates concerns: background rendering vs. UI controls, with straightforward layout logic.
</success_criteria>
