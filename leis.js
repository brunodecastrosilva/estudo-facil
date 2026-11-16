/* Estudo Fácil · as leis na íntegra, dentro do app.
   O texto vem do site do Planalto (texto compilado), parágrafo a parágrafo, sem alteração: fica em leis/<id>.json
   ({ fonte, lido, p: [{ t: texto, r: 1 se revogado (riscado no Planalto), c: 1 se centralizado }] }).
   Aqui ficam a lista, a tela de leitura na identidade do app e o relógio: cada segundo de leitura soma no assunto
   da lei e na meta do dia (o relógio para quando o app sai da tela). */
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
let leiId = null, leiRel = null;

// tempo de leitura da lei aberta, em segundos (só conta com o app na tela)
const leiSeg = () => leiRel ? (leiRel.acc + (leiRel.ini ? Date.now() - leiRel.ini : 0)) / 1000 : 0;
function leiTempoAbrir(id) { if (leiRel && leiRel.id === id) return; leiTempoFechar(); leiRel = { id, acc: 0, ini: document.visibilityState === 'visible' ? Date.now() : 0, t: setInterval(() => { const el = document.querySelector('#lei-relogio'); if (el) el.textContent = fmtRelogio(leiSeg()); }, 1000) }; }
function leiTempoFechar() {
  const R = leiRel; if (!R) return; leiRel = null; clearInterval(R.t);
  const seg = (R.acc + (R.ini ? Date.now() - R.ini : 0)) / 1000, L = LEI.get(R.id), t = L && topico(L.t);
  if (seg >= 5 && t) { registrarSessao({ t: t.id, tipo: 'lei', seg }); salvar({ quieto: true }); if (typeof jogoConferir === 'function') jogoConferir(); }
}
document.addEventListener('visibilitychange', () => { if (!leiRel) return; if (document.visibilityState === 'visible') { if (!leiRel.ini) leiRel.ini = Date.now(); } else if (leiRel.ini) { leiRel.acc += Date.now() - leiRel.ini; leiRel.ini = 0; } });
addEventListener('pagehide', () => leiTempoFechar());

const viewLeis = {
  html() {
    const porM = []; for (const L of LEIS) { const t = topico(L.t), m = t && materia(t.m); if (!m) continue; const g = porM.find(x => x.m.id === m.id); g ? g.L.push(L) : porM.push({ m, L: [L] }); }
    return `${voltaMais()}${cab('Leis', 'O texto oficial do Planalto, na íntegra. O tempo de leitura conta no assunto e na meta do dia.')}
      ${porM.map((g, k) => `<section aria-labelledby="le-${k}"><div class="sec-cab"><h2 class="sub-t" id="le-${k}">${esc(g.m.nome)}</h2></div>
        <ul class="card lista">${g.L.map(L => `<li><button type="button" class="lin" data-act="abrir-lei" data-id="${esc(L.id)}"><span class="lin-ic">${I.lei}</span><span class="lin-tx"><b>${esc(L.nome)}</b><small>${esc(L.sub)}</small></span>${I.seta}</button></li>`).join('')}</ul></section>`).join('')}`;
  },
};
// o começo de cada dispositivo ganha destaque; o texto não muda
const leiParagrafo = p => {
  const t = p.t, m = /^(Art\.\s*\d[\d.]*\s*(?:º|°|o)?(?:-[A-Z])?\.?|§\s*\d+\s*(?:º|°|o)?\.?|Parágrafo único\.?)(\s.*)?$/.exec(t);
  const corpo = m ? `<b>${esc(m[1])}</b>${esc(m[2] || '')}` : esc(t), art = m && /^Art/.test(m[1]);
  return `<p class="${p.c ? 'lei-c' : art ? 'lei-art' : 'lei-p'}${p.r ? ' lei-r' : ''}">${p.r ? `<s>${corpo}</s>` : corpo}</p>`;
};
const viewLei = {
  html() {
    const L = LEI.get(leiId), tx = LEI_TXT[leiId], t = topico(L.t), semRev = LS.get('leiSemRev', 0);
    if (!tx) { fetch(`leis/${L.id}.json?v=${VERSAO}`).then(r => r.ok ? r.json() : Promise.reject()).then(j => { LEI_TXT[L.id] = j; if (tab === 'lei' && leiId === L.id) render(); }).catch(() => { LEI_TXT[L.id] = { erro: 1, p: [] }; if (tab === 'lei' && leiId === L.id) render(); }); }
    const volta = `<button type="button" class="volta" data-kf-ir="leis">${I.volta}<span>Leis</span></button>`;
    if (!tx) return `${volta}${cab(L.nome, esc(L.sub))}<p class="apoio" role="status">Abrindo o texto…</p>`;
    if (tx.erro) { delete LEI_TXT[L.id]; return `${volta}${cab(L.nome, esc(L.sub))}${KitFacil.ui.vazio({ titulo: 'Não deu para abrir a lei', texto: 'Confira a internet e tente de novo.' })}`; }
    const rev = tx.p.filter(p => p.r).length;
    return `${volta}${cab(L.nome, esc(L.sub))}
      <div class="lei-barra"><span class="etiqueta">${esc(t ? t.nome : '')}</span><span class="lei-tempo" aria-label="Tempo de leitura">${I.relogio || ''}<b id="lei-relogio">${fmtRelogio(leiSeg())}</b></span></div>
      ${rev ? linhaChave('lei-rev', !semRev, 'Mostrar o texto revogado', `${plural(rev, 'trecho riscado', 'trechos riscados')}, como no Planalto`) : ''}
      <article class="folha lei-folha${semRev ? ' sem-rev' : ''}" lang="pt-BR">${tx.p.map(leiParagrafo).join('')}</article>
      <p class="apoio">Texto compilado do Planalto, copiado em ${esc(tx.lido.split('-').reverse().join('/'))}, sem alteração. <a href="${esc(tx.fonte)}" target="_blank" rel="noopener noreferrer">Conferir no site oficial</a></p>`;
  },
};
document.addEventListener('change', e => { if (e.target && e.target.id === 'lei-rev') { LS.set('leiSemRev', e.target.checked ? 0 : 1); const f = document.querySelector('.lei-folha'); if (f) f.classList.toggle('sem-rev', !e.target.checked); } });
const ACOES_LEI = { 'abrir-lei': b => { if (LEI.has(b.dataset.id)) { leiId = b.dataset.id; irPara('lei'); } } };
