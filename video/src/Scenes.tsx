import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Person} from './Person';
import {INK, ME, MOM, Pop, Sting, Floor, Title, Room, Street} from './lib';

// Ep. 07 — "E se você ouvisse o pensamento de todo mundo?" (tema #15)
// Regra nova (11/11/2026): fato real curto como âncora (cena 2), resto escala para o absurdo,
// e termina com 3 caminhos (A/B/C) para os comentários escolherem a Parte 2.

// ---------- elenco ----------
const DRIVER = {skin: '#e0ac69', hair: 'short' as const, hairColor: '#2d3436', hat: 'cap' as const, hatColor: '#0984e3', mustache: true, shirt: '#74b9ff', pants: '#2d3436'};
const TIAO = {skin: '#f2c29b', hair: 'bald' as const, mustache: true, shirt: '#e17055', pants: '#2d3436'};
const GIRL = {skin: '#8d5524', hair: 'long' as const, hairColor: '#1e1e1e', shirt: '#a29bfe', pants: '#2d3436'};
const GUY = {skin: '#f2c29b', hair: 'spiky' as const, hairColor: '#b33939', shirt: '#fab1a0', pants: '#4b4b4b'};
const BOSS = {skin: '#e0ac69', hair: 'short' as const, hairColor: '#2d3436', suit: true, tie: '#c0392b'};
const OLDMAN = {skin: '#f2c29b', hair: 'bald' as const, mustache: true, hat: 'fedora' as const, hatColor: '#636e72', shirt: '#b2bec3', pants: '#2d3436'};

const PURPLE = '#efe7ff';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const brNum = (n: number) => n.toLocaleString('pt-BR');

// ---------- peças ----------
const Stamp: React.FC<{x: number; y: number; text: string; at: number; color?: string; size?: number; rot?: number}> = ({x, y, text, at, color = '#ff4757', size = 54, rot = -8}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 9, stiffness: 260}});
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.2 - 1.2 * p})`, opacity: Math.min(1, p * 1.5), fontFamily: 'Inter', fontWeight: 900, fontSize: size, color: '#fff', background: color, border: `7px solid ${INK}`, borderRadius: 14, padding: '6px 22px', whiteSpace: 'nowrap', boxShadow: `0 8px 0 ${INK}`}}>
      {text}
    </div>
  );
};

// balão de fala (branco)
const Bubble: React.FC<{x: number; y: number; text: string; at: number; w?: number; size?: number; tail?: 'left' | 'right' | 'center'}> = ({x, y, text, at, w = 520, size = 58, tail = 'center'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 11, stiffness: 200}});
  const tx = tail === 'left' ? w * 0.22 : tail === 'right' ? w * 0.78 : w / 2;
  return (
    <div style={{position: 'absolute', left: x - tx, top: y, width: w, transform: `scale(${p})`, transformOrigin: `${tx}px 100%`}}>
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', border: `8px solid ${INK}`, borderRadius: 40, padding: '22px 30px', fontFamily: 'Inter', fontWeight: 900, fontSize: size, lineHeight: 1.08, color: INK, textAlign: 'center', boxShadow: `0 10px 0 ${INK}`}}>
        {text}
        <div style={{position: 'absolute', left: tx - 22, bottom: -42, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: `40px solid ${INK}`}} />
        <div style={{position: 'absolute', left: tx - 13, bottom: -26, width: 0, height: 0, borderLeft: '13px solid transparent', borderRight: '13px solid transparent', borderTop: '26px solid #fff'}} />
      </div>
    </div>
  );
};

// nuvem de pensamento (roxa, com bolinhas) — (x, y) = topo/centro da nuvem
const Think: React.FC<{x: number; y: number; at: number; w?: number; size?: number; text?: string; color?: string; tail?: 'left' | 'center' | 'right' | 'none'; rot?: number; children?: React.ReactNode}> = ({x, y, at, w = 420, size = 48, text, color = PURPLE, tail = 'center', rot = 0, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 11, stiffness: 200}});
  const tx = tail === 'left' ? w * 0.25 : tail === 'right' ? w * 0.75 : w / 2;
  const float = Math.sin((frame + x) / 14) * 4;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y + float, width: w, transform: `scale(${p}) rotate(${rot}deg)`, transformOrigin: `${tx}px 100%`}}>
      <div style={{background: color, border: `8px solid ${INK}`, borderRadius: 64, padding: '16px 24px', fontFamily: 'Inter', fontWeight: 900, fontSize: size, lineHeight: 1.05, color: INK, textAlign: 'center', boxShadow: `0 8px 0 ${INK}`}}>
        {text}
        {children}
      </div>
      {tail !== 'none' ? (
        <>
          <div style={{position: 'absolute', left: tx - 20, bottom: -52, width: 40, height: 40, borderRadius: 20, background: color, border: `7px solid ${INK}`}} />
          <div style={{position: 'absolute', left: tx - 6 + (tail === 'left' ? -14 : tail === 'right' ? 14 : 0), bottom: -86, width: 22, height: 22, borderRadius: 11, background: color, border: `6px solid ${INK}`}} />
        </>
      ) : null}
    </div>
  );
};

const Dummy: React.FC<{x: number; y: number; color?: string; s?: number}> = ({x, y, color = '#dfe4ea', s = 1}) => (
  <div style={{position: 'absolute', left: x - 30 * s, top: y, width: 60 * s, height: 100 * s}}>
    <div style={{position: 'absolute', left: 12 * s, top: 0, width: 36 * s, height: 36 * s, borderRadius: '50%', background: color, border: `${4 * s}px solid ${INK}`}} />
    <div style={{position: 'absolute', left: 0, top: 40 * s, width: 60 * s, height: 60 * s, borderRadius: `${24 * s}px ${24 * s}px ${8 * s}px ${8 * s}px`, background: color, border: `${4 * s}px solid ${INK}`}} />
  </div>
);

const Note: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <svg viewBox="0 0 40 60" width={40 * s} height={60 * s} style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, overflow: 'visible'}}>
    <ellipse cx={14} cy={48} rx={12} ry={9} fill={INK} />
    <rect x={23} y={6} width={5} height={42} fill={INK} />
    <path d="M26,6 Q42,12 36,30" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
  </svg>
);

const CheeseBread: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <svg viewBox="0 0 90 90" width={90 * s} height={90 * s} style={{position: 'absolute', left: x - 45 * s, top: y}}>
    <circle cx={45} cy={46} r={36} fill="#f6b93b" stroke={INK} strokeWidth={6} />
    <ellipse cx={34} cy={36} rx={7} ry={5} fill="#fad390" />
    <ellipse cx={56} cy={52} rx={6} ry={4} fill="#fad390" />
    <ellipse cx={40} cy={60} rx={5} ry={4} fill="#fad390" />
  </svg>
);

const Sandwich: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <svg viewBox="0 0 110 70" width={110 * s} height={70 * s} style={{position: 'absolute', left: x - 55 * s, top: y}}>
    <path d="M8,26 Q55,-6 102,26 L98,38 L12,38 Z" fill="#e1b12c" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <rect x={8} y={38} width={94} height={10} rx={4} fill="#44bd32" stroke={INK} strokeWidth={4} />
    <rect x={10} y={48} width={90} height={9} rx={4} fill="#ff6b6b" stroke={INK} strokeWidth={4} />
    <path d="M10,57 L100,57 L96,68 L14,68 Z" fill="#e1b12c" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
  </svg>
);

const Pigeon: React.FC<{x: number; y: number; s?: number; flip?: boolean; peck?: boolean}> = ({x, y, s = 1, flip, peck}) => {
  const frame = useCurrentFrame();
  const dip = peck ? Math.max(0, Math.sin((frame + x) / 4)) * 10 : 0;
  return (
    <svg viewBox="0 0 130 110" width={130 * s} height={110 * s} style={{position: 'absolute', left: x - 65 * s, top: y - 110 * s + dip * s, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
      <line x1={60} y1={86} x2={58} y2={106} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <line x1={78} y1={86} x2={80} y2={106} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <path d="M12,60 Q20,34 62,34 Q110,36 112,66 Q108,92 64,92 Q22,92 12,60 Z" fill="#a4b0be" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M30,56 Q60,48 94,62 Q70,82 38,72 Z" fill="#747d8c" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={104} cy={38} r={22} fill="#a4b0be" stroke={INK} strokeWidth={5} />
      <path d="M92,44 Q106,56 120,46" fill="none" stroke="#6c5ce7" strokeWidth={6} strokeLinecap="round" />
      <path d="M122,32 L142,38 L122,44 Z" fill="#f0932b" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={108} cy={32} r={5} fill="#fff" stroke={INK} strokeWidth={3} />
      <circle cx={109} cy={32} r={2.5} fill={INK} />
    </svg>
  );
};

const Dog: React.FC<{x: number; y: number; s?: number; wag?: number; flip?: boolean}> = ({x, y, s = 1, wag = 0, flip}) => {
  const frame = useCurrentFrame();
  const tail = Math.sin(frame * (0.5 + wag)) * (18 + wag * 20);
  return (
    <svg viewBox="0 0 240 170" width={240 * s} height={170 * s} style={{position: 'absolute', left: x - 120 * s, top: y - 170 * s, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
      <g style={{transformOrigin: '200px 80px', transform: `rotate(${tail}deg)`}}>
        <path d="M196,84 Q236,56 228,32" fill="none" stroke={INK} strokeWidth={16} strokeLinecap="round" />
        <path d="M196,84 Q236,56 228,32" fill="none" stroke="#c8873f" strokeWidth={8} strokeLinecap="round" />
      </g>
      <rect x={70} y={110} width={24} height={50} rx={9} fill="#c8873f" stroke={INK} strokeWidth={5} />
      <rect x={160} y={110} width={24} height={50} rx={9} fill="#c8873f" stroke={INK} strokeWidth={5} />
      <ellipse cx={128} cy={96} rx={76} ry={42} fill="#c8873f" stroke={INK} strokeWidth={5} />
      <rect x={40} y={112} width={24} height={48} rx={9} fill="#c8873f" stroke={INK} strokeWidth={5} />
      <rect x={130} y={112} width={24} height={48} rx={9} fill="#c8873f" stroke={INK} strokeWidth={5} />
      <circle cx={56} cy={62} r={38} fill="#c8873f" stroke={INK} strokeWidth={5} />
      <path d="M28,42 Q8,60 22,92 Q36,84 40,56 Z" fill="#8a5a25" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <ellipse cx={34} cy={78} rx={24} ry={17} fill="#f5cd9b" stroke={INK} strokeWidth={5} />
      <ellipse cx={16} cy={72} rx={8} ry={6} fill={INK} />
      <circle cx={58} cy={52} r={8} fill="#fff" stroke={INK} strokeWidth={4} />
      <circle cx={56} cy={53} r={4} fill={INK} />
      <path d="M26,88 Q36,100 48,88" fill="#ff7675" stroke={INK} strokeWidth={4} />
    </svg>
  );
};

const Letter: React.FC<{letter: string; color: string; at?: number; x?: number; y?: number}> = ({letter, color, at = 0, x = 90, y = 330}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - at, fps, config: {damping: 10, stiffness: 220}});
  if (frame < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 190, height: 190, borderRadius: 95, background: color, border: `10px solid ${INK}`, boxShadow: `0 12px 0 ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 130, color: '#fff', transform: `scale(${p})`}}>
      {letter}
    </div>
  );
};

const Label: React.FC<{text: string; at: number; top?: number}> = ({text, at, top = 350}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 14}});
  return (
    <div style={{position: 'absolute', left: 310, right: 70, top, fontFamily: 'Inter', fontWeight: 900, fontSize: 58, lineHeight: 1.08, color: '#fff', WebkitTextStroke: `9px ${INK}`, paintOrder: 'stroke fill', opacity: p, transform: `translateX(${(1 - p) * 60}px)`}}>
      {text}
    </div>
  );
};

// ---------- cenários ----------
const BusInt: React.FC = () => {
  const frame = useCurrentFrame();
  const off = (frame * 5) % 1800;
  return (
    <AbsoluteFill style={{background: '#dfe6e9'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 230, height: 330, background: '#74b9ff', borderTop: `8px solid ${INK}`, borderBottom: `8px solid ${INK}`, overflow: 'hidden'}}>
        {Array.from({length: 7}).map((_, i) => {
          const left = (((i * 300 - off) % 1800) + 1800) % 1800 - 300;
          const h = 140 + ((i * 53) % 110);
          return <div key={i} style={{position: 'absolute', left, bottom: 0, width: 220, height: h, background: ['#f8c291', '#82ccdd', '#b8e994', '#fad390'][i % 4], border: `6px solid ${INK}`}} />;
        })}
        {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 340 + i * 360 - 5, top: 0, bottom: 0, width: 12, background: INK}} />)}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, height: 20, background: '#b2bec3', borderTop: `5px solid ${INK}`, borderBottom: `5px solid ${INK}`}} />
      {[130, 400, 670, 940].map((x) => (
        <div key={x} style={{position: 'absolute', left: x, top: 660, width: 44, height: 80, border: `8px solid ${INK}`, borderTop: 'none', borderRadius: '0 0 24px 24px'}} />
      ))}
      <Floor color="#636e72" y={1180} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1236, height: 16, background: '#fed330', borderTop: `4px solid ${INK}`, borderBottom: `4px solid ${INK}`}} />
    </AbsoluteFill>
  );
};

const Kitchen: React.FC<{night?: boolean}> = ({night}) => (
  <AbsoluteFill>
    <Room wall={night ? '#3d3d6b' : '#ffeaa7'} floor={night ? '#2c2c54' : '#cc8e35'} />
    <div style={{position: 'absolute', left: 620, top: 260, width: 340, height: 300, background: night ? '#1e2a4a' : '#7ed6df', border: `9px solid ${INK}`, borderRadius: 14}}>
      <div style={{position: 'absolute', left: 156, top: 0, bottom: 0, width: 9, background: INK}} />
      {night ? <div style={{position: 'absolute', left: 220, top: 40, width: 60, height: 60, borderRadius: 30, background: '#f5f6fa', border: `5px solid ${INK}`}} /> : null}
    </div>
    <div style={{position: 'absolute', left: 60, top: 300, width: 460, height: 160, background: night ? '#57577a' : '#f5f6fa', border: `9px solid ${INK}`, borderRadius: 14}} />
  </AbsoluteFill>
);

const Park: React.FC = () => (
  <AbsoluteFill style={{background: '#74b9ff'}}>
    <div style={{position: 'absolute', left: 120, top: 260, width: 220, height: 80, borderRadius: 40, background: '#fff', border: `6px solid ${INK}`}} />
    <div style={{position: 'absolute', left: 760, top: 180, width: 150, height: 150, borderRadius: 75, background: '#fed330', border: `6px solid ${INK}`}} />
    <div style={{position: 'absolute', left: 80, top: 640, width: 70, height: 560, background: '#8d6e63', border: `7px solid ${INK}`}} />
    <div style={{position: 'absolute', left: -60, top: 380, width: 360, height: 360, borderRadius: 180, background: '#44bd32', border: `7px solid ${INK}`}} />
    <Floor color="#78e08f" y={1180} />
    <div style={{position: 'absolute', left: 580, top: 1020, width: 440, height: 24, background: '#a0522d', border: `6px solid ${INK}`}} />
    <div style={{position: 'absolute', left: 580, top: 880, width: 440, height: 24, background: '#a0522d', border: `6px solid ${INK}`}} />
    <div style={{position: 'absolute', left: 600, top: 1020, width: 24, height: 150, background: INK}} />
    <div style={{position: 'absolute', left: 980, top: 1020, width: 24, height: 150, background: INK}} />
  </AbsoluteFill>
);

// ---------- cenas ----------

// s01 — ônibus lotado, o Caio escuta tudo
const Bus: React.FC = () => {
  const frame = useCurrentFrame();
  const clouds = [
    {x: 170, y: 640, t: 'BOLETO', at: 98},
    {x: 400, y: 600, t: 'CALOR', at: 106},
    {x: 700, y: 620, t: 'FERRO?', at: 114},
    {x: 930, y: 660, t: 'FOME', at: 122},
  ];
  return (
    <AbsoluteFill>
      <BusInt />
      <Person {...GIRL} x={170} y={1190} scale={1.2} emotion="neutral" lookY={-0.5} enterAt={0} />
      <Person {...GUY} x={400} y={1170} scale={1.1} emotion="worried" enterAt={4} />
      <Person {...TIAO} x={700} y={1180} scale={1.2} emotion="neutral" lookX={-1} enterAt={8} />
      <Person {...DRIVER} x={930} y={1190} scale={1.2} emotion="sad" enterAt={12} />
      <Person {...ME} x={540} y={1320} scale={1.6} emotion={frame >= 100 ? 'shocked' : 'neutral'} lookX={frame >= 100 ? 0 : 1} />
      {clouds.map((c) => <Think key={c.t} x={c.x} y={c.y} at={c.at} w={250} size={38} text={c.t} />)}
      <Stamp x={540} y={420} text="NINGUÉM FALOU NADA" at={58} color="#2f3542" size={56} rot={-3} />
      <Pop at={58} /><Pop at={98} /><Pop at={106} /><Pop at={114} /><Pop at={122} />
      <Sting at={98} volume={0.35} />
    </AbsoluteFill>
  );
};

// s02 — FATO ÂNCORA: 6.200 pensamentos por dia (Queen's, 2020)
const Fact: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.round(6200 * ease(interpolate(frame, [58, 112], [0, 1], clamp)));
  return (
    <AbsoluteFill style={{background: '#2f3542'}}>
      <Title text="UNIVERSIDADE QUEEN'S" color="#fed330" top={130} size={72} at={4} />
      <Person {...ME} x={540} y={1130} scale={1.9} emotion={frame >= 112 ? 'shocked' : 'neutral'} lookY={-0.6} />
      {Array.from({length: 26}).map((_, i) => {
        const show = frame >= 36 + i * 3;
        const a = (i / 26) * Math.PI * 2 + i * 0.7;
        const r = 330 + ((i * 37) % 90);
        const x = 540 + Math.cos(a) * r;
        const y = 620 + Math.sin(a) * (r * 0.62) + Math.sin((frame + i * 9) / 10) * 8;
        return show ? <div key={i} style={{position: 'absolute', left: x - 18, top: y - 18, width: 36, height: 36, borderRadius: 18, background: i % 3 === 0 ? '#fed330' : '#a29bfe', border: `5px solid ${INK}`}} /> : null;
      })}
      {frame >= 50 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 170, color: '#fff', WebkitTextStroke: `16px ${INK}`, paintOrder: 'stroke fill', letterSpacing: -2}}>{brNum(n)}</div>
      ) : null}
      {frame >= 56 ? <Title text="PENSAMENTOS POR DIA" color="#a29bfe" top={510} size={58} at={56} /> : null}
      <Stamp x={540} y={1175} text="POR PESSOA" at={136} color="#6c5ce7" size={66} rot={-3} />
      <Pop at={56} /><Pop at={136} />
      <Sting at={112} volume={0.3} />
      <div style={{position: 'absolute', top: 1560, left: 50, right: 50, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 30, lineHeight: 1.2, color: '#a4b0be'}}>Fonte: Tseng &amp; Poppenk, Nature Communications (2020) — estimativa por ressonância magnética</div>
    </AbsoluteFill>
  );
};

// s03 — a conta absurda: 40 pessoas x 6.200
const BusMath: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.round(248000 * ease(interpolate(frame, [58, 112], [0, 1], clamp)));
  const merged = frame >= 124;
  return (
    <AbsoluteFill style={{background: '#273c75'}}>
      <Title text="40 PESSOAS NO ÔNIBUS" color="#fff" top={130} size={72} at={2} />
      {Array.from({length: 40}).map((_, i) => {
        const col = i % 8, row = Math.floor(i / 8);
        const show = frame >= 8 + i * 0.7;
        return show ? <Dummy key={i} x={135 + col * 115} y={330 + row * 110} s={0.95} color={merged ? '#a29bfe' : '#dfe4ea'} /> : null;
      })}
      {frame >= 56 ? <div style={{position: 'absolute', left: 0, right: 0, top: 900, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 150, color: '#fed330', WebkitTextStroke: `15px ${INK}`, paintOrder: 'stroke fill', transform: merged ? `translateX(${Math.sin(frame * 1.6) * 5}px)` : undefined}}>{brNum(n)}</div> : null}
      {frame >= 56 ? <Stamp x={540} y={1110} text="PENSAMENTOS POR DIA" at={56} color="#6c5ce7" size={52} rot={-2} /> : null}
      {merged ? <Stamp x={540} y={620} text="TUDO NA SUA CABEÇA" at={124} color="#ff4757" size={56} rot={3} /> : null}
      <Pop at={56} /><Pop at={124} />
      <Sting at={124} volume={0.4} />
    </AbsoluteFill>
  );
};

// s04 — o motorista só pensa em pão de queijo, três pontos seguidos
const Driver: React.FC = () => {
  const frame = useCurrentFrame();
  const road = (frame * 14) % 200;
  const stop = frame >= 116 ? 3 : frame >= 104 ? 2 : frame >= 92 ? 1 : 0;
  return (
    <AbsoluteFill style={{background: '#74b9ff'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 260, height: 500, background: '#a4b0be', borderBottom: `8px solid ${INK}`}} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: 500, width: 80, top: 520 + ((i * 200 + road) % 800) * 0.6, height: 90, background: '#fed330', border: `5px solid ${INK}`}} />)}
      <Floor color="#2d3436" y={1100} />
      <Person {...DRIVER} x={540} y={1330} scale={2.1} emotion="happy" lookY={-0.8} />
      <div style={{position: 'absolute', left: 330, top: 1070, width: 420, height: 200, borderRadius: 100, border: `22px solid ${INK}`, background: 'rgba(0,0,0,0.05)'}} />
      <Think x={540} y={290} at={34} w={640} size={50} text="PÃO DE QUEIJO">
        <div style={{position: 'relative', height: 110, marginTop: 6}}>
          <CheeseBread x={150} y={6} s={1.1} /><CheeseBread x={320} y={6} s={1.1} /><CheeseBread x={490} y={6} s={1.1} />
        </div>
      </Think>
      {stop > 0 ? <Stamp x={830} y={540} text={`PONTO ${stop}`} at={frame >= 116 ? 116 : frame >= 104 ? 104 : 92} color="#2f3542" size={78} rot={stop % 2 ? -4 : 4} /> : null}
      <Pop at={34} /><Pop at={92} /><Pop at={104} /><Pop at={116} />
      <Sting at={116} volume={0.3} />
    </AbsoluteFill>
  );
};

// s05 — o jingle do colchão passa do tiozão para o Caio
const Jingle: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <BusInt />
      <Person {...TIAO} x={270} y={1290} scale={1.7} emotion="happy" talking={false} lookX={1} />
      <Person {...ME} x={800} y={1290} scale={1.6} emotion={frame >= 108 ? 'worried' : 'neutral'} lookX={-1} />
      {[0, 1, 2, 3, 4].map((i) => frame >= 50 + i * 8 ? <Note key={i} x={420 + i * 28 + Math.sin((frame + i * 8) / 8) * 14} y={940 - ((frame * 2 + i * 40) % 220)} s={1 + (i % 2) * 0.4} rot={Math.sin((frame + i) / 9) * 14} /> : null)}
      <Think x={270} y={440} at={46} w={520} size={44} text="COLCHÃO, COLCHÃO, COLCHÃO!" tail="center" />
      <Think x={790} y={440} at={108} w={520} size={44} text="COLCHÃO, COLCHÃO, COLCHÃO!" tail="center" rot={3} />
      <Stamp x={540} y={300} text="JINGLE" at={30} color="#fd9644" size={70} rot={-4} />
      <Pop at={46} /><Pop at={108} /><Pop at={30} />
      <Sting at={108} volume={0.35} />
    </AbsoluteFill>
  );
};

// s06 — o chefe elogia, mas pensa outra coisa
const Office: React.FC = () => {
  const frame = useCurrentFrame();
  const thought = frame >= 88;
  return (
    <AbsoluteFill>
      <Room wall="#c8d6e5" floor="#8395a7" />
      <div style={{position: 'absolute', left: 640, top: 280, width: 330, height: 230, background: '#7ed6df', border: `9px solid ${INK}`, borderRadius: 12}} />
      <div style={{position: 'absolute', left: 90, top: 930, width: 120, height: 250, background: '#44bd32', border: `7px solid ${INK}`, borderRadius: '60px 60px 12px 12px'}} />
      <Person {...BOSS} x={310} y={1290} scale={1.7} emotion={thought ? 'smirk' : 'happy'} talking={frame > 40 && frame < 72} lookX={1} />
      <Person {...ME} x={800} y={1290} scale={1.6} emotion={frame >= 96 ? 'shocked' : 'happy'} lookX={-1} />
      {!thought ? <Bubble x={330} y={430} text="ÓTIMO TRABALHO!" at={42} w={560} size={56} tail="left" /> : null}
      {thought ? <Think x={330} y={360} at={88} w={600} size={50} text="QUAL É O NOME DESSE MENINO?" tail="left" /> : null}
      <Pop at={42} /><Pop at={88} />
      <Sting at={96} volume={0.4} />
    </AbsoluteFill>
  );
};

// s07 — o cachorro do vizinho só pensa "ele chegou"
const DogScene: React.FC = () => {
  const frame = useCurrentFrame();
  const n = frame >= 128 ? 3 : frame >= 108 ? 2 : 1;
  return (
    <AbsoluteFill>
      <Street />
      <Dog x={300} y={1330} s={1.6} wag={frame >= 86 ? 1.2 : 0.2} />
      <Person {...ME} x={820} y={1330} scale={1.6} emotion={frame >= 86 ? 'happy' : 'neutral'} lookX={-1} />
      {frame >= 86 ? <Think x={300} y={500} at={86} w={560} size={58 + n * 4} text={Array.from({length: n}).map(() => 'ELE CHEGOU!').join(' ')} tail="center" /> : null}
      <Pop at={86} /><Pop at={108} /><Pop at={128} />
    </AbsoluteFill>
  );
};

// s08 — pombos planejam roubar o sanduíche, ninguém entende o Caio
const Pigeons: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Park />
      <Person {...OLDMAN} x={800} y={1010} scale={1.25} emotion={frame >= 158 ? 'worried' : 'happy'} lookX={-0.4} />
      <Sandwich x={730} y={800} s={0.9} />
      {[0, 1, 2].map((i) => frame >= 24 + i * 8 ? <Pigeon key={i} x={290 + i * 140} y={1215} s={1.3} flip={false} peck={frame < 90} /> : null)}
      <Think x={330} y={290} at={62} w={560} size={40} tail="center">
        <div style={{textAlign: 'left', lineHeight: 1.2}}>PLANO:<br />1. DISTRAIR O SENHOR<br />2. PEGAR O SANDUÍCHE</div>
      </Think>
      <Person {...ME} x={110} y={1215} scale={1.35} emotion="shocked" lookX={1} />
      <Bubble x={190} y={735} text="CUIDADO!" at={138} w={380} size={64} tail="left" />
      <Bubble x={800} y={470} text="?" at={160} w={160} size={80} tail="center" />
      <Pop at={62} /><Pop at={138} /><Pop at={160} />
      <Sting at={138} volume={0.3} />
    </AbsoluteFill>
  );
};

// s09 — o centro da cidade: pensamentos demais
const WORDS = ['BOLETO', 'FOME', 'SONO', 'CALOR', 'PIX?', 'FILA', 'ATRASEI', 'FRANGO', 'TROCO', 'WI-FI', 'SEXTOU', 'CAFÉ', 'PROVA', 'DENTISTA', 'CHUVA?'];
const Downtown: React.FC = () => {
  const frame = useCurrentFrame();
  const ears = frame >= 105;
  const shake = frame >= 40 ? Math.sin(frame * 1.9) * (frame >= 145 ? 7 : 4) : 0;
  return (
    <AbsoluteFill>
      <Street />
      {Array.from({length: 7}).map((_, i) => <Dummy key={i} x={90 + i * 150} y={1100 + (i % 2) * 40} s={1} color={['#fab1a0', '#dfe4ea', '#a29bfe', '#ffeaa7'][i % 4]} />)}
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${shake}px)`}}>
        {Array.from({length: 30}).map((_, i) => {
          if (frame < 36 + i * 2) return null;
          const x = ((i * 277) % 900) + 70;
          const y = 360 + ((i * 151) % 640);
          return (
            <div key={i} style={{position: 'absolute', left: x, top: y, padding: '4px 16px', background: PURPLE, border: `5px solid ${INK}`, borderRadius: 30, fontFamily: 'Inter', fontWeight: 900, fontSize: 34, color: INK, transform: `rotate(${((i * 37) % 24) - 12}deg)`, whiteSpace: 'nowrap'}}>{WORDS[i % WORDS.length]}</div>
          );
        })}
      </div>
      <Person {...ME} x={540} y={1350} scale={1.7} emotion={frame >= 145 ? 'scared' : 'shocked'} lookY={0} />
      {ears ? (
        <>
          <div style={{position: 'absolute', left: 540 - 160, top: 1350 - 265 * 1.7 + 10, width: 70, height: 70, borderRadius: 35, background: ME.skin, border: `7px solid ${INK}`}} />
          <div style={{position: 'absolute', left: 540 + 90, top: 1350 - 265 * 1.7 + 10, width: 70, height: 70, borderRadius: 35, background: ME.skin, border: `7px solid ${INK}`}} />
        </>
      ) : null}
      <Stamp x={540} y={230} text="MILHÕES DE PENSAMENTOS" at={36} color="#6c5ce7" size={52} rot={-2} />
      <Stamp x={540} y={1150} text="NÃO ADIANTA" at={148} color="#ff4757" size={80} rot={4} />
      <Pop at={36} /><Pop at={105} /><Pop at={148} />
      <Sting at={148} volume={0.5} />
    </AbsoluteFill>
  );
};

// s10 — a mãe pergunta se comeu e pensa em onze coisas
const MOMTHINGS = ['FRANGO', 'CONTA DE LUZ', 'TIO ZÉ', 'TELHADO', 'DENTISTA', 'SENHA DO WI-FI', 'A PLANTA', 'BOLETO', 'FEIJÃO', 'MÁQUINA DE LAVAR'];
const Mom: React.FC = () => {
  const frame = useCurrentFrame();
  const thinking = frame >= 96;
  return (
    <AbsoluteFill>
      <Kitchen />
      <Person {...MOM} x={250} y={1330} scale={1.7} emotion="happy" talking={frame > 8 && frame < 76} lookX={1} />
      <Person {...ME} x={850} y={1330} scale={1.5} emotion={frame >= 160 ? 'happy' : 'smirk'} lookX={-1} />
      {!thinking ? <Bubble x={270} y={560} text="VOCÊ COMEU?" at={14} w={500} size={58} tail="left" /> : null}
      {thinking ? (
        <div style={{position: 'absolute', left: 60, top: 170, width: 960, background: PURPLE, border: `9px solid ${INK}`, borderRadius: 90, boxShadow: `0 10px 0 ${INK}`, padding: '30px 40px 34px', transformOrigin: '30% 100%', transform: `scale(${spring({frame: frame - 96, fps: 30, config: {damping: 13}})})`}}>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center'}}>
            {MOMTHINGS.map((t, i) => frame >= 104 + i * 5 ? (
              <div key={t} style={{padding: '8px 22px', background: '#fff', border: `6px solid ${INK}`, borderRadius: 30, fontFamily: 'Inter', fontWeight: 900, fontSize: 38, color: INK}}>{i + 1}. {t}</div>
            ) : null)}
          </div>
          {frame >= 158 ? (
            <div style={{margin: '26px auto 0', width: 820, textAlign: 'center', padding: '14px 20px', background: '#fed330', border: `8px solid ${INK}`, borderRadius: 36, fontFamily: 'Inter', fontWeight: 900, fontSize: 56, color: INK, transform: `scale(${spring({frame: frame - 158, fps: 30, config: {damping: 9, stiffness: 240}})})`}}>11. O CAIO TÁ PÁLIDO</div>
          ) : null}
        </div>
      ) : null}
      <Pop at={14} /><Pop at={96} /><Pop at={158} />
      <Sting at={158} volume={0.35} />
    </AbsoluteFill>
  );
};

// s11 — meia-noite, silêncio, e a dúvida do pombo
const Midnight: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kitchen night />
      <div style={{position: 'absolute', left: 120, top: 1040, width: 840, height: 200, background: '#6c5ce7', border: `8px solid ${INK}`, borderRadius: 24}} />
      <Person {...ME} x={540} y={1230} scale={1.6} emotion={frame >= 145 ? 'smirk' : frame >= 112 ? 'worried' : 'neutral'} lookY={frame >= 145 ? -0.8 : 0} />
      <Stamp x={540} y={190} text="00:00" at={4} color="#2f3542" size={110} rot={-2} />
      <Stamp x={540} y={330} text="SILÊNCIO" at={32} color="#20bf6b" size={64} rot={3} />
      <Think x={540} y={400} at={146} w={640} size={44} tail="center">
        <div style={{position: 'relative', height: 150}}>
          <Pigeon x={150} y={140} s={0.9} flip />
          <Sandwich x={470} y={50} s={0.8} />
          <div style={{position: 'absolute', right: 40, top: 14, fontSize: 90, color: INK}}>?</div>
        </div>
      </Think>
      <Pop at={4} /><Pop at={32} /><Pop at={146} />
      <Sting at={32} volume={0.2} />
    </AbsoluteFill>
  );
};

// s12 — opção A: todo mundo ouve os seus pensamentos
const VoteA: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#273c75'}}>
      <Title text="PARTE 2: VOCÊ ESCOLHE" color="#fff" top={110} size={70} at={0} />
      <Letter letter="A" color="#20bf6b" at={44} />
      <Label text="TODO MUNDO OUVE OS SEUS PENSAMENTOS" at={50} />
      <Person {...ME} x={540} y={1270} scale={1.55} emotion="shocked" lookY={-0.5} />
      <Think x={540} y={600} at={70} w={560} size={52} text="QUE FOME..." tail="center" />
      {[170, 360, 720, 910].map((x, i) => frame >= 80 + i * 6 ? (
        <Dummy key={x} x={x} y={1020 + (i % 2) * 40} s={1.3} color={['#fab1a0', '#ffeaa7', '#81ecec', '#dfe4ea'][i]} />
      ) : null)}
      {[170, 360, 720, 910].map((x, i) => frame >= 90 + i * 6 ? <Bubble key={x} x={x} y={820 + (i % 2) * 40} text="HÃ?" at={90 + i * 6} w={150} size={42} tail="center" /> : null)}
      <Pop at={44} /><Pop at={70} />
    </AbsoluteFill>
  );
};

// s13 — opção B: o cachorro do vizinho dá ordens
const VoteB: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#273c75'}}>
      <Title text="PARTE 2: VOCÊ ESCOLHE" color="#fff" top={110} size={70} at={0} />
      <Letter letter="B" color="#0984e3" at={22} />
      <Label text="O CACHORRO DO VIZINHO DÁ ORDENS" at={28} />
      <Dog x={310} y={1300} s={1.7} wag={0.6} />
      <Person {...ME} x={830} y={1310} scale={1.5} emotion={frame >= 86 ? 'sad' : 'worried'} lookX={-1} />
      {frame < 84 ? <Bubble x={310} y={720} text="SENTA." at={52} w={380} size={76} tail="center" /> : null}
      {frame >= 84 ? <Bubble x={310} y={720} text="AGORA ROLA." at={84} w={520} size={64} tail="center" /> : null}
      <Pop at={22} /><Pop at={52} /><Pop at={84} />
    </AbsoluteFill>
  );
};

// s14 — opção C: alto-falante da praça + pergunta final
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const btn = (letter: string, color: string, label: string, x: number, at: number) => {
    const p = spring({frame: frame - at, fps: 30, config: {damping: 10, stiffness: 220}});
    return frame >= at ? (
      <div style={{position: 'absolute', left: x, top: 760, width: 290, height: 230, borderRadius: 36, background: color, border: `9px solid ${INK}`, boxShadow: `0 10px 0 ${INK}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, color: '#fff', transform: `scale(${p})`}}>
        <div style={{fontSize: 110, lineHeight: 1}}>{letter}</div>
        <div style={{fontSize: 30, textAlign: 'center', padding: '0 12px', lineHeight: 1.05}}>{label}</div>
      </div>
    ) : null;
  };
  return (
    <AbsoluteFill style={{background: '#273c75'}}>
      <Title text="PARTE 2: VOCÊ ESCOLHE" color="#fff" top={110} size={70} at={0} />
      {frame < 110 ? (
        <>
          <Letter letter="C" color="#e84118" at={14} />
          <Label text="O ALTO-FALANTE DA PRAÇA" at={20} />
          {/* poste e alto-falante */}
          <div style={{position: 'absolute', left: 150, top: 640, width: 28, height: 560, background: '#b2bec3', border: `6px solid ${INK}`}} />
          <svg viewBox="0 0 220 160" width={330} height={240} style={{position: 'absolute', left: 90, top: 560}}>
            <path d="M20,50 L110,20 L110,140 L20,110 Z" fill="#fed330" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
            <path d="M110,20 Q200,30 200,80 Q200,130 110,140 Z" fill="#f0932b" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
          </svg>
          {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 420 + i * 60, top: 640 + i * 6, width: 60, height: 140 - i * 20, border: `8px solid ${INK}`, borderLeft: 'none', borderRadius: '0 80px 80px 0', opacity: 0.35 + 0.65 * ((frame + i * 6) % 24 < 12 ? 1 : 0.4)}} />)}
          {['ALGUÉM VIU MEU PIX?', 'QUE FOME...', 'QUEM É O CAIO?'].map((t, i) => frame >= 36 + i * 22 ? <Bubble key={t} x={640} y={700 + i * 140} text={t} at={36 + i * 22} w={470} size={40} tail="left" /> : null)}
          <Dummy x={880} y={1060} s={1.4} color="#fab1a0" />
          <Person {...ME} x={420} y={1300} scale={1.5} emotion="shocked" lookX={-1} />
        </>
      ) : (
        <>
          <Title text="QUAL VOCÊ ESCOLHE?" color="#fed330" top={300} size={90} at={110} />
          {btn('A', '#20bf6b', 'ELES OUVEM VOCÊ', 40, 124)}
          {btn('B', '#0984e3', 'O CACHORRO MANDA', 395, 134)}
          {btn('C', '#e84118', 'O ALTO-FALANTE', 750, 144)}
          <Stamp x={540} y={1070} text="COMENTA A, B OU C" at={156} color="#fed330" size={54} rot={-3} />
          <Person {...ME} x={540} y={1500} scale={1.2} emotion="happy" lookY={-0.4} />
        </>
      )}
      <div style={{position: 'absolute', left: 140, right: 140, top: 1560, height: 100, borderRadius: 50, background: '#fed330', border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 52, color: INK, transform: `scale(${1 + Math.sin(frame / 5) * 0.03})`, opacity: frame >= 110 ? 1 : 0}}>@hipoteticamente.br</div>
      <Pop at={14} /><Pop at={124} /><Pop at={134} /><Pop at={144} /><Pop at={156} />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  bus: Bus, fact: Fact, busmath: BusMath, driver: Driver, jingle: Jingle, office: Office, dog: DogScene,
  pigeons: Pigeons, downtown: Downtown, mom: Mom, midnight: Midnight, vote_a: VoteA, vote_b: VoteB, cta: Cta,
};
