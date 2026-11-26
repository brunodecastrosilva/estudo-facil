/* Estudo Fácil · apostilas: a teoria de cada disciplina, escrita pelo instrutor (Claude) para quem nunca viu o assunto
   e voltada ao jeito de o Cebraspe cobrar (instrutor/caderno-da-banca.md).
   O texto fica em apostilas/<disciplina>.md, num formato simples, lido linha a linha:
     # título da apostila            @ base: de onde saíram os números (a lei, com a data da cópia)
     ## <id do assunto> | título     um capítulo por assunto do edital
     ### subtítulo                   - item de lista              > trecho da lei, entre aspas
     ex: exemplo do dia a dia        banca: como a banca cobra
     C: item certo :: por quê        E: item errado :: por quê    (modelos de item, só para ler: não é questão)
     = linha do resumo "Para a prova"
   Qualquer outra linha é um parágrafo. **negrito** é o único destaque. Tudo é protegido (esc) antes de ir para a tela. */
"use strict";
const APOSTILAS = [
  { m: 'anpd-lgpd', titulo: 'LGPD para quem nunca viu', sub: 'A Lei 13.709/2018 em 19 capítulos, um por assunto do edital', caps: 19 },
].map(a => ({ ...a, ids: Array.from({ length: a.caps }, (_, i) => `${a.m}-${String(i + 1).padStart(2, '0')}`) }));
const AP = new Map(APOSTILAS.map(a => [a.m, a]));
const AP_TXT = {};           // apostilas já buscadas nesta visita
let apId = null, apAlvo = null;
// a apostila que cobre um assunto (ou null): é ela que a opção Teoria abre
const apostilaDoAssunto = tId => { const t = topico(tId), a = t && AP.get(t.m); return a && a.ids.includes(tId) ? a : null; };
function apostilaAbrirEm(m, tId = '') { if (!AP.has(m)) return; apId = m; apAlvo = tId || null; irPara('apostila'); }

function apLer(txt) {
  const A = { titulo: '', base: '', caps: [] }; let cap = null;
  const por = (tipo, ...v) => { if (cap) cap.b.push([tipo, ...v]); };
  for (const cru of String(txt).split(/\r?\n/)) {
    const l = cru.trim(); if (!l) continue; let m;
    if ((m = /^##\s+(\S+)\s*\|\s*(.+)$/.exec(l))) { cap = { t: m[1], titulo: m[2], b: [] }; A.caps.push(cap); }
    else if (/^###\s+/.test(l)) por('h', l.replace(/^###\s+/, ''));
    else if (/^#\s+/.test(l)) A.titulo = l.replace(/^#\s+/, '');
    else if ((m = /^@\s*base:\s*(.+)$/.exec(l))) A.base = m[1];
    else if (/^-\s+/.test(l)) por('li', l.replace(/^-\s+/, ''));
    else if (/^=\s+/.test(l)) por('res', l.replace(/^=\s+/, ''));
    else if (/^>\s+/.test(l)) por('lei', l.replace(/^>\s+/, ''));
    else if ((m = /^ex:\s*(.+)$/.exec(l))) por('ex', m[1]);
    else if ((m = /^banca:\s*(.+)$/.exec(l))) por('banca', m[1]);
    else if ((m = /^([CE]):\s*(.+?)\s*::\s*(.+)$/.exec(l))) por('item', m[1], m[2], m[3]);
    else por('p', l);
  }
  return A;
}
const apFmt = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
function apBlocos(B) {
  let h = '';
  for (let i = 0; i < B.length; i++) {
    const [tipo, a, b, c] = B[i];
    if (tipo === 'li' || tipo === 'res') { const L = []; while (i < B.length && B[i][0] === tipo) L.push(B[i++][1]); i--;
      h += tipo === 'li' ? `<ul class="ap-lista">${L.map(x => `<li>${apFmt(x)}</li>`).join('')}</ul>` : `<div class="ap-resumo"><span class="rotulo-mini">Para a prova</span><ul class="ap-lista">${L.map(x => `<li>${apFmt(x)}</li>`).join('')}</ul></div>`; }
    else if (tipo === 'h') h += `<h3 class="ap-h">${apFmt(a)}</h3>`;
    else if (tipo === 'lei') h += `<blockquote class="ap-lei"><span class="rotulo-mini">Na lei</span><p>${apFmt(a)}</p></blockquote>`;
    else if (tipo === 'ex') h += `<div class="ap-ex"><span class="rotulo-mini">Exemplo</span><p>${apFmt(a)}</p></div>`;
    else if (tipo === 'banca') h += `<div class="ap-banca"><span class="rotulo-mini">Como o Cebraspe cobra</span><p>${apFmt(a)}</p></div>`;
    else if (tipo === 'item') h += `<div class="ap-item ${a === 'C' ? 'ap-c' : 'ap-e'}"><span class="etiqueta${a === 'C' ? ' ok' : ''}">${a === 'C' ? I.check + 'Modelo de item certo' : I.x + 'Modelo de item errado'}</span><p class="ap-af">${apFmt(b)}</p><p class="ap-pq"><b>Por quê:</b> ${apFmt(c)}</p></div>`;
    else h += `<p>${apFmt(a)}</p>`;
  }
  return h;
}
const apRolar = el => leiRolar(el);
// vai ao capítulo pedido; a janela de Estudar ainda está fechando quando a apostila abre, então confere de novo no fim do movimento
function apIrAoAlvo() {
  if (!apAlvo) return; const id = apAlvo; apAlvo = null;
  // sem movimento: o capítulo pode estar a dezenas de telas de distância
  const ir = foco => { const el = document.getElementById('ap-' + id); if (!el || tab !== 'apostila') return; if (Math.abs(el.getBoundingClientRect().top - 84) > 60) el.scrollIntoView({ block: 'start', behavior: 'auto' }); if (foco) try { el.focus({ preventScroll: true }); } catch {} };
  setTimeout(() => ir(true), 350); setTimeout(() => ir(false), 1300);
}

/* ---------- a lista de apostilas ---------- */
const viewApostilas = {
  html() {
    const P = pesosAtuais({ fase: false }), semAp = [...P.entries()].filter(([m]) => !AP.has(m) && materia(m)).sort((a, b) => b[1] - a[1]).map(([m]) => materia(m));
    return `${cab('Apostilas', 'Teoria para quem nunca viu o assunto, escrita do jeito que o Cebraspe cobra.')}
      <ul class="card lista">${APOSTILAS.filter(a => materia(a.m)).map(a => { const T = a.ids.map(topico).filter(Boolean), n = T.filter(t => t.teoria).length;
        return `<li><button type="button" class="lin" data-act="abrir-apostila" data-id="${esc(a.m)}"><span class="lin-ic">${I.livro}</span><span class="lin-tx"><b>${esc(a.titulo)}</b><small>${esc(a.sub)}</small><small>${n} de ${plural(T.length, 'capítulo estudado', 'capítulos estudados')}</small></span>${I.seta}</button></li>`; }).join('')}</ul>
      <p class="apoio">Em Estudar, a opção Teoria abre a apostila no capítulo do assunto, com o tempo contando. As questões ficam no Tec Concursos: marque aqui só os acertos e os erros.</p>
      ${semAp.length ? `<section aria-labelledby="ap-fila"><div class="sec-cab"><h2 class="sub-t" id="ap-fila">Ainda sem apostila</h2><span class="apoio">${semAp.length}</span></div>
        <ul class="card lista-simples ap-fila">${semAp.map(m => `<li>${esc(m.nome)}</li>`).join('')}</ul>
        <p class="apoio">Chegam uma disciplina por vez, na ordem do peso na prova. Até lá, a Teoria dessas disciplinas usa o cronômetro, com o seu material.</p></section>` : ''}`;
  },
};

/* ---------- a leitura ----------
   Abrir a apostila não é estudar (como nas leis): a sessão começa no botão do capítulo, ou vem de Estudar. Com uma
   sessão em andamento, a leitura entra nela. */
const viewApostila = {
  html() {
    const a = AP.get(apId), tx = AP_TXT[apId];
    if (!tx) { fetch(`apostilas/${a.m}.md?v=${VERSAO}`).then(r => r.ok ? r.text() : Promise.reject()).then(t => { AP_TXT[a.m] = apLer(t); if (tab === 'apostila' && apId === a.m) render(); }).catch(() => { AP_TXT[a.m] = { erro: 1 }; if (tab === 'apostila' && apId === a.m) render(); }); }
    const volta = `<button type="button" class="volta" data-kf-ir="apostilas">${I.volta}<span>Apostilas</span></button>`;
    if (!tx) return `${volta}${cab(a.titulo, esc(a.sub))}<p class="apoio" role="status">Abrindo a apostila…</p>`;
    if (tx.erro) { delete AP_TXT[a.m]; return `${volta}${cab(a.titulo, esc(a.sub))}${KitFacil.ui.vazio({ titulo: 'Não deu para abrir a apostila', texto: 'Confira a internet e tente de novo.' })}`; }
    apIrAoAlvo();
    const caps = tx.caps.filter(c => topico(c.t)), viva = DB.ativa;
    return `${volta}${cab(a.titulo, esc(a.sub))}
      ${viva ? `<p class="apoio" role="status">Sessão em andamento${topico(viva.t) ? ': ' + esc(topico(viva.t).nome) : ''}. O tempo desta leitura conta nela.</p>` : `<p class="apoio">Só abrir a apostila não conta tempo. A sessão começa no botão Estudar este capítulo.</p>`}
      <details class="tr-aula lei-sumario" id="lei-sumario" data-kf-secao open><summary><b>Sumário</b></summary>
        <ol class="lei-sum">${caps.map((c, i) => { const t = topico(c.t); return `<li><button type="button" class="lei-ir" data-act="ap-ir" data-id="${esc(c.t)}"><b>Capítulo ${i + 1}${t.teoria ? ' · estudado' : ''}</b><span>${esc(c.titulo)}</span></button></li>`; }).join('')}</ol></details>
      <article class="folha ap-folha" lang="pt-BR">${caps.map((c, i) => { const t = topico(c.t);
        return `<section class="ap-cap" id="ap-${esc(c.t)}" tabindex="-1" aria-labelledby="ap-t-${i}"><span class="rotulo-mini">Capítulo ${i + 1} de ${caps.length}</span><h2 class="ap-t" id="ap-t-${i}">${esc(c.titulo)}</h2>
          ${viva ? '' : `<button type="button" class="kf-btn kf-comecar ap-estudar" data-act="ap-estudar" data-id="${esc(c.t)}">${I.play}Estudar este capítulo</button>`}
          ${apBlocos(c.b)}
          <div class="ap-fim">${KitFacil.ui.fato({ marcado: !!t.teoria, marcar: 'Marcar teoria como concluída', desmarcar: 'Desmarcar teoria concluída', attrs: `data-act="ap-teoria" data-id="${esc(c.t)}"` })}</div></section>`; }).join('')}</article>
      <button type="button" class="kf-btn lei-topo" data-act="lei-sumario" id="lei-topo">${I.plano}Sumário</button>
      <p class="apoio">Texto do instrutor (Claude). ${esc(tx.base)} A apostila explica; na dúvida, vale o texto da lei, em Mais → Leis. Os modelos de item são do instrutor, não são questões de prova.</p>`;
  },
};
const ACOES_AP = {
  'abrir-apostila': b => apostilaAbrirEm(b.dataset.id, b.dataset.t || ''),
  'ap-ir': b => apRolar(document.getElementById('ap-' + b.dataset.id)),
  'ap-estudar': b => { const t = topico(b.dataset.id); if (!t || DB.ativa) return; iniciarSessao({ t: t.id, tipo: 'teoria' }); render(); avisar('Sessão começou. O tempo está contando.'); },
  'ap-teoria': b => {
    const t = topico(b.dataset.id); if (!t) return; const era = t.teoria, revsAntes = DB.revisoes.slice();
    if (era) { t.teoria = 0; DB.revisoes = DB.revisoes.filter(r => r.t !== t.id || r.feita); } else { t.teoria = agora(); agendarRevisoes(t.id, hojeISO()); }
    salvar();
    avisar(era ? 'Teoria desmarcada.' : 'Teoria concluída. Revisões marcadas.', { label: 'Desfazer', run: () => { t.teoria = era; DB.revisoes = revsAntes; salvar(); } });
    if (!era) setTimeout(() => jogoConferir(), 700);
  },
};
