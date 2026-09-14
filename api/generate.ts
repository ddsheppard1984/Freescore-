type RequestLike={method?:string;body?:unknown};
type ResponseLike={status:(n:number)=>ResponseLike;setHeader:(k:string,v:string)=>void;json:(v:unknown)=>void};

const schema={type:'object',additionalProperties:false,properties:{title:{type:'string'},artist:{type:'string'},key:{type:'string'},bpm:{type:'integer'},capo:{type:'integer'},difficulty:{type:'string',enum:['Easy','Standard']},strum:{type:'string'},sections:{type:'array',items:{type:'object',additionalProperties:false,properties:{name:{type:'string'},chords:{type:'array',items:{type:'string'}}},required:['name','chords']}}},required:['title','artist','key','bpm','capo','difficulty','strum','sections']};

function textFromResponse(data:any){
  if(typeof data?.output_text==='string'&&data.output_text.trim())return data.output_text;
  const parts=data?.output?.flatMap((item:any)=>item?.content||[])||[];
  const textPart=parts.find((p:any)=>p?.type==='output_text'&&typeof p?.text==='string')||parts.find((p:any)=>typeof p?.text==='string');
  return typeof textPart?.text==='string'?textPart.text:'';
}

export default async function handler(req:RequestLike,res:ResponseLike){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  if(req.method==='OPTIONS')return res.status(204).json({});
  const apiKey=process.env.OPENAI_API_KEY;
  if(req.method==='GET')return res.status(apiKey?200:503).json({ok:Boolean(apiKey),service:'FreeScore AI',openaiKeyConfigured:Boolean(apiKey),message:apiKey?'AI backend is configured and reachable.':'OPENAI_API_KEY is not configured in this Vercel environment.'});
  if(req.method!=='POST')return res.status(405).json({error:'POST required'});
  if(!apiKey)return res.status(503).json({error:'OPENAI_API_KEY is not configured'});
  const body=(req.body||{}) as {query?:string;artist?:string;genre?:string;difficulty?:string};
  const query=String(body.query||'').trim();
  if(!query)return res.status(400).json({error:'Song query is required'});
  const artist=String(body.artist||'').trim();
  const genre=String(body.genre||'Pop');
  const difficulty=body.difficulty==='Standard'?'Standard':'Easy';
  const instructions=`You are FreeScore AI, a guitar-arrangement assistant. Create a useful chord chart for the requested song using your musical knowledge. Return only the structured arrangement requested by the schema. Do not reproduce copyrighted lyrics, tabs, sheet music, or other protected text. Chords and short section labels are okay. Never invent or output copyrighted lyrics. Prefer common playable open/standard guitar chords and a practical capo. Build 5-8 clearly named sections such as Intro, Verse, Pre-Chorus, Chorus, Bridge, and Outro when musically appropriate. Give a concise strumming pattern. The requested difficulty is ${difficulty}; Easy means fewer chord changes and beginner-friendly shapes, Standard can use richer but still practical changes. The result is a practice arrangement, not an official transcription. Be musically plausible and concise.`;
  const user=`Song query: ${query}\nArtist if known: ${artist||'unknown'}\nGenre hint: ${genre}\nDifficulty: ${difficulty}`;
  try{
    const openai=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},body:JSON.stringify({model:'gpt-5.6-luna',reasoning:{effort:'none'},store:false,instructions,input:user,text:{format:{type:'json_schema',name:'freescore_arrangement',strict:true,schema}},max_output_tokens:2200})});
    const data=await openai.json();
    if(!openai.ok)return res.status(502).json({error:'OpenAI request failed',status:openai.status,detail:data?.error?.message||data?.error?.code||'Unknown OpenAI error'});
    if(data?.status&&data.status!=='completed')return res.status(502).json({error:'OpenAI did not complete the arrangement',status:data.status,detail:data?.incomplete_details?.reason||data?.error?.message||'No completion returned'});
    if(data?.error)return res.status(502).json({error:'OpenAI returned an error',detail:data.error.message||'Unknown OpenAI error'});
    const text=textFromResponse(data);
    if(!text)return res.status(502).json({error:'OpenAI returned no arrangement',detail:'The response contained no structured output.'});
    let arrangement:any;
    try{arrangement=JSON.parse(text)}catch{ return res.status(502).json({error:'OpenAI returned invalid arrangement JSON',detail:text.slice(0,300)}) }
    if(!arrangement?.title||!Array.isArray(arrangement?.sections))return res.status(502).json({error:'OpenAI returned an invalid arrangement',detail:'Missing title or sections.'});
    return res.status(200).json(arrangement);
  }catch(error){
    return res.status(500).json({error:'AI arrangement failed',detail:error instanceof Error?error.message:'Unknown error'});
  }
}
