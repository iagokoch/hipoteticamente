import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Person} from './Person';
import {INK, ME, MOM, Pop, Sting, Floor, Title, Room} from './lib';

// ---------- elenco ----------
const DAD = {skin: '#f2c29b', hair: 'short' as const, hairColor: '#636e72', mustache: true, shirt: '#778ca3', pants: '#2d3436'};
const ROSA = {skin: '#8d5524', hair: 'bun' as const, hairColor: '#1e1e1e', shirt: '#e15f41', pants: '#574b90'};
const WATER = '#4aa3df';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

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

const DayBadge: React.FC<{n: string}> = ({n}) => <Stamp x={540} y={200} text={n} at={0} color="#2f3542" size={84} rot={-4} />;

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

const Faucet: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <svg viewBox="0 0 220 200" width={220 * s} height={200 * s} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
    <rect x={0} y={20} width={60} height={60} rx={10} fill="#d1d8e0" stroke={INK} strokeWidth={8} />
    <path d="M60,32 L160,32 Q200,32 200,72 L200,110 L160,110 L160,80 Q160,70 150,70 L60,70 Z" fill="#d1d8e0" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <rect x={92} y={0} width={30} height={34} rx={6} fill="#ff4757" stroke={INK} strokeWidth={7} />
    <rect x={70} y={-12} width={74} height={18} rx={8} fill="#ff4757" stroke={INK} strokeWidth={7} />
  </svg>
);

const Drop: React.FC<{x: number; y: number; s?: number; color?: string}> = ({x, y, s = 1, color = WATER}) => (
  <svg viewBox="0 0 40 52" width={40 * s} height={52 * s} style={{position: 'absolute', left: x - 20 * s, top: y}}>
    <path d="M20,2 Q38,30 20,48 Q2,30 20,2 Z" fill={color} stroke={INK} strokeWidth={4} />
  </svg>
);

const Bucket: React.FC<{x: number; y: number; s?: number; fill?: number}> = ({x, y, s = 1, fill = 0}) => (
  <svg viewBox="0 0 120 130" width={120 * s} height={130 * s} style={{position: 'absolute', left: x - 60 * s, top: y - 130 * s, overflow: 'visible'}}>
    <path d="M24,22 Q60,-20 96,22" fill="none" stroke={INK} strokeWidth={7} />
    <clipPath id={`b${Math.round(x)}${Math.round(y)}`}><path d="M12,24 L108,24 L96,124 L24,124 Z" /></clipPath>
    <path d="M12,24 L108,24 L96,124 L24,124 Z" fill="#dfe4ea" />
    <rect x={0} y={124 - 100 * fill} width={120} height={100} fill={WATER} clipPath={`url(#b${Math.round(x)}${Math.round(y)})`} />
    <path d="M12,24 L108,24 L96,124 L24,124 Z" fill="none" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
  </svg>
);

const Baby: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <svg viewBox="0 0 120 90" width={120 * s} height={90 * s} style={{position: 'absolute', left: x - 60 * s, top: y - 45 * s, overflow: 'visible'}}>
    <ellipse cx={66} cy={56} rx={52} ry={30} fill="#fab1a0" stroke={INK} strokeWidth={6} />
    <circle cx={30} cy={40} r={26} fill="#8d5524" stroke={INK} strokeWidth={6} />
    <path d="M20,38 Q24,34 28,38 M34,38 Q38,34 42,38" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
  </svg>
);

// caixa d'água com régua
const Tank: React.FC<{x: number; y: number; level: number; s?: number; label?: boolean}> = ({x, y, level, s = 1, label = true}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 420 * s, height: 420 * s}}>
    <div style={{position: 'absolute', left: 0, top: 40 * s, width: 420 * s, height: 360 * s, background: '#1e90ff', border: `${10 * s}px solid ${INK}`, borderRadius: `${40 * s}px ${40 * s}px ${60 * s}px ${60 * s}px`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 50 * s, height: 14 * s, background: '#0c63c9'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 150 * s, height: 14 * s, background: '#0c63c9'}} />
    </div>
    <div style={{position: 'absolute', left: 40 * s, top: 0, width: 340 * s, height: 70 * s, background: '#0c63c9', border: `${10 * s}px solid ${INK}`, borderRadius: 30 * s}} />
    {/* régua */}
    <div style={{position: 'absolute', left: 440 * s, top: 60 * s, width: 70 * s, height: 320 * s, background: '#fff', border: `${8 * s}px solid ${INK}`, borderRadius: 18 * s, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${level * 100}%`, background: level > 0.5 ? '#20bf6b' : level > 0.2 ? '#f7b731' : '#ff4757'}} />
    </div>
    {label ? (
      <div style={{position: 'absolute', left: 380 * s, top: 400 * s, fontFamily: 'Inter', fontWeight: 900, fontSize: 52 * s, color: '#fff', WebkitTextStroke: `${7 * s}px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>{Math.round(level * 1000).toLocaleString('pt-BR')} L</div>
    ) : null}
  </div>
);

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

// ---------- cenas ----------
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const flowing = frame < 66;
  return (
    <AbsoluteFill>
      <Room wall="#c7ecee" floor="#95afc0" />
      <div style={{position: 'absolute', left: 380, top: 760, width: 620, height: 140, background: '#dfe4ea', border: `10px solid ${INK}`, borderRadius: 30}} />
      <Faucet x={380} y={340} s={1.6} />
      {flowing ? [0, 1, 2].map((i) => <Drop key={i} x={655} y={530 + ((frame * 14 + i * 70) % 220)} s={1.4} />) : null}
      {!flowing && frame < 100 ? <Drop x={655} y={520 + Math.min(20, (frame - 66) * 2)} s={1.0 - Math.min(0.6, (frame - 66) / 50)} /> : null}
      <Person {...ME} x={240} y={1230} scale={1.4} emotion={frame >= 66 ? 'shocked' : 'neutral'} lookX={1} lookY={-0.8} />
      <Stamp x={700} y={1020} text="NUNCA MAIS" at={112} color="#ff4757" size={70} rot={-6} />
      <Pop at={66} />
      <Sting at={112} volume={0.45} />
    </AbsoluteFill>
  );
};

const Shower: React.FC = () => {
  const frame = useCurrentFrame();
  const stop = frame >= 92;
  return (
    <AbsoluteFill>
      <Room wall="#81ecec" floor="#00cec9" />
      {/* azulejos */}
      {Array.from({length: 40}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: (i % 8) * 140, top: Math.floor(i / 8) * 140 + 160, width: 136, height: 136, border: '3px solid rgba(27,27,47,0.12)'}} />
      ))}
      <div style={{position: 'absolute', left: 520, top: 180, width: 30, height: 180, background: '#d1d8e0', border: `7px solid ${INK}`}} />
      <div style={{position: 'absolute', left: 440, top: 330, width: 190, height: 60, background: '#d1d8e0', border: `8px solid ${INK}`, borderRadius: '50% 50% 20px 20px'}} />
      {!stop ? Array.from({length: 9}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: 460 + i * 18, top: 400 + ((frame * 30 + i * 37) % 240), width: 8, height: 50, background: WATER, borderRadius: 4}} />
      )) : null}
      <Person {...ME} x={540} y={1330} scale={1.9} emotion={stop ? 'shocked' : 'happy'} lookY={stop ? -1 : 0} />
      {/* espuma na cabeça */}
      {[[440, 600, 70], [520, 570, 80], [610, 590, 72], [480, 545, 50], [580, 540, 54]].map(([x, y, r], i) => (
        <div key={i} style={{position: 'absolute', left: x - r / 2, top: y - r / 2 + Math.sin((frame + i * 9) / 7) * 3, width: r, height: r, borderRadius: r, background: '#fff', border: `5px solid ${INK}`}} />
      ))}
      {/* cortina */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 960, height: 260, background: '#fd79a8', borderTop: `10px solid ${INK}`, backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0) 0 70px, rgba(27,27,47,0.18) 70px 78px)'}} />
      <Sting at={92} volume={0.4} />
    </AbsoluteFill>
  );
};

const Group: React.FC = () => {
  const frame = useCurrentFrame();
  const msgs = ['Alguém tem água??', 'Aqui tb nada 😩', 'Ligaram pra companhia?', 'Bloco B seco', 'Até na padaria acabou', 'Gente e agora???'];
  const count = Math.min(40, Math.floor(interpolate(frame, [5, 90], [1, 40], clamp)));
  const places: [string, number, number][] = [['PRÉDIO', 112, 300], ['BAIRRO', 138, 540], ['CIDADE', 162, 780]];
  return (
    <AbsoluteFill style={{background: '#30336b'}}>
      <div style={{position: 'absolute', left: 190, top: 160, width: 700, height: 760, background: INK, borderRadius: 60}}>
        <div style={{position: 'absolute', left: 24, right: 24, top: 30, bottom: 30, background: '#ece5dd', borderRadius: 40, overflow: 'hidden'}}>
          <div style={{height: 110, background: '#128c7e', display: 'flex', alignItems: 'center', padding: '0 30px', gap: 20, borderBottom: `6px solid ${INK}`}}>
            <div style={{width: 64, height: 64, borderRadius: 32, background: '#fed330', border: `5px solid ${INK}`}} />
            <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 44, color: '#fff'}}>Condomínio</div>
            <div style={{marginLeft: 'auto', minWidth: 70, height: 70, borderRadius: 35, background: '#ff4757', border: `5px solid ${INK}`, fontFamily: 'Inter', fontWeight: 900, fontSize: 38, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{count}</div>
          </div>
          {msgs.map((m, i) => {
            const at = 6 + i * 13;
            if (frame < at) return null;
            const p = spring({frame: frame - at, fps: 30, config: {damping: 12}});
            return (
              <div key={i} style={{margin: '14px 24px', maxWidth: 520, background: '#fff', border: `5px solid ${INK}`, borderRadius: '24px 24px 24px 6px', padding: '10px 20px', fontFamily: 'Inter', fontWeight: 800, fontSize: 36, color: INK, transform: `scale(${p})`, transformOrigin: '0 100%'}}>{m}</div>
            );
          })}
        </div>
      </div>
      {places.map(([t, at, x], i) => (
        <React.Fragment key={i}>
          <Stamp x={x} y={1050} text={t} at={at} color="#4b6584" size={46} rot={i % 2 ? 4 : -4} />
          {frame >= at + 4 ? <div style={{position: 'absolute', left: x - 120, top: 1046, width: 240, height: 8, background: '#ff4757', opacity: 0.85, transform: 'rotate(-8deg)'}} /> : null}
          <Pop at={at} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

const Market: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#f8efba" floor="#d1ccc0" />
      {/* prateleira vazia */}
      {[0, 1, 2].map((r) => (
        <div key={r} style={{position: 'absolute', left: 60, top: 330 + r * 150, width: 960, height: 22, background: '#b33939', border: `6px solid ${INK}`}} />
      ))}
      <div style={{position: 'absolute', left: 500, top: 395, width: 64, height: 120, background: WATER, border: `7px solid ${INK}`, borderRadius: '20px 20px 12px 12px', opacity: 0.95}}>
        <div style={{position: 'absolute', left: 18, top: -30, width: 20, height: 26, background: '#2f3542', border: `5px solid ${INK}`}} />
      </div>
      <Stamp x={700} y={420} text="R$ 50,00" at={130} color="#ff4757" size={60} rot={6} />
      <Pop at={130} />
      {/* fila */}
      {Array.from({length: 6}).map((_, i) => (
        <Person key={i} x={120 + i * 160} y={1180 - (i % 2) * 10} scale={0.95} skin={['#8d5524', '#ffdbac', '#c68642', '#e0ac69', '#f2c29b', '#8d5524'][i]} shirt={['#45aaf2', '#fd9644', '#a55eea', '#26de81', '#fc5c65', '#fed330'][i]} hair={(['short', 'long', 'bun', 'spiky', 'long', 'bald'] as const)[i]} hairColor="#2d3436" emotion="worried" lookX={-1} />
      ))}
      <Person {...ME} x={900} y={1330} scale={1.5} emotion={frame >= 130 ? 'shocked' : 'sad'} lookX={-1} lookY={-0.4} />
      <DayBadge n="DIA 2" />
    </AbsoluteFill>
  );
};

const Card: React.FC<{x: number; at: number; label: string; children: React.ReactNode}> = ({x, at, label, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 12}});
  return (
    <div style={{position: 'absolute', left: x, top: 380, width: 300, height: 360, background: '#fff', border: `9px solid ${INK}`, borderRadius: 30, transform: `scale(${p}) rotate(${(x % 3) - 1}deg)`}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 30, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 26, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 40, color: INK}}>{label}</div>
      <svg viewBox="0 0 100 100" width={300} height={300} style={{position: 'absolute', left: 0, top: 20, opacity: frame > at + 10 ? 0.9 : 0}}>
        <path d="M18,18 L82,82 M82,18 L18,82" stroke="#ff4757" strokeWidth={10} strokeLinecap="round" />
      </svg>
    </div>
  );
};

const Chores: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#dff9fb" floor="#7ed6df" />
      <DayBadge n="DIA 3" />
      <Card x={40} at={88} label="ESCOVAR">
        <svg viewBox="0 0 160 60" width={200} height={80}><rect x={4} y={22} width={150} height={20} rx={10} fill="#45aaf2" stroke={INK} strokeWidth={6} /><rect x={110} y={4} width={40} height={22} rx={4} fill="#fff" stroke={INK} strokeWidth={5} /></svg>
      </Card>
      <Card x={390} at={110} label="DESCARGA">
        <svg viewBox="0 0 120 140" width={150} height={175}><rect x={20} y={4} width={80} height={50} rx={8} fill="#fff" stroke={INK} strokeWidth={6} /><path d="M10,60 L110,60 Q110,110 60,110 Q10,110 10,60 Z" fill="#fff" stroke={INK} strokeWidth={6} /><rect x={40} y={108} width={40} height={28} fill="#fff" stroke={INK} strokeWidth={6} /></svg>
      </Card>
      <Card x={740} at={138} label="CAFÉ">
        <svg viewBox="0 0 140 120" width={170} height={145}><path d="M14,30 L100,30 L92,110 L22,110 Z" fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><path d="M100,48 Q132,48 128,74 Q124,96 96,92" fill="none" stroke={INK} strokeWidth={6} /><path d="M40,4 Q50,14 40,24 M64,4 Q74,14 64,24" fill="none" stroke="#a4b0be" strokeWidth={5} /></svg>
      </Card>
      <Pop at={88} /><Pop at={110} /><Pop at={138} />
      <Person {...ME} x={540} y={1290} scale={1.5} emotion={frame >= 138 ? 'shocked' : 'sad'} />
    </AbsoluteFill>
  );
};

const Roof: React.FC<{night?: boolean; children: React.ReactNode}> = ({night, children}) => (
  <AbsoluteFill style={{background: night ? '#1e2a4a' : '#74b9ff'}}>
    {night ? Array.from({length: 18}).map((_, i) => <div key={i} style={{position: 'absolute', left: (i * 173) % 1040, top: 120 + ((i * 97) % 500), width: 8, height: 8, borderRadius: 4, background: '#f5f6fa'}} />) : (
      <div style={{position: 'absolute', left: 120, top: 330, width: 200, height: 80, borderRadius: 40, background: '#fff', border: `6px solid ${INK}`}} />
    )}
    {/* prédios ao fundo */}
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} style={{position: 'absolute', left: i * 230 - 20, top: 820 + (i % 2) * 60, width: 210, height: 600, background: night ? '#27324f' : '#a4b0be', border: `6px solid ${INK}`}} />
    ))}
    <Floor color={night ? '#57606f' : '#b2bec3'} y={1180} />
    {children}
  </AbsoluteFill>
);

const TankScene: React.FC = () => {
  const frame = useCurrentFrame();
  const level = interpolate(frame, [118, 140], [0, 1], {...clamp, easing: ease});
  return (
    <Roof>
      <Tank x={330} y={560} level={frame >= 100 ? level : 0} s={1.15} label={frame >= 100} />
      <Person {...ME} x={190} y={1330} scale={1.5} emotion={frame >= 118 ? 'happy' : 'neutral'} lookX={1} lookY={-0.6} />
      <Title text="O SEGREDO DO VÔ" color="#fed330" top={170} size={84} at={6} />
      <Pop at={100} /><Pop at={118} />
    </Roof>
  );
};

const Fact: React.FC = () => {
  const frame = useCurrentFrame();
  const pct = interpolate(frame, [60, 165], [100, 3], {...clamp, easing: ease});
  const pumps = frame >= 280;
  const H = 520;
  return (
    <AbsoluteFill style={{background: '#2f3542'}}>
      <Title text="CANTAREIRA, 2014" color="#fed330" top={140} size={84} />
      {/* represa */}
      <div style={{position: 'absolute', left: 90, top: 380, width: 900, height: H, background: '#cc8e35', border: `10px solid ${INK}`, borderRadius: '0 0 120px 120px', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${Math.max(pct, 0) * 0.82 + 12}%`, background: WATER, borderTop: `8px solid #1e6fa8`}} />
        {/* faixa do volume morto */}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: '12%', background: pumps ? '#0c63c9' : 'rgba(12,99,201,0.6)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: '12%', height: 0, borderTop: '6px dashed #fff'}} />
      </div>
      {/* comporta */}
      <div style={{position: 'absolute', left: 860, top: 380 + H * 0.2, width: 50, height: H * 0.68 - 20, background: '#57606f', border: `7px solid ${INK}`}} />
      <div style={{position: 'absolute', top: 470, left: 0, right: 0, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 200, color: '#fff', WebkitTextStroke: `12px ${INK}`, paintOrder: 'stroke fill'}}>{Math.round(pct)}%</div>
      {pumps ? (
        <>
          <Stamp x={540} y={1010} text="VOLUME MORTO" at={280} color="#0c63c9" size={64} rot={-3} />
          {[260, 820].map((x, i) => (
            <div key={i} style={{position: 'absolute', left: x - 30, top: 760 - ((frame - 280) * 6 % 120), width: 60, height: 60, borderRadius: 30, background: '#fff', border: `5px solid ${INK}`, opacity: 0.85}} />
          ))}
        </>
      ) : null}
      <Pop at={280} />
      <Sting at={160} volume={0.35} />
      <div style={{position: 'absolute', top: 1530, left: 60, right: 60, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 32, color: '#a4b0be'}}>Fonte: Sabesp, via Exame (maio e outubro de 2014)</div>
    </AbsoluteFill>
  );
};

const Rule: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kitchen night />
      <DayBadge n="DIA 5" />
      <Person {...MOM} x={190} y={1180} scale={1.25} emotion="worried" lookX={1} />
      <Person {...DAD} x={540} y={1230} scale={1.55} emotion={frame > 40 ? 'worried' : 'neutral'} talking={frame > 6 && frame < 125} lookX={0.4} />
      <Person {...ME} x={890} y={1210} scale={1.35} emotion="worried" lookX={-1} />
      <Stamp x={540} y={420} text="SEGREDO" at={78} color="#2f3542" size={70} rot={-6} />
      <Pop at={78} />
    </AbsoluteFill>
  );
};

const DoorFrame: React.FC<{open: number; children?: React.ReactNode; shake?: number}> = ({open, children, shake = 0}) => (
  <AbsoluteFill style={{background: '#3d3d6b'}}>
    <Floor color="#2c2c54" y={1180} />
    <div style={{position: 'absolute', left: 230, top: 360, width: 620, height: 830, background: '#57606f', border: `12px solid ${INK}`}}>
      {children}
    </div>
    <div style={{position: 'absolute', left: 242 + shake, top: 372, width: 596 * (1 - open * 0.85), height: 806, background: '#b33939', borderRight: `10px solid ${INK}`, transformOrigin: '0 50%'}}>
      <div style={{position: 'absolute', right: 40, top: 400, width: 40, height: 40, borderRadius: 20, background: '#fed330', border: `6px solid ${INK}`, opacity: open < 0.5 ? 1 : 0}} />
      <div style={{position: 'absolute', left: 60, right: 60, top: 80, height: 260, border: `8px solid ${INK}`, borderRadius: 12, opacity: open < 0.5 ? 0.4 : 0}} />
    </div>
  </AbsoluteFill>
);

const Door: React.FC = () => {
  const frame = useCurrentFrame();
  const knock = frame >= 18 && frame < 48 ? Math.sin(frame * 3) * 6 : 0;
  const open = interpolate(frame, [62, 80], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <DoorFrame open={open} shake={knock}>
        <Person {...ROSA} x={310} y={810} scale={1.55} emotion="worried" />
        <Baby x={340} y={610} s={1.3} />
      </DoorFrame>
      <Pop at={20} /><Pop at={30} /><Pop at={40} />
      <Person {...ME} x={130} y={1400} scale={1.4} emotion={frame > 70 ? 'shocked' : 'neutral'} lookX={1} />
    </AbsoluteFill>
  );
};

const Ask: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#3d3d6b'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #6c5ce7 0%, #3d3d6b 60%)'}} />
      <Person {...ROSA} x={540} y={2000} scale={3.8} emotion="worried" talking={frame > 3 && frame < 92} lookX={-0.2} bob={false} />
      <Baby x={860} y={1180} s={2.0} />
      {frame >= 72 ? (
        <div style={{position: 'absolute', left: 820, top: 300 + Math.sin(frame / 6) * 8, transform: `scale(${spring({frame: frame - 72, fps: 30, config: {damping: 9}})}) rotate(12deg)`}}>
          <svg viewBox="0 0 60 130" width={110} height={240}><rect x={14} y={4} width={32} height={26} rx={10} fill="#fab1a0" stroke={INK} strokeWidth={5} /><rect x={6} y={30} width={48} height={12} rx={4} fill="#a4b0be" stroke={INK} strokeWidth={5} /><rect x={8} y={42} width={44} height={84} rx={14} fill="#fff" stroke={INK} strokeWidth={5} /></svg>
        </div>
      ) : null}
      <Pop at={72} />
    </AbsoluteFill>
  );
};

const MathScene: React.FC = () => {
  const frame = useCurrentFrame();
  const lost = frame >= 98;
  return (
    <AbsoluteFill style={{background: '#2f3542'}}>
      <Title text="1.000 LITROS" color="#fff" top={160} size={100} />
      <Title text="≈ 10 DIAS" color="#fed330" top={290} size={90} at={40} />
      <div style={{position: 'absolute', left: 90, top: 540, width: 900, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center'}}>
        {Array.from({length: 10}).map((_, i) => {
          const show = frame > 40 + i * 4;
          const red = lost && i === 9;
          return (
            <div key={i} style={{width: 156, height: 156, borderRadius: 24, background: red ? '#ff4757' : WATER, border: `8px solid ${INK}`, opacity: show ? 1 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 60, color: '#fff', transform: red ? `translateY(${Math.min(40, (frame - 98) * 3)}px) rotate(${Math.min(12, frame - 98)}deg)` : undefined}}>
              {red ? '−1' : i + 1}
            </div>
          );
        })}
      </div>
      {lost ? <Bucket x={540} y={1180} s={1.2} fill={0.8} /> : null}
      <Pop at={98} />
    </AbsoluteFill>
  );
};

const Dad: React.FC = () => {
  const frame = useCurrentFrame();
  const shakeHead = frame > 8 && frame < 50 ? Math.sin(frame / 3) : 0;
  return (
    <AbsoluteFill>
      <Kitchen night />
      <Person {...DAD} x={340} y={1260} scale={1.7} emotion="sad" lookX={shakeHead} />
      <Person {...MOM} x={780} y={1240} scale={1.55} emotion="sad" lookY={1} lookX={-0.3} />
    </AbsoluteFill>
  );
};

const Fill: React.FC = () => {
  const frame = useCurrentFrame();
  const f = interpolate(frame, [40, 100], [0.05, 1], clamp);
  const level = interpolate(frame, [40, 100], [1, 0.9], clamp);
  return (
    <Roof night>
      <Tank x={360} y={560} level={level} s={1.1} />
      {frame >= 40 && frame < 102 ? <div style={{position: 'absolute', left: 452, top: 950, width: 22, height: 170, background: WATER, border: `4px solid ${INK}`, borderRadius: 8}} /> : null}
      <Bucket x={462} y={1195} s={1.3} fill={f} />
      <Person {...ME} x={190} y={1330} scale={1.5} emotion={frame >= 100 ? 'happy' : 'worried'} lookX={1} lookY={0.4} />
    </Roof>
  );
};

const Line: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [60, 120], [1.6, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{background: '#74b9ff'}}>
      <AbsoluteFill style={{transform: `scale(${reveal})`, transformOrigin: '20% 70%'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 820, bottom: 0, background: '#a4b0be', borderTop: `8px solid ${INK}`}} />
        {/* esquina */}
        <div style={{position: 'absolute', left: 860, top: 380, width: 200, height: 460, background: '#e58e26', border: `7px solid ${INK}`}} />
        <div style={{position: 'absolute', left: 900, top: 420, width: 120, height: 60, background: '#fed330', border: `5px solid ${INK}`, fontFamily: 'Inter', fontWeight: 900, fontSize: 30, color: INK, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>ESQUINA</div>
        {Array.from({length: 9}).map((_, i) => {
          const s = 1.15 - i * 0.08;
          const x = 260 + i * 80;
          const y = 1180 - i * 34;
          return (
            <React.Fragment key={i}>
              <Person x={x} y={y} scale={s} skin={['#8d5524', '#ffdbac', '#c68642', '#e0ac69', '#f2c29b'][i % 5]} shirt={['#45aaf2', '#fd9644', '#a55eea', '#26de81', '#fc5c65', '#fed330'][i % 6]} hair={(['short', 'long', 'bun', 'spiky', 'bald'] as const)[i % 5]} hairColor="#2d3436" emotion="neutral" lookX={-1} />
              <Bucket x={x + 70 * s} y={y - 70 * s} s={0.55 * s} />
            </React.Fragment>
          );
        }).reverse()}
        {/* porta aberta + Caio */}
        <div style={{position: 'absolute', left: -20, top: 420, width: 180, height: 800, background: '#57606f', border: `10px solid ${INK}`}} />
        <Person {...ME} x={110} y={1320} scale={1.5} emotion={frame >= 66 ? 'shocked' : 'neutral'} lookX={1} />
      </AbsoluteFill>
      <Sting at={66} volume={0.6} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#273c75'}}>
      <Title text="VOCÊ DIVIDIRIA A ÁGUA DA SUA FAMÍLIA?" color="#fff" top={140} size={78} />
      <div style={{position: 'absolute', left: 120, top: 470, width: 380, height: 130, borderRadius: 40, background: '#20bf6b', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#fff'}}>SIM</div>
      <div style={{position: 'absolute', left: 580, top: 470, width: 380, height: 130, borderRadius: 40, background: '#ff4757', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#fff'}}>NÃO</div>
      <Person {...ME} x={320} y={1200} scale={1.5} emotion="worried" lookX={1} />
      <Bucket x={470} y={1190} s={0.9} fill={0.9} />
      <Person {...ROSA} x={680} y={1200} scale={1.5} emotion="happy" lookX={-1} />
      <Stamp x={890} y={1010} text="PARTE 2?" at={20} color="#fed330" size={48} rot={8} />
      <div style={{position: 'absolute', left: 140, right: 140, top: 1470, height: 110, borderRadius: 55, background: '#fed330', border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 56, color: INK, transform: `scale(${1 + Math.sin(frame / 5) * 0.03})`}}>@hipoteticamente.br</div>
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook, shower: Shower, group: Group, market: Market, chores: Chores, tank: TankScene, fact: Fact, rule: Rule,
  door: Door, ask: Ask, math: MathScene, dad: Dad, fill: Fill, line: Line, cta: Cta,
};
