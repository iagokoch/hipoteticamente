// Uso: node stills.mjs [pastaSaida]  — renderiza 2 quadros por cena (meio e fim da fala) com um único bundle
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'fs';
import path from 'path';

const out = process.argv[2] || 'out/stills';
fs.mkdirSync(out, {recursive: true});
const manifest = JSON.parse(fs.readFileSync('public/manifest.json', 'utf8'));
const FPS = 30, GAP = 0.3, TAIL = 1.2;
let from = 0;
const frames = [];
manifest.scenes.forEach((s, i) => {
  const len = Math.ceil((s.duration + GAP + (i === manifest.scenes.length - 1 ? TAIL : 0)) * FPS);
  frames.push([`${s.id}a`, from + Math.round(len * 0.45)]);
  frames.push([`${s.id}b`, from + len - 4]);
  from += len;
});
const browserExecutable = process.env.CHROME || '/usr/bin/google-chrome';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'Episodio', browserExecutable});
for (const [name, frame] of frames) {
  await renderStill({serveUrl, composition, frame, output: `${out}/${name}.png`, browserExecutable, scale: 0.5});
}
console.log('ok', frames.length, 'total frames', from);
