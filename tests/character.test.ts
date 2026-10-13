import {test} from 'node:test';
import assert from 'node:assert/strict';
import {defaults,keys,maxValue,minValue,validateConfig} from '../src/character/characterDefaults';
import {geometry} from '../src/character/geometryEngine';
import {parseConfig,serializeConfig,parsePresets} from '../src/utils/storage';
const dist=(a:{x:number;y:number},b:{x:number;y:number})=>Math.hypot(a.x-b.x,a.y-b.y);
test('all combinations of leg and foot extremes preserve segment lengths and shared ground',()=>{
 for(const leftLeg of [.5,1,2])for(const rightLeg of [.5,1,2])for(const leftFoot of [.5,2])for(const rightFoot of [.5,2]){
 const c={...defaults,leftLeg,rightLeg,leftFoot,rightFoot};const g=geometry(c);
 for(const l of Object.values(g.legs)){assert.ok(Math.abs(dist(l.hip,l.knee)+dist(l.knee,l.ankle)-l.length)<1e-8);assert.ok(Math.abs(l.ankle.y+18*l.foot)<1e-8);}
 }
});
test('arm anchors preserve lengths; hand scaling does not change arm anchors',()=>{
 const c={...defaults,leftUpperArm:2,leftForearm:.5,leftHand:2.5};const g=geometry(c);assert.ok(Math.abs(dist(g.arms.left.shoulder,g.arms.left.elbow)-86)<1e-8);assert.ok(Math.abs(dist(g.arms.left.elbow,g.arms.left.wrist)-18.5)<1e-8);assert.deepEqual(g.arms.left.wrist,geometry({...c,leftHand:.5}).arms.left.wrist);assert.deepEqual(g.arms.right,geometry(defaults).arms.right);
});
test('torso dimensions move attached joints',()=>{const a=geometry(defaults),b=geometry({...defaults,torsoWidth:2,torsoLength:2});assert.ok(Math.abs(b.arms.left.shoulder.x)>Math.abs(a.arms.left.shoulder.x));assert.equal(b.neck.y,a.neck.y-91);assert.equal(b.legs.left.hip.y,b.hipY);});
test('every independent parameter and maximum combination has finite generous bounds',()=>{
 const configs=[defaults,Object.fromEntries(keys.map(k=>[k,maxValue(k)])),...keys.map(k=>({...defaults,[k]:maxValue(k)}))];for(const c of configs){const g=geometry(validateConfig(c));for(const v of Object.values(g.bounds))assert.ok(Number.isFinite(v));assert.ok(g.bounds.width>0&&g.bounds.height>0);for(const l of Object.values(g.legs)){assert.ok(l.knee.x>g.bounds.x&&l.knee.x<g.bounds.x+g.bounds.width);}}
});
test('validation rejects missing, malformed and non-finite values and clamps permitted ranges',()=>{for(const v of [null,[],{}, {...defaults,leftHand:NaN},{...defaults,leftLeg:'2'}])assert.throws(()=>validateConfig(v));assert.equal(validateConfig({...defaults,leftHand:9}).leftHand,1.5);assert.equal(validateConfig({...defaults,leftLeg:-1}).leftLeg,.75);});
test('JSON and presets retain every customization parameter',()=>{const c=validateConfig(Object.fromEntries(keys.map((k,i)=>[k,.5+i*.06])));assert.deepEqual(parseConfig(serializeConfig(c)),c);const presets=[{id:'test',name:'My explorer',config:c}];assert.deepEqual(parsePresets(JSON.stringify(presets)),presets);assert.throws(()=>parsePresets('[{"id":1}]'));});

test('helmet and head remain linked even for legacy imported configurations',()=>{const c=validateConfig({...defaults,headWidth:2,headHeight:.5,helmetWidth:1.15,helmetHeight:.85});assert.equal(c.headWidth,c.helmetWidth);assert.equal(c.headHeight,c.helmetHeight);const g=geometry(c);assert.equal(g.head.width,1.15);assert.equal(g.head.height,.85);assert.ok(Math.abs((g.visorTip.x/g.helmet.rx)**2+((g.visorTip.y-g.helmet.y)/g.helmet.ry)**2-1)<1e-9);});
test('randomization uses only safe preset sizes',async()=>{const {randomConfig,optionsFor}=await import('../src/character/characterDefaults');for(let i=0;i<100;i++){const c=randomConfig();for(const k of keys)assert.ok(optionsFor(k).includes(c[k]));}});

test('all limb joint openings stay fixed while body widths and extremities change',()=>{
 const standard=geometry(defaults);
 for(const size of [.85,1,1.2]){
 const changed=geometry({...defaults,leftArmThickness:size,rightArmThickness:size,leftLegThickness:size,rightLegThickness:size,leftHand:1.5,rightHand:.85,leftFoot:1.2,rightFoot:.85});
 for(const side of ['left','right'] as const){assert.equal(changed.arms[side].jointThickness,10);assert.equal(changed.legs[side].jointThickness,18);for(const anchor of ['elbow','wrist'] as const){assert.equal(changed.arms[side][anchor].x,standard.arms[side][anchor].x);assert.ok(Math.abs((changed.arms[side][anchor].y-changed.neck.y)-(standard.arms[side][anchor].y-standard.neck.y))<1e-9);}}
 }
});
