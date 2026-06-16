/* audio.js — Eleven XI sound effects (Web Audio API, no external files)
 * Sounds: spin tick · decelerating spin sequence · reveal thunk ·
 * lock-in chime · pick confirm · win fanfare
 * Muted state persists in localStorage (wcxi_muted).
 * All calls are fire-and-forget; errors are silently swallowed. */
(function (W) {
  "use strict";

  var MUTE_KEY = "wcxi_muted";
  var _ctx = null;
  var _muted = false;

  try { _muted = localStorage.getItem(MUTE_KEY) === "1"; } catch (e) {}

  function ctx() {
    if (!_ctx) {
      try { _ctx = new (W.AudioContext || W.webkitAudioContext)(); } catch (e) {}
    }
    /* Resume if suspended (browser autoplay policy) */
    if (_ctx && _ctx.state === "suspended") { try { _ctx.resume(); } catch (e) {} }
    return _ctx;
  }

  /* ── spin tick — short high-pitched click ── */
  function sfxSpin() {
    if (_muted) return;
    try {
      var c = ctx(); if (!c) return;
      var osc = c.createOscillator(), g = c.createGain();
      osc.connect(g); g.connect(c.destination);
      osc.type = "sine"; osc.frequency.value = 900;
      g.gain.setValueAtTime(0.10, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.055);
      osc.start(c.currentTime); osc.stop(c.currentTime + 0.055);
    } catch (e) {}
  }

  /* ── decelerating tick sequence for the spin "money moment" ──
     Schedules sfxSpin() calls with a growing gap so it sounds like a
     real wheel slowing down. Self-terminates near the reel's settle time. */
  function sfxSpinSequence(duration) {
    if (_muted) return;
    var now = function () { return (W.performance && W.performance.now) ? W.performance.now() : Date.now(); };
    var start = now();
    function step() {
      var elapsed = now() - start;
      if (elapsed >= duration - 70) return;
      sfxSpin();
      var progress = elapsed / duration;
      var gap = 45 + 230 * Math.pow(progress, 2.4);
      setTimeout(step, gap);
    }
    step();
  }

  /* ── reveal thunk — country reel settles (mid-spin beat) ── */
  function sfxReveal() {
    if (_muted) return;
    try {
      var c = ctx(); if (!c) return;
      var t = c.currentTime;
      var osc1 = c.createOscillator(), g1 = c.createGain();
      osc1.connect(g1); g1.connect(c.destination);
      osc1.type = "triangle"; osc1.frequency.value = 180;
      g1.gain.setValueAtTime(0.16, t);
      g1.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      osc1.start(t); osc1.stop(t + 0.14);

      var osc2 = c.createOscillator(), g2 = c.createGain();
      osc2.connect(g2); g2.connect(c.destination);
      osc2.type = "sine"; osc2.frequency.value = 1100;
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(0.10, t + 0.02);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      osc2.start(t); osc2.stop(t + 0.12);
    } catch (e) {}
  }

  /* ── lock-in chime — final settle, the payoff moment ── */
  function sfxLockIn() {
    if (_muted) return;
    try {
      var c = ctx(); if (!c) return;
      var t0 = c.currentTime;
      var subOsc = c.createOscillator(), subG = c.createGain();
      subOsc.connect(subG); subG.connect(c.destination);
      subOsc.type = "sine"; subOsc.frequency.value = 110;
      subG.gain.setValueAtTime(0.13, t0);
      subG.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
      subOsc.start(t0); subOsc.stop(t0 + 0.22);

      [659.25, 880.00].forEach(function (freq, i) {
        var osc = c.createOscillator(), g = c.createGain();
        osc.connect(g); g.connect(c.destination);
        osc.type = "triangle"; osc.frequency.value = freq;
        var t = c.currentTime + i * 0.085;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);
        osc.start(t); osc.stop(t + 0.26);
      });
    } catch (e) {}
  }

  /* ── pick confirm — warm thud ── */
  function sfxPick() {
    if (_muted) return;
    try {
      var c = ctx(); if (!c) return;
      /* Two-layer: fundamental + slight harmonic */
      [200, 320].forEach(function (freq, i) {
        var osc = c.createOscillator(), g = c.createGain();
        osc.connect(g); g.connect(c.destination);
        osc.type = "triangle"; osc.frequency.value = freq;
        var t = c.currentTime;
        g.gain.setValueAtTime(i === 0 ? 0.14 : 0.06, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
        osc.start(t); osc.stop(t + 0.18);
      });
    } catch (e) {}
  }

  /* ── win fanfare — ascending C-E-G chord ── */
  function sfxWin() {
    if (_muted) return;
    try {
      var c = ctx(); if (!c) return;
      var notes = [523.25, 659.25, 783.99]; /* C5, E5, G5 */
      notes.forEach(function (freq, i) {
        var osc = c.createOscillator(), g = c.createGain();
        osc.connect(g); g.connect(c.destination);
        osc.type = "sine"; osc.frequency.value = freq;
        var t = c.currentTime + i * 0.11;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.16, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.30);
        osc.start(t); osc.stop(t + 0.30);
      });
    } catch (e) {}
  }

  /* ── mute control ── */
  function setMuted(val) {
    _muted = !!val;
    try { localStorage.setItem(MUTE_KEY, _muted ? "1" : "0"); } catch (e) {}
    updateToggleUI();
  }

  function updateToggleUI() {
    var btn = document.getElementById("soundToggle");
    if (!btn) return;
    btn.setAttribute("aria-pressed", String(_muted));
    btn.title = _muted ? "Sound off — click to enable" : "Sound on — click to mute";
    /* swap icon */
    var on  = btn.querySelector(".snd-on");
    var off = btn.querySelector(".snd-off");
    if (on)  on.style.display  = _muted ? "none" : "";
    if (off) off.style.display = _muted ? "" : "none";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("soundToggle");
    if (btn) {
      btn.addEventListener("click", function () { setMuted(!_muted); });
      updateToggleUI();
    }
  });

  W.sfx = {
    spin: sfxSpin, spinSequence: sfxSpinSequence, reveal: sfxReveal, lockIn: sfxLockIn,
    pick: sfxPick, win: sfxWin, setMuted: setMuted, isMuted: function () { return _muted; }
  };

})(window);
