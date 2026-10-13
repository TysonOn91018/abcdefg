import type {CSSProperties} from 'react';
import type {Parameter} from '../character/characterTypes';
import {minValue,maxValue} from '../character/characterDefaults';
export function SliderControl({parameter,label,value,onChange}:{parameter:Parameter;label:string;value:number;onChange:(k:Parameter,v:number)=>void}){
 const min=minValue(parameter),max=maxValue(parameter);
 return <label className="slider-control"><span>{label}<output>{Math.round(value*100)}<small>%</small></output></span><input aria-label={label} type="range" min={Math.round(min*100)} max={Math.round(max*100)} step="1" value={Math.round(value*100)} onChange={e=>onChange(parameter,+e.target.value/100)} style={{'--progress':`${(value-min)/(max-min)*100}%`} as CSSProperties}/><span className="range-labels"><small>{Math.round(min*100)}%</small><small>{Math.round(max*100)}%</small></span></label>;
}
