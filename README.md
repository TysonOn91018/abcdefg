# Orbit — Character Studio

A browser-based character editor using React, TypeScript, Vite and the user's original SVG artwork.

## Run and verify

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

Vite prints the local URL. Production files are generated in `dist/`. No backend is needed. Fonts have local fallback fonts.

## Original vector artwork

The user-supplied files are preserved in `src/character/reference/`. `referenceParts.ts` extracts the paths from `参考.svg` without redrawing them. At 100%, every path coordinate equals the source coordinate. The character retains the original curved arms, hands, legs, feet, facial features and translucent helmet.

`referenceGeometry.ts` deforms the continuous full-body contour instead of assembling separately capped limbs. Shared source coordinates map to identical output coordinates. Wrist and ankle transitions blend smoothly into hands and feet, so no masking strips, joint caps or patch strokes are required. Cubic path commands remain vector paths. The face and helmet dimensions remain linked.

The deformation applies independent arm length, thickness, hand size, leg proportions and foot size changes. For unequal leg proportions, the longer leg receives a smooth outward bow so the feet remain near the shared ground plane. These are silhouette proportion controls, not measured skeletal segment lengths. The original illustration's slight left/right asymmetry and natural foot contours are preserved.

## Controls, presets and exports

All 20 visible controls use sliders with 1% steps and safe ranges: helmet/torso width 85–115%, limb thickness/feet 85–120%, hands 85–150%, lengths 75–150%. Left/right limbs are independent. Reset restores 100%. Presets can be saved, renamed, loaded and deleted in localStorage.

JSON preserves all 22 configuration fields, including the linked head dimensions. Imports require finite numbers, clamp to the allowed range and link head dimensions to the helmet. Invalid imports leave the current character unchanged.

SVG and PNG exports contain only the current character with transparent background. PNG uses a 2400-pixel longest edge. Bounds come from the transformed source Bezier control-point hull with stroke padding, guaranteeing that the artwork remains inside the export viewBox. Preview zoom never affects exports.

## Code

- `src/character/`: source SVGs, extracted path data, types, validation and pure vector deformation.
- `src/components/`: vector renderer, preview, sliders and preset/export UI.
- `src/hooks/`: a single character state source.
- `src/utils/`: storage, serialization and exports.
- `tests/`: source-coordinate fidelity, continuous silhouette, shared joints, independent limbs, slider effects, bounds, validation and persistence.

## GitHub Pages

The source `index.html` requires a Vite build. Upload the generated `docs/` folder with its nested `assets/` folder and choose repository Settings → Pages → Deploy from a branch → main → `/docs`.

After changing code, run `npm run build`, replace the generated files in `docs/` with the contents of `dist/`, and upload the refreshed files. Relative asset URLs in `vite.config.ts` support GitHub Pages repository subpaths.
