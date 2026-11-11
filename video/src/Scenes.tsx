import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Person, PersonProps} from './Person';
import {INK, ME, MOM, Pop, Sting, Floor, Title, Room, Street, Flash} from './lib';

// ---------- elenco ----------
const CIDA: Partial<PersonProps> = {...MOM, shirt: '#e84393', apron: false, skin: '#e0ac69'};
const P1: Partial<PersonProps> = {skin: '#f2c29b', hair: 'spiky', hairColor: '#2d3436', shirt: '#6c5ce7', pants: '#2d3436'};
const P2: Partial<PersonProps> = {skin: '#8d5524', hair: 'short', hairColor: '#1e1e1e', shirt: '#0984e3', pants: '#636e72', hat: 'cap', hatColor: '#fdcb6e'};
const P3: Partial<PersonProps> = {skin: '#d1a074', hair: 'long', hairColor: '#6c3b2a', shirt: '#00b894', pants: '#2d3436'};
const P4: Partial<PersonProps> = {skin: '#f5cba7', hair: 'bald', shirt: '#fdcb6e', pants: '#6c5ce7', mustache: true};
const P5: Partial<PersonProps> = {skin: '#c68642', hair: 'bun', hairColor: '#2d3436', shirt: '#a29bfe', pants: '#2d3436'};
const CROWD = [P1, P2, P3, P4, P5];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const money = (v: number, d = 2) => 'R$ ' + v.toLocaleString('pt-BR', {minimumFractionDigits: d, maximumFractionDigits: d});
const FONT = 'Inter';

// ---------- peças ----------
const Stamp: React.FC<{x: number; y: number; text: string; at: number; color?: string; size?: number; rot?: number}> = ({x, y, text, at, color = '#ff4757', size = 54, rot = -8}) => {
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

// cronômetro regressivo de 24 h (segundos restantes)
const Clock: React.FC<{from: number; to: number; dur?: number; at?: number; big?: boolean}> = ({from, to, dur = 120, at = 0, big}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 12}});
  const sec = Math.round(interpolate(frame, [0, dur], [from, to], clamp));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  const t = [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
  const urgent = sec < 3600;
  const sc = big ? 1.5 : 1;
  return (
    <div style={{position: 'absolute', left: big ? 540 : 70, top: big ? 250 : 80, transform: big ? `translate(-50%,0) scale(${p * sc})` : `scale(${p})`, transformOrigin: big ? '50% 0' : '0 0', background: INK, border: `7px solid ${urgent ? '#ff4757' : '#fed330'}`, borderRadius: 22, padding: '6px 26px 8px', boxShadow: `0 8px 0 rgba(0,0,0,0.35)`}}>
      <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 24, color: '#a4b0be', letterSpacing: 4, textAlign: 'center'}}>TUDO A R$ 1 · RESTAM</div>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 72, color: urgent ? '#ff4757' : '#fed330', fontVariantNumeric: 'tabular-nums', letterSpacing: 2, textAlign: 'center'}}>{t}</div>
    </div>
  );
};

// etiqueta de preço pendurada
const PriceTag: React.FC<{x: number; y: number; now?: string; old?: string; flipAt?: number; at?: number; scale?: number; rot?: number; size?: number}> = ({x, y, now = 'R$ 1,00', old, flipAt, at = 0, scale = 1, rot = -4, size = 64}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const flipped = flipAt === undefined || frame >= flipAt;
  const sp = flipAt !== undefined && frame >= flipAt ? spring({frame: frame - flipAt, fps, config: {damping: 7, stiffness: 240}}) : spring({frame: frame - at, fps, config: {damping: 12}});
  const sway = Math.sin(frame / 7) * 3;
  const sc = scale * (flipped && flipAt !== undefined ? 0.75 + 0.25 * sp : sp);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,0) rotate(${rot + sway}deg) scale(${sc})`, transformOrigin: '50% 0'}}>
      <div style={{position: 'absolute', left: '50%', top: -60, width: 7, height: 70, background: INK, transform: 'translateX(-50%)'}} />
      <div style={{position: 'relative', background: flipped ? '#ff4757' : '#fff', color: flipped ? '#fff' : INK, border: `8px solid ${INK}`, borderRadius: 18, padding: '12px 34px', fontFamily: FONT, fontWeight: 900, fontSize: flipped ? size * 1.25 : size, whiteSpace: 'nowrap', boxShadow: `0 9px 0 ${INK}`}}>
        <div style={{position: 'absolute', left: '50%', top: 8, width: 16, height: 16, borderRadius: 8, background: INK, transform: 'translateX(-50%)'}} />
        <div style={{paddingTop: 12}}>
          {flipped ? now : <span style={{textDecoration: 'line-through', textDecorationColor: '#ff4757', textDecorationThickness: 6}}>{old}</span>}
        </div>
      </div>
    </div>
  );
};

// visor de caixa em LED
const Led: React.FC<{x: number; y: number; w: number; label: string; value: string; color?: string; size?: number; at?: number}> = ({x, y, w, label, value, color = '#2ee66b', size = 92, at = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 13}});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `scale(${p})`, background: '#0b1d12', border: `8px solid ${INK}`, borderRadius: 22, padding: '8px 24px 12px', boxShadow: `0 10px 0 ${INK}`}}>
      <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 28, color: '#7bed9f', letterSpacing: 3}}>{label}</div>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: size, color, fontVariantNumeric: 'tabular-nums', textAlign: 'right', lineHeight: 1.1, textShadow: `0 0 18px ${color}88`}}>{value}</div>
    </div>
  );
};

const Chip: React.FC<{x: number; y: number; text: string; at: number; color?: string; size?: number}> = ({x, y, text, at, color = '#20bf6b', size = 42}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 10, stiffness: 220}});
  return (
    <div style={{position: 'absolute', left: x, top: y - (1 - p) * -30, transform: `translate(-50%,0) scale(${p})`, background: color, color: '#fff', border: `6px solid ${INK}`, borderRadius: 30, padding: '4px 22px', fontFamily: FONT, fontWeight: 900, fontSize: size, whiteSpace: 'nowrap', boxShadow: `0 6px 0 ${INK}`}}>
      {text}
    </div>
  );
};

// ---------- objetos ----------
const TV: React.FC<{x: number; y: number; w?: number; h?: number; hue?: string}> = ({x, y, w = 360, h = 220, hue = '#0984e3'}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h + 40}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, background: hue, border: `8px solid ${INK}`, borderRadius: 14, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: w * 0.62, top: h * 0.14, width: h * 0.26, height: h * 0.26, borderRadius: '50%', background: '#fed330'}} />
      <div style={{position: 'absolute', left: -20, bottom: -h * 0.2, width: w * 0.7, height: h * 0.6, background: '#20bf6b', transform: 'rotate(45deg)'}} />
      <div style={{position: 'absolute', left: w * 0.4, bottom: -h * 0.25, width: w * 0.6, height: h * 0.55, background: '#05c46b', transform: 'rotate(45deg)'}} />
    </div>
    <div style={{position: 'absolute', left: w * 0.38, top: h, width: w * 0.24, height: 28, background: INK}} />
    <div style={{position: 'absolute', left: w * 0.25, top: h + 24, width: w * 0.5, height: 16, background: INK, borderRadius: 8}} />
  </div>
);

const Laptop: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <svg viewBox="0 0 220 150" width={220 * s} height={150 * s} style={{position: 'absolute', left: x - 110 * s, top: y, overflow: 'visible'}}>
    <rect x={30} y={4} width={160} height={104} rx={10} fill="#2d3436" stroke={INK} strokeWidth={7} />
    <rect x={44} y={18} width={132} height={76} rx={4} fill="#74b9ff" />
    <path d="M6,112 L214,112 L204,138 Q202,144 196,144 L24,144 Q18,144 16,138 Z" fill="#b2bec3" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
  </svg>
);

const Sneaker: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <svg viewBox="0 0 220 120" width={220 * s} height={120 * s} style={{position: 'absolute', left: x - 110 * s, top: y, overflow: 'visible'}}>
    <path d="M10,92 L10,50 Q12,40 28,42 L60,50 Q84,48 96,30 L112,36 Q130,66 176,72 Q212,76 210,98 L210,104 L10,104 Z" fill="#f5f6fa" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M10,92 L210,92 L210,106 Q210,114 200,114 L20,114 Q10,114 10,106 Z" fill="#ff4757" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M100,50 L118,62 M120,44 L138,58" stroke={INK} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

const Cart: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <svg viewBox="0 0 340 280" width={340 * s} height={280 * s} style={{position: 'absolute', left: x - 170 * s, top: y, overflow: 'visible'}}>
    <path d="M6,22 L62,22 L96,56" fill="none" stroke={INK} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M62,48 L322,48 L290,184 L104,184 Z" fill="rgba(223,228,234,0.25)" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    <path d="M130,48 L138,184 M186,48 L190,184 M242,48 L240,184 M80,92 L310,92 M92,138 L300,138" stroke={INK} strokeWidth={5} />
    <path d="M104,184 L118,228 L270,228" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={132} cy={250} r={24} fill="#57606f" stroke={INK} strokeWidth={8} />
    <circle cx={252} cy={250} r={24} fill="#57606f" stroke={INK} strokeWidth={8} />
  </svg>
);

const Car: React.FC<{x: number; y: number; s?: number; color?: string}> = ({x, y, s = 1, color = '#e84118'}) => (
  <svg viewBox="0 0 520 240" width={520 * s} height={240 * s} style={{position: 'absolute', left: x - 260 * s, top: y, overflow: 'visible'}}>
    <ellipse cx={260} cy={226} rx={230} ry={12} fill="rgba(0,0,0,0.2)" />
    <path d="M20,152 Q20,112 70,106 L140,102 Q170,52 230,48 L330,48 Q380,52 410,102 L470,110 Q500,116 500,152 L500,178 L20,178 Z" fill={color} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    <path d="M160,102 Q184,66 232,62 L322,62 Q356,66 380,102 Z" fill="#c7ecee" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <line x1={275} y1={62} x2={275} y2={102} stroke={INK} strokeWidth={7} />
    <rect x={470} y={122} width={30} height={22} rx={6} fill="#fed330" stroke={INK} strokeWidth={5} />
    <rect x={20} y={124} width={22} height={22} rx={6} fill="#ff6b6b" stroke={INK} strokeWidth={5} />
    <circle cx={122} cy={182} r={46} fill={INK} />
    <circle cx={122} cy={182} r={20} fill="#dfe4ea" />
    <circle cx={398} cy={182} r={46} fill={INK} />
    <circle cx={398} cy={182} r={20} fill="#dfe4ea" />
  </svg>
);

const Key: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <svg viewBox="0 0 100 140" width={100 * s} height={140 * s} style={{position: 'absolute', left: x - 50 * s, top: y, overflow: 'visible'}}>
    <circle cx={50} cy={32} r={26} fill="none" stroke={INK} strokeWidth={9} />
    <rect x={38} y={56} width={24} height={64} rx={6} fill="#fed330" stroke={INK} strokeWidth={7} />
    <path d="M62,90 L82,90 M62,106 L76,106" stroke={INK} strokeWidth={7} strokeLinecap="round" />
  </svg>
);

const Shirt: React.FC<{x: number; y: number; color: string; s?: number}> = ({x, y, color, s = 1}) => (
  <svg viewBox="0 0 100 110" width={100 * s} height={110 * s} style={{position: 'absolute', left: x - 50 * s, top: y, overflow: 'visible'}}>
    <path d="M50,0 L50,12 M34,10 L50,0 L66,10" fill="none" stroke={INK} strokeWidth={5} />
    <path d="M32,18 L10,32 L20,52 L32,46 L32,104 L68,104 L68,46 L80,52 L90,32 L68,18 Q50,30 32,18 Z" fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
  </svg>
);

// arara com N camisetas; `gone` camisetas já vendidas (somem da direita pra esquerda)
const Rack: React.FC<{x: number; y: number; n: number; gone: number}> = ({x, y, n, gone}) => {
  const colors = ['#ff6b81', '#ffa502', '#2ed573', '#1e90ff', '#a55eea', '#eccc68'];
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 440, height: 10, background: INK, borderRadius: 5}} />
      <div style={{position: 'absolute', left: 6, top: 0, width: 10, height: 260, background: INK}} />
      <div style={{position: 'absolute', left: 424, top: 0, width: 10, height: 260, background: INK}} />
      {Array.from({length: n}).map((_, i) => (i < n - gone ? <Shirt key={i} x={60 + i * 60} y={4} s={0.9} color={colors[(i + Math.round(x)) % colors.length]} /> : null))}
    </div>
  );
};

const Phone: React.FC<{x: number; y: number; w: number; h: number; shake?: number; children: React.ReactNode}> = ({x, y, w, h, shake = 0, children}) => (
  <div style={{position: 'absolute', left: x - w / 2 + shake, top: y, width: w, height: h, background: '#fff', border: `14px solid ${INK}`, borderRadius: 64, overflow: 'hidden', boxShadow: `0 14px 0 rgba(0,0,0,0.3)`}}>
    <div style={{position: 'absolute', left: '50%', top: 12, width: 120, height: 14, borderRadius: 7, background: INK, transform: 'translateX(-50%)'}} />
    {children}
  </div>
);

// ---------- cenários ----------
const ShopNight: React.FC = () => (
  <AbsoluteFill style={{background: '#1e2a4a'}}>
    <div style={{position: 'absolute', left: 90, top: 300, width: 900, height: 880, background: '#2f3b5c', border: `10px solid ${INK}`, borderRadius: 20}} />
    <div style={{position: 'absolute', left: 190, top: 190, width: 700, height: 120, background: '#fed330', border: `10px solid ${INK}`, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 70, color: INK, letterSpacing: 4}}>TUDO ELETRO</div>
    <div style={{position: 'absolute', left: 140, top: 370, width: 800, height: 720, background: '#0b132b', border: `9px solid ${INK}`, borderRadius: 12}} />
    <div style={{position: 'absolute', left: 140, top: 560, width: 800, height: 10, background: '#57606f'}} />
    <TV x={190} y={400} w={250} h={150} hue="#e17055" />
    <TV x={640} y={400} w={250} h={150} hue="#6c5ce7" />
    <TV x={330} y={600} w={420} h={260} hue="#0984e3" />
    <Floor color="#3d3d5c" y={1180} />
  </AbsoluteFill>
);

// ---------- cenas ----------
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const flip = frame >= 100;
  return (
    <AbsoluteFill>
      <ShopNight />
      <PriceTag x={540} y={880} old="R$ 4.299" now="R$ 1,00" flipAt={100} at={6} scale={1.15} />
      <Person {...ME} x={880} y={1250} scale={1.3} emotion={flip ? 'shocked' : 'neutral'} lookX={-1} lookY={-0.4} />
      <Pop at={6} />
      <Pop at={100} />
      <Sting at={100} volume={0.5} />
      <Flash at={100} len={6} />
    </AbsoluteFill>
  );
};

const News: React.FC = () => {
  const frame = useCurrentFrame();
  const buzz = frame > 8 && frame < 34 ? Math.sin(frame * 2.4) * 12 : 0;
  const line = (at: number, text: string, color: string, size: number, top: number) =>
    frame >= at ? <div style={{position: 'absolute', left: 0, right: 0, top, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: size, color, transform: `scale(${spring({frame: frame - at, fps: 30, config: {damping: 11}})})`}}>{text}</div> : null;
  return (
    <AbsoluteFill>
      <Room wall="#2d3561" floor="#1e2749" />
      <Phone x={560} y={200} w={600} h={900} shake={buzz}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 40, height: 110, background: '#ff4757', color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 64, textAlign: 'center', lineHeight: '110px', letterSpacing: 4}}>URGENTE</div>
        {line(34, 'POR 24 HORAS', INK, 62, 200)}
        {line(70, 'TUDO NO BRASIL', INK, 60, 290)}
        {frame >= 96 ? <div style={{position: 'absolute', left: 0, right: 0, top: 400, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 118, color: '#ff4757', transform: `scale(${spring({frame: frame - 96, fps: 30, config: {damping: 8, stiffness: 220}})})`}}>R$ 1,00</div> : null}
        <Chip x={300} y={640} text="PIX FUNCIONANDO" at={116} size={44} />
      </Phone>
      <Person {...ME} x={170} y={1250} scale={1.2} emotion="shocked" lookX={1} lookY={-0.6} />
      <Clock from={86400} to={86400} at={34} />
      <Pop at={34} />
      <Pop at={96} />
      <Pop at={116} />
    </AbsoluteFill>
  );
};

const Queue: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Street night />
      <div style={{position: 'absolute', left: 30, top: 640, width: 520, height: 540, background: '#2f3b5c', border: `10px solid ${INK}`, borderRadius: 16}}>
        <div style={{position: 'absolute', left: 30, top: -80, width: 460, height: 80, background: '#fed330', border: `8px solid ${INK}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 48, color: INK}}>TUDO ELETRO</div>
        <TV x={40} y={40} w={200} h={120} hue="#e17055" />
        <TV x={280} y={40} w={200} h={120} hue="#6c5ce7" />
        <div style={{position: 'absolute', left: 30, top: 330, width: 460, height: 150, background: '#b2bec3', border: `8px solid ${INK}`, borderRadius: 10}} />
      </div>
      {CROWD.map((p, i) => (
        <Person key={i} {...p} x={470 + i * 150} y={1235 - i * 8} scale={1.15 - i * 0.07} emotion={i % 2 ? 'happy' : 'shocked'} lookX={-1} enterAt={30 + i * 12} flip />
      ))}
      <Person {...ME} x={250} y={1250} scale={1.35} emotion="smirk" lookX={1} />
      <Stamp x={700} y={540} text="FILA ATÉ A ESQUINA" at={80} color="#ff4757" size={40} rot={4} />
      <Clock from={86400 - 300} to={86400 - 600} dur={130} />
      {[30, 42, 54, 66, 78, 80].map((a, i) => <Pop key={i} at={a} />)}
    </AbsoluteFill>
  );
};

const CartScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drop = (at: number) => {
    const p = spring({frame: frame - at, fps, config: {damping: 11, stiffness: 150}});
    return {visible: frame >= at, off: (1 - p) * -620};
  };
  const tv = drop(0), nb = drop(32), tn = drop(64);
  const paid = frame >= 94 ? 3 : frame >= 64 ? 3 : frame >= 32 ? 2 : frame >= 0 ? 1 : 0;
  const saved = frame >= 64 ? 8394 : frame >= 32 ? 7797 : 4298;
  return (
    <AbsoluteFill style={{background: '#273c75'}}>
      <Led x={90} y={140} w={900} label="TOTAL A PAGAR" value={money(paid)} />
      <div style={{position: 'absolute', left: 90, top: 400, width: 900, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: FONT, fontWeight: 900, fontSize: 46, color: '#fed330', WebkitTextStroke: `8px ${INK}`, paintOrder: 'stroke fill'}}>VOCÊ ECONOMIZOU {money(saved)}</div>
      {tv.visible ? <div style={{position: 'absolute', left: 0, top: tv.off}}><TV x={330} y={690} w={250} h={150} /></div> : null}
      {nb.visible ? <div style={{position: 'absolute', left: 0, top: nb.off}}><Laptop x={640} y={760} s={0.9} /></div> : null}
      {tn.visible ? <div style={{position: 'absolute', left: 0, top: tn.off}}><Sneaker x={470} y={820} s={0.7} /></div> : null}
      <Cart x={530} y={830} s={1.45} />
      {frame >= 0 ? <PriceTag x={160} y={560} now="R$ 1,00" at={6} scale={0.6} size={52} /> : null}
      {frame >= 32 ? <PriceTag x={920} y={600} now="R$ 1,00" at={36} scale={0.6} size={52} rot={5} /> : null}
      {frame >= 64 ? <PriceTag x={920} y={850} now="R$ 1,00" at={68} scale={0.6} size={52} rot={-5} /> : null}
      <Person {...ME} x={190} y={1250} scale={1.25} emotion="happy" lookX={1} />
      <Chip x={560} y={1130} text="PIX ENVIADO ✓" at={96} size={50} />
      <Pop at={4} /><Pop at={34} /><Pop at={66} /><Pop at={96} />
    </AbsoluteFill>
  );
};

const Dealer: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#dff9fb" floor="#95a5a6" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, height: 760, background: '#c7ecee', borderBottom: `10px solid ${INK}`}}>
        {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 150 + i * 330, top: 0, bottom: 0, width: 10, background: INK}} />)}
      </div>
      <div style={{position: 'absolute', left: 190, top: 250, width: 700, height: 100, background: '#2f3542', border: `9px solid ${INK}`, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fed330', letterSpacing: 6}}>CARROS ZERO</div>
      <Car x={640} y={780} s={1.3} />
      <PriceTag x={640} y={470} old="R$ 89.990" now="R$ 1,00" flipAt={68} at={4} scale={1.0} />
      <Key x={960} y={1030} s={1.3} />
      <Person {...ME} x={200} y={1250} scale={1.35} emotion={frame >= 92 ? 'happy' : 'smirk'} lookX={1} />
      <Pop at={4} /><Pop at={68} /><Sting at={68} volume={0.4} /><Pop at={92} />
    </AbsoluteFill>
  );
};

const Fact: React.FC = () => {
  const frame = useCurrentFrame();
  const bi = interpolate(frame, [95, 160], [0, 4.76], {...clamp, easing: ease});
  const hoje = frame >= 232;
  return (
    <AbsoluteFill style={{background: '#1e272e'}}>
      <Title text="BLACK FRIDAY 2025" color="#fed330" top={130} size={82} />
      <Led x={70} y={360} w={940} label="E-COMMERCE BRASILEIRO · UM DIA SÓ" value={`R$ ${bi.toFixed(2).replace('.', ',')} BI`} size={110} />
      <Led x={70} y={680} w={430} label="PEDIDOS" value="8,69 mi" size={78} at={150} color="#74b9ff" />
      <Led x={580} y={680} w={430} label="TICKET MÉDIO" value="R$ 553,60" size={64} at={175} color={hoje ? '#ff6b6b' : '#fed330'} />
      {hoje ? <div style={{position: 'absolute', left: 560, top: 790, width: 470, height: 10, background: '#ff4757', transform: 'rotate(-6deg)', border: `3px solid ${INK}`}} /> : null}
      <Stamp x={700} y={990} text="HOJE: R$ 1,00" at={232} color="#ff4757" size={62} rot={-4} />
      <div style={{position: 'absolute', top: 1530, left: 60, right: 60, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 32, color: '#a4b0be'}}>Fonte: Confi Neotrust, Black Friday de 28/11/2025</div>
      <Pop at={150} /><Pop at={175} /><Pop at={232} /><Sting at={160} volume={0.35} />
    </AbsoluteFill>
  );
};

const Node: React.FC<{y: number; at: number; icon: React.ReactNode; name: string; old: string}> = ({y, at, icon, name, old}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 12}});
  const flip = frame >= at + 18;
  return (
    <div style={{position: 'absolute', left: 90, top: y, width: 900, height: 250, transform: `scale(${p})`, background: '#fff', border: `9px solid ${INK}`, borderRadius: 30, boxShadow: `0 10px 0 ${INK}`}}>
      <div style={{position: 'absolute', left: 30, top: 30, width: 190, height: 180}}>{icon}</div>
      <div style={{position: 'absolute', left: 250, top: 28, fontFamily: FONT, fontWeight: 900, fontSize: 56, color: INK}}>{name}</div>
      <div style={{position: 'absolute', left: 250, top: 112, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: '#a4b0be', textDecoration: 'line-through', textDecorationColor: '#ff4757', textDecorationThickness: 7}}>{old}</div>
      {flip ? <div style={{position: 'absolute', right: 26, top: 92, background: '#ff4757', color: '#fff', border: `7px solid ${INK}`, borderRadius: 18, padding: '0 22px', fontFamily: FONT, fontWeight: 900, fontSize: 70, transform: `rotate(-4deg) scale(${spring({frame: frame - at - 18, fps, config: {damping: 8, stiffness: 240}})})`}}>R$ 1</div> : null}
    </div>
  );
};

const Arrow: React.FC<{y: number; at: number}> = ({y, at}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return <div style={{position: 'absolute', left: 510, top: y, width: 0, height: 0, borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderTop: '50px solid #fed330'}} />;
};

const Chain: React.FC = () => (
  <AbsoluteFill style={{background: '#0a3d62'}}>
    <Node y={150} at={4} name="FÁBRICA" old="R$ 2.900" icon={
      <svg viewBox="0 0 190 180" width={190} height={180}><rect x={10} y={80} width={170} height={90} fill="#778ca3" stroke={INK} strokeWidth={8} /><rect x={30} y={20} width={30} height={70} fill="#57606f" stroke={INK} strokeWidth={8} /><rect x={90} y={40} width={30} height={50} fill="#57606f" stroke={INK} strokeWidth={8} /><rect x={40} y={110} width={30} height={30} fill="#fed330" stroke={INK} strokeWidth={5} /><rect x={110} y={110} width={30} height={30} fill="#fed330" stroke={INK} strokeWidth={5} /></svg>
    } />
    <Arrow y={410} at={76} />
    <Node y={480} at={76} name="CAMINHONEIRO" old="R$ 300" icon={
      <svg viewBox="0 0 190 180" width={190} height={180}><rect x={4} y={40} width={110} height={90} fill="#f5f6fa" stroke={INK} strokeWidth={8} /><path d="M114,70 L160,70 L184,100 L184,130 L114,130 Z" fill="#0984e3" stroke={INK} strokeWidth={8} strokeLinejoin="round" /><circle cx={50} cy={140} r={20} fill={INK} /><circle cx={146} cy={140} r={20} fill={INK} /></svg>
    } />
    <Arrow y={740} at={120} />
    <Node y={810} at={120} name="LOJA" old="R$ 4.299" icon={
      <svg viewBox="0 0 190 180" width={190} height={180}><rect x={14} y={70} width={162} height={100} fill="#f5f6fa" stroke={INK} strokeWidth={8} /><path d="M4,70 L26,20 L164,20 L186,70 Z" fill="#ff4757" stroke={INK} strokeWidth={8} strokeLinejoin="round" /><rect x={74} y={104} width={44} height={66} fill="#74b9ff" stroke={INK} strokeWidth={6} /></svg>
    } />
    <Pop at={22} /><Pop at={94} /><Pop at={138} />
  </AbsoluteFill>
);

const MomStore: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Street />
      <div style={{position: 'absolute', left: 430, top: 560, width: 620, height: 620, background: '#ffeaa7', border: `10px solid ${INK}`, borderRadius: 16}}>
        <div style={{position: 'absolute', left: -10, top: -90, width: 640, height: 100, background: '#e84393', border: `9px solid ${INK}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', letterSpacing: 2}}>MODAS DA CIDA</div>
        <div style={{position: 'absolute', left: 40, top: 60, width: 540, height: 320, background: '#dff9fb', border: `8px solid ${INK}`, borderRadius: 10}} />
        <Shirt x={140} y={110} color="#ff6b81" s={1.5} />
        <Shirt x={290} y={110} color="#1e90ff" s={1.5} />
        <Shirt x={440} y={110} color="#2ed573" s={1.5} />
        <div style={{position: 'absolute', left: 230, top: 420, width: 160, height: 200, background: '#b2bec3', border: `8px solid ${INK}`}} />
      </div>
      {CROWD.map((p, i) => (
        <Person key={i} {...p} x={560 + i * 120} y={1240 - i * 4} scale={0.95} emotion="happy" lookX={-1} enterAt={118 + i * 7} flip />
      ))}
      <Person {...CIDA} x={720} y={1180} scale={1.0} emotion="shocked" />
      {/* tela de chamada */}
      <div style={{position: 'absolute', left: 70, top: 250, width: 420, height: 230, background: '#2d3436', border: `9px solid ${INK}`, borderRadius: 40, boxShadow: `0 10px 0 rgba(0,0,0,0.3)`, transform: `rotate(${Math.sin(frame * 1.2) * (frame < 40 ? 4 : 0)}deg)`}}>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 36, color: '#7bed9f', textAlign: 'center', marginTop: 22, letterSpacing: 3}}>CHAMADA</div>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 84, color: '#fff', textAlign: 'center'}}>MÃE</div>
        <div style={{margin: '6px auto 0', width: 90, height: 34, borderRadius: 17, background: '#20bf6b', border: `5px solid ${INK}`}} />
      </div>
      <Person {...ME} x={230} y={1250} scale={1.3} emotion="worried" lookX={1} />
      <Clock from={54000} to={50400} />
      <Pop at={4} /><Pop at={125} />
    </AbsoluteFill>
  );
};

const Shop: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill>
    <Room wall="#fab1a0" floor="#b2bec3" />
    <div style={{position: 'absolute', left: 0, right: 0, top: 215, height: 90, background: '#e84393', borderTop: `9px solid ${INK}`, borderBottom: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 46, color: '#fff', letterSpacing: 6}}>MODAS DA CIDA</div>
    {children}
  </AbsoluteFill>
);

const Stock: React.FC = () => {
  const frame = useCurrentFrame();
  const left = Math.round(interpolate(frame, [4, 62], [200, 0], {...clamp, easing: ease}));
  const caixa = 200 - left;
  const gone = Math.round(interpolate(frame, [4, 62], [0, 6], clamp));
  return (
    <Shop>
      <Led x={70} y={350} w={450} label="ESTOQUE (PEÇAS)" value={String(left)} size={90} color={left === 0 ? '#ff6b6b' : '#2ee66b'} />
      <Led x={560} y={350} w={450} label="CAIXA" value={money(caixa, 0)} size={74} color="#fed330" />
      <Rack x={40} y={600} n={6} gone={gone} />
      <Rack x={600} y={600} n={6} gone={Math.max(0, gone - 1)} />
      <Led x={330} y={900} w={700} label="CUSTO DO ESTOQUE" value="R$ 3.000" size={80} at={80} color="#ff6b6b" />
      <Stamp x={640} y={1150} text="PREJUÍZO: -R$ 2.800" at={134} color="#ff4757" size={52} rot={-3} />
      <Person {...CIDA} x={170} y={1250} scale={1.1} emotion={frame >= 80 ? 'sad' : 'happy'} />
      <Pop at={4} /><Pop at={38} /><Pop at={80} /><Pop at={134} /><Sting at={134} volume={0.4} />
      <Clock from={50400} to={46800} dur={150} />
    </Shop>
  );
};

const Dilemma: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const top = spring({frame: frame - 94, fps, config: {damping: 14}});
  const bot = spring({frame: frame - 118, fps, config: {damping: 14}});
  return (
    <AbsoluteFill style={{background: '#2d3436'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 940, background: '#6c5ce7', opacity: top, borderBottom: `10px solid ${INK}`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 940, bottom: 0, background: '#00b894', opacity: bot}} />
      <Car x={270} y={310} s={0.62} />
      <TV x={500} y={320} w={230} h={140} />
      <Laptop x={850} y={340} s={0.95} />
      <div style={{position: 'absolute', left: 300, right: 40, top: 580, textAlign: 'right', fontFamily: FONT, fontWeight: 900, fontSize: 66, color: '#fff', WebkitTextStroke: `10px ${INK}`, paintOrder: 'stroke fill', opacity: top}}>FICAR COM TUDO</div>
      <div style={{position: 'absolute', left: 300, right: 40, top: 975, textAlign: 'right', fontFamily: FONT, fontWeight: 900, fontSize: 66, color: '#fff', WebkitTextStroke: `10px ${INK}`, paintOrder: 'stroke fill', opacity: bot}}>PAGAR O QUE VALE</div>
      <Shirt x={620} y={1075} color="#ff6b81" s={1.0} />
      <Shirt x={780} y={1075} color="#1e90ff" s={1.0} />
      <Shirt x={940} y={1075} color="#fed330" s={1.0} />
      <Person {...ME} x={170} y={1250} scale={1.15} emotion="worried" lookY={-0.3} />
      <Pop at={94} /><Pop at={118} />
      <Clock from={21600} to={18000} />
    </AbsoluteFill>
  );
};

const Pay: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Shop>
      <Rack x={40} y={640} n={6} gone={5} />
      <Phone x={760} y={340} w={440} h={520}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 40, height: 90, background: '#20bf6b', color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 56, textAlign: 'center', lineHeight: '90px', letterSpacing: 4}}>PIX</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 34, color: '#57606f'}}>Para: Modas da Cida</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: FONT, fontWeight: 900, fontSize: 68, color: INK, transform: `scale(${spring({frame: frame - 106, fps: 30, config: {damping: 10}})})`}}>R$ 30,00</div>
        {frame >= 126 ? <div style={{position: 'absolute', left: 150, top: 350, width: 100, height: 120, borderRadius: 60, background: '#20bf6b', border: `8px solid ${INK}`, color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 70, textAlign: 'center', lineHeight: '86px'}}>✓</div> : null}
      </Phone>
      <PriceTag x={300} y={380} now="R$ 1,00" at={56} scale={0.8} size={56} />
      <Shirt x={300} y={560} color="#1e90ff" s={1.6} />
      <Person {...ME} x={230} y={1250} scale={1.3} emotion="smirk" lookX={1} />
      <Person {...CIDA} x={860} y={1250} scale={1.2} emotion={frame >= 126 ? 'shocked' : 'neutral'} lookX={-1} flip />
      <Pop at={56} /><Pop at={106} /><Pop at={126} />
      <Clock from={10800} to={7200} />
    </Shop>
  );
};

const LineScene: React.FC = () => {
  const cues = [42, 66, 82, 98, 112];
  return (
    <Shop>
      <Rack x={40} y={640} n={6} gone={6} />
      <Rack x={600} y={640} n={6} gone={6} />
      <Person {...CIDA} x={900} y={1250} scale={1.2} emotion="happy" lookX={-1} flip />
      <Person {...ME} x={720} y={1250} scale={1.2} emotion="happy" lookX={1} flip />
      {CROWD.map((p, i) => (
        <React.Fragment key={i}>
          <Person {...p} x={590 - i * 105} y={1250 - i * 6} scale={1.05 - i * 0.05} emotion="happy" lookX={1} enterAt={4 + i * 4} />
          <Chip x={590 - i * 105} y={i % 2 ? 790 : 700} text="PIX R$ 30" at={cues[i]} size={32} />
        </React.Fragment>
      ))}
      {cues.map((c, i) => <Pop key={i} at={c} />)}
      <Clock from={3600} to={1800} />
    </Shop>
  );
};

const Twist: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const done = frame >= 30;
  const bill = (at: number, y: number, name: string, val: string, rot: number) => {
    if (frame < at) return null;
    const p = spring({frame: frame - at, fps, config: {damping: 11}});
    return (
      <div style={{position: 'absolute', left: 120, top: y, width: 840, transform: `translateX(${(1 - p) * 900}px) rotate(${rot}deg)`, background: '#fff', border: `8px solid ${INK}`, borderRadius: 16, padding: '4px 36px', display: 'flex', justifyContent: 'space-between', fontFamily: FONT, fontWeight: 900, fontSize: 52, color: INK, boxShadow: `0 8px 0 ${INK}`}}>
        <span>{name}</span><span style={{color: '#e84118'}}>{val}</span>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: '#1e2a4a'}}>
      <Clock from={30} to={0} dur={30} big />
      {done ? (
        <>
          <PriceTag x={250} y={500} now="R$ 4.299" at={30} scale={0.8} size={52} rot={-6} />
          <PriceTag x={830} y={500} now="R$ 30" at={34} scale={0.8} size={52} rot={6} />
        </>
      ) : null}
      {bill(76, 650, 'ALUGUEL', 'R$ 2.800', -2)}
      {bill(98, 770, 'FORNECEDOR', 'R$ 3.000', 2)}
      {bill(118, 890, 'LUZ', 'R$ 540', -1)}
      <Stamp x={700} y={1130} text="A PREÇO CHEIO" at={140} color="#ff4757" size={56} rot={-4} />
      <Person {...CIDA} x={200} y={1250} scale={0.72} emotion="worried" />
      <Pop at={76} /><Pop at={98} /><Pop at={118} /><Sting at={30} volume={0.7} /><Sting at={140} volume={0.45} />
      <Flash at={30} len={8} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#192a56'}}>
      <Title text="O QUE VOCÊ COMPRARIA PRIMEIRO?" color="#fff" top={130} size={74} />
      <div style={{position: 'absolute', left: 90, top: 520, width: 420, height: 130, borderRadius: 40, background: '#6c5ce7', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 48, color: '#fff'}}>LEVARIA TUDO</div>
      <div style={{position: 'absolute', left: 570, top: 520, width: 420, height: 130, borderRadius: 40, background: '#00b894', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 38, color: '#fff', textAlign: 'center', lineHeight: 1.05}}>PAGARIA O JUSTO</div>
      <Person {...ME} x={300} y={1200} scale={1.5} emotion="worried" lookX={1} />
      <Person {...CIDA} x={780} y={1200} scale={1.5} emotion="happy" lookX={-1} flip />
      <PriceTag x={540} y={720} now="R$ 1,00" at={4} scale={0.6} size={56} />
      <Stamp x={540} y={1040} text="PARTE 2?" at={20} color="#fed330" size={48} rot={8} />
      <div style={{position: 'absolute', left: 140, right: 140, top: 1470, height: 110, borderRadius: 55, background: '#fed330', border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: INK, transform: `scale(${1 + Math.sin(frame / 5) * 0.03})`}}>@hipoteticamente.br</div>
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook, news: News, queue: Queue, cart: CartScene, dealer: Dealer, fact: Fact, chain: Chain, momstore: MomStore,
  stock: Stock, dilemma: Dilemma, pay: Pay, line: LineScene, twist: Twist, cta: Cta,
};
