import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Person, PersonProps} from './Person';
import {INK, ME, Pop, Sting, Flash, Floor, Title, Room} from './lib';

const LEO = {skin: '#8d5524', hair: 'spiky' as const, hairColor: '#1e1e1e', shirt: '#4b7bec', pants: '#2d3436'};
const BIA = {skin: '#e0ac69', hair: 'long' as const, hairColor: '#2d3436', shirt: '#a55eea', pants: '#34495e'};
const BAKER = {skin: '#ffdbac', hair: 'bald' as const, mustache: true, shirt: '#f5f6fa', apron: true, hat: 'cap' as const, hatColor: '#f5f6fa'};
const POP = {skin: '#f2c29b', hair: 'bun' as const, hairColor: '#e15f41', shirt: '#fd79a8', pants: '#574b90', apron: true};

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

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


// ---------- cenário: quadra ----------
const KID_COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#ff9ff3', '#54a0ff', '#a29bfe', '#fab1a0'];
const Court: React.FC<{banner?: boolean; boo?: boolean}> = ({banner = true, boo}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#74b9ff'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, height: 620, background: '#636e72', borderTop: `8px solid ${INK}`, borderBottom: `8px solid ${INK}`}}>
        {[0, 1, 2].map((r) => (
          <div key={r} style={{position: 'absolute', left: 0, right: 0, top: 30 + r * 190, height: 8, background: '#2d3436'}} />
        ))}
        {[0, 1, 2].map((r) =>
          Array.from({length: 9}).map((_, c) => {
            const hop = Math.abs(Math.sin((frame + c * 7 + r * 11) / (boo ? 3 : 8))) * (boo ? 26 : 8);
            return (
              <div key={`${r}-${c}`} style={{position: 'absolute', left: 20 + c * 116, top: 56 + r * 190 - hop, width: 70, height: 90}}>
                <div style={{position: 'absolute', left: 8, top: 0, width: 54, height: 54, borderRadius: 27, background: '#ffdbac', border: `5px solid ${INK}`}} />
                <div style={{position: 'absolute', left: 0, top: 48, width: 70, height: 46, borderRadius: '24px 24px 0 0', background: KID_COLORS[(c * 3 + r * 5) % KID_COLORS.length], border: `5px solid ${INK}`}} />
              </div>
            );
          })
        )}
      </div>
      {banner && (
        <div style={{position: 'absolute', left: 90, right: 90, top: 330, height: 170, background: '#fed330', border: `9px solid ${INK}`, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 66, color: INK, textAlign: 'center', lineHeight: 1}}>
          GRANDE FINAL DA VERDADE
        </div>
      )}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1180, bottom: 0, background: '#e58e26', borderTop: `8px solid ${INK}`}}>
        <div style={{position: 'absolute', left: 60, right: 60, top: 150, height: 8, background: '#fff'}} />
        <div style={{position: 'absolute', left: 340, top: 60, width: 400, height: 400, borderRadius: 200, border: '8px solid #fff'}} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- multidão de Léos ----------
const COLS = 8;
const gridPos = (i: number, n = 64, gap = 100) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  const inRow = Math.min(COLS, n - r * COLS);
  return {x: 540 + (c - (inRow - 1) / 2) * 125 + (n >= 64 ? (r % 2) * 20 - 10 : 0), y: 560 + r * gap};
};
const REAL = 37; // índice do Léo de verdade na multidão

const Plaza: React.FC = () => (
  <AbsoluteFill style={{background: '#74b9ff'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 380, bottom: 0, background: '#e58e26', borderTop: `8px solid ${INK}`}}>
      <div style={{position: 'absolute', left: 60, right: 60, top: 640, height: 8, background: '#fff'}} />
      <div style={{position: 'absolute', left: 340, top: 440, width: 400, height: 400, borderRadius: 200, border: '8px solid #fff', opacity: 0.6}} />
    </div>
  </AbsoluteFill>
);

type CrowdProps = {count: number | ((i: number) => boolean); scale?: number; gap?: number; vanish?: (i: number) => number; revealAt?: number};
const Crowd: React.FC<CrowdProps> = ({count, scale = 0.3, gap = 100, vanish, revealAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      {Array.from({length: 64}).map((_, i) => {
        const {x, y} = gridPos(i, typeof count === 'number' ? count : 64, gap);
        const visible = typeof count === 'number' ? i < count : count(i);
        if (!visible) return null;
        const isReal = i === REAL;
        if (vanish && !isReal) {
          const v = vanish(i);
          if (frame >= v) return null;
        }
        return (
          <Person key={i} {...LEO} x={x} y={y} scale={scale} emotion={isReal ? 'worried' : 'smirk'} lookX={isReal ? 0.8 : -0.2} bob />
        );
      })}
      {revealAt !== undefined && frame >= revealAt && (
        <div style={{position: 'absolute', left: gridPos(REAL).x - 230, top: gridPos(REAL).y - 220, width: 460, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 48, color: INK, background: '#fed330', border: `7px solid ${INK}`, borderRadius: 18, padding: '4px 10px', transform: `scale(${spring({frame: frame - revealAt, fps, config: {damping: 9}})})`}}>
          O DE VERDADE ▼
        </div>
      )}
    </>
  );
};

const CountBadge: React.FC<{n: number; label?: string}> = ({n, label = 'LÉOS'}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 150, color: '#fed330', WebkitTextStroke: `14px ${INK}`, paintOrder: 'stroke fill', lineHeight: 1}}>
    {n} <span style={{fontSize: 90, color: '#fff'}}>{label}</span>
  </div>
);

// ---------- cenas ----------
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Court banner={false} />
      <Person {...ME} x={540} y={1280} scale={1.5} emotion="shocked" lookX={0} />
      <Person {...LEO} x={190} y={1230} scale={1.4} emotion="smirk" lookX={1} />
      <Person {...LEO} x={890} y={1230} scale={1.4} emotion="smirk" lookX={-1} flip />
      <Title text="NA QUADRA TINHA DOIS LÉOS" color="#fed330" top={150} size={100} at={2} />
      <Stamp x={900} y={640} text="PARTE 3" at={14} size={52} rot={8} color="#ff4757" />
      <Pop at={4} /><Sting at={30} volume={0.6} />
    </AbsoluteFill>
  );
};

const Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const lies: [string, number, number, number][] = [['O PÃO É DE HOJE!', 250, 700, 20], ['EU AMO ACORDAR CEDO', 830, 700, 45], ['NUNCA COMI O PÃO DE QUEIJO', 540, 470, 70]];
  return (
    <AbsoluteFill>
      <Court banner={false} />
      <Person {...ME} x={300} y={1260} scale={1.5} emotion="worried" lookX={1} />
      <Person {...BIA} x={780} y={1260} scale={1.5} emotion="worried" lookX={-1} />
      {lies.map(([t, x, y, at], i) => (
        <Bubble key={i} x={x} y={y - Math.max(0, frame - at - 40) * 3} w={420} size={40} text={t} at={at} color="#dfe6e9" tail="center" />
      ))}
      {frame > 120 && [0, 1, 2].map((i) => (
        <Person key={i} {...LEO} x={[150, 540, 930][i]} y={1080} scale={0.6} emotion="smirk" lookX={0} dim={0.35} />
      ))}
      <Pop at={20} /><Pop at={45} /><Pop at={70} /><Sting at={120} volume={0.6} /><Flash at={120} len={5} />
    </AbsoluteFill>
  );
};

const Fato: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [30, 120], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{background: '#2c2c54'}}>
      <div style={{position: 'absolute', left: 60, right: 60, top: 130, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 64, color: '#fed330', lineHeight: 1.05}}>O CÉREBRO SE ACOSTUMA COM A MENTIRA</div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 380}}>
        <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 48, color: '#dfe6e9', marginBottom: 12}}>CULPA</div>
        <div style={{height: 70, background: '#40407a', border: `7px solid ${INK}`, borderRadius: 35, overflow: 'hidden'}}><div style={{width: `${100 - t * 80}%`, height: '100%', background: '#20bf6b'}} /></div>
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 600}}>
        <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 48, color: '#dfe6e9', marginBottom: 12}}>TAMANHO DA MENTIRA</div>
        <div style={{height: 70, background: '#40407a', border: `7px solid ${INK}`, borderRadius: 35, overflow: 'hidden'}}><div style={{width: `${15 + t * 85}%`, height: '100%', background: '#ff4757'}} /></div>
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 850, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 36, color: '#a4b0be'}}>Fonte: Garrett et al. (2016), Nature Neuroscience (amígdala, ressonância magnética)</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 980, textAlign: 'center', fontSize: 190, transform: `scale(${1 + Math.sin(frame / 8) * 0.04})`}}>🧠</div>
      <Pop at={30} />
    </AbsoluteFill>
  );
};

const Dobra1: React.FC = () => {
  const frame = useCurrentFrame();
  const n = frame < 60 ? 2 : frame < 105 ? 4 : 8;
  const n2 = frame < 60 ? 2 : frame < 105 ? 4 : 8;
  return (
    <AbsoluteFill>
      <Plaza />
      <Crowd count={n2} scale={0.55} gap={190} />
      <CountBadge n={n} />
      <Person {...ME} x={230} y={1790} scale={0.9} emotion="shocked" lookY={-0.4} />
      <Bubble x={400} y={1700} w={620} size={46} text="LÉO DE VERDADE, LEVANTA A MÃO!" at={20} tail="left" />
      <Pop at={20} /><Pop at={60} /><Pop at={105} />
    </AbsoluteFill>
  );
};

const Dobra2: React.FC = () => {
  const frame = useCurrentFrame();
  const n = frame < 35 ? 8 : frame < 75 ? 16 : 32;
  return (
    <AbsoluteFill>
      <Plaza />
      <Crowd count={n} scale={0.4} gap={140} />
      <CountBadge n={n} />
      <Person {...ME} x={540} y={1790} scale={0.9} emotion="scared" lookY={-0.4} />
      <Pop at={35} /><Pop at={75} /><Shake from={75} to={95} amp={8}><AbsoluteFill /></Shake>
    </AbsoluteFill>
  );
};

const Tipos: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Court banner={false} />
      <Person {...LEO} x={200} y={1250} scale={1.35} emotion="smirk" lookX={1} />
      <Person {...LEO} x={540} y={1250} scale={1.35} emotion="happy" lookX={0} />
      <Person {...LEO} x={880} y={1250} scale={1.35} emotion="shocked" lookX={-1} />
      <div style={{position: 'absolute', left: 135, top: 880, fontSize: 120, transform: `scale(${spring({frame: frame - 15, fps: 30, config: {damping: 8}})})`}}>🏆</div>
      <div style={{position: 'absolute', left: 400, top: 470, width: 280, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 46, color: INK, background: '#fff', border: `7px solid ${INK}`, borderRadius: 18, opacity: frame > 40 ? 1 : 0}}>NUNCA CHOREI ✖</div>
      <Bubble x={880} y={690} w={420} size={44} text="O PÃO É DE HOJE!" at={85} tail="right" />
      <Pop at={15} /><Pop at={40} /><Pop at={85} />
    </AbsoluteFill>
  );
};

const Multidao: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Plaza />
      <Crowd count={64} scale={0.3} revealAt={85} />
      <CountBadge n={64} />
      <Person {...ME} x={540} y={1790} scale={0.9} emotion="scared" lookY={-0.4} />
      <Sting at={0} volume={0.7} /><Flash at={0} len={6} /><Pop at={85} />
    </AbsoluteFill>
  );
};

const Teste: React.FC = () => {
  const frame = useCurrentFrame();
  const says: [number, number, number][] = [[200, 700, 40], [700, 640, 50], [420, 900, 60], [880, 860, 64], [160, 1000, 70], [600, 1020, 75], [320, 600, 82], [800, 560, 88]];
  return (
    <AbsoluteFill>
      <Plaza />
      <Crowd count={64} scale={0.3} />
      <Person {...ME} x={230} y={1790} scale={0.9} emotion="happy" lookY={-0.2} />
      <Bubble x={420} y={1700} w={640} size={44} text="QUAL A COR DO MEU MOLETOM?" at={10} tail="left" />
      {says.map(([x, y, at], i) => (
        <Stamp key={i} x={x} y={y} text="LARANJA!" at={at} size={38} rot={-10 + i * 3} color="#ff9f43" />
      ))}
      <Pop at={10} />
    </AbsoluteFill>
  );
};

const Achou: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const z = spring({frame: frame - 6, fps, config: {damping: 14}});
  return (
    <AbsoluteFill style={{background: '#273c75'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, rgba(254,211,48,0.4) 0%, rgba(39,60,117,0) 60%)'}} />
      <Person {...LEO} x={540} y={1250} scale={2.4 * z + 0.01} emotion="happy" talking={frame > 12 && frame < 40} lookX={0} />
      <Bubble x={540} y={640} w={520} size={96} text="VERDE." at={12} color="#fed330" />
      <Stamp x={540} y={330} text="ACHOU!" at={50} size={110} rot={-6} color="#20bf6b" />
      <Pop at={12} /><Sting at={50} volume={0.6} />
    </AbsoluteFill>
  );
};

const Exige: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Court banner={false} />
      <Person {...ME} x={260} y={1260} scale={1.6} emotion="worried" lookX={1} />
      <Person {...LEO} x={800} y={1260} scale={1.7} emotion="sad" talking={frame > 10 && frame < 110} lookX={-1} flip />
      <Bubble x={780} y={610} w={640} size={46} text="SÓ VOLTO A FALAR QUANDO VOCÊ PEDIR DESCULPA." at={10} tail="right" />
      <Stamp x={540} y={330} text="PRA TODOS ELES" at={110} size={64} rot={-4} color="#ff4757" />
      <Pop at={10} /><Sting at={110} volume={0.7} />
    </AbsoluteFill>
  );
};

const Desculpas: React.FC = () => {
  const frame = useCurrentFrame();
  const vanish = (i: number) => 20 + i * 4;
  const left = 63 - Math.max(0, Math.min(63, Math.floor((frame - 20) / 4)));
  const say = Math.floor(Math.max(0, frame - 10) / 14) % 2 === 0 ? 'DESCULPA!' : 'DESCULPA, LÉO!';
  return (
    <AbsoluteFill>
      <Plaza />
      <Crowd count={64} scale={0.3} vanish={vanish} />
      <CountBadge n={left + 1} />
      <Person {...ME} x={230} y={1790} scale={0.9} emotion="sad" talking lookY={-0.3} />
      <Bubble x={560} y={1700} w={560} size={56} text={say} at={4} tail="left" />
      {Array.from({length: 12}).map((_, k) => <Pop key={k} at={20 + k * 20} />)}
    </AbsoluteFill>
  );
};

const Absurdo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Court banner={false} />
      <Person {...LEO} x={180} y={1250} scale={1.35} emotion="worried" talking={frame > 12 && frame < 70} lookX={1} />
      <Person {...ME} x={540} y={1260} scale={1.5} emotion="sad" talking lookX={0} />
      <Person {...LEO} x={900} y={1250} scale={1.35} emotion="smirk" talking={frame > 80 && frame < 150} lookX={-1} flip />
      <Bubble x={170} y={700} w={340} size={50} text="MAIS ALTO!" at={12} tail="left" />
      <Bubble x={910} y={700} w={400} size={44} text="TEM PÃO DE QUEIJO?" at={80} tail="right" />
      <Bubble x={540} y={500} w={420} size={50} text="DESCULPA!!!" at={40} color="#fed330" />
      <Pop at={12} /><Pop at={40} /><Pop at={80} />
    </AbsoluteFill>
  );
};

const Paz: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Court banner={false} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,177,66,0.35) 0%, rgba(255,177,66,0) 60%)'}} />
      <Person {...ME} x={290} y={1260} scale={1.6} emotion="happy" lookX={1} />
      <Person {...LEO} x={780} y={1260} scale={1.6} emotion="happy" talking={frame > 50 && frame < 140} lookX={-1} flip />
      <Person {...BIA} x={1010} y={1290} scale={1.1} emotion="happy" lookX={-1} flip />
      <Bubble x={780} y={620} w={620} size={46} text="TÁ BOM. MAS NA PRÓXIMA, SEM MENTIRA." at={50} tail="right" />
      <Pop at={50} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#273c75'}}>
      <Title text="VOCÊ PEDIRIA DESCULPA 64 VEZES PRA SALVAR UMA AMIZADE?" color="#fff" top={130} size={64} />
      <div style={{position: 'absolute', left: 120, top: 580, width: 380, height: 130, borderRadius: 40, background: '#20bf6b', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#fff'}}>SIM</div>
      <div style={{position: 'absolute', left: 580, top: 580, width: 380, height: 130, borderRadius: 40, background: '#ff4757', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#fff'}}>NÃO</div>
      <Person {...ME} x={320} y={1200} scale={1.5} emotion="worried" lookX={1} />
      <Person {...LEO} x={640} y={1200} scale={1.5} emotion="smirk" lookX={-1} />
      <Stamp x={900} y={900} text="PARTE 4?" at={20} color="#fed330" size={48} rot={8} />
      <div style={{position: 'absolute', left: 140, right: 140, top: 1470, height: 110, borderRadius: 55, background: '#fed330', border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 56, color: INK, transform: `scale(${1 + Math.sin(frame / 5) * 0.03})`}}>@hipoteticamente.br</div>
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook, recap: Recap, fato: Fato, dobra1: Dobra1, dobra2: Dobra2, tipos: Tipos, multidao: Multidao,
  teste: Teste, achou: Achou, exige: Exige, desculpas: Desculpas, absurdo: Absurdo, paz: Paz, cta: Cta,
};
