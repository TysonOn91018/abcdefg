import type {CharacterConfig, Parameter} from './characterTypes';
export const groups: {name:string;icon:string;controls:[Parameter,string][]}[] = [
 {name:'头部与头盔',icon:'◉',controls:[['helmetWidth','头盔宽度'],['helmetHeight','头盔高度']]},
 {name:'躯干',icon:'▱',controls:[['torsoWidth','躯干宽度'],['torsoLength','躯干长度']]},
 {name:'画面左臂',icon:'↙',controls:[['leftUpperArm','上臂长度'],['leftForearm','前臂长度'],['leftArmThickness','手臂粗细'],['leftHand','手掌大小']]},
 {name:'画面右臂',icon:'↘',controls:[['rightUpperArm','上臂长度'],['rightForearm','前臂长度'],['rightArmThickness','手臂粗细'],['rightHand','手掌大小']]},
 {name:'画面左腿',icon:'↙',controls:[['leftLeg','腿部长度'],['leftLegThickness','腿部粗细'],['leftFoot','脚掌大小']]},
 {name:'画面右腿',icon:'↘',controls:[['rightLeg','腿部长度'],['rightLegThickness','腿部粗细'],['rightFoot','脚掌大小']]}
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
 if(!value || typeof value!=='object' || Array.isArray(value)) throw new Error('请选择有效的角色配置文件。');
 const result={...defaults};
 for(const key of keys){const v=(value as Record<string,unknown>)[key];if(typeof v!=='number'||!Number.isFinite(v))throw new Error(`参数缺失或无效： ${key}`);result[key]=Math.max(minValue(key),Math.min(maxValue(key),v));}
 result.headWidth=result.helmetWidth;result.headHeight=result.helmetHeight;
 return result;
}
export const builtins = [
 {id:'default',name:'原始角色',config:defaults},
 {id:'tall',name:'高个探索者',config:{...defaults,torsoLength:1.25,leftLeg:1.5,rightLeg:1.5}},
 {id:'short',name:'小小旅行家',config:{...defaults,torsoLength:.75,leftLeg:.75,rightLeg:.75}},
 {id:'arms',name:'长手臂',config:{...defaults,leftUpperArm:1.5,rightUpperArm:1.5,leftForearm:1.5,rightForearm:1.5}},
 {id:'hands',name:'大手掌',config:{...defaults,leftHand:1.5,rightHand:1.5}}
];
export function randomConfig():CharacterConfig {return validateConfig(Object.fromEntries(keys.map(k=>{const options=optionsFor(k);return [k,options[Math.floor(Math.random()*options.length)]];})));}
