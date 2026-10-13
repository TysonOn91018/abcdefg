import type {Parameter} from '../character/characterTypes';
import {optionsFor} from '../character/characterDefaults';
export function SliderControl({parameter,label,value,onChange}:{parameter:Parameter;label:string;value:number;onChange:(k:Parameter,v:number)=>void}){
 const options=optionsFor(parameter);
 const labels=options.length===3?['Small','Standard','Large']:['Small','Standard','Large','Extra large'];
 return <label className="slider-control size-control"><span>{label}<output>{Math.round(value*100)}<small>%</small></output></span><select aria-label={label} value={value} onChange={e=>onChange(parameter,+e.target.value)}>{!options.includes(value)&&<option value={value}>Custom · {Math.round(value*100)}%</option>}{options.map((v,i)=><option value={v} key={v}>{labels[i]} · {Math.round(v*100)}%</option>)}</select></label>;
}
