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

// ---------- pombo juiz ----------
const Pigeon: React.FC<{x: number; y: number; scale?: number; blow?: number; sad?: boolean}> = ({x, y, scale = 1, blow = -1, sad}) => {
  const frame = useCurrentFrame();
  const blowing = blow >= 0 && frame >= blow && frame < blow + 14;
  const hop = blowing ? Math.sin((frame - blow) * 1.6) * 8 : Math.sin(frame / 7) * 3;
  return (
    <div style={{position: 'absolute', left: x - 120 * scale, top: y - 260 * scale, width: 240 * scale, height: 260 * scale, transform: `translateY(${-hop}px)`}}>
      <svg viewBox="0 0 240 260" width={240 * scale} height={260 * scale} style={{overflow: 'visible'}}>
        <rect x={20} y={200} width={200} height={16} rx={8} fill="#fff" stroke={INK} strokeWidth={8} />
        <rect x={50} y={214} width={14} height={46} fill="#dfe6e9" stroke={INK} strokeWidth={6} />
        <rect x={176} y={214} width={14} height={46} fill="#dfe6e9" stroke={INK} strokeWidth={6} />
        <ellipse cx={120} cy={150} rx={78} ry={62} fill="#b2bec3" stroke={INK} strokeWidth={8} />
        <path d="M70,150 Q120,200 170,150" fill="#dfe6e9" stroke={INK} strokeWidth={6} />
        <circle cx={150} cy={88} r={42} fill="#b2bec3" stroke={INK} strokeWidth={8} />
        <path d="M184,86 L226,98 L184,112 Z" fill="#fdcb6e" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <circle cx={160} cy={80} r={12} fill="#fff" stroke={INK} strokeWidth={5} />
        <circle cx={sad ? 160 : 163} cy={sad ? 86 : 80} r={5} fill={INK} />
        <rect x={188} y={104} width={34} height={22} rx={11} fill="#dfe6e9" stroke={INK} strokeWidth={5} />
        <path d="M118,62 L150,36 L158,56" fill="#2d3436" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      </svg>
      {blowing && (
        <div style={{position: 'absolute', left: 200 * scale, top: 30 * scale, fontFamily: 'Inter', fontWeight: 900, fontSize: 64 * scale, color: '#ff4757', WebkitTextStroke: `8px ${INK}`, paintOrder: 'stroke fill', transform: `rotate(-12deg) scale(${1 + (frame - blow) / 28})`}}>PIII!</div>
      )}
    </div>
  );
};

// ---------- cenas ----------
const Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - 12, fps, config: {damping: 12}});
  return (
    <AbsoluteFill style={{background: '#0f1123'}}>
      <div style={{position: 'absolute', left: 150, top: 180, width: 780, height: 380, background: INK, borderRadius: 50, border: '8px solid #4b4b6e', transform: `scale(${p})`}}>
        <div style={{position: 'absolute', left: 30, right: 30, top: 30, bottom: 30, background: '#dfe6e9', borderRadius: 30, overflow: 'hidden'}}>
          <div style={{height: 100, background: '#4b7bec', display: 'flex', alignItems: 'center', paddingLeft: 30, gap: 18, borderBottom: `6px solid ${INK}`}}>
            <div style={{width: 60, height: 60, borderRadius: 30, background: '#8d5524', border: `5px solid ${INK}`}} />
            <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 48, color: '#fff'}}>Léo</div>
          </div>
          <div style={{position: 'absolute', left: 28, top: 135, background: '#fff', border: `6px solid ${INK}`, borderRadius: '30px 30px 30px 6px', padding: '16px 26px', fontFamily: 'Inter', fontWeight: 800, fontSize: 50, color: INK}}>amanhã, 7h, na quadra.</div>
        </div>
      </div>
      <Person {...ME} x={300} y={1230} scale={1.7} emotion={frame > 60 ? 'smirk' : 'worried'} lookX={1} />
      <Title text="PARTE 3" color="#fed330" top={20} size={120} at={4} />
      <Pop at={12} />
      {frame > 110 && (
        <div style={{position: 'absolute', left: 520, top: 700, fontSize: 200, transform: `rotate(${Math.sin(frame / 6) * 12}deg)`}}>⚽</div>
      )}
    </AbsoluteFill>
  );
};

const Quadra: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Court />
      <Person {...ME} x={330} y={1260} scale={1.6} emotion="shocked" lookY={-0.4} />
      <Person {...BIA} x={740} y={1260} scale={1.6} emotion="shocked" lookY={-0.4} />
      <div style={{position: 'absolute', right: 40, top: 610, fontSize: 110, transform: `translateY(${Math.sin(frame / 5) * 8}px)`}}>🍿</div>
      <Pop at={20} />
    </AbsoluteFill>
  );
};

const Regras: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Court />
      <Person {...LEO} x={540} y={1250} scale={1.9} emotion="smirk" talking={frame > 5 && frame < 100} lookX={0} />
      <div style={{position: 'absolute', left: 690, top: 960, width: 32, height: 90, background: '#2d3436', border: `6px solid ${INK}`, borderRadius: 14, transform: 'rotate(18deg)'}}><div style={{position: 'absolute', left: -6, top: -26, width: 44, height: 44, borderRadius: 22, background: '#636e72', border: `6px solid ${INK}`}} /></div>
      <div style={{position: 'absolute', left: 120, top: 610, fontSize: 150, transform: `scale(${spring({frame: frame - 70, fps: 30, config: {damping: 8}})})`}}>🏆</div>
      <Stamp x={820} y={700} text="MICO" at={105} color="#ff4757" size={64} rot={10} />
      <Pop at={70} /><Pop at={105} />
    </AbsoluteFill>
  );
};

const Fato: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [20, 80], [0, 64], clamp));
  const bar = interpolate(frame, [20, 80], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{background: '#2c2c54'}}>
      <div style={{position: 'absolute', left: 60, right: 60, top: 150, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 64, color: '#fed330'}}>EXPERIMENTO DO BRINQUEDO PROIBIDO</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 280, color: '#fff', WebkitTextStroke: `14px ${INK}`, paintOrder: 'stroke fill'}}>{n}%</div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 660, textAlign: 'center', fontFamily: 'Inter', fontWeight: 800, fontSize: 56, color: '#dfe6e9', lineHeight: 1.15}}>das crianças que espiaram o brinquedo <span style={{color: '#ff6b6b'}}>mentiram</span> que não espiaram</div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 940, height: 50, background: '#40407a', border: `7px solid ${INK}`, borderRadius: 25, overflow: 'hidden'}}>
        <div style={{width: `${bar * 64}%`, height: '100%', background: '#ff6b6b'}} />
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 1090, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 36, color: '#a4b0be'}}>Fonte: Talwar &amp; Lee (2008), Child Development — 150 crianças de 3 a 8 anos</div>
      <Pop at={20} />
    </AbsoluteFill>
  );
};

const Rodada1: React.FC = () => {
  const frame = useCurrentFrame();
  const mouth = 1260 - 218 * 1.6;
  return (
    <AbsoluteFill>
      <Court banner={false} />
      <Shake from={95} to={125} amp={14}>
        <Person {...ME} x={300} y={1260} scale={1.7} emotion={frame > 95 ? 'scared' : 'smirk'} talking={frame > 10 && frame < 90} lookX={1} />
        {[0, 1, 2].map((i) => (
          <div key={i} style={{position: 'absolute', left: 258 + i * 22, top: mouth + 14 + (i % 2) * 14, width: 14, height: 14, borderRadius: 7, background: '#f6b93b', border: `3px solid ${INK}`}} />
        ))}
        <Pigeon x={800} y={1010} scale={1.7} blow={95} />
      </Shake>
      <Bubble x={300} y={620} w={620} size={52} text="EU NUNCA COMI O ÚLTIMO PÃO DE QUEIJO" at={12} tail="left" />
      <Stamp x={540} y={900} text="PEGOU!" at={104} size={110} rot={-6} color="#ff4757" />
      <Pop at={12} /><Sting at={95} volume={0.7} />
    </AbsoluteFill>
  );
};

const Rodada2: React.FC = () => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - 70);
  const bx = 800 + t * 6;
  const by = 735 - t * 9 + (t > 0 ? t * t * 0.01 : 0);
  return (
    <AbsoluteFill>
      <Court banner={false} />
      <Person {...BIA} x={300} y={1260} scale={1.7} emotion="smirk" talking={frame > 8 && frame < 60} lookX={1} />
      <Person {...LEO} x={800} y={1260} scale={1.7} emotion={frame > 70 ? 'shocked' : 'worried'} lookX={-1} />
      <div style={{position: 'absolute', left: bx - 85, top: by, width: 170, height: 26, borderRadius: 13, background: INK, transform: `rotate(${-8 + t * 10}deg)`, opacity: t > 80 ? 0 : 1}} />
      <Bubble x={300} y={620} w={560} size={56} text="EU AMO ACORDAR CEDO" at={10} tail="left" />
      <Stamp x={860} y={500} text="PEGOU!" at={70} size={80} rot={8} color="#ff4757" />
      <Pop at={10} /><Sting at={70} volume={0.6} />
    </AbsoluteFill>
  );
};

const Bairro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Court banner={false} boo />
      <Person {...BAKER} x={260} y={1260} scale={1.5} emotion="smirk" talking={frame > 5 && frame < 60} lookX={1} />
      <Person {...POP} x={820} y={1260} scale={1.5} emotion="smirk" talking={frame > 70 && frame < 120} lookX={-1} />
      <Bubble x={230} y={650} w={400} size={44} text="O PÃO É DE HOJE!" at={8} tail="left" />
      <Bubble x={860} y={650} w={400} size={44} text="A PIPOCA É GRÁTIS!" at={72} tail="right" />
      <Stamp x={260} y={930} text="PEGOU!" at={40} size={70} rot={-8} />
      <Stamp x={820} y={930} text="PEGOU!" at={104} size={70} rot={8} />
      <Pigeon x={540} y={1130} scale={1} blow={40} />
      <Pop at={8} /><Pop at={72} />
    </AbsoluteFill>
  );
};

const Final: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Court />
      <Person {...ME} x={230} y={1260} scale={1.45} emotion="worried" lookX={1} />
      <Person {...BIA} x={540} y={1260} scale={1.45} emotion="worried" lookX={0} />
      <Person {...LEO} x={850} y={1260} scale={1.45} emotion="smirk" talking={frame > 20 && frame < 110} lookX={-1} />
      <Bubble x={850} y={710} w={560} size={52} text="VOCÊS MENTIRAM PRA MIM?" at={18} tail="right" />
      <Pop at={18} />
    </AbsoluteFill>
  );
};

const Veredito: React.FC = () => {
  const frame = useCurrentFrame();
  const stamps = [60, 85, 100, 112, 124];
  return (
    <AbsoluteFill>
      <Court banner={false} />
      <Shake from={55} to={130} amp={8}>
        <Person {...ME} x={240} y={1260} scale={1.5} emotion={frame > 55 ? 'scared' : 'worried'} talking={frame > 8 && frame < 30} lookX={1} />
        <Person {...BIA} x={840} y={1260} scale={1.5} emotion={frame > 90 ? 'scared' : 'worried'} talking={frame > 70 && frame < 90} lookX={-1} />
        <Pigeon x={540} y={1050} scale={1.5} blow={frame < 80 ? 55 : 82} />
      </Shake>
      <Bubble x={240} y={640} w={300} size={64} text="NÃO." at={8} tail="left" />
      <Bubble x={840} y={640} w={300} size={64} text="NÃO." at={70} tail="right" />
      {stamps.map((s, i) => (
        <Stamp key={i} x={180 + ((i * 230) % 760)} y={250 + (i % 2) * 110} text="PIII!" at={s} size={60 + i * 6} rot={-14 + i * 8} color="#ff4757" />
      ))}
      <Sting at={55} volume={0.6} /><Pop at={70} />
    </AbsoluteFill>
  );
};

const Twist: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const z = spring({frame: frame - 6, fps, config: {damping: 14}});
  return (
    <AbsoluteFill style={{background: '#273c75'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, rgba(254,211,48,0.35) 0%, rgba(39,60,117,0) 60%)'}} />
      <Person {...LEO} x={540} y={2020} scale={4.0 + 0.3 * z} emotion="smirk" talking={frame > 12 && frame < 100} lookX={0} bob={false} />
      <Bubble x={540} y={330} w={800} size={64} text="EU TAMBÉM MENTI." at={14} />
      <Bubble x={540} y={640} w={800} size={58} text="EU SABIA DE TUDO!" at={80} color="#fed330" />
      <Sting at={14} volume={0.8} /><Flash at={14} len={6} /><Pop at={80} />
    </AbsoluteFill>
  );
};

const Vaia: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Court banner={false} boo />
      <Person {...ME} x={230} y={1260} scale={1.45} emotion="shocked" lookX={1} />
      <Person {...BIA} x={540} y={1260} scale={1.45} emotion="shocked" lookX={1} />
      <Person {...LEO} x={850} y={1260} scale={1.45} emotion="smirk" lookX={-1} />
      <Pigeon x={540} y={760} scale={1.1} sad />
      {['BUUU!', 'UUUH!', 'BUUU!'].map((t, i) => (
        <Stamp key={i} x={200 + i * 330} y={330 + (i % 2) * 90} text={t} at={40 + i * 22} size={80} rot={-8 + i * 8} color="#6c5ce7" />
      ))}
      <Pop at={40} /><Pop at={62} /><Pop at={84} />
    </AbsoluteFill>
  );
};

const Mico: React.FC = () => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame / 5) * 120;
  const rot = Math.sin(frame / 5) * 8;
  const lx = 540 + dx;
  return (
    <AbsoluteFill>
      <Court banner={false} boo />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `rotate(${rot}deg)`, transformOrigin: '540px 1260px'}}>
        <Person {...LEO} x={lx} y={1260} scale={2.0} emotion="worried" lookX={0} />
        {[0, 1, 2].map((i) => (
          <div key={i} style={{position: 'absolute', left: lx - 54 + i * 34, top: 1260 - 218 * 2.0 + 20 + (i % 2) * 10, fontSize: 58}}>🌼</div>
        ))}
      </div>
      <Person {...ME} x={180} y={1300} scale={1.2} emotion="happy" lookX={1} />
      <Person {...BIA} x={900} y={1300} scale={1.2} emotion="happy" lookX={-1} />
      <Stamp x={540} y={420} text="MICO!" at={14} size={110} rot={-6} color="#ff4757" />
      <Pop at={14} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#273c75'}}>
      <Title text="VOCÊ JOGARIA ESSE JOGO PRA SALVAR UMA AMIZADE?" color="#fff" top={130} size={70} />
      <div style={{position: 'absolute', left: 120, top: 560, width: 380, height: 130, borderRadius: 40, background: '#20bf6b', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#fff'}}>SIM</div>
      <div style={{position: 'absolute', left: 580, top: 560, width: 380, height: 130, borderRadius: 40, background: '#ff4757', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#fff'}}>NÃO</div>
      <Person {...ME} x={320} y={1200} scale={1.5} emotion="worried" lookX={1} />
      <Person {...LEO} x={640} y={1200} scale={1.5} emotion="smirk" lookX={-1} />
      <Stamp x={900} y={900} text="PARTE 4?" at={20} color="#fed330" size={48} rot={8} />
      <div style={{position: 'absolute', left: 140, right: 140, top: 1470, height: 110, borderRadius: 55, background: '#fed330', border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 56, color: INK, transform: `scale(${1 + Math.sin(frame / 5) * 0.03})`}}>@hipoteticamente.br</div>
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  recap: Recap, quadra: Quadra, regras: Regras, fato: Fato, rodada1: Rodada1, rodada2: Rodada2, bairro: Bairro,
  final: Final, veredito: Veredito, twist: Twist, vaia: Vaia, mico: Mico, cta: Cta,
};
