import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import manifest from '../public/manifest.json';
import {SCENES} from './Scenes';

export const FPS = 30;
export const GAP = 0.3; // seconds of breathing room after each line
const TAIL = 1.2;

type Scene = {id: string; visual: string; text: string; audio: string; duration: number};
const scenes = (manifest as {scenes: Scene[]}).scenes;

export const timeline = (() => {
  let from = 0;
  return scenes.map((s, i) => {
    const len = Math.ceil((s.duration + GAP + (i === scenes.length - 1 ? TAIL : 0)) * FPS);
    const item = {...s, from, len, speechFrames: Math.ceil(s.duration * FPS)};
    from += len;
    return item;
  });
})();
export const TOTAL = timeline.reduce((a, s) => a + s.len, 0);

const Captions: React.FC<{text: string; speechFrames: number}> = ({text, speechFrames}) => {
  const frame = useCurrentFrame();
  const words = text.split(/\s+/).filter(Boolean);
  const weights = words.map((w) => w.replace(/[^\p{L}\p{N}]/gu, '').length + 2 + (/[.,?!…:]$/.test(w) ? 4 : 0));
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  const starts = weights.map((w) => {
    const s = (acc / total) * speechFrames;
    acc += w;
    return s;
  });
  let current = 0;
  for (let i = 0; i < words.length; i++) if (frame >= starts[i]) current = i;
  // chunk words into groups of up to 3, break after punctuation
  const chunks: number[][] = [];
  let c: number[] = [];
  words.forEach((w, i) => {
    c.push(i);
    if (c.length === 3 || /[.,?!…:]$/.test(w)) {
      chunks.push(c);
      c = [];
    }
  });
  if (c.length) chunks.push(c);
  const chunk = chunks.find((ch) => ch.includes(current)) ?? chunks[0];
  const chunkStart = starts[chunk[0]];
  const {fps} = useVideoConfig();
  const pop = spring({frame: frame - chunkStart, fps, config: {damping: 12, stiffness: 220}});
  if (frame > speechFrames + 6) return null;
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: 1250, textAlign: 'center', transform: `scale(${0.85 + 0.15 * pop})`}}>
      {chunk.map((i) => (
        <span key={i} style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 92, lineHeight: 1.15, color: i === current ? '#fed330' : '#ffffff', WebkitTextStroke: '14px #111', paintOrder: 'stroke fill', textTransform: 'uppercase', margin: '0 12px', display: 'inline-block'}}>
          {words[i].replace(/\.\.\.$/, '…')}
        </span>
      ))}
    </div>
  );
};

const SceneWrap: React.FC<{len: number; children: React.ReactNode}> = ({len, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const punch = spring({frame, fps, config: {damping: 16, stiffness: 180}});
  const push = interpolate(frame, [0, len], [1, 1.06]);
  const scale = (1.12 - 0.12 * punch) * push;
  return <AbsoluteFill style={{transform: `scale(${scale})`, overflow: 'hidden'}}>{children}</AbsoluteFill>;
};

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile('audio/music.wav')} volume={0.09} />
      {timeline.map((s) => {
        const Comp = SCENES[s.visual];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.len}>
            <SceneWrap len={s.len}>
              <Comp />
            </SceneWrap>
            <Captions text={s.text} speechFrames={s.speechFrames} />
            <Sequence from={2}>
              <Audio src={staticFile(s.audio)} volume={1} />
            </Sequence>
            <Sequence durationInFrames={12}>
              <Audio src={staticFile('audio/whoosh.wav')} volume={0.35} />
            </Sequence>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
