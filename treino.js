/* Estudo Fácil · treino de questões (certo ou errado, estilo Cebraspe), flashcards dos erros, desafio do dia e a ponte
   com o instrutor. As questões ficam em questoes.js; as respostas do instrutor, em instrutor/respostas.json. */
"use strict";

const QDE = new Map(), QID = new Map(QUESTOES.map(q => [q.id, q]));
QUESTOES.forEach(q => { if (!QDE.has(q.t)) QDE.set(q.t, []); QDE.get(q.t).push(q); });
const questoesDe = tId => QDE.get(tId) || [];
const questoesDaMateria = mId => topicosDe(mId).flatMap(t => questoesDe(t.id));
const respostaDe = id => idx().resp.get(id) || null;
const GAB = { C: 'Certo', E: 'Errado' };
const FC_DIAS = [1, 3, 7, 15, 30]; // caixas do flashcard: lembrou, sobe de caixa e volta mais tarde

/* ordem do treino: primeiro o que você errou por último, depois o que nunca respondeu, depois o mais antigo */
function escolherQuestoes({ t = null, m = null, n = 10 } = {}) {
  const pool = (t ? questoesDe(t) : m ? questoesDaMateria(m) : QUESTOES).filter(q => topico(q.t));
  const nota = q => { const r = respostaDe(q.id); return !r ? 0 : r.ok ? r.em : r.em - 1e14; };
  return pool.map((q, i) => [nota(q), i, q]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).slice(0, n).map(x => x[2]);
}
// dez questões sorteadas pelo dia: as mesmas em todos os aparelhos
function desafioDoDia(d = hojeISO()) {
  let s = [...d].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const L = QUESTOES.filter(q => topico(q.t)).map(q => [rnd(), q]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  return { lista: L.slice(0, 10), feito: temMarco('d:' + d) };
}
const flashcardsDeHoje = () => DB.respostas.filter(r => r.cx != null && r.cx < FC_DIAS.length && r.due && r.due <= hojeISO() && QID.has(r.id));

/* ---------- treino em tela cheia ---------- */
let TR = null, treinoEl = null;
const treinoAberto = () => !!treinoEl;
function treinoAbrir({ t = null, m = null, n = 10, tipo = 'questoes', rev = null, desafio = false, lista = null } = {}) {
  if (treinoEl) return;
  const L = lista || (desafio ? desafioDoDia().lista : escolherQuestoes({ t, m, n }));
  if (!L.length) { avisar('Ainda não há questões do app para este assunto. Use o cronômetro.'); return; }
  TR = { lista: L, i: 0, ac: 0, er: 0, combo: 0, maxCombo: 0, bonus: 0, ini: Date.now(), porT: new Map(), tipo, rev, desafio, marcou: null };
  treinoEl = document.createElement('div'); treinoEl.className = 'treino'; treinoEl.id = 'treino';
  treinoEl.setAttribute('data-kf-tela-cheia', ''); treinoEl.setAttribute('role', 'dialog'); treinoEl.setAttribute('aria-modal', 'true'); treinoEl.setAttribute('aria-labelledby', 'tr-t');
  document.body.appendChild(treinoEl); document.body.classList.add('com-foco');
  treinoEl.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.resp) treinoResponder(b.dataset.resp);
    else if (b.id === 'tr-prox') treinoSeguir();
    else if (b.id === 'tr-sair') treinoEncerrar();
    else if (b.id === 'tr-perguntar') perguntarInstrutor(TR.lista[TR.i], TR.marcou);
  });
  document.addEventListener('keydown', treinoTecla, true);
  treinoEl.addEventListener('keydown', e => {
    if (KitFacil.dialogo.aberto()) return;
    if (e.key === 'Tab') { const f = $$('button, summary', treinoEl).filter(x => x.getClientRects().length); const i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? f.length - 1 : 1) + f.length) % f.length].focus(); }
  });
  treinoPintar();
  requestAnimationFrame(() => treinoEl && treinoEl.classList.add('dentro'));
}
// teclado: C e E respondem, Esc encerra; valem com o foco em qualquer ponto do treino
function treinoTecla(e) {
  if (!treinoEl || !TR || KitFacil.dialogo.aberto() || festaAberta || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); treinoEncerrar(); }
  else if (!TR.marcou && (k === 'c' || k === 'e')) { e.preventDefault(); treinoResponder(k.toUpperCase()); }
}
function treinoPintar() {
  const q = TR.lista[TR.i], t = topico(q.t), n = TR.lista.length, fez = TR.marcou, ok = fez && fez === q.g, ult = TR.i === n - 1;
  const inst = (INSTRUTOR[q.id] || []).slice(-2);
  treinoEl.innerHTML = `<div class="treino-in">
      <div class="tr-topo"><button type="button" class="btn-ic" id="tr-sair" aria-label="Encerrar o treino">${I.x}</button>${barraHTML((TR.i + (fez ? 1 : 0)) / n * 100, `Questão ${TR.i + 1} de ${n}`)}<span class="tr-cont" aria-hidden="true">${TR.i + 1}/${n}</span></div>
      <div class="tr-meta"><span class="etiqueta">${esc(t ? t.nome : '')}</span>${TR.combo >= 2 ? `<span class="tr-combo">${I.raio}Combo ${TR.combo}</span>` : ''}</div>
      <h2 class="kf-so-leitor" id="tr-t" tabindex="-1">${TR.desafio ? 'Desafio do dia. ' : ''}Questão ${TR.i + 1} de ${n}</h2>
      <div class="folha tr-folha"><p class="rotulo-mini">Julgue o item</p><p class="tr-enun">${esc(q.e)}</p></div>
      ${!fez ? `<div class="tr-botoes" role="group" aria-label="Sua resposta"><button type="button" class="kf-btn kf-sec tr-b" data-resp="C">${I.check}Certo</button><button type="button" class="kf-btn kf-sec tr-b" data-resp="E">${I.x}Errado</button></div>
        <p class="tr-dica" aria-hidden="true">No teclado: C para certo, E para errado</p>`
      : `<div class="tr-fb ${ok ? 'ok' : 'no'}" role="status"><span class="tr-fb-ic" aria-hidden="true">${ok ? I.check : I.x}</span><span><b>${ok ? 'Você acertou' : 'Você errou'}</b><small>Gabarito: ${GAB[q.g]} · você marcou ${GAB[fez]}</small></span></div>
        <div class="tr-exp"><p>${esc(q.c)}</p><p class="tr-fund">${I.lei}<span>${esc(q.f)}</span></p></div>
        ${AULAS[q.t] ? `<details class="tr-aula" data-kf-secao><summary><b>Aula do assunto</b></summary><p>${esc(AULAS[q.t])}</p></details>` : ''}
        ${inst.map(x => `<div class="tr-inst"><span class="rotulo-mini">Instrutor · ${esc(x.em || '')}</span><p>${esc(x.r || '')}</p></div>`).join('')}
        ${ok ? '' : '<p class="tr-fc">Este item virou flashcard e volta amanhã.</p>'}
        <div class="tr-acoes"><button type="button" class="kf-btn kf-sec" id="tr-perguntar">Perguntar ao instrutor</button><button type="button" class="kf-btn kf-comecar" id="tr-prox">${ult ? 'Concluir treino' : 'Próxima questão'}</button></div>`}
    </div>`;
  requestAnimationFrame(() => { if (!treinoEl) return; const alvo = fez ? $('#tr-prox', treinoEl) : $('#tr-t', treinoEl); alvo && alvo.focus({ preventScroll: true }); if (!fez && treinoEl) treinoEl.scrollTop = 0; });
}
function treinoResponder(v) {
  const q = TR.lista[TR.i]; if (TR.marcou) return;
  const ok = v === q.g, h = hojeISO(); TR.marcou = v;
  if (ok) { TR.ac++; TR.combo++; TR.maxCombo = Math.max(TR.maxCombo, TR.combo); if (TR.combo >= 3) TR.bonus++; } else { TR.er++; TR.combo = 0; }
  const p = TR.porT.get(q.t) || { ac: 0, er: 0 }; ok ? p.ac++ : p.er++; TR.porT.set(q.t, p);
  // a resposta fica guardada por questão; item errado vira flashcard e volta amanhã
  let r = DB.respostas.find(x => x.id === q.id); if (!r) { r = { id: q.id, n: 0, ac: 0, rv: 0 }; DB.respostas.push(r); }
  r.n++; if (ok) r.ac++; r.ok = ok; r.em = agora();
  if (!ok) { r.cx = 0; r.due = maisDias(h, 1); }
  salvar({ quieto: true }); vibrar(ok ? 10 : [30, 40, 30]);
  treinoPintar();
}
function treinoSeguir() { if (TR.i >= TR.lista.length - 1) return treinoEncerrar(); TR.i++; TR.marcou = null; treinoPintar(); }
function treinoFechar() {
  if (!treinoEl) return; const el = treinoEl; treinoEl = null; TR = null; document.body.classList.remove('com-foco'); document.removeEventListener('keydown', treinoTecla, true);
  el.removeAttribute('id'); $$('[id]', el).forEach(x => x.removeAttribute('id')); el.classList.remove('dentro'); el.style.pointerEvents = 'none';
  setTimeout(() => el.remove(), semMovimento() ? 0 : KitFacil.movimento.ms);
}
// fecha o treino: guarda uma sessão por assunto, grifa o assunto que teve todas as questões respondidas e abre a festa
function treinoEncerrar() {
  const T = TR; if (!T) return; const feitas = T.ac + T.er;
  if (!feitas) { treinoFechar(); render(); return; }
  const antes = { s: jogoEstado(), perfeito: missoes().perfeito }, seg = Math.min((Date.now() - T.ini) / 1000, feitas * 180), completo = feitas === T.lista.length;
  let bonus = T.bonus; if (T.desafio && completo && !temMarco('d:' + hojeISO())) { marcar('d:' + hojeISO()); bonus += 20 + (T.ac / feitas >= .8 ? 30 : 0); }
  const fez = { teoria: false, revisoes: 0, revisao: false, dia: false }; let k = 0, unico = T.porT.size === 1 ? [...T.porT.keys()][0] : null;
  for (const [tId, p] of T.porT) {
    const toda = questoesDe(tId).every(q => respostaDe(q.id) || DB.respostas.some(r => r.id === q.id));
    const r = registrarSessao({ t: tId, tipo: T.tipo === 'revisao' && k === 0 ? 'revisao' : 'questoes', seg: seg * (p.ac + p.er) / feitas, ac: p.ac, er: p.er, teoria: toda, rev: k === 0 ? T.rev : null, ini: T.ini + k,
      extra: k === 0 ? { bonus, combo: T.maxCombo, gab: completo && feitas >= 10 && !T.er ? 1 : 0, ...(T.desafio ? { desafio: 1 } : {}) } : null });
    fez.teoria = fez.teoria || r.teoria; fez.revisoes += r.revisoes; fez.revisao = fez.revisao || r.revisao; fez.dia = fez.dia || r.dia; k++;
  }
  const m = unico ? null : materia(topico([...T.porT.keys()][0]).m);
  fez.sessao = { t: unico, m: unico ? topico(unico).m : null, seg, ac: T.ac, er: T.er };
  fez.rotulo = T.desafio ? 'Desafio do dia' : unico ? null : `Treino de questões${m ? ' · ' + m.nome : ''}`;
  fez.extra = [T.maxCombo >= 3 ? ['Maior combo', `${T.maxCombo} acertos seguidos`] : null, bonus ? ['Bônus', `+${bonus} pontos`] : null].filter(Boolean);
  salvar({ quieto: true }); treinoFechar();
  if (!festa(fez, antes, { aoFechar: () => { render(); setTimeout(medalhaFilaMostrar, 500); } })) { jogoConferir(); render(); }
}

/* ---------- flashcards: os itens que você errou voltam em 1, 3, 7, 15 e 30 dias ---------- */
function flashcardsAbrir() {
  const fila = flashcardsDeHoje(); if (!fila.length) { avisar('Nenhum flashcard para hoje. Eles nascem das questões que você erra.'); return; }
  let i = 0, virado = false, lembrou = 0;
  const corpo = () => { const r = fila[i], q = QID.get(r.id), t = topico(q.t);
    return `<p class="apoio" role="status">Flashcard ${i + 1} de ${fila.length}</p><span class="etiqueta">${esc(t ? t.nome : '')}</span>
      <div class="folha fc-carta"><p class="rotulo-mini">Certo ou errado? Por quê?</p><p class="tr-enun">${esc(q.e)}</p></div>
      ${virado ? `<div class="tr-exp"><p><b>${GAB[q.g]}.</b> ${esc(q.c)}</p><p class="tr-fund">${I.lei}<span>${esc(q.f)}</span></p></div>` : ''}`; };
  const pe = () => virado ? `<button type="button" class="kf-btn kf-sec" id="fc-nao">Não lembrei</button><button type="button" class="kf-btn kf-pri" id="fc-sim">Lembrei</button>` : `<button type="button" class="kf-btn kf-pri" id="fc-ver">Ver resposta</button>`;
  abrirJanela({ titulo: 'Flashcards', sub: 'Responda de cabeça e confira.', alto: true, corpo: `<div id="fc-corpo" class="pilha">${corpo()}</div>`, pe: `<div id="fc-pe" class="fc-pe">${pe()}</div>`,
    aoFechar: () => { if (i || lembrou) { render(); setTimeout(() => jogoConferir(), 600); } },
    aoMontar: d => {
      // o botão tocado é trocado por outro: o foco segue para o próximo passo
      const pintar = () => { $('#fc-corpo', d).innerHTML = corpo(); $('#fc-pe', d).innerHTML = pe(); (virado ? $('#fc-sim', d) : $('#fc-ver', d))?.focus({ preventScroll: true }); };
      d.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.id === 'fc-ver') { virado = true; pintar(); return; }
        if (b.id !== 'fc-sim' && b.id !== 'fc-nao') return;
        const r = fila[i], sim = b.id === 'fc-sim', h = hojeISO();
        r.rv = (r.rv || 0) + 1; r.ur = h;
        if (sim) { r.cx = (r.cx || 0) + 1; r.due = r.cx < FC_DIAS.length ? maisDias(h, FC_DIAS[r.cx]) : ''; lembrou++; } else { r.cx = 0; r.due = maisDias(h, 1); }
        salvar({ quieto: true }); i++; virado = false;
        if (i >= fila.length) { fecharJanela(true); render(); avisar(`${plural(fila.length, 'flashcard revisto', 'flashcards revistos')}: lembrou de ${lembrou}.`); setTimeout(() => jogoConferir(), 600); } else pintar();
      });
    } });
}

/* ---------- instrutor: a ponte de um toque com o Claude ----------
   O app copia a questão e a dúvida; a conversa acontece no Claude, no Projeto Estudo Fácil. O instrutor grava a
   resposta em instrutor/respostas.json, e o app a mostra ao lado da questão. */
let INSTRUTOR = LS.get('instrutor', {}) || {};
async function instrutorCarregar() {
  try { const r = await fetch('instrutor/respostas.json', { cache: 'no-cache' }); if (!r.ok) return; const o = await r.json(); if (o && typeof o === 'object') { INSTRUTOR = o; LS.set('instrutor', o); } } catch {}
}
async function copiarTexto(txt) {
  try { await navigator.clipboard.writeText(txt); return true; } catch {}
  try { const a = document.createElement('textarea'); a.value = txt; a.setAttribute('readonly', ''); a.style.cssText = 'position:fixed;opacity:0;top:0;left:0'; document.body.appendChild(a); a.select(); const ok = document.execCommand('copy'); a.remove(); return ok; } catch { return false; }
}
const URL_CLAUDE = 'https://claude.ai/project/01a13276-3f92-72f9-bcdd-060873067561';
function perguntarInstrutor(q = null, marcou = null) {
  const t = q && topico(q.t);
  abrirJanela({ titulo: 'Perguntar ao instrutor', sub: 'O app copia a sua dúvida. No Claude, cole no Projeto Estudo Fácil e envie.', contexto: q ? `Questão ${q.id}` : '',
    corpo: `<div class="kf-campo"><label class="kf-rotulo" for="in-d">Sua dúvida</label><textarea id="in-d" class="kf-entrada" rows="4" maxlength="1200" placeholder="${q ? 'O que não ficou claro neste item?' : 'Escreva a sua pergunta'}"></textarea></div>
      <p class="kf-ajuda">A resposta chega na hora, no Claude. Depois ela fica guardada aqui${q ? ', junto desta questão' : ''}.</p>`,
    pe: `<button type="button" class="kf-btn kf-pri" id="in-ok">Copiar e abrir o Claude</button>`,
    aoMontar: d => { $('#in-ok', d).onclick = async () => {
      const duvida = $('#in-d', d).value.trim(); if (!duvida && !q) { KitFacil.apontar($('#in-d', d)); avisar('Escreva a sua pergunta.'); return; }
      const txt = ['[Estudo Fácil · pergunta ao instrutor]', q ? `Questão ${q.id} · ${t ? t.nome : ''}\nItem: ${q.e}\nGabarito: ${GAB[q.g]}${marcou ? ` · marquei: ${GAB[marcou]}` : ''}\nComentário do app: ${q.c} (${q.f})` : '', `Minha dúvida: ${duvida || 'explique este item com outras palavras e um exemplo.'}`, 'Responda como meu instrutor e grave a resposta no app.'].filter(Boolean).join('\n\n');
      const ok = await copiarTexto(txt); jogoMarcar('instrutor'); fecharJanela(true);
      avisar(ok ? 'Pergunta copiada. Cole no Claude e envie.' : 'Não deu para copiar. Tente de novo.');
      if (ok && !semSalvar) window.open(URL_CLAUDE, '_blank', 'noopener');
    }; } });
}
// todas as respostas que o instrutor já gravou, da mais nova para a mais antiga
const respostasDoInstrutor = () => Object.entries(INSTRUTOR).flatMap(([id, L]) => (Array.isArray(L) ? L : []).map(x => ({ id, ...x }))).sort((a, b) => String(b.em || '').localeCompare(String(a.em || '')));
