export type GeneratedLine={lyrics:string;chords:string[]};
export type GeneratedArrangement={title:string;artist:string;key:string;bpm:number;capo:number;difficulty:'Easy'|'Standard';strum:string;sections:{name:string;chords:string[];lines?:GeneratedLine[]}[]};

// GitHub Pages cannot execute /api/generate. The AI backend lives on Vercel.
const API_URL='https://freescore-rho.vercel.app/api/generate';

function showAIError(message:string){
  try{window.alert(`FreeScore AI error:\n\n${message}`)}catch{}
}

export async function generateWithAI(query:string,artist='',genre='Pop',difficulty:'Easy'|'Standard'='Easy'):Promise<GeneratedArrangement>{
  try{
    const response=await fetch(API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query,artist,genre,difficulty})});
    if(!response.ok){
      let detail='';
      try{const body=await response.json();detail=body?.detail||body?.error||''}catch{}
      const message=detail||`AI service unavailable (${response.status})`;
      showAIError(message);
      throw new Error(message);
    }
    const data=await response.json();
    if(!data?.title||!Array.isArray(data?.sections)){
      showAIError('AI returned an invalid arrangement.');
      throw new Error('Invalid AI arrangement');
    }
    return data as GeneratedArrangement;
  }catch(error){
    if(error instanceof TypeError){
      showAIError('Could not connect to the FreeScore AI backend.');
    }
    throw error;
  }
}
