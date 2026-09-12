export type MusicBrainzResult={id:string;title:string;artist:string;date?:string;url:string};
export async function searchMusicBrainz(term:string):Promise<MusicBrainzResult[]>{
  if(!term.trim()) return [];
  const q=encodeURIComponent(term.trim());
  const res=await fetch(`https://musicbrainz.org/ws/2/recording/?query=${q}&fmt=json&limit=10`,{headers:{Accept:'application/json'}});
  if(!res.ok) throw new Error(`Music metadata search failed: ${res.status}`);
  const data=await res.json() as any;
  return (data.recordings??[]).map((r:any)=>({id:r.id,title:r.title,artist:(r['artist-credit']??[]).map((a:any)=>a.name).join(', '),date:r['first-release-date'],url:`https://musicbrainz.org/recording/${r.id}`}));
}
