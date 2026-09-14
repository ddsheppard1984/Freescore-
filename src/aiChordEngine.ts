export type GeneratedArrangement={
  title:string; artist:string; key:string; bpm:number; capo:number;
  difficulty:'Easy'|'Standard';
  sections:{name:string; chords:string[]}[];
};

const progressions:Record<string,string[][]>={
  Pop:[['G','D','Em','C'],['C','G','Am','F'],['G','Em','C','D']],
  Rock:[['G','D','C','G'],['A','D','E','A'],['E','D','A','E']],
  Country:[['G','C','G','D'],['G','D','Em','C'],['A','D','A','E']],
  Folk:[['G','C','G','D'],['Am','G','F','C'],['C','G','Am','F']],
  'R&B':[['A','F#m','D','E'],['G','Em','C','D'],['C','Am','F','G']]
};

function seedFor(text:string){return [...text].reduce((n,c)=>((n*31)+c.charCodeAt(0))>>>0,7)}

/** Generate an original practice chord arrangement from song metadata. */
export function generateChordArrangement(title:string,artist:string,genre:string):GeneratedArrangement{
  const seed=seedFor(`${title}|${artist}`);
  const pool=progressions[genre]||progressions.Pop;
  const pick=(offset:number)=>pool[(seed+offset)%pool.length];
  return {
    title,artist,key:['G','A','C','D','E'][seed%5],bpm:70+(seed%61),capo:seed%4,difficulty:'Standard',
    sections:[
      {name:'Intro',chords:pick(0)},{name:'Verse',chords:pick(1)},{name:'Chorus',chords:pick(2)},
      {name:'Verse 2',chords:pick(0)},{name:'Chorus',chords:pick(2)},{name:'Bridge',chords:pick(1)},
      {name:'Final Chorus',chords:pick(2)}
    ]
  };
}
