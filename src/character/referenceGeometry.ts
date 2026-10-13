import type {CharacterConfig,Point} from './characterTypes';
import {referenceParts} from './referenceParts';

const smooth=(t:number)=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
/** Continuous deformation of the supplied complete silhouette. Identical source
 * points always produce identical positions, including every joint boundary. */
export function referenceWarp(c:CharacterConfig){
 const center=47;
 const hip=126;
 const neck=hip-70*c.torsoLength;
 const bodyX=(x:number,y:number)=>center+(x-center)*lerp(c.helmetWidth,c.torsoWidth,smooth((y-56)/14));
 const armY=(y:number,side:'left'|'right')=>neck+(Math.min(y,78)-56)*c[`${side}UpperArm`]+Math.max(0,y-78)*c[`${side}Forearm`];
 function point(x:number,y:number):Point{
  if(y<56)return {x:center+(x-center)*c.helmetWidth,y:neck+(y-56)*c.helmetHeight};
  const side=x<center?'left':'right';
  const shoulder=side==='left'?26:68,wrist=side==='left'?11:86;
  if(y<114 && (x<27 || x>67)){
   const t=Math.max(0,Math.min(1,(y-56)/42));
   const axis=lerp(shoulder,wrist,Math.sin(t*Math.PI/2));
   const shoulderX=bodyX(shoulder,56);
   const wristX=shoulderX+wrist-shoulder;
   const armX=shoulderX+axis-shoulder+(x-axis)*c[`${side}ArmThickness`];
   const handX=wristX+(x-wrist)*c[`${side}Hand`];
   const handY=armY(98,side)+(y-98)*c[`${side}Hand`];
   // Blend through the wrist instead of introducing a separate cap or seam.
   const blend=smooth((y-90)/9);
   return {x:lerp(armX,handX,blend),y:lerp(armY(y,side),handY,blend)};
  }
  if(y<=126)return {x:bodyX(x,y),y:neck+(y-56)*c.torsoLength};
  const foot=c[`${side}Foot`],length=c[`${side}Leg`],thickness=c[`${side}LegThickness`];
  const footCenter=side==='left'?22:79;
  const hipCenter=side==='left'?34:61;
  const footX=center+(hipCenter-center)*c.torsoWidth+(footCenter-hipCenter);
  const ankle=hip+54*length;
  const t=Math.max(0,Math.min(1,(y-126)/54));
  const axis=lerp(hipCenter,footCenter,t);
  const axisX=center+(hipCenter-center)*c.torsoWidth+(axis-hipCenter);
  const legX=axisX+(x-axis)*thickness;
  const legY=hip+(y-126)/54*(ankle-hip);
  const fx=footX+(x-footCenter)*foot,fy=ankle+(y-180)*foot;
  const blend=smooth((y-168)/12);
  return {x:lerp(legX,fx,blend),y:lerp(legY,fy,blend)};
 }
 return point;
}

/** Our reference uses absolute M/L/C/Z commands. Map each Bezier control point;
 * retaining commands preserves the illustrator's continuous vector contours. */
export function warpPath(d:string,warp:(x:number,y:number)=>Point){
 const tokens=d.match(/[MLCZ]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g);
 if(!tokens)throw new Error('Invalid reference path');
 let result='',i=0;
 while(i<tokens.length){const token=tokens[i++];if(/^[MLCZ]$/.test(token)){result+=token+' ';continue;}
 const x=Number(token),y=Number(tokens[i++]);if(!Number.isFinite(x)||!Number.isFinite(y))throw new Error('Invalid path coordinate');
 const p=warp(x,y);result+=`${p.x} ${p.y} `;
 }
 return result.trim();
}
export function referenceGeometry(c:CharacterConfig){
 const warp=referenceWarp(c);
 const paths=referenceParts.filter(p=>p.type==='path').map(p=>({...p,d:warpPath(p.d,warp)}));
 // A cubic lies within the convex hull of its control points. Include those
 // transformed points plus stroke padding for guaranteed unclipped exports.
 const points=paths.flatMap(p=>{const n=p.d.match(/[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g)!.map(Number);const out:Point[]=[];for(let i=0;i<n.length;i+=2)out.push({x:n[i],y:n[i+1]});return out;});
 const x=Math.min(...points.map(p=>p.x))-4,y=Math.min(...points.map(p=>p.y))-4;
 const width=Math.max(...points.map(p=>p.x))+4-x,height=Math.max(...points.map(p=>p.y))+4-y;
 return {paths,warp,bounds:{x,y,width,height}};
}
