/* Estudo Fácil: núcleo do app.
   Dados guardados neste aparelho (localStorage) e, se ligada, sincronização criptografada por um gist secreto
   na conta GitHub do usuário (motor comum do Kit Fácil, em comum/kit-facil.js).
   Telas em telas.js; leitura de editais em PDF em leitor-pdf.js. */
"use strict";
const VERSAO = "2.3.1";

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
  livro: svg('<path d="M12 6.5C10 5 7.5 4.5 4 4.7v13.6c3.5-.2 6 .3 8 1.8 2-1.5 4.5-2 8-1.8V4.7c-3.5-.2-6 .3-8 1.8z"/><path d="M12 6.5v13.6"/>'),
  filtro: svg('<path d="M4 6h16M7 12h10M10 18h4"/>'),
  mais3: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="5.5" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="18.5" cy="12" r="1.7" fill="currentColor" stroke="none"/></svg>'
};
const MARCA = `<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="11" fill="#2742D3"/><rect x="11" y="11.5" width="26" height="4.4" rx="2.2" fill="#fff" fill-opacity=".62"/><path d="M8 21.8 40 19.6 40.6 30.2 8.6 32.2z" fill="#DFF65C"/><rect x="12" y="23.6" width="24" height="4.6" rx="2.3" fill="#131A3A"/><rect x="11" y="34.5" width="17" height="4.4" rx="2.2" fill="#fff" fill-opacity=".62"/></svg>`;

/* ================= dados ================= */
const KEY = "estudofacil.";
const LS = {
  get(k, d) { try { const v = localStorage.getItem(KEY + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(KEY + k, JSON.stringify(v)); return true; } catch { return false; } }
};
const COLLS = ["concursos", "materias", "topicos", "sessoes", "eventos", "simulados"];
const CFG_PADRAO = { hDia: 3, qDia: 20, dias: [1, 2, 3, 4, 5, 6], ciclo: [1, 7, 30], moverFolga: true, teoriaAte: "", novosDia: 0, metaMin: 50, pronto: false };
const STATUS = [["estudando", "Estudando"], ["espera", "Em espera"], ["encerrado", "Encerrado"]];
const statusTxt = s => (STATUS.find(x => x[0] === s) || STATUS[0])[1];
/* Modelo:
   materias = disciplinas, valem para todos os editais { id, nome }
   topicos = assuntos de cada disciplina { id, m, nome, ord, teoria, tc, ult, rev, ur, prox, nota }; o estudo de um assunto vale em todos os editais que o cobram
   concursos = editais { id, orgao, cargo, sigla, banca, ..., status, datas[], prova { minPct, naoZerar, grupos[{ id, nome }] },
     disc: [{ m, g (área da prova), q (questões), valor (pontos por questão), t: [assuntos cobrados] }] } */
function novoTopico(id, m, nome, ord) { return { id, m, nome, ord, teoria: false, tc: "", ult: "", rev: 0, ur: "", prox: "", nota: "" }; }
const provaVazia = () => ({ minPct: 0, naoZerar: false, grupos: [] });
function bancoNovo() {
  return { v: 2, cfg: { ...CFG_PADRAO }, concursos: [], materias: [], topicos: [], sessoes: [], eventos: [], simulados: [], ativa: null };
}
/* dados da versão 1.0 (um concurso por vez, matérias presas ao concurso) para o modelo geral */
function migrarV1(d) {
  const ORD = { gerais: 0, inst: 1, esp: 2, geral: 3 };
  const tops = Array.isArray(d.topicos) ? d.topicos : [], mats = Array.isArray(d.materias) ? d.materias : [];
  const foco = d.cfg && d.cfg.concurso;
  const out = { v: 2, cfg: { ...(d.cfg || {}) }, concursos: [], materias: [], topicos: tops, sessoes: d.sessoes || [], eventos: d.eventos || [], simulados: d.simulados || [], ativa: d.ativa || null };
  delete out.cfg.concurso;
  for (const c0 of Array.isArray(d.concursos) ? d.concursos : []) {
    const ms = mats.filter(m => m.c === c0.id && !m.arq).sort((a, b) => (ORD[a.grupo] ?? 9) - (ORD[b.grupo] ?? 9) || (a.ord || 0) - (b.ord || 0));
    const disc = ms.map(m => ({ m: m.id, g: m.grupo && m.grupo !== "geral" ? m.grupo : "", q: m.q || 0, valor: m.valor ?? 1,
      t: tops.filter(t => t.m === m.id).sort((a, b) => a.ord - b.ord).map(t => t.id), ...(m.perfil ? { perfil: m.perfil } : {}) }));
    const c = { ...c0, disc, status: !foco || c0.id === foco ? "estudando" : "espera" };
    delete c.ativo;
    c.prova = c0.prova && c0.prova.grupos ? { minPct: c0.prova.minPct || 0, naoZerar: !!c0.prova.naoZerar, grupos: c0.prova.grupos.map(g => ({ id: g.id, nome: g.nome })) } : provaVazia();
    if (c0.id === EDITAL_ABDI.id) c.modelo = EDITAL_ABDI.id;
    out.concursos.push(c);
  }
  for (const m of mats) out.materias.push({ id: m.id, nome: m.nome });
  return out;
}
function arrumarBanco(d) {
  if (d && typeof d === "object" && d.v === 1) d = migrarV1(d);
  if (!d || typeof d !== "object" || d.v !== 2) d = bancoNovo();
  for (const c of COLLS) if (!Array.isArray(d[c])) d[c] = [];
  d.cfg = { ...CFG_PADRAO, ...(d.cfg || {}) };
  delete d.cfg.concurso;
  if (!Array.isArray(d.cfg.dias) || !d.cfg.dias.length) d.cfg.dias = CFG_PADRAO.dias.slice();
  if (!Array.isArray(d.cfg.ciclo) || !d.cfg.ciclo.length) d.cfg.ciclo = CFG_PADRAO.ciclo.slice();
  for (const c of d.concursos) {
    if (!Array.isArray(c.disc)) c.disc = [];
    if (!Array.isArray(c.datas)) c.datas = [];
    if (!STATUS.some(s => s[0] === c.status)) c.status = "estudando";
    if (!c.prova || typeof c.prova !== "object") c.prova = provaVazia();
    if (!Array.isArray(c.prova.grupos)) c.prova.grupos = [];
    for (const l of c.disc) if (!Array.isArray(l.t)) l.t = [];
  }
  if (d.ativa && (!d.ativa.itens || !d.ativa.itens.length)) d.ativa = null;
  return d;
}

/* nome de assunto sem a numeração do edital ("2.1 Crase." vira "Crase") e chave para reconhecer o mesmo assunto em editais diferentes */
const limparAssunto = s => String(s || "").replace(/\s+/g, " ").trim().replace(/^(?:\d{1,2}(?:\.\d{1,2})*\s*[.)\-–:]?|[a-z][.)\-–])\s+(?=\S)/i, "").replace(/[\s.;,]+$/, "").trim();
const chave = s => fold(limparAssunto(s)).replace(/[^\p{L}\p{N}]+/gu, " ").trim();
/* junta disciplinas e assuntos às que já existem (mesmo id ou mesmo nome) e devolve os vínculos com um edital */
function incorporar(lista) {
  const links = [];
  for (const x of lista) {
    const nome = String(x.nome || "").replace(/\s+/g, " ").trim(); if (!nome) continue;
    let m = (x.id && DB.materias.find(y => y.id === x.id)) || DB.materias.find(y => chave(y.nome) === chave(nome));
    if (!m) { m = { id: x.id || uid(), nome }; DB.materias.push(m); }
    const doM = DB.topicos.filter(t => t.m === m.id);
    let ord = Math.max(-1, ...doM.map(t => t.ord)) + 1;
    const t = [];
    for (const tp of x.tops || []) {
      const tn = limparAssunto(tp.nome); if (!tn) continue;
      let top = (tp.id && doM.find(y => y.id === tp.id)) || doM.find(y => chave(y.nome) === chave(tn));
      if (!top) { top = novoTopico(tp.id && !DB.topicos.some(y => y.id === tp.id) ? tp.id : uid(), m.id, tn, ord++); DB.topicos.push(top); doM.push(top); }
      if (!t.includes(top.id)) t.push(top.id);
    }
    const prev = links.find(l => l.m === m.id);
    if (prev) { for (const id of t) if (!prev.t.includes(id)) prev.t.push(id); }
    else links.push({ m: m.id, g: x.g || "", q: x.q || 0, valor: x.valor ?? 1, t, ...(x.perfil ? { perfil: x.perfil } : {}) });
  }
  return links;
}
/* acrescenta vínculos a um edital (a mesma disciplina não se repete) */
function vincular(c, links) {
  for (const l of links) {
    const ex = c.disc.find(y => y.m === l.m);
    if (ex) { for (const id of l.t) if (!ex.t.includes(id)) ex.t.push(id); }
    else c.disc.push(l);
  }
}
/* tira do app as disciplinas que não estão em nenhum edital e nunca foram estudadas */
function limparOrfas(ids) {
  const comEstudo = new Set(DB.sessoes.flatMap(s => (s.itens || []).map(i => i.m)));
  if (DB.ativa) for (const i of DB.ativa.itens) comEstudo.add(i.m);
  for (const id of ids) {
    if (DB.concursos.some(c => c.disc.some(l => l.m === id))) continue;
    if (comEstudo.has(id) || DB.topicos.some(t => t.m === id && (t.teoria || t.ult || t.nota))) continue;
    DB.materias = DB.materias.filter(m => m.id !== id); DB.topicos = DB.topicos.filter(t => t.m !== id);
  }
}

/* edital pronto da biblioteca: ABDI 2026, com os específicos do perfil escolhido */
function listaAbdi(pid, soPerfil) {
  const E = EDITAL_ABDI, out = [];
  if (!soPerfil) E.materias.forEach(x => out.push({ id: x.id, nome: x.nome, g: x.grupo, q: x.q, valor: 0.3, tops: x.topicos.map((n, j) => ({ id: `${x.id}-${j + 1}`, nome: n })) }));
  const esp = E.especificos[pid] || [], tot = sum(esp.map(x => x.topicos.length)) || 1;
  esp.forEach((x, i) => {
    const id = `abdi-${pid}-${i + 1}`;
    out.push({ id, nome: x.nome, g: "esp", q: 20 * x.topicos.length / tot, valor: 0.65, perfil: pid, tops: x.topicos.map((n, j) => ({ id: `${id}-${j + 1}`, nome: n })) });
  });
  return out;
}
function adicionarAbdi(pid) {
  const E = EDITAL_ABDI, ja = DB.concursos.find(c => c.id === E.id);
  if (ja) return ja;
  const c = { id: E.id, modelo: E.id, sigla: E.sigla, orgao: E.orgao, cargo: E.cargo, banca: E.banca, numero: E.numero, site: E.site, email: E.email,
    remuneracao: E.remuneracao, taxa: E.taxa, lotacao: E.lotacao, regime: E.regime, validade: E.validade, dataProva: E.dataProva,
    horaProva: E.horaProva, local: E.local, provaNotas: clone(E.provaNotas), etapas: clone(E.etapas), desempate: E.desempate,
    prova: { minPct: E.prova.minPct, naoZerar: E.prova.naoZerar, grupos: E.prova.grupos.map(g => ({ id: g.id, nome: g.nome })) },
    perfis: clone(E.perfis), perfil: pid, datas: clone(E.datas), status: "estudando", disc: [], criado: today() };
  c.disc = incorporar(listaAbdi(pid));
  DB.concursos.push(c);
  return c;
}
/* troca o perfil do edital ABDI: os específicos antigos saem do edital; os que já têm estudo continuam em Disciplinas */
function trocarPerfil(c, pid) {
  const velhos = c.disc.filter(l => l.perfil && l.perfil !== pid).map(l => l.m);
  c.disc = c.disc.filter(l => !l.perfil || l.perfil === pid);
  vincular(c, incorporar(listaAbdi(pid, true)));
  c.perfil = pid;
  limparOrfas(velhos);
  commit();
  toast(`Perfil alterado para ${((c.perfis || []).find(p => p.id === pid) || {}).nome}.`);
}
const BIBLIOTECA = [{ id: EDITAL_ABDI.id, sigla: EDITAL_ABDI.sigla, orgao: EDITAL_ABDI.orgao, cargo: EDITAL_ABDI.cargo, banca: EDITAL_ABDI.banca, dataProva: EDITAL_ABDI.dataProva, perfis: EDITAL_ABDI.perfis }];
let DB = (() => { const bruto = LS.get("db", null), d = arrumarBanco(bruto); if (bruto && bruto.v === 1) LS.set("db", d); return d; })();
let VER = 1;
/* padrão do Projeto Integrador: avaliação, sobre e privacidade, tema e sincronização vêm do Kit Fácil */
KitFacil.iniciar({
  app: "estudo-facil", nome: "Estudo Fácil", versao: VERSAO, icone: "icons/icon-192.png",
  resumo: "Controle de estudos para concursos: editais, disciplinas, plano do dia, cronômetro, revisões e simulados.",
  tela: () => route().v, toast: m => toast(m), exemploDados: "os editais, as sessões de estudo e as anotações",
  abrirAjustes: secao => {
    if (route().v !== "ajustes") return go("ajustes");
    if (secao) return;
    // a engrenagem de novo fecha os Ajustes (tirando também a guia aberta, no celular)
    const st = history.state || {};
    if ((st.d || 0) > 0) history.go(st.kfAjPush ? -2 : -1); else go("hoje", true);
  },
  emAjustes: () => route().v === "ajustes",
  novidades: [{ versao: "2.3.1", itens: [
    "O chopp para o criador já está no ar: toque na caneca no alto da tela para ver o QR code e o Pix copia e cola. É opcional.",
    "Ajustes agora fica na barra de baixo (no computador, no pé do menu lateral).",
    "No alto da tela ficam o chopp, a nuvem e o balão, iguais nos três apps. Desempenho continua no alto.",
    "Novo: \"Pague um chopp para o criador!\", com QR code e Pix copia e cola. É opcional, o app continua gratuito.",
    "Depois de cada atualização, o app mostra uma vez o que mudou. A lista também fica em Ajustes, Sobre o aplicativo.",
  ] }],
  // o primeiro uso é a tela própria do Estudo Fácil (escolha do edital e da rotina): o kit só fica sabendo quem é novo
  boasVindas: { novo: () => !DB.cfg.pronto },
  ocupado: () => document.body.classList.contains("onb"),
  copia: { descricao: "Baixe um arquivo com os editais, as disciplinas, as sessões, as revisões e os ajustes.", baixar: () => KitFacil.copia.baixar({ v: 2, ...dadosSync() }, 2), restaurar: f => restaurarCopiaEstudo(f) },
  textos: { notificacoes: "O Estudo Fácil não envia notificações para o aparelho. Os avisos aparecem na tela enquanto o app está aberto; no fim do tempo de estudo, o app toca um som e vibra (se você deixar ligado abaixo)." },
  privacidade: [
    "Os editais, as disciplinas, as sessões de estudo, as revisões, os simulados e os ajustes ficam guardados neste aparelho.",
    "Os editais em PDF são lidos aqui no aparelho: o arquivo não é enviado para lugar nenhum.",
  ],
});
const SY = KitFacil.sync.criar({
  app: "estudo-facil", nome: "Estudo Fácil", chave: KEY + "sync", dados: "os mesmos editais, disciplinas, sessões e revisões",
  carimbar: () => stampAll(), aplicar: R => applyRemote(R), pacote: () => syncPayload(),
  mesmo: (out, remote) => canon(out) === canon({ v: remote.v, cfg: remote.cfg, ativa: remote.ativa ?? null, ...Object.fromEntries(COLLS.map(c => [c, remote[c]])), st: remote.st, del: remote.del }),
  redesenhar: () => render(),
  ocupado: () => busyTyping(),
});
const sync = SY.estado;
const saveSync = () => SY.salvar();
let PREF = { tema: "auto", ...LS.get("pref", {}) };
// o tema é escolhido pelo Kit Fácil (mesma chave); aqui ficam as outras preferências do aparelho
const savePref = () => { PREF.tema = KitFacil.tema.valor; LS.set("pref", PREF); };
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
});

/* ================= sincronização entre aparelhos ================= */
// O motor (conexão, criptografia, gist, avisos e telas) é o do Kit Fácil, comum aos apps do projeto. O arquivo no gist
// continua o mesmo (estudo-facil.json, mesmo formato), então aparelhos com a versão anterior seguem sincronizando.
// Aqui fica só a regra do Estudo Fácil para juntar os dados.
const syncOn = () => SY.ligada();
const scheduleSync = ms => SY.agendar(ms);
const syncNow = opts => SY.agora(opts);
const syncStatusText = () => SY.texto();
const canon = KitFacil.canon;
const busyTyping = () => !!$("#sheet-root").innerHTML || (document.activeElement && document.activeElement.matches("input,textarea,select"));
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
  // nuvem gravada pela versão 1.0: converte para o modelo geral antes de juntar
  if (R && R.v === 1) R = { ...migrarV1(R), st: R.st || {}, del: R.del || {} };
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
  const novo = { v: 2, cfg: C, ativa: DB.ativa };
  for (const c of COLLS) {
    // na primeira conexão, os dados do concurso (perfil, datas) que já estão na nuvem prevalecem, como os ajustes
    const lt = first && c === "concursos" ? () => 0 : id => st[c + ":" + id] || 0;
    novo[c] = mergeList(DB[c], Array.isArray(R[c]) ? R[c] : [], lt, id => rs[c + ":" + id] || 0, id => del[c + ":" + id] || 0,
      r => { const t = rs[c + ":" + r.id]; if (t) st[c + ":" + r.id] = t; });
  }
  const rta = rs.ativa || 0, lta = st.ativa || 0;
  if (rta > lta) { novo.ativa = R.ativa || null; st.ativa = rta; }
  DB = arrumarBanco(novo);
  // primeira conexão: os específicos de outro perfil da ABDI escolhido neste aparelho, sem estudo, saem junto com o perfil antigo
  if (first) {
    const antes = new Set(DB.materias.map(m => m.id)), topsAntes = new Set(DB.topicos.map(t => t.id));
    limparOrfas(DB.materias.filter(m => /^abdi-[a-z]+-\d+$/.test(m.id)).map(m => m.id));
    const agora = Date.now();
    for (const id of antes) if (!DB.materias.some(m => m.id === id)) { del["materias:" + id] = agora; delete st["materias:" + id]; }
    for (const id of topsAntes) if (!DB.topicos.some(t => t.id === id)) { del["topicos:" + id] = agora; delete st["topicos:" + id]; }
  }
  for (const c of COLLS) {
    const vivos = new Set(DB[c].map(r => r.id));
    for (const k of Object.keys(st)) if (k.startsWith(c + ":") && !vivos.has(k.slice(c.length + 1))) delete st[k];
  }
  sync.st = st; sync.del = del;
  persist(); snapAll(); saveSync(); VER++;
  return antes !== canon(dadosSync());
}
const dadosSync = () => { const o = { cfg: DB.cfg, ativa: DB.ativa }; for (const c of COLLS) o[c] = DB[c]; return o; };
const syncPayload = () => ({ v: 2, ...dadosSync(), st: sync.st, del: sync.del });


snapAll();

/* ================= índices derivados ================= */
let IX = { v: -1 };
const ptsLink = l => (l.q || 0) * (l.valor ?? 1);
/* O plano junta os assuntos cobrados pelos editais marcados como Estudando.
   Sem edital em estudo, vale tudo o que está cadastrado em Disciplinas. */
function ix() {
  if (IX.v === VER) return IX;
  const matById = new Map(DB.materias.map(m => [m.id, m])), topById = new Map(DB.topicos.map(t => [t.id, t]));
  const topsAll = new Map(DB.materias.map(m => [m.id, []]));
  for (const t of DB.topicos) { const l = topsAll.get(t.m); if (l) l.push(t); }
  for (const l of topsAll.values()) l.sort((a, b) => a.ord - b.ord);
  const ativos = DB.concursos.filter(c => c.status === "estudando").sort((a, b) => (a.dataProva || "9999").localeCompare(b.dataProva || "9999"));
  const ordem = new Set(), share = new Map();
  let escopo = null;
  if (ativos.length) {
    escopo = new Set();
    const comPts = ativos.filter(c => sum(c.disc.map(ptsLink)) > 0).length;
    for (const c of ativos) {
      const tot = sum(c.disc.map(ptsLink));
      for (const l of c.disc) {
        if (!matById.has(l.m)) continue;
        ordem.add(l.m);
        for (const id of l.t) { const t = topById.get(id); if (t && t.m === l.m) escopo.add(id); }
        // peso da disciplina: média da parte da nota que ela vale em cada edital em estudo
        if (tot) share.set(l.m, (share.get(l.m) || 0) + ptsLink(l) / tot / comPts);
      }
    }
  } else DB.materias.slice().sort((a, b) => fold(a.nome).localeCompare(fold(b.nome))).forEach(m => ordem.add(m.id));
  const topsByMat = new Map();
  for (const id of ordem) { const l = topsAll.get(id).filter(t => !escopo || escopo.has(t.id)); if (l.length) topsByMat.set(id, l); }
  const mats = [...topsByMat.keys()].map(id => matById.get(id));
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
  const first = sess.length ? sess[sess.length - 1].d : "";
  IX = { v: VER, ativos, mats, matById, topById, topsAll, topsByMat, tops, stT, stM, days, sess, share, shareTot: sum([...share.values()]), first, est: new Map() };
  return IX;
}
const matNome = id => (ix().matById.get(id) || {}).nome || "Disciplina removida";
const topNome = id => (ix().topById.get(id) || {}).nome || "Assunto removido";
const statT = id => ix().stT.get(id) || { s: 0, a: 0, e: 0, n: 0, last: "" };
const nomeEdital = c => c ? c.sigla || c.orgao || c.cargo || "Edital" : "";
const editalPorId = id => DB.concursos.find(c => c.id === id);
const editaisVivos = () => DB.concursos.filter(c => c.status !== "encerrado");
function resumoEdital(tops = ix().tops) {
  const n = tops.length, teo = tops.filter(t => t.teoria).length, est = tops.filter(t => t.teoria || t.ult).length;
  return { n, teo, est, pc: pct(teo, n) };
}
/* estrutura de um edital: disciplinas, assuntos cobrados, áreas da prova, questões e pontos */
function estrutura(c) {
  const X = ix(); if (X.est.has(c.id)) return X.est.get(c.id);
  const links = c.disc.filter(l => X.matById.has(l.m)).map(l => ({ ...l, mat: X.matById.get(l.m), pts: ptsLink(l),
    tops: l.t.map(id => X.topById.get(id)).filter(t => t && t.m === l.m).sort((a, b) => a.ord - b.ord) }));
  const def = (c.prova && c.prova.grupos) || [];
  const grupos = def.map(g => ({ id: g.id, nome: g.nome, links: links.filter(l => l.g === g.id) })).filter(g => g.links.length);
  const sem = links.filter(l => !def.some(g => g.id === l.g));
  if (sem.length) grupos.push({ id: "", nome: def.length ? "Sem área definida" : "", links: sem });
  for (const g of grupos) { g.q = sum(g.links.map(l => l.q || 0)); g.pts = sum(g.links.map(l => l.pts)); }
  const tops = links.flatMap(l => l.tops);
  const E = { links, grupos, q: sum(links.map(l => l.q || 0)), pts: sum(links.map(l => l.pts)), tops, ...resumoEdital(tops) };
  X.est.set(c.id, E);
  return E;
}
/* edital em estudo com a prova mais próxima */
function provaProx() {
  const t = today();
  return ix().ativos.find(c => c.dataProva && c.dataProva >= t) || null;
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
  const c = provaProx(), t = today();
  if (cfg().teoriaAte) return cfg().teoriaAte;
  if (c) { const f = addD(c.dataProva, -14); return f > t ? f : addD(c.dataProva, -1); }
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
  const peso = m => (X.share.get(m) || 0) / Math.max(1, (X.topsByMat.get(m) || []).length);
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
  const peso = m => (X.share.get(m) || 0) / Math.max(1, (X.topsByMat.get(m) || []).length);
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
  if (PREF.alarme === false) return; // Ajustes → Notificações: som e vibração no fim do tempo
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
const NAV = [["hoje", "Hoje", "hoje"], ["editais", "Editais", "edital"], ["estudar", "Estudar", "timer"], ["disciplinas", "Disciplinas", "livro"], ["agenda", "Agenda", "agenda"]];
const RAIL_MAIS = [["desempenho", "Desempenho", "stats"]]; // Ajustes fica no fim da navegação (KitFacil.nav.ajustes), igual nos três apps
const ABA = { edital: "editais" };
function route() {
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, "")).split("/");
  const v = VIEWS[h[0]] ? h[0] : "hoje";
  return { v, sub: h[1] || "", sub2: h[2] || "" };
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
  const a = DB.ativa, aba = ABA[r.v] || r.v;
  const cur = v => aba === v ? 'aria-current="page"' : "";
  const navBtn = ([v, l, ic]) => {
    if (v === "estudar") return `<button class="kf-nav-it nav-go${a ? " ativo" : ""}" data-act="nav-estudar" ${cur(v)}><span class="nav-fab">${a ? I.timer : I.play}</span><span class="kf-nav-l" ${a ? 'data-tick="nav"' : ""}>${a ? relogio(estudoTotal(a, Date.now())) : l}</span></button>`;
    return `<button class="kf-nav-it" data-go="${v}" ${cur(v)}><span class="kf-nav-ic">${I[ic]}</span><span class="kf-nav-l">${l}</span></button>`;
  };
  $("#nav").innerHTML = NAV.map(navBtn).join("") + KitFacil.nav.ajustes("nav", { id: "nav-ajustes" });
  $("#rail-nav").innerHTML = [...NAV, ...RAIL_MAIS].map(([v, l, ic]) => v === "estudar"
    ? `<button class="kf-trilho-it rail-go${a ? " ativo" : ""}" data-act="nav-estudar" ${cur(v)}>${a ? I.timer : I.play}<span ${a ? 'data-tick="nav"' : ""}>${a ? relogio(estudoTotal(a, Date.now())) : "Estudar"}</span></button>`
    : `<button class="kf-trilho-it" data-go="${v}" ${cur(v)}>${I[ic]}<span>${l}</span></button>`).join("");
  // ação própria do Estudo Fácil na barra de cima (no computador, Desempenho fica no trilho)
  $("#bar-acts").innerHTML = `<button class="icon-btn" data-go="desempenho" aria-label="Desempenho" title="Desempenho" ${cur("desempenho")}>${I.stats}</button>`;
  // Ajustes no pé do trilho (computador)
  if ($("#rail-ajustes")) $("#rail-ajustes").outerHTML = KitFacil.nav.ajustes("trilho", { id: "trilho-ajustes" });
  // área superior direita padronizada: chopp, nuvem e balão
  if (!$("#topo .kf-topo")) $("#topo").innerHTML = KitFacil.topo.html({ principal: true });
  KitFacil.topo.atualizar();
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
const ONB = { passo: 0, dias: null, h: null, semEdital: false };
function renderOnboarding() {
  document.body.classList.add("onb");
  const t = today();
  $("#nav").innerHTML = ""; $("#rail-nav").innerHTML = ""; $("#bar-acts").innerHTML = "";
  const main = $("#main");
  if (ONB.passo === 0) {
    const bib = BIBLIOTECA.filter(b => !DB.concursos.some(c => c.id === b.id));
    const ja = DB.concursos;
    main.innerHTML = `<section class="onb-wrap">
      <div class="onb-mark">${MARCA}</div>
      <h1 class="onb-h">Seu estudo para concursos, organizado.</h1>
      <p class="lead">Você cadastra o edital e as disciplinas. O Estudo Fácil diz o que estudar a cada dia, cronometra o estudo e agenda as revisões.</p>
      ${ja.length ? `<div class="aviso ok"><p><b>Já adicionado:</b> ${esc(ja.map(nomeEdital).join(", "))}.</p><button class="btn pri sm" data-act="onb-rotina">Continuar</button></div>` : ""}
      <h2 class="onb-q">Como quer começar?</h2>
      <div class="opcoes">
        ${bib.map(b => `<button class="opcao" data-act="bib-abdi"><span class="op-k">Edital pronto</span><span class="op-n">${esc(b.orgao)} (${esc(b.sigla)})</span><span class="op-d">${esc(b.cargo)}. Banca ${esc(b.banca)}, prova em ${dLonga(b.dataProva)}${b.dataProva >= t ? `, daqui a ${plural(diffD(t, b.dataProva), "dia", "dias")}` : ""}. Já vem com disciplinas, assuntos, pesos e datas.</span></button>`).join("")}
        <label class="opcao" for="onb-pdf"><span class="op-k">${I.arquivo}PDF do edital</span><span class="op-n">Tenho o edital em PDF</span><span class="op-d">O app lê o arquivo aqui no aparelho e separa disciplinas, assuntos e datas. Você confere antes de salvar.</span></label>
        <input type="file" id="onb-pdf" accept="application/pdf,.pdf" data-on="pdf" hidden>
        <button class="opcao" data-act="ed-novo-mao"><span class="op-k">${I.lapis}À mão</span><span class="op-n">Cadastrar o edital</span><span class="op-d">Digite órgão, cargo e data da prova. Depois cole o conteúdo programático ou escolha as disciplinas.</span></button>
        <button class="opcao" data-act="onb-sem-edital"><span class="op-k">${I.livro}Sem edital</span><span class="op-n">Só minhas disciplinas</span><span class="op-d">Cadastre as disciplinas e os assuntos que vai estudar. O plano do dia usa todos eles. Dá para adicionar um edital depois.</span></button>
      </div>
      <div class="onb-foot"><button class="btn link" data-act="onb-conectar">Já uso o Estudo Fácil em outro aparelho</button></div>
    </section>`;
  } else {
    const dias = ONB.dias || cfg().dias, h = ONB.h ?? cfg().hDia;
    const X = ix(), totT = X.tops.length, c = provaProx();
    const fim = c ? addD(c.dataProva, -14) : addD(t, 60);
    let nd = 0; for (let d = t; d <= fim; d = addD(d, 1)) if (dias.includes(toD(d).getDay())) nd++;
    const porDia = nd ? Math.ceil(totT / nd) : totT;
    main.innerHTML = `<section class="onb-wrap">
      <button class="btn link back" data-act="onb-voltar">${I.chevL}Voltar</button>
      <h1 class="onb-h">Sua rotina de estudo</h1>
      <p class="lead">Com isso o app monta o plano de cada dia. Você ajusta quando quiser.</p>
      <div class="field"><span class="lbl">Dias em que você estuda</span>
        <div class="dias">${[1, 2, 3, 4, 5, 6, 0].map(d => `<label class="dia"><input type="checkbox" value="${d}" ${dias.includes(d) ? "checked" : ""} data-on="onb-dia"><span>${WD[d]}</span></label>`).join("")}</div></div>
      <div class="field"><span class="lbl">Horas por dia de estudo</span>
        <div class="stepper"><button class="icon-btn boxed" data-act="onb-h" data-d="-0.5" aria-label="Menos meia hora">${I.minus}</button><output id="onb-h">${dec(h)} h</output><button class="icon-btn boxed" data-act="onb-h" data-d="0.5" aria-label="Mais meia hora">${I.plus}</button></div></div>
      <div class="onb-calc">${totT ? `<p><b>${plural(totT, "assunto", "assuntos")}</b> ${X.ativos.length ? `no edital ${esc(X.ativos.map(nomeEdital).join(" e "))}` : "nas suas disciplinas"}.</p>
        <p>Para terminar a teoria até ${dLonga(fim)}${c ? ", duas semanas antes da prova" : ""}, o plano sugere <b>${plural(porDia, "assunto novo", "assuntos novos")} por dia</b>, mais as revisões.</p>`
        : `<p>Depois desta etapa, cadastre suas disciplinas e os assuntos de cada uma. O plano do dia começa a partir delas.</p>`}</div>
      <div class="onb-foot"><button class="btn pri lg" data-act="onb-fim">${totT ? "Começar a estudar" : "Cadastrar disciplinas"}</button></div>
    </section>`;
  }
}
/* depois de criar um edital: no primeiro uso segue para a rotina; depois, abre o edital */
function editalCriado(c, msg) {
  closeSheet(true);
  if (!DB.cfg.pronto) { ONB.passo = 1; commit({ quiet: true }); renderOnboarding(); window.scrollTo(0, 0); if (msg) toast(msg); return; }
  commit({ quiet: true });
  go("edital/" + c.id);
  if (msg) toast(msg);
}
Object.assign(ON, {
  "onb-dia": () => { ONB.dias = $$('[data-on="onb-dia"]').filter(x => x.checked).map(x => +x.value); if (!ONB.dias.length) ONB.dias = null; renderOnboarding(); }
});
Object.assign(ACT, {
  "onb-rotina": () => { ONB.passo = 1; renderOnboarding(); window.scrollTo(0, 0); },
  "onb-sem-edital": () => { ONB.semEdital = true; ONB.passo = 1; renderOnboarding(); window.scrollTo(0, 0); },
  "onb-voltar": () => { ONB.passo = 0; renderOnboarding(); },
  "onb-h": el => { ONB.h = clamp((ONB.h ?? cfg().hDia) + +el.dataset.d, 0.5, 14); renderOnboarding(); },
  "onb-conectar": () => SY.dialogoConectar(),
  "onb-fim": () => {
    const dias = ONB.dias || cfg().dias;
    if (!dias.length) return toast("Escolha pelo menos um dia de estudo.");
    Object.assign(DB.cfg, { dias: dias.slice().sort(), hDia: ONB.h ?? cfg().hDia, pronto: true });
    commit({ quiet: true });
    const vazio = !ix().tops.length;
    history.replaceState({ d: 0 }, "", vazio ? "#/disciplinas" : "#/hoje");
    render({ top: true });
    if (vazio) materiaSheet(null); else toast("Pronto. Este é o seu plano de hoje.");
  }
});

/* ================= sincronização: atalhos (as janelas e os textos são do Kit Fácil) ================= */
Object.assign(ACT, {
  "sync-start": () => SY.dialogoConectar(),
  "sync-dica-off": () => { sync.tipOff = true; saveSync(); render(); }
});
