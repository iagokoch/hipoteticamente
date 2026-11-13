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


const NEIGH: Partial<PersonProps> = {skin: '#f5cba7', hair: 'bald', shirt: '#74b9ff', pants: '#74b9ff', mustache: true};
const DayTag: React.FC<{text: string; y?: number}> = ({text, y = 150}) => <Stamp x={540} y={y} text={text} at={0} color="#2f3542" size={62} rot={-3} />;
const Cap: React.FC<{text: string; top?: number}> = ({text, top = 1530}) => (
  <div style={{position: 'absolute', top, left: 60, right: 60, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 32, color: '#a4b0be'}}>{text}</div>
);
const Big: React.FC<{x: number; y: number; e: string; s?: number; rot?: number}> = ({x, y, e, s = 1, rot = 0}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,0) rotate(${rot}deg)`, fontSize: 200 * s, lineHeight: 1, filter: 'drop-shadow(0 8px 0 rgba(27,27,47,0.5))'}}>{e}</div>
);

// s01
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#1e2a4a" floor="#2c2c54" />
      <DayTag text="00:01" />
      <Car x={300} y={640} s={0.8} />
      <TV x={580} y={560} w={300} h={180} />
      <PriceTag x={300} y={520} now="R$ 1,00" at={10} scale={0.55} size={52} />
      <PriceTag x={730} y={470} now="R$ 1,00" at={20} scale={0.55} size={52} rot={5} />
      <Led x={90} y={900} w={900} label="FALTAM PRA LOJA DA MÃE FECHAR O MÊS" value="R$ 4.000" color="#ff6b6b" size={110} at={70} />
      <Person {...ME} x={300} y={1520} scale={1.3} emotion={frame < 70 ? 'happy' : 'worried'} lookX={1} bob />
      <Person {...CIDA} x={780} y={1520} scale={1.3} emotion="worried" lookX={-1} />
      <Pop at={10} /><Pop at={20} /><Pop at={70} /><Sting at={70} volume={0.4} />
    </AbsoluteFill>
  );
};

// s02
const Alerta: React.FC = () => {
  const frame = useCurrentFrame();
  const shake = frame < 40 ? Math.sin(frame * 2.2) * 8 : 0;
  return (
    <AbsoluteFill style={{background: '#1e2a4a'}}>
      <Phone x={540} y={200} w={640} h={900} shake={shake}>
        <div style={{padding: '90px 40px', fontFamily: FONT, textAlign: 'center'}}>
          <div style={{fontWeight: 800, fontSize: 36, color: '#636e72', letterSpacing: 3}}>ALERTA DO GOVERNO</div>
          <div style={{fontWeight: 900, fontSize: 70, color: INK, lineHeight: 1.05, marginTop: 40}}>POR 24 HORAS<br />TUDO CUSTA</div>
          <div style={{fontWeight: 900, fontSize: 150, color: '#ff4757', marginTop: 20}}>R$ 1.000</div>
        </div>
      </Phone>
      <Person {...ME} x={540} y={1800} scale={0.95} emotion="shocked" lookY={-0.4} />
      {frame >= 70 ? <Stamp x={540} y={1040} text="ATÉ PÃO DE QUEIJO" at={70} color="#ffa502" size={54} rot={-3} /> : null}
      <Pop at={70} /><Sting at={4} volume={0.5} />
    </AbsoluteFill>
  );
};

// s03
const Fato: React.FC = () => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [30, 120], [0, 2477], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{background: '#1e272e'}}>
      <Title text="BRASIL, 1993" color="#fed330" top={130} size={86} at={4} />
      <Led x={70} y={380} w={940} label="INFLAÇÃO NO ANO (IPCA)" value={`${Math.round(v).toLocaleString('pt-BR')}%`} size={130} color="#ff6b6b" at={20} />
      {frame >= 130 ? <PriceTag x={540} y={820} old="R$ 10" now={frame < 170 ? 'R$ 12' : 'R$ 15'} flipAt={130} at={130} scale={0.9} size={60} /> : null}
      {frame >= 130 ? <Stamp x={540} y={1180} text="PREÇO MUDAVA O TEMPO TODO" at={150} color="#ff4757" size={46} rot={-3} /> : null}
      <Cap text="Fonte: IBGE, IPCA acumulado de 1993 (2.477%)" />
      <Pop at={20} /><Pop at={130} /><Sting at={20} volume={0.35} />
    </AbsoluteFill>
  );
};

// s04
const Pao: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#ffeaa7" floor="#cc8e35" />
      <div style={{position: 'absolute', left: 150, top: 230, width: 780, height: 100, background: '#e17055', border: `9px solid ${INK}`, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 60, color: '#fff', letterSpacing: 6}}>PADARIA</div>
      <Big x={540} y={600} e="🧀" s={1.3} rot={Math.sin(frame / 9) * 4} />
      <PriceTag x={540} y={420} now="R$ 1.000" at={8} scale={0.9} size={58} />
      <Person {...P3} x={260} y={1450} scale={1.4} emotion="happy" talking bob />
      <Bubble x={420} y={1000} w={480} size={56} text="QUE BARATO!" at={40} tail="left" />
      <Pop at={8} /><Pop at={40} />
    </AbsoluteFill>
  );
};

// s05
const Mansao: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#1e2a4a'}}>
      <Phone x={540} y={200} w={680} h={940}>
        <div style={{padding: '80px 30px', fontFamily: FONT, textAlign: 'center'}}>
          <div style={{fontWeight: 800, fontSize: 34, color: '#636e72', letterSpacing: 3}}>APP IMOBILIÁRIO</div>
          <div style={{fontSize: 240, lineHeight: 1.1, marginTop: 30}}>🏰</div>
          <div style={{fontWeight: 900, fontSize: 56, color: INK}}>MANSÃO COM PISCINA</div>
          <div style={{fontWeight: 900, fontSize: 120, color: '#20bf6b'}}>R$ 1.000</div>
        </div>
      </Phone>
      <Person {...ME} x={540} y={1800} scale={0.95} emotion={frame < 50 ? 'neutral' : 'shocked'} lookY={-0.3} />
      {frame >= 60 ? <Stamp x={540} y={1090} text="E AGORA?" at={60} color="#ffa502" size={56} rot={-3} /> : null}
      <Pop at={20} /><Pop at={60} />
    </AbsoluteFill>
  );
};

// s06
const Cidade: React.FC = () => {
  const frame = useCurrentFrame();
  const run = (frame % 30) < 15 ? 8 : -8;
  return (
    <AbsoluteFill>
      <Street />
      <DayTag text="10 MINUTOS DEPOIS" />
      {CROWD.map((p, i) => (
        <Person key={i} {...p} x={120 + i * 210 + run * (i % 2 ? 1 : -1)} y={1350 + (i % 2) * 90} scale={1.0} emotion="scared" lookX={1} bob />
      ))}
      <Big x={880} y={420} e="🏰" s={1.2} />
      <Big x={220} y={680} e="🏢" s={0.9} />
      <Stamp x={540} y={1010} text="FILA PRO CASTELO" at={30} color="#ff4757" size={64} rot={-3} />
      <Pop at={30} />
    </AbsoluteFill>
  );
};

// s07
const Loja: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#fab1a0" floor="#b2967d" />
      <Rack x={80} y={500} n={6} gone={0} />
      <PriceTag x={300} y={330} now="R$ 1.000" at={6} scale={0.8} size={54} />
      <Person {...CIDA} x={760} y={1250} scale={1.5} emotion={frame < 60 ? 'neutral' : 'sad'} lookX={-1} />
      {frame >= 40 ? <Bubble x={720} y={820} w={480} size={54} text="NINGUÉM?" at={40} tail="center" /> : null}
      <Stamp x={540} y={1450} text="CLIENTES: 0" at={90} color="#ff4757" size={70} rot={-3} />
      <Pop at={6} /><Pop at={90} />
    </AbsoluteFill>
  );
};

// s08
const Conta: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#1e272e'}}>
      <Title text="A CONTA" color="#fed330" top={120} size={80} at={0} />
      <TV x={110} y={330} w={260} h={160} />
      <Laptop x={540} y={350} s={1.1} />
      <Sneaker x={880} y={370} s={0.95} />
      {[200, 540, 880].map((x, i) => <Chip key={i} x={x} y={560} text="R$ 1.000" at={20 + i * 18} color="#20bf6b" size={46} />)}
      <Led x={90} y={780} w={900} label="TEM" value="R$ 3.000" size={100} at={80} color="#2ee66b" />
      <Led x={90} y={1070} w={900} label="PRECISA" value="R$ 4.000" size={100} at={110} color="#ff6b6b" />
      {frame >= 140 ? <Stamp x={540} y={1400} text="FALTA R$ 1.000" at={140} color="#ff4757" size={72} rot={-3} /> : null}
      <Pop at={20} /><Pop at={80} /><Pop at={110} /><Pop at={140} /><Sting at={140} volume={0.4} />
    </AbsoluteFill>
  );
};

// s09
const Carro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#dff9fb" floor="#95a5a6" />
      <Car x={620} y={700} s={1.4} />
      <PriceTag x={620} y={440} old="R$ 89.990" now="R$ 1.000" flipAt={60} at={4} scale={1.0} />
      <Person {...ME} x={190} y={1420} scale={1.5} emotion={frame < 60 ? 'smirk' : 'sad'} lookX={1} />
      <Key x={880} y={1130} s={1.4} />
      {frame >= 110 ? <Stamp x={540} y={1000} text="O CARRO OLHA DE VOLTA" at={110} color="#a55eea" size={48} rot={3} /> : null}
      <Pop at={4} /><Pop at={60} /><Pop at={110} /><Sting at={60} volume={0.4} />
    </AbsoluteFill>
  );
};

// s10
const Venda: React.FC = () => {
  const frame = useCurrentFrame();
  const carX = interpolate(frame, [80, 140], [560, 1500], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Street />
      <Car x={carX} y={720} s={1.3} />
      <Person {...NEIGH} x={880} y={1400} scale={1.4} emotion="happy" bob />
      <Person {...ME} x={220} y={1400} scale={1.4} emotion={frame < 80 ? 'worried' : 'sad'} lookX={1} />
      <Big x={880} y={880} e="📜" s={1.0} rot={Math.sin(frame / 8) * 6} />
      {frame >= 20 ? <Stamp x={700} y={700} text="ESCRITURA DE UMA ILHA" at={20} color="#0984e3" size={38} rot={-3} /> : null}
      {frame >= 60 ? <Chip x={540} y={1150} text="R$ 1.000 ✓" at={60} color="#20bf6b" size={64} /> : null}
      <Pop at={20} /><Pop at={60} />
    </AbsoluteFill>
  );
};

// s11
const Pagar: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#fab1a0" floor="#b2967d" />
      <Rack x={80} y={500} n={6} gone={0} />
      <Person {...CIDA} x={640} y={1300} scale={1.5} emotion="happy" />
      <Person {...ME} x={330} y={1300 + Math.max(0, 70 - frame) * 0} scale={1.5} emotion="happy" lookX={1} />
      <Led x={90} y={260} w={900} label="DÍVIDA DA LOJA" value={frame < 40 ? 'R$ 4.000' : 'R$ 0'} size={100} color={frame < 40 ? '#ff6b6b' : '#2ee66b'} at={4} />
      {frame >= 40 ? <Stamp x={540} y={680} text="PAGO!" at={40} color="#20bf6b" size={100} rot={-4} /> : null}
      {frame >= 100 ? <Big x={540} y={820} e="❤️" s={0.8} rot={Math.sin(frame / 6) * 8} /> : null}
      <Pop at={4} /><Pop at={40} /><Sting at={40} volume={0.4} />
    </AbsoluteFill>
  );
};

// s12
const Meianoite: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#1e2a4a'}}>
      <DayTag text="00:00" />
      <Flash at={4} len={8} />
      <div style={{position: 'absolute', left: 60, top: 330, width: 450, height: 560, background: '#2f3b5c', border: `8px solid ${INK}`, borderRadius: 24, textAlign: 'center', fontFamily: FONT, fontWeight: 900, color: '#fff'}}>
        <div style={{fontSize: 130, marginTop: 40}}>🏝️</div>
        <div style={{fontSize: 40, marginTop: 20}}>ILHA DO VIZINHO</div>
        <div style={{fontSize: 56, color: '#2ee66b', marginTop: 20}}>VALE MILHÕES</div>
      </div>
      <div style={{position: 'absolute', left: 570, top: 330, width: 450, height: 560, background: '#2f3b5c', border: `8px solid ${INK}`, borderRadius: 24, textAlign: 'center', fontFamily: FONT, fontWeight: 900, color: '#fff'}}>
        <div style={{fontSize: 130, marginTop: 40}}>🚗</div>
        <div style={{fontSize: 40, marginTop: 20}}>SEU CARRO</div>
        <div style={{fontSize: 56, color: '#ff6b6b', marginTop: 20}}>NUNCA MAIS</div>
      </div>
      {frame >= 100 ? <Stamp x={540} y={1000} text="MAS A LOJA TÁ SALVA" at={100} color="#20bf6b" size={56} rot={-3} /> : null}
      <Person {...ME} x={540} y={1800} scale={0.95} emotion={frame < 100 ? 'worried' : 'happy'} />
      <Pop at={100} /><Sting at={4} volume={0.6} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#192a56'}}>
      <Title text="VOCÊ VENDERIA SEU CARRO ZERO POR R$ 1.000 PRA SALVAR A LOJA DA SUA MÃE?" color="#fff" top={90} size={52} />
      <div style={{position: 'absolute', left: 120, top: 600, width: 380, height: 130, borderRadius: 40, background: '#20bf6b', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 70, color: '#fff'}}>SIM</div>
      <div style={{position: 'absolute', left: 580, top: 600, width: 380, height: 130, borderRadius: 40, background: '#ff4757', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 70, color: '#fff'}}>NÃO</div>
      <Person {...ME} x={300} y={1280} scale={1.5} emotion="worried" lookX={1} />
      <Person {...CIDA} x={780} y={1280} scale={1.5} emotion="happy" lookX={-1} flip />
      <Stamp x={540} y={520} text="PARTE 3?" at={20} color="#fed330" size={48} rot={-4} />
      <div style={{position: 'absolute', left: 140, right: 140, top: 1470, height: 110, borderRadius: 55, background: '#fed330', border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: INK, transform: `scale(${1 + Math.sin(frame / 5) * 0.03})`}}>@hipoteticamente.br</div>
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook, alerta: Alerta, fato: Fato, pao: Pao, mansao: Mansao, cidade: Cidade, loja: Loja, conta: Conta,
  carro: Carro, venda: Venda, pagar: Pagar, meianoite: Meianoite, cta: Cta,
};
