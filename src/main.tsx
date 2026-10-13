import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ControlPanel} from './components/ControlPanel';
import {CharacterCanvas} from './components/CharacterCanvas';
import {Toolbar} from './components/Toolbar';
import {useCharacter} from './hooks/useCharacter';
import './styles.css';
function App(){const {config,apply,setParameter}=useCharacter();const [message,setMessage]=useState('');return <><header><a className="brand" href="./"><span className="logo">◉</span>orbit<span className="brand-divider"/> <small>CHARACTER STUDIO</small></a><div className="header-right"><span className="local-dot"/> Presets stored locally <span className="version">V.01</span></div></header><div className="page-title"><div><span className="eyebrow">A SPACE TO MAKE SOMETHING YOU</span><h1>A little out of this world<span>.</span></h1><p>Meet your explorer. Make it your own.</p></div><span className="project-badge">✧ &nbsp; Explorer / 001</span></div><main><ControlPanel config={config} onChange={setParameter}/><CharacterCanvas config={config}/><Toolbar config={config} apply={apply} notify={setMessage}/></main><footer><span>Built from shapes. Filled with personality.</span><span>20 size options <span>·</span> Infinite possibilities</span></footer>{message&&<div role="status" className="toast">{message}<button aria-label="Dismiss notification" onClick={()=>setMessage('')}>×</button></div>}</>;}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
