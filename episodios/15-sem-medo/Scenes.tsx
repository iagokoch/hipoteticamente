import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Person, PersonProps} from './Person';
import {INK, ME, Pop, Sting, Floor, Title, Room, Street, Flash} from './lib';
import {Stamp, Bubble, Thought, Big, DayTag, Cap, SimNao, Handle, FONT, clamp, ease} from './ui';

// Ep. 15 = tema #4 do banco: acordar sem medo. Fato: paciente S.M. (Urbach-Wiethe), Feinstein et al., Current Biology, 2010.
const BOSS: Partial<PersonProps> = {skin: '#f5cba7', hair: 'bald', mustache: true, suit: true, tie: '#e84118', shirt: '#2f3542'};
const MARINA: Partial<PersonProps> = {skin: '#d1a074', hair: 'long', hairColor: '#6c3b2a', shirt: '#e84393', pants: '#2d3436'};
const OPER: Partial<PersonProps> = {skin: '#8d5524', hair: 'short', hairColor: '#1e1e1e', hat: 'cap', hatColor: '#0984e3', shirt: '#0984e3', pants: '#2d3436'};
const DUDA: Partial<PersonProps> = {skin: '#f2c29b', hair: 'bun', hairColor: '#5d4037', shirt: '#fd79a8', pants: '#6c5ce7'};
const TRATADOR: Partial<PersonProps> = {skin: '#d1a074', hair: 'short', hairColor: '#2d3436', hat: 'cap', hatColor: '#6ab04c', shirt: '#6ab04c', pants: '#2d3436'};

const Crosswalk: React.FC = () => (
  <>
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <div key={i} style={{position: 'absolute', left: i * 150 - 20, top: 1290, width: 100, height: 120, background: '#f5f6fa', border: `5px solid ${INK}`, transform: 'skewX(-20deg)'}} />)}
  </>
);

// s01
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const walk = interpolate(frame, [10, 170], [160, 900], clamp);
  const car = (start: number, y: number, e: string, dir: number) => {
    const x = interpolate(frame, [start, start + 40], [dir > 0 ? -300 : 1380, dir > 0 ? 1380 : -300], clamp);
    const dodge = Math.abs(x - walk) < 260 ? -30 : 0;
    return <div style={{position: 'absolute', left: x, top: y + dodge, fontSize: 170, transform: dir > 0 ? 'scaleX(-1)' : undefined}}>{e}</div>;
  };
  return (
    <AbsoluteFill>
      <Street />
      <Crosswalk />
      {frame >= 90 ? car(90, 1050, '🚗', 1) : null}
      {frame >= 135 ? car(135, 1050, '🚌', -1) : null}
      <Person {...ME} x={walk} y={1500} scale={1.5} emotion="neutral" lookX={1} bob />
      {frame >= 100 ? <Bubble x={780} y={820} w={380} size={60} text="BIIIII!" at={100} tail="center" /> : null}
      <div style={{position: 'absolute', left: 60, top: 150, width: 420, height: 160, background: '#1e272e', border: `8px solid ${INK}`, borderRadius: 20, padding: '10px 20px', fontFamily: FONT, fontWeight: 900, fontSize: 44, color: '#20bf6b'}}>
        MEDO: 0%
        <svg viewBox="0 0 380 50" width={380} height={50}><polyline points="0,25 380,25" stroke="#20bf6b" strokeWidth={6} fill="none" /></svg>
      </div>
      <Pop at={100} />
    </AbsoluteFill>
  );
};

// s02
const Fato: React.FC = () => {
  const frame = useCurrentFrame();
  const items: [string, string, number][] = [['🐍', 'COBRAS', 195], ['🕷️', 'ARANHAS', 215], ['🏚️', 'CASA MAL-ASSOMBRADA', 235]];
  return (
    <AbsoluteFill style={{background: '#1e272e'}}>
      <Title text="PACIENTE S.M." color="#fed330" top={110} size={96} at={2} />
      <Big x={540} y={290} e="🧠" s={1.2} at={8} />
      <div style={{position: 'absolute', left: 560, top: 400, width: 70, height: 44, borderRadius: '50%', background: '#e17055', border: `6px solid ${INK}`, transform: 'rotate(-30deg)', opacity: frame > 90 ? 1 : 0}} />
      {frame >= 120 ? <Stamp x={800} y={500} text="SEM MEDO" at={120} color="#ff4757" size={40} rot={5} /> : null}
      {items.map(([e, t, at], i) => frame >= at ? (
        <div key={t} style={{position: 'absolute', left: 120, right: 120, top: 740 + i * 150, height: 120, background: '#2f3542', border: `8px solid ${INK}`, borderRadius: 24, display: 'flex', alignItems: 'center', padding: '0 30px', gap: 30}}>
          <div style={{fontSize: 80}}>{e}</div>
          <div style={{flex: 1, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#fff'}}>{t}</div>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 44, color: '#20bf6b'}}>0 MEDO</div>
        </div>
      ) : null)}
      <Cap text="Fonte: Feinstein et al., Current Biology (2010), doença de Urbach-Wiethe" />
      <Pop at={120} /><Pop at={195} /><Pop at={215} /><Pop at={235} />
    </AbsoluteFill>
  );
};

// s03
const Chefe: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#dfe6e9" floor="#b2967d" />
      <div style={{position: 'absolute', left: 60, top: 760, width: 960, height: 40, background: '#6f4e37', border: `8px solid ${INK}`}} />
      <Person {...ME} x={250} y={1400} scale={1.5} emotion="smirk" lookX={1} talking={frame < 70} bob />
      <Person {...BOSS} x={830} y={1400} scale={1.5} emotion={frame < 95 ? 'neutral' : 'scared'} lookX={-1} talking={frame >= 150} bob />
      <Bubble x={300} y={560} w={540} size={52} text="QUERO O DOBRO." at={6} tail="center" />
      {frame >= 150 ? <Bubble x={800} y={600} w={400} size={56} text="ACEITO!" at={150} tail="center" /> : null}
      {frame >= 95 ? <Big x={960} y={880} e="💦" s={0.6} at={98} /> : null}
      <Stamp x={540} y={210} text="AUMENTO: O DOBRO" at={160} color="#20bf6b" size={64} rot={-3} />
      <Pop at={6} /><Pop at={150} /><Sting at={150} volume={0.35} />
    </AbsoluteFill>
  );
};

// s04
const Crush: React.FC = () => {
  const frame = useCurrentFrame();
  const asks: [string, number][] = [['JANTAR?', 40], ['CASAMENTO?', 80], ['NOME DO FILHO?', 120]];
  const cur = asks.filter(([, at]) => frame >= at).length - 1;
  return (
    <AbsoluteFill>
      <Room wall="#ffeaa7" floor="#cc8e35" />
      <div style={{position: 'absolute', left: 60, top: 300, width: 460, height: 140, background: '#fff', border: `8px solid ${INK}`, borderRadius: 14, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 60, color: INK, lineHeight: '124px'}}>RH</div>
      <Person {...ME} x={250} y={1400} scale={1.5} emotion="happy" lookX={1} talking bob />
      <Person {...MARINA} x={830} y={1400} scale={1.5} emotion={frame < 120 ? 'worried' : 'scared'} lookX={-1} bob />
      {cur >= 0 ? <Bubble x={300} y={580 - cur * 10} w={560} size={56} text={asks[cur][0]} at={asks[cur][1]} tail="center" /> : null}
      {frame >= 80 ? <Big x={540} y={900} e="💍" s={0.8} at={84} /> : null}
      {frame >= 165 ? <Big x={900} y={900} e="🥤" s={0.8} at={165} /> : null}
      {frame >= 165 ? <Stamp x={830} y={640} text="UM COPO D'ÁGUA" at={165} color="#0984e3" size={40} rot={4} /> : null}
      <Pop at={40} /><Pop at={80} /><Pop at={120} /><Pop at={165} />
    </AbsoluteFill>
  );
};

// s05
const Parque: React.FC = () => {
  const frame = useCurrentFrame();
  const lap = Math.min(12, 1 + Math.floor(frame / 8));
  const t = (frame % 40) / 40;
  const cx = 120 + t * 840;
  const cy = 700 - Math.sin(t * Math.PI * 2) * 140 + Math.sin(t * Math.PI) * 60;
  return (
    <AbsoluteFill>
      <Room wall="#74b9ff" floor="#6ab04c" />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <path d="M60,900 Q200,420 360,800 T660,780 T1020,700" fill="none" stroke={INK} strokeWidth={26} strokeLinecap="round" />
        <path d="M60,900 Q200,420 360,800 T660,780 T1020,700" fill="none" stroke="#e17055" strokeWidth={12} strokeLinecap="round" />
      </svg>
      <div style={{position: 'absolute', left: cx - 70, top: cy - 100, width: 140, height: 120}}>
        <div style={{fontSize: 130}}>🎢</div>
      </div>
      <Person {...ME} x={540} y={1450} scale={1.4} emotion="neutral" lookY={0.5} bob={false} />
      {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 640 + i * 60, top: 1010 - i * 70 - ((frame * 2 + i * 20) % 60), fontFamily: FONT, fontWeight: 900, fontSize: 70 - i * 10, color: '#fff', WebkitTextStroke: `6px ${INK}`, paintOrder: 'stroke fill'}}>Z</div>)}
      <Person {...OPER} x={900} y={1450} scale={1.2} emotion="worried" lookX={-1} bob />
      <div style={{position: 'absolute', left: 60, top: 150, padding: '8px 36px', background: '#2f3542', border: `8px solid ${INK}`, borderRadius: 20, fontFamily: FONT, fontWeight: 900, fontSize: 78, color: '#fff'}}>VOLTA {lap}</div>
      {frame >= 120 ? <Bubble x={800} y={960} w={400} size={34} text="POR FAVOR, DESCE!" at={120} tail="center" /> : null}
      <Pop at={120} />
    </AbsoluteFill>
  );
};

// s06
const Cobra: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#b8e994" floor="#6ab04c" />
      <div style={{position: 'absolute', right: 40, top: 270, width: 480, height: 130, background: '#e17055', border: `8px solid ${INK}`, borderRadius: 14, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 42, color: '#fff', lineHeight: '120px'}}>SETOR DOS TIGRES 🐯</div>
      <Person {...ME} x={280} y={1400} scale={1.5} emotion="happy" lookX={1} bob />
      <Big x={640} y={900} e="🐍" s={1.9} at={4} rot={Math.sin(frame / 5) * 5} />
      <Big x={620} y={790} e="😱" s={0.5} at={95} rot={Math.sin(frame / 3) * 12} />
      <Big x={470} y={1000} e="🤚" s={0.7} at={40} rot={20} />
      {frame >= 120 ? <Bubble x={780} y={700} w={520} size={38} text="QUERO TRANSFERÊNCIA!" at={120} tail="center" /> : null}
      <Person {...TRATADOR} x={940} y={1400} scale={1.0} emotion="shocked" lookX={-1} />
      <Pop at={40} /><Pop at={120} />
    </AbsoluteFill>
  );
};

// s07
const Alarme: React.FC = () => {
  const frame = useCurrentFrame();
  const items: [string, string, number][] = [['🔥', 'FOGÃO LIGADO', 45], ['🚪', 'PORTÃO ABERTO', 95], ['♨️', 'ÁGUA FERVENDO', 130]];
  return (
    <AbsoluteFill>
      <Room wall="#ffeaa7" floor="#cc8e35" />
      {items.map(([e, t, at], i) => frame >= at ? (
        <div key={t} style={{position: 'absolute', left: 60, top: 260 + i * 170, width: 560, height: 140, background: '#fff', border: `8px solid ${INK}`, borderRadius: 24, display: 'flex', alignItems: 'center', gap: 20, padding: '0 24px', boxShadow: `0 8px 0 ${INK}`}}>
          <div style={{fontSize: 80}}>{e}</div>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK}}>{t}</div>
        </div>
      ) : null)}
      <Person {...ME} x={820} y={1400} scale={1.6} emotion="happy" lookX={-1} bob />
      {frame >= 190 ? <Big x={800} y={620} e="🪫" s={1.5} at={190} rot={Math.sin(frame / 6) * 6} /> : null}
      {frame >= 195 ? <Stamp x={380} y={1000} text="ALARME SEM PILHA" at={198} color="#ff4757" size={56} rot={-3} /> : null}
      <Pop at={45} /><Pop at={95} /><Pop at={130} /><Sting at={195} volume={0.4} />
    </AbsoluteFill>
  );
};

// s08
const Irma: React.FC = () => {
  const frame = useCurrentFrame();
  const heart = 1 + Math.sin(frame / 3) * 0.12;
  const car = interpolate(frame, [150, 195], [-300, 700], clamp);
  return (
    <AbsoluteFill>
      <Street />
      <Crosswalk />
      <Person {...ME} x={330} y={1480} scale={1.5} emotion={frame < 150 ? 'neutral' : 'scared'} lookX={1} bob />
      <Person {...DUDA} x={frame < 100 ? 470 : 640} y={frame < 100 ? 1480 : 1500} scale={1.0} emotion="happy" lookX={1} bob />
      {frame >= 150 ? <div style={{position: 'absolute', left: car, top: 1120, fontSize: 170}}>🚗</div> : null}
      {frame >= 150 ? <Big x={330} y={800} e="💓" s={1.2} at={150} rot={0} /> : null}
      {frame >= 150 ? <Stamp x={540} y={420} text="UM MEDO VOLTOU" at={150} color="#ff4757" size={64} rot={-3} /> : null}
      {frame >= 100 ? <Stamp x={700} y={1160} text="ELA FAZ IGUAL" at={100} color="#e84393" size={42} rot={4} /> : null}
      <Pop at={100} /><Sting at={150} volume={0.4} />
    </AbsoluteFill>
  );
};

// s09
const Corre: React.FC = () => {
  const frame = useCurrentFrame();
  const car = interpolate(frame, [80, 118], [-400, 1500], clamp);
  const pull = interpolate(frame, [30, 75], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Street />
      <Crosswalk />
      {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: car - 200 - i * 90, top: 1160 + i * 30, width: 160, height: 10, background: '#fff', opacity: frame >= 80 && frame < 130 ? 0.7 : 0}} />)}
      <div style={{position: 'absolute', left: car, top: 1110, fontSize: 190}}>🚗</div>
      <Person {...ME} x={340 + pull * 70} y={1500} scale={1.6} emotion="scared" lookX={1} />
      <Person {...DUDA} x={720 - pull * 150} y={1500} scale={1.0} emotion="shocked" lookX={-1} />
      {frame >= 125 ? <Big x={540} y={470} e="💓" s={1.6} at={125} rot={Math.sin(frame / 4) * 6} /> : null}
      {frame >= 155 ? <Stamp x={540} y={330} text="O MEDO DE PERDER ELA" at={155} color="#ff4757" size={52} rot={-3} /> : null}
      <Flash at={84} len={5} />
      <Pop at={30} /><Sting at={84} volume={0.5} /><Pop at={155} />
    </AbsoluteFill>
  );
};

// s10
const Abraco: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#ffeaa7" floor="#cc8e35" />
      <Person {...ME} x={430} y={1450} scale={1.6} emotion="happy" lookX={1} bob />
      <Person {...DUDA} x={640} y={1470} scale={1.2} emotion="happy" lookX={-1} bob />
      <Big x={540} y={760} e="❤️" s={0.8} at={4} rot={Math.sin(frame / 6) * 8} />
      {frame >= 35 ? <Bubble x={300} y={620} w={460} size={40} text="OLHA OS DOIS LADOS" at={35} tail="center" /> : null}
      {frame >= 100 ? <Bubble x={800} y={620} w={420} size={40} text="EU OLHO TRÊS!" at={100} tail="center" /> : null}
      {frame >= 150 ? <Stamp x={540} y={260} text="MEDO = AMOR AVISANDO" at={150} color="#e84393" size={50} rot={-3} /> : null}
      <Pop at={35} /><Pop at={100} /><Pop at={150} />
    </AbsoluteFill>
  );
};

// s11
const Volta: React.FC = () => {
  const frame = useCurrentFrame();
  const fears: [string, string, number, number][] = [['🪳', 'BARATA', 165, 380], ['🦷', 'DENTISTA', 200, 380], ['🧦', 'MEIA', 235, 250]];
  return (
    <AbsoluteFill>
      <Room wall="#a29bfe" floor="#6c5ce7" />
      <DayTag text="DIA SEGUINTE" y={150} />
      <div style={{position: 'absolute', left: 150, top: 1150, width: 780, height: 260, background: '#74b9ff', border: `9px solid ${INK}`, borderRadius: 30, boxShadow: `0 10px 0 ${INK}`}} />
      <Person {...ME} x={540} y={1330} scale={1.5} emotion={frame < 60 ? 'neutral' : 'scared'} lookY={-0.3} bob />
      {fears.map(([e, t, at, y], i) => frame >= at - 100 ? <Thought key={t} x={200 + i * 340} y={y + 130} text={`${e} ${t}`} at={at - 100} w={300} size={40} color="#ffd6d6" /> : null)}
      {frame >= 60 ? <Stamp x={540} y={560} text="MEDO: 100%" at={60} color="#ff4757" size={72} rot={-3} /> : null}
      {frame >= 160 ? <Stamp x={540} y={700} text="OBRIGADO" at={160} color="#20bf6b" size={72} rot={3} /> : null}
      <Pop at={60} /><Sting at={60} volume={0.4} /><Pop at={160} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => (
  <AbsoluteFill style={{background: '#192a56'}}>
    <Title text="VOCÊ APAGARIA TODOS OS SEUS MEDOS POR UM DIA?" color="#fff" top={100} size={60} />
    <SimNao top={620} />
    <Person {...ME} x={300} y={1300} scale={1.5} emotion="worried" lookX={1} />
    <Person {...DUDA} x={780} y={1300} scale={1.2} emotion="happy" lookX={-1} />
    <Stamp x={540} y={540} text="PARTE 2: MEDO DE TUDO" at={20} color="#fed330" size={44} rot={-4} />
    <Handle top={1470} />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook, fato: Fato, chefe: Chefe, crush: Crush, parque: Parque, cobra: Cobra, alarme: Alarme, irma: Irma,
  corre: Corre, abraco: Abraco, volta: Volta, cta: Cta,
};
