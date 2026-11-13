import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Person, PersonProps} from './Person';
import {INK, ME, Pop, Sting, Floor, Title, Room, Street, Flash} from './lib';
import {Stamp, Bubble, Thought, Big, DayTag, Cap, Ball, SimNao, Handle, Cloud, FONT, clamp, ease} from './ui';

// Ep. 13 = tema #2 do banco: sorte vira azar do melhor amigo (Dudu). Fato: Caixa, 1 em 50.063.860.
const DUDU: Partial<PersonProps> = {skin: '#d1a074', hair: 'spiky', hairColor: '#2d3436', shirt: '#e17055', pants: '#2d3436'};
const BOSSF: Partial<PersonProps> = {skin: '#f5cba7', hair: 'bald', mustache: true, suit: true, tie: '#0984e3', shirt: '#2f3542'};
const NUMS = ['04', '11', '23', '37', '48', '59'];

const Loterica: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill>
    <Room wall="#fed330" floor="#6c5ce7" />
    <div style={{position: 'absolute', left: 90, right: 90, top: 190, height: 150, background: '#20bf6b', border: `9px solid ${INK}`, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 96, color: '#fff', boxShadow: `0 10px 0 ${INK}`}}>LOTÉRICA</div>
    <div style={{position: 'absolute', left: 60, top: 760, width: 960, height: 40, background: '#6f4e37', border: `8px solid ${INK}`}} />
    {children}
  </AbsoluteFill>
);

// s01
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Loterica>
      {NUMS.map((n, i) => <Ball key={n} x={190 + i * 140} y={500} n={n} at={6 + i * 7} size={116} />)}
      <Stamp x={540} y={650} text="ACERTOU AS 6!" at={50} color="#20bf6b" size={74} rot={-3} />
      <Person {...ME} x={260} y={1400} scale={1.5} emotion="happy" lookX={1} bob />
      <Person {...DUDU} x={820} y={1400} scale={1.5} emotion={frame < 80 ? 'happy' : 'shocked'} lookX={-1} talking={frame >= 80 && frame < 150} />
      {frame >= 80 ? <Bubble x={780} y={960} w={500} size={46} text="SEU CARRO FOI GUINCHADO!" at={80} tail="center" /> : null}
      {frame >= 80 ? <Big x={900} y={1000} e="🚛" s={0.6} at={84} /> : null}
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 120 + i * 190, top: 900 + Math.sin(frame / 5 + i) * 18, fontSize: 70}}>✨</div>)}
      <Pop at={6} /><Pop at={50} /><Sting at={80} volume={0.45} />
    </Loterica>
  );
};

// s02
const Fato: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [20, 90], [0, 50063860], {...clamp, easing: ease}));
  const txt = n.toLocaleString('pt-BR');
  return (
    <AbsoluteFill style={{background: '#1e272e'}}>
      <Title text="MEGA-SENA" color="#fed330" top={110} size={96} at={2} />
      <div style={{position: 'absolute', left: 60, right: 60, top: 420, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 70, color: '#fff'}}>CHANCE DE ACERTAR</div>
      <div style={{position: 'absolute', left: 40, right: 40, top: 520, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 130, color: '#20bf6b', WebkitTextStroke: `8px ${INK}`, paintOrder: 'stroke fill'}}>1 EM {txt}</div>
      {/* um ponto verde no meio de uma multidão de pontos cinza */}
      <div style={{position: 'absolute', left: 90, top: 760, width: 900, height: 300, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center'}}>
        {Array.from({length: 60}).map((_, i) => <div key={i} style={{width: 38, height: 38, borderRadius: 19, background: i === 27 && frame > 100 ? '#20bf6b' : '#57606f', border: `4px solid ${INK}`, transform: i === 27 && frame > 100 ? 'scale(1.5)' : undefined}} />)}
      </div>
      {frame >= 130 ? <Stamp x={290} y={1130} text="VOCÊ ACERTOU" at={130} color="#20bf6b" size={44} rot={-4} /> : null}
      {frame >= 175 ? <Stamp x={790} y={1130} text="ALGUÉM PAGOU" at={175} color="#ff4757" size={44} rot={4} /> : null}
      <Cap text="Fonte: Caixa Econômica Federal (aposta simples, 6 dezenas)" />
      <Pop at={20} /><Pop at={130} /><Pop at={175} />
    </AbsoluteFill>
  );
};

// s03
const Azar: React.FC = () => {
  const frame = useCurrentFrame();
  const pizzaRot = interpolate(frame, [10, 40], [0, 180], clamp);
  const pizzaY = interpolate(frame, [10, 40, 60], [650, 560, 900], clamp);
  const phoneY = interpolate(frame, [55, 95], [700, 1040], clamp);
  return (
    <AbsoluteFill>
      <Street />
      <Person {...DUDU} x={640} y={1420} scale={1.6} emotion={frame < 100 ? 'shocked' : 'sad'} lookY={-0.4} bob />
      <Cloud x={640} y={330} scale={1.5} at={90} />
      <Big x={300} y={pizzaY} e="🍕" s={1.1} rot={pizzaRot} at={4} />
      {frame < 95 ? <Big x={880} y={phoneY} e="📱" s={0.8} at={50} rot={frame * 4} /> : null}
      {frame >= 95 ? <Big x={880} y={1010} e="🚽" s={1.0} at={95} /> : null}
      <Person {...ME} x={190} y={1420} scale={1.1} emotion="smirk" lookX={1} />
      <Stamp x={540} y={190} text="SÓ NELE" at={110} color="#ff4757" size={78} rot={-3} />
      <Pop at={10} /><Pop at={55} /><Sting at={90} volume={0.4} />
    </AbsoluteFill>
  );
};

// placar sorte x azar (s04, s05)
const Placar: React.FC<{a: number[]; b: number[]; at: number[]}> = ({a, b, at}) => {
  const frame = useCurrentFrame();
  let k = -1;
  at.forEach((t, i) => { if (frame >= t) k = i; });
  const va = k < 0 ? a[0] : a[k + 1] ?? a[a.length - 1];
  const vb = k < 0 ? b[0] : b[k + 1] ?? b[b.length - 1];
  const box = (label: string, v: number, color: string, x: number) => (
    <div style={{position: 'absolute', left: x, top: 90, width: 450, height: 220, background: color, border: `9px solid ${INK}`, borderRadius: 30, boxShadow: `0 10px 0 ${INK}`, textAlign: 'center'}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 42, color: '#fff', marginTop: 14}}>{label}</div>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 120, color: '#fff', lineHeight: 1.1}}>{v}</div>
    </div>
  );
  return <>{box('SUA SORTE', va, '#20bf6b', 60)}{box('AZAR DO DUDU', vb, '#ff4757', 570)}</>;
};

// s04
const Testes: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#74b9ff" floor="#2d98da" />
      <Placar a={[0, 1, 2]} b={[0, 1, 2]} at={[20, 110]} />
      <Person {...ME} x={250} y={1400} scale={1.4} emotion="happy" lookX={1} bob />
      <Person {...DUDU} x={820} y={1400} scale={1.4} emotion={frame >= 50 ? 'sad' : 'neutral'} lookX={-1} bob />
      {frame >= 15 && frame < 100 ? <Big x={250} y={520} e="💵" s={1.1} at={15} rot={Math.sin(frame / 6) * 8} /> : null}
      {frame >= 100 ? <Big x={250} y={520} e="🎂" s={1.1} at={100} /> : null}
      {frame >= 40 && frame < 110 ? <Big x={820} y={640} e="💩" s={1.0} at={40} /> : null}
      {frame >= 130 ? <Big x={820} y={560} e="🎂" s={1.2} at={130} rot={-14} /> : null}
      {frame >= 40 && frame < 110 ? <Stamp x={820} y={560} text="PISOU" at={44} color="#e17055" size={50} rot={4} /> : null}
      {frame >= 135 ? <Stamp x={820} y={500} text="NA CARA" at={135} color="#e17055" size={50} rot={-4} /> : null}
      <Pop at={15} /><Pop at={40} /><Pop at={100} /><Pop at={130} />
    </AbsoluteFill>
  );
};

// s05
const Absurdo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#a29bfe" floor="#6c5ce7" />
      <Placar a={[2, 3, 4]} b={[2, 3, 4]} at={[20, 110]} />
      {/* faixa de cima: você */}
      <div style={{position: 'absolute', left: 60, top: 360, width: 960, height: 330, background: '#fff', border: `9px solid ${INK}`, borderRadius: 30, boxShadow: `0 10px 0 ${INK}`}} />
      <Big x={220} y={400} e="📺" s={1.1} at={12} />
      <Big x={780} y={400} e="🅿️" s={1.1} at={104} />
      <Stamp x={540} y={720} text="SUA SORTE" at={12} color="#20bf6b" size={46} rot={-3} />
      {/* faixa de baixo: Dudu */}
      <div style={{position: 'absolute', left: 60, top: 790, width: 960, height: 400, background: '#2f3542', border: `9px solid ${INK}`, borderRadius: 30, boxShadow: `0 10px 0 ${INK}`}} />
      <div style={{position: 'absolute', left: 130, top: 1010, width: 270, height: 150, background: '#b2967d', border: `8px solid ${INK}`, borderRadius: 10, display: frame >= 40 ? 'block' : 'none'}} />
      <Big x={290} y={850} e="🛋️" s={1.3} at={40} rot={Math.sin(frame / 4) * 6} />
      <div style={{position: 'absolute', left: 640, top: 1040, width: 300, height: 110, borderRadius: '50%', background: '#111', border: `8px solid ${INK}`, display: frame >= 130 ? 'block' : 'none'}} />
      <Person {...DUDU} x={frame >= 130 ? 790 : 520} y={frame >= 130 ? 1140 : 1160} scale={0.75} emotion="shocked" bob={false} />
      <Stamp x={790} y={900} text="SÓ DELE" at={140} color="#ff4757" size={54} rot={-3} />
      <Pop at={12} /><Pop at={40} /><Pop at={104} /><Pop at={130} />
    </AbsoluteFill>
  );
};

// s06
const Padrao: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [80, 120], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Room wall="#81ecec" floor="#00cec9" />
      <Person {...ME} x={830} y={1400} scale={1.5} emotion={frame < 80 ? 'neutral' : 'shocked'} lookX={-1} bob />
      <Person {...DUDU} x={260} y={1400} scale={1.5} emotion="sad" lookX={1} talking={frame < 70} bob />
      <Cloud x={260} y={410} scale={1.2} at={0} />
      <Bubble x={300} y={400} w={520} size={44} text="TÔ NUM AZAR DESDE SEGUNDA" at={6} tail="center" />
      {frame >= 80 ? <div style={{position: 'absolute', left: 830 + (260 - 830) * t, top: 470 - Math.sin(t * Math.PI) * 140, fontSize: 150, transform: 'translate(-50%,0)'}}>⚡</div> : null}
      {frame >= 80 ? <Stamp x={540} y={190} text="É A SUA SORTE" at={80} color="#ff4757" size={64} rot={-3} /> : null}
      <Pop at={6} /><Sting at={80} volume={0.4} />
    </AbsoluteFill>
  );
};

// s07
const Entrevista: React.FC = () => {
  const frame = useCurrentFrame();
  const shine = (frame * 9) % 260;
  return (
    <AbsoluteFill>
      <Room wall="#dfe6e9" floor="#b2967d" />
      <div style={{position: 'absolute', left: 620, top: 230, width: 360, height: 520, background: '#6f4e37', border: `9px solid ${INK}`, borderRadius: 14}}>
        <div style={{margin: '40px auto 0', width: 300, padding: '10px', background: '#fff', border: `6px solid ${INK}`, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, textAlign: 'center'}}>ENTREVISTA<br />10:00</div>
      </div>
      <div style={{position: 'absolute', left: 90, top: 260, width: 190, height: 190, borderRadius: '50%', background: '#fff', border: `9px solid ${INK}`}}>
        <div style={{position: 'absolute', left: 91, top: 30, width: 8, height: 70, background: INK, transformOrigin: '4px 66px', transform: `rotate(${frame * 3}deg)`}} />
        <div style={{position: 'absolute', left: 91, top: 60, width: 8, height: 40, background: '#ff4757', transformOrigin: '4px 36px', transform: 'rotate(300deg)'}} />
      </div>
      <Person {...DUDU} x={260} y={1400} scale={1.5} emotion="worried" lookX={1} bob />
      <Person {...ME} x={820} y={1400} scale={1.5} emotion="smirk" lookX={-1} bob />
      <div style={{position: 'absolute', left: 700, top: 1040, width: 220, height: 140, background: '#f9ca24', border: `7px solid ${INK}`, borderRadius: 14, overflow: 'hidden', transform: 'rotate(-8deg)', fontFamily: FONT, fontWeight: 900, fontSize: 34, color: INK, textAlign: 'center', paddingTop: 44}}>RASPE AQUI
        <div style={{position: 'absolute', left: shine - 120, top: 0, width: 50, height: '100%', background: 'rgba(255,255,255,0.6)', transform: 'skewX(-20deg)'}} />
      </div>
      <Thought x={760} y={720} text="SEI QUE É PREMIADA" at={50} w={520} size={46} color="#fff7b2" />
      <Pop at={50} />
    </AbsoluteFill>
  );
};

// s08
const Dilema: React.FC = () => {
  const frame = useCurrentFrame();
  const look = Math.sin(frame / 14);
  return (
    <AbsoluteFill>
      <Room wall="#2d3436" floor="#1e272e" />
      <Cloud x={820} y={190} scale={1.7} at={0} />
      <Person {...DUDU} x={820} y={1330} scale={1.3} emotion="worried" lookX={-1} bob />
      <div style={{position: 'absolute', left: 60, top: 330, width: 460, height: 360, background: '#20bf6b', border: `9px solid ${INK}`, borderRadius: 30, textAlign: 'center', boxShadow: `0 10px 0 ${INK}`}}>
        <div style={{fontSize: 140, marginTop: 24}}>💰</div>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 64, color: '#fff'}}>R$ 500 MIL</div>
      </div>
      <Person {...ME} x={290} y={1330} scale={1.5} emotion="worried" lookX={look} bob />
      <div style={{position: 'absolute', left: 150, top: 1000, width: 220, height: 140, background: '#f9ca24', border: `7px solid ${INK}`, borderRadius: 14, transform: 'rotate(-6deg)', fontFamily: FONT, fontWeight: 900, fontSize: 34, color: INK, textAlign: 'center', paddingTop: 44}}>RASPE AQUI</div>
      <div style={{position: 'absolute', left: 530, top: 880, width: 20, height: 20, borderRadius: 10, background: '#fed330', transform: `scale(${1 + Math.sin(frame / 4) * 0.4})`}} />
      <Stamp x={540} y={190} text="SUA SORTE OU A DELE" at={90} color="#fed330" size={50} rot={-3} />
      <Pop at={90} />
    </AbsoluteFill>
  );
};

// s09
const Rasga: React.FC = () => {
  const frame = useCurrentFrame();
  const split = interpolate(frame, [20, 60], [0, 1], clamp);
  const cloudScale = interpolate(frame, [70, 130], [1.6, 0], clamp);
  return (
    <AbsoluteFill>
      <Room wall={frame < 70 ? '#2d3436' : '#74b9ff'} floor={frame < 70 ? '#1e272e' : '#2d98da'} />
      <Person {...ME} x={300} y={1400} scale={1.6} emotion={frame < 60 ? 'scared' : 'happy'} lookY={0.3} bob />
      <Person {...DUDU} x={820} y={1400} scale={1.4} emotion={frame < 100 ? 'worried' : 'happy'} lookX={-1} bob />
      {cloudScale > 0.05 ? <Cloud x={820} y={200 - (1 - cloudScale / 1.6) * 100} scale={cloudScale} at={0} /> : null}
      {frame < 130 ? <>
        <div style={{position: 'absolute', left: 150 - split * 130, top: 880 + split * 380, width: 110, height: 140, background: '#f9ca24', border: `7px solid ${INK}`, transform: `rotate(${-20 - split * 90}deg)`}} />
        <div style={{position: 'absolute', left: 260 + split * 130, top: 880 + split * 420, width: 110, height: 140, background: '#f9ca24', border: `7px solid ${INK}`, transform: `rotate(${20 + split * 100}deg)`}} />
      </> : null}
      {frame >= 70 ? <Big x={540} y={300} e="☀️" s={1.4} at={90} /> : null}
      <Stamp x={540} y={190} text="SEM SORTE, SEM AZAR" at={70} color="#20bf6b" size={56} rot={-3} />
      <Flash at={66} len={8} />
      <Pop at={22} /><Sting at={66} volume={0.5} />
    </AbsoluteFill>
  );
};

// s10
const Passa: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#dff9fb" floor="#b2967d" />
      <div style={{position: 'absolute', left: 80, top: 790, width: 900, height: 40, background: '#6f4e37', border: `8px solid ${INK}`}} />
      <Person {...BOSSF} x={800} y={1400} scale={1.4} emotion={frame < 60 ? 'neutral' : 'happy'} lookX={-1} bob />
      <Person {...DUDU} x={300} y={1400} scale={1.4} emotion="happy" lookX={1} talking={frame >= 70} bob />
      <Stamp x={540} y={230} text="CONTRATADO!" at={50} color="#20bf6b" size={86} rot={-3} />
      {frame >= 90 ? <Bubble x={320} y={640} w={560} size={40} text="HOJE O UNIVERSO TAVA DO MEU LADO" at={90} tail="center" /> : null}
      <Person {...ME} x={960} y={1050} scale={0.6} emotion="happy" lookX={-1} />
      {frame >= 50 ? Array.from({length: 8}).map((_, i) => <div key={i} style={{position: 'absolute', left: 80 + i * 120, top: 400 + ((frame * 5 + i * 70) % 500), fontSize: 50}}>🎉</div>) : null}
      <Pop at={50} /><Sting at={50} volume={0.35} />
    </AbsoluteFill>
  );
};

// s11
const Pombo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Loterica>
      <DayTag text="NO DIA SEGUINTE" y={110} />
      <Big x={540} y={780} e="🐦" s={2.2} rot={Math.sin(frame / 8) * 5} at={4} />
      <Big x={760} y={900} e="🎟️" s={1.0} at={40} rot={14} />
      {NUMS.map((n, i) => <Ball key={n} x={190 + i * 140} y={480} n={n} at={60 + i * 9} size={116} color="#6c5ce7" />)}
      <Stamp x={540} y={640} text="SEIS DEZENAS" at={118} color="#20bf6b" size={70} rot={-3} />
      <Big x={250} y={790} e="❓" s={0.7} at={140} rot={-10} />
      <Pop at={40} /><Pop at={118} /><Sting at={118} volume={0.4} />
    </Loterica>
  );
};

const Cta: React.FC = () => (
  <AbsoluteFill style={{background: '#192a56'}}>
    <Title text="VOCÊ ABRIRIA MÃO DA SUA SORTE POR ALGUÉM?" color="#fff" top={100} size={64} />
    <SimNao top={620} />
    <Person {...ME} x={300} y={1300} scale={1.5} emotion="worried" lookX={1} />
    <Person {...DUDU} x={780} y={1300} scale={1.5} emotion="happy" lookX={-1} />
    <Stamp x={540} y={540} text="PARTE 2: O POMBO COBRA" at={20} color="#fed330" size={44} rot={-4} />
    <Handle top={1470} />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook, fato: Fato, azar: Azar, testes: Testes, absurdo: Absurdo, padrao: Padrao, entrevista: Entrevista,
  dilema: Dilema, rasga: Rasga, passa: Passa, pombo: Pombo, cta: Cta,
};
