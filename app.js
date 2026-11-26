/* Estudo Fácil · motor do app: dados, fila de leitura, cartões, sequência, pontos, cobertura do edital e sincronização.
   As telas ficam em telas.js; as apostilas e a leitura, em apostilas.js; os cartões, em cartoes.js; níveis e medalhas,
   em jogo.js; moldura, Ajustes e abertura, em casca.js. Os editais da biblioteca ficam em editais.js. */
"use strict";
const VERSAO = '1.16.0';
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
const LS = {
  get(k, def) { try { const v = localStorage.getItem(KEY + k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set(k, v) { try { localStorage.setItem(KEY + k, JSON.stringify(v)); return true; } catch { return false; } },
  del(k) { try { localStorage.removeItem(KEY + k); } catch {} },
};

/* ---------- modelo ----------
   Tudo num objeto só (estudofacil.db, formato 4). Cada lista tem registros com id; a sincronização junta registro a registro.
   concursos   editais: datas, prova e os vínculos `disc` (disciplina, área, itens e assuntos cobrados)
   materias    disciplinas (globais)
   topicos     assuntos (globais): `teoria` = quando o capítulo foi concluído pela primeira vez; `lido` = última leitura;
               `reler` = pediu para reler depois; `volta` = voltou à fila pelos cartões; `lei` = dose de lei seca lida
   cartoes     um por cartão de conceito já ativado (id = <assunto>#<letra>): caixa (`cx`), quando volta (`due`),
               vezes lembrado (`ok`) e não lembrado (`no`) e a última resposta (`ult`)
   dias        um por dia com estudo: capítulos (`cap`), cartões (`car`), doses de lei (`lei`) e se o dia vale (`vale`)
   marcos      medalhas já ganhas (m:) e marcas do app (f:)          redacoes   textos do treino da discursiva */
const COLLS = ['concursos', 'materias', 'topicos', 'cartoes', 'dias', 'marcos', 'redacoes'];
const CFG_PADRAO = { nome: '', dias: [1, 2, 3, 4, 5], jogo: true, vibra: true };
const CORES = ['#2742D3', '#0E8A7D', '#C2410C', '#7C3AED', '#B4235A', '#0369A1', '#4D7C0F', '#B45309', '#BE185D', '#0F766E', '#6D28D9', '#9A3412'];

function bancoVazio() { const o = { v: 4, cfg: { ...CFG_PADRAO, dias: [...CFG_PADRAO.dias] } }; for (const c of COLLS) o[c] = []; return o; }
function arrumarBanco(o) {
  if (!o || o.v !== 4) return null;
  const b = bancoVazio();
  b.cfg = { ...CFG_PADRAO, ...(o.cfg || {}) };
  if (!Array.isArray(b.cfg.dias) || !b.cfg.dias.length) b.cfg.dias = [...CFG_PADRAO.dias];
  for (const c of COLLS) b[c] = Array.isArray(o[c]) ? o[c].filter(r => r && r.id != null) : [];
  return b;
}
/* instala um edital da biblioteca: cria as disciplinas e os assuntos que ainda não existem e o concurso com os vínculos */
function instalarEdital(db, ed) {
  if (db.concursos.some(c => c.id === ed.id)) return db.concursos.find(c => c.id === ed.id);
  const disc = [];
  for (const m of ed.materias) {
    let mat = db.materias.find(x => x.id === m.id) || db.materias.find(x => norm(x.nome) === norm(m.nome));
    if (!mat) { mat = { id: m.id, nome: m.nome, cor: CORES[(m.cor ?? db.materias.length) % CORES.length], dica: m.dica || '' }; db.materias.push(mat); }
    // o assunto vem só com o nome (o id sai da posição) ou como { id, nome }, quando entra numa disciplina que já existe
    const ids = m.topicos.map((x, i) => {
      const nome = typeof x === 'string' ? x : x.nome, idFixo = typeof x === 'string' ? '' : x.id;
      let t = (idFixo && db.topicos.find(y => y.id === idFixo)) || db.topicos.find(y => y.m === mat.id && norm(y.nome) === norm(nome));
      if (!t) { let id = idFixo || `${m.id}-${String(i + 1).padStart(2, '0')}`; if (db.topicos.some(y => y.id === id)) id = `${m.id}-${novoId()}`;
        t = { id, m: mat.id, nome, ordem: db.topicos.filter(y => y.m === mat.id).length, teoria: 0 }; db.topicos.push(t); }
      return t.id;
    });
    disc.push({ m: mat.id, grupo: m.grupo || '', q: m.q || 0, topicos: ids });
  }
  const c = { id: ed.id, base: ed.base, sigla: ed.sigla, orgao: ed.orgao, cargo: ed.cargo, banca: ed.banca || '',
    previsto: !!ed.previsto, situacao: 'ativo', dataProva: ed.dataProva || '', dataEdital: ed.dataEdital || '',
    prova: JSON.parse(JSON.stringify(ed.prova || { minPct: 50, grupos: [] })), datas: (ed.datas || []).map(d => ({ ...d })), disc, em: agora() };
  db.concursos.push(c);
  return c;
}
const BIB = () => (typeof BIBLIOTECA !== 'undefined' ? BIBLIOTECA : []);
const editalDaBiblioteca = c => BIB().find(e => e.id === c.id) || null;
function bancoDeFabrica() { const b = bancoVazio(); for (const ed of BIB()) instalarEdital(b, ed); return b; }

/* carrega os dados. Quem vem do formato 3 (até a 1.13) começa no desenho novo: vêm o nome, os capítulos já concluídos,
   os dias da sequência e os textos da discursiva; o resto (sessões, tempo, medalhas antigas e respostas de questões) não
   tem lugar no formato 4, e a cópia antiga fica guardada no aparelho (Código, Art. 32-A). */
let DB = (() => {
  const cru = LS.get('db', null), b = arrumarBanco(cru);
  if (b) { let mudou = false; for (const ed of BIB()) if (!b.concursos.some(c => c.id === ed.id)) { instalarEdital(b, ed); mudou = true; } if (mudou) LS.set('db', b); return b; }
  const novo = bancoDeFabrica();
  if (cru && cru.v === 3) {
    if (!LS.get('db_v3', null)) LS.set('db_v3', cru);
    if (cru.cfg && typeof cru.cfg.nome === 'string') novo.cfg.nome = cru.cfg.nome.slice(0, 40);
    if (cru.cfg && cru.cfg.jogo === false) novo.cfg.jogo = false;
    for (const t of Array.isArray(cru.topicos) ? cru.topicos : []) { const n = t && t.teoria && novo.topicos.find(x => x.id === t.id); if (n) { n.teoria = +t.teoria || 0; n.lido = n.teoria; } }
    novo.dias = (Array.isArray(cru.dias) ? cru.dias : []).filter(d => d && /^\d{4}-\d{2}-\d{2}$/.test(d.id)).map(d => ({ id: d.id, cap: 0, car: 0, lei: 0, vale: true }));
    novo.redacoes = (Array.isArray(cru.redacoes) ? cru.redacoes : []).filter(r => r && r.id != null);
  } else if (cru && !LS.get('db_antigo', null)) LS.set('db_antigo', cru);
  LS.set('db', novo);
  return novo;
})();
const cfg = () => DB.cfg;
let VER = 0; // muda a cada alteração: os índices derivados são refeitos

/* ---------- índices derivados ---------- */
let IDX = { ver: -1 };
function idx() {
  if (IDX.ver === VER) return IDX;
  const x = { ver: VER, mat: new Map(DB.materias.map(m => [m.id, m])), top: new Map(DB.topicos.map(t => [t.id, t])), topsDe: new Map(), cart: new Map(DB.cartoes.map(c => [c.id, c])), cartT: new Map(),
    dias: new Set(DB.dias.filter(d => d.vale).map(d => d.id)), diaReg: new Map(DB.dias.map(d => [d.id, d])), marcos: new Map(DB.marcos.map(m => [m.id, m])) };
  for (const t of DB.topicos) { if (!x.topsDe.has(t.m)) x.topsDe.set(t.m, []); x.topsDe.get(t.m).push(t); }
  for (const L of x.topsDe.values()) L.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
  for (const c of DB.cartoes) { if (!x.cartT.has(c.t)) x.cartT.set(c.t, []); x.cartT.get(c.t).push(c); }
  return (IDX = x);
}
const materia = id => idx().mat.get(id) || null;
const topico = id => idx().top.get(id) || null;
const topicosDe = mId => idx().topsDe.get(mId) || [];
const cartoesDe = tId => idx().cartT.get(tId) || [];
const concursosAtivos = () => DB.concursos.filter(c => c.situacao === 'ativo');
const temMarco = id => idx().marcos.has(id);
function marcar(id) { if (temMarco(id)) return false; DB.marcos.push({ id, em: agora() }); VER++; return true; }

/* ---------- edital: cobertura, contagem e datas ----------
   Cobertura é conta simples: assuntos concluídos sobre assuntos do edital. Os números ficam na tela Edital; a tela Hoje
   só mostra a data que está perto e pede uma ação (escopo de 26/11/2026). */
function cobertura(c) {
  let n = 0, feitos = 0;
  for (const d of c.disc) { if (d.fora) continue; for (const id of d.topicos) { const t = topico(id); if (!t) continue; n++; if (t.teoria) feitos++; } }
  return { n, feitos, pct: pct(feitos, n) };
}
function coberturaDisc(d) { const T = d.topicos.map(topico).filter(Boolean), feitos = T.filter(t => t.teoria).length; return { n: T.length, feitos, pct: pct(feitos, T.length) }; }
function contagem(c) {
  if (!c || !c.dataProva) return null;
  const n = entreDias(hojeISO(), c.dataProva);
  return { n, texto: n > 1 ? `Faltam ${n} dias` : n === 1 ? 'Falta 1 dia' : n === 0 ? 'A prova é hoje' : 'Prova feita', estimada: !!c.previsto };
}
// datas que pedem ação e caem nos próximos dias (a data de prova estimada de edital ainda não publicado fica de fora)
// datas que pedem uma ação e que ele já resolveu (ex.: a inscrição): ficam nos ajustes do app, que sincronizam
const dataFeita = (cId, dId) => (cfg().datasFeitas || []).includes(cId + ':' + dId);
function datasPerto(dias = 7) {
  const h = hojeISO(), out = [];
  for (const c of concursosAtivos()) for (const d of c.datas || []) if (d.acao && d.ini >= h && entreDias(h, d.ini) <= dias && !(c.previsto && d.tipo === 'prova') && !dataFeita(c.id, d.id)) out.push({ ...d, c: c.id, em: entreDias(h, d.ini) });
  return out.sort((a, b) => a.ini < b.ini ? -1 : a.ini > b.ini ? 1 : 0);
}

/* ---------- o dia e a sequência ----------
   O dia vale com um capítulo concluído ou com a revisão dos cartões. Dia fora da rotina (sábado e domingo, de fábrica) é
   neutro: se houver estudo, soma; se não houver, não quebra. A cada 7 dias seguidos o app guarda uma folga (até 2): se
   você faltar num dia de rotina, ela é gasta sozinha e a sequência continua. */
function diaReg(d = hojeISO()) { let r = idx().diaReg.get(d); if (!r) { r = { id: d, cap: 0, car: 0, lei: 0, vale: false }; DB.dias.push(r); VER++; } return r; }
// faz o dia valer; devolve true quando ele passou a valer agora
function diaValer(d = hojeISO()) { const r = diaReg(d); if (r.vale) return false; r.vale = true; VER++; return true; }
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
  const r = { n, hojeFeito, folgas, protegidos: prot, recorde, livre: !rotina.has(deISO(h).getDay()) };
  SEQ = { ver: VER, h, r };
  return r;
}
// resumo de uma semana (de segunda a domingo): registro do que foi feito, sem meta
const segundaDe = d => maisDias(d, -((deISO(d).getDay() + 6) % 7));
function resumoSemana(seg = segundaDe(hojeISO())) {
  const r = { seg, cap: 0, car: 0, lei: 0, dias: 0 };
  for (let i = 0; i < 7; i++) { const d = idx().diaReg.get(maisDias(seg, i)); if (!d) continue; r.cap += d.cap || 0; r.car += d.car || 0; r.lei += d.lei || 0; if (d.vale) r.dias++; }
  r.vazio = !r.cap && !r.car && !r.lei && !r.dias;
  return r;
}
const fraseSemana = r => [r.cap ? plural(r.cap, 'capítulo', 'capítulos') : '', r.car ? plural(r.car, 'cartão', 'cartões') : '', r.lei ? plural(r.lei, 'dose de lei seca', 'doses de lei seca') : ''].filter(Boolean).join(', ').replace(/, ([^,]*)$/, ' e $1');

/* ---------- capítulos ----------
   A unidade de estudo é o capítulo concluído: "Entendi" ou "Quero reler depois". Concluir ativa os cartões do capítulo
   (voltam a partir do dia seguinte), faz o dia valer e tira o capítulo da fila. */
const fotoAssunto = tId => JSON.stringify({ t: topico(tId), c: cartoesDe(tId), d: idx().diaReg.get(hojeISO()) || null });
function voltarAssunto(tId, foto) {
  const o = JSON.parse(foto), t = topico(tId), h = hojeISO();
  if (t && o.t) { for (const k of ['teoria', 'lido', 'reler', 'volta', 'lei']) t[k] = o.t[k] || 0; }
  DB.cartoes = DB.cartoes.filter(c => c.t !== tId).concat(o.c || []);
  DB.dias = DB.dias.filter(d => d.id !== h); if (o.d) DB.dias.push(o.d);
  salvar();
}
function concluirCapitulo(tId, { reler = false } = {}) {
  const t = topico(tId); if (!t) return null;
  const d = diaReg(), ag = agora();
  /* "Quero reler depois" não conclui: o capítulo foi lido (o dia vale), mas continua na fila, não conta na cobertura
     e os cartões dele só nascem no "Entendi". Num capítulo que já estava concluído, só marca a releitura. */
  const primeira = !t.teoria && !reler;
  if (primeira) t.teoria = ag;
  t.lido = ag; t.reler = reler ? ag : 0; t.volta = 0;
  if (!reler) d.cap = (d.cap || 0) + 1;
  for (const c of cartoesDe(tId)) c.ult = ''; // a conta de "mais da metade" recomeça depois da releitura
  const novos = !reler && typeof cartoesAtivar === 'function' ? cartoesAtivar(tId) : 0;
  const valeu = diaValer();
  if (typeof posLimpar === 'function') posLimpar(tId);
  salvar();
  return { primeira, novos, valeu };
}
function lerDose(tId) {
  const t = topico(tId); if (!t || t.lei) return false;
  t.lei = agora(); const d = diaReg(); d.lei = (d.lei || 0) + 1;
  salvar(); return true;
}

/* ---------- cartões de conceito ----------
   Frente pergunta, verso responde: "Lembrei" ou "Não lembrei". Lembrou, o cartão sobe de caixa e volta mais tarde
   (3, 7, 15, 30 e 60 dias); não lembrou, o app mostra só o trecho do capítulo que responde e o cartão volta no dia
   seguinte. O capítulo inteiro só volta para a fila quando mais da metade dos cartões dele está como "não lembrei". */
const CX_DIAS = [1, 3, 7, 15, 30, 60], RODADA = 15, CARTOES_DO_DIA = 5; // com 5 cartões respondidos, o dia já vale
const cartoesDeHoje = () => { const h = hojeISO(); return DB.cartoes.filter(c => c.due && c.due <= h && topico(c.t) && topico(c.t).teoria).sort((a, b) => a.due < b.due ? -1 : a.due > b.due ? 1 : a.id < b.id ? -1 : 1); };
const proximoCartao = () => { const L = DB.cartoes.filter(c => c.due && topico(c.t) && topico(c.t).teoria).map(c => c.due).sort(); return L[0] || ''; };
function responderCartao(id, lembrou) {
  const c = idx().cart.get(id); if (!c) return null;
  const h = hojeISO(), d = diaReg(), t = topico(c.t);
  if (lembrou) { c.cx = Math.min((c.cx || 0) + 1, CX_DIAS.length - 1); c.ok = (c.ok || 0) + 1; c.ult = 'ok'; c.due = maisDias(h, CX_DIAS[c.cx]); }
  else { c.cx = 0; c.no = (c.no || 0) + 1; c.ult = 'no'; c.due = maisDias(h, 1); }
  c.em = agora(); d.car = (d.car || 0) + 1;
  let voltou = false;
  if (!lembrou && t && !t.volta) { const S = cartoesDe(c.t); if (S.filter(x => x.ult === 'no').length > S.length / 2) { t.volta = agora(); voltou = true; } }
  VER++;
  return { voltou };
}

/* ---------- a fila de leitura ----------
   Até a prova do Cofen (28/02/2027): primeiro o que serve aos dois concursos (Português, Direito Administrativo,
   Constitucional e LGPD); depois contratos e o resto do Cofen; o que é só da ANPD fica para depois dessa prova.
   Só entra na fila o assunto que já tem apostila. Depois de cada capítulo vem a dose de lei seca dele. */
const ORDEM_DISC = ['anpd-lp', 'anpd-da', 'anpd-dc', 'anpd-lgpd', 'cofen-ct'];
function ordemDoAssunto(t) {
  const h = hojeISO(), cobra = c => c.disc.some(d => !d.fora && d.topicos.includes(t.id));
  // concurso com a prova já feita não puxa mais a fila: o que só ele cobra vai para o fim
  const A = concursosAtivos().filter(c => !c.dataProva || c.dataProva >= h), cofen = A.find(c => c.base === 'cofen');
  const grupo = !A.some(cobra) ? 3 : !cofen ? 0 : cobra(cofen) ? (A.some(c => c !== cofen && cobra(c)) ? 0 : 1) : 2;
  const i = ORDEM_DISC.indexOf(t.m), disc = i >= 0 ? i : 50 + DB.materias.findIndex(m => m.id === t.m);
  return grupo * 1e6 + disc * 1e3 + (t.ordem || 0);
}
const emOrdem = L => L.map(t => [ordemDoAssunto(t), t]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
const capitulosEmOrdem = () => emOrdem(DB.topicos.filter(t => typeof apostilaDoAssunto === 'function' && apostilaDoAssunto(t.id)));
function fila() {
  const caps = capitulosEmOrdem(), out = [];
  for (const t of caps) if (t.volta) out.push({ tipo: 'volta', t: t.id });
  // primeiro os capítulos novos; o que ficou "para reler depois" vem em seguida; a lei seca não trava a fila:
  // fica como segunda opção (leiPendente) e só vira a leitura principal quando não há capítulo a ler
  for (const t of caps) if (!t.volta && !t.teoria && !t.reler) out.push({ tipo: 'cap', t: t.id });
  for (const t of caps) if (t.reler && !t.volta) out.push({ tipo: 'reler', t: t.id });
  for (const t of caps) if (t.teoria && !t.lei && typeof doseDe === 'function' && doseDe(t.id)) out.push({ tipo: 'lei', t: t.id });
  // tudo lido e nada pendente: a leitura mais antiga volta como sugestão, para o dia nunca ficar sem leitura
  if (!out.length) { const L = caps.filter(t => t.teoria).sort((a, b) => (a.lido || a.teoria) - (b.lido || b.teoria)); if (L[0]) out.push({ tipo: 'reler', t: L[0].id, antigo: true }); }
  return out;
}
// a dose de lei seca mais antiga à espera (de um capítulo já concluído)
const leiPendente = () => fila().find(x => x.tipo === 'lei') || null;
// a leitura sugerida: o capítulo em que você parou no meio, ou o primeiro da fila
function sugestao() {
  const L = typeof lendo === 'function' ? lendo() : { t: '', pos: {} }, t = L.t && topico(L.t);
  if (t && L.pos[t.id] > 0 && apostilaDoAssunto(t.id) && (!t.teoria || t.volta || t.reler)) return { tipo: 'continuar', t: t.id };
  return fila()[0] || null;
}

/* ---------- pontos ----------
   30 por capítulo concluído · 3 por conceito lembrado · 10 por dose de lei seca · 20 por dia que valeu · 50 por medalha.
   Tudo sai dos dados, então acompanha a sincronização. */
const PONTOS = { capitulo: 30, lembrado: 3, lei: 10, dia: 20, medalha: 50 };
const totais = () => ({ caps: DB.topicos.filter(t => t.teoria).length, lembrados: soma(DB.cartoes, c => c.ok || 0), respondidos: soma(DB.cartoes, c => (c.ok || 0) + (c.no || 0)),
  leis: DB.topicos.filter(t => t.lei).length, dias: idx().dias.size });
const pontosBase = () => { const T = totais(); return T.caps * PONTOS.capitulo + T.lembrados * PONTOS.lembrado + T.leis * PONTOS.lei + T.dias * PONTOS.dia; };

/* ---------- gravar ---------- */
let pintarPendente = false;
function salvar(opts = {}) {
  VER++;
  const mudou = carimbarTudo();
  if (!LS.set('db', DB)) KitFacil.avisar('O armazenamento do aparelho está cheio. Baixe uma cópia de segurança nos Ajustes.');
  if (mudou && SY && SY.ligada()) SY.agendar(opts.syncMs);
  if (!opts.quieto) agendarPintura();
}
function agendarPintura() { if (pintarPendente) return; pintarPendente = true; requestAnimationFrame(() => { pintarPendente = false; if (typeof render === 'function') render(); }); }
// outra aba (ou o app instalado aberto junto com o navegador) mudou os dados
window.addEventListener('storage', e => { if (e.key === KEY + 'db') { const b = arrumarBanco(LS.get('db', null)); if (b) { DB = b; fotografar(); VER++; agendarPintura(); } } });

/* ---------- Kit Fácil: avaliação, sobre, cópia de segurança, tema e sincronização ---------- */
const NOVIDADES = [{ versao: '1.16.0', itens: [
  'Apostila nova: Língua Portuguesa, com 15 capítulos e 84 cartões. Serve à ANPD e ao Cofen.',
  'A fila de leitura agora começa por Português, que é a primeira disciplina na ordem combinada.',
] }, { versao: '1.15.1', itens: [
  'A apostila de Direito Administrativo agora abre também sem internet.',
] }, { versao: '1.15.0', itens: [
  'Apostila nova: Direito Administrativo, com 16 capítulos e 83 cartões. Serve à ANPD e ao Cofen.',
  'A lei seca não trava mais a fila: o próximo capítulo é a leitura principal, e a lei fica como segunda opção em Hoje.',
  'Quero reler depois não conclui mais o capítulo: ele continua na fila, e o dia vale.',
  'Relembrar: com 5 cartões respondidos, o dia já vale. Hoje sugere começar por eles.',
  'Leitura: listas com marcador, barrinha de progresso e escolha do tamanho da letra.',
  'Edital: marque como resolvida a data que pedia uma ação, e o aviso some de Hoje.',
] }, { versao: '1.14.0', itens: [
  'O app foi refeito para estudar no caminho: a tela Hoje mostra a sequência, a semana, uma leitura sugerida e um botão.',
  'A unidade de estudo é o capítulo concluído. No fim de cada um: Entendi ou Quero reler depois.',
  'Relembrar: cartões de conceito de cada capítulo voltam dias depois. Não lembrou? O app abre só o trecho que responde.',
  'Depois do capítulo vem a lei seca dele: só os artigos daquele assunto.',
  'O dia vale com um capítulo concluído ou com a revisão. Sábado e domingo são livres.',
  'Edital virou painel: cobertura, contagem para cada prova e as datas importantes.',
  'Medalhas e níveis refeitos: dias seguidos, capítulos, conceitos lembrados e disciplina fechada.',
  'Saíram o cronômetro, as metas de tempo e de questões, as missões, o plano por blocos e as revisões de 1, 7 e 30 dias.',
] }, { versao: '1.13.0', itens: [
  'As questões saíram do app: elas ficam no Tec Concursos.',
  'Apostilas: teoria escrita para quem nunca viu o assunto, voltada ao jeito de o Cebraspe cobrar. A primeira é a da LGPD, com 19 capítulos.',
  'Edital do Cofen (Analista Técnico) no app, ao lado do da ANPD. O que os dois cobram conta para os dois.',
] }];
let SY = null;
const ocupadoApp = () => (typeof aberturaAtiva === 'function' && aberturaAtiva()) || (typeof festaAberta !== 'undefined' && festaAberta);
KitFacil.iniciar({
  app: 'estudo-facil', nome: 'Estudo Fácil', versao: VERSAO, icone: 'icons/icon-192.png',
  resumo: 'Estudo para os concursos da ANPD e do Cofen: apostilas em capítulos, cartões para relembrar, leis na íntegra, edital com cobertura e datas, discursiva e medalhas.',
  tela: () => (typeof tab !== 'undefined' ? tab : 'hoje'), exemploDados: 'os capítulos concluídos, os cartões e as medalhas',
  abrirAjustes: secao => { if (secao || tab !== 'ajustes') abrirAjustes(); else fecharAjustes(); },
  emAjustes: () => typeof tab !== 'undefined' && tab === 'ajustes',
  novidades: [...NOVIDADES],
  ocupado: ocupadoApp,
  copia: { descricao: 'Baixe um arquivo com os capítulos concluídos, os cartões, os dias de estudo, as medalhas e os textos da discursiva.', baixar: () => KitFacil.copia.baixar({ v: 4, ...dadosSync() }, 4), restaurar: f => restaurarCopia(f) },
  textos: { notificacoes: 'O Estudo Fácil não envia notificações para o aparelho.' },
  privacidade: [
    'Os capítulos concluídos, os cartões, os dias de estudo, as medalhas e os textos da discursiva ficam guardados neste aparelho.',
    'Nada do que você estuda é enviado para outro lugar, a menos que você ligue a sincronização entre os seus aparelhos.',
  ],
});
KitFacil.tema.iniciar({ chave: KEY + 'pref', cores: { claro: '#F1F3FA', escuro: '#0B0F24' } });

/* Sincronização: cada registro guarda a hora da última mudança; ao juntar, a mudança mais recente vence, registro a
   registro, e as exclusões ficam marcadas (Código, Art. 33). O motor (gist, criptografia, telas) é o do Kit. */
let FOTO = null;
function fotografar() {
  FOTO = { cfg: {} };
  for (const k in DB.cfg) FOTO.cfg[k] = JSON.stringify(DB.cfg[k]);
  for (const c of COLLS) { const m = new Map(); for (const r of DB[c]) m.set(r.id, JSON.stringify(r)); FOTO[c] = m; }
}
function carimbarTudo() {
  if (!SY) return false;
  if (!FOTO) { fotografar(); return false; }
  const E = SY.estado, t = Date.now(); let mudou = false;
  for (const k in DB.cfg) { const j = JSON.stringify(DB.cfg[k]); if (FOTO.cfg[k] !== j) { FOTO.cfg[k] = j; E.st['cfg:' + k] = t; mudou = true; } }
  for (const c of COLLS) {
    const m = FOTO[c], vistos = new Set();
    for (const r of DB[c]) { vistos.add(r.id); const j = JSON.stringify(r); if (m.get(r.id) !== j) { m.set(r.id, j); E.st[c + ':' + r.id] = t; delete E.del[c + ':' + r.id]; mudou = true; } }
    for (const id of [...m.keys()]) if (!vistos.has(id)) { m.delete(id); delete E.st[c + ':' + id]; E.del[c + ':' + id] = t; mudou = true; }
  }
  if (mudou) SY.salvar();
  return mudou;
}
const dadosSync = () => { const o = { cfg: DB.cfg }; for (const c of COLLS) o[c] = DB[c]; return o; };
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
// carimbos de listas que não existem mais (sessões, respostas e outras do formato 3) saem do estado da sincronização
function limparCarimbos(o) { for (const k of Object.keys(o)) { const c = k.split(':')[0]; if (c !== 'cfg' && !COLLS.includes(c)) delete o[k]; } }
function aplicarNuvem(R) {
  // nuvem gravada por um formato antigo (até a 1.13): não é trazida; o que está neste aparelho passa a valer
  if (!R || R.v !== 4) R = { v: 4, st: {}, del: {} };
  const E = SY.estado, primeira = !E.lastSync, rs = R.st || {}, st = { ...E.st }, del = { ...E.del };
  for (const k in (R.del || {})) del[k] = Math.max(del[k] || 0, R.del[k]);
  const corte = Date.now() - 400 * DIA; for (const k in del) if (del[k] < corte) delete del[k];
  limparCarimbos(st); limparCarimbos(del);
  const antes = KitFacil.canon(dadosSync());
  const C = { ...DB.cfg }, RC = R.cfg || {};
  for (const k of Object.keys(RC)) { const rt = rs['cfg:' + k] || 0, lt = st['cfg:' + k] || 0; if ((primeira && (rt || !lt)) || rt > lt) { C[k] = RC[k]; if (rt) st['cfg:' + k] = rt; } }
  const novo = { v: 4, cfg: C };
  for (const c of COLLS) novo[c] = juntarListas(DB[c], Array.isArray(R[c]) ? R[c] : [], id => st[c + ':' + id] || 0, id => rs[c + ':' + id] || 0, id => del[c + ':' + id] || 0, r => { const t = rs[c + ':' + r.id]; if (t) st[c + ':' + r.id] = t; });
  DB = arrumarBanco(novo) || DB;
  for (const c of COLLS) { const vivos = new Set(DB[c].map(r => String(r.id))); for (const k of Object.keys(st)) if (k.startsWith(c + ':') && !vivos.has(k.slice(c.length + 1))) delete st[k]; }
  E.st = st; E.del = del;
  LS.set('db', DB); fotografar(); SY.salvar(); VER++;
  return antes !== KitFacil.canon(dadosSync());
}
SY = KitFacil.sync.criar({
  app: 'estudo-facil', nome: 'Estudo Fácil', chave: KEY + 'sync', dados: 'os capítulos concluídos, os cartões, os dias de estudo e as medalhas',
  carimbar: () => carimbarTudo(), aplicar: R => aplicarNuvem(R), pacote: () => ({ v: 4, ...dadosSync(), st: SY.estado.st, del: SY.estado.del }),
  mesmo: (a, r) => KitFacil.canon(a) === KitFacil.canon({ v: r.v, cfg: r.cfg, ...Object.fromEntries(COLLS.map(c => [c, r[c]])), st: r.st, del: r.del }),
  redesenhar: () => { if (typeof render === 'function') render(); },
  ocupado: () => KitFacil.dialogo.aberto() || !!(document.activeElement && document.activeElement.matches && document.activeElement.matches('input:not([type=checkbox]),textarea,select')) || ocupadoApp(),
  textoLigada: () => `Sincronização ligada. ${plural(DB.topicos.filter(t => t.teoria).length, 'capítulo concluído', 'capítulos concluídos')} neste aparelho.`,
});
fotografar();

async function restaurarCopia(arquivo) {
  const r = await KitFacil.copia.ler(arquivo), b = arrumarBanco(r && r.dados);
  if (!b) { avisar('Este arquivo não é uma cópia de segurança do Estudo Fácil 1.14 ou mais novo.'); return; }
  confirmar('Restaurar a cópia?', 'Os dados deste aparelho são trocados pelos do arquivo.', 'Restaurar cópia', () => { DB = b; for (const ed of BIB()) instalarEdital(DB, ed); salvar(); avisar('Cópia restaurada.'); });
}
// apaga tudo, inclusive na nuvem: o app volta ao começo, com os editais de fábrica, e a sincronização leva a exclusão
function apagarTudo() {
  DB = bancoDeFabrica(); LS.del('lendo');
  salvar({ syncMs: 300 });
}

/* ---------- janelas e avisos: os do Kit ---------- */
function abrirJanela({ titulo, sub = '', contexto = '', corpo, pe = '', alto = false, largo = false, aoMontar, aoFechar }) {
  return KitFacil.dialogo.abrir({ titulo, sub, contexto, corpo, pe, classe: [alto && 'kf-alto', largo && 'kf-largo'].filter(Boolean).join(' '), aoFechar, aoMontar });
}
const fecharJanela = quieto => KitFacil.dialogo.fechar(quieto);
const confirmar = (titulo, texto, ok, aoConfirmar, desfaz = 'Não dá para desfazer.') => KitFacil.dialogo.confirmar({ titulo, texto, desfaz, ok, perigo: /^(Excluir|Remover|Apagar)/.test(ok), aoConfirmar });
const avisar = (m, acao) => KitFacil.avisar(m, acao);
const semMovimento = () => KitFacil.movimento.reduzido();
