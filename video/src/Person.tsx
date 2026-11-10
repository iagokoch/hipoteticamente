import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export type Emotion = 'neutral' | 'happy' | 'shocked' | 'sad' | 'scared' | 'smirk' | 'worried';
export type Hair = 'short' | 'bun' | 'bald' | 'spiky' | 'long';
export type Hat = 'none' | 'cap' | 'helmet' | 'fedora';

export type PersonProps = {
  x: number; // center x in canvas px
  y: number; // feet y in canvas px
  scale?: number;
  skin?: string;
  hairColor?: string;
  hair?: Hair;
  hat?: Hat;
  hatColor?: string;
  shirt?: string;
  pants?: string;
  suit?: boolean;
  tie?: string;
  apron?: boolean;
  mustache?: boolean;
  shades?: boolean;
  emotion?: Emotion;
  lookX?: number; // -1..1
  lookY?: number;
  talking?: boolean;
  bob?: boolean;
  flip?: boolean;
  tag?: {value: number | null; at?: number; size?: number; hidden?: boolean; glitch?: boolean};
  enterAt?: number;
  dim?: number;
};

const INK = '#1b1b2f';

export const brl = (v: number) =>
  (v < 0 ? '-' : '') +
  new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(Math.abs(v)).replace(/ /g, ' ');

export const BalanceTag: React.FC<{value: number | null; at: number; size: number; glitch?: boolean}> = ({value, at, size, glitch}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - at, fps, config: {damping: 11, stiffness: 160}});
  const count = interpolate(frame - at, [0, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const eased = 1 - Math.pow(1 - count, 3);
  let text = '???';
  let bg = '#5b5b7a';
  if (value !== null) {
    const shown = Math.round(value * eased * 100) / 100;
    text = brl(shown);
    bg = value < 0 ? '#ff4757' : value < 1000 ? '#f6b93b' : '#20bf6b';
  }
  if (glitch) {
    text = frame % 10 < 5 ? 'R$ ---' : '';
    bg = '#2f3542';
  }
  const shake = value !== null && value < 0 && count >= 1 ? Math.sin(frame * 1.7) * 3 : 0;
  if (frame < at) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '100%',
        transform: `translate(-50%, ${-10 + (1 - p) * 30}px) scale(${p}) translateX(${shake}px)`,
        background: bg,
        color: 'white',
        fontFamily: 'Inter',
        fontWeight: 900,
        fontSize: size,
        padding: `${size * 0.22}px ${size * 0.45}px`,
        borderRadius: size * 0.6,
        border: `${Math.max(3, size * 0.1)}px solid ${INK}`,
        whiteSpace: 'nowrap',
        boxShadow: `0 ${size * 0.15}px 0 ${INK}`,
        opacity: text === '' ? 0 : 1,
        letterSpacing: -0.5,
      }}
    >
      {text}
    </div>
  );
};

export const Person: React.FC<PersonProps> = (props) => {
  const {
    x, y, scale = 1, skin = '#f2c29b', hairColor = '#3d2b1f', hair = 'short', hat = 'none', hatColor = '#e84118',
    shirt = '#2ecc71', pants = '#34495e', suit, tie, apron, mustache, shades, emotion = 'neutral', lookX = 0, lookY = 0,
    talking, bob = true, flip, tag, enterAt = 0, dim = 0,
  } = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - enterAt, fps, config: {damping: 14}});
  if (frame < enterAt) return null;
  const W = 200 * scale;
  const H = 360 * scale;
  const bobY = bob ? Math.sin((frame + x) / 9) * 3 : 0;
  const blink = (frame + Math.round(x)) % 95 < 4;

  // eyes
  let eyeRy = 21, eyeRx = 17, pupil = 8;
  if (emotion === 'shocked' || emotion === 'scared') { eyeRy = 26; eyeRx = 19; pupil = 6; }
  if (emotion === 'happy') { eyeRy = 15; }
  if (emotion === 'smirk') { eyeRy = 14; }
  if (blink) eyeRy = 2;

  // brows
  const browL = {neutral: [0, 0], happy: [-4, -4], shocked: [-12, -12], sad: [4, -6], scared: [-8, -14], smirk: [2, -6], worried: [6, -8]}[emotion];
  // [outer y offset, inner y offset]

  // mouth
  const talk = talking ? Math.abs(Math.sin(frame * 0.9)) : 0;
  let mouth: React.ReactNode;
  if (talking) {
    mouth = <ellipse cx={100} cy={142} rx={14} ry={3 + talk * 11} fill="#7a1f2b" stroke={INK} strokeWidth={4} />;
  } else if (emotion === 'happy') {
    mouth = <path d="M78,134 Q100,160 122,134 Z" fill="#7a1f2b" stroke={INK} strokeWidth={4} strokeLinejoin="round" />;
  } else if (emotion === 'shocked' || emotion === 'scared') {
    mouth = <ellipse cx={100} cy={145} rx={11} ry={15} fill="#7a1f2b" stroke={INK} strokeWidth={4} />;
  } else if (emotion === 'sad' || emotion === 'worried') {
    mouth = <path d="M84,148 Q100,134 116,148" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />;
  } else if (emotion === 'smirk') {
    mouth = <path d="M84,142 Q104,150 120,134" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />;
  } else {
    mouth = <path d="M86,142 L114,142" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />;
  }

  const px = lookX * 6, py = lookY * 6;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - W / 2,
        top: y - H + bobY,
        width: W,
        height: H,
        transform: `scale(${0.6 + 0.4 * enter})`,
        transformOrigin: '50% 100%',
        opacity: enter,
        filter: dim ? `brightness(${1 - dim})` : undefined,
      }}
    >
      {tag && !tag.hidden ? (
        <div style={{position: 'absolute', left: '50%', top: H * 0.02, width: 0, height: 0}}>
          <BalanceTag value={tag.value} at={tag.at ?? enterAt + 8} size={(tag.size ?? 44) * Math.max(0.7, scale)} glitch={tag.glitch} />
        </div>
      ) : null}
      <svg viewBox="0 0 200 360" width={W} height={H} style={{overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
        {/* shadow */}
        <ellipse cx={100} cy={352} rx={60} ry={9} fill="rgba(0,0,0,0.18)" />
        {/* legs */}
        <rect x={70} y={285} width={26} height={60} rx={8} fill={suit ? '#22223b' : pants} stroke={INK} strokeWidth={5} />
        <rect x={104} y={285} width={26} height={60} rx={8} fill={suit ? '#22223b' : pants} stroke={INK} strokeWidth={5} />
        <ellipse cx={80} cy={346} rx={20} ry={9} fill={INK} />
        <ellipse cx={120} cy={346} rx={20} ry={9} fill={INK} />
        {/* arms */}
        <rect x={30} y={185} width={28} height={92} rx={14} fill={suit ? '#2b2d42' : shirt} stroke={INK} strokeWidth={5} />
        <rect x={142} y={185} width={28} height={92} rx={14} fill={suit ? '#2b2d42' : shirt} stroke={INK} strokeWidth={5} />
        <circle cx={44} cy={282} r={12} fill={skin} stroke={INK} strokeWidth={5} />
        <circle cx={156} cy={282} r={12} fill={skin} stroke={INK} strokeWidth={5} />
        {/* torso */}
        <path d="M50,295 Q46,196 100,172 Q154,196 150,295 Z" fill={suit ? '#2b2d42' : shirt} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        {suit ? <path d="M84,180 L100,232 L116,180 Z" fill="#f5f6fa" stroke={INK} strokeWidth={4} /> : null}
        {tie ? <path d="M100,186 L92,200 L100,250 L108,200 Z" fill={tie} stroke={INK} strokeWidth={4} strokeLinejoin="round" /> : null}
        {apron ? <path d="M68,205 L132,205 L136,292 L64,292 Z" fill="#f5f6fa" stroke={INK} strokeWidth={4} strokeLinejoin="round" /> : null}
        {/* neck */}
        <rect x={88} y={156} width={24} height={22} fill={skin} stroke={INK} strokeWidth={5} />
        {/* hair back (long) */}
        {hair === 'long' ? <path d="M30,95 Q28,190 60,200 L140,200 Q172,190 170,95 Z" fill={hairColor} stroke={INK} strokeWidth={5} /> : null}
        {hair === 'bun' ? <circle cx={100} cy={22} r={26} fill={hairColor} stroke={INK} strokeWidth={5} /> : null}
        {/* head */}
        <circle cx={100} cy={95} r={72} fill={skin} stroke={INK} strokeWidth={5} />
        {/* hair front */}
        {hair === 'short' ? <path d="M30,88 Q34,22 100,22 Q166,22 170,88 Q150,54 112,60 Q86,48 60,62 Q40,70 30,88 Z" fill={hairColor} stroke={INK} strokeWidth={5} strokeLinejoin="round" /> : null}
        {hair === 'spiky' ? <path d="M30,90 L36,40 L58,56 L66,20 L88,46 L104,14 L118,46 L140,22 L146,56 L166,42 L170,90 Q140,60 100,64 Q60,60 30,90 Z" fill={hairColor} stroke={INK} strokeWidth={5} strokeLinejoin="round" /> : null}
        {hair === 'bun' || hair === 'long' ? <path d="M30,92 Q30,24 100,24 Q170,24 170,92 Q150,50 100,52 Q50,50 30,92 Z" fill={hairColor} stroke={INK} strokeWidth={5} strokeLinejoin="round" /> : null}
        {/* hats */}
        {hat === 'cap' ? (<g><path d="M32,72 Q36,18 100,18 Q164,18 168,72 Z" fill={hatColor} stroke={INK} strokeWidth={5} /><path d="M96,68 L190,66 Q192,80 168,80 L96,76 Z" fill={hatColor} stroke={INK} strokeWidth={5} /></g>) : null}
        {hat === 'helmet' ? (<g><path d="M24,92 Q24,14 100,14 Q176,14 176,92 Z" fill={hatColor} stroke={INK} strokeWidth={5} /><rect x={40} y={60} width={120} height={12} rx={6} fill="#ffffff" opacity={0.6} /></g>) : null}
        {hat === 'fedora' ? (<g><ellipse cx={100} cy={46} rx={98} ry={16} fill={hatColor} stroke={INK} strokeWidth={5} /><path d="M46,46 Q50,-8 100,-6 Q150,-8 154,46 Z" fill={hatColor} stroke={INK} strokeWidth={5} /><rect x={48} y={30} width={104} height={10} fill="#111" /></g>) : null}
        {/* brows */}
        {browL ? (
          <g stroke={INK} strokeWidth={6} strokeLinecap="round">
            <line x1={58} y1={66 + browL[0]} x2={88} y2={66 + browL[1]} />
            <line x1={112} y1={66 + browL[1]} x2={142} y2={66 + browL[0]} />
          </g>
        ) : null}
        {/* eyes */}
        {shades ? (
          <g>
            <rect x={52} y={80} width={44} height={28} rx={8} fill="#111" stroke={INK} strokeWidth={4} />
            <rect x={104} y={80} width={44} height={28} rx={8} fill="#111" stroke={INK} strokeWidth={4} />
            <line x1={96} y1={90} x2={104} y2={90} stroke={INK} strokeWidth={4} />
            <rect x={58} y={84} width={12} height={5} rx={2} fill="#fff" opacity={0.6} />
            <rect x={110} y={84} width={12} height={5} rx={2} fill="#fff" opacity={0.6} />
          </g>
        ) : (
          <g>
            <ellipse cx={74} cy={96} rx={eyeRx} ry={eyeRy} fill="#fff" stroke={INK} strokeWidth={4} />
            <ellipse cx={126} cy={96} rx={eyeRx} ry={eyeRy} fill="#fff" stroke={INK} strokeWidth={4} />
            {!blink ? (
              <g fill={INK}>
                <circle cx={74 + px} cy={98 + py} r={pupil} />
                <circle cx={126 + px} cy={98 + py} r={pupil} />
                <circle cx={71 + px} cy={94 + py} r={2.5} fill="#fff" />
                <circle cx={123 + px} cy={94 + py} r={2.5} fill="#fff" />
              </g>
            ) : null}
          </g>
        )}
        {/* nose & cheeks */}
        <path d="M98,112 Q104,120 96,124" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
        {emotion === 'happy' ? (<g fill="#ff8a8a" opacity={0.5}><circle cx={56} cy={124} r={10} /><circle cx={144} cy={124} r={10} /></g>) : null}
        {mustache ? <path d="M74,132 Q88,122 100,130 Q112,122 126,132 Q112,140 100,134 Q88,140 74,132 Z" fill="#dfe4ea" stroke={INK} strokeWidth={4} /> : null}
        {mouth}
        {emotion === 'scared' || emotion === 'worried' ? <path d="M160,60 Q168,76 160,82 Q152,76 160,60 Z" fill="#74b9ff" stroke={INK} strokeWidth={3} /> : null}
      </svg>
    </div>
  );
};
