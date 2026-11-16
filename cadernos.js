/* Estudo Fácil · cadernos de questões. O estudo do app é por questões, organizadas em cadernos:
   - de fábrica: um por disciplina (id "m:<disciplina>"), com as questões agrupadas por assunto;
   - de prova: um por prova do Cebraspe que já tem texto no aparelho (id "p:<prova>"), só com os itens do edital;
   - seus: montados por você (disciplinas, filtro e tamanho), com a lista de questões fixada na criação.
   Cada caderno guarda as próprias respostas (DB.cadernos: { id, nome, itens, r: { questão: "C" ou "E" }, em }), então
   dá para zerar um caderno sem perder o histórico geral das questões (DB.respostas). */
"use strict";

const materiasComBanco = () => DB.materias.filter(m => questoesDaMateria(m.id).length);
const regCaderno = id => DB.cadernos.find(c => c.id === id) || null;
function cadernoDe(id) {
  if (!id) return null;
  const O = oficiais();
  if (id.startsWith('m:')) { const m = materia(id.slice(2)); if (!m) return null; const itens = questoesDaMateria(m.id).concat(O.filter(q => q.m === m.id)); return itens.length ? { id, nome: m.nome, m, itens, fabrica: true } : null; }
  if (id.startsWith('p:')) { const p = PROVA.get(id.slice(2)), itens = p ? O.filter(q => q.of.p === p.id) : []; return itens.length ? { id, nome: `${p.org} ${p.ano}`, sub: p.nome, itens, fabrica: true, prova: p } : null; }
  const reg = regCaderno(id); if (!reg || !reg.itens) return null;
  return { id, nome: reg.nome || 'Caderno', itens: reg.itens.map(q => QID.get(q)).filter(q => q && (q.of || topico(q.t))), fabrica: false };
}
function cadernoEstado(C) {
  const r = (regCaderno(C.id) || {}).r || {}; let ac = 0, er = 0, prox = -1;
  C.itens.forEach((q, i) => { const v = r[q.id]; if (!v) { if (prox < 0) prox = i; } else if (v === q.g) ac++; else er++; });
  return { n: C.itens.length, feitas: ac + er, ac, er, prox, r };
}
function cadernoMarcar(id, q, v) { let reg = regCaderno(id); if (!reg) { reg = { id, r: {} }; DB.cadernos.push(reg); } reg.r = { ...(reg.r || {}), [q.id]: v }; reg.em = agora(); }
// o caderno em que você parou: o mais recente que ainda tem questão por resolver
function cadernoEmAndamento() {
  return [...DB.cadernos].sort((a, b) => (b.em || 0) - (a.em || 0)).map(r => cadernoDe(r.id)).filter(Boolean).find(C => { const E = cadernoEstado(C); return E.feitas > 0 && E.prox >= 0; }) || null;
}
const todasAsQuestoes = () => QUESTOES.filter(q => topico(q.t)).concat(oficiais());
const questoesDaDisciplina = mId => questoesDaMateria(mId).concat(oficiais().filter(q => q.m === mId));
const erradasGerais = () => todasAsQuestoes().filter(q => (respostaDe(q.id) || {}).ok === false);
const novasGerais = () => todasAsQuestoes().filter(q => !respostaDe(q.id));
// de onde vem o grupo de questões: o assunto (questão do app) ou a prova (questão oficial)
const grupoDaQuestao = q => q.of ? 'of:' + q.of.p + ':' + q.m : q.t;

/* ---------- telas ---------- */
let cadId = null;
const resumoCad = E => E.feitas ? `${E.feitas} de ${plural(E.n, 'questão resolvida', 'questões resolvidas')} · ${pct(E.ac, E.feitas)}% de acertos` : plural(E.n, 'questão', 'questões');
const viewCadernos = {
  html() {
    const and = cadernoEmAndamento(), M = materiasComBanco(), sem = DB.materias.filter(m => topicosDe(m.id).length && !questoesDaMateria(m.id).length);
    const provas = PROVAS.map(p => [p, cadernoDe('p:' + p.id)]), nOf = oficiais().length;
    const meus = DB.cadernos.filter(r => r.itens).map(r => cadernoDe(r.id)).filter(Boolean), er = erradasGerais().length, nv = novasGerais().length, D = desafioDoDia();
    const lin = (C, ic) => { const E = cadernoEstado(C); return `<li><button type="button" class="lin" data-act="abrir-cad" data-id="${esc(C.id)}">${ic}<span class="lin-tx"><b>${esc(C.nome)}</b><small>${resumoCad(E)}</small>${E.feitas ? barraHTML(E.feitas / E.n * 100, `${E.feitas} de ${E.n} resolvidas`, 'fina') : ''}</span>${I.seta}</button></li>`; };
    const atalho = (act, ic, t, sub, n) => `<li><button type="button" class="lin" data-act="${act}"><span class="lin-ic">${ic}</span><span class="lin-tx"><b>${t}</b><small>${sub}</small></span>${n ? `<span class="etiqueta">${n}</span>` : ''}${I.seta}</button></li>`;
    return `${cab('Cadernos', nOf ? 'Questões do app e das provas do Cebraspe, de certo ou errado.' : 'Questões de certo ou errado, no estilo do Cebraspe, todas comentadas.')}
      ${and ? (() => { const E = cadernoEstado(and); return `<section class="folha cad-continuar" aria-label="Continuar de onde parou"><span class="rotulo-mini">Você parou aqui</span><b class="cad-nome">${esc(and.nome)}</b>
        ${barraHTML(E.feitas / E.n * 100, `${E.feitas} de ${E.n} resolvidas`, 'grifada')}<p class="apoio">${resumoCad(E)}</p>
        <button type="button" class="kf-btn kf-comecar bloco" data-act="cad-continuar" data-id="${esc(and.id)}">${I.play}Continuar o caderno</button></section>`; })() : ''}
      <section aria-labelledby="cd-d"><div class="sec-cab"><h2 class="sec-t" id="cd-d">Por disciplina</h2><span class="apoio">${plural(todasAsQuestoes().length, 'questão', 'questões')}</span></div>
        <ul class="card lista">${M.map(m => lin(cadernoDe('m:' + m.id), pontoCor(m))).join('')}</ul>
        ${sem.length ? `<p class="apoio">Ainda sem questões: ${esc(sem.map(m => m.nome).join(', '))}.</p>` : ''}</section>
      <section aria-labelledby="cd-p"><div class="sec-cab"><h2 class="sec-t" id="cd-p">Provas do Cebraspe</h2>${nOf ? `<span class="apoio">${plural(nOf, 'questão oficial', 'questões oficiais')}</span>` : ''}</div>
        <ul class="card lista">${provas.map(([p, C]) => C ? lin(C, `<span class="lin-ic">${I.simulado}</span>`) : `<li><button type="button" class="lin" data-act="abrir-prova" data-id="${esc(p.id)}"><span class="lin-ic">${I.simulado}</span><span class="lin-tx"><b>${esc(p.org)} ${p.ano}</b><small>Folha de respostas · o caderno abre no site da banca</small></span>${I.seta}</button></li>`).join('')}</ul>
        ${provas.some(x => !x[1]) ? `<p class="apoio">Para resolver aqui as provas que faltam, abra o arquivo das provas.</p><button type="button" class="kf-btn kf-sec bloco" data-act="provas-abrir" id="pv-abrir">Abrir arquivo das provas</button><input type="file" accept=".json,application/json" id="pv-arquivo" hidden aria-label="Arquivo das provas">` : ''}
        ${DB.textos.length ? `<button type="button" class="kf-btn kf-link" data-act="provas-baixar" id="pv-baixar">Baixar arquivo das provas</button>` : ''}</section>
      <section aria-labelledby="cd-a"><div class="sec-cab"><h2 class="sec-t" id="cd-a">Atalhos</h2></div><ul class="card lista">
        ${atalho('cad-erradas', I.x, 'Só as que errei', er ? 'As questões que você errou por último, em todos os cadernos' : 'Nenhuma no momento', er)}
        ${atalho('cad-novas', I.estrela, 'Nunca resolvidas', nv ? 'Dez questões que você ainda não viu' : 'Você já viu todas', nv)}
        ${atalho('desafio', I.raio, 'Desafio do dia', D.feito ? 'Feito hoje. Amanhã tem outro.' : '10 questões sorteadas · bônus de pontos', 0)}</ul></section>
      <section aria-labelledby="cd-m"><div class="sec-cab"><h2 class="sec-t" id="cd-m">Meus cadernos</h2></div>
        ${meus.length ? `<ul class="card lista">${meus.map(C => lin(C, `<span class="lin-ic">${I.questoes}</span>`)).join('')}</ul>` : '<p class="apoio">Monte um caderno com as disciplinas e o filtro que quiser.</p>'}
        ${KitFacil.ui.adicionar({ rotulo: 'Novo caderno', attrs: 'data-act="novo-cad" id="cad-novo"' })}</section>
      <button type="button" class="kf-btn kf-link" data-kf-ir="provas">Ver gabaritos e folhas de respostas</button>`;
  },
};
const viewCaderno = {
  html() {
    const C = cadernoDe(cadId); if (!C) return '';
    const E = cadernoEstado(C), grupos = []; C.itens.forEach((q, i) => { const g = grupos[grupos.length - 1], k = grupoDaQuestao(q); if (g && g.k === k) g.L.push(i); else grupos.push({ k, q, L: [i] }); });
    const titulo = g => { if (!g.q.of) { const t = topico(g.q.t); return t ? t.nome : ''; } const m = materia(g.q.m); return C.prova ? (m ? m.nome : '') : `Prova do Cebraspe · ${g.q.of.rot}`; };
    return `<button type="button" class="volta" data-kf-ir="cadernos">${I.volta}<span>Cadernos</span></button>${cab(C.nome, C.prova ? `${C.sub}. Só os itens do seu edital.` : C.fabrica ? 'Caderno da disciplina, por assunto.' : 'Caderno seu.')}
      <section class="folha cad-capa" aria-label="Andamento">
        <p class="vit-n"><span class="grifo">${E.feitas}</span><small>de ${plural(E.n, 'questão resolvida', 'questões resolvidas')}</small></p>
        ${barraHTML(E.feitas / E.n * 100, `${E.feitas} de ${E.n} resolvidas`, 'grifada alta')}
        <dl class="resumo"><div><dt>Certas</dt><dd>${E.ac}</dd></div><div><dt>Erradas</dt><dd>${E.er}</dd></div><div><dt>Acertos</dt><dd>${E.feitas ? pct(E.ac, E.feitas) + '%' : 'sem respostas'}</dd></div></dl>
        ${E.prox >= 0 ? `<button type="button" class="kf-btn kf-comecar bloco" data-act="cad-continuar" data-id="${esc(C.id)}" id="cad-ir">${I.play}${E.feitas ? 'Continuar o caderno' : 'Começar o caderno'}</button>` : '<p class="apoio" role="status">Caderno concluído.</p>'}
        ${E.er ? `<button type="button" class="kf-btn kf-sec bloco" data-act="cad-refazer" id="cad-refazer">Refazer as ${E.er === 1 ? 'erradas (1)' : `erradas (${E.er})`}</button>` : ''}
        ${E.feitas ? `<button type="button" class="kf-btn kf-link" data-act="cad-zerar" id="cad-zerar">Zerar as respostas do caderno</button>` : ''}
      </section>
      ${grupos.map((g, k) => { return `<section aria-labelledby="cg-${k}"><div class="sec-cab"><h2 class="sub-t" id="cg-${k}">${esc(titulo(g))}</h2></div>
        <ol class="cad-grade">${g.L.map(i => { const q = C.itens[i], v = E.r[q.id], st = !v ? '' : v === q.g ? 'ok' : 'no';
          return `<li><button type="button" class="cad-q ${st}" data-act="cad-abrir" data-i="${i}" aria-label="Questão ${i + 1}: ${!v ? 'não resolvida' : v === q.g ? 'resolvida, você acertou' : 'resolvida, você errou'}">${i + 1}${v ? `<span class="cad-q-ic" aria-hidden="true">${v === q.g ? I.check : I.x}</span>` : ''}</button></li>`; }).join('')}</ol></section>`; }).join('')}
      ${C.fabrica ? '' : `<button type="button" class="kf-btn kf-perigo" data-act="cad-excluir" id="cad-excluir">${I.lixo}Excluir caderno</button>`}`;
  },
};
function novoCaderno() {
  const M = materiasComBanco(); let filtro = 'todas', qtd = 20;
  abrirJanela({ titulo: 'Novo caderno', sub: 'Escolha as disciplinas, o filtro e o tamanho.', alto: true,
    corpo: `<div class="kf-campo"><label class="kf-rotulo" for="nc-nome">Nome do caderno</label><input id="nc-nome" type="text" class="kf-entrada" maxlength="60" placeholder="Revisão da semana" autocomplete="off" enterkeyhint="done"></div>
      <fieldset class="kf-campo nc-disc"><legend class="kf-rotulo">Disciplinas</legend>${M.map((m, i) => linhaChave('nc-m' + i, false, esc(m.nome), plural(questoesDaDisciplina(m.id).length, 'questão', 'questões'))).join('')}</fieldset>
      <div class="kf-campo"><span class="kf-rotulo">Quais questões</span>${segHTML('nc-filtro', [['todas', 'Todas'], ['novas', 'Não resolvidas'], ['erradas', 'Que errei']], filtro, 'Quais questões')}</div>
      <div class="kf-campo"><span class="kf-rotulo">Quantas</span>${segHTML('nc-qtd', [[10, '10'], [20, '20'], [40, '40'], [0, 'Todas']], qtd, 'Quantas questões')}</div>`,
    pe: `<button type="button" class="kf-btn kf-pri" id="nc-ok">Criar caderno</button>`,
    aoMontar: d => {
      ligarSeg($('#nc-filtro', d), v => { filtro = v; }); ligarSeg($('#nc-qtd', d), v => { qtd = +v; });
      $('#nc-ok', d).onclick = () => {
        const sel = M.filter((m, i) => { const c = $('#nc-m' + i, d); return c && (c.checked || c.getAttribute('aria-checked') === 'true'); });
        if (!sel.length) { avisar('Escolha pelo menos uma disciplina.'); return; }
        let L = sel.flatMap(m => questoesDaDisciplina(m.id));
        if (filtro === 'novas') L = L.filter(q => !respostaDe(q.id)); else if (filtro === 'erradas') L = L.filter(q => (respostaDe(q.id) || {}).ok === false);
        if (!L.length) { avisar('Nenhuma questão com esse filtro. Troque o filtro ou as disciplinas.'); return; }
        // tamanho menor que o conjunto: as questões se espalham pelos assuntos, em vez de pegar só o começo
        if (qtd && L.length > qtd) { const passo = L.length / qtd; L = Array.from({ length: qtd }, (_, i) => L[Math.floor(i * passo)]); }
        const nome = $('#nc-nome', d).value.trim().slice(0, 60) || (sel.length === 1 ? sel[0].nome : `${sel.length} disciplinas`) + (filtro === 'erradas' ? ' · erradas' : filtro === 'novas' ? ' · novas' : '');
        const reg = { id: novoId(), nome, itens: L.map(q => q.id), r: {}, em: agora() }; DB.cadernos.push(reg); salvar({ quieto: true });
        fecharJanela(true); cadId = reg.id; irPara('caderno');
      };
    } });
}
const ACOES_CAD = {
  'abrir-cad': b => { cadId = b.dataset.id; irPara('caderno'); },
  'cad-continuar': b => { const C = cadernoDe(b.dataset.id || cadId); if (!C) return; const E = cadernoEstado(C); if (E.prox < 0) { cadId = C.id; irPara('caderno'); return; } treinoAbrir({ caderno: C.id, i: E.prox }); },
  'cad-abrir': b => treinoAbrir({ caderno: cadId, i: +b.dataset.i }),
  'cad-refazer': () => { const C = cadernoDe(cadId); if (!C) return; const reg = regCaderno(C.id), r = { ...reg.r }; C.itens.forEach(q => { if (r[q.id] && r[q.id] !== q.g) delete r[q.id]; }); reg.r = r; reg.em = agora(); salvar({ quieto: true }); treinoAbrir({ caderno: C.id, i: cadernoEstado(C).prox }); },
  'cad-zerar': () => confirmar('Zerar o caderno?', 'As respostas deste caderno são apagadas. O histórico das questões e as sessões continuam.', 'Zerar o caderno', () => { const reg = regCaderno(cadId); if (reg) { reg.r = {}; reg.em = agora(); } salvar(); avisar('Caderno zerado.'); }),
  'cad-excluir': () => confirmar('Excluir o caderno?', 'O caderno sai da lista. As questões e o seu histórico continuam.', 'Excluir caderno', () => { DB.cadernos = DB.cadernos.filter(c => c.id !== cadId); salvar({ quieto: true }); irPara('cadernos'); avisar('Caderno excluído.'); }),
  'cad-erradas': () => { const L = erradasGerais(); if (!L.length) { avisar('Você não tem questões erradas no momento.'); return; } treinoAbrir({ lista: L.slice(0, 20) }); },
  'cad-novas': () => { const L = novasGerais(); if (!L.length) { avisar('Você já resolveu todas as questões do app.'); return; } treinoAbrir({ lista: L.slice(0, 10) }); },
  'novo-cad': () => novoCaderno(),
  'provas-abrir': () => { const el = $('#pv-arquivo'); el && el.click(); },
  'provas-baixar': () => baixarProvas(),
};
