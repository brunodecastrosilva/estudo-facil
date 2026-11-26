/* Estudo Fácil · telas: Hoje, Edital (o painel dos números), Medalhas, Resumo semanal e Mais.
   Cada tela tem html() e, se precisar, ligar(v); os toques saem por data-act (ACOES, em casca.js).
   A tela Hoje é limpa de propósito: a sequência, a semana, uma leitura sugerida e um botão. Sem relógio, sem
   porcentagem e sem contagem regressiva: os números ficam em Edital (escopo de 26/11/2026). */
"use strict";

/* ---------- peças comuns ---------- */
const cab = (t, sub) => `<header class="tela-cab"><h1 class="tela-t">${esc(t)}</h1>${sub ? `<p class="tela-sub">${sub}</p>` : ''}</header>`;
const voltaMais = () => `<button type="button" class="volta" data-kf-ir="mais">${I.volta}<span>Mais</span></button>`;
const barraHTML = (p, rotulo, cls = '') => `<span class="barra ${cls}" role="img" aria-label="${esc(rotulo)}"><i style="width:${clamp(p, 0, 100)}%"></i></span>`;
const pontoCor = m => `<span class="ponto-cor" style="background:${m && /^#[0-9a-f]{6}$/i.test(m.cor) ? m.cor : '#888888'}" aria-hidden="true"></span>`;
const saudacao = () => { const h = new Date().getHours(), n = primeiroNome(cfg().nome); return (h < 5 ? 'Boa noite' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite') + (n ? ', ' + esc(n) : ''); };
const segHTML = (id, ops, atual, rotulo) => `<div class="kf-seg" id="${id}" role="group" aria-label="${esc(rotulo)}">${ops.map(([v, n]) => `<button type="button" data-v="${esc(String(v))}" aria-pressed="${String(v) === String(atual)}">${esc(n)}</button>`).join('')}</div>`;
const ligarSeg = (el, fn) => el && el.addEventListener('click', e => { const b = e.target.closest('button[data-v]'); if (!b) return; $$('button', el).forEach(x => x.setAttribute('aria-pressed', x === b)); fn && fn(b.dataset.v); });

/* ---------- Hoje ---------- */
function tiraSemana() {
  const h = hojeISO(), S = sequencia(), dom = maisDias(h, -deISO(h).getDay()), feitos = idx().dias, rotina = new Set(cfg().dias);
  return `<ol class="semana" aria-label="Esta semana">${[0, 1, 2, 3, 4, 5, 6].map(i => {
    const d = maisDias(dom, i), ok = feitos.has(d), prot = S.protegidos.has(d), hoje = d === h, fut = d > h, livre = !rotina.has(i);
    const est = ok ? 'feito' : prot ? 'protegido' : hoje ? 'hoje' : fut ? 'futuro' : livre ? 'folga' : 'falta';
    const fala = ok ? 'o dia valeu' : prot ? 'salvo por uma folga' : hoje ? (livre ? 'hoje, dia livre' : 'hoje') : fut ? (livre ? 'dia livre' : '') : livre ? 'dia livre' : 'sem estudo';
    return `<li class="dia ${est}${hoje ? ' atual' : ''}${livre ? ' livre' : ''}"><span class="dia-l" aria-hidden="true">${SEMANA[i][0].toUpperCase()}</span><span class="dia-m" aria-hidden="true">${ok ? I.check : prot ? I.escudo : ''}</span><span class="kf-so-leitor">${SEMANA_L[i]}${fala ? ': ' + fala : ''}</span></li>`;
  }).join('')}</ol>`;
}
const ROTULO_SUG = { continuar: 'Continue de onde parou', cap: 'Próxima leitura', lei: 'Lei seca do capítulo', volta: 'Para reler: os cartões pediram', reler: 'Para reler' };
const viewHoje = {
  html() {
    const S = sequencia(), s = sugestao(), due = cartoesDeHoje().length, P = datasPerto(), sem = resumoSemana(), ant = sem.vazio ? resumoSemana(maisDias(sem.seg, -7)) : null;
    const t = s && topico(s.t), a = s && apostilaDoAssunto(s.t), dose = s && s.tipo === 'lei' ? doseDe(s.t) : null;
    const estado = S.hojeFeito ? 'Hoje já valeu.' : S.livre ? 'Hoje é dia livre: não quebra a sequência.' : 'Um capítulo concluído ou a revisão fazem o dia valer.';
    return `${cab('Hoje', `${saudacao()}.`)}
      ${P.length ? (d => KitFacil.ui.faixa({ tipo: 'alerta', html: `<b>${d.em === 0 ? 'Hoje' : d.em === 1 ? 'Amanhã' : `Em ${d.em} dias`}:</b> ${esc(d.titulo)} (${fmtData(d.ini)}).${P.length > 1 ? ` Há mais ${plural(P.length - 1, 'data', 'datas')} perto.` : ''}`, acao: `<button type="button" class="kf-btn kf-sec" data-act="ver-edital" data-id="${esc(d.c)}">Ver no Edital</button>` }))(P[0]) : ''}
      <section class="folha hoje-folha" aria-label="Sequência e leitura de hoje">
        <div class="hf-seq"><span class="hf-chama">${chamaHTML(S.hojeFeito)}</span><span class="hf-seq-tx"><b><span class="hf-n">${S.n}</span> ${S.n === 1 ? 'dia seguido' : 'dias seguidos'}</b><small role="status">${estado}</small></span>
          <button type="button" class="btn-ic" data-act="sobre-sequencia" aria-label="Como funciona a sequência">${I.questoes}</button></div>
        ${tiraSemana()}
        ${!sem.vazio ? `<p class="hf-semana"><b>Esta semana:</b> ${esc(fraseSemana(sem) || plural(sem.dias, 'dia de estudo', 'dias de estudo'))}.</p>` : ant && !ant.vazio && fraseSemana(ant) ? `<p class="hf-semana"><b>Semana passada:</b> ${esc(fraseSemana(ant))}.</p>` : ''}
        ${s ? `<div class="sugestao"><span class="rotulo-mini">${ROTULO_SUG[s.tipo]}</span><b>${esc(capTitulo(s.t))}</b><small>${dose ? esc(doseRotulo(dose)) : `Capítulo ${a.ids.indexOf(s.t) + 1} de ${a.caps} · ${esc(a.curto)}`}</small></div>
        <button type="button" class="kf-btn kf-comecar bloco" id="hoje-estudar" data-act="estudar-proximo">${I.play}${s.tipo === 'lei' ? 'Ler a lei' : s.tipo === 'continuar' ? 'Continuar a leitura' : 'Ler agora'}</button>`
          : `<p class="apoio">Nenhuma apostila disponível ainda.</p>`}
      </section>
      ${due ? `<ul class="card lista"><li><button type="button" class="lin" data-kf-ir="relembrar" id="hoje-relembrar"><span class="lin-ic">${I.cartas}</span><span class="lin-tx"><b>Relembrar</b><small>${plural(due, 'cartão para hoje', 'cartões para hoje')}</small></span>${I.seta}</button></li></ul>` : ''}`;
  },
};
function sobreSequencia() {
  const S = sequencia(), L = cfg().dias.length === 5 && [1, 2, 3, 4, 5].every(d => cfg().dias.includes(d));
  abrirJanela({ titulo: 'Como funciona a sequência', corpo: `<div class="texto-janela">
      <p>A sequência conta os dias seguidos em que o dia valeu. O dia vale com <b>um capítulo concluído</b> ou com <b>a revisão dos cartões</b>.</p>
      <p><b>Dias livres.</b> ${L ? 'Sábado e domingo' : 'Os dias fora da sua rotina'} não quebram a sequência. Se você estudar, o dia soma.</p>
      <p><b>Folgas.</b> A cada 7 dias seguidos, o app guarda uma folga (até 2). Faltou um dia? A folga é gasta sozinha e a sequência continua. Você tem ${S.folgas ? plural(S.folgas, 'folga guardada', 'folgas guardadas') : 'nenhuma folga guardada'}.</p>
      <p>Sua maior sequência: ${plural(S.recorde, 'dia', 'dias')}.</p></div>` });
}

/* ---------- Edital: o painel ----------
   É aqui que os números ficam: cobertura em porcentagem, contagem regressiva de cada prova e as datas importantes. */
let editalConc = null;
const viewEdital = {
  html() {
    const A = concursosAtivos(), c = A.find(x => x.id === editalConc) || A[0];
    if (!c) return `${voltaMais()}${cab('Edital', 'Cobertura, contagem para a prova e datas importantes.')}${KitFacil.ui.vazio({ titulo: 'Nenhum edital no app', texto: 'Restaure os padrões de fábrica em Ajustes, Privacidade e segurança.' })}`;
    const ed = editalDaBiblioteca(c), ct = contagem(c), cb = cobertura(c), h = hojeISO();
    const discs = c.disc.filter(d => materia(d.m) && !d.fora), D = (c.datas || []).slice().sort((a, b) => a.ini < b.ini ? -1 : 1), fut = D.filter(d => d.ini >= h), pas = D.filter(d => d.ini < h);
    const dataLin = d => `<li class="${d.ini < h ? 'passou' : ''}"><span class="dt-dia">${fmtDataAno(d.ini)}</span><span class="dt-tx">${esc(d.titulo)}${d.ini === h ? ' <b>(hoje)</b>' : ''}</span></li>`;
    return `${voltaMais()}${cab('Edital', 'Cobertura, contagem para a prova e datas importantes.')}
      ${A.length > 1 ? segHTML('ed-conc', A.map(x => [x.id, x.sigla]), c.id, 'Concurso') : ''}
      <section class="folha plano-capa" aria-label="${esc(c.sigla)}">
        <span class="rotulo-mini">${esc(c.orgao || c.sigla)}</span><h2 class="capa-t">${esc(c.cargo || c.sigla)}</h2>
        <div class="capa-pront"><span class="capa-n"><span class="grifo">${cb.pct}%</span></span><span class="capa-tx"><b>do edital coberto</b><small>${cb.feitos} de ${plural(cb.n, 'assunto concluído', 'assuntos concluídos')}</small></span></div>
        ${barraHTML(cb.pct, `Cobertura: ${cb.pct}%`, 'grifada alta')}
        <dl class="resumo">
          <div><dt>Prova</dt><dd>${c.dataProva ? `${fmtDataAno(c.dataProva)}${c.previsto ? ' (estimada)' : ''}` : 'sem data'}</dd></div>
          ${ct ? `<div><dt>Contagem</dt><dd>${ct.texto}${ct.estimada && ct.n >= 0 ? ' (estimativa)' : ''}</dd></div>` : ''}
          <div><dt>Banca</dt><dd>${esc(c.banca || 'a definir')}</dd></div>
        </dl>
      </section>
      ${c.previsto ? KitFacil.ui.faixa({ tipo: 'alerta', html: `<b>Edital ainda não publicado.</b> ${ed && ed.resumoPrevisto ? esc(ed.resumoPrevisto.replace('Edital ainda não publicado. ', '')) : 'As disciplinas e as datas são estimativas.'}` }) : ''}

      <section aria-labelledby="ed-dt"><div class="sec-cab"><h2 class="sec-t" id="ed-dt">Datas importantes</h2></div>
        <div class="card">${fut.length ? `<ol class="datas">${fut.map(dataLin).join('')}</ol>` : '<p class="apoio">Nenhuma data pela frente.</p>'}
          ${pas.length ? `<details class="datas-passadas" data-kf-secao="grupo"><summary><b>Já passou</b></summary><ol class="datas">${pas.map(dataLin).join('')}</ol></details>` : ''}</div></section>

      <section aria-labelledby="di-t"><div class="sec-cab"><h2 class="sec-t" id="di-t">Disciplinas</h2><span class="apoio">${discs.length}</span></div>
        <div class="caderno">${emOrdemDisc(discs).map(d => { const m = materia(d.m), p = coberturaDisc(d), temAp = AP.has(d.m);
          return `<details class="disc" data-kf-secao="grupo" data-disc="${esc(d.m)}"><summary>${pontoCor(m)}<span class="disc-tx"><b>${esc(m.nome)}</b><small>${p.feitos} de ${p.n} concluídos${temAp ? '' : ' · sem apostila ainda'}</small>${barraHTML(p.pct, `${p.pct}% coberto`, 'grifada fina')}</span></summary>
            <div class="disc-corpo"><ul class="assuntos">${d.topicos.map(topico).filter(Boolean).map(t => `<li><button type="button" class="assunto ${t.teoria ? 'd2' : 'd0'}" data-act="assunto" data-id="${esc(t.id)}"><span class="as-marca" aria-hidden="true">${t.teoria ? I.check : ''}</span><span class="as-nome"><span class="${t.teoria ? 'grifo' : ''}">${esc(t.nome)}</span></span><span class="kf-so-leitor">. ${t.teoria ? 'Concluído' : 'Não lido'}</span>${I.seta}</button></li>`).join('')}</ul></div></details>`; }).join('')}</div></section>

      ${ed && (ed.fontes || ed.fatos) ? `<section aria-labelledby="ap-t"><div class="sec-cab"><h2 class="sec-t" id="ap-t">Sobre o concurso</h2></div><div class="card apoio-secoes">
        ${ed.fatos ? `<details data-kf-secao="grupo"><summary><b>Situação do concurso</b></summary><dl class="resumo">${ed.fatos.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>${ed.notaPesos ? `<p class="apoio">${esc(ed.notaPesos)}</p>` : ''}<p class="apoio">Conferido em ${fmtDataAno(ed.conferido)}. Confirme sempre no site oficial.</p></details>` : ''}
        ${ed.fontes ? `<details data-kf-secao="grupo"><summary><b>Fontes oficiais</b></summary><ul class="fontes">${ed.fontes.map(([t, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(t)}${I.fora}<span class="kf-so-leitor"> (abre em outra aba)</span></a></li>`).join('')}</ul></details>` : ''}
      </div></section>` : ''}`;
  },
  ligar(v) { ligarSeg($('#ed-conc', v), id => { editalConc = id; render(); }); },
};
// as disciplinas do edital na ordem da fila de leitura
const emOrdemDisc = L => L.map(d => { const t = topico(d.topicos[0]); return [t ? ordemDoAssunto(t) : 9e9, d]; }).sort((a, b) => a[0] - b[0]).map(x => x[1]);

/* a ficha do assunto: abre o capítulo (quando há apostila) e registra o que foi estudado por fora */
function assuntoFicha(tId) {
  const t = topico(tId); if (!t) return;
  const m = materia(t.m), a = apostilaDoAssunto(t.id), C = cartoesDe(t.id), dose = doseDe(t.id), px = C.map(c => c.due).sort()[0], h = hojeISO();
  abrirJanela({ titulo: t.nome, contexto: m ? m.nome : '',
    corpo: `<dl class="resumo">
        <div><dt>Situação</dt><dd>${t.volta ? 'Voltou para a fila' : t.teoria ? `Concluído em ${fmtData(iso(new Date(t.teoria)))}` : 'Não lido'}</dd></div>
        <div><dt>Apostila</dt><dd>${a ? `${esc(a.curto)}, capítulo ${a.ids.indexOf(t.id) + 1}` : 'ainda não escrita'}</dd></div>
        ${C.length ? `<div><dt>Cartões</dt><dd>${C.length} · ${px <= h ? 'há cartão para hoje' : 'próximo em ' + fmtData(px)}</dd></div>` : ''}
        ${dose ? `<div><dt>Lei seca</dt><dd>${t.lei ? 'lida' : 'não lida'}</dd></div>` : ''}
      </dl>
      ${a ? '' : '<p class="kf-ajuda">Estudou este assunto por outro material? Marque aqui, para o edital mostrar a cobertura certa.</p>'}
      <div class="kf-campo">${KitFacil.ui.fato({ marcado: !!t.teoria, marcar: 'Marcar como concluído', desmarcar: 'Desmarcar concluído', attrs: 'id="af-feito"' })}</div>`,
    pe: a ? `<button type="button" class="kf-btn kf-comecar" id="af-abrir">${I.livro}Abrir o capítulo</button>` : '',
    aoMontar: dl => {
      const ab = $('#af-abrir', dl); if (ab) ab.onclick = () => { fecharJanela(true); capituloAbrir(t.id); };
      $('#af-feito', dl).onclick = () => {
        const era = !!t.teoria, foto = fotoAssunto(t.id);
        // marcar por aqui não faz o dia valer: o que conta para a sequência é o capítulo lido no app ou a revisão
        if (era) { t.teoria = 0; t.lido = 0; t.reler = 0; t.volta = 0; t.lei = 0; DB.cartoes = DB.cartoes.filter(c => c.t !== t.id); VER++; } else { t.teoria = agora(); t.lido = t.teoria; cartoesAtivar(t.id); }
        salvar(); fecharJanela(true);
        avisar(era ? 'Assunto desmarcado. Os cartões dele saíram do baralho.' : 'Assunto concluído.', { label: 'Desfazer', run: () => voltarAssunto(t.id, foto) });
        if (!era) setTimeout(() => jogoConferir(), 700);
      };
    } });
}

/* ---------- Medalhas: a coleção, por família ---------- */
const medalhaBotao = (m, s, ganhas) => { const tem = ganhas.has(m.id), p = m.prog && !tem ? m.prog(s) : null;
  return `<li><button type="button" class="medalha ${tem ? 'tem' : ''}" data-act="medalha" data-id="${m.id}">${medalhaSVG(m, { apagada: !tem })}<span class="med-nome">${esc(m.nome)}</span>${p ? `<span class="med-prog">${nBR(p[0])}/${nBR(p[1])}</span>` : ''}<span class="kf-so-leitor">. ${METAL_NOME[m.metal]}. ${tem ? 'Na coleção' : 'Falta ganhar. ' + esc(m.como)}</span></button></li>`; };
const viewMedalhas = {
  html() {
    if (!jogoLigado()) return `${voltaMais()}${cab('Medalhas')}${KitFacil.ui.vazio({ titulo: 'Medalhas desligadas', texto: 'Ligue as medalhas e os níveis nos Ajustes.', acao: `<button type="button" class="kf-btn kf-pri" data-kf-ir="ajustes">Abrir os Ajustes</button>` })}`;
    const s = jogoEstado(), ganhas = new Set(s.ganhas), L = MEDALHAS;
    // as três mais perto de sair, pela parte já cumprida (uma por série)
    const visto = new Set(), perto = L.filter(m => !ganhas.has(m.id) && m.prog && !(m.serie && visto.has(m.serie)) && (m.serie ? visto.add(m.serie) : true)).map(m => { const p = m.prog(s); return { m, p, k: p[1] ? p[0] / p[1] : 0 }; }).sort((a, b) => b.k - a.k).slice(0, 3);
    const ult = DB.marcos.filter(x => String(x.id).startsWith('m:')).sort((a, b) => (b.em || 0) - (a.em || 0)).map(x => L.find(m => 'm:' + m.id === x.id)).filter(Boolean)[0];
    return `${voltaMais()}${cab('Medalhas', 'Dias seguidos, capítulos, conceitos lembrados e disciplina fechada.')}
      <div class="card nivel-card grande">${seloNivelHTML(s, true)}${nivelHTML(s)}</div>
      <section class="folha vitrine" aria-label="Coleção">
        <p class="vit-n"><span class="grifo">${s.ganhas.length}</span><small>de ${s.total} medalhas</small></p>
        <ul class="vit-metais">${METAL_ORDEM.map(k => { const T = L.filter(m => m.metal === k); return `<li>${medalhaSVG({ metal: k, fam: 'app', ic: 'estrela' })}<b>${METAL_NOME[k]}</b><small>${T.filter(m => ganhas.has(m.id)).length} de ${T.length}</small></li>`; }).join('')}</ul>
        ${ult ? `<button type="button" class="kf-btn kf-sec bloco" data-act="medalha" data-id="${ult.id}">Girar a última: ${esc(ult.nome)}</button>` : ''}
      </section>
      ${perto.length ? `<section aria-labelledby="me-p"><div class="sec-cab"><h2 class="sec-t" id="me-p">Quase lá</h2></div><ul class="card lista">${perto.map(({ m, p }) => `<li><button type="button" class="lin" data-act="medalha" data-id="${m.id}"><span class="med-mini">${medalhaSVG(m, { apagada: true })}</span><span class="lin-tx"><b>${esc(m.nome)}</b><small>${esc(m.como)}</small>${barraHTML(p[0] / p[1] * 100, `${nBR(p[0])} de ${nBR(p[1])}`, 'fina')}</span><span class="ld-n">${nBR(p[0])}/${nBR(p[1])}</span></button></li>`).join('')}</ul></section>` : ''}
      ${Object.entries(FAMILIAS).map(([f, nome]) => { const T = L.filter(m => m.fam === f); if (!T.length) return '';
        return `<section aria-labelledby="me-${f}"><div class="sec-cab"><h2 class="sec-t" id="me-${f}">${nome}</h2><span class="apoio">${T.filter(m => ganhas.has(m.id)).length} de ${T.length}</span></div><ul class="medalhas">${T.map(m => medalhaBotao(m, s, ganhas)).join('')}</ul></section>`; }).join('')}`;
  },
};

/* ---------- Resumo semanal: o registro do que foi feito, sem meta ---------- */
const viewSemanas = {
  html() {
    const atual = segundaDe(hojeISO()), W = Array.from({ length: 12 }, (_, i) => resumoSemana(maisDias(atual, -7 * i))).filter((r, i) => i === 0 || !r.vazio);
    const nome = r => r.seg === atual ? 'Esta semana' : r.seg === maisDias(atual, -7) ? 'Semana passada' : `${fmtData(r.seg)} a ${fmtData(maisDias(r.seg, 6))}`;
    const topo = `${voltaMais()}${cab('Resumo semanal', 'O que você fez em cada semana. É registro, não é meta.')}`;
    if (W.every(r => r.vazio)) return `${topo}${KitFacil.ui.vazio({ titulo: 'Sua primeira semana começa agora', texto: 'Cada capítulo concluído e cada cartão respondido entram aqui.', acao: `<button type="button" class="kf-btn kf-comecar" data-act="estudar-proximo">${I.play}Ler agora</button>` })}`;
    return `${topo}<ul class="card lista semanas">${W.map(r => `<li class="sem-lin"><b>${nome(r)}</b>${r.vazio ? '<span class="apoio">Ainda em branco.</span>' : `<dl class="resumo"><div><dt>Capítulos concluídos</dt><dd>${r.cap}</dd></div><div><dt>Cartões respondidos</dt><dd>${r.car}</dd></div><div><dt>Doses de lei seca</dt><dd>${r.lei}</dd></div><div><dt>Dias que valeram</dt><dd>${r.dias}</dd></div></dl>`}</li>`).join('')}</ul>`;
  },
};

/* ---------- Mais ---------- */
const viewMais = {
  html() {
    const A = concursosAtivos(), sem = resumoSemana();
    return `${cab('Mais')}${KitFacil.nav.mais({ linhas: [
      { id: 'edital', titulo: 'Edital', texto: A.length ? A.map(c => `${c.sigla}: ${cobertura(c).pct}% coberto`).join(' · ') : 'Cobertura, contagem e datas', icone: I.plano },
      ...(jogoLigado() ? [{ id: 'medalhas', titulo: 'Medalhas', texto: (s => `Nível ${s.nivel} · ${s.ganhas.length} de ${s.total} medalhas`)(jogoEstado()), icone: I.medalha }] : []),
      { id: 'semanas', titulo: 'Resumo semanal', texto: sem.vazio ? 'O que você fez em cada semana' : `Esta semana: ${fraseSemana(sem) || plural(sem.dias, 'dia de estudo', 'dias de estudo')}`, icone: I.agenda },
      { id: 'leis', titulo: 'Leis', texto: `${LEIS.length} normas dos editais, na íntegra`, icone: I.lei },
      { id: 'discursivas', titulo: 'Discursiva', texto: `${DISCURSIVAS.length} temas, com o que a banca espera`, icone: I.lapis },
    ] })}`;
  },
};
