/* Estudo Fácil: núcleo do app.
   Dados guardados neste aparelho (localStorage) e, se ligada, sincronização criptografada por um gist secreto
   na conta GitHub do usuário. Telas em telas.js; leitura de editais em PDF em leitor-pdf.js. */
"use strict";
const VERSAO = "1.0.0";

/* ================= utilidades ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pad = n => String(n).padStart(2, "0");
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toD = s => { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, m - 1, d, 12); };
const addD = (s, n) => { const d = toD(s); d.setDate(d.getDate() + n); return ymd(d); };
const diffD = (a, b) => Math.round((toD(b) - toD(a)) / 864e5);
const today = () => ymd(new Date());
const WD = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const WDL = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const MES3 = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
const br = s => s ? `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}` : "";
const brs = s => s ? `${s.slice(8, 10)}/${s.slice(5, 7)}` : "";
const dLonga = s => { const d = toD(s); return `${d.getDate()} de ${MESES[d.getMonth()]}`; };
const dCurta = s => { const d = toD(s); return `${d.getDate()} ${MES3[d.getMonth()]}`; };
const dSemana = s => WDL[toD(s).getDay()];
const hms = sec => { sec = Math.max(0, Math.round(sec || 0)); return `${pad(Math.floor(sec / 3600))}:${pad(Math.floor(sec % 3600 / 60))}:${pad(sec % 60)}`; };
const relogio = sec => { sec = Math.max(0, Math.floor(sec || 0)); const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`; };
const dur = sec => {
  sec = Math.max(0, Math.round(sec || 0));
  let h = Math.floor(sec / 3600), m = Math.round(sec % 3600 / 60);
  if (m === 60) { h++; m = 0; }
  if (!h) return `${m} min`;
  return m ? `${h}h${pad(m)}` : `${h}h`;
};
const horaDe = ms => { const d = new Date(ms); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pct = (a, b) => b > 0 ? a / b * 100 : 0;
const pctTxt = v => Math.round(v) + "%";
const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;
const dec = (n, c = 1) => Number(n || 0).toLocaleString("pt-BR", { maximumFractionDigits: c });
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const clone = o => JSON.parse(JSON.stringify(o ?? null));
const sum = a => a.reduce((x, y) => x + (y || 0), 0);
const fold = s => String(s || "").normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
const quando = n => n === 0 ? "hoje" : n === 1 ? "amanhã" : n === -1 ? "ontem" : n > 0 ? `em ${n} dias` : `há ${-n} dias`;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const DAY = 864e5;
const linkify = s => esc(s).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');

/* ================= ícones ================= */
const svg = p => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const I = {
  hoje: svg('<path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M5.5 9v11h13V9"/><path d="M10 20v-5.5h4V20"/>'),
  edital: svg('<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3v5h5"/><path d="M8.5 12.5l1.5 1.5 2.5-2.5M8.5 17.5h7"/>'),
  agenda: svg('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h2M12 14h2M16 14h.5M8 17.5h2M12 17.5h2"/>'),
  stats: svg('<path d="M4 20h16"/><path d="M7 16.5V11M12 16.5V6.5M17 16.5v-3.5"/>'),
  ajustes: svg('<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>'),
  play: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.2v13.6L18.6 12z" fill="currentColor" stroke="none"/></svg>',
  pause: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="5" width="3.6" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="13.9" y="5" width="3.6" height="14" rx="1" fill="currentColor" stroke="none"/></svg>',
  stop: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none"/></svg>',
  timer: svg('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2M9.5 2.5h5"/>'),
  cloud: svg('<path d="M7 18.5h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.6 9.1 4.75 4.75 0 0 0 7 18.5z"/>'),
  x: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  chev: svg('<path d="m9.5 6 6 6-6 6"/>'),
  chevL: svg('<path d="m14.5 6-6 6 6 6"/>'),
  down: svg('<path d="m6 9.5 6 6 6-6"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  minus: svg('<path d="M5 12h14"/>'),
  swap: svg('<path d="M7 7h12l-3.5-3.5M17 17H5l3.5 3.5"/>'),
  lapis: svg('<path d="M4 20h4.5L19 9.5 14.5 5 4 15.5z"/><path d="m12.5 7 4.5 4.5"/>'),
  lixo: svg('<path d="M4.5 7h15M10 11v6M14 11v6"/><path d="M6.5 7l.8 12.2A1.5 1.5 0 0 0 8.8 20.5h6.4a1.5 1.5 0 0 0 1.5-1.3L17.5 7M9.5 7V4.5h5V7"/>'),
  link: svg('<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>'),
  baixar: svg('<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>'),
  subir: svg('<path d="M12 15.5V4.5M7.5 9 12 4.5 16.5 9M5 19.5h14"/>'),
  externo: svg('<path d="M14 4.5h5.5V10M19.5 4.5 11 13M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>'),
  copiar: svg('<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/>'),
  celular: svg('<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M11 18.5h2"/>'),
  arquivo: svg('<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3v5h5"/>'),
  sol: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>'),
  lua: svg('<path d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a6.6 6.6 0 0 0 9.7 9.7z"/>'),
  busca: svg('<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>'),
  alerta: svg('<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.2v.1"/>'),
  menos: svg('<path d="M6 12h12"/>'),
  mais3: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="5.5" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="18.5" cy="12" r="1.7" fill="currentColor" stroke="none"/></svg>'
};
const MARCA = `<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="12" fill="var(--mark-bg)"/><path d="M9 29.5 39 22.5v9.5L9 38.5z" fill="var(--hl)"/><path d="M13 13.5h22M13 20h15" stroke="var(--mark-line)" stroke-width="3.2" stroke-linecap="round"/><path d="m15.5 30 4.6 4.6 10.4-10.4" fill="none" stroke="var(--mark-ink)" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* ================= dados ================= */
const KEY = "estudofacil.";
const LS = {
  get(k, d) { try { const v = localStorage.getItem(KEY + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(KEY + k, JSON.stringify(v)); return true; } catch { return false; } }
};
const COLLS = ["concursos", "materias", "topicos", "sessoes", "eventos", "simulados"];
const CFG_PADRAO = { hDia: 3, qDia: 20, dias: [1, 2, 3, 4, 5, 6], ciclo: [1, 7, 30], moverFolga: true, concurso: EDITAL_ABDI.id, teoriaAte: "", novosDia: 0, metaMin: 50, pronto: false };
const GRUPOS = { gerais: "Conhecimentos gerais", inst: "Conhecimentos institucionais", esp: "Conhecimentos específicos", geral: "Conteúdo" };
const ORD_GRUPO = { gerais: 0, inst: 1, esp: 2, geral: 3 };

function novoTopico(id, m, nome, ord) { return { id, m, nome, ord, teoria: false, tc: "", ult: "", rev: 0, ur: "", prox: "", nota: "" }; }
function concursoAbdi() {
  const E = EDITAL_ABDI;
  return { id: E.id, sigla: E.sigla, orgao: E.orgao, cargo: E.cargo, banca: E.banca, numero: E.numero, site: E.site, email: E.email,
    remuneracao: E.remuneracao, taxa: E.taxa, lotacao: E.lotacao, regime: E.regime, validade: E.validade, dataProva: E.dataProva,
    horaProva: E.horaProva, local: E.local, provaNotas: clone(E.provaNotas), prova: clone(E.prova), etapas: clone(E.etapas),
    desempate: E.desempate, perfis: clone(E.perfis), perfil: "", datas: clone(E.datas), ativo: true, criado: "2026-10-20" };
}
function materiasComuns() {
  const m = [], t = [];
  EDITAL_ABDI.materias.forEach((x, i) => {
    m.push({ id: x.id, c: EDITAL_ABDI.id, grupo: x.grupo, nome: x.nome, q: x.q, valor: 0.3, ord: i });
    x.topicos.forEach((n, j) => t.push(novoTopico(`${x.id}-${j + 1}`, x.id, n, j)));
  });
  return { m, t };
}
function materiasPerfil(pid) {
  const lista = EDITAL_ABDI.especificos[pid] || [], tot = sum(lista.map(x => x.topicos.length)) || 1, m = [], t = [];
  lista.forEach((x, i) => {
    const id = `abdi-${pid}-${i + 1}`;
    m.push({ id, c: EDITAL_ABDI.id, grupo: "esp", nome: x.nome, q: 20 * x.topicos.length / tot, valor: 0.65, ord: 100 + i, perfil: pid });
    x.topicos.forEach((n, j) => t.push(novoTopico(`${id}-${j + 1}`, id, n, j)));
  });
  return { m, t };
}
function bancoNovo() {
  const { m, t } = materiasComuns();
  return { v: 1, cfg: { ...CFG_PADRAO }, concursos: [concursoAbdi()], materias: m, topicos: t, sessoes: [], eventos: [], simulados: [], ativa: null };
}
function arrumarBanco(d) {
  if (!d || typeof d !== "object" || d.v !== 1) d = bancoNovo();
  for (const c of COLLS) if (!Array.isArray(d[c])) d[c] = [];
  d.cfg = { ...CFG_PADRAO, ...(d.cfg || {}) };
  if (!Array.isArray(d.cfg.dias) || !d.cfg.dias.length) d.cfg.dias = CFG_PADRAO.dias.slice();
  if (!Array.isArray(d.cfg.ciclo) || !d.cfg.ciclo.length) d.cfg.ciclo = CFG_PADRAO.ciclo.slice();
  if (!d.concursos.length) { d.concursos.push(concursoAbdi()); const { m, t } = materiasComuns(); d.materias.push(...m); d.topicos.push(...t); }
  if (!d.concursos.some(c => c.id === d.cfg.concurso)) d.cfg.concurso = d.concursos[0].id;
  if (d.ativa && (!d.ativa.itens || !d.ativa.itens.length)) d.ativa = null;
  // edital ABDI: só os específicos do perfil escolhido ficam ativos (vale também depois de juntar dois aparelhos)
  const abdi = d.concursos.find(c => c.id === EDITAL_ABDI.id);
  if (abdi) {
    for (const m of d.materias) if (m.c === abdi.id && m.perfil) { if (m.perfil === abdi.perfil) delete m.arq; else m.arq = true; }
    if (abdi.perfil && !d.materias.some(m => m.c === abdi.id && m.perfil === abdi.perfil)) { const { m, t } = materiasPerfil(abdi.perfil); d.materias.push(...m); d.topicos.push(...t); }
  }
  return d;
}
let DB = arrumarBanco(LS.get("db", null));
let VER = 1;
let sync = { token: "", gistId: "", login: "", lastSync: 0, err: "", st: {}, del: {}, tipOff: false, ...LS.get("sync", {}) };
const saveSync = () => LS.set("sync", sync);
let PREF = { tema: "auto", ...LS.get("pref", {}) };
const savePref = () => LS.set("pref", PREF);
const cfg = () => DB.cfg;

/* Cada alteração ganha a hora em que aconteceu, por registro (e por campo, nos ajustes).
   Na sincronização, a alteração mais recente vence. */
let SNAP = null;
function snapAll() {
  SNAP = { cfg: {}, ativa: JSON.stringify(DB.ativa) };
  for (const k in DB.cfg) SNAP.cfg[k] = JSON.stringify(DB.cfg[k]);
  for (const c of COLLS) { const m = new Map(); for (const r of DB[c]) m.set(r.id, JSON.stringify(r)); SNAP[c] = m; }
}
function stampAll() {
  if (!SNAP) return snapAll();
  const now = Date.now(); let ch = false;
  for (const k in DB.cfg) { const j = JSON.stringify(DB.cfg[k]); if (SNAP.cfg[k] !== j) { SNAP.cfg[k] = j; sync.st["cfg:" + k] = now; ch = true; } }
  const a = JSON.stringify(DB.ativa); if (SNAP.ativa !== a) { SNAP.ativa = a; sync.st.ativa = now; ch = true; }
  for (const c of COLLS) {
    const m = SNAP[c], vistos = new Set();
    for (const r of DB[c]) {
      vistos.add(r.id);
      const j = JSON.stringify(r);
      if (m.get(r.id) !== j) { m.set(r.id, j); sync.st[c + ":" + r.id] = now; delete sync.del[c + ":" + r.id]; ch = true; }
    }
    for (const id of [...m.keys()]) if (!vistos.has(id)) { m.delete(id); delete sync.st[c + ":" + id]; sync.del[c + ":" + id] = now; ch = true; }
  }
  if (ch) saveSync();
  return ch;
}
function persist() {
  if (!LS.set("db", DB)) toast("O armazenamento do aparelho está cheio. Baixe uma cópia de segurança em Ajustes.");
}
let renderQ = false;
function commit(opts = {}) {
  const ch = stampAll();
  persist(); VER++;
  if (ch && syncOn()) scheduleSync(opts.syncMs);
  if (!opts.quiet) agendarRender();
}
function agendarRender() { if (renderQ) return; renderQ = true; requestAnimationFrame(() => { renderQ = false; render(); }); }

/* outra aba (ou o app instalado aberto junto com o navegador) mudou os dados */
window.addEventListener("storage", e => {
  if (e.key === KEY + "db") { DB = arrumarBanco(LS.get("db", null)); snapAll(); VER++; agendarRender(); }
  if (e.key === KEY + "sync") { sync = { ...sync, ...LS.get("sync", {}) }; }
});

/* ================= sincronização entre aparelhos ================= */
const SYNC_FILE = "estudo-facil.json";
const TOKEN_URL = "https://github.com/settings/tokens/new?scopes=gist&description=Estudo%20F%C3%A1cil";
let syncTimer = null, syncBusy = null, syncAgain = false, syncKey = null, pendingRR = false;
let syncState = sync.err ? (sync.err === "offline" ? "offline" : "error") : "ok";
const syncOn = () => !!sync.token;
const canon = v => JSON.stringify(v, (k, x) => x && typeof x === "object" && !Array.isArray(x) ? Object.keys(x).sort().reduce((o, key) => (o[key] = x[key], o), {}) : x);
function scheduleSync(ms = 2500) { if (!syncOn()) return; clearTimeout(syncTimer); syncTimer = setTimeout(() => syncNow(), ms); }

// junta duas listas por id; a versão mais recente de cada registro vence
function mergeList(L, R, lt, rt, del, onRemote) {
  const rm = new Map(R.map(x => [x.id, x])), used = new Set(), out = [];
  for (const x of L) {
    used.add(x.id);
    const r = rm.get(x.id);
    if (r) {
      if ((del(x.id) || 0) >= Math.max(lt(x.id), rt(r.id)) && del(x.id)) continue;
      if (rt(r.id) > lt(x.id)) { out.push(r); onRemote(r); } else out.push(x);
    } else if (!(del(x.id) >= lt(x.id) && del(x.id))) out.push(x);
  }
  for (const r of R) if (!used.has(r.id) && !(del(r.id) && del(r.id) >= rt(r.id))) { out.push(r); onRemote(r); }
  return out;
}
function applyRemote(R) {
  const first = !sync.lastSync, rs = R.st || {}, st = { ...sync.st }, del = { ...sync.del };
  for (const k in (R.del || {})) del[k] = Math.max(del[k] || 0, R.del[k]);
  const corte = Date.now() - 400 * DAY;
  for (const k in del) if (del[k] < corte) delete del[k];
  const antes = canon(dadosSync());
  // ajustes, campo a campo (na primeira conexão vale o que está na nuvem)
  const C = { ...DB.cfg }, RC = R.cfg || {};
  for (const k of Object.keys(RC)) {
    const rt = rs["cfg:" + k] || 0, lt = st["cfg:" + k] || 0;
    if ((first && (rt || !lt)) || rt > lt) { C[k] = RC[k]; if (rt) st["cfg:" + k] = rt; }
  }
  const novo = { v: 1, cfg: C, ativa: DB.ativa };
  for (const c of COLLS) {
    // na primeira conexão, os dados do concurso (perfil, datas) que já estão na nuvem prevalecem, como os ajustes
    const lt = first && c === "concursos" ? () => 0 : id => st[c + ":" + id] || 0;
    novo[c] = mergeList(DB[c], Array.isArray(R[c]) ? R[c] : [], lt, id => rs[c + ":" + id] || 0, id => del[c + ":" + id] || 0,
      r => { const t = rs[c + ":" + r.id]; if (t) st[c + ":" + r.id] = t; });
  }
  const rta = rs.ativa || 0, lta = st.ativa || 0;
  if (rta > lta) { novo.ativa = R.ativa || null; st.ativa = rta; }
  DB = arrumarBanco(novo);
  sync.st = st; sync.del = del;
  persist(); snapAll(); saveSync(); VER++;
  return antes !== canon(dadosSync());
}
const dadosSync = () => { const o = { cfg: DB.cfg, ativa: DB.ativa }; for (const c of COLLS) o[c] = DB[c]; return o; };
const syncPayload = () => ({ v: 1, ...dadosSync(), st: sync.st, del: sync.del });

// criptografia: a chave sai do código de acesso do GitHub, que só os aparelhos do usuário conhecem
const b64 = u8 => { let s = ""; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); };
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function cryptoKey() {
  if (syncKey && syncKey.t === sync.token) return syncKey.k;
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(sync.token), "PBKDF2", false, ["deriveKey"]);
  const k = await crypto.subtle.deriveKey({ name: "PBKDF2", salt: new TextEncoder().encode("estudo-facil:" + (sync.login || "").toLowerCase()), iterations: 150000, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  syncKey = { t: sync.token, k };
  return k;
}
async function seal(obj) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await cryptoKey(), new TextEncoder().encode(JSON.stringify(obj)));
  return JSON.stringify({ app: "estudo-facil", v: 1, enc: "AES-GCM", iv: b64(iv), data: b64(new Uint8Array(data)) });
}
async function unseal(text) {
  const j = JSON.parse(text);
  if (j.app !== "estudo-facil" || !j.data) throw Object.assign(new Error("formato"), { code: "format" });
  try {
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(j.iv) }, await cryptoKey(), unb64(j.data));
    return JSON.parse(new TextDecoder().decode(plain));
  } catch { throw Object.assign(new Error("chave"), { code: "key" }); }
}
async function gh(path, opt = {}, token = sync.token) {
  let r;
  try {
    r = await fetch("https://api.github.com" + path, { cache: "no-store", ...opt,
      headers: { Accept: "application/vnd.github+json", Authorization: "Bearer " + token, ...(opt.body ? { "Content-Type": "application/json" } : {}) } });
  } catch { throw Object.assign(new Error("offline"), { code: "offline" }); }
  if (r.status === 401) throw Object.assign(new Error("auth"), { code: "auth" });
  if (r.status === 404) throw Object.assign(new Error("404"), { code: "404" });
  if (!r.ok) throw Object.assign(new Error("http " + r.status), { code: r.status === 403 ? "scope" : "http" });
  return { json: await r.json(), headers: r.headers };
}
async function findGist() {
  for (let page = 1; page <= 10; page++) {
    const { json } = await gh(`/gists?per_page=100&page=${page}`);
    const g = json.find(x => x.files && x.files[SYNC_FILE]);
    if (g) return g.id;
    if (json.length < 100) return "";
  }
  return "";
}
async function readRemote() {
  const { json } = await gh("/gists/" + sync.gistId);
  const f = json.files && json.files[SYNC_FILE];
  if (!f) throw Object.assign(new Error("404"), { code: "404" });
  let text = f.content;
  if (f.truncated) { try { text = await (await fetch(f.raw_url, { cache: "no-store" })).text(); } catch { throw Object.assign(new Error("offline"), { code: "offline" }); } }
  return unseal(text);
}
async function writeRemote(obj) {
  const files = { [SYNC_FILE]: { content: await seal(obj) } };
  if (sync.gistId) {
    try { await gh("/gists/" + sync.gistId, { method: "PATCH", body: JSON.stringify({ files }) }); return; }
    catch (e) { if (e.code !== "404") throw e; }
  }
  const { json } = await gh("/gists", { method: "POST", body: JSON.stringify({ description: "Estudo Fácil · dados do app, criptografados (não apague)", public: false, files }) });
  sync.gistId = json.id;
}
function syncNow(opts = {}) {
  if (!syncOn()) return Promise.resolve(false);
  if (syncBusy) { syncAgain = true; return syncBusy; }
  clearTimeout(syncTimer);
  stampAll();
  syncBusy = (async () => {
    setSyncState("busy");
    let changed = false, ok = false;
    try {
      if (!sync.gistId) sync.gistId = await findGist();
      let remote = null;
      if (sync.gistId) {
        try { remote = await readRemote(); }
        catch (e) {
          if (e.code === "404") sync.gistId = "";
          // chave nova (a antiga venceu): a nuvem é regravada com os dados deste aparelho
          else if (e.code === "key" || e.code === "format") remote = null;
          else throw e;
        }
      }
      if (remote) changed = applyRemote(remote);
      const out = syncPayload();
      if (!remote || canon(out) !== canon({ v: 1, cfg: remote.cfg, ativa: remote.ativa ?? null, ...Object.fromEntries(COLLS.map(c => [c, remote[c]])), st: remote.st, del: remote.del })) await writeRemote(out);
      sync.lastSync = Date.now(); sync.err = ""; ok = true;
      setSyncState("ok");
    } catch (e) {
      sync.err = e.code || "http";
      setSyncState(sync.err === "offline" ? "offline" : "error");
      if (opts.manual) toast(syncErrText());
    }
    saveSync();
    if (changed) afterRemoteChange(opts.quiet);
    return ok;
  })();
  return syncBusy.finally(() => { syncBusy = null; if (syncAgain) { syncAgain = false; scheduleSync(400); } });
}
const busyTyping = () => !!$("#sheet-root").innerHTML || (document.activeElement && document.activeElement.matches("input,textarea,select"));
function afterRemoteChange(quiet) {
  if (busyTyping()) { pendingRR = true; return; }
  pendingRR = false; render();
  if (!quiet) toast("Atualizado com seus outros aparelhos.");
}
setInterval(() => { if (pendingRR && !busyTyping()) afterRemoteChange(true); }, 1500);
function syncErrText() {
  return { offline: "Sem internet agora. Sincroniza quando a conexão voltar.", auth: "A chave do GitHub não vale mais. Crie uma nova e cole em Ajustes, Sincronização.",
    scope: "A chave do GitHub não tem a permissão gist. Crie outra marcando gist." }[sync.err] || "Não foi possível sincronizar agora. Tente de novo em instantes.";
}
function agoTxt(ts) {
  const m = Math.round((Date.now() - ts) / 6e4);
  if (m < 1) return "agora mesmo";
  if (m < 60) return `há ${m} min`;
  const d = new Date(ts), hm = `${pad(d.getHours())}h${pad(d.getMinutes())}`;
  return ymd(d) === today() ? `hoje às ${hm}` : `em ${brs(ymd(d))} às ${hm}`;
}
function syncStatusText() {
  if (syncState === "busy") return "Sincronizando…";
  if (syncState !== "ok") return syncErrText();
  return sync.lastSync ? `Tudo sincronizado, ${agoTxt(sync.lastSync)}.` : "Conectado.";
}
function setSyncState(s) {
  syncState = s;
  $$(".sync-ic").forEach(b => { b.className = "icon-btn sync-ic s-" + s; b.setAttribute("aria-label", "Sincronização: " + syncStatusText()); b.title = syncStatusText(); });
  const t = $("#sync-status"); if (t) { t.textContent = syncStatusText(); t.classList.toggle("bad", s === "error"); }
}
/* chave já usada pelo Elétrica Fácil neste aparelho (os apps dividem o mesmo endereço) */
function chaveIrma() {
  try { const s = JSON.parse(localStorage.getItem("eletricafacil.sync") || "null"); if (s && s.token && s.login) return { token: s.token, login: s.login, app: "Elétrica Fácil" }; } catch {}
  return null;
}
async function connectSync(token) {
  token = String(token || "").trim().replace(/\s/g, "");
  if (!/^(ghp_|github_pat_|gho_)\w{20,}$/.test(token)) { toast("Essa não parece uma chave do GitHub. Ela começa com ghp_."); return false; }
  let login = "";
  try {
    const { json, headers } = await gh("/user", {}, token);
    const scopes = headers.get("x-oauth-scopes");
    if (scopes !== null && !/\bgist\b/.test(scopes)) { toast("Essa chave não tem a permissão gist. Crie outra marcando gist."); return false; }
    login = json.login || "";
  } catch (e) {
    toast(e.code === "offline" ? "Sem internet. Conecte quando estiver on-line." : "O GitHub não aceitou essa chave. Confira se copiou inteira.");
    return false;
  }
  const same = sync.login && sync.login.toLowerCase() === login.toLowerCase();
  // trocar a chave na mesma conta mantém o histórico; outra conta começa do zero
  sync = { ...sync, token, login, err: "", ...(same ? {} : { gistId: "", lastSync: 0 }) };
  syncKey = null; saveSync();
  const had = sync.lastSync;
  const ok = await syncNow({ quiet: true });
  if (ok) toast(had ? "Chave atualizada." : "Sincronização ligada. Seus aparelhos agora têm os mesmos dados.");
  else toast(syncErrText());
  render();
  return true;
}
document.addEventListener("visibilitychange", () => {
  if (!syncOn()) return;
  if (document.visibilityState === "visible") { if (Date.now() - (sync.lastSync || 0) > 10000) syncNow({ quiet: false }); }
  else if (syncTimer) syncNow();
});
window.addEventListener("online", () => { if (syncOn()) syncNow(); });
setInterval(() => { if (syncOn() && document.visibilityState === "visible" && !syncBusy) syncNow(); }, 60000);
snapAll();

/* ================= índices derivados ================= */
let IX = { v: -1 };
function concurso() { return DB.concursos.find(c => c.id === DB.cfg.concurso) || DB.concursos[0]; }
function ix() {
  if (IX.v === VER) return IX;
  const c = concurso();
  const matById = new Map(DB.materias.map(m => [m.id, m])), topById = new Map(DB.topicos.map(t => [t.id, t]));
  const mats = DB.materias.filter(m => m.c === c.id && !m.arq).sort((a, b) => (ORD_GRUPO[a.grupo] ?? 9) - (ORD_GRUPO[b.grupo] ?? 9) || a.ord - b.ord);
  const doConc = new Set(mats.map(m => m.id));
  const topsByMat = new Map(mats.map(m => [m.id, []]));
  for (const t of DB.topicos) if (doConc.has(t.m)) topsByMat.get(t.m).push(t);
  for (const l of topsByMat.values()) l.sort((a, b) => a.ord - b.ord);
  const tops = mats.flatMap(m => topsByMat.get(m.id));
  const stT = new Map(), stM = new Map(), days = new Map();
  const sess = DB.sessoes.slice().sort((a, b) => b.ini - a.ini);
  for (const s of sess) {
    const o = days.get(s.d) || { s: 0, a: 0, e: 0, n: 0 };
    o.s += s.s || 0; o.a += s.a || 0; o.e += s.e || 0; o.n++; days.set(s.d, o);
    for (const it of s.itens || []) {
      const t = stT.get(it.t) || { s: 0, a: 0, e: 0, n: 0, last: "" };
      t.s += it.s || 0; t.a += it.a || 0; t.e += it.e || 0; t.n++; if (s.d > t.last) t.last = s.d; stT.set(it.t, t);
      const mm = stM.get(it.m) || { s: 0, a: 0, e: 0 };
      mm.s += it.s || 0; mm.a += it.a || 0; mm.e += it.e || 0; stM.set(it.m, mm);
    }
  }
  const pts = new Map(mats.map(m => [m.id, (m.q || 0) * (m.valor || 1)]));
  const ptsTot = sum([...pts.values()]);
  const first = sess.length ? sess[sess.length - 1].d : "";
  IX = { v: VER, c, mats, matById, topById, topsByMat, tops, stT, stM, days, sess, pts, ptsTot, first };
  return IX;
}
const matNome = id => (ix().matById.get(id) || {}).nome || "Matéria removida";
const topNome = id => (ix().topById.get(id) || {}).nome || "Tópico removido";
const statT = id => ix().stT.get(id) || { s: 0, a: 0, e: 0, n: 0, last: "" };
function resumoEdital() {
  const X = ix(), n = X.tops.length, teo = X.tops.filter(t => t.teoria).length, est = X.tops.filter(t => t.teoria || t.ult).length;
  return { n, teo, est, pc: pct(teo, n) };
}

/* ================= rotina, metas e revisões ================= */
const ehDiaEstudo = d => cfg().dias.includes(toD(d).getDay());
function proxRevisao(d, n) {
  const iv = cfg().ciclo; let p = addD(d, iv[Math.min(n, iv.length - 1)]);
  if (cfg().moverFolga) for (let i = 0; i < 7 && !ehDiaEstudo(p); i++) p = addD(p, 1);
  return p;
}
function diasEstudoEntre(a, b) { let n = 0; for (let d = a; d <= b; d = addD(d, 1)) if (ehDiaEstudo(d)) n++; return n; }
function teoriaAte() {
  const c = concurso(), t = today();
  if (cfg().teoriaAte) return cfg().teoriaAte;
  if (c.dataProva) { const f = addD(c.dataProva, -14); return f > t ? f : addD(c.dataProva, -1); }
  return addD(t, 60);
}
function metaDia(d) {
  const o = ix().days.get(d) || { s: 0, a: 0, e: 0 };
  const h = cfg().hDia, q = cfg().qDia;
  if (!h && !q) return o.s > 0;
  return (!h || o.s >= h * 3600 - 60) && (!q || o.a + o.e >= q);
}
function sequencia() {
  let n = 0, d = today();
  for (let i = 0; i < 800; i++, d = addD(d, -1)) {
    if (ix().first && d < ix().first) break;
    if (!ehDiaEstudo(d)) { if (metaDia(d)) n++; continue; }
    if (metaDia(d)) n++;
    else if (i === 0) continue; // hoje ainda não terminou
    else break;
  }
  return n;
}
/* Plano do dia: revisões vencidas primeiro, depois tópicos novos.
   As matérias andam juntas (a mais atrasada em proporção vai primeiro) e, no empate, ganha a que vale mais pontos por tópico. */
function ritmo() {
  const X = ix(), t = today(), fim = teoriaAte();
  const pend = X.tops.filter(x => !x.teoria || x.tc === t).length;
  const dias = Math.max(1, diasEstudoEntre(t, fim > t ? fim : t));
  const auto = pend ? clamp(Math.ceil(pend / dias), 1, 8) : 0;
  return { pend, dias, fim, auto, n: cfg().novosDia || auto };
}
function planoHoje() {
  const X = ix(), t = today();
  const hojeTeoria = new Set(), hojeRev = new Set();
  for (const s of X.sess) { if (s.d !== t) continue; for (const it of s.itens || []) (it.tipo === "revisao" ? hojeRev : hojeTeoria).add(it.t); }
  const peso = m => (X.pts.get(m) || 0) / Math.max(1, (X.topsByMat.get(m) || []).length);
  const rev = X.tops.filter(x => (x.prox && x.prox <= t) || x.ur === t)
    .map(x => ({ tipo: "revisao", top: x, feito: x.ur === t || hojeRev.has(x.id), atraso: x.prox && x.prox < t ? diffD(x.prox, t) : 0 }))
    .sort((a, b) => (a.feito - b.feito) || ((a.top.prox || t).localeCompare(b.top.prox || t)) || (peso(b.top.m) - peso(a.top.m)));
  // revisões por dia: no máximo duas por hora da meta diária; as outras esperam na fila, as mais atrasadas primeiro
  const capRev = clamp(Math.round((cfg().hDia || 2) * 2), 3, 12);
  const revFeitas = rev.filter(r => r.feito), revPend = rev.filter(r => !r.feito);
  const revHoje = [...revPend.slice(0, Math.max(0, capRev - revFeitas.length)), ...revFeitas];
  const espera = revPend.length - revHoje.filter(r => !r.feito).length;
  const R = ritmo(), novos = [];
  const usado = new Set(rev.map(r => r.top.id));
  for (const id of hojeTeoria) { const x = X.topById.get(id); if (x && !usado.has(id) && X.topsByMat.has(x.m)) { novos.push({ tipo: "teoria", top: x, feito: true }); usado.add(id); } }
  const alvo = ehDiaEstudo(t) ? R.n : 0;
  if (novos.length < alvo) {
    const tot = new Map(), feitos = new Map(), maxPeso = Math.max(0.0001, ...X.mats.map(m => peso(m.id)));
    for (const m of X.mats) { const l = X.topsByMat.get(m.id); tot.set(m.id, l.length); feitos.set(m.id, l.filter(x => x.teoria && x.tc !== t).length); }
    for (const n of novos) feitos.set(n.top.m, (feitos.get(n.top.m) || 0) + 1);
    while (novos.length < alvo) {
      let best = null, bestSc = Infinity;
      for (const m of X.mats) {
        const cand = X.topsByMat.get(m.id).filter(x => (!x.teoria || x.tc === t) && !usado.has(x.id));
        if (!cand.length) continue;
        const sc = (feitos.get(m.id) || 0) / Math.max(1, tot.get(m.id)) - 0.12 * peso(m.id) / maxPeso;
        if (sc < bestSc) { bestSc = sc; best = { m, cand }; }
      }
      if (!best) break;
      const x = best.cand.find(y => y.ult) || best.cand[0];
      novos.push({ tipo: "teoria", top: x, feito: false }); usado.add(x.id);
      feitos.set(best.m.id, (feitos.get(best.m.id) || 0) + 1);
    }
  }
  const itens = [...revHoje, ...novos];
  return { itens, rev, revPend, espera, novos, ritmo: R, prox: itens.find(i => !i.feito) || null, feitos: itens.filter(i => i.feito).length };
}
/* sugestão quando o plano de hoje acabou: o próximo tópico novo pela mesma regra */
function proximoTopico(excluir = new Set()) {
  const X = ix(), t = today();
  const peso = m => (X.pts.get(m) || 0) / Math.max(1, (X.topsByMat.get(m) || []).length);
  const maxPeso = Math.max(0.0001, ...X.mats.map(m => peso(m.id)));
  let best = null, bestSc = Infinity;
  for (const m of X.mats) {
    const l = X.topsByMat.get(m.id), cand = l.filter(x => !x.teoria && !excluir.has(x.id));
    if (!cand.length) continue;
    const sc = l.filter(x => x.teoria).length / l.length - 0.12 * peso(m.id) / maxPeso;
    if (sc < bestSc) { bestSc = sc; best = cand.find(y => y.ult && y.ult !== t) || cand[0]; }
  }
  return best;
}

/* ================= sessão de estudo (cronômetro) ================= */
const atual = a => a.itens[a.itens.length - 1];
const emPausa = a => { const p = (a.pausas || [])[a.pausas.length - 1]; return !!(p && !p.fim); };
const pausaTotal = (a, now) => sum((a.pausas || []).map(p => (p.fim || now) - p.ini)) / 1000;
const estudoTotal = (a, now) => Math.max(0, (now - a.ini) / 1000 - pausaTotal(a, now));
function estudoItem(a, it, now) {
  const fim = it.fim || now; let p = 0;
  for (const x of a.pausas || []) { const i0 = Math.max(x.ini, it.ini), i1 = Math.min(x.fim || now, fim); if (i1 > i0) p += i1 - i0; }
  return Math.max(0, (fim - it.ini - p) / 1000);
}
function tipoSugerido(top) { return top && top.prox && top.prox <= today() ? "revisao" : "teoria"; }
const TIPO_TXT = { teoria: "Teoria", revisao: "Revisão" };
function iniciarSessao(topId, tipo, meta) {
  const top = ix().topById.get(topId); if (!top) return;
  if (DB.ativa) { abrirFoco(); toast("Já existe uma sessão em andamento."); return; }
  unlockAudio();
  const now = Date.now();
  tipo = tipo || tipoSugerido(top);
  DB.ativa = { id: uid(), ini: now, meta: meta ? Math.round(meta * 60) : 0, obs: "", pausas: [],
    itens: [{ t: top.id, m: top.m, tipo, ini: now, fim: 0, a: 0, e: 0 }] };
  if (meta) cfg().metaMin = meta;
  UI.alarme = 0;
  commit({ syncMs: 800 });
  abrirFoco();
  pedirWakeLock();
}
function trocarTopico(topId, tipo) {
  const a = DB.ativa, top = ix().topById.get(topId); if (!a || !top) return;
  const now = Date.now(), cur = atual(a);
  if (emPausa(a)) { const p = a.pausas[a.pausas.length - 1]; p.fim = now; }
  if (cur.t === topId && cur.tipo === tipo) return;
  // trocar logo no começo substitui o tópico em vez de criar um trecho de segundos
  if (estudoItem(a, cur, now) < 20 && !cur.a && !cur.e) { a.itens.pop(); }
  else cur.fim = now;
  a.itens.push({ t: top.id, m: top.m, tipo: tipo || tipoSugerido(top), ini: now, fim: 0, a: 0, e: 0 });
  commit({ syncMs: 800 });
}
function alternarPausa(motivo) {
  const a = DB.ativa; if (!a) return;
  const now = Date.now();
  if (emPausa(a)) { a.pausas[a.pausas.length - 1].fim = now; }
  else a.pausas.push({ ini: now, fim: 0, mot: motivo || "" });
  commit({ syncMs: 800 });
}
let cntTimer = null;
function contarQuestao(k, d) {
  const a = DB.ativa; if (!a) return;
  const it = atual(a); it[k] = Math.max(0, (it[k] || 0) + d);
  clearTimeout(cntTimer);
  cntTimer = setTimeout(() => commit({ quiet: true, syncMs: 1500 }), 600);
  atualizarFocoContadores();
}
/* fecha a sessão em andamento: grava no histórico e atualiza teoria e revisões dos tópicos */
function salvarSessao(teoriaFeita = new Set(), obs) {
  const a = DB.ativa; if (!a) return null;
  clearTimeout(cntTimer);
  const now = Date.now();
  const p = a.pausas[a.pausas.length - 1]; if (p && !p.fim) p.fim = now;
  atual(a).fim = now;
  const d = ymd(new Date(a.ini));
  const itens = a.itens.map(it => ({ t: it.t, m: it.m, tn: topNome(it.t), mn: matNome(it.m), tipo: it.tipo, s: Math.round(estudoItem(a, it, now)), a: it.a || 0, e: it.e || 0, ini: it.ini, fim: it.fim }))
    .filter(it => it.s >= 5 || it.a || it.e);
  DB.ativa = null;
  if (!itens.length) { commit(); return null; }
  const s = { id: uid(), d, ini: a.ini, fim: now, s: sum(itens.map(i => i.s)), p: Math.round(pausaTotal(a, now)), a: sum(itens.map(i => i.a)), e: sum(itens.map(i => i.e)),
    itens, pausas: a.pausas.map(x => ({ ini: x.ini, fim: x.fim, mot: x.mot || "" })), obs: (obs ?? a.obs ?? "").trim() };
  DB.sessoes.push(s);
  aplicarNosTopicos(s, teoriaFeita);
  commit({ syncMs: 600 });
  liberarWakeLock();
  return s;
}
function aplicarNosTopicos(s, teoriaFeita) {
  const vistos = new Set();
  for (const it of s.itens) {
    const t = ix().topById.get(it.t); if (!t) continue;
    if (s.d >= (t.ult || "")) t.ult = s.d;
    if (vistos.has(it.t + it.tipo)) continue; vistos.add(it.t + it.tipo);
    if (it.tipo === "revisao") { t.rev = (t.rev || 0) + 1; t.ur = s.d; t.prox = proxRevisao(s.d, t.rev); }
    else { t.rev = 0; t.prox = proxRevisao(s.d, 0); }
    if (teoriaFeita.has(it.t) && !t.teoria) { t.teoria = true; t.tc = s.d; }
  }
}
function revisaoFeita(topId) {
  const t = ix().topById.get(topId); if (!t) return;
  const d = today();
  t.rev = (t.rev || 0) + 1; t.ur = d; t.prox = proxRevisao(d, t.rev); if (d > (t.ult || "")) t.ult = d;
  commit();
  toast(`Revisão registrada. A próxima fica para ${dLonga(t.prox)}.`);
}
function adiarRevisao(topId) {
  const t = ix().topById.get(topId); if (!t || !t.prox) return;
  let d = addD(t.prox > today() ? t.prox : today(), 1);
  for (let i = 0; i < 7 && !ehDiaEstudo(d); i++) d = addD(d, 1);
  t.prox = d; commit();
  toast(`Revisão adiada para ${dLonga(d)}.`);
}
function marcarTeoria(topId, val) {
  const t = ix().topById.get(topId); if (!t) return;
  t.teoria = !!val; t.tc = val ? today() : "";
  if (val && !t.prox) t.prox = proxRevisao(today(), 0);
  commit();
}

/* tela sempre acesa e aviso sonoro no fim do tempo */
let wakeLock = null;
async function pedirWakeLock() { try { if (navigator.wakeLock && DB.ativa && document.visibilityState === "visible") wakeLock = await navigator.wakeLock.request("screen"); } catch {} }
function liberarWakeLock() { try { wakeLock && wakeLock.release(); } catch {} wakeLock = null; }
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") { pedirWakeLock(); agendarRender(); } });
let audioCtx = null;
function unlockAudio() { try { audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === "suspended") audioCtx.resume(); } catch {} }
function beep() {
  try {
    unlockAudio(); const t0 = audioCtx.currentTime;
    for (let i = 0; i < 3; i++) { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.frequency.value = 880; o.connect(g); g.connect(audioCtx.destination); g.gain.setValueAtTime(.0001, t0 + i * .45); g.gain.exponentialRampToValueAtTime(.3, t0 + i * .45 + .02); g.gain.exponentialRampToValueAtTime(.0001, t0 + i * .45 + .35); o.start(t0 + i * .45); o.stop(t0 + i * .45 + .4); }
  } catch {}
  try { navigator.vibrate && navigator.vibrate([300, 150, 300, 150, 300]); } catch {}
}

/* ================= avisos, janelas e campos ================= */
let toastTimer;
function toast(msg, action) {
  $(".toast")?.remove(); clearTimeout(toastTimer);
  const el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status");
  el.textContent = msg;
  if (action) { const b = document.createElement("button"); b.textContent = action.label; b.onclick = () => { el.remove(); action.run(); }; el.appendChild(b); }
  document.body.appendChild(el);
  toastTimer = setTimeout(() => el.remove(), action ? 6000 : 3200);
}
let lockedY = null;
function lockScroll() { if (lockedY !== null) return; lockedY = window.scrollY; Object.assign(document.body.style, { position: "fixed", top: -lockedY + "px", left: "0", right: "0" }); }
function unlockScroll() { if (lockedY === null) return; const y = lockedY; lockedY = null; Object.assign(document.body.style, { position: "", top: "", left: "", right: "" }); window.scrollTo(0, y); }
let sheetOnClose = null;
function openSheet({ title, body, foot = "", tall = false, wide = false, onMount, onClose, sub = "" }) {
  closeSheet(true);
  const root = $("#sheet-root");
  root.innerHTML = `<div class="ov" id="ov"><div class="sheet${tall ? " tall" : ""}${wide ? " wide" : ""}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <div class="sh-head"><div class="sh-tt">${sub ? `<p class="sh-sub">${esc(sub)}</p>` : ""}<h2>${esc(title)}</h2></div><button class="icon-btn" data-close aria-label="Fechar">${I.x}</button></div>
    <div class="sh-body">${body}</div>${foot ? `<div class="sh-foot">${foot}</div>` : ""}</div></div>`;
  lockScroll();
  const ov = $("#ov"), sh = $(".sheet", ov);
  ov.addEventListener("click", e => { if (e.target === ov) closeSheet(); });
  $("[data-close]", sh).onclick = () => closeSheet();
  sheetOnClose = onClose || null;
  $$("input:not([type=checkbox]):not([type=radio]):not([type=file])", sh).forEach(i => { if (!i.hasAttribute("enterkeyhint")) i.setAttribute("enterkeyhint", "done"); });
  onMount && onMount(sh);
  return sh;
}
function closeSheet(silent) {
  const root = $("#sheet-root"); if (!root || !root.innerHTML) return;
  root.innerHTML = ""; unlockScroll();
  const f = sheetOnClose; sheetOnClose = null;
  if (!silent && f) f();
  if (UI.pendingRender) render();
}
document.addEventListener("keydown", e => { if (e.key === "Escape" && $("#sheet-root").innerHTML) closeSheet(); });
function confirmSheet(title, text, okLabel, onOk, danger = true) {
  openSheet({ title, body: `<p class="lead">${text}</p>`,
    foot: `<button class="btn ghost" data-no>Voltar</button><button class="btn ${danger ? "danger" : "pri"}" data-ok>${esc(okLabel)}</button>`,
    onMount: s => { $("[data-no]", s).onclick = () => closeSheet(); $("[data-ok]", s).onclick = () => { closeSheet(true); onOk(); }; } });
}
async function copyText(text, okMsg) {
  try { await navigator.clipboard.writeText(text); toast(okMsg); return; } catch {}
  openSheet({ title: "Copiar texto", body: `<textarea id="cp-t" readonly rows="8">${esc(text)}</textarea><p class="hint">Toque e segure no texto e escolha Copiar.</p>`,
    onMount: s => { const t = $("#cp-t", s); t.focus(); t.select(); } });
}
function baixar(nome, blob) {
  try {
    const url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = nome; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  } catch { toast("Não foi possível baixar o arquivo neste navegador."); return false; }
}
document.addEventListener("keydown", e => {
  const t = e.target;
  if (e.key !== "Enter" || !t.matches || !t.matches("input:not([type=checkbox]):not([type=radio])") || t.form) return;
  e.preventDefault(); t.blur();
});
const autoGrow = t => { if (!t.offsetParent) return; t.style.height = "auto"; t.style.height = Math.max(80, t.scrollHeight + 2) + "px"; };
document.addEventListener("input", e => { if (e.target.tagName === "TEXTAREA" && !e.target.hasAttribute("rows")) autoGrow(e.target); });

/* ================= navegação e desenho das telas ================= */
const UI = { pendingRender: false, alarme: 0, focoAberto: false, edTab: "conteudo", edAberta: new Set(), dsPer: "semana", dsNav: today(), cal: { mes: today().slice(0, 8) + "01", sel: today() }, busca: "", hLim: 30 };
const VIEWS = {};
const NAV = [["hoje", "Hoje", "hoje"], ["edital", "Edital", "edital"], ["estudar", "Estudar", "timer"], ["agenda", "Agenda", "agenda"], ["desempenho", "Desempenho", "stats"]];
function route() {
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, "")).split("/");
  const v = VIEWS[h[0]] ? h[0] : "hoje";
  return { v, sub: h[1] || "" };
}
function go(path, replace) {
  const d = (history.state && history.state.d) || 0;
  if (replace) history.replaceState({ d }, "", "#/" + path); else history.pushState({ d: d + 1 }, "", "#/" + path);
  closeSheet(true); render({ top: true });
}
window.addEventListener("popstate", () => { closeSheet(true); render({ top: true }); });

function render(opts = {}) {
  if (!DB.cfg.pronto) { renderOnboarding(); return; }
  const r = route();
  document.body.classList.remove("onb");
  renderShell(r);
  const main = $("#main");
  const act = document.activeElement;
  if (!opts.force && act && main.contains(act) && /INPUT|TEXTAREA|SELECT/.test(act.tagName) && !/checkbox|radio/.test(act.type)) { UI.pendingRender = true; renderFoco(); return; }
  UI.pendingRender = false;
  const y = window.scrollY;
  main.innerHTML = VIEWS[r.v](r);
  main.dataset.view = r.v;
  if (VIEWS[r.v].after) VIEWS[r.v].after(r);
  window.scrollTo(0, opts.top ? 0 : y);
  renderFoco();
  tick();
}
document.addEventListener("focusout", () => setTimeout(() => { if (UI.pendingRender && !busyTyping()) render(); }, 40));

function renderShell(r) {
  const a = DB.ativa;
  const navBtn = ([v, l, ic]) => {
    if (v === "estudar") return `<button class="nav-it nav-go${a ? " ativo" : ""}" data-act="nav-estudar" ${r.v === v ? 'aria-current="page"' : ""}><span class="nav-fab">${a ? I.timer : I.play}</span><span class="nav-l" ${a ? 'data-tick="nav"' : ""}>${a ? relogio(estudoTotal(a, Date.now())) : l}</span></button>`;
    return `<button class="nav-it" data-go="${v}" ${r.v === v ? 'aria-current="page"' : ""}>${I[ic]}<span class="nav-l">${l}</span></button>`;
  };
  $("#nav").innerHTML = NAV.map(navBtn).join("");
  $("#rail-nav").innerHTML = NAV.map(([v, l, ic]) => v === "estudar"
    ? `<button class="rail-it rail-go${a ? " ativo" : ""}" data-act="nav-estudar" ${r.v === v ? 'aria-current="page"' : ""}>${a ? I.timer : I.play}<span ${a ? 'data-tick="nav"' : ""}>${a ? relogio(estudoTotal(a, Date.now())) : "Estudar"}</span></button>`
    : `<button class="rail-it" data-go="${v}" ${r.v === v ? 'aria-current="page"' : ""}>${I[ic]}<span>${l}</span></button>`).join("")
    + `<button class="rail-it" data-go="ajustes" ${r.v === "ajustes" ? 'aria-current="page"' : ""}>${I.ajustes}<span>Ajustes</span></button>`;
  const syncBtn = syncOn() ? `<button class="icon-btn sync-ic s-${syncState}" data-go="ajustes" aria-label="${esc("Sincronização: " + syncStatusText())}" title="${esc(syncStatusText())}">${I.cloud}</button>` : "";
  $("#bar-acts").innerHTML = syncBtn + `<button class="icon-btn" data-go="ajustes" aria-label="Ajustes" ${r.v === "ajustes" ? 'aria-current="page"' : ""}>${I.ajustes}</button>`;
  $("#rail-sync").innerHTML = syncOn() ? `<button class="rail-sync sync-ic s-${syncState}" data-go="ajustes" title="${esc(syncStatusText())}">${I.cloud}<span>${syncState === "ok" ? "Sincronizado" : syncState === "busy" ? "Sincronizando" : syncState === "offline" ? "Sem internet" : "Sincronização parada"}</span></button>` : "";
}

/* o relógio da sessão atualiza só os números, sem redesenhar a tela */
function tick() {
  const a = DB.ativa;
  if (!a) return;
  const now = Date.now(), est = estudoTotal(a, now);
  $$("[data-tick]").forEach(el => {
    const k = el.dataset.tick;
    if (k === "nav") el.textContent = relogio(est);
    else if (k === "estudo") el.textContent = relogio(a.meta ? Math.max(0, a.meta - est) : est);
    else if (k === "estudo-real") el.textContent = dur(est);
    else if (k === "pausa") el.textContent = relogio(pausaTotal(a, now));
    else if (k === "barra") el.style.width = Math.min(100, pct(est, a.meta)) + "%";
  });
  if (a.meta && est >= a.meta && UI.alarme !== a.id && !emPausa(a)) {
    UI.alarme = a.id; beep();
    openSheet({ title: "Tempo cumprido", body: `<p class="lead">Você completou ${dur(a.meta)} de estudo. Quer continuar ou concluir a sessão?</p>`,
      foot: `<button class="btn ghost" data-act="continuar-livre">Continuar estudando</button><button class="btn pri" data-act="concluir">Concluir</button>` });
  }
}
setInterval(tick, 1000);

/* ================= ações (cliques) ================= */
const ACT = {};
const ON = {};
document.addEventListener("click", ev => {
  const g = ev.target.closest("[data-go]");
  if (g) { ev.preventDefault(); if (UI.focoAberto && g.closest("#foco")) fecharFoco(); go(g.dataset.go); return; }
  const el = ev.target.closest("[data-act]"); if (!el) return;
  const fn = ACT[el.dataset.act]; if (!fn) return;
  ev.preventDefault();
  try { fn(el, ev); } catch (e) { console.error(e); toast("Algo deu errado. Tente de novo."); }
});
document.addEventListener("change", ev => {
  const el = ev.target; const fn = el.dataset && ON[el.dataset.on]; if (!fn) return;
  try { fn(el, ev); } catch (e) { console.error(e); }
});

/* ================= tela inicial (primeiro uso) ================= */
const ONB = { passo: 0, perfil: "", dias: null, h: null };
function renderOnboarding() {
  document.body.classList.add("onb");
  const c = concurso(), t = today(), n = c.dataProva ? diffD(t, c.dataProva) : null;
  $("#nav").innerHTML = ""; $("#rail-nav").innerHTML = ""; $("#bar-acts").innerHTML = ""; $("#rail-sync").innerHTML = "";
  const main = $("#main");
  if (ONB.passo === 0) {
    main.innerHTML = `<section class="onb-wrap">
      <div class="onb-mark">${MARCA}</div>
      <h1 class="onb-h">Seu edital já está aqui.</h1>
      <p class="lead">O Estudo Fácil divide o edital em tópicos, diz o que estudar a cada dia, cronometra o estudo e agenda as revisões.</p>
      <div class="onb-ed">
        <p class="onb-ed-a">${esc(c.orgao)} (${esc(c.sigla)})</p>
        <p class="onb-ed-b">${esc(c.cargo)}</p>
        <p class="onb-ed-c">Banca ${esc(c.banca)}. Prova em ${dLonga(c.dataProva)}${n !== null && n >= 0 ? `, daqui a ${plural(n, "dia", "dias")}` : ""}.</p>
      </div>
      <h2 class="onb-q">Para qual perfil você vai concorrer?</h2>
      <p class="hint">Os conhecimentos gerais e institucionais são iguais para todos. O perfil define os 20 conhecimentos específicos. Dá para trocar depois.</p>
      <div class="perfis" role="radiogroup" aria-label="Perfil">
        ${c.perfis.map(p => `<label class="perfil${ONB.perfil === p.id ? " on" : ""}"><input type="radio" name="onb-perfil" value="${p.id}" ${ONB.perfil === p.id ? "checked" : ""} data-on="onb-perfil">
          <span class="perfil-n">${esc(p.nome)}</span><span class="perfil-v">${plural(p.vagas, "vaga", "vagas")} e ${p.cr} no cadastro reserva</span></label>`).join("")}
      </div>
      <div class="onb-foot">
        <button class="btn pri lg" data-act="onb-seguir" ${ONB.perfil ? "" : "disabled"}>Continuar</button>
        <button class="btn link" data-act="onb-conectar">Já uso o Estudo Fácil em outro aparelho</button>
      </div>
    </section>`;
  } else {
    const dias = ONB.dias || cfg().dias, h = ONB.h ?? cfg().hDia;
    const p = c.perfis.find(x => x.id === ONB.perfil);
    const totT = DB.topicos.filter(x => ix().topsByMat.has(x.m)).length + (EDITAL_ABDI.especificos[ONB.perfil] || []).reduce((a, m) => a + m.topicos.length, 0);
    const fim = c.dataProva ? addD(c.dataProva, -14) : addD(t, 60);
    let nd = 0; for (let d = t; d <= fim; d = addD(d, 1)) if (dias.includes(toD(d).getDay())) nd++;
    const porDia = nd ? Math.ceil(totT / nd) : totT;
    main.innerHTML = `<section class="onb-wrap">
      <button class="btn link back" data-act="onb-voltar">${I.chevL}Perfil</button>
      <h1 class="onb-h">Sua rotina de estudo</h1>
      <p class="lead">Com isso o app monta o plano de cada dia até a prova. Você ajusta quando quiser.</p>
      <div class="field"><span class="lbl">Dias em que você estuda</span>
        <div class="dias">${[1, 2, 3, 4, 5, 6, 0].map(d => `<label class="dia"><input type="checkbox" value="${d}" ${dias.includes(d) ? "checked" : ""} data-on="onb-dia"><span>${WD[d]}</span></label>`).join("")}</div></div>
      <div class="field"><span class="lbl">Horas por dia de estudo</span>
        <div class="stepper"><button class="icon-btn boxed" data-act="onb-h" data-d="-0.5" aria-label="Menos meia hora">${I.minus}</button><output id="onb-h">${dec(h)} h</output><button class="icon-btn boxed" data-act="onb-h" data-d="0.5" aria-label="Mais meia hora">${I.plus}</button></div></div>
      <div class="onb-calc">
        <p><b>${totT} tópicos</b> no edital do perfil ${esc(p ? p.nome : "")}.</p>
        <p>Para terminar a teoria até ${dLonga(fim)}, duas semanas antes da prova, o plano sugere <b>${plural(porDia, "tópico novo", "tópicos novos")} por dia</b>, mais as revisões.</p>
      </div>
      <div class="onb-foot"><button class="btn pri lg" data-act="onb-fim">Começar a estudar</button></div>
    </section>`;
  }
}
Object.assign(ON, {
  "onb-perfil": el => { ONB.perfil = el.value; renderOnboarding(); },
  "onb-dia": () => { ONB.dias = $$('[data-on="onb-dia"]').filter(x => x.checked).map(x => +x.value); if (!ONB.dias.length) ONB.dias = null; renderOnboarding(); }
});
Object.assign(ACT, {
  "onb-seguir": () => { if (!ONB.perfil) return; ONB.passo = 1; renderOnboarding(); window.scrollTo(0, 0); },
  "onb-voltar": () => { ONB.passo = 0; renderOnboarding(); },
  "onb-h": el => { ONB.h = clamp((ONB.h ?? cfg().hDia) + +el.dataset.d, 0.5, 14); renderOnboarding(); },
  "onb-conectar": () => connectSheet(),
  "onb-fim": () => {
    const dias = ONB.dias || cfg().dias;
    if (!dias.length) return toast("Escolha pelo menos um dia de estudo.");
    trocarPerfil(ONB.perfil, true);
    Object.assign(DB.cfg, { dias: dias.slice().sort(), hDia: ONB.h ?? cfg().hDia, pronto: true });
    commit({ quiet: true });
    history.replaceState({ d: 0 }, "", "#/hoje");
    render({ top: true });
    toast("Pronto. Este é o seu plano de hoje.");
  }
});
/* troca o perfil do edital ABDI: os específicos do perfil anterior ficam guardados se já tiverem estudo */
function trocarPerfil(pid, silencioso) {
  const c = DB.concursos.find(x => x.id === EDITAL_ABDI.id); if (!c) return;
  const antigos = DB.materias.filter(m => m.c === c.id && m.grupo === "esp");
  const comEstudo = new Set(DB.sessoes.flatMap(s => s.itens.map(i => i.m)));
  for (const m of antigos) {
    if (m.perfil === pid) { delete m.arq; continue; }
    const usada = comEstudo.has(m.id) || DB.topicos.some(t => t.m === m.id && (t.teoria || t.ult));
    if (usada) m.arq = true;
    else { DB.materias = DB.materias.filter(x => x !== m); DB.topicos = DB.topicos.filter(t => t.m !== m.id); }
  }
  // completa as matérias do perfil que faltarem (as que já existem mantêm o estudo)
  const { m: ms, t: ts } = materiasPerfil(pid), tem = new Set(DB.materias.map(x => x.id));
  for (const m of ms) if (!tem.has(m.id)) { DB.materias.push(m); DB.topicos.push(...ts.filter(t => t.m === m.id)); }
  c.perfil = pid;
  if (!silencioso) { commit(); toast(`Perfil alterado para ${(c.perfis.find(p => p.id === pid) || {}).nome}.`); }
  else VER++;
}

/* ================= sincronização: janelas ================= */
function connectSheet() {
  const irma = chaveIrma();
  openSheet({ title: "Usar em vários aparelhos", tall: true,
    body: `${irma && !syncOn() ? `<div class="aviso ok"><p><b>Você já sincroniza o ${esc(irma.app)} neste aparelho.</b> Dá para usar a mesma chave, da conta @${esc(irma.login)}. Os dados do Estudo Fácil ficam num arquivo separado.</p><button class="btn pri sm" data-act="sync-irma">Usar a mesma chave</button></div>` : ""}
      <ol class="passos">
        <li><b>Crie uma chave de acesso no GitHub</b><span>Na página que vai abrir, em <b>Expiration</b> escolha <b>No expiration</b>. Deixe marcada só a opção <b>gist</b> e toque em <b>Generate token</b>, no fim da página.</span>
          <a class="btn ghost sm" href="${TOKEN_URL}" target="_blank" rel="noopener">${I.externo}Abrir o GitHub</a></li>
        <li><b>Copie a chave e cole aqui</b><span>Ela começa com <b>ghp_</b>.</span>
          <input id="sy-token" type="text" placeholder="ghp_…" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Chave do GitHub"></li>
        <li><b>Nos outros aparelhos</b><span>Depois de conectar, toque em <b>Outro aparelho</b> para mandar um link para você mesmo, ou cole a mesma chave.</span></li>
      </ol>
      <p class="hint">Seus tópicos, sessões, revisões e ajustes ficam num gist secreto da sua conta, criptografados com a sua chave. O gist não aparece no seu perfil e só os seus aparelhos conseguem ler.</p>`,
    foot: `<button class="btn ghost" data-no>Cancelar</button><button class="btn pri" data-ok>Conectar</button>`,
    onMount: s => {
      $("[data-no]", s).onclick = () => closeSheet();
      const ok = $("[data-ok]", s), inp = $("#sy-token", s);
      const goC = async v => { ok.disabled = true; ok.textContent = "Conectando…"; if (await connectSync(v ?? inp.value)) { closeSheet(true); if (!DB.cfg.pronto) render(); } else { ok.disabled = false; ok.textContent = "Conectar"; } };
      ok.onclick = () => goC();
      inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); goC(); } });
      const ib = $('[data-act="sync-irma"]', s); if (ib) ib.onclick = e => { e.stopPropagation(); goC(irma.token); };
    } });
}
function linkSheet() {
  const link = `${location.origin}${location.pathname}#/conectar/${encodeURIComponent(sync.token)}`;
  openSheet({ title: "Conectar outro aparelho",
    body: `<p class="lead">Mande este link para você mesmo e abra no outro aparelho. Ele entra com os mesmos dados.</p>
      <div class="aviso bad"><p><b>O link dá acesso aos seus dados de estudo.</b> Não envie para outras pessoas.</p></div>
      <p class="hint">Se no outro aparelho o app estiver instalado na tela de início, abra o app, vá em Ajustes, Sincronização, e cole a chave.</p>`,
    foot: `<button class="btn ghost" data-k>${I.copiar}Copiar chave</button><button class="btn pri" data-l>${I.link}Enviar link</button>`,
    onMount: s => {
      $("[data-k]", s).onclick = () => copyText(sync.token, "Chave copiada.");
      $("[data-l]", s).onclick = async () => {
        const text = "Link para conectar o Estudo Fácil neste aparelho: " + link;
        if (navigator.share) { try { await navigator.share({ text }); return; } catch (e) { if (e && e.name === "AbortError") return; } }
        copyText(link, "Link copiado. Cole numa conversa com você mesmo.");
      };
    } });
}
function syncCardHTML() {
  if (!syncOn()) return `<section class="bloco">
    <h2 class="b-h">Usar em vários aparelhos</h2>
    <p class="hint">Conecte sua conta GitHub e tenha os mesmos tópicos, sessões e revisões no celular, no tablet e no computador. O que você muda num aparelho aparece nos outros, até o cronômetro em andamento.</p>
    <p class="hint">Sem a sincronização, os dados ficam só neste aparelho.</p>
    <div><button class="btn pri" data-act="sync-start">${I.cloud}Ativar sincronização</button></div>
  </section>`;
  return `<section class="bloco">
    <div class="b-hr"><h2 class="b-h">Sincronização</h2>${sync.err === "auth" ? '<span class="tag bad">Parada</span>' : `<span class="tag ok">${I.check}Ligada</span>`}</div>
    <p class="hint">Conta GitHub <b>@${esc(sync.login)}</b>.</p>
    <p class="hint${syncState === "error" ? " bad" : ""}" id="sync-status">${esc(syncStatusText())}</p>
    ${sync.err === "auth" ? `<div><button class="btn pri" data-act="sync-start">Colar chave nova</button></div>` : ""}
    <div class="btns"><button class="btn ghost" data-act="sync-agora">Sincronizar agora</button><button class="btn ghost" data-act="sync-link">${I.celular}Outro aparelho</button></div>
    <div><button class="btn link muted" data-act="sync-off">Desconectar este aparelho</button></div>
  </section>`;
}
Object.assign(ACT, {
  "sync-start": () => connectSheet(),
  "sync-agora": async () => { if (await syncNow({ manual: true, quiet: true })) toast("Tudo sincronizado."); },
  "sync-link": () => linkSheet(),
  "sync-off": () => confirmSheet("Desconectar este aparelho?", "Os dados continuam neste aparelho e na nuvem, mas as mudanças deixam de passar de um para o outro.", "Desconectar", () => {
    sync = { ...sync, token: "", gistId: "", lastSync: 0, err: "" }; syncKey = null; saveSync(); render(); toast("Aparelho desconectado.");
  }),
  "sync-dica-off": () => { sync.tipOff = true; saveSync(); render(); }
});
