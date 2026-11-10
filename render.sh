#!/usr/bin/env bash
# Uso: ./render.sh episodios/NN-nome   (a pasta precisa ter script.json e Scenes.tsx)
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
EP="$(cd "$1" && pwd)"; NAME="$(basename "$EP")"
CHROME="$(command -v google-chrome || command -v chromium || command -v chromium-browser)"
cp "$EP/script.json" "$ROOT/video/script.json"
cp "$EP/Scenes.tsx" "$ROOT/video/src/Scenes.tsx"
python3 "$ROOT/tts/gen.py" "$ROOT/video/script.json" "$ROOT/video/public/audio"
python3 "$ROOT/tts/sfx.py" "$ROOT/video/public/audio"
cd "$ROOT/video" && mkdir -p out
npx remotion render src/index.ts Episodio out/raw.mp4 --browser-executable="$CHROME" --concurrency=2 --codec=h264 --crf=18 --log=error
ffmpeg -v error -y -i out/raw.mp4 -c:v copy -af loudnorm=I=-14:TP=-1:LRA=11 -c:a aac -b:a 192k "out/$NAME.mp4"
echo "pronto: video/out/$NAME.mp4"
