import {renderToStaticMarkup} from 'react-dom/server';
import {createElement} from 'react';
import {CharacterRenderer} from '../components/CharacterRenderer';
import {geometry} from '../character/geometryEngine';
import type {CharacterConfig} from '../character/characterTypes';
export function svgText(config:CharacterConfig){const b=geometry(config).bounds;return `<svg xmlns="http://www.w3.org/2000/svg" width="${b.width}" height="${b.height}" viewBox="${b.x} ${b.y} ${b.width} ${b.height}">${renderToStaticMarkup(createElement(CharacterRenderer,{config}))}</svg>`;}
export function download(data:Blob,name:string){const url=URL.createObjectURL(data);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function exportSVG(config:CharacterConfig){download(new Blob([svgText(config)],{type:'image/svg+xml'}),'orbit-character.svg');}
