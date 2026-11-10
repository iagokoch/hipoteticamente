import React from 'react';
import {Composition} from 'remotion';
import {Video, TOTAL, FPS} from './Video';
import {Avatar} from './Avatar';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Episodio" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
    <Composition id="Avatar" component={Avatar} durationInFrames={1} fps={30} width={1080} height={1080} />
  </>
);
