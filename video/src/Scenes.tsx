import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Person, PersonProps} from './Person';
import {INK, ME, Pop, Sting, Flash, Floor, Title, Street, Room} from './lib';

// ---------- elenco ----------
const LEO = {skin: '#8d5524', hair: 'spiky' as const, hairColor: '#1e1e1e', shirt: '#4b7bec', pants: '#2d3436'};
const BIA = {skin: '#e0ac69', hair: 'long' as const, hairColor: '#2d3436', shirt: '#a55eea', pants: '#34495e'};
const BAKER = {skin: '#ffdbac', hair: 'bald' as const, mustache: true, shirt: '#f5f6fa', apron: true, hat: 'cap' as const, hatColor: '#f5f6fa'};
const GIRL = {skin: '#f2c29b', hair: 'bun' as const, hairColor: '#e15f41', shirt: '#fd79a8', pants: '#574b90'};
const BOSS = {skin: '#c68642', hair: 'short' as const, hairColor: '#7f8c8d', suit: true, tie: '#eb3b5a'};
const ANCHOR = {skin: '#ffdbac', hair: 'short' as const, hairColor: '#4b3621', suit: true, tie: '#3867d6'};

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------- cadeado na boca ----------
const Padlock: React.FC<{open?: boolean; size: number; color?: string}> = ({open, size, color}) => {
  const c = color ?? (open ? '#20bf6b' : '#ff4757');
  return (
    <svg viewBox="0 0 100 110" width={size} height={size * 1.1} style={{overflow: 'visible'}}>
      <path d={open ? 'M28,48 L28,26 Q28,4 50,4 Q72,4 72,26 L72,30' : 'M28,48 L28,30 Q28,8 50,8 Q72,8 72,30 L72,48'} fill="none" stroke={INK} strokeWidth={16} strokeLinecap="round" transform={open ? 'translate(0,-14) rotate(-18 72 30)' : undefined} />
      <path d={open ? 'M28,48 L28,26 Q28,4 50,4 Q72,4 72,26 L72,30' : 'M28,48 L28,30 Q28,8 50,8 Q72,8 72,30 L72,48'} fill="none" stroke="#d1d8e0" strokeWidth={7} strokeLinecap="round" transform={open ? 'translate(0,-14) rotate(-18 72 30)' : undefined} />
      <rect x={12} y={44} width={76} height={60} rx={12} fill={c} stroke={INK} strokeWidth={7} />
      <circle cx={50} cy={68} r={8} fill={INK} />
      <rect x={46} y={70} width={8} height={18} rx={3} fill={INK} />
    </svg>
  );
};

// posiciona um cadeado sobre a boca de um Person (mesma conta do Person.tsx)
const MouthLock: React.FC<{x: number; y: number; scale: number; at?: number; open?: boolean; openAt?: number; shake?: boolean; size?: number}> = ({x, y, scale, at = 0, open, openAt, shake, size = 70}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 10, stiffness: 180}});
  const isOpen = open || (openAt !== undefined && frame >= openAt);
  const op = openAt !== undefined ? spring({frame: frame - openAt, fps, config: {damping: 8, stiffness: 200}}) : 1;
  const bobY = Math.sin((frame + x) / 9) * 3;
  const H = 360 * scale;
  const s = size * scale * 0.55;
  const sh = shake ? Math.sin(frame * 2.1) * 6 : 0;
  return (
    <div style={{position: 'absolute', left: x - s / 2 + sh, top: y - H + bobY + 142 * scale - s * 0.6, transform: `scale(${p * (isOpen && openAt !== undefined ? 0.8 + 0.2 * op + (1 - op) * 0.4 : 1)})`, transformOrigin: '50% 60%'}}>
      <Padlock open={isOpen} size={s} />
    </div>
  );
};

// ---------- balão de fala ----------
const Bubble: React.FC<{x: number; y: number; text: string; at: number; w?: number; size?: number; color?: string; tail?: 'left' | 'right' | 'center'}> = ({x, y, text, at, w = 520, size = 58, color = '#fff', tail = 'center'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 11, stiffness: 200}});
  const tx = tail === 'left' ? w * 0.22 : tail === 'right' ? w * 0.78 : w / 2;
  return (
    <div style={{position: 'absolute', left: x - tx, top: y, width: w, transform: `scale(${p})`, transformOrigin: `${tx}px 100%`}}>
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: color, border: `8px solid ${INK}`, borderRadius: 40, padding: '22px 30px', fontFamily: 'Inter', fontWeight: 900, fontSize: size, lineHeight: 1.08, color: INK, textAlign: 'center', boxShadow: `0 10px 0 ${INK}`}}>
        {text}
        <div style={{position: 'absolute', left: tx - 22, bottom: -42, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: `40px solid ${INK}`}} />
        <div style={{position: 'absolute', left: tx - 13, bottom: -26, width: 0, height: 0, borderLeft: '13px solid transparent', borderRight: '13px solid transparent', borderTop: `26px solid ${color}`}} />
      </div>
    </div>
  );
};

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

const Shake: React.FC<{from: number; to: number; amp?: number; children: React.ReactNode}> = ({from, to, amp = 10, children}) => {
  const frame = useCurrentFrame();
  const on = frame >= from && frame <= to;
  const d = on ? amp * Math.exp(-(frame - from) / 8) : 0;
  return <AbsoluteFill style={{transform: `translate(${Math.sin(frame * 2.7) * d}px, ${Math.cos(frame * 3.1) * d}px)`}}>{children}</AbsoluteFill>;
};

// ---------- cenas ----------
const Hook: React.FC = () => {
  const people: [number, PersonProps][] = [
    [150, {x: 150, y: 1150, scale: 1.05, ...GIRL}],
    [370, {x: 370, y: 1110, scale: 0.95, ...BAKER}],
    [710, {x: 710, y: 1110, scale: 0.95, ...BOSS}],
    [930, {x: 930, y: 1150, scale: 1.05, ...LEO}],
  ];
  return (
    <AbsoluteFill>
      <Street />
      {people.map(([x, p], i) => (
        <React.Fragment key={i}>
          <Person {...p} emotion="shocked" lookX={x < 540 ? 1 : -1} />
          <MouthLock x={p.x} y={p.y} scale={p.scale ?? 1} at={55 + i * 6} />
        </React.Fragment>
      ))}
      <Pop at={55} /><Pop at={67} />
      <Person {...ME} x={540} y={1260} scale={1.6} emotion="shocked" lookY={-0.5} />
      <MouthLock x={540} y={1260} scale={1.6} at={100} openAt={128} />
      <Pop at={128} />
      <Title text="NINGUÉM MENTE" color="#fed330" top={330} size={110} at={45} />
    </AbsoluteFill>
  );
};

const News: React.FC = () => {
  const frame = useCurrentFrame();
  const clock = frame >= 92 ? '24:00:00' : '';
  return (
    <AbsoluteFill>
      <Room wall="#dfe6e9" floor="#b2bec3" />
      <Shake from={160} to={182} amp={8}>
        {/* TV */}
        <div style={{position: 'absolute', left: 70, top: 260, width: 940, height: 760, background: INK, borderRadius: 40}} />
        <div style={{position: 'absolute', left: 100, top: 290, width: 880, height: 700, background: '#0c2461', borderRadius: 24, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 700, background: 'radial-gradient(circle at 50% 40%, #1e3799 0%, #0c2461 70%)'}} />
          <Person {...ANCHOR} x={440} y={860} scale={1.9} emotion={frame > 158 ? 'scared' : 'neutral'} talking={frame > 10 && frame < 150} bob={false} />
          <MouthLock x={440} y={860} scale={1.9} at={158} shake />
          <div style={{position: 'absolute', left: 0, right: 0, top: 540, height: 160, background: '#eb3b5a', borderTop: `8px solid ${INK}`}}>
            <div style={{position: 'absolute', left: 0, top: 0, height: 52, width: 260, background: '#fed330', fontFamily: 'Inter', fontWeight: 900, fontSize: 40, color: INK, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>URGENTE</div>
            <div style={{position: 'absolute', left: 30, right: 30, top: 62, fontFamily: 'Inter', fontWeight: 900, fontSize: 54, color: '#fff', whiteSpace: 'nowrap'}}>NINGUÉM CONSEGUE MENTIR</div>
          </div>
          {clock ? (
            <div style={{position: 'absolute', right: 30, top: 30, background: '#fff', border: `6px solid ${INK}`, borderRadius: 16, padding: '6px 18px', fontFamily: 'DejaVu Sans Mono', fontWeight: 700, fontSize: 52, color: '#eb3b5a', transform: `scale(${spring({frame: frame - 92, fps: 30, config: {damping: 10}})})`}}>{clock}</div>
          ) : null}
        </div>
        <div style={{position: 'absolute', left: 470, top: 1020, width: 140, height: 60, background: INK}} />
      </Shake>
      <Pop at={92} />
      <Sting at={158} volume={0.35} />
    </AbsoluteFill>
  );
};

const Bakery: React.FC = () => {
  const frame = useCurrentFrame();
  const strain = frame > 60 && frame < 112;
  return (
    <AbsoluteFill>
      <Room wall="#ffeaa7" floor="#cd6133" />
      <div style={{position: 'absolute', left: 120, top: 180, width: 840, height: 120, background: '#e58e26', border: `8px solid ${INK}`, borderRadius: 20, fontFamily: 'Inter', fontWeight: 900, fontSize: 72, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTextStroke: `6px ${INK}`, paintOrder: 'stroke fill'}}>PÃO FRESQUINHO</div>
      {/* prateleira de pães */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{position: 'absolute', left: 120 + i * 170, top: 400, width: 140, height: 70, borderRadius: 40, background: '#e1b12c', border: `6px solid ${INK}`}} />
      ))}
      <div style={{position: 'absolute', left: 80, top: 480, width: 920, height: 16, background: INK}} />
      <div style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, transform: strain ? `translateX(${Math.sin(frame * 2.4) * 5}px)` : undefined}}>
        <Person {...BAKER} x={700} y={1060} scale={1.5} emotion={strain ? 'worried' : frame >= 112 ? 'sad' : 'neutral'} lookX={-1} talking={frame >= 112 && frame < 140} />
      </div>
      {strain ? <div style={{position: 'absolute', left: 820, top: 560, fontSize: 70}}><svg viewBox="0 0 40 50" width={44} height={56}><path d="M20,2 Q36,30 20,46 Q4,30 20,2 Z" fill="#74b9ff" stroke={INK} strokeWidth={4} /></svg></div> : null}
      {/* balcão */}
      <div style={{position: 'absolute', left: 40, top: 960, width: 1000, height: 230, background: '#b33939', border: `10px solid ${INK}`, borderRadius: 24}} />
      <div style={{position: 'absolute', left: 40, top: 940, width: 1000, height: 50, background: '#f5f6fa', border: `10px solid ${INK}`, borderRadius: 24}} />
      <Person {...ME} x={260} y={1330} scale={1.6} emotion={frame >= 112 ? 'shocked' : 'neutral'} lookX={1} lookY={-0.4} talking={frame > 4 && frame < 50} />
      <Bubble x={700} y={520} text="É DE ANTEONTEM." at={112} w={560} size={60} tail="right" />
      <Pop at={112} />
    </AbsoluteFill>
  );
};

const Bus: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hit = spring({frame: frame - 14, fps, config: {damping: 8}});
  return (
    <AbsoluteFill style={{background: '#dcdde1'}}>
      {/* janelas com rua passando */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: 60 + i * 330, top: 260, width: 300, height: 380, background: '#7ed6df', border: `9px solid ${INK}`, borderRadius: 24, overflow: 'hidden'}}>
          {[0, 1, 2, 3].map((j) => (
            <div key={j} style={{position: 'absolute', left: ((j * 220 - frame * 14 - i * 330) % 880 + 880) % 880 - 200, top: 150 + (j % 2) * 40, width: 150, height: 300, background: ['#f8c291', '#82ccdd', '#b8e994', '#e58e26'][j], border: `6px solid ${INK}`}} />
          ))}
        </div>
      ))}
      <div style={{position: 'absolute', left: 0, right: 0, top: 170, height: 18, background: '#a4b0be', borderBottom: `6px solid ${INK}`}} />
      {[220, 540, 860].map((x, i) => (
        <div key={i} style={{position: 'absolute', left: x, top: 180, width: 12, height: 160 + Math.sin(frame / 8 + i) * 6, background: INK}} />
      ))}
      <Floor color="#636e72" y={1180} />
      <Person {...GIRL} x={700} y={1310} scale={1.7} emotion={frame >= 108 ? 'smirk' : frame >= 72 ? 'happy' : 'neutral'} lookX={-1} talking={(frame >= 72 && frame < 100) || (frame >= 108 && frame < 140)} />
      <Person {...ME} x={300} y={1320} scale={1.7} emotion={frame > 14 ? (frame >= 108 ? 'shocked' : 'worried') : 'neutral'} lookX={1} />
      {frame > 14 && frame < 60 ? (
        <svg viewBox="0 0 100 100" width={180} height={180} style={{position: 'absolute', left: 380, top: 1180, transform: `scale(${hit}) rotate(${frame * 3}deg)`}}>
          <path d="M50,0 L60,35 L98,30 L68,55 L85,95 L50,72 L15,95 L32,55 L2,30 L40,35 Z" fill="#fed330" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        </svg>
      ) : null}
      <Pop at={14} />
      {frame < 108 ? <Bubble x={700} y={560} text="DESCULPA!" at={72} w={420} size={60} tail="right" /> : null}
      <Bubble x={640} y={680} text="…FOI DE PROPÓSITO." at={108} w={600} size={52} color="#ffeaa7" tail="right" />
      <Pop at={108} />
    </AbsoluteFill>
  );
};

const Test: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#a29bfe" floor="#6c5ce7" />
      {/* régua na parede */}
      <div style={{position: 'absolute', left: 760, top: 240, width: 120, height: 940, background: '#fed330', border: `8px solid ${INK}`, borderRadius: 12}}>
        {Array.from({length: 20}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 0, top: i * 47, width: i % 2 ? 40 : 70, height: 6, background: INK}} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 900, top: 530, fontFamily: 'Inter', fontWeight: 900, fontSize: 46, color: '#fff', WebkitTextStroke: `6px ${INK}`, paintOrder: 'stroke fill'}}>1,72</div>
      <div style={{position: 'absolute', left: 620, top: 560, width: 270, height: 8, background: '#eb3b5a', borderRadius: 4}} />
      <Person {...ME} x={460} y={1300} scale={1.75} emotion={frame >= 108 ? 'smirk' : frame >= 92 ? 'shocked' : 'happy'} lookX={frame >= 108 ? 0 : 0.4} talking={frame > 30 && frame < 88} />
      <MouthLock x={460} y={1300} scale={1.75} at={92} open />
      <Bubble x={420} y={260} text="EU TENHO 2 METROS!" at={34} w={600} size={58} tail="left" />
      <Pop at={92} />
      {frame >= 108 ? <Stamp x={190} y={520} text="FÁCIL" at={108} color="#20bf6b" size={60} rot={-10} /> : null}
    </AbsoluteFill>
  );
};

const Office: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill>
    <Room wall="#c7ecee" floor="#535c68" />
    <div style={{position: 'absolute', left: 80, top: 200, width: 360, height: 260, background: '#dff9fb', border: `8px solid ${INK}`, borderRadius: 16}}>
      <div style={{position: 'absolute', left: 170, top: 0, bottom: 0, width: 8, background: INK}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 120, height: 8, background: INK}} />
    </div>
    <div style={{position: 'absolute', left: 820, top: 260, width: 120, height: 160, borderRadius: '50% 50% 10px 10px', background: '#26de81', border: `7px solid ${INK}`}} />
    {children}
  </AbsoluteFill>
);

const Interview: React.FC = () => {
  const frame = useCurrentFrame();
  const cands: [number, string, string, number][] = [
    [190, 'PREGUIÇA', '#fd9644', 106],
    [400, 'ATRASO', '#45aaf2', 126],
    [610, 'FOFOCA', '#a55eea', 147],
  ];
  return (
    <Office>
      {cands.map(([x, label, shirt, at], i) => (
        <React.Fragment key={i}>
          <Person x={x} y={1120} scale={1.05} skin={['#ffdbac', '#8d5524', '#e0ac69'][i]} hair={(['spiky', 'long', 'bun'] as const)[i]} hairColor={['#d35400', '#2d3436', '#6d214f'][i]} shirt={shirt} emotion={frame >= at ? 'sad' : 'worried'} />
          <Stamp x={x} y={700} text={label} at={at} size={36} rot={i % 2 ? 6 : -6} />
          <Pop at={at} />
        </React.Fragment>
      ))}
      <Person {...ME} x={880} y={1280} scale={1.5} emotion={frame >= 180 ? 'smirk' : 'neutral'} lookX={-1} talking={frame >= 180 && frame < 210} />
      <Bubble x={820} y={640} text="SOU PERFECCIONISTA." at={180} w={560} size={50} tail="right" />
      <Pop at={180} />
    </Office>
  );
};

const Hired: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Office>
      {Array.from({length: 26}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: (i * 97) % 1080, top: -60 + ((frame * (9 + (i % 5) * 2) + i * 71) % 1300), width: 26, height: 40, background: ['#fed330', '#ff4757', '#26de81', '#45aaf2'][i % 4], border: `4px solid ${INK}`, transform: `rotate(${frame * 9 + i * 40}deg)`}} />
      ))}
      <Person {...BOSS} x={300} y={1240} scale={1.6} emotion="happy" lookX={1} />
      <Person {...ME} x={780} y={1260} scale={1.7} emotion={frame >= 62 ? 'smirk' : 'happy'} lookX={frame >= 62 ? 0 : -1} lookY={frame >= 62 ? 0.2 : 0} />
      <Stamp x={540} y={330} text="CONTRATADO!" at={4} color="#20bf6b" size={92} rot={-6} />
      <Sting at={4} volume={0.2} />
    </Office>
  );
};

const PersonIcon: React.FC<{c: string; size: number}> = ({c, size}) => (
  <svg viewBox="0 0 100 120" width={size} height={size * 1.2}>
    <circle cx={50} cy={30} r={22} fill={c} stroke={INK} strokeWidth={7} />
    <path d="M14,116 Q14,62 50,60 Q86,62 86,116 Z" fill={c} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
  </svg>
);

const Fact: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = interpolate(frame, [125, 165], [0, 1.65], clamp);
  const hi = spring({frame: frame - 252, fps, config: {damping: 10}});
  return (
    <AbsoluteFill style={{background: '#2f3542'}}>
      <Title text="QUEM MENTE MAIS?" color="#fed330" top={150} size={90} />
      {frame >= 115 ? (
        <>
          <div style={{position: 'absolute', top: 270, left: 0, right: 0, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 180, color: '#fff', WebkitTextStroke: `12px ${INK}`, paintOrder: 'stroke fill'}}>{n.toFixed(2).replace('.', ',')}</div>
          {frame < 252 ? <div style={{position: 'absolute', top: 500, left: 0, right: 0, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 52, color: '#dfe4ea'}}>MENTIRAS POR DIA (MÉDIA)</div> : null}
        </>
      ) : (
        <div style={{position: 'absolute', top: 360, left: 0, right: 0, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 64, color: '#dfe4ea', opacity: interpolate(frame, [50, 62], [0, 1], clamp)}}>ESTUDO COM 1.000 ADULTOS</div>
      )}
      <div style={{position: 'absolute', left: 190, top: 650, width: 700, display: 'flex', flexWrap: 'wrap', gap: 22, justifyContent: 'center'}}>
        {Array.from({length: 20}).map((_, i) => {
          const show = frame > 175 + i * 2;
          const red = i === 7 && frame >= 252;
          return (
            <div key={i} style={{opacity: show ? (frame >= 252 && !red ? 0.35 : 1) : 0, transform: red ? `scale(${1 + hi * 0.5})` : undefined, zIndex: red ? 2 : 1}}>
              <PersonIcon c={red ? '#ff4757' : '#dfe4ea'} size={100} />
            </div>
          );
        })}
      </div>
      <Stamp x={540} y={540} text="5% = QUASE METADE DAS MENTIRAS" at={258} color="#ff4757" size={46} rot={-3} />
      <Pop at={252} />
      <div style={{position: 'absolute', top: 1540, left: 60, right: 60, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 32, color: '#a4b0be'}}>Fonte: Serota, Levine &amp; Boster (2010), Human Communication Research</div>
    </AbsoluteFill>
  );
};

const Power: React.FC = () => {
  const frame = useCurrentFrame();
  const crowd: [number, number, number][] = [[120, 1080, 0], [320, 1020, 1], [760, 1020, 2], [960, 1080, 3]];
  return (
    <AbsoluteFill style={{background: '#192a56'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 55%, rgba(254,211,48,0.55) 0%, rgba(25,42,86,0) 45%)'}} />
      {crowd.map(([x, y, i]) => (
        <React.Fragment key={i}>
          <Person x={x} y={y} scale={0.9} skin={['#8d5524', '#ffdbac', '#c68642', '#e0ac69'][i]} shirt={['#45aaf2', '#fd9644', '#a55eea', '#26de81'][i]} hair={i % 2 ? 'long' : 'short'} hairColor="#2d3436" emotion={frame >= 95 + i * 8 ? 'happy' : 'neutral'} lookX={x < 540 ? 1 : -1} dim={0.15} />
          <MouthLock x={x} y={y} scale={0.9} at={0} />
          {frame >= 95 + i * 8 ? <Stamp x={x} y={y - 380} text="✓" at={95 + i * 8} color="#20bf6b" size={56} rot={0} /> : null}
          <Pop at={95 + i * 8} />
        </React.Fragment>
      ))}
      <Person {...ME} x={540} y={1280} scale={1.8} emotion="smirk" />
      <MouthLock x={540} y={1280} scale={1.8} at={0} open />
      <Stamp x={540} y={300} text="VOCÊ = 5%" at={40} color="#fed330" size={100} rot={-4} />
    </AbsoluteFill>
  );
};

const DinerBg: React.FC<{frame: number}> = ({frame}) => (
  <AbsoluteFill style={{background: '#2c2c54'}}>
    <div style={{position: 'absolute', left: 60, top: 220, width: 960, height: 520, background: '#1e2a4a', border: `10px solid ${INK}`, borderRadius: 20}}>
      <div style={{position: 'absolute', left: 860, top: 40, width: 70, height: 70, borderRadius: 35, background: '#f5f6fa', border: `5px solid ${INK}`}} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: 60 + i * 280, top: 260, width: 200, height: 260, background: '#27324f', border: `6px solid ${INK}`}} />
      ))}
    </div>
    <div style={{position: 'absolute', left: 300, top: 110, width: 480, height: 110, borderRadius: 30, border: '10px solid #ff4d6d', boxShadow: `0 0 ${frame % 50 < 44 ? 40 : 0}px #ff4d6d`, fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#ffccd5', display: 'flex', alignItems: 'center', justifyContent: 'center', textShadow: '0 0 20px #ff4d6d', opacity: frame % 50 < 44 ? 1 : 0.6}}>LANCHES</div>
    <Floor color="#40407a" y={1180} />
  </AbsoluteFill>
);

const Diner: React.FC = () => {
  const frame = useCurrentFrame();
  const lx = interpolate(frame, [50, 85], [1350, 780], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <DinerBg frame={frame} />
      <Person {...ME} x={300} y={1220} scale={1.6} emotion={frame > 85 ? 'worried' : 'happy'} lookX={frame > 60 ? 1 : 0} />
      <Person {...LEO} x={lx} y={1220} scale={1.6} emotion="worried" lookX={-1} />
      <div style={{position: 'absolute', left: 80, top: 1060, width: 920, height: 70, background: '#d1d8e0', border: `10px solid ${INK}`, borderRadius: 16}} />
      <div style={{position: 'absolute', left: 230, top: 990, width: 70, height: 80, background: '#ff4757', border: `7px solid ${INK}`, borderRadius: '8px 8px 16px 16px'}} />
      <div style={{position: 'absolute', left: 400, top: 1010, width: 130, height: 60, background: '#e1b12c', border: `7px solid ${INK}`, borderRadius: '60px 60px 12px 12px'}} />
    </AbsoluteFill>
  );
};

const CloseNight: React.FC<{children: React.ReactNode; tint?: string}> = ({children, tint = '#3c4f7d'}) => (
  <AbsoluteFill style={{background: '#1e2a4a'}}>
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, ${tint} 0%, #1e2a4a 60%)`}} />
    {children}
  </AbsoluteFill>
);

const Heart: React.FC<{size: number; label?: string}> = ({size, label}) => (
  <div style={{position: 'relative', width: size, height: size * 0.9}}>
    <svg viewBox="0 0 60 54" width={size} height={size * 0.9}><path d="M30,52 C-10,25 5,0 30,15 C55,0 70,25 30,52 Z" fill="#ff4757" stroke={INK} strokeWidth={4} /></svg>
    {label ? <div style={{position: 'absolute', left: 0, right: 0, top: size * 0.22, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: size * 0.26, color: '#fff'}}>{label}</div> : null}
  </div>
);

const Ask: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const h = spring({frame: frame - 40, fps, config: {damping: 9}});
  return (
    <CloseNight tint="#574b90">
      <Person {...LEO} x={540} y={2050} scale={4.2} emotion="worried" talking={frame > 3 && frame < 124} lookX={0.2} bob={false} />
      {frame >= 40 ? (
        <div style={{position: 'absolute', left: 760, top: 230 + Math.sin(frame / 7) * 10, transform: `scale(${h}) rotate(10deg)`}}>
          <Heart size={240} label="BIA" />
        </div>
      ) : null}
      <Pop at={40} />
    </CloseNight>
  );
};

const Memory: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{filter: 'sepia(0.55) saturate(1.2)'}}>
      <Room wall="#f6e58d" floor="#cc8e35" />
      <div style={{position: 'absolute', left: 120, top: 300, width: 840, height: 380, background: '#2d6a4f', border: `14px solid #8d6e63`, borderRadius: 12}}>
        <div style={{position: 'absolute', left: 40, top: 40, fontFamily: 'DejaVu Serif', fontStyle: 'italic', fontSize: 58, color: '#f5f6fa'}}>Bem-vindos!</div>
      </div>
      <Title text="1º DIA DE AULA" color="#fff" top={140} size={84} />
      <Person {...BIA} x={760} y={1250} scale={1.4} emotion="happy" lookX={-1} />
      <Person {...ME} x={300} y={1260} scale={1.45} emotion="happy" lookX={1} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: 280 + i * 60, top: 640 - ((frame * 3 + i * 30) % 160), opacity: 1 - ((frame * 3 + i * 30) % 160) / 160}}>
          <Heart size={70} />
        </div>
      ))}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 45%, rgba(60,40,20,0.5) 90%)'}} />
    </AbsoluteFill>
  );
};

const Panel: React.FC<{left: number; at: number; title: string; color: string; children: React.ReactNode}> = ({left, at, title, color, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 13}});
  return (
    <div style={{position: 'absolute', left, top: 430, width: 500, height: 760, background: color, border: `10px solid ${INK}`, borderRadius: 30, overflow: 'hidden', transform: `translateY(${(1 - p) * 300}px)`, opacity: p}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 24, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 64, color: '#fff', WebkitTextStroke: `8px ${INK}`, paintOrder: 'stroke fill'}}>{title}</div>
      {children}
    </div>
  );
};

const Dilemma: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#2f3640'}}>
      <Title text="SÓ VOCÊ PODE ESCOLHER" color="#fed330" top={150} size={78} />
      {frame < 96 ? (
        <>
          <Person {...ME} x={540} y={1250} scale={1.8} emotion="worried" />
          <MouthLock x={540} y={1250} scale={1.8} at={0} open />
        </>
      ) : null}
      <Panel left={30} at={96} title="VERDADE" color="#4b6584">
        <Person {...ME} x={150} y={700} scale={1.1} emotion="sad" lookX={1} />
        <Person {...LEO} x={370 + Math.min(60, Math.max(0, frame - 110) * 1.5)} y={700} scale={1.1} emotion="sad" flip lookX={1} />
      </Panel>
      <Panel left={550} at={158} title="MENTIRA" color="#20bf6b">
        <Person {...ME} x={160} y={700} scale={1.1} emotion="smirk" lookX={1} />
        <Person {...LEO} x={350} y={700} scale={1.1} emotion="happy" lookX={-1} />
      </Panel>
      <Pop at={96} /><Pop at={158} />
    </AbsoluteFill>
  );
};

const Lie: React.FC = () => {
  const frame = useCurrentFrame();
  const dark = interpolate(frame, [30, 60], [0.3, 0.75], clamp);
  return (
    <CloseNight tint="#2c3e50">
      <Person {...ME} x={540} y={2050} scale={4.2} emotion={frame > 70 ? 'sad' : 'neutral'} talking={frame > 36 && frame < 82} lookX={-0.1} bob={false} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 30%, rgba(0,0,0,${dark}) 80%)`}} />
      <Sting at={38} volume={0.7} />
    </CloseNight>
  );
};

const Twist: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const vib = frame >= 40 && frame < 80 ? Math.sin(frame * 3) * 10 : 0;
  const glow = interpolate(frame, [40, 60], [0, 1], clamp);
  const clock = frame < 10 ? '23:59' : '00:00';
  const msgs: [string, number][] = [['eu sei que você mentiu.', 108], ['eu também conseguia.', 148]];
  return (
    <AbsoluteFill style={{background: '#0f1123'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 65% 40%, rgba(116,185,255,${0.35 * glow}) 0%, rgba(15,17,35,0) 55%)`}} />
      <div style={{position: 'absolute', left: 90, top: 150, background: '#000', border: `8px solid ${INK}`, borderRadius: 18, padding: '10px 28px', fontFamily: 'DejaVu Sans Mono', fontWeight: 700, fontSize: 90, color: '#ff4757', textShadow: '0 0 20px #ff4757'}}>{clock}</div>
      <Person {...ME} x={280} y={1560} scale={2.3} emotion={frame >= 148 ? 'scared' : frame >= 108 ? 'shocked' : 'worried'} lookX={1} lookY={0.3} dim={0.35 - 0.25 * glow} bob={false} />
      {/* celular */}
      <div style={{position: 'absolute', left: 560 + vib, top: 330, width: 470, height: 640, background: INK, borderRadius: 50, transform: `rotate(${4 + vib * 0.3}deg)`}}>
        <div style={{position: 'absolute', left: 22, right: 22, top: 30, bottom: 30, background: '#dfe6e9', borderRadius: 34, overflow: 'hidden'}}>
          <div style={{height: 100, background: '#a55eea', display: 'flex', alignItems: 'center', paddingLeft: 30, gap: 18, borderBottom: `6px solid ${INK}`}}>
            <div style={{width: 60, height: 60, borderRadius: 30, background: '#e0ac69', border: `5px solid ${INK}`}} />
            <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 48, color: '#fff'}}>Bia</div>
          </div>
          {msgs.map(([t, at], i) => {
            if (frame < at) return null;
            const p = spring({frame: frame - at, fps, config: {damping: 12}});
            return (
              <div key={i} style={{position: 'absolute', left: 24, top: 140 + i * 200, maxWidth: 370, background: '#fff', border: `6px solid ${INK}`, borderRadius: '30px 30px 30px 6px', padding: '18px 24px', fontFamily: 'Inter', fontWeight: 800, fontSize: 44, color: INK, transform: `scale(${p})`, transformOrigin: '0% 100%'}}>{t}</div>
            );
          })}
        </div>
      </div>
      <Pop at={108} />
      <Sting at={148} volume={0.75} />
      <Flash at={148} len={6} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#273c75'}}>
      <Title text="VOCÊ MENTIRIA PRA NÃO PERDER SEU MELHOR AMIGO?" color="#fff" top={130} size={72} />
      <div style={{position: 'absolute', left: 120, top: 500, width: 380, height: 130, borderRadius: 40, background: '#20bf6b', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#fff'}}>SIM</div>
      <div style={{position: 'absolute', left: 580, top: 500, width: 380, height: 130, borderRadius: 40, background: '#ff4757', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#fff'}}>NÃO</div>
      <Person {...ME} x={320} y={1200} scale={1.5} emotion="worried" lookX={1} />
      <Person {...LEO} x={640} y={1200} scale={1.5} emotion="happy" lookX={-1} />
      <Stamp x={900} y={900} text="PARTE 2?" at={20} color="#fed330" size={48} rot={8} />
      <div style={{position: 'absolute', left: 140, right: 140, top: 1470, height: 110, borderRadius: 55, background: '#fed330', border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 56, color: INK, transform: `scale(${1 + Math.sin(frame / 5) * 0.03})`}}>@hipoteticamente.br</div>
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook, news: News, bakery: Bakery, bus: Bus, test: Test, interview: Interview, hired: Hired, fact: Fact,
  power: Power, diner: Diner, ask: Ask, memory: Memory, dilemma: Dilemma, lie: Lie, twist: Twist, cta: Cta,
};
