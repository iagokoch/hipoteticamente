import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Person} from './Person';
import {INK, ME, MOM, Pop, Sting, Floor, Title, Room} from './lib';

// Ep. 10 = Parte 3 da torneira seca: dia 30, o Guardião do Balde.

// ---------- elenco ----------
const DAD = {skin: '#f2c29b', hair: 'short' as const, hairColor: '#636e72', mustache: true, shirt: '#778ca3', pants: '#2d3436'};
const ROSA = {skin: '#8d5524', hair: 'bun' as const, hairColor: '#1e1e1e', shirt: '#e15f41', pants: '#574b90'};
const WATER = '#4aa3df';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

// ---------- peças (iguais às do Ep. 04) ----------
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


// ---------- elenco novo ----------
const SIND = {skin: '#f2c29b', hair: 'bald' as const, mustache: true, shirt: '#6c5ce7', pants: '#2d3436'};
const NEI = {skin: '#c68642', hair: 'spiky' as const, hairColor: '#1e1e1e', shirt: '#fd9644', pants: '#2d3436'};
const NEI2 = {skin: '#ffdbac', hair: 'long' as const, hairColor: '#b33939', shirt: '#a55eea', pants: '#3867d6'};
const THIEF = {skin: '#d1ccc0', hair: 'short' as const, hairColor: '#2d3436', hat: 'cap' as const, hatColor: '#2d3436', shirt: '#2f3542', pants: '#2f3542'};

const Crown: React.FC<{x: number; y: number; s: number; at?: number}> = ({x, y, s, at = 0}) => {
  const frame = useCurrentFrame();
  const t = ease(Math.min(1, Math.max(0, (frame - at) / 10)));
  return <div style={{position: 'absolute', left: x, top: y - 200 * s * (1 - t), transform: 'translate(-50%,-100%)', fontSize: 150 * s, opacity: t, filter: 'drop-shadow(0 6px 0 #1b1b2f)'}}>👑</div>;
};

const Hall: React.FC<{night?: boolean; children?: React.ReactNode}> = ({night, children}) => (
  <AbsoluteFill>
    <Room wall={night ? '#2c2c54' : '#dfe6e9'} floor={night ? '#1e1e3f' : '#b2967d'} />
    <div style={{position: 'absolute', left: 40, top: 180, width: 220, height: 400, background: night ? '#3d3d6b' : '#b33939', border: `9px solid ${INK}`}} />
    <div style={{position: 'absolute', left: 820, top: 180, width: 220, height: 400, background: night ? '#3d3d6b' : '#2d98da', border: `9px solid ${INK}`}} />
    {children}
  </AbsoluteFill>
);

const Cap: React.FC<{text: string; top?: number; color?: string}> = ({text, top = 1530, color = '#a4b0be'}) => (
  <div style={{position: 'absolute', top, left: 60, right: 60, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 32, color}}>{text}</div>
);

const ZEL = {skin: '#8d5524', hair: 'short' as const, hairColor: '#1e1e1e', hat: 'cap' as const, hatColor: '#2d98da', shirt: '#2d98da', pants: '#0c63c9'};
const MEAN = {skin: '#f2c29b', hair: 'spiky' as const, hairColor: '#2d3436', mustache: true, shirt: '#b33939', pants: '#2d3436'};

type TapMode = 'dry' | 'drip' | 'thread' | 'mud' | 'fountain' | 'river';
// torneira: cano + bico + jato até o chão (y do bico = y)
const TapView: React.FC<{x: number; y: number; mode: TapMode; floorY: number; s?: number}> = ({x, y, mode, floorY, s = 1}) => {
  const frame = useCurrentFrame();
  const color = mode === 'mud' ? '#8d6e4a' : WATER;
  const w = mode === 'thread' ? 8 : mode === 'fountain' ? 36 : mode === 'river' ? 110 : mode === 'mud' ? 30 : 0;
  const len = floorY - y - 44 * s;
  return (
    <div style={{position: 'absolute', left: 0, top: 0}}>
      <svg viewBox="0 0 200 130" width={200 * s} height={130 * s} style={{position: 'absolute', left: x - 120 * s, top: y - 90 * s, overflow: 'visible'}}>
        <rect x={0} y={20} width={60} height={34} fill="#b2bec3" stroke={INK} strokeWidth={7} />
        <path d="M40,37 L150,37 Q176,37 176,64 L176,86" fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" />
        <path d="M40,37 L150,37 Q176,37 176,64 L176,86" fill="none" stroke="#b2bec3" strokeWidth={20} strokeLinecap="round" />
        <rect x={100} y={0} width={30} height={14} rx={5} fill="#ff4757" stroke={INK} strokeWidth={5} />
      </svg>
      {w > 0 ? (
        <>
          <div style={{position: 'absolute', left: x - w / 2 + 56 * s, top: y - 4 * s, width: w, height: Math.min(len, interpolate(frame, [0, 10], [0, len], clamp)), background: color, border: `5px solid ${INK}`, borderTop: 'none', borderRadius: w > 60 ? 12 : 8, opacity: 0.95}} />
          <div style={{position: 'absolute', left: x + 56 * s - Math.max(w, 60) * 1.3, top: floorY - 20, width: Math.max(w, 60) * 2.6, height: 40, borderRadius: 40, background: color, border: `5px solid ${INK}`}} />
        </>
      ) : mode === 'drip' ? <Drop x={x + 56 * s} y={y + 40 * s + ((frame * 9) % len)} s={0.7} /> : (
        <div style={{position: 'absolute', left: x + 56 * s - 60, top: y + 120, width: 120, fontFamily: 'Inter', fontWeight: 900, fontSize: 40, color: INK, textAlign: 'center', opacity: 0.6}}>…</div>
      )}
    </div>
  );
};

// s01
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const mode: TapMode = frame < 60 ? 'drip' : 'thread';
  return (
    <AbsoluteFill>
      <Kitchen />
      <DayBadge n="DIA 30" />
      <TapView x={300} y={420} mode={mode} floorY={470} s={1.2} />
      <Stamp x={540} y={700} text="A ÁGUA VOLTOU!" at={20} color="#20bf6b" size={74} rot={-3} />
      <Stamp x={540} y={900} text="SÓ PRA QUEM É GENTIL" at={90} color="#ff4757" size={54} rot={3} />
      <Person {...ME} x={560} y={1450} scale={1.6} emotion={frame < 60 ? 'shocked' : 'happy'} lookX={-1} bob />
      <Pop at={20} /><Pop at={90} /><Sting at={20} volume={0.3} />
    </AbsoluteFill>
  );
};

// s02
const Fato: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#2f3542'}}>
      <Title text="CIÊNCIA, 2007" color="#fed330" top={130} size={80} at={4} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 440, textAlign: 'center', fontSize: 300, transform: `scale(${1 + Math.sin(frame / 7) * 0.05})`}}>🧠</div>
      {frame >= 40 ? <Stamp x={540} y={900} text="AJUDAR DE LIVRE VONTADE" at={40} color="#20bf6b" size={52} rot={-3} /> : null}
      {frame >= 80 ? <Stamp x={540} y={1060} text="ATIVA O CENTRO DE PRAZER" at={80} color="#ff4757" size={50} rot={3} /> : null}
      <Pop at={40} /><Pop at={80} />
      <Cap text="Fonte: Harbaugh, Mayr & Burghart (2007), Science 316:1622–1625 (ressonância magnética)" top={1500} />
    </AbsoluteFill>
  );
};

// s03
const Sindico: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Hall />
      <TapView x={540} y={700} mode={frame < 40 ? 'dry' : 'mud'} floorY={1250} s={1.3} />
      <Person {...SIND} x={250} y={1450} scale={1.5} emotion={frame < 40 ? 'happy' : 'smirk'} talking={frame < 40} bob />
      <Person {...ME} x={880} y={1450} scale={1.2} emotion="shocked" lookX={-1} dim={0.15} />
      {frame >= 40 ? <Stamp x={540} y={420} text="LAMA!" at={40} color="#8d6e4a" size={110} rot={-5} /> : null}
      <Bubble x={250} y={880} w={380} size={46} text="SOU MUITO GENTIL!" at={5} tail="left" />
      <Pop at={40} /><Sting at={40} volume={0.35} />
    </AbsoluteFill>
  );
};

// s04
const Fofoca: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Hall />
      <TapView x={540} y={700} mode="dry" floorY={1250} s={1.3} />
      <Person {...NEI2} x={300} y={1450} scale={1.5} emotion={frame < 90 ? 'smirk' : 'sad'} talking={frame < 90} bob />
      <Bubble x={300} y={880} w={420} size={46} text={frame < 55 ? 'QUE ESPELHO LINDO!' : 'EU SOU LINDA!'} at={10} tail="left" />
      <Stamp x={700} y={400} text="0 GOTAS" at={80} color="#ff4757" size={96} rot={-4} />
      <div style={{position: 'absolute', left: 700, top: 1000, fontSize: 130}}>🪞</div>
      <Pop at={80} />
    </AbsoluteFill>
  );
};

// s05
const Zelador: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Hall />
      <TapView x={540} y={700} mode={frame > 25 ? 'fountain' : 'dry'} floorY={1250} s={1.3} />
      <Person {...ZEL} x={250} y={1450} scale={1.5} emotion="happy" bob />
      <div style={{position: 'absolute', left: 350, top: 1170, fontSize: 110}}>🔧</div>
      {frame >= 25 ? <Stamp x={540} y={420} text="CHAFARIZ!" at={25} color="#20bf6b" size={110} rot={-5} /> : null}
      <Person {...MEAN} x={880} y={1450} scale={1.2} emotion="shocked" lookX={-1} dim={0.15} />
      <Pop at={25} /><Sting at={25} volume={0.35} />
    </AbsoluteFill>
  );
};

// s06
const Teste: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kitchen />
      <TapView x={300} y={420} mode={frame < 70 ? 'dry' : 'thread'} floorY={470} s={1.2} />
      <Person {...ME} x={360} y={1400} scale={1.4} emotion={frame > 70 ? 'neutral' : 'happy'} lookX={1} bob />
      <Person {...ROSA} x={780} y={1400} scale={1.4} emotion="happy" lookX={-1} />
      <div style={{position: 'absolute', left: 530, top: 1000, fontSize: 120, transform: `rotate(${Math.sin(frame / 6) * 8}deg)`}}>🛍️</div>
      {frame >= 70 ? <Stamp x={540} y={780} text="SÓ UM FIO..." at={70} color="#0c63c9" size={72} rot={-4} /> : null}
      {frame >= 110 ? <Stamp x={540} y={1650} text="FÁCIL DEMAIS" at={110} color="#ff4757" size={56} rot={3} /> : null}
      <Pop at={70} /><Pop at={110} />
    </AbsoluteFill>
  );
};

// s07
const Pista: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#273c75'}}>
      <Title text="A TORNEIRA MEDE O QUANTO CUSTA" color="#fed330" top={130} size={62} at={4} />
      {frame >= 25 ? (
        <div style={{position: 'absolute', left: 80, right: 80, top: 440, height: 300, borderRadius: 40, background: '#dfe6e9', border: `9px solid ${INK}`, padding: 30, fontFamily: 'Inter', fontWeight: 900, color: INK, textAlign: 'center', fontSize: 52}}>
          <div>AJUDAR QUEM TE AMA</div><div style={{color: '#20bf6b', fontSize: 70}}>FÁCIL → 💧 FIO</div>
        </div>
      ) : null}
      {frame >= 100 ? (
        <div style={{position: 'absolute', left: 80, right: 80, top: 800, height: 340, borderRadius: 40, background: '#dfe6e9', border: `9px solid ${INK}`, padding: 30, fontFamily: 'Inter', fontWeight: 900, color: INK, textAlign: 'center', fontSize: 50}}>
          <div>AJUDAR QUEM TE TRATOU MAL</div><div style={{color: '#ff4757', fontSize: 70}}>DIFÍCIL → 🌊 JATO</div>
        </div>
      ) : null}
      <Person {...ME} x={540} y={1650} scale={1.3} emotion={frame > 100 ? 'worried' : 'neutral'} lookY={-0.3} />
      <Pop at={25} /><Pop at={100} />
    </AbsoluteFill>
  );
};

// s08
const Ajuda: React.FC = () => {
  const frame = useCurrentFrame();
  const ev = frame < 60 ? 0 : frame < 120 ? 1 : 2;
  return (
    <AbsoluteFill>
      <Hall />
      <Person {...ME} x={300} y={1450} scale={1.5} emotion="worried" bob lookX={1} />
      <Person {...MEAN} x={820} y={1450} scale={1.4} emotion={ev === 0 ? 'smirk' : 'shocked'} lookX={-1} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontSize: 200}}>{['🚪', '🛒', '🐕'][ev]}</div>
      <Stamp x={540} y={330} text={['SEGURAR A PORTA', 'CARREGAR O CARRINHO', 'BOM DIA PRO CACHORRO'][ev]} at={ev === 0 ? 5 : ev === 1 ? 60 : 120} color="#20bf6b" size={52} rot={-3} />
      <Pop at={5} /><Pop at={60} /><Pop at={120} />
    </AbsoluteFill>
  );
};

// s09
const Rio: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Hall />
      <TapView x={540} y={640} mode="river" floorY={1300} s={1.4} />
      <Stamp x={540} y={380} text="UM RIO!" at={5} color="#0c63c9" size={120} rot={-5} />
      {[[120, NEI], [300, NEI2], [800, ZEL], [960, SIND]].map(([px, p], i) => (
        <Person key={i} {...(p as typeof NEI)} x={px as number} y={1500} scale={1.0} emotion="happy" bob={frame > 60} lookX={px as number < 540 ? 1 : -1} />
      ))}
      <Person {...ME} x={540} y={1760} scale={1.1} emotion="happy" bob />
      {frame >= 80 ? <Stamp x={540} y={1000} text="FILA PRO INIMIGO" at={80} color="#fed330" size={54} rot={3} /> : null}
      <Pop at={5} /><Pop at={80} /><Sting at={5} volume={0.4} />
    </AbsoluteFill>
  );
};

// s10
const Absurdo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#74b9ff'}}>
      <Floor color="#b2bec3" y={1000} />
      <Stamp x={540} y={200} text="GENTILEZA TOTAL" at={0} color="#20bf6b" size={64} rot={-3} />
      <div style={{position: 'absolute', left: 260 + Math.sin(frame / 6) * 12, top: 760, fontSize: 200}}>🚗</div>
      <Person {...SIND} x={150} y={1060} scale={1.1} emotion="scared" bob />
      <Person {...MEAN} x={620} y={1060} scale={1.1} emotion="shocked" lookX={-1} />
      <Person {...NEI2} x={820} y={1460} scale={1.2} emotion="smirk" talking bob />
      {frame >= 70 ? <Bubble x={760} y={1180} w={420} size={44} text="QUE CABELO LINDO!" at={70} tail="center" /> : null}
      <Person {...NEI} x={330} y={1460} scale={1.2} emotion="shocked" />
      {frame >= 100 ? [0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 60 + i * 330, top: 1640, fontSize: 80}}>🚰😍</div>) : null}
      <Pop at={70} /><Pop at={100} />
    </AbsoluteFill>
  );
};

// s11
const Secam: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Hall night />
      <Stamp x={540} y={230} text="NOITE" at={0} color="#2f3542" size={70} rot={-3} />
      {[190, 540, 890].map((x, i) => <TapView key={i} x={x} y={760} mode="dry" floorY={1250} s={1.0} />)}
      {[190, 540, 890].map((x, i) => (frame >= 20 + i * 12 ? <div key={i} style={{position: 'absolute', left: x - 60, top: 880, fontSize: 120}}>❌</div> : null))}
      <Stamp x={540} y={470} text="TUDO SECO" at={10} color="#ff4757" size={90} rot={-4} />
      {frame >= 90 ? <Stamp x={540} y={1060} text="VIROU SHOW 📸" at={90} color="#fed330" size={64} rot={3} /> : null}
      <Person {...ME} x={540} y={1650} scale={1.2} emotion={frame < 90 ? 'shocked' : 'worried'} lookY={-0.2} />
      <Pop at={10} /><Pop at={90} /><Sting at={10} volume={0.35} />
    </AbsoluteFill>
  );
};

// s12
const RosaNoite: React.FC = () => {
  const frame = useCurrentFrame();
  const doors = [200, 540, 880];
  const rx = interpolate(frame, [20, 70, 100, 150, 180, 230], [1000, 880, 540, 540, 200, 200], clamp);
  const placed = [frame >= 62, frame >= 125, frame >= 190];
  return (
    <AbsoluteFill>
      <Hall night />
      {doors.map((x, i) => (
        <div key={i} style={{position: 'absolute', left: x - 110, top: 700, width: 220, height: 500, background: '#57606f', border: `10px solid ${INK}`}}>
          <div style={{position: 'absolute', right: 24, top: 230, width: 26, height: 26, borderRadius: 13, background: '#fed330', border: `5px solid ${INK}`}} />
        </div>
      ))}
      {doors.map((x, i) => (placed[i] ? <Bucket key={i} x={x + 40} y={1260} s={0.95} fill={1} /> : null))}
      <Person {...ROSA} x={rx} y={1480} scale={1.3} emotion="happy" lookX={-1} bob />
      <Bucket x={rx + 90} y={1440} s={0.9} fill={1} />
      {frame >= 160 ? <Stamp x={540} y={420} text="ATÉ NA DO QUE A IGNOROU" at={160} color="#0c63c9" size={46} rot={-3} /> : null}
      <Stamp x={540} y={230} text="3 DA MANHÃ" at={0} color="#2f3542" size={66} rot={-3} />
      <Person {...ME} x={150} y={1760} scale={0.9} emotion={frame > 100 ? 'happy' : 'shocked'} lookX={1} dim={0.1} />
      <Pop at={62} /><Pop at={125} /><Pop at={190} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#273c75'}}>
      <Title text="VOCÊ DEIXARIA UM BALDE NA PORTA DE QUEM SEMPRE TE IGNOROU?" color="#fff" top={110} size={58} />
      <div style={{position: 'absolute', left: 120, top: 560, width: 380, height: 130, borderRadius: 40, background: '#20bf6b', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#fff'}}>SIM</div>
      <div style={{position: 'absolute', left: 580, top: 560, width: 380, height: 130, borderRadius: 40, background: '#ff4757', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#fff'}}>NÃO</div>
      <Person {...ME} x={320} y={1250} scale={1.5} emotion="worried" lookX={1} />
      <Person {...ROSA} x={720} y={1250} scale={1.5} emotion="happy" lookX={-1} />
      <Bucket x={540} y={1240} s={0.9} fill={1} />
      <Stamp x={540} y={480} text="PARTE 4?" at={20} color="#fed330" size={52} rot={-4} />
      <div style={{position: 'absolute', left: 140, right: 140, top: 1470, height: 110, borderRadius: 55, background: '#fed330', border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 56, color: INK, transform: `scale(${1 + Math.sin(frame / 5) * 0.03})`}}>@hipoteticamente.br</div>
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook, fato: Fato, sindico: Sindico, fofoca: Fofoca, zelador: Zelador, teste: Teste, pista: Pista,
  ajuda: Ajuda, rio: Rio, absurdo: Absurdo, secam: Secam, rosa: RosaNoite, cta: Cta,
};
