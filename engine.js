/* ====================================================================
   WATERGEN — Episode One: The Ecosystem
   GAME ENGINE  (depends on story.js: CHARACTERS, STORY, ENDINGS)
   ==================================================================== */

(function () {
  "use strict";

  /* ---------------- DOM ---------------- */
  const $ = id => document.getElementById(id);
  const el = {
    bg: $("bg"), npc: $("npc"), ceo: $("ceo"),
    hud: $("hud"), floaties: $("floaties"),
    chapter: $("chapter"),
    dialogue: $("dialogue"), speaker: $("speaker"), line: $("line"), cont: $("cont"),
    choices: $("choices"), timerbar: $("timerbar"),
    toasts: $("toasts"),
    title: $("title-screen"), debrief: $("debrief-screen"),
    startBtn: $("start-btn"), nameInput: $("ceo-name"),
    academic: $("academic-toggle"),
    musicToggle: $("music-toggle"), voiceToggle: $("voice-toggle"),
    audioCtrls: $("audio-ctrls"), btnMusic: $("btn-music"), btnVoice: $("btn-voice"),
  };

  /* ---------------- STATE ---------------- */
  const state = {
    stats: { talent:50, capital:50, network:50, impact:50 },
    ceoName: "CEO",
    academic: true,
    currentNpc: null,
    log: [],            // decisions for debrief
    typing: false,
    typeTimer: null,
    waiting: null,      // function to run on advance, or null
    countdown: null,    // interval id for timed choices
  };

  /* ====================================================================
     MUSIC  —  warm, upbeat generative loop (Web Audio, no files)
     A gentle major-key progression (C–G–Am–F) with a soft pad, light
     bass, and a bright plucked arpeggio. Hopeful, not droney.
     ==================================================================== */
  const Music = (function () {
    let ctx = null, master = null, filter = null, on = true, playing = false;
    let stepTimer = null, step = 0;
    const BPM = 86, eighth = (60 / BPM) / 2;
    // progression: each chord has a soft pad, a bass note, and arp tones
    const prog = [
      { pad: [261.63, 329.63, 392.00], bass: 130.81, arp: [523.25, 659.25, 783.99, 659.25] }, // C
      { pad: [392.00, 493.88, 587.33], bass: 196.00, arp: [587.33, 783.99, 587.33, 493.88] }, // G
      { pad: [329.63, 392.00, 523.25], bass: 220.00, arp: [659.25, 523.25, 659.25, 880.00] }, // Am
      { pad: [349.23, 440.00, 523.25], bass: 174.61, arp: [523.25, 698.46, 523.25, 440.00] }, // F
    ];
    const pad = [], padG = [];
    let bassOsc = null, bassG = null;
    function ensure() {
      if (ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0;
      filter = ctx.createBiquadFilter(); filter.type = "lowpass";
      filter.frequency.value = 2400; filter.Q.value = 0.2;
      filter.connect(master); master.connect(ctx.destination);
      for (let i = 0; i < 3; i++) {
        const o = ctx.createOscillator(); o.type = "sine";
        const g = ctx.createGain(); g.gain.value = 0;
        o.connect(g); g.connect(filter); o.start();
        pad.push(o); padG.push(g);
      }
      bassOsc = ctx.createOscillator(); bassOsc.type = "triangle";
      bassG = ctx.createGain(); bassG.gain.value = 0;
      bassOsc.connect(bassG); bassG.connect(filter); bassOsc.start();
    }
    function setChord(i) {
      const c = prog[i], t = ctx.currentTime;
      pad.forEach((o, k) => {
        o.frequency.linearRampToValueAtTime(c.pad[k], t + 1.2);
        padG[k].gain.linearRampToValueAtTime(0.028, t + 1.2);
      });
      bassOsc.frequency.linearRampToValueAtTime(c.bass, t + 0.3);
      bassG.gain.linearRampToValueAtTime(0.05, t + 0.3);
    }
    function pluck(freq, vol) {
      const t = ctx.currentTime;
      const o = ctx.createOscillator(); o.type = "triangle"; o.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0006, t + 0.42);
      o.connect(g); g.connect(filter); o.start(t); o.stop(t + 0.45);
    }
    function tick() {
      if (!playing || !ctx) return;
      const i = ((step / 8) | 0) % prog.length, local = step % 8;
      if (local === 0) setChord(i);
      const arp = prog[i].arp;
      // bright on the beat, softer off the beat; rest occasionally for lightness
      if (local !== 7) pluck(arp[local % arp.length], local % 2 === 0 ? 0.06 : 0.038);
      step++;
    }
    function play() {
      if (!on) return;
      ensure(); if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();
      if (playing) return; playing = true; step = 0;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 2.5);
      setChord(0);
      stepTimer = setInterval(tick, eighth * 1000);
    }
    function stop() {
      if (!ctx || !playing) return; playing = false;
      clearInterval(stepTimer);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.0);
    }
    function setOn(v) { on = v; if (v) play(); else stop(); }
    return { play, stop, setOn, isOn: () => on };
  })();

  /* ====================================================================
     VOICE  —  character narration (Web Speech, no files)
     ==================================================================== */
  const Voice = (function () {
    const synth = window.speechSynthesis || null;
    let on = true, all = [], ranked = [];
    // novelty / robotic / low-quality voices to AVOID (the "creepy" ones)
    const BLACKLIST = /(albert|bad news|bahh|bells|boing|bubbles|cellos|wobble|deranged|good news|jester|organ|superstar|trinoids|whisper|zarvox|junior|ralph|fred|kathy|princess|bruce|agnes|vicki|victoria|eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley|hysterical|pipe|wobble)/i;
    // natural-sounding voices in rough preference order
    const GOOD = ["samantha","ava","allison","susan","zoe","joelle","nicky","tom","aaron","alex",
      "daniel","arthur","oliver","serena","karen","moira","tessa","fiona","nathan","evan",
      "google us english","google uk english female","google uk english male",
      "microsoft aria","microsoft jenny","microsoft guy","microsoft zira","microsoft david"];
    function rank() {
      if (!synth) return;
      all = synth.getVoices().filter(v => /^en/i.test(v.lang) && !BLACKLIST.test(v.name));
      const score = v => {
        const n = v.name.toLowerCase(); let s = 0;
        if (/(enhanced|premium|natural|neural|siri)/i.test(v.name)) s += 100;
        const gi = GOOD.findIndex(g => n.includes(g));
        if (gi >= 0) s += (80 - gi);
        if (v.localService) s += 10;
        if (/en[-_]us/i.test(v.lang)) s += 5;
        return s;
      };
      ranked = all.slice().sort((a, b) => score(b) - score(a));
    }
    if (synth) { rank(); synth.onvoiceschanged = rank; }
    // natural pitch/rate; characters differ mainly by which good voice they use
    const profiles = {
      yarden:  { pitch: 1.00, rate: 1.00, vi: 0 },
      sharon:  { pitch: 1.05, rate: 1.00, vi: 1 },
      chen:    { pitch: 1.00, rate: 1.04, vi: 2 },
      roni:    { pitch: 1.03, rate: 1.05, vi: 3 },
      michael: { pitch: 0.96, rate: 0.96, vi: 4 },
      _narr:   { pitch: 1.00, rate: 0.98, vi: 5 },
    };
    function clean(t) { return t.replace(/[“”"]/g, "").replace(/\s+/g, " ").trim(); }
    function speak(text, charId) {
      if (!on || !synth || !text) return;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(clean(text));
      const p = profiles[charId] || profiles._narr;
      const pool = ranked.length ? ranked : all;
      if (pool.length) u.voice = pool[p.vi % pool.length];
      u.pitch = p.pitch; u.rate = p.rate; u.volume = 1;
      try { synth.speak(u); } catch (e) {}
    }
    function stop() { if (synth) try { synth.cancel(); } catch (e) {} }
    function setOn(v) { on = v; if (!v) stop(); }
    return { speak, stop, setOn, isOn: () => on, available: !!synth };
  })();

  /* ====================================================================
     CHARACTER ART  —  flat, comic-style SVG busts (3/4 view)
     ==================================================================== */
  function personSVG(a) {
    const stroke = "#0b1c27", sw = 4;
    const dark = shade(a.outfitColor, -0.28);
    const skinShade = shade(a.skin, -0.16);

    // hair (drawn behind head for most styles)
    let hairBack = "", hairFront = "";
    const hc = a.hairColor;
    switch (a.hair) {
      case "bald":
        hairFront = `<path d="M104 120 q46 -34 92 0" fill="none" stroke="${shade(a.skin,0.14)}" stroke-width="6" opacity=".5"/>`;
        break;
      case "buzz":
        hairFront = `<path d="M90 118 q60 -70 120 0 q-60 -22 -120 0 Z" fill="${hc}"/>`;
        break;
      case "short":
        hairFront = `<path d="M86 122 q64 -80 128 0 q-10 -30 -64 -34 q-54 4 -64 34 Z" fill="${hc}"/>`;
        break;
      case "bun":
        hairBack = `<circle cx="150" cy="58" r="20" fill="${hc}"/>`;
        hairFront = `<path d="M86 124 q64 -86 128 0 q-12 -34 -64 -38 q-52 4 -64 38 Z" fill="${hc}"/>`;
        break;
      case "long":
        hairBack = `<path d="M78 96 q-14 120 18 168 l24 0 q-26 -70 -8 -150 Z" fill="${hc}"/>
                    <path d="M222 96 q14 120 -18 168 l-24 0 q26 -70 8 -150 Z" fill="${hc}"/>`;
        hairFront = `<path d="M84 124 q66 -90 132 0 q-12 -36 -66 -40 q-54 4 -66 40 Z" fill="${hc}"/>`;
        break;
      case "curly":
        hairFront = `<g fill="${hc}">
          <circle cx="100" cy="96" r="20"/><circle cx="124" cy="78" r="22"/>
          <circle cx="150" cy="72" r="22"/><circle cx="176" cy="78" r="22"/>
          <circle cx="200" cy="96" r="20"/><circle cx="92" cy="118" r="16"/>
          <circle cx="208" cy="118" r="16"/></g>`;
        break;
    }

    // outfit / shoulders
    let body = "";
    const shoulders = `M40 400 C40 300 96 256 150 256 C204 256 260 300 260 400 Z`;
    if (a.outfit === "labcoat") {
      body = `
        <path d="${shoulders}" fill="${a.outfitColor}" stroke="${stroke}" stroke-width="${sw}"/>
        <path d="M150 256 L120 400 L150 400 Z" fill="${shade(a.outfitColor,-0.08)}"/>
        <path d="M150 256 L180 400 L150 400 Z" fill="${shade(a.outfitColor,-0.16)}"/>
        <path d="M150 262 q-26 6 -34 44 l16 6 q10 -30 18 -34 Z" fill="${a.accent}"/>
        <path d="M150 262 q26 6 34 44 l-16 6 q-10 -30 -18 -34 Z" fill="${shade(a.accent,-0.1)}"/>
        <rect x="172" y="316" width="6" height="22" rx="3" fill="${a.accent}"/>`;
    } else if (a.outfit === "suit") {
      body = `
        <path d="${shoulders}" fill="${a.outfitColor}" stroke="${stroke}" stroke-width="${sw}"/>
        <path d="M150 258 L108 400 L150 400 Z" fill="#f3f5f7"/>
        <path d="M150 258 L192 400 L150 400 Z" fill="#e7ebee"/>
        <path d="M150 258 L112 330 L132 348 L150 286 Z" fill="${dark}"/>
        <path d="M150 258 L188 330 L168 348 L150 286 Z" fill="${shade(a.outfitColor,-0.18)}"/>
        <path d="M150 286 L138 400 L162 400 Z" fill="${a.accent}"/>`;
    } else if (a.outfit === "blazer") {
      body = `
        <path d="${shoulders}" fill="${a.outfitColor}" stroke="${stroke}" stroke-width="${sw}"/>
        <path d="M150 258 L116 400 L150 400 Z" fill="${shade(a.accent,0.0)}"/>
        <path d="M150 258 L184 400 L150 400 Z" fill="${shade(a.accent,-0.12)}"/>
        <path d="M150 258 L120 332 L140 350 L150 290 Z" fill="${dark}"/>
        <path d="M150 258 L180 332 L160 350 L150 290 Z" fill="${shade(a.outfitColor,-0.18)}"/>`;
    } else if (a.outfit === "casual") {
      body = `
        <path d="${shoulders}" fill="${a.outfitColor}" stroke="${stroke}" stroke-width="${sw}"/>
        <path d="M112 268 q38 30 76 0 l0 18 q-38 30 -76 0 Z" fill="${shade(a.outfitColor,-0.2)}"/>
        <path d="M150 286 q-6 50 -6 114" stroke="${shade(a.outfitColor,-0.22)}" stroke-width="3" fill="none"/>`;
    }

    // ears
    const ears = `<ellipse cx="88" cy="170" rx="12" ry="16" fill="${a.skin}" stroke="${stroke}" stroke-width="3"/>
                  <ellipse cx="212" cy="170" rx="12" ry="16" fill="${a.skin}" stroke="${stroke}" stroke-width="3"/>`;

    // head + face
    const head = `<ellipse cx="150" cy="166" rx="64" ry="74" fill="${a.skin}" stroke="${stroke}" stroke-width="${sw}"/>
                  <path d="M150 92 a64 74 0 0 1 0 148 Z" fill="${skinShade}" opacity=".35"/>`;
    const neck = `<path d="M126 224 q24 26 48 0 l0 40 l-48 0 Z" fill="${a.skin}" stroke="${stroke}" stroke-width="${sw}"/>
                  <path d="M126 232 q24 18 48 0 l0 10 q-24 16 -48 0 Z" fill="${skinShade}" opacity=".4"/>`;

    const brows = `<path d="M112 150 q16 -8 30 -2" stroke="${shade(a.hairColor,-0.1)}" stroke-width="5" fill="none" stroke-linecap="round"/>
                   <path d="M158 148 q16 -6 30 2" stroke="${shade(a.hairColor,-0.1)}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    const eyes = `<ellipse cx="127" cy="168" rx="11" ry="9" fill="#fff"/>
                  <ellipse cx="173" cy="168" rx="11" ry="9" fill="#fff"/>
                  <circle cx="129" cy="169" r="4.5" fill="#10222e"/>
                  <circle cx="175" cy="169" r="4.5" fill="#10222e"/>`;
    const nose = `<path d="M150 172 q6 16 -2 24" stroke="${skinShade}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    const mouth = `<path d="M134 206 q16 12 32 0" stroke="#7a3b3b" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    const glasses = a.glasses ? `
      <g stroke="#10222e" stroke-width="4" fill="none">
        <rect x="112" y="156" width="30" height="24" rx="7"/>
        <rect x="158" y="156" width="30" height="24" rx="7"/>
        <path d="M142 166 h16"/><path d="M112 162 l-14 -4"/><path d="M188 162 l14 -4"/>
      </g>` : "";

    return `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
      ${hairBack}${body}${neck}${ears}${head}${hairFront}${brows}${eyes}${nose}${mouth}${glasses}
    </svg>`;
  }

  // CEO over-the-shoulder foreground silhouette (back of head + shoulder)
  function ceoSilhouette() {
    return `<svg viewBox="0 0 360 460" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#0a1a24"/><stop offset="1" stop-color="#06121a"/>
        </linearGradient>
      </defs>
      <path d="M40 460 C30 300 70 250 150 240 C210 232 250 196 250 150
               C250 96 300 70 340 84 L360 460 Z" fill="url(#rim)"/>
      <path d="M250 150 C250 196 210 232 150 240 C90 248 50 300 44 420"
            fill="none" stroke="#38d6e6" stroke-width="3" opacity=".45"/>
      <ellipse cx="232" cy="120" rx="56" ry="64" fill="#081620"/>
      <path d="M196 96 q36 -26 72 0" stroke="#38d6e6" stroke-width="3" opacity=".35" fill="none"/>
    </svg>`;
  }

  /* color helper: lighten/darken a hex by ratio (-1..1) */
  function shade(hex, r) {
    const n = parseInt(hex.replace("#", ""), 16);
    let red = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const adj = c => Math.max(0, Math.min(255, Math.round(c + (r < 0 ? c : 255 - c) * r)));
    red = adj(red); g = adj(g); b = adj(b);
    return "#" + ((1 << 24) + (red << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /* ====================================================================
     RENDERING
     ==================================================================== */
  function setBackground(key) {
    if (!key) return;
    el.bg.className = "bg bg-" + key;
  }

  function setNpc(charId) {
    if (charId === state.currentNpc) return;
    state.currentNpc = charId || null;
    if (!charId) {
      el.npc.classList.remove("show");
      return;
    }
    const c = CHARACTERS[charId];
    el.npc.innerHTML = c.img
      ? `<img class="portrait" src="${c.img}" alt="${c.name}" draggable="false">`
      : personSVG(c.art);
    // restart entrance animation
    el.npc.classList.remove("show");
    void el.npc.offsetWidth;
    el.npc.classList.add("show");
  }

  function setCeo(show) {
    if (show) {
      if (!el.ceo.innerHTML) el.ceo.innerHTML = ceoSilhouette();
      el.ceo.classList.add("show");
    } else {
      el.ceo.classList.remove("show");
    }
  }

  /* typewriter — clicking mid-type calls state.skip(), which jumps to the
     SAME completion path (done) so the game never gets stuck half-typed. */
  function typeLine(text, done) {
    state.typing = true;
    el.line.innerHTML = "";
    el.cont.classList.add("hidden");
    let i = 0, completed = false;
    const cursor = '<span class="cursor">▍</span>';
    clearInterval(state.typeTimer);

    const complete = () => {
      if (completed) return;
      completed = true;
      clearInterval(state.typeTimer);
      state.typing = false;
      el.line.innerHTML = escapeHtml(text);
      if (done) done();
    };

    state.typeTimer = setInterval(() => {
      i++;
      el.line.innerHTML = escapeHtml(text.slice(0, i)) + (i < text.length ? cursor : "");
      if (i >= text.length) complete();
    }, 18);

    state.skip = complete;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function speakerName(node) {
    if (node.speaker === "") return { name:"", narration:true };
    if (node.speaker) return { name:node.speaker, narration:false };
    if (node.npc && CHARACTERS[node.npc]) {
      const c = CHARACTERS[node.npc];
      return { name:c.name + (c.role ? "  ·  " + c.role : ""), narration:false };
    }
    return { name:"", narration:true };
  }

  /* ====================================================================
     NODE FLOW
     ==================================================================== */
  function go(nodeId) {
    if (nodeId === "__evaluate__") return evaluate();
    const node = STORY.nodes[nodeId];
    if (!node) { console.error("Missing node:", nodeId); return; }
    state.current = nodeId;

    const proceed = () => renderNode(node, nodeId);

    if (node.chapter) {
      showChapter(node.chapter, proceed);
    } else if (node.titlecard) {
      showTitlecard(node.titlecard, () => go(node.next));
      return;
    } else {
      proceed();
    }
  }

  function renderNode(node, nodeId) {
    el.choices.classList.add("hidden");
    el.choices.innerHTML = "";
    hideTimer();

    setBackground(node.bg);
    setCeo(!!node.ceo);
    setNpc(node.npc);

    const sp = speakerName(node);
    el.speaker.textContent = sp.name;
    el.speaker.className = "speaker" + (sp.narration ? " narration" : "");
    el.dialogue.classList.remove("hidden");

    // replace placeholders ({name})
    const text = (node.text || "").replace(/\{name\}/g, state.ceoName);

    Voice.speak(text, node.npc || "_narr");

    typeLine(text, () => {
      if (node.choices) {
        showChoices(node);
      } else {
        el.cont.classList.remove("hidden");
        state.waiting = () => { state.waiting = null; go(node.next); };
      }
    });
  }

  /* ---- chapter banner ---- */
  function showChapter(ch, done) {
    Voice.stop();
    el.dialogue.classList.add("hidden");
    el.choices.classList.add("hidden");
    el.chapter.querySelector(".chapter-kicker").textContent = ch.kicker;
    el.chapter.querySelector(".chapter-title").textContent = ch.title;
    el.chapter.classList.remove("hidden");
    setTimeout(() => {
      el.chapter.classList.add("hidden");
      done();
    }, 2200);
  }

  /* ---- title card ---- */
  function showTitlecard(tc, done) {
    Voice.stop();
    el.dialogue.classList.add("hidden");
    el.choices.classList.add("hidden");
    setBackground("black");
    setNpc(null); setCeo(false);
    el.chapter.querySelector(".chapter-kicker").textContent = tc.top + "   —   " + tc.sub;
    el.chapter.querySelector(".chapter-title").textContent = tc.big;
    el.chapter.classList.remove("hidden");
    state.waiting = () => { state.waiting = null; el.chapter.classList.add("hidden"); done(); };
    el.cont && el.cont.classList.add("hidden");
    // auto-advance fallback
    setTimeout(() => { if (state.waiting) { /* keep waiting for click */ } }, 100);
  }

  /* ---- choices ---- */
  function showChoices(node) {
    el.cont.classList.add("hidden");
    el.dialogue.classList.remove("hidden");
    el.choices.innerHTML = "";
    node.choices.forEach((ch, idx) => {
      const b = document.createElement("button");
      b.className = "choice";
      b.style.animationDelay = (idx * 0.07) + "s";
      const tag = ch.tag ? `<span class="tag">${escapeHtml(ch.tag)}</span>` : "";
      b.innerHTML = `<span class="num">${idx + 1}</span><span class="ctext">${escapeHtml(ch.text)}</span>${state.academic ? tag : ""}`;
      b.addEventListener("click", () => pickChoice(node, ch));
      el.choices.appendChild(b);
    });
    el.choices.classList.remove("hidden");

    if (node.timer) startTimer(node);
  }

  function startTimer(node) {
    el.timerbar.classList.remove("hidden");
    const fill = el.timerbar.querySelector(".timerbar-fill");
    const dur = node.timer * 1000;
    const t0 = Date.now();
    fill.style.transition = "none";
    fill.style.transform = "scaleX(1)";
    void fill.offsetWidth;
    fill.style.transition = `transform ${node.timer}s linear`;
    fill.style.transform = "scaleX(0)";
    clearInterval(state.countdown);
    state.countdown = setInterval(() => {
      if (Date.now() - t0 >= dur) {
        clearInterval(state.countdown);
        const idx = node.timeoutIndex != null ? node.timeoutIndex : 0;
        pickChoice(node, node.choices[idx], true);
      }
    }, 100);
  }

  function hideTimer() {
    clearInterval(state.countdown);
    el.timerbar.classList.add("hidden");
  }

  function pickChoice(node, ch, timedOut) {
    if (!ch) return;
    hideTimer();
    el.choices.classList.add("hidden");
    el.choices.innerHTML = "";

    // apply effects
    if (ch.effects) applyEffects(ch.effects);

    // log for debrief
    state.log.push({
      scene: (node.chapter && node.chapter.title) || sceneNameFor(node),
      choice: ch.text,
      tag: ch.tag || "",
      lens: ch.lens || "",
      timedOut: !!timedOut,
    });

    // remember toast
    if (ch.remember) showToast(ch.remember);

    // show result beat (narration) then continue
    const resultText = (timedOut ? "(You hesitated. Silence is also an answer.)  " : "") + (ch.result || "");
    showResultBeat(resultText, state.academic ? ch.lens : "", () => go(ch.goto));
  }

  function sceneNameFor(node) {
    // best-effort label when a choice node has no chapter on it
    return "Decision";
  }

  function showResultBeat(text, lens, done) {
    setNpc(null);
    el.speaker.textContent = "";
    el.speaker.className = "speaker narration";
    el.dialogue.classList.remove("hidden");
    Voice.speak(text, "_narr");
    typeLine(text, () => {
      if (lens) {
        const div = document.createElement("div");
        div.className = "lens";
        div.innerHTML = `<span class="lens-kicker">🔬 Ecosystem lens</span>${escapeHtml(lens)}`;
        el.line.appendChild(div);
      }
      el.cont.classList.remove("hidden");
      state.waiting = () => { state.waiting = null; done(); };
    });
  }

  /* ---- toasts ---- */
  function showToast(name) {
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<b>${escapeHtml(name)}</b> will remember that.`;
    el.toasts.appendChild(t);
    setTimeout(() => t.remove(), 3300);
  }

  /* ---- stats ---- */
  function applyEffects(eff) {
    Object.keys(eff).forEach(stat => {
      const delta = eff[stat];
      if (!delta) return;
      state.stats[stat] = Math.max(0, Math.min(100, state.stats[stat] + delta));
      flashMeter(stat, delta);
    });
    renderMeters();
  }

  function renderMeters() {
    document.querySelectorAll(".meter").forEach(m => {
      const stat = m.dataset.stat;
      m.querySelector(".m-fill").style.width = state.stats[stat] + "%";
    });
  }

  function flashMeter(stat, delta) {
    const m = document.querySelector(`.meter[data-stat="${stat}"]`);
    if (m) { m.classList.add("flash"); setTimeout(() => m.classList.remove("flash"), 700); }
    const f = document.createElement("div");
    f.className = "floaty " + (delta > 0 ? "up" : "down");
    f.textContent = (delta > 0 ? "+" : "") + delta + " " + cap(stat);
    el.floaties.appendChild(f);
    setTimeout(() => f.remove(), 1600);
  }

  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  /* ====================================================================
     EVALUATE + DEBRIEF
     ==================================================================== */
  function evaluate() {
    const s = state.stats;
    const ending = ENDINGS.find(e => e.test(s)) || ENDINGS[ENDINGS.length - 1];
    showDebrief(ending);
  }

  function showDebrief(ending) {
    Voice.stop();
    el.dialogue.classList.add("hidden");
    el.choices.classList.add("hidden");
    setNpc(null); setCeo(false);
    el.hud.classList.add("hidden");
    el.audioCtrls.classList.add("hidden");
    setBackground("press");

    const s = state.stats;
    const statCard = (ico, lab, val) =>
      `<div class="dstat"><div class="d-ico">${ico}</div><div class="d-val">${val}</div><div class="d-lab">${lab}</div></div>`;

    const decisions = state.log.map(d => `
      <div class="decision-item">
        <div class="di-scene">${escapeHtml(d.scene)}</div>
        <div class="di-choice">“${escapeHtml(d.choice)}”${d.timedOut ? " <i>(timed out)</i>" : ""}</div>
        ${d.tag ? `<div class="di-tag">▸ ${escapeHtml(d.tag)}</div>` : ""}
        ${d.lens ? `<div class="di-lens">${escapeHtml(d.lens)}</div>` : ""}
      </div>`).join("");

    el.debrief.innerHTML = `
      <div class="debrief-inner">
        <div class="debrief-ending-kicker">${escapeHtml(state.ceoName)} · CEO of Watergen · Final Verdict</div>
        <div class="debrief-ending-title">${escapeHtml(ending.title)}</div>
        <p class="debrief-ending-desc">${escapeHtml(ending.desc)}</p>

        <div class="debrief-stats">
          ${statCard("👥","Talent", s.talent)}
          ${statCard("💧","Capital", s.capital)}
          ${statCard("🔗","Network", s.network)}
          ${statCard("🌍","Impact", s.impact)}
        </div>

        <div class="debrief-section-title">Your decisions, through the ecosystem lens</div>
        <div class="decision-list">${decisions}</div>

        <div class="debrief-section-title">The framework behind the game · Macro / Meso / Micro</div>
        <div class="citations">
          <b>Almor &amp; Berliner (2024)</b> — <i>“The Role of the Ecosystem.”</i> Israel's entrepreneurial success was NOT organic — it was deliberately engineered through policy at three levels: <b>MACRO</b> (national: Yozma Fund, IIA, Angels Law), <b>MESO</b> (organizational: incubators, born-global INVs, serial reinvestment), <b>MICRO</b> (individual: IDF/Unit 8200, universities, culture).<br/>
          <b>Lach et al. (2008)</b> — Government R&amp;D support (IIA) generates <b>2.28–2.81× leverage</b> on the initial grant.<br/>
          <b>Honig et al. (2006)</b> — Military-unit social capital significantly predicts new-venture success.<br/>
          <b>Angels Law (2012)</b> · <b>Yozma Fund (1993)</b> — macro policy that built private angel &amp; VC investment.<br/>
          <b>Case — Watergen:</b> IIA grants funded the early prototype; the Export Institute opened government doors in India; Yozma-built VC enabled $30M+ rounds; born-global with no domestic market; core tech and team from IDF defense R&amp;D. <i>The takeaway: human capital is the raw material; the ecosystem is the factory.</i>
        </div>

        <div class="debrief-actions">
          <button class="btn btn-primary" id="replay-btn">▶ Play Again</button>
          <button class="btn btn-ghost" id="totitle-btn">Title Screen</button>
        </div>
        <div class="credits-note">Liora Eichhorn · Itay Bardin · Jonathan Sella · Yair Hazan &nbsp;|&nbsp; Human Capital, Adelson School of Entrepreneurship<br/>Dramatized for education — Watergen and its executives are real; specific scenes and dialogue are fictionalized.</div>
      </div>`;

    el.debrief.classList.remove("hidden");
    $("replay-btn").addEventListener("click", () => { el.debrief.classList.add("hidden"); beginGame(); });
    $("totitle-btn").addEventListener("click", () => { el.debrief.classList.add("hidden"); el.title.classList.remove("hidden"); });
  }

  /* ====================================================================
     INPUT
     ==================================================================== */
  function advance() {
    if (state.typing) { if (state.skip) state.skip(); return; }
    if (state.waiting) state.waiting();
  }

  document.addEventListener("keydown", e => {
    if (!el.title.classList.contains("hidden")) {
      if (e.key === "Enter") { e.preventDefault(); start(); }
      return;
    }
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); advance(); }
    else if (/^[1-9]$/.test(e.key)) {
      const btns = el.choices.querySelectorAll(".choice");
      const i = parseInt(e.key, 10) - 1;
      if (btns[i]) btns[i].click();
    }
  });

  el.dialogue.addEventListener("click", advance);
  el.chapter.addEventListener("click", () => { if (state.waiting) state.waiting(); });

  /* ====================================================================
     START / RESET
     ==================================================================== */
  function start() {
    state.ceoName = (el.nameInput.value || "").trim() || "CEO";
    state.academic = el.academic.checked;
    Music.setOn(el.musicToggle.checked);
    Voice.setOn(el.voiceToggle.checked);
    syncAudioButtons();
    el.title.classList.add("hidden");
    beginGame();
  }

  function beginGame() {
    state.stats = { talent:50, capital:50, network:50, impact:50 };
    state.log = [];
    state.currentNpc = null;
    state.waiting = null;
    el.ceo.innerHTML = "";
    el.hud.classList.remove("hidden");
    el.audioCtrls.classList.remove("hidden");
    renderMeters();
    go(STORY.start);
  }

  /* ---- audio toggle buttons ---- */
  function syncAudioButtons() {
    el.btnMusic.classList.toggle("on", Music.isOn());
    el.btnMusic.classList.toggle("off", !Music.isOn());
    el.btnVoice.textContent = Voice.isOn() ? "🔊" : "🔇";
    el.btnVoice.classList.toggle("on", Voice.isOn());
    el.btnVoice.classList.toggle("off", !Voice.isOn());
  }
  el.btnMusic.addEventListener("click", () => { Music.setOn(!Music.isOn()); syncAudioButtons(); });
  el.btnVoice.addEventListener("click", () => { Voice.setOn(!Voice.isOn()); syncAudioButtons(); });

  el.startBtn.addEventListener("click", start);

  // preload scene + character art so scenes never flash black on transition
  (function preload() {
    ["lab","boardroom","office","ministry","press","field"].forEach(k => {
      const i = new Image(); i.src = "assets/bg/" + k + ".jpg";
    });
    Object.values(CHARACTERS).forEach(c => {
      if (c.img) { const i = new Image(); i.src = c.img; }
    });
  })();

  // expose a tiny debug hook
  window.WATERGEN = { state, go, beginGame };

})();
