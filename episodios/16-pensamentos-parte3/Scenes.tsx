import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Person, PersonProps} from './Person';
import {INK, ME, Pop, Sting, Floor, Title, Room, Flash} from './lib';
import {Stamp, Bubble, Thought, Big, DayTag, SimNao, Handle, FONT, clamp, ease} from './ui';

// Ep. 16 = Parte 3 de "ouvir o pensamento de todo mundo": o chefe não consegue esconder nada.
// Regra de 16/11/2026: sem fato âncora, só história.
const BOSS: Partial<PersonProps> = {skin: '#f5cba7', hair: 'bald', mustache: true, suit: true, tie: '#e84118', shirt: '#2f3542'};
const DIR: Partial<PersonProps> = {skin: '#d1a074', hair: 'short', hairColor: '#b2bec3', suit: true, tie: '#0984e3', shirt: '#2d3436', shades: true};
const CLI: Partial<PersonProps> = {skin: '#d1a074', hair: 'short', hairColor: '#2d3436', mustache: true, suit: true, tie: '#6ab04c', hat: 'fedora', hatColor: '#2d3436', shirt: '#2d3436'};
const P1: Partial<PersonProps> = {skin: '#f2c29b', hair: 'spiky', hairColor: '#2d3436', shirt: '#6c5ce7', pants: '#2d3436'};
const P2: Partial<PersonProps> = {skin: '#8d5524', hair: 'short', hairColor: '#1e1e1e', shirt: '#0984e3', pants: '#636e72', hat: 'cap', hatColor: '#fdcb6e'};
const P3: Partial<PersonProps> = {skin: '#d1a074', hair: 'long', hairColor: '#6c3b2a', shirt: '#00b894', pants: '#2d3436'};
const COPEIRA: Partial<PersonProps> = {skin: '#c68642', hair: 'bun', hairColor: '#2d3436', shirt: '#a29bfe', pants: '#2d3436', apron: true};
const SEG: Partial<PersonProps> = {skin: '#8d5524', hair: 'short', hairColor: '#1e1e1e', hat: 'cap', hatColor: '#2d3436', shirt: '#2d3436', pants: '#2d3436'};

const YELLOW = '#ffeaa7';
const headTop = (feet: number, scale: number) => feet - 360 * scale;

const Office: React.FC<{night?: boolean}> = ({night}) => (
  <AbsoluteFill>
    <Room wall={night ? '#3d3d6b' : '#dfe6e9'} floor={night ? '#2c2c54' : '#b2967d'} />
    <div style={{position: 'absolute', left: 70, top: 250, width: 300, height: 260, background: night ? '#1e2a4a' : '#7ed6df', border: `9px solid ${INK}`, borderRadius: 14}}>
      <div style={{position: 'absolute', left: 141, top: 0, bottom: 0, width: 9, background: INK}} />
      {night ? <div style={{position: 'absolute', left: 190, top: 40, width: 60, height: 60, borderRadius: 30, background: '#f5f6fa', border: `5px solid ${INK}`}} /> : null}
    </div>
    <div style={{position: 'absolute', left: 740, top: 270, width: 260, height: 190, background: '#fff', border: `9px solid ${INK}`, borderRadius: 10}}>
      <div style={{position: 'absolute', left: 30, top: 40, width: 200, height: 14, background: '#a4b0be'}} />
      <div style={{position: 'absolute', left: 30, top: 80, width: 140, height: 14, background: '#a4b0be'}} />
      <div style={{position: 'absolute', left: 30, top: 120, width: 170, height: 14, background: '#a4b0be'}} />
    </div>
  </AbsoluteFill>
);

const Ears: React.FC<{color?: string}> = ({color = 'rgba(255,255,255,0.9)'}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {[0, 1, 2].map((i) => {
        const t = (frame * 3 + i * 40) % 120;
        return <div key={i} style={{position: 'absolute', left: 540, top: 980, width: 260 + t * 6, height: 260 + t * 6, transform: 'translate(-50%,-50%)', borderRadius: '50%', border: `8px solid ${color.replace('0.9', String(1 - t / 120))}`}} />;
      })}
    </>
  );
};

// s01
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Office />
      <DayTag text="PARTE 3" />
      <Ears />
      <Person {...BOSS} x={640} y={1450} scale={1.7} emotion={frame < 70 ? 'neutral' : 'worried'} talking={frame >= 20} lookX={-0.4} />
      <Person {...ME} x={190} y={1450} scale={1.3} emotion="shocked" lookX={1} />
      <Thought x={640} y={headTop(1450, 1.7) - 20} text="QUE FOME..." at={20} w={440} size={58} color={YELLOW} />
      <Big x={900} y={640} e="📢" s={0.9} rot={Math.sin(frame / 5) * 8} at={20} />
      <Stamp x={540} y={420} text="O CHEFE NÃO ESCONDE NADA" at={80} color="#ff4757" size={50} rot={-3} />
      <Pop at={20} /><Pop at={80} /><Sting at={80} volume={0.4} />
    </AbsoluteFill>
  );
};

// s02
const Reuniao: React.FC = () => {
  const frame = useCurrentFrame();
  const line = frame < 55 ? 'BOM DIA, EQUIPE' : frame < 110 ? 'QUERO IR EMBORA' : 'TEM PÃO DE QUEIJO?';
  return (
    <AbsoluteFill>
      <Office />
      <DayTag text="SEGUNDA, 9H" />
      <div style={{position: 'absolute', left: 40, top: 1050, width: 1000, height: 50, background: '#6f4e37', border: `8px solid ${INK}`}} />
      <Person {...P1} x={150} y={1300} scale={1.0} emotion="neutral" lookX={1} />
      <Person {...P2} x={330} y={1300} scale={1.0} emotion="neutral" lookX={1} />
      <Person {...ME} x={510} y={1300} scale={1.0} emotion={frame < 55 ? 'neutral' : 'worried'} lookX={1} />
      <Person {...BOSS} x={850} y={1330} scale={1.4} emotion={frame < 110 ? 'neutral' : 'happy'} talking lookX={-1} />
      {frame < 55 ? (
        <Bubble x={800} y={headTop(1330, 1.4) - 30} text={line} at={4} w={460} size={52} tail="center" />
      ) : (
        <Thought x={760} y={headTop(1330, 1.4) - 20} text={line} at={frame < 110 ? 55 : 110} w={520} size={50} color={YELLOW} />
      )}
      {frame >= 110 ? <Big x={560} y={560} e="🧀" s={0.8} rot={Math.sin(frame / 6) * 10} at={110} /> : null}
      <Pop at={4} /><Pop at={55} /><Pop at={110} />
    </AbsoluteFill>
  );
};

// s03
const Diretor: React.FC = () => {
  const frame = useCurrentFrame();
  const frozen = frame >= 100;
  return (
    <AbsoluteFill>
      <Office />
      <Person {...P1} x={150} y={1320} scale={1.0} emotion={frozen ? 'scared' : 'neutral'} lookX={1} bob={!frozen} />
      <Person {...P3} x={330} y={1320} scale={1.0} emotion={frozen ? 'scared' : 'neutral'} lookX={1} bob={!frozen} />
      <Person {...DIR} x={940} y={1340} scale={1.35} emotion="neutral" lookX={-1} enterAt={6} />
      <Person {...BOSS} x={560} y={1380} scale={1.5} emotion={frame < 40 ? 'neutral' : 'shocked'} lookX={0.6} />
      <Thought x={470} y={headTop(1380, 1.5) - 10} text="EU NÃO FAÇO IDEIA DO QUE ESSA EMPRESA FAZ" at={40} w={640} size={44} color={YELLOW} />
      {frozen ? <Stamp x={540} y={330} text="SALA CONGELADA" at={100} color="#0984e3" size={60} rot={-3} /> : null}
      {frozen ? [0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 140 + i * 200, top: 520 + (i % 2) * 60, fontSize: 90}}>❄️</div>) : null}
      <Pop at={40} /><Pop at={100} /><Sting at={40} volume={0.4} />
    </AbsoluteFill>
  );
};

// s05
const Armario: React.FC = () => {
  const frame = useCurrentFrame();
  const shake = Math.sin(frame * 1.8) * 6;
  return (
    <AbsoluteFill>
      <Office />
      <div style={{position: 'absolute', left: 340, top: 520, width: 400, height: 760, background: '#b78b5a', border: `10px solid ${INK}`, borderRadius: 14, transform: `translateX(${shake}px)`}}>
        <div style={{position: 'absolute', left: 60, top: 40, width: 280, height: 70, background: '#fed330', border: `6px solid ${INK}`, borderRadius: 10, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: INK, textAlign: 'center', lineHeight: '70px'}}>LIMPEZA</div>
        <div style={{position: 'absolute', left: 300, top: 380, width: 40, height: 40, borderRadius: 20, background: '#2d3436', border: `5px solid ${INK}`}} />
        <div style={{position: 'absolute', left: 140, top: 160, width: 120, height: 36, background: '#2d3436', borderRadius: 8}} />
        <div style={{position: 'absolute', left: 140, top: 175, width: 120, height: 10, background: '#fff', opacity: 0.8}} />
      </div>
      <Thought x={540} y={450} text="MEU PEIXE SE CHAMA DOUTOR BIGODE" at={50} w={700} size={48} color={YELLOW} />
      <Big x={900} y={560} e="🐟" s={0.9} rot={Math.sin(frame / 6) * 10} at={60} />
      {[P1, P3].map((p, i) => <Person key={i} {...p} x={140 + i * 800} y={1450} scale={1.0} emotion={frame >= 50 ? 'shocked' : 'neutral'} lookX={i === 0 ? 1 : -1} />)}
      {frame >= 120 ? <Stamp x={540} y={260} text="O PRÉDIO INTEIRO OUVE" at={120} color="#ff4757" size={54} rot={-3} /> : null}
      <Pop at={50} /><Pop at={120} />
    </AbsoluteFill>
  );
};

// s06
const Cliente: React.FC = () => {
  const frame = useCurrentFrame();
  const happy = frame >= 100;
  return (
    <AbsoluteFill>
      <Office />
      <Person {...BOSS} x={170} y={1400} scale={1.4} emotion={frame < 70 ? 'smirk' : 'worried'} lookX={1} />
      <Person {...ME} x={520} y={1400} scale={1.4} emotion={frame < 70 ? 'worried' : 'happy'} lookX={1} talking={frame >= 70} />
      <Person {...CLI} x={880} y={1400} scale={1.4} emotion={happy ? 'happy' : 'neutral'} lookX={-1} />
      <Thought x={290} y={headTop(1400, 1.4) - 20} text="QUE HOMEM CHATO" at={10} w={440} size={50} color={YELLOW} />
      {frame >= 70 ? <Bubble x={700} y={headTop(1400, 1.4) - 200} text="ELE QUIS DIZER: ADOREI SUA GRAVATA!" at={70} w={480} size={44} tail="center" /> : null}
      <Pop at={10} /><Pop at={70} />
    </AbsoluteFill>
  );
};

// s07
const Gravata: React.FC = () => {
  const frame = useCurrentFrame();
  const fly = interpolate(frame, [90, 150], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Office />
      <Person {...ME} x={300} y={1400} scale={1.4} emotion="happy" lookX={1} bob />
      <Person {...CLI} x={800} y={1400} scale={1.4} emotion="happy" lookX={-1} talking={frame >= 90} />
      <Big x={540} y={620} e="📝" s={1.1} at={10} rot={-6} />
      {frame >= 40 ? <Stamp x={540} y={420} text="CONTRATO FECHADO" at={40} color="#20bf6b" size={60} rot={-3} /> : null}
      {frame >= 90 ? <Bubble x={780} y={headTop(1400, 1.4) - 30} text="TOMA, FICA COM A GRAVATA!" at={90} w={460} size={42} tail="center" /> : null}
      {frame >= 90 ? <div style={{position: 'absolute', left: 800 - fly * 450, top: 980 + fly * 60 - Math.sin(fly * Math.PI) * 90, fontSize: 130, transform: `rotate(${fly * 360}deg)`}}>👔</div> : null}
      <Pop at={10} /><Pop at={40} /><Pop at={90} />
    </AbsoluteFill>
  );
};

// s08
const Elogio: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Office />
      <Person {...BOSS} x={780} y={1400} scale={1.5} emotion={frame < 60 ? 'worried' : 'sad'} lookX={-1} />
      <Person {...ME} x={270} y={1400} scale={1.4} emotion={frame < 90 ? 'shocked' : 'happy'} lookX={1} />
      {[P1, P2, P3].map((p, i) => <Person key={i} {...p} x={130 + i * 210} y={1180} scale={0.6} emotion="happy" lookX={frame > 70 ? -0.2 + i * 0.1 : 1} />)}
      <Thought x={700} y={headTop(1400, 1.5) - 30} text="O CAIO É O MELHOR DA EMPRESA... MAS EU TENHO VERGONHA DE FALAR" at={8} w={640} size={42} color={YELLOW} />
      {frame >= 90 ? [0, 1, 2].map((i) => <Big key={i} x={150 + i * 120} y={760 - ((frame * 2 + i * 30) % 120)} e="⭐" s={0.4} at={90} />) : null}
      <Pop at={8} /><Sting at={8} volume={0.3} />
    </AbsoluteFill>
  );
};

// s09
const Aplauso: React.FC = () => {
  const frame = useCurrentFrame();
  const bird = interpolate(frame, [95, 135], [1300, 760], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Office />
      <Person {...BOSS} skin="#ff7675" x={560} y={1450} scale={1.5} emotion="worried" lookX={0.3} />
      <Person {...ME} x={190} y={1450} scale={1.3} emotion="happy" bob />
      <Person {...P1} x={100} y={1160} scale={0.6} emotion="happy" enterAt={10} />
      <Person {...COPEIRA} x={330} y={1160} scale={0.6} emotion="happy" enterAt={40} />
      <Person {...SEG} x={880} y={1160} scale={0.6} emotion="happy" enterAt={70} />
      {frame >= 10 ? [0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: 120 + i * 270, top: 760 - ((frame * 3 + i * 35) % 170), fontSize: 90}}>👏</div>) : null}
      {frame >= 95 ? <div style={{position: 'absolute', left: 840, top: bird, fontSize: 200, transform: `rotate(${Math.sin(frame / 4) * 10}deg)`}}>🐦</div> : null}
      {frame >= 120 ? <Stamp x={540} y={330} text="O POMBO TAMBÉM" at={120} color="#6c5ce7" size={58} rot={-3} /> : null}
      <Pop at={10} /><Pop at={40} /><Pop at={70} /><Pop at={120} />
    </AbsoluteFill>
  );
};

// s10
const Aquario: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Office />
      <div style={{position: 'absolute', left: 560, top: 800, width: 440, height: 320, background: '#74b9ff', border: `10px solid ${INK}`, borderRadius: 20, overflow: 'hidden'}}>
        {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 40 + ((frame * (2 + i) + i * 90) % 340), top: 40 + i * 90, fontSize: 80}}>{i === 1 ? '🐠' : '🐟'}</div>)}
      </div>
      <Person {...BOSS} x={260} y={1450} scale={1.5} emotion="scared" lookX={0.6} />
      <Person {...ME} x={820} y={1450} scale={1.3} emotion="shocked" lookX={-1} />
      <Thought x={330} y={headTop(1450, 1.5) - 20} text="E EU GASTEI A VERBA DO SEU AUMENTO NUM AQUÁRIO NOVO" at={10} w={620} size={40} color={YELLOW} />
      {frame >= 100 ? <Stamp x={540} y={330} text="SILÊNCIO TOTAL" at={100} color="#2f3542" size={64} rot={-3} /> : null}
      {frame >= 100 ? <Big x={880} y={560} e="🦗" s={0.6} at={110} rot={Math.sin(frame / 5) * 10} /> : null}
      <Pop at={10} /><Pop at={100} /><Sting at={100} volume={0.4} />
    </AbsoluteFill>
  );
};

// s11
const Pagar: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame < 70 ? 'PAGO O DOBRO! PAGO O TRIPLO!' : 'E VOCÊ BATIZA O PEIXE!';
  return (
    <AbsoluteFill>
      <Office />
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 80 + i * 210, top: 280 + ((frame * 5 + i * 70) % 700), fontSize: 90, transform: `rotate(${Math.sin(frame / 6 + i) * 20}deg)`}}>💰</div>)}
      <Person {...BOSS} x={260} y={1450} scale={1.5} emotion="scared" talking lookX={0.6} />
      <Person {...ME} x={820} y={1450} scale={1.3} emotion="happy" lookX={-1} bob />
      <Bubble x={300} y={headTop(1450, 1.5) - 30} text={t} at={frame < 70 ? 5 : 70} w={560} size={48} tail="center" />
      {frame >= 130 ? <Big x={820} y={700} e="🐠" s={1.1} at={130} /> : null}
      {frame >= 130 ? <Stamp x={820} y={640} text="CAIO" at={130} color="#fd79a8" size={56} rot={-5} /> : null}
      {frame >= 130 ? <Stamp x={540} y={330} text="O PEIXE VIROU CAIO" at={130} color="#20bf6b" size={52} rot={3} /> : null}
      <Pop at={5} /><Pop at={70} /><Pop at={130} />
    </AbsoluteFill>
  );
};

// s12
const Noite: React.FC = () => {
  const frame = useCurrentFrame();
  const relieved = frame >= 110;
  return (
    <AbsoluteFill>
      <Office night />
      <DayTag text="FIM DO DIA" />
      <Person {...BOSS} x={540} y={1450} scale={1.6} emotion={relieved ? 'happy' : 'neutral'} lookY={-0.2} />
      <Thought x={540} y={headTop(1450, 1.6) - 10} text="PELA PRIMEIRA VEZ EM ANOS, EU NÃO PRECISO FINGIR" at={10} w={720} size={42} color={YELLOW} />
      <Person {...ME} x={950} y={1000} scale={0.7} emotion="happy" lookX={-1} dim={0.1} />
      {relieved ? <Big x={250} y={400} e="❤️" s={0.9} at={110} rot={Math.sin(frame / 6) * 8} /> : null}
      <Pop at={10} /><Pop at={110} />
    </AbsoluteFill>
  );
};

// s13
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#192a56'}}>
      <Title text="VOCÊ TERIA CORAGEM DE DIZER TUDO QUE PENSA PRO SEU CHEFE?" color="#fff" top={90} size={54} />
      <SimNao top={620} />
      <Person {...ME} x={300} y={1300} scale={1.5} emotion="worried" lookX={1} />
      <Person {...BOSS} x={780} y={1300} scale={1.5} emotion="neutral" lookX={-1} />
      <Stamp x={540} y={540} text="PARTE 4: O POMBO" at={20} color="#fed330" size={44} rot={-4} />
      <Big x={950} y={330} e="🐦" s={0.6} rot={Math.sin(frame / 7) * 8} at={30} />
      <Handle top={1470} />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook, reuniao: Reuniao, diretor: Diretor, armario: Armario, cliente: Cliente, gravata: Gravata,
  elogio: Elogio, aplauso: Aplauso, aquario: Aquario, pagar: Pagar, noite: Noite, cta: Cta,
};
