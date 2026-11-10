import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Audio, Sequence, staticFile} from 'remotion';
import {Person, BalanceTag, brl} from './Person';

const INK = '#1b1b2f';
const ME = {skin: '#f2c29b', hair: 'short' as const, hairColor: '#3d2b1f', shirt: '#26de81', pants: '#3867d6'};

const Pop: React.FC<{at: number}> = ({at}) => (
  <Sequence from={at} durationInFrames={10}>
    <Audio src={staticFile('audio/pop.wav')} volume={0.5} />
  </Sequence>
);

const Floor: React.FC<{color: string; y?: number}> = ({color, y = 1180}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, bottom: 0, background: color, borderTop: `8px solid ${INK}`}} />
);

const Title: React.FC<{text: string; color?: string; top?: number; size?: number; at?: number}> = ({text, color = '#fff', top = 170, size = 92, at = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - at, fps, config: {damping: 12}});
  return (
    <div style={{position: 'absolute', top, left: 60, right: 60, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: size, lineHeight: 1.05, color, transform: `scale(${p})`, WebkitTextStroke: `10px ${INK}`, paintOrder: 'stroke fill', letterSpacing: -1}}>
      {text}
    </div>
  );
};

// ---------- backgrounds ----------
const Street: React.FC<{night?: boolean}> = ({night}) => {
  const sky = night ? '#1e2a4a' : '#7ed6df';
  const b = night ? ['#2f3b5c', '#27324f', '#34416a', '#2a3556'] : ['#f8c291', '#e58e26', '#b8e994', '#82ccdd'];
  return (
    <AbsoluteFill style={{background: sky}}>
      {night ? <div style={{position: 'absolute', left: 820, top: 160, width: 120, height: 120, borderRadius: 60, background: '#f5f6fa', border: `6px solid ${INK}`}} /> : <div style={{position: 'absolute', left: 800, top: 140, width: 150, height: 150, borderRadius: 75, background: '#fed330', border: `6px solid ${INK}`}} />}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{position: 'absolute', left: -20 + i * 280, top: 420 + (i % 2) * 120, width: 260, height: 900, background: b[i], border: `7px solid ${INK}`, borderRadius: 10}}>
          {Array.from({length: 8}).map((_, j) => (
            <div key={j} style={{position: 'absolute', left: 40 + (j % 2) * 110, top: 50 + Math.floor(j / 2) * 130, width: 70, height: 80, background: night ? (j % 3 === 0 ? '#fed330' : '#1b2440') : '#dff9fb', border: `5px solid ${INK}`, borderRadius: 6}} />
          ))}
        </div>
      ))}
      <Floor color={night ? '#3d3d5c' : '#a4b0be'} y={1180} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1260, height: 24, background: night ? '#57577a' : '#ced6e0'}} />
    </AbsoluteFill>
  );
};

const Room: React.FC<{wall: string; floor: string}> = ({wall, floor}) => (
  <AbsoluteFill style={{background: wall}}>
    <Floor color={floor} y={1180} />
  </AbsoluteFill>
);

// ---------- scenes ----------
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const tags: [number, number, number, number][] = [
    [200, 600, 15230, 20], [870, 680, -3400, 30], [170, 960, 87, 40], [740, 1040, 1250000, 50],
  ];
  return (
    <AbsoluteFill style={{background: '#273c75'}}>
      {Array.from({length: 26}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: (i * 397) % 1080, top: ((i * 613) % 1700) + ((frame * (1 + (i % 3))) % 200) - 100, fontSize: 60, fontFamily: 'Inter', fontWeight: 900, color: 'rgba(255,255,255,0.08)'}}>R$</div>
      ))}
      <Title text="E SE VOCÊ VISSE O SALDO DE TODO MUNDO?" color="#fed330" top={110} size={80} />
      {tags.map(([x, y, v, at], i) => (
        <div key={i} style={{position: 'absolute', left: x, top: y, transform: `rotate(${(i % 2 ? 1 : -1) * 6}deg)`}}>
          <div style={{position: 'relative'}}><BalanceTag value={v} at={at} size={46} /></div>
          <Pop at={at} />
        </div>
      ))}
      <Person {...ME} x={540} y={1490} scale={2.2} emotion="shocked" lookY={-1} tag={{value: null, at: 50, size: 52}} />
    </AbsoluteFill>
  );
};

const Mirror: React.FC = () => {
  const frame = useCurrentFrame();
  const sad = frame > 110;
  return (
    <AbsoluteFill>
      <Room wall="#c7ecee" floor="#dcdde1" />
      <div style={{position: 'absolute', left: 180, top: 300, width: 720, height: 1000, background: '#dff9fb', border: `12px solid ${INK}`, borderRadius: 30, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: -60, top: 120, width: 200, height: 900, background: 'rgba(255,255,255,0.6)', transform: 'rotate(20deg)'}} />
      </div>
      <Person {...ME} x={540} y={1430} scale={2.1} emotion={sad ? 'sad' : 'neutral'} tag={{value: 47.32, at: 40, size: 50}} />
      <Pop at={40} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1300, height: 120, background: '#f5f6fa', borderTop: `8px solid ${INK}`}} />
    </AbsoluteFill>
  );
};

const StreetScene: React.FC = () => {
  const frame = useCurrentFrame();
  const bikeX = interpolate(frame, [0, 60], [1250, 700], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Street />
      <Person {...ME} x={260} y={1300} scale={1.5} emotion="shocked" lookX={1} tag={{value: 47.32, at: 0, size: 36}} />
      {/* bike */}
      <div style={{position: 'absolute', left: bikeX - 180, top: 1110, width: 360, height: 200}}>
        <svg viewBox="0 0 360 200" width={360} height={200}>
          <circle cx={70} cy={140} r={55} fill="none" stroke={INK} strokeWidth={12} />
          <circle cx={290} cy={140} r={55} fill="none" stroke={INK} strokeWidth={12} />
          <path d="M70,140 L150,60 L250,60 L290,140 M150,60 L180,140 L250,60" fill="none" stroke="#e84118" strokeWidth={12} strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{position: 'absolute', left: bikeX + 40, top: 980, width: 130, height: 110, background: '#e84118', border: `7px solid ${INK}`, borderRadius: 12}} />
      <Person x={bikeX} y={1250} scale={1.5} skin="#8d5524" hair="short" hairColor="#111" hat="helmet" hatColor="#e84118" shirt="#e84118" emotion="happy" enterAt={0} tag={{value: 152300, at: 55, size: 40}} />
      <Pop at={55} />
    </AbsoluteFill>
  );
};

const Boss: React.FC = () => {
  return (
    <AbsoluteFill>
      <Street />
      {/* car */}
      <div style={{position: 'absolute', left: 420, top: 1010, width: 760, height: 330}}>
        <svg viewBox="0 0 760 330" width={760} height={330}>
          <path d="M30,230 L60,150 Q90,120 190,115 L280,60 Q330,40 450,45 L560,110 Q700,120 735,170 L740,240 Z" fill="#eb3b5a" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
          <path d="M300,75 L440,70 L520,115 L270,118 Z" fill="#c7ecee" stroke={INK} strokeWidth={8} />
          <circle cx={170} cy={250} r={60} fill={INK} /><circle cx={170} cy={250} r={24} fill="#a4b0be" />
          <circle cx={600} cy={250} r={60} fill={INK} /><circle cx={600} cy={250} r={24} fill="#a4b0be" />
        </svg>
      </div>
      <Person x={430} y={1340} scale={1.9} suit tie="#fed330" shades hair="short" hairColor="#2d3436" emotion="smirk" tag={{value: -12000, at: 30, size: 48}} />
      <Pop at={30} />
    </AbsoluteFill>
  );
};

const Pastel: React.FC = () => (
  <AbsoluteFill>
    <Street />
    {/* stand */}
    <div style={{position: 'absolute', left: 140, top: 760, width: 800, height: 120, border: `8px solid ${INK}`, borderRadius: 16, overflow: 'hidden', display: 'flex'}}>
      {Array.from({length: 8}).map((_, i) => <div key={i} style={{flex: 1, background: i % 2 ? '#fff' : '#eb3b5a'}} />)}
    </div>
    <div style={{position: 'absolute', left: 200, top: 870, width: 20, height: 330, background: INK}} />
    <div style={{position: 'absolute', left: 860, top: 870, width: 20, height: 330, background: INK}} />
    <Person x={540} y={1240} scale={1.9} skin="#e0ac69" hair="bald" hat="cap" hatColor="#f7f1e3" shirt="#4b7bec" apron mustache emotion="happy" tag={{value: 380000, at: 35, size: 50}} />
    <Pop at={35} />
    <div style={{position: 'absolute', left: 140, top: 1150, width: 800, height: 180, background: '#cc8e35', border: `8px solid ${INK}`, borderRadius: 12}}>
      <div style={{position: 'absolute', left: 230, top: 30, fontFamily: 'Inter', fontWeight: 900, fontSize: 90, color: '#fff', WebkitTextStroke: `8px ${INK}`, paintOrder: 'stroke fill'}}>PASTEL</div>
    </div>
  </AbsoluteFill>
);

const Friends: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#f8a5c2" floor="#786fa6" />
      {Array.from({length: 5}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: 100 + i * 200, top: 260, width: 40, height: 40, borderRadius: 20, background: ['#fed330', '#26de81', '#45aaf2', '#fd9644', '#fff'][i], border: `5px solid ${INK}`, opacity: 0.5 + 0.5 * Math.abs(Math.sin((frame + i * 9) / 10))}} />
      ))}
      <Person x={210} y={1250} scale={1.35} skin="#c68642" hair="long" hairColor="#2d3436" shirt="#a55eea" emotion="happy" tag={{value: 8900, at: 18, size: 34}} />
      <Person x={870} y={1250} scale={1.35} skin="#ffdbac" hair="spiky" hairColor="#f9ca24" shirt="#fd9644" shades emotion="smirk" tag={{value: -2340, at: 32, size: 34}} />
      <Person {...ME} x={540} y={1300} scale={1.55} emotion="smirk" lookX={1} tag={{value: 47.32, at: 0, size: 36}} />
      <Pop at={18} /><Pop at={32} />
      <div style={{position: 'absolute', left: 120, top: 1170, width: 840, height: 60, background: '#cc8e35', border: `8px solid ${INK}`, borderRadius: 14}} />
    </AbsoluteFill>
  );
};

const Crowd: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 110], [1.25, 0.95], {extrapolateRight: 'clamp'});
  const skins = ['#f2c29b', '#8d5524', '#c68642', '#e0ac69', '#ffdbac'];
  const shirts = ['#45aaf2', '#fd9644', '#a55eea', '#26de81', '#fed330', '#eb3b5a'];
  const vals = [-1830, 2200, -540, -9900, -3100, 45000, -780, -15600, 1200];
  return (
    <AbsoluteFill>
      <Street />
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        {vals.map((v, i) => {
          const row = Math.floor(i / 3);
          return (
            <Person key={i} x={190 + (i % 3) * 350 + (row % 2) * 40} y={880 + row * 260} scale={0.85 + row * 0.15} skin={skins[i % 5]} shirt={shirts[i % 6]} hair={i % 3 === 0 ? 'long' : i % 3 === 1 ? 'short' : 'spiky'} hairColor={i % 2 ? '#2d3436' : '#6d4c41'} emotion={v < 0 ? 'worried' : 'neutral'} tag={{value: v, at: 6 + i * 5, size: 32}} />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Fact: React.FC = () => {
  const frame = useCurrentFrame();
  const n = interpolate(frame, [10, 60], [0, 84.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#2f3542'}}>
      <Title text="NOME NEGATIVADO" color="#ff4757" top={230} size={96} />
      <div style={{position: 'absolute', top: 400, left: 0, right: 0, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 210, color: '#fff', WebkitTextStroke: `12px ${INK}`, paintOrder: 'stroke fill'}}>
        {n.toFixed(1).replace('.', ',')} MI
      </div>
      <div style={{position: 'absolute', top: 650, left: 0, right: 0, textAlign: 'center', fontFamily: 'Inter', fontWeight: 800, fontSize: 56, color: '#dfe4ea'}}>de brasileiros</div>
      <div style={{position: 'absolute', left: 110, top: 780, width: 860, display: 'flex', flexWrap: 'wrap', gap: 18}}>
        {Array.from({length: 50}).map((_, i) => {
          const red = [1, 3, 4, 6, 9, 10, 12, 15, 17, 18, 20, 23, 24, 27, 29, 31, 32, 35, 37, 40, 42, 45, 47].includes(i);
          const show = frame > 70 + i * 2;
          return (
            <svg key={i} viewBox="0 0 40 60" width={68} height={100} style={{opacity: show ? 1 : 0.15}}>
              <circle cx={20} cy={14} r={12} fill={show && red ? '#ff4757' : '#dfe4ea'} />
              <path d="M4,58 Q4,30 20,30 Q36,30 36,58 Z" fill={show && red ? '#ff4757' : '#dfe4ea'} />
            </svg>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 1720, left: 0, right: 0, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 34, color: '#a4b0be'}}>Fonte: Serasa, Mapa da Inadimplência (set/2026)</div>
    </AbsoluteFill>
  );
};

const MOM = {skin: '#f2c29b', hair: 'bun' as const, hairColor: '#5d4037', shirt: '#fa8231', apron: true};

const Sunday: React.FC = () => (
  <AbsoluteFill>
    <Room wall="#ffeaa7" floor="#b33939" />
    <div style={{position: 'absolute', left: 380, top: 300, width: 320, height: 220, background: '#81ecec', border: `10px solid ${INK}`, borderRadius: 12}} />
    <Person x={190} y={1170} scale={1.2} skin="#f2c29b" hair="bald" mustache shirt="#4b7bec" emotion="happy" tag={{value: 3200, at: 10, size: 32}} />
    <Person x={890} y={1170} scale={1.1} skin="#f2c29b" hair="long" hairColor="#3d2b1f" shirt="#a55eea" emotion="happy" tag={{value: 640, at: 20, size: 32}} />
    <Person {...MOM} x={540} y={1150} scale={1.35} emotion="happy" tag={{value: -23480, at: 70, size: 44}} />
    <Pop at={10} /><Pop at={20} />
    <Sequence from={70} durationInFrames={40}><Audio src={staticFile('audio/sting.wav')} volume={0.6} /></Sequence>
    <div style={{position: 'absolute', left: 60, top: 1100, width: 960, height: 120, background: '#f5f6fa', border: `10px solid ${INK}`, borderRadius: 20}} />
    <Person {...ME} x={540} y={1900} scale={1.5} emotion="shocked" lookY={-1} bob={false} tag={{value: 47.32, at: 0, size: 32, hidden: true}} />
  </AbsoluteFill>
);

const Mom: React.FC = () => {
  const frame = useCurrentFrame();
  const vig = interpolate(frame, [0, 90], [0, 0.55], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Room wall="#ffeaa7" floor="#b33939" />
      <Person {...MOM} x={540} y={1750} scale={3.2} emotion="happy" lookX={-0.5} tag={{value: -23480, at: 0, size: 26}} />
      <div style={{position: 'absolute', left: 520, top: 1160, width: 360, height: 170, background: '#636e72', border: `10px solid ${INK}`, borderRadius: '0 0 90px 90px'}} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 35%, rgba(0,0,0,${vig}) 80%)`}} />
    </AbsoluteFill>
  );
};

const Dilemma: React.FC = () => {
  const frame = useCurrentFrame();
  const left = Math.floor(frame / 35) % 2 === 0;
  const Bubble: React.FC<{x: number; text: string; color: string; on: boolean}> = ({x, text, color, on}) => (
    <div style={{position: 'absolute', left: x, top: 330, width: 400, height: 240, borderRadius: 120, background: on ? color : '#dfe4ea', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: on ? '#fff' : '#747d8c', transform: `scale(${on ? 1.08 : 0.92})`, WebkitTextStroke: on ? `6px ${INK}` : undefined, paintOrder: 'stroke fill'}}>
      {text}
    </div>
  );
  return (
    <AbsoluteFill style={{background: '#706fd3'}}>
      <Bubble x={60} text="FINGIR" color="#20bf6b" on={left} />
      <Bubble x={620} text="CONTAR" color="#ff4757" on={!left} />
      <Person {...ME} x={540} y={1500} scale={2.4} emotion="worried" lookX={left ? -1 : 1} lookY={-1} />
    </AbsoluteFill>
  );
};

const Stranger: React.FC = () => (
  <AbsoluteFill>
    <Street night />
    <Person x={780} y={1220} scale={1.45} suit tie="#2d3436" hat="fedora" hatColor="#2d3436" skin="#d1ccc0" hair="bald" emotion="neutral" lookX={-1} dim={0.15} tag={{value: null, at: 60, size: 36, glitch: true}} />
    <Person {...ME} x={260} y={1400} scale={1.8} emotion="scared" lookX={1} tag={{value: 47.32, at: 0, size: 40}} />
    <Sequence from={55} durationInFrames={40}><Audio src={staticFile('audio/sting.wav')} volume={0.7} /></Sequence>
  </AbsoluteFill>
);

const StrangerClose: React.FC = () => {
  const frame = useCurrentFrame();
  const talking = frame > 50 && frame < 115;
  return (
    <AbsoluteFill style={{background: '#1e2a4a'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #3c4f7d 0%, #1e2a4a 60%)'}} />
      <Person x={540} y={2050} scale={4.2} suit tie="#2d3436" hat="fedora" hatColor="#2d3436" skin="#d1ccc0" hair="bald" emotion="smirk" talking={talking} lookX={0} bob={false} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#273c75'}}>
      <Title text="CONTARIA OU FINGIRIA?" color="#fff" top={220} size={96} />
      <div style={{position: 'absolute', left: 90, top: 470, width: 400, height: 150, borderRadius: 40, background: '#ff4757', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 64, color: '#fff'}}>CONTARIA</div>
      <div style={{position: 'absolute', left: 590, top: 470, width: 400, height: 150, borderRadius: 40, background: '#20bf6b', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 64, color: '#fff'}}>FINGIRIA</div>
      <Person {...ME} x={540} y={1240} scale={1.9} emotion="happy" />
      <div style={{position: 'absolute', left: 140, right: 140, top: 1470, height: 110, borderRadius: 55, background: '#fed330', border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 56, color: INK, transform: `scale(${1 + Math.sin(frame / 5) * 0.03})`}}>@hipoteticamente.br</div>
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook, mirror: Mirror, street: StreetScene, boss: Boss, pastel: Pastel, friends: Friends, crowd: Crowd,
  fact: Fact, sunday: Sunday, mom: Mom, dilemma: Dilemma, stranger: Stranger, stranger_close: StrangerClose, cta: Cta,
};
export {brl};
