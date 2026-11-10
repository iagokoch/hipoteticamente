import numpy as np, soundfile as sf
import sys, os
OUT = sys.argv[1] if len(sys.argv) > 1 else 'video/public/audio'
os.makedirs(OUT, exist_ok=True)
sr=44100
t=np.arange(int(0.18*sr))/sr
pop=np.sin(2*np.pi*(900-2500*t)*t)*np.exp(-t*28)
sf.write(OUT + '/pop.wav',(pop/np.abs(pop).max()*0.6).astype(np.float32),sr)
t=np.arange(int(0.35*sr))/sr
noise=np.random.default_rng(1).standard_normal(len(t))
env=np.sin(np.pi*t/t[-1])**2
wh=np.convolve(noise,np.ones(30)/30,'same')*env
sf.write(OUT + '/whoosh.wav',(wh/np.abs(wh).max()*0.35).astype(np.float32),sr)
t=np.arange(int(1.2*sr))/sr
st=(np.sin(2*np.pi*110*t)+0.5*np.sin(2*np.pi*116.5*t))*np.exp(-t*2.5)
sf.write(OUT + '/sting.wav',(st/np.abs(st).max()*0.6).astype(np.float32),sr)
print('ok')
