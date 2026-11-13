import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Person, PersonProps} from './Person';
import {INK, ME, Pop, Sting, Floor, Title, Room, Street, Flash} from './lib';
import {Stamp, Bubble, Thought, Big, DayTag, Cap, SimNao, Handle, FONT, clamp, ease} from './ui';

// Ep. 14 = tema #5 do banco: celular proibido em todo lugar. Fato: Lei 15.100 (13/01/2025).
const TIO: Partial<PersonProps> = {skin: '#f5cba7', hair: 'bald', mustache: true, shirt: '#fdcb6e', pants: '#636e72'};
const TIA: Partial<PersonProps> = {skin: '#c68642', hair: 'bun', hairColor: '#2d3436', shirt: '#e84393', pants: '#2d3436'};
const P1: Partial<PersonProps> = {skin: '#f2c29b', hair: 'spiky', hairColor: '#2d3436', shirt: '#6c5ce7', pants: '#2d3436'};
const P2: Partial<PersonProps> = {skin: '#8d5524', hair: 'short', hairColor: '#1e1e1e', shirt: '#0984e3', pants: '#636e72', hat: 'cap', hatColor: '#fdcb6e'};
const P3: Partial<PersonProps> = {skin: '#d1a074', hair: 'long', hairColor: '#6c3b2a', shirt: '#00b894', pants: '#2d3436'};
const PAI: Partial<PersonProps> = {skin: '#f5cba7', hair: 'bald', mustache: true, shirt: '#b2bec3', pants: '#2d3436'};
const VEND: Partial<PersonProps> = {skin: '#d1a074', hair: 'short', hairColor: '#2d3436', hat: 'cap', hatColor: '#e17055', shirt: '#fdcb6e', pants: '#2d3436'};

const SAP = [P1, P2, P3, TIA, TIO];

// s01
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const fly = interpolate(frame, [50, 85], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Room wall="#a29bfe" floor="#6c5ce7" />
      <DayTag text="A LEI SAIU HOJE" y={150} color="#ff4757" />
      <div style={{position: 'absolute', left: 120, top: 520, width: 840, height: 330, background: '#fff', border: `9px solid ${INK}`, borderRadius: 30, textAlign: 'center', boxShadow: `0 10px 0 ${INK}`, fontFamily: FONT, fontWeight: 900, fontSize: 84, color: INK, paddingTop: 50, lineHeight: 1.05}}>📵<br />SÓ EM CASA</div>
      <Person {...ME} x={300} y={1400} scale={1.6} emotion={frame < 60 ? 'neutral' : 'shocked'} lookX={1} bob />
      {/* gaveta */}
      <div style={{position: 'absolute', left: 640, top: 1010, width: 340, height: 250, background: '#b2967d', border: `9px solid ${INK}`, borderRadius: 14}}>
        <div style={{margin: '95px auto 0', width: 110, height: 30, background: '#ffeaa7', border: `6px solid ${INK}`, borderRadius: 10}} />
      </div>
      <div style={{position: 'absolute', left: 300 + (780 - 300) * fly, top: 1000 - Math.sin(fly * Math.PI) * 250, fontSize: 100, transform: `rotate(${fly * 360}deg)`, display: frame >= 40 && frame < 100 ? 'block' : 'none'}}>📱</div>
      {frame >= 85 ? <Stamp x={540} y={420} text="NOTIFICAÇÕES: 0" at={85} color="#2f3542" size={56} rot={-3} /> : null}
      <Pop at={50} /><Sting at={85} volume={0.35} />
    </AbsoluteFill>
  );
};

// s02
const Fato: React.FC = () => {
  const frame = useCurrentFrame();
  const lines = [0, 1, 2, 3, 4];
  return (
    <AbsoluteFill style={{background: '#1e272e'}}>
      <Title text="LEI Nº 15.100" color="#fed330" top={110} size={96} at={2} />
      <div style={{position: 'absolute', left: 150, top: 330, width: 780, height: 560, background: '#f5f6fa', border: `9px solid ${INK}`, borderRadius: 18, boxShadow: `0 12px 0 ${INK}`, padding: '40px 50px'}}>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 46, color: INK, textAlign: 'center'}}>13 DE JANEIRO DE 2025</div>
        {lines.map((i) => <div key={i} style={{height: 26, borderRadius: 13, background: '#ced6e0', marginTop: 28, width: `${96 - i * 9}%`}} />)}
        <div style={{fontSize: 130, textAlign: 'center', marginTop: 14}}>🏫📵</div>
      </div>
      {frame >= 70 ? <Stamp x={540} y={960} text="ATÉ NO RECREIO" at={70} color="#ff4757" size={64} rot={-4} /> : null}
      {frame >= 140 ? <Stamp x={540} y={1100} text="E SE FOSSE PRA TODO MUNDO?" at={140} color="#6c5ce7" size={46} rot={3} /> : null}
      <Cap text="Fonte: Lei 15.100, de 13/01/2025 (educação básica)" />
      <Pop at={70} /><Pop at={140} />
    </AbsoluteFill>
  );
};

// s03
const Onibus: React.FC = () => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 6) * 5;
  return (
    <AbsoluteFill>
      <Room wall="#dfe6e9" floor="#636e72" />
      {[60, 400, 740].map((x, i) => <div key={i} style={{position: 'absolute', left: x, top: 240, width: 280, height: 190, background: '#74b9ff', border: `9px solid ${INK}`, borderRadius: 16}} />)}
      {[P1, P2, P3, TIA].map((p, i) => (
        <div key={i} style={{position: 'absolute', left: 0, top: sway * (i % 2 ? 1 : -1)}}>
          <Person {...p} x={170 + i * 230} y={1260} scale={1.0} emotion="neutral" lookX={0} />
        </div>
      ))}
      {frame < 45 ? <Thought x={540} y={620} text="..." at={4} w={300} size={80} /> : null}
      {frame >= 45 ? <Bubble x={300} y={620} w={560} size={44} text="QUE HORAS SÃO?" at={45} tail="center" /> : null}
      {frame >= 95 ? <>
        <div style={{position: 'absolute', left: 740, top: 700, width: 420, height: 420, borderRadius: '50%', background: 'rgba(254,211,48,0.45)'}} />
        <Person {...TIO} x={880} y={1260} scale={1.3} emotion="smirk" lookX={-1} talking bob />
        <Big x={880} y={860} e="⌚" s={0.8} at={97} rot={Math.sin(frame / 5) * 12} />
        <Stamp x={540} y={230} text="TIO DO RELÓGIO: CELEBRIDADE" at={110} color="#fed330" size={38} rot={-3} />
      </> : null}
      <Pop at={45} /><Pop at={97} />
    </AbsoluteFill>
  );
};

// s04
const Banco: React.FC = () => {
  const frame = useCurrentFrame();
  const bs = [['RECEITA DE BOLO', 70], ['FOFOCA', 105], ['CASAMENTO MARCADO', 140]] as [string, number][];
  return (
    <AbsoluteFill>
      <Room wall="#81ecec" floor="#b2967d" />
      <div style={{position: 'absolute', left: 60, top: 780, width: 960, height: 40, background: '#6f4e37', border: `8px solid ${INK}`}} />
      <div style={{position: 'absolute', left: 400, top: 260, width: 280, height: 220, background: '#fff', border: `9px solid ${INK}`, borderRadius: 14, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, paddingTop: 30}}>🏦<br />BANCO</div>
      <Person {...TIA} x={220} y={1380} scale={1.5} emotion="happy" lookX={1} talking bob />
      <Person {...ME} x={560} y={1380} scale={1.4} emotion="smirk" lookX={-1} />
      <Person {...P2} x={880} y={1380} scale={1.4} emotion="happy" lookX={-1} />
      {bs.map(([t, at], i) => frame >= at ? <Bubble key={t} x={190 + i * 350} y={740} w={330} size={32} text={t} at={at} tail="center" /> : null)}
      {frame >= 140 ? <Big x={880} y={880} e="💍" s={0.8} at={144} /> : null}
      {frame >= 165 ? <Stamp x={540} y={150} text="FILA VIROU FESTA" at={165} color="#e84393" size={62} rot={-3} /> : null}
      <Pop at={70} /><Pop at={105} /><Pop at={140} />
    </AbsoluteFill>
  );
};

// s05
const Mapa: React.FC = () => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [10, 70], [0.4, 1.7], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Street />
      <div style={{position: 'absolute', left: 300 - 200 * grow, top: 1100 - 520 * grow, width: 400 * grow, height: 520 * grow, background: '#ffeaa7', border: `9px solid ${INK}`, borderRadius: 10, transform: `rotate(${Math.sin(frame / 7) * 3}deg)`, overflow: 'hidden'}}>
        {[1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: `${i * 25}%`, top: 0, bottom: 0, width: 6, background: 'rgba(27,27,47,0.4)'}} />)}
        <div style={{position: 'absolute', left: '30%', top: '30%', fontSize: 70 * grow}}>📍</div>
      </div>
      <Person {...ME} x={300} y={1450} scale={1.4} emotion="worried" lookX={1} bob />
      {frame >= 90 ? <>
        <Big x={820} y={820} e="🐦" s={1.8} at={90} rot={Math.sin(frame / 8) * 4} />
        <Big x={560} y={900} e="👈" s={1.2} at={110} />
        <Stamp x={700} y={640} text="COM MUITA CONFIANÇA" at={120} color="#6c5ce7" size={44} rot={4} />
      </> : null}
      <Pop at={10} /><Pop at={90} />
    </AbsoluteFill>
  );
};

// s06
const Orelhao: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [10, 90], [1, 300], {...clamp, easing: ease}));
  return (
    <AbsoluteFill>
      <Street />
      {/* orelhão */}
      <div style={{position: 'absolute', left: 120, top: 760, width: 190, height: 420, background: '#f6b93b', border: `9px solid ${INK}`, borderRadius: '95px 95px 16px 16px'}}>
        <div style={{margin: '70px auto 0', width: 90, height: 90, borderRadius: '50%', background: '#fff', border: `7px solid ${INK}`, textAlign: 'center', fontSize: 54, lineHeight: '90px'}}>📞</div>
      </div>
      {/* fila */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <Person key={i} {...[P1, P2, P3, TIA, TIO, P1, P2][i]} x={400 + i * 90} y={1250 + (i % 2) * 8} scale={0.62} emotion="worried" lookX={-1} bob />)}
      <div style={{position: 'absolute', left: 60, top: 560, fontFamily: FONT, fontWeight: 900, fontSize: 110, color: '#fff', WebkitTextStroke: `10px ${INK}`, paintOrder: 'stroke fill'}}>{n}</div>
      <Stamp x={540} y={210} text="1 FICHA, 300 PESSOAS" at={20} color="#2f3542" size={52} rot={-3} />
      {frame >= 100 ? <>
        <Person {...VEND} x={900} y={1000} scale={0.8} emotion="happy" lookX={-1} />
        {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: 780 + i * 60, top: 560 + ((frame * 6 + i * 50) % 350), fontSize: 70}}>💸</div>)}
        <Stamp x={800} y={470} text="FICHA: R$ 50" at={104} color="#20bf6b" size={42} rot={-4} />
      </> : null}
      <Pop at={20} /><Pop at={104} />
    </AbsoluteFill>
  );
};

const Domino: React.FC<{x: number; y: number; a: number; b: number; rot?: number}> = ({x, y, a, b, rot = 0}) => {
  const dots = (n: number) => <div style={{width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 44, color: INK}}>{'•'.repeat(0) || n}</div>;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 70, height: 140, background: '#fff', border: `6px solid ${INK}`, borderRadius: 12, transform: `rotate(${rot}deg)`, boxShadow: `0 6px 0 ${INK}`}}>
      {dots(a)}<div style={{height: 6, background: INK}} />{dots(b)}
    </div>
  );
};

// s07
const Pai: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#3d3d6b" floor="#2c2c54" />
      <div style={{position: 'absolute', left: 80, top: 320, width: 320, height: 300, background: '#1e2a4a', border: `9px solid ${INK}`, borderRadius: 14}}><div style={{position: 'absolute', left: 130, top: 0, bottom: 0, width: 9, background: INK}} /></div>
      <div style={{position: 'absolute', left: 60, top: 1000, width: 960, height: 40, background: '#6f4e37', border: `8px solid ${INK}`}} />
      {[[250, 880, 6, 3, -12], [370, 870, 4, 4, 6], [470, 890, 2, 5, -4], [610, 880, 1, 6, 10], [730, 870, 3, 3, -8]].map(([x, y, a, b, r], i) => frame >= 6 + i * 8 ? <Domino key={i} x={x} y={y} a={a} b={b} rot={r} /> : null)}
      <Person {...PAI} x={250} y={1420} scale={1.5} emotion="happy" lookX={1} talking bob />
      <Person {...ME} x={830} y={1420} scale={1.5} emotion="happy" lookX={-1} bob />
      {frame >= 40 ? <Bubble x={300} y={520} w={600} size={40} text="FOI NUM BAILE, EM 1989..." at={40} tail="left" /> : null}
      {frame >= 110 ? <Big x={900} y={430} e="❤️" s={0.9} at={110} rot={Math.sin(frame / 6) * 8} /> : null}
      <Stamp x={540} y={220} text="3 HORAS SEM OLHAR O RELÓGIO" at={90} color="#e84393" size={40} rot={-3} />
      <Pop at={40} /><Pop at={90} />
    </AbsoluteFill>
  );
};

// s08
const Emergencia: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#2d3436" floor="#1e272e" />
      <DayTag text="3H DA MANHÃ" y={150} />
      {/* pai caído */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: 'rotate(-82deg)', transformOrigin: '520px 1450px'}}>
        <Person {...PAI} x={520} y={1450} scale={1.2} emotion="sad" bob={false} />
      </div>
      <Stamp x={300} y={1130} text="NÃO CONSIGO LEVANTAR" at={20} color="#ff4757" size={34} rot={-4} />
      {/* orelhão + fila */}
      <div style={{position: 'absolute', left: 790, top: 400, width: 150, height: 330, background: '#f6b93b', border: `9px solid ${INK}`, borderRadius: '75px 75px 16px 16px'}}>
        <div style={{margin: '50px auto 0', width: 70, height: 70, borderRadius: '50%', background: '#fff', border: `6px solid ${INK}`, textAlign: 'center', fontSize: 42, lineHeight: '70px'}}>📞</div>
      </div>
      {[0, 1, 2, 3, 4].map((i) => <Person key={i} {...[P1, P2, P3, TIA, TIO][i]} x={800 - i * 120} y={830 + (i % 2) * 6} scale={0.5} emotion="worried" lookX={1} bob />)}
      <Person {...ME} x={780} y={1450} scale={1.4} emotion="scared" lookX={1} bob />
      {frame >= 80 ? <Stamp x={640} y={920} text="FILA: 300" at={80} color="#ff4757" size={52} rot={3} /> : null}
      <Pop at={20} /><Sting at={80} volume={0.4} />
    </AbsoluteFill>
  );
};

// s09
const Fila: React.FC = () => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [140, 180], [0, 1], {...clamp, easing: ease});
  const run = interpolate(frame, [170, 220], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Street night />
      {[0, 1, 2, 3, 4, 5].map((i) => <Person key={`l${i}`} {...[P1, P2, P3, TIA, TIO, P1][i]} x={170 - open * 100} y={1010 + i * 60} scale={0.6 + i * 0.05} emotion="shocked" lookX={1} />)}
      {[0, 1, 2, 3, 4, 5].map((i) => <Person key={`r${i}`} {...[P3, TIA, P2, P1, TIO, P2][i]} x={910 + open * 100} y={1010 + i * 60} scale={0.6 + i * 0.05} emotion="shocked" lookX={-1} />)}
      <Person {...ME} x={540} y={1500 - run * 460} scale={1.5 - run * 0.6} emotion="scared" lookY={-0.3} />
      <div style={{position: 'absolute', left: 465, top: 380, width: 150, height: 330, background: '#f6b93b', border: `9px solid ${INK}`, borderRadius: '75px 75px 16px 16px'}} />
      {frame >= 5 ? <Bubble x={540} y={600} w={520} size={52} text="EMERGÊNCIA!" at={5} tail="center" /> : null}
      {frame >= 60 ? <Stamp x={540} y={210} text="NINGUÉM OLHANDO PRA TELA" at={60} color="#6c5ce7" size={44} rot={-3} /> : null}
      <Flash at={138} len={8} />
      <Pop at={5} /><Sting at={138} volume={0.45} />
    </AbsoluteFill>
  );
};

// s10
const Seta: React.FC = () => {
  const frame = useCurrentFrame();
  const amb = interpolate(frame, [0, 200], [-300, 1300], clamp);
  return (
    <AbsoluteFill>
      <Street night />
      <Big x={amb} y={820} e="🚑" s={1.5} at={0} />
      <DayTag text="A RUA VIROU UMA SETA" y={150} color="#20bf6b" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => frame >= 70 + i * 8 ? <Person key={i} {...[P1, P2, P3, TIA, TIO, P2, P1, P3][i]} x={110 + i * 120} y={1340 - (i < 4 ? i : 7 - i) * 70} scale={0.75} emotion="happy" lookX={1} /> : null)}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => frame >= 78 + i * 8 ? <Big key={`h${i}`} x={160 + i * 120} y={1000 - (i < 4 ? i : 7 - i) * 70} e="👉" s={0.5} at={78 + i * 8} /> : null)}
      <Stamp x={540} y={500} text="CINQUENTA VIZINHOS" at={70} color="#fed330" size={54} rot={-3} />
      <Pop at={70} /><Pop at={130} />
    </AbsoluteFill>
  );
};

// s11
const Dia7: React.FC = () => {
  const frame = useCurrentFrame();
  const silent = frame >= 130 && frame < 220;
  const posts = [[60, 460], [380, 520], [700, 460], [120, 700], [520, 740], [820, 700], [330, 920], [660, 960]];
  return (
    <AbsoluteFill>
      <Room wall={frame < 80 ? '#74b9ff' : '#2d3436'} floor={frame < 80 ? '#2d98da' : '#1e272e'} />
      {frame < 80 ? <>
        <Person {...PAI} x={300} y={1400} scale={1.5} emotion="happy" lookX={1} />
        <Person {...ME} x={780} y={1400} scale={1.5} emotion="happy" lookX={-1} />
        <Stamp x={540} y={200} text="DIA 7" at={0} color="#2f3542" size={90} rot={-3} />
        <Big x={300} y={880} e="🩹" s={0.6} at={20} />
      </> : null}
      {frame >= 80 ? <DayTag text="FIM DA LEI" y={150} /> : null}
      {silent ? <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 180, color: '#fff', WebkitTextStroke: `12px ${INK}`, paintOrder: 'stroke fill'}}>{3 - Math.floor((frame - 130) / 30)}</div> : null}
      {frame >= 220 ? posts.map(([x, y], i) => frame >= 220 + i * 4 ? (
        <div key={i} style={{position: 'absolute', left: x, top: y, width: 260, height: 180, background: '#fff', border: `7px solid ${INK}`, borderRadius: 22, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 30, color: INK, paddingTop: 22, lineHeight: 1.1, transform: `rotate(${(i % 3 - 1) * 5}deg)`}}>FIQUEI UMA SEMANA SEM CELULAR<div style={{fontSize: 36, marginTop: 4}}>❤️ 📱</div></div>
      ) : null) : null}
      {frame >= 80 ? <Person {...ME} x={540} y={1500} scale={1.1} emotion={frame < 220 ? 'worried' : 'smirk'} lookY={0.3} bob /> : null}
      <Pop at={80} /><Pop at={220} /><Sting at={220} volume={0.35} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => (
  <AbsoluteFill style={{background: '#192a56'}}>
    <Title text="VOCÊ AGUENTARIA UMA SEMANA SEM CELULAR?" color="#fff" top={100} size={64} />
    <SimNao top={620} />
    <Person {...ME} x={300} y={1300} scale={1.5} emotion="worried" lookX={1} />
    <Person {...PAI} x={780} y={1300} scale={1.5} emotion="happy" lookX={-1} />
    <Stamp x={540} y={540} text="PARTE 2: PROIBIRAM OUTRA COISA" at={20} color="#fed330" size={38} rot={-4} />
    <Handle top={1470} />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook, fato: Fato, onibus: Onibus, banco: Banco, mapa: Mapa, orelhao: Orelhao, pai: Pai,
  emergencia: Emergencia, fila: Fila, seta: Seta, dia7: Dia7, cta: Cta,
};
