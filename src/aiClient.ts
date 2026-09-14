export type GeneratedLine={lyrics:string;chords:string[]};
export type GeneratedArrangement={title:string;artist:string;key:string;bpm:number;capo:number;difficulty:'Easy'|'Standard';strum:string;sections:{name:string;chords:string[];lines?:GeneratedLine[]}[]};

const API_URL='/api/generate';

export async function generateWithAI(query:string,artist='',genre='Pop',difficulty:'Easy'|'Standard'='Easy'):Promise<GeneratedArrangement>{
  const response=await fetch(API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query,artist,genre,difficulty})});
  if(!response.ok)throw new Error(`AI service unavailable (${response.status})`);
  const data=await response.json();
  if(!data?.title||!Array.isArray(data?.sections))throw new Error('Invalid AI arrangement');
  return data as GeneratedArrangement;
}
