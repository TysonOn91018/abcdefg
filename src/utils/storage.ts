import type {Preset,CharacterConfig} from '../character/characterTypes';
import {validateConfig} from '../character/characterDefaults';
export const STORAGE_KEY='orbit-presets-v1';
export function serializeConfig(c:CharacterConfig){return JSON.stringify(validateConfig(c),null,2);}
export function parseConfig(text:string){return validateConfig(JSON.parse(text));}
export function parsePresets(text:string):Preset[]{const data:unknown=JSON.parse(text);if(!Array.isArray(data))throw new Error('Invalid presets');return data.map(p=>{if(!p||typeof p.id!=='string'||typeof p.name!=='string')throw new Error('Invalid preset');return {id:p.id,name:p.name,config:validateConfig(p.config)};});}
export function loadPresets():Preset[]{try{return parsePresets(localStorage.getItem(STORAGE_KEY)||'[]');}catch{return [];}}
export function savePresets(p:Preset[]){localStorage.setItem(STORAGE_KEY,JSON.stringify(p));}
