import React,{useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Search,Heart,Music2, Guitar, Play, Plus, Minus, RotateCcw, BookOpen, Library, ListMusic, Clock3} from 'lucide-react';
import './styles.css';

type Song={id:number;title:string;artist:string;type:string;key:string;tempo:number;source:string;favorite?:boolean};
const seed:Song[]=[
 {id:1,title:'Amazing Grace',artist:'Traditional',type:'Lead Sheet',key:'G',tempo:76,source:'Public domain'},
 {id:2,title:'House of the Rising Sun',artist:'Traditional',type:'Chords',key:'Am',tempo:90,source:'Traditional / public domain'},
 {id:3,title:'This Little Light of Mine',artist:'Traditional',type:'Chords',key:'G',tempo:104,source:'Public domain'},
 {id:4,title:'Scarborough Fair',artist:'Traditional',type:'Lead Sheet',key:'Am',tempo:82,source:'Traditional / public domain'},
 {id:5,title:'Ode to Joy',artist:'L. van Beethoven',type:'Piano',key:'C',tempo:108,source:'Public domain'}
];
const keys=['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
function App(){
 const [q,setQ]=useState(''); const [tab,setTab]=useState('Discover'); const [songs,setSongs]=useState(seed); const [selected,setSelected]=useState<Song|null>(null); const [transpose,setTranspose]=useState(0); const [bpm,setBpm]=useState(90); const [playing,setPlaying]=useState(false);
 const filtered=useMemo(()=>songs.filter(s=>(s.title+' '+s.artist+' '+s.type).toLowerCase().includes(q.toLowerCase())),[songs,q]);
 const shiftKey=(key:string,n:number)=>keys[(keys.indexOf(key)+n+12)%12];
 const toggle=(id:number)=>setSongs(s=>s.map(x=>x.id===id?{...x,favorite:!x.favorite}:x));
 return <div className="app">
  <header><div className="brand"><div className="logo"><Music2/></div><div><b>FreeScore</b><span>Play • Learn • Practice</span></div></div><div className="search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search songs, artists, chords…"/></div><button className="pill">Sign in</button></header>
  <nav>{['Discover','Library','Setlists','Practice'].map(x=><button className={tab===x?'active':''} onClick={()=>setTab(x)} key={x}>{x==='Discover'?<Search size={17}/>:x==='Library'?<Library size={17}/>:x==='Setlists'?<ListMusic size={17}/>:<Clock3 size={17}/>} {x}</button>)}</nav>
  <main>
   {tab==='Discover' && <>
    <section className="hero"><div><span className="eyebrow">YOUR MUSIC PRACTICE HUB</span><h1>Find it. <em>Play it.</em><br/>Make it yours.</h1><p>Discover music from free and legal sources, then transpose, simplify, and practice it your way.</p></div><div className="hero-card"><Guitar size={38}/><strong>Made for guitar & piano</strong><span>Chords • Tabs • Lead sheets • Scores</span></div></section>
    <div className="section-head"><div><h2>Explore free music</h2><p>Start with public-domain and openly licensed pieces.</p></div><div className="chips">{['All','Chords','Lead Sheets','Piano'].map(x=><button key={x}>{x}</button>)}</div></div>
    <div className="grid">{filtered.map(s=><article className="song" key={s.id} onClick={()=>{setSelected(s);setTranspose(0);setBpm(s.tempo)}}><div className="cover"><Music2 size={30}/><button onClick={e=>{e.stopPropagation();toggle(s.id)}} className={s.favorite?'fav on':'fav'}><Heart size={18} fill={s.favorite?'currentColor':'none'}/></button></div><div className="song-body"><span className="tag">{s.type}</span><h3>{s.title}</h3><p>{s.artist}</p><div className="meta"><span>Key {s.key}</span><span>♩ {s.tempo}</span></div></div></article>)}</div>
   </>}
   {tab==='Library' && <section className="panel"><h2>Your Library</h2><p>Favorite songs appear here for quick access.</p>{songs.filter(s=>s.favorite).map(s=><div className="row" key={s.id}><b>{s.title}</b><span>{s.artist}</span><button onClick={()=>setSelected(s)}>Open</button></div>)}{!songs.some(s=>s.favorite)&&<div className="empty">Tap the ♡ on a song to add it.</div>}</section>}
   {tab==='Setlists' && <section className="panel"><h2>Setlists</h2><p>Create collections for gigs, lessons, or practice sessions.</p><button className="primary"><Plus size={18}/> New setlist</button></section>}
   {tab==='Practice' && <section className="panel practice"><h2>Practice Mode</h2><p>Warm up with a simple metronome.</p><div className="bpm"><button onClick={()=>setBpm(Math.max(30,bpm-5))}><Minus/></button><strong>{bpm}<small>BPM</small></strong><button onClick={()=>setBpm(Math.min(240,bpm+5))}><Plus/></button></div><button className="primary" onClick={()=>setPlaying(!playing)}>{playing?<><Clock3/> Stop</>:<><Play/> Start</>}</button></section>}
  </main>
  {selected&&<div className="overlay" onClick={()=>setSelected(null)}><div className="sheet" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}>×</button><div className="sheet-top"><div><span className="tag">{selected.type}</span><h2>{selected.title}</h2><p>{selected.artist} • {selected.source}</p></div><button className="primary"><Play size={18}/> Play</button></div><div className="toolbar"><span>Key <b>{shiftKey(selected.key,transpose)}</b></span><button onClick={()=>setTranspose(Math.max(-11,transpose-1))}><Minus/></button><span>{transpose>0?'+':''}{transpose}</span><button onClick={()=>setTranspose(Math.min(11,transpose+1))}><Plus/></button><span className="divider"/><span>Capo</span><button>−</button><span>0</span><button>+</button><button className="reset" onClick={()=>setTranspose(0)}><RotateCcw size={16}/> Reset</button></div><div className="music-page"><h3>{selected.title}</h3><p className="chords">{shiftKey(selected.key,transpose)} &nbsp; D &nbsp; G &nbsp; Em &nbsp; C</p><p>♪ &nbsp; Amazing music starts with a simple first note.</p><p className="lyrics">Use this practice area for licensed, public-domain, or user-provided music. FreeScore does not reproduce copyrighted sheet music without permission.</p></div></div></div>}
  <footer>FreeScore <span>•</span> Music from lawful sources <span>•</span> Built for practice</footer>
 </div>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
