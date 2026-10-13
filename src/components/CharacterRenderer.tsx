import type {CharacterConfig} from '../character/characterTypes';
import {geometry} from '../character/geometryEngine';
import {headPath,connectedHandPath,connectedFootPath,limbSegmentPath} from '../character/characterPaths';
import {BodyPart} from './BodyPart';
export function CharacterRenderer({config}:{config:CharacterConfig}){
 const g=geometry(config);return <g stroke="#242829" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" fill="#c9c9c7">
 {Object.entries(g.legs).map(([side,l])=>{
 const paths=[limbSegmentPath(l.hip,l.knee,l.jointThickness,l.thickness),limbSegmentPath(l.knee,l.ankle,l.jointThickness,l.thickness)];
 return <g key={side}>
 {paths.map((d,i)=><path key={`outline-${i}`} d={d} fill="#242829" strokeWidth="4.8"/>)}
 {paths.map((d,i)=><path key={`fill-${i}`} d={d} stroke="none"/>)}
 <BodyPart x={l.ankle.x} y={l.ankle.y} sx={side==='right'?-l.foot:l.foot} sy={l.foot}><path d={connectedFootPath(l.jointThickness/2/l.foot)} vectorEffect="non-scaling-stroke"/></BodyPart>
 <path d={`M ${l.ankle.x} ${l.ankle.y-9*l.foot} L ${l.ankle.x} ${l.ankle.y}`} stroke="#c9c9c7" strokeWidth={l.jointThickness-2.4} fill="none"/>
 </g>;
 })}
 {Object.entries(g.arms).map(([side,a])=>{
 const paths=[limbSegmentPath(a.shoulder,a.elbow,a.jointThickness,a.thickness),limbSegmentPath(a.elbow,a.wrist,a.jointThickness,a.thickness)];
 return <g key={side}>
 {paths.map((d,i)=><path key={`outline-${i}`} d={d} fill="#242829" strokeWidth="4.8"/>)}
 {paths.map((d,i)=><path key={`fill-${i}`} d={d} stroke="none"/>)}
 <BodyPart x={a.wrist.x} y={a.wrist.y} sx={a.hand}><path d={connectedHandPath(a.jointThickness/2/a.hand)} vectorEffect="non-scaling-stroke"/></BodyPart>
 <path d={`M ${a.wrist.x} ${a.wrist.y-5*a.hand} L ${a.wrist.x} ${a.wrist.y}`} stroke="#c9c9c7" strokeWidth={a.jointThickness-2.4} fill="none"/>
 </g>;
 })}
 <ellipse cx={g.helmet.x} cy={g.helmet.y} rx={g.helmet.rx} ry={g.helmet.ry} fill="#a6eafb"/>
 <path d={`M ${g.helmet.rx*.45} ${g.helmet.y-g.helmet.ry*.78} Q ${g.helmet.rx*.73} ${g.helmet.y-g.helmet.ry*.55} ${g.helmet.rx*.78} ${g.helmet.y-g.helmet.ry*.36}`} stroke="white" strokeWidth="6" fill="none"/><circle cx={g.helmet.rx*.87} cy={g.helmet.y-g.helmet.ry*.2} r="2" fill="white" stroke="none"/>
 <path d={`M ${28*g.head.width} ${g.neck.y-22*g.head.height} L ${g.visorTip.x} ${g.visorTip.y} L ${29*g.head.width} ${g.neck.y-8*g.head.height}`} fill="none"/>
 {/* Draw the suit over the helmet's lower edge. The open top joins the head
     at the same two anchors, without a separating outline or cyan strip. */}
 <path d={`M ${-28*g.head.width} ${g.neck.y} L ${-g.w/2} ${g.neck.y+10} L ${-g.w/2+2} ${g.hipY-5} Q 0 ${g.hipY+10} ${g.w/2-2} ${g.hipY-5} L ${g.w/2} ${g.neck.y+10} L ${29*g.head.width} ${g.neck.y}`}/>
 <BodyPart y={g.neck.y} sx={g.head.width} sy={g.head.height}><path d={headPath.replace(/ Z$/,'')} vectorEffect="non-scaling-stroke"/><circle cx="12" cy="-28" r="7" fill="#fff" vectorEffect="non-scaling-stroke"/><circle cx="14" cy="-28" r="1.5" fill="#242829" stroke="none"/></BodyPart>
 <path d={`M -10 ${g.neck.y+9} Q 0 ${g.neck.y+14} 12 ${g.neck.y+8} M -4 ${g.neck.y+19} Q 1 ${g.neck.y+21} 7 ${g.neck.y+19}`} fill="none" strokeWidth="1.5"/>
 </g>;
}
