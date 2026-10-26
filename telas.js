/* Estudo Fácil: telas e janelas. */
"use strict";

/* ================= pedaços comuns ================= */
const glifo = t => `<i class="st ${t.teoria ? "st-2" : t.ult ? "st-1" : "st-0"}" aria-hidden="true"></i>`;
const nomeTop = t => `<span class="tn${t.teoria ? " hl" : t.ult ? " ul" : ""}">${esc(t.nome)}</span>`;
function estadoTxt(t) { return t.teoria ? "Teoria concluída" : t.ult ? "Teoria em andamento" : "Ainda não estudado"; }
function revTxt(t) {
  if (!t.prox) return "";
  const n = diffD(today(), t.prox);
  if (n < 0) return `<span class="tag rev">Revisão atrasada ${plural(-n, "dia", "dias")}</span>`;
  if (n === 0) return `<span class="tag rev">Revisar hoje</span>`;
  return `<span class="tag">Revisão ${n === 1 ? "amanhã" : dCurta(t.prox)}</span>`;
}
function medidor(valor, total, rot, txtFn) {
  const p = total > 0 ? Math.min(100, pct(valor, total)) : 0;
  return `<div class="medidor"><div class="med-h"><span>${rot}</span><b>${txtFn ? txtFn(valor, total) : ""}</b></div>
    <div class="barra${p >= 100 ? " cheia" : ""}" role="progressbar" aria-valuenow="${Math.round(p)}" aria-valuemin="0" aria-valuemax="100" aria-label="${esc(rot)}"><span style="width:${p}%"></span></div></div>`;
}
const vazio = (t, txt, acao = "") => `<div class="vazio"><b>${t}</b><p>${txt}</p>${acao}</div>`;
function prazoStatus(d, t) {
  const fim = d.fim || d.ini;
  if (fim < t) return { k: "s-passou", txt: "Encerrado" };
  if (d.ini > t) { const n = diffD(t, d.ini); return { k: n <= 7 ? "s-logo" : "s-futuro", txt: n === 1 ? "Amanhã" : `Em ${n} dias` }; }
  if (d.fim && d.fim !== d.ini) { const n = diffD(t, d.fim); return { k: "s-agora", txt: n === 0 ? "Termina hoje" : n === 1 ? "Termina amanhã" : `Até ${dCurta(d.fim)}, faltam ${n} dias` }; }
  return { k: "s-agora", txt: "Hoje" };
}
function datasConcurso(c) {
  const l = (c.datas || []).filter(d => d && d.ini).slice();
  if (c.dataProva && !l.some(d => d.tipo === "prova" && d.ini === c.dataProva)) l.push({ id: "prova", tipo: "prova", titulo: "Prova", ini: c.dataProva });
  return l.sort((a, b) => a.ini.localeCompare(b.ini) || (a.fim || a.ini).localeCompare(b.fim || b.ini));
}
const dataRot = d => d.fim && d.fim !== d.ini ? `${dCurta(d.ini)} a ${dCurta(d.fim)}` : dCurta(d.ini);

/* ================= HOJE ================= */
VIEWS.hoje = () => {
  const X = ix(), c = X.c, t = today(), P = planoHoje(), E = resumoEdital();
  const n = c.dataProva ? diffD(t, c.dataProva) : null, o = X.days.get(t) || { s: 0, a: 0, e: 0 };
  const folga = !ehDiaEstudo(t);
  // contagem
  const folha = n !== null && n >= 0 ? `<div class="folha" aria-hidden="true"><span class="folha-a">faltam</span><b>${n}</b><span class="folha-b">${n === 1 ? "dia" : "dias"}</span></div>` : "";
  const provaTxt = c.dataProva ? (n > 0 ? `${cap(dSemana(c.dataProva))}, ${dLonga(c.dataProva)}${c.horaProva ? `, das ${c.horaProva}` : ""}${c.local ? `. ${c.local}` : ""}.` : n === 0 ? `A prova é hoje${c.horaProva ? `, das ${c.horaProva}` : ""}. Boa prova!` : `A prova foi em ${dLonga(c.dataProva)}.`) : "Cadastre a data da prova em Edital, Datas.";
  const cont = `<section class="contagem" aria-label="Contagem para a prova">
    ${folha}
    <div class="cont-txt">
      <h1 class="cont-h">${n !== null && n >= 0 ? `${n === 0 ? "Hoje é a prova" : `${plural(n, "dia", "dias")} para a prova`} ${c.sigla ? "da " + esc(c.sigla) : ""}` : esc(c.sigla || c.orgao)}</h1>
      <p class="cont-p">${provaTxt}</p>
      <div class="trilha" role="progressbar" aria-valuenow="${Math.round(E.pc)}" aria-valuemin="0" aria-valuemax="100" aria-label="Edital com teoria concluída"><span style="width:${E.pc}%"></span><span class="tr-b" style="width:${pct(E.est - E.teo, E.n)}%"></span></div>
      <p class="cont-s"><b>${E.teo} de ${E.n}</b> tópicos com a teoria concluída${E.est > E.teo ? `, ${E.est - E.teo} em andamento` : ""}.</p>
    </div>
  </section>`;
  // próximo passo
  let agora;
  const a = DB.ativa;
  if (a) {
    const it = atual(a);
    agora = `<section class="agora em-curso"><p class="ag-k">${I.timer}Sessão em andamento</p><h2 class="ag-h">${esc(topNome(it.t))}</h2><p class="ag-m">${esc(matNome(it.m))}, ${TIPO_TXT[it.tipo].toLowerCase()}. <span data-tick="estudo-real">${dur(estudoTotal(a, Date.now()))}</span> de estudo.</p>
      <div class="btns"><button class="btn pri lg" data-act="foco">${I.timer}Voltar ao cronômetro</button></div></section>`;
  } else if (P.prox) {
    const x = P.prox, top = x.top, st = statT(top.id);
    const k = x.tipo === "revisao" ? (x.atraso ? `Revisão atrasada há ${plural(x.atraso, "dia", "dias")}` : "Revisão de hoje") : top.ult ? `Continuar: você começou em ${brs(top.ult)}` : "Tópico novo do plano";
    agora = `<section class="agora"><p class="ag-k">${x.tipo === "revisao" ? '<i class="pt rev"></i>' : '<i class="pt novo"></i>'}${k}</p>
      <h2 class="ag-h">${esc(top.nome)}</h2><p class="ag-m">${esc(matNome(top.m))}${st.a + st.e ? `. Você acertou ${pctTxt(pct(st.a, st.a + st.e))} das ${st.a + st.e} questões deste tópico.` : "."}</p>
      <div class="btns"><button class="btn pri lg" data-act="estudar" data-t="${top.id}" data-tipo="${x.tipo}">${I.play}Estudar agora</button><button class="btn ghost" data-go="estudar">Escolher outro</button></div></section>`;
  } else {
    const prox = proximoTopico();
    agora = `<section class="agora feito"><p class="ag-k">${I.check}${P.itens.length ? "Plano de hoje concluído" : folga ? "Hoje é folga no seu planejamento" : "Nada planejado para hoje"}</p>
      ${prox ? `<h2 class="ag-h">${P.itens.length ? "Quer adiantar?" : "Se quiser estudar"}</h2><p class="ag-m">O próximo tópico é <b>${esc(prox.nome)}</b>, de ${esc(matNome(prox.m))}.</p>
      <div class="btns"><button class="btn pri lg" data-act="estudar" data-t="${prox.id}" data-tipo="teoria">${I.play}Estudar este</button><button class="btn ghost" data-go="estudar">Escolher outro</button></div>`
      : `<h2 class="ag-h">Toda a teoria do edital está concluída.</h2><p class="ag-m">Agora é revisar e resolver questões. Escolha um tópico em Estudar.</p><div class="btns"><button class="btn pri lg" data-go="estudar">${I.play}Estudar</button></div>`}</section>`;
  }
  // metas
  const h = cfg().hDia, q = cfg().qDia, qd = o.a + o.e;
  const metas = `<section class="bloco metas" aria-label="Meta de hoje"><div class="b-hr"><h2 class="b-h">Meta de hoje</h2>${metaDia(t) && (o.s || qd) ? `<span class="tag ok">${I.check}Batida</span>` : folga ? `<span class="tag">Folga</span>` : ""}</div>
    ${h ? medidor(o.s, h * 3600, "Tempo de estudo", (v, tt) => `${dur(v)} de ${dur(tt)}`) : ""}
    ${q ? medidor(qd, q, "Questões", (v, tt) => `${v} de ${tt}${v ? `, ${pctTxt(pct(o.a, v))} certas` : ""}`) : ""}
    ${!h && !q ? `<p class="hint">Defina metas diárias em Ajustes.</p>` : ""}
  </section>`;
  // plano
  const R = P.ritmo;
  const linha = x => {
    const top = x.top, m = matNome(top.m);
    return `<li class="pl-it${x.feito ? " feito" : ""}">
      <button class="pl-go" ${x.feito ? "disabled" : `data-act="estudar" data-t="${top.id}" data-tipo="${x.tipo}"`} aria-label="${x.feito ? "Feito" : "Estudar " + esc(top.nome)}">${x.feito ? I.check : I.play}</button>
      <button class="pl-txt" data-act="topico" data-id="${top.id}"><span class="pl-k ${x.tipo === "revisao" ? "rev" : "novo"}">${x.tipo === "revisao" ? (x.atraso ? `Revisão, ${plural(x.atraso, "dia", "dias")} de atraso` : "Revisão") : top.ult && !x.feito ? "Continuar" : "Novo"}</span>
        <span class="pl-n">${esc(top.nome)}</span><span class="pl-m">${esc(m)}</span></button></li>`;
  };
  const plano = `<section class="bloco plano" aria-label="Plano de hoje"><div class="b-hr"><h2 class="b-h">Plano de hoje</h2>${P.itens.length ? `<span class="tag">${P.feitos} de ${P.itens.length}</span>` : ""}</div>
    ${P.itens.length ? `<ul class="pl-lista">${P.itens.map(linha).join("")}</ul>` : `<p class="hint">${folga ? "Dia de folga: nenhuma revisão vencida e nenhum tópico novo." : "Nenhuma revisão vencida e nenhum tópico pendente."}</p>`}
    ${P.espera ? `<p class="hint pl-ritmo"><b>${plural(P.espera, "revisão vencida ficou", "revisões vencidas ficaram")} na fila</b> para não passar do seu tempo de hoje. Elas entram nos próximos dias, as mais atrasadas primeiro. <button class="btn link sm" data-act="revisoes">Ver todas</button></p>` : ""}
    ${R.pend ? `<p class="hint pl-ritmo">${R.n === R.auto ? `Para terminar a teoria até ${dLonga(R.fim)}: ${plural(R.n, "tópico novo", "tópicos novos")} por dia de estudo.` : `${plural(R.n, "tópico novo", "tópicos novos")} por dia, como você definiu.`} <button class="btn link sm" data-go="ajustes">Ajustar</button></p>` : ""}
  </section>`;
  // prazos
  const ds = datasConcurso(c).filter(d => (d.fim || d.ini) >= t).slice(0, 4);
  const prazos = `<section class="bloco prazos" aria-label="Próximas datas"><div class="b-hr"><h2 class="b-h">Próximas datas</h2><button class="btn link sm" data-go="edital/datas">Cronograma</button></div>
    ${ds.length ? `<ul class="pz-lista">${ds.map(d => { const s = prazoStatus(d, t); return `<li class="pz${d.acao ? " acao" : ""}${d.tipo === "prova" ? " prova" : ""}"><span class="pz-d">${dataRot(d)}</span><span class="pz-t">${esc(d.titulo)}</span><span class="pz-s ${s.k}">${s.txt}</span></li>`; }).join("")}</ul>` : `<p class="hint">Nenhuma data pela frente.</p>`}
  </section>`;
  // semana
  const dias = []; for (let i = 6; i >= 0; i--) dias.push(addD(t, -i));
  const maxS = Math.max(h * 3600, ...dias.map(d => (X.days.get(d) || { s: 0 }).s), 1);
  const seq = sequencia();
  const semana = `<section class="bloco semana" aria-label="Últimos 7 dias"><div class="b-hr"><h2 class="b-h">Últimos 7 dias</h2><button class="btn link sm" data-go="desempenho">Desempenho</button></div>
    <div class="sem" role="img" aria-label="Horas de estudo nos últimos 7 dias">${dias.map(d => { const v = (X.days.get(d) || { s: 0 }).s, ok = metaDia(d) && v > 0; return `<div class="sem-c${d === t ? " hoje" : ""}${ehDiaEstudo(d) ? "" : " folga"}" title="${WD[toD(d).getDay()]} ${brs(d)}: ${v ? dur(v) : "sem estudo"}"><span class="sem-v">${v ? dur(v) : ""}</span><span class="sem-b"><i class="${ok ? "ok" : ""}" style="height:${v ? Math.max(4, v / maxS * 100) : 0}%"></i>${h ? `<em style="bottom:${h * 3600 / maxS * 100}%"></em>` : ""}</span><span class="sem-d">${WD[toD(d).getDay()].slice(0, 3)}</span></div>`; }).join("")}</div>
    <p class="hint">${seq ? `${plural(seq, "dia seguido", "dias seguidos")} batendo a meta.` : "Bata a meta hoje para começar uma sequência."}${h ? " A linha marca a meta de horas." : ""}</p>
  </section>`;
  const dica = !syncOn() && !sync.tipOff && DB.sessoes.length >= 1 ? `<div class="aviso dica"><p><b>Estuda no celular e no computador?</b> Ative a sincronização e tenha o mesmo plano, cronômetro e histórico em todos os aparelhos.</p><div class="btns"><button class="btn pri sm" data-act="sync-start">Ativar</button><button class="btn ghost sm" data-act="sync-dica-off">Agora não</button></div></div>` : "";
  return `<div class="hoje">
    <p class="data-hoje">${cap(dSemana(t))}, ${dLonga(t)}</p>
    <div class="col-a">${cont}${dica}${agora}${plano}</div>
    <div class="col-b">${metas}${prazos}${semana}</div>
  </div>`;
};

/* ================= ESTUDAR ================= */
VIEWS.estudar = () => {
  const X = ix(), P = planoHoje(), q = fold(UI.busca);
  const a = DB.ativa;
  const sug = P.itens.filter(i => !i.feito).slice(0, 4);
  const cab = a ? `<section class="agora em-curso"><p class="ag-k">${I.timer}Sessão em andamento</p><h2 class="ag-h">${esc(topNome(atual(a).t))}</h2><div class="btns"><button class="btn pri lg" data-act="foco">${I.timer}Abrir o cronômetro</button></div></section>` : "";
  let gAnt = "";
  const variosGrupos = new Set(X.mats.map(m => m.grupo)).size > 1;
  const lista = X.mats.map(m => {
    const tops = X.topsByMat.get(m.id).filter(t => !q || fold(t.nome).includes(q) || fold(m.nome).includes(q));
    if (!tops.length) return "";
    const aberto = q || UI.edAberta.has("e:" + m.id);
    const cab = variosGrupos && m.grupo !== gAnt ? `<h3 class="mats-g">${esc(GRUPOS[m.grupo] || m.grupo)}</h3>` : "";
    gAnt = m.grupo;
    return cab + `<details class="mat" ${aberto ? "open" : ""} data-k="e:${m.id}"><summary><span class="mat-n">${esc(m.nome)}</span><span class="mat-c">${tops.filter(t => t.teoria).length}/${tops.length}</span>${I.down}</summary>
      <ul class="tops">${tops.map(t => `<li><button class="top-row" data-act="iniciar-sheet" data-id="${t.id}">${glifo(t)}${nomeTop(t)}<span class="top-r">${revTxt(t)}</span></button></li>`).join("")}</ul></details>`;
  }).join("");
  return `<div class="pg">
    <header class="pg-h"><h1>Estudar</h1><p class="lead">Escolha o tópico, ligue o cronômetro e marque as questões que resolver.</p></header>
    ${cab}
    ${!a && sug.length ? `<section class="bloco"><h2 class="b-h">Do plano de hoje</h2><ul class="pl-lista">${sug.map(x => `<li class="pl-it"><button class="pl-go" data-act="estudar" data-t="${x.top.id}" data-tipo="${x.tipo}" aria-label="Estudar ${esc(x.top.nome)}">${I.play}</button><button class="pl-txt" data-act="iniciar-sheet" data-id="${x.top.id}"><span class="pl-k ${x.tipo === "revisao" ? "rev" : "novo"}">${x.tipo === "revisao" ? "Revisão" : "Novo"}</span><span class="pl-n">${esc(x.top.nome)}</span><span class="pl-m">${esc(matNome(x.top.m))}</span></button></li>`).join("")}</ul></section>` : ""}
    <section class="bloco">
      <h2 class="b-h">Todos os tópicos</h2>
      <label class="busca">${I.busca}<input type="search" id="busca-top" placeholder="Buscar tópico ou matéria" value="${esc(UI.busca)}" data-on="busca" autocomplete="off" aria-label="Buscar tópico"></label>
      <div class="mats">${lista || vazio("Nada encontrado", "Tente outra palavra.")}</div>
    </section>
    <p class="centro"><button class="btn link" data-act="registrar">Registrar estudo feito sem o cronômetro</button></p>
  </div>`;
};
VIEWS.estudar.after = () => {
  const i = $("#busca-top");
  if (i) i.addEventListener("input", () => { UI.busca = i.value; clearTimeout(UI.bT); UI.bT = setTimeout(() => { const pos = i.selectionStart; render({ force: true }); const j = $("#busca-top"); if (j) { j.focus(); try { j.setSelectionRange(pos, pos); } catch {} } }, 180); });
};
document.addEventListener("toggle", e => { const d = e.target; if (d.matches && d.matches("details[data-k]")) { if (d.open) UI.edAberta.add(d.dataset.k); else UI.edAberta.delete(d.dataset.k); } }, true);

function iniciarSheet(topId) {
  const t = ix().topById.get(topId); if (!t) return;
  if (DB.ativa) return trocarSheet(topId);
  const st = statT(t.id), tipo = tipoSugerido(t);
  const modo = PREF.modo ?? 0;
  openSheet({ title: t.nome, sub: matNome(t.m),
    body: `<p class="hint">${estadoTxt(t)}${st.n ? `. ${dur(st.s)} estudadas` : ""}${st.a + st.e ? `, ${pctTxt(pct(st.a, st.a + st.e))} de acerto em ${st.a + st.e} questões` : ""}.${t.prox ? ` ${t.prox <= today() ? "A revisão está pendente." : `Próxima revisão em ${dLonga(t.prox)}.`}` : ""}</p>
      <div class="field"><span class="lbl">O que vai fazer</span><div class="seg" role="radiogroup">
        <label><input type="radio" name="is-tipo" value="teoria" ${tipo === "teoria" ? "checked" : ""}><span>Estudar a teoria</span></label>
        <label><input type="radio" name="is-tipo" value="revisao" ${tipo === "revisao" ? "checked" : ""}><span>Revisar</span></label></div></div>
      <div class="field"><span class="lbl">Tempo</span><div class="seg" role="radiogroup">
        ${[[0, "Livre"], [25, "25 min"], [50, "50 min"], [90, "1h30"]].map(([v, l]) => `<label><input type="radio" name="is-meta" value="${v}" ${modo === v ? "checked" : ""}><span>${l}</span></label>`).join("")}</div>
        <p class="hint">No modo livre o cronômetro conta para cima. Com tempo definido, ele avisa quando acabar.</p></div>`,
    foot: `<button class="btn ghost" data-act="topico" data-id="${t.id}">Ver tópico</button><button class="btn pri" data-ok>${I.play}Iniciar</button>`,
    onMount: s => { $("[data-ok]", s).onclick = () => {
      const tp = ($('input[name="is-tipo"]:checked', s) || {}).value || "teoria", m = +(($('input[name="is-meta"]:checked', s) || {}).value || 0);
      PREF.modo = m; savePref(); closeSheet(true); iniciarSessao(t.id, tp, m);
    }; } });
}

/* ---------- modo foco (cronômetro em tela cheia) ---------- */
const MOTIVOS = ["Água ou lanche", "Banheiro", "Celular", "Cansaço", "Interrupção"];
function abrirFoco() { UI.focoAberto = true; renderFoco(); pedirWakeLock(); }
function fecharFoco() { UI.focoAberto = false; renderFoco(); }
function renderFoco() {
  const f = $("#foco"), a = DB.ativa;
  if (!a || !UI.focoAberto) { if (f.innerHTML) { f.innerHTML = ""; f.hidden = true; document.body.classList.remove("com-foco"); } if (!a) UI.focoAberto = false; return; }
  const act = document.activeElement;
  if (act && f.contains(act) && act.tagName === "TEXTAREA") return;
  const now = Date.now(), it = atual(a), pausa = emPausa(a), est = estudoTotal(a, now);
  const qa = it.a || 0, qe = it.e || 0, tq = sum(a.itens.map(x => (x.a || 0) + (x.e || 0)));
  const pAt = pausa ? a.pausas[a.pausas.length - 1] : null;
  f.hidden = false; document.body.classList.add("com-foco");
  f.innerHTML = `<div class="foco-in${pausa ? " pausado" : ""}" role="region" aria-label="Sessão de estudo">
    <div class="foco-bar"><button class="icon-btn" data-act="foco-min" aria-label="Minimizar o cronômetro">${I.down}</button><span>Desde ${horaDe(a.ini)}${a.itens.length > 1 ? `, ${a.itens.length} tópicos` : ""}</span><button class="icon-btn" data-act="foco-menu" aria-label="Mais opções">${I.mais3}</button></div>
    <div class="foco-top"><p class="foco-m">${esc(matNome(it.m))}</p><h2 class="foco-t">${esc(topNome(it.t))}</h2><span class="tag inv">${TIPO_TXT[it.tipo]}</span></div>
    <div class="foco-rel">
      <span class="relogio" data-tick="estudo">${relogio(a.meta ? Math.max(0, a.meta - est) : est)}</span>
      <p class="foco-sub">${pausa ? `Em pausa há <span data-tick="pausa-at">${relogio((now - pAt.ini) / 1000)}</span>` : a.meta ? `faltam de ${dur(a.meta)}` : "de estudo"}</p>
      ${a.meta ? `<div class="foco-meta"><span data-tick="barra" style="width:${Math.min(100, pct(est, a.meta))}%"></span></div>` : ""}
    </div>
    ${pausa ? `<div class="foco-mot"><p>Motivo da pausa (opcional)</p><div class="chips">${MOTIVOS.map(m => `<button class="chip${pAt.mot === m ? " on" : ""}" data-act="motivo" data-m="${m}">${m}</button>`).join("")}</div></div>` : `
    <div class="foco-q" aria-label="Questões resolvidas">
      <div class="q-box ok"><button class="q-btn" data-act="q" data-k="a" data-d="1"><b data-q="a">${qa}</b><span>Acertei</span></button><button class="q-menos" data-act="q" data-k="a" data-d="-1" aria-label="Tirar um acerto">${I.minus}</button></div>
      <div class="q-box er"><button class="q-btn" data-act="q" data-k="e" data-d="1"><b data-q="e">${qe}</b><span>Errei</span></button><button class="q-menos" data-act="q" data-k="e" data-d="-1" aria-label="Tirar um erro">${I.minus}</button></div>
    </div>
    <p class="foco-taxa" data-q="taxa">${qa + qe ? `${pctTxt(pct(qa, qa + qe))} de acerto neste tópico` : "Toque a cada questão que resolver"}${a.itens.length > 1 && tq ? `. ${tq} na sessão` : ""}</p>`}
    <div class="foco-ctl">
      <button class="btn foco-b" data-act="pausar">${pausa ? I.play + "Retomar" : I.pause + "Pausar"}</button>
      <button class="btn foco-b" data-act="trocar">${I.swap}Trocar tópico</button>
      <button class="btn foco-b fim" data-act="concluir">${I.stop}Concluir</button>
    </div>
    <details class="foco-notas" ${a.obs ? "open" : ""}><summary>Anotações da sessão</summary><textarea id="foco-obs" rows="3" placeholder="Dúvidas, páginas, links, o que revisar…" data-on="foco-obs">${esc(a.obs || "")}</textarea></details>
    <p class="foco-atalhos">No teclado: espaço pausa e retoma, A marca acerto, E marca erro.</p>
  </div>`;
}
function atualizarFocoContadores() {
  const a = DB.ativa; if (!a) return; const it = atual(a), qa = it.a || 0, qe = it.e || 0;
  const ea = $('[data-q="a"]'), ee = $('[data-q="e"]'), tx = $('[data-q="taxa"]');
  if (ea) ea.textContent = qa; if (ee) ee.textContent = qe;
  const tq = sum(a.itens.map(x => (x.a || 0) + (x.e || 0)));
  if (tx) tx.textContent = (qa + qe ? `${pctTxt(pct(qa, qa + qe))} de acerto neste tópico` : "Toque a cada questão que resolver") + (a.itens.length > 1 && tq ? `. ${tq} na sessão` : "");
}
document.addEventListener("keydown", e => {
  if (!UI.focoAberto || !DB.ativa || $("#sheet-root").innerHTML || e.ctrlKey || e.metaKey || e.altKey) return;
  if (document.activeElement && document.activeElement.matches("input,textarea,select")) return;
  const k = e.key.toLowerCase();
  if (k === " ") { e.preventDefault(); alternarPausa(); }
  else if ((k === "a" || k === "e") && !emPausa(DB.ativa)) { e.preventDefault(); contarQuestao(k, 1); }
  else if (k === "escape") fecharFoco();
});
setInterval(() => { const a = DB.ativa, el = $('[data-tick="pausa-at"]'); if (a && el && emPausa(a)) el.textContent = relogio((Date.now() - a.pausas[a.pausas.length - 1].ini) / 1000); }, 1000);
function trocarSheet(preTop) {
  const X = ix(), a = DB.ativa; if (!a) return;
  const cur = atual(a);
  openSheet({ title: "Trocar de tópico", tall: true, sub: "O tempo continua contando",
    body: `<label class="busca">${I.busca}<input type="search" id="tr-busca" placeholder="Buscar tópico" autocomplete="off" aria-label="Buscar tópico"></label>
      <div class="field"><div class="seg" role="radiogroup"><label><input type="radio" name="tr-tipo" value="teoria" checked><span>Teoria</span></label><label><input type="radio" name="tr-tipo" value="revisao"><span>Revisão</span></label></div></div>
      <ul class="tops tr-lista">${X.mats.map(m => `<li class="tr-g">${esc(m.nome)}</li>` + X.topsByMat.get(m.id).map(t => `<li data-f="${esc(fold(t.nome + " " + m.nome))}"><button class="top-row${t.id === preTop ? " sel" : ""}" data-pick="${t.id}" ${t.id === cur.t ? "disabled" : ""}>${glifo(t)}${nomeTop(t)}<span class="top-r">${t.id === cur.t ? '<span class="tag">Agora</span>' : revTxt(t)}</span></button></li>`).join("")).join("")}</ul>`,
    onMount: s => {
      const inp = $("#tr-busca", s);
      inp.addEventListener("input", () => { const q = fold(inp.value); $$("li[data-f]", s).forEach(li => { li.hidden = q && !li.dataset.f.includes(q); }); $$(".tr-g", s).forEach(g => { let n = g.nextElementSibling, vis = false; while (n && !n.classList.contains("tr-g")) { if (!n.hidden) vis = true; n = n.nextElementSibling; } g.hidden = !vis; }); });
      const setTipo = id => { const t = X.topById.get(id); const r = $(`input[name="tr-tipo"][value="${tipoSugerido(t)}"]`, s); if (r) r.checked = true; };
      s.addEventListener("click", e => {
        const b = e.target.closest("[data-pick]"); if (!b) return;
        const tp = ($('input[name="tr-tipo"]:checked', s) || {}).value || "teoria";
        closeSheet(true); trocarTopico(b.dataset.pick, tp); toast(`Agora: ${topNome(b.dataset.pick)}`);
      });
      if (preTop) { setTipo(preTop); const el = $(".sel", s); el && el.scrollIntoView({ block: "center" }); }
    } });
}
function concluirSheet() {
  const a = DB.ativa; if (!a) return;
  const now = Date.now(), est = estudoTotal(a, now), tq = sum(a.itens.map(x => (x.a || 0) + (x.e || 0))), ta = sum(a.itens.map(x => x.a || 0));
  const porTop = new Map(); for (const it of a.itens) { const o = porTop.get(it.t) || { s: 0, a: 0, e: 0, tipos: new Set() }; o.s += estudoItem(a, it, now); o.a += it.a || 0; o.e += it.e || 0; o.tipos.add(it.tipo); porTop.set(it.t, o); }
  openSheet({ title: "Concluir sessão", sub: `${dur(est)} de estudo${tq ? `, ${tq} questões (${pctTxt(pct(ta, tq))} certas)` : ""}`,
    body: `<ul class="cc-lista">${[...porTop].map(([id, o]) => { const t = ix().topById.get(id) || { nome: topNome(id), teoria: false }; const teo = o.tipos.has("teoria");
      return `<li><p class="cc-n">${esc(t.nome)}</p><p class="hint">${dur(o.s)}${o.a + o.e ? `, ${o.a} de ${o.a + o.e} questões certas` : ""}. ${[...o.tipos].map(x => TIPO_TXT[x]).join(" e ")}.</p>
        ${teo ? (t.teoria ? `<p class="hint">A teoria deste tópico já estava concluída.</p>` : `<label class="check"><input type="checkbox" data-cc="${id}"><span>Terminei a teoria deste tópico</span></label>`) : ""}</li>`; }).join("")}</ul>
      <label class="field"><span class="lbl">Anotações</span><textarea id="cc-obs" rows="3" placeholder="Opcional">${esc(a.obs || "")}</textarea></label>
      <p class="hint">As revisões dos tópicos estudados entram no plano pelo ciclo ${cfg().ciclo.join(", ")} dias.</p>`,
    foot: `<button class="btn ghost" data-no>Continuar estudando</button><button class="btn pri" data-ok>${I.check}Salvar sessão</button>`,
    onMount: s => {
      $("[data-no]", s).onclick = () => closeSheet();
      $("[data-ok]", s).onclick = () => {
        const feitas = new Set($$("[data-cc]", s).filter(x => x.checked).map(x => x.dataset.cc));
        const obs = $("#cc-obs", s).value;
        closeSheet(true); UI.focoAberto = false;
        const ses = salvarSessao(feitas, obs);
        if (ses) toast(`Sessão salva: ${dur(ses.s)} de estudo${ses.a + ses.e ? ` e ${ses.a + ses.e} questões` : ""}.`);
        else toast("Sessão curta demais para salvar.");
        go("hoje");
      };
    } });
}
Object.assign(ACT, {
  "nav-estudar": () => { if (DB.ativa) abrirFoco(); else go("estudar"); },
  "foco": () => abrirFoco(),
  "foco-min": () => { fecharFoco(); },
  "foco-menu": () => openSheet({ title: "Sessão de estudo", body: `<div class="menu">
      <button class="menu-it" data-act="registrar-pausa-txt">${I.timer}<span>Iniciada às ${horaDe(DB.ativa.ini)}. Pausas somam <b>${dur(pausaTotal(DB.ativa, Date.now()))}</b>.</span></button>
      ${DB.ativa.meta ? `<button class="menu-it" data-act="continuar-livre">${I.timer}<span>Tirar o tempo definido e contar livre</span></button>` : ""}
      <button class="menu-it danger" data-act="descartar">${I.lixo}<span>Descartar a sessão sem salvar</span></button></div>` }),
  "registrar-pausa-txt": () => closeSheet(),
  "continuar-livre": () => { closeSheet(true); const a = DB.ativa; if (!a) return; a.meta = 0; commit(); },
  "descartar": () => confirmSheet("Descartar a sessão?", "O tempo e as questões desta sessão não serão salvos.", "Descartar", () => { DB.ativa = null; UI.focoAberto = false; liberarWakeLock(); commit(); toast("Sessão descartada."); }),
  "pausar": () => alternarPausa(),
  "motivo": el => { const a = DB.ativa; if (!a || !emPausa(a)) return; const p = a.pausas[a.pausas.length - 1]; p.mot = p.mot === el.dataset.m ? "" : el.dataset.m; commit(); },
  "q": el => { contarQuestao(el.dataset.k, +el.dataset.d); if (+el.dataset.d > 0) { try { navigator.vibrate && navigator.vibrate(12); } catch {} } },
  "trocar": () => trocarSheet(),
  "concluir": () => { closeSheet(true); concluirSheet(); },
  "estudar": el => { closeSheet(true); if (DB.ativa) { const t = el.dataset.t; if (t && atual(DB.ativa).t !== t) trocarSheet(t); else abrirFoco(); return; } iniciarSessao(el.dataset.t, el.dataset.tipo, PREF.modo || 0); },
  "iniciar-sheet": el => iniciarSheet(el.dataset.id),
  "topico": el => topicoSheet(el.dataset.id)
});
Object.assign(ON, {
  "foco-obs": el => { const a = DB.ativa; if (!a) return; a.obs = el.value; commit({ quiet: true }); },
  "busca": () => {}
});
document.addEventListener("input", e => { if (e.target.id === "foco-obs" && DB.ativa) { DB.ativa.obs = e.target.value; clearTimeout(UI.obsT); UI.obsT = setTimeout(() => commit({ quiet: true }), 1200); } });

/* ---------- ficha do tópico ---------- */
function topicoSheet(id) {
  const t = ix().topById.get(id); if (!t) return;
  const st = statT(id), q = st.a + st.e, tday = today();
  const hist = ix().sess.flatMap(s => (s.itens || []).filter(i => i.t === id).map(i => ({ s, i }))).slice(0, 12);
  openSheet({ title: t.nome, sub: matNome(t.m), tall: hist.length > 3,
    body: `${!t.ult && !st.n && !t.teoria ? `<p class="lead">Você ainda não estudou este tópico. Quando estudar, o app agenda as revisões dele.</p>` : `<div class="ficha">
      <div class="fi"><span>Situação</span><b>${estadoTxt(t)}</b></div>
      <div class="fi"><span>Tempo estudado</span><b>${st.s ? dur(st.s) : "Nenhum"}</b></div>
      <div class="fi"><span>Questões</span><b>${q ? `${st.a} de ${q} certas (${pctTxt(pct(st.a, q))})` : "Nenhuma"}</b></div>
      <div class="fi"><span>Último estudo</span><b>${t.ult ? `${dLonga(t.ult)} (${quando(diffD(tday, t.ult))})` : "Nunca"}</b></div>
      <div class="fi"><span>Revisões feitas</span><b>${t.rev || 0}${t.ur ? `, a última em ${dLonga(t.ur)}` : ""}</b></div>
      <div class="fi"><span>Próxima revisão</span><b>${t.prox ? `${dLonga(t.prox)} (${quando(diffD(tday, t.prox))})` : "Começa quando você estudar"}</b></div>
    </div>`}
    <label class="check"><input type="checkbox" data-on="teoria" data-id="${id}" ${t.teoria ? "checked" : ""}><span>Teoria concluída</span></label>
    ${t.prox ? `<div class="btns">${t.prox <= tday ? `<button class="btn ghost sm" data-act="rev-feita" data-id="${id}">${I.check}Revisão feita</button><button class="btn ghost sm" data-act="rev-adiar" data-id="${id}">Adiar para o próximo dia</button>` : `<button class="btn ghost sm" data-act="rev-feita" data-id="${id}">${I.check}Revisei hoje</button>`}</div>` : ""}
    <label class="field"><span class="lbl">Anotações do tópico</span><textarea id="tp-nota" rows="3" placeholder="Resumo, artigos de lei, onde errou nas questões…">${esc(t.nota || "")}</textarea></label>
    ${hist.length ? `<div class="field"><span class="lbl">Histórico</span><ul class="hist-mini">${hist.map(({ s, i }) => `<li><span>${brs(s.d)}</span><span>${TIPO_TXT[i.tipo]}</span><span>${dur(i.s)}</span><span>${i.a + i.e ? `${i.a}/${i.a + i.e}` : ""}</span></li>`).join("")}</ul></div>` : ""}`,
    foot: `<button class="btn pri" data-act="estudar" data-t="${id}" data-tipo="${tipoSugerido(t)}">${I.play}${DB.ativa ? "Estudar este agora" : "Estudar"}</button>`,
    onClose: () => {},
    onMount: s => {
      const n = $("#tp-nota", s);
      n.addEventListener("change", () => { t.nota = n.value; commit({ quiet: true }); });
      n.addEventListener("blur", () => { if (t.nota !== n.value) { t.nota = n.value; commit({ quiet: true }); } });
    } });
}
function revisoesSheet() {
  const P = planoHoje(), L = P.revPend, t = today();
  openSheet({ title: "Revisões vencidas", sub: plural(L.length, "tópico para revisar", "tópicos para revisar"), tall: true,
    body: L.length ? `<p class="hint">Das mais atrasadas para as mais recentes. Marque como feita se revisou sem o cronômetro, ou adie para o próximo dia de estudo.</p>
      <ul class="pl-lista">${L.map(x => `<li class="pl-it"><button class="pl-go" data-act="estudar" data-t="${x.top.id}" data-tipo="revisao" aria-label="Revisar ${esc(x.top.nome)}">${I.play}</button>
        <button class="pl-txt" data-act="topico" data-id="${x.top.id}"><span class="pl-k rev">${x.atraso ? `${plural(x.atraso, "dia", "dias")} de atraso` : "Para hoje"}</span><span class="pl-n">${esc(x.top.nome)}</span><span class="pl-m">${esc(matNome(x.top.m))}</span></button>
        <span class="rv-acts"><button class="icon-btn" data-act="rev-feita" data-id="${x.top.id}" aria-label="Revisão feita" title="Revisão feita">${I.check}</button><button class="icon-btn" data-act="rev-adiar" data-id="${x.top.id}" aria-label="Adiar" title="Adiar para o próximo dia">${I.chev}</button></span></li>`).join("")}</ul>`
      : `<p class="lead">Nenhuma revisão vencida. Tudo em dia.</p>` });
}
Object.assign(ACT, {
  "revisoes": () => revisoesSheet(),
  "rev-feita": el => { const lista = !!el.closest(".sheet") && $(".sheet h2") && $(".sheet h2").textContent === "Revisões vencidas"; closeSheet(true); revisaoFeita(el.dataset.id); if (lista) revisoesSheet(); },
  "rev-adiar": el => { const lista = !!el.closest(".sheet") && $(".sheet h2") && $(".sheet h2").textContent === "Revisões vencidas"; closeSheet(true); adiarRevisao(el.dataset.id); if (lista) revisoesSheet(); }
});
Object.assign(ON, {
  "teoria": el => { marcarTeoria(el.dataset.id, el.checked); toast(el.checked ? "Teoria marcada como concluída." : "Teoria desmarcada."); }
});

/* ================= EDITAL ================= */
const ED_TABS = [["conteudo", "Conteúdo"], ["prova", "Prova"], ["datas", "Datas"], ["sobre", "Sobre"]];
VIEWS.edital = r => {
  const X = ix(), c = X.c, tab = ED_TABS.some(x => x[0] === r.sub) ? r.sub : "conteudo";
  const perfil = (c.perfis || []).find(p => p.id === c.perfil);
  const body = tab === "prova" ? edProva(c) : tab === "datas" ? edDatas(c) : tab === "sobre" ? edSobre(c) : edConteudo(c);
  return `<div class="pg">
    <header class="pg-h ed-h">
      <p class="ed-org">${esc(c.orgao)}${c.sigla ? ` (${esc(c.sigla)})` : ""}${c.banca ? `, banca ${esc(c.banca)}` : ""}</p>
      <h1>${esc(c.cargo || c.orgao)}</h1>
      ${perfil ? `<p class="ed-perfil">Perfil <b>${esc(perfil.nome)}</b> <button class="btn link sm" data-act="perfil">Trocar</button></p>` : ""}
      ${DB.concursos.length > 1 ? `<p><button class="btn link sm" data-go="ajustes">Trocar de concurso</button></p>` : ""}
    </header>
    <nav class="tabs" aria-label="Partes do edital">${ED_TABS.map(([k, l]) => `<button data-go="edital/${k}" ${k === tab ? 'aria-current="page"' : ""}>${l}</button>`).join("")}</nav>
    ${body}
  </div>`;
};
function edConteudo(c) {
  const X = ix(), E = resumoEdital(), t = today();
  if (!X.mats.length) return vazio("Este concurso ainda não tem conteúdo", "Anexe o PDF do edital ou cole o conteúdo programático.", `<button class="btn pri" data-act="conteudo-colar">Adicionar conteúdo</button>`);
  const grupos = [...new Set(X.mats.map(m => m.grupo))];
  const totQ = sum(X.mats.map(m => m.q || 0));
  return `<section class="ed-res">
    <p><b>${E.teo} de ${E.n}</b> tópicos com a teoria concluída${E.est > E.teo ? ` e ${E.est - E.teo} em andamento` : ""}.</p>
    <div class="trilha" aria-hidden="true"><span style="width:${E.pc}%"></span><span class="tr-b" style="width:${pct(E.est - E.teo, E.n)}%"></span></div>
    <p class="legenda"><span><i class="st st-2"></i><span class="tn hl">Teoria concluída</span></span><span><i class="st st-1"></i><span class="tn ul">Em andamento</span></span><span><i class="st st-0"></i>Não estudado</span></p>
  </section>
  ${grupos.map(g => {
    const ms = X.mats.filter(m => m.grupo === g), q = sum(ms.map(m => m.q || 0)), pts = sum(ms.map(m => X.pts.get(m.id) || 0));
    return `<section class="grupo"><div class="g-h"><h2>${esc(GRUPOS[g] || g)}</h2>${q ? `<p>${dec(q)} questões, ${dec(pts)} pontos${X.ptsTot ? `, ${pctTxt(pct(pts, X.ptsTot))} da nota` : ""}</p>` : ""}</div>
      ${ms.map(m => {
        const tops = X.topsByMat.get(m.id), teo = tops.filter(x => x.teoria).length, est = tops.filter(x => x.ult && !x.teoria).length;
        const sm = X.stM.get(m.id) || { s: 0, a: 0, e: 0 }, qq = sm.a + sm.e, due = tops.filter(x => x.prox && x.prox <= t).length;
        const aberto = UI.edAberta.has("m:" + m.id);
        return `<details class="mat" ${aberto ? "open" : ""} data-k="m:${m.id}"><summary>
          <span class="mat-n">${esc(m.nome)}</span>
          <span class="mat-info">${m.q ? `${m.q % 1 ? "cerca de " + dec(m.q) : dec(m.q)} ${m.q === 1 ? "questão" : "questões"}, ` : ""}${teo} de ${tops.length} concluídos${due ? `, <span class="rev-txt">${plural(due, "revisão", "revisões")}</span>` : ""}</span>
          <span class="mat-bar" aria-hidden="true"><i style="width:${pct(teo, tops.length)}%"></i><i class="b" style="width:${pct(est, tops.length)}%"></i></span>
          ${I.down}</summary>
          <ul class="tops">${tops.map(x => { const s = statT(x.id), qx = s.a + s.e; return `<li><button class="top-row" data-act="topico" data-id="${x.id}">${glifo(x)}${nomeTop(x)}<span class="top-r">${revTxt(x)}${qx ? `<span class="tag ${pct(s.a, qx) < 60 ? "bad" : ""}">${pctTxt(pct(s.a, qx))} em ${qx}</span>` : ""}</span></button></li>`; }).join("")}</ul>
          <div class="mat-f">${sm.s ? `<span class="hint">${dur(sm.s)} estudadas${qq ? `, ${pctTxt(pct(sm.a, qq))} de acerto em ${qq} questões` : ""}.</span>` : `<span class="hint">Ainda sem estudo registrado.</span>`}<button class="btn link sm" data-act="mat-editar" data-id="${m.id}">${I.lapis}Editar tópicos</button></div>
        </details>`;
      }).join("")}
    </section>`;
  }).join("")}
  ${totQ ? "" : ""}
  <p class="centro"><button class="btn link" data-act="mat-nova">${I.plus}Adicionar matéria</button></p>`;
}
function edProva(c) {
  const X = ix(), P = c.prova;
  const grupos = [...new Set(X.mats.map(m => m.grupo))];
  const linhas = grupos.map(g => {
    const ms = X.mats.filter(m => m.grupo === g), q = sum(ms.map(m => m.q || 0)), pts = sum(ms.map(m => X.pts.get(m.id) || 0));
    return { g, nome: GRUPOS[g] || g, ms, q, pts };
  });
  const tot = X.ptsTot || 1;
  const cores = ["c1", "c2", "c3", "c4"];
  const estrutura = X.ptsTot ? `<section class="bloco">
    <h2 class="b-h">Quanto vale cada parte</h2>
    <p class="hint">${P ? `${P.questoes} questões, ${dec(P.total)} pontos. ` : ""}A barra mostra o peso de cada área na nota da prova objetiva.</p>
    <div class="pesos" role="img" aria-label="${esc(linhas.map(l => `${l.nome}: ${pctTxt(pct(l.pts, tot))}`).join("; "))}">${linhas.map((l, i) => `<span class="${cores[i % 4]}" style="width:${pct(l.pts, tot)}%" title="${esc(l.nome)}: ${dec(l.pts)} pontos"></span>`).join("")}</div>
    <ul class="pesos-leg">${linhas.map((l, i) => `<li><i class="${cores[i % 4]}"></i><span>${esc(l.nome)}</span><b>${pctTxt(pct(l.pts, tot))}</b></li>`).join("")}</ul>
    <table class="tb"><thead><tr><th>Matéria</th><th class="n">Questões</th><th class="n">Pontos</th></tr></thead><tbody>
      ${linhas.map(l => `<tr class="tb-g"><td>${esc(l.nome)}</td><td class="n">${dec(l.q)}</td><td class="n">${dec(l.pts)}</td></tr>` + l.ms.map(m => `<tr><td>${esc(m.nome)}</td><td class="n">${m.q ? (m.q % 1 ? "≈" + dec(m.q) : dec(m.q)) : "—"}</td><td class="n">${dec(X.pts.get(m.id) || 0)}</td></tr>`).join("")).join("")}
    </tbody></table>
    ${linhas.some(l => l.g === "esp") && c.id === EDITAL_ABDI.id ? `<p class="hint">O edital não divide as 20 questões específicas entre os temas do perfil. A estimativa por tema segue o número de tópicos de cada um.</p>` : ""}
  </section>` : "";
  const crit = P ? `<section class="aviso"><p><b>Para passar na prova objetiva:</b> acertar pelo menos ${Math.ceil(P.questoes * P.minPct / 100)} das ${P.questoes} questões (${P.minPct}%)${P.naoZerar ? " e não zerar nenhuma das áreas" : ""}.</p></section>` : "";
  const sims = DB.simulados.filter(s => s.c === c.id).sort((a, b) => b.d.localeCompare(a.d));
  const simHtml = `<section class="bloco">
    <div class="b-hr"><h2 class="b-h">Simulados</h2><button class="btn ghost sm" data-act="simulado">${I.plus}Registrar simulado</button></div>
    ${sims.length ? graficoSimulados(c, sims.slice().reverse()) + `<ul class="sim-lista">${sims.map(s => { const r = notaSimulado(c, s); return `<li><button class="sim-it" data-act="simulado" data-id="${s.id}"><span class="sim-d">${dCurta(s.d)}</span><span class="sim-n">${esc(s.nome || "Simulado")}</span><span class="sim-v"><b>${r.max ? dec(r.nota, 2) + " de " + dec(r.max) : r.acertos + " de " + r.q}</b>${r.max ? `<span class="tag ${r.passa ? "ok" : "bad"}">${r.passa ? "Passaria" : "Não passaria"}</span>` : ""}</span></button></li>`; }).join("")}</ul>`
      : `<p class="hint">Fez uma prova anterior da banca ou um simulado? Registre os acertos por área e o app calcula a nota${P ? " e diz se você passaria" : ""}.</p>`}
  </section>`;
  return estrutura + crit + simHtml;
}
function notaSimulado(c, s) {
  const P = c.prova;
  if (P && P.grupos) {
    let nota = 0, ac = 0, zerou = false;
    for (const g of P.grupos) { const a = +((s.r || {})[g.id] || 0); nota += a * g.valor; ac += a; if (!a) zerou = true; }
    const passa = ac >= Math.ceil(P.questoes * P.minPct / 100) && !(P.naoZerar && zerou);
    return { nota, max: P.total, acertos: ac, q: P.questoes, passa };
  }
  return { nota: 0, max: 0, acertos: +(s.acertos || 0), q: +(s.q || 0), passa: false };
}
function graficoSimulados(c, sims) {
  if (sims.length < 2) return "";
  const R = sims.map(s => notaSimulado(c, s)), max = R[0].max || Math.max(...R.map(r => r.q));
  const val = r => r.max ? r.nota : r.acertos;
  const W = 320, H = 120, pl = 8, pr = 8, pt = 14, pb = 18, n = sims.length;
  const x = i => pl + (n === 1 ? (W - pl - pr) / 2 : i * (W - pl - pr) / (n - 1)), y = v => pt + (1 - v / max) * (H - pt - pb);
  const corte = c.prova ? Math.ceil(c.prova.questoes * c.prova.minPct / 100) : 0;
  const pts = R.map((r, i) => `${x(i).toFixed(1)},${y(val(r)).toFixed(1)}`).join(" ");
  return `<figure class="sim-graf"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolução das notas dos simulados">
    <line x1="${pl}" x2="${W - pr}" y1="${y(0)}" y2="${y(0)}" class="ax"/>
    <polyline points="${pts}" class="ln"/>
    ${R.map((r, i) => `<circle cx="${x(i)}" cy="${y(val(r))}" r="4.5" class="dt"><title>${dCurta(sims[i].d)}: ${r.max ? dec(r.nota, 2) + " pontos" : r.acertos + " acertos"}</title></circle>`).join("")}
    <text x="${x(n - 1)}" y="${y(val(R[n - 1])) - 8}" text-anchor="end" class="lb">${R[n - 1].max ? dec(R[n - 1].nota, 1) : R[n - 1].acertos}</text>
  </svg><figcaption>Nota de cada simulado, do mais antigo ao mais recente, numa escala até ${dec(max)}.${corte && R[0].max ? "" : ""}</figcaption></figure>`;
}
function simuladoSheet(id) {
  const c = ix().c, s = id ? DB.simulados.find(x => x.id === id) : null, P = c.prova;
  const v = s || { d: today(), nome: "", r: {}, obs: "" };
  openSheet({ title: s ? "Editar simulado" : "Registrar simulado",
    body: `<div class="grid2"><label class="field"><span class="lbl">Data</span><input type="date" id="si-d" value="${v.d}"></label><label class="field"><span class="lbl">Nome</span><input type="text" id="si-n" value="${esc(v.nome)}" placeholder="Ex.: FGV 2024, simulado 1"></label></div>
      ${P && P.grupos ? P.grupos.map(g => `<label class="field"><span class="lbl">${esc(g.nome)}: acertos de ${g.q}</span><input type="number" inputmode="numeric" min="0" max="${g.q}" id="si-${g.id}" value="${(v.r || {})[g.id] ?? ""}" data-si></label>`).join("")
        : `<div class="grid2"><label class="field"><span class="lbl">Acertos</span><input type="number" min="0" id="si-a" value="${v.acertos ?? ""}" data-si></label><label class="field"><span class="lbl">Questões</span><input type="number" min="1" id="si-q" value="${v.q ?? ""}" data-si></label></div>`}
      <p class="aviso" id="si-res" aria-live="polite"></p>
      <label class="field"><span class="lbl">Anotações</span><textarea id="si-o" rows="2" placeholder="O que mais errou, tempo de prova…">${esc(v.obs || "")}</textarea></label>`,
    foot: `${s ? `<button class="btn ghost danger" data-del>${I.lixo}Excluir</button>` : ""}<button class="btn pri" data-ok>Salvar</button>`,
    onMount: sh => {
      const ler = () => { const o = { d: $("#si-d", sh).value || today(), nome: $("#si-n", sh).value.trim(), obs: $("#si-o", sh).value.trim(), r: {} };
        if (P && P.grupos) for (const g of P.grupos) o.r[g.id] = clamp(parseInt($("#si-" + g.id, sh).value) || 0, 0, g.q);
        else { o.acertos = Math.max(0, parseInt($("#si-a", sh).value) || 0); o.q = Math.max(o.acertos, parseInt($("#si-q", sh).value) || 0); }
        return o; };
      const res = () => { const o = ler(), r = notaSimulado(c, o); $("#si-res", sh).innerHTML = r.max ? `<b>${dec(r.nota, 2)} de ${dec(r.max)} pontos</b>, ${r.acertos} de ${r.q} questões. ${r.passa ? "Com esse resultado você passaria na prova objetiva." : P.naoZerar && P.grupos.some(g => !o.r[g.id]) && r.acertos ? "Zerar uma área elimina, mesmo com nota alta." : `Faltariam ${Math.max(0, Math.ceil(P.questoes * P.minPct / 100) - r.acertos)} acertos para passar.`}` : `${r.acertos} de ${r.q || 0} questões (${pctTxt(pct(r.acertos, r.q))}).`; };
      $$("[data-si]", sh).forEach(i => i.addEventListener("input", res)); res();
      $("[data-ok]", sh).onclick = () => { const o = ler(); if (s) Object.assign(s, o); else DB.simulados.push({ id: uid(), c: c.id, ...o }); commit(); closeSheet(); toast("Simulado salvo."); };
      const d = $("[data-del]", sh); if (d) d.onclick = () => { closeSheet(true); confirmSheet("Excluir simulado?", "O resultado sai da lista.", "Excluir", () => { DB.simulados = DB.simulados.filter(x => x.id !== id); commit(); toast("Simulado excluído."); }); };
    } });
}
function edDatas(c) {
  const t = today(), todas = datasConcurso(c), passadas = todas.filter(d => (d.fim || d.ini) < t).length;
  const ds = UI.dtPassadas ? todas : todas.filter(d => (d.fim || d.ini) >= t);
  let mes = "", h = passadas ? `<p class="centro"><button class="btn link sm" data-act="dt-passadas">${UI.dtPassadas ? "Esconder as datas que já passaram" : `Mostrar ${plural(passadas, "data que já passou", "datas que já passaram")}`}</button></p>` : "";
  for (const d of ds) {
    const m = d.ini.slice(0, 7);
    if (m !== mes) { if (mes) h += "</ul>"; mes = m; h += `<h3 class="mes-h">${cap(MESES[+m.slice(5) - 1])} de ${m.slice(0, 4)}</h3><ul class="crono">`; }
    const s = prazoStatus(d, t);
    h += `<li class="cr ${s.k}${d.acao ? " acao" : ""}${d.tipo === "prova" ? " prova" : ""}"><span class="cr-d">${dataRot(d)}</span><span class="cr-t">${esc(d.titulo)}${d.acao && s.k !== "s-passou" ? `<span class="cr-a">Depende de você</span>` : ""}</span><span class="cr-s">${s.txt}</span></li>`;
  }
  if (mes) h += "</ul>";
  return `<section class="bloco">
    <p class="hint">Cronograma previsto pela banca. Datas marcadas como <b>Depende de você</b> exigem uma ação sua, como pagar a taxa ou enviar o currículo. Confira as retificações no site do concurso.</p>
    <div class="btns"><button class="btn ghost sm" data-act="datas-editar">${I.lapis}Editar datas</button><button class="btn ghost sm" data-act="ics">${I.baixar}Levar para a agenda do celular</button></div>
  </section>
  ${ds.length ? h : vazio("Nenhuma data cadastrada", "Adicione as datas do cronograma do edital.")}`;
}
function edSobre(c) {
  const p = (c.perfis || []).find(x => x.id === c.perfil);
  const kv = [["Órgão", c.orgao], ["Cargo", c.cargo], ["Banca", c.banca], ["Edital", c.numero ? "nº " + c.numero : ""], ["Remuneração", c.remuneracao], ["Lotação", c.lotacao], ["Regime", c.regime], ["Taxa de inscrição", c.taxa], ["Validade", c.validade], ["Vagas do perfil", p ? `${plural(p.vagas, "imediata", "imediatas")} e ${p.cr} no cadastro reserva` : c.vagas || ""]].filter(x => x[1]);
  return `<section class="bloco"><dl class="dl">${kv.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
    ${c.site ? `<div class="btns"><a class="btn ghost sm" href="${esc(c.site)}" target="_blank" rel="noopener">${I.externo}Página do concurso</a>${c.email ? `<a class="btn ghost sm" href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : ""}</div>` : ""}</section>
  ${p ? `<section class="bloco"><h2 class="b-h">Requisitos do perfil ${esc(p.nome)}</h2><p>${esc(p.requisito)}</p><p class="hint">Os documentos são exigidos só na contratação.</p></section>` : ""}
  ${c.provaNotas && c.provaNotas.length ? `<section class="bloco"><h2 class="b-h">Como é a prova</h2><ul class="notas">${c.provaNotas.map(n => `<li>${esc(n)}</li>`).join("")}</ul></section>` : ""}
  ${c.etapas && c.etapas.length ? `<section class="bloco"><h2 class="b-h">Etapas e pontuação</h2><ul class="etapas">${c.etapas.map(e => `<li><div class="et-h"><b>${esc(e.nome)}</b><span>${dec(e.pontos)} pontos</span></div><p class="hint">${esc(e.tipo)}. ${esc(e.texto)}</p></li>`).join("")}</ul>
    <p class="hint">A nota final soma as três etapas, até ${dec(sum(c.etapas.map(e => e.pontos)))} pontos.${c.desempate ? ` Desempate: ${esc(c.desempate)}` : ""}</p></section>` : ""}`;
}
function perfilSheet() {
  const c = DB.concursos.find(x => x.id === EDITAL_ABDI.id); if (!c) return;
  openSheet({ title: "Trocar de perfil", tall: true,
    body: `<p class="hint">Os conhecimentos gerais e institucionais continuam iguais. Os específicos do perfil atual ficam guardados com o que você já estudou e voltam se você escolher o perfil de novo.</p>
      <div class="perfis">${c.perfis.map(p => `<label class="perfil${c.perfil === p.id ? " on" : ""}"><input type="radio" name="pf" value="${p.id}" ${c.perfil === p.id ? "checked" : ""}><span class="perfil-n">${esc(p.nome)}</span><span class="perfil-v">${plural(p.vagas, "vaga", "vagas")} e ${p.cr} no cadastro reserva</span></label>`).join("")}</div>`,
    foot: `<button class="btn ghost" data-no>Cancelar</button><button class="btn pri" data-ok>Trocar</button>`,
    onMount: s => {
      s.addEventListener("change", () => $$(".perfil", s).forEach(l => l.classList.toggle("on", $("input", l).checked)));
      $("[data-no]", s).onclick = () => closeSheet();
      $("[data-ok]", s).onclick = () => { const v = ($('input[name="pf"]:checked', s) || {}).value; closeSheet(true); if (v && v !== c.perfil) trocarPerfil(v); };
    } });
}
function materiaSheet(mid) {
  const X = ix(), m = mid ? X.matById.get(mid) : null, tops = m ? X.topsByMat.get(m.id) || [] : [];
  const c = X.c;
  openSheet({ title: m ? "Editar matéria" : "Nova matéria", tall: true,
    body: `<label class="field"><span class="lbl">Nome</span><input type="text" id="ms-n" value="${esc(m ? m.nome : "")}" placeholder="Ex.: Direito Administrativo"></label>
      <div class="grid2"><label class="field"><span class="lbl">Questões na prova</span><input type="number" inputmode="decimal" min="0" step="0.1" id="ms-q" value="${m ? m.q || "" : ""}"></label>
      <label class="field"><span class="lbl">Valor de cada questão</span><input type="number" inputmode="decimal" min="0" step="0.05" id="ms-v" value="${m ? m.valor || 1 : (c.prova ? 0.3 : 1)}"></label></div>
      <label class="field"><span class="lbl">Tópicos, um por linha</span><textarea id="ms-t" rows="12">${esc(tops.map(t => t.nome).join("\n"))}</textarea></label>
      <p class="hint">Corrigir o nome mantém o histórico do tópico. Apagar uma linha remove o tópico; se ele já tiver estudo, o histórico continua guardado.</p>`,
    foot: `${m ? `<button class="btn ghost danger" data-del>${I.lixo}Excluir matéria</button>` : ""}<button class="btn pri" data-ok>Salvar</button>`,
    onMount: s => {
      $("[data-ok]", s).onclick = () => {
        const nome = $("#ms-n", s).value.trim(); if (!nome) return toast("Dê um nome à matéria.");
        const linhas = $("#ms-t", s).value.split("\n").map(x => x.replace(/\s+/g, " ").trim()).filter(Boolean);
        const q = Math.max(0, parseFloat(String($("#ms-q", s).value).replace(",", ".")) || 0), v = Math.max(0, parseFloat(String($("#ms-v", s).value).replace(",", ".")) || 1);
        let mat = m;
        if (!mat) { mat = { id: uid(), c: c.id, grupo: X.mats.some(x => x.grupo === "geral") || !X.mats.length ? "geral" : X.mats[X.mats.length - 1].grupo, nome, q, valor: v, ord: Math.max(0, ...X.mats.map(x => x.ord)) + 1 }; DB.materias.push(mat); }
        Object.assign(mat, { nome, q, valor: v });
        const antigos = DB.topicos.filter(t => t.m === mat.id), usados = new Set();
        linhas.forEach((ln, i) => {
          let t = antigos.find(x => !usados.has(x.id) && fold(x.nome) === fold(ln)) || (antigos[i] && !usados.has(antigos[i].id) && !linhas.some(l => fold(l) === fold(antigos[i].nome)) ? antigos[i] : null);
          if (!t) { t = novoTopico(uid(), mat.id, ln, i); DB.topicos.push(t); }
          t.nome = ln; t.ord = i; usados.add(t.id);
        });
        DB.topicos = DB.topicos.filter(t => t.m !== mat.id || usados.has(t.id));
        commit(); closeSheet(); toast("Matéria salva.");
      };
      const d = $("[data-del]", s); if (d) d.onclick = () => { closeSheet(true); confirmSheet("Excluir a matéria?", `${esc(m.nome)} e seus tópicos saem do edital. As sessões já registradas continuam no histórico.`, "Excluir", () => { DB.materias = DB.materias.filter(x => x.id !== m.id); DB.topicos = DB.topicos.filter(t => t.m !== m.id); commit(); toast("Matéria excluída."); }); };
    } });
}
const TIPOS_DATA = [["inscricao", "Inscrições"], ["isencao", "Isenção da taxa"], ["pagamento", "Pagamento"], ["envio", "Envio de documentos"], ["aviso", "Aviso"], ["prova", "Prova"], ["gabarito", "Gabarito"], ["recurso", "Recursos"], ["resultado", "Resultado"], ["convocacao", "Convocação"], ["etapa", "Outra etapa"], ["final", "Resultado final"], ["publicacao", "Publicação"], ["outro", "Outra data"]];
function datasSheet() {
  const c = ix().c, lista = clone(datasConcurso(c).filter(d => d.id !== "prova" || !c.datas.length));
  const linha = (d, i) => `<li class="dt-row" data-i="${i}">
    <input type="text" data-k="titulo" value="${esc(d.titulo)}" aria-label="Descrição" placeholder="Descrição">
    <div class="grid3"><label><span>Início</span><input type="date" data-k="ini" value="${d.ini || ""}"></label><label><span>Fim, se for período</span><input type="date" data-k="fim" value="${d.fim || ""}"></label>
    <label><span>Tipo</span><select data-k="tipo">${TIPOS_DATA.map(([k, l]) => `<option value="${k}" ${d.tipo === k ? "selected" : ""}>${l}</option>`).join("")}</select></label></div>
    <div class="dt-f"><label class="check sm"><input type="checkbox" data-k="acao" ${d.acao ? "checked" : ""}><span>Depende de mim</span></label><button class="btn link sm danger" data-rem>${I.lixo}Remover</button></div></li>`;
  openSheet({ title: "Datas do concurso", tall: true, wide: true,
    body: `<p class="hint">Atualize quando sair uma retificação. A data com o tipo Prova define a contagem regressiva.</p><ul class="dt-lista">${lista.map(linha).join("")}</ul><button class="btn ghost sm" data-add>${I.plus}Adicionar data</button>`,
    foot: `<button class="btn ghost" data-no>Cancelar</button><button class="btn pri" data-ok>Salvar datas</button>`,
    onMount: s => {
      const ul = $(".dt-lista", s);
      $("[data-add]", s).onclick = () => { ul.insertAdjacentHTML("beforeend", linha({ titulo: "", ini: "", fim: "", tipo: "outro" }, ul.children.length)); $("li:last-child input", ul).focus(); };
      ul.addEventListener("click", e => { const b = e.target.closest("[data-rem]"); if (b) b.closest("li").remove(); });
      $("[data-no]", s).onclick = () => closeSheet();
      $("[data-ok]", s).onclick = () => {
        const out = [];
        for (const li of $$("li", ul)) {
          const g = k => $(`[data-k="${k}"]`, li);
          const d = { id: "u" + uid(), titulo: g("titulo").value.trim(), ini: g("ini").value, fim: g("fim").value, tipo: g("tipo").value, acao: g("acao").checked };
          if (!d.ini && !d.titulo) continue;
          if (!d.ini) return toast("Há uma data sem dia. Preencha ou remova a linha.");
          if (!d.titulo) d.titulo = (TIPOS_DATA.find(x => x[0] === d.tipo) || [0, "Data"])[1];
          if (!d.fim || d.fim <= d.ini) delete d.fim;
          if (!d.acao) delete d.acao;
          out.push(d);
        }
        out.sort((a, b) => a.ini.localeCompare(b.ini));
        c.datas = out; const pv = out.find(d => d.tipo === "prova"); c.dataProva = pv ? pv.ini : "";
        commit(); closeSheet(); toast("Datas salvas.");
      };
    } });
}
/* exportar datas para a agenda do celular */
const icsTxt = s => String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
function icsDobra(l) { const out = []; while (l.length > 70) { out.push(l.slice(0, 70)); l = " " + l.slice(70); } out.push(l); return out.join("\r\n"); }
function gerarIcs() {
  const L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Estudo Facil//PT-BR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:Estudo Fácil"];
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z"), dia = s => s.replace(/-/g, "");
  let n = 0;
  const ev = (uidv, ini, fim, titulo, desc, hora) => {
    n++; L.push("BEGIN:VEVENT", `UID:${uidv}@estudo-facil`, `DTSTAMP:${stamp}`);
    if (hora) L.push(`DTSTART:${dia(ini)}T${hora.replace(":", "")}00`, "DURATION:PT1H");
    else L.push(`DTSTART;VALUE=DATE:${dia(ini)}`, `DTEND;VALUE=DATE:${dia(addD(fim || ini, 1))}`);
    L.push(`SUMMARY:${icsTxt(titulo)}`); if (desc) L.push(`DESCRIPTION:${icsTxt(desc)}`);
    L.push("BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${icsTxt(titulo)}`, `TRIGGER:${hora ? "-PT2H" : "-PT12H"}`, "END:VALARM", "END:VEVENT");
  };
  const c = ix().c, nome = c.sigla || c.orgao, desc = `${c.orgao}${c.site ? ". " + c.site : ""}`;
  for (const d of datasConcurso(c)) {
    if ((d.fim || d.ini) < today()) continue;
    ev(`${c.id}-${d.id}-${d.ini}`, d.ini, d.fim, `${d.titulo} (${nome})`, desc, d.tipo === "prova" && c.id === EDITAL_ABDI.id ? "13:30" : "");
    if (d.fim && d.fim !== d.ini) ev(`${c.id}-${d.id}-fim`, d.fim, null, `Último dia: ${d.titulo} (${nome})`, desc);
  }
  for (const v of DB.eventos) if (v.d >= today()) ev(`v${v.id}`, v.d, null, v.titulo, v.obs || "", v.hora);
  L.push("END:VCALENDAR");
  return n ? L.map(icsDobra).join("\r\n") + "\r\n" : "";
}
Object.assign(ACT, {
  "perfil": () => perfilSheet(),
  "mat-editar": el => materiaSheet(el.dataset.id),
  "mat-nova": () => materiaSheet(null),
  "simulado": el => simuladoSheet(el.dataset.id),
  "datas-editar": () => datasSheet(),
  "dt-passadas": () => { UI.dtPassadas = !UI.dtPassadas; render(); },
  "ics": () => { const t = gerarIcs(); if (!t) return toast("Não há datas futuras para levar."); if (baixar("estudo-facil-datas.ics", new Blob([t], { type: "text/calendar;charset=utf-8" }))) toast("Arquivo baixado. Abra-o para adicionar as datas à agenda."); }
});

/* ================= AGENDA ================= */
VIEWS.agenda = () => {
  const C = UI.cal, t = today(), d0 = toD(C.mes), ano = d0.getFullYear(), mes = d0.getMonth();
  const prim = ymd(new Date(ano, mes, 1, 12)), ult = ymd(new Date(ano, mes + 1, 0, 12));
  const ini = addD(prim, -toD(prim).getDay()), fim = addD(ult, 6 - toD(ult).getDay());
  const M = mapaDias(ini, fim);
  let cel = WD.map(w => `<div class="cal-wd" aria-hidden="true">${w.slice(0, 1)}<span>${w.slice(1)}</span></div>`).join("");
  for (let d = ini; d <= fim; d = addD(d, 1)) {
    const o = M.get(d), fora = d < prim || d > ult, dt = toD(d);
    const marcas = [];
    if (o) { if (o.prova) marcas.push("prova"); else if (o.ed.length) marcas.push(o.ed.some(x => x.acao) ? "acao" : "ed"); if (o.rv) marcas.push("rev"); if (o.ev.length) marcas.push("ev"); }
    const lab = `${dt.getDate()} de ${MESES[dt.getMonth()]}${o && o.s ? `, ${dur(o.s)} de estudo` : ""}${o && o.prova ? ", prova" : ""}${o && o.ed.length ? `, ${plural(o.ed.length, "data do edital", "datas do edital")}` : ""}${o && o.rv ? `, ${plural(o.rv, "revisão", "revisões")}` : ""}${o && o.ev.length ? `, ${plural(o.ev.length, "evento", "eventos")}` : ""}`;
    cel += `<button class="cal-d${fora ? " fora" : ""}${d === t ? " hoje" : ""}${d === C.sel ? " sel" : ""}${o && o.s ? (metaDia(d) ? " meta" : " estudo") : ""}${ehDiaEstudo(d) ? "" : " folga"}" data-act="cal-dia" data-d="${d}" aria-label="${esc(lab)}" aria-pressed="${d === C.sel}">
      <span class="cal-n">${dt.getDate()}</span><span class="cal-mk">${marcas.map(k => `<i class="mk ${k}"></i>`).join("")}</span></button>`;
  }
  return `<div class="pg agenda">
    <header class="pg-h"><h1>Agenda</h1><p class="lead">Datas do edital, revisões programadas, seus eventos e os dias em que estudou.</p></header>
    <div class="ag-grid">
      <section class="bloco cal">
        <div class="cal-bar"><button class="icon-btn" data-act="cal-mes" data-d="-1" aria-label="Mês anterior">${I.chevL}</button><h2 class="cal-t" aria-live="polite">${cap(MESES[mes])} de ${ano}</h2><button class="icon-btn" data-act="cal-mes" data-d="1" aria-label="Próximo mês">${I.chev}</button></div>
        <div class="cal-grid">${cel}</div>
        <p class="legenda cal-leg"><span><i class="mk prova"></i>Prova</span><span><i class="mk acao"></i>Seu prazo</span><span><i class="mk ed"></i>Edital</span><span><i class="mk rev"></i>Revisões</span><span><i class="mk ev"></i>Eventos</span><span><i class="cal-sw meta"></i>Meta batida</span></p>
        ${C.mes !== t.slice(0, 8) + "01" || C.sel !== t ? `<p class="centro"><button class="btn link sm" data-act="cal-hoje">Voltar para hoje</button></p>` : ""}
      </section>
      <section class="bloco dia-painel" id="cal-dia">${painelDia(C.sel)}</section>
    </div>
    ${cargaRevisoes()}
    <p class="centro"><button class="btn ghost sm" data-act="ics">${I.baixar}Levar datas e eventos para a agenda do celular</button></p>
  </div>`;
};
function mapaDias(ini, fim) {
  const M = new Map(), t = today(), X = ix(), c = X.c;
  const g = d => { let o = M.get(d); if (!o) { o = { ed: [], rv: 0, rvL: [], ev: [], s: 0, prova: false }; M.set(d, o); } return o; };
  for (const x of datasConcurso(c)) {
    for (const d of x.fim && x.fim !== x.ini ? [x.ini, x.fim] : [x.ini]) if (d >= ini && d <= fim) { const o = g(d); o.ed.push({ ...x, marca: x.fim && x.fim !== x.ini ? (d === x.ini ? "ini" : "fim") : "" }); if (x.tipo === "prova") o.prova = true; }
  }
  for (const tp of X.tops) { if (!tp.prox) continue; const d = tp.prox < t ? t : tp.prox; if (d >= ini && d <= fim) { const o = g(d); o.rv++; o.rvL.push(tp); } }
  for (const v of DB.eventos) if (v.d >= ini && v.d <= fim) g(v.d).ev.push(v);
  for (const [d, o] of X.days) if (d >= ini && d <= fim) g(d).s = o.s;
  for (const o of M.values()) o.ev.sort((a, b) => (a.hora || "99").localeCompare(b.hora || "99"));
  return M;
}
function painelDia(d) {
  const t = today(), o = mapaDias(d, d).get(d) || { ed: [], rv: 0, rvL: [], ev: [], s: 0 }, dt = toD(d), n = diffD(t, d);
  const c = ix().c;
  const andamento = datasConcurso(c).filter(x => x.fim && x.ini < d && x.fim > d);
  const secs = [];
  if (o.ed.length || andamento.length) secs.push(`<h3 class="dia-s">Edital</h3><ul class="dia-l">${o.ed.map(x => `<li class="${x.tipo === "prova" ? "prova" : x.acao ? "acao" : ""}"><b>${x.marca === "ini" ? "Começa: " : x.marca === "fim" ? "Último dia: " : ""}${esc(x.titulo)}</b></li>`).join("")}${andamento.map(x => `<li class="and"><span>Em andamento até ${dCurta(x.fim)}: ${esc(x.titulo)}</span></li>`).join("")}</ul>`);
  if (o.rvL.length) {
    const L = o.rvL.slice().sort((a, b) => a.prox.localeCompare(b.prox));
    secs.push(`<h3 class="dia-s">${d === t ? "Revisões para hoje, com as atrasadas" : "Revisões programadas"}</h3><ul class="dia-l">${L.slice(0, 8).map(x => `<li><button class="dia-top" data-act="topico" data-id="${x.id}"><span>${esc(x.nome)}</span><small>${esc(matNome(x.m))}${x.prox < t ? `, atrasada desde ${brs(x.prox)}` : ""}</small></button></li>`).join("")}${L.length > 8 ? `<li>${d === t ? `<button class="btn link sm" data-act="revisoes">Ver as outras ${L.length - 8}</button>` : `<span class="hint">e mais ${L.length - 8}</span>`}</li>` : ""}</ul>`);
  }
  if (o.ev.length) secs.push(`<h3 class="dia-s">Seus eventos</h3><ul class="dia-l">${o.ev.map(v => `<li><button class="dia-top" data-act="evento" data-id="${v.id}"><span>${v.hora ? `<b>${esc(v.hora)}</b> ` : ""}${esc(v.titulo)}</span><small>${esc(v.tipo || "Evento")}${v.obs ? ": " + esc(v.obs) : ""}</small></button></li>`).join("")}</ul>`);
  if (o.s) { const sx = ix().sess.filter(s => s.d === d); secs.push(`<h3 class="dia-s">Estudo feito</h3><p><b>${dur(o.s)}</b> em ${plural(sx.length, "sessão", "sessões")}${metaDia(d) ? ", meta batida" : ""}.</p><ul class="dia-l">${sx.map(s => `<li><button class="dia-top" data-act="sessao" data-id="${s.id}"><span>${horaDe(s.ini)}: ${esc(s.itens.map(i => i.tn).join(", "))}</span><small>${dur(s.s)}${s.a + s.e ? `, ${s.a}/${s.a + s.e} questões` : ""}</small></button></li>`).join("")}</ul>`); }
  return `<div class="b-hr"><div><p class="dia-rel">${cap(quando(n))}</p><h2 class="b-h">${cap(dSemana(d))}, ${dLonga(d)}</h2></div><button class="btn ghost sm" data-act="evento" data-d="${d}">${I.plus}Evento</button></div>
    ${ehDiaEstudo(d) ? "" : `<p class="hint">Dia de folga no seu planejamento.</p>`}
    ${secs.length ? secs.join("") : `<p class="hint">${d >= t ? "Nada marcado. Adicione um evento, como uma aula ou um simulado." : "Sem registros neste dia."}</p>`}`;
}
function cargaRevisoes() {
  const t = today(), X = ix(), dias = [];
  for (let i = 0; i < 14; i++) { const d = addD(t, i); dias.push({ d, n: X.tops.filter(x => x.prox && (i === 0 ? x.prox <= t : x.prox === d)).length }); }
  const max = Math.max(1, ...dias.map(x => x.n));
  if (!dias.some(x => x.n)) return "";
  return `<section class="bloco"><h2 class="b-h">Revisões nos próximos 14 dias</h2><p class="hint">Hoje inclui as atrasadas. Dias com muitas revisões pedem menos tópicos novos.</p>
    <div class="carga" role="img" aria-label="${esc(dias.map(x => `${brs(x.d)}: ${x.n}`).join("; "))}">${dias.map((x, i) => `<div class="cg${i === 0 ? " hoje" : ""}" title="${WD[toD(x.d).getDay()]} ${brs(x.d)}: ${plural(x.n, "revisão", "revisões")}"><span class="cg-v">${x.n || ""}</span><span class="cg-b"><i style="height:${x.n ? Math.max(6, x.n / max * 100) : 0}%"></i></span><span class="cg-d">${i === 0 ? "Hoje" : toD(x.d).getDate()}</span></div>`).join("")}</div></section>`;
}
function eventoSheet(id, data) {
  const v = id ? DB.eventos.find(x => x.id === id) : null, x = v || { titulo: "", d: data || UI.cal.sel || today(), hora: "", tipo: "Simulado", obs: "" };
  openSheet({ title: v ? "Editar evento" : "Novo evento",
    body: `<label class="field"><span class="lbl">Título</span><input type="text" id="ev-t" value="${esc(x.titulo)}" placeholder="Ex.: Simulado FGV, aula de Licitações"></label>
      <div class="grid2"><label class="field"><span class="lbl">Data</span><input type="date" id="ev-d" value="${x.d}"></label><label class="field"><span class="lbl">Horário (opcional)</span><input type="time" id="ev-h" value="${x.hora || ""}"></label></div>
      <div class="field"><span class="lbl">Tipo</span><div class="seg">${["Simulado", "Aula", "Lembrete", "Outro"].map(tp => `<label><input type="radio" name="ev-tp" value="${tp}" ${x.tipo === tp ? "checked" : ""}><span>${tp}</span></label>`).join("")}</div></div>
      <label class="field"><span class="lbl">Observações</span><textarea id="ev-o" rows="2" placeholder="Link, local, o que levar…">${esc(x.obs || "")}</textarea></label>`,
    foot: `${v ? `<button class="btn ghost danger" data-del>${I.lixo}Excluir</button>` : ""}<button class="btn pri" data-ok>Salvar</button>`,
    onMount: s => {
      $("[data-ok]", s).onclick = () => {
        const o = { titulo: $("#ev-t", s).value.trim(), d: $("#ev-d", s).value, hora: $("#ev-h", s).value, tipo: ($('input[name="ev-tp"]:checked', s) || {}).value || "Outro", obs: $("#ev-o", s).value.trim() };
        if (!o.titulo) return toast("Dê um título ao evento."); if (!o.d) return toast("Escolha a data.");
        if (v) Object.assign(v, o); else DB.eventos.push({ id: uid(), ...o });
        UI.cal.sel = o.d; UI.cal.mes = o.d.slice(0, 8) + "01";
        commit(); closeSheet(); toast("Evento salvo.");
      };
      const d = $("[data-del]", s); if (d) d.onclick = () => { DB.eventos = DB.eventos.filter(e => e.id !== id); commit(); closeSheet(); toast("Evento excluído."); };
    } });
}
Object.assign(ACT, {
  "cal-dia": el => { UI.cal.sel = el.dataset.d; if (el.classList.contains("fora")) UI.cal.mes = el.dataset.d.slice(0, 8) + "01"; render(); const p = $("#cal-dia"); if (p && p.getBoundingClientRect().top > innerHeight - 160) p.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); },
  "cal-mes": el => { const d = toD(UI.cal.mes); UI.cal.mes = ymd(new Date(d.getFullYear(), d.getMonth() + +el.dataset.d, 1, 12)); UI.cal.sel = UI.cal.mes.slice(0, 7) === today().slice(0, 7) ? today() : UI.cal.mes; render(); },
  "cal-hoje": () => { UI.cal.mes = today().slice(0, 8) + "01"; UI.cal.sel = today(); render(); },
  "evento": el => eventoSheet(el.dataset.id, el.dataset.d)
});

/* ================= DESEMPENHO ================= */
function periodo() {
  const n = UI.dsNav, t = today();
  if (UI.dsPer === "semana") { const ini = addD(n, -6); return { ini, fim: n, rot: n === t ? "Últimos 7 dias" : `${dCurta(ini)} a ${dCurta(n)}` }; }
  if (UI.dsPer === "mes") { const d = toD(n), ini = ymd(new Date(d.getFullYear(), d.getMonth(), 1, 12)), fim = ymd(new Date(d.getFullYear(), d.getMonth() + 1, 0, 12)); return { ini, fim, rot: `${cap(MESES[d.getMonth()])} de ${d.getFullYear()}` }; }
  const ini = ix().first || t; return { ini, fim: t, rot: ix().first ? `Desde ${dLonga(ini)}` : "Tudo" };
}
VIEWS.desempenho = () => {
  const X = ix(), t = today(), P = periodo();
  const ss = X.sess.filter(s => s.d >= P.ini && s.d <= P.fim);
  const tot = { s: sum(ss.map(s => s.s)), a: sum(ss.map(s => s.a)), e: sum(ss.map(s => s.e)) }, q = tot.a + tot.e;
  const diasCom = new Set(ss.map(s => s.d)).size;
  const fimR = P.fim > t ? t : P.fim, diasPlan = P.ini <= fimR ? diasEstudoEntre(P.ini, fimR) : 0;
  let metasB = 0; for (let d = P.ini; d <= fimR; d = addD(d, 1)) if (ehDiaEstudo(d) && metaDia(d)) metasB++;
  const nav = UI.dsPer !== "tudo" ? `<div class="per-nav"><button class="icon-btn" data-act="ds-nav" data-d="-1" aria-label="Período anterior">${I.chevL}</button><span>${P.rot}</span><button class="icon-btn" data-act="ds-nav" data-d="1" aria-label="Próximo período" ${P.fim >= t ? "disabled" : ""}>${I.chev}</button></div>` : `<div class="per-nav"><span>${P.rot}</span></div>`;
  return `<div class="pg">
    <header class="pg-h"><h1>Desempenho</h1></header>
    <div class="per"><div class="seg" role="group" aria-label="Período">${[["semana", "7 dias"], ["mes", "Mês"], ["tudo", "Tudo"]].map(([k, l]) => `<button data-act="ds-per" data-p="${k}" aria-pressed="${UI.dsPer === k}">${l}</button>`).join("")}</div>${nav}</div>
    <section class="stats">
      <div class="stat"><span>Tempo de estudo</span><b>${dur(tot.s)}</b><small>${diasCom ? `média de ${dur(tot.s / diasCom)} por dia estudado` : "nenhum estudo no período"}</small></div>
      <div class="stat"><span>Questões</span><b>${q}</b><small>${q ? `${pctTxt(pct(tot.a, q))} de acerto` : "nenhuma registrada"}</small></div>
      <div class="stat"><span>Dias com estudo</span><b>${diasCom}</b><small>${diasPlan ? `meta batida em ${metasB} de ${plural(diasPlan, "dia planejado", "dias planejados")}` : "sem dias planejados"}</small></div>
    </section>
    ${graficoHoras(P, X)}
    ${tempoPeso(ss, X)}
    ${pontosFracos(X)}
    <section class="bloco"><div class="b-hr"><h2 class="b-h">Sessões</h2><button class="btn ghost sm" data-act="registrar">${I.plus}Registrar estudo</button></div>
      ${ss.length ? listaSessoes(ss) : `<p class="hint">Nenhuma sessão neste período.</p>`}</section>
  </div>`;
};
function graficoHoras(P, X) {
  const t = today(), h = cfg().hDia;
  let cols = [];
  if (UI.dsPer === "tudo") {
    if (!X.first) return "";
    let ini = addD(X.first, -((toD(X.first).getDay() + 6) % 7));
    for (let d = ini; d <= t; d = addD(d, 7)) { let s = 0; for (let k = 0; k < 7; k++) s += (X.days.get(addD(d, k)) || { s: 0 }).s; cols.push({ d, s, rot: dCurta(d), tip: `Semana de ${dCurta(d)}: ${dur(s)}` }); }
    cols = cols.slice(-16);
  } else for (let d = P.ini; d <= P.fim; d = addD(d, 1)) { const s = (X.days.get(d) || { s: 0 }).s; cols.push({ d, s, rot: UI.dsPer === "semana" ? WD[toD(d).getDay()] : String(toD(d).getDate()), tip: `${WD[toD(d).getDay()]} ${brs(d)}: ${s ? dur(s) : "sem estudo"}`, fut: d > t, meta: metaDia(d) && s > 0 }); }
  const ref = UI.dsPer === "tudo" ? h * cfg().dias.length * 3600 : h * 3600;
  const max = Math.max(ref, ...cols.map(c => c.s), 1);
  const passo = max > 6 * 3600 * 5 ? 10 * 3600 : max > 6 * 3600 ? 2 * 3600 : 3600;
  const topo = Math.ceil(max / passo) * passo;
  const ticks = []; for (let v = 0; v <= topo; v += passo) ticks.push(v);
  const denso = cols.length > 16;
  return `<section class="bloco"><h2 class="b-h">${UI.dsPer === "tudo" ? "Horas por semana" : "Horas por dia"}</h2>
    <p class="hint">${ref ? `A linha escura marca a meta de ${dur(ref)} ${UI.dsPer === "tudo" ? "por semana" : "por dia de estudo"}. ` : ""}Toque numa barra para ver o valor.</p>
    <div class="graf" style="--n:${cols.length}">
      <div class="g-eixo">${ticks.slice().reverse().map(v => `<span style="bottom:${v / topo * 100}%">${v ? Math.round(v / 3600) + "h" : "0"}</span>`).join("")}</div>
      <div class="g-area">
        ${ticks.map(v => `<i class="g-lin" style="bottom:${v / topo * 100}%"></i>`).join("")}
        ${ref ? `<i class="g-meta" style="bottom:${ref / topo * 100}%"></i>` : ""}
        <div class="g-cols">${cols.map(c => `<button class="g-col${c.fut ? " fut" : ""}" data-tip="${esc(c.tip)}" aria-label="${esc(c.tip)}"><i class="${c.meta ? "ok" : ""}" style="height:${c.s / topo * 100}%"></i></button>`).join("")}</div>
      </div>
      <div class="g-rot${denso ? " denso" : ""}">${cols.map((c, i) => `<span>${denso && i % 5 && i !== cols.length - 1 ? "" : esc(c.rot)}</span>`).join("")}</div>
    </div></section>`;
}
function tempoPeso(ss, X) {
  if (!X.ptsTot || !ss.length) return "";
  const tm = new Map(); let tt = 0;
  for (const s of ss) for (const it of s.itens) { if (!X.pts.has(it.m)) continue; tm.set(it.m, (tm.get(it.m) || 0) + it.s); tt += it.s; }
  if (!tt) return "";
  // por área da prova quando o edital tem áreas; senão, por matéria
  const grupos = [...new Set(X.mats.map(m => m.grupo))];
  const porGrupo = grupos.length > 1;
  const linhas = (porGrupo ? grupos.map(g => ({ nome: GRUPOS[g] || g, ids: X.mats.filter(m => m.grupo === g).map(m => m.id) })) : X.mats.map(m => ({ nome: m.nome, ids: [m.id] })))
    .map(l => { const s = sum(l.ids.map(id => tm.get(id) || 0)); return { nome: l.nome, s, tp: pct(s, tt), pp: pct(sum(l.ids.map(id => X.pts.get(id) || 0)), X.ptsTot) }; });
  const max = Math.max(...linhas.map(l => Math.max(l.tp, l.pp)), 1);
  const barra = (cls, v, tip) => `<span class="tp-b"><span class="tp-tr"><i class="${cls}" style="width:${v / max * 100}%"${tip ? ` title="${tip}"` : ""}></i></span><em>${pctTxt(v)}</em></span>`;
  const fora = linhas.filter(l => l.pp >= 10 && l.tp < l.pp / 2);
  return `<section class="bloco"><h2 class="b-h">Seu tempo e o peso na prova</h2>
    <p class="hint">A parte do seu tempo no período dedicada a cada ${porGrupo ? "área" : "matéria"}, comparada com a parte da nota que ela vale.${fora.length ? ` <b>${esc(fora.map(l => l.nome).join(", "))}</b> ${fora.length === 1 ? "está" : "estão"} com menos da metade do tempo que o peso pede.` : ""}</p>
    <p class="legenda"><span><i class="sw tempo"></i>Seu tempo</span><span><i class="sw peso"></i>Peso na nota</span></p>
    <ul class="tp">${linhas.map(l => `<li><span class="tp-n">${esc(l.nome)}<small>${l.s ? dur(l.s) : "sem estudo"}</small></span>${barra("tempo", l.tp, dur(l.s))}${barra("peso", l.pp)}</li>`).join("")}</ul></section>`;
}
function pontosFracos(X) {
  const L = X.tops.map(t => ({ t, s: statT(t.id) })).filter(x => x.s.a + x.s.e >= 5 && pct(x.s.a, x.s.a + x.s.e) < 60).sort((a, b) => pct(a.s.a, a.s.a + a.s.e) - pct(b.s.a, b.s.a + b.s.e)).slice(0, 8);
  if (!L.length) return "";
  return `<section class="bloco"><h2 class="b-h">Tópicos para reforçar</h2><p class="hint">Acerto abaixo de 60% em pelo menos 5 questões.</p>
    <ul class="pl-lista">${L.map(({ t, s }) => `<li class="pl-it"><button class="pl-go" data-act="estudar" data-t="${t.id}" data-tipo="revisao" aria-label="Revisar ${esc(t.nome)}">${I.play}</button><button class="pl-txt" data-act="topico" data-id="${t.id}"><span class="pl-k bad">${pctTxt(pct(s.a, s.a + s.e))} em ${s.a + s.e} questões</span><span class="pl-n">${esc(t.nome)}</span><span class="pl-m">${esc(matNome(t.m))}</span></button></li>`).join("")}</ul></section>`;
}
function listaSessoes(ss) {
  const lim = UI.hLim; let h = "", dia = "";
  for (const s of ss.slice(0, lim)) {
    if (s.d !== dia) { if (dia) h += "</ul>"; dia = s.d; const o = ix().days.get(dia); h += `<h3 class="dia-s">${cap(dSemana(dia))}, ${dLonga(dia)} <span>${dur(o.s)}</span></h3><ul class="ses-l">`; }
    h += `<li><button class="ses" data-act="sessao" data-id="${s.id}"><span class="ses-h">${horaDe(s.ini)}${s.manual ? "" : "–" + horaDe(s.fim)}</span><span class="ses-t">${s.itens.map(i => `${esc(i.tn)}${i.tipo === "revisao" ? " <em>(revisão)</em>" : ""}`).join(", ")}</span><span class="ses-v"><b>${dur(s.s)}</b>${s.a + s.e ? `<small>${s.a}/${s.a + s.e}</small>` : ""}</span></button></li>`;
  }
  if (dia) h += "</ul>";
  if (ss.length > lim) h += `<p class="centro"><button class="btn link" data-act="ds-mais">Mostrar mais ${ss.length - lim}</button></p>`;
  return h;
}
function sessaoSheet(id) {
  const s = DB.sessoes.find(x => x.id === id); if (!s) return;
  openSheet({ title: `${cap(dSemana(s.d))}, ${dLonga(s.d)}`, sub: `${horaDe(s.ini)}${s.manual ? "" : " às " + horaDe(s.fim)}, ${dur(s.s)} de estudo${s.p ? `, ${dur(s.p)} de pausa` : ""}`,
    body: `<ul class="cc-lista">${s.itens.map((it, i) => `<li><p class="cc-n">${esc(it.tn)}</p><p class="hint">${esc(it.mn)}. ${TIPO_TXT[it.tipo]}.</p>
      <div class="grid3"><label class="field"><span class="lbl">Tempo (h:min)</span><input type="text" inputmode="numeric" data-it="${i}" data-k="s" value="${hms(it.s).slice(0, 5)}"></label><label class="field"><span class="lbl">Acertos</span><input type="number" min="0" data-it="${i}" data-k="a" value="${it.a}"></label><label class="field"><span class="lbl">Erros</span><input type="number" min="0" data-it="${i}" data-k="e" value="${it.e}"></label></div></li>`).join("")}</ul>
      ${s.pausas && s.pausas.length ? `<p class="hint">Pausas: ${s.pausas.map(p => `${horaDe(p.ini)} (${dur((p.fim - p.ini) / 1000)}${p.mot ? ", " + esc(p.mot) : ""})`).join("; ")}.</p>` : ""}
      <label class="field"><span class="lbl">Anotações</span><textarea id="se-o" rows="3">${esc(s.obs || "")}</textarea></label>
      <p class="hint">Mudar o tempo ou as questões não altera as datas de revisão já agendadas.</p>`,
    foot: `<button class="btn ghost danger" data-del>${I.lixo}Excluir</button><button class="btn pri" data-ok>Salvar</button>`,
    onMount: sh => {
      $("[data-ok]", sh).onclick = () => {
        for (const el of $$("[data-it]", sh)) { const it = s.itens[+el.dataset.it], k = el.dataset.k;
          if (k === "s") { const p = el.value.trim().split(":").map(Number); it.s = p.length > 1 ? (p[0] || 0) * 3600 + (p[1] || 0) * 60 : (p[0] || 0) * 60; }
          else it[k] = Math.max(0, parseInt(el.value) || 0); }
        s.s = sum(s.itens.map(i => i.s)); s.a = sum(s.itens.map(i => i.a)); s.e = sum(s.itens.map(i => i.e)); s.obs = $("#se-o", sh).value.trim();
        commit(); closeSheet(); toast("Sessão atualizada.");
      };
      $("[data-del]", sh).onclick = () => { closeSheet(true); confirmSheet("Excluir a sessão?", "Ela sai do histórico e das estatísticas. As datas de revisão já agendadas continuam.", "Excluir", () => { DB.sessoes = DB.sessoes.filter(x => x.id !== id); commit(); toast("Sessão excluída."); }); };
    } });
}
function registrarSheet() {
  const X = ix();
  openSheet({ title: "Registrar estudo", sub: "Para o que você estudou sem o cronômetro",
    body: `<label class="field"><span class="lbl">Tópico</span><select id="rg-t">${X.mats.map(m => `<optgroup label="${esc(m.nome)}">${X.topsByMat.get(m.id).map(t => `<option value="${t.id}">${esc(t.nome)}</option>`).join("")}</optgroup>`).join("")}</select></label>
      <div class="grid2"><label class="field"><span class="lbl">Data</span><input type="date" id="rg-d" value="${today()}" max="${today()}"></label><label class="field"><span class="lbl">Início</span><input type="time" id="rg-h" value="${pad(new Date().getHours())}:00"></label></div>
      <div class="grid3"><label class="field"><span class="lbl">Tempo (h:min)</span><input type="text" inputmode="numeric" id="rg-s" value="01:00" placeholder="01:30"></label><label class="field"><span class="lbl">Acertos</span><input type="number" min="0" id="rg-a" value="0"></label><label class="field"><span class="lbl">Erros</span><input type="number" min="0" id="rg-e" value="0"></label></div>
      <div class="field"><div class="seg"><label><input type="radio" name="rg-tp" value="teoria" checked><span>Teoria</span></label><label><input type="radio" name="rg-tp" value="revisao"><span>Revisão</span></label></div></div>
      <label class="check"><input type="checkbox" id="rg-c"><span>Terminei a teoria deste tópico</span></label>`,
    foot: `<button class="btn pri" data-ok>Registrar</button>`,
    onMount: sh => {
      const p = planoHoje().prox; if (p) $("#rg-t", sh).value = p.top.id;
      $("[data-ok]", sh).onclick = () => {
        const tid = $("#rg-t", sh).value, d = $("#rg-d", sh).value || today(), hh = $("#rg-h", sh).value || "08:00";
        const pr = $("#rg-s", sh).value.trim().split(":").map(Number), sec = pr.length > 1 ? (pr[0] || 0) * 3600 + (pr[1] || 0) * 60 : (pr[0] || 0) * 60;
        const a = Math.max(0, parseInt($("#rg-a", sh).value) || 0), e = Math.max(0, parseInt($("#rg-e", sh).value) || 0);
        if (!sec && !a && !e) return toast("Informe o tempo ou as questões.");
        const tp = ($('input[name="rg-tp"]:checked', sh) || {}).value || "teoria", top = X.topById.get(tid);
        const [H, Mi] = hh.split(":").map(Number), ini = toD(d).setHours(H || 0, Mi || 0, 0, 0);
        const s = { id: uid(), d, ini, fim: ini + sec * 1000, s: sec, p: 0, a, e, manual: true, obs: "", pausas: [],
          itens: [{ t: tid, m: top.m, tn: top.nome, mn: matNome(top.m), tipo: tp, s: sec, a, e, ini, fim: ini + sec * 1000 }] };
        DB.sessoes.push(s);
        aplicarNosTopicos(s, $("#rg-c", sh).checked ? new Set([tid]) : new Set());
        commit(); closeSheet(); toast("Estudo registrado.");
      };
    } });
}
Object.assign(ACT, {
  "ds-per": el => { UI.dsPer = el.dataset.p; UI.dsNav = today(); UI.hLim = 30; render(); },
  "ds-nav": el => { const d = +el.dataset.d; if (UI.dsPer === "semana") UI.dsNav = addD(UI.dsNav, 7 * d); else { const x = toD(UI.dsNav); UI.dsNav = ymd(new Date(x.getFullYear(), x.getMonth() + d, 1, 12)); } if (UI.dsNav > today()) UI.dsNav = today(); render(); },
  "ds-mais": () => { UI.hLim += 30; render(); },
  "sessao": el => sessaoSheet(el.dataset.id),
  "registrar": () => registrarSheet()
});
/* dica das barras do gráfico (toque ou foco) */
document.addEventListener("click", e => {
  const b = e.target.closest(".g-col"); $$(".g-tip").forEach(x => x.remove());
  if (!b) return;
  const tip = document.createElement("span"); tip.className = "g-tip"; tip.textContent = b.dataset.tip; b.appendChild(tip);
});

/* ================= AJUSTES ================= */
const PRESETS = [["1,7,30", "1, 7 e 30 dias (padrão)"], ["1,3,7,15,30", "1, 3, 7, 15 e 30 dias"], ["1,7,15,30,60", "1, 7, 15, 30 e 60 dias"], ["1,2,4,7,14", "Reta final: 1, 2, 4, 7 e 14 dias"]];
VIEWS.ajustes = () => {
  const C = cfg(), R = ritmo(), c = ix().c, ciclo = C.ciclo.join(",");
  return `<div class="pg aj">
    <header class="pg-h"><h1>Ajustes</h1></header>
    <section class="bloco">
      <h2 class="b-h">Rotina e metas</h2>
      <div class="field"><span class="lbl">Dias em que você estuda</span><div class="dias">${[1, 2, 3, 4, 5, 6, 0].map(d => `<label class="dia"><input type="checkbox" value="${d}" ${C.dias.includes(d) ? "checked" : ""} data-on="aj-dia"><span>${WD[d]}</span></label>`).join("")}</div></div>
      <div class="grid2">
        <div class="field"><span class="lbl">Horas por dia de estudo</span><div class="stepper"><button class="icon-btn boxed" data-act="aj-step" data-k="hDia" data-d="-0.5" aria-label="Menos meia hora">${I.minus}</button><output>${dec(C.hDia)} h</output><button class="icon-btn boxed" data-act="aj-step" data-k="hDia" data-d="0.5" aria-label="Mais meia hora">${I.plus}</button></div></div>
        <div class="field"><span class="lbl">Questões por dia</span><div class="stepper"><button class="icon-btn boxed" data-act="aj-step" data-k="qDia" data-d="-5" aria-label="Menos 5 questões">${I.minus}</button><output>${C.qDia || "Sem meta"}</output><button class="icon-btn boxed" data-act="aj-step" data-k="qDia" data-d="5" aria-label="Mais 5 questões">${I.plus}</button></div></div>
      </div>
      <div class="grid2">
        <label class="field"><span class="lbl">Terminar a teoria até</span><input type="date" value="${R.fim}" data-on="aj-teoria"><span class="hint">${C.teoriaAte ? `<button class="btn link sm" data-act="aj-teoria-auto">Voltar ao automático</button>` : "Automático: duas semanas antes da prova."}</span></label>
        <div class="field"><span class="lbl">Tópicos novos por dia</span><div class="stepper"><button class="icon-btn boxed" data-act="aj-step" data-k="novosDia" data-d="-1" aria-label="Menos um tópico">${I.minus}</button><output>${C.novosDia || `Auto (${R.auto})`}</output><button class="icon-btn boxed" data-act="aj-step" data-k="novosDia" data-d="1" aria-label="Mais um tópico">${I.plus}</button></div></div>
      </div>
      <p class="hint">Faltam ${plural(R.pend, "tópico", "tópicos")} com a teoria pendente e ${plural(R.dias, "dia", "dias")} de estudo até ${dLonga(R.fim)}. ${R.n < R.auto ? `<b>Com ${R.n} por dia a teoria não termina a tempo.</b>` : ""}</p>
    </section>
    <section class="bloco">
      <h2 class="b-h">Revisões</h2>
      <p class="hint">Depois de estudar a teoria, o tópico volta para revisão nestes intervalos. Estudar a teoria de novo reinicia o ciclo.</p>
      <label class="field"><span class="lbl">Ciclo de revisões</span><select data-on="aj-ciclo">${PRESETS.map(([k, l]) => `<option value="${k}" ${ciclo === k ? "selected" : ""}>${l}</option>`).join("")}${PRESETS.some(p => p[0] === ciclo) ? "" : `<option value="${ciclo}" selected>${C.ciclo.join(", ")} dias</option>`}</select></label>
      <label class="check"><input type="checkbox" data-on="aj-folga" ${C.moverFolga ? "checked" : ""}><span>Revisão que cair num dia de folga passa para o próximo dia de estudo</span></label>
    </section>
    ${syncCardHTML()}
    <section class="bloco">
      <h2 class="b-h">Concursos</h2>
      <ul class="conc-l">${DB.concursos.map(x => `<li class="${x.id === c.id ? "on" : ""}"><div><b>${esc(x.sigla || x.orgao)}</b><span>${esc(x.cargo || "")}${x.dataProva ? `, prova em ${br(x.dataProva)}` : ""}</span></div>${x.id === c.id ? `<span class="tag ok">Em estudo</span>` : `<button class="btn ghost sm" data-act="conc-ativar" data-id="${x.id}">Estudar este</button>`}</li>`).join("")}</ul>
      <div class="btns"><button class="btn ghost sm" data-act="conc-novo">${I.plus}Adicionar outro concurso</button>${DB.concursos.length > 1 ? `<button class="btn link sm danger" data-act="conc-excluir" data-id="${c.id}">Excluir o concurso em estudo</button>` : ""}</div>
    </section>
    <section class="bloco">
      <h2 class="b-h">Aparência</h2>
      <div class="seg" role="group" aria-label="Tema">${[["auto", "Automático"], ["claro", "Claro"], ["escuro", "Escuro"]].map(([k, l]) => `<button data-act="tema" data-t="${k}" aria-pressed="${PREF.tema === k}">${l}</button>`).join("")}</div>
      <p class="hint">No automático, o app segue o tema do aparelho. Vale só para este aparelho.</p>
    </section>
    ${instalarHTML()}
    <section class="bloco">
      <h2 class="b-h">Cópia de segurança</h2>
      <p class="hint">${syncOn() ? "Com a sincronização ligada, seus dados já ficam guardados na nuvem. A cópia é um arquivo extra." : "Seus dados ficam só neste aparelho. Guarde uma cópia de vez em quando, ou ative a sincronização."}</p>
      <div class="btns"><button class="btn ghost sm" data-act="bk-baixar">${I.baixar}Baixar cópia</button><label class="btn ghost sm" for="bk-file">${I.subir}Restaurar cópia</label><input type="file" id="bk-file" accept=".json,application/json" data-on="bk-file" hidden></div>
      <div><button class="btn link sm danger" data-act="apagar-tudo">Apagar todos os dados</button></div>
    </section>
    <p class="versao">Estudo Fácil ${VERSAO}</p>
  </div>`;
};
let INSTALL_EVT = null;
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); INSTALL_EVT = e; });
const instalado = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
function instalarHTML() {
  if (instalado()) return "";
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return `<section class="bloco"><h2 class="b-h">Instalar o app</h2>
    <p class="hint">${ios ? "No iPhone, abra este endereço no Safari, toque em <b>Compartilhar</b> e depois em <b>Adicionar à Tela de Início</b>." : "Assim ele abre como aplicativo e funciona sem internet."}</p>
    ${INSTALL_EVT ? `<div><button class="btn pri sm" data-act="instalar">Instalar</button></div>` : ios ? "" : `<p class="hint">No Android, use <b>Instalar app</b> no menu do Chrome. No computador, use o ícone de instalar na barra de endereço.</p>`}</section>`;
}
function backupJson() { return JSON.stringify({ formato: "estudo-facil", versao: 1, em: new Date().toISOString(), dados: { v: 1, ...dadosSync() } }, null, 1); }
Object.assign(ON, {
  "aj-dia": () => { const d = $$('[data-on="aj-dia"]').filter(x => x.checked).map(x => +x.value); if (!d.length) { toast("Escolha pelo menos um dia."); render(); return; } cfg().dias = d.sort(); commit(); },
  "aj-teoria": el => { if (!el.value) return; cfg().teoriaAte = el.value; commit(); },
  "aj-ciclo": el => { cfg().ciclo = el.value.split(",").map(Number); commit(); toast("Ciclo salvo. Vale para as próximas revisões."); },
  "aj-folga": el => { cfg().moverFolga = el.checked; commit(); },
  "bk-file": async el => {
    const f = el.files && el.files[0]; el.value = ""; if (!f) return;
    let j; try { j = JSON.parse(await f.text()); } catch { return toast("Não consegui ler esse arquivo."); }
    if (!j || j.formato !== "estudo-facil" || !j.dados) return toast("Esse arquivo não é uma cópia do Estudo Fácil.");
    const d = j.dados;
    confirmSheet("Restaurar a cópia?", `A cópia de ${br(String(j.em).slice(0, 10))} tem ${plural((d.sessoes || []).length, "sessão", "sessões")}. Os dados atuais deste aparelho${syncOn() ? " e dos aparelhos sincronizados" : ""} serão substituídos.`, "Restaurar", () => {
      // o que mudou em relação ao aparelho ganha a hora de agora e passa a valer também na nuvem
      const novo = arrumarBanco({ ...d, v: 1 });
      for (const c of COLLS) DB[c] = novo[c]; DB.cfg = novo.cfg; DB.ativa = novo.ativa;
      UI.focoAberto = !!DB.ativa;
      commit(); toast("Cópia restaurada.");
    });
  }
});
Object.assign(ACT, {
  "aj-step": el => {
    const k = el.dataset.k, d = +el.dataset.d, C = cfg();
    if (k === "hDia") C.hDia = clamp((C.hDia || 0) + d, 0, 14);
    else if (k === "qDia") C.qDia = clamp((C.qDia || 0) + d, 0, 500);
    else if (k === "novosDia") { const base = C.novosDia || ritmo().auto; C.novosDia = clamp(base + d, 0, 12); if (C.novosDia === ritmo().auto && d < 0) C.novosDia = C.novosDia; }
    commit();
  },
  "aj-teoria-auto": () => { cfg().teoriaAte = ""; commit(); },
  "tema": el => { PREF.tema = el.dataset.t; savePref(); aplicarTema(); render(); },
  "instalar": async () => { const e = INSTALL_EVT; if (!e) return; INSTALL_EVT = null; e.prompt(); try { await e.userChoice; } catch {} render(); },
  "bk-baixar": () => { if (baixar(`estudo-facil-copia-${today()}.json`, new Blob([backupJson()], { type: "application/json" }))) toast("Cópia baixada."); },
  "apagar-tudo": () => confirmSheet("Apagar todos os dados?", `Sessões, revisões, anotações e ajustes deste aparelho${syncOn() ? " e da nuvem" : ""} serão apagados e o app volta ao edital da ABDI, como na primeira vez.`, "Apagar tudo", () => {
    const novo = bancoNovo();
    for (const c of COLLS) DB[c] = novo[c]; DB.cfg = novo.cfg; DB.ativa = null; UI.focoAberto = false;
    commit(); ONB.passo = 0; ONB.perfil = ""; history.replaceState({ d: 0 }, "", "#/hoje"); render(); toast("Dados apagados.");
  }),
  "conc-ativar": el => { cfg().concurso = el.dataset.id; commit(); toast("Concurso trocado."); go("hoje"); },
  "conc-excluir": el => { const c = DB.concursos.find(x => x.id === el.dataset.id); if (!c) return; confirmSheet("Excluir o concurso?", `${esc(c.sigla || c.orgao)}, com matérias, tópicos, revisões e simulados, sai do app. As sessões continuam no histórico.`, "Excluir", () => {
    const ms = new Set(DB.materias.filter(m => m.c === c.id).map(m => m.id));
    DB.materias = DB.materias.filter(m => !ms.has(m.id)); DB.topicos = DB.topicos.filter(t => !ms.has(t.m)); DB.simulados = DB.simulados.filter(s => s.c !== c.id);
    DB.concursos = DB.concursos.filter(x => x.id !== c.id); cfg().concurso = DB.concursos[0].id; commit(); toast("Concurso excluído.");
  }); },
  "conc-novo": () => novoConcursoSheet(),
  "conteudo-colar": () => colarConteudoSheet(ix().c.id)
});

/* ================= tema ================= */
function aplicarTema() {
  const root = document.documentElement, t = PREF.tema;
  if (t === "claro") root.setAttribute("data-theme", "light"); else if (t === "escuro") root.setAttribute("data-theme", "dark"); else root.removeAttribute("data-theme");
  const escuro = t === "escuro" || (t === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  $$('meta[name="theme-color"]').forEach(m => m.remove());
  const m = document.createElement("meta"); m.name = "theme-color"; m.content = escuro ? "#10142A" : "#EDEFF5"; document.head.appendChild(m);
}
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (PREF.tema === "auto") aplicarTema(); });

/* ================= novo concurso (PDF, texto colado ou à mão) ================= */
function novoConcursoSheet() {
  openSheet({ title: "Adicionar concurso",
    body: `<div class="pdf-drop"><p><b>Tem o PDF do edital?</b> O app lê o arquivo aqui no aparelho e separa órgão, banca, cargos, datas e conteúdo programático. Você confere antes de salvar.</p>
      <label class="btn pri" for="pdf-in">${I.arquivo}Escolher o PDF</label><input type="file" id="pdf-in" accept="application/pdf,.pdf" hidden></div>
      <p class="ou">ou</p>
      <div class="grid2"><label class="field"><span class="lbl">Órgão</span><input type="text" id="nc-o" placeholder="Ex.: Tribunal Regional Federal"></label><label class="field"><span class="lbl">Cargo</span><input type="text" id="nc-c" placeholder="Ex.: Analista Judiciário"></label></div>
      <div class="grid2"><label class="field"><span class="lbl">Sigla (opcional)</span><input type="text" id="nc-s" placeholder="Ex.: TRF1"></label><label class="field"><span class="lbl">Data da prova, se já tiver</span><input type="date" id="nc-d"></label></div>`,
    foot: `<button class="btn ghost" data-no>Cancelar</button><button class="btn pri" data-ok>Criar e colar o conteúdo</button>`,
    onMount: s => {
      $("#pdf-in", s).addEventListener("change", e => { const f = e.target.files && e.target.files[0]; if (f) lerPdfEdital(f); });
      $("[data-no]", s).onclick = () => closeSheet();
      $("[data-ok]", s).onclick = () => {
        const o = $("#nc-o", s).value.trim(), cg = $("#nc-c", s).value.trim();
        if (!o || !cg) return toast("Informe o órgão e o cargo.");
        const c = { id: uid(), sigla: $("#nc-s", s).value.trim(), orgao: o, cargo: cg, dataProva: $("#nc-d", s).value, datas: [], criado: today() };
        if (c.dataProva) c.datas.push({ id: "u" + uid(), tipo: "prova", titulo: "Prova", ini: c.dataProva });
        DB.concursos.push(c); cfg().concurso = c.id; commit({ quiet: true });
        closeSheet(true); colarConteudoSheet(c.id);
      };
    } });
}
function colarConteudoSheet(cid, texto) {
  openSheet({ title: "Conteúdo programático", tall: true,
    body: `<p class="hint">Copie do edital a parte com as matérias e os assuntos do seu cargo e cole abaixo. O app separa as matérias e os tópicos, e você confere antes de salvar.</p>
      <textarea id="cc-txt" rows="12" placeholder="LÍNGUA PORTUGUESA: 1 Compreensão de textos. 2 Ortografia oficial. 3 Crase.&#10;DIREITO ADMINISTRATIVO: 1 Atos administrativos. 2 Licitações.">${esc(texto || "")}</textarea>`,
    foot: `<button class="btn ghost" data-no>Depois</button><button class="btn pri" data-ok>Separar matérias</button>`,
    onMount: s => {
      $("[data-no]", s).onclick = () => { closeSheet(); go("edital"); };
      $("[data-ok]", s).onclick = async () => {
        const txt = $("#cc-txt", s).value; if (!txt.trim()) return toast("Cole o conteúdo do edital.");
        await carregarLeitor();
        const grupos = analisarEdital(txt);
        if (!grupos.length) return toast("Não encontrei matérias nesse texto. Confira se colou o conteúdo programático.");
        previaConteudo(cid, grupos, txt);
      };
    } });
}
function previaConteudo(cid, grupos, texto) {
  const nA = sum(grupos.map(g => g.assuntos.length));
  openSheet({ title: "Confira antes de salvar", tall: true, wide: true, sub: `${plural(grupos.length, "matéria", "matérias")} e ${plural(nA, "tópico", "tópicos")}`,
    body: `<p class="hint">Corrija os nomes, apague linhas que não são tópicos e desmarque o que não quiser. Tudo pode ser editado depois.</p>
      ${grupos.map((g, i) => `<div class="pv"><label class="check"><input type="checkbox" id="pv-on-${i}" checked><span>Incluir</span></label>
        <label class="field"><span class="lbl">Matéria</span><input type="text" id="pv-n-${i}" value="${esc(g.nome)}"></label>
        <label class="field"><span class="lbl">Tópicos, um por linha</span><textarea id="pv-t-${i}" rows="${Math.min(10, g.assuntos.length + 1)}">${esc(g.assuntos.join("\n"))}</textarea></label></div>`).join("")}`,
    foot: `<button class="btn ghost" data-no>Voltar ao texto</button><button class="btn pri" data-ok>Salvar conteúdo</button>`,
    onMount: s => {
      $("[data-no]", s).onclick = () => colarConteudoSheet(cid, texto);
      $("[data-ok]", s).onclick = () => {
        let ord = Math.max(0, ...DB.materias.filter(m => m.c === cid).map(m => m.ord + 1)), n = 0;
        grupos.forEach((g, i) => {
          if (!$("#pv-on-" + i, s).checked) return;
          const nome = $("#pv-n-" + i, s).value.trim(), tops = $("#pv-t-" + i, s).value.split("\n").map(x => x.replace(/\s+/g, " ").trim()).filter(Boolean);
          if (!nome || !tops.length) return;
          const m = { id: uid(), c: cid, grupo: "geral", nome, q: 0, valor: 1, ord: ord++ };
          DB.materias.push(m); tops.forEach((tn, j) => DB.topicos.push(novoTopico(uid(), m.id, tn, j))); n += tops.length;
        });
        if (!n) return toast("Deixe pelo menos uma matéria com tópicos.");
        cfg().concurso = cid; commit(); closeSheet(); go("edital"); toast(`${plural(n, "tópico salvo", "tópicos salvos")}.`);
      };
    } });
}
/* o leitor de editais é carregado só quando precisa */
let leitorP = null;
function carregarLeitor() {
  if (window.analisarEdital) return Promise.resolve();
  if (!leitorP) leitorP = new Promise((ok, err) => { const s = document.createElement("script"); s.src = "leitor-pdf.js?v=" + VERSAO; s.onload = ok; s.onerror = () => { leitorP = null; err(new Error("leitor")); }; document.head.appendChild(s); });
  return leitorP;
}
async function lerPdfEdital(file) {
  if (!/\.pdf$/i.test(file.name || "") && file.type !== "application/pdf") return toast("Escolha um arquivo PDF.");
  openSheet({ title: "Lendo o edital", body: `<p class="hint">${esc(file.name)}</p><div class="barra"><span id="pdf-bar" style="width:3%"></span></div><p class="hint" id="pdf-prog" aria-live="polite">Abrindo o arquivo…</p><p class="hint">O arquivo é lido aqui no aparelho e não é enviado para nenhum servidor.</p>` });
  let r;
  try {
    await carregarLeitor();
    r = await lerEditalPdf(file, (a, b) => { const t = $("#pdf-prog"), bar = $("#pdf-bar"); if (t) t.textContent = `Lendo página ${a} de ${b}`; if (bar) bar.style.width = Math.max(3, Math.round(a / b * 100)) + "%"; });
  } catch (e) {
    openSheet({ title: "Não deu para ler o PDF", body: `<p class="lead">${esc(e && e.message === "senha" ? "Este PDF tem senha. Salve uma cópia sem senha e tente de novo." : e && e.message === "imagem" ? "Este PDF parece ser uma imagem digitalizada, sem texto que o app consiga ler." : "Confira a conexão com a internet e tente de novo, ou cadastre o concurso à mão e cole o conteúdo.")}</p>`,
      foot: `<button class="btn pri" data-act="conc-novo">Cadastrar à mão</button>` });
    return;
  }
  revisarPdf(r);
}
function revisarPdf(r) {
  const cargos = r.cargos || [];
  openSheet({ title: "Confira o que o app encontrou", tall: true, wide: true, sub: `${r.arquivo}, ${plural(r.paginas, "página", "páginas")}`,
    body: `<div class="grid2"><label class="field"><span class="lbl">Órgão</span><input type="text" id="rp-o" value="${esc(r.orgao || "")}"></label><label class="field"><span class="lbl">Banca</span><input type="text" id="rp-b" value="${esc(r.banca || "")}"></label></div>
      <div class="field"><span class="lbl">Seu cargo</span>${cargos.length ? `<div class="perfis">${cargos.map((c, i) => `<label class="perfil"><input type="radio" name="rp-c" value="${i}" ${cargos.length === 1 ? "checked" : ""}><span class="perfil-n">${esc(c.nome)}</span><span class="perfil-v">${esc([c.vagas ? c.vagas + " vagas" : "", c.rem].filter(Boolean).join(", ") || "Vagas e remuneração não encontradas")}</span></label>`).join("")}</div>` : ""}
        <input type="text" id="rp-c" placeholder="${cargos.length ? "Ou digite outro cargo" : "Nome do cargo"}"></div>
      <div class="grid2"><label class="field"><span class="lbl">Número do edital</span><input type="text" id="rp-n" value="${esc(r.numero || "")}"></label><label class="field"><span class="lbl">Taxa</span><input type="text" id="rp-tx" value="${esc(r.taxa || "")}"></label></div>
      <label class="field"><span class="lbl">Site</span><input type="url" id="rp-s" value="${esc(r.site || "")}"></label>
      <div class="field"><span class="lbl">Datas encontradas</span>${(r.datas || []).length ? `<ul class="rp-datas">${r.datas.map((d, i) => `<li><label class="check"><input type="checkbox" id="rp-d-${i}" ${d.on ? "checked" : ""}><span><b>${dataRot(d)}</b> ${esc(d.titulo)}</span></label>${d.trecho ? `<p class="hint">“${esc(d.trecho)}”</p>` : ""}</li>`).join("")}</ul>` : `<p class="hint">Nenhuma data encontrada. Adicione depois em Edital, Datas.</p>`}</div>
      <div class="field"><span class="lbl">Conteúdo programático</span>${(r.blocos || []).length ? `<ul class="rp-datas">${r.blocos.map((b, i) => `<li><label class="check"><input type="checkbox" id="rp-b-${i}" ${b.on ? "checked" : ""}><span><b>${esc(b.titulo)}</b>: ${plural(b.grupos.length, "matéria", "matérias")}, ${plural(b.nA, "tópico", "tópicos")}</span></label></li>`).join("")}</ul><p class="hint">Marque os conhecimentos gerais e os do seu cargo.</p>` : `<p class="hint">Não encontrei o conteúdo programático. Depois de salvar, cole o conteúdo em Edital.</p>`}</div>`,
    foot: `<button class="btn ghost" data-no>Cancelar</button><button class="btn pri" data-ok>Continuar</button>`,
    onMount: s => {
      $("[data-no]", s).onclick = () => closeSheet();
      $("[data-ok]", s).onclick = () => {
        const sel = $('input[name="rp-c"]:checked', s), cg = $("#rp-c", s).value.trim() || (sel ? cargos[+sel.value].nome : "");
        const org = $("#rp-o", s).value.trim();
        if (!org || !cg) return toast("Informe o órgão e o cargo.");
        const datas = (r.datas || []).filter((d, i) => $("#rp-d-" + i, s).checked).map(d => ({ id: "u" + uid(), tipo: TIPOS_DATA.some(x => x[0] === d.tipo) ? d.tipo : "outro", titulo: d.titulo, ini: d.ini, ...(d.fim ? { fim: d.fim } : {}) }));
        const pv = datas.find(d => d.tipo === "prova"), cs = sel ? cargos[+sel.value] : null;
        const c = { id: uid(), sigla: "", orgao: org, cargo: cg, banca: $("#rp-b", s).value.trim(), numero: $("#rp-n", s).value.trim(), taxa: $("#rp-tx", s).value.trim(), site: $("#rp-s", s).value.trim(), vagas: cs && cs.vagas ? cs.vagas + " vagas" : "", remuneracao: cs ? cs.rem || "" : "", dataProva: pv ? pv.ini : "", datas, criado: today() };
        DB.concursos.push(c); cfg().concurso = c.id; commit({ quiet: true });
        const blocos = (r.blocos || []).filter((b, i) => $("#rp-b-" + i, s).checked);
        if (blocos.length) previaConteudo(c.id, juntarGrupos(blocos), blocos.map(b => b.texto).join("\n\n"));
        else { closeSheet(); go("edital"); toast("Concurso salvo. Cole o conteúdo programático em Edital."); }
      };
    } });
}

/* ================= início ================= */
(function boot() {
  aplicarTema();
  try { history.scrollRestoration = "manual"; } catch {}
  let linkToken = "";
  const lm = location.hash.match(/^#\/conectar\/(.+)$/);
  if (lm) { try { linkToken = decodeURIComponent(lm[1]); } catch {} history.replaceState({ d: 0 }, "", "#/ajustes"); }
  if (!location.hash) history.replaceState({ d: 0 }, "", "#/hoje");
  else if (!history.state) history.replaceState({ d: 0 }, "", location.hash);
  document.getElementById("marca").innerHTML = MARCA;
  document.getElementById("rail-marca").innerHTML = MARCA;
  if (DB.ativa) UI.focoAberto = true;
  render({ top: true });
  if (linkToken && linkToken !== sync.token) confirmSheet("Conectar este aparelho?", "Os dados deste aparelho se juntam aos da nuvem. Os ajustes passam a ser os da nuvem.", "Conectar", () => connectSync(linkToken), false);
  else if (linkToken) toast("Este aparelho já está conectado.");
  else if (syncOn()) syncNow({ quiet: true });
  let ultimoDia = today();
  setInterval(() => { if (today() !== ultimoDia) { ultimoDia = today(); VER++; agendarRender(); } }, 60000);
  if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
})();
