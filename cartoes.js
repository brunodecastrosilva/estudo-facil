/* Estudo Fácil · Relembrar: os cartões de conceito de cada capítulo.
   O cartão é escrito junto com o capítulo, na apostila (linha "? letra | pergunta :: resposta"), e nasce quando o
   capítulo é concluído. Frente pergunta, verso responde: "Lembrei" ou "Não lembrei". Não são questões de banca: essas
   ficam no Tec Concursos. O motor (caixas, datas e a volta do capítulo à fila) fica em app.js; aqui ficam a ligação com
   a apostila e a tela. */
"use strict";

// o texto de um cartão: undefined enquanto a apostila não chegou; null quando o cartão saiu da apostila
function cartaoDef(id) {
  const t = String(id).split('#')[0], a = apostilaDoAssunto(t); if (!a) return null;
  if (!apPronta(a.m)) return undefined;
  const cap = capituloDe(t); return (cap && cap.cartoes.find(c => c.id === id)) || null;
}
// ativa os cartões de um capítulo concluído que ainda não estão no baralho; eles voltam a partir do dia seguinte
function cartoesAtivar(tId) {
  const cap = capituloDe(tId); if (!cap) return 0;
  const am = maisDias(hojeISO(), 1); let n = 0;
  for (const d of cap.cartoes) if (!idx().cart.has(d.id)) { DB.cartoes.push({ id: d.id, t: tId, cx: 0, due: am, ok: 0, no: 0, ult: '' }); VER++; n++; }
  return n;
}
/* quando uma apostila chega: os capítulos concluídos sem cartão no baralho (marcados à mão, vindos de outro aparelho ou
   com cartão novo na apostila) recebem os seus, e o cartão que saiu da apostila sai do baralho */
function cartoesSincronizar(m) {
  const tx = AP_TXT[m]; if (!tx || !tx.caps) return;
  let mudou = false;
  for (const cap of tx.caps) {
    const t = topico(cap.t); if (!t) continue;
    if (t.teoria && cartoesAtivar(cap.t)) mudou = true;
    const ids = new Set(cap.cartoes.map(c => c.id)), n = DB.cartoes.length;
    DB.cartoes = DB.cartoes.filter(c => c.t !== cap.t || ids.has(c.id));
    if (DB.cartoes.length !== n) { VER++; mudou = true; }
  }
  if (mudou) salvar();
}

/* ---------- a rodada ---------- */
let REL = null; // { lista: [ids], i, fase: 'frente' | 'verso' | 'trecho' | 'fim', ok, no, antes, voltou }
function relIniciar() {
  const L = cartoesDeHoje().slice(0, RODADA).map(c => c.id);
  REL = L.length ? { lista: L, i: 0, fase: 'frente', ok: 0, no: 0, antes: jogoEstado(), voltou: false } : null;
}
// ao sair da tela, a rodada terminada some; a que ficou no meio continua de onde parou
function relSair() { if (REL && REL.fase === 'fim') REL = null; }
function relSeguir() {
  REL.i++; REL.voltou = false;
  if (REL.i < REL.lista.length) { REL.fase = 'frente'; salvar(); return; }
  REL.fase = 'fim';
  const valeu = diaValer(), antes = REL.antes, ok = REL.ok, n = REL.lista.length;
  salvar();
  if (valeu && festa(antes, { rotulo: 'Revisão feita', linhas: [['Cartões', `${ok} de ${n} lembrados`]], aoFechar: () => setTimeout(medalhaFilaMostrar, 600) })) return;
  setTimeout(() => jogoConferir(), 700);
}
const relFoco = () => requestAnimationFrame(() => { const e = $('#rel-foco'); if (e) try { e.focus({ preventScroll: true }); } catch {} });

const viewRelembrar = {
  html() {
    const due = cartoesDeHoje();
    if (!REL && due.length) relIniciar();
    if (!REL) {
      const T = totais(), px = proximoCartao();
      if (!DB.cartoes.length) return `${cab('Relembrar', 'Cartões de conceito dos capítulos que você já leu.')}${KitFacil.ui.vazio({ titulo: 'Os cartões nascem dos capítulos', texto: 'Conclua um capítulo: os cartões dele aparecem aqui a partir do dia seguinte.', acao: `<button type="button" class="kf-btn kf-comecar" data-act="estudar-proximo">${I.play}Ler agora</button>` })}`;
      return `${cab('Relembrar', 'Cartões de conceito dos capítulos que você já leu.')}
        ${KitFacil.ui.vazio({ titulo: 'Nenhum cartão para hoje', texto: px ? `Os próximos voltam ${px === maisDias(hojeISO(), 1) ? 'amanhã' : 'em ' + fmtData(px)}.` : '' })}
        <section class="card" aria-label="Seu baralho"><dl class="resumo"><div><dt>Cartões no baralho</dt><dd>${DB.cartoes.length}</dd></div><div><dt>Vezes em que você lembrou</dt><dd>${nBR(T.lembrados)}</dd></div></dl></section>`;
    }
    const n = REL.lista.length;
    if (REL.fase === 'fim') {
      const resto = due.length;
      return `${cab('Relembrar', 'Revisão feita.')}
        <section class="folha rel-fim" aria-labelledby="rel-foco"><p class="rel-n" id="rel-foco" tabindex="-1"><span class="grifo">${REL.ok}</span> de ${plural(n, 'cartão lembrado', 'cartões lembrados')}</p>
          <p class="apoio">${REL.no ? 'Os que você não lembrou voltam amanhã.' : 'Todos voltam mais adiante, cada vez mais espaçados.'}</p>
          ${resto ? `<button type="button" class="kf-btn kf-sec bloco" data-act="rel-comecar">Fazer mais uma rodada</button><p class="apoio">${plural(resto, 'cartão ainda espera', 'cartões ainda esperam')} por você hoje.</p>` : ''}
          <button type="button" class="kf-btn kf-comecar bloco" data-kf-ir="hoje">Voltar para Hoje</button></section>`;
    }
    // os textos vêm das apostilas: busca as que faltam e tira da rodada o cartão que saiu da apostila
    const falta = [...new Set(REL.lista.map(id => apostilaDoAssunto(id.split('#')[0])).filter(a => a && !AP_TXT[a.m]).map(a => a.m))];
    if (falta.length) { Promise.all(falta.map(apCarregar)).then(() => { if (tab === 'relembrar') render(); }); return `${cab('Relembrar', 'Cartões de conceito dos capítulos que você já leu.')}<p class="apoio" role="status">Abrindo os cartões…</p>`; }
    while (REL.i < n && !cartaoDef(REL.lista[REL.i])) { const a = apostilaDoAssunto(REL.lista[REL.i].split('#')[0]); if (a && AP_TXT[a.m] && AP_TXT[a.m].erro) { delete AP_TXT[a.m]; return `${cab('Relembrar')}${KitFacil.ui.vazio({ titulo: 'Não deu para abrir os cartões', texto: 'Confira a internet e tente de novo.' })}`; } REL.lista.splice(REL.i, 1); }
    if (REL.i >= REL.lista.length) { REL = null; return this.html(); }
    const d = cartaoDef(REL.lista[REL.i]), t = topico(d.t), m = materia(t.m), tr = REL.fase === 'trecho' ? apTrecho(capituloDe(d.t), d.sec) : null;
    return `${cab('Relembrar', `Cartão ${REL.i + 1} de ${REL.lista.length}`)}
      <section class="folha rel-cartao" aria-labelledby="rel-foco">
        <span class="rotulo-mini">${esc(m ? m.nome : '')} · ${esc(capTitulo(d.t))}</span>
        <p class="rel-f" id="rel-foco" tabindex="-1">${apFmt(d.f)}</p>
        ${REL.fase === 'frente' ? `<button type="button" class="kf-btn kf-pri bloco" data-act="rel-ver" id="rel-ver">Ver a resposta</button>` : `
        <div class="rel-v"><span class="rotulo-mini">Resposta</span><p id="rel-resp" tabindex="-1">${apFmt(d.v)}</p></div>`}
        ${REL.fase === 'verso' ? `<div class="rel-botoes"><button type="button" class="kf-btn kf-sec" data-act="rel-nao" id="rel-nao">Não lembrei</button><button type="button" class="kf-btn kf-pri" data-act="rel-sim" id="rel-sim">${I.check}Lembrei</button></div>` : ''}
      </section>
      ${tr ? `<section class="card rel-trecho" aria-labelledby="rel-tr-t"><span class="rotulo-mini">O trecho do capítulo que responde</span><h2 class="ap-h" id="rel-tr-t">${apFmt(tr.titulo)}</h2><div class="ap-folha">${tr.html}</div>
          ${REL.voltou ? KitFacil.ui.faixa({ tipo: 'info', html: 'Mais da metade dos cartões deste capítulo não foi lembrada. Ele voltou para a sua fila de leitura.' }) : ''}
          <p class="apoio">Este cartão volta amanhã.</p>
          <button type="button" class="kf-btn kf-pri bloco" data-act="rel-seguir" id="rel-seguir">Continuar</button></section>` : ''}`;
  },
};

const ACOES_REL = {
  'rel-comecar': () => { relIniciar(); render(); window.scrollTo({ top: 0 }); relFoco(); },
  'rel-ver': () => { if (!REL || REL.fase !== 'frente') return; REL.fase = 'verso'; render(); requestAnimationFrame(() => { const e = $('#rel-resp'); if (e) try { e.focus({ preventScroll: true }); } catch {} }); },
  'rel-sim': () => { if (!REL || REL.fase !== 'verso') return; responderCartao(REL.lista[REL.i], true); REL.ok++; relSeguir(); window.scrollTo({ top: 0 }); relFoco(); },
  // não lembrou: o app abre na hora só o trecho do capítulo que responde
  'rel-nao': () => { if (!REL || REL.fase !== 'verso') return; const r = responderCartao(REL.lista[REL.i], false); REL.no++; REL.voltou = !!(r && r.voltou); REL.fase = 'trecho'; salvar();
    requestAnimationFrame(() => requestAnimationFrame(() => { const e = $('#rel-tr-t'); if (e) e.scrollIntoView({ block: 'start', behavior: semMovimento() ? 'auto' : 'smooth' }); })); },
  'rel-seguir': () => { if (!REL || REL.fase !== 'trecho') return; relSeguir(); window.scrollTo({ top: 0 }); relFoco(); },
};
