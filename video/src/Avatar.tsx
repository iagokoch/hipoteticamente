import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Person} from './Person';

const INK = '#1b1b2f';
export const Avatar: React.FC = () => (
  <AbsoluteFill style={{background: '#273c75'}}>
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 42%, #4b6cb7 0%, #273c75 62%)'}} />
    {[[150, 230, 80], [880, 300, 110], [190, 760, 60], [900, 780, 70]].map(([x, y, s], i) => (
      <div key={i} style={{position: 'absolute', left: x, top: y, fontFamily: 'Inter', fontWeight: 900, fontSize: s, color: i % 2 ? '#fed330' : '#26de81', WebkitTextStroke: `${s / 9}px ${INK}`, paintOrder: 'stroke fill', transform: `rotate(${i % 2 ? 14 : -12}deg)`}}>?</div>
    ))}
    <Person x={540} y={1690} scale={4.3} skin="#f2c29b" hair="short" hairColor="#3d2b1f" shirt="#26de81" pants="#3867d6" emotion="smirk" lookX={0.6} lookY={-0.6} bob={false} enterAt={-60} />
  </AbsoluteFill>
);
