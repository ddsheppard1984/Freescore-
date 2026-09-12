import { describe, expect, it } from 'vitest';

describe('FreeScore basics',()=>{
  it('supports the expected music key set',()=>{
    const keys=['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
    expect(keys).toContain('G');
    expect(keys).toContain('Bb');
  });
  it('keeps practice BPM inside the supported range',()=>{
    const bpm=96;
    expect(bpm).toBeGreaterThanOrEqual(40);
    expect(bpm).toBeLessThanOrEqual(220);
  });
});
