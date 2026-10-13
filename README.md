# Orbit — Character Studio

A local, browser-based 2D character editor built with React, TypeScript, Vite, and hand-drawn SVG shapes. The supplied `Group 104.png` is the visual reference; the editable character is entirely vector geometry.

## Run

```sh
npm install
npm run dev
```

Open the localhost address printed by Vite. `npm run build` performs strict TypeScript checking and creates `dist/`. `npm run preview` serves the production build. `npm test` runs the geometry, validation, and serialization tests.

## Use

Expand the six proportion groups to choose among 20 size options. Head dimensions follow the helmet; left and right limbs remain independent. Changes appear immediately. Use the built-in starting points or randomize, then enter a name and press + to save a custom preset. Custom presets persist in this browser's localStorage and can be loaded, renamed, or deleted. Reset returns every value to exactly 100%.

SVG and PNG exports have transparent backgrounds and include only the character. PNG exports have a 2400-pixel longest edge. JSON export saves every parameter; JSON import requires all 22 finite numeric parameters and clamps numbers to the new safe ranges. Legacy head dimensions are normalized to match the helmet. Imported invalid objects leave the current character unchanged. Zoom and Fit affect only the preview, never exports. The mobile layout puts the preview before the controls.

## Geometry decisions

`geometryEngine.ts` is a pure function of the strongly typed configuration. Coordinates are derived, never stored as separate state. Shoulder positions follow torso width, neck position follows torso length, and hands translate to wrist anchors with independent local scale. SVG strokes on scaled face, hands, and feet use non-scaling-stroke.

Legs use two equal segments with an explicit knee pose. Their combined length always equals the requested leg length. A shared ground line is y=0; ankle height accounts for each foot's size. The hip height is limited by whichever leg has the tighter vertical reach. Longer legs bend outward to reach the same baseline, preserving asymmetric slider values. This is a pose adjustment, not an override of requested lengths. When the torso width changes, hips and the connected legs move with it.

Conservative bounds include the helmet, head profile, all joints, hands, feet, and stroke padding, so Fit and transparent exports include enlarged and asymmetric characters. Head and helmet dimensions are linked. Their shared width and height have Small / Standard / Large options (85–115%). Limb thickness and feet use 85–120%; hands use 85–150%; lengths use 75–150%. These limits apply to imported JSON, saved presets, and randomization too. Wrist and ankle openings match the connected limb width, while the visor edge follows the helmet rim.

## Source layout

- `src/character/`: types, parameter definitions, defaults, SVG paths, and anchor calculations.
- `src/components/`: SVG rendering, preview, grouped sliders, and preset/export actions.
- `src/hooks/`: the single character state source.
- `src/utils/`: validated storage, serialization, SVG and PNG exports.
- `tests/`: extreme leg/foot combinations, independent arms, torso attachment, bounds, validation, preset round-trips, head/helmet alignment, and safe randomization.

No backend is required. Fonts load from Google Fonts with local sans-serif fallbacks; all editing and exports run locally.

## GitHub Pages (browser upload)

The source index.html cannot run directly on GitHub Pages: its TypeScript entry needs to be built by Vite. A compiled copy is prepared in `docs/`, with relative asset URLs suitable for a repository subpath such as `/abcdefg/`.

1. Upload the entire `docs` folder to the repository root, keeping its nested `assets` folder.
2. Open repository Settings → Pages.
3. Select Deploy from a branch, select the branch containing your uploaded files, and choose `/docs`.
4. Save and wait for the Pages deployment to complete.

For future changes, run `npm run build`, then replace the contents of `docs/` with the newly generated contents of `dist/` before uploading. `vite.config.ts` sets relative asset paths; upload this configuration too if you plan to build from the repository later.

## Fixed joint connections

Shoulder, elbow and wrist openings stay 10 SVG units wide; hip, knee and ankle openings stay 18 units wide. Body thickness changes the middle of each limb segment, tapering back to the fixed joint openings. Hands and feet use the same fixed attachment widths. Outer silhouettes are drawn together before inner fills, removing internal elbow/knee outlines. Anchor positions still follow connected limb lengths and torso proportions, while joint sizes remain fixed.
