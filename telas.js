/* Estudo Fácil · telas: Hoje, Plano, Evolução, Mais e as telas de dentro de Mais (Concursos, Disciplinas, Revisões,
   Simulados e Agenda). Cada tela tem html() e, se precisar, ligar(v); os toques saem por data-act (ACOES, em casca.js). */
"use strict";

/* ---------- peças comuns ---------- */
const cab = (t, sub) => `<header class="tela-cab"><h1 class="tela-t">${esc(t)}</h1>${sub ? `<p class="tela-sub">${sub}</p>` : ''}</header>`;
const voltaMais = () => `<button type="button" class="volta" data-kf-ir="mais">${I.volta}<span>Mais</span></button>`;
const barraHTML = (p, rotulo, cls = '') => `<span class="barra ${cls}" role="img" aria-label="${esc(rotulo)}"><i style="width:${clamp(p, 0, 100)}%"></i></span>`;
const pontoCor = m => `<span class="ponto-cor" style="background:${m && /^#[0-9a-f]{6}$/i.test(m.cor) ? m.cor : '#888888'}" aria-hidden="true"></span>`;
function anelHTML(v, de, { tam = 132, traco = 12, centro = '' } = {}) {
  const r = (tam - traco) / 2, C = 2 * Math.PI * r, k = de ? clamp(v / de, 0, 1) : 0;
  return `<span class="anel ${k >= 1 ? 'cheio' : ''}" style="width:${tam}px;height:${tam}px"><svg viewBox="0 0 ${tam} ${tam}" aria-hidden="true"><circle class="anel-trilho" cx="${tam / 2}" cy="${tam / 2}" r="${r}" stroke-width="${traco}"/><circle class="anel-arco" cx="${tam / 2}" cy="${tam / 2}" r="${r}" stroke-width="${traco}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - k)).toFixed(1)}" transform="rotate(-90 ${tam / 2} ${tam / 2})"/></svg><span class="anel-centro">${centro}</span></span>`;
}
const saudacao = () => { const h = new Date().getHours(), n = primeiroNome(cfg().nome); return (h < 5 ? 'Boa noite' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite') + (n ? ', ' + esc(n) : ''); };
function contagem(c) {
  if (!c || !c.dataProva) return null;
  const n = entreDias(hojeISO(), c.dataProva);
  return { n, texto: n > 1 ? `Faltam ${n} dias` : n === 1 ? 'Falta 1 dia' : n === 0 ? 'A prova é hoje' : 'Prova feita', estimada: !!c.previsto };
}

/* ---------- Hoje ---------- */
function tiraSemana() {
  const h = hojeISO(), S = sequencia(), dom = maisDias(h, -deISO(h).getDay()), feitos = idx().dias, rotina = new Set(cfg().dias);
  return `<ol class="semana" aria-label="Esta semana">${[0, 1, 2, 3, 4, 5, 6].map(i => {
    const d = maisDias(dom, i), ok = feitos.has(d), prot = S.protegidos.has(d), hoje = d === h, fut = d > h, folga = !rotina.has(i);
    const est = ok ? 'feito' : prot ? 'protegido' : hoje ? 'hoje' : fut ? 'futuro' : folga ? 'folga' : 'falta';
    const fala = ok ? 'meta batida' : prot ? 'salvo por uma folga' : hoje ? 'hoje, em andamento' : fut ? '' : folga ? 'dia de descanso' : 'sem estudo';
    return `<li class="dia ${est}${hoje ? ' atual' : ''}"><span class="dia-l" aria-hidden="true">${SEMANA[i][0].toUpperCase()}</span><span class="dia-m" aria-hidden="true">${ok ? I.check : prot ? I.escudo : ''}</span><span class="kf-so-leitor">${SEMANA_L[i]}${fala ? ': ' + fala : ''}</span></li>`;
  }).join('')}</ol>`;
}
const linhaPlano = (it, i) => {
  const n = nomeItem(it), rot = it.tipo === 'revisao' ? `Revisão${it.atraso > 0 ? ` · ${plural(it.atraso, 'dia', 'dias')} de atraso` : ''}` : `${TIPOS[it.tipo]} · ${it.nq ? plural(it.nq, 'item', 'itens') : it.min + ' min'}`;
  return `<li class="pl-item ${it.feito ? 'feito' : ''}"><span class="pl-marca" aria-hidden="true">${it.feito ? I.check : it.tipo === 'revisao' ? I.revisar : I.livro}</span>
    <span class="pl-tx"><b>${it.feito ? `<span class="grifo">${esc(n.t)}</span>` : esc(n.t)}</b><small>${esc(n.m)} · ${rot}${it.feito ? ' · feito' : ''}</small></span>
    ${it.feito ? '' : `<button type="button" class="btn-ic comecar" data-act="estudar-item" data-i="${i}" aria-label="Estudar ${esc(n.t)}">${I.play}</button>`}</li>`;
};
// Hoje: o desafio do dia, os flashcards que venceram e o treino livre
function centralQuestoes() {
  if (!QUESTOES.some(q => topico(q.t))) return '';
  const D = desafioDoDia(), fc = flashcardsDeHoje().length, feitas = DB.respostas.filter(r => QID.has(r.id)).length;
  const lin = (act, ic, t, sub, selo = '') => `<li><button type="button" class="lin" data-act="${act}"><span class="lin-ic">${ic}</span><span class="lin-tx"><b>${t}</b><small>${sub}</small></span>${selo}${I.seta}</button></li>`;
  return `<section aria-labelledby="cq-t"><div class="sec-cab"><h2 class="sec-t" id="cq-t">Questões</h2><span class="apoio">${feitas} de ${QUESTOES.length} respondidas</span></div>
    <ul class="card lista central-q">
      ${lin('desafio', I.raio, 'Desafio do dia', D.feito ? 'Feito hoje. Amanhã tem outro.' : '10 itens sorteados · bônus de pontos', D.feito ? `<span class="etiqueta ok">${I.check}Feito</span>` : '')}
      ${lin('flashcards', I.revisar, 'Flashcards', fc ? `${plural(fc, 'item que você errou volta', 'itens que você errou voltam')} hoje` : 'Nenhum para hoje. Eles nascem dos seus erros.', fc ? `<span class="etiqueta">${fc}</span>` : '')}
      ${lin('treino-livre', I.questoes, 'Treino livre', '10 itens: primeiro os que você errou, depois os novos')}
      <li><button type="button" class="lin" data-kf-ir="provas"><span class="lin-ic">${I.simulado}</span><span class="lin-tx"><b>Provas do Cebraspe</b><small>${PROVAS.length} cadernos oficiais, com gabarito e comentário</small></span>${I.seta}</button></li>
    </ul></section>`;
}
const viewHoje = {
  html() {
    const c = concursoFoco(), P = planoDoDia(), S = sequencia(), M = missoes(), s = jogoEstado(), ct = contagem(c), fase = faseAtual(c);
    const min = Math.floor(P.minutos), falta = Math.max(0, Math.ceil(P.meta - P.minutos)), px = P.proximo || sugestaoExtra(), nx = px && nomeItem(px);
    const estado = S.hojeFeito ? (S.n > 1 ? `Meta batida. São <b>${S.n} dias</b> seguidos.` : 'Meta batida. A sequência começou.')
      : S.n > 0 ? `Faltam <b>${fmtMin(falta)}</b> para manter os ${plural(S.n, 'dia', 'dias')} de sequência.`
      : min > 0 ? `Faltam <b>${fmtMin(falta)}</b> para bater a meta de hoje.` : `Estude <b>${fmtMin(P.meta)}</b> hoje e comece uma sequência.`;
    const proxima = jogoLigado() ? medalhasDoApp().find(m => !s.ganhas.includes(m.id)) : null;
    const vazio = !DB.materias.some(m => topicosDe(m.id).length);
    return `${cab('Hoje', `${saudacao()}.${ct && ct.n >= 0 ? ` ${ct.texto} para a prova${c ? ' da ' + esc(c.sigla) : ''}${ct.estimada ? ' (data estimada)' : ''}.` : ''}`)}
      ${c && c.previsto && c.dataEdital && hojeISO() > c.dataEdital ? KitFacil.ui.faixa({ tipo: 'alerta', html: `<b>O edital da ${esc(c.sigla)} já saiu?</b> O prazo previsto passou. Atualize a banca, as datas e as disciplinas.`, acao: `<button type="button" class="kf-btn kf-sec" data-act="abrir-concurso" data-id="${esc(c.id)}">Atualizar o concurso</button>` }) : ''}
      ${vazio ? KitFacil.ui.vazio({ titulo: 'Nenhum concurso ainda', texto: 'Adicione um concurso da biblioteca ou cadastre as suas disciplinas. O plano de cada dia aparece aqui.', acao: `<button type="button" class="kf-btn kf-pri" data-kf-ir="concursos">Adicionar concurso</button>` }) : `
      <section class="folha hoje-folha" aria-label="Meta e sequência">
        <div class="hf-seq"><span class="hf-chama">${chamaHTML(S.hojeFeito)}</span><span class="hf-seq-tx"><b><span class="hf-n">${S.n}</span> ${S.n === 1 ? 'dia seguido' : 'dias seguidos'}</b><small>${S.folgas ? `${plural(S.folgas, 'folga guardada', 'folgas guardadas')}` : 'Sem folga guardada'} · recorde ${S.recorde}</small></span>
          <button type="button" class="btn-ic" data-act="sobre-sequencia" aria-label="Como funciona a sequência">${I.questoes}</button></div>
        ${tiraSemana()}
        <div class="hf-meta">${anelHTML(P.minutos, P.meta, { centro: `<b>${min}</b><small>de ${P.meta} min</small>` })}
          <div class="hf-meta-tx"><p class="hf-estado" role="status">${estado}</p>
            ${nx ? `<p class="hf-prox"><span class="rotulo-mini">${P.proximo ? 'Próximo' : 'Para adiantar'}</span>${esc(nx.t)}<small>${esc(nx.m)}</small></p>` : ''}</div></div>
        <button type="button" class="kf-btn kf-comecar bloco" id="hoje-estudar" data-act="estudar-proximo">${I.play}${DB.ativa ? 'Voltar ao foco' : min > 0 ? 'Continuar estudando' : 'Estudar agora'}</button>
      </section>

      ${centralQuestoes()}

      <section class="card" aria-labelledby="mis-t"><div class="sec-cab"><h2 class="sec-t" id="mis-t">Missões de hoje</h2><span class="apoio">${M.feitas} de ${M.lista.length}</span></div>
        <ul class="missoes">${M.lista.map(m => `<li class="missao ${m.ok ? 'ok' : ''}"><span class="mi-ic" aria-hidden="true">${m.ok ? I.check : I[m.ic]}</span><span class="mi-tx"><b>${esc(m.nome)}</b>${barraHTML(m.v / m.de * 100, `${Math.floor(m.v)} de ${m.de}`)}</span><span class="mi-n" aria-hidden="true">${Math.floor(m.v)}/${m.de}</span></li>`).join('')}</ul>
        ${M.perfeito ? `<p class="mis-perfeito"><span class="grifo">Dia perfeito.</span> As missões de hoje estão cumpridas.</p>` : ''}</section>

      <section aria-labelledby="pl-t"><div class="sec-cab"><h2 class="sec-t" id="pl-t">Plano de hoje</h2><button type="button" class="kf-btn kf-link" data-kf-ir="plano">Ver o plano</button></div>
        <ul class="card lista plano-hoje" data-kf-morf="plano">${P.itens.length ? P.itens.map(linhaPlano).join('') : '<li class="pl-vazio">Nada marcado para hoje. Escolha um assunto em Estudar.</li>'}</ul>
        ${P.revisoesAMais ? `<button type="button" class="kf-btn kf-link" data-kf-ir="revisoes">Ver mais ${plural(P.revisoesAMais, 'revisão vencida', 'revisões vencidas')}</button>` : ''}</section>

      ${c ? `<button type="button" class="card conc-card" data-kf-ir="plano"><span class="cc-topo"><b>${esc(c.sigla)}</b>${fase ? `<span class="etiqueta">${esc(fase.nome)}</span>` : ''}</span><span class="cc-cargo">${esc(c.cargo || '')}</span>
        <span class="cc-pront"><span>Prontidão para a prova</span><b>${prontidao(c)}%</b></span>${barraHTML(prontidao(c), `Prontidão: ${prontidao(c)}%`, 'grifada')}
        <span class="kf-so-leitor">. Ver o plano</span></button>` : ''}
      ${DB.sessoes.length ? `<button type="button" class="kf-btn kf-link" data-kf-ir="evolucao">Ver a sua evolução</button>` : ''}

      ${jogoLigado() ? `<button type="button" class="card nivel-card" data-act="ver-medalhas"><span class="kf-so-leitor">Nível ${s.nivel}: </span>${seloNivelHTML(s)}${nivelHTML(s)}
        ${proxima ? `<span class="nivel-prox"><span class="med-mini">${medalhaSVG(proxima, { apagada: true })}</span><span><small>Próxima medalha</small><b>${esc(proxima.nome)}</b></span></span>` : ''}<span class="kf-so-leitor">. ${s.ganhas.length} de ${s.total} medalhas. Ver a coleção</span></button>` : ''}`}`;
  },
};

/* ---------- Plano: o edital como caderno ---------- */
let planoConc = null;
const viewPlano = {
  html() {
    const A = concursosAtivos(), c = A.find(x => x.id === planoConc) || concursoFoco();
    if (!c) return `${cab('Plano', 'O edital vira caderno: cada assunto estudado fica grifado.')}${KitFacil.ui.vazio({ titulo: 'Nenhum concurso em estudo', texto: 'Adicione um concurso para ver o edital, as fases e o que falta estudar.', acao: `<button type="button" class="kf-btn kf-pri" data-kf-ir="concursos">Adicionar concurso</button>` })}`;
    const ed = editalDaBiblioteca(c), ct = contagem(c), fase = faseAtual(c), F = fatias(c, { fase: false }), pr = prontidao(c);
    const discs = c.disc.filter(d => materia(d.m)).slice().sort((a, b) => (a.fora ? 1 : 0) - (b.fora ? 1 : 0) || (F.get(b.m) || 0) - (F.get(a.m) || 0));
    const nT = soma(discs.filter(d => !d.fora), d => d.topicos.length), nV = soma(discs.filter(d => !d.fora), d => progressoDisc(d).vistos);
    return `${cab('Plano', 'O edital vira caderno: cada assunto estudado fica grifado.')}
      ${A.length > 1 ? `<div class="kf-campo"><label class="kf-rotulo" for="pl-conc">Concurso</label><select id="pl-conc" class="kf-entrada">${A.map(x => `<option value="${esc(x.id)}" ${x.id === c.id ? 'selected' : ''}>${esc(x.sigla)}</option>`).join('')}</select></div>` : ''}
      <section class="folha plano-capa" aria-label="${esc(c.sigla)}">
        <span class="rotulo-mini">${esc(c.orgao || c.sigla)}</span><h2 class="capa-t">${esc(c.cargo || c.sigla)}</h2>
        <div class="capa-pront"><span class="capa-n"><span class="grifo">${pr}%</span></span><span class="capa-tx"><b>de prontidão</b><small>${nV} de ${plural(nT, 'assunto estudado', 'assuntos estudados')}</small></span></div>
        ${barraHTML(pr, `Prontidão: ${pr}%`, 'grifada alta')}
        <dl class="resumo">
          <div><dt>Prova</dt><dd>${c.dataProva ? `${fmtDataAno(c.dataProva)}${c.previsto ? ' (estimada)' : ''}` : 'sem data'}</dd></div>
          ${ct && ct.n >= 0 ? `<div><dt>Contagem</dt><dd>${ct.texto.replace('Faltam ', '').replace('Falta ', '')}</dd></div>` : ''}
          <div><dt>Banca</dt><dd>${esc(c.banca || 'a definir')}</dd></div>
          ${fase ? `<div><dt>Fase do plano</dt><dd>${esc(fase.nome)}</dd></div>` : ''}
        </dl>
      </section>
      ${c.previsto ? KitFacil.ui.faixa({ tipo: 'alerta', html: `<b>Edital ainda não publicado.</b> ${ed && ed.resumoPrevisto ? esc(ed.resumoPrevisto.replace('Edital ainda não publicado. ', '')) : 'As disciplinas e os pesos são estimativas.'}`, acao: `<button type="button" class="kf-btn kf-sec" data-act="abrir-concurso" data-id="${esc(c.id)}">Atualizar pelo edital</button>` }) : ''}

      ${ed && ed.fases ? `<section aria-labelledby="fa-t"><div class="sec-cab"><h2 class="sec-t" id="fa-t">Fases até a prova</h2></div>
        <div class="card fases">${ed.fases.map((f, i) => { const at = fase && fase.id === f.id, ja = fase && fase.i > i;
          return `<details class="fase ${at ? 'atual' : ja ? 'passou' : ''}" data-kf-secao="grupo" ${at ? 'open' : ''}><summary><span class="fase-n" aria-hidden="true">${ja ? I.check : i + 1}</span><span class="fase-tx"><b>${esc(f.nome)}</b><small>${esc(f.ate)}${at ? ' · você está aqui' : ''}</small></span></summary>
            <div class="fase-corpo"><p>${esc(f.foco)}</p><ul>${f.metas.map(m => `<li>${esc(m)}</li>`).join('')}</ul></div></details>`; }).join('')}</div></section>` : ''}

      <section aria-labelledby="di-t"><div class="sec-cab"><h2 class="sec-t" id="di-t">Disciplinas</h2><span class="apoio">${discs.filter(d => !d.fora).length} no plano</span></div>
        <div class="caderno">${discs.map(d => { const m = materia(d.m), p = progressoDisc(d), w = Math.round((F.get(d.m) || 0) * 100);
          return `<details class="disc ${d.fora ? 'fora' : ''}" data-kf-secao="grupo" data-disc="${esc(d.m)}"><summary>${pontoCor(m)}<span class="disc-tx"><b>${esc(m.nome)}</b><small>${d.fora ? 'fora do plano' : `${w}% da prova`} · ${p.vistos} de ${p.n} estudados</small>${barraHTML(p.pct, `${p.pct}% de domínio`, 'grifada fina')}</span></summary>
            <div class="disc-corpo">${m.dica ? `<p class="disc-dica">${I.marca}<span>${esc(m.dica)}</span></p>` : ''}
              <ul class="assuntos">${d.topicos.map(topico).filter(Boolean).map(t => { const dm = dominio(t); return `<li><button type="button" class="assunto d${dm}" data-act="assunto" data-id="${esc(t.id)}">${grifoHTML(dm, false)}<span class="as-nome"><span class="${dm >= 2 ? 'grifo g' + dm : ''}">${esc(t.nome)}</span></span><span class="kf-so-leitor">. ${DOMINIOS[dm]}</span>${I.seta}</button></li>`; }).join('')}</ul></div></details>`; }).join('')}</div></section>

      ${ed && (ed.semana || ed.fontes || ed.fatos) ? `<section aria-labelledby="ap-t"><div class="sec-cab"><h2 class="sec-t" id="ap-t">Apoio</h2></div><div class="card apoio-secoes">
        ${ed.semana ? `<details data-kf-secao="grupo"><summary><b>Semana modelo</b></summary><ul class="lista-simples">${ed.semana.map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>` : ''}
        ${ed.fatos ? `<details data-kf-secao="grupo"><summary><b>Situação do concurso</b></summary><dl class="resumo">${ed.fatos.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl><p class="apoio">Conferido em ${fmtDataAno(ed.conferido)}. Confirme sempre no site oficial.</p></details>` : ''}
        ${ed.fontes ? `<details data-kf-secao="grupo"><summary><b>Fontes oficiais</b></summary><ul class="fontes">${ed.fontes.map(([t, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(t)}${I.fora}<span class="kf-so-leitor"> (abre em outra aba)</span></a></li>`).join('')}</ul></details>` : ''}
      </div></section>` : ''}`;
  },
  ligar(v) { $('#pl-conc', v)?.addEventListener('change', e => { planoConc = e.target.value; render(); }); },
};

/* ---------- Evolução: desempenho ---------- */
const semanas = n => { const h = hojeISO(), seg = maisDias(h, -((deISO(h).getDay() + 6) % 7)); return Array.from({ length: n }, (_, i) => maisDias(seg, -7 * (n - 1 - i))); };
function barrasSVG(vals, rotulos, fmt, titulo) {
  const W = 320, H = 150, n = vals.length, max = Math.max(1, ...vals), bw = W / n * .56, passo = W / n;
  return `<svg class="grafico" viewBox="0 0 ${W} ${H + 22}" role="img" aria-label="${esc(titulo + ': ' + vals.map((v, i) => `${rotulos[i]}, ${fmt(v)}`).join('; '))}">
    <line x1="0" y1="${H}" x2="${W}" y2="${H}" class="g-eixo"/>
    ${vals.map((v, i) => { const h = Math.max(v ? 3 : 0, v / max * (H - 26)), x = i * passo + (passo - bw) / 2; return `<rect class="g-barra ${i === n - 1 ? 'atual' : ''}" x="${x.toFixed(1)}" y="${(H - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="5"/>${v ? `<text class="g-valor" x="${(x + bw / 2).toFixed(1)}" y="${(H - h - 6).toFixed(1)}">${fmt(v)}</text>` : ''}<text class="g-rot" x="${(x + bw / 2).toFixed(1)}" y="${H + 16}">${rotulos[i]}</text>`; }).join('')}</svg>`;
}
function linhaSVG(vals, rotulos, titulo, sufixo = '%') {
  const W = 320, H = 120, teto = Math.min(100, Math.max(10, ...vals.filter(v => v != null)) * 1.15);
  const pts = vals.map((v, i) => v == null ? null : [vals.length > 1 ? 14 + i * (W - 28) / (vals.length - 1) : W / 2, H - 14 - (clamp(v, 0, teto) / teto) * (H - 38)]);
  const vivos = pts.filter(Boolean), d = vivos.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  return `<svg class="grafico" viewBox="0 0 ${W} ${H + 22}" role="img" aria-label="${esc(titulo + ': ' + vals.map((v, i) => v == null ? null : `${rotulos[i]}, ${v}${sufixo}`).filter(Boolean).join('; '))}">
    <line x1="0" y1="${H - 14}" x2="${W}" y2="${H - 14}" class="g-eixo"/>${vivos.length > 1 ? `<path class="g-linha" d="${d}"/>` : ''}
    ${pts.map((p, i) => p ? `<circle class="g-ponto ${i === pts.length - 1 ? 'atual' : ''}" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4.500"/>${i === pts.length - 1 || i === pts.findIndex(Boolean) ? `<text class="g-valor" x="${p[0].toFixed(1)}" y="${(p[1] - 10).toFixed(1)}">${vals[i]}${sufixo}</text>` : ''}` : '').join('')}
    ${rotulos.map((r, i) => (i === 0 || i === rotulos.length - 1) ? `<text class="g-rot" x="${(vals.length > 1 ? 14 + i * (W - 28) / (vals.length - 1) : W / 2).toFixed(1)}" y="${H + 16}" text-anchor="${i === 0 ? 'start' : 'end'}">${r}</text>` : '').join('')}</svg>`;
}
function calorHTML() {
  const h = hojeISO(), ini = maisDias(maisDias(h, -((deISO(h).getDay() + 6) % 7)), -7 * 11), meta = cfg().metaMin, cols = [];
  for (let w = 0; w < 12; w++) { const col = []; for (let d = 0; d < 7; d++) { const dia = maisDias(ini, w * 7 + d), min = minutosDoDia(dia); col.push({ dia, min, n: dia > h ? -1 : !min ? 0 : min >= meta ? 3 : min >= meta / 2 ? 2 : 1 }); } cols.push(col); }
  const dias = cols.flat().filter(c => c.n >= 0), com = dias.filter(c => c.n > 0).length;
  return `<div class="calor" role="img" aria-label="Últimas 12 semanas: estudo em ${com} de ${dias.length} dias; meta batida em ${dias.filter(c => c.n === 3).length}.">${cols.map(col => `<span class="calor-col">${col.map(c => `<i class="c${c.n}" title="${fmtDataCurta(c.dia)}: ${c.n < 0 ? '' : fmtMin(c.min)}"></i>`).join('')}</span>`).join('')}</div>
    <p class="calor-leg" aria-hidden="true"><span>menos</span><i class="c0"></i><i class="c1"></i><i class="c2"></i><i class="c3"></i><span>meta batida</span></p>`;
}
const viewEvolucao = {
  html() {
    const s = jogoEstado(), topo = `${jogoLigado() ? voltaMais() : ''}${cab('Evolução', 'Quanto você já avançou, e por onde seguir.')}`;
    const c = concursoFoco(), T = totais(), S = sequencia(), W = semanas(8), fimSem = w => deISO(maisDias(w, 7)).getTime();
    const hSem = W.map(w => { let m = 0; for (let i = 0; i < 7; i++) m += minutosDoDia(maisDias(w, i)); return Math.round(m / 6) / 10; });
    const aSem = W.map(w => { const a = acertosDe(x => x.ini < fimSem(w), deISO(w).getTime()); return a.tot >= 5 ? a.pct : null; });
    const rot = W.map(fmtDataCurta), geral = acertosDe();
    const pr = c ? prontidao(c) : 0, pr30 = c ? prontidao(c, agora() - 30 * DIA) : 0, pSem = c ? W.map(w => prontidao(c, Math.min(agora(), fimSem(w)))) : [];
    const porDisc = DB.materias.map(m => ({ m, ...acertosDe(x => x.m === m.id) })).filter(x => x.tot >= 5).sort((a, b) => a.pct - b.pct);
    const ult = [...DB.sessoes].sort((a, b) => b.ini - a.ini).slice(0, 8);
    if (!T.sessoes) return `${topo}${jogoLigado() ? `<div class="card nivel-card grande">${seloNivelHTML(s, true)}${nivelHTML(s)}</div>` : ''}${KitFacil.ui.vazio({ titulo: 'Sua evolução aparece aqui', texto: 'Depois da primeira sessão, você vê as horas por semana, os acertos e quanto do edital já está grifado.', acao: `<button type="button" class="kf-btn kf-comecar" data-act="estudar-proximo">${I.play}Estudar agora</button>` })}`;
    return `${topo}
      ${jogoLigado() ? `<div class="card nivel-card grande">${seloNivelHTML(s, true)}${nivelHTML(s)}</div>` : ''}
      ${c ? `<section class="card" aria-labelledby="ev-pr"><h2 class="sec-t" id="ev-pr">Prontidão para a prova</h2>
        <p class="numero"><span class="grifo">${pr}%</span>${pr > pr30 ? `<small class="sobe">${I.sobe}${pr - pr30} ${pr - pr30 === 1 ? 'ponto' : 'pontos'} em 30 dias</small>` : ''}</p>
        <p class="apoio">Parte do edital da ${esc(c.sigla)} que você já domina, contando o peso de cada disciplina.</p>
        ${linhaSVG(pSem, rot, 'Prontidão por semana')}</section>` : ''}
      <section class="card" aria-labelledby="ev-co"><h2 class="sec-t" id="ev-co">Constância</h2>${calorHTML()}
        <dl class="resumo"><div><dt>Sequência atual</dt><dd>${plural(S.n, 'dia', 'dias')}</dd></div><div><dt>Maior sequência</dt><dd>${plural(S.recorde, 'dia', 'dias')}</dd></div><div><dt>Dias com a meta batida</dt><dd>${T.dias}</dd></div></dl></section>
      <section class="card" aria-labelledby="ev-ho"><h2 class="sec-t" id="ev-ho">Horas por semana</h2>${barrasSVG(hSem, rot, v => v.toLocaleString('pt-BR') + ' h', 'Horas de estudo por semana')}</section>
      <section class="card" aria-labelledby="ev-ac"><h2 class="sec-t" id="ev-ac">Acertos</h2>
        ${geral.tot ? `<p class="numero">${geral.pct}%<small>${geral.ac.toLocaleString('pt-BR')} de ${plural(geral.tot, 'questão', 'questões')}</small></p>${aSem.filter(v => v != null).length > 1 ? linhaSVG(aSem, rot, 'Acertos por semana') : ''}
          ${porDisc.length ? `<h3 class="sub-t">Por disciplina, da que mais precisa de atenção</h3><ul class="lista-disc">${porDisc.map(x => `<li>${pontoCor(x.m)}<span class="ld-tx"><b>${esc(x.m.nome)}</b>${barraHTML(x.pct, `${x.pct}% de acertos`, 'fina')}</span><span class="ld-n">${x.pct}%</span></li>`).join('')}</ul>` : ''}`
        : '<p class="apoio">Marque acertos e erros nas sessões para ver a sua taxa de acertos subir.</p>'}</section>
      <section class="card" aria-labelledby="ev-to"><h2 class="sec-t" id="ev-to">Totais</h2><dl class="resumo">
        <div><dt>Tempo de estudo</dt><dd>${fmtHoras(T.min)}</dd></div><div><dt>Sessões</dt><dd>${T.sessoes.toLocaleString('pt-BR')}</dd></div><div><dt>Questões resolvidas</dt><dd>${T.questoes.toLocaleString('pt-BR')}</dd></div>
        <div><dt>Assuntos grifados</dt><dd>${T.assuntos}</dd></div><div><dt>Flashcards revistos</dt><dd>${T.flash}</dd></div><div><dt>Revisões feitas</dt><dd>${T.revisoes}</dd></div>${jogoLigado() ? `<div><dt>Pontos</dt><dd>${s.xp.toLocaleString('pt-BR')}</dd></div>` : ''}</dl></section>
      <section aria-labelledby="ev-ul"><div class="sec-cab"><h2 class="sec-t" id="ev-ul">Últimas sessões</h2></div>
        <ul class="card lista">${ult.map(x => { const n = nomeItem(x); return `<li><button type="button" class="lin" data-act="sessao" data-id="${esc(x.id)}"><span class="lin-tx"><b>${esc(n.t)}</b><small>${fmtData(x.dia)} · ${TIPOS[x.tipo] || 'Estudo'} · ${fmtMin(Math.max(1, x.seg / 60))}${x.ac + x.er ? ` · ${x.ac}/${x.ac + x.er}` : ''}</small></span>${I.seta}</button></li>`; }).join('')}</ul></section>`;
  },
};
function sessaoFicha(id) {
  const x = DB.sessoes.find(s => s.id === id); if (!x) return; const n = nomeItem(x);
  abrirJanela({ titulo: n.t, contexto: n.m,
    corpo: `<dl class="resumo"><div><dt>Dia</dt><dd>${fmtData(x.dia)}</dd></div><div><dt>Tipo</dt><dd>${TIPOS[x.tipo] || 'Estudo'}${x.manual ? ' (lançado à mão)' : ''}</dd></div><div><dt>Tempo</dt><dd>${fmtMin(Math.max(1, x.seg / 60))}</dd></div><div><dt>Questões</dt><dd>${x.ac + x.er ? `${x.ac} de ${x.ac + x.er} certas` : 'nenhuma'}</dd></div></dl>`,
    pe: `<button type="button" class="kf-btn kf-perigo" id="sf-del">${I.lixo}Excluir sessão</button>`,
    aoMontar: d => { $('#sf-del', d).onclick = () => confirmar('Excluir a sessão?', 'O tempo e as questões desta sessão saem das suas contas. Medalhas já ganhas continuam.', 'Excluir sessão', () => { DB.sessoes = DB.sessoes.filter(s => s.id !== id); salvar(); fecharJanela(true); avisar('Sessão excluída.'); }); } });
}

/* ---------- Medalhas: a coleção, por família ---------- */
const medalhaBotao = (m, s, ganhas) => { const tem = ganhas.has(m.id), p = m.prog && !tem ? m.prog(s) : null;
  return `<li><button type="button" class="medalha ${tem ? 'tem' : ''}" data-act="medalha" data-id="${m.id}">${medalhaSVG(m, { apagada: !tem })}<span class="med-nome">${esc(m.nome)}</span>${p ? `<span class="med-prog">${nBR(p[0])}/${nBR(p[1])}</span>` : ''}<span class="kf-so-leitor">. ${METAL_NOME[m.metal]}. ${tem ? 'Na coleção' : 'Falta ganhar. ' + esc(m.como)}</span></button></li>`; };
const viewMedalhas = {
  html() {
    if (!jogoLigado()) return `${cab('Medalhas')}${KitFacil.ui.vazio({ titulo: 'Medalhas desligadas', texto: 'Ligue as medalhas, os níveis e as missões nos Ajustes.', acao: `<button type="button" class="kf-btn kf-pri" data-kf-ir="ajustes">Abrir os Ajustes</button>` })}`;
    const s = jogoEstado(), ganhas = new Set(s.ganhas), L = medalhasDoApp();
    // as três mais perto de sair, pela parte já cumprida
    const visto = new Set(), perto = L.filter(m => !ganhas.has(m.id) && m.prog && !(m.serie && visto.has(m.serie)) && (m.serie ? visto.add(m.serie) : true)).map(m => { const p = m.prog(s); return { m, p, k: p[1] ? p[0] / p[1] : 0 }; }).sort((a, b) => b.k - a.k).slice(0, 3);
    const ult = DB.marcos.filter(x => String(x.id).startsWith('m:')).sort((a, b) => (b.em || 0) - (a.em || 0)).map(x => L.find(m => 'm:' + m.id === x.id)).filter(Boolean)[0];
    return `${cab('Medalhas', 'Cada conquista do estudo entra na coleção.')}
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

/* ---------- Instrutor: as respostas que o Claude gravou no app ---------- */
const viewInstrutor = {
  html() {
    const R = respostasDoInstrutor();
    return `${voltaMais()}${cab('Instrutor', 'O Claude acompanha o seu estudo e responde às suas dúvidas.')}
      <section class="folha instrutor-capa"><ol class="passos">
          <li><b>Pergunte.</b> O app copia a questão e a sua dúvida.</li>
          <li><b>Cole no Claude.</b> No Projeto Estudo Fácil, a resposta sai na hora.</li>
          <li><b>Releia aqui.</b> O instrutor grava a resposta no app, junto da questão.</li></ol>
        <button type="button" class="kf-btn kf-pri bloco" data-act="perguntar" id="in-novo">Perguntar ao instrutor</button></section>
      <section aria-labelledby="in-r"><div class="sec-cab"><h2 class="sec-t" id="in-r">Respostas guardadas</h2><span class="apoio">${R.length}</span></div>
        ${R.length ? `<ul class="card lista respostas">${R.map(x => { const q = QID.get(x.id), t = q && topico(q.t); return `<li class="resp"><span class="rotulo-mini">${esc(x.em || '')}${t ? ' · ' + esc(t.nome) : ''}</span>${x.p ? `<p class="resp-p">${esc(x.p)}</p>` : ''}<p>${esc(x.r || '')}</p></li>`; }).join('')}</ul>`
          : KitFacil.ui.vazio({ titulo: 'Nenhuma resposta ainda', texto: 'Numa questão, toque em Perguntar ao instrutor. As respostas ficam guardadas aqui.' })}</section>`;
  },
};

/* ---------- Mais ---------- */
const viewMais = {
  html() {
    const rv = revisoesDeHoje().length, T = DB.topicos.length;
    const fc = flashcardsDeHoje().length, nR = respostasDoInstrutor().length;
    return `${cab('Mais')}${KitFacil.nav.mais({ linhas: [
      ...(jogoLigado() ? [{ id: 'evolucao', titulo: 'Evolução', texto: 'Prontidão, constância, horas e acertos', icone: I.evolucao }] : []),
      { id: 'provas', titulo: 'Provas do Cebraspe', texto: `${PROVAS.length} cadernos oficiais, com gabarito e comentário`, icone: I.simulado },
      { id: 'discursivas', titulo: 'Discursiva', texto: `${DISCURSIVAS.length} temas, com o que a banca espera`, icone: I.lapis },
      { id: 'instrutor', titulo: 'Instrutor', texto: nR ? plural(nR, 'resposta guardada', 'respostas guardadas') : 'Leve as suas dúvidas ao Claude', icone: I.balao },
      { titulo: 'Flashcards', texto: fc ? `${plural(fc, 'item para rever hoje', 'itens para rever hoje')}` : 'Nenhum para hoje', icone: I.cartas, attrs: 'data-act="flashcards" id="ma-flash"' },
      { id: 'concursos', titulo: 'Concursos', texto: DB.concursos.length ? `${plural(concursosAtivos().length, 'em estudo', 'em estudo')} de ${DB.concursos.length}` : 'Adicione o seu concurso', icone: I.concurso },
      { id: 'disciplinas', titulo: 'Disciplinas', texto: `${plural(DB.materias.length, 'disciplina', 'disciplinas')} e ${plural(T, 'assunto', 'assuntos')}`, icone: I.disciplinas },
      { id: 'revisoes', titulo: 'Revisões', texto: rv ? `${plural(rv, 'revisão para hoje', 'revisões para hoje')}` : 'Nenhuma revisão para hoje', icone: I.revisar },
      { id: 'simulados', titulo: 'Simulados', texto: DB.simulados.length ? plural(DB.simulados.length, 'simulado registrado', 'simulados registrados') : 'Registre o resultado e veja a nota', icone: I.simulado },
      { id: 'agenda', titulo: 'Agenda', texto: 'As datas do concurso e os seus compromissos', icone: I.agenda },
      { titulo: 'Ver o guia', texto: 'O app faz cada passo na tela e explica', icone: I.livro, attrs: 'id="ma-guia" data-act="guia"' },
    ] })}`;
  },
};

/* ---------- Concursos ---------- */
const SITUACOES = { ativo: 'Estudando', espera: 'Em espera', encerrado: 'Encerrado' };
const viewConcursos = {
  html() {
    return `${voltaMais()}${cab('Concursos', 'Os editais que você acompanha. O plano junta os que estão em estudo.')}
      ${DB.concursos.length ? `<ul class="card lista">${DB.concursos.map(c => { const ct = contagem(c); return `<li><button type="button" class="lin" data-act="abrir-concurso" data-id="${esc(c.id)}"><span class="lin-ic">${I.concurso}</span><span class="lin-tx"><b>${esc(c.sigla)}</b><small>${esc(c.cargo || '')}</small><small>${SITUACOES[c.situacao] || ''}${ct ? ' · ' + (ct.n >= 0 ? ct.texto.toLowerCase() : 'prova feita') : ''}${c.previsto ? ' · edital previsto' : ''}</small></span>${I.seta}</button></li>`; }).join('')}</ul>`
        : KitFacil.ui.vazio({ titulo: 'Nenhum concurso ainda', texto: 'Adicione um edital pronto da biblioteca ou digite o seu.' })}
      ${KitFacil.ui.adicionar({ rotulo: 'Novo concurso', attrs: 'data-act="novo-concurso" id="conc-novo"' })}`;
  },
};
let concId = null;
const viewConcurso = {
  html() {
    const c = DB.concursos.find(x => x.id === concId); if (!c) return viewConcursos.html();
    const F = fatias(c, { fase: false }), G = c.prova.grupos || [];
    return `<button type="button" class="volta" data-kf-ir="concursos">${I.volta}<span>Concursos</span></button>${cab(c.sigla, esc(c.cargo || ''))}
      ${c.previsto ? KitFacil.ui.faixa({ tipo: 'alerta', html: '<b>Edital previsto.</b> Quando o edital sair, ajuste a banca, as datas, as áreas e os itens de cada disciplina.', acao: `<button type="button" class="kf-btn kf-sec" data-act="edital-saiu">Marcar edital como publicado</button>` }) : ''}
      <section class="card"><div class="sec-cab"><h2 class="sec-t">Dados</h2><button type="button" class="kf-btn kf-link" data-act="editar-concurso">Editar</button></div><dl class="resumo">
        <div><dt>Situação</dt><dd>${SITUACOES[c.situacao]}</dd></div><div><dt>Órgão</dt><dd>${esc(c.orgao || c.sigla)}</dd></div><div><dt>Banca</dt><dd>${esc(c.banca || 'a definir')}</dd></div>
        ${c.previsto ? `<div><dt>Edital previsto até</dt><dd>${c.dataEdital ? fmtData(c.dataEdital) : 'sem data'}</dd></div>` : ''}
        <div><dt>Prova</dt><dd>${c.dataProva ? fmtDataAno(c.dataProva) + (c.previsto ? ' (estimada)' : '') : 'sem data'}</dd></div>
        <div><dt>Nota mínima</dt><dd>${c.prova.minPct || 0}% da prova</dd></div></dl></section>
      <section class="card"><div class="sec-cab"><h2 class="sec-t">Áreas da prova</h2><button type="button" class="kf-btn kf-link" data-act="editar-areas">Editar</button></div>
        ${G.length ? `<dl class="resumo">${G.map(g => `<div><dt>${esc(g.nome)}</dt><dd>${plural(soma(c.disc.filter(d => d.grupo === g.id), d => +d.q || 0), 'item', 'itens')} · peso ${String(g.valor).replace('.', ',')}</dd></div>`).join('')}</dl>` : '<p class="apoio">Sem áreas: todas as disciplinas valem o mesmo por item.</p>'}</section>
      <section><div class="sec-cab"><h2 class="sec-t">Disciplinas do edital</h2><span class="apoio">${c.disc.length}</span></div>
        <ul class="card lista">${c.disc.map((d, i) => { const m = materia(d.m); return m ? `<li><button type="button" class="lin" data-act="disc-concurso" data-i="${i}">${pontoCor(m)}<span class="lin-tx"><b>${esc(m.nome)}</b><small>${d.fora ? 'Fora do plano' : `${plural(+d.q || 0, 'item', 'itens')} · ${Math.round((F.get(d.m) || 0) * 100)}% da prova`} · ${plural(d.topicos.length, 'assunto', 'assuntos')}</small></span>${I.seta}</button></li>` : ''; }).join('')}</ul>
        ${KitFacil.ui.adicionar({ rotulo: 'Incluir disciplina', attrs: 'data-act="incluir-disc"' })}</section>
      <button type="button" class="kf-btn kf-perigo bloco" data-act="excluir-concurso">${I.lixo}Excluir concurso</button>`;
  },
};
function novoConcurso() {
  const livres = (typeof BIBLIOTECA !== 'undefined' ? BIBLIOTECA : []).filter(e => !DB.concursos.some(c => c.id === e.id));
  abrirJanela({ titulo: 'Novo concurso', sub: 'Escolha um edital pronto ou digite o seu.',
    corpo: `<div class="opcoes">${livres.map(e => `<button type="button" class="lin opcao" data-bib="${esc(e.id)}"><span class="lin-ic">${I.concurso}</span><span class="lin-tx"><b>${esc(e.sigla)} · ${esc(e.cargo)}</b><small>${e.previsto ? 'Edital previsto, com plano de estudo pronto' : `Edital publicado · prova em ${fmtData(e.dataProva)}`}</small></span>${I.seta}</button>`).join('')}
      <button type="button" class="lin opcao" data-bib=""><span class="lin-ic">${I.lapis}</span><span class="lin-tx"><b>Outro concurso</b><small>Digite os dados e cole o conteúdo programático</small></span>${I.seta}</button></div>`,
    aoMontar: d => $$('[data-bib]', d).forEach(b => b.onclick = () => {
      const e = livres.find(x => x.id === b.dataset.bib);
      if (!e) return digitarConcurso();
      if (e.perfis) return escolherPerfil(e);
      const c = instalarEdital(DB, e); salvar(); fecharJanela(true); concId = c.id; irPara('concurso'); avisar(`${e.sigla} adicionado ao plano.`);
    }) });
}
function escolherPerfil(e) {
  abrirJanela({ titulo: 'Qual é o seu perfil?', sub: `${e.sigla}: os conhecimentos específicos mudam com o perfil.`, alto: true,
    corpo: `<div class="opcoes">${e.perfis.map(p => `<button type="button" class="lin opcao" data-p="${esc(p.id)}"><span class="lin-tx"><b>${esc(p.nome)}</b><small>${plural(p.vagas, 'vaga', 'vagas')}</small></span>${I.seta}</button>`).join('')}</div>`,
    aoMontar: d => $$('[data-p]', d).forEach(b => b.onclick = () => { const c = instalarEdital(DB, e, { perfil: b.dataset.p }); salvar(); fecharJanela(true); concId = c.id; irPara('concurso'); avisar(`${e.sigla} adicionado ao plano.`); }) });
}
// "Disciplina:" ou "# Disciplina" abre uma disciplina; as linhas seguintes são os assuntos dela
function lerConteudo(txt) {
  const out = []; let at = null;
  for (let l of String(txt || '').split(/\r?\n/)) {
    l = l.trim(); if (!l) continue;
    const mh = /^#+\s*(.+)$/.exec(l) || /^(.+):$/.exec(l);
    if (mh) { at = { nome: mh[1].replace(/[:.]$/, '').trim().slice(0, 80), topicos: [] }; out.push(at); continue; }
    if (!at) { at = { nome: 'Conteúdo', topicos: [] }; out.push(at); }
    const t = l.replace(/^(\d+(\.\d+)*[.)]?|[-•*–])\s*/, '').replace(/[.;]$/, '').trim().slice(0, 160);
    if (t) at.topicos.push(t);
  }
  return out.filter(m => m.topicos.length);
}
function digitarConcurso() {
  abrirJanela({ titulo: 'Outro concurso', sub: 'Depois dá para ajustar as áreas e os itens.', alto: true,
    corpo: `<div class="kf-campo"><label class="kf-rotulo" for="dc-sigla">Nome do concurso</label><input id="dc-sigla" class="kf-entrada" type="text" maxlength="40" autocomplete="off" placeholder="Ex.: ANATEL 2027"></div>
      <div class="kf-campo"><label class="kf-rotulo" for="dc-cargo">Cargo <span class="kf-opcional">(opcional)</span></label><input id="dc-cargo" class="kf-entrada" type="text" maxlength="80" autocomplete="off"></div>
      <div class="kf-campo"><label class="kf-rotulo" for="dc-data">Data da prova <span class="kf-opcional">(opcional)</span></label><input id="dc-data" class="kf-entrada" type="date"></div>
      <div class="kf-campo"><label class="kf-rotulo" for="dc-txt">Conteúdo programático</label><textarea id="dc-txt" class="kf-entrada" rows="8" placeholder="Direito Administrativo:&#10;Atos administrativos&#10;Licitações e contratos&#10;&#10;Língua Portuguesa:&#10;Interpretação de textos"></textarea><p class="kf-ajuda">Escreva o nome da disciplina com dois-pontos no fim. Abaixo, um assunto por linha.</p></div>`,
    pe: `<button type="button" class="kf-btn kf-pri" id="dc-ok">Adicionar concurso</button>`,
    aoMontar: d => { $('#dc-ok', d).onclick = () => {
      const sigla = $('#dc-sigla', d).value.trim(), L = lerConteudo($('#dc-txt', d).value);
      if (!sigla) { KitFacil.apontar($('#dc-sigla', d)); avisar('Escreva o nome do concurso.'); return; }
      if (!L.length) { KitFacil.apontar($('#dc-txt', d)); avisar('Cole o conteúdo: disciplina com dois-pontos e os assuntos abaixo.'); return; }
      const id = 'c-' + novoId(), ed = { id, base: id, sigla, orgao: sigla, cargo: $('#dc-cargo', d).value.trim(), dataProva: $('#dc-data', d).value || '', prova: { minPct: 50, grupos: [] },
        materias: L.map((m, i) => ({ id: `${id}-${i + 1}`, nome: m.nome, q: m.topicos.length, topicos: m.topicos })) };
      const c = instalarEdital(DB, ed); salvar(); fecharJanela(true); concId = c.id; irPara('concurso'); avisar(`${sigla} adicionado, com ${plural(L.length, 'disciplina', 'disciplinas')}.`);
    }; } });
}
function editarConcurso() {
  const c = DB.concursos.find(x => x.id === concId); if (!c) return;
  abrirJanela({ titulo: 'Editar concurso', contexto: c.sigla, alto: true,
    corpo: `<div class="kf-campo"><span class="kf-rotulo">Situação</span>${segHTML('ec-sit', Object.entries(SITUACOES), c.situacao, 'Situação')}<p class="kf-ajuda">O plano do dia junta os concursos em estudo.</p></div>
      <div class="kf-campo"><label class="kf-rotulo" for="ec-sigla">Nome</label><input id="ec-sigla" class="kf-entrada" type="text" maxlength="40" value="${esc(c.sigla)}" autocomplete="off"></div>
      <div class="kf-campo"><label class="kf-rotulo" for="ec-cargo">Cargo</label><input id="ec-cargo" class="kf-entrada" type="text" maxlength="80" value="${esc(c.cargo || '')}" autocomplete="off"></div>
      <div class="kf-campo"><label class="kf-rotulo" for="ec-banca">Banca</label><input id="ec-banca" class="kf-entrada" type="text" maxlength="40" value="${esc(c.banca || '')}" autocomplete="off"></div>
      ${c.previsto ? `<div class="kf-campo"><label class="kf-rotulo" for="ec-edital">Edital previsto até</label><input id="ec-edital" class="kf-entrada" type="date" value="${esc(c.dataEdital || '')}"></div>` : ''}
      <div class="kf-campo"><label class="kf-rotulo" for="ec-prova">Data da prova</label><input id="ec-prova" class="kf-entrada" type="date" value="${esc(c.dataProva || '')}"></div>
      <div class="kf-campo"><label class="kf-rotulo" for="ec-min">Nota mínima, em % da prova</label><input id="ec-min" class="kf-entrada num" type="number" inputmode="numeric" min="0" max="100" value="${c.prova.minPct || 0}"></div>`,
    pe: `<button type="button" class="kf-btn kf-pri" id="ec-ok">Salvar</button>`,
    aoMontar: d => { ligarSeg($('#ec-sit', d)); $('#ec-ok', d).onclick = () => {
      const sigla = $('#ec-sigla', d).value.trim(); if (!sigla) { KitFacil.apontar($('#ec-sigla', d)); avisar('Escreva o nome do concurso.'); return; }
      Object.assign(c, { sigla, cargo: $('#ec-cargo', d).value.trim(), banca: $('#ec-banca', d).value.trim(), dataProva: $('#ec-prova', d).value || '', situacao: valorSeg($('#ec-sit', d)) || c.situacao });
      if ($('#ec-edital', d)) c.dataEdital = $('#ec-edital', d).value || '';
      c.prova.minPct = clamp(lerNum($('#ec-min', d)), 0, 100);
      const dp = c.datas.find(x => x.tipo === 'prova'); if (dp && c.dataProva) dp.ini = c.dataProva;
      salvar(); fecharJanela(true); avisar('Concurso salvo.');
    }; } });
}
function editarAreas() {
  const c = DB.concursos.find(x => x.id === concId); if (!c) return; const G = c.prova.grupos.map(g => ({ ...g }));
  const linhas = () => G.map((g, i) => `<div class="par"><div class="kf-campo"><label class="kf-rotulo" for="ar-n${i}">Área ${i + 1}</label><input id="ar-n${i}" class="kf-entrada" type="text" maxlength="40" value="${esc(g.nome)}" autocomplete="off"></div><div class="kf-campo estreito"><label class="kf-rotulo" for="ar-v${i}">Peso</label><input id="ar-v${i}" class="kf-entrada num" type="text" inputmode="decimal" value="${String(g.valor).replace('.', ',')}"></div></div>`).join('');
  abrirJanela({ titulo: 'Áreas da prova', sub: 'O peso é quanto vale cada item da área.', contexto: c.sigla,
    corpo: `<div id="ar-lista" class="pilha">${linhas()}</div>${KitFacil.ui.adicionar({ rotulo: 'Nova área', attrs: 'id="ar-add"' })}`,
    pe: `<button type="button" class="kf-btn kf-pri" id="ar-ok">Salvar</button>`,
    aoMontar: d => {
      const ler = () => G.forEach((g, i) => { g.nome = $('#ar-n' + i, d).value.trim() || g.nome; g.valor = Math.max(0.1, parseFloat($('#ar-v' + i, d).value.replace(',', '.')) || 1); });
      $('#ar-add', d).onclick = () => { ler(); G.push({ id: 'g' + novoId(), nome: 'Nova área', valor: 1, q: 0 }); KitFacil.movimento.redesenhar(d, () => { $('#ar-lista', d).innerHTML = linhas(); }); };
      $('#ar-ok', d).onclick = () => { ler(); c.prova.grupos = G; salvar(); fecharJanela(true); avisar('Áreas salvas.'); };
    } });
}
function discConcurso(i) {
  const c = DB.concursos.find(x => x.id === concId), d = c && c.disc[i], m = d && materia(d.m); if (!m) return; const G = c.prova.grupos || [];
  abrirJanela({ titulo: m.nome, contexto: c.sigla,
    corpo: `<div class="kf-campo"><label class="kf-rotulo" for="dq-q">Itens na prova</label><input id="dq-q" class="kf-entrada num" type="number" inputmode="numeric" min="0" max="500" value="${+d.q || 0}"></div>
      ${G.length ? `<div class="kf-campo"><label class="kf-rotulo" for="dq-g">Área da prova</label><select id="dq-g" class="kf-entrada">${G.map(g => `<option value="${esc(g.id)}" ${g.id === d.grupo ? 'selected' : ''}>${esc(g.nome)}</option>`).join('')}</select></div>` : ''}
      <label class="linha-chave"><span><b>Estudar esta disciplina</b><small>Desligada, ela sai do plano e da prontidão. Nada é apagado.</small></span>${KitFacil.ui.chave({ attrs: 'id="dq-on"', on: !d.fora })}</label>`,
    pe: `<button type="button" class="kf-btn kf-perigo" id="dq-rm">Remover do concurso</button><button type="button" class="kf-btn kf-pri" id="dq-ok">Salvar</button>`,
    aoMontar: dl => {
      $('#dq-ok', dl).onclick = () => { d.q = lerNum($('#dq-q', dl)); if ($('#dq-g', dl)) d.grupo = $('#dq-g', dl).value; d.fora = !$('#dq-on', dl).checked; salvar(); fecharJanela(true); avisar('Disciplina salva.'); };
      $('#dq-rm', dl).onclick = () => confirmar('Remover a disciplina do concurso?', `${m.nome} sai deste edital. A disciplina e o que você estudou continuam em Disciplinas.`, 'Remover disciplina', () => { c.disc.splice(i, 1); salvar(); fecharJanela(true); avisar('Disciplina removida do concurso.'); }, 'Dá para incluir de novo depois.');
    } });
}
function incluirDisc() {
  const c = DB.concursos.find(x => x.id === concId); if (!c) return; const livres = DB.materias.filter(m => !c.disc.some(d => d.m === m.id));
  if (!livres.length) { avisar('Todas as disciplinas já estão neste concurso. Crie outra em Disciplinas.'); return; }
  abrirJanela({ titulo: 'Incluir disciplina', contexto: c.sigla, sub: 'Entram todos os assuntos da disciplina.',
    corpo: `<div class="opcoes">${livres.map(m => `<button type="button" class="lin opcao" data-m="${esc(m.id)}">${pontoCor(m)}<span class="lin-tx"><b>${esc(m.nome)}</b><small>${plural(topicosDe(m.id).length, 'assunto', 'assuntos')}</small></span>${I.mais}</button>`).join('')}</div>`,
    aoMontar: d => $$('[data-m]', d).forEach(b => b.onclick = () => { const T = topicosDe(b.dataset.m); c.disc.push({ m: b.dataset.m, grupo: (c.prova.grupos[0] || {}).id || '', q: T.length, f1: 1, topicos: T.map(t => t.id) }); salvar(); fecharJanela(true); avisar('Disciplina incluída.'); }) });
}

/* ---------- Disciplinas ---------- */
const viewDisciplinas = {
  html() {
    const L = [...DB.materias].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    return `${voltaMais()}${cab('Disciplinas', 'Valem para todos os concursos: o que você estuda num assunto conta em todos.')}
      ${L.length ? `<ul class="card lista">${L.map(m => { const T = topicosDe(m.id); return `<li><button type="button" class="lin" data-act="abrir-disc" data-id="${esc(m.id)}">${pontoCor(m)}<span class="lin-tx"><b>${esc(m.nome)}</b><small>${plural(T.length, 'assunto', 'assuntos')} · ${T.filter(t => t.teoria).length} com a teoria concluída</small></span>${I.seta}</button></li>`; }).join('')}</ul>`
        : KitFacil.ui.vazio({ titulo: 'Nenhuma disciplina ainda', texto: 'Crie uma disciplina e os assuntos dela, ou adicione um concurso da biblioteca.' })}
      ${KitFacil.ui.adicionar({ rotulo: 'Nova disciplina', attrs: 'data-act="nova-disc"' })}`;
  },
};
let discId = null;
const viewDisciplina = {
  html() {
    const m = materia(discId); if (!m) return viewDisciplinas.html(); const T = topicosDe(m.id);
    return `<button type="button" class="volta" data-kf-ir="disciplinas">${I.volta}<span>Disciplinas</span></button>${cab(m.nome, `${plural(T.length, 'assunto', 'assuntos')}. Toque num assunto para renomear, mover ou excluir.`)}
      <ul class="card lista">${T.map((t, i) => `<li><button type="button" class="lin" data-act="editar-assunto" data-id="${esc(t.id)}"><span class="lin-n" aria-hidden="true">${i + 1}</span><span class="lin-tx"><b>${esc(t.nome)}</b><small>${DOMINIOS[dominio(t)]}</small></span>${I.lapis}</button></li>`).join('') || '<li class="pl-vazio">Nenhum assunto ainda.</li>'}</ul>
      ${KitFacil.ui.adicionar({ rotulo: 'Novo assunto', attrs: 'data-act="novo-assunto"' })}
      <div class="acoes-pe"><button type="button" class="kf-btn kf-sec" data-act="renomear-disc">${I.lapis}Renomear disciplina</button><button type="button" class="kf-btn kf-perigo" data-act="excluir-disc">${I.lixo}Excluir disciplina</button></div>`;
  },
};
function nomeJanela({ titulo, rotulo, valor = '', ok, contexto = '', max = 160, aoSalvar }) {
  abrirJanela({ titulo, contexto, corpo: `<div class="kf-campo"><label class="kf-rotulo" for="nj">${rotulo}</label><input id="nj" class="kf-entrada" type="text" maxlength="${max}" value="${esc(valor)}" autocomplete="off" enterkeyhint="done"></div>`,
    pe: `<button type="button" class="kf-btn kf-pri" id="nj-ok">${ok}</button>`,
    aoMontar: d => { const go = () => { const v = $('#nj', d).value.trim(); if (!v) { KitFacil.apontar($('#nj', d)); avisar('Escreva o nome.'); return; } aoSalvar(v); }; $('#nj-ok', d).onclick = go; $('#nj', d).addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); go(); } }); } });
}
function novaDisciplina() { nomeJanela({ titulo: 'Nova disciplina', rotulo: 'Nome da disciplina', ok: 'Criar disciplina', max: 80, aoSalvar: v => { const m = { id: 'm-' + novoId(), nome: v, cor: CORES[DB.materias.length % CORES.length], dica: '' }; DB.materias.push(m); salvar(); fecharJanela(true); discId = m.id; irPara('disciplina'); avisar('Disciplina criada. Agora, os assuntos.'); } }); }
function novoAssunto() { const m = materia(discId); if (!m) return; nomeJanela({ titulo: 'Novo assunto', contexto: m.nome, rotulo: 'Nome do assunto', ok: 'Adicionar assunto', aoSalvar: v => { const t = { id: 't-' + novoId(), m: m.id, nome: v, ordem: Math.max(-1, ...topicosDe(m.id).map(x => x.ordem || 0)) + 1, teoria: 0 }; DB.topicos.push(t); DB.concursos.forEach(c => c.disc.forEach(d => { if (d.m === m.id) d.topicos.push(t.id); })); novoItem = `[data-id="${t.id}"]`; salvar(); fecharJanela(true); } }); }
function editarAssunto(id) {
  const t = topico(id); if (!t) return; const L = topicosDe(t.m), i = L.indexOf(t);
  abrirJanela({ titulo: 'Assunto', contexto: (materia(t.m) || {}).nome || '',
    corpo: `<div class="kf-campo"><label class="kf-rotulo" for="ea-n">Nome do assunto</label><input id="ea-n" class="kf-entrada" type="text" maxlength="160" value="${esc(t.nome)}" autocomplete="off"></div>
      <div class="kf-campo"><span class="kf-rotulo">Ordem na disciplina</span><div class="par-btn"><button type="button" class="kf-btn kf-sec" id="ea-sobe" ${i <= 0 ? 'disabled' : ''}>${I.sobe}Mover para cima</button><button type="button" class="kf-btn kf-sec" id="ea-desce" ${i >= L.length - 1 ? 'disabled' : ''}>${I.desce}Mover para baixo</button></div></div>`,
    pe: `<button type="button" class="kf-btn kf-perigo" id="ea-rm">Excluir assunto</button><button type="button" class="kf-btn kf-pri" id="ea-ok">Salvar</button>`,
    aoMontar: d => {
      const mover = dir => { const j = i + dir, o = L[j]; if (!o) return; L.forEach((x, k) => { x.ordem = k; }); t.ordem = j; o.ordem = i; novoItem = `[data-id="${t.id}"]`; salvar(); fecharJanela(true); };
      $('#ea-sobe', d).onclick = () => mover(-1); $('#ea-desce', d).onclick = () => mover(1);
      $('#ea-ok', d).onclick = () => { const v = $('#ea-n', d).value.trim(); if (!v) { KitFacil.apontar($('#ea-n', d)); avisar('Escreva o nome do assunto.'); return; } t.nome = v; salvar(); fecharJanela(true); avisar('Assunto salvo.'); };
      $('#ea-rm', d).onclick = () => confirmar('Excluir o assunto?', `"${t.nome}" sai de todos os concursos. As sessões já feitas continuam contando o tempo.`, 'Excluir assunto', () => { DB.topicos = DB.topicos.filter(x => x.id !== t.id); DB.revisoes = DB.revisoes.filter(r => r.t !== t.id); DB.concursos.forEach(c => c.disc.forEach(x => { x.topicos = x.topicos.filter(y => y !== t.id); })); salvar(); fecharJanela(true); avisar('Assunto excluído.'); });
    } });
}
function excluirDisciplina() {
  const m = materia(discId); if (!m) return;
  confirmar('Excluir a disciplina?', `${m.nome} e os ${plural(topicosDe(m.id).length, 'assunto', 'assuntos')} dela saem de todos os concursos. As sessões já feitas continuam contando o tempo.`, 'Excluir disciplina', () => {
    const ids = new Set(topicosDe(m.id).map(t => t.id));
    DB.materias = DB.materias.filter(x => x.id !== m.id); DB.topicos = DB.topicos.filter(t => t.m !== m.id); DB.revisoes = DB.revisoes.filter(r => !ids.has(r.t)); DB.concursos.forEach(c => { c.disc = c.disc.filter(d => d.m !== m.id); });
    salvar({ quieto: true }); irPara('disciplinas'); avisar('Disciplina excluída.');
  });
}

/* ---------- Revisões ---------- */
const viewRevisoes = {
  html() {
    const h = hojeISO(), P = revisoesPendentes(), g = [['Para hoje', P.filter(r => r.due <= h)], ['Próximos 7 dias', P.filter(r => r.due > h && r.due <= maisDias(h, 7))], ['Depois', P.filter(r => r.due > maisDias(h, 7))]];
    const lin = r => { const t = topico(r.t), m = materia(t.m), at = entreDias(r.due, h); return `<li class="pl-item"><span class="pl-marca" aria-hidden="true">${I.revisar}</span><span class="pl-tx"><b>${esc(t.nome)}</b><small>${esc(m ? m.nome : '')} · ${r.n}ª revisão · ${at > 0 ? plural(at, 'dia', 'dias') + ' de atraso' : at === 0 ? 'hoje' : fmtData(r.due)}</small></span><button type="button" class="btn-ic comecar" data-act="revisar" data-id="${esc(r.id)}" aria-label="Revisar ${esc(t.nome)}">${I.play}</button></li>`; };
    return `${voltaMais()}${cab('Revisões', `Cada assunto volta em ${cfg().revisoes.join(', ').replace(/, (\d+)$/, ' e $1')} dias depois da teoria.`)}
      ${P.length ? g.filter(x => x[1].length).map(([n, L]) => `<section><div class="sec-cab"><h2 class="sec-t">${n}</h2><span class="apoio">${L.length}</span></div><ul class="card lista">${L.slice(0, 40).map(lin).join('')}</ul></section>`).join('')
        : KitFacil.ui.vazio({ titulo: 'Nenhuma revisão marcada', texto: 'Quando você conclui a teoria de um assunto, as revisões dele aparecem aqui, na data certa.' })}`;
  },
};

/* ---------- Simulados ---------- */
function notaSimulado(s) {
  const c = DB.concursos.find(x => x.id === s.c), G = (c && c.prova.grupos.length ? c.prova.grupos : [{ id: '_', nome: 'Prova', valor: 1 }]);
  let pts = 0, max = 0, ac = 0, tot = 0; for (const g of G) { const r = (s.r || {})[g.id] || { ac: 0, tot: 0 }; pts += r.ac * g.valor; max += r.tot * g.valor; ac += r.ac; tot += r.tot; }
  const p = max ? Math.round(pts / max * 100) : 0;
  return { pts, max, ac, tot, pct: p, min: c ? c.prova.minPct || 0 : 0, passou: !c || p >= (c.prova.minPct || 0) };
}
const viewSimulados = {
  html() {
    const L = [...DB.simulados].sort((a, b) => a.data < b.data ? 1 : -1);
    return `${voltaMais()}${cab('Simulados', 'Registre o resultado de cada simulado e veja a nota pela regra da prova.')}
      ${L.length ? `<ul class="card lista">${L.map(s => { const n = notaSimulado(s), c = DB.concursos.find(x => x.id === s.c); return `<li><button type="button" class="lin" data-act="abrir-simulado" data-id="${esc(s.id)}"><span class="lin-tx"><b>${esc(s.nome || 'Simulado')}</b><small>${fmtData(s.data)}${c ? ' · ' + esc(c.sigla) : ''} · ${n.ac} de ${n.tot} certas</small></span><span class="lin-valor ${n.passou ? 'ok' : 'baixo'}">${n.pct}%<span class="kf-so-leitor">${n.passou ? ', acima da nota mínima' : ', abaixo da nota mínima'}</span></span>${I.seta}</button></li>`; }).join('')}</ul>`
        : KitFacil.ui.vazio({ titulo: 'Nenhum simulado ainda', texto: 'Faça um simulado no seu material e registre os acertos aqui. A nota sai pela regra da prova.' })}
      ${KitFacil.ui.adicionar({ rotulo: 'Novo simulado', attrs: 'data-act="novo-simulado"' })}`;
  },
};
function simuladoJanela(id) {
  const S = id && DB.simulados.find(x => x.id === id), cs = DB.concursos; let cId = S ? S.c : (concursoFoco() || cs[0] || {}).id || '';
  const grupos = () => { const c = cs.find(x => x.id === cId); return c && c.prova.grupos.length ? c.prova.grupos : [{ id: '_', nome: 'Prova', valor: 1 }]; };
  const campos = () => grupos().map((g, i) => { const r = (S && S.c === cId && S.r[g.id]) || { ac: '', tot: g.q || '' }; return `<fieldset class="kf-campo sim-g"><legend class="kf-rotulo">${esc(g.nome)}</legend><div class="par"><div class="kf-campo"><label class="apoio" for="si-a${i}">Acertos</label><input id="si-a${i}" class="kf-entrada num" type="number" inputmode="numeric" min="0" value="${r.ac}"></div><div class="kf-campo"><label class="apoio" for="si-t${i}">Total de itens</label><input id="si-t${i}" class="kf-entrada num" type="number" inputmode="numeric" min="0" value="${r.tot}"></div></div></fieldset>`; }).join('');
  abrirJanela({ titulo: S ? 'Simulado' : 'Novo simulado', alto: true,
    corpo: `<div class="kf-campo"><label class="kf-rotulo" for="si-n">Nome</label><input id="si-n" class="kf-entrada" type="text" maxlength="60" value="${esc(S ? S.nome : '')}" placeholder="Ex.: Simulado 1" autocomplete="off"></div>
      ${cs.length ? `<div class="kf-campo"><label class="kf-rotulo" for="si-c">Concurso</label><select id="si-c" class="kf-entrada">${cs.map(c => `<option value="${esc(c.id)}" ${c.id === cId ? 'selected' : ''}>${esc(c.sigla)}</option>`).join('')}</select></div>` : ''}
      <div class="kf-campo"><label class="kf-rotulo" for="si-d">Dia</label><input id="si-d" class="kf-entrada" type="date" value="${S ? S.data : hojeISO()}"></div>
      <div id="si-g" class="pilha">${campos()}</div>`,
    pe: `${S ? `<button type="button" class="kf-btn kf-perigo" id="si-rm">Excluir simulado</button>` : ''}<button type="button" class="kf-btn kf-pri" id="si-ok">Salvar simulado</button>`,
    aoMontar: d => {
      $('#si-c', d)?.addEventListener('change', e => { cId = e.target.value; $('#si-g', d).innerHTML = campos(); });
      $('#si-rm', d)?.addEventListener('click', () => confirmar('Excluir o simulado?', 'O resultado sai da lista.', 'Excluir simulado', () => { DB.simulados = DB.simulados.filter(x => x.id !== id); salvar(); fecharJanela(true); avisar('Simulado excluído.'); }));
      $('#si-ok', d).onclick = () => {
        const r = {}; let tot = 0, ruim = null;
        grupos().forEach((g, i) => { const ac = lerNum($('#si-a' + i, d)), t = lerNum($('#si-t' + i, d)); if (ac > t) ruim = $('#si-a' + i, d); r[g.id] = { ac, tot: t }; tot += t; });
        if (ruim) { KitFacil.apontar(ruim); avisar('Os acertos não podem passar do total de itens.'); return; }
        if (!tot) { KitFacil.apontar($('#si-t0', d)); avisar('Informe o total de itens do simulado.'); return; }
        const reg = { id: S ? S.id : novoId(), c: cId, nome: $('#si-n', d).value.trim() || 'Simulado', data: $('#si-d', d).value || hojeISO(), r };
        if (S) Object.assign(S, reg); else { DB.simulados.push(reg); novoItem = `[data-id="${reg.id}"]`; }
        salvar(); fecharJanela(true); const n = notaSimulado(reg); avisar(`Simulado salvo: ${n.pct}% da prova.`); setTimeout(() => jogoConferir(), 700);
      };
    } });
}

/* ---------- Agenda ---------- */
const viewAgenda = {
  html() {
    const h = hojeISO(), L = [];
    for (const c of DB.concursos.filter(x => x.situacao !== 'encerrado')) for (const d of c.datas || []) L.push({ data: d.ini, fim: d.fim, titulo: d.titulo, de: c.sigla, acao: d.acao });
    for (const e of DB.eventos) L.push({ data: e.data, hora: e.hora, titulo: e.titulo, de: 'Seu compromisso', id: e.id });
    L.sort((a, b) => a.data < b.data ? -1 : a.data > b.data ? 1 : 0);
    const fut = L.filter(x => (x.fim || x.data) >= h), pas = L.filter(x => (x.fim || x.data) < h).reverse();
    const lin = x => { const n = entreDias(h, x.data); const corpo = `<span class="ag-data" aria-hidden="true"><b>${deISO(x.data).getDate()}</b><small>${MESES[deISO(x.data).getMonth()]}</small></span><span class="lin-tx"><b>${esc(x.titulo)}</b><small>${esc(x.de)}${x.hora ? ' · ' + esc(x.hora) : ''}${x.fim ? ' · até ' + fmtData(x.fim) : ''}${n > 0 ? ` · em ${plural(n, 'dia', 'dias')}` : n === 0 ? ' · hoje' : ''}</small><span class="kf-so-leitor">${fmtData(x.data)}</span></span>`;
      return `<li>${x.id ? `<button type="button" class="lin" data-act="editar-evento" data-id="${esc(x.id)}">${corpo}${I.lapis}</button>` : `<div class="lin parada">${corpo}</div>`}</li>`; };
    return `${voltaMais()}${cab('Agenda', 'As datas dos seus concursos e os compromissos que você marcar.')}
      ${fut.length ? `<section><div class="sec-cab"><h2 class="sec-t">Próximas datas</h2></div><ul class="card lista">${fut.map(lin).join('')}</ul></section>` : KitFacil.ui.vazio({ titulo: 'Nenhuma data pela frente', texto: 'Marque aulas, simulados e prazos. As datas do edital entram sozinhas.' })}
      ${KitFacil.ui.adicionar({ rotulo: 'Novo compromisso', attrs: 'data-act="novo-evento"' })}
      ${pas.length ? `<details class="card passadas" data-kf-secao><summary><b>Datas que já passaram</b> <small data-kf-secao-resumo>${pas.length}</small></summary><ul class="lista">${pas.slice(0, 30).map(lin).join('')}</ul></details>` : ''}`;
  },
};
function eventoJanela(id) {
  const E = id && DB.eventos.find(x => x.id === id);
  abrirJanela({ titulo: E ? 'Compromisso' : 'Novo compromisso',
    corpo: `<div class="kf-campo"><label class="kf-rotulo" for="ev-t">O que é</label><input id="ev-t" class="kf-entrada" type="text" maxlength="80" value="${esc(E ? E.titulo : '')}" placeholder="Ex.: Aula de LGPD" autocomplete="off"></div>
      <div class="par"><div class="kf-campo"><label class="kf-rotulo" for="ev-d">Dia</label><input id="ev-d" class="kf-entrada" type="date" value="${E ? E.data : hojeISO()}"></div><div class="kf-campo"><label class="kf-rotulo" for="ev-h">Hora <span class="kf-opcional">(opcional)</span></label><input id="ev-h" class="kf-entrada" type="time" value="${E ? esc(E.hora || '') : ''}"></div></div>`,
    pe: `${E ? `<button type="button" class="kf-btn kf-perigo" id="ev-rm">Excluir compromisso</button>` : ''}<button type="button" class="kf-btn kf-pri" id="ev-ok">Salvar</button>`,
    aoMontar: d => {
      $('#ev-rm', d)?.addEventListener('click', () => confirmar('Excluir o compromisso?', `"${E.titulo}" sai da agenda.`, 'Excluir compromisso', () => { DB.eventos = DB.eventos.filter(x => x.id !== id); salvar(); fecharJanela(true); avisar('Compromisso excluído.'); }));
      $('#ev-ok', d).onclick = () => {
        const t = $('#ev-t', d).value.trim(), dia = $('#ev-d', d).value; if (!t) { KitFacil.apontar($('#ev-t', d)); avisar('Escreva o que é o compromisso.'); return; } if (!dia) { KitFacil.apontar($('#ev-d', d)); avisar('Escolha o dia.'); return; }
        const reg = { id: E ? E.id : novoId(), titulo: t, data: dia, hora: $('#ev-h', d).value || '' };
        if (E) Object.assign(E, reg); else { DB.eventos.push(reg); novoItem = `[data-id="${reg.id}"]`; }
        salvar(); fecharJanela(true); avisar('Compromisso salvo.');
      };
    } });
}
