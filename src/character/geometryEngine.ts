import type {CharacterConfig,Point} from './characterTypes';
export function geometry(input:CharacterConfig){
 const c={...input,headWidth:input.helmetWidth,headHeight:input.helmetHeight};
 const w=55*c.torsoWidth,h=91*c.torsoLength;
 const leftLength=112*c.leftLeg,rightLength=112*c.rightLeg;
 // Two equal segments form a bent leg, preserving total length and a shared ankle height.
 const hipY=Math.max(-18*c.leftFoot-leftLength*.97,-18*c.rightFoot-rightLength*.97),neckY=hipY-h;
 const neck={x:0,y:neckY};
 function arm(side:'left'|'right',sign:number){
 const shoulder={x:sign*(w/2-3),y:neckY+10};
 const upper=43*c[`${side}UpperArm`],fore=37*c[`${side}Forearm`];
 const elbow={x:shoulder.x+sign*upper*.43,y:shoulder.y+upper*Math.sqrt(1-.43**2)};
 const wrist={x:elbow.x+sign*fore*.14,y:elbow.y+fore*Math.sqrt(1-.14**2)};
 return {shoulder,elbow,wrist,jointThickness:10,thickness:10*c[`${side}ArmThickness`],hand:c[`${side}Hand`]};
 }
 function leg(side:'left'|'right',sign:number,length:number){
 const hip={x:sign*w*.25,y:hipY};const ankle={x:hip.x+sign*25,y:-18*c[`${side}Foot`]};
 const drop=ankle.y-hipY;
 // Horizontal spread reduces for very short legs, so the two-link solution remains feasible.
 const dx=Math.min(25,length*.2,Math.sqrt(Math.max(0,length**2-drop**2))*.7);ankle.x=hip.x+sign*dx;
 const distance=Math.hypot(dx,drop),bend=Math.sqrt(Math.max(0,(length/2)**2-(distance/2)**2));
 const knee={x:(hip.x+ankle.x)/2+sign*bend*drop/distance,y:(hipY+ankle.y)/2-bend*dx/distance};
 return {hip,knee,ankle,length,jointThickness:18,thickness:18*c[`${side}LegThickness`],foot:c[`${side}Foot`]};
 }
 const arms={left:arm('left',-1),right:arm('right',1)};
 const legs={left:leg('left',-1,leftLength),right:leg('right',1,rightLength)};
 const helmet={x:0,y:neckY-35*c.helmetHeight,rx:49*c.helmetWidth,ry:41*c.helmetHeight};
 const points:Point[]=[{x:-w/2,y:neckY},{x:w/2,y:hipY},{x:helmet.x-helmet.rx-3,y:helmet.y-helmet.ry-3},{x:helmet.x+helmet.rx+3,y:helmet.y+helmet.ry+3},{x:-29*c.headWidth-3,y:neckY-64*c.headHeight-3},{x:42*c.headWidth+3,y:neckY+3}];
 for(const a of Object.values(arms))for(const p of [a.shoulder,a.elbow,a.wrist]){const r=Math.max(a.thickness/2+3,22*a.hand);points.push({x:p.x-r,y:p.y-r},{x:p.x+r,y:p.y+r});}
 for(const l of Object.values(legs)){for(const p of [l.hip,l.knee,l.ankle]){const r=l.thickness/2+3;points.push({x:p.x-r,y:p.y-r},{x:p.x+r,y:p.y+r});}points.push({x:l.ankle.x-30*l.foot,y:l.ankle.y+18*l.foot},{x:l.ankle.x+30*l.foot,y:l.ankle.y-12*l.foot});}
 const minX=Math.min(...points.map(p=>p.x)),maxX=Math.max(...points.map(p=>p.x)),minY=Math.min(...points.map(p=>p.y)),maxY=Math.max(...points.map(p=>p.y));
 const visorY=neckY-17*c.headHeight;
 const visorTip={x:helmet.rx*Math.sqrt(Math.max(0,1-((visorY-helmet.y)/helmet.ry)**2)),y:visorY};
 return {w,h,neck,hipY,helmet,head:{width:c.headWidth,height:c.headHeight},visorTip,arms,legs,bounds:{x:minX-12,y:minY-12,width:maxX-minX+24,height:maxY-minY+24}};
}
export type Geometry=ReturnType<typeof geometry>;
