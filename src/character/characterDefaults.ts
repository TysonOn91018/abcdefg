import type {CharacterConfig, Parameter} from './characterTypes';
export const groups: {name:string;icon:string;controls:[Parameter,string][]}[] = [
 {name:'Head & helmet',icon:'◉',controls:[['helmetWidth','Helmet width'],['helmetHeight','Helmet height']]},
 {name:'Torso',icon:'▱',controls:[['torsoWidth','Torso width'],['torsoLength','Torso length']]},
 {name:'Left arm',icon:'↙',controls:[['leftUpperArm','Upper arm length'],['leftForearm','Forearm length'],['leftArmThickness','Arm thickness'],['leftHand','Hand size']]},
 {name:'Right arm',icon:'↘',controls:[['rightUpperArm','Upper arm length'],['rightForearm','Forearm length'],['rightArmThickness','Arm thickness'],['rightHand','Hand size']]},
 {name:'Left leg',icon:'↙',controls:[['leftLeg','Leg length'],['leftLegThickness','Leg thickness'],['leftFoot','Foot size']]},
 {name:'Right leg',icon:'↘',controls:[['rightLeg','Leg length'],['rightLegThickness','Leg thickness'],['rightFoot','Foot size']]}
];
export const keys:Parameter[] = ['headWidth','headHeight',...groups.flatMap(g=>g.controls.map(([k])=>k))];
export const defaults = Object.fromEntries(keys.map(k=>[k,1])) as CharacterConfig;
export function optionsFor(k:Parameter):number[]{
 if(/head|helmet|torsoWidth/i.test(k))return [.85,1,1.15];
 if(k.includes('Thickness')||k.endsWith('Foot'))return [.85,1,1.2];
 if(k.endsWith('Hand'))return [.85,1,1.3,1.5];
 return [.75,1,1.25,1.5];
}
export const minValue=(k:Parameter)=>optionsFor(k)[0];
export const maxValue=(k:Parameter)=>optionsFor(k).at(-1)!;
export function validateConfig(value:unknown):CharacterConfig {
 if(!value || typeof value!=='object' || Array.isArray(value)) throw new Error('Expected a character configuration object.');
 const result={...defaults};
 for(const key of keys){const v=(value as Record<string,unknown>)[key];if(typeof v!=='number'||!Number.isFinite(v))throw new Error(`Missing or invalid parameter: ${key}`);result[key]=Math.max(minValue(key),Math.min(maxValue(key),v));}
 result.headWidth=result.helmetWidth;result.headHeight=result.helmetHeight;
 return result;
}
export const builtins = [
 {id:'default',name:'Original',config:defaults},
 {id:'tall',name:'Tall explorer',config:{...defaults,torsoLength:1.25,leftLeg:1.5,rightLeg:1.5}},
 {id:'short',name:'Little voyager',config:{...defaults,torsoLength:.75,leftLeg:.75,rightLeg:.75}},
 {id:'arms',name:'Long arms',config:{...defaults,leftUpperArm:1.5,rightUpperArm:1.5,leftForearm:1.5,rightForearm:1.5}},
 {id:'hands',name:'Big hello',config:{...defaults,leftHand:1.5,rightHand:1.5}}
];
export function randomConfig():CharacterConfig {return validateConfig(Object.fromEntries(keys.map(k=>{const options=optionsFor(k);return [k,options[Math.floor(Math.random()*options.length)]];})));}
