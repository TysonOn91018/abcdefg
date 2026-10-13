// The source SVG's continuous paths are the single geometry source for preview,
// bounds and exports. No separately capped limb shapes are assembled here.
export {referenceGeometry as geometry,referenceWarp,warpPath} from './referenceGeometry';
export type Geometry=ReturnType<typeof import('./referenceGeometry').referenceGeometry>;
