import {useState} from 'react';
import {defaults,validateConfig} from '../character/characterDefaults';
import type {Parameter,CharacterConfig} from '../character/characterTypes';
export function useCharacter(){const [config,setConfig]=useState({...defaults});return {config,apply:(c:CharacterConfig)=>setConfig(validateConfig(c)),setParameter:(k:Parameter,v:number)=>setConfig(c=>validateConfig({...c,[k]:v}))};}
