#!/usr/bin/env bash
# Baixa o modelo de voz Kokoro (GitHub releases; o Hugging Face costuma estar bloqueado)
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)/models"
mkdir -p "$DIR"
BASE=https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0
[ -f "$DIR/kokoro-v1.0.onnx" ] || curl -sSL -o "$DIR/kokoro-v1.0.onnx" "$BASE/kokoro-v1.0.onnx"
[ -f "$DIR/voices-v1.0.bin" ] || curl -sSL -o "$DIR/voices-v1.0.bin" "$BASE/voices-v1.0.bin"
echo "modelos em $DIR"
