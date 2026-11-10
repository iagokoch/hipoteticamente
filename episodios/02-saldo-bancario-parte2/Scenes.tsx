import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Person, BalanceTag} from './Person';
import {INK, ME, MOM, STRANGER, Pop, Sting, Flash, Floor, Title, Street, Room} from './lib';

const UNCLE = {skin: '#f2c29b', hair: 'bald' as const, mustache: true, shirt: '#4b7bec'};
const MOM_START = -23480;
const MOM_END = -25020;
const MY_END = 47.32 + MOM_END; // -24.972,68

const Table: React.FC<{top?: number}> = ({top = 1100}) => (
  <div style={{position: 'absolute', left: 60, top, width: 960, height: 120, background: '#f5f6fa', border: `10px solid ${INK}`, borderRadius: 20}} />
);

const Recap: React.FC = () => (
  <AbsoluteFill>
    <Room wall="#ffeaa7" floor="#b33939" />
    <Title text="PARTE 2" color="#fed330" top={130} size={130} />
    <Person {...MOM} x={680} y={1150} scale={1.5} emotion="happy" tag={{value: MOM_START, at: 12, size: 42}} />
    <Pop at={12} />
    <Table />
    <Person {...ME} x={300} y={1450} scale={1.7} emotion="shocked" lookX={1} lookY={-1} tag={{value: 47.32, at: 0, size: 36}} />
  </AbsoluteFill>
);

const Pretend: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#ffeaa7" floor="#b33939" />
      <Person {...UNCLE} x={200} y={1130} scale={1.25} emotion="happy" talking={frame < 70} bob />
      <Person {...MOM} x={540} y={1130} scale={1.3} emotion="happy" tag={{value: MOM_START, at: 0, size: 36}} />
      <Table />
      <Person {...ME} x={860} y={1180} scale={1.35} emotion="happy" lookX={-1} tag={{value: 47.32, at: 0, size: 32}} />
      <div style={{position: 'absolute', left: 935, top: 760, width: 40, height: 52, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: '#74b9ff', border: `5px solid ${INK}`, opacity: frame % 40 < 30 ? 1 : 0}} />
    </AbsoluteFill>
  );
};

const Weeks: React.FC = () => {
  const frame = useCurrentFrame();
  const vals = [MOM_START, -24150, MOM_END];
  const seg = 32;
  const k = Math.min(2, Math.floor(frame / seg));
  const {fps} = useVideoConfig();
  const flip = spring({frame: frame - k * seg, fps, config: {damping: 12}});
  return (
    <AbsoluteFill>
      <Room wall="#ffeaa7" floor="#b33939" />
      <div style={{position: 'absolute', left: 340, top: 150, width: 400, height: 300, background: '#fff', border: `10px solid ${INK}`, borderRadius: 24, overflow: 'hidden', transform: `rotateX(${(1 - flip) * 70}deg)`}}>
        <div style={{height: 80, background: '#ff4757', borderBottom: `8px solid ${INK}`}} />
        <div style={{textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 64, color: INK, marginTop: 40}}>SEMANA {k + 1}</div>
      </div>
      <Person {...MOM} x={540} y={1300} scale={1.9} emotion={k === 2 ? 'worried' : 'happy'} tag={{value: vals[k], from: k === 0 ? vals[0] : vals[k - 1], at: k * seg, size: 46, dur: 18}} />
      <Pop at={seg} /><Pop at={seg * 2} />
    </AbsoluteFill>
  );
};

const Notebook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rise = spring({frame: frame - 45, fps, config: {damping: 10}});
  return (
    <AbsoluteFill>
      <Room wall="#c8d6e5" floor="#8395a7" />
      <div style={{position: 'absolute', left: 80, top: 860, width: 920, height: 300, background: '#a55eea', border: `10px solid ${INK}`, borderRadius: 40}} />
      <div style={{position: 'absolute', left: 80, top: 760, width: 920, height: 140, background: '#8854d0', border: `10px solid ${INK}`, borderRadius: 40}} />
      <Person {...ME} x={300} y={1330} scale={1.6} emotion={frame > 45 ? 'shocked' : 'neutral'} lookX={1} lookY={1} />
      <div style={{position: 'absolute', left: 600, top: 880 - rise * 200, width: 240, height: 300, background: '#fed330', border: `10px solid ${INK}`, borderRadius: 16, transform: `rotate(${-10 + rise * 6}deg) scale(${0.6 + rise * 0.4})`, opacity: frame > 45 ? 1 : 0, boxShadow: `0 0 ${rise * 80}px rgba(254,211,48,0.8)`}}>
        <div style={{position: 'absolute', left: 30, top: 0, bottom: 0, width: 14, background: '#e58e26'}} />
      </div>
      <Pop at={45} />
    </AbsoluteFill>
  );
};

const Page: React.FC = () => {
  const frame = useCurrentFrame();
  const lines: [string, number, boolean][] = [['Luz .......... 180,00', 0, false], ['Mercado ...... 640,00', 6, false], ['Remédio ....... 95,00', 12, false], ['Faculdade do filho', 30, true], ['parcela 19 de 48', 45, true]];
  const circle = interpolate(frame, [70, 95], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#2f3542'}}>
      <div style={{position: 'absolute', left: 90, top: 200, width: 900, height: 1180, background: '#fffdf2', border: `12px solid ${INK}`, borderRadius: 20, transform: 'rotate(-2deg)', backgroundImage: 'repeating-linear-gradient(#fffdf2 0 108px, #a4b0be 108px 112px)'}}>
        <div style={{position: 'absolute', left: 110, top: 0, bottom: 0, width: 5, background: '#ff6b6b'}} />
        {lines.map(([t, at, big], i) => {
          const w = interpolate(frame - at, [0, 14], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div key={i} style={{position: 'absolute', left: 150, top: 150 + i * 150 + (i >= 3 ? 40 : 0), fontFamily: 'DejaVu Serif', fontStyle: 'italic', fontWeight: big ? 700 : 400, fontSize: big ? 66 : 54, color: big ? '#c0392b' : '#2f3542', whiteSpace: 'nowrap', clipPath: `inset(0 ${100 - w}% 0 0)`}}>{t}</div>
          );
        })}
        <svg style={{position: 'absolute', left: 100, top: 560, overflow: 'visible'}} width={760} height={330}>
          <ellipse cx={380} cy={160} rx={370} ry={150} fill="none" stroke="#ff4757" strokeWidth={10} strokeDasharray={1700} strokeDashoffset={1700 * (1 - circle)} strokeLinecap="round" />
        </svg>
      </div>
      <Sting at={80} volume={0.4} />
    </AbsoluteFill>
  );
};

const Guilt: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#30336b'}}>
      {Array.from({length: 30}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: (i * 137) % 1080, top: ((i * 293 + frame * 40) % 2100) - 100, width: 6, height: 70, background: 'rgba(200,214,229,0.35)', transform: 'rotate(12deg)'}} />
      ))}
      <Person {...ME} x={540} y={2000} scale={4.2} emotion="sad" lookY={1} bob={false} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.6) 85%)'}} />
    </AbsoluteFill>
  );
};

const Fact: React.FC = () => {
  const frame = useCurrentFrame();
  const n = interpolate(frame, [8, 50], [0, 81.6], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#2f3542'}}>
      <Title text="FAMÍLIAS COM DÍVIDA" color="#ff4757" top={220} size={86} />
      <div style={{position: 'absolute', top: 380, left: 0, right: 0, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 230, color: '#fff', WebkitTextStroke: `12px ${INK}`, paintOrder: 'stroke fill'}}>{n.toFixed(1).replace('.', ',')}%</div>
      <div style={{position: 'absolute', left: 100, top: 720, width: 880, display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'center'}}>
        {Array.from({length: 10}).map((_, i) => {
          const show = frame > 50 + i * 4;
          const red = i < 8;
          const c = show && red ? '#ff4757' : '#dfe4ea';
          return (
            <svg key={i} viewBox="0 0 100 100" width={140} height={140} style={{opacity: show ? 1 : 0.2}}>
              <path d="M10,48 L50,12 L90,48 Z" fill={c} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
              <rect x={20} y={46} width={60} height={46} fill={c} stroke={INK} strokeWidth={6} />
              <rect x={42} y={64} width={16} height={28} fill={INK} />
            </svg>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 1720, left: 0, right: 0, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 34, color: '#a4b0be'}}>Fonte: CNC, Peic (outubro/2026)</div>
    </AbsoluteFill>
  );
};

const BusShelter: React.FC = () => (
  <>
    <div style={{position: 'absolute', left: 60, top: 640, width: 960, height: 60, background: '#57606f', border: `8px solid ${INK}`, borderRadius: 12}} />
    <div style={{position: 'absolute', left: 90, top: 690, width: 22, height: 600, background: INK}} />
    <div style={{position: 'absolute', left: 968, top: 690, width: 22, height: 600, background: INK}} />
    <div style={{position: 'absolute', left: 860, top: 500, width: 130, height: 130, borderRadius: 65, background: '#fed330', border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: INK}}>P</div>
  </>
);

const BusStop: React.FC = () => {
  const frame = useCurrentFrame();
  const sx = interpolate(frame, [30, 80], [1300, 760], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3)});
  return (
    <AbsoluteFill>
      <Street night />
      <BusShelter />
      <Person {...ME} x={330} y={1330} scale={1.6} emotion={frame > 90 ? 'scared' : 'sad'} lookX={frame > 70 ? 1 : 0} tag={{value: 47.32, at: 0, size: 38}} />
      <Person {...STRANGER} x={sx} y={1320} scale={1.6} emotion="neutral" lookX={-1} dim={0.12} />
      <div style={{position: 'absolute', left: 140, top: 1180, width: 800, height: 40, background: '#a4b0be', border: `7px solid ${INK}`, borderRadius: 10}} />
      <Sting at={95} volume={0.5} />
    </AbsoluteFill>
  );
};

const CloseNight: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: '#1e2a4a'}}>
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #3c4f7d 0%, #1e2a4a 60%)'}} />
    {children}
  </AbsoluteFill>
);

const Offer: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <CloseNight>
      <Person {...STRANGER} x={540} y={2050} scale={4.2} emotion={frame > 150 ? 'smirk' : 'neutral'} talking={frame > 40 && frame < 205} lookX={-0.3} bob={false} />
    </CloseNight>
  );
};

const Question: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <CloseNight>
      {[[160, 300, 120], [860, 380, 90], [780, 220, 70]].map(([x, y, s], i) => (
        <div key={i} style={{position: 'absolute', left: x, top: y + Math.sin((frame + i * 20) / 8) * 10, fontFamily: 'Inter', fontWeight: 900, fontSize: s, color: '#fed330', WebkitTextStroke: `${s / 10}px ${INK}`, paintOrder: 'stroke fill'}}>?</div>
      ))}
      <Person {...ME} x={540} y={2050} scale={4.2} emotion="worried" talking={frame > 5 && frame < 95} lookX={0.6} lookY={-0.5} bob={false} />
    </CloseNight>
  );
};

const Flashback: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const end = 200;
  const gone = frame > end + 12;
  return (
    <AbsoluteFill style={{filter: 'sepia(0.75) contrast(1.05)'}}>
      <Street />
      <Title text="20 ANOS ATRÁS" color="#fff" top={150} size={80} />
      <Person {...UNCLE} x={300} y={1300} scale={1.5} hair="bald" emotion="sad" shirt="#95a5a6" />
      <Person skin="#d1ccc0" hair="short" hairColor="#2d3436" shirt="#2b2d42" x={720} y={1320} scale={1.6} emotion={gone ? 'happy' : 'worried'} lookX={-0.6} tag={{value: 0, from: -86000, at: 20, size: 40, dur: end - 20, hidden: gone}} />
      {frame > end && frame < end + 20 ? <Flash at={end} len={10} /> : null}
      <Pop at={end + 12} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 45%, rgba(60,40,20,0.55) 90%)'}} />
      {durationInFrames ? null : null}
    </AbsoluteFill>
  );
};

const Hands: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reach = spring({frame: frame - 10, fps, config: {damping: 16}});
  const glow = interpolate(frame, [40, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#ffeaa7'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,${glow}) 0%, rgba(255,234,167,0) 45%)`}} />
      <div style={{position: 'absolute', top: 820, left: -600 + reach * 640, width: 560, height: 160, background: '#26de81', border: `10px solid ${INK}`, borderRadius: 80}} />
      <div style={{position: 'absolute', top: 800, left: -120 + reach * 640, width: 200, height: 200, borderRadius: 100, background: '#f2c29b', border: `10px solid ${INK}`}} />
      <div style={{position: 'absolute', top: 820, left: 1120 - reach * 620, width: 560, height: 160, background: '#fa8231', border: `10px solid ${INK}`, borderRadius: 80}} />
      <div style={{position: 'absolute', top: 830, left: 1000 - reach * 620, width: 180, height: 180, borderRadius: 90, background: '#f2c29b', border: `10px solid ${INK}`}} />
    </AbsoluteFill>
  );
};

const Swap: React.FC = () => (
  <AbsoluteFill>
    <Room wall="#ffeaa7" floor="#b33939" />
    <Person {...MOM} x={800} y={1250} scale={1.8} emotion="happy" tag={{value: 0, from: MOM_END, at: 10, size: 38, dur: 40, color: '#20bf6b'}} />
    <Person {...ME} x={310} y={1300} scale={1.8} emotion="scared" lookY={-1} tag={{value: MY_END, from: 47.32, at: 10, size: 34, dur: 60}} />
    <Flash at={8} len={8} />
    <Sting at={10} volume={0.6} />
  </AbsoluteFill>
);

const Secret: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#ffeaa7" floor="#b33939" />
      <Person {...MOM} x={800} y={1300} scale={1.9} emotion="happy" lookX={-1} tag={{value: 0, from: 0.01, at: 0, size: 36, color: '#20bf6b'}} />
      <Person {...ME} x={310} y={1320} scale={1.9} emotion={frame > 50 ? 'happy' : 'smirk'} lookX={1} tag={{value: MY_END, from: MY_END - 0.001, at: 0, size: 32}} />
      <div style={{position: 'absolute', left: 510, top: 820 + Math.sin(frame / 7) * 8, width: 60, height: 54}}>
        <svg viewBox="0 0 60 54" width={60} height={54}><path d="M30,52 C-10,25 5,0 30,15 C55,0 70,25 30,52 Z" fill="#ff4757" stroke={INK} strokeWidth={5} /></svg>
      </div>
    </AbsoluteFill>
  );
};

const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 160], [1.15, 0.95], {extrapolateRight: 'clamp'});
  const pulse = 1 + Math.sin(frame / 5) * 0.04;
  return (
    <AbsoluteFill>
      <Street />
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        {[[150, 2300, '#45aaf2'], [920, 640, '#fd9644'], [140, -800, '#a55eea'], [930, 15200, '#fed330']].map(([x, v, c], i) => (
          <Person key={i} x={x as number} y={1250} scale={1.0} skin={['#8d5524', '#ffdbac', '#c68642', '#e0ac69'][i]} shirt={c as string} hair={i % 2 ? 'long' : 'spiky'} hairColor="#2d3436" emotion="neutral" tag={{value: v as number, at: 0, size: 30}} />
        ))}
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, transform: `scale(${pulse})`, transformOrigin: '540px 600px'}}>
          <Person {...ME} x={540} y={1320} scale={1.75} emotion="happy" lookY={-0.5} tag={{value: MY_END, from: MY_END - 0.001, at: 0, size: 52}} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#273c75'}}>
      <Title text="VOCÊ CARREGARIA A DÍVIDA DE QUEM AMA?" color="#fff" top={170} size={80} />
      <div style={{position: 'absolute', left: 120, top: 520, width: 380, height: 140, borderRadius: 40, background: '#20bf6b', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#fff'}}>SIM</div>
      <div style={{position: 'absolute', left: 580, top: 520, width: 380, height: 140, borderRadius: 40, background: '#ff4757', border: `9px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 70, color: '#fff'}}>NÃO</div>
      <Person {...ME} x={540} y={1240} scale={1.9} emotion="happy" />
      <div style={{position: 'absolute', left: 140, right: 140, top: 1470, height: 110, borderRadius: 55, background: '#fed330', border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 56, color: INK, transform: `scale(${1 + Math.sin(frame / 5) * 0.03})`}}>@hipoteticamente.br</div>
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  recap: Recap, pretend: Pretend, weeks: Weeks, notebook: Notebook, page: Page, guilt: Guilt, fact: Fact,
  busstop: BusStop, offer: Offer, question: Question, flashback: Flashback, hands: Hands, swap: Swap,
  secret: Secret, finale: Finale, cta: Cta,
};
// unused import guard
export const _unused = [BalanceTag, Floor];
