// Boas Práticas na Receção — Ribeira Palace
// Motor do curso: navegação entre ecrãs, áudio, parallax e lógica de escolha múltipla.

const stageContent = document.getElementById("stageContent");
const stageTopbar = document.getElementById("stageTopbar");
const topbarFrame = document.querySelector(".topbar-frame");
const topbarProgress = document.getElementById("topbarProgress");
const btnMute = document.getElementById("btnMute");
const btnMusicMute = document.getElementById("btnMusicMute");
const btnLang = document.getElementById("btnLang");
const btnExit = document.getElementById("btnExit");
const btnFullscreen = document.getElementById("btnFullscreen");

const state = {
  screen: "entrada",
  moduleIdx: 0,
  beats: [],
  beatIdx: 0,
  completed: new Set(),
  muted: false,
  musicMuted: false,
  menuFase: null,
  // Idioma escolhido no ecrã de entrada — por agora só decide qual bandeira
  // aparece no ícone da barra superior (mostra o idioma ATUAL, o que já
  // estamos a usar); ainda não muda nenhum texto/áudio do curso, isso só
  // quando existir mesmo conteúdo em inglês (ver ASSETS.bandeiraRound).
  lang: "pt",
};

// Módulos e textos de interface do idioma ATUAL — ver MODULES_BY_LANG e
// STRINGS em data.js. Tudo o que main.js desenha a partir daqui passa por
// mods()/t() em vez de referenciar MODULES/STRINGS diretamente, para que
// trocar de idioma a meio do curso (ver btnLang) baste voltar a desenhar o
// ecrã atual.
function mods() { return MODULES_BY_LANG[state.lang]; }
function t(key) { return STRINGS[state.lang][key]; }

// ---------------- PALCO 16:9 (canvas fixo 1920x1080 + escala) ----------------
// O palco é sempre desenhado num canvas de 1920x1080 (mesma resolução dos
// templates de fala) e depois escalado inteiro (CSS transform: scale) para
// caber na janela. Como nada nunca muda de layout — só o "zoom" muda — o
// formato fica sempre bloqueado (nunca corta, nunca deforma), seja em janela
// normal, maximizada, ou em ecrã inteiro; sobra espaço em barras pretas quando
// a proporção da janela não é 16:9, exatamente como o "letterbox" de um vídeo.
const CANVAS_W = 1920, CANVAS_H = 1080;

function layoutStage() {
  const stage = document.getElementById("stage");
  if (!stage) return;
  const availW = window.innerWidth;
  const availH = window.innerHeight;
  const factor = Math.min(availW / CANVAS_W, availH / CANVAS_H);
  const offsetX = (availW - CANVAS_W * factor) / 2;
  const offsetY = (availH - CANVAS_H * factor) / 2;
  stage.style.transform = `scale(${factor})`;
  stage.style.left = offsetX + "px";
  stage.style.top = offsetY + "px";
}
window.addEventListener("resize", layoutStage);
document.addEventListener("fullscreenchange", layoutStage);

function setScreen(innerHtml) {
  stageContent.innerHTML = innerHtml;
  layoutStage();
}

// Só usado dentro dos módulos, a partir do fim do vídeo (falas, [CURSO],
// opções, feedback) — entrada, menu, vídeo e ecrã final trocam sem fade.
// "slow" usa um fade mais suave e lento (1.4s em vez de 0.35s), reservado
// para transições específicas (fachada→receção, última fala→resumo).
function setScreenFade(innerHtml, slow) {
  const cls = slow ? "fade-in-slow" : "fade-in";
  stageContent.innerHTML = `<div class="${cls}">${innerHtml}</div>`;
  layoutStage();
}

// ---------------- PERSISTÊNCIA ----------------

function loadProgress() {
  try {
    const raw = localStorage.getItem("rp_progress");
    if (raw) {
      const data = JSON.parse(raw);
      (data.completed || []).forEach((n) => state.completed.add(n));
      state.muted = !!data.muted;
      state.musicMuted = !!data.musicMuted;
      state.lang = data.lang === "en" ? "en" : "pt";
    }
  } catch (e) { /* ignora */ }
}
function saveProgress() {
  try {
    localStorage.setItem("rp_progress", JSON.stringify({
      completed: Array.from(state.completed),
      muted: state.muted,
      musicMuted: state.musicMuted,
      lang: state.lang,
    }));
  } catch (e) { /* ignora */ }
}

// ---------------- ÁUDIO ----------------

// Volumes mais baixos para sons que tocam muito repetidamente (hover) — os
// restantes ficam ao volume normal (1).
const SFX_VOLUME = { hover: 0.25, tel1: 0.35, tel2: 0.35, email: 0.35, correta: 0.35, errada: 0.35, suspense: 0.35 };

const audioCache = {};
function getAudio(key) {
  if (!audioCache[key]) {
    const a = new Audio(ASSETS.sfx[key]);
    a.volume = SFX_VOLUME[key] ?? 1;
    audioCache[key] = a;
  }
  return audioCache[key];
}
// Atribuir currentTime a um <audio> que ainda não carregou (ligação lenta,
// ficheiro momentaneamente indisponível — mais comum em discos de rede) pode
// lançar um erro síncrono (InvalidStateError). Sem este try/catch, esse erro
// interrompia a função a meio — ex.: renderOptionsScreen() nunca chegava a
// desenhar as opções de resposta, ficando o ecrã sem nada clicável. O som
// nunca deve poder impedir a interface de aparecer.
function safeResetTime(a) {
  try { a.currentTime = 0; } catch (e) { /* ignora — o som é só um extra */ }
}

let currentLoop = null;
function playLoop(key) {
  stopLoop();
  const a = getAudio(key);
  a.loop = true;
  a.muted = state.muted;
  safeResetTime(a);
  a.play().catch(() => {});
  currentLoop = a;
}
function stopLoop() {
  if (currentLoop) {
    currentLoop.pause();
    safeResetTime(currentLoop);
    currentLoop = null;
  }
}
function playOnce(key) {
  const a = getAudio(key);
  a.muted = state.muted;
  safeResetTime(a);
  a.play().catch(() => {});
}

// Som ambiente de fundo (interior/exterior do hotel) — canal à parte do
// currentLoop acima (esse é só para o toque de telefone/email do [CURSO]),
// para os dois poderem tocar ao mesmo tempo, ex.: o telefone a tocar por
// cima do ambiente da receção. Troca sozinho consoante o fundo da cena
// atual (ver setAmbient, chamado em cada ecrã/beat).
const AMBIENT_VOLUME = 0.25;
let ambientAudio = null;
let ambientKey = null;
function setAmbient(key) {
  if (key === ambientKey) return;
  ambientKey = key;
  if (ambientAudio) {
    ambientAudio.pause();
    ambientAudio = null;
  }
  // A música só volta a subir (fade in) quando se chega à receção — antes
  // disso (vídeo, fachada) fica desvanecida, ver o click nos cartões do
  // menu, que a desvanece (fade out) ao iniciar um módulo.
  if (key === "receção") fadeMusicVolume(MUSIC_VOLUME, 1500);
  if (!key) return;
  const src = key === "receção" ? ASSETS.sfx.ambienteInterior : ASSETS.sfx.ambienteExterior;
  const a = new Audio(src);
  a.loop = true;
  a.volume = AMBIENT_VOLUME;
  a.muted = state.muted;
  a.play().catch(() => {});
  ambientAudio = a;
}

// Falas geradas por TTS (ver ASSETS.fala em data.js) — um canal à parte dos
// restantes, tocado por cima de cada balão quando já existe o ficheiro de
// áudio correspondente. Nem toda a fala tem áudio gravado ainda; se o
// ficheiro não existir, o erro é ignorado e a fala fica só com o texto,
// exatamente como antes de haver TTS.
let falaAudio = null;
// Locução de boas-vindas do menu, "destravada" ainda dentro do gesto de
// toque na escolha de idioma (ver renderEntrada) — no Safari/iOS um <audio>
// só pode arrancar sem gesto do utilizador se já tiver sido reproduzido
// pelo menos uma vez DENTRO de um gesto; como esta locução só toca ~9s
// depois (já sem gesto nenhum), ficava silenciosamente bloqueada em mobile
// sem este truque. Ver playMenuNarration().
let primedMenuAudio = null;
function playFala(folder, ref) {
  stopFala();
  if (!folder || !ref) return;
  const a = new Audio(ASSETS.fala(folder, ref, state.lang));
  a.muted = state.muted;
  a.play().catch(() => {});
  falaAudio = a;
}
function stopFala() {
  if (falaAudio) {
    falaAudio.pause();
    falaAudio = null;
  }
}

// Toca a locução do menu reutilizando o elemento "destravado" no clique da
// escolha de idioma (ver primedMenuAudio) — se por alguma razão não existir
// (ex.: chegou aqui sem passar pelo ecrã de entrada), cai no comportamento
// normal, que em mobile pode ficar silenciosamente bloqueado sem gesto.
function playMenuNarration() {
  stopFala();
  if (primedMenuAudio) {
    const a = primedMenuAudio;
    primedMenuAudio = null;
    a.muted = state.muted;
    a.currentTime = 0;
    a.play().catch(() => {});
    falaAudio = a;
  } else {
    playFala("curso", "MENU");
  }
}

function setMuted(m) {
  state.muted = m;
  Object.values(audioCache).forEach((a) => (a.muted = m));
  if (ambientAudio) ambientAudio.muted = m;
  if (falaAudio) falaAudio.muted = m;
  const video = document.getElementById("droneVideo");
  if (video) video.muted = m;
  saveProgress();
  updateMuteIcon();
}
function updateMuteIcon() {
  btnMute.classList.toggle("muted", state.muted);
  const waveLines = document.getElementById("waveLines");
  const muteLines = document.getElementById("muteLines");
  if (waveLines) waveLines.style.display = state.muted ? "none" : "";
  if (muteLines) muteLines.style.display = state.muted ? "" : "none";
}

// Música de fundo — playlist das 4 faixas de assets/musica_ambiente, em loop
// contínuo (repete a playlist toda ao chegar à última) ao longo de TODO o
// curso, incluindo a capa e o menu, sem cortar entre ecrãs. Só arranca no
// primeiro clique do formando, porque os browsers bloqueiam áudio com som
// antes de uma interação — a escolha de idioma é sempre o primeiro clique.
const MUSIC_VOLUME = 0.04275;
// Enquanto se escolhe uma resposta, a música baixa bastante (quase inaudível)
// para dar destaque à tensão do "sfx_suspense_perguntas" — ver renderOptionsScreen
// (duck) e showFeedback (volta ao nível normal assim que se responde.
const MUSIC_VOLUME_DUCKED = 0.0247;
let musicAudio = null;
let musicIdx = 0;
let musicStarted = false;
// Nível de volume "atual" da música, à parte de MUSIC_VOLUME — este último é
// só o alvo de repouso; musicVolumeNow segue o fade em curso (ver
// fadeMusicVolume) e sobrevive à troca de faixa a meio de um fade (a faixa
// seguinte arranca sempre no nível em que a anterior ia, não do zero).
let musicVolumeNow = MUSIC_VOLUME;
let musicFadeRaf = null;
function fadeMusicVolume(target, duration) {
  if (musicFadeRaf) cancelAnimationFrame(musicFadeRaf);
  const start = musicVolumeNow;
  const startTime = performance.now();
  (function step(now) {
    const t = Math.min(1, (now - startTime) / duration);
    musicVolumeNow = start + (target - start) * t;
    if (musicAudio) musicAudio.volume = musicVolumeNow;
    musicFadeRaf = t < 1 ? requestAnimationFrame(step) : null;
  })(startTime);
}
function playCurrentTrack() {
  musicAudio = new Audio(ASSETS.musica[musicIdx]);
  musicAudio.volume = musicVolumeNow;
  musicAudio.muted = state.musicMuted;
  musicAudio.addEventListener("ended", () => {
    musicIdx = (musicIdx + 1) % ASSETS.musica.length;
    playCurrentTrack();
  });
  musicAudio.play().catch(() => {});
}
function startMusicOnce() {
  if (musicStarted) return;
  musicStarted = true;
  musicIdx = Math.floor(Math.random() * ASSETS.musica.length);
  playCurrentTrack();
}
document.addEventListener("click", startMusicOnce, { once: true });

function setMusicMuted(m) {
  state.musicMuted = m;
  if (musicAudio) musicAudio.muted = m;
  saveProgress();
  updateMusicIcon();
}
function updateMusicIcon() {
  btnMusicMute.classList.toggle("muted", state.musicMuted);
  const slash = document.getElementById("musicMuteSlash");
  if (slash) slash.style.display = state.musicMuted ? "" : "none";
}

// Ícone de idioma — mostra a bandeira do idioma ATUAL.
function updateLangIcon() {
  const flag = document.getElementById("iconLangFlag");
  if (flag) flag.src = ASSETS.bandeiraRound[state.lang];
}

// Textos fixos que vivem FORA do stageContent (por isso nunca são
// redesenhados pelos vários render*()) — título do separador, atributo lang
// do documento, e os title/aria-label dos ícones da barra superior. Chamado
// no arranque e sempre que se troca de idioma (ver btnLang).
function applyChromeStrings() {
  document.title = t("docTitle");
  document.documentElement.lang = state.lang === "en" ? "en" : "pt-PT";
  const tagline = document.querySelector(".brand-tagline");
  if (tagline) tagline.textContent = t("tagline");
  btnFullscreen.title = t("fullscreen");
  btnFullscreen.setAttribute("aria-label", t("fullscreenAria"));
  btnMute.title = t("sound");
  btnMute.setAttribute("aria-label", t("soundAria"));
  btnMusicMute.title = t("music");
  btnMusicMute.setAttribute("aria-label", t("musicAria"));
  btnLang.title = t("lang");
  btnLang.setAttribute("aria-label", t("langAria"));
  btnExit.title = t("exit");
  btnExit.setAttribute("aria-label", t("exitAria"));
}

// Troca de idioma a meio do curso — muda o texto e reinicia o áudio do ecrã
// atual, tal como um "refresh" só daquele ecrã (ver conversa sobre isto: os
// beats já compilados usam sempre o texto do idioma em que foram gerados, por
// isso basta recompilá-los com mods() e voltar a desenhar o mesmo beatIdx).
function switchLanguage() {
  state.lang = state.lang === "en" ? "pt" : "en";
  saveProgress();
  updateLangIcon();
  applyChromeStrings();
  if (state.screen === "menu") {
    renderMenu();
  } else if (state.screen === "scene") {
    const mod = mods()[state.moduleIdx];
    state.beats = compileBeats(mod);
    renderBeat();
  } else if (state.screen === "resumo") {
    renderResumo(mods()[state.moduleIdx]);
  } else if (state.screen === "final") {
    renderFinal();
  }
  // "entrada" (barra escondida) e "video" (sem texto no ecrã) não precisam
  // de nada — a próxima vez que precisarem de mods() já vêm no idioma novo.
}
btnLang.addEventListener("click", switchLanguage);

// Hover SFX — delegado, dispara em qualquer .sfx-hover ativo. Alguns botões
// (.btn-gold) sobem/crescem ligeiramente no hover (transition de transform);
// isso pode fazer o browser recalcular o elemento por baixo do cursor a meio
// da transição e disparar um segundo "pointerenter" sem o rato se ter
// mesmo movido — por isso ignora repetições no mesmo elemento dentro de
// uma janela curta, em vez de tocar o som outra vez.
const lastHoverSfxAt = new WeakMap();
document.addEventListener("pointerenter", (e) => {
  const t = e.target;
  if (t && t.classList && t.classList.contains("sfx-hover") && !t.disabled) {
    const now = performance.now();
    if (now - (lastHoverSfxAt.get(t) || 0) > 300) {
      lastHoverSfxAt.set(t, now);
      playOnce("hover");
    }
  }
}, true);

// O mesmo som também toca ao clicar nos botões principais (Continuar, Tentar
// Novamente, Terminar) e nos ícones da barra superior (som, música, sair,
// ecrã inteiro), que antes só tocavam ao passar o rato por cima. As setas do
// carrossel de módulos (também .icon-btn.sfx-hover, mas fora da barra
// superior) já tocam o som no próprio clique, por isso ficam de fora aqui
// para não duplicar.
document.addEventListener("click", (e) => {
  const t = e.target.closest(".btn-gold.sfx-hover, .topbar-icons .icon-btn.sfx-hover, .idioma-option.sfx-hover");
  if (t && !t.disabled) playOnce("hover");
});

// ---------------- PARALLAX (rato / inclinação do telemóvel) ----------------

let mx = 0.5, my = 0.5, cx = 0.5, cy = 0.5;
let parallaxEl = null;

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

// ---------------- EFEITO DE ESCRITA (falas escritas letra a letra) ----------------

let typewriterTimer = null;

function typeText(el, fullText) {
  clearInterval(typewriterTimer);
  el.textContent = "";
  el.classList.add("typing");
  const totalMs = 1400;
  const perChar = clamp(totalMs / Math.max(fullText.length, 1), 8, 40);
  let i = 0;
  typewriterTimer = setInterval(() => {
    i++;
    el.textContent = fullText.slice(0, i);
    if (i >= fullText.length) {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
      el.classList.remove("typing");
    }
  }, perChar);
}

// Se ainda estiver a escrever, o clique completa o texto de imediato em vez
// de avançar logo para a próxima fala (evita saltar texto por engano).
function skipTyping(el, fullText) {
  if (typewriterTimer) {
    clearInterval(typewriterTimer);
    typewriterTimer = null;
    el.textContent = fullText;
    el.classList.remove("typing");
    return true;
  }
  return false;
}

window.addEventListener("mousemove", (e) => {
  const stage = document.getElementById("stage");
  if (!stage) return;
  const r = stage.getBoundingClientRect();
  mx = clamp((e.clientX - r.left) / r.width, 0, 1);
  my = clamp((e.clientY - r.top) / r.height, 0, 1);
});

window.addEventListener("deviceorientation", (e) => {
  if (e.gamma == null || e.beta == null) return;
  mx = clamp((e.gamma + 25) / 50, 0, 1);
  my = clamp((e.beta - 20) / 50, 0, 1);
});

function requestTiltPermission() {
  if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
    DeviceOrientationEvent.requestPermission().catch(() => {});
  }
  window.removeEventListener("click", requestTiltPermission);
  window.removeEventListener("touchstart", requestTiltPermission);
}
window.addEventListener("click", requestTiltPermission, { once: true });
window.addEventListener("touchstart", requestTiltPermission, { once: true });

// A fachada é um formato de imagem enorme (muito maior que os outros fundos),
// por isso pode levar um pouco mais de zoom sem perder qualidade.
function bgParallaxDiv(bgUrl) {
  const zoomClass = bgUrl === ASSETS.fachada ? " bg-zoom" : "";
  return `<div class="bg-parallax${zoomClass}" style="background-image:url('${bgUrl}')"></div>`;
}

function parallaxLoop() {
  cx += (mx - cx) * 0.06;
  cy += (my - cy) * 0.06;
  if (parallaxEl) {
    const dx = (cx - 0.5) * 2 * 22;
    const dy = (cy - 0.5) * 2 * 16;
    const scale = parallaxEl.classList.contains("bg-zoom") ? 1.2 : 1.02;
    parallaxEl.style.transform = `translate(${-dx}px, ${-dy}px) scale(${scale})`;
  }
  requestAnimationFrame(parallaxLoop);
}
requestAnimationFrame(parallaxLoop);

// ---------------- HELPERS ----------------

function escapeHtml(str) {
  return String(str).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

function avatarFor(speaker, mod, pose) {
  if (speaker === "joana") return { src: ASSETS.joana(pose || mod.joanaPose), name: t("joana") };
  // Módulos 2 e 4: a pessoa já está mesmo hospedada (quarto 214, check-out
  // feito) — "Hóspede"/"Guest" é mais rigoroso do que "Cliente"/"Customer".
  // Módulos 1 e 3 continuam "Cliente"/"Customer" (ainda não é hóspede: está
  // só a reservar, ou é o contacto de uma empresa por email).
  if (speaker === "cliente") return { src: ASSETS.cliente(mod.num), name: (mod.num === 2 || mod.num === 4) ? t("hospede") : t("cliente") };
  const recKey = (mod.num === 2 || mod.num === 4) ? "Marta" : "Miguel";
  return { src: ASSETS.utilizador(mod.num), name: `${t("recepcionista")} ${recKey}` };
}

function nextAvailableModuleNum() {
  for (const m of mods()) if (!state.completed.has(m.num)) return m.num;
  return null;
}

function moduleStateFor(num) {
  if (state.completed.has(num)) return "concluido";
  if (num === nextAvailableModuleNum()) return "disponivel";
  return "bloqueado";
}

function updateTopbar(overrideAnswered) {
  const hideTopbar = state.screen === "entrada";
  if (hideTopbar) {
    stageTopbar.hidden = true;
    topbarFrame.hidden = true;
    stageTopbar.classList.remove("showing");
    topbarFrame.classList.remove("showing");
  } else if (stageTopbar.hidden) {
    stageTopbar.hidden = false;
    topbarFrame.hidden = false;
    stageTopbar.classList.add("showing");
    topbarFrame.classList.add("showing");
  }
  // A barra de progresso só existe dentro de um módulo (vídeo + cena) e passou
  // a contar as situações de escolha múltipla respondidas corretamente nesse
  // módulo, não a fração de módulos concluídos no curso todo.
  const inModule = state.screen === "video" || state.screen === "scene";
  topbarProgress.hidden = !inModule;
  if (inModule) {
    const mod = mods()[state.moduleIdx];
    const total = mod.situacoes.length;
    let answered = 0;
    if (state.screen === "scene" && state.beats.length) {
      state.beats.forEach((b, i) => {
        if (b.type === "options" && i < state.beatIdx) answered++;
      });
    }
    if (typeof overrideAnswered === "number") answered = overrideAnswered;
    const pct = total ? (answered / total) * 100 : 0;
    topbarProgress.innerHTML = `<div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div><span class="progress-label">${answered}/${total}</span>`;
  }
}

// Poses de conversa da Joana (assets/layout_fala_joana) — quando há 2+ falas
// seguidas dela, cada uma usa a pose seguinte do ciclo em vez de repetir
// sempre a mesma, começando na pose "base" do módulo (mod.joanaPose). As
// poses de feedback (resposta_certa/resposta_errada) não entram neste ciclo.
const JOANA_CONVERSA_POSES = ["conversa_01", "conversa_02", "conversa_03", "conversa_04"];

// Referências das falas geradas por TTS (ver guiao/build_falas_tts.js — o
// mesmo esquema de nomes, para os ficheiros em assets/sfx_falas/ baterem
// certo com os beats). recFolder é a pasta do(a) rececionista deste módulo
// ("miguel" ou "marta", ver ASSETS.fala em data.js).
function compileBeats(mod) {
  const beats = [];
  const M = `M${mod.num}`;
  const recFolder = (mod.num === 2 || mod.num === 4) ? "marta" : "miguel";
  let joanaPoseIdx = Math.max(0, JOANA_CONVERSA_POSES.indexOf(mod.joanaPose));
  function joanaLine(text, bg, ref) {
    const pose = JOANA_CONVERSA_POSES[joanaPoseIdx % JOANA_CONVERSA_POSES.length];
    joanaPoseIdx++;
    return { type: "line", speaker: "joana", text, bg, pose, ref, falaFolder: "joana" };
  }
  const clienteFolder = `cliente_modulo_${mod.num}`;
  mod.intro.forEach((line, i) => beats.push(joanaLine(line.text, line.bg, `${M}.INTRO.${i + 1}`)));
  beats.push({ type: "curso", text: mod.curso, hotspotKey: mod.hotspotKey, sfxKey: mod.sfxCursor, hint: mod.cursoHint, ref: `${M}.CURSO`, falaFolder: "curso" });
  // Fala de atendimento do(a) rececionista a atender o telefone, antes do
  // cliente falar — só faz sentido em chamadas, não no módulo de email.
  if (mod.atendimento) beats.push({ type: "line", speaker: "tu", text: mod.atendimento, bg: "receção", ref: `${M}.ATENDIMENTO`, falaFolder: recFolder });
  mod.situacoes.forEach((sit, s) => {
    const S = `${M}.SIT${s + 1}`;
    // Interrupção pontual entre situações (ex.: módulo 4, o cliente desliga
    // e o telefone volta a tocar mais tarde) — reaparece um [CURSO] igual ao
    // do início do módulo antes de retomar as falas.
    if (sit.cursoAntes) {
      beats.push({ type: "curso", text: sit.cursoAntes.text, hotspotKey: mod.hotspotKey, sfxKey: mod.sfxCursor, hint: mod.cursoHint, ref: sit.cursoAntes.ref, falaFolder: "curso" });
    }
    beats.push({ type: "clientline", text: sit.cliente, bg: "receção", ref: `${S}.CLIENTE`, falaFolder: clienteFolder });
    beats.push({ type: "options", opcoes: sit.opcoes, resumo: sit.resumo, sitRef: S, resumoCompact: sit.resumoCompact });
    let tuIdx = 0, clienteIdx = 0;
    sit.ponte.forEach((p) => {
      if (p.who === "joana") {
        // Sem referência própria — não existe nenhum caso disto nos dados
        // atuais, e por isso também não entra no esquema do build_falas_tts.
        beats.push(joanaLine(p.text, "receção"));
      } else if (p.who === "tu") {
        tuIdx++;
        beats.push({ type: "line", speaker: "tu", text: p.text, bg: "receção", ref: `${S}.PONTE.TU.${tuIdx}`, falaFolder: recFolder });
      } else {
        clienteIdx++;
        beats.push({ type: "line", speaker: p.who, text: p.text, bg: "receção", ref: `${S}.PONTE.CLIENTE.${clienteIdx}`, falaFolder: clienteFolder });
      }
    });
  });
  let fechoJoanaIdx = 0;
  mod.fecho.forEach((f, i) => {
    if (f.who === "joana") {
      fechoJoanaIdx++;
      beats.push(joanaLine(f.text, "receção", `${M}.FECHO.JOANA.${fechoJoanaIdx}`));
    } else {
      beats.push({ type: "line", speaker: f.who, text: f.text, bg: "receção", ref: `${M}.FECHO.CLIENTE`, falaFolder: clienteFolder });
    }
    // A última fala do fecho (o "Parabéns..." que introduz o ecrã de boas
    // práticas) toca o som de feedback positivo, tal como o resto do curso
    // faz sempre que há uma "vitória" para celebrar.
    if (i === mod.fecho.length - 1 && mod.boasPraticas) beats[beats.length - 1].celebrate = true;
  });
  beats.push({ type: "end" });
  return beats;
}

// ---------------- ECRÃ DE ENTRADA (escolha de idioma + capa) ----------------
// O fundo é o mesmo do início ao fim, parado no frame inicial (antes do
// zoom out) enquanto só a escolha de idioma está visível, sem logo nem
// título — assim que se escolhe um idioma, é que aparecem o logótipo e a
// barra de carregamento (já no idioma escolhido) e começa o zoom out do
// fundo, tudo dentro do mesmo ecrã, sem cortes.

function renderEntrada() {
  state.screen = "entrada";
  parallaxEl = null;
  stopLoop();
  stopFala();
  setAmbient(null);
  updateTopbar();
  setScreen(`
    <div class="entrada-screen" id="entradaScreen">
      <div class="bg-cover entrada-bg" id="entradaBg" style="background-image:url('${ASSETS.capaEntrada}')"></div>
      <div class="overlay-dark entrada-overlay"></div>
      <div class="idioma-wrap" id="idiomaWrap">
        <p class="idioma-prompt">
          <span class="idioma-prompt-line">Escolhe o idioma</span>
          <span class="idioma-prompt-line">Choose your language</span>
        </p>
        <div class="idioma-options">
          <button class="idioma-option sfx-hover" data-lang="pt" type="button">
            <span class="idioma-flag"><img src="${ASSETS.bandeira.pt}" alt=""></span>
            <span class="idioma-label">Português</span>
          </button>
          <button class="idioma-option sfx-hover" data-lang="en" type="button">
            <span class="idioma-flag"><img src="${ASSETS.bandeira.en}" alt=""></span>
            <span class="idioma-label">English</span>
          </button>
        </div>
      </div>
      <p class="idioma-credit"><span class="final-credit-line1">Idealizado · Desenhado · Desenvolvido</span><br>por <span class="final-credit-strong">André Alves</span> · <a href="mailto:andreralvesdesign@gmail.com">andreralvesdesign@gmail.com</a></p>
      <div class="hero-screen" id="heroEntrada">
        <div class="capa-content">
          <img class="capa-logo" src="${ASSETS.logoSymbol}" alt="">
          <h1 class="capa-brand">RIBEIRA<br>PALACE</h1>
        </div>
        <div class="capa-loading-wrap">
          <div class="hero-autobar"><div class="hero-autobar-fill"></div></div>
          <div class="capa-loading-meta">
            <span>${t("loading")}</span>
            <span class="capa-loading-pct" id="capaPct">0%</span>
          </div>
        </div>
      </div>
    </div>`);

  const FILL_DELAY = 1800;
  const FILL_DUR = 6500;
  const AUTO_DELAY = 8700;
  const SCREEN_FADE_DUR = 1400;

  const idiomaWrap = document.getElementById("idiomaWrap");
  const heroEntrada = document.getElementById("heroEntrada");
  const entradaBg = document.getElementById("entradaBg");

  stageContent.querySelectorAll(".idioma-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.screen !== "entrada" || heroEntrada.classList.contains("entrada-anim")) return;
      state.lang = btn.dataset.lang;
      saveProgress();
      updateLangIcon();
      applyChromeStrings();
      // Destrava a locução do menu AINDA dentro deste gesto de toque (toca
      // muda e pausa de imediato — impercetível) para o Safari/iOS permitir
      // tocá-la a sério daqui a uns segundos, já sem gesto. Ver
      // playMenuNarration() e a nota junto de primedMenuAudio.
      //
      // O pause() tem de ser chamado JÁ A SEGUIR ao play(), fora do
      // .then() — não dentro dele. No Safari/iOS a promessa devolvida por
      // play() por vezes demora vários segundos a resolver (ou nunca chega
      // a resolver/rejeitar) enquanto o ficheiro descarrega, e como o
      // pause() só corria dentro desse .then(), o áudio ficava a tocar a
      // sério durante esse tempo todo — foi o que se ouvia no ecrã de
      // entrada. Ao chamar pause() logo de seguida, de forma síncrona, o
      // elemento fica pausado mesmo que a promessa nunca resolva.
      primedMenuAudio = new Audio(ASSETS.fala("curso", "MENU", state.lang));
      primedMenuAudio.muted = true;
      const primePlay = primedMenuAudio.play();
      primedMenuAudio.pause();
      primedMenuAudio.currentTime = 0;
      primedMenuAudio.muted = false;
      if (primePlay) primePlay.catch(() => {});
      const loadingLabel = heroEntrada.querySelector(".capa-loading-meta span:first-child");
      if (loadingLabel) loadingLabel.textContent = t("loading");
      idiomaWrap.classList.add("exit");
      entradaBg.classList.add("zooming");
      heroEntrada.classList.add("entrada-anim");
      document.querySelector(".hero-autobar-fill").classList.add("filling");

      const pctEl = document.getElementById("capaPct");
      const fillStart = performance.now() + FILL_DELAY;
      (function tickPct() {
        const t = Math.min(1, Math.max(0, (performance.now() - fillStart) / FILL_DUR));
        if (pctEl) pctEl.textContent = Math.round(t * 100) + "%";
        if (t < 1) requestAnimationFrame(tickPct);
      })();

      setTimeout(() => {
        // Guarda contra o formando já ter saído do ecrã de entrada
        // entretanto — sem isto, este temporizador dispara sempre ao fim de
        // AUTO_DELAY e força a ida para o menu por cima de QUALQUER ecrã em
        // que o formando já esteja, mesmo a meio de um módulo.
        if (state.screen !== "entrada") return;
        // Todo o ecrã da capa (fundo, overlay, logo, texto) desvanece junto
        // e devagar para preto — e o menu que se segue entra também a
        // partir do preto (ver menu-fade-in em renderMenu), fazendo um fade
        // completo capa → preto → menu em vez de cortar de repente.
        const entradaScreen = document.getElementById("entradaScreen");
        if (entradaScreen) entradaScreen.classList.add("exit");
        setTimeout(() => {
          if (state.screen !== "entrada") return;
          renderMenu({ fadeFromBlack: true });
        }, SCREEN_FADE_DUR);
      }, AUTO_DELAY);
    });
  });
}

// ---------------- MENU DE MÓDULOS ----------------

// Duração da fase 1 da saída do menu (ver click em .menu-card.disponivel) —
// tem de bater certo com a transição de opacidade das mesmas classes em
// style.css (.menu-info, .menu-modules-head, .menu-track-viewport,
// .menu-personagens, .menu-gradiente).
const MENU_EXIT_STAGE1_DUR = 1600;

function assetStateFor(st) {
  return st === "disponivel" ? "desbloqueado" : st;
}

function menuCardIcon(st, num) {
  const goldId = `menuIconGold${num}`;
  const whiteId = `menuIconWhite${num}`;
  // gradientUnits="userSpaceOnUse" com as mesmas coordenadas do viewBox (em
  // vez do objectBoundingBox por omissão) garante UM só gradiente contínuo
  // sobre o ícone inteiro — senão cada forma (círculo, retângulo, traço do
  // cadeado) recalcula o gradiente sobre a sua própria caixa e o ícone fica
  // com "vários gradientes" descosidos em vez de um só.
  const goldDefs = `<defs><linearGradient id="${goldId}" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="22" y2="22"><stop offset="0%" stop-color="#f2e0b8"/><stop offset="40%" stop-color="#deb76f"/><stop offset="70%" stop-color="#b98f52"/><stop offset="100%" stop-color="#8a6a35"/></linearGradient></defs>`;
  const whiteDefs = `<defs><linearGradient id="${whiteId}" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="22" y2="22"><stop offset="0%" stop-color="#ffffff"/><stop offset="55%" stop-color="#f5f1e8"/><stop offset="100%" stop-color="#cfc7b2"/></linearGradient></defs>`;
  if (st === "disponivel") {
    return `<span class="menu-card-icon"><svg viewBox="0 0 24 24">${goldDefs}<circle cx="12" cy="12" r="11" fill="rgba(10,8,4,0.55)" stroke="url(#${goldId})" stroke-width="1.4"/><path d="M9.7 7.6l7.6 4.4-7.6 4.4z" fill="url(#${goldId})"/></svg></span>`;
  }
  if (st === "concluido") {
    return `<span class="menu-card-icon"><svg viewBox="0 0 24 24" fill="none">${whiteDefs}<circle cx="12" cy="12" r="11" fill="rgba(10,8,4,0.55)" stroke="url(#${whiteId})" stroke-width="1.4"/><path d="M7.5 12.4l3 3 6.2-6.6" stroke="url(#${whiteId})" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/></svg></span>`;
  }
  return `<span class="menu-card-icon"><svg viewBox="0 0 24 24" fill="none">${goldDefs}<circle cx="12" cy="12" r="11" fill="rgba(10,8,4,0.55)" stroke="url(#${goldId})" stroke-width="1.4"/><rect x="7.5" y="11" width="9" height="7" stroke="url(#${goldId})" stroke-width="1.1" stroke-linejoin="miter"/><path d="M9 11V9a3 3 0 0 1 6 0v2" stroke="url(#${goldId})" stroke-width="1.1" stroke-linecap="square"/></svg></span>`;
}

function renderMenu(opts) {
  state.screen = "menu";
  parallaxEl = null;
  stopLoop();
  stopFala();
  setAmbient(null);
  updateTopbar();

  // Sempre que se chega ao menu (não só na primeira vez), a fase do scroll
  // acompanha o módulo atual — ex.: ao concluir o Módulo 1 e voltar ao menu
  // para o Módulo 2, abre logo na fase 2, independentemente de onde o
  // formando tivesse deixado o scroll numa visita anterior.
  state.menuFase = (nextAvailableModuleNum() ?? mods()[0].num) - 1;

  // Os textos (número + título) vivem numa camada à parte (.menu-labels-*),
  // por cima do gradiente inferior — se ficassem dentro do próprio cartão,
  // nunca conseguiriam pintar por cima do gradiente (que é um IRMÃO do
  // cartão com z-index maior): z-index só ordena elementos dentro do MESMO
  // contexto de empilhamento, nunca deixa um descendente ultrapassar um
  // contexto irmão do seu antepassado. As duas camadas usam exatamente a
  // mesma largura/gap/deslocamento (ver applyFase), por isso continuam
  // sempre alinhadas com o respetivo cartão.
  const cards = mods().map((mod) => {
    const st = moduleStateFor(mod.num);
    const clickable = st === "disponivel" ? "sfx-hover" : "";
    return `
      <div class="menu-card ${st} ${clickable}" data-num="${mod.num}">
        <div class="menu-card-art" style="background-image:url('${ASSETS.menuCard(mod.num, assetStateFor(st))}')">
          <span class="menu-card-hover-fx"></span>
          ${menuCardIcon(st, mod.num)}
        </div>
      </div>`;
  }).join("");

  const labels = mods().map((mod) => {
    const st = moduleStateFor(mod.num);
    return `
      <div class="menu-label-item ${st}">
        <span class="menu-card-num">${t("moduloPrefix")} ${mod.num}</span>
        <span class="menu-card-title">${escapeHtml(mod.title)}</span>
      </div>`;
  }).join("");

  const fadeFromBlack = !!(opts && opts.fadeFromBlack);
  setScreen(`
    <div class="menu-screen${fadeFromBlack ? " menu-fade-in" : ""}">
      <div class="bg-cover menu-bg" style="background-image:url('${ASSETS.menuBg}')"></div>
      <div class="bg-cover menu-personagens" style="background-image:url('${ASSETS.menuPersonagens}')"></div>
      <div class="menu-gradiente"></div>

      <div class="menu-info" id="menuInfo">
        <h2 class="menu-info-title" id="menuTitle"></h2>
        <p class="menu-info-desc" id="menuDesc"></p>
      </div>

      <div class="menu-modules-head">
        <span class="menu-modules-label">${t("modulos")}</span>
        <div class="menu-arrows">
          <button class="icon-btn sfx-hover" id="menuPrev" aria-label="${t("modulosAnteriores")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>
          </button>
          <button class="icon-btn sfx-hover" id="menuNext" aria-label="${t("modulosSeguintes")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      <div class="menu-track-viewport" id="menuViewport">
        <div class="menu-track" id="menuTrack">${cards}</div>
      </div>
      <div class="menu-labels-viewport">
        <div class="menu-labels-track" id="menuLabelsTrack">${labels}</div>
      </div>
    </div>`);

  const track = document.getElementById("menuTrack");
  const labelsTrack = document.getElementById("menuLabelsTrack");
  const prevBtn = document.getElementById("menuPrev");
  const nextBtn = document.getElementById("menuNext");
  const NUM_FASES = mods().length;

  // Quebra manual só no título grande do menu (não no nome pequeno por baixo
  // do cartão, que usa mod.title tal como está) — módulos 2 e 3 partem antes
  // de "Uma"/"An" em vez de onde o navegador calhar a quebrar sozinho.
  const MENU_TITLE_BREAK = {
    pt: { 2: "Um Problema,\nUma Solução", 3: "Um Email,\nUma Oportunidade" },
    en: { 2: "A Problem,\nA Solution", 3: "An Email,\nAn Opportunity" },
  };
  function updateInfo(num) {
    const mod = mods().find((m) => m.num === num);
    if (!mod) return;
    document.getElementById("menuTitle").textContent = MENU_TITLE_BREAK[state.lang][mod.num] || mod.title;
    document.getElementById("menuDesc").textContent = mod.descricaoMenu;
    // Pequeno fade+slide ao trocar de fase, para o texto nunca "saltar"
    // de um módulo para o outro de forma abrupta.
    const infoEl = document.getElementById("menuInfo");
    infoEl.classList.remove("menu-info-anim");
    void infoEl.offsetWidth;
    infoEl.classList.add("menu-info-anim");
  }

  // O scroll horizontal tem sempre exatamente 4 "paragens" (uma por módulo),
  // percorríveis pelas setas independentemente de quais módulos já estão
  // desbloqueados — o texto de cima segue a paragem, não o cartão sob o rato.
  // Os deslocamentos vêm das posições reais desenhadas em
  // assets/layout_menu/assets/frames_modulos (fase_scroll_1..4): cada módulo
  // só tem export numa fase se ainda estivesse visível nela — os valores
  // abaixo reproduzem exatamente essas posições (não é um scroll uniforme).
  // O viewport ocupa o palco 1920px inteiro (não só a partir dos 40px onde o
  // 1º cartão assenta em repouso) para que, ao "espreitar" o cartão seguinte
  // ou anterior, ele possa mesmo chegar até à borda esquerda real do ecrã,
  // tal como acontece nos ficheiros originais — 40px é só a posição de
  // repouso do 1º cartão, não o limite do scroll.
  const MENU_FASE_OFFSETS = [40, -327, -877, -1424];
  function applyFase() {
    track.style.transform = `translateX(${MENU_FASE_OFFSETS[state.menuFase]}px)`;
    labelsTrack.style.transform = track.style.transform;
    prevBtn.disabled = state.menuFase <= 0;
    nextBtn.disabled = state.menuFase >= NUM_FASES - 1;
    updateInfo(state.menuFase + 1);
  }
  prevBtn.addEventListener("click", () => { playOnce("hover"); state.menuFase = Math.max(0, state.menuFase - 1); applyFase(); });
  nextBtn.addEventListener("click", () => { playOnce("hover"); state.menuFase = Math.min(NUM_FASES - 1, state.menuFase + 1); applyFase(); });
  applyFase();

  stageContent.querySelectorAll(".menu-card.disponivel").forEach((card) => {
    const num = parseInt(card.dataset.num, 10);
    card.addEventListener("click", () => {
      playOnce("hover");
      // Fase 1: tudo o que não é o fundo aéreo (texto, cartões, personagens,
      // gradiente) desvanece primeiro, devagar. Só depois de terminar é que
      // começa a fase 2, o crossfade do fundo para o vídeo (ver renderVideo).
      const screenEl = document.querySelector(".menu-screen");
      screenEl.classList.add("menu-exit");
      // A locução de boas-vindas do menu para logo aqui, no clique — sem
      // isto, ficava a tocar por cima da transição e do vídeo até à primeira
      // fala do módulo (só aí é que playFala() a substituía).
      stopFala();
      // A música não para, só desvanece — sem isto tocava por cima do vídeo
      // e da fachada; só volta a subir (fade in) quando se chega à receção,
      // ver setAmbient("receção").
      fadeMusicVolume(0, MENU_EXIT_STAGE1_DUR);
      setTimeout(() => startModule(num, { crossfade: true }), MENU_EXIT_STAGE1_DUR);
    });
  });

  // Locução de boas-vindas toca sempre que se chega ao menu enquanto ainda
  // estivermos no "primeiro menu" (nenhum módulo concluído, o Módulo 1 é o
  // único disponível) — mesmo que já tenha tocado antes (ex.: recarregar a
  // página) — mas nunca mais depois de concluir o primeiro módulo. Fica no
  // fim de propósito: todo o menu (cartões, setas) já está montado e
  // clicável antes desta chamada de áudio, para uma falha aqui nunca poder
  // deixar o menu inoperável.
  if (state.completed.size === 0) playMenuNarration();
  // Aproveita o tempo que o formando passa a olhar para o menu (antes de
  // clicar) para começar já a aquecer a cache do único módulo que está
  // desbloqueado agora — ver prefetchModuleAssets(). Agendado (nunca
  // imediato) de propósito: as imagens do PRÓPRIO menu (cartões, avatares)
  // acabaram de ser pedidas pelo browser mesmo antes desta linha correr, e
  // essas é que têm de chegar primeiro — ver schedulePrefetch().
  const nextNum = nextAvailableModuleNum();
  if (nextNum != null) {
    const nextMod = mods().find((m) => m.num === nextNum);
    schedulePrefetch(() => prefetchModuleAssets(nextMod));
  }
}

// ---------------- PRÉ-CARREGAMENTO DE ASSETS DO PRÓXIMO MÓDULO ----------------
// No menu só há sempre UM módulo clicável (o próximo por desbloquear — ver
// nextAvailableModuleNum()), por isso não há adivinhação nenhuma: descarrega
// já, em segundo plano, os backgrounds, os PNGs dos balões de fala e os
// áudios das falas desse módulo (ver compileBeats), para chegarem quentes na
// cache HTTP do browser quando o formando realmente clicar — sem isto,
// ligações lentas podiam deixar o ecrã vazio por alguns segundos a meio do
// módulo. Não muda nada visualmente: os ficheiros continuam a ser pedidos e
// tocados/mostrados da forma normal quando o beat correspondente é
// desenhado a sério; isto só chega primeiro. Guardado por módulo+idioma para
// nunca repetir o mesmo pedido em segundo plano (ex.: voltar ao mesmo menu
// várias vezes sem completar nada).
//
// As imagens do próprio menu (cartões, avatares dos módulos concluídos) são
// pedidas pelo browser assim que o HTML do menu é inserido, mesmo antes de
// chegarmos a este código — mas em ligações lentas/HTTP1.1 (poucas ligações
// paralelas ao mesmo servidor) uma rajada destes pedidos extra a começar
// LOGO a seguir ainda podia disputar a mesma banda larga e atrasar as
// imagens do próprio menu. Por isso: (1) schedulePrefetch() adia o arranque
// até o browser estar ocioso (ou, no máximo, até 2.5s depois — nunca para
// sempre, mesmo que o browser esteja sempre ocupado); (2) fetchPriority
// "low"/priority "low" (suportado no Chrome/Edge recentes; ignorado sem
// erro nos restantes) marca mesmo estes pedidos como menos urgentes do que
// tudo o resto que o browser já esteja a pedir.
function schedulePrefetch(fn) {
  if (typeof requestIdleCallback === "function") requestIdleCallback(fn, { timeout: 2500 });
  else setTimeout(fn, 1200);
}
const prefetchedModules = new Set();
function prefetchModuleAssets(mod) {
  if (!mod) return;
  const key = `${mod.num}:${state.lang}`;
  if (prefetchedModules.has(key)) return;
  prefetchedModules.add(key);

  const beats = compileBeats(mod);
  const imgUrls = new Set();
  const audioUrls = new Set();
  beats.forEach((beat) => {
    const bgUrl = ASSETS[beat.bg || "receção"];
    if (bgUrl) imgUrls.add(bgUrl);
    if (beat.type === "line" || beat.type === "clientline") {
      const speaker = beat.type === "clientline" ? "cliente" : beat.speaker;
      imgUrls.add(avatarFor(speaker, mod, beat.pose).src);
    }
    if (beat.falaFolder && beat.ref) {
      audioUrls.add(ASSETS.fala(beat.falaFolder, beat.ref, state.lang));
    }
  });
  // Imagens: new Image() basta — os browsers descarregam-nas sem precisar de
  // gesto do utilizador nem de estarem no DOM.
  imgUrls.forEach((url) => {
    const img = new Image();
    img.fetchPriority = "low";
    img.src = url;
  });
  // Áudio: um <audio> sem estar a tocar nem sempre descarrega a sério em
  // todos os browsers (ex.: Safari só carrega metadados até haver play()) —
  // um fetch() simples força o ficheiro a ser pedido e guardado na cache
  // HTTP, sem tocar nada. Falhas (fala ainda sem áudio gravado, offline,
  // etc.) são ignoradas de propósito: isto é só um bónus, nunca pode
  // impedir o módulo de funcionar normalmente já sem cache.
  audioUrls.forEach((url) => {
    fetch(url, { cache: "force-cache", priority: "low" }).catch(() => {});
  });
}

function startModule(num, opts) {
  state.moduleIdx = mods().findIndex((m) => m.num === num);
  renderVideo(mods()[state.moduleIdx], opts);
}

// ---------------- VÍDEO DE DESCIDA ----------------

function renderVideo(mod, opts) {
  state.screen = "video";
  parallaxEl = null;
  setAmbient(null);
  updateTopbar();
  const crossfade = !!(opts && opts.crossfade);
  const html = `<div class="video-screen"><video id="droneVideo" src="${ASSETS.drone}" autoplay muted playsinline></video></div>`;

  // Crossfade real a partir do menu: o vídeo entra por cima do ecrã do
  // menu (que fica intacto por baixo) e desvanece de opacidade 0 a 1,
  // em vez de cortar bruscamente ou passar por um preto no meio.
  let prevScreen = null;
  if (crossfade) {
    prevScreen = stageContent.firstElementChild;
    stageContent.insertAdjacentHTML("beforeend", html);
  } else {
    setScreen(html);
  }

  const video = document.getElementById("droneVideo");
  video.muted = state.muted;

  if (crossfade) {
    const videoScreen = video.parentElement;
    videoScreen.classList.add("video-crossfade");
    void videoScreen.offsetWidth; // força reflow para a transição arrancar
    videoScreen.classList.add("in");
    setTimeout(() => { if (prevScreen && prevScreen.parentNode) prevScreen.remove(); }, 1400);
  }

  const advance = () => {
    // Vai buscar o módulo de novo (em vez de usar o "mod" capturado acima)
    // para o caso raro de o idioma ter mudado enquanto o vídeo tocava.
    state.beats = compileBeats(mods()[state.moduleIdx]);
    state.beatIdx = 0;
    renderBeat();
  };
  video.addEventListener("ended", advance);
  video.addEventListener("error", advance);
}

// ---------------- CENA (fachada / receção) — MOTOR DE BEATS ----------------

function renderBeat() {
  const mod = mods()[state.moduleIdx];
  const beat = state.beats[state.beatIdx];
  state.screen = "scene";
  updateTopbar();

  if (beat.type === "end") {
    stopLoop();
    state.completed.add(mod.num);
    saveProgress();
    if (mod.boasPraticas) renderResumo(mod);
    else if (state.completed.size >= mods().length) renderFinal();
    else renderMenu();
    return;
  }

  const bgKey = beat.bg || "receção";
  const bgUrl = ASSETS[bgKey];
  setAmbient(bgKey);
  // Deteta a transição fachada → receção (só acontece uma vez, a meio da
  // introdução de cada módulo) para lhe aplicar um fade mais lento e suave,
  // sem mexer no fade normal (rápido) entre as restantes falas.
  const prevBeat = state.beatIdx > 0 ? state.beats[state.beatIdx - 1] : null;
  const prevBgKey = prevBeat ? (prevBeat.bg || "receção") : null;
  const slowFade = prevBgKey === "fachada" && bgKey === "receção";

  if (beat.type === "curso") {
    setScreenFade(`
      ${bgParallaxDiv(bgUrl)}
      <div class="hotspot sfx-hover" id="hotspot" style="left:${HOTSPOTS[beat.hotspotKey].left};top:${HOTSPOTS[beat.hotspotKey].top}"></div>
      <div class="curso-overlay">
        <div class="curso-box">
          <p>${escapeHtml(beat.text)}</p>
          <div class="curso-hint">${escapeHtml(beat.hint)}</div>
        </div>
      </div>`);
    parallaxEl = stageContent.querySelector(".bg-parallax");
    // O clique tem de ficar sempre operacional mesmo que o som falhe (ligação
    // lenta, ficheiro indisponível num disco de rede, etc.) — por isso o
    // listener é ligado ANTES de qualquer chamada de áudio, nunca depois.
    document.getElementById("hotspot").addEventListener("click", () => {
      stopLoop();
      stopFala();
      state.beatIdx++;
      renderBeat();
    });
    playLoop(beat.sfxKey);
    playFala(beat.falaFolder, beat.ref);
    return;
  }

  if (beat.type === "line" || beat.type === "clientline") {
    const speaker = beat.type === "clientline" ? "cliente" : beat.speaker;
    if (beat.celebrate) playOnce("correta");
    renderCard(bgUrl, avatarFor(speaker, mod, beat.pose), beat.text, t("continuar"), () => {
      state.beatIdx++;
      renderBeat();
    }, null, slowFade, beat.falaFolder, beat.ref);
    return;
  }

  if (beat.type === "options") {
    renderOptionsScreen(mod, bgUrl, beat.opcoes, beat.resumo, beat.sitRef, beat.resumoCompact);
    return;
  }
}

// Desenha um cartão de fala: usa sempre o template base (avatar + caixa já
// desenhados num canvas 1920x1080 — assets/layout_fala_.../final/) como imagem
// de fundo do cartão (.card-frame) e escreve nome/texto/botão exatamente por
// cima da caixa vazia (.card-content, posicionada pelas coordenadas medidas
// nos próprios ficheiros — ver guião, secção 3.1).
function renderCard(bgUrl, av, text, btnLabel, onNext, extraNameHtml, slowFade, falaFolder, falaRef, feedbackTint) {
  const tintHtml = feedbackTint ? `<div class="feedback-tint ${feedbackTint}"></div>` : "";
  setScreenFade(`
    ${bgParallaxDiv(bgUrl)}
    ${tintHtml}
    <img class="card-frame" src="${av.src}" alt="${av.name}">
    <div class="card-content">
      <div class="card-text-wrap">
        <div class="card-name">${av.name}${extraNameHtml || ""}</div>
        <div class="card-text" id="cardText"></div>
      </div>
      <button class="btn-gold sfx-hover" id="btnCardNext">${btnLabel} <span class="arrow">›</span></button>
    </div>`, slowFade);
  parallaxEl = stageContent.querySelector(".bg-parallax");
  const textEl = document.getElementById("cardText");
  typeText(textEl, text);
  // Botão sempre operacional antes do som — ver nota igual em renderBeat
  // ("curso"): uma falha a tocar a fala nunca pode impedir o clique.
  document.getElementById("btnCardNext").addEventListener("click", () => {
    if (skipTyping(textEl, text)) return;
    stopFala();
    onNext();
  });
  playFala(falaFolder, falaRef);
}

// As opções entram DENTRO do balão de fala do utilizador ("Tu") — mesmo
// template, mesmo tamanho e posição de texto que qualquer outra fala. Cada
// opção é só uma linha clicável dentro da caixa (sem balão próprio); ao
// passar o rato, uma forma subtil marca que é clicável.
function renderOptionsScreen(mod, bgUrl, opcoes, resumo, sitRef, resumoCompact) {
  const av = avatarFor("tu", mod);
  // resumoCompact: algumas frases de contexto traduzidas ficam ligeiramente
  // mais compridas do que a versão original e não cabem numa só linha na
  // caixa fixa — em vez de mexer no tamanho de letra de todas, esta opção
  // (vinda de sit.resumoCompact em data.js) reduz só a desta situação.
  const resumoHtml = resumo ? `
    <img class="resumo-frame" src="${ASSETS.resumoSituacao}" alt="">
    <div class="resumo-text${resumoCompact ? " resumo-text-compact" : ""}"><span class="resumo-label">${t("situacao")}</span> ${escapeHtml(resumo)}</div>` : "";
  setScreenFade(`
    ${bgParallaxDiv(bgUrl)}
    <div class="suspense-tint"></div>
    <img class="card-frame" src="${av.src}" alt="${av.name}">
    ${resumoHtml}
    <div class="card-content tight">
      <div class="card-text-wrap">
        <div class="opt-lines" id="optLines"></div>
      </div>
    </div>`);
  parallaxEl = stageContent.querySelector(".bg-parallax");
  // As opções têm de aparecer SEMPRE, mesmo que o som falhe por completo —
  // por isso são desenhadas antes de qualquer chamada de áudio, nunca depois
  // (era aqui que uma falha a tocar a fala/o suspense podia deixar esta caixa
  // vazia, sem nenhuma resposta clicável).
  drawOptionsList(mod, bgUrl, opcoes, resumo, sitRef);
  playFala("joana", sitRef ? `${sitRef}.RESUMO` : null);
  playLoop("suspense");
  fadeMusicVolume(MUSIC_VOLUME_DUCKED, 500);
}

function drawOptionsList(mod, bgUrl, opcoes, resumo, sitRef) {
  const wrap = document.getElementById("optLines");
  wrap.innerHTML = opcoes.map((o, i) => `
    <button class="opt-line sfx-hover" data-i="${i}">
      <span class="opt-letter">${o.letter}.</span>
      <span class="opt-text">${escapeHtml(o.text)}</span>
    </button>`).join("");
  wrap.querySelectorAll(".opt-line").forEach((btn) => {
    btn.addEventListener("click", () => showFeedback(mod, bgUrl, opcoes, parseInt(btn.dataset.i, 10), resumo, sitRef));
  });
}

function showFeedback(mod, bgUrl, opcoes, idx, resumo, sitRef) {
  stopLoop();
  const opt = opcoes[idx];
  // No feedback de resposta certa a música volta ao normal; no de errada
  // mantém-se em baixo (o formando ainda está "em tensão", vai tentar de novo).
  if (opt.correct) fadeMusicVolume(MUSIC_VOLUME, 600);
  const pose = opt.correct ? "resposta_certa" : "resposta_errada";
  const av = avatarFor("joana", mod, pose);
  playOnce(opt.correct ? "correta" : "errada");
  // No feedback positivo, a barra já conta esta situação como respondida,
  // em vez de só avançar quando o formando clicar "Continuar".
  if (opt.correct) {
    const optionsIdx = state.beats.map((b, i) => (b.type === "options" ? i : -1)).filter((i) => i >= 0);
    const answeredNow = optionsIdx.filter((i) => i <= state.beatIdx).length;
    updateTopbar(answeredNow);
  }
  const tag = `<span class="feedback-tag ${opt.correct ? "correct" : "wrong"}">${opt.correct ? t("respostaCorreta") : t("respostaErrada")}</span>`;
  renderCard(
    bgUrl,
    av,
    opt.feedback,
    opt.correct ? t("continuar") : t("tentarNovamente"),
    () => {
      if (opt.correct) { state.beatIdx++; renderBeat(); }
      else { renderOptionsScreen(mod, bgUrl, opcoes, resumo, sitRef); }
    },
    ` ${tag}`,
    false,
    "joana",
    // O ficheiro de áudio inclui " · correta"/"errada" (ou, em inglês,
    // " · correct"/"wrong") no nome, tal como a referência aparece nos
    // documentos de falas (ver build_falas_tts.js / build_falas_tts_en.js).
    sitRef ? `${sitRef}.FEEDBACK.${opt.letter} · ${opt.correct ? t("audioTagCorrect") : t("audioTagWrong")}` : null,
    opt.correct ? "correct" : "wrong"
  );
  if (!opt.correct) document.getElementById("btnCardNext").classList.add("btn-retry");
}

// ---------------- RESUMO DE BOAS PRÁTICAS (fim de módulo) ----------------

function resumoIcon(kind) {
  if (kind === "check") {
    return `<span class="resumo-icon resumo-icon-check"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="rgba(63,174,92,0.14)" stroke="var(--green)" stroke-width="1.6"/><path d="M7.5 12.4l3 3 6.2-6.6" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
  }
  return `<span class="resumo-icon resumo-icon-cross"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="rgba(217,83,79,0.14)" stroke="var(--red)" stroke-width="1.6"/><path d="M9 9l6 6M15 9l-6 6" stroke="var(--red)" stroke-width="2" stroke-linecap="round"/></svg></span>`;
}

function renderResumo(mod) {
  state.screen = "resumo";
  parallaxEl = null;
  stopLoop();
  stopFala();
  setAmbient("receção");
  updateTopbar();
  const bp = mod.boasPraticas;

  const fazerItems = bp.fazer.map((t) => `<li>${resumoIcon("check")}<span>${escapeHtml(t)}</span></li>`).join("");
  const evitarItems = bp.evitar.map((t) => `<li>${resumoIcon("cross")}<span>${escapeHtml(t)}</span></li>`).join("");

  setScreenFade(`
    ${bgParallaxDiv(ASSETS.receção)}
    <div class="resumo-screen">
      <div class="resumo-panel">
        <div class="resumo-header">
          <h2 class="resumo-title">${escapeHtml(bp.titulo)}</h2>
          <span class="resumo-rule"></span>
        </div>
        <div class="resumo-columns">
          <div class="resumo-col resumo-col-fazer">
            <h3>${t("boasPraticas")}</h3>
            <ul>${fazerItems}</ul>
          </div>
          <div class="resumo-col resumo-col-evitar">
            <h3>${t("oQueEvitar")}</h3>
            <ul>${evitarItems}</ul>
          </div>
        </div>
        <p class="resumo-quote">${escapeHtml(bp.citacao)}</p>
        <button class="btn-gold sfx-hover" id="btnResumoNext">${t("continuar")} <span class="arrow">›</span></button>
      </div>
    </div>`, true);
  parallaxEl = stageContent.querySelector(".bg-parallax");
  // Botão ligado antes do som — mesma razão de sempre: uma falha a tocar a
  // fala nunca pode deixar o botão "Continuar" inoperável.
  document.getElementById("btnResumoNext").addEventListener("click", () => {
    stopFala();
    if (state.completed.size >= mods().length) renderFinal({ fadeIn: true });
    else renderMenu({ fadeFromBlack: true });
  });
  playFala("joana", `M${mod.num}.BP`);
}

// ---------------- ECRÃ FINAL ----------------

function renderFinal(opts) {
  state.screen = "final";
  parallaxEl = null;
  stopLoop();
  stopFala();
  // Sem som ambiente de rua/interior aqui — o fundo já não é a fachada nem
  // a receção, é o mesmo da capa, tal como o menu e a entrada. A música
  // garante-se sempre a tocar (nunca estivemos "fora" para a termos desvanecido).
  setAmbient(null);
  fadeMusicVolume(MUSIC_VOLUME, 1200);
  updateTopbar();
  const fadeIn = !!(opts && opts.fadeIn);
  playOnce("correta");
  setScreen(`
    <div class="${fadeIn ? "fade-in-final" : ""}">
      ${bgParallaxDiv(ASSETS.capaEntrada)}
      <div class="overlay-dark"></div>
      <div class="final-screen">
        <div class="final-panel">
          <div class="final-badge">
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="rgba(222,183,111,0.12)" stroke="var(--gold-bright)" stroke-width="1.4"/><path d="M7.5 12.4l3 3 6.2-6.6" stroke="var(--gold-bright)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="final-header">
            <h1 class="final-title">${t("parabens")}</h1>
            <span class="final-eyebrow">${t("formacaoConcluida")}</span>
            <span class="final-rule"></span>
          </div>
          <button class="btn-gold sfx-hover" id="btnTerminar">${t("terminar")}</button>
        </div>
        <p class="final-footer-credit"><span class="final-credit-line1">${t("creditLine1")}</span><br>${t("creditBy")} <span class="final-credit-strong">André Alves</span> · <a href="mailto:andreralvesdesign@gmail.com">andreralvesdesign@gmail.com</a></p>
      </div>
    </div>`);
  parallaxEl = stageContent.querySelector(".bg-parallax");
  // Botão ligado antes do som, mesma razão das outras funções acima.
  document.getElementById("btnTerminar").addEventListener("click", () => {
    stopFala();
    state.completed.clear();
    saveProgress();
    renderEntrada();
  });
  playFala("curso", "FINAL");
}

// ---------------- ÍCONES DA BARRA SUPERIOR ----------------

btnMute.addEventListener("click", () => setMuted(!state.muted));
btnMusicMute.addEventListener("click", () => setMusicMuted(!state.musicMuted));
btnExit.addEventListener("click", () => {
  if (confirm(t("exitConfirm"))) {
    renderEntrada();
  }
});
btnFullscreen.addEventListener("click", () => {
  btnFullscreen.classList.remove("pulse-attention");
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(() => {});
});

// ---------------- ATALHO DE DEMONSTRAÇÃO ----------------
// Shift+F salta direto para o ecrã final do curso — mantido de propósito
// (não é preciso jogar o curso todo para mostrar o resultado a alguém).
document.addEventListener("keydown", (e) => {
  if (e.shiftKey && e.key.toLowerCase() === "f") {
    renderFinal();
  }
});

// ---------------- ARRANQUE ----------------

loadProgress();
updateMuteIcon();
updateMusicIcon();
updateLangIcon();
applyChromeStrings();
renderEntrada();
