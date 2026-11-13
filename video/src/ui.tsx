import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {INK, Room} from './lib';

// Componentes visuais compartilhados pelos episódios 13+ (os anteriores têm cópias locais).
export const FONT = 'Inter';
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export const Stamp: React.FC<{x: number; y: number; text: string; at: number; color?: string; size?: number; rot?: number}> = ({x, y, text, at, color = '#ff4757', size = 54, rot = -8}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 9, stiffness: 260}});
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.2 - 1.2 * p})`, opacity: Math.min(1, p * 1.5), fontFamily: FONT, fontWeight: 900, fontSize: size, color: '#fff', background: color, border: `7px solid ${INK}`, borderRadius: 14, padding: '6px 22px', whiteSpace: 'nowrap', boxShadow: `0 8px 0 ${INK}`}}>
      {text}
    </div>
  );
};

export const Bubble: React.FC<{x: number; y: number; text: string; at: number; w?: number; size?: number; tail?: 'left' | 'right' | 'center'}> = ({x, y, text, at, w = 520, size = 58, tail = 'center'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 11, stiffness: 200}});
  const tx = tail === 'left' ? w * 0.22 : tail === 'right' ? w * 0.78 : w / 2;
  return (
    <div style={{position: 'absolute', left: x - tx, top: y, width: w, transform: `scale(${p})`, transformOrigin: `${tx}px 100%`}}>
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', border: `8px solid ${INK}`, borderRadius: 40, padding: '22px 30px', fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.08, color: INK, textAlign: 'center', boxShadow: `0 10px 0 ${INK}`}}>
        {text}
        <div style={{position: 'absolute', left: tx - 22, bottom: -42, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: `40px solid ${INK}`}} />
        <div style={{position: 'absolute', left: tx - 13, bottom: -26, width: 0, height: 0, borderLeft: '13px solid transparent', borderRight: '13px solid transparent', borderTop: '26px solid #fff'}} />
      </div>
    </div>
  );
};

export const Thought: React.FC<{x: number; y: number; text: string; at: number; w?: number; size?: number; color?: string}> = ({x, y, text, at, w = 560, size = 52, color = '#e8f4ff'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 11, stiffness: 190}});
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, transform: `scale(${p})`, transformOrigin: '50% 100%'}}>
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: color, border: `8px solid ${INK}`, borderRadius: 70, padding: '24px 34px', fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.08, color: INK, textAlign: 'center', boxShadow: `0 10px 0 ${INK}`}}>
        {text}
        <div style={{position: 'absolute', left: w / 2 - 20, bottom: -52, width: 40, height: 40, borderRadius: 20, background: color, border: `7px solid ${INK}`}} />
        <div style={{position: 'absolute', left: w / 2 - 6, bottom: -86, width: 20, height: 20, borderRadius: 10, background: color, border: `6px solid ${INK}`}} />
      </div>
    </div>
  );
};

export const Big: React.FC<{x: number; y: number; e: string; s?: number; rot?: number; at?: number}> = ({x, y, e, s = 1, rot = 0, at = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 10, stiffness: 200}});
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,0) rotate(${rot}deg) scale(${p})`, fontSize: 200 * s, lineHeight: 1, filter: 'drop-shadow(0 8px 0 rgba(27,27,47,0.5))'}}>{e}</div>
  );
};

export const DayTag: React.FC<{text: string; y?: number; color?: string}> = ({text, y = 150, color = '#2f3542'}) => <Stamp x={540} y={y} text={text} at={0} color={color} size={62} rot={-3} />;

export const Cap: React.FC<{text: string; top?: number}> = ({text, top = 1680}) => (
  <div style={{position: 'absolute', top, left: 60, right: 60, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 32, color: '#a4b0be'}}>{text}</div>
);

// bolinha numerada (Mega-Sena, placar etc.)
export const Ball: React.FC<{x: number; y: number; n: string; at: number; size?: number; color?: string}> = ({x, y, n, at, size = 120, color = '#20bf6b'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 8, stiffness: 220}});
  return (
    <div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: '50%', background: color, border: `7px solid ${INK}`, boxShadow: `0 8px 0 ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: size * 0.46, color: '#fff', transform: `scale(${p})`}}>{n}</div>
  );
};

export const SimNao: React.FC<{top?: number}> = ({top = 620}) => (
  <>
    <div style={{position: 'absolute', left: 120, top, width: 380, height: 130, borderRadius: 40, background: '#20bf6b', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 70, color: '#fff'}}>SIM</div>
    <div style={{position: 'absolute', left: 580, top, width: 380, height: 130, borderRadius: 40, background: '#ff4757', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 70, color: '#fff'}}>NÃO</div>
  </>
);

export const Handle: React.FC<{top?: number}> = ({top = 1470}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 140, right: 140, top, height: 110, borderRadius: 55, background: '#fed330', border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: INK, transform: `scale(${1 + Math.sin(frame / 5) * 0.03})`}}>@hipoteticamente.br</div>
  );
};

// nuvem de chuva/azar: fica em cima de alguém e chove só ali
export const Cloud: React.FC<{x: number; y: number; scale?: number; color?: string; rain?: boolean; bolt?: boolean; at?: number}> = ({x, y, scale = 1, color = '#576574', rain = true, bolt = true, at = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 12, stiffness: 160}});
  const sway = Math.sin(frame / 8) * 8;
  return (
    <div style={{position: 'absolute', left: x - 200 * scale + sway, top: y, width: 400 * scale, height: 400 * scale, transform: `scale(${p})`, transformOrigin: '50% 30%'}}>
      <svg viewBox="0 0 400 400" width={400 * scale} height={400 * scale} style={{overflow: 'visible'}}>
        <g fill={color} stroke={INK} strokeWidth={8} strokeLinejoin="round">
          <circle cx={130} cy={110} r={64} /><circle cx={210} cy={80} r={78} /><circle cx={290} cy={115} r={60} />
          <rect x={80} y={110} width={260} height={64} rx={32} />
        </g>
        <g fill={color}><circle cx={130} cy={110} r={58} /><circle cx={210} cy={80} r={72} /><circle cx={290} cy={115} r={54} /><rect x={86} y={116} width={248} height={52} rx={26} /></g>
        {rain ? [0, 1, 2, 3, 4, 5].map((i) => {
          const t = ((frame * 7 + i * 37) % 200);
          return <line key={i} x1={100 + i * 40} y1={180 + t} x2={92 + i * 40} y2={206 + t} stroke="#74b9ff" strokeWidth={8} strokeLinecap="round" opacity={t > 160 ? 0 : 1} />;
        }) : null}
        {bolt && frame % 40 < 8 ? <path d="M200,150 L170,230 L206,226 L180,310 L250,206 L212,210 L236,150 Z" fill="#fed330" stroke={INK} strokeWidth={6} strokeLinejoin="round" /> : null}
      </svg>
    </div>
  );
};

export const Scene: React.FC<{wall: string; floor: string; children?: React.ReactNode}> = ({wall, floor, children}) => (
  <AbsoluteFill>
    <Room wall={wall} floor={floor} />
    {children}
  </AbsoluteFill>
);

export {interpolate};
