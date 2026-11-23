/* Skills Made EZ sounds: all synthesized in the browser (Web Audio), so they're original and need no license.
   Design: ~/Claude/ideas/skill-quest/senses.md. Signature "snap–ding" = a card snapped onto a table,
   then a rising marimba C → G. Nothing plays before a tap; the mute choice is remembered. */
(function () {
  "use strict";
  var KEY = "sq.sound";
  var on = true;
  try { on = localStorage.getItem(KEY) !== "off"; } catch (e) { /* default on */ }
  var ctx = null, master = null, noiseBuf = null;

  function audio() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) {
      ctx = new AC();
      var comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 4;
      master = ctx.createGain(); master.gain.value = 0.55;
      master.connect(comp); comp.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function noise() {
    if (!noiseBuf) {
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      var d = noiseBuf.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    var s = ctx.createBufferSource(); s.buffer = noiseBuf; return s;
  }
  function env(g, t, peak, a, d) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }
  function thump(t, f, peak) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.45, t + 0.14);
    env(g, t, peak, 0.004, 0.16); o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.22);
  }
  function hiss(t, dur, f0, f1, peak, q) {
    var s = noise(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    bp.type = "bandpass"; bp.Q.value = q || 1.2;
    bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env(g, t, peak, Math.min(0.01, dur / 4), dur);
    s.connect(bp); bp.connect(g); g.connect(master); s.start(t); s.stop(t + dur + 0.05);
  }
  function mallet(t, f, peak, d) {
    [[1, peak], [4, peak * 0.12], [2.01, peak * 0.18]].forEach(function (p) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = f * p[0];
      env(g, t, p[1], 0.003, p[0] === 1 ? d : d * 0.35);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + d + 0.1);
    });
  }
  function wood(t, f, peak) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "triangle"; o.frequency.setValueAtTime(f * 1.5, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.02);
    env(g, t, peak, 0.002, 0.06); o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.1);
  }

  var C5 = 523.25, E5 = 659.25, G5 = 783.99, C6 = 1046.5;
  var LADDER = [C5, E5, G5, C6];
  var SOUND = {
    sig: function (t) { hiss(t, 0.04, 3200, 2200, 0.5, 0.8); thump(t, 140, 0.7); mallet(t + 0.09, C5, 0.45, 0.7); mallet(t + 0.21, G5, 0.5, 0.9); },
    deal: function (t) { hiss(t, 0.18, 900, 3400, 0.22); hiss(t + 0.22, 0.18, 900, 3400, 0.22); thump(t + 0.17, 180, 0.25); thump(t + 0.39, 180, 0.25); },
    pick: function (t) { wood(t, 520, 0.35); },
    stamp: function (t) { thump(t, 90, 1); hiss(t, 0.05, 1500, 600, 0.25); },
    win: function (t) { hiss(t, 0.12, 1200, 4200, 0.25); SOUND.sig(t + 0.14); },
    even: function (t) { hiss(t, 0.12, 1200, 4200, 0.18); wood(t + 0.16, 440, 0.3); wood(t + 0.3, 440, 0.3); },
    tick: function (t, n) { wood(t, LADDER[Math.min(n || 0, 3)], 0.24); },
    sticker: function (t) { thump(t, 160, 0.6); hiss(t, 0.03, 2600, 1800, 0.35); mallet(t + 0.05, C6, 0.18, 0.4); },
    share: function (t) { hiss(t, 0.22, 700, 5200, 0.2, 2); wood(t + 0.24, 880, 0.2); }
  };
  var BUZZ = { win: [20, 70, 40], sticker: [25], stamp: [35] };

  function play(name, n) {
    if (!on || !SOUND[name]) return;
    try {
      if (!audio()) return;
      SOUND[name](ctx.currentTime + 0.02, n);
      if (BUZZ[name] && navigator.vibrate) navigator.vibrate(BUZZ[name]);
    } catch (e) { /* sound is a bonus, never a blocker */ }
  }
  function setOn(v) {
    on = !!v;
    try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (e) { /* this visit only */ }
    if (master) master.gain.value = on ? 0.55 : 0;
    var b = document.getElementById("sound");
    if (b) { b.setAttribute("aria-pressed", String(!on)); b.textContent = on ? "Sound on" : "Muted"; }
  }

  window.SQSound = { play: play, setOn: setOn, isOn: function () { return on; } };
  document.addEventListener("DOMContentLoaded", function () {
    var b = document.getElementById("sound");
    if (!b) return;
    setOn(on);
    b.addEventListener("click", function () { setOn(!on); if (on) play("pick"); });
  });
})();
