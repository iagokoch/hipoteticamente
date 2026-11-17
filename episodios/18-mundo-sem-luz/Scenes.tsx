import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Person, PersonProps} from './Person';
import {INK, ME, Pop, Sting, Floor, Title, Room, Flash} from './lib';
import {Stamp, Bubble, Big, DayTag, SimNao, Handle, FONT, clamp} from './ui';

// Ep. 18 = tema #8 do banco (versão mundo): o mundo ficou 7 dias sem luz. Sem fato, só história (regra de 16/11/2026).
const SEU_A: Partial<PersonProps> = {skin: '#e8c4a0', hair: 'bald', hairColor: '#f5f6fa', mustache: true, shirt: '#6ab04c', pants: '#576574'};
const SINDICO: Partial<PersonProps> = {skin: '#f5cba7', hair: 'bald', mustache: true, suit: true, tie: '#e84118', shirt: '#2f3542'};
const P1: Partial<PersonProps> = {skin: '#f2c29b', hair: 'spiky', hairColor: '#2d3436', shirt: '#6c5ce7', pants: '#2d3436'};
const P2: Partial<PersonProps> = {skin: '#8d5524', hair: 'short', hairColor: '#1e1e1e', shirt: '#0984e3', pants: '#636e72', hat: 'cap', hatColor: '#fdcb6e'};
const P3: Partial<PersonProps> = {skin: '#d1a074', hair: 'long', hairColor: '#6c3b2a', shirt: '#00b894', pants: '#2d3436'};
const DONA: Partial<PersonProps> = {skin: '#c68642', hair: 'bun', hairColor: '#2d3436', shirt: '#e84393', pants: '#2d3436'};

// escuridão com um círculo de luz (vela, lamparina, churrasqueira)
const Dark: React.FC<{x: number; y: number; r?: number; a?: number}> = ({x, y, r = 560, a = 0.8}) => {
  const frame = useCurrentFrame();
  const al = a + Math.sin(frame / 5) * 0.03;
  return <AbsoluteFill style={{background: `radial-gradient(circle at ${x}px ${y}px, rgba(0,0,0,0) 0px, rgba(0,0,0,0) ${r * 0.3}px, rgba(8,8,30,${al}) ${r}px)`, pointerEvents: 'none'}} />;
};

const Corridor: React.FC<{wall?: string; floor?: string}> = ({wall = '#b2bec3', floor = '#7f8c8d'}) => (
  <AbsoluteFill>
    <Room wall={wall} floor={floor} />
    {[0, 1, 2].map((i) => (
      <div key={i} style={{position: 'absolute', left: 60 + i * 340, top: 420, width: 240, height: 760, background: '#a1887f', border: `9px solid ${INK}`, borderRadius: 12}}>
        <div style={{position: 'absolute', right: 26, top: 380, width: 28, height: 28, borderRadius: 14, background: '#fed330', border: `5px solid ${INK}`}} />
        <div style={{position: 'absolute', left: 70, top: 60, width: 100, height: 60, background: '#dfe6e9', border: `5px solid ${INK}`, borderRadius: 8, fontFamily: FONT, fontWeight: 900, fontSize: 36, color: INK, textAlign: 'center', lineHeight: '52px'}}>{301 + i}</div>
      </div>
    ))}
  </AbsoluteFill>
);

const Candle: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const frame = useCurrentFrame();
  return <div style={{position: 'absolute', left: x, top: y + Math.sin(frame / 4) * 3, fontSize: 90 * s, transform: 'translate(-50%,0)'}}>🕯️</div>;
};

const Building: React.FC<{lit: (i: number) => boolean; top?: number}> = ({lit, top = 380}) => (
  <div style={{position: 'absolute', left: 140, top, width: 800, height: 900, background: '#636e72', border: `9px solid ${INK}`, borderRadius: 12}}>
    {Array.from({length: 24}).map((_, i) => (
      <div key={i} style={{position: 'absolute', left: 40 + (i % 4) * 185, top: 50 + Math.floor(i / 4) * 140, width: 120, height: 90, background: lit(i) ? '#fed330' : '#1e272e', border: `6px solid ${INK}`, borderRadius: 8}} />
    ))}
  </div>
);

// s01
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const city = frame >= 100;
  return (
    <AbsoluteFill>
      {!city ? (
        <>
          <Room wall="#dfe6e9" floor="#b2967d" />
          <div style={{position: 'absolute', left: 760, top: 700, width: 120, height: 190, background: '#fff', border: `8px solid ${INK}`, borderRadius: 12}}>
            <div style={{position: 'absolute', left: 30, top: frame < 30 ? 30 : 100, width: 54, height: 60, background: '#b2bec3', border: `6px solid ${INK}`, borderRadius: 8}} />
          </div>
          <Person {...ME} x={300} y={1450} scale={1.5} emotion={frame < 50 ? 'neutral' : 'worried'} lookX={1} />
          {frame >= 36 ? <Stamp x={540} y={420} text="NADA." at={36} color="#2f3542" size={80} rot={-3} /> : null}
          <Dark x={540} y={900} r={900} a={frame < 30 ? 0 : 0.55} />
        </>
      ) : (
        <>
          <AbsoluteFill style={{background: '#0b1026'}} />
          <div style={{position: 'absolute', left: 740, top: 180, width: 120, height: 120, borderRadius: 60, background: '#f5f6fa', border: `6px solid ${INK}`}} />
          {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: -20 + i * 230, top: 520 + (i % 2) * 130, width: 210, height: 900, background: '#1e2a4a', border: `7px solid ${INK}`}}>
            {Array.from({length: 8}).map((_, j) => <div key={j} style={{position: 'absolute', left: 30 + (j % 2) * 90, top: 40 + Math.floor(j / 2) * 120, width: 60, height: 70, background: '#141b33', border: `5px solid ${INK}`}} />)}
          </div>)}
          <Big x={300} y={300} e="🌍" s={0.9} at={100} />
          <Stamp x={540} y={900} text="7 DIAS SEM LUZ" at={110} color="#ff4757" size={72} rot={-3} />
        </>
      )}
      <Pop at={36} /><Pop at={110} /><Sting at={100} volume={0.4} />
    </AbsoluteFill>
  );
};

// s02
const Dia1: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#34495e" floor="#4b4b4b" />
      <DayTag text="DIA 1" />
      <div style={{position: 'absolute', left: 560, top: 1020, width: 360, height: 170, background: '#2d3436', border: `9px solid ${INK}`, borderRadius: 20}}>
        {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 40 + i * 100, top: -60 - Math.sin(frame / 4 + i) * 10, fontSize: 80}}>{['🍖', '🔥', '🌭'][i]}</div>)}
      </div>
      {[P1, P2, P3].map((p, i) => <Person key={i} {...p} x={150 + i * 230} y={1220} scale={0.9} emotion="happy" bob />)}
      <Person {...ME} x={900} y={1450} scale={1.3} emotion="worried" lookX={-1} />
      {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 120 + i * 300, top: 640 - ((frame * 2 + i * 50) % 160), fontSize: 90, opacity: 0.8}}>💧</div>)}
      <Big x={170} y={420} e="🧊" s={0.6} at={5} rot={Math.sin(frame / 8) * 6} />
      <Stamp x={540} y={330} text="NINGUÉM SABE O NOME DE NINGUÉM" at={80} color="#2f3542" size={40} rot={-3} />
      <Dark x={740} y={1100} r={760} a={0.6} />
      <Pop at={5} /><Pop at={80} />
    </AbsoluteFill>
  );
};

// s03
const Elevador: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#636e72" floor="#2d3436" />
      <DayTag text="DIA 2" />
      <div style={{position: 'absolute', left: 60, top: 380, width: 960, height: 800, background: '#b2bec3', border: `10px solid ${INK}`, borderRadius: 14}}>
        <div style={{position: 'absolute', left: 40, top: 40, width: 120, height: 60, background: '#2d3436', borderRadius: 8, fontFamily: FONT, fontWeight: 900, fontSize: 36, color: frame % 30 < 15 ? '#ff4757' : '#2d3436', textAlign: 'center', lineHeight: '60px'}}>7º</div>
      </div>
      <div style={{position: 'absolute', left: 820, top: 460, width: 80, height: 80, background: '#ff4757', border: `7px solid ${INK}`, borderRadius: 40, opacity: frame % 30 < 15 ? 1 : 0.3}} />
      <Person {...SINDICO} x={720} y={1450} scale={1.5} emotion="happy" talking lookX={-1} />
      <Person {...ME} x={280} y={1450} scale={1.5} emotion={frame < 60 ? 'worried' : 'scared'} lookX={1} />
      <Big x={170} y={560} e="📱" s={0.5} at={4} />
      <Stamp x={210} y={760} text="0%" at={4} color="#ff4757" size={46} rot={-6} />
      {frame >= 40 ? <Bubble x={720} y={520} w={600} size={42} text="A TAXA DO CONDOMÍNIO FUNCIONA ASSIM..." at={40} tail="center" /> : null}
      {frame >= 130 ? <Stamp x={540} y={1190} text="1 HORA DEPOIS" at={130} color="#6c5ce7" size={50} rot={-3} /> : null}
      <Dark x={540} y={900} r={900} a={0.5} />
      <Pop at={4} /><Pop at={40} /><Pop at={130} />
    </AbsoluteFill>
  );
};

// s04
const Batata: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room wall="#ffeaa7" floor="#cc8e35" />
      <DayTag text="DIA 3" />
      <Big x={220} y={780} e="🥔" s={0.9} at={5} rot={Math.sin(frame / 6) * 6} />
      <Big x={380} y={820} e="📱" s={0.6} at={5} />
      {frame % 24 < 8 ? <Big x={300} y={680} e="⚡" s={0.5} /> : null}
      <div style={{position: 'absolute', left: 620, top: 700, width: 360, height: 260, background: '#2d3436', border: `9px solid ${INK}`, borderRadius: 16}}>
        <div style={{position: 'absolute', inset: 18, background: '#636e72', borderRadius: 8, textAlign: 'center', fontSize: 110, lineHeight: '220px'}}>🙏</div>
      </div>
      {frame >= 100 ? <div style={{position: 'absolute', left: 120, top: 1010 + Math.sin(frame / 5) * 5, width: 400, height: 40, background: '#2d3436', border: `7px solid ${INK}`, borderRadius: 10}} /> : null}
      {frame >= 100 ? <Big x={320} y={900} e="🐦" s={1.0} at={100} rot={Math.sin(frame / 7) * 6} /> : null}
      <Person {...ME} x={820} y={1450} scale={1.4} emotion={frame < 100 ? 'smirk' : 'shocked'} lookX={-1} />
      <Person {...P1} x={200} y={1450} scale={1.2} emotion="worried" lookX={1} />
      {frame >= 100 ? <Stamp x={540} y={330} text="O POMBO MUDOU PRO SEU FOGÃO" at={100} color="#6c5ce7" size={42} rot={-3} /> : null}
      <Pop at={5} /><Pop at={100} />
    </AbsoluteFill>
  );
};

// s05
const Aurelio: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame < 100 ? 'VELA É PRA DIVIDIR' : 'DOMINÓ É SAGRADO';
  return (
    <AbsoluteFill>
      <Corridor />
      <DayTag text="DIA 4" />
      {[P1, P2, P3].map((p, i) => <Person key={i} {...p} x={140 + i * 190} y={1250} scale={0.8} emotion="happy" lookX={1} />)}
      <Person {...SEU_A} x={720} y={1450} scale={1.6} emotion="happy" talking lookX={-0.3} />
      <Big x={520} y={1010} e="🏮" s={0.7} at={4} rot={Math.sin(frame / 6) * 6} />
      <Bubble x={720} y={headTopA()} w={520} size={52} text={t} at={frame < 100 ? 20 : 100} tail="center" />
      <Dark x={620} y={1000} r={720} a={0.8} />
      <Pop at={20} /><Pop at={100} />
    </AbsoluteFill>
  );
};
const headTopA = () => 1450 - 360 * 1.6 - 30;

// s06
const Festa: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Corridor wall="#a29bfe" floor="#6c5ce7" />
      <DayTag text="DIA 5" />
      <Candle x={540} y={1000} s={1.3} />
      <Person {...P1} x={150} y={1450} scale={1.2} emotion="happy" bob />
      <Person {...P2} x={380} y={1450} scale={1.2} emotion="happy" bob />
      <Person {...DONA} x={760} y={1450} scale={1.35} emotion="shocked" talking />
      <Person {...SEU_A} x={950} y={1450} scale={1.2} emotion="happy" />
      <Big x={170} y={760} e="🎸" s={0.7} rot={Math.sin(frame / 5) * 12} />
      <Big x={540} y={620} e="👻" s={0.7} rot={Math.sin(frame / 6) * 8} at={60} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: 600 + i * 90, top: 720 - ((frame * 3 + i * 40) % 220), fontSize: 80}}>{i % 2 ? '🎵' : '🎶'}</div>)}
      {frame >= 100 ? <Bubble x={760} y={headTopD()} w={420} size={56} text="AAAAAAAH!" at={100} tail="center" /> : null}
      <Dark x={540} y={1000} r={820} a={0.65} />
      <Pop at={60} /><Pop at={100} />
    </AbsoluteFill>
  );
};
const headTopD = () => 1450 - 360 * 1.35 - 30;

// s07
const Eleicao: React.FC = () => {
  const frame = useCurrentFrame();
  const votes = Math.min(3, Math.floor(frame / 45));
  return (
    <AbsoluteFill>
      <Corridor wall="#dfe6e9" floor="#b2967d" />
      <DayTag text="DIA 6" />
      <div style={{position: 'absolute', left: 380, top: 900, width: 320, height: 260, background: '#d2a679', border: `9px solid ${INK}`, borderRadius: 14, fontFamily: FONT, fontWeight: 900, fontSize: 60, color: INK, textAlign: 'center', lineHeight: '260px'}}>URNA</div>
      <Candle x={300} y={820} /><Candle x={790} y={820} />
      <Person {...SINDICO} x={170} y={1450} scale={1.3} emotion="worried" />
      <Big x={880} y={880} e="🐦" s={1.2} rot={Math.sin(frame / 7) * 6} />
      <Stamp x={880} y={860} text="CANDIDATO" at={10} color="#6c5ce7" size={36} rot={-6} />
      <Stamp x={540} y={330} text={`POMBO ${votes} × SÍNDICO 0`} at={0} color="#2f3542" size={56} rot={-3} />
      {frame >= 150 ? <Stamp x={540} y={560} text="E UMA LAMPARINA" at={150} color="#fed330" size={50} rot={3} /> : null}
      <Person {...ME} x={540} y={1450} scale={1.3} emotion="smirk" lookX={0.4} />
      <Dark x={540} y={1000} r={900} a={0.55} />
      <Pop at={0} /><Pop at={45} /><Pop at={90} /><Pop at={135} /><Pop at={150} />
    </AbsoluteFill>
  );
};

// s08
const Acende: React.FC = () => {
  const frame = useCurrentFrame();
  const on = frame >= 50;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: on ? '#74b9ff' : '#0b1026'}} />
      <DayTag text="DIA 7 · 18H" />
      <Building lit={(i) => on && i >= 0} />
      {on ? [0, 1, 2, 3, 4, 5].map((i) => <Big key={i} x={160 + i * 160} y={250 + (i % 2) * 40} e="🎉" s={0.5} at={50 + i * 4} rot={Math.sin(frame / 5 + i) * 15} />) : null}
      {frame >= 120 ? [0, 1, 2, 3].map((i) => {
        const x = interpolate(frame, [120, 200], [200 + i * 220, 540], clamp);
        return <div key={i} style={{position: 'absolute', left: x, top: 1200, fontSize: 80, opacity: interpolate(frame, [170, 200], [1, 0], clamp)}}>🏃</div>;
      }) : null}
      {frame >= 120 ? <Stamp x={540} y={330} text="CADA UM CORRE PRO SEU APÊ" at={120} color="#ff4757" size={46} rot={-3} /> : null}
      <Flash at={50} len={10} />
      <Pop at={50} /><Sting at={50} volume={0.4} /><Pop at={120} />
    </AbsoluteFill>
  );
};

// s09
const Vazio: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Corridor wall="#dfe6e9" floor="#b2967d" />
      <div style={{position: 'absolute', left: 540, top: 330, width: 560, height: 24, transform: 'translateX(-50%)', background: '#fffbe0', border: `6px solid ${INK}`, borderRadius: 12, opacity: frame % 6 < 3 ? 1 : 0.85}} />
      <Person {...ME} x={540} y={1450} scale={1.4} emotion="sad" lookX={0.5} />
      <div style={{position: 'absolute', left: 740, top: 1000, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: '#636e72', opacity: 0.4 + Math.sin(frame / 3) * 0.3}}>ZZZZZZ…</div>
      <Stamp x={540} y={560} text="TODO MUNDO TRANCADO" at={50} color="#2f3542" size={50} rot={-3} />
      <Pop at={50} />
    </AbsoluteFill>
  );
};

// s10
const Bate: React.FC = () => {
  const frame = useCurrentFrame();
  const open = frame >= 110;
  return (
    <AbsoluteFill>
      <Room wall="#dfe6e9" floor="#b2967d" />
      <div style={{position: 'absolute', left: 560, top: 360, width: 360, height: 850, background: open ? '#f6e58d' : '#a1887f', border: `10px solid ${INK}`, borderRadius: 14}}>
        {!open ? <div style={{position: 'absolute', right: 30, top: 400, width: 30, height: 30, borderRadius: 15, background: '#fed330', border: `5px solid ${INK}`}} /> : null}
      </div>
      {open ? <Person {...SEU_A} x={740} y={1220} scale={1.3} emotion="happy" talking lookX={-1} /> : null}
      <div style={{position: 'absolute', left: 150, top: 1000, width: 130, height: 70, background: '#fff', border: `7px solid ${INK}`, borderRadius: 10, transform: `rotate(${Math.sin(frame / 5) * 4}deg)`}}>
        <div style={{position: 'absolute', left: 62, top: 0, width: 6, height: 56, background: INK}} />
        {[[16, 14], [30, 14], [16, 36], [30, 36], [82, 14], [96, 36]].map(([x, y], i) => <div key={i} style={{position: 'absolute', left: x, top: y, width: 10, height: 10, borderRadius: 5, background: INK}} />)}
      </div>
      <Person {...ME} x={330} y={1450} scale={1.4} emotion={open ? 'happy' : 'worried'} lookX={1} />
      {frame >= 50 && frame < 110 ? <Stamp x={700} y={300} text="TOC TOC" at={50} color="#2f3542" size={64} rot={-4} /> : null}
      {open ? <Bubble x={740} y={headTopB()} w={400} size={60} text="DEMOROU." at={110} tail="center" /> : null}
      <Pop at={50} /><Pop at={110} />
    </AbsoluteFill>
  );
};
const headTopB = () => 1220 - 360 * 1.3 - 30;

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#192a56'}}>
      <Title text="SE A LUZ VOLTASSE HOJE, VOCÊ FICARIA MAIS UMA NOITE NO ESCURO COM SEUS VIZINHOS?" color="#fff" top={70} size={44} />
      <SimNao top={660} />
      <Person {...ME} x={300} y={1320} scale={1.5} emotion="worried" lookX={1} />
      <Person {...SEU_A} x={780} y={1320} scale={1.5} emotion="happy" lookX={-1} />
      <Stamp x={540} y={580} text="PARTE 2: SÓ NO PRÉDIO AO LADO" at={20} color="#fed330" size={34} rot={-4} />
      <Big x={540} y={830} e="💡" s={0.5} at={30} rot={Math.sin(frame / 7) * 6} />
      <Handle top={1470} />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook, dia1: Dia1, elevador: Elevador, batata: Batata, aurelio: Aurelio, festa: Festa, eleicao: Eleicao,
  acende: Acende, vazio: Vazio, bate: Bate, cta: Cta,
};
