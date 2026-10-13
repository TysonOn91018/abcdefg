import type {ReactNode} from 'react';
export function BodyPart({x=0,y=0,sx=1,sy=sx,children}:{x?:number;y?:number;sx?:number;sy?:number;children:ReactNode}){return <g transform={`translate(${x} ${y}) scale(${sx} ${sy})`}>{children}</g>;}
