/* Estudo Fácil · as leis na íntegra, dentro do app.
   O texto vem do site do Planalto (texto compilado), parágrafo a parágrafo, sem alteração: fica em leis/<id>.json
   ({ fonte, lido, p: [{ t: texto, r: 1 se revogado (riscado no Planalto), c: 1 se centralizado }] }).
   Aqui ficam a lista, o sumário, a tela de leitura na identidade do app e o recorte da dose de lei seca de cada
   capítulo (a tela da dose fica em apostilas.js). */
"use strict";
const LEIS = [
  ['lgpd', 'Lei 13.709/2018', 'Lei Geral de Proteção de Dados (LGPD)', 'anpd-lgpd-01'],
  ['l15352', 'Lei 15.352/2026', 'ANPD como agência reguladora e carreira', 'anpd-inst-01'],
  ['l15211', 'Lei 15.211/2025', 'ECA Digital', 'anpd-inst-07'],
  ['l12965', 'Lei 12.965/2014', 'Marco Civil da Internet', 'anpd-dig-01'],
  ['l8078', 'Lei 8.078/1990', 'Código de Defesa do Consumidor', 'anpd-dig-03'],
  ['l13848', 'Lei 13.848/2019', 'Lei Geral das Agências Reguladoras', 'anpd-regul-04'],
  ['l9986', 'Lei 9.986/2000', 'Gestão de pessoas das agências', 'anpd-regul-05'],
  ['l10871', 'Lei 10.871/2004', 'Carreiras das agências reguladoras', 'anpd-regul-05'],
  ['d10411', 'Decreto 10.411/2020', 'Análise de impacto regulatório', 'anpd-regul-06'],
  ['l13874', 'Lei 13.874/2019', 'Lei de Liberdade Econômica', 'anpd-regul-07'],
  ['lc182', 'Lei Complementar 182/2021', 'Marco das startups (sandbox regulatório)', 'anpd-regul-09'],
  ['l12529', 'Lei 12.529/2011', 'Defesa da concorrência', 'anpd-econ-03'],
  ['l9784', 'Lei 9.784/1999', 'Processo administrativo federal', 'anpd-da-05'],
  ['l14133', 'Lei 14.133/2021', 'Licitações e contratos', 'anpd-da-06'],
  ['l8112', 'Lei 8.112/1990', 'Servidores públicos federais', 'anpd-da-07'],
  ['l8429', 'Lei 8.429/1992', 'Improbidade administrativa', 'anpd-da-10'],
  ['l12846', 'Lei 12.846/2013', 'Lei Anticorrupção', 'anpd-da-11'],
  ['l14129', 'Lei 14.129/2021', 'Governo Digital', 'anpd-da-12'],
  ['cf', 'Constituição Federal de 1988', 'Texto integral', 'anpd-dc-01'],
  ['d1171', 'Decreto 1.171/1994', 'Código de Ética do servidor federal', 'anpd-etica-01'],
  ['l12813', 'Lei 12.813/2013', 'Conflito de interesses', 'anpd-etica-02'],
  ['l12527', 'Lei 12.527/2011', 'Lei de Acesso à Informação', 'anpd-etica-03'],
  ['d7724', 'Decreto 7.724/2012', 'Regulamento da LAI', 'anpd-etica-03'],
  ['d9203', 'Decreto 9.203/2017', 'Governança pública', 'anpd-etica-05'],
].map(([id, nome, sub, t]) => ({ id, nome, sub, t }));
const LEI = new Map(LEIS.map(l => [l.id, l]));
const LEI_TXT = {};          // textos já buscados nesta visita
let leiId = null, leiAlvo = null;
/* Qual lei abre para cada assunto, e em que artigo. O que não está na tabela usa a lei ligada ao assunto em LEIS;
   nos assuntos com dose de lei seca (DOSES), vale o primeiro artigo da dose. */
const LEI_DO_ASSUNTO = {
  'regul-04': ['l13848'], 'regul-05': ['l9986'], 'regul-06': ['d10411'], 'regul-07': ['l13874'], 'regul-08': ['l13848', '9'], 'regul-09': ['lc182', '11'], 'regul-10': ['l13848', '14'], 'regul-11': ['l13848', '25'],
  'da-01': ['cf', '37'], 'da-05': ['l9784'], 'da-06': ['l14133'], 'da-07': ['l8112'], 'da-08': ['cf', '37'], 'da-09': ['cf', '70'], 'da-10': ['l8429'], 'da-11': ['l12846'], 'da-12': ['l14129'],
  'dc-01': ['cf', '1'], 'dc-02': ['cf', '5'], 'dc-03': ['cf', '5'], 'dc-04': ['cf', '5'], 'dc-05': ['cf', '21'], 'dc-06': ['cf', '37'], 'dc-07': ['cf', '44'], 'dc-08': ['cf', '102'], 'dc-09': ['cf', '170'],
  'etica-01': ['d1171'], 'etica-02': ['l12813'], 'etica-03': ['l12527'], 'etica-04': ['l12527', '31'], 'etica-05': ['d9203'],
  'dig-01': ['l12965'], 'dig-03': ['l8078'], 'dig-08': ['lgpd', '23'], 'econ-03': ['l12529'],
  // Cofen: contratos na Lei 14.133/2021 (do art. 89 em diante) e o que é só do Cofen em Constitucional e Ética
  'cofen-ct-01': ['l14133', '89'], 'cofen-ct-02': ['l14133', '92'], 'cofen-ct-03': ['l14133', '89'], 'cofen-ct-04': ['l14133', '105'], 'cofen-ct-05': ['l14133', '124'], 'cofen-ct-06': ['l14133', '130'], 'cofen-ct-07': ['l14133', '115'], 'cofen-ct-08': ['l14133', '155'],
  'cofen-ct-09': ['l14133', '117'], 'cofen-ct-10': ['l14133', '117'], 'cofen-ct-11': ['l14133', '140'], 'cofen-ct-12': ['l14133', '115'], 'cofen-ct-13': ['l14133', '141'], 'cofen-ct-14': ['l14133', '124'], 'cofen-ct-15': ['l14133', '156'], 'cofen-ct-16': ['l14133', '137'],
  'cofen-dc-02': ['cf', '6'], 'cofen-dc-03': ['cf', '2'], 'cofen-dc-04': ['cf', '127'], 'cofen-dc-05': ['cf', '196'], 'cofen-dh-01': ['cf', '5'], 'cofen-etica-01': ['d1171'],
  'inst-01': ['l15352'], 'inst-02': ['lgpd', '55-A'], 'inst-04': ['lgpd', '58-A'], 'inst-06': ['lgpd', '55-J'], 'inst-07': ['l15211'], 'inst-08': ['l15211'], 'inst-09': ['l15211'],
};
function leiDoAssunto(tId) {
  const t = topico(tId); if (!t) return null; const k = LEI_DO_ASSUNTO[tId.replace(/^anpd-/, '')];
  if (k && LEI.has(k[0])) return { id: k[0], art: k[1] || '' };
  if (DOSES[tId]) return { id: DOSES[tId][0], art: DOSES[tId][1] };
  const L = LEIS.find(l => l.t === tId); return L ? { id: L.id, art: '' } : null;
}
/* A dose de lei seca de cada capítulo: a lei, o primeiro e o último artigo. Só entra aqui o assunto que tem apostila;
   os números foram conferidos no texto guardado em leis/<id>.json. */
const DOSES = {
  'anpd-lgpd-01': ['lgpd', '1', '4'], 'anpd-lgpd-02': ['lgpd', '5', '5'], 'anpd-lgpd-03': ['lgpd', '6', '6'], 'anpd-lgpd-04': ['lgpd', '7', '7'], 'anpd-lgpd-05': ['lgpd', '8', '9'],
  'anpd-lgpd-06': ['lgpd', '10', '10'], 'anpd-lgpd-07': ['lgpd', '11', '13'], 'anpd-lgpd-08': ['lgpd', '14', '14'], 'anpd-lgpd-09': ['lgpd', '15', '16'], 'anpd-lgpd-10': ['lgpd', '17', '22'],
  'anpd-lgpd-11': ['lgpd', '20', '20'], 'anpd-lgpd-12': ['lgpd', '23', '32'], 'anpd-lgpd-13': ['lgpd', '33', '36'], 'anpd-lgpd-14': ['lgpd', '37', '41'], 'anpd-lgpd-15': ['lgpd', '42', '45'],
  // Direito Constitucional: o trecho da Constituição que o capítulo explica
  'anpd-dc-01': ['cf', '1', '4'], 'anpd-dc-02': ['cf', '5', '5'], 'anpd-dc-05': ['cf', '21', '24'], 'anpd-dc-06': ['cf', '37', '41'], 'anpd-dc-07': ['cf', '59', '69'], 'anpd-dc-08': ['cf', '102', '103-A'], 'anpd-dc-09': ['cf', '170', '175'],
  'cofen-dc-02': ['cf', '6', '11'], 'cofen-dc-03': ['cf', '92', '95'], 'cofen-dc-04': ['cf', '127', '135'], 'cofen-dc-05': ['cf', '196', '200'],
  // Direito Administrativo: a dose é um recorte curto da lei que o capítulo mais usa
  'anpd-da-01': ['l9784', '1', '2'], 'anpd-da-02': ['l13848', '2', '3'], 'anpd-da-04': ['l9784', '50', '55'], 'anpd-da-05': ['l9784', '56', '67'], 'anpd-da-06': ['l14133', '28', '33'], 'anpd-da-07': ['l8112', '127', '142'],
  'anpd-da-09': ['cf', '70', '74'], 'anpd-da-10': ['l8429', '9', '12'], 'anpd-da-11': ['l12846', '1', '7'], 'anpd-da-12': ['l14129', '1', '3'], 'cofen-da-04': ['l8112', '143', '152'],
  'anpd-lgpd-16': ['lgpd', '46', '49'], 'anpd-lgpd-17': ['lgpd', '50', '51'], 'anpd-lgpd-18': ['lgpd', '52', '54'], 'anpd-lgpd-19': ['lgpd', '55-A', '58-B'],
};
const doseDe = tId => { const d = DOSES[tId]; return d && LEI.has(d[0]) && topico(tId) ? { lei: d[0], de: d[1], ate: d[2] } : null; };
const artOrd = n => /^\d$/.test(n) ? n + 'º' : n;
const doseRotulo = d => `${LEI.get(d.lei).nome} · ${d.de === d.ate ? 'art. ' + artOrd(d.de) : `arts. ${artOrd(d.de)} a ${artOrd(d.ate)}`}`;
// o número de um artigo vira uma chave que dá para comparar: 55 < 55-A < 55-B < 56
const artChave = s => { const m = /^(\d+)(?:-([A-Z]))?$/.exec(String(s).replace(/\./g, '')); return m ? +m[1] * 100 + (m[2] ? m[2].charCodeAt(0) - 64 : 0) : -1; };
const artDoParagrafo = p => { const m = /^Art\.\s*(\d[\d.]*)\s*(?:º|°|o)?\s*(-[A-Z])?/.exec(p.t); return m ? artChave(m[1].replace(/\./g, '') + (m[2] || '')) : -1; };
/* os parágrafos da dose, com a posição de cada um na lei: do primeiro "Art. <de>" até antes do primeiro artigo de número
   maior que <ate>. Redações antigas que o Planalto mantém no texto vêm junto, como lá. Títulos de capítulo que sobram no
   fim (são do artigo seguinte) ficam de fora. */
function doseParagrafos(P, d) {
  const a = artChave(d.de), z = artChave(d.ate), ini = P.findIndex(p => artDoParagrafo(p) === a); if (ini < 0) return [];
  let fim = P.findIndex((p, i) => i > ini && artDoParagrafo(p) > z); if (fim < 0) fim = P.length;
  while (fim > ini + 1 && P[fim - 1].c) fim--;
  return P.slice(ini, fim).map((p, k) => [p, ini + k]);
}
const LEI_BUSCA = {};
function leiCarregar(id) {
  if (LEI_TXT[id] && !LEI_TXT[id].erro) return Promise.resolve(LEI_TXT[id]);
  if (!LEI_BUSCA[id]) LEI_BUSCA[id] = fetch(`leis/${id}.json?v=${VERSAO}`).then(r => r.ok ? r.json() : Promise.reject()).then(j => { LEI_TXT[id] = j; delete LEI_BUSCA[id]; return j; }).catch(() => { LEI_TXT[id] = { erro: 1, p: [] }; delete LEI_BUSCA[id]; return LEI_TXT[id]; });
  return LEI_BUSCA[id];
}
function leiAbrirEm(id, art = '') { if (!LEI.has(id)) return; leiId = id; leiAlvo = art || null; irPara('lei'); }
// depois que o texto está na tela, vai ao artigo pedido (o primeiro não revogado com aquele número)
function leiIrAoAlvo() {
  const tx = LEI_TXT[leiId]; if (!leiAlvo || !tx || !tx.p) return; const art = leiAlvo; leiAlvo = null;
  const re = new RegExp('^Art\\.\\s*' + art.replace(/[-.]/g, '\\$&') + '\\s*(?:º|°|o)?(?![\\d-])', 'i'), i = tx.p.findIndex(p => !p.r && re.test(p.t));
  if (i >= 0) setTimeout(() => leiRolar(document.getElementById('lei-p' + i)), 350);
}

const viewLeis = {
  html() {
    const porM = []; for (const L of LEIS) { const t = topico(L.t), m = t && materia(t.m); if (!m) continue; const g = porM.find(x => x.m.id === m.id); g ? g.L.push(L) : porM.push({ m, L: [L] }); }
    return `${voltaMais()}${cab('Leis', 'O texto oficial do Planalto, na íntegra, sem alteração.')}
      ${porM.map((g, k) => `<section aria-labelledby="le-${k}"><div class="sec-cab"><h2 class="sub-t" id="le-${k}">${esc(g.m.nome)}</h2></div>
        <ul class="card lista">${g.L.map(L => `<li><button type="button" class="lin" data-act="abrir-lei" data-id="${esc(L.id)}"><span class="lin-ic">${I.lei}</span><span class="lin-tx"><b>${esc(L.nome)}</b><small>${esc(L.sub)}</small></span>${I.seta}</button></li>`).join('')}</ul></section>`).join('')}`;
  },
};
/* sumário: as partes da lei (livro, título, capítulo, seção, subseção, anexo) saem dos títulos centralizados, com o nome
   que vem na linha seguinte; lei sem partes ganha atalhos para os artigos. Só aponta para o texto: não muda nada nele. */
const LEI_PARTE = /^(PARTE|LIVRO|T[ÍI]TULO|CAP[ÍI]TULO|SE[ÇC][ÃA]O|SUBSE[ÇC][ÃA]O|ANEXO|ATO DAS DISPOSI[ÇC][ÕO]ES|PRE[ÂA]MBULO)\b/i;
function leiSumario(P) {
  const S = [], nivel = t => /^(PARTE|LIVRO|ATO DAS|ANEXO|PRE)/i.test(t) ? 0 : /^T/i.test(t) ? 1 : /^C/i.test(t) ? 2 : /^SE/i.test(t) ? 3 : 4;
  P.forEach((p, i) => {
    if (!p.c || p.r || !LEI_PARTE.test(p.t) || p.t.length > 260) return;
    // "CAPÍTULO I DISPOSIÇÕES PRELIMINARES": o rótulo vai até o número; o resto é o nome (que também pode vir na linha de baixo)
    const m = /^(\S+\s+(?:[IVXLCDM]+|[ÚU]NIC[OA]|\d+)(?:-[A-Z])?)(?=$|[\s.–-])[\s.–-]*(.*)$/i.exec(p.t), n = P[i + 1];
    const t = m ? m[1] : p.t, nome = m && m[2] ? m[2] : n && n.c && !n.r && !LEI_PARTE.test(n.t) && n.t.length <= 160 && !/^Art\./.test(n.t) ? n.t : '';
    S.push({ i, t, nome, n: nivel(p.t) });
  });
  if (S.length >= 3) { const base = Math.min(...S.map(x => x.n)); S.forEach(x => { x.n -= base; }); return { partes: S, artigos: [] }; }
  const A = []; P.forEach((p, i) => { const m = !p.r && /^Art\.\s*(\d[\d.]*)\s*(?:º|°|o)?(-[A-Z])?/.exec(p.t); if (m) A.push({ i, t: m[1] + (m[2] || '') }); });
  return { partes: S, artigos: A };
}
// o começo de cada dispositivo ganha destaque; o texto não muda
const leiParagrafo = (p, i) => {
  const t = p.t, m = /^(Art\.\s*\d[\d.]*\s*(?:º|°|o)?(?:-[A-Z])?\.?|§\s*\d+\s*(?:º|°|o)?\.?|Parágrafo único\.?)(\s.*)?$/.exec(t);
  const corpo = m ? `<b>${esc(m[1])}</b>${esc(m[2] || '')}` : esc(t), art = m && /^Art/.test(m[1]);
  return `<p id="lei-p${i}" tabindex="-1" class="${p.c ? 'lei-c' : art ? 'lei-art' : 'lei-p'}${p.r ? ' lei-r' : ''}">${p.r ? `<s>${corpo}</s>` : corpo}</p>`;
};
const viewLei = {
  html() {
    const L = LEI.get(leiId), tx = LEI_TXT[leiId], t = topico(L.t), semRev = LS.get('leiSemRev', 0);
    if (!tx) leiCarregar(L.id).then(() => { if (tab === 'lei' && leiId === L.id) render(); });
    const volta = `<button type="button" class="volta" data-kf-ir="leis">${I.volta}<span>Leis</span></button>`;
    if (!tx) return `${volta}${cab(L.nome, esc(L.sub))}<p class="apoio" role="status">Abrindo o texto…</p>`;
    if (tx.erro) { delete LEI_TXT[L.id]; return `${volta}${cab(L.nome, esc(L.sub))}${KitFacil.ui.vazio({ titulo: 'Não deu para abrir a lei', texto: 'Confira a internet e tente de novo.' })}`; }
    leiIrAoAlvo();
    const rev = tx.p.filter(p => p.r).length, S = tx.sum || (tx.sum = leiSumario(tx.p));
    const sumario = S.partes.length >= 3 ? `<ol class="lei-sum">${S.partes.map(x => `<li class="n${Math.min(x.n, 3)}"><button type="button" class="lei-ir" data-act="lei-ir" data-i="${x.i}"><b>${esc(x.t)}</b>${x.nome ? `<span>${esc(x.nome)}</span>` : ''}</button></li>`).join('')}</ol>`
      : S.artigos.length ? `<ol class="lei-arts">${S.artigos.map(x => `<li><button type="button" class="lei-ir" data-act="lei-ir" data-i="${x.i}" aria-label="Artigo ${esc(x.t)}">Art. ${esc(x.t)}</button></li>`).join('')}</ol>` : '';
    return `${volta}${cab(L.nome, esc(L.sub))}
      <div class="lei-barra"><span class="etiqueta">${esc(t ? t.nome : '')}</span></div>
      ${rev ? linhaChave('lei-rev', !semRev, 'Mostrar o texto revogado', `${plural(rev, 'trecho riscado', 'trechos riscados')}, como no Planalto`) : ''}
      ${sumario ? `<details class="lei-sumario" id="lei-sumario" data-kf-secao open><summary><b>Sumário</b></summary>${sumario}</details>` : ''}
      <article class="folha lei-folha${semRev ? ' sem-rev' : ''}" lang="pt-BR">${tx.p.map((p, i) => leiParagrafo(p, i)).join('')}</article>
      ${sumario ? `<button type="button" class="kf-btn lei-topo" data-act="lei-sumario" id="lei-topo">${I.plano || ''}Sumário</button>` : ''}
      <p class="apoio">Texto compilado do Planalto, copiado em ${esc(tx.lido.split('-').reverse().join('/'))}, sem alteração. <a href="${esc(tx.fonte)}" target="_blank" rel="noopener noreferrer">Conferir no site oficial</a></p>`;
  },
};
// o botão Sumário só aparece depois que a leitura desce
addEventListener('scroll', () => { const b = document.getElementById('lei-topo'); if (b) b.classList.toggle('visivel', scrollY > 600); }, { passive: true });
document.addEventListener('change', e => { if (e.target && e.target.id === 'lei-rev') { LS.set('leiSemRev', e.target.checked ? 0 : 1); const f = document.querySelector('.lei-folha'); if (f) f.classList.toggle('sem-rev', !e.target.checked); } });
const leiRolar = el => { if (!el) return; el.scrollIntoView({ block: 'start', behavior: KitFacil.movimento && KitFacil.movimento.reduzido && KitFacil.movimento.reduzido() ? 'auto' : 'smooth' }); try { el.focus({ preventScroll: true }); } catch {} };
const ACOES_LEI = {
  'abrir-lei': b => { if (LEI.has(b.dataset.id)) { leiId = b.dataset.id; irPara('lei'); } },
  'lei-ir': b => leiRolar(document.getElementById('lei-p' + b.dataset.i)),
  'lei-sumario': () => { const d = document.getElementById('lei-sumario'); if (d) { d.open = true; leiRolar(d.querySelector('summary')); } },
};
