import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Person, PersonProps} from './Person';
import {INK, ME, MOM, Pop, Sting, Floor, Title, Room, Street} from './lib';

// Ep. 12 = Parte 2 de "ouvir o pensamento de todo mundo": agora eles ouvem VOCÊ.
const FONT = 'Inter';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

const BOSS: Partial<PersonProps> = {skin: '#f5cba7', hair: 'bald', mustache: true, suit: true, tie: '#e84118', shirt: '#2f3542'};
const P1: Partial<PersonProps> = {skin: '#f2c29b', hair: 'spiky', hairColor: '#2d3436', shirt: '#6c5ce7', pants: '#2d3436'};
const P2: Partial<PersonProps> = {skin: '#8d5524', hair: 'short', hairColor: '#1e1e1e', shirt: '#0984e3', pants: '#636e72', hat: 'cap', hatColor: '#fdcb6e'};
const P3: Partial<PersonProps> = {skin: '#d1a074', hair: 'long', hairColor: '#6c3b2a', shirt: '#00b894', pants: '#2d3436'};
const P5: Partial<PersonProps> = {skin: '#c68642', hair: 'bun', hairColor: '#2d3436', shirt: '#a29bfe', pants: '#2d3436'};
const DRV: Partial<PersonProps> = {skin: '#d1a074', hair: 'short', hairColor: '#2d3436', hat: 'cap', hatColor: '#2d98da', shirt: '#2d98da', pants: '#2d3436'};

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

const Bubble: React.FC<{x: number; y: number; text: string; at: number; w?: number; size?: number; tail?: 'left' | 'right' | 'center'}> = ({x, y, text, at, w = 520, size = 58, tail = 'center'}) => {
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

// balão de pensamento (nuvem + bolinhas descendo até a cabeça)
const Thought: React.FC<{x: number; y: number; text: string; at: number; w?: number; size?: number; color?: string}> = ({x, y, text, at, w = 560, size = 52, color = '#e8f4ff'}) => {
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

const Big: React.FC<{x: number; y: number; e: string; s?: number; rot?: number}> = ({x, y, e, s = 1, rot = 0}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,0) rotate(${rot}deg)`, fontSize: 200 * s, lineHeight: 1, filter: 'drop-shadow(0 8px 0 rgba(27,27,47,0.5))'}}>{e}</div>
);
const DayTag: React.FC<{text: string; y?: number}> = ({text, y = 150}) => <Stamp x={540} y={y} text={text} at={0} color="#2f3542" size={62} rot={-3} />;
const Cap: React.FC<{text: string; top?: number}> = ({text, top = 1680}) => (
  <div style={{position: 'absolute', top, left: 60, right: 60, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 32, color: '#a4b0be'}}>{text}</div>
);
const Kitchen: React.FC<{night?: boolean}> = ({night}) => (
  <AbsoluteFill>
    <Room wall={night ? '#3d3d6b' : '#ffeaa7'} floor={night ? '#2c2c54' : '#cc8e35'} />
    <div style={{position: 'absolute', left: 620, top: 260, width: 340, height: 300, background: night ? '#1e2a4a' : '#7ed6df', border: `9px solid ${INK}`, borderRadius: 14}}>
      <div style={{position: 'absolute', left: 156, top: 0, bottom: 0, width: 9, background: INK}} />
    </div>
    <div style={{position: 'absolute', left: 60, top: 300, width: 460, height: 160, background: night ? '#57577a' : '#f5f6fa', border: `9px solid ${INK}`, borderRadius: 14}} />
  </AbsoluteFill>
);

// s01
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#a29bfe" floor="#6c5ce7" />
      <DayTag text="DIA 2" />
      <Person {...ME} x={540} y={1450} scale={1.7} emotion={frame < 60 ? 'shocked' : 'worried'} lookY={-0.3} bob />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: 540, top: 780, width: 260 + ((frame * 3 + i * 40) % 120) * 5, height: 260 + ((frame * 3 + i * 40) % 120) * 5, transform: 'translate(-50%,-50%)', borderRadius: '50%', border: `8px solid rgba(255,255,255,${1 - ((frame * 3 + i * 40) % 120) / 120})`}} />
      ))}
      {[[140, 560], [940, 560], [140, 1000], [940, 1000]].map(([x, y], i) => <Big key={i} x={x} y={y} e="👂" s={0.7} rot={Math.sin(frame / 7 + i) * 10} />)}
      <Stamp x={540} y={380} text="ELES OUVEM VOCÊ" at={50} color="#ff4757" size={64} rot={-3} />
      <Pop at={50} /><Sting at={50} volume={0.4} />
    </AbsoluteFill>
  );
};

// s02
const Fato: React.FC = () => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [30, 80], [0, 50], {...clamp, easing: ease});
  const b = interpolate(frame, [110, 160], [0, 23], {...clamp, easing: ease});
  const bar = (y: number, label: string, v: number, color: string, at: number) => frame >= at ? (
    <div style={{position: 'absolute', left: 80, right: 80, top: y}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 44, color: '#fff', marginBottom: 14}}>{label}</div>
      <div style={{height: 120, borderRadius: 30, background: '#2f3542', border: `8px solid ${INK}`, overflow: 'hidden'}}>
        <div style={{width: `${v * 1.9}%`, height: '100%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 24, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: '#fff'}}>{Math.round(v)}%</div>
      </div>
    </div>
  ) : null;
  return (
    <AbsoluteFill style={{background: '#1e272e'}}>
      <Title text="UNIVERSIDADE CORNELL, 2000" color="#fed330" top={120} size={62} at={4} />
      <Big x={540} y={290} e="👕" s={0.9} />
      {bar(640, 'ACHAVAM QUE NOTARIAM A CAMISETA', a, '#ff6b6b', 30)}
      {bar(960, 'NOTARAM DE VERDADE', b, '#20bf6b', 110)}
      {frame >= 180 ? <Stamp x={540} y={1500} text="AGORA ELES OUVEM" at={180} color="#ff4757" size={60} rot={-3} /> : null}
      <Cap text="Fonte: Gilovich, Medvec & Savitsky (2000), J. Personality and Social Psychology" />
      <Pop at={30} /><Pop at={110} /><Pop at={180} />
    </AbsoluteFill>
  );
};

// s03
const Mae: React.FC = () => {
  const frame = useCurrentFrame();
  const bad = frame >= 90;
  return (
    <AbsoluteFill>
      <Kitchen />
      <Person {...ME} x={230} y={1350} scale={1.45} emotion={bad ? 'worried' : 'happy'} lookX={1} />
      <Person {...MOM} x={840} y={1350} scale={1.45} emotion={bad ? 'sad' : 'happy'} lookX={-1} />
      {frame < 85 ? <Thought x={300} y={760} text="QUE MÃE LINDA" at={8} w={520} /> : <Thought x={300} y={760} text="O CAFÉ TÁ HORRÍVEL" at={90} w={560} color="#ffd6d6" />}
      {bad ? <Stamp x={820} y={760} text="SORRISO SUMIU" at={105} color="#ff4757" size={44} rot={4} /> : <Big x={840} y={780} e="😊" s={0.6} />}
      <Pop at={8} /><Pop at={90} /><Sting at={90} volume={0.35} />
    </AbsoluteFill>
  );
};

// s04
const Onibus: React.FC = () => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 5) * 6;
  return (
    <AbsoluteFill>
      <Room wall="#dfe6e9" floor="#636e72" />
      {[80, 400, 720].map((x, i) => <div key={i} style={{position: 'absolute', left: x, top: 260, width: 260, height: 200, background: '#74b9ff', border: `9px solid ${INK}`, borderRadius: 16}} />)}
      <Thought x={300} y={560} text="JINGLE DO COLCHÃO" at={6} w={560} />
      {[P1, P2, P3, P5].map((p, i) => (
        <div key={i} style={{position: 'absolute', left: 0, top: sway * (i % 2 ? 1 : -1)}}>
          <Person {...p} x={440 + i * 190} y={1420} scale={1.05} emotion="happy" talking={frame > 40} bob />
        </div>
      ))}
      <Person {...ME} x={150} y={1420} scale={1.2} emotion="shocked" lookX={1} />
      {frame >= 40 ? [0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 340 + i * 150, top: 900 - ((frame * 3 + i * 40) % 160), fontSize: 80}}>🎵</div>) : null}
      <Person {...DRV} x={900} y={1000} scale={0.9} emotion="scared" lookX={-1} />
      {frame >= 100 ? <Stamp x={540} y={190} text="PARADA ERRADA ×2" at={100} color="#ff4757" size={54} rot={-3} /> : null}
      <Pop at={6} /><Pop at={100} />
    </AbsoluteFill>
  );
};

// s05
const Chefe: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#dfe6e9" floor="#b2967d" />
      <div style={{position: 'absolute', left: 60, top: 760, width: 960, height: 40, background: '#6f4e37', border: `8px solid ${INK}`}} />
      <Person {...ME} x={230} y={1400} scale={1.4} emotion={frame < 50 ? 'worried' : 'shocked'} lookX={1} />
      <Person {...BOSS} x={830} y={1400} scale={1.4} emotion={frame < 50 ? 'neutral' : 'shocked'} lookX={-1} talking={frame >= 50} />
      <Thought x={300} y={760} text="MEU CHEFE NEM SABE MEU NOME" at={4} w={600} size={46} />
      {frame >= 50 ? <Bubble x={780} y={620} w={420} size={50} text="EU SEI, CAIO!" at={50} tail="center" /> : null}
      <Pop at={4} /><Pop at={50} /><Sting at={50} volume={0.35} />
    </AbsoluteFill>
  );
};

// s06
const Nada: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame < 40 ? 'NADA.' : frame < 80 ? 'NADA. NADA.' : 'PENSAR EM NADA JÁ É PENSAR EM ALGUMA COISA?';
  return (
    <AbsoluteFill>
      <Room wall="#dfe6e9" floor="#b2967d" />
      <Person {...ME} x={540} y={1720} scale={1.3} emotion={frame < 110 ? 'worried' : 'scared'} lookY={-0.4} />
      <Thought x={540} y={760} text={t} at={4} w={700} size={frame >= 80 ? 44 : 64} />
      {frame >= 110 ? [P1, P2, P3].map((p, i) => <Person key={i} {...p} x={170 + i * 370} y={1150} scale={0.7} emotion="shocked" dim={0.1} />) : null}
      {frame >= 110 ? <Stamp x={540} y={330} text="O ESCRITÓRIO TRAVOU" at={110} color="#ff4757" size={58} rot={-3} /> : null}
      <Pop at={40} /><Pop at={80} /><Pop at={110} />
    </AbsoluteFill>
  );
};

// s07
const Pombo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Street />
      <Big x={800} y={720} e="🐦" s={1.7} rot={Math.sin(frame / 9) * 4} />
      <Big x={300} y={900} e="🥪" s={0.8} rot={-8} />
      <Person {...ME} x={300} y={1450} scale={1.4} emotion="scared" lookX={1} bob />
      <Thought x={330} y={1020} text="PENSA EM OUTRA COISA..." at={6} w={560} size={44} />
      {frame >= 90 ? <Stamp x={540} y={380} text="PENSOU EM SANDUÍCHE" at={90} color="#ff4757" size={54} rot={3} /> : null}
      <Pop at={6} /><Pop at={90} />
    </AbsoluteFill>
  );
};

// s08
const Truque: React.FC = () => {
  const frame = useCurrentFrame();
  const lines = ['VOCÊ É ÓTIMO!', 'QUE SORRISO LINDO!', 'ADORO ESSE LUGAR!'];
  const i = Math.min(2, Math.floor(frame / 60));
  return (
    <AbsoluteFill style={{background: '#55efc4'}}>
      <Floor color="#00b894" y={1180} />
      <Stamp x={540} y={200} text="SÓ COISA BOA" at={0} color="#20bf6b" size={70} rot={-3} />
      <Thought x={540} y={760} text={lines[i]} at={0} w={640} size={56} color="#fff" />
      <Person {...ME} x={540} y={1750} scale={1.3} emotion="happy" lookY={-0.3} bob />
      {[P1, P2, P3].map((p, k) => <Person key={k} {...p} x={170 + k * 370} y={1150} scale={0.65} emotion="happy" dim={0.1} bob />)}
      {[0, 1, 2, 3].map((k) => <div key={k} style={{position: 'absolute', left: 150 + k * 250, top: 520 - ((frame * 2 + k * 30) % 140), fontSize: 80}}>❤️</div>)}
      <Pop at={0} />
    </AbsoluteFill>
  );
};

// s09
const Absurdo: React.FC = () => {
  const frame = useCurrentFrame();
  const cell = (x: number, y: number, e: string, label: string, at: number, color: string) => frame >= at ? (
    <div style={{position: 'absolute', left: x, top: y, width: 450, height: 430, background: '#fff', border: `9px solid ${INK}`, borderRadius: 30, textAlign: 'center', boxShadow: `0 10px 0 ${INK}`}}>
      <div style={{fontSize: 170, marginTop: 30}}>{e}</div>
      <div style={{margin: '0 20px', padding: '10px 14px', background: color, border: `6px solid ${INK}`, borderRadius: 16, fontFamily: FONT, fontWeight: 900, fontSize: 42, color: '#fff'}}>{label}</div>
    </div>
  ) : null;
  return (
    <AbsoluteFill style={{background: '#74b9ff'}}>
      <DayTag text="RESULTADO" y={150} />
      {cell(60, 240, '😁', 'CHEFE SORRI', 10, '#20bf6b')}
      {cell(570, 240, '🚌', 'CARONA GRÁTIS', 50, '#0984e3')}
      {cell(60, 700, '🐦', 'POMBO DEVOLVE UM FARELO', 90, '#e17055')}
      {cell(570, 700, '🐕', 'CACHORRO PAROU DE LATIR', 130, '#6c5ce7')}
      <Person {...ME} x={540} y={1800} scale={0.85} emotion="happy" bob />
      <Pop at={10} /><Pop at={50} /><Pop at={90} /><Pop at={130} />
    </AbsoluteFill>
  );
};

// s10
const Noite: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kitchen night />
      <DayTag text="MEIA-NOITE" />
      <Person {...ME} x={230} y={1350} scale={1.45} emotion="neutral" lookX={1} />
      <Person {...MOM} x={840} y={1350} scale={1.45} emotion="happy" lookX={-1} talking={frame < 120} />
      <Bubble x={740} y={760} w={560} size={44} text="HOJE CEDO, EU OUVI VOCÊ PENSAR QUE EU SOU LINDA" at={10} tail="center" />
      <Pop at={10} />
    </AbsoluteFill>
  );
};

// s11
const Mae2: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kitchen night />
      <Person {...ME} x={230} y={1350} scale={1.45} emotion={frame < 60 ? 'neutral' : 'happy'} lookX={1} />
      <Person {...MOM} x={840} y={1350} scale={1.45} emotion="happy" lookX={-1} talking={frame < 50} />
      {frame < 55 ? <Bubble x={740} y={760} w={520} size={46} text="GUARDEI ISSO O DIA INTEIRO" at={4} tail="center" /> : <Thought x={300} y={760} text="EU TE AMO" at={55} w={460} size={64} color="#ffd6e7" />}
      {frame >= 80 ? <Big x={560} y={880} e="❤️" s={1.0} rot={Math.sin(frame / 6) * 8} /> : null}
      {frame >= 80 ? <Big x={880} y={720} e="😭" s={0.5} /> : null}
      <Pop at={55} /><Sting at={55} volume={0.35} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#192a56'}}>
      <Title text="VOCÊ GOSTARIA DE OUVIR O QUE SEU CHEFE PENSA DE VOCÊ?" color="#fff" top={100} size={58} />
      <div style={{position: 'absolute', left: 120, top: 620, width: 380, height: 130, borderRadius: 40, background: '#20bf6b', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 70, color: '#fff'}}>SIM</div>
      <div style={{position: 'absolute', left: 580, top: 620, width: 380, height: 130, borderRadius: 40, background: '#ff4757', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 70, color: '#fff'}}>NÃO</div>
      <Person {...ME} x={300} y={1300} scale={1.5} emotion="worried" lookX={1} />
      <Person {...BOSS} x={780} y={1300} scale={1.5} emotion="neutral" lookX={-1} />
      <Stamp x={540} y={540} text="PARTE 3: O CHEFE" at={20} color="#fed330" size={44} rot={-4} />
      <div style={{position: 'absolute', left: 140, right: 140, top: 1470, height: 110, borderRadius: 55, background: '#fed330', border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: INK, transform: `scale(${1 + Math.sin(frame / 5) * 0.03})`}}>@hipoteticamente.br</div>
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook, fato: Fato, mae: Mae, onibus: Onibus, chefe: Chefe, nada: Nada, pombo: Pombo, truque: Truque,
  absurdo: Absurdo, noite: Noite, mae2: Mae2, cta: Cta,
};
