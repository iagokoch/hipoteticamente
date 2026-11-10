import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Audio, Sequence, staticFile} from 'remotion';

export const INK = '#1b1b2f';
export const ME = {skin: '#f2c29b', hair: 'short' as const, hairColor: '#3d2b1f', shirt: '#26de81', pants: '#3867d6'};

export const Pop: React.FC<{at: number}> = ({at}) => (
  <Sequence from={at} durationInFrames={10}>
    <Audio src={staticFile('audio/pop.wav')} volume={0.5} />
  </Sequence>
);

export const Floor: React.FC<{color: string; y?: number}> = ({color, y = 1180}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, bottom: 0, background: color, borderTop: `8px solid ${INK}`}} />
);

export const Title: React.FC<{text: string; color?: string; top?: number; size?: number; at?: number}> = ({text, color = '#fff', top = 170, size = 92, at = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - at, fps, config: {damping: 12}});
  return (
    <div style={{position: 'absolute', top, left: 60, right: 60, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: size, lineHeight: 1.05, color, transform: `scale(${p})`, WebkitTextStroke: `10px ${INK}`, paintOrder: 'stroke fill', letterSpacing: -1}}>
      {text}
    </div>
  );
};

// ---------- backgrounds ----------
export const Street: React.FC<{night?: boolean}> = ({night}) => {
  const sky = night ? '#1e2a4a' : '#7ed6df';
  const b = night ? ['#2f3b5c', '#27324f', '#34416a', '#2a3556'] : ['#f8c291', '#e58e26', '#b8e994', '#82ccdd'];
  return (
    <AbsoluteFill style={{background: sky}}>
      {night ? <div style={{position: 'absolute', left: 820, top: 160, width: 120, height: 120, borderRadius: 60, background: '#f5f6fa', border: `6px solid ${INK}`}} /> : <div style={{position: 'absolute', left: 800, top: 140, width: 150, height: 150, borderRadius: 75, background: '#fed330', border: `6px solid ${INK}`}} />}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{position: 'absolute', left: -20 + i * 280, top: 420 + (i % 2) * 120, width: 260, height: 900, background: b[i], border: `7px solid ${INK}`, borderRadius: 10}}>
          {Array.from({length: 8}).map((_, j) => (
            <div key={j} style={{position: 'absolute', left: 40 + (j % 2) * 110, top: 50 + Math.floor(j / 2) * 130, width: 70, height: 80, background: night ? (j % 3 === 0 ? '#fed330' : '#1b2440') : '#dff9fb', border: `5px solid ${INK}`, borderRadius: 6}} />
          ))}
        </div>
      ))}
      <Floor color={night ? '#3d3d5c' : '#a4b0be'} y={1180} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1260, height: 24, background: night ? '#57577a' : '#ced6e0'}} />
    </AbsoluteFill>
  );
};

export const Room: React.FC<{wall: string; floor: string}> = ({wall, floor}) => (
  <AbsoluteFill style={{background: wall}}>
    <Floor color={floor} y={1180} />
  </AbsoluteFill>
);

export const MOM = {skin: '#f2c29b', hair: 'bun' as const, hairColor: '#5d4037', shirt: '#fa8231', apron: true};
export const STRANGER = {suit: true, tie: '#2d3436', hat: 'fedora' as const, hatColor: '#2d3436', skin: '#d1ccc0', hair: 'bald' as const};

export const Sting: React.FC<{at: number; volume?: number}> = ({at, volume = 0.6}) => (
  <Sequence from={at} durationInFrames={40}>
    <Audio src={staticFile('audio/sting.wav')} volume={volume} />
  </Sequence>
);

export const Flash: React.FC<{at?: number; len?: number}> = ({at = 0, len = 6}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - at, [0, 1, len], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: '#fff', opacity: o, pointerEvents: 'none'}} />;
};

