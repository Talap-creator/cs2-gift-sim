// CS2-style synthetic sounds via Web Audio API
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let ctx = null;

function getCtx() {
  if (!ctx) ctx = new AudioCtx();
  // Resume if suspended (browser autoplay policy)
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

// Helper: envelope gain
function makeGain(ac, vol, attack, decay) {
  const g = ac.createGain();
  g.gain.setValueAtTime(0, ac.currentTime);
  g.gain.linearRampToValueAtTime(vol, ac.currentTime + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + attack + decay);
  return g;
}

// ─── Звук появления нового оффера ───────────────────────
export function playOfferAppear() {
  const ac = getCtx();
  const t = ac.currentTime;

  // Short upward sweep
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(320, t);
  osc.frequency.exponentialRampToValueAtTime(640, t + 0.12);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);

  // Second harmonic layer
  const osc2 = ac.createOscillator();
  const gain2 = ac.createGain();
  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(640, t);
  osc2.frequency.exponentialRampToValueAtTime(1280, t + 0.1);
  gain2.gain.setValueAtTime(0, t);
  gain2.gain.linearRampToValueAtTime(0.06, t + 0.015);
  gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);

  osc.connect(gain); gain.connect(ac.destination);
  osc2.connect(gain2); gain2.connect(ac.destination);
  osc.start(t); osc.stop(t + 0.3);
  osc2.start(t); osc2.stop(t + 0.25);
}

// ─── Звук декланга ───────────────────────────────────────
export function playDecline() {
  const ac = getCtx();
  const t = ac.currentTime;

  // Downward sweep
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.exponentialRampToValueAtTime(160, t + 0.18);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.14, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 800;

  osc.connect(filter); filter.connect(gain); gain.connect(ac.destination);
  osc.start(t); osc.stop(t + 0.25);
}

// ─── Звук hold (нарастание) ──────────────────────────────
export function playHoldStart(isAccept) {
  const ac = getCtx();
  const t = ac.currentTime;

  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(isAccept ? 220 : 180, t);
  osc.frequency.linearRampToValueAtTime(isAccept ? 440 : 140, t + 0.8);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.07, t + 0.05);
  gain.gain.setValueAtTime(0.07, t + 0.75);
  gain.gain.linearRampToValueAtTime(0, t + 0.82);

  osc.connect(gain); gain.connect(ac.destination);
  osc.start(t); osc.stop(t + 0.85);
}

// ─── Звук подтверждения accept ───────────────────────────
export function playAccept() {
  const ac = getCtx();
  const t = ac.currentTime;

  [0, 0.06, 0.13].forEach((delay, i) => {
    const freqs = [523, 659, 784];
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = freqs[i];
    gain.gain.setValueAtTime(0, t + delay);
    gain.gain.linearRampToValueAtTime(0.15, t + delay + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.3);
    osc.connect(gain); gain.connect(ac.destination);
    osc.start(t + delay); osc.stop(t + delay + 0.35);
  });
}

// ─── Эпичный reveal для подарка (CS2-style) ─────────────
export function playGiftReveal() {
  const ac = getCtx();
  const t = ac.currentTime;

  // 1. Low rumble / impact
  const noise = ac.createOscillator();
  const noiseGain = ac.createGain();
  noise.type = "sawtooth";
  noise.frequency.setValueAtTime(60, t);
  noise.frequency.exponentialRampToValueAtTime(30, t + 0.3);
  noiseGain.gain.setValueAtTime(0.25, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
  noise.connect(noiseGain); noiseGain.connect(ac.destination);
  noise.start(t); noise.stop(t + 0.45);

  // 2. Rising whoosh
  const whoosh = ac.createOscillator();
  const whooshGain = ac.createGain();
  whoosh.type = "sine";
  whoosh.frequency.setValueAtTime(200, t + 0.05);
  whoosh.frequency.exponentialRampToValueAtTime(1600, t + 0.55);
  whooshGain.gain.setValueAtTime(0, t + 0.05);
  whooshGain.gain.linearRampToValueAtTime(0.2, t + 0.15);
  whooshGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
  whoosh.connect(whooshGain); whooshGain.connect(ac.destination);
  whoosh.start(t + 0.05); whoosh.stop(t + 0.65);

  // 3. Reveal chime — arpeggio
  const arpNotes = [523, 659, 784, 1047, 1319];
  arpNotes.forEach((freq, i) => {
    const delay = 0.55 + i * 0.07;
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = i < 3 ? "sine" : "triangle";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t + delay);
    g.gain.linearRampToValueAtTime(0.18 - i * 0.015, t + delay + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.5);
    osc.connect(g); g.connect(ac.destination);
    osc.start(t + delay); osc.stop(t + delay + 0.55);
  });

  // 4. Covert red "buzz" hit
  const buzz = ac.createOscillator();
  const buzzGain = ac.createGain();
  buzz.type = "square";
  buzz.frequency.setValueAtTime(80, t);
  buzzGain.gain.setValueAtTime(0.12, t);
  buzzGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
  const buzzFilter = ac.createBiquadFilter();
  buzzFilter.type = "lowpass";
  buzzFilter.frequency.value = 300;
  buzz.connect(buzzFilter); buzzFilter.connect(buzzGain); buzzGain.connect(ac.destination);
  buzz.start(t); buzz.stop(t + 0.18);
}

// ─── Тихий клик клавиатуры (typing) ─────────────────────
export function playTypingClick() {
  const ac = getCtx();
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "square";
  osc.frequency.value = 2400 + Math.random() * 800;
  gain.gain.setValueAtTime(0.03, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
  const filter = ac.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 1000;
  osc.connect(filter); filter.connect(gain); gain.connect(ac.destination);
  osc.start(t); osc.stop(t + 0.03);
}
