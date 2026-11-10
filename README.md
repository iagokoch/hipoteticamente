# Hipoteticamente

Kit de produção do canal **Hipoteticamente** (@hipoteticamente.br): vídeos "E se você…?" em animação 2D, narrados em pt-BR, 1080x1920, custo zero.

- **Animação:** [Remotion](https://www.remotion.dev) (React). Personagens e cenários desenhados em SVG/CSS em `video/src/Person.tsx` e `Scenes.tsx`.
- **Voz:** [Kokoro](https://github.com/thewh1teagle/kokoro-onnx) offline, voz `pm_alex`, speed 1.08, pitch 0.89.
- **Trilha e efeitos:** sintetizados em `tts/` (sem direitos de terceiros).
- **Volume final:** -14 LUFS.

## Setup

```bash
cd video && npm install && cd ..
pip install kokoro-onnx soundfile    # --break-system-packages se precisar
./tts/setup_models.sh                # baixa o modelo de voz (~350 MB)
```

Precisa de Node 22+, Python 3, ffmpeg e Chrome/Chromium.

## Fazer um episódio

1. Crie `episodios/NN-nome/script.json` (cenas com `id`, `visual`, `text`) e `episodios/NN-nome/Scenes.tsx` (um componente por `visual`, exportados em `SCENES`). Use o episódio 01 como modelo.
2. `./render.sh episodios/NN-nome`
3. O vídeo sai em `video/out/NN-nome.mp4`.

Para conferir quadros antes do render: `cd video && npx remotion still src/index.ts Episodio teste.png --frame=120`.

Para conferir todas as cenas de uma vez (2 quadros por cena, um só bundle, ~1 min): `cd video && node stills.mjs out/stills` (precisa do `public/manifest.json` gerado pela narração).

Foto de perfil: composição `Avatar` (`npx remotion still src/index.ts Avatar perfil.png`).
