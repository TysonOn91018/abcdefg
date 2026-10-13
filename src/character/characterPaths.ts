export const headPath='M -28 0 Q -30 -28 -14 -43 L -4 -34 L 2 -62 Q 25 -52 29 0 Z';
export const handPath='M -4 -3 C -7 0 -10 5 -12 9 Q -13 12 -10 12 L -5 7 L -5 14 Q -4 18 -2 14 L 0 8 L 3 15 Q 5 18 6 14 L 5 7 L 10 12 Q 14 14 12 10 L 6 0 L 4 -3 Z';
export const footPath='M -8 -6 Q -10 3 -16 7 Q -25 10 -25 15 Q -25 18 -20 18 L 6 18 Q 13 18 10 8 L 7 -6 Z';

// The opening matches the connected limb, independent of hand/foot size.
export function connectedHandPath(w:number){return `M ${-w} -4 Q ${-w} 0 -8 5 L -12 9 Q -13 12 -10 12 L -5 7 L -5 14 Q -4 18 -2 14 L 0 8 L 3 15 Q 5 18 6 14 L 5 7 L 10 12 Q 14 14 12 10 L 8 4 Q ${w} 0 ${w} -4 Z`;}
export function connectedFootPath(w:number){return `M ${-w} -8 Q ${-w} 3 -16 7 Q -25 10 -25 15 Q -25 18 -20 18 L 6 18 Q 13 18 ${w} 4 L ${w} -8 Z`;}

// A rounded segment has fixed joint openings and a configurable middle width.
// The normal is computed in world coordinates, so rotated limbs share exactly
// the same elbow/knee center rather than relying on independently scaled parts.
export function limbSegmentPath(a:{x:number;y:number},b:{x:number;y:number},jointWidth:number,bodyWidth:number){
 const length=Math.hypot(b.x-a.x,b.y-a.y);
 const nx=-(b.y-a.y)/length,ny=(b.x-a.x)/length;
 const r=jointWidth/2,m=(a.x+b.x)/2,n=(a.y+b.y)/2;
 const middle=bodyWidth-jointWidth/2;
 return `M ${a.x+nx*r} ${a.y+ny*r} Q ${m+nx*middle} ${n+ny*middle} ${b.x+nx*r} ${b.y+ny*r} A ${r} ${r} 0 0 0 ${b.x-nx*r} ${b.y-ny*r} Q ${m-nx*middle} ${n-ny*middle} ${a.x-nx*r} ${a.y-ny*r} A ${r} ${r} 0 0 0 ${a.x+nx*r} ${a.y+ny*r} Z`;
}
