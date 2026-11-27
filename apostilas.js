/* Estudo Fácil · apostilas: a teoria de cada disciplina, escrita pelo instrutor (Claude) para quem nunca viu o assunto
   e voltada ao jeito de o Cebraspe cobrar (instrutor/caderno-da-banca.md).
   O texto fica em apostilas/<disciplina>.md, num formato simples, lido linha a linha:
     # título da apostila            @ base: de onde saíram os números (a lei, com a data da cópia)
     ## <id do assunto> | título     um capítulo por assunto do edital
     ### subtítulo                   - item de lista              > trecho da lei, entre aspas
     ex: exemplo do dia a dia        banca: como a banca cobra
     C: item certo :: por quê        E: item errado :: por quê    (modelos de item, só para ler: não é questão)
     = linha do resumo "Para a prova"
     ? <letra> | pergunta :: resposta   cartão de conceito; fica dentro do trecho (###) que responde a ele
     x: enunciado :: resposta comentada   exercício de fixação, no fim do capítulo; a resposta abre com um toque
   Qualquer outra linha é um parágrafo. **negrito** é o único destaque. Tudo é protegido (esc) antes de ir para a tela.
   A leitura é por capítulo: um por tela, com "Entendi" ou "Quero reler depois" no fim. O app guarda onde você parou. */
"use strict";
const APOSTILAS = [
  // caps: os assuntos <disciplina>-01 a -NN; mais: os assuntos de outro edital que entram na mesma disciplina (ids próprios)
  { m: 'anpd-lp', titulo: 'Português para quem nunca se deu bem com gramática', curto: 'Língua Portuguesa', sub: '15 capítulos: os 12 assuntos da ANPD e os 3 que só o Cofen cobra', caps: 12, mais: ['cofen-lp-01', 'cofen-lp-02', 'cofen-lp-03'] },
  { m: 'anpd-da', titulo: 'Direito Administrativo para quem nunca viu', curto: 'Direito Administrativo', sub: '16 capítulos: os 12 assuntos da ANPD e os 4 que só o Cofen cobra', caps: 12, mais: ['cofen-da-01', 'cofen-da-02', 'cofen-da-03', 'cofen-da-04'] },
  { m: 'anpd-dc', titulo: 'Direito Constitucional para quem nunca viu', curto: 'Direito Constitucional', sub: '14 capítulos: os 9 assuntos da ANPD e os 5 que só o Cofen cobra', caps: 9, mais: ['cofen-dc-01', 'cofen-dc-02', 'cofen-dc-03', 'cofen-dc-04', 'cofen-dc-05'] },
  { m: 'anpd-lgpd', titulo: 'LGPD para quem nunca viu', curto: 'LGPD', sub: 'A Lei 13.709/2018 em 19 capítulos, um por assunto do edital', caps: 19 },
// nos testes (só em localhost), ?apostilas=anpd-lgpd deixa no app só as apostilas pedidas: os testes do motor usam uma só
].filter(a => { try { const m = /[?&]apostilas=([\w,-]+)/.exec(location.search); return !m || !/^(localhost|127\.0\.0\.1)$/.test(location.hostname) || m[1].split(',').includes(a.m); } catch { return true; } })
.map(a => { const ids = [...Array.from({ length: a.caps }, (_, i) => `${a.m}-${String(i + 1).padStart(2, '0')}`), ...(a.mais || [])]; return { ...a, ids, caps: ids.length }; });
const AP = new Map(APOSTILAS.map(a => [a.m, a]));
const AP_TXT = {};           // apostilas já buscadas nesta visita
const TEC = 'https://www.tecconcursos.com.br/';
let apId = null, capId = null, capFim = null, capRolar = false;
// a apostila que cobre um assunto (ou null)
const apostilaDoAssunto = tId => { const t = topico(tId), a = t && AP.get(t.m); return a && a.ids.includes(tId) ? a : null; };
const apPronta = m => !!(AP_TXT[m] && AP_TXT[m].caps);
const capituloDe = tId => { const a = apostilaDoAssunto(tId); return a && apPronta(a.m) ? AP_TXT[a.m].caps.find(c => c.t === tId) || null : null; };
// o título do capítulo; antes de a apostila chegar, vale o nome do assunto no edital
const capTitulo = tId => { const c = capituloDe(tId), t = topico(tId); return c ? c.titulo : t ? t.nome : ''; };
const AP_BUSCA = {};
function apCarregar(m) {
  if (apPronta(m)) return Promise.resolve(AP_TXT[m]);
  if (!AP_BUSCA[m]) AP_BUSCA[m] = fetch(`apostilas/${m}.md?v=${VERSAO}`).then(r => r.ok ? r.text() : Promise.reject()).then(t => { AP_TXT[m] = apLer(t); delete AP_BUSCA[m]; if (typeof cartoesSincronizar === 'function') cartoesSincronizar(m); return AP_TXT[m]; })
    .catch(() => { AP_TXT[m] = { erro: 1 }; delete AP_BUSCA[m]; return AP_TXT[m]; });
  return AP_BUSCA[m];
}

function apLer(txt) {
  const A = { titulo: '', base: '', caps: [] }; let cap = null, sec = -1;
  const por = (tipo, ...v) => { if (cap) cap.b.push([tipo, ...v]); };
  for (const cru of String(txt).split(/\r?\n/)) {
    const l = cru.trim(); if (!l) continue; let m;
    if ((m = /^##\s+(\S+)\s*\|\s*(.+)$/.exec(l))) { cap = { t: m[1], titulo: m[2], b: [], cartoes: [] }; sec = -1; A.caps.push(cap); }
    else if (/^###\s+/.test(l)) { por('h', l.replace(/^###\s+/, '')); if (cap) sec = cap.b.length - 1; }
    else if (/^#\s+/.test(l)) A.titulo = l.replace(/^#\s+/, '');
    else if ((m = /^@\s*base:\s*(.+)$/.exec(l))) A.base = m[1];
    else if ((m = /^\?\s*([a-z0-9]+)\s*\|\s*(.+?)\s*::\s*(.+)$/.exec(l))) { if (cap) cap.cartoes.push({ id: `${cap.t}#${m[1]}`, t: cap.t, f: m[2], v: m[3], sec }); }
    else if (/^-\s+/.test(l)) por('li', l.replace(/^-\s+/, ''));
    else if (/^=\s+/.test(l)) por('res', l.replace(/^=\s+/, ''));
    else if (/^>\s+/.test(l)) por('lei', l.replace(/^>\s+/, ''));
    else if ((m = /^ex:\s*(.+)$/.exec(l))) por('ex', m[1]);
    else if ((m = /^banca:\s*(.+)$/.exec(l))) por('banca', m[1]);
    else if ((m = /^([CE]):\s*(.+?)\s*::\s*(.+)$/.exec(l))) por('item', m[1], m[2], m[3]);
    else if ((m = /^x:\s*(.+?)\s*::\s*(.+)$/.exec(l))) por('fix', m[1], m[2]);
    else por('p', l);
  }
  return A;
}
const apFmt = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
// cada bloco leva data-b (a posição dele no capítulo): é por ela que o app guarda onde a leitura parou
function apBlocos(B, { de = 0, ate = B.length, marca = true } = {}) {
  let h = '';
  for (let i = de; i < ate; i++) {
    const [tipo, a, b, c] = B[i], d = marca ? ` data-b="${i}"` : '';
    if (tipo === 'li' || tipo === 'res') { const L = []; while (i < ate && B[i][0] === tipo) L.push(B[i++][1]); i--;
      h += tipo === 'li' ? `<ul class="ap-lista"${d}>${L.map(x => `<li>${apFmt(x)}</li>`).join('')}</ul>` : `<div class="ap-resumo"${d}><span class="rotulo-mini">Para a prova</span><ul class="ap-lista">${L.map(x => `<li>${apFmt(x)}</li>`).join('')}</ul></div>`; }
    else if (tipo === 'fix') { const L = []; while (i < ate && B[i][0] === 'fix') { L.push(B[i]); i++; } i--;
      h += `<section class="ap-fix"${d} aria-label="Exercícios de fixação"><h2 class="ap-h">Exercícios de fixação</h2><p class="ap-fix-sub">Responda de cabeça e só então abra a resposta. Não valem ponto: servem para você testar o que acabou de ler.</p><ol class="ap-fix-l">${L.map(x => `<li><p>${apFmt(x[1])}</p><details><summary>Ver resposta</summary><p>${apFmt(x[2])}</p></details></li>`).join('')}</ol></section>`; }
    else if (tipo === 'h') h += `<h2 class="ap-h"${d}>${apFmt(a)}</h2>`;
    else if (tipo === 'lei') h += `<blockquote class="ap-lei"${d}><span class="rotulo-mini">Na lei</span><p>${apFmt(a)}</p></blockquote>`;
    else if (tipo === 'ex') h += `<div class="ap-ex"${d}><span class="rotulo-mini">Exemplo</span><p>${apFmt(a)}</p></div>`;
    else if (tipo === 'banca') h += `<div class="ap-banca"${d}><span class="rotulo-mini">${/Instituto Quadrix/.test(a) ? 'Como a banca cobra' : 'Como o Cebraspe cobra'}</span><p>${apFmt(a)}</p></div>`;
    else if (tipo === 'item') h += `<div class="ap-item ${a === 'C' ? 'ap-c' : 'ap-e'}"${d}><span class="etiqueta${a === 'C' ? ' ok' : ''}">${a === 'C' ? I.check + 'Modelo de item certo' : I.x + 'Modelo de item errado'}</span><p class="ap-af">${apFmt(b)}</p><p class="ap-pq"><b>Por quê:</b> ${apFmt(c)}</p></div>`;
    else h += `<p${d}>${apFmt(a)}</p>`;
  }
  return h;
}
/* o trecho que responde a um cartão: do subtítulo em que o cartão está até o subtítulo seguinte, sem os modelos de item,
   a caixa da banca e o resumo (que são do capítulo inteiro) */
function apTrecho(cap, sec) {
  if (!cap) return { titulo: '', html: '' };
  const ini = sec >= 0 ? sec + 1 : 0; let fim = cap.b.findIndex((b, i) => i >= ini && b[0] === 'h'); if (fim < 0) fim = cap.b.length;
  const B = cap.b.slice(ini, fim).filter(b => !['banca', 'item', 'res', 'fix'].includes(b[0]));
  return { titulo: sec >= 0 ? cap.b[sec][1] : cap.titulo, html: apBlocos(B, { marca: false }) };
}

/* ---------- onde a leitura parou (só neste aparelho) ---------- */
const lendo = () => { const o = LS.get('lendo', null); return o && typeof o === 'object' && o.pos && typeof o.pos === 'object' ? o : { t: '', pos: {} }; };
function posGuardar(tId, b) { const o = lendo(), t = topico(tId); o.pos[tId] = b; if (t && (!t.teoria || t.volta || t.reler)) o.t = tId; LS.set('lendo', o); }
function posLimpar(tId) { const o = lendo(); delete o.pos[tId]; if (o.t === tId) o.t = ''; LS.set('lendo', o); }
let posTic = 0;
addEventListener('scroll', () => {
  if (posTic || tab !== 'capitulo') return;
  posTic = setTimeout(() => { posTic = 0; if (tab !== 'capitulo' || capRolar || (capFim && capFim.t === capId)) return;
    const topo = ($('#barra')?.offsetHeight || 60) + 8, el = $$('#view .ap-folha [data-b]').find(e => e.getBoundingClientRect().bottom > topo);
    if (el) posGuardar(capId, scrollY < 40 ? 0 : +el.dataset.b); }, 400);
}, { passive: true });

function capituloAbrir(tId) { const a = apostilaDoAssunto(tId); if (!a) return; apId = a.m; capId = tId; capFim = null; capRolar = true; irPara('capitulo', { topo: false }); }
// a leitura sugerida (o botão de Hoje e o botão do centro da barra)
function lerSugestao() { const s = sugestao(); if (!s) { irPara('apostilas'); return; } if (s.tipo === 'lei') doseAbrir(s.t); else capituloAbrir(s.t); }
// a próxima apostila a ser escrita: a primeira disciplina da fila de leitura que ainda não tem apostila
function proximaApostila() {
  const ativos = new Set(concursosAtivos().flatMap(c => c.disc.filter(d => !d.fora).map(d => d.m)));
  return DB.materias.filter(m => !AP.has(m.id) && ativos.has(m.id) && topicosDe(m.id).length).map(m => [ordemDoAssunto(topicosDe(m.id)[0]), m]).sort((a, b) => a[0] - b[0]).map(x => x[1])[0] || null;
}
/* ---------- conforto de leitura: o tamanho da letra (só neste aparelho) e a barrinha de progresso ---------- */
const LETRAS = [['m', 'Normal'], ['g', 'Grande'], ['x', 'Maior']];
const letra = () => { const v = LS.get('letra', 'm'); return LETRAS.some(l => l[0] === v) ? v : 'm'; };
const letraHTML = () => `<div class="ap-letra"><span class="rotulo-mini" id="ap-letra-r">Tamanho da letra</span>${segHTML('ap-letra', LETRAS, letra(), 'Tamanho da letra')}</div>`;
const ligarLetra = v => ligarSeg($('#ap-letra', v), x => { LS.set('letra', x); $$('.ap-folha, .lei-folha', v).forEach(f => { f.dataset.letra = x; }); });
const progHTML = () => `<div class="ap-prog" id="ap-prog" role="progressbar" aria-label="Quanto você já leu desta tela" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div>`;
function progAtualizar() {
  const el = $('#ap-prog'), f = el && $('#view .ap-folha, #view .lei-folha'); if (!f) return;
  const r = f.getBoundingClientRect(), topo = ($('#barra')?.offsetHeight || 60), total = Math.max(1, r.height - (innerHeight - topo) * 0.6);
  const pct = Math.max(0, Math.min(100, Math.round((topo - r.top) / total * 100)));
  el.firstElementChild.style.transform = `scaleX(${pct / 100})`; el.setAttribute('aria-valuenow', pct);
}
addEventListener('scroll', () => { if (tab === 'capitulo' || tab === 'dose') requestAnimationFrame(progAtualizar); }, { passive: true });
const proximoCapitulo = fora => { const p = fila().find(x => x.tipo !== 'lei' && x.t !== fora && !x.antigo); return p ? p.t : ''; };

/* ---------- a lista de apostilas ---------- */
const viewApostilas = {
  html() {
    const com = new Set(APOSTILAS.map(a => a.m)), ativos = new Set(concursosAtivos().flatMap(c => c.disc.filter(d => !d.fora).map(d => d.m)));
    // a fila de escrita segue a fila de leitura: o primeiro assunto de cada disciplina diz a vez dela
    const semAp = DB.materias.filter(m => !com.has(m.id) && ativos.has(m.id) && topicosDe(m.id).length).map(m => [ordemDoAssunto(topicosDe(m.id)[0]), m]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
    return `${cab('Apostilas', 'Teoria para quem nunca viu o assunto, escrita do jeito que a banca cobra.')}
      <ul class="card lista">${APOSTILAS.filter(a => materia(a.m)).map(a => { const T = a.ids.map(topico).filter(Boolean), n = T.filter(t => t.teoria).length;
        return `<li><button type="button" class="lin" data-act="abrir-apostila" data-id="${esc(a.m)}"><span class="lin-ic">${I.livro}</span><span class="lin-tx"><b>${esc(a.titulo)}</b><small>${esc(a.sub)}</small><small>${n} de ${plural(T.length, 'capítulo concluído', 'capítulos concluídos')}</small></span>${I.seta}</button></li>`; }).join('')}</ul>
      ${semAp.length ? `<section aria-labelledby="ap-fila"><div class="sec-cab"><h2 class="sub-t" id="ap-fila">Ainda sem apostila</h2><span class="apoio">${semAp.length}</span></div>
        <ul class="card lista-simples ap-fila">${semAp.map(m => `<li>${esc(m.nome)}</li>`).join('')}</ul>
        <p class="apoio">Chegam uma disciplina por vez, nesta ordem: primeiro o que serve aos dois concursos.</p></section>` : ''}`;
  },
};

/* ---------- a apostila: os capítulos ---------- */
const estadoCap = t => t.volta ? 'Voltou para a fila' : t.reler ? 'Para reler' : t.teoria ? 'Concluído' : lendo().pos[t.id] > 0 ? 'Em leitura' : 'Não lido';
const viewApostila = {
  html() {
    const a = AP.get(apId), tx = AP_TXT[apId];
    if (!tx) apCarregar(a.m).then(() => { if (tab === 'apostila' && apId === a.m) render(); });
    const volta = `<button type="button" class="volta" data-kf-ir="apostilas">${I.volta}<span>Apostilas</span></button>`;
    if (!tx) return `${volta}${cab(a.titulo, esc(a.sub))}<p class="apoio" role="status">Abrindo a apostila…</p>`;
    if (tx.erro) { delete AP_TXT[a.m]; return `${volta}${cab(a.titulo, esc(a.sub))}${KitFacil.ui.vazio({ titulo: 'Não deu para abrir a apostila', texto: 'Confira a internet e tente de novo.' })}`; }
    const caps = tx.caps.filter(c => topico(c.t));
    return `${volta}${cab(a.titulo, esc(a.sub))}
      <ol class="card lista ap-caps">${caps.map((c, i) => { const t = topico(c.t), feito = t.teoria && !t.volta;
        return `<li><button type="button" class="lin${feito ? ' feito' : ''}" data-act="abrir-cap" data-id="${esc(c.t)}"><span class="lin-ic cap-n" aria-hidden="true">${feito ? I.check : i + 1}</span><span class="lin-tx"><b>${feito ? `<span class="grifo">${esc(c.titulo)}</span>` : esc(c.titulo)}</b><small>Capítulo ${i + 1} · ${estadoCap(t)}</small></span>${I.seta}</button></li>`; }).join('')}</ol>
      <p class="apoio">Texto do instrutor (Claude). ${esc(tx.base)} A apostila explica; na dúvida, vale o texto da lei, em Mais → Leis.</p>`;
  },
};

/* ---------- a leitura de um capítulo ----------
   Não há relógio: o que conta é chegar ao fim e dizer "Entendi" ou "Quero reler depois". */
const viewCapitulo = {
  html() {
    const a = AP.get(apId), tx = AP_TXT[apId], t = topico(capId);
    if (!tx) apCarregar(a.m).then(() => { if (tab === 'capitulo' && apId === a.m) render(); });
    const volta = `<button type="button" class="volta" data-act="abrir-apostila" data-id="${esc(a.m)}">${I.volta}<span>Capítulos</span></button>`;
    if (!tx) return `${volta}${cab(t.nome, esc(a.curto))}<p class="apoio" role="status">Abrindo o capítulo…</p>`;
    const caps = tx.erro ? [] : tx.caps.filter(c => topico(c.t)), i = caps.findIndex(c => c.t === capId), c = caps[i];
    if (!c) { if (tx.erro) delete AP_TXT[a.m]; return `${volta}${cab(t.nome, esc(a.curto))}${KitFacil.ui.vazio({ titulo: 'Não deu para abrir o capítulo', texto: 'Confira a internet e tente de novo.' })}`; }
    const fim = capFim && capFim.t === capId ? capFim : null;
    return `${volta}${cab(c.titulo, `Capítulo ${i + 1} de ${caps.length} · ${esc(a.curto)}`)}
      ${t.volta ? KitFacil.ui.faixa({ tipo: 'info', html: 'Este capítulo voltou para a fila: mais da metade dos cartões dele não foi lembrada.' }) : ''}
      ${letraHTML()}${progHTML()}
      <article class="folha ap-folha" lang="pt-BR" data-letra="${letra()}">${apBlocos(c.b)}</article>
      <section class="card ap-fim" id="ap-fim" aria-labelledby="ap-fim-t">${fim ? capFimHTML(fim) : `
        <h2 class="sec-t" id="ap-fim-t">Chegou ao fim do capítulo</h2>
        <p class="apoio">${t.teoria ? `Concluído em ${fmtData(iso(new Date(t.teoria)))}. Releu? Marque de novo.` : 'Entendi conclui o capítulo e ativa os cartões dele. Quero reler depois deixa o capítulo na fila. Os dois fazem o dia valer.'}</p>
        <div class="ap-fim-botoes"><button type="button" class="kf-btn kf-sec" data-act="cap-reler" id="cap-reler">Quero reler depois</button><button type="button" class="kf-btn kf-pri" data-act="cap-entendi" id="cap-entendi">${I.check}Entendi</button></div>`}</section>
      <p class="apoio">Texto do instrutor (Claude). Os modelos de item são do instrutor, não são questões de prova. Na dúvida, vale o texto da lei.</p>`;
  },
  // ao abrir, a tela vai ao ponto em que a leitura parou (ou ao começo)
  ligar(v) {
    ligarLetra(v); requestAnimationFrame(progAtualizar);
    if (!capRolar || !apPronta(apId)) return;
    const b = capFim ? 0 : Math.max(0, +lendo().pos[capId] | 0);
    requestAnimationFrame(() => { const el = b > 0 && $(`.ap-folha [data-b="${b}"]`, v); if (el) el.scrollIntoView({ block: 'start', behavior: 'auto' }); else window.scrollTo({ top: 0 }); setTimeout(() => { capRolar = false; }, 500); });
  },
};
// o que vem depois do capítulo: a lei seca dele, o próximo capítulo e o atalho que só abre o Tec
function capFimHTML(f) {
  const t = topico(f.t), dose = doseDe(f.t), px = proximoCapitulo(f.t);
  const lin = (attrs, ic, titulo, sub, tag = 'button') => `<li><${tag} class="lin" ${tag === 'button' ? 'type="button"' : ''} ${attrs}><span class="lin-ic">${ic}</span><span class="lin-tx"><b>${titulo}</b><small>${sub}</small></span>${tag === 'a' ? I.fora : I.seta}</${tag}></li>`;
  const soReler = f.reler && !t.teoria;
  return `<h2 class="sec-t" id="ap-fim-t" tabindex="-1"><span class="grifo">${soReler ? 'Guardado para reler' : 'Capítulo concluído'}</span></h2>
    <p>${soReler ? 'Ele continua na sua fila de leitura e ainda não conta na cobertura do edital. Os cartões nascem quando você tocar em Entendi. ' : f.reler ? 'Ele fica guardado para você reler depois. ' : ''}${soReler ? '' : f.novos ? `${plural(f.novos, 'cartão deste capítulo volta', 'cartões deste capítulo voltam')} a partir de amanhã, em Relembrar.` : cartoesDe(f.t).length ? 'Os cartões deste capítulo seguem em Relembrar.' : ''}</p>
    <ul class="lista ap-depois">
      ${dose && !t.lei ? lin(`data-act="abrir-dose" data-id="${esc(f.t)}"`, I.lei, 'Ler a lei seca deste capítulo', esc(doseRotulo(dose))) : ''}
      ${px ? lin(`data-act="abrir-cap" data-id="${esc(px)}"`, I.livro, 'Próximo capítulo', esc(capTitulo(px))) : ''}
      ${lin(`href="${TEC}" target="_blank" rel="noopener noreferrer"`, I.questoes, 'Abrir o Tec Concursos', 'Para resolver questões deste assunto<span class="kf-so-leitor"> (abre em outra aba)</span>', 'a')}
    </ul>`;
}
function capConcluir(reler) {
  const t = topico(capId); if (!t || !capituloDe(capId)) return;
  const id = capId, foto = fotoAssunto(id), lendoAntes = lendo(), antes = jogoEstado();
  const r = concluirCapitulo(id, { reler });
  capFim = { t: id, reler, ...r };
  render();
  requestAnimationFrame(() => { const h = $('#ap-fim-t'); if (h) { h.scrollIntoView({ block: 'center', behavior: semMovimento() ? 'auto' : 'smooth' }); try { h.focus({ preventScroll: true }); } catch {} } });
  const aviso = () => avisar(reler ? 'Guardado para reler depois.' : 'Capítulo concluído.', { label: 'Desfazer', run: () => { voltarAssunto(id, foto); LS.set('lendo', lendoAntes); if (capFim && capFim.t === id) capFim = null; render(); } });
  if (r.valeu && festa(antes, { rotulo: capTitulo(id), linhas: [['Capítulo', reler && !t.teoria ? 'lido, para reler' : 'concluído'], ...(r.novos ? [['Cartões novos', String(r.novos)]] : [])], aoFechar: () => { aviso(); setTimeout(medalhaFilaMostrar, 600); } })) return;
  aviso(); setTimeout(() => jogoConferir(), 700);
}

/* ---------- lei seca na fila: depois do capítulo, só os artigos daquele assunto ----------
   O texto é o mesmo de Mais → Leis (leis/<id>.json), sem alteração: a dose só recorta do primeiro ao último artigo. */
let doseId = null;
function doseAbrir(tId) { if (!doseDe(tId)) return; doseId = tId; irPara('dose'); }
const viewDose = {
  html() {
    const d = doseDe(doseId), L = LEI.get(d.lei), tx = LEI_TXT[d.lei], t = topico(doseId);
    if (!tx) leiCarregar(d.lei).then(() => { if (tab === 'dose' && doseId === t.id) render(); });
    const volta = apostilaDoAssunto(doseId) ? `<button type="button" class="volta" data-act="abrir-cap" data-id="${esc(doseId)}">${I.volta}<span>Capítulo</span></button>` : voltaMais();
    const topo = `${volta}${cab('Lei seca', `${esc(L.nome)} · ${esc(doseRotulo(d).replace(/^.* · /, ''))}`)}`;
    if (!tx) return `${topo}<p class="apoio" role="status">Abrindo o texto…</p>`;
    const P = tx.erro ? [] : doseParagrafos(tx.p, d);
    if (!P.length) { if (tx.erro) delete LEI_TXT[d.lei]; return `${topo}${KitFacil.ui.vazio({ titulo: 'Não deu para abrir a lei', texto: 'Confira a internet e tente de novo.' })}`; }
    const semRev = LS.get('leiSemRev', 0), px = t.lei ? sugestao() : null;
    return `${topo}
      <p class="apoio">Só os artigos do capítulo <b>${esc(capTitulo(doseId))}</b>. É o texto do Planalto, sem alteração: as redações antigas aparecem como lá.</p>
      ${letraHTML()}${progHTML()}
      <article class="folha lei-folha${semRev ? ' sem-rev' : ''}" lang="pt-BR" data-letra="${letra()}">${P.map(([p, i]) => leiParagrafo(p, i)).join('')}</article>
      <section class="card ap-fim" aria-label="Fim da leitura">
        ${KitFacil.ui.fato({ marcado: !!t.lei, marcar: 'Marcar lei como lida', desmarcar: 'Desmarcar lei lida', attrs: `data-act="dose-lida" id="dose-lida"` })}
        ${px && px.t !== doseId ? `<button type="button" class="kf-btn kf-comecar bloco" data-act="estudar-proximo">${I.play}${px.tipo === 'lei' ? 'Próxima lei seca' : 'Próxima leitura'}</button>` : ''}
        <button type="button" class="kf-btn kf-link" data-act="dose-inteira">Abrir a lei inteira</button></section>
      <p class="apoio">Texto compilado do Planalto, copiado em ${esc(tx.lido.split('-').reverse().join('/'))}, sem alteração. <a href="${esc(tx.fonte)}" target="_blank" rel="noopener noreferrer">Conferir no site oficial<span class="kf-so-leitor"> (abre em outra aba)</span></a></p>`;
  },  ligar(v) { ligarLetra(v); requestAnimationFrame(progAtualizar); },
};

const ACOES_AP = {
  'abrir-apostila': b => { if (AP.has(b.dataset.id)) { apId = b.dataset.id; irPara('apostila'); } },
  'abrir-cap': b => capituloAbrir(b.dataset.id),
  'cap-entendi': () => capConcluir(false),
  'cap-reler': () => capConcluir(true),
  'abrir-dose': b => doseAbrir(b.dataset.id),
  'dose-inteira': () => { const d = doseDe(doseId); if (d) leiAbrirEm(d.lei, d.de); },
  'dose-lida': () => {
    const t = topico(doseId); if (!t) return; const era = t.lei, h = hojeISO(), dia = JSON.stringify(idx().diaReg.get(h) || null);
    if (era) { t.lei = 0; salvar(); } else lerDose(t.id);
    avisar(era ? 'Lei desmarcada.' : 'Lei seca lida.', { label: 'Desfazer', run: () => { t.lei = era; DB.dias = DB.dias.filter(x => x.id !== h); const d = JSON.parse(dia); if (d) DB.dias.push(d); salvar(); } });
    if (!era) setTimeout(() => jogoConferir(), 700);
  },
};
