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

// s01
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Hall />
      <DayBadge n="DIA 30" />
      <Stamp x={540} y={420} text="BAIRRO SEM ÁGUA" at={30} color="#ff4757" size={62} rot={-3} />
      <Person {...ME} x={230} y={1330} scale={1.4} emotion={frame < 90 ? 'scared' : 'worried'} lookX={1} bob />
      <Person {...ROSA} x={850} y={1330} scale={1.4} emotion="neutral" lookX={-1} />
      <Bucket x={540} y={1330} s={1.7 + Math.sin(frame / 6) * 0.03} fill={0.18} />
      <Stamp x={540} y={700} text="SÓ UM BALDE" at={80} color="#0c63c9" size={70} rot={-5} />
      <Pop at={30} /><Pop at={80} />
    </AbsoluteFill>
  );
};

// s02
const Fato: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#2f3542'}}>
      <Title text="ORGANIZAÇÃO MUNDIAL DA SAÚDE" color="#fed330" top={130} size={62} at={4} />
      <Stamp x={540} y={430} text="BÁSICO: 50 A 100 L" at={30} color="#20bf6b" size={66} rot={-3} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 52, color: '#fff'}}>POR PESSOA, POR DIA</div>
      {frame >= 110 ? <Bucket x={540} y={1000} s={1.6} fill={0.2} /> : null}
      {frame >= 110 ? <Stamp x={540} y={1060} text="O BALDE: 20 L" at={110} color="#ff4757" size={70} rot={-4} /> : null}
      {frame >= 150 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1110, textAlign: 'center', fontSize: 90, letterSpacing: 6, opacity: Math.min(1, (frame - 150) / 10)}}>🧍🧍🧍🧍🧍🧍</div>
      ) : null}
      <Pop at={30} /><Pop at={110} /><Pop at={150} />
      <Cap text="Fonte: OMS, Howard & Bartram (2003), Domestic Water Quantity, Service Level and Health" top={1500} />
    </AbsoluteFill>
  );
};

// s03
const Sindico: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Hall />
      <Stamp x={540} y={220} text="ASSEMBLEIA DE EMERGÊNCIA" at={0} color="#2f3542" size={50} rot={-3} />
      <Person {...ME} x={170} y={1300} scale={0.95} emotion="worried" lookX={1} dim={0.2} />
      <Person {...ROSA} x={910} y={1300} scale={0.95} emotion="worried" lookX={-1} dim={0.2} />
      <Person {...SIND} x={540} y={1350} scale={1.5} emotion="smirk" talking bob />
      <Crown x={540} y={1350 - 340 * 1.5} s={1.5} at={50} />
      <Bubble x={540} y={640} w={760} size={60} text="EU SOU O GUARDIÃO DO BALDE!" at={20} />
      <Stamp x={540} y={1470} text="COROA DE PAPELÃO" at={100} color="#fed330" size={50} rot={-3} />
      <Pop at={20} /><Pop at={100} />
      <Sting at={50} volume={0.3} />
    </AbsoluteFill>
  );
};

const LawCard: React.FC<{n: string}> = ({n}) => <Stamp x={540} y={200} text={n} at={0} color="#ff4757" size={80} rot={-3} />;

// s04
const Banho: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#74b9ff'}}>
      <LawCard n="LEI Nº 1" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 76, color: '#fff', WebkitTextStroke: `9px ${INK}`, paintOrder: 'stroke fill'}}>BANHO: 1 POR MÊS</div>
      <Floor color="#a29bfe" y={1250} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontSize: 240, transform: `rotate(${Math.sin(frame / 6) * 5}deg)`}}>🚿</div>
      <Person {...NEI} x={540} y={1560} scale={1.4} emotion={frame > 60 ? 'happy' : 'neutral'} bob />
      {frame >= 60 ? <Stamp x={540} y={1000} text="SORTEADO!" at={60} color="#20bf6b" size={84} rot={-6} /> : null}
      {frame >= 100 ? Array.from({length: 14}).map((_, i) => <div key={i} style={{position: 'absolute', left: (i * 83) % 1040, top: ((frame - 100) * (5 + (i % 4)) + i * 70) % 1700, fontSize: 44}}>🎉</div>) : null}
      <Pop at={60} />
      <Sting at={60} volume={0.4} />
    </AbsoluteFill>
  );
};

// s05
const Mao: React.FC = () => {
  const frame = useCurrentFrame();
  const days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX'];
  return (
    <AbsoluteFill style={{background: '#a29bfe'}}>
      <LawCard n="LEI Nº 2" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 68, color: '#fff', WebkitTextStroke: `9px ${INK}`, paintOrder: 'stroke fill'}}>1 DEDO POR DIA</div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 560, display: 'flex', justifyContent: 'space-between'}}>
        {days.map((d, i) => (
          <div key={d} style={{width: 170, height: 170, borderRadius: 28, background: frame > 12 + i * 12 ? '#20bf6b' : '#fff', border: `8px solid ${INK}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, color: INK, fontSize: 38}}>
            <div style={{fontSize: 60}}>☝️</div>{d}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 280, top: 820, width: 520, height: 190, borderRadius: 28, background: frame > 80 ? '#fed330' : '#dfe6e9', border: `8px solid ${INK}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, color: INK, fontSize: 44}}>
        <div style={{fontSize: 70}}>👍</div>DOMINGO: O DEDÃO
      </div>
      <Person {...ME} x={540} y={1560} scale={1.4} emotion={frame > 80 ? 'happy' : 'worried'} lookY={-0.2} />
      <Pop at={20} /><Pop at={80} />
    </AbsoluteFill>
  );
};

// s06
const Silencio: React.FC = () => {
  const frame = useCurrentFrame();
  const mime = Math.sin(frame * 0.7);
  return (
    <AbsoluteFill>
      <Hall />
      <LawCard n="LEI Nº 3" />
      <Stamp x={540} y={380} text="🤫 SILÊNCIO" at={20} color="#2f3542" size={80} rot={-3} />
      <Person {...NEI} x={230} y={1350} scale={1.35} emotion="shocked" lookX={1} />
      <Person {...NEI2} x={850} y={1350} scale={1.35} emotion="smirk" lookX={-1} flip />
      <div style={{position: 'absolute', left: 120 + mime * 14, top: 640, fontSize: 130}}>{frame % 40 < 20 ? '😤' : '🙄'}</div>
      <div style={{position: 'absolute', left: 740, top: 640 - mime * 12, fontSize: 130}}>{frame % 50 < 25 ? '🫵' : '🤌'}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 780, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, color: INK, fontSize: 80, opacity: Math.min(1, Math.max(0, (frame - 70) / 10))}}>MÍMICA</div>
      <Pop at={20} />
    </AbsoluteFill>
  );
};

// s07
const Troca: React.FC = () => {
  const frame = useCurrentFrame();
  const t = ease(Math.min(1, Math.max(0, (frame - 50) / 40)));
  return (
    <AbsoluteFill style={{background: '#ffeaa7'}}>
      <Title text="A ECONOMIA DO PRÉDIO" color="#e17055" top={130} size={70} at={0} />
      <Floor color="#fab1a0" y={1250} />
      <Person {...NEI} x={190} y={1500} scale={1.3} emotion={frame > 90 ? 'happy' : 'neutral'} />
      <Person {...SIND} x={890} y={1500} scale={1.3} emotion="smirk" />
      <div style={{position: 'absolute', left: 130 + t * 520, top: 700, fontSize: 230}}>🚗</div>
      <div style={{position: 'absolute', left: 740 - t * 520, top: 860, fontSize: 190}}>🥛</div>
      <Stamp x={540} y={560} text="TROCA JUSTA" at={20} color="#20bf6b" size={72} rot={-4} />
      {frame >= 100 ? <Stamp x={540} y={1180} text="COPO VAZIO" at={100} color="#ff4757" size={64} rot={5} /> : null}
      <Pop at={20} /><Pop at={100} />
    </AbsoluteFill>
  );
};

// s08
const Ladrao: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [10, 90], [-120, 440], {...clamp});
  return (
    <AbsoluteFill>
      <Hall night />
      <Person {...SIND} x={760} y={1430} scale={1.4} emotion="neutral" lookX={0} />
      <Crown x={760} y={1430 - 340 * 1.4} s={1.4} />
      <Bucket x={760} y={1380} s={1.2} fill={0.2} />
      <div style={{position: 'absolute', left: 780, top: 800 - Math.sin(frame / 8) * 10, fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#dfe6e9'}}>Z z z</div>
      <Person {...THIEF} x={x} y={1430} scale={1.3} emotion={frame > 90 ? 'shocked' : 'smirk'} lookX={1} bob={frame < 90} />
      {frame >= 90 ? <Stamp x={400} y={800} text="OPA." at={90} color="#ff4757" size={80} rot={-6} /> : null}
      <Pop at={90} />
      <Sting at={90} volume={0.4} />
    </AbsoluteFill>
  );
};

// s09
const Voce: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [20, 170], [180, 760], {...clamp});
  return (
    <AbsoluteFill>
      <Hall />
      {[[120, 'NEI', 0], [540, 'NEI2', 1], [950, 'SIND', 2]].map(([px, k]) => (
        <Person key={String(k)} {...(k === 'NEI' ? NEI : k === 'NEI2' ? NEI2 : SIND)} x={px as number} y={900} scale={0.9} emotion="scared" lookX={frame > 60 ? 0.6 : -0.3} dim={0.15} />
      ))}
      <Person {...ME} x={x} y={1500} scale={1.5} emotion="scared" lookX={1} bob />
      <Bucket x={x + 130} y={1470} s={1.0} fill={0.02} />
      <Drop x={x + 130} y={1410 + Math.sin(frame / 5) * 4} s={0.6} />
      <Stamp x={540} y={330} text="1 GOTA" at={30} color="#0c63c9" size={80} rot={-4} />
      {frame >= 120 ? <Bubble x={540} y={640} w={640} size={56} text="NÃO RESPIRA!" at={120} /> : null}
      <Pop at={30} />
    </AbsoluteFill>
  );
};

// s10
const Chuva: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = frame > 20 && frame < 26;
  return (
    <AbsoluteFill style={{background: '#576574'}}>
      <div style={{position: 'absolute', left: 60, top: 120, width: 400, height: 160, borderRadius: 80, background: '#2f3542', border: `7px solid ${INK}`}} />
      <div style={{position: 'absolute', left: 560, top: 180, width: 440, height: 170, borderRadius: 85, background: '#2f3542', border: `7px solid ${INK}`}} />
      {frame > 20 ? <Stamp x={540} y={440} text="CHUVA!!!" at={22} color="#0c63c9" size={96} rot={-4} /> : null}
      {frame > 50 ? Array.from({length: 18}).map((_, i) => <Drop key={i} x={(i * 61) % 1040 + 20} y={((frame - 50) * (9 + (i % 5)) + i * 90) % 1500 + 200} s={0.6} />) : frame > 30 ? <Drop x={540} y={((frame - 30) * 14) % 1300 + 300} s={0.9} /> : null}
      <Floor color="#2d3436" y={1300} />
      <Person {...ME} x={190} y={1560} scale={1.25} emotion="happy" lookY={-1} />
      <Person {...NEI} x={540} y={1560} scale={1.25} emotion="happy" lookY={-1} />
      <Person {...ROSA} x={890} y={1560} scale={1.25} emotion="happy" lookY={-1} />
      {flash ? <AbsoluteFill style={{background: '#fff', opacity: 0.8}} /> : null}
      <Pop at={22} />
      <Sting at={20} volume={0.5} />
    </AbsoluteFill>
  );
};

// s11
const Danca: React.FC = () => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [10, 160], [0.02, 1], {...clamp});
  const d = (k: number) => Math.sin(frame / 5 + k) * 18;
  return (
    <AbsoluteFill style={{background: '#3d6bb3'}}>
      {Array.from({length: 22}).map((_, i) => <Drop key={i} x={(i * 53) % 1040 + 20} y={(frame * (10 + (i % 5)) + i * 80) % 1500 + 150} s={0.6} />)}
      <Stamp x={540} y={230} text="30 SEGUNDOS" at={0} color="#2f3542" size={72} rot={-3} />
      <Floor color="#2d3436" y={1300} />
      <Bucket x={540} y={1330} s={1.8} fill={fill} />
      <div style={{position: 'absolute', left: 0, top: d(0)}}><Person {...SIND} x={170} y={1560} scale={1.15} emotion="happy" bob /></div>
      <div style={{position: 'absolute', left: 0, top: d(2)}}><Person {...ROSA} x={910} y={1560} scale={1.15} emotion="happy" bob /></div>
      <div style={{position: 'absolute', left: 0, top: d(4)}}><Person {...ME} x={540} y={1760} scale={1.0} emotion="happy" bob /></div>
      <Crown x={170} y={1560 - 340 * 1.15 + d(0)} s={1.15} />
      {frame > 150 ? <Stamp x={540} y={560} text="BALDE CHEIO!" at={150} color="#20bf6b" size={86} rot={-4} /> : null}
      <Pop at={150} /><Sting at={150} volume={0.4} />
    </AbsoluteFill>
  );
};

// s12
const Gole: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Hall />
      <Person {...ME} x={230} y={1350} scale={1.4} emotion="happy" lookX={1} />
      <Person {...ROSA} x={620} y={1350} scale={1.4} emotion="happy" lookX={-1} talking={frame < 70} />
      <Bucket x={430} y={1250} s={1.1} fill={0.95} />
      <div style={{position: 'absolute', left: 405, top: 1090, fontSize: 90}}>🥤</div>
      <Person {...SIND} x={930} y={1350} scale={1.2} emotion="sad" lookX={-1} talking={frame > 80} />
      {frame >= 80 ? <Bubble x={900} y={720} w={560} size={52} text="POSSO LAVAR SÓ UM DEDO?" at={80} tail="right" /> : null}
      {frame >= 40 ? <div style={{position: 'absolute', left: 850, top: 980, fontSize: 110, transform: `rotate(${(frame - 40) * 0.8}deg)`}}>👑</div> : null}
      <Stamp x={400} y={260} text="O 1º GOLE" at={10} color="#fed330" size={70} rot={-4} />
      <Pop at={10} /><Pop at={80} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#273c75'}}>
      <Title text="VOCÊ DARIA O 1º GOLE PRA DONA ROSA?" color="#fff" top={130} size={68} />
      <div style={{position: 'absolute', left: 120, top: 520, width: 380, height: 130, borderRadius: 40, background: '#20bf6b', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#fff'}}>SIM</div>
      <div style={{position: 'absolute', left: 580, top: 520, width: 380, height: 130, borderRadius: 40, background: '#ff4757', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#fff'}}>NÃO</div>
      <Person {...ME} x={320} y={1200} scale={1.5} emotion="worried" lookX={1} />
      <Bucket x={470} y={1190} s={0.9} fill={0.9} />
      <Person {...ROSA} x={680} y={1200} scale={1.5} emotion="happy" lookX={-1} />
      <Stamp x={540} y={440} text="PARTE 4?" at={20} color="#fed330" size={52} rot={-4} />
      <div style={{position: 'absolute', left: 140, right: 140, top: 1470, height: 110, borderRadius: 55, background: '#fed330', border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 56, color: INK, transform: `scale(${1 + Math.sin(frame / 5) * 0.03})`}}>@hipoteticamente.br</div>
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook, fato: Fato, sindico: Sindico, banho: Banho, mao: Mao, silencio: Silencio, troca: Troca,
  ladrao: Ladrao, voce: Voce, chuva: Chuva, danca: Danca, gole: Gole, cta: Cta,
};
