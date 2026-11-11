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


// ---------- peças novas (Parte 2) ----------
const Phone: React.FC<{name: string; color: string; avatar: string; msgs: [string, number][]; left?: number; top?: number; vib?: number}> = ({name, color, avatar, msgs, left = 560, top = 330, vib = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', left: left + vib, top, width: 470, height: 640, background: INK, borderRadius: 50, transform: `rotate(${4 + vib * 0.3}deg)`}}>
      <div style={{position: 'absolute', left: 22, right: 22, top: 30, bottom: 30, background: '#dfe6e9', borderRadius: 34, overflow: 'hidden'}}>
        <div style={{height: 100, background: color, display: 'flex', alignItems: 'center', paddingLeft: 30, gap: 18, borderBottom: `6px solid ${INK}`}}>
          <div style={{width: 60, height: 60, borderRadius: 30, background: avatar, border: `5px solid ${INK}`}} />
          <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 48, color: '#fff'}}>{name}</div>
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
  );
};

const Lamp: React.FC<{x: number}> = ({x}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <div style={{position: 'absolute', left: x - 260, top: 380, width: 520, height: 900, background: 'radial-gradient(ellipse at 50% 12%, rgba(254,211,48,0.42) 0%, rgba(254,211,48,0) 65%)', opacity: 0.85 + Math.sin(frame / 9) * 0.05}} />
      <div style={{position: 'absolute', left: x - 11, top: 440, width: 22, height: 800, background: '#636e72', border: `6px solid ${INK}`, borderRadius: 8}} />
      <div style={{position: 'absolute', left: x - 70, top: 400, width: 140, height: 50, background: '#fed330', border: `7px solid ${INK}`, borderRadius: '30px 30px 8px 8px'}} />
    </>
  );
};

const DayDiner: React.FC<{children?: React.ReactNode; front?: React.ReactNode; dark?: number}> = ({children, front, dark = 0}) => (
  <AbsoluteFill style={{background: '#ffeaa7'}}>
    <div style={{position: 'absolute', left: 60, top: 220, width: 960, height: 520, background: '#74b9ff', border: `10px solid ${INK}`, borderRadius: 20, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 740, top: 40, width: 110, height: 110, borderRadius: 55, background: '#fed330', border: `6px solid ${INK}`}} />
      <div style={{position: 'absolute', left: 80, top: 90, width: 200, height: 70, borderRadius: 40, background: '#fff', border: `6px solid ${INK}`}} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: 40 + i * 300, top: 300, width: 220, height: 240, background: ['#f8c291', '#b8e994', '#e58e26'][i], border: `6px solid ${INK}`}} />
      ))}
    </div>
    <div style={{position: 'absolute', left: 300, top: 110, width: 480, height: 110, borderRadius: 30, border: '10px solid #d63031', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#d63031', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff5f5'}}>LANCHES</div>
    <Floor color="#c8d6e5" y={1180} />
    {children}
    <div style={{position: 'absolute', left: 80, top: 1060, width: 920, height: 70, background: '#d1d8e0', border: `10px solid ${INK}`, borderRadius: 16}} />
    <div style={{position: 'absolute', left: 230, top: 990, width: 70, height: 80, background: '#ff4757', border: `7px solid ${INK}`, borderRadius: '8px 8px 16px 16px'}} />
    <div style={{position: 'absolute', left: 400, top: 1010, width: 130, height: 60, background: '#e1b12c', border: `7px solid ${INK}`, borderRadius: '60px 60px 12px 12px'}} />
    {front}
    {dark ? <AbsoluteFill style={{background: `rgba(10,12,30,${dark})`}} /> : null}
  </AbsoluteFill>
);

const Bouquet: React.FC<{x: number; y: number; size?: number; wilt?: number}> = ({x, y, size = 1, wilt = 0}) => (
  <svg viewBox="0 0 140 170" width={140 * size} height={170 * size} style={{position: 'absolute', left: x - 70 * size, top: y - 150 * size, overflow: 'visible'}}>
    {[-1, 0, 1].map((k) => (
      <g key={k} transform={`rotate(${k * 22 + k * wilt * 34} 70 160)`}>
        <line x1={70} y1={160} x2={70} y2={64} stroke="#27ae60" strokeWidth={9} strokeLinecap="round" />
        <circle cx={70} cy={44} r={30} fill={['#ff6b81', '#fed330', '#a55eea'][k + 1]} stroke={INK} strokeWidth={6} />
        <circle cx={70} cy={44} r={11} fill="#fff5e6" stroke={INK} strokeWidth={4} />
      </g>
    ))}
    <path d="M38,120 L102,120 L84,168 L56,168 Z" fill="#f5f6fa" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  </svg>
);

// ---------- cenas ----------
const Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [80, 100], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#0f1123'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 65% 40%, rgba(116,185,255,${0.35 * glow}) 0%, rgba(15,17,35,0) 55%)`}} />
      <Title text="NA PARTE ANTERIOR" color="#fed330" top={130} size={84} />
      <div style={{position: 'absolute', left: 90, top: 360, background: '#000', border: `8px solid ${INK}`, borderRadius: 18, padding: '10px 28px', fontFamily: 'DejaVu Sans Mono', fontWeight: 700, fontSize: 90, color: '#ff4757', textShadow: '0 0 20px #ff4757'}}>00:00</div>
      <Person {...ME} x={280} y={1560} scale={2.3} emotion={frame >= 140 ? 'scared' : 'worried'} lookX={1} lookY={0.3} dim={0.35 - 0.25 * glow} bob={false} />
      <Phone name="Bia" color="#a55eea" avatar="#e0ac69" top={440} msgs={[['eu sei que você mentiu.', 100], ['eu também conseguia.', 134]]} />
      <Pop at={100} /><Pop at={134} />
      <Sting at={134} volume={0.4} />
    </AbsoluteFill>
  );
};

const NightWithLamp: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill>
    <Street night />
    <Lamp x={560} />
    {children}
  </AbsoluteFill>
);

const Door: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = spring({frame: frame - 48, fps, config: {damping: 12}});
  return (
    <NightWithLamp>
      <div style={{position: 'absolute', left: 30, top: 840, width: 220, height: 340, background: '#6d4c41', border: `9px solid ${INK}`, borderRadius: '24px 24px 0 0'}}>
        <div style={{position: 'absolute', right: 26, top: 170, width: 22, height: 22, borderRadius: 11, background: '#fed330', border: `4px solid ${INK}`}} />
      </div>
      <Person {...BIA} x={830} y={1290} scale={1.6} emotion="worried" lookX={-1} />
      <Person {...ME} x={400} y={1300} scale={1.6} emotion="shocked" lookX={1} enterAt={100} />
      {frame >= 48 ? (
        <div style={{position: 'absolute', left: 60, top: 230, width: 960, background: '#fff', border: `8px solid ${INK}`, borderRadius: 32, padding: '22px 30px', display: 'flex', gap: 24, alignItems: 'center', transform: `scale(${n})`, transformOrigin: '50% 0%', boxShadow: `0 10px 0 ${INK}`}}>
          <div style={{width: 84, height: 84, borderRadius: 42, background: '#e0ac69', border: `6px solid ${INK}`, flexShrink: 0}} />
          <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 50, lineHeight: 1.1, color: INK}}><span style={{color: '#a55eea'}}>Bia</span><br />desce. tô na frente da sua casa.</div>
        </div>
      ) : null}
      <Pop at={48} /><Pop at={100} />
    </NightWithLamp>
  );
};

const Confess: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - 58, fps, config: {damping: 13}});
  return (
    <NightWithLamp>
      <Person {...ME} x={250} y={1330} scale={1.4} emotion={frame >= 168 ? 'shocked' : 'worried'} lookX={1} />
      <Person {...BIA} x={800} y={1330} scale={1.4} emotion="sad" lookX={-1} talking={(frame > 6 && frame < 50) || (frame > 62 && frame < 128) || (frame > 134 && frame < 165)} />
      {frame >= 58 ? (
        <div style={{position: 'absolute', left: 70, top: 220, width: 940, height: 560, background: '#ffeaa7', border: `10px solid ${INK}`, borderRadius: 30, overflow: 'hidden', transform: `scale(${p})`, transformOrigin: '50% 100%'}}>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 90, background: '#cd6133', borderTop: `8px solid ${INK}`}} />
          <div style={{position: 'absolute', left: 24, top: 18, background: '#fed330', border: `6px solid ${INK}`, borderRadius: 14, padding: '2px 18px', fontFamily: 'Inter', fontWeight: 900, fontSize: 40, color: INK}}>HOJE CEDO</div>
          <Person {...LEO} x={250} y={520} scale={0.85} emotion="worried" lookX={1} talking={frame > 80 && frame < 128} />
          <Person {...BIA} x={690} y={520} scale={0.85} emotion="neutral" lookX={-1} talking={frame > 134 && frame < 165} />
          <Bubble x={250} y={235} text="VOCÊ GOSTA DE ALGUÉM?" at={82} w={380} size={38} tail="center" />
          <Bubble x={690} y={235} text="NÃO." at={134} w={240} size={54} tail="center" />
          <MouthLock x={690} y={520} scale={0.85} at={136} open size={80} />
        </div>
      ) : null}
      <Stamp x={540} y={940} text="MENTIRA" at={168} color="#ff4757" size={96} rot={-6} />
      <Pop at={58} /><Pop at={82} /><Pop at={134} /><Pop at={168} />
    </NightWithLamp>
  );
};

const TwoLies: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const h = spring({frame: frame - 80, fps, config: {damping: 9}});
  return (
    <NightWithLamp>
      <Person {...ME} x={270} y={1300} scale={1.7} emotion={frame >= 80 ? 'worried' : 'shocked'} lookX={1} />
      <MouthLock x={270} y={1300} scale={1.7} at={4} open />
      <Person {...BIA} x={810} y={1300} scale={1.7} emotion={frame >= 80 ? 'worried' : 'shocked'} lookX={-1} />
      <MouthLock x={810} y={1300} scale={1.7} at={20} open />
      <Stamp x={540} y={330} text="2 MENTIRAS" at={14} color="#fed330" size={100} rot={-4} />
      {frame >= 80 ? (
        <div style={{position: 'absolute', left: 420, top: 680 + Math.sin(frame / 7) * 10, transform: `scale(${h})`}}>
          <Heart size={240} />
        </div>
      ) : null}
      <Pop at={4} /><Pop at={20} /><Pop at={80} />
    </NightWithLamp>
  );
};

const Fact: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = Math.round(interpolate(frame, [50, 120], [0, 206], {...clamp, easing: ease}));
  const pct = Math.round(interpolate(frame, [130, 190], [0, 54], {...clamp, easing: ease}));
  const coin = Math.cos(Math.max(0, frame - 215) * 0.5);
  const s = spring({frame: frame - 215, fps, config: {damping: 10}});
  return (
    <AbsoluteFill style={{background: '#2f3542'}}>
      <Title text="QUEM PEGA UMA MENTIRA?" color="#fed330" top={140} size={84} />
      {frame < 126 ? (
        frame >= 48 ? (
          <>
            <div style={{position: 'absolute', top: 330, left: 0, right: 0, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 200, color: '#fff', WebkitTextStroke: '12px #1b1b2f', paintOrder: 'stroke fill'}}>{n}</div>
            <div style={{position: 'absolute', top: 590, left: 0, right: 0, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 56, color: '#dfe4ea'}}>ESTUDOS JUNTADOS</div>
          </>
        ) : null
      ) : (
        <>
          <div style={{position: 'absolute', top: 330, left: 0, right: 0, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 200, color: '#fed330', WebkitTextStroke: '12px #1b1b2f', paintOrder: 'stroke fill'}}>{pct}%</div>
          <div style={{position: 'absolute', top: 590, left: 0, right: 0, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 50, color: '#dfe4ea'}}>DAS MENTIRAS DESCOBERTAS</div>
          <div style={{position: 'absolute', left: 140, top: 700, width: 800, height: 80, background: '#57606f', border: `8px solid ${INK}`, borderRadius: 20, overflow: 'hidden'}}>
            <div style={{width: `${(pct / 100) * 800}px`, height: '100%', background: '#ff4757'}} />
          </div>
          <div style={{position: 'absolute', left: 140 + 400 - 4, top: 680, width: 8, height: 120, background: '#fff'}} />
          <div style={{position: 'absolute', left: 140 + 400 - 150, top: 806, width: 300, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 36, color: '#fff'}}>50% = CHUTE</div>
        </>
      )}
      {frame >= 215 ? (
        <>
          <div style={{position: 'absolute', left: 440, top: 880, width: 200, height: 200, borderRadius: 100, background: '#fed330', border: `10px solid ${INK}`, transform: `scaleX(${coin}) scale(${s})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 110, color: INK}}>?</div>
          <Stamp x={540} y={1150} text="QUASE CARA OU COROA" at={222} color="#ff4757" size={44} rot={-3} />
        </>
      ) : null}
      <div style={{position: 'absolute', top: 1500, left: 50, right: 50, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 31, color: '#a4b0be'}}>Fonte: Bond &amp; DePaulo (2006), Personality and Social Psychology Review — 206 estudos, 24.483 pessoas</div>
      <Pop at={48} /><Pop at={130} /><Pop at={215} />
      <Sting at={215} volume={0.3} />
    </AbsoluteFill>
  );
};

const Choice: React.FC = () => (
  <AbsoluteFill style={{background: '#2f3640'}}>
    <Title text="VOCÊS DECIDEM" color="#fed330" top={150} size={84} />
    <Panel left={30} at={22} title="CALAR" color="#4b6584">
      <Person {...ME} x={150} y={720} scale={1.0} emotion="neutral" lookX={1} />
      <Person {...BIA} x={360} y={720} scale={1.0} emotion="neutral" lookX={-1} />
      <MouthLock x={150} y={720} scale={1.0} at={30} />
      <MouthLock x={360} y={720} scale={1.0} at={36} />
    </Panel>
    <Panel left={550} at={108} title="CONTAR" color="#20bf6b">
      <Person {...ME} x={150} y={720} scale={1.0} emotion="worried" lookX={1} />
      <Person {...BIA} x={360} y={720} scale={1.0} emotion="worried" lookX={-1} />
      <MouthLock x={150} y={720} scale={1.0} at={116} open />
      <MouthLock x={360} y={720} scale={1.0} at={122} open />
    </Panel>
    <Pop at={22} /><Pop at={108} />
  </AbsoluteFill>
);

const Flowers: React.FC = () => {
  const frame = useCurrentFrame();
  const lx = interpolate(frame, [58, 98], [1350, 830], {...clamp, easing: ease});
  return (
    <DayDiner front={<Bouquet x={lx + 84} y={1140} size={1.1} />}>
      <Person {...ME} x={230} y={1220} scale={1.5} emotion="worried" lookX={1} />
      <Person {...BIA} x={470} y={1220} scale={1.5} emotion="worried" lookX={1} />
      <Person {...LEO} x={lx} y={1220} scale={1.5} emotion="worried" lookX={-1} />
      <Stamp x={880} y={170} text="12:00" at={10} color="#fed330" size={60} rot={5} />
      <Pop at={10} /><Pop at={58} />
    </DayDiner>
  );
};

const StopScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cx = interpolate(frame, [98, 112], [230, 330], {...clamp, easing: ease});
  const cs = interpolate(frame, [98, 112], [1.5, 1.75], {...clamp, easing: ease});
  return (
    <DayDiner front={<Bouquet x={914} y={1140} size={1.1} />}>
      <Person {...BIA} x={560} y={1220} scale={1.5} emotion="worried" lookX={1} />
      <Person {...LEO} x={830} y={1220} scale={1.5} emotion="worried" lookX={-1} talking={frame > 36 && frame < 95} />
      <Person {...ME} x={cx} y={1220} scale={cs} emotion={frame >= 98 ? 'scared' : 'worried'} lookX={1} talking={frame > 106 && frame < 140} />
      {frame < 98 ? <Bubble x={800} y={640} text="BIA, EU PRECISO TE FALAR…" at={38} w={520} size={46} tail="right" /> : null}
      {frame >= 104 ? <Stamp x={540} y={420} text="LÉO, PARA!" at={104} color="#ff4757" size={100} rot={-5} /> : null}
      <Pop at={38} /><Pop at={104} />
      <Sting at={104} volume={0.35} />
    </DayDiner>
  );
};

const Truth: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const h = spring({frame: frame - 82, fps, config: {damping: 9}});
  return (
    <CloseNight tint="#8e6b4a">
      <Person {...ME} x={540} y={2050} scale={4.2} emotion={frame >= 82 ? 'happy' : 'sad'} talking={frame > 6 && frame < 142} lookX={0.1} bob={false} />
      <Stamp x={300} y={360} text="EU MENTI" at={50} color="#ff4757" size={78} rot={-8} />
      {frame >= 82 ? (
        <div style={{position: 'absolute', left: 740, top: 200 + Math.sin(frame / 7) * 10, transform: `scale(${h}) rotate(10deg)`}}>
          <Heart size={240} label="BIA" />
        </div>
      ) : null}
      <Pop at={50} /><Pop at={82} />
    </CloseNight>
  );
};

const Silence: React.FC = () => {
  const frame = useCurrentFrame();
  const wilt = interpolate(frame, [40, 120], [0, 1], clamp);
  const hand = frame < 118 ? frame * 1.2 : 141.6 + (frame - 118) * 16;
  return (
    <DayDiner
      dark={0.38}
      front={
        <>
          <Bouquet x={720} y={1400} size={2.1} wilt={wilt} />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{position: 'absolute', left: 560 + i * 90, top: 1180 + ((frame * 3 + i * 40) % 220), width: 22, height: 22, borderRadius: 11, background: ['#ff6b81', '#fed330', '#a55eea', '#ff6b81'][i], border: `4px solid ${INK}`, opacity: frame > 50 ? 1 : 0}} />
          ))}
        </>
      }
    >
      <Person {...LEO} x={440} y={1500} scale={2.6} emotion="sad" lookY={0.9} lookX={0.2} bob={false} />
      <div style={{position: 'absolute', left: 770, top: 250, width: 220, height: 220, borderRadius: 110, background: '#f5f6fa', border: `10px solid ${INK}`}}>
        <div style={{position: 'absolute', left: 99, top: 22, width: 8, height: 90, background: INK, borderRadius: 4, transformOrigin: '50% 88px', transform: `rotate(${hand}deg)`}} />
        <div style={{position: 'absolute', left: 99, top: 52, width: 8, height: 60, background: '#ff4757', borderRadius: 4, transformOrigin: '50% 58px', transform: `rotate(${hand / 12}deg)`}} />
        <div style={{position: 'absolute', left: 92, top: 92, width: 22, height: 22, borderRadius: 11, background: INK}} />
      </div>
      <Pop at={100} />
    </DayDiner>
  );
};

const LeoClose: React.FC = () => {
  const frame = useCurrentFrame();
  const dark = interpolate(frame, [0, 40], [0.2, 0.55], clamp);
  return (
    <CloseNight tint="#3c4f7d">
      <Person {...LEO} x={540} y={2050} scale={4.2} emotion="sad" talking={frame > 6 && frame < 98} lookX={0.1} lookY={0.2} bob={false} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 30%, rgba(0,0,0,${dark}) 80%)`}} />
      <Sting at={4} volume={0.3} />
    </CloseNight>
  );
};

const Hands: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const clasp = spring({frame: frame - 14, fps, config: {damping: 12}});
  return (
    <DayDiner
      front={
        <>
          <div style={{position: 'absolute', left: 462, top: 1074, width: 62, height: 46, borderRadius: 23, background: ME.skin, border: `5px solid ${INK}`, transform: `scale(${clasp})`}} />
          <div style={{position: 'absolute', left: 494, top: 1070, width: 56, height: 42, borderRadius: 21, background: BIA.skin, border: `5px solid ${INK}`, transform: `scale(${clasp})`}} />
        </>
      }
    >
      <Person {...ME} x={380} y={1220} scale={1.6} emotion="happy" lookX={1} />
      <Person {...BIA} x={620} y={1220} scale={1.6} emotion="happy" lookX={-1} talking={frame > 70 && frame < 106} />
      <Person {...LEO} x={930} y={1220} scale={1.2} emotion="sad" lookX={-1} />
      {frame >= 74 ? <Bubble x={620} y={600} text="EU GOSTO DELE." at={74} w={500} size={56} tail="center" /> : null}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: 470 + i * 50, top: 780 - ((frame * 3 + i * 30) % 170), opacity: frame > 20 ? 1 - ((frame * 3 + i * 30) % 170) / 170 : 0}}>
          <Heart size={70} />
        </div>
      ))}
      <Pop at={14} /><Pop at={74} />
    </DayDiner>
  );
};

const TextMsg: React.FC = () => {
  const frame = useCurrentFrame();
  const lx = interpolate(frame, [12, 74], [840, 1500], {...clamp, easing: ease});
  const vib = frame >= 112 && frame < 124 ? Math.sin(frame * 3) * 10 : 0;
  const glow = interpolate(frame, [96, 116], [0, 1], clamp);
  if (frame < 84) {
    return (
      <DayDiner front={<Bouquet x={700} y={1085} size={1.1} wilt={0.5} />}>
        <Person {...ME} x={230} y={1220} scale={1.5} emotion="sad" lookX={1} />
        <Person {...BIA} x={470} y={1220} scale={1.5} emotion="sad" lookX={1} />
        <Person {...LEO} x={lx} y={1220} scale={1.5} emotion="sad" lookX={1} />
        <Flash at={80} len={6} />
      </DayDiner>
    );
  }
  return (
    <AbsoluteFill style={{background: '#0f1123'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 65% 40%, rgba(116,185,255,${0.35 * glow}) 0%, rgba(15,17,35,0) 55%)`}} />
      <Stamp x={300} y={300} text="HORAS DEPOIS" at={86} color="#fed330" size={64} rot={-5} />
      <Person {...ME} x={280} y={1560} scale={2.3} emotion={frame >= 160 ? 'smirk' : 'worried'} lookX={1} lookY={0.3} dim={0.35 - 0.25 * glow} bob={false} />
      <Phone name="Léo" color="#4b7bec" avatar="#8d5524" top={400} vib={vib} msgs={[['amanhã, 7h, na quadra.', 126], ['você me deve um jogo.', 160]]} />
      <Pop at={126} /><Pop at={160} />
      <Sting at={84} volume={0.25} />
      <Flash at={84} len={6} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#273c75'}}>
      <Title text="VOCÊ PERDOARIA UM MELHOR AMIGO QUE MENTIU PRA VOCÊ?" color="#fff" top={110} size={62} />
      <div style={{position: 'absolute', left: 120, top: 560, width: 380, height: 130, borderRadius: 40, background: '#20bf6b', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#fff'}}>SIM</div>
      <div style={{position: 'absolute', left: 580, top: 560, width: 380, height: 130, borderRadius: 40, background: '#ff4757', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#fff'}}>NÃO</div>
      <Person {...ME} x={250} y={1230} scale={1.35} emotion="worried" lookX={1} />
      <Person {...BIA} x={540} y={1230} scale={1.35} emotion="happy" />
      <Person {...LEO} x={830} y={1230} scale={1.35} emotion="smirk" lookX={-1} />
      <div style={{position: 'absolute', left: 140, right: 140, top: 1470, height: 110, borderRadius: 55, background: '#fed330', border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 56, color: INK, transform: `scale(${1 + Math.sin(frame / 5) * 0.03})`}}>@hipoteticamente.br</div>
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  recap: Recap, door: Door, confess: Confess, twolies: TwoLies, fact: Fact, choice: Choice, flowers: Flowers,
  stop: StopScene, truth: Truth, silence: Silence, leo: LeoClose, hands: Hands, text: TextMsg, cta: Cta,
};
