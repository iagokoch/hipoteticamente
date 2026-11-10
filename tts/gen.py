import json, sys, os
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

script_path, out_dir = sys.argv[1], sys.argv[2]
os.makedirs(out_dir, exist_ok=True)
script = json.load(open(script_path, encoding="utf-8"))
MODELS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "models")
k = Kokoro(os.path.join(MODELS, "kokoro-v1.0.onnx"), os.path.join(MODELS, "voices-v1.0.bin"))

manifest = []
for sc in script["scenes"]:
    samples, sr = k.create(sc["text"], voice=script["voice"], speed=script["speed"], lang="pt-br")
    # trim leading/trailing silence
    idx = np.where(np.abs(samples) > 0.01)[0]
    if len(idx):
        samples = samples[max(0, idx[0] - int(0.03 * sr)): idx[-1] + int(0.08 * sr)]
    # light normalization
    samples = samples / (np.max(np.abs(samples)) + 1e-9) * 0.9
    path = os.path.join(out_dir, f"{sc['id']}.wav")
    sf.write(path + ".raw.wav", samples, sr)
    pitch = script.get("pitch", 1.0)
    os.system(f"ffmpeg -v error -y -i {path}.raw.wav -af asetrate={sr}*{pitch},aresample={sr},atempo={1/pitch:.4f} {path}")
    os.remove(path + ".raw.wav")
    samples, sr = sf.read(path)
    dur = len(samples) / sr
    manifest.append({**sc, "audio": f"audio/{sc['id']}.wav", "duration": round(dur, 3)})
    print(sc["id"], round(dur, 2))

# simple ambient pad (original, synthesized) for background
total = sum(m["duration"] + 0.35 for m in manifest) + 2.0
sr = 44100
t = np.arange(int(total * sr)) / sr
chords = [[220.0, 261.63, 329.63], [196.0, 246.94, 293.66], [174.61, 220.0, 261.63], [196.0, 246.94, 329.63]]
pad = np.zeros_like(t)
seg = 4.0
for i, ch in enumerate(chords * int(total // (seg * 4) + 1)):
    s, e = int(i * seg * sr), int((i + 1) * seg * sr)
    if s >= len(t):
        break
    e = min(e, len(t))
    tt = t[s:e]
    env = np.minimum(1, np.minimum((tt - tt[0]) / 1.0, (tt[-1] - tt + 1e-3) / 1.0))
    for f in ch:
        pad[s:e] += env * (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2 * tt)) / 3
# soft pulse
pulse = 0.5 * (1 + np.sin(2 * np.pi * 1.0 * t)) ** 4 * np.sin(2 * np.pi * 55 * t) * np.exp(-((t % 1.0) * 6))
music = 0.6 * pad / np.max(np.abs(pad)) + 0.25 * pulse
music = music / np.max(np.abs(music)) * 0.5
sf.write(os.path.join(out_dir, "music.wav"), music.astype(np.float32), sr)

json.dump({"title": script["title"], "scenes": manifest}, open(os.path.join(out_dir, "..", "manifest.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("total", round(sum(m["duration"] for m in manifest), 2))
