/* Estudo Fácil · moldura (navegação e troca de tela), ações das telas, Ajustes, abertura e arranque do app. */
"use strict";

/* ---------- navegação ---------- */
let tab = 'hoje';
const TELAS = { hoje: viewHoje, apostilas: viewApostilas, apostila: viewApostila, capitulo: viewCapitulo, dose: viewDose, relembrar: viewRelembrar, edital: viewEdital, medalhas: viewMedalhas, semanas: viewSemanas, leis: viewLeis, lei: viewLei, discursivas: viewDiscursivas, discursiva: viewDiscursiva, mais: viewMais };
const TITULOS = { hoje: 'Hoje', apostilas: 'Apostilas', apostila: 'Apostila', capitulo: 'Capítulo', dose: 'Lei seca', relembrar: 'Relembrar', edital: 'Edital', medalhas: 'Medalhas', semanas: 'Resumo semanal', leis: 'Leis', lei: 'Lei', discursivas: 'Discursiva', discursiva: 'Discursiva', mais: 'Mais', ajustes: 'Ajustes' };
const DE_MAIS = new Set(['edital', 'medalhas', 'semanas', 'leis', 'lei', 'discursivas', 'discursiva']);
const DE_APOSTILAS = ['apostila', 'capitulo', 'dose'];
function irPara(t, { topo = true } = {}) {
  if (t === 'estudar') { lerSugestao(); return; }
  if (t === 'ajustes') { abrirAjustes(); return; }
  sairDosAjustes(); fecharJanela(true);
  if (tab === 'relembrar' && t !== 'relembrar') relSair();
  tab = t; render();
  if (topo) window.scrollTo({ top: 0 });
}
// a barra de baixo e o trilho são os do Kit: a leitura no centro, "Mais" por último (Código, Arts. 59 e 60)
function pintarNav() {
  const it = (id, rotulo, icone, extra = [], selo = '') => ({ id, rotulo, icone, atual: tab === id || extra.includes(tab), selo });
  const due = cartoesDeHoje().length, selo = due ? `<span class="nav-selo"><span aria-hidden="true">${due > 99 ? '99+' : due}</span><span class="kf-so-leitor">, ${plural(due, 'cartão para hoje', 'cartões para hoje')}</span></span>` : '';
  const centro = { id: 'estudar', rotulo: 'Estudar', nome: 'Ler agora', icone: I.play, atual: false };
  const hoje = it('hoje', 'Hoje', I.hoje), ap = it('apostilas', 'Apostilas', I.livro, DE_APOSTILAS), rel = it('relembrar', 'Relembrar', I.cartas, [], selo);
  const html = KitFacil.nav.barra({ itens: [hoje, ap, rel], centro, mais: { atual: tab === 'mais' || DE_MAIS.has(tab) } });
  const nav = $('#tabs'); if (nav.dataset.h !== html) { nav.innerHTML = html; nav.dataset.h = html; }
  const lado = KitFacil.nav.trilho({ destaque: { ...centro, rotulo: 'Ler agora' },
    itens: [hoje, ap, rel, it('edital', 'Edital', I.plano), ...(jogoLigado() ? [it('medalhas', 'Medalhas', I.medalha)] : []), it('semanas', 'Resumo semanal', I.agenda), it('leis', 'Leis', I.lei, ['lei']), it('discursivas', 'Discursiva', I.lapis, ['discursiva'])], mais: { atual: tab === 'mais' } });
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
  ...ACOES_LEI,
  ...ACOES_AP,
  ...ACOES_REL,
  'estudar-proximo': () => lerSugestao(),
  'ver-edital': b => { editalConc = b.dataset.id; irPara('edital'); },
  'assunto': b => assuntoFicha(b.dataset.id),
  'medalha': b => { const m = MEDALHAS.find(x => x.id === b.dataset.id); if (m) medalhaFicha(m); },
  'abrir-red': b => { redId = b.dataset.id; irPara('discursiva'); },
  'sobre-sequencia': () => sobreSequencia(),
};

/* ---------- desenhar a tela ---------- */
function render() {
  if (tab === 'lei' && !LEI.has(leiId)) tab = 'leis';
  if ((tab === 'apostila' || tab === 'capitulo') && !AP.has(apId)) tab = 'apostilas';
  if (tab === 'capitulo' && !(topico(capId) && apostilaDoAssunto(capId))) tab = 'apostila';
  if (tab === 'dose' && !doseDe(doseId)) tab = 'apostilas';
  if (tab === 'discursiva' && !DISC.has(redId)) tab = 'discursivas';
  if (tab === 'medalhas' && !MEDALHAS.length) tab = 'mais';
  if (!TELAS[tab] && tab !== 'ajustes') tab = 'hoje';
  pintarNav();
  const v = $('#view'), tela = tab === 'ajustes' ? viewAjustes : TELAS[tab];
  $('.wrap').classList.toggle('largo', tab === 'ajustes');
  const chaveTela = tab + (tab === 'discursiva' ? redId : tab === 'lei' ? leiId + (LEI_TXT[leiId] ? '' : '…') : tab === 'apostila' ? apId + (apPronta(apId) ? '' : '…') : tab === 'capitulo' ? capId + (apPronta(apId) ? '' : '…') : tab === 'dose' ? doseId + (LEI_TXT[doseDe(doseId).lei] ? '' : '…') : tab === 'edital' ? (editalConc || '') : '');
  const trocou = v.dataset.telaAtual !== chaveTela; v.dataset.telaAtual = chaveTela;
  // as seções abertas continuam abertas depois de redesenhar
  const abertas = trocou ? null : new Set($$('details[data-chave]', v).filter(d => d.open).map(d => d.dataset.chave)), fechadas = trocou ? null : new Set($$('details[data-chave]', v).filter(d => !d.open).map(d => d.dataset.chave));
  const desenhar = () => {
    v.innerHTML = `<section class="view view-${tab}">${tela.html()}</section>`; marcarChaves();
    if (abertas) $$('details[data-chave]', v).forEach(d => { if (abertas.has(d.dataset.chave)) d.open = true; else if (fechadas.has(d.dataset.chave)) d.open = false; });
    tela.ligar?.call(tela, v);
  };
  if (trocou) desenhar(); else KitFacil.movimento.redesenhar(v, desenhar);
  document.body.dataset.tela = tab;
  if (trocou) { KitFacil.movimento.entrar(v, { de: 'tela' }); document.title = tab === 'hoje' ? 'Estudo Fácil' : `${TITULOS[tab]} · Estudo Fácil`; }
  KitFacil.topo.atualizar();
  clearTimeout(render.t); render.t = setTimeout(() => { jogoConferir(); medalhaFilaMostrar(); }, 800);
}
addEventListener('scroll', () => $('#barra').classList.toggle('rolou', scrollY > 4), { passive: true });
// seções com data-chave lembram se estavam abertas
function marcarChaves() { $$('#view details[data-kf-secao]').forEach((d, i) => { if (!d.dataset.chave) d.dataset.chave = (d.dataset.disc ? 'disc-' + d.dataset.disc : 's' + i); }); }
// virou o dia com o app aberto: a tela Hoje se refaz
let diaVisto = hojeISO();
setInterval(() => { if (hojeISO() !== diaVisto) { diaVisto = hojeISO(); VER++; if (!KitFacil.dialogo.aberto() && !festaAberta) render(); } }, 30000);
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
const resumoRotina = () => { const D = cfg().dias; return D.length === 7 ? 'Todos os dias' : D.length === 5 && [1, 2, 3, 4, 5].every(d => D.includes(d)) ? 'Segunda a sexta · fim de semana livre' : `${plural(D.length, 'dia', 'dias')} por semana`; };
const resumoJogo = () => { const s = jogoEstado(); return jogoLigado() ? `Nível ${s.nivel} · ${s.ganhas.length} de ${s.total} medalhas` : 'Medalhas desligadas'; };
const linhaChave = (id, on, titulo, sub) => `<label class="linha-chave"><span><b>${titulo}</b><small>${sub}</small></span>${KitFacil.ui.chave({ attrs: `id="${id}"`, on })}</label>`;
const viewAjustes = {
  html() {
    const c = cfg();
    return KitFacil.ajustes.html({
      extras: {
        conta: `<div class="kf-bloco"><h3>Você no app</h3><form id="aj-nome-f" class="kf-campo" autocomplete="off"><label class="kf-rotulo" for="aj-nome">Como chamam você</label>
          <div class="kf-linha"><input id="aj-nome" type="text" class="kf-entrada" autocapitalize="words" maxlength="40" placeholder="Seu nome ou apelido" value="${esc(c.nome || '')}" enterkeyhint="done"><button type="submit" class="kf-btn kf-pri">Salvar</button></div></form></div>`,
        privacidade: `<div class="kf-bloco"><h3>Apagar todos os dados</h3><p class="kf-ajuda">Apaga os capítulos concluídos, os cartões, os dias de estudo, as medalhas e os textos da discursiva deste aparelho e, com a sincronização ligada, também da nuvem e dos outros aparelhos.</p><button type="button" class="kf-btn kf-perigo" id="aj-apagar">Apagar todos os dados</button></div>`,
      },
      resumos: { conta: c.nome ? `Você é ${c.nome}` : undefined },
      produto: [
        { id: 'rotina', titulo: 'Rotina', icone: '<rect x="4" y="5.500" width="16" height="14.500" rx="2"/><path d="M8 3.500v4M16 3.500v4M4 10.500h16"/>', resumo: resumoRotina(),
          html: `<div class="kf-bloco"><h3>Dias de estudo</h3><div class="dias-escolha" role="group" aria-label="Dias de estudo">${SEMANA_L.map((n, i) => KitFacil.ui.escolha({ rotulo: n, on: c.dias.includes(i), attrs: `data-dia="${i}"` })).join('')}</div>
            <p class="kf-ajuda">Os dias desmarcados são livres: não quebram a sequência e, se você estudar, somam. O dia vale com um capítulo concluído ou com a revisão dos cartões.</p></div>` },
        { id: 'medalhas', titulo: 'Medalhas e apresentação', icone: '<circle cx="12" cy="14.500" r="5.500"/><path d="M8.500 3.500 12 9l3.500-5.500M9.200 10 6.500 3.500M14.800 10l2.700-6.500"/>', resumo: resumoJogo(),
          html: `<div class="kf-bloco"><h3>Níveis e medalhas</h3>${linhaChave('aj-jogo', jogoLigado(), 'Mostrar níveis e medalhas', 'Desligado, o app fica só com a leitura e os cartões. Nada é apagado.')}${linhaChave('aj-vibra', c.vibra !== false, 'Vibrar nas conquistas', 'Nos aparelhos que vibram.')}</div>
            <div class="kf-bloco"><h3>Apresentação</h3><p class="kf-ajuda">As telas que aparecem na primeira vez que o app abre.</p><button type="button" class="kf-btn kf-sec" id="aj-abertura">Rever a apresentação</button></div>` },
      ],
    });
  },
  ligar(v) {
    KitFacil.ajustes.ligar(v);
    const guarda = (msg, id, txt) => { salvar({ quieto: true }); if (id) KitFacil.ajustes.resumo(id, txt); pintarNav(); if (msg) avisar(msg); };
    $('#aj-nome-f', v)?.addEventListener('submit', e => { e.preventDefault(); const el = $('#aj-nome', v); cfg().nome = el.value.trim().slice(0, 40); el.blur(); guarda(cfg().nome ? `Pronto: você é ${cfg().nome}.` : 'Nome apagado.', 'conta', cfg().nome ? `Você é ${cfg().nome}` : 'Sem cadastro · dados neste aparelho'); setTimeout(() => jogoConferir(), 500); });
    $('#aj-vibra', v)?.addEventListener('change', e => { cfg().vibra = e.target.checked; guarda(e.target.checked ? 'Vibração ligada.' : 'Vibração desligada.'); });
    $('#aj-apagar', v)?.addEventListener('click', () => confirmar('Apagar todos os dados?', 'Capítulos concluídos, cartões, dias de estudo, medalhas e textos da discursiva saem deste aparelho e da nuvem.', 'Apagar todos os dados', () => { apagarTudo(); avisar('Tudo apagado. O app voltou ao começo.'); }));
    $$('[data-dia]', v).forEach(b => b.addEventListener('click', () => { const i = +b.dataset.dia, D = new Set(cfg().dias); if (D.has(i)) { if (D.size === 1) { avisar('Deixe pelo menos um dia de estudo.'); return; } D.delete(i); } else D.add(i); cfg().dias = [...D].sort(); b.setAttribute('aria-pressed', D.has(i)); guarda('', 'rotina', resumoRotina()); }));
    $('#aj-jogo', v)?.addEventListener('change', e => { cfg().jogo = e.target.checked; guarda(e.target.checked ? 'Níveis e medalhas ligados.' : 'Níveis e medalhas desligados.', 'medalhas', resumoJogo()); });
    $('#aj-abertura', v)?.addEventListener('click', () => aberturaAbrir({ rever: true }));
  },
};

/* ---------- abertura: quatro telas, uma vez só (Código, Art. 75) ---------- */
const aberturaAtiva = () => KitFacil.abertura.ativa();
function aberturaAbrir({ rever = false } = {}) {
  if (aberturaAtiva()) return;
  const veterano = !!LS.get('db_v3', null);
  // o cartão de exemplo vira com o toque, como os de verdade
  let virou = false;
  const demoHTML = () => `<div class="folha ab-demo ab-cartao"><span class="rotulo-mini">LGPD · experimente</span>
      <p class="rel-f">Qual a diferença entre controlador e operador?</p>
      ${virou ? `<div class="rel-v"><span class="rotulo-mini">Resposta</span><p role="status">O controlador decide sobre o tratamento. O operador trata os dados em nome dele.</p></div>` : `<button type="button" class="kf-btn kf-pri bloco" data-ab-virar>Ver a resposta</button>`}</div>`;
  const telas = [
    { arte: `<div class="ab-caderno"><div class="folha ab-folha"><span class="ab-l w70"></span><span class="ab-l w90 grifada"></span><span class="ab-l w60"></span><span class="ab-l w80 grifada"></span><span class="ab-l w50"></span></div><span class="ab-chama">${chamaHTML(true)}</span></div>`,
      titulo: veterano && !rever ? 'O Estudo Fácil mudou de jeito' : 'Estudar no caminho, do jeito fácil',
      texto: veterano && !rever ? 'Saíram o relógio e as metas. Agora o app entrega a teoria em capítulos: você abre, lê e toca em Entendi.' : 'O app entrega a teoria em capítulos. Você abre, lê e toca em Entendi. Sem relógio e sem meta de horas.' },
    { arte: `<div class="ab-seq"><span class="ab-chama g">${chamaHTML(true)}</span><ol class="semana ab-sem" aria-hidden="true">${['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((l, i) => `<li class="dia ${i >= 1 && i <= 3 ? 'feito' : i === 4 ? 'hoje atual' : i === 0 ? 'folga' : 'futuro'}"><span class="dia-l">${l}</span><span class="dia-m">${i >= 1 && i <= 3 ? I.check : ''}</span></li>`).join('')}</ol>
        <div class="ab-meds">${['seq5', 'cap10', 'mem100', 'df1', 'dia25'].map((id, k) => `<span class="ab-med" style="--i:${k}">${medalhaSVG(MEDALHAS.find(m => m.id === id))}</span>`).join('')}</div></div>`,
      titulo: 'Um capítulo já vale o dia', texto: 'O dia vale com um capítulo concluído ou com a revisão dos cartões. Sábado e domingo são livres: não quebram a sequência.' },
    { arte: () => demoHTML(), falada: true, titulo: 'Relembrar, em vez de reler tudo', texto: 'Dias depois, os cartões perguntam o que você leu. Não lembrou? O app abre só o trecho do capítulo que responde.' },
    { arte: `<div class="folha ab-capa"><span class="rotulo-mini">Edital</span><b class="capa-t">Os números ficam em Edital</b>
        <dl class="resumo">${concursosAtivos().map(c => `<div><dt>${esc(c.sigla)}</dt><dd>${c.dataProva ? fmtDataAno(c.dataProva) + (c.previsto ? ' (estimada)' : '') : 'sem data'}</dd></div>`).join('')}</dl></div>`,
      titulo: 'Hoje é só a próxima leitura', texto: 'Cobertura do edital, contagem para cada prova e datas importantes ficam na tela Edital. As questões você resolve no Tec Concursos.',
      extra: cfg().nome ? '' : `<div class="kf-campo ab-nome"><label class="kf-rotulo" for="ab-eu">Como chamam você? <span class="kf-opcional">(opcional)</span></label><input id="ab-eu" class="kf-entrada" type="text" autocapitalize="words" autocomplete="off" maxlength="40" placeholder="Seu nome ou apelido"></div>` },
  ];
  KitFacil.abertura.abrir({ telas, rever, rotulo: 'Apresentação do Estudo Fácil', fim: () => rever ? 'Concluir' : 'Começar a ler',
    aoMontar: (el, { redesenharArte }) => { el.addEventListener('click', e => { if (!e.target.closest('[data-ab-virar]')) return; virou = true; redesenharArte(); }); },
    aoFechar: ({ el }) => {
      const inp = $('#ab-eu', el), nome = inp ? inp.value.trim().slice(0, 40) : '', disse = !!nome && !cfg().nome;
      if (disse) cfg().nome = nome;
      salvar({ quieto: true }); jogoConferir({ silencioso: true }); render();
      // quem diz o nome na abertura já recebe ali a primeira medalha (Código, Art. 75, § 1º)
      const m = disse && jogoLigado() && MEDALHAS.find(x => x.id === 'nome');
      return () => { if (m) setTimeout(() => medalhaNova([m]), semMovimento() ? 0 : 320); };
    } });
}

/* ---------- arranque ---------- */
KitFacil.campo.ligar();
$('#topo').outerHTML = KitFacil.topo.html({ principal: true });
// link de "Conectar outro aparelho" (a chave vem depois do #, que não sai do aparelho)
const linkSync = SY.tokenDoLink();
if (linkSync) try { history.replaceState(null, '', location.pathname + location.search); } catch {}
render();
// as apostilas chegam logo depois da primeira pintura: trazem os títulos dos capítulos e os cartões
Promise.all(APOSTILAS.map(a => apCarregar(a.m))).then(() => { if (!KitFacil.dialogo.aberto() && !['capitulo', 'apostila', 'ajustes'].includes(tab)) render(); });
instrutorCarregar().then(() => { if (tab === 'discursiva') render(); });
SY.iniciar({ token: linkSync, silencioso: true, textoConfirmar: 'Os capítulos concluídos, os cartões e as medalhas deste aparelho se juntam aos da nuvem.' });
// quem chega pela primeira vez vê a abertura do app, uma vez; as novidades do Kit ficam para as próximas versões
if (!KitFacil.abertura.vista()) { try { localStorage.setItem('kitfacil.estudo-facil.visto', JSON.stringify(VERSAO)); } catch {} }
if (!KitFacil.abertura.vista() && !linkSync && !(navigator.webdriver && !window.EF_TESTE_ABERTURA)) aberturaAbrir();
else jogoConferir({ silencioso: !temMarco('f:pronto') });
if (marcar('f:pronto')) salvar({ quieto: true });
// atalho "Estudar agora" do ícone do app (manifesto)
if (/[?&]estudar=1/.test(location.search)) { try { history.replaceState(null, '', location.pathname + location.hash); } catch {} if (!aberturaAtiva()) setTimeout(() => lerSugestao(), 300); }
try { if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(e => console.warn('sw', e)); } catch (e) { console.warn('sw', e); }
