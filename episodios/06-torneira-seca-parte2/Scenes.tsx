import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Person} from './Person';
import {INK, ME, MOM, Pop, Sting, Floor, Title, Room} from './lib';

// Ep. 05 = Parte 2 do Ep. 04 (torneira seca) — caminho em que o Caio NÃO divide a água.
// Reaproveita cenários e elenco do Ep. 04 (Caio, pai, mãe, dona Rosa, bebê, caixa d'água de 1.000 L).

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

// balança de um lado ao outro (o "não" do Caio)
const Wiggle: React.FC<{amp: number; from: number; to: number; speed?: number; children: React.ReactNode}> = ({amp, from, to, speed = 0.9, children}) => {
  const frame = useCurrentFrame();
  const on = frame >= from && frame < to;
  return <div style={{position: 'absolute', inset: 0, transform: on ? `translateX(${Math.sin((frame - from) * speed) * amp}px)` : undefined}}>{children}</div>;
};

// ---------- cenas ----------

// s01 — abre com o voto: dona Rosa pede o balde e o Caio diz não
const Vote: React.FC = () => {
  const frame = useCurrentFrame();
  const asking = frame >= 62 && frame < 108;
  const no = frame >= 112;
  return (
    <AbsoluteFill>
      <DoorFrame open={0.92}>
        <Person {...ROSA} x={310} y={810} scale={1.55} emotion={no ? 'sad' : 'worried'} talking={asking} />
        <Baby x={340} y={610} s={1.3} />
        <Bucket x={450} y={745} s={0.9} fill={0} />
      </DoorFrame>
      <Stamp x={540} y={200} text="VOCÊS VOTARAM: NÃO" at={4} color="#2f3542" size={62} rot={-3} />
      <Bubble x={560} y={598} text="SÓ UM BALDE?" at={66} w={520} size={52} />
      <Wiggle amp={9} from={112} to={142}>
        <Person {...ME} x={150} y={1400} scale={1.4} emotion={no ? 'sad' : 'worried'} lookX={1} />
      </Wiggle>
      <Bubble x={160} y={868} text="NÃO." at={112} w={340} size={100} tail="left" />
      <Pop at={4} /><Pop at={66} /><Pop at={112} />
      <Sting at={112} volume={0.5} />
    </AbsoluteFill>
  );
};

// s02 — a porta fecha na cara dela
const Closed: React.FC = () => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [68, 92], [0.92, 0], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <DoorFrame open={open}>
        <Person {...ROSA} x={310} y={810} scale={1.55} emotion="sad" lookY={frame >= 36 ? 1 : 0} />
        <Baby x={340} y={610} s={1.3} />
        <Bucket x={450} y={745} s={0.9} fill={0} />
      </DoorFrame>
      <Person {...ME} x={150} y={1400} scale={1.4} emotion={frame >= 100 ? 'worried' : 'neutral'} lookX={1} />
      <Stamp x={700} y={1030} text="ACABOU?" at={104} color="#2f3542" size={76} rot={6} />
      <Pop at={92} />
      <Sting at={104} volume={0.35} />
    </AbsoluteFill>
  );
};

// s03 — etapa 1: um vizinho sobe na laje e vê a caixa d'água cheia (com uma rachadura discreta, pista da virada)
const RoofScene: React.FC = () => {
  const frame = useCurrentFrame();
  const found = frame >= 92;
  const dropY = 1010 + ((frame * 5) % 150);
  const bars = Math.floor(frame / 8) % 3;
  return (
    <Roof>
      <Tank x={200} y={560} level={1} s={1.15} />
      <svg viewBox="0 0 90 130" width={90} height={130} style={{position: 'absolute', left: 520, top: 900}}>
        <path d="M50,0 L38,30 L58,55 L40,85 L52,120" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <Drop x={572} y={dropY} s={0.55} />
      <Person x={900} y={1330} scale={1.4} skin="#e0ac69" hair="spiky" hairColor="#2d3436" shirt="#fd9644" pants="#2d3436" emotion={found ? 'shocked' : 'neutral'} lookX={found ? -1 : 0} lookY={found ? 0 : -1} enterAt={8} />
      {!found ? (
        <svg viewBox="0 0 60 100" width={72} height={120} style={{position: 'absolute', left: 925, top: 690}}>
          <rect x={4} y={14} width={44} height={80} rx={8} fill="#2f3542" stroke={INK} strokeWidth={5} />
          {[0, 1, 2].map((i) => <rect key={i} x={12 + i * 10} y={32 - i * 6} width={7} height={10 + i * 6} fill={i <= bars ? '#20bf6b' : '#57606f'} />)}
        </svg>
      ) : null}
      <DayBadge n="DIA 6" />
      <Stamp x={640} y={480} text="CHEIA!" at={140} color="#0c63c9" size={80} rot={-6} />
      <Pop at={92} /><Pop at={140} />
      <Sting at={92} volume={0.4} />
    </Roof>
  );
};

// s04 — o grupo do condomínio descobre
const GroupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const msgs = ['Gente, olha isso', 'É a caixa de quem??', 'CHEIA?!', 'E a gente sem água'];
  const count = Math.min(47, Math.floor(interpolate(frame, [4, 100], [1, 47], clamp)));
  const photoP = spring({frame: frame - 6, fps: 30, config: {damping: 12}});
  return (
    <AbsoluteFill style={{background: '#30336b'}}>
      <div style={{position: 'absolute', left: 190, top: 160, width: 700, height: 760, background: INK, borderRadius: 60}}>
        <div style={{position: 'absolute', left: 24, right: 24, top: 30, bottom: 30, background: '#ece5dd', borderRadius: 40, overflow: 'hidden'}}>
          <div style={{height: 110, background: '#128c7e', display: 'flex', alignItems: 'center', padding: '0 30px', gap: 20, borderBottom: `6px solid ${INK}`}}>
            <div style={{width: 64, height: 64, borderRadius: 32, background: '#fed330', border: `5px solid ${INK}`}} />
            <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 44, color: '#fff'}}>Condomínio</div>
            <div style={{marginLeft: 'auto', minWidth: 70, height: 70, borderRadius: 35, background: '#ff4757', border: `5px solid ${INK}`, fontFamily: 'Inter', fontWeight: 900, fontSize: 38, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{count}</div>
          </div>
          {frame >= 6 ? (
            <div style={{position: 'relative', margin: '14px 24px', width: 330, height: 200, background: '#74b9ff', border: `5px solid ${INK}`, borderRadius: '24px 24px 24px 6px', overflow: 'hidden', transform: `scale(${photoP})`, transformOrigin: '0 100%'}}>
              <Tank x={26} y={8} level={1} s={0.4} label={false} />
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 36, background: '#a4b0be', borderTop: `5px solid ${INK}`}} />
            </div>
          ) : null}
          {msgs.map((m, i) => {
            const at = 24 + i * 16;
            if (frame < at) return null;
            const p = spring({frame: frame - at, fps: 30, config: {damping: 12}});
            return (
              <div key={i} style={{margin: '10px 24px', maxWidth: 520, background: '#fff', border: `5px solid ${INK}`, borderRadius: '24px 24px 24px 6px', padding: '8px 20px', fontFamily: 'Inter', fontWeight: 800, fontSize: 34, color: INK, transform: `scale(${p})`, transformOrigin: '0 100%', width: 'fit-content'}}>{m}</div>
            );
          })}
        </div>
      </div>
      <Stamp x={540} y={1060} text="TODO MUNDO SABE" at={94} color="#ff4757" size={64} rot={-4} />
      <Pop at={6} /><Pop at={24} /><Pop at={40} /><Pop at={56} /><Pop at={72} /><Pop at={94} />
    </AbsoluteFill>
  );
};

// s05 — etapa 2: o clima no condomínio muda
const Climate: React.FC = () => {
  const frame = useCurrentFrame();
  const caioX = interpolate(frame, [0, 34], [230, 390], {...clamp, easing: ease});
  const noteP = spring({frame: frame - 92, fps: 30, config: {damping: 10, stiffness: 180}});
  return (
    <AbsoluteFill style={{background: '#dcdde1'}}>
      <Floor color="#718093" y={1180} />
      <DayBadge n="DIA 7" />
      {/* elevador */}
      <div style={{position: 'absolute', left: 20, top: 470, width: 300, height: 710, background: '#a4b0be', border: `10px solid ${INK}`}}>
        <div style={{position: 'absolute', left: 50, top: 50, right: 50, bottom: 0, background: '#2f3542', border: `8px solid ${INK}`}} />
      </div>
      <Person x={170} y={1170} scale={0.95} skin="#ffdbac" hair="long" hairColor="#5d4037" shirt="#fd9644" emotion="neutral" lookX={-1} />
      {/* porta do Caio, com o bilhete */}
      <div style={{position: 'absolute', left: 870, top: 450, width: 260, height: 730, background: '#b33939', border: `10px solid ${INK}`}}>
        <div style={{position: 'absolute', left: 30, top: 330, width: 36, height: 36, borderRadius: 18, background: '#fed330', border: `5px solid ${INK}`}} />
      </div>
      {frame >= 92 ? (
        <div style={{position: 'absolute', left: 895, top: 560, width: 140, padding: '14px 8px', background: '#fff', border: `5px solid ${INK}`, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 30, lineHeight: 1.05, color: '#c0392b', transform: `rotate(${4 - 4 * noteP}deg) scale(${noteP})`}}>
          ÁGUA<br />É DE<br />TODOS
          <div style={{position: 'absolute', left: 55, top: -14, width: 55, height: 22, background: 'rgba(254,211,48,0.85)', border: `3px solid ${INK}`}} />
        </div>
      ) : null}
      {/* vizinhos cochichando */}
      <Person x={660} y={1230} scale={1.0} skin="#8d5524" hair="bun" hairColor="#1e1e1e" shirt="#a55eea" emotion="neutral" lookX={1} />
      <Person x={780} y={1230} scale={1.0} skin="#ffdbac" hair="short" hairColor="#2d3436" shirt="#45aaf2" emotion="neutral" lookX={-1} />
      {frame >= 38 && frame < 70 ? <Bubble x={170} y={800} text="..." at={38} w={200} size={64} /> : null}
      {frame >= 62 && frame < 94 ? <Bubble x={660} y={830} text="psiu..." at={62} w={280} size={50} tail="left" /> : null}
      <Person {...ME} x={caioX} y={1290} scale={1.5} emotion="sad" lookX={frame < 60 ? -1 : 1} />
      <Pop at={38} /><Pop at={62} /><Pop at={92} />
      <Sting at={92} volume={0.35} />
    </AbsoluteFill>
  );
};

// s06 — fato real: Cidade do Cabo, 2018 (Fonte: Prefeitura da Cidade do Cabo, jan/2018, via News24 e Cape Times)
const Dummy: React.FC<{x: number; y: number; color: string}> = ({x, y, color}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 120, height: 190}}>
    <div style={{position: 'absolute', left: 30, top: 0, width: 60, height: 60, borderRadius: 30, background: color, border: `7px solid ${INK}`}} />
    <div style={{position: 'absolute', left: 0, top: 66, width: 120, height: 124, borderRadius: '44px 44px 14px 14px', background: color, border: `7px solid ${INK}`}} />
  </div>
);

const Fact: React.FC = () => {
  const frame = useCurrentFrame();
  const swap = frame >= 292;
  return (
    <AbsoluteFill style={{background: '#2f3542'}}>
      <Title text="CIDADE DO CABO, 2018" color="#fed330" top={140} size={80} at={4} />
      {Array.from({length: 10}).map((_, i) => {
        const show = frame >= 40 + i * 4;
        const red = i < 6 && frame >= 150 + i * 8;
        const x = 70 + (i % 5) * 200;
        const y = 430 + Math.floor(i / 5) * 250;
        return show ? <Dummy key={i} x={x} y={y} color={red ? '#ff4757' : '#dfe4ea'} /> : null;
      })}
      {frame >= 150 ? <Stamp x={540} y={365} text="6 EM CADA 10" at={150} color="#ff4757" size={64} rot={-3} /> : null}
      {/* limites */}
      {frame >= 205 ? (
        <div style={{position: 'absolute', left: 90, right: 90, top: 940, height: 110, borderRadius: 55, background: '#57606f', border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 56, color: '#fff', transform: `scale(${spring({frame: frame - 205, fps: 30, config: {damping: 12}})})`}}>
          <span style={{textDecoration: swap ? 'line-through' : 'none', textDecorationColor: '#ff4757', textDecorationThickness: 10}}>LIMITE: 87 L POR DIA</span>
        </div>
      ) : null}
      {swap ? <Stamp x={540} y={1160} text="NOVO LIMITE: 50 L" at={292} color="#20bf6b" size={66} rot={-3} /> : null}
      <Pop at={40} /><Pop at={150} /><Pop at={205} />
      <Sting at={292} volume={0.4} />
      <div style={{position: 'absolute', top: 1530, left: 60, right: 60, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 32, color: '#a4b0be'}}>Fonte: Prefeitura da Cidade do Cabo (jan/2018), via News24 e Cape Times</div>
    </AbsoluteFill>
  );
};

// s07 — o pai faz a conta e se sente seguro
const Plan: React.FC = () => {
  const frame = useCurrentFrame();
  const paperP = spring({frame: frame - 82, fps: 30, config: {damping: 12}});
  return (
    <AbsoluteFill>
      <Kitchen night />
      <DayBadge n="DIA 8" />
      <div style={{position: 'absolute', left: 120, top: 360, width: 150, padding: '8px 6px', background: '#f5f6fa', border: `4px solid ${INK}`, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 24, lineHeight: 1.05, color: '#7f8c8d', transform: 'rotate(-12deg)'}}>ÁGUA É DE TODOS</div>
      <Person {...MOM} x={190} y={1180} scale={1.25} emotion="worried" lookX={1} />
      <Person {...DAD} x={540} y={1230} scale={1.55} emotion={frame > 20 ? 'smirk' : 'neutral'} talking={frame > 6 && frame < 150} lookX={0.3} lookY={frame > 82 ? 0.8 : 0} />
      <Person {...ME} x={890} y={1210} scale={1.35} emotion="worried" lookX={-1} />
      {frame >= 82 ? (
        <div style={{position: 'absolute', left: 330, top: 400, width: 420, height: 250, background: '#fff', border: `7px solid ${INK}`, borderRadius: 10, transform: `scale(${paperP}) rotate(-3deg)`, fontFamily: 'Inter', fontWeight: 900, color: INK, padding: '20px 26px', lineHeight: 1.2}}>
          <div style={{fontSize: 46}}>700 L</div>
          <div style={{fontSize: 40, color: '#57606f'}}>÷ 100 L / dia</div>
          <div style={{fontSize: 58, color: '#20bf6b'}}>= 7 DIAS</div>
        </div>
      ) : null}
      <Stamp x={540} y={330} text="SOBRAM 7 DIAS" at={128} color="#20bf6b" size={60} rot={-3} />
      <Pop at={82} /><Pop at={128} />
    </AbsoluteFill>
  );
};

// s08 — a virada: a caixa do vô racha de madrugada
const CrackScene: React.FC = () => {
  const frame = useCurrentFrame();
  const level = interpolate(frame, [0, 38, 130], [0.7, 0.7, 0], clamp);
  const cracked = frame >= 38;
  const shake = frame >= 38 && frame < 64 ? Math.sin(frame * 2.2) * 7 : 0;
  const jet = interpolate(frame, [48, 80], [0, 170], {...clamp});
  const jetOn = frame >= 48 && frame < 135;
  const puddle = interpolate(frame, [70, 175], [0, 420], {...clamp, easing: ease});
  return (
    <Roof night>
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${shake}px)`}}>
        <Tank x={330} y={560} level={level} s={1.15} />
        {cracked ? (
          <svg viewBox="0 0 90 150" width={90} height={150} style={{position: 'absolute', left: 595, top: 870}}>
            <path d="M50,0 L36,34 L60,62 L38,98 L52,140" fill="none" stroke="#e8f4ff" strokeWidth={frame >= 80 ? 14 : 7} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M50,0 L36,34 L60,62 L38,98 L52,140" fill="none" stroke={INK} strokeWidth={frame >= 80 ? 7 : 4} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </div>
      {jetOn ? <div style={{position: 'absolute', left: 632, top: 1000, width: 40, height: jet, background: WATER, border: `5px solid ${INK}`, borderRadius: 12}} /> : null}
      <div style={{position: 'absolute', left: 650 - puddle, top: 1180, width: puddle * 2, height: 44 + puddle * 0.12, borderRadius: '50%', background: WATER, border: `6px solid ${INK}`, opacity: puddle > 2 ? 0.95 : 0}} />
      <Person {...ME} x={190} y={1330} scale={1.5} emotion="shocked" lookX={1} lookY={0.2} enterAt={50} />
      <DayBadge n="DIA 9" />
      <Stamp x={700} y={440} text="ESTALO!" at={38} color="#ff4757" size={76} rot={-6} />
      <Pop at={38} /><Pop at={90} />
      <Sting at={38} volume={0.6} />
    </Roof>
  );
};

// s09 — o contador de dias: era pra durar até o 15, acabou no 9
const CounterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const days = Array.from({length: 11}).map((_, i) => i + 5);
  const lost = frame >= 78;
  return (
    <AbsoluteFill style={{background: '#2f3542'}}>
      <Title text="FIM DA RESERVA" color="#fff" top={150} size={92} at={2} />
      <div style={{position: 'absolute', left: 59, top: 480, display: 'flex', gap: 6}}>
        {days.map((d, i) => {
          const gone = lost && d > 9;
          const dead = lost && d === 9;
          const show = frame > 4 + i * 2;
          return (
            <div key={d} style={{width: 82, height: 120, borderRadius: 14, background: dead ? '#ff4757' : gone ? '#57606f' : WATER, border: `6px solid ${INK}`, opacity: show ? 1 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 44, color: '#fff', position: 'relative'}}>
              {d}
              {gone ? <div style={{position: 'absolute', left: 6, right: 6, top: 54, height: 8, background: '#ff4757', transform: 'rotate(-35deg)'}} /> : null}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 36, color: '#a4b0be'}}>dias de água, contando do dia 5</div>
      {!lost && frame >= 28 ? <Stamp x={540} y={930} text="PREVISTO: DIA 15" at={28} color="#20bf6b" size={72} rot={-3} /> : null}
      {lost ? <Stamp x={540} y={930} text="ACABOU NO DIA 9" at={78} color="#ff4757" size={72} rot={3} /> : null}
      <Pop at={28} /><Pop at={78} />
      <Sting at={78} volume={0.5} />
    </AbsoluteFill>
  );
};

// s10 — o pai se recusa a pedir; a mãe põe o balde na mão do Caio
const Refuse: React.FC = () => {
  const frame = useCurrentFrame();
  const shakeHead = frame > 14 && frame < 100 ? Math.sin(frame / 3) : 0;
  const bx = interpolate(frame, [118, 146], [275, 805], {...clamp, easing: ease});
  const by = interpolate(frame, [118, 146], [1100, 1125], {...clamp});
  return (
    <AbsoluteFill>
      <Kitchen night />
      <DayBadge n="DIA 9" />
      <Person {...MOM} x={190} y={1180} scale={1.25} emotion="sad" lookX={1} lookY={frame < 118 ? 0.6 : 0} />
      <Person {...DAD} x={540} y={1230} scale={1.55} emotion="worried" talking={frame > 6 && frame < 108} lookX={shakeHead} />
      <Person {...ME} x={890} y={1210} scale={1.35} emotion={frame >= 146 ? 'worried' : 'sad'} lookX={-1} lookY={0.3} />
      {frame >= 52 && frame < 114 ? <Bubble x={540} y={640} text="NÃO VOU PEDIR." at={52} w={560} size={56} /> : null}
      <Bucket x={bx} y={by} s={1.0} fill={0} />
      <Pop at={52} /><Pop at={118} />
    </AbsoluteFill>
  );
};

// s11 — o Caio atravessa o corredor com todos olhando e bate na porta da dona Rosa
const Peek: React.FC<{x: number; at: number; caioX: number}> = ({x, at, caioX}) => {
  const frame = useCurrentFrame();
  const dx = Math.max(-1, Math.min(1, (caioX - (x + 100)) / 220)) * 6;
  return (
    <div style={{position: 'absolute', left: x, top: 450, width: 200, height: 730, background: '#778ca3', border: `10px solid ${INK}`}}>
      <div style={{position: 'absolute', left: 120, top: 330, width: 36, height: 36, borderRadius: 18, background: '#fed330', border: `5px solid ${INK}`}} />
      {frame >= at ? (
        <div style={{position: 'absolute', left: 60, top: 140, width: 70, height: 120, background: INK, borderRadius: 10}}>
          {[14, 40].map((t) => (
            <div key={t} style={{position: 'absolute', left: 10, top: t, width: 50, height: 22, borderRadius: 11, background: '#fff', overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 17 + dx, top: 4, width: 14, height: 14, borderRadius: 7, background: INK}} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const Walk: React.FC = () => {
  const frame = useCurrentFrame();
  const caioX = interpolate(frame, [0, 100], [130, 690], {...clamp, easing: ease});
  const walking = frame < 100;
  const hop = walking ? Math.abs(Math.sin(frame / 3)) * 10 : 0;
  const knock = (f: number) => (frame >= f && frame < f + 8 ? Math.sin((frame - f) * 2.4) * 7 : 0);
  return (
    <AbsoluteFill style={{background: '#dcdde1'}}>
      <Floor color="#718093" y={1180} />
      <Peek x={40} at={22} caioX={caioX} />
      <Peek x={290} at={46} caioX={caioX} />
      <Peek x={540} at={70} caioX={caioX} />
      {/* porta da dona Rosa */}
      <div style={{position: 'absolute', left: 810 + knock(128) + knock(140) + knock(152), top: 450, width: 270, height: 730, background: '#b33939', border: `10px solid ${INK}`}}>
        <div style={{position: 'absolute', left: 30, top: 330, width: 36, height: 36, borderRadius: 18, background: '#fed330', border: `5px solid ${INK}`}} />
      </div>
      <Person {...ME} x={caioX} y={1300 - hop} scale={1.5} emotion="sad" lookX={1} lookY={0.3} />
      <Bucket x={caioX + 100} y={1230 - hop} s={0.9} fill={0} />
      <Pop at={22} /><Pop at={46} /><Pop at={70} />
      <Pop at={128} /><Pop at={140} /><Pop at={152} />
    </AbsoluteFill>
  );
};

// s12 — dona Rosa abre e entrega um balde cheio
const Answer: React.FC = () => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [4, 22], [0, 0.92], {...clamp, easing: ease});
  const bx = interpolate(frame, [100, 130], [645, 290], {...clamp, easing: ease});
  const by = interpolate(frame, [100, 130], [1120, 1205], {...clamp});
  return (
    <AbsoluteFill>
      <DoorFrame open={open}>
        <Person {...ROSA} x={310} y={810} scale={1.55} emotion={frame < 40 ? 'worried' : 'sad'} lookX={-0.8} lookY={frame >= 40 && frame < 100 ? 0.8 : 0} />
        <Baby x={340} y={610} s={1.3} />
      </DoorFrame>
      <Person {...ME} x={190} y={1300} scale={1.4} emotion={frame >= 108 ? 'shocked' : 'sad'} lookX={1} lookY={frame < 100 ? 0.8 : 0} />
      <Bucket x={70} y={1215} s={0.95} fill={0} />
      {frame >= 100 ? <Bucket x={bx} y={by} s={1.05} fill={1} /> : frame >= 24 ? <Bucket x={645} y={1120} s={1.05} fill={1} /> : null}
      <Stamp x={700} y={470} text="UM BALDE." at={150} color="#0c63c9" size={72} rot={-5} />
      <Pop at={24} /><Pop at={100} /><Pop at={150} />
      <Sting at={108} volume={0.3} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#273c75'}}>
      <Title text="SE FOSSE A DONA ROSA, VOCÊ ABRIRIA A PORTA?" color="#fff" top={130} size={70} />
      <div style={{position: 'absolute', left: 120, top: 500, width: 380, height: 130, borderRadius: 40, background: '#20bf6b', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#fff'}}>SIM</div>
      <div style={{position: 'absolute', left: 580, top: 500, width: 380, height: 130, borderRadius: 40, background: '#ff4757', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#fff'}}>NÃO</div>
      <Person {...ME} x={320} y={1200} scale={1.5} emotion="worried" lookX={1} />
      <Bucket x={470} y={1190} s={0.9} fill={0.9} />
      <Person {...ROSA} x={680} y={1200} scale={1.5} emotion="happy" lookX={-1} />
      <Stamp x={540} y={420} text="COMENTA AÍ" at={20} color="#fed330" size={48} rot={-4} />
      <div style={{position: 'absolute', left: 140, right: 140, top: 1470, height: 110, borderRadius: 55, background: '#fed330', border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 56, color: INK, transform: `scale(${1 + Math.sin(frame / 5) * 0.03})`}}>@hipoteticamente.br</div>
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  vote: Vote, closed: Closed, roof: RoofScene, group: GroupScene, climate: Climate, fact: Fact, plan: Plan,
  crack: CrackScene, counter: CounterScene, refuse: Refuse, walk: Walk, answer: Answer, cta: Cta,
};
