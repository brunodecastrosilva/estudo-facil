/* Estudo Fácil · a sessão de estudo: escolher o que estudar, o modo foco (tela cheia, com cronômetro), fechar a sessão,
   lançar um estudo já feito e a ficha de cada assunto. */
"use strict";

/* ---------- escolher o que estudar ---------- */
const nomeItem = it => { const t = it.t && topico(it.t), m = materia(it.m); return { t: t ? t.nome : 'Estudo livre', m: m ? m.nome : '' }; };
const opcoesMaterias = sel => DB.materias.filter(m => topicosDe(m.id).length).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')).map(m => `<option value="${esc(m.id)}" ${m.id === sel ? 'selected' : ''}>${esc(m.nome)}</option>`).join('');
const opcoesTopicos = (mId, sel) => topicosDe(mId).map(t => `<option value="${esc(t.id)}" ${t.id === sel ? 'selected' : ''}>${esc(t.nome)}${t.teoria ? ' ✓' : ''}</option>`).join('');
const segHTML = (id, ops, atual, rotulo) => `<div class="kf-seg" id="${id}" role="group" aria-label="${esc(rotulo)}">${ops.map(([v, n]) => `<button type="button" data-v="${esc(String(v))}" aria-pressed="${String(v) === String(atual)}">${esc(n)}</button>`).join('')}</div>`;
const ligarSeg = (el, fn) => el && el.addEventListener('click', e => { const b = e.target.closest('button[data-v]'); if (!b) return; $$('button', el).forEach(x => x.setAttribute('aria-pressed', x === b)); fn && fn(b.dataset.v); });
const valorSeg = el => (el && $('button[aria-pressed="true"]', el) || {}).dataset?.v;

function abrirEstudar(pre = null) {
  if (DB.ativa) return focoAbrir();
  if (!DB.materias.some(m => topicosDe(m.id).length)) { avisar('Cadastre um concurso ou uma disciplina para começar.'); irPara('concursos'); return; }
  const plano = planoDoDia(), sug = pre || plano.proximo || sugestaoExtra();
  let m = sug ? sug.m : DB.materias[0].id, t = sug ? sug.t : (topicosDe(m)[0] || {}).id, tipo = sug ? sug.tipo : 'teoria', alvo = sug ? sug.min : cfg().bloco, rev = sug && sug.rev || null;
  const n = sug && nomeItem(sug);
  abrirJanela({ titulo: 'Estudar', sub: pre ? 'Confira e comece.' : 'Siga o plano de hoje ou escolha outro assunto.', alto: true,
    corpo: `${sug && !pre ? `<div class="sugestao"><span class="rotulo-mini">${plano.proximo ? 'Próximo do plano' : 'Sugestão'}</span><b>${esc(n.t)}</b><small>${esc(n.m)} · ${TIPOS[sug.tipo]} · ${sug.min} min</small></div>` : ''}
      <div class="kf-campo"><label class="kf-rotulo" for="es-m">Disciplina</label><select id="es-m" class="kf-entrada">${opcoesMaterias(m)}</select></div>
      <div class="kf-campo"><label class="kf-rotulo" for="es-t">Assunto</label><select id="es-t" class="kf-entrada">${opcoesTopicos(m, t)}</select></div>
      <div class="kf-campo"><span class="kf-rotulo" id="es-tipo-r">O que você vai fazer</span>${segHTML('es-tipo', Object.entries(TIPOS), tipo, 'O que você vai fazer')}</div>
      <div class="kf-campo"><span class="kf-rotulo">Tempo, em minutos</span>${segHTML('es-alvo', [[15, '15'], [25, '25'], [30, '30'], [50, '50'], [0, 'Livre']], [15, 25, 30, 50].includes(alvo) ? alvo : (alvo ? 30 : 0), 'Tempo da sessão')}</div>`,
    pe: `<button type="button" class="kf-btn kf-sec" id="es-lancar">Lançar estudo</button><button type="button" class="kf-btn kf-comecar" id="es-ok">${I.play}Começar</button>`,
    aoMontar: d => {
      const sm = $('#es-m', d), st = $('#es-t', d);
      sm.addEventListener('change', () => { m = sm.value; rev = null; const px = proximoAssunto(m, topicosAtivos(m) || undefined); st.innerHTML = opcoesTopicos(m, px && px.t.id); t = st.value; });
      st.addEventListener('change', () => { t = st.value; rev = null; });
      ligarSeg($('#es-tipo', d), v => { tipo = v; });
      ligarSeg($('#es-alvo', d), v => { alvo = +v; });
      $('#es-ok', d).onclick = () => { t = st.value; fecharJanela(true); iniciarSessao({ t, tipo, alvo, rev: tipo === 'revisao' ? rev : null }); focoAbrir(); render(); };
      $('#es-lancar', d).onclick = () => { fecharJanela(true); lancarEstudo({ m: sm.value, t: st.value, tipo }); };
    } });
}

/* ---------- modo foco: o cronômetro em tela cheia ---------- */
let focoEl = null, focoTic = 0, travaTela = null;
const focoAberto = () => !!focoEl;
async function pedirTela() { try { if (navigator.wakeLock && DB.ativa && document.visibilityState === 'visible') travaTela = await navigator.wakeLock.request('screen'); } catch {} }
function soltarTela() { try { travaTela && travaTela.release(); } catch {} travaTela = null; }
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && focoEl) { pedirTela(); focoPintar(); } });
function tocarFim() {
  if (cfg().som !== false) try {
    const C = window.AudioContext || window.webkitAudioContext, a = new C(), t = a.currentTime;
    [[660, 0], [880, .18], [1100, .36]].forEach(([f, q]) => { const o = a.createOscillator(), g = a.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t + q); g.gain.exponentialRampToValueAtTime(0.25, t + q + .02); g.gain.exponentialRampToValueAtTime(0.0001, t + q + .32); o.connect(g).connect(a.destination); o.start(t + q); o.stop(t + q + .34); });
    setTimeout(() => a.close(), 1200);
  } catch {}
  vibrar([120, 80, 120]);
}
function focoAbrir() {
  const a = DB.ativa; if (!a) return;
  if (focoEl) { focoPintar(); return; }
  const n = nomeItem(a), C = 2 * Math.PI * 104;
  focoEl = document.createElement('div'); focoEl.className = 'foco'; focoEl.id = 'foco'; focoEl.setAttribute('data-kf-tela-cheia', ''); focoEl.setAttribute('role', 'dialog'); focoEl.setAttribute('aria-modal', 'true'); focoEl.setAttribute('aria-labelledby', 'foco-t');
  focoEl.innerHTML = `<div class="foco-in">
      <div class="foco-topo"><button type="button" class="foco-btn-ic" id="foco-min" aria-label="Voltar ao app sem parar o tempo">${I.desce}</button><span class="foco-tipo">${TIPOS[a.tipo] || 'Estudo'}${n.m ? ' · ' + esc(n.m) : ''}</span></div>
      <h2 class="foco-t" id="foco-t" tabindex="-1">${esc(n.t)}</h2>
      <div class="foco-relogio"><svg viewBox="0 0 240 240" aria-hidden="true"><circle class="foco-trilho" cx="120" cy="120" r="104"/><circle class="foco-arco" id="foco-arco" cx="120" cy="120" r="104" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${C.toFixed(1)}" transform="rotate(-90 120 120)"/></svg>
        <div class="foco-centro"><span class="foco-tempo" id="foco-tempo" role="timer" aria-live="off">00:00</span><span class="foco-alvo" id="foco-alvo"></span></div></div>
      <div class="foco-q" role="group" aria-label="Questões resolvidas nesta sessão">
        <div class="foco-cont"><span id="foco-ac-r">Acertos</span><div class="foco-passos"><button type="button" data-q="ac" data-d="-1" aria-label="Menos um acerto">${I.x}</button><output id="foco-ac" aria-labelledby="foco-ac-r">0</output><button type="button" class="mais" data-q="ac" data-d="1" aria-label="Mais um acerto">${I.mais}</button></div></div>
        <div class="foco-cont"><span id="foco-er-r">Erros</span><div class="foco-passos"><button type="button" data-q="er" data-d="-1" aria-label="Menos um erro">${I.x}</button><output id="foco-er" aria-labelledby="foco-er-r">0</output><button type="button" class="mais" data-q="er" data-d="1" aria-label="Mais um erro">${I.mais}</button></div></div>
      </div>
      <div class="foco-acoes"><button type="button" class="kf-btn kf-sec foco-sec" id="foco-pausa"></button><button type="button" class="kf-btn kf-comecar" id="foco-fim">${I.check}Concluir</button></div>
      <button type="button" class="kf-btn kf-link foco-descartar" id="foco-descartar">Descartar sessão</button>
    </div>`;
  document.body.appendChild(focoEl); document.body.classList.add('com-foco');
  $('#foco-min', focoEl).onclick = () => focoFechar();
  $('#foco-pausa', focoEl).onclick = () => { pausarSessao(!!DB.ativa.desde); focoPintar(); };
  $('#foco-fim', focoEl).onclick = () => concluirSessao();
  $('#foco-descartar', focoEl).onclick = () => confirmar('Descartar a sessão?', 'O tempo e as questões desta sessão não serão guardados.', 'Descartar sessão', () => { descartarSessao(); focoFechar(); render(); });
  focoEl.addEventListener('click', e => { const b = e.target.closest('[data-q]'); if (!b || !DB.ativa) return; const k = b.dataset.q; DB.ativa[k] = Math.max(0, (DB.ativa[k] || 0) + (+b.dataset.d)); salvar({ quieto: true }); focoPintar(); if (+b.dataset.d > 0) vibrar(8); });
  focoEl.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !KitFacil.dialogo.aberto()) { e.preventDefault(); focoFechar(); }
    if (e.key === 'Tab' && !KitFacil.dialogo.aberto()) { const f = $$('button', focoEl).filter(x => x.getClientRects().length); const i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus(); }
  });
  requestAnimationFrame(() => { focoEl && focoEl.classList.add('dentro'); $('#foco-t', focoEl)?.focus({ preventScroll: true }); });
  clearInterval(focoTic); focoTic = setInterval(focoPintar, 500);
  focoPintar(); pedirTela();
}
function focoPintar() {
  const a = DB.ativa; if (!focoEl) return; if (!a) { focoFechar(); return; }
  const seg = ativaSeg(a), alvo = (a.alvo || 0) * 60, C = 2 * Math.PI * 104, k = alvo ? Math.min(1, seg / alvo) : (seg % 3600) / 3600;
  $('#foco-tempo', focoEl).textContent = fmtRelogio(seg);
  $('#foco-alvo', focoEl).textContent = !a.desde ? 'em pausa' : alvo ? (seg >= alvo ? 'tempo cumprido' : `de ${a.alvo} min`) : 'tempo livre';
  $('#foco-arco', focoEl).setAttribute('stroke-dashoffset', (C * (1 - k)).toFixed(1));
  focoEl.classList.toggle('cumprido', !!alvo && seg >= alvo); focoEl.classList.toggle('pausado', !a.desde);
  const bp = $('#foco-pausa', focoEl), rot = a.desde ? 'Pausar' : 'Retomar';
  if (bp.dataset.r !== rot) { bp.dataset.r = rot; bp.innerHTML = (a.desde ? I.pausa : I.play) + rot; }
  $('#foco-ac', focoEl).textContent = a.ac || 0; $('#foco-er', focoEl).textContent = a.er || 0;
  if (alvo && seg >= alvo && !a.tocou) { a.tocou = true; salvar({ quieto: true }); tocarFim(); }
}
function focoFechar() {
  if (!focoEl) return;
  const el = focoEl; focoEl = null; clearInterval(focoTic); soltarTela(); document.body.classList.remove('com-foco');
  // a cópia que sai não leva os ids (o foco pode reabrir antes de ela sumir)
  el.removeAttribute('id'); $$('[id]', el).forEach(x => x.removeAttribute('id'));
  el.classList.remove('dentro'); el.style.pointerEvents = 'none';
  setTimeout(() => el.remove(), semMovimento() ? 0 : KitFacil.movimento.ms);
  if (typeof render === 'function') render();
}
// barra da sessão em andamento, acima da navegação, quando o foco está recolhido
function barraSessaoHTML() {
  const a = DB.ativa; if (!a || focoEl) return '';
  const n = nomeItem(a);
  return `<button type="button" class="sessao-barra" id="sessao-barra"><span class="sb-ic">${a.desde ? I.play : I.pausa}</span><span class="sb-tx"><b id="sb-tempo">${fmtRelogio(ativaSeg(a))}</b><small>${esc(n.t)}</small></span><span class="sb-ir">Voltar ao foco${I.seta}</span></button>`;
}
setInterval(() => {
  const a = DB.ativa, e = document.getElementById('sb-tempo'); if (!a) return;
  if (e) e.textContent = fmtRelogio(ativaSeg());
  if (!focoEl && a.alvo && a.desde && !a.tocou && ativaSeg(a) >= a.alvo * 60) { a.tocou = true; salvar({ quieto: true }); tocarFim(); avisar('Tempo cumprido. Volte ao foco para concluir.'); }
}, 1000);

/* ---------- fechar a sessão ---------- */
const numHTML = (id, rotulo, v, extra = '') => `<div class="kf-campo"><label class="kf-rotulo" for="${id}">${rotulo}</label><input id="${id}" class="kf-entrada num" type="number" inputmode="numeric" min="0" step="1" value="${v}" ${extra}></div>`;
const lerNum = el => Math.max(0, Math.round(+String(el && el.value || '0').replace(',', '.') || 0));
function corpoFechamento({ min, ac, er, t, tipo }) {
  const top = t && topico(t), podeTeoria = top && !top.teoria && tipo !== 'revisao';
  return `<div class="trio">${numHTML('fs-min', 'Minutos', min, 'max="900"')}${numHTML('fs-ac', 'Acertos', ac)}${numHTML('fs-er', 'Erros', er)}</div>
    <div class="kf-campo"><span class="kf-rotulo">Como foi?</span>${segHTML('fs-conf', [[1, 'Difícil'], [2, 'Bom'], [3, 'Fácil']], 2, 'Como foi a sessão')}</div>
    ${podeTeoria ? `<div class="kf-campo"><span class="kf-rotulo">Teoria deste assunto</span>${KitFacil.ui.fato({ marcado: false, marcar: 'Marcar teoria como concluída', desmarcar: 'Teoria concluída', attrs: 'id="fs-teoria"' })}<p class="kf-ajuda">Com a teoria concluída, o assunto fica grifado e as revisões entram sozinhas.</p></div>` : ''}`;
}
function ligarFato(d) { const b = $('#fs-teoria', d); if (!b) return () => false; let on = false; b.addEventListener('click', () => { on = !on; b.setAttribute('aria-pressed', on); b.classList.toggle('kf-fato-on', on); $('span', b).textContent = on ? 'Teoria concluída' : 'Marcar teoria como concluída'; }); return () => on; }
function concluirSessao() {
  const a = DB.ativa; if (!a) return;
  const eraRodando = !!a.desde; pausarSessao(true); focoPintar();
  const seg = ativaSeg(a);
  let salvou = false;
  abrirJanela({ titulo: 'Fechar a sessão', sub: nomeItem(a).t,
    corpo: corpoFechamento({ min: Math.max(1, Math.round(seg / 60)), ac: a.ac || 0, er: a.er || 0, t: a.t, tipo: a.tipo }),
    pe: `<button type="button" class="kf-btn kf-pri" id="fs-ok">Salvar sessão</button>`,
    aoFechar: () => { if (!salvou && eraRodando && DB.ativa) { pausarSessao(false); focoPintar(); } },
    aoMontar: d => {
      const teoria = ligarFato(d); ligarSeg($('#fs-conf', d));
      $('#fs-ok', d).onclick = () => {
        const min = lerNum($('#fs-min', d)), ac = lerNum($('#fs-ac', d)), er = lerNum($('#fs-er', d));
        if (!min && !ac && !er) { KitFacil.apontar($('#fs-min', d)); avisar('Informe o tempo de estudo, em minutos.'); return; }
        salvou = true;
        const antes = { s: jogoEstado(), perfeito: missoes().perfeito };
        const fez = registrarSessao({ t: a.t, m: a.m, tipo: a.tipo, seg: Math.abs(min * 60 - seg) < 60 ? seg : min * 60, ac, er, conf: +valorSeg($('#fs-conf', d)) || 2, teoria: teoria(), rev: a.rev, ini: a.ini });
        DB.ativa = null; salvar({ quieto: true });
        fecharJanela(true); focoFechar();
        if (!festa(fez, antes, { aoFechar: () => { render(); setTimeout(medalhaFilaMostrar, 500); } })) { jogoConferir(); render(); }
      };
    } });
}

/* ---------- lançar um estudo já feito (sem o cronômetro) ---------- */
function lancarEstudo(pre = {}) {
  let m = pre.m || (DB.materias[0] || {}).id, t = pre.t || (topicosDe(m)[0] || {}).id, tipo = pre.tipo || 'teoria';
  abrirJanela({ titulo: 'Lançar estudo feito', sub: 'Para o que você estudou sem o cronômetro.', alto: true,
    corpo: `<div class="kf-campo"><label class="kf-rotulo" for="le-m">Disciplina</label><select id="le-m" class="kf-entrada">${opcoesMaterias(m)}</select></div>
      <div class="kf-campo"><label class="kf-rotulo" for="le-t">Assunto</label><select id="le-t" class="kf-entrada">${opcoesTopicos(m, t)}</select></div>
      <div class="kf-campo"><span class="kf-rotulo">O que você fez</span>${segHTML('le-tipo', Object.entries(TIPOS), tipo, 'O que você fez')}</div>
      <div class="kf-campo"><label class="kf-rotulo" for="le-dia">Dia</label><input id="le-dia" class="kf-entrada" type="date" value="${hojeISO()}" max="${hojeISO()}"></div>
      <div id="le-resto">${corpoFechamento({ min: cfg().bloco, ac: 0, er: 0, t, tipo })}</div>`,
    pe: `<button type="button" class="kf-btn kf-pri" id="le-ok">Salvar estudo</button>`,
    aoMontar: d => {
      const sm = $('#le-m', d), st = $('#le-t', d); let teoria = ligarFato(d);
      const refazer = () => { const v = { min: lerNum($('#fs-min', d)), ac: lerNum($('#fs-ac', d)), er: lerNum($('#fs-er', d)) }; $('#le-resto', d).innerHTML = corpoFechamento({ ...v, t: st.value, tipo }); teoria = ligarFato(d); ligarSeg($('#fs-conf', d)); };
      sm.addEventListener('change', () => { st.innerHTML = opcoesTopicos(sm.value); refazer(); });
      st.addEventListener('change', refazer);
      ligarSeg($('#le-tipo', d), v => { tipo = v; refazer(); }); ligarSeg($('#fs-conf', d));
      $('#le-ok', d).onclick = () => {
        const min = lerNum($('#fs-min', d)), ac = lerNum($('#fs-ac', d)), er = lerNum($('#fs-er', d)), dia = $('#le-dia', d).value || hojeISO();
        if (!min && !ac && !er) { KitFacil.apontar($('#fs-min', d)); avisar('Informe o tempo de estudo, em minutos.'); return; }
        if (dia > hojeISO()) { KitFacil.apontar($('#le-dia', d)); avisar('Escolha hoje ou um dia que já passou.'); return; }
        const antes = { s: jogoEstado(), perfeito: missoes().perfeito }, eHoje = dia === hojeISO();
        const fez = registrarSessao({ t: st.value, tipo, seg: min * 60, ac, er, conf: +valorSeg($('#fs-conf', d)) || 2, teoria: teoria(), dia, ini: eHoje ? agora() : deISO(dia).getTime() + 12 * 36e5, manual: true });
        salvar({ quieto: true }); fecharJanela(true);
        if (!eHoje || !festa(fez, antes, { aoFechar: () => { render(); setTimeout(medalhaFilaMostrar, 500); } })) { jogoConferir(); render(); avisar('Estudo lançado.'); }
      };
    } });
}

/* ---------- ficha do assunto ---------- */
// o grifo: quanto do assunto já está "passado no marca-texto" (0 a 4)
const grifoHTML = (d, rotulo = true) => `<span class="dominio d${d}" ${rotulo ? `role="img" aria-label="Domínio: ${DOMINIOS[d]}"` : 'aria-hidden="true"'}>${[1, 2, 3, 4].map(i => `<i class="${i <= d ? 'on' : ''}"></i>`).join('')}</span>`;
function assuntoFicha(tId) {
  const t = topico(tId); if (!t) return;
  const m = materia(t.m), S = sessoesDe(t.id), d = dominio(t), min = soma(S, s => s.seg / 60), ac = soma(S, s => s.ac || 0), er = soma(S, s => s.er || 0);
  const ult = S.length ? S.reduce((a, b) => a.ini > b.ini ? a : b) : null, prox = DB.revisoes.filter(r => r.t === t.id && !r.feita).sort((a, b) => a.due < b.due ? -1 : 1)[0], feitas = DB.revisoes.filter(r => r.t === t.id && r.feita).length;
  const h = hojeISO();
  abrirJanela({ titulo: t.nome, contexto: m ? m.nome : '',
    corpo: `<div class="af-dom">${grifoHTML(d)}<b>${DOMINIOS[d]}</b><small>${['Ainda não estudado.', 'Já tem estudo; falta concluir a teoria.', 'Teoria concluída. Agora, revisões e questões.', 'Revisado. Mais questões e revisões para dominar.', 'Dominado: revisões em dia e bons acertos.'][d]}</small></div>
      <dl class="resumo">
        <div><dt>Tempo de estudo</dt><dd>${min ? fmtMin(min) : 'nenhum'}</dd></div>
        <div><dt>Questões</dt><dd>${ac + er ? `${ac} de ${ac + er} certas (${pct(ac, ac + er)}%)` : 'nenhuma'}</dd></div>
        <div><dt>Revisões feitas</dt><dd>${feitas}</dd></div>
        <div><dt>Próxima revisão</dt><dd>${prox ? (prox.due <= h ? 'hoje' : fmtData(prox.due)) : (t.teoria ? 'nenhuma marcada' : 'depois da teoria')}</dd></div>
        <div><dt>Último estudo</dt><dd>${ult ? fmtData(ult.dia) : 'nunca'}</dd></div>
      </dl>
      <div class="kf-campo">${KitFacil.ui.fato({ marcado: !!t.teoria, marcar: 'Marcar teoria como concluída', desmarcar: 'Desmarcar teoria concluída', attrs: 'id="af-teoria"' })}</div>`,
    pe: `<button type="button" class="kf-btn kf-comecar" id="af-estudar">${I.play}${prox && prox.due <= h ? 'Revisar agora' : 'Estudar agora'}</button>`,
    aoMontar: dl => {
      $('#af-estudar', dl).onclick = () => { fecharJanela(true); abrirEstudar(prox && prox.due <= h ? { t: t.id, m: t.m, tipo: 'revisao', min: 15, rev: prox.id } : { t: t.id, m: t.m, tipo: t.teoria ? 'questoes' : 'teoria', min: cfg().bloco }); };
      $('#af-teoria', dl).onclick = () => {
        const era = t.teoria, revsAntes = DB.revisoes.slice();
        if (era) { t.teoria = 0; DB.revisoes = DB.revisoes.filter(r => r.t !== t.id || r.feita); } else { t.teoria = agora(); agendarRevisoes(t.id, h); }
        salvar(); fecharJanela(true);
        avisar(era ? 'Teoria desmarcada.' : 'Teoria concluída. Revisões marcadas.', { label: 'Desfazer', run: () => { t.teoria = era; DB.revisoes = revsAntes; salvar(); } });
        if (!era) setTimeout(() => jogoConferir(), 700);
      };
    } });
}
