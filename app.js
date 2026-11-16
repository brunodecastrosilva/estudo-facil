/* Estudo Fácil · motor do app: dados, plano do dia, sequência, pontos, domínio do edital, revisões e sincronização.
   As telas ficam em telas.js; a sessão de estudo, em estudar.js; níveis e medalhas, em jogo.js; moldura, Ajustes,
   abertura e guia, em casca.js. Os editais da biblioteca ficam em editais.js. */
"use strict";
const VERSAO = '1.7.3';
const KEY = 'estudofacil.';

/* ---------- utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const novoId = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-5);
const plural = (n, s, p) => n + ' ' + (n === 1 ? s : p);
const norm = s => String(s || '').trim().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[̀-ͯ]/g, '');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const soma = (L, f) => L.reduce((a, x) => a + (f ? f(x) : x), 0);
const DIA = 864e5;
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const deISO = s => { const [a, m, d] = String(s).split('-').map(Number); return new Date(a, (m || 1) - 1, d || 1); };
// nos testes, ?hoje=AAAA-MM-DD fixa o dia (só em endereço local)
const HOJE_FIXO = (() => { try { const m = /[?&]hoje=(\d{4}-\d{2}-\d{2})/.exec(location.search); return m && /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? m[1] : null; } catch { return null; } })();
/* Funções gerais do app público (Concursos, Disciplinas, Simulados, Agenda e o guia): ficam fora da fase de testes
   fechada, em que o app é só da ANPD. O código continua aqui; nos testes, ?geral=1 as liga (só em localhost). */
const GERAL = (() => { try { return /[?&]geral=1/.test(location.search) && /^(localhost|127\.0\.0\.1)$/.test(location.hostname); } catch { return false; } })();
const agora = () => HOJE_FIXO ? deISO(HOJE_FIXO).getTime() + (Date.now() % DIA) : Date.now();
const hojeISO = () => HOJE_FIXO || iso(new Date());
const maisDias = (s, n) => { const d = deISO(s); d.setDate(d.getDate() + n); return iso(d); };
const entreDias = (a, b) => Math.round((deISO(b) - deISO(a)) / DIA);
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const SEMANA_L = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const fmtData = s => { if (!s) return ''; const d = deISO(s); return `${d.getDate()} de ${MESES[d.getMonth()]}${d.getFullYear() !== new Date().getFullYear() ? ' de ' + d.getFullYear() : ''}`; };
const fmtDataAno = s => { if (!s) return ''; const d = deISO(s); return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`; };
const fmtDataCurta = s => { const d = deISO(s); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`; };
// todo tempo do app aparece em hh:mm:ss
const fmtRelogio = seg => { seg = Math.max(0, Math.round(seg)); const p = n => String(n).padStart(2, '0'); return `${p(Math.floor(seg / 3600))}:${p(Math.floor(seg % 3600 / 60))}:${p(seg % 60)}`; };
const fmtMin = m => fmtRelogio(m * 60);
const fmtHoras = fmtMin;
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const primeiroNome = n => String(n || '').trim().split(/\s+/)[0] || '';

/* ---------- ícones: um traço só, grade de 24, traço de 2, pontas redondas (Código, Art. 57) ---------- */
const svgI = (d, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const I = {
  hoje: svgI('<path d="M4 11.5 12 5l8 6.500V19a1 1 0 0 1-1 1h-4.500v-5.500h-5V20H5a1 1 0 0 1-1-1z"/>'),
  plano: svgI('<path d="M7 3.500h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2z"/><path d="M9 8.500h6M9 12.500h6M9 16.500h3"/>'),
  evolucao: svgI('<path d="M4 19.500h16"/><path d="m5 15 4.500-4.500 3.500 3 6-7"/><path d="M15 6.500h4v4"/>'),
  play: svgI('<path d="M8.500 5.500v13l10-6.500z"/>'),
  pausa: svgI('<path d="M9 5.500v13M15 5.500v13"/>'),
  mais: svgI('<path d="M12 5v14M5 12h14"/>'),
  seta: svgI('<path d="m9.500 6 6 6-6 6"/>', 'seta'),
  volta: svgI('<path d="m14.500 6-6 6 6 6"/>'),
  check: svgI('<path d="m5 12.500 4.500 4.500L19 7.500"/>'),
  x: svgI('<path d="M6 6l12 12M18 6 6 18"/>'),
  relogio: svgI('<circle cx="12" cy="12.500" r="8"/><path d="M12 8v4.500l3 2"/>'),
  alvo: svgI('<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="4.500"/><path d="M12 12h.01"/>'),
  revisar: svgI('<path d="M19.500 12a7.500 7.500 0 1 1-2.400-5.500"/><path d="M19.500 4.500v4h-4"/>'),
  questoes: svgI('<path d="M9.500 9.300a2.700 2.700 0 1 1 3.800 2.500c-.8.4-1.300 1-1.300 1.900"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="9"/>'),
  livro: svgI('<path d="M5 5.500c2.300-.8 4.700-.6 7 .6 2.300-1.200 4.700-1.400 7-.6v12.500c-2.300-.8-4.700-.6-7 .6-2.300-1.200-4.700-1.400-7-.6zM12 6.100v12.500"/>'),
  lei: svgI('<path d="M12 4v16M7 20h10M5.500 7.500h13"/><path d="m5.500 7.500-2.500 6a3 3 0 0 0 5 0zM18.500 7.500l-2.500 6a3 3 0 0 0 5 0z"/>'),
  agenda: svgI('<rect x="4" y="5.500" width="16" height="14.500" rx="2"/><path d="M8 3.500v4M16 3.500v4M4 10.500h16"/>'),
  medalha: svgI('<circle cx="12" cy="14.500" r="5.500"/><path d="M8.500 3.500 12 9l3.500-5.500M9.200 10 6.500 3.500M14.800 10l2.700-6.500"/>'),
  chama: svgI('<path d="M12 21a6.500 6.500 0 0 1-6.500-6.500c0-3 1.800-4.600 3-6.500.4 1.600 1.300 2.500 2.300 2.900C10.600 7.500 12 5 14 3c.3 2.600 1.600 4.200 2.800 5.800 1 1.400 1.700 3 1.700 5.700A6.500 6.500 0 0 1 12 21z"/>'),
  concurso: svgI('<path d="M4 20h16M6 20V9M10 20V9M14 20V9M18 20V9M3.500 9 12 4l8.500 5z"/>'),
  disciplinas: svgI('<path d="M5 6.500h14M5 12h14M5 17.500h9"/>'),
  simulado: svgI('<path d="M7 3.500h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2z"/><path d="m9 9 1.300 1.300L13 7.700M9 15l1.300 1.300 2.700-2.600M15 9.500h.01M15 15.500h.01"/>'),
  lixo: svgI('<path d="M5 7h14M10 7V4.500h4V7M7 7l.8 12a1 1 0 0 0 1 1h6.400a1 1 0 0 0 1-1L17 7M10 11v5M14 11v5"/>'),
  lapis: svgI('<path d="m5 19 1-4L16.500 4.500a2 2 0 0 1 3 3L9 18z"/><path d="m14.500 6.500 3 3"/>'),
  sobe: svgI('<path d="m6 14.500 6-6 6 6"/>'),
  desce: svgI('<path d="m6 9.500 6 6 6-6"/>'),
  ajustes: svgI('<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>'),
  estrela: svgI('<path d="m12 3.500 2.600 5.400 5.900.8-4.300 4.100 1 5.900L12 16.900l-5.200 2.800 1-5.900-4.300-4.100 5.900-.8z"/>'),
  escudo: svgI('<path d="M12 3.500 5 6v5.500c0 4.300 2.900 7.300 7 9 4.100-1.700 7-4.700 7-9V6z"/>'),
  raio: svgI('<path d="M13 3 5.500 13.500H11L10 21l8-11h-5.500z"/>'),
  fora: svgI('<path d="M14 5h5v5M19 5l-8 8M11 6H6.500a1.500 1.500 0 0 0-1.500 1.500v10A1.500 1.500 0 0 0 6.500 19h10a1.500 1.500 0 0 0 1.500-1.500V13"/>'),
  marca: svgI('<path d="m14.500 4.500 5 5L11 18H6v-5z"/><path d="M4 21h9"/>'),
  balao: svgI('<path d="M5 6.500A1.500 1.500 0 0 1 6.500 5h11A1.500 1.500 0 0 1 19 6.500v8a1.500 1.500 0 0 1-1.500 1.500H11l-4 3.500V16h-.500A1.500 1.500 0 0 1 5 14.500z"/><path d="M9 9.500h6M9 12.500h4"/>'),
  cartas: svgI('<path d="M6.500 6.500h8A1.500 1.500 0 0 1 16 8v10a1.500 1.500 0 0 1-1.500 1.500h-8A1.500 1.500 0 0 1 5 18V8a1.500 1.500 0 0 1 1.500-1.500z"/><path d="M8.500 4h9A1.500 1.500 0 0 1 19 5.500V16"/>'),
};

/* ---------- armazenamento ---------- */
let semSalvar = false; // durante o guia, a demonstração mexe em tudo e nada é gravado
const LS = {
  get(k, def) { try { const v = localStorage.getItem(KEY + k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set(k, v) { if (semSalvar) return true; try { localStorage.setItem(KEY + k, JSON.stringify(v)); return true; } catch { return false; } },
  del(k) { try { localStorage.removeItem(KEY + k); } catch {} },
};

/* ---------- modelo ----------
   Tudo num objeto só (estudofacil.db, formato 3). Cada lista tem registros com id; a sincronização junta registro a registro.
   concursos   editais: situação, datas, prova e os vínculos `disc` (disciplina, área, itens e assuntos cobrados)
   materias    disciplinas (globais)            topicos    assuntos (globais): o que se estuda vale em todos os editais
   sessoes     sessões de estudo                revisoes   revisões marcadas para cada assunto
   dias        dias em que a meta foi batida    marcos     medalhas vistas e marcas do app (guia, abertura)
   simulados   resultados de simulados          eventos    compromissos da agenda
   respostas   uma por questão do app já respondida (vezes, acertos e a caixa do flashcard) e uma por item de prova
               oficial marcado (pv:<prova>:<item>)       redacoes   textos do treino da discursiva
   cadernos    cadernos de questões: os seus e o andamento dos de fábrica (cadernos.js) */
const COLLS = ['concursos', 'materias', 'topicos', 'sessoes', 'revisoes', 'respostas', 'cadernos', 'textos', 'redacoes', 'dias', 'marcos', 'simulados', 'eventos'];
const CFG_PADRAO = { nome: '', metaMin: 60, dias: [0, 1, 2, 3, 4, 5, 6], bloco: 30, metaQ: 50, revisoes: [1, 7, 30], som: true, vibra: true, jogo: true };
const CORES = ['#2742D3', '#0E8A7D', '#C2410C', '#7C3AED', '#B4235A', '#0369A1', '#4D7C0F', '#B45309', '#BE185D', '#0F766E', '#6D28D9', '#9A3412'];
const TIPOS = { teoria: 'Teoria', questoes: 'Questões', revisao: 'Revisão', lei: 'Lei seca' };
const DOMINIOS = ['Novo', 'Começado', 'Estudado', 'Revisado', 'Dominado'];

function bancoVazio() { const o = { v: 3, cfg: { ...CFG_PADRAO }, ativa: null }; for (const c of COLLS) o[c] = []; return o; }
function arrumarBanco(o) {
  if (!o || o.v !== 3) return null;
  const b = bancoVazio();
  b.cfg = { ...CFG_PADRAO, ...(o.cfg || {}) };
  if (!Array.isArray(b.cfg.dias)) b.cfg.dias = [...CFG_PADRAO.dias];
  if (!Array.isArray(b.cfg.revisoes) || !b.cfg.revisoes.length) b.cfg.revisoes = [...CFG_PADRAO.revisoes];
  b.cfg.metaMin = clamp(+b.cfg.metaMin || 60, 15, 600); b.cfg.bloco = clamp(+b.cfg.bloco || 30, 15, 120); b.cfg.metaQ = clamp(b.cfg.metaQ == null ? 50 : +b.cfg.metaQ || 0, 0, 300);
  for (const c of COLLS) b[c] = Array.isArray(o[c]) ? o[c].filter(r => r && r.id != null) : [];
  b.ativa = o.ativa && typeof o.ativa === 'object' ? o.ativa : null;
  return b;
}
/* instala um edital da biblioteca: cria as disciplinas e os assuntos que ainda não existem e o concurso com os vínculos */
function instalarEdital(db, ed, { perfil = '' } = {}) {
  if (db.concursos.some(c => c.id === ed.id)) return db.concursos.find(c => c.id === ed.id);
  const lista = ed.materias.map(m => ({ ...m }));
  const esp = perfil && ed.especificos && ed.especificos[perfil];
  if (esp) {
    const nTop = soma(esp, m => m.topicos.length) || 1, qEsp = (ed.prova.grupos.find(g => g.id === 'esp') || {}).q || 0;
    esp.forEach((m, i) => lista.push({ id: `${ed.base}-${perfil}-${i + 1}`, grupo: 'esp', nome: m.nome, q: Math.round(qEsp * m.topicos.length / nTop * 10) / 10, topicos: m.topicos }));
  }
  const disc = [];
  lista.forEach((m, k) => {
    let mat = db.materias.find(x => x.id === m.id) || db.materias.find(x => norm(x.nome) === norm(m.nome));
    if (!mat) { mat = { id: m.id, nome: m.nome, cor: CORES[(m.cor ?? db.materias.length) % CORES.length], dica: m.dica || '' }; db.materias.push(mat); }
    const ids = m.topicos.map((nome, i) => {
      let t = db.topicos.find(x => x.m === mat.id && norm(x.nome) === norm(nome));
      if (!t) { t = { id: `${m.id}-${String(i + 1).padStart(2, '0')}`, m: mat.id, nome, ordem: db.topicos.filter(x => x.m === mat.id).length, teoria: 0 }; db.topicos.push(t); }
      return t.id;
    });
    disc.push({ m: mat.id, grupo: m.grupo || '', q: m.q || 0, f1: m.f1 || 1, topicos: ids });
    void k;
  });
  const c = { id: ed.id, base: ed.base, sigla: ed.sigla, orgao: ed.orgao, cargo: ed.cargo, banca: ed.banca || '', perfil,
    previsto: !!ed.previsto, situacao: 'ativo', dataProva: ed.dataProva || '', dataEdital: ed.dataEdital || '',
    prova: JSON.parse(JSON.stringify(ed.prova || { minPct: 50, grupos: [] })), datas: (ed.datas || []).map(d => ({ ...d })), disc, em: agora() };
  db.concursos.push(c);
  return c;
}
const editalDaBiblioteca = c => (typeof BIBLIOTECA !== 'undefined' ? BIBLIOTECA : []).find(e => e.id === c.id) || null;

/* carrega os dados; quem vem do formato antigo (0.x) começa de novo, e a cópia antiga fica guardada no aparelho */
let DB = (() => {
  const cru = LS.get('db', null), b = arrumarBanco(cru);
  if (b) {
    const c = b.concursos.find(x => x.id === 'anpd-2027');
    if (c && (!c.banca || c.banca === 'A definir')) { c.banca = 'Cebraspe'; if (!c.datas.some(d => d.id === 'd03b')) c.datas.push({ id: 'd03b', tipo: 'aviso', titulo: 'Cebraspe escolhido como banca do concurso', ini: '2026-11-14' }); LS.set('db', b); }
    return b;
  }
  if (cru && !LS.get('db_antigo', null)) LS.set('db_antigo', cru);
  const novo = bancoVazio();
  if (typeof EDITAL_ANPD !== 'undefined') instalarEdital(novo, EDITAL_ANPD); // de fábrica: o plano para a ANPD
  LS.set('db', novo);
  return novo;
})();
const cfg = () => DB.cfg;
let VER = 0; // muda a cada alteração: os índices derivados são refeitos

/* ---------- índices derivados ---------- */
let IDX = { ver: -1 };
function idx() {
  if (IDX.ver === VER) return IDX;
  const x = { ver: VER, mat: new Map(DB.materias.map(m => [m.id, m])), top: new Map(DB.topicos.map(t => [t.id, t])), topsDe: new Map(), sessT: new Map(), sessDia: new Map(), revT: new Map(), minDia: new Map(), dias: new Set(DB.dias.map(d => d.id)), marcos: new Map(DB.marcos.map(m => [m.id, m])), resp: new Map(DB.respostas.map(r => [r.id, r])) };
  for (const t of DB.topicos) { if (!x.topsDe.has(t.m)) x.topsDe.set(t.m, []); x.topsDe.get(t.m).push(t); }
  for (const L of x.topsDe.values()) L.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
  for (const s of DB.sessoes) {
    if (s.t) { if (!x.sessT.has(s.t)) x.sessT.set(s.t, []); x.sessT.get(s.t).push(s); }
    if (!x.sessDia.has(s.dia)) x.sessDia.set(s.dia, []); x.sessDia.get(s.dia).push(s);
    x.minDia.set(s.dia, (x.minDia.get(s.dia) || 0) + (s.seg || 0) / 60);
  }
  for (const r of DB.revisoes) { if (!x.revT.has(r.t)) x.revT.set(r.t, []); x.revT.get(r.t).push(r); }
  return (IDX = x);
}
const materia = id => idx().mat.get(id) || null;
const topico = id => idx().top.get(id) || null;
const topicosDe = mId => idx().topsDe.get(mId) || [];
const sessoesDe = tId => idx().sessT.get(tId) || [];
const sessoesDoDia = d => idx().sessDia.get(d) || [];
const minutosDoDia = d => idx().minDia.get(d) || 0;
const concursosAtivos = () => DB.concursos.filter(c => c.situacao === 'ativo');
const concursoFoco = () => concursosAtivos().find(c => c.id === cfg().foco) || concursosAtivos()[0] || null;
const temMarco = id => idx().marcos.has(id);
function marcar(id) { if (temMarco(id)) return false; DB.marcos.push({ id, em: agora() }); VER++; return true; }

/* ---------- pesos: quanto cada disciplina vale na prova ----------
   A fatia de cada disciplina é a média da fatia da nota que ela vale em cada concurso em estudo. Antes do edital
   (concurso previsto), o fator `f1` puxa para a frente o que quase certamente cai. */
function fatias(c, { fase = true } = {}) {
  const valor = g => (c.prova.grupos.find(x => x.id === g) || {}).valor || 1;
  const pre = fase && c.previsto; // enquanto o edital não for marcado como publicado
  const bruto = c.disc.filter(d => !d.fora).map(d => [d.m, Math.max(0.01, (d.q || 1) * valor(d.grupo) * (pre ? d.f1 || 1 : 1))]);
  const tot = soma(bruto, b => b[1]) || 1;
  return new Map(bruto.map(([m, v]) => [m, v / tot]));
}
function pesosAtuais(opts) {
  const A = concursosAtivos(), out = new Map();
  if (!A.length) { const M = DB.materias.filter(m => topicosDe(m.id).length); M.forEach(m => out.set(m.id, 1 / M.length)); return out; }
  for (const c of A) for (const [m, v] of fatias(c, opts)) out.set(m, (out.get(m) || 0) + v / A.length);
  return out;
}
// fase do plano de um concurso da biblioteca (base antes do edital, edital na mão, reta final)
function faseAtual(c) {
  if (!c || !c.dataProva) return null;
  const falta = entreDias(hojeISO(), c.dataProva);
  if (falta < 0) return { id: 'fim', nome: 'Prova feita', i: 3 };
  if (falta <= 30) return { id: 'f3', nome: 'Reta final', i: 2 };
  if (c.previsto) return { id: 'f1', nome: 'Base antes do edital', i: 0 };
  return { id: 'f2', nome: c.previsto ? 'Edital na mão' : 'Cobrir o edital', i: 1 };
}

/* ---------- domínio de um assunto (0 a 4) e prontidão ----------
   0 Novo · 1 Começado (já tem estudo) · 2 Estudado (teoria concluída) · 3 Revisado (1 revisão feita, ou 10+ questões
   com 70% de acertos) · 4 Dominado (todas as revisões feitas, ou 2 revisões e 20+ questões com 80% de acertos). */
function dominio(t, ate = Infinity) {
  if (!t) return 0;
  const S = sessoesDe(t.id).filter(s => s.ini <= ate), teoria = t.teoria && t.teoria <= ate;
  if (!S.length && !teoria) return 0;
  if (!teoria) return 1;
  const revs = (idx().revT.get(t.id) || []).filter(r => r.feita && r.feita <= ate).length;
  let ac = 0, tot = 0; for (const s of S) { ac += s.ac || 0; tot += (s.ac || 0) + (s.er || 0); }
  const p = tot ? ac / tot : 0, todas = Math.max(2, cfg().revisoes.length);
  if (revs >= todas || (revs >= 2 && tot >= 20 && p >= .8)) return 4;
  if (revs >= 1 || (tot >= 10 && p >= .7)) return 3;
  return 2;
}
// parte do edital já grifada, contando o peso de cada disciplina (0 a 100)
function prontidao(c, ate = Infinity) {
  if (!c) return 0;
  const F = fatias(c, { fase: false }); let p = 0;
  for (const d of c.disc) { if (d.fora || !d.topicos.length) continue; p += (F.get(d.m) || 0) * soma(d.topicos, id => dominio(topico(id), ate)) / (d.topicos.length * 4); }
  return Math.round(p * 100);
}
function progressoDisc(d, ate = Infinity) {
  const T = d.topicos.map(topico).filter(Boolean), n = T.length || 1, D = T.map(t => dominio(t, ate));
  return { n: T.length, vistos: D.filter(x => x >= 2).length, dominados: D.filter(x => x >= 4).length, pct: Math.round(soma(D) / (n * 4) * 100) };
}
function acertosDe(filtro, desde = 0) {
  let ac = 0, er = 0; for (const s of DB.sessoes) if (s.ini >= desde && (!filtro || filtro(s))) { ac += s.ac || 0; er += s.er || 0; }
  return { ac, er, tot: ac + er, pct: ac + er ? Math.round(ac / (ac + er) * 100) : null };
}

/* ---------- revisões ---------- */
const revisoesPendentes = () => DB.revisoes.filter(r => !r.feita && topico(r.t)).sort((a, b) => a.due < b.due ? -1 : a.due > b.due ? 1 : 0);
const revisoesDeHoje = () => revisoesPendentes().filter(r => r.due <= hojeISO());
function agendarRevisoes(tId, dia) {
  if (DB.revisoes.some(r => r.t === tId && !r.feita)) return 0;
  cfg().revisoes.forEach((n, i) => DB.revisoes.push({ id: novoId(), t: tId, due: maisDias(dia, n), n: i + 1, feita: 0 }));
  return cfg().revisoes.length;
}

/* ---------- sequência: dias seguidos com a meta batida ----------
   Dia de folga da rotina não quebra a sequência. A cada 7 dias seguidos o app guarda uma folga (até 2): se você faltar
   um dia, ela é gasta sozinha e a sequência continua. */
let SEQ = { ver: -1 };
function sequencia() {
  const h = hojeISO();
  if (SEQ.ver === VER && SEQ.h === h) return SEQ.r;
  const feitos = idx().dias, rotina = new Set(cfg().dias), prot = new Set();
  const todos = [...feitos].sort(); let n = 0, folgas = 1, recorde = 0;
  if (todos.length) {
    for (let d = todos[0]; d < h; d = maisDias(d, 1)) {
      if (feitos.has(d)) { n++; if (n % 7 === 0) folgas = Math.min(2, folgas + 1); }
      else if (!rotina.has(deISO(d).getDay())) continue;
      else if (n > 0 && folgas > 0) { folgas--; prot.add(d); }
      else n = 0;
      recorde = Math.max(recorde, n);
    }
  }
  const hojeFeito = feitos.has(h); if (hojeFeito) n++;
  recorde = Math.max(recorde, n);
  const r = { n, hojeFeito, folgas, protegidos: prot, recorde, descanso: !rotina.has(deISO(h).getDay()) };
  SEQ = { ver: VER, h, r };
  return r;
}
// confere se o dia bateu a meta e guarda a marca (uma vez por dia)
function conferirDia(d = hojeISO()) {
  if (idx().dias.has(d) || minutosDoDia(d) < cfg().metaMin - 0.01) return false;
  DB.dias.push({ id: d, min: cfg().metaMin }); VER++;
  return true;
}

/* ---------- plano do dia ----------
   Primeiro as revisões vencidas; depois, blocos das disciplinas mais atrasadas em relação ao peso na prova (conta o
   estudo dos últimos 14 dias, até ontem: o plano não muda no meio do dia). Em cada disciplina, o próximo assunto é o
   primeiro sem teoria concluída; com tudo estudado, o de menor domínio, com questões. */
function proximoAssunto(mId, ids) {
  const T = (ids ? ids.map(topico).filter(Boolean) : topicosDe(mId));
  if (!T.length) return null;
  const novo = T.find(t => !t.teoria);
  if (novo) return { t: novo, tipo: 'teoria' };
  let melhor = T[0], dm = 9; for (const t of T) { const d = dominio(t); if (d < dm) { dm = d; melhor = t; } }
  return { t: melhor, tipo: 'questoes' };
}
function topicosAtivos(mId) {
  const A = concursosAtivos(); if (!A.length) return null;
  const ids = new Set(); for (const c of A) for (const d of c.disc) if (d.m === mId && !d.fora) d.topicos.forEach(i => ids.add(i));
  return [...ids];
}
function ordemDasDisciplinas() {
  const P = pesosAtuais(), h = hojeISO(), ini = deISO(maisDias(h, -14)).getTime(), fim = deISO(h).getTime();
  const min = new Map(); let tot = 0;
  for (const s of DB.sessoes) if (s.ini >= ini && s.ini < fim && P.has(s.m)) { min.set(s.m, (min.get(s.m) || 0) + s.seg / 60); tot += s.seg / 60; }
  return [...P.entries()].map(([m, w]) => ({ m, w, falta: w - (tot ? (min.get(m) || 0) / tot : 0) }))
    .filter(x => materia(x.m) && (topicosAtivos(x.m) || topicosDe(x.m)).length)
    .sort((a, b) => b.falta - a.falta || b.w - a.w);
}
// assunto com questões no banco do app (questoes.js): o estudo dele é pelo treino de questões
const temBanco = tId => typeof questoesDoAssunto === 'function' && questoesDoAssunto(tId).length > 0;
const tipoDoEstudo = (tId, tipo) => tipo === 'teoria' && temBanco(tId) ? 'questoes' : tipo;
function planoDoDia() {
  const h = hojeISO(), c = cfg(), S = sessoesDoDia(h);
  const revs = revisoesDeHoje().map(r => ({ tipo: 'revisao', rev: r.id, t: r.t, m: topico(r.t).m, min: 15, atraso: entreDias(r.due, h), feito: false }));
  // revisões feitas hoje continuam na lista, riscadas
  const feitasHoje = DB.revisoes.filter(r => r.feita && iso(new Date(r.feita)) === h && topico(r.t)).map(r => ({ tipo: 'revisao', rev: r.id, t: r.t, m: topico(r.t).m, min: 15, feito: true }));
  const ordem = ordemDasDisciplinas(), nBlocos = Math.max(ordem.length > 1 ? 2 : 1, Math.round(c.metaMin / c.bloco)), blocos = [], qBloco = Math.ceil(c.metaQ / nBlocos);
  const qNaMateria = m => soma(S.filter(s => s.m === m && s.tipo !== 'revisao'), s => (s.ac || 0) + (s.er || 0));
  for (let i = 0; blocos.length < nBlocos && ordem.length; i++) {
    const d = ordem[i % ordem.length], ja = blocos.filter(b => b.m === d.m).length;
    if (i >= ordem.length * 3) break;
    const T = (topicosAtivos(d.m) || topicosDe(d.m).map(t => t.id)).map(topico).filter(Boolean);
    const pend = T.filter(t => !t.teoria || (iso(new Date(t.teoria)) === h && S.some(s => s.t === t.id && s.tipo !== 'revisao')));
    const alvo = pend[ja] || null, px = alvo ? { t: alvo, tipo: 'teoria' } : (ja === 0 ? proximoAssunto(d.m, T.map(t => t.id)) : null);
    if (!px) continue;
    const minFeito = soma(S.filter(s => s.t === px.t.id && s.tipo !== 'revisao'), s => s.seg / 60);
    const tipo = tipoDoEstudo(px.t.id, px.tipo);
    const nq = tipo === 'questoes' && temBanco(px.t.id) ? qBloco || questoesDoAssunto(px.t.id).length : 0;
    blocos.push({ tipo, t: px.t.id, m: d.m, min: c.bloco, nq, base: minFeito >= c.bloco * 0.8 || (px.tipo === 'teoria' && !!px.t.teoria && minFeito > 0), minFeito });
  }
  // a soma das questões do plano fecha a meta do dia: o que uma disciplina não tem passa para as outras
  const cabe = b => typeof questoesDaDisciplina === 'function' ? questoesDaDisciplina(b.m).length : b.nq;
  blocos.forEach(b => { if (b.nq) b.nq = Math.max(1, Math.min(b.nq, cabe(b))); });
  let falta = c.metaQ - soma(blocos, b => b.nq);
  for (const b of blocos) { if (falta <= 0) break; const d = b.nq ? Math.min(falta, cabe(b) - b.nq) : 0; if (d > 0) { b.nq += d; falta -= d; } }
  blocos.forEach(b => { b.feito = b.base || (b.nq > 0 && qNaMateria(b.m) >= soma(blocos.slice(0, blocos.indexOf(b) + 1).filter(x => x.m === b.m), x => x.nq)); delete b.base; });
  const itens = [...revs.slice(0, 5), ...feitasHoje, ...blocos];
  return { itens, proximo: itens.find(x => !x.feito) || null, minutos: minutosDoDia(h), meta: c.metaMin, revisoesAMais: Math.max(0, revs.length - 5) };
}
// sugestão para quem já cumpriu o plano: a próxima disciplina da fila
function sugestaoExtra() {
  const feitos = new Set(planoDoDia().itens.map(i => i.t));
  for (const d of ordemDasDisciplinas()) { const px = proximoAssunto(d.m, topicosAtivos(d.m) || undefined); if (px && !feitos.has(px.t.id)) { const tipo = tipoDoEstudo(px.t.id, px.tipo); return { tipo, t: px.t.id, m: d.m, min: cfg().bloco, nq: tipo === 'questoes' && temBanco(px.t.id) ? questoesDoAssunto(px.t.id).length : 0 }; } }
  return null;
}

/* ---------- missões do dia ---------- */
function missoes(d = hojeISO()) {
  const c = cfg(), S = sessoesDoDia(d), min = minutosDoDia(d), q = soma(S, s => (s.ac || 0) + (s.er || 0));
  const L = [{ id: 'tempo', nome: `Estudar ${fmtMin(c.metaMin)}`, ic: 'relogio', v: Math.min(min, c.metaMin), de: c.metaMin, un: 'min' }];
  if (c.metaQ > 0) L.push({ id: 'questoes', nome: `Resolver ${plural(c.metaQ, 'questão', 'questões')}`, ic: 'questoes', v: Math.min(q, c.metaQ), de: c.metaQ, un: '' });
  const revHoje = DB.revisoes.filter(r => topico(r.t) && (r.feita ? iso(new Date(r.feita)) === d : r.due <= d));
  if (revHoje.length) L.push({ id: 'revisoes', nome: revHoje.length === 1 ? 'Fazer a revisão do dia' : `Fazer as ${revHoje.length} revisões do dia`, ic: 'revisar', v: revHoje.filter(r => r.feita).length, de: revHoje.length, un: '' });
  else { const n = new Set(S.map(s => s.m)).size; L.push({ id: 'variar', nome: 'Estudar 2 disciplinas', ic: 'disciplinas', v: Math.min(n, 2), de: 2, un: '' }); }
  L.forEach(m => { m.ok = m.v >= m.de - 0.01; });
  return { lista: L, feitas: L.filter(m => m.ok).length, perfeito: L.every(m => m.ok) };
}

/* ---------- pontos ----------
   1 por minuto estudado · 1 por questão e mais 2 por acerto · bônus de combo e do desafio do dia · 2 por flashcard
   revisto · 15 por revisão · 25 por assunto grifado · 30 por dia com a meta batida · 50 por medalha. Tudo sai dos dados,
   então acompanha a sincronização. */
const PONTOS = { minuto: 1, questao: 1, acerto: 2, flashcard: 2, revisao: 15, assunto: 25, dia: 30, medalha: 50 };
function pontosBase() {
  let p = 0;
  for (const s of DB.sessoes) p += Math.round((s.seg || 0) / 60) * PONTOS.minuto + ((s.ac || 0) + (s.er || 0)) * PONTOS.questao + (s.ac || 0) * PONTOS.acerto + (s.bonus || 0);
  p += soma(DB.respostas, r => r.rv || 0) * PONTOS.flashcard;
  p += DB.revisoes.filter(r => r.feita).length * PONTOS.revisao + DB.topicos.filter(t => t.teoria).length * PONTOS.assunto + DB.dias.length * PONTOS.dia;
  return p;
}
const totais = () => ({ min: soma(DB.sessoes, s => s.seg / 60), sessoes: DB.sessoes.length, questoes: soma(DB.sessoes, s => (s.ac || 0) + (s.er || 0)), acertos: soma(DB.sessoes, s => s.ac || 0),
  revisoes: DB.revisoes.filter(r => r.feita).length, assuntos: DB.topicos.filter(t => t.teoria).length, dias: DB.dias.length,
  flash: soma(DB.respostas, r => r.rv || 0), combo: Math.max(0, ...DB.sessoes.map(s => s.combo || 0)), desafios: DB.marcos.filter(m => String(m.id).startsWith('d:')).length,
  blocos: DB.sessoes.filter(s => s.prova).length, redacoes: DB.redacoes.filter(r => r.env).length });

/* ---------- sessão em andamento ---------- */
const ativaSeg = (a = DB.ativa) => a ? (a.acum || 0) + (a.desde ? Math.max(0, (Date.now() - a.desde) / 1000) : 0) : 0;
function iniciarSessao({ t = null, m = null, tipo = 'teoria', alvo = cfg().bloco, rev = null } = {}) {
  const top = t && topico(t);
  DB.ativa = { t: top ? top.id : null, m: top ? top.m : m, tipo, alvo, rev, ini: agora(), acum: 0, desde: Date.now(), ac: 0, er: 0, tocou: false };
  salvar({ quieto: true });
}
function pausarSessao(p) { const a = DB.ativa; if (!a) return; if (p && a.desde) { a.acum = ativaSeg(a); a.desde = 0; } else if (!p && !a.desde) a.desde = Date.now(); salvar({ quieto: true }); }
function descartarSessao() { DB.ativa = null; salvar({ quieto: true }); }
/* guarda uma sessão (do cronômetro ou lançada à mão) e tudo o que decorre dela: teoria concluída, revisões e a marca do dia */
function registrarSessao({ t = null, m = null, tipo = 'teoria', seg = 0, ac = 0, er = 0, conf = 2, teoria = false, rev = null, dia = hojeISO(), ini = agora(), manual = false, extra = null }) {
  const top = t && topico(t), s = { id: novoId(), t: top ? top.id : null, m: top ? top.m : m, tipo, ini, seg: Math.max(0, Math.round(seg)), ac: Math.max(0, ac | 0), er: Math.max(0, er | 0), conf, dia };
  if (manual) s.manual = true;
  if (extra) for (const k in extra) if (extra[k]) s[k] = extra[k];
  DB.sessoes.push(s);
  const fez = { sessao: s, teoria: false, revisoes: 0, revisao: false };
  if (top && teoria && !top.teoria) { top.teoria = ini; fez.teoria = true; fez.revisoes = agendarRevisoes(top.id, dia); }
  if (top && tipo === 'revisao') {
    const r = (rev && DB.revisoes.find(x => x.id === rev && !x.feita)) || DB.revisoes.filter(x => x.t === top.id && !x.feita).sort((a, b) => a.due < b.due ? -1 : 1)[0];
    if (r) { r.feita = ini; fez.revisao = true; if (conf === 1) DB.revisoes.push({ id: novoId(), t: top.id, due: maisDias(dia, 2), n: r.n, feita: 0 }); }
  }
  VER++;
  fez.dia = conferirDia(dia);
  return fez;
}

/* ---------- gravar ---------- */
let pintarPendente = false;
function salvar(opts = {}) {
  VER++;
  if (!semSalvar) {
    const mudou = carimbarTudo();
    if (!LS.set('db', DB)) KitFacil.avisar('O armazenamento do aparelho está cheio. Baixe uma cópia de segurança nos Ajustes.');
    if (mudou && SY && SY.ligada()) SY.agendar(opts.syncMs);
  }
  if (!opts.quieto) agendarPintura();
}
function agendarPintura() { if (pintarPendente) return; pintarPendente = true; requestAnimationFrame(() => { pintarPendente = false; if (typeof render === 'function') render(); }); }
// outra aba (ou o app instalado aberto junto com o navegador) mudou os dados
window.addEventListener('storage', e => { if (e.key === KEY + 'db' && !semSalvar) { const b = arrumarBanco(LS.get('db', null)); if (b) { DB = b; fotografar(); VER++; agendarPintura(); } } });

/* ---------- Kit Fácil: avaliação, sobre, cópia de segurança, tema e sincronização ---------- */
const NOVIDADES = [{ versao: '1.7.3', itens: [
  'O texto de apoio abre inteiro, sem rolagem própria, logo abaixo do enunciado. Os botões de resposta ficam sempre à mão.',
] }, { versao: '1.7.2', itens: [
  'Com o texto de apoio aberto, a tela da questão volta a rolar e o enunciado não fica cortado.',
] }, { versao: '1.7.1', itens: [
  'Plano de hoje: quando uma disciplina tem poucas questões, as outras completam a meta do dia.',
] }, { versao: '1.7.0', itens: [
  'O app ficou integrado: o que você resolve no plano de hoje aparece nos cadernos, e o contrário também.',
  'Cada questão de prova tem o seu assunto, e cada segundo numa questão soma no tempo desse assunto e na meta do dia.',
  'Acabaram as questões do assunto? O treino segue no próximo assunto da disciplina.',
  'Meta de 50 questões por dia, e o plano de hoje já vem do tamanho das missões.',
  'Tempo sempre em hh:mm:ss. O texto de apoio abre sem esconder a questão.',
  'As questões escritas pelo instrutor levam o selo "Feita por IA". A aula do assunto saiu.',
] }, { versao: '1.6.0', itens: [
  'Três provas novas do Cebraspe: ANTT 2024, conhecimentos básicos e específicos dos cargos 1 e 2.',
  'São mais 124 questões oficiais do seu edital, com LGPD, Marco Civil, concorrência, controle da administração e inteligência artificial.',
  'Para resolvê-las aqui, abra o arquivo das provas atualizado, em Cadernos.',
] }, { versao: '1.5.0', itens: [
  'Arquivo das provas: leve as questões oficiais para outro aparelho, sem sincronização.',
  'Em Cadernos, use Baixar arquivo das provas no aparelho que já tem as questões e Abrir arquivo das provas no outro.',
] }, { versao: '1.4.0', itens: [
  'Questões oficiais do Cebraspe dentro do app: o texto da prova chega ao aparelho e vira caderno, com comando e texto de apoio.',
  'Em Cadernos, a seção Provas do Cebraspe traz um caderno por prova, só com os itens do seu edital.',
  'Os cadernos de disciplina ganham as questões de prova daquela disciplina, depois das questões do app.',
  'Questão oficial errada também vira flashcard, e o comentário do instrutor aparece quando existe.',
  'O texto das provas fica só nos seus dados (e na sua sincronização criptografada); não vai para o repositório do app.',
] }, { versao: '1.3.0', itens: [
  'Cadernos de questões: o app agora gira em torno deles. Há um caderno por disciplina, atalhos para as que você errou e para as que nunca viu, e os cadernos que você montar.',
  'Cada caderno guarda o seu andamento: continue de onde parou, refaça só as erradas ou zere as respostas.',
  'Banco de questões: de 63 para 220, agora nas doze disciplinas. Todas escritas no app, com comentário, fundamento e aula curta.',
  'App mais enxuto, só para a ANPD: saíram da tela Concursos, Disciplinas, Simulados, Agenda e o guia. Voltam quando o app for aberto ao público.',
  'Nova barra de baixo: Hoje, Cadernos, Estudar, Medalhas e Mais. O edital foi para Mais.',
] }, { versao: '1.2.0', itens: [
  'Provas do Cebraspe: quatro cadernos oficiais (ANATEL, ANAC, ANM e DATAPREV), com folha de respostas, correção pelo gabarito definitivo e comentário do instrutor. O caderno abre no site da banca.',
  'Só os itens do seu edital: cada prova mostra os blocos que servem para a ANPD e deixa o resto de fora.',
  'Como a banca escreve: as sete armadilhas que mais apareceram nessas provas.',
  'Discursiva: três temas que o Cebraspe cobrou e três temas do instrutor para a ANPD, com o que a banca espera e envio do texto para correção.',
  'Seis itens novos de LGPD, feitos a partir do que a banca cobrou.',
] }, { versao: '1.1.0', itens: [
  'Treino de questões no estilo Cebraspe (certo ou errado), com comentário, fundamento e uma aula curta em cada item. O banco começa com 57 itens inéditos da LGPD.',
  'Flashcards: o item que você erra volta em 1, 3, 7, 15 e 30 dias.',
  'Desafio do dia: dez questões sorteadas, com bônus de pontos. Acertos seguidos viram combo.',
  'Perguntar ao instrutor: o app copia a questão e a sua dúvida para levar ao Claude; a resposta fica guardada junto da questão.',
  'Medalhas redesenhadas, em quatro metais, e muito mais numerosas. Elas ganharam lugar na barra de baixo; a Evolução foi para Mais.',
  'Banca do concurso da ANPD: Cebraspe.',
] }, { versao: '1.0.0', itens: [
  'Estudo Fácil de cara nova, refeito do zero: Hoje, Plano, Estudar, Evolução e Mais.',
  'Plano pronto para a ANPD (Especialista em Regulação), com 12 disciplinas, 119 assuntos e três fases até a prova.',
  'Sequência de dias, missões do dia, pontos, níveis e medalhas em 3D que giram com o dedo.',
  'O edital vira um caderno: cada assunto estudado fica grifado, e a prontidão para a prova sobe.',
  'Modo foco em tela cheia, com cronômetro, acertos e erros; as revisões entram sozinhas em 1, 7 e 30 dias.',
  'Os dados da versão anterior não foram trazidos; uma cópia deles ficou guardada neste aparelho.',
] }];
let SY = null;
const ocupadoApp = () => (typeof aberturaAtiva === 'function' && aberturaAtiva()) || (typeof guiaAtivo === 'function' && guiaAtivo()) || (typeof focoAberto === 'function' && focoAberto()) || (typeof treinoAberto === 'function' && treinoAberto()) || (typeof festaAberta !== 'undefined' && festaAberta);
KitFacil.iniciar({
  app: 'estudo-facil', nome: 'Estudo Fácil', versao: VERSAO, icone: 'icons/icon-192.png',
  resumo: 'Plano de estudos para o concurso da ANPD: provas do Cebraspe, questões comentadas, flashcards, discursiva, revisões e medalhas.',
  tela: () => (typeof tab !== 'undefined' ? tab : 'hoje'), exemploDados: 'os concursos, as disciplinas, as sessões de estudo e as revisões',
  abrirAjustes: secao => { if (secao || tab !== 'ajustes') abrirAjustes(); else fecharAjustes(); },
  emAjustes: () => typeof tab !== 'undefined' && tab === 'ajustes',
  novidades: [...NOVIDADES],
  ocupado: ocupadoApp,
  copia: { descricao: 'Baixe um arquivo com os concursos, as disciplinas, as sessões, as revisões e as medalhas.', baixar: () => KitFacil.copia.baixar({ v: 3, ...dadosSync() }, 3), restaurar: f => restaurarCopia(f) },
  textos: { notificacoes: 'O Estudo Fácil não envia notificações para o aparelho. No fim do tempo de uma sessão, o app toca um som e vibra, se você deixar ligado abaixo.' },
  privacidade: [
    'Os concursos, as disciplinas, as sessões de estudo, as revisões, os simulados e as medalhas ficam guardados neste aparelho.',
    'Nada do que você estuda é enviado para outro lugar, a menos que você ligue a sincronização entre os seus aparelhos.',
  ],
});
KitFacil.tema.iniciar({ chave: KEY + 'pref', cores: { claro: '#F1F3FA', escuro: '#0B0F24' } });

/* Sincronização: cada registro guarda a hora da última mudança; ao juntar, a mudança mais recente vence, registro a
   registro, e as exclusões ficam marcadas (Código, Art. 33). O motor (gist, criptografia, telas) é o do Kit. */
let FOTO = null;
function fotografar() {
  FOTO = { cfg: {}, ativa: JSON.stringify(DB.ativa) };
  for (const k in DB.cfg) FOTO.cfg[k] = JSON.stringify(DB.cfg[k]);
  for (const c of COLLS) { const m = new Map(); for (const r of DB[c]) m.set(r.id, JSON.stringify(r)); FOTO[c] = m; }
}
function carimbarTudo() {
  if (!SY) return false;
  if (!FOTO) { fotografar(); return false; }
  const E = SY.estado, t = Date.now(); let mudou = false;
  for (const k in DB.cfg) { const j = JSON.stringify(DB.cfg[k]); if (FOTO.cfg[k] !== j) { FOTO.cfg[k] = j; E.st['cfg:' + k] = t; mudou = true; } }
  const a = JSON.stringify(DB.ativa); if (FOTO.ativa !== a) { FOTO.ativa = a; E.st.ativa = t; mudou = true; }
  for (const c of COLLS) {
    const m = FOTO[c], vistos = new Set();
    for (const r of DB[c]) { vistos.add(r.id); const j = JSON.stringify(r); if (m.get(r.id) !== j) { m.set(r.id, j); E.st[c + ':' + r.id] = t; delete E.del[c + ':' + r.id]; mudou = true; } }
    for (const id of [...m.keys()]) if (!vistos.has(id)) { m.delete(id); delete E.st[c + ':' + id]; E.del[c + ':' + id] = t; mudou = true; }
  }
  if (mudou) SY.salvar();
  return mudou;
}
const dadosSync = () => { const o = { cfg: DB.cfg, ativa: DB.ativa }; for (const c of COLLS) o[c] = DB[c]; return o; };
function juntarListas(L, R, lt, rt, del, veio) {
  const rm = new Map(R.map(x => [x.id, x])), usados = new Set(), out = [];
  for (const x of L) {
    usados.add(x.id); const r = rm.get(x.id), d = del(x.id) || 0;
    if (r) { if (d && d >= Math.max(lt(x.id), rt(r.id))) continue; if (rt(r.id) > lt(x.id)) { out.push(r); veio(r); } else out.push(x); }
    else if (!(d && d >= lt(x.id))) out.push(x);
  }
  for (const r of R) if (!usados.has(r.id) && !(del(r.id) && del(r.id) >= rt(r.id))) { out.push(r); veio(r); }
  return out;
}
function aplicarNuvem(R) {
  // nuvem gravada pelo formato antigo (0.x): não é trazida; o que está neste aparelho passa a valer
  if (!R || R.v !== 3) R = { v: 3, st: {}, del: {} };
  const E = SY.estado, primeira = !E.lastSync, rs = R.st || {}, st = { ...E.st }, del = { ...E.del };
  for (const k in (R.del || {})) del[k] = Math.max(del[k] || 0, R.del[k]);
  const corte = Date.now() - 400 * DIA; for (const k in del) if (del[k] < corte) delete del[k];
  const antes = KitFacil.canon(dadosSync());
  const C = { ...DB.cfg }, RC = R.cfg || {};
  for (const k of Object.keys(RC)) { const rt = rs['cfg:' + k] || 0, lt = st['cfg:' + k] || 0; if ((primeira && (rt || !lt)) || rt > lt) { C[k] = RC[k]; if (rt) st['cfg:' + k] = rt; } }
  const novo = { v: 3, cfg: C, ativa: DB.ativa };
  for (const c of COLLS) novo[c] = juntarListas(DB[c], Array.isArray(R[c]) ? R[c] : [], id => st[c + ':' + id] || 0, id => rs[c + ':' + id] || 0, id => del[c + ':' + id] || 0, r => { const t = rs[c + ':' + r.id]; if (t) st[c + ':' + r.id] = t; });
  if ((rs.ativa || 0) > (st.ativa || 0)) { novo.ativa = R.ativa || null; st.ativa = rs.ativa; }
  DB = arrumarBanco(novo) || DB;
  for (const c of COLLS) { const vivos = new Set(DB[c].map(r => String(r.id))); for (const k of Object.keys(st)) if (k.startsWith(c + ':') && !vivos.has(k.slice(c.length + 1))) delete st[k]; }
  E.st = st; E.del = del;
  LS.set('db', DB); fotografar(); SY.salvar(); VER++;
  return antes !== KitFacil.canon(dadosSync());
}
SY = KitFacil.sync.criar({
  app: 'estudo-facil', nome: 'Estudo Fácil', chave: KEY + 'sync', dados: 'os concursos, as disciplinas, as sessões, as revisões e as medalhas',
  carimbar: () => carimbarTudo(), aplicar: R => aplicarNuvem(R), pacote: () => ({ v: 3, ...dadosSync(), st: SY.estado.st, del: SY.estado.del }),
  mesmo: (a, r) => KitFacil.canon(a) === KitFacil.canon({ v: r.v, cfg: r.cfg, ativa: r.ativa ?? null, ...Object.fromEntries(COLLS.map(c => [c, r[c]])), st: r.st, del: r.del }),
  redesenhar: () => { if (typeof render === 'function') render(); },
  ocupado: () => KitFacil.dialogo.aberto() || !!(document.activeElement && document.activeElement.matches && document.activeElement.matches('input:not([type=checkbox]),textarea,select')) || ocupadoApp(),
  textoLigada: () => `Sincronização ligada. ${plural(DB.sessoes.length, 'sessão de estudo', 'sessões de estudo')} neste aparelho.`,
});
fotografar();

async function restaurarCopia(arquivo) {
  const r = await KitFacil.copia.ler(arquivo), b = arrumarBanco(r && r.dados);
  if (!b) { avisar('Este arquivo não é uma cópia de segurança do Estudo Fácil 1.0.'); return; }
  confirmar('Restaurar a cópia?', 'Os dados deste aparelho são trocados pelos do arquivo.', 'Restaurar cópia', () => { DB = b; salvar(); avisar('Cópia restaurada.'); });
}
// apaga tudo, inclusive na nuvem: os registros ficam marcados como excluídos e a sincronização leva a exclusão
function apagarTudo() {
  const novo = bancoVazio(); novo.cfg = { ...CFG_PADRAO };
  DB = novo; salvar({ syncMs: 300 });
}

/* ---------- janelas e avisos: os do Kit ---------- */
function abrirJanela({ titulo, sub = '', contexto = '', corpo, pe = '', alto = false, largo = false, aoMontar, aoFechar }) {
  return KitFacil.dialogo.abrir({ titulo, sub, contexto, corpo, pe, classe: [alto && 'kf-alto', largo && 'kf-largo'].filter(Boolean).join(' '), aoFechar, aoMontar });
}
const fecharJanela = quieto => KitFacil.dialogo.fechar(quieto);
const confirmar = (titulo, texto, ok, aoConfirmar, desfaz = 'Não dá para desfazer.') => KitFacil.dialogo.confirmar({ titulo, texto, desfaz, ok, perigo: /^(Excluir|Remover|Apagar)/.test(ok), aoConfirmar });
const avisar = (m, acao) => KitFacil.avisar(m, acao);
const semMovimento = () => KitFacil.movimento.reduzido();
