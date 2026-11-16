/* Estudo Fácil · moldura (navegação e troca de tela), ações das telas, Ajustes, abertura, guia e arranque do app. */
"use strict";

/* ---------- navegação ---------- */
let tab = 'hoje', novoItem = null;
const TELAS = { hoje: viewHoje, cadernos: viewCadernos, caderno: viewCaderno, plano: viewPlano, medalhas: viewMedalhas, evolucao: viewEvolucao, instrutor: viewInstrutor, provas: viewProvas, prova: viewProva, discursivas: viewDiscursivas, discursiva: viewDiscursiva, mais: viewMais, concursos: viewConcursos, concurso: viewConcurso, disciplinas: viewDisciplinas, disciplina: viewDisciplina, revisoes: viewRevisoes, simulados: viewSimulados, agenda: viewAgenda };
const TITULOS = { hoje: 'Hoje', cadernos: 'Cadernos', caderno: 'Caderno', plano: 'Edital', medalhas: 'Medalhas', evolucao: 'Evolução', instrutor: 'Instrutor', provas: 'Provas do Cebraspe', prova: 'Prova', discursivas: 'Discursiva', discursiva: 'Discursiva', mais: 'Mais', concursos: 'Concursos', concurso: 'Concurso', disciplinas: 'Disciplinas', disciplina: 'Disciplina', revisoes: 'Revisões', simulados: 'Simulados', agenda: 'Agenda', ajustes: 'Ajustes' };
const PAI = { concurso: 'concursos', disciplina: 'disciplinas', prova: 'provas', discursiva: 'discursivas', caderno: 'cadernos' };
// telas das funções gerais, fora da fase fechada (GERAL, em app.js)
const TELAS_GERAIS = new Set(['concursos', 'concurso', 'disciplinas', 'disciplina', 'simulados', 'agenda']);
const DE_MAIS = new Set(['plano', 'concursos', 'concurso', 'disciplinas', 'disciplina', 'revisoes', 'simulados', 'agenda', 'instrutor', 'provas', 'prova', 'discursivas', 'discursiva']);
function irPara(t, { topo = true } = {}) {
  if (t === 'estudar') { abrirEstudar(); return; }
  if (t === 'ajustes') { abrirAjustes(); return; }
  if (!GERAL && TELAS_GERAIS.has(t)) t = 'hoje';
  sairDosAjustes(); fecharJanela(true);
  tab = t; render();
  if (topo) window.scrollTo({ top: 0 });
}
// a barra de baixo e o trilho são os do Kit: Estudar no centro, "Mais" por último (Código, Arts. 59 e 60)
function pintarNav() {
  const it = (id, rotulo, icone, extra = []) => ({ id, rotulo, icone, atual: tab === id || extra.includes(tab) });
  const viva = !!DB.ativa, centro = { id: 'estudar', rotulo: 'Estudar', nome: viva ? 'Voltar ao foco' : 'Estudar agora', icone: I.play, atual: false, selo: viva ? '<span class="kf-nav-selo"><span aria-hidden="true">•</span><span class="kf-so-leitor">, sessão em andamento</span></span>' : '' };
  // com as medalhas ligadas, elas ficam na barra e a Evolução vai para "Mais"; desligadas, a Evolução volta à barra
  const jogo = jogoLigado(), terceiro = jogo ? it('medalhas', 'Medalhas', I.medalha) : it('evolucao', 'Evolução', I.evolucao);
  const html = KitFacil.nav.barra({ itens: [it('hoje', 'Hoje', I.hoje), it('cadernos', 'Cadernos', I.questoes, ['caderno']), terceiro], centro, mais: { atual: tab === 'mais' || DE_MAIS.has(tab) || (jogo && tab === 'evolucao') } });
  const nav = $('#tabs'); if (nav.dataset.h !== html) { nav.innerHTML = html; nav.dataset.h = html; }
  const lado = KitFacil.nav.trilho({ destaque: { ...centro, rotulo: viva ? 'Voltar ao foco' : 'Estudar agora' },
    itens: [it('hoje', 'Hoje', I.hoje), it('cadernos', 'Cadernos', I.questoes, ['caderno']), ...(jogo ? [it('medalhas', 'Medalhas', I.medalha)] : []), it('plano', 'Edital', I.plano), it('evolucao', 'Evolução', I.evolucao), it('provas', 'Provas', I.simulado, ['prova']), it('discursivas', 'Discursiva', I.lapis, ['discursiva']), it('instrutor', 'Instrutor', I.balao), it('revisoes', 'Revisões', I.revisar),
      ...(GERAL ? [it('concursos', 'Concursos', I.concurso, ['concurso']), it('disciplinas', 'Disciplinas', I.disciplinas, ['disciplina']), it('simulados', 'Simulados', I.simulado), it('agenda', 'Agenda', I.agenda)] : [])], mais: { atual: tab === 'mais' } });
  const t = $('#trilho'); if (t.dataset.h !== lado) { t.innerHTML = lado; t.dataset.h = lado; }
}
document.addEventListener('click', e => {
  const alvo = e.target.closest && e.target.closest('[data-kf-ir], [data-act]'); if (!alvo) return;
  if (alvo.dataset.kfIr) { e.preventDefault(); irPara(alvo.dataset.kfIr); return; }
  const fn = ACOES[alvo.dataset.act]; if (fn) { e.preventDefault(); fn(alvo, e); }
});
$('#marca').addEventListener('click', () => irPara('hoje'));

/* ---------- ações das telas ---------- */
const ACOES = {
  ...ACOES_CAD,
  'estudar-proximo': () => abrirEstudar(),
  'estudar-item': b => { const it = planoDoDia().itens[+b.dataset.i]; if (it) abrirEstudar(it); },
  'revisar': b => { const r = DB.revisoes.find(x => x.id === b.dataset.id); if (r) abrirEstudar({ t: r.t, m: topico(r.t).m, tipo: 'revisao', min: 15, rev: r.id }); },
  'assunto': b => assuntoFicha(b.dataset.id),
  'sessao': b => sessaoFicha(b.dataset.id),
  'medalha': b => medalhaFicha(MEDALHAS.find(m => m.id === b.dataset.id)),
  'ver-medalhas': () => irPara('medalhas'),
  'desafio': () => { const D = desafioDoDia(); if (D.feito) { avisar('O desafio de hoje já foi. Amanhã tem outro.'); return; } treinoAbrir({ desafio: true }); },
  'flashcards': () => flashcardsAbrir(),
  'treino-livre': () => treinoAbrir({ n: 10 }),
  'perguntar': () => perguntarInstrutor(),
  'abrir-prova': b => { provaId = b.dataset.id; provaIni = 0; irPara('prova'); },
  'abrir-red': b => { redId = b.dataset.id; irPara('discursiva'); },
  'sobre-sequencia': () => sobreSequencia(),
  'guia': () => { if (GERAL) guiaIniciar(); },
  'novo-concurso': () => novoConcurso(),
  'abrir-concurso': b => { concId = b.dataset.id; irPara('concurso'); },
  'editar-concurso': () => editarConcurso(),
  'editar-areas': () => editarAreas(),
  'disc-concurso': b => discConcurso(+b.dataset.i),
  'incluir-disc': () => incluirDisc(),
  'edital-saiu': () => { const c = DB.concursos.find(x => x.id === concId); if (!c) return; c.previsto = false; salvar(); avisar('Edital marcado como publicado. Confira a banca, as datas e os itens.', { label: 'Desfazer', run: () => { c.previsto = true; salvar(); } }); },
  'excluir-concurso': () => { const c = DB.concursos.find(x => x.id === concId); if (!c) return; confirmar('Excluir o concurso?', `${c.sigla} sai do plano. As disciplinas e o que você estudou continuam.`, 'Excluir concurso', () => { DB.concursos = DB.concursos.filter(x => x.id !== c.id); DB.simulados = DB.simulados.filter(s => s.c !== c.id); salvar({ quieto: true }); irPara('concursos'); avisar('Concurso excluído.'); }); },
  'abrir-disc': b => { discId = b.dataset.id; irPara('disciplina'); },
  'nova-disc': () => novaDisciplina(),
  'novo-assunto': () => novoAssunto(),
  'editar-assunto': b => editarAssunto(b.dataset.id),
  'renomear-disc': () => { const m = materia(discId); if (m) nomeJanela({ titulo: 'Renomear disciplina', rotulo: 'Nome da disciplina', valor: m.nome, ok: 'Salvar', max: 80, aoSalvar: v => { m.nome = v; salvar(); fecharJanela(true); avisar('Disciplina salva.'); } }); },
  'excluir-disc': () => excluirDisciplina(),
  'novo-simulado': () => simuladoJanela(),
  'abrir-simulado': b => simuladoJanela(b.dataset.id),
  'novo-evento': () => eventoJanela(),
  'editar-evento': b => eventoJanela(b.dataset.id),
};
function sobreSequencia() {
  const S = sequencia(), c = cfg();
  abrirJanela({ titulo: 'Como funciona a sequência', corpo: `<div class="texto-janela">
      <p>A sequência conta os dias seguidos em que você bateu a meta: hoje, <b>${fmtMin(c.metaMin)}</b> de estudo.</p>
      <p><b>Folgas.</b> A cada 7 dias seguidos, o app guarda uma folga (até 2). Faltou um dia? A folga é gasta sozinha e a sequência continua. Você tem ${S.folgas ? plural(S.folgas, 'folga guardada', 'folgas guardadas') : 'nenhuma folga guardada'}.</p>
      <p><b>Descanso.</b> Os dias que você tirar da rotina não quebram a sequência.</p>
      <p>A meta e os dias de estudo ficam em Mais, Ajustes, Rotina e metas.</p></div>` });
}

/* ---------- desenhar a tela ---------- */
function render() {
  if (tab === 'concurso' && !DB.concursos.some(c => c.id === concId)) tab = 'concursos';
  if (tab === 'disciplina' && !materia(discId)) tab = 'disciplinas';
  if (tab === 'prova' && !PROVA.has(provaId)) tab = 'provas';
  if (tab === 'caderno' && !cadernoDe(cadId)) tab = 'cadernos';
  if (!GERAL && TELAS_GERAIS.has(tab)) tab = 'hoje';
  if (tab === 'discursiva' && !DISC.has(redId)) tab = 'discursivas';
  if (!TELAS[tab] && tab !== 'ajustes') tab = 'hoje';
  pintarNav();
  const v = $('#view'), tela = tab === 'ajustes' ? viewAjustes : TELAS[tab];
  $('.wrap').classList.toggle('largo', tab === 'ajustes');
  const chaveTela = tab + (tab === 'concurso' ? concId : tab === 'disciplina' ? discId : tab === 'prova' ? provaId : tab === 'discursiva' ? redId : tab === 'caderno' ? cadId : '');
  const trocou = v.dataset.telaAtual !== chaveTela; v.dataset.telaAtual = chaveTela;
  // as seções abertas continuam abertas depois de redesenhar
  const abertas = trocou ? null : new Set($$('details[data-chave]', v).filter(d => d.open).map(d => d.dataset.chave)), fechadas = trocou ? null : new Set($$('details[data-chave]', v).filter(d => !d.open).map(d => d.dataset.chave));
  const desenhar = () => {
    v.innerHTML = `<section class="view view-${tab}">${tela.html()}</section>`; marcarChaves();
    if (abertas) $$('details[data-chave]', v).forEach(d => { if (abertas.has(d.dataset.chave)) d.open = true; else if (fechadas.has(d.dataset.chave)) d.open = false; });
    (tela.ligar || tela.bind)?.call(tela, v);
  };
  if (trocou || semSalvar) desenhar(); else KitFacil.movimento.redesenhar(v, desenhar);
  document.body.dataset.tela = tab;
  if (trocou) { KitFacil.movimento.entrar(v, { de: 'tela' }); document.title = tab === 'hoje' ? 'Estudo Fácil' : `${TITULOS[tab]} · Estudo Fácil`; }
  const sb = $('#sessao'), hb = barraSessaoHTML(); if (sb.dataset.h !== hb) { sb.innerHTML = hb; sb.dataset.h = hb; } else if (DB.ativa) { const e = $('#sb-tempo'); if (e) e.textContent = fmtRelogio(ativaSeg()); }
  document.body.classList.toggle('com-sessao', !!hb);
  KitFacil.topo.atualizar();
  if (novoItem) { const q = novoItem; novoItem = null; requestAnimationFrame(() => { const el = $(q, v); if (el) KitFacil.destacar(el.closest('li') || el); }); }
  clearTimeout(render.t); render.t = setTimeout(() => { if (!semSalvar) jogoConferir(); medalhaFilaMostrar(); }, 800);
}
$('#sessao').addEventListener('click', e => { if (e.target.closest('#sessao-barra')) focoAbrir(); });
addEventListener('scroll', () => $('#barra').classList.toggle('rolou', scrollY > 4), { passive: true });
// seções com data-chave lembram se estavam abertas
function marcarChaves() {   $$('#view details[data-kf-secao]').forEach((d, i) => { if (!d.dataset.chave) d.dataset.chave = (d.dataset.disc ? 'disc-' + d.dataset.disc : 's' + i); }); }
// virou o dia com o app aberto: a tela Hoje se refaz
let diaVisto = hojeISO();
setInterval(() => { if (hojeISO() !== diaVisto) { diaVisto = hojeISO(); VER++; if (!KitFacil.dialogo.aberto() && !focoAberto() && !treinoAberto()) render(); } }, 30000);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && hojeISO() !== diaVisto) { diaVisto = hojeISO(); VER++; render(); } });

/* ---------- Ajustes (guias do Kit Fácil, mais as do Estudo Fácil) ---------- */
let tabAntesAjustes = 'hoje';
function abrirAjustes() {
  if (tab === 'ajustes') return;
  tabAntesAjustes = tab; tab = 'ajustes';
  try { history.pushState({ ajustes: true }, ''); } catch {}
  fecharJanela(true); render(); window.scrollTo({ top: 0 });
}
function fecharAjustes() {
  if (tab !== 'ajustes') return;
  if (history.state && history.state.ajustes) { history.go(history.state.kfAjPush ? -2 : -1); return; }
  tab = tabAntesAjustes; render(); window.scrollTo({ top: 0 });
}
function sairDosAjustes() { if (tab === 'ajustes' && history.state && history.state.ajustes) { tab = tabAntesAjustes; history.go(history.state.kfAjPush ? -2 : -1); } }
window.addEventListener('popstate', () => { if (tab === 'ajustes' && !(history.state && history.state.ajustes)) { tab = tabAntesAjustes; fecharJanela(true); render(); window.scrollTo({ top: 0 }); } });
const resumoRotina = () => `${fmtMin(cfg().metaMin)} por dia · ${cfg().dias.length === 7 ? 'todos os dias' : plural(cfg().dias.length, 'dia', 'dias') + ' por semana'}`;
const resumoRev = () => `Em ${cfg().revisoes.join(', ').replace(/, (\d+)$/, ' e $1')} dias`;
const resumoJogo = () => { const s = jogoEstado(); return jogoLigado() ? `Nível ${s.nivel} · ${s.ganhas.length} de ${s.total} medalhas` : 'Medalhas desligadas'; };
const linhaChave = (id, on, titulo, sub) => `<label class="linha-chave"><span><b>${titulo}</b><small>${sub}</small></span>${KitFacil.ui.chave({ attrs: `id="${id}"`, on })}</label>`;
const viewAjustes = {
  html() {
    const c = cfg();
    return KitFacil.ajustes.html({
      extras: {
        conta: `<div class="kf-bloco"><h3>Você no app</h3><form id="aj-nome-f" class="kf-campo" autocomplete="off"><label class="kf-rotulo" for="aj-nome">Como chamam você</label>
          <div class="kf-linha"><input id="aj-nome" type="text" class="kf-entrada" autocapitalize="words" maxlength="40" placeholder="Seu nome ou apelido" value="${esc(c.nome || '')}" enterkeyhint="done"><button type="submit" class="kf-btn kf-pri">Salvar</button></div></form></div>`,
        notificacoes: `<div class="kf-bloco"><h3>Fim do tempo da sessão</h3>${linhaChave('aj-som', c.som !== false, 'Tocar um som', 'Três notas curtas quando o tempo da sessão termina.')}${linhaChave('aj-vibra', c.vibra !== false, 'Vibrar', 'Nos aparelhos que vibram.')}</div>`,
        privacidade: `<div class="kf-bloco"><h3>Apagar todos os dados</h3><p class="kf-ajuda">Apaga concursos, disciplinas, sessões, revisões e medalhas deste aparelho e, com a sincronização ligada, também da nuvem e dos outros aparelhos.</p><button type="button" class="kf-btn kf-perigo" id="aj-apagar">Apagar todos os dados</button></div>`,
      },
      resumos: { conta: c.nome ? `Você é ${c.nome}` : undefined },
      produto: [
        { id: 'rotina', titulo: 'Rotina e metas', icone: '<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="4.500"/><path d="M12 12h.01"/>', resumo: resumoRotina(),
          html: `<div class="kf-bloco"><h3>Meta de cada dia</h3><div class="kf-campo"><label class="kf-rotulo" for="aj-meta">Minutos de estudo por dia</label><input id="aj-meta" class="kf-entrada num" type="number" inputmode="numeric" min="15" max="600" step="5" value="${c.metaMin}"><p class="kf-ajuda">Bater esta meta mantém a sua sequência. Uma hora por dia já faz diferença.</p></div>
              <div class="kf-campo"><label class="kf-rotulo" for="aj-q">Questões por dia</label><input id="aj-q" class="kf-entrada num" type="number" inputmode="numeric" min="0" max="300" step="5" value="${c.metaQ}"><p class="kf-ajuda">Vira uma das missões do dia. Com zero, a missão some.</p></div></div>
            <div class="kf-bloco"><h3>Dias de estudo</h3><div class="dias-escolha" role="group" aria-label="Dias de estudo">${SEMANA_L.map((n, i) => KitFacil.ui.escolha({ rotulo: n, on: c.dias.includes(i), attrs: `data-dia="${i}"` })).join('')}</div><p class="kf-ajuda">Os dias desmarcados são de descanso e não quebram a sequência.</p></div>
            <div class="kf-bloco"><h3>Bloco de estudo</h3><div class="kf-campo"><span class="kf-rotulo">Minutos de cada bloco do plano</span>${segHTML('aj-bloco', [[25, '25'], [30, '30'], [45, '45'], [50, '50'], [60, '60']], c.bloco, 'Minutos de cada bloco')}<p class="kf-ajuda">O plano de hoje divide a meta em blocos, um por disciplina.</p></div></div>` },
        { id: 'revisoes', titulo: 'Revisões', icone: '<path d="M19.500 12a7.500 7.500 0 1 1-2.400-5.500"/><path d="M19.500 4.500v4h-4"/>', resumo: resumoRev(),
          html: `<div class="kf-bloco"><h3>Quando revisar</h3><form id="aj-rev-f" class="kf-campo" autocomplete="off"><label class="kf-rotulo" for="aj-rev">Dias depois de concluir a teoria</label><div class="kf-linha"><input id="aj-rev" class="kf-entrada" type="text" inputmode="numeric" maxlength="30" value="${c.revisoes.join(', ')}" enterkeyhint="done"><button type="submit" class="kf-btn kf-pri">Salvar</button></div><p class="kf-ajuda">Separe por vírgula. O padrão é 1, 7, 30. Vale para os assuntos que você concluir de agora em diante.</p></form></div>` },
        { id: 'medalhas', titulo: 'Medalhas e apresentação', icone: '<circle cx="12" cy="14.500" r="5.500"/><path d="M8.500 3.500 12 9l3.500-5.500M9.200 10 6.500 3.500M14.800 10l2.700-6.500"/>', resumo: resumoJogo(),
          html: `<div class="kf-bloco"><h3>Pontos, níveis e medalhas</h3>${linhaChave('aj-jogo', jogoLigado(), 'Mostrar pontos, níveis e medalhas', 'Desligado, o app fica só com o plano e as contas. Nada é apagado.')}</div>
            <div class="kf-bloco"><h3>Apresentação</h3><p class="kf-ajuda">As telas que aparecem na primeira vez que o app abre.${GERAL ? ' O guia fica em Mais.' : ''}</p><button type="button" class="kf-btn kf-sec" id="aj-abertura">Rever a apresentação</button></div>` },
      ],
    });
  },
  ligar(v) {
    KitFacil.ajustes.ligar(v);
    const guarda = (msg, id, txt) => { salvar({ quieto: true }); if (id) KitFacil.ajustes.resumo(id, txt); pintarNav(); if (msg) avisar(msg); };
    $('#aj-nome-f', v)?.addEventListener('submit', e => { e.preventDefault(); const el = $('#aj-nome', v); cfg().nome = el.value.trim().slice(0, 40); el.blur(); guarda(cfg().nome ? `Pronto: você é ${cfg().nome}.` : 'Nome apagado.', 'conta', cfg().nome ? `Você é ${cfg().nome}` : 'Sem cadastro · dados neste aparelho'); setTimeout(() => jogoConferir(), 500); });
    $('#aj-som', v)?.addEventListener('change', e => { cfg().som = e.target.checked; guarda(e.target.checked ? 'Som ligado.' : 'Som desligado.'); });
    $('#aj-vibra', v)?.addEventListener('change', e => { cfg().vibra = e.target.checked; guarda(e.target.checked ? 'Vibração ligada.' : 'Vibração desligada.'); });
    $('#aj-apagar', v)?.addEventListener('click', () => confirmar('Apagar todos os dados?', 'Concursos, disciplinas, sessões, revisões e medalhas saem deste aparelho e da nuvem.', 'Apagar todos os dados', () => { apagarTudo(); avisar('Tudo apagado. O app está vazio.'); }));
    const num = (id, k, a, b, msg) => $(id, v)?.addEventListener('change', e => { const n = clamp(lerNum(e.target), a, b); e.target.value = n; cfg()[k] = n; guarda(msg(n), 'rotina', resumoRotina()); });
    num('#aj-meta', 'metaMin', 15, 600, n => `Meta: ${fmtMin(n)} por dia.`); num('#aj-q', 'metaQ', 0, 300, n => n ? `Missão: ${plural(n, 'questão', 'questões')} por dia.` : 'Missão de questões desligada.');
    $$('[data-dia]', v).forEach(b => b.addEventListener('click', () => { const i = +b.dataset.dia, D = new Set(cfg().dias); if (D.has(i)) { if (D.size === 1) { avisar('Deixe pelo menos um dia de estudo.'); return; } D.delete(i); } else D.add(i); cfg().dias = [...D].sort(); b.setAttribute('aria-pressed', D.has(i)); guarda('', 'rotina', resumoRotina()); }));
    ligarSeg($('#aj-bloco', v), val => { cfg().bloco = +val; guarda(`Blocos de ${val} minutos.`); });
    $('#aj-rev-f', v)?.addEventListener('submit', e => { e.preventDefault(); const el = $('#aj-rev', v), L = [...new Set(el.value.split(/[^\d]+/).map(Number).filter(n => n >= 1 && n <= 365))].sort((a, b) => a - b).slice(0, 6);
      if (!L.length) { KitFacil.apontar(el); avisar('Escreva os dias, separados por vírgula. Exemplo: 1, 7, 30.'); return; } cfg().revisoes = L; el.value = L.join(', '); el.blur(); guarda('Revisões salvas.', 'revisoes', resumoRev()); });
    $('#aj-jogo', v)?.addEventListener('change', e => { cfg().jogo = e.target.checked; guarda(e.target.checked ? 'Pontos, níveis e medalhas ligados.' : 'Pontos, níveis e medalhas desligados.', 'medalhas', resumoJogo()); });
    $('#aj-abertura', v)?.addEventListener('click', () => aberturaAbrir({ rever: true }));
  },
};

/* ---------- abertura: quatro telas, uma vez só (Código, Art. 75) ---------- */
const aberturaAtiva = () => KitFacil.abertura.ativa();
function aberturaAbrir({ rever = false } = {}) {
  if (aberturaAtiva()) return;
  const veterano = !!LS.get('db_antigo', null), s = jogoEstado(), c = concursoFoco();
  const DEMO = ['Princípios do tratamento (art. 6º)', 'Bases legais do tratamento (art. 7º)', 'Direitos do titular (arts. 17 a 22)', 'Sanções administrativas (arts. 52 a 54)'];
  const grifados = new Set([0]); let tocou = false;
  const demoHTML = () => `<div class="folha ab-demo"><span class="rotulo-mini">LGPD · experimente</span>
      ${DEMO.map((n, i) => { const on = grifados.has(i); return `<button type="button" class="ab-as ${on ? 'on' : ''}" data-ab-as="${i}" aria-pressed="${on}"><span class="ab-box" aria-hidden="true">${on ? I.check : ''}</span><span><span class="${on ? 'grifo' : ''}">${n}</span></span></button>`; }).join('')}
      <p class="ab-demo-r" role="status">${grifados.size ? `<b>${Math.round(grifados.size / DEMO.length * 100)}%</b> grifado` : 'Toque num assunto para grifar'}</p>${barraHTML(grifados.size / DEMO.length * 100, 'Parte grifada', 'grifada')}</div>`;
  const telas = [
    { arte: `<div class="ab-caderno"><div class="folha ab-folha"><span class="ab-l w70"></span><span class="ab-l w90 grifada"></span><span class="ab-l w60"></span><span class="ab-l w80 grifada"></span><span class="ab-l w50"></span></div><span class="ab-chama">${chamaHTML(true)}</span><span class="ab-anel">${anelHTML(60, 60, { tam: 84, traco: 9, centro: '<b>60</b><small>min</small>' })}</span></div>`,
      titulo: veterano && !rever ? 'O Estudo Fácil está de cara nova' : 'Estudar todo dia, do jeito fácil',
      texto: veterano && !rever ? 'O app foi refeito do zero. Os dados da versão antiga ficaram guardados neste aparelho, mas não vieram para a nova.' : 'O app escolhe o assunto, traz questões comentadas e lembra das revisões. Você só abre e começa.' },
    { arte: () => demoHTML(), falada: true, titulo: 'O edital vira caderno', texto: 'Experimente: toque num assunto para grifar. Cada assunto estudado aumenta a sua prontidão para a prova.' },
    { arte: `<div class="ab-seq"><span class="ab-chama g">${chamaHTML(true)}</span><ol class="semana ab-sem" aria-hidden="true">${['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((l, i) => `<li class="dia ${i < 5 ? 'feito' : i === 5 ? 'hoje atual' : 'futuro'}"><span class="dia-l">${l}</span><span class="dia-m">${i < 5 ? I.check : ''}</span></li>`).join('')}</ol>
        <div class="ab-meds">${['seq7', 'q500', 'as50', 'cb20', 'ed90'].map((id, k) => `<span class="ab-med" style="--i:${k}">${medalhaSVG(MEDALHAS.find(m => m.id === id))}</span>`).join('')}</div></div>`,
      titulo: 'Uma hora por dia muda tudo', texto: 'Bata a meta, mantenha a sequência e junte medalhas. Faltou um dia? A folga guardada segura a sequência.' },
    { arte: `<div class="folha ab-capa"><span class="rotulo-mini">${c ? esc(c.orgao || c.sigla) : 'Seu concurso'}</span><b class="capa-t">${c ? esc(c.cargo || c.sigla) : 'Escolha o seu edital'}</b>
        ${c ? `<dl class="resumo"><div><dt>Disciplinas</dt><dd>${c.disc.length}</dd></div><div><dt>Assuntos</dt><dd>${soma(c.disc, d => d.topicos.length)}</dd></div><div><dt>Fases até a prova</dt><dd>3</dd></div></dl>` : ''}</div>`,
      titulo: c && c.base === 'anpd' ? 'Seu plano para a ANPD está pronto' : 'Seu plano começa hoje',
      texto: c && c.base === 'anpd' ? 'Especialista em Regulação: doze cadernos de questões, o edital para grifar e as fases até a prova.' : 'Adicione o seu concurso e o app monta o plano de cada dia.',
      extra: cfg().nome ? '' : `<div class="kf-campo ab-nome"><label class="kf-rotulo" for="ab-eu">Como chamam você? <span class="kf-opcional">(opcional)</span></label><input id="ab-eu" class="kf-entrada" type="text" autocapitalize="words" autocomplete="off" maxlength="40" placeholder="Seu nome ou apelido"></div>` },
  ];
  KitFacil.abertura.abrir({ telas, rever, rotulo: 'Apresentação do Estudo Fácil', fim: () => rever ? 'Concluir' : 'Começar a estudar',
    aoMontar: (el, { redesenharArte }) => { el.addEventListener('click', e => { const b = e.target.closest('[data-ab-as]'); if (!b) return; const i = +b.dataset.abAs; grifados.has(i) ? grifados.delete(i) : grifados.add(i); tocou = true; redesenharArte(); $(`[data-ab-as="${i}"]`, el)?.focus({ preventScroll: true }); }); },
    aoFechar: ({ el }) => {
      const inp = $('#ab-eu', el), nome = inp ? inp.value.trim().slice(0, 40) : '', disse = !!nome && !cfg().nome;
      if (disse) cfg().nome = nome;
      salvar({ quieto: true }); jogoConferir({ silencioso: true }); render(); void tocou; void s;
      // quem diz o nome na abertura já recebe ali a primeira medalha (Código, Art. 75, § 1º)
      const m = disse && jogoLigado() && MEDALHAS.find(x => x.id === 'nome');
      return () => { if (m) setTimeout(() => medalhaNova([m]), semMovimento() ? 0 : 320); };
    } });
}

/* ---------- guia: o app faz cada passo na tela, do começo ao fim, numa demonstração que não grava nada ----------
   O motor (janela fixa acima da barra, dedo, anel e as mãos) é o do Kit (KitFacil.guia.demonstrar); aqui ficam o
   roteiro e a troca dos dados reais pelos da demonstração. */
let dadosReais = null;
const guiaAtivo = () => KitFacil.guia.emDemonstracao();
const guiaFoto = () => JSON.stringify({ DB, tab, concId, discId, planoConc, provaId, redId });
const guiaSemAviso = () => $$('.kf-toast').forEach(e => { e.hidden = true; });
function guiaLimpar() { $('#festa-ok')?.click(); if (treinoAberto()) treinoFechar(); if (focoAberto()) focoFechar(); fecharJanela(true); guiaSemAviso(); medalhaFila = []; }
function guiaIniciar() {
  if (guiaAtivo() || aberturaAtiva()) return;
  if (DB.ativa) { avisar('Conclua ou descarte a sessão em andamento antes de ver o guia.'); return; }
  KitFacil.guia.demonstrar({
    passos: GUIA,
    comecar: () => {
      sairDosAjustes(); fecharJanela(true);
      // os dados de verdade ficam guardados na memória; a demonstração começa com o plano da ANPD e nada dela é gravado
      dadosReais = { DB, tab, concId, discId, planoConc }; semSalvar = true;
      const demo = bancoVazio(); instalarEdital(demo, EDITAL_ANPD); Object.assign(demo.cfg, { nome: cfg().nome, metaMin: 30, bloco: 30, jogo: true, som: false, vibra: false });
      DB = demo; VER++; tab = 'hoje'; planoConc = null; medalhaFila = [];
      render(); window.scrollTo({ top: 0 });
    },
    foto: guiaFoto, limpar: guiaLimpar,
    restaurar: f => { if (tab === 'ajustes') sairDosAjustes(); const o = JSON.parse(f); DB = o.DB; tab = o.tab; provaId = o.provaId; redId = o.redId; concId = o.concId; discId = o.discId; planoConc = o.planoConc; VER++; $('#view').dataset.telaAtual = ''; render(); window.scrollTo({ top: 0 }); },
    terminar: ({ concluiu }) => {
      if (tab === 'ajustes') sairDosAjustes();
      const r = dadosReais; dadosReais = null; semSalvar = false;
      DB = r.DB; tab = 'hoje'; concId = r.concId; discId = r.discId; planoConc = r.planoConc; VER++; $('#view').dataset.telaAtual = '';
      render(); window.scrollTo({ top: 0 });
      if (concluiu) { jogoMarcar('guia'); avisar('Guia concluído.'); }
    },
  });
}
const navQ = t => `#kf-nav-${t}, #kf-trilho-${t}`;
async function demoIr(m, t) { if (tab !== t) await m.tocar(navQ(t)); }
const demoLGPD = n => (topicosDe('anpd-lgpd')[n] || {}).id;
// o treino da demonstração: o primeiro assunto da LGPD; resp = quantas questões já vêm respondidas
async function demoTreino(m, resp = 0) {
  if (!treinoAberto()) { fecharJanela(true); treinoAbrir({ t: demoLGPD(0) }); await m.acha('#treino [data-resp]'); }
  if (resp && !TR.marcou) { treinoResponder('C'); await m.acha('#tr-prox'); }
}
const GUIA = [
  { t: 'A meta de hoje', d: 'A tela Hoje mostra a sua sequência, a meta do dia e o próximo assunto.',
    acao: async m => { await m.apontar('#view .hf-seq', 1500); await m.apontar('#view .hf-meta', 1700); } },
  { t: 'O plano de hoje', d: 'O app escolhe os assuntos pelo peso de cada disciplina na prova.',
    acao: async m => { await m.apontar('#view .plano-hoje', 2200); } },
  { t: 'Comece a estudar', d: 'Toque em Estudar agora. O próximo assunto do plano já vem escolhido.',
    acao: async m => { await m.tocar('#hoje-estudar'); await m.acha('#es-ok'); await m.apontar('.kf-dlg .sugestao', 1600); await m.apontar('#es-banco', 1400); } },
  { t: 'Treino de questões', d: 'Os itens são de certo ou errado, como no Cebraspe. Leia e julgue.', continua: true,
    acao: async m => { if (!treinoAberto()) { if (!$('#es-ok')) { await m.tocar('#hoje-estudar'); await m.acha('#es-ok'); } await m.tocar('#es-ok'); } await m.acha('#treino [data-resp]'); await m.apontar('#treino .tr-folha', 2200); } },
  { t: 'Certo ou errado', d: 'Respondeu? O app mostra o gabarito, o comentário e a base legal.', continua: true,
    acao: async m => { await demoTreino(m); await m.tocar('#treino [data-resp="C"]'); await m.acha('#tr-prox'); await m.apontar('#treino .tr-fb', 1400); await m.apontar('#treino .tr-exp', 2000); } },
  { t: 'Uma aula em cada questão', d: 'Abra a aula do assunto: um resumo curto do que a banca cobra.', continua: true,
    acao: async m => { await demoTreino(m, 1); const a = await m.acha('#treino .tr-aula summary'); if (!a.parentElement.open) await m.tocar(a); await m.apontar('#treino .tr-aula', 2400); } },
  { t: 'Pergunte ao instrutor', d: 'Ficou com dúvida? O app copia a questão para você levar ao Claude.', continua: true,
    acao: async m => { await demoTreino(m, 1); await m.tocar('#tr-perguntar'); await m.acha('#in-ok'); await m.apontar('.kf-dlg #in-d', 1500); await m.apontar('#in-ok', 1300); await m.fechar(); await m.some('#in-ok'); } },
  { t: 'Errou? Vira flashcard', d: 'O item errado volta em 1, 3, 7, 15 e 30 dias. Acertos seguidos viram combo.',
    acao: async m => { await demoTreino(m, 1); await m.tocar('#tr-prox'); await m.tocar('#treino [data-resp="C"]'); await m.acha('#tr-prox'); await m.espera(700); await m.tocar('#tr-prox'); await m.tocar('#treino [data-resp="C"]'); await m.acha('#tr-prox'); await m.apontar('#treino .tr-fc', 1900);
      await m.tocar('#tr-prox'); const ok = await m.acha('#festa-ok', { opcional: true, prazo: 2500 }); if (ok) { await m.espera(3200); await m.tocar('#festa-ok'); await m.some('#festa-ok'); } } },
  { t: 'Desafio do dia e flashcards', d: 'Na tela Hoje: dez itens sorteados por dia e os flashcards que venceram.',
    acao: async m => { await demoIr(m, 'hoje'); await m.apontar('#view [data-act="desafio"]', 1500); await m.apontar('#view [data-act="flashcards"]', 1400); await m.apontar('#view [data-act="treino-livre"]', 1400); } },
  { t: 'Cronômetro para a lei seca', d: 'Para ler a lei ou a teoria, escolha o tipo e o tempo. O relógio corre em tela cheia.', continua: true,
    acao: async m => { await m.tocar(navQ('estudar')); await m.acha('#es-ok'); await m.tocar('#es-tipo [data-v="lei"]', { depois: 500 }); await m.tocar('#es-alvo [data-v="25"]', { depois: 400 }); await m.tocar('#es-alvo [data-v="30"]', { depois: 400 }); await m.tocar('#es-ok'); await m.acha('#foco-fim');
      DB.ativa.acum = 30 * 60; DB.ativa.tocou = true; focoPintar(); await m.apontar('#foco .foco-relogio', 1800); } },
  { t: 'Feche a sessão', d: 'Confira o tempo, diga como foi e salve. O tempo conta para a meta do dia.',
    acao: async m => { if (!focoAberto()) { iniciarSessao({ t: demoLGPD(1), tipo: 'lei', alvo: 30 }); DB.ativa.acum = 30 * 60; DB.ativa.tocou = true; focoAbrir(); await m.acha('#foco-fim'); }
      await m.tocar('#foco-fim'); await m.acha('#fs-ok'); await m.tocar('#fs-conf [data-v="3"]', { depois: 500 }); await m.tocar('#fs-ok');
      const ok = await m.acha('#festa-ok', { opcional: true, prazo: 2500 }); if (ok) { await m.espera(3200); await m.tocar('#festa-ok'); await m.some('#festa-ok'); } } },
  { t: 'Sequência e missões', d: 'Meta batida, a chama acende. As missões do dia rendem pontos.',
    acao: async m => { await demoIr(m, 'hoje'); await m.apontar('#view .hf-seq', 1600); await m.apontar('#view .missoes', 1800); } },
  { t: 'O edital vira caderno', d: 'No Plano, cada assunto estudado fica grifado e a prontidão sobe.',
    acao: async m => { await demoIr(m, 'plano'); await m.apontar('#view .plano-capa', 1800); const s = await m.acha('#view [data-disc="anpd-lgpd"] summary'); if (!s.parentElement.open) await m.tocar(s); await m.espera(500); await m.apontar(`#view [data-act="assunto"][data-id="${demoLGPD(0)}"]`, 1700); } },
  { t: 'A ficha do assunto', d: 'Toque num assunto para ver o domínio, as questões e a próxima revisão.',
    acao: async m => { await demoIr(m, 'plano'); const s = await m.acha('#view [data-disc="anpd-lgpd"] summary'); if (!s.parentElement.open) { await m.tocar(s); await m.espera(400); }
      await m.tocar(`#view [data-act="assunto"][data-id="${demoLGPD(0)}"]`); await m.acha('#af-estudar'); await m.apontar('.kf-dlg .af-dom', 1500); await m.apontar('.kf-dlg .resumo', 1700); await m.fechar(); await m.some('#af-estudar'); } },
  { t: 'Fases até a prova', d: 'O plano tem três fases. O app mostra em qual você está e as metas dela.',
    acao: async m => { await demoIr(m, 'plano'); await m.apontar('#view .fases', 2400); } },
  { t: 'Medalhas que giram', d: 'São mais de cem, em quatro metais. Toque numa e deslize o dedo: ela gira.',
    acao: async m => { await demoIr(m, 'medalhas'); await m.apontar('#view .nivel-card', 1400); await m.apontar('#view .vitrine', 1700); await m.tocar('#view .medalhas [data-act="medalha"][data-id="primeira"]'); await m.acha('.kf-dlg .med3d'); await m.espera(700); await m.arrastar('.kf-dlg .med3d', 140); await m.arrastar('.kf-dlg .med3d', -220, { dur: 1300 }); await m.fechar(); await m.some('.kf-dlg .med3d'); } },
  { t: 'A sua evolução', d: 'Em Mais: prontidão, constância, horas por semana e acertos.',
    acao: async m => { if (tab !== 'evolucao') { if ($(navQ('evolucao'))?.getClientRects().length) await m.tocar(navQ('evolucao')); else { await demoIr(m, 'mais'); await m.tocar('#view [data-kf-ir="evolucao"]'); } } await m.apontar('#view #ev-pr', 1500, { opcional: true, prazo: 800 }); await m.apontar('#view .calor', 1700, { opcional: true, prazo: 800 }); } },
  { t: 'Provas do Cebraspe', d: 'O caderno abre no site da banca. Aqui você marca, corrige e lê o comentário.',
    acao: async m => { await demoIr(m, 'mais'); if (!$('#view [data-kf-ir="provas"]')) await m.tocar(navQ('mais')); await m.tocar('#view [data-kf-ir="provas"]'); await m.apontar('#view .lista', 1500); await m.tocar('#view [data-act="abrir-prova"][data-id="anatel24-cb1"]'); await m.apontar('#view .prova-capa', 1700);
      const b = '#view [data-bloco="2"]'; await m.tocar(`${b} [data-item="24"][data-v="C"]`, { depois: 350 }); await m.tocar(`${b} [data-item="25"][data-v="C"]`, { depois: 350 }); await m.tocar(`${b} [data-item="26"][data-v="C"]`, { depois: 350 });
      await m.tocar(`${b} [data-corrigir]`); await m.tocar('.kf-dlg [data-kf-ok]'); const ok = await m.acha('#festa-ok', { opcional: true, prazo: 2500 }); if (ok) { await m.espera(2200); await m.tocar('#festa-ok'); await m.some('#festa-ok'); }
      await m.apontar(`${b} .bl-nota`, 1500); await m.apontar(`${b} .fr-item.no .fr-com`, 2200, { opcional: true, prazo: 1000 }); } },
  { t: 'Discursiva', d: 'Temas que a banca cobrou e temas do instrutor. Escreva e mande corrigir.',
    acao: async m => { await demoIr(m, 'mais'); if (!$('#view [data-kf-ir="discursivas"]')) await m.tocar(navQ('mais')); await m.tocar('#view [data-kf-ir="discursivas"]'); await m.apontar('#view .lista', 1500); await m.tocar('#view [data-act="abrir-red"][data-id="anm24-lgpd"]'); await m.apontar('#view .disc-capa', 1600); await m.apontar('#view .disc-top', 1800); await m.apontar('#ds-enviar', 1500); } },
  { t: 'O instrutor', d: 'As respostas do Claude às suas dúvidas ficam guardadas aqui.',
    acao: async m => { await demoIr(m, 'mais'); if (!$('#view [data-kf-ir="instrutor"]')) await m.tocar(navQ('mais')); await m.tocar('#view [data-kf-ir="instrutor"]'); await m.apontar('#view .instrutor-capa', 2400); } },
  { t: 'Revisões na data certa', d: 'Concluiu a teoria? As revisões entram sozinhas, em 1, 7 e 30 dias.',
    acao: async m => { await demoIr(m, 'mais'); await m.tocar('#view [data-kf-ir="revisoes"]'); await m.apontar('#view .lista', 2200, { opcional: true, prazo: 1200 }); } },
  { t: 'Concursos e disciplinas', d: 'Em Mais, troque de concurso, ajuste os pesos e edite as disciplinas.',
    acao: async m => { await demoIr(m, 'mais'); if (!$('#view [data-kf-ir="concursos"]')) await m.tocar(navQ('mais')); await m.apontar('#view [data-kf-ir="concursos"]', 1300); await m.apontar('#view [data-kf-ir="disciplinas"]', 1300); await m.apontar('#view [data-kf-ir="simulados"]', 1300); } },
  { t: 'Ajustes', d: 'Meta do dia, dias de estudo, revisões, sincronização e aparência.',
    acao: async m => { await demoIr(m, 'mais'); if (!$('#view [data-kf="ajustes"]')) await m.tocar(navQ('mais')); await m.tocar('#view [data-kf="ajustes"]'); await m.acha('#view [data-kf-aj-ir]'); await m.espera(700); const L = $$('#view .kf-aj-lista [data-kf-aj-ir]').filter(e => e.getClientRects().length); for (const el of L.slice(0, 3)) await m.apontar(el, 800); const r = L.find(e => e.dataset.kfAjIr === 'rotina'); if (r) await m.apontar(r, 1400); } },
  { t: 'A nuvem', d: 'Mostra se os seus aparelhos estão sincronizados. Toque para ver os detalhes.',
    acao: async m => { await m.tocar('#barra [data-kf-nuvem]'); await m.acha('.kf-dlg'); await m.espera(2000); await m.fechar(); } },
  { t: 'Avaliação e problemas', d: 'O balão recebe a sua nota e os relatos de problema.',
    acao: async m => { await m.tocar('#barra [data-kf="feedback"]'); await m.acha('.kf-dlg'); await m.espera(2000); await m.fechar(); } },
  { t: 'Um presente para o criador', d: 'O app é gratuito. Gostou? Mande um presente pelo Pix.', se: () => KitFacil.apoio.ativo(),
    acao: async m => { await m.tocar('#barra [data-kf-presente]'); await m.acha('.kf-dlg [data-kf-qr]'); await m.espera(900); await m.apontar('.kf-dlg [data-kf-qr]', 2000); await m.fechar(); } },
  { t: 'Pronto, é isso', d: 'A demonstração some; os seus dados ficam. Agora é com você.',
    acao: async m => { await m.tocar(navQ('hoje')); await m.espera(2000); } },
];

/* ---------- arranque ---------- */
KitFacil.campo.ligar();
$('#topo').outerHTML = KitFacil.topo.html({ principal: true });
// link de "Conectar outro aparelho" (a chave vem depois do #, que não sai do aparelho)
const linkSync = SY.tokenDoLink();
if (linkSync) try { history.replaceState(null, '', location.pathname + location.search); } catch {}
render();
instrutorCarregar().then(() => { if (tab === 'instrutor' || tab === 'mais') render(); });
SY.iniciar({ token: linkSync, silencioso: true, textoConfirmar: 'Os concursos, as sessões e as medalhas deste aparelho se juntam aos da nuvem.' });
// quem chega à versão 1.0 vê a abertura do app, uma vez; as novidades do Kit ficam para as próximas versões
if (!KitFacil.abertura.vista()) { try { localStorage.setItem('kitfacil.estudo-facil.visto', JSON.stringify(VERSAO)); } catch {} }
if (!KitFacil.abertura.vista() && !linkSync && !(navigator.webdriver && !window.EF_TESTE_ABERTURA)) aberturaAbrir();
else jogoConferir({ silencioso: !temMarco('f:pronto') });
if (marcar('f:pronto')) salvar({ quieto: true });
// atalho "Estudar agora" do ícone do app (manifesto)
if (/[?&]estudar=1/.test(location.search)) { try { history.replaceState(null, '', location.pathname + location.hash); } catch {} if (!aberturaAtiva()) setTimeout(() => abrirEstudar(), 300); }
try { if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(e => console.warn('sw', e)); } catch (e) { console.warn('sw', e); }
