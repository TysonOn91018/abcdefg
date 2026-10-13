import {test} from 'node:test';
import assert from 'node:assert/strict';
import {defaults,keys,validateConfig,optionsFor,randomConfig} from '../src/character/characterDefaults';
import {geometry,referenceWarp,warpPath} from '../src/character/geometryEngine';
import {referenceParts} from '../src/character/referenceParts';
import {parseConfig,serializeConfig,parsePresets} from '../src/utils/storage';
const close=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-8,`${a} differs from ${b}`);
const coords=(s:string)=>(s.match(/[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g)||[]).map(Number);
test('default geometry exactly preserves every original SVG path coordinate',()=>{
 const g=geometry(defaults),original=referenceParts.filter(p=>p.type==='path');
 assert.equal(g.paths.length,original.length);
 original.forEach((p,i)=>{const a=coords(p.d),b=coords(g.paths[i].d);assert.equal(a.length,b.length);a.forEach((n,j)=>close(n,b[j]));});
});
test('continuous silhouette retains the original closed Bezier contour',()=>{
 const g=geometry({...defaults,leftUpperArm:1.5,leftForearm:.75,leftHand:1.5,rightFoot:.85});
 const full=g.paths.find(p=>p.d.includes('179.')&&'fill' in p&&p.fill==='#C5C5C5')||g.paths[2];
 assert.equal(full.d.match(/[MLCZ]/g)?.join(''),referenceParts[2].type==='path'?referenceParts[2].d.match(/[MLCZ]/g)?.join(''):'');
 assert.ok(full.d.endsWith('Z'));
});
test('shared source joint points map to identical positions on adjacent contours',()=>{
 for(let i=0;i<30;i++){const w=referenceWarp(randomConfig());for(const p of [{x:6.85326,y:97.5023},{x:15.029,y:97.8624},{x:16.3365,y:179.496},{x:27.4103,y:181.091}]){
 const d=warpPath(`M${p.x} ${p.y}L${p.x} ${p.y}`,w);const v=coords(d);close(v[0],v[2]);close(v[1],v[3]);
 }}
});
test('asymmetric hands and arm lengths leave opposite arm unchanged',()=>{
 const a=referenceWarp(defaults),b=referenceWarp({...defaults,leftHand:1.5,leftUpperArm:1.5,leftForearm:1.25});
 for(const p of [{x:88.368,y:111.122},{x:81.473,y:96.535}])assert.deepEqual(a(p.x,p.y),b(p.x,p.y));
 assert.notDeepEqual(a(7.93434,110.455),b(7.93434,110.455));
});
test('all slider extremes and random shapes stay inside export bounds',()=>{
 const configs=[defaults,...keys.flatMap(k=>optionsFor(k).map(v=>validateConfig({...defaults,[k]:v}))),...Array.from({length:40},()=>randomConfig())];
 for(const c of configs){const g=geometry(c);for(const p of g.paths){const v=coords(p.d);for(let i=0;i<v.length;i+=2){assert.ok(Number.isFinite(v[i])&&Number.isFinite(v[i+1]));assert.ok(v[i]>=g.bounds.x&&v[i]<=g.bounds.x+g.bounds.width);assert.ok(v[i+1]>=g.bounds.y&&v[i+1]<=g.bounds.y+g.bounds.height);}}}
});
test('each visible parameter changes the intended original vector coordinates',()=>{
 const baseline=geometry(defaults).paths.map(p=>p.d).join('');for(const k of keys.filter(k=>!k.startsWith('head'))){const c=validateConfig({...defaults,[k]:optionsFor(k).at(-1)});assert.notEqual(geometry(c).paths.map(p=>p.d).join(''),baseline,k);}
});
test('validation rejects malformed values and keeps head and helmet linked',()=>{
 for(const v of [null,[],{}, {...defaults,leftHand:NaN},{...defaults,leftLeg:'2'}])assert.throws(()=>validateConfig(v));
 const c=validateConfig({...defaults,leftHand:9,leftLeg:-1,headWidth:2,helmetWidth:1.15});assert.equal(c.leftHand,1.5);assert.equal(c.leftLeg,.75);assert.equal(c.headWidth,c.helmetWidth);
});
test('JSON and presets retain every validated customization parameter',()=>{
 const c=randomConfig();assert.deepEqual(parseConfig(serializeConfig(c)),c);const p=[{id:'test',name:'Explorer',config:c}];assert.deepEqual(parsePresets(JSON.stringify(p)),p);assert.throws(()=>parsePresets('[{"id":1}]'));
});
test('randomization uses only safe proportion options',()=>{for(let i=0;i<100;i++){const c=randomConfig();for(const k of keys)assert.ok(optionsFor(k).includes(c[k]));}});

test('each leg length changes only its own vertical reach and carries its foot',()=>{
 const base=referenceWarp(defaults);
 for(const side of ['left','right'] as const){
  const x=side==='left'?22:79,other=side==='left'?79:22;
  for(const size of [.75,1.16,1.5]){
   const w=referenceWarp({...defaults,[`${side}Leg`]:size});
   close(w(x,180).y-126,54*size);
   close(w(x,194).y-w(x,180).y,14);
   assert.deepEqual(w(other,180),base(other,180));
   assert.deepEqual(w(47,80),base(47,80));
   assert.deepEqual(w(11,98),base(11,98));
  }
 }
});
