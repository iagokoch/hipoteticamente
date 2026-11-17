import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Person, PersonProps} from './Person';
import {INK, ME, Pop, Sting, Floor, Title, Room, Street, Flash} from './lib';
import {Stamp, Bubble, Big, DayTag, SimNao, Handle, FONT, clamp} from './ui';

// Ep. 17 = tema #12 do banco: tudo que você tocasse ganhasse vida por 1 minuto. Sem fato, só história (regra de 16/11/2026).
const AVO: Partial<PersonProps> = {skin: '#e8c4a0', hair: 'bald', hairColor: '#b2bec3', mustache: true, shirt: '#b2bec3', pants: '#576574'};

// rosto de objeto vivo (olhos + boca) sobre qualquer coisa
const Face: React.FC<{x: number; y: number; s?: number; talk?: boolean; mood?: 'happy' | 'sad' | 'angry' | 'shock'; look?: number}> = ({x, y, s = 1, talk, mood = 'happy', look = 0}) => {
  const frame = useCurrentFrame();
  const open = talk ? 6 + Math.abs(Math.sin(frame / 3)) * 18 : 4;
  const blink = frame % 90 < 4;
  const eye = (dx: number) => (
    <div style={{position: 'absolute', left: dx * s - 22 * s, top: -22 * s, width: 44 * s, height: (blink ? 4 : 46) * s, borderRadius: 24 * s, background: '#fff', border: `${5 * s}px solid ${INK}`}}>
      {blink ? null : <div style={{position: 'absolute', left: (14 + look * 8) * s, top: 14 * s, width: 14 * s, height: 14 * s, borderRadius: '50%', background: INK}} />}
    </div>
  );
  const browY = mood === 'angry' ? -30 : mood === 'sad' ? -38 : -34;
  const browRot = mood === 'angry' ? 18 : mood === 'sad' ? -16 : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0}}>
      {eye(-34)}{eye(34)}
      {mood !== 'happy' ? (
        <>
          <div style={{position: 'absolute', left: (-34 - 24) * s, top: browY * s - 22 * s, width: 48 * s, height: 8 * s, background: INK, transform: `rotate(${browRot}deg)`}} />
          <div style={{position: 'absolute', left: (34 - 24) * s, top: browY * s - 22 * s, width: 48 * s, height: 8 * s, background: INK, transform: `rotate(${-browRot}deg)`}} />
        </>
      ) : null}
      <div style={{position: 'absolute', left: -26 * s, top: 46 * s, width: 52 * s, height: open * s, borderRadius: mood === 'sad' && !talk ? `${30 * s}px ${30 * s}px 0 0` : 20 * s, background: talk ? '#c0392b' : 'transparent', border: `${5 * s}px solid ${INK}`, borderTop: talk ? `${5 * s}px solid ${INK}` : undefined}} />
    </div>
  );
};

// objeto genérico: caixa colorida com rosto
const Thing: React.FC<{x: number; y: number; w: number; h: number; color: string; radius?: number; talk?: boolean; mood?: 'happy' | 'sad' | 'angry' | 'shock'; faceY?: number; fs?: number; wobble?: number; children?: React.ReactNode; at?: number}> = ({x, y, w, h, color, radius = 30, talk, mood, faceY, fs = 1, wobble = 0, children, at = 0}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const rot = wobble ? Math.sin(frame / 4) * wobble : 0;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h, transform: `rotate(${rot}deg)`, transformOrigin: '50% 100%'}}>
      <div style={{position: 'absolute', inset: 0, background: color, border: `9px solid ${INK}`, borderRadius: radius, boxShadow: `0 10px 0 ${INK}`}} />
      {children}
      <Face x={w / 2} y={faceY ?? h * 0.35} s={fs} talk={talk} mood={mood} />
    </div>
  );
};

const Timer: React.FC<{t: string; red?: boolean}> = ({t, red}) => <Stamp x={540} y={150} text={`⏱ ${t}`} at={0} color={red ? '#ff4757' : '#2f3542'} size={66} rot={-3} />;

const Wall: React.FC<{wall: string; floor: string}> = ({wall, floor}) => <Room wall={wall} floor={floor} />;

// s01
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Wall wall="#a29bfe" floor="#6c5ce7" />
      <Timer t="1:00" />
      <Person {...ME} x={230} y={1450} scale={1.5} emotion={frame < 40 ? 'neutral' : 'shocked'} lookX={1} />
      <Thing x={780} y={1150} w={330} h={330} color="#ff6b6b" radius={165} talk={frame >= 40} mood="sad" faceY={120} wobble={frame >= 40 ? 4 : 0}>
        <div style={{position: 'absolute', left: 45, top: -60, width: 90, height: 90, borderRadius: '50%', background: '#fed330', border: `8px solid ${INK}`}} />
        <div style={{position: 'absolute', left: 195, top: -60, width: 90, height: 90, borderRadius: '50%', background: '#fed330', border: `8px solid ${INK}`}} />
        <div style={{position: 'absolute', left: 40, top: 40, right: 40, bottom: 40, borderRadius: '50%', background: '#fff', border: `7px solid ${INK}`, zIndex: -1}} />
      </Thing>
      {frame >= 40 ? <Bubble x={760} y={640} w={560} size={48} text="SÓ MAIS CINCO MINUTINHOS" at={40} tail="center" /> : null}
      <Stamp x={540} y={330} text="TUDO QUE VOCÊ TOCA GANHA VIDA" at={110} color="#ff4757" size={46} rot={-3} />
      <Pop at={40} /><Pop at={110} /><Sting at={110} volume={0.4} />
    </AbsoluteFill>
  );
};

// s02
const Cozinha: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Wall wall="#ffeaa7" floor="#cc8e35" />
      <Timer t="0:50" />
      <Thing x={260} y={1000} w={360} h={230} color="#b2bec3" radius={40} talk={frame >= 20 && frame < 100} mood="sad" faceY={80} fs={0.8}>
        <div style={{position: 'absolute', left: 50, top: -14, width: 100, height: 26, background: INK, borderRadius: 8}} />
        <div style={{position: 'absolute', left: 210, top: -14, width: 100, height: 26, background: INK, borderRadius: 8}} />
      </Thing>
      <Thing x={830} y={1230} w={330} h={720} color="#f5f6fa" radius={28} talk={frame >= 100} mood="angry" faceY={150} fs={1}>
        <div style={{position: 'absolute', left: 20, top: 300, right: 20, height: 9, background: INK}} />
        <div style={{position: 'absolute', right: 28, top: 70, width: 14, height: 140, background: INK, borderRadius: 7}} />
      </Thing>
      <Person {...ME} x={540} y={1450} scale={1.4} emotion={frame < 100 ? 'worried' : 'shocked'} lookX={frame < 100 ? -1 : 1} />
      {frame < 100 ? <Bubble x={260} y={650} w={500} size={44} text="EU NUNCA FIZ UM PÃO DOURADO" at={20} tail="center" /> : <Bubble x={780} y={420} w={520} size={46} text="FECHA A PORTA, TÁ FRIO!" at={100} tail="center" />}
      {frame >= 20 && frame < 100 ? <Big x={260} y={640} e="🍞" s={0.5} at={20} /> : null}
      <Pop at={20} /><Pop at={100} />
    </AbsoluteFill>
  );
};

// s03
const Banheiro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Wall wall="#81ecec" floor="#00cec9" />
      <Timer t="0:42" />
      <Thing x={760} y={800} w={300} h={170} color="#dfe6e9" radius={85} talk={frame < 100} mood="angry" faceY={60} fs={0.7}>
        <div style={{position: 'absolute', left: 120, top: -190, width: 60, height: 190, background: '#b2bec3', border: `8px solid ${INK}`}} />
      </Thing>
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 670 + i * 38, top: 820 + ((frame * 6 + i * 40) % 380), fontSize: 50, opacity: 0.9}}>💧</div>)}
      <Thing x={220} y={1100} w={120} h={380} color="#74b9ff" radius={50} talk={frame >= 100} mood="shock" faceY={110} fs={0.6}>
        <div style={{position: 'absolute', left: 10, top: -50, right: 10, height: 60, background: '#fff', border: `7px solid ${INK}`, borderRadius: 14}} />
      </Thing>
      <Person {...ME} x={540} y={1450} scale={1.4} emotion={frame < 100 ? 'worried' : 'scared'} lookX={frame < 100 ? 1 : -1} />
      {frame < 100 ? <Bubble x={720} y={470} w={560} size={44} text="SUA CANTORIA É HORRÍVEL" at={12} tail="center" /> : <Bubble x={330} y={500} w={540} size={42} text="EU SEI O QUE VOCÊ FEZ ONTEM" at={100} tail="center" />}
      <Pop at={12} /><Pop at={100} /><Sting at={100} volume={0.3} />
    </AbsoluteFill>
  );
};

// s04
const Onibus: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Street />
      <Timer t="0:35" />
      <Thing x={640} y={1150} w={760} h={400} color="#feca57" radius={50} talk={frame >= 30} mood="sad" faceY={130} fs={1.1} wobble={frame >= 30 ? 1.5 : 0}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: 30 + i * 180, top: 30, width: 130, height: 90, background: '#dff9fb', border: `7px solid ${INK}`, borderRadius: 10, textAlign: 'center', fontSize: 62, lineHeight: '84px'}}>{['😐', '😟', '😠', '😭'][i]}</div>)}
        <div style={{position: 'absolute', left: 80, bottom: -50, width: 110, height: 110, borderRadius: '50%', background: '#2d3436', border: `9px solid ${INK}`}} />
        <div style={{position: 'absolute', right: 80, bottom: -50, width: 110, height: 110, borderRadius: '50%', background: '#2d3436', border: `9px solid ${INK}`}} />
      </Thing>
      <Person {...ME} x={120} y={1450} scale={1.3} emotion="shocked" lookX={1} />
      {frame >= 30 ? <Bubble x={640} y={580} w={600} size={46} text="HOJE EU NÃO VOU PRO CENTRO" at={30} tail="center" /> : null}
      {frame >= 110 ? <Stamp x={540} y={330} text="40 PASSAGEIROS PRESOS" at={110} color="#ff4757" size={54} rot={-3} /> : null}
      <Pop at={30} /><Pop at={110} />
    </AbsoluteFill>
  );
};

// s05
const Rua: React.FC = () => {
  const frame = useCurrentFrame();
  const run = interpolate(frame, [0, 200], [150, 560], clamp);
  return (
    <AbsoluteFill>
      <Street />
      <Timer t="0:25" />
      <Thing x={170} y={1180} w={120} h={640} color="#636e72" radius={30} talk={frame >= 6 && frame < 100} mood="happy" faceY={110} fs={0.6}>
        <div style={{position: 'absolute', left: 10, top: -40, width: 150, height: 40, background: '#fed330', border: `7px solid ${INK}`, borderRadius: 14}} />
      </Thing>
      <Thing x={890} y={1180} w={190} h={560} color="#2d3436" radius={30} talk={frame >= 100} mood="angry" faceY={380} fs={0.8}>
        {['#ff4757', '#fed330', '#20bf6b'].map((c, i) => <div key={i} style={{position: 'absolute', left: 45, top: 30 + i * 100, width: 80, height: 80, borderRadius: '50%', background: c, border: `6px solid ${INK}`, opacity: i === 2 ? 1 : 0.25}} />)}
      </Thing>
      <Person {...ME} x={run} y={1450} scale={1.3} emotion="scared" lookX={1} />
      {frame < 100 ? <Bubble x={250} y={430} w={480} size={40} text="TEM FOFOCA NO BAIRRO INTEIRO!" at={6} tail="left" /> : <Bubble x={780} y={420} w={460} size={42} text="CANSEI DO VERMELHO" at={100} tail="right" />}
      <Pop at={6} /><Pop at={100} />
    </AbsoluteFill>
  );
};

const Sala: React.FC<{clock?: boolean}> = ({clock = true}) => (
  <AbsoluteFill>
    <Wall wall="#fab1a0" floor="#b8860b" />
    <div style={{position: 'absolute', left: 60, top: 760, width: 420, height: 280, background: '#a29bfe', border: `9px solid ${INK}`, borderRadius: 30}} />
    {clock ? null : null}
  </AbsoluteFill>
);

const WallClock: React.FC<{x: number; y: number; r: number; talk?: boolean; alive?: boolean; mood?: 'happy' | 'sad' | 'angry' | 'shock'; fs?: number}> = ({x, y, r, talk, alive = true, mood = 'happy', fs = 1}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: '#fff', border: `${r * 0.1}px solid #6f4e37`, boxShadow: `0 10px 0 ${INK}, 0 0 0 9px ${INK}`}}>
      <div style={{position: 'absolute', left: r - 6, width: 12, height: r * 0.7, background: INK, borderRadius: 6, transformOrigin: '50% 100%', transform: `rotate(${frame * 6}deg)`, top: r * 0.25}} />
      <div style={{position: 'absolute', left: r - 7, top: r * 0.5, width: 14, height: r * 0.5, background: INK, borderRadius: 7, transformOrigin: '50% 100%', transform: 'rotate(180deg)'}} />
      {alive ? <Face x={r} y={r * 0.95} s={fs} talk={talk} mood={mood} /> : null}
    </div>
  );
};

// s06
const Casa: React.FC = () => {
  const frame = useCurrentFrame();
  const run = interpolate(frame, [0, 90], [-120, 540], clamp);
  return (
    <AbsoluteFill>
      <Sala />
      <Timer t="0:20" red />
      <WallClock x={800} y={560} r={150} alive={false} />
      <Person {...AVO} x={270} y={1180} scale={1.1} emotion="neutral" lookX={1} />
      <Person {...ME} x={run} y={1450} scale={1.4} emotion="scared" lookX={1} />
      <Stamp x={540} y={330} text="CASA DO VOVÔ" at={20} color="#6c5ce7" size={58} rot={-3} />
      {frame >= 130 ? <Flash at={130} /> : null}
      <Pop at={20} /><Pop at={130} />
    </AbsoluteFill>
  );
};

// s07
const Relogio: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame < 90 ? 'TODA TARDE, ÀS SEIS, ELE PARA TUDO E OLHA PRA PORTA' : 'ELE ESPERA VOCÊ CHEGAR';
  return (
    <AbsoluteFill>
      <Sala />
      <Timer t={frame < 90 ? '0:15' : '0:12'} red />
      <WallClock x={540} y={760} r={230} talk mood="happy" fs={1.5} />
      <Bubble x={540} y={430} w={760} size={46} text={t} at={frame < 90 ? 10 : 90} tail="center" />
      <Person {...AVO} x={200} y={1450} scale={1.2} emotion={frame < 90 ? 'neutral' : 'worried'} lookX={1} />
      <Person {...ME} x={880} y={1450} scale={1.2} emotion="happy" lookX={-1} />
      <Pop at={10} /><Pop at={90} />
    </AbsoluteFill>
  );
};

// s08
const Avo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Sala />
      <Timer t="0:08" red />
      <WallClock x={800} y={560} r={150} talk={frame >= 100} mood="happy" fs={1} />
      <Person {...AVO} skin="#ff7675" x={480} y={1450} scale={1.6} emotion={frame < 60 ? 'shocked' : 'worried'} lookX={0.4} talking={frame >= 60} />
      <Person {...ME} x={150} y={1450} scale={1.3} emotion="smirk" lookX={1} />
      {frame >= 60 && frame < 130 ? <Bubble x={500} y={headTopAvo()} w={420} size={52} text="É SÓ O VENTO!" at={60} tail="center" /> : null}
      {frame >= 130 ? <Bubble x={780} y={330} w={460} size={46} text="NÃO É NÃO, VOVÔ" at={130} tail="center" /> : null}
      <Pop at={60} /><Pop at={130} />
    </AbsoluteFill>
  );
};
const headTopAvo = () => 1450 - 360 * 1.6 - 30;

// s09
const Bala: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Sala />
      <Timer t="0:05" red />
      <div style={{position: 'absolute', left: 620, top: 560, width: 380, height: 400, background: '#d2a679', border: `9px solid ${INK}`, borderRadius: 14}}>
        <div style={{position: 'absolute', left: 0, top: 200, right: 0, height: 9, background: INK}} />
        {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: 30 + i * 85, top: 130, fontSize: 70}}>🍬</div>)}
      </div>
      <WallClock x={250} y={560} r={150} talk mood="sad" fs={1} />
      <Bubble x={300} y={400} w={600} size={42} text="ELE TROCA A BALA DE COCO TODO MÊS PRA ELA NUNCA VENCER" at={10} tail="center" />
      <Person {...AVO} x={820} y={1450} scale={1.4} emotion="sad" lookX={-1} />
      <Person {...ME} x={300} y={1450} scale={1.4} emotion="shocked" lookX={1} />
      {frame >= 100 ? <Big x={540} y={680} e="❤️" s={0.7} at={100} rot={Math.sin(frame / 6) * 8} /> : null}
      <Pop at={10} /><Pop at={100} />
    </AbsoluteFill>
  );
};

// s10
const Fim: React.FC = () => {
  const frame = useCurrentFrame();
  const off = frame >= 40;
  return (
    <AbsoluteFill>
      <Sala />
      <Timer t="0:00" red />
      <WallClock x={800} y={560} r={150} alive={!off} mood="sad" />
      <Person {...AVO} x={300} y={1450} scale={1.5} emotion={frame < 100 ? 'neutral' : 'happy'} lookX={1} talking={frame >= 100} />
      <Person {...ME} x={780} y={1450} scale={1.5} emotion={frame < 100 ? 'neutral' : 'happy'} lookX={-1} />
      {frame >= 100 ? <Bubble x={320} y={headTopAvo() + 60} w={520} size={52} text="QUER BALA DE COCO?" at={100} tail="center" /> : null}
      <Flash at={40} />
      <Sting at={40} volume={0.35} /><Pop at={100} />
    </AbsoluteFill>
  );
};

// s11
const Sofa: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Wall wall="#fab1a0" floor="#b8860b" />
      <DayTag text="À NOITE" />
      <div style={{position: 'absolute', left: 80, top: 760, width: 920, height: 120, background: '#a29bfe', border: `9px solid ${INK}`, borderRadius: 30}} />
      <div style={{position: 'absolute', left: 300, top: 300, width: 480, height: 330, background: '#2d3436', border: `10px solid ${INK}`, borderRadius: 20}}>
        <div style={{position: 'absolute', inset: 14, background: frame % 20 < 10 ? '#dfe6e9' : '#b2bec3', borderRadius: 8, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, padding: 30}}>JORNAL</div>
      </div>
      <Person {...AVO} x={380} y={1150} scale={1.25} emotion="happy" lookY={-0.3} />
      <Person {...ME} x={700} y={1150} scale={1.25} emotion="happy" lookY={-0.3} />
      {frame >= 80 ? <Big x={900} y={420} e="❤️" s={0.6} at={80} rot={Math.sin(frame / 6) * 8} /> : null}
      <Pop at={80} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#192a56'}}>
      <Title text="VOCÊ TOCARIA NO RELÓGIO DO SEU AVÔ PRA DESCOBRIR O QUE ELE NUNCA DISSE?" color="#fff" top={80} size={48} />
      <SimNao top={640} />
      <Person {...ME} x={300} y={1320} scale={1.5} emotion="worried" lookX={1} />
      <Person {...AVO} x={780} y={1320} scale={1.5} emotion="neutral" lookX={-1} />
      <Stamp x={540} y={560} text="PARTE 2: O ESPELHO" at={20} color="#fed330" size={44} rot={-4} />
      <Big x={540} y={820} e="🪞" s={0.55} at={30} rot={Math.sin(frame / 7) * 6} />
      <Handle top={1470} />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook, cozinha: Cozinha, banheiro: Banheiro, onibus: Onibus, rua: Rua, casa: Casa, relogio: Relogio,
  avo: Avo, bala: Bala, fim: Fim, sofa: Sofa, cta: Cta,
};
