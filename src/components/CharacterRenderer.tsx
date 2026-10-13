import type {CharacterConfig} from '../character/characterTypes';
import {geometry} from '../character/geometryEngine';
export function CharacterRenderer({config}:{config:CharacterConfig}){
 const g=geometry(config),eye=g.warp(55.355,34.4914);
 return <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
 {g.paths.map((p,i)=><path key={i} d={p.d} fill={'fill' in p?p.fill:'none'} fillOpacity={'fill-opacity' in p?Number(p['fill-opacity']):undefined} stroke={'stroke' in p?p.stroke:undefined}/>)}
 <ellipse cx={eye.x} cy={eye.y} rx={1.31738*config.helmetWidth} ry={1.18774*config.helmetHeight} transform={`rotate(-14.9815 ${eye.x} ${eye.y})`} fill="black"/>
 </g>;
}
