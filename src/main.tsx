import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ControlPanel} from './components/ControlPanel';
import {CharacterCanvas} from './components/CharacterCanvas';
import {Toolbar} from './components/Toolbar';
import {useCharacter} from './hooks/useCharacter';
import './styles.css';
function App(){const {config,apply,setParameter}=useCharacter();const [message,setMessage]=useState('');return <><header><a className="brand" href="./"><span className="logo">◉</span>轨道<span className="brand-divider"/> <small>角色创作室</small></a><div className="header-right"><span className="local-dot"/> 预设保存在本机 <span className="version">版本 01</span></div></header><div className="page-title"><div><span className="eyebrow">在这里，创造属于你的角色</span><h1>一点想象，无限个性<span>.</span></h1><p>认识你的探索者，赋予它独特的模样。</p></div><span className="project-badge">✧ &nbsp; 探索者 / 001</span></div><main><ControlPanel config={config} onChange={setParameter}/><CharacterCanvas config={config}/><Toolbar config={config} apply={apply} notify={setMessage}/></main><footer><span>以线条构成，用个性填满。</span><span>20 项比例调节 <span>·</span> 无限可能</span></footer>{message&&<div role="status" className="toast">{message}<button aria-label="关闭提示" onClick={()=>setMessage('')}>×</button></div>}</>;}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
