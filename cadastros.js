/* Estudo Fácil: cadastros de editais e disciplinas, leitura de editais e início do app. */
"use strict";

/* ================= EDITAIS ================= */
const ED_TABS = [["conteudo", "Conteúdo"], ["prova", "Prova"], ["datas", "Datas"], ["sobre", "Sobre"]];
const perfilDe = c => (c.perfis || []).find(p => p.id === c.perfil);
const barraMat = R => `<span class="mat-bar" aria-hidden="true"><i style="width:${R.pc}%"></i><i class="b" style="width:${pct(R.est - R.teo, R.n)}%"></i></span>`;
const numTxt = v => Math.abs(v - Math.round(v)) > 0.01 ? "cerca de " + dec(v) : dec(Math.round(v));

VIEWS.editais = () => {
  const t = today(), L = DB.concursos.slice().sort((a, b) => (a.dataProva || "9999").localeCompare(b.dataProva || "9999"));
  const card = c => {
    const E = estrutura(c), n = c.dataProva ? diffD(t, c.dataProva) : null, p = perfilDe(c);
    const prova = c.dataProva ? (n > 0 ? `Prova em ${dLonga(c.dataProva)}, daqui a ${plural(n, "dia", "dias")}` : n === 0 ? "A prova é hoje" : `Prova em ${br(c.dataProva)}`) : "Sem data de prova";
    return `<li><button class="ed-card" data-go="edital/${c.id}">
      <span class="ed-c-h"><b>${esc(nomeEdital(c))}</b><span class="tag${c.status === "estudando" ? " ok" : ""}">${statusTxt(c.status)}</span></span>
      <span class="ed-c-s">${esc([c.cargo, p ? "perfil " + p.nome : ""].filter(Boolean).join(", "))}${c.sigla && c.orgao ? `<small>${esc(c.orgao)}</small>` : ""}</span>
      <span class="ed-c-i">${prova}. ${E.n ? `${E.teo} de ${plural(E.n, "assunto", "assuntos")} com a teoria concluída.` : "Ainda sem conteúdo."}</span>
      ${E.n ? barraMat(E) : ""}
    </button></li>`;
  };
  const sec = (st, tit) => { const l = L.filter(c => c.status === st); return l.length ? `<section class="sec"><h2 class="sec-h">${tit}</h2><ul class="cards">${l.map(card).join("")}</ul></section>` : ""; };
  return `<div class="pg">
    ${cabecalho("Editais", "Os concursos que você acompanha. O plano do dia junta os assuntos dos editais marcados como <b>Estudando</b>.",
      { acoes: DB.concursos.length > 1 ? `<button class="btn ghost" data-act="comparar">Comparar editais</button>` : "", criar: { rotulo: "Adicionar edital", attrs: 'data-act="conc-novo"' } })}
    ${L.length ? sec("estudando", "Estudando") + sec("espera", "Em espera") + sec("encerrado", "Encerrados")
      : vazio("Nenhum edital cadastrado", "Adicione o edital do concurso que vai fazer: pronto, lido do PDF ou digitado. Sem edital, o plano usa as disciplinas que você cadastrar.")}
  </div>`;
};

VIEWS.edital = r => {
  const c = editalPorId(r.sub);
  if (!c) return VIEWS.editais();
  const tab = ED_TABS.some(x => x[0] === r.sub2) ? r.sub2 : "conteudo", p = perfilDe(c);
  const body = tab === "prova" ? edProva(c) : tab === "datas" ? edDatas(c) : tab === "sobre" ? edSobre(c) : edConteudo(c);
  const org = c.orgao ? `${esc(c.orgao)}${c.sigla ? ` (${esc(c.sigla)})` : ""}` : esc(c.sigla || "");
  return `<div class="pg">
    <p class="voltar"><button class="btn link sm" data-go="editais">${I.chevL}Editais</button></p>
    <header class="pg-h ed-h">
      <p class="ed-org">${org}${c.banca ? `${org ? ", " : ""}banca ${esc(c.banca)}` : ""}</p>
      <h1>${esc(c.cargo || nomeEdital(c))}</h1>
      ${p ? `<p class="ed-perfil">Perfil <b>${esc(p.nome)}</b> <button class="btn link sm" data-act="perfil" data-id="${c.id}">Trocar</button></p>` : ""}
      <div class="seg st-seg" role="group" aria-label="Situação do edital">${STATUS.map(([k, l]) => `<button data-act="ed-status" data-id="${c.id}" data-s="${k}" aria-pressed="${c.status === k}">${l}</button>`).join("")}</div>
    </header>
    <nav class="tabs" aria-label="Partes do edital">${ED_TABS.map(([k, l]) => `<button data-go="edital/${c.id}/${k}" ${k === tab ? 'aria-current="page"' : ""}>${l}</button>`).join("")}</nav>
    ${body}
  </div>`;
};
function edConteudo(c) {
  const E = estrutura(c), t = today();
  if (!E.links.length) return vazio("Este edital ainda não tem conteúdo", "Cole o conteúdo programático do edital ou escolha disciplinas que você já cadastrou.",
    `<div class="btns"><button class="btn pri" data-act="conteudo-colar" data-id="${c.id}">Colar o conteúdo</button><button class="btn ghost" data-act="disc-add" data-id="${c.id}">Escolher disciplinas</button></div>`);
  return `<section class="ed-res">
    <p><b>${E.teo} de ${E.n}</b> assuntos com a teoria concluída${E.est > E.teo ? ` e ${E.est - E.teo} em andamento` : ""}.${E.q ? ` ${numTxt(E.q)} questões na prova.` : ""}</p>
    <div class="trilha" aria-hidden="true"><span style="width:${E.pc}%"></span><span class="tr-b" style="width:${pct(E.est - E.teo, E.n)}%"></span></div>
    <p class="legenda"><span><i class="st st-2"></i><span class="tn hl">Teoria concluída</span></span><span><i class="st st-1"></i><span class="tn ul">Em andamento</span></span><span><i class="st st-0"></i>Não estudado</span></p>
  </section>
  ${E.grupos.map(g => `<section class="grupo">${g.nome ? `<div class="g-h"><h2>${esc(g.nome)}</h2>${g.q ? `<p>${numTxt(g.q)} questões, ${dec(g.pts)} pontos${E.pts ? `, ${pctTxt(pct(g.pts, E.pts))} da nota` : ""}</p>` : ""}</div>` : ""}
    ${g.links.map(l => matDetails(c, l, t)).join("")}</section>`).join("")}
  <div class="btns centro"><button class="btn ghost sm" data-act="disc-add" data-id="${c.id}">${I.plus}Adicionar disciplina</button><button class="btn ghost sm" data-act="conteudo-colar" data-id="${c.id}">Colar mais conteúdo</button></div>
  ${!E.q ? `<p class="hint centro">Informe quantas questões cada disciplina tem na prova, em <b>Questões e assuntos</b>. Assim o plano dá mais tempo ao que vale mais.</p>` : ""}`;
}
function matDetails(c, l, t) {
  const X = ix(), tops = l.tops, R = resumoEdital(tops), totM = (X.topsAll.get(l.m) || []).length;
  const sm = X.stM.get(l.m) || { s: 0, a: 0, e: 0 }, qq = sm.a + sm.e, due = tops.filter(x => x.prox && x.prox <= t).length;
  const k = `m:${c.id}:${l.m}`;
  return `<details class="mat" ${UI.edAberta.has(k) ? "open" : ""} data-k="${k}"><summary>
    <span class="mat-n">${esc(l.mat.nome)}</span>
    <span class="mat-info">${l.q ? `${numTxt(l.q)} ${l.q === 1 ? "questão" : "questões"}, ` : ""}${R.teo} de ${tops.length} concluídos${due ? `, <span class="rev-txt">${plural(due, "revisão", "revisões")}</span>` : ""}</span>
    ${barraMat(R)}${I.down}</summary>
    ${tops.length ? `<ul class="tops">${tops.map(x => { const s = statT(x.id), qx = s.a + s.e; return `<li><button class="top-row" data-act="topico" data-id="${x.id}">${glifo(x)}${nomeTop(x)}<span class="top-r">${revTxt(x)}${qx ? `<span class="tag ${pct(s.a, qx) < 60 ? "bad" : ""}">${pctTxt(pct(s.a, qx))} em ${qx}</span>` : ""}</span></button></li>`; }).join("")}</ul>` : `<p class="hint">Nenhum assunto marcado como cobrado neste edital.</p>`}
    <div class="mat-f"><span class="hint">${sm.s ? `${dur(sm.s)} estudadas${qq ? `, ${pctTxt(pct(sm.a, qq))} de acerto em ${qq} questões` : ""}.` : "Ainda sem estudo registrado."}${totM > tops.length ? ` O edital cobra ${tops.length} dos ${totM} assuntos da disciplina.` : ""}</span><button class="btn link sm" data-act="vinculo" data-id="${c.id}" data-m="${l.m}">${I.lapis}Questões e assuntos</button></div>
  </details>`;
}
function edProva(c) {
  const E = estrutura(c), P = c.prova;
  const porArea = E.grupos.length > 1 && E.grupos.every(g => g.id);
  const partes = porArea ? E.grupos.map(g => ({ nome: g.nome, q: g.q, pts: g.pts })) : E.links.map(l => ({ nome: l.mat.nome, q: l.q, pts: l.pts }));
  const cores = ["c1", "c2", "c3", "c4"], tot = E.pts || 1;
  const pesos = E.pts ? `<section class="bloco">
    <h2 class="b-h">Quanto vale cada parte</h2>
    <p class="hint">${numTxt(E.q)} questões, ${dec(E.pts)} pontos. A barra mostra o peso de cada ${porArea ? "área" : "disciplina"} na nota.</p>
    <div class="pesos" role="img" aria-label="${esc(partes.map(l => `${l.nome}: ${pctTxt(pct(l.pts, tot))}`).join("; "))}">${partes.map((l, i) => `<span class="${cores[i % 4]}" style="width:${pct(l.pts, tot)}%" title="${esc(l.nome)}: ${dec(l.pts)} pontos"></span>`).join("")}</div>
    <ul class="pesos-leg">${partes.map((l, i) => `<li><i class="${cores[i % 4]}"></i><span>${esc(l.nome)}</span><b>${pctTxt(pct(l.pts, tot))}</b></li>`).join("")}</ul>
    <table class="tb"><thead><tr><th>Disciplina</th><th class="n">Questões</th><th class="n">Pontos</th></tr></thead><tbody>
      ${E.grupos.map(g => (g.nome ? `<tr class="tb-g"><td>${esc(g.nome)}</td><td class="n">${dec(g.q)}</td><td class="n">${dec(g.pts)}</td></tr>` : "") + g.links.map(l => `<tr><td>${esc(l.mat.nome)}</td><td class="n">${l.q ? (Math.abs(l.q - Math.round(l.q)) > 0.01 ? "≈" + dec(l.q) : dec(l.q)) : "—"}</td><td class="n">${dec(l.pts)}</td></tr>`).join("")).join("")}
    </tbody></table>
    ${c.modelo === EDITAL_ABDI.id ? `<p class="hint">O edital não divide as 20 questões específicas entre os temas do perfil. A estimativa por tema segue o número de assuntos de cada um.</p>` : ""}
  </section>` : `<section class="bloco"><h2 class="b-h">Quanto vale cada parte</h2><p class="hint">Ainda sem questões cadastradas. Em Conteúdo, toque em <b>Questões e assuntos</b> em cada disciplina e informe quantas questões ela tem e quanto vale cada uma.</p></section>`;
  const corte = P.minPct && E.q ? Math.ceil(E.q * P.minPct / 100) : 0;
  const crit = `<section class="aviso"><p>${P.minPct ? `<b>Para passar na prova:</b> acertar pelo menos ${corte ? `${corte} das ${dec(E.q)} questões (${P.minPct}%)` : `${P.minPct}% das questões`}${P.naoZerar ? " e não zerar nenhuma das áreas" : ""}.` : "A nota mínima para passar não foi informada."}${P.grupos.length ? ` Áreas: ${esc(P.grupos.map(g => g.nome).join(", "))}.` : ""}</p>
    <button class="btn link sm" data-act="prova-regras" data-id="${c.id}">${I.lapis}Nota mínima e áreas da prova</button></section>`;
  const sims = DB.simulados.filter(s => s.c === c.id).sort((a, b) => b.d.localeCompare(a.d));
  const simHtml = `<section class="bloco">
    <div class="b-hr"><h2 class="b-h">Simulados</h2><button class="btn ghost sm" data-act="simulado" data-c="${c.id}">${I.plus}Registrar simulado</button></div>
    ${sims.length ? graficoSimulados(c, sims.slice().reverse()) + `<ul class="sim-lista">${sims.map(s => { const r = notaSimulado(c, s); return `<li><button class="sim-it" data-act="simulado" data-c="${c.id}" data-id="${s.id}"><span class="sim-d">${dCurta(s.d)}</span><span class="sim-n">${esc(s.nome || "Simulado")}</span><span class="sim-v"><b>${r.max ? dec(r.nota, 2) + " de " + dec(r.max) : r.acertos + " de " + r.q}</b>${r.passa !== null ? `<span class="tag ${r.passa ? "ok" : "bad"}">${r.passa ? "Passaria" : "Não passaria"}</span>` : ""}</span></button></li>`; }).join("")}</ul>`
      : `<p class="hint">Fez uma prova anterior da banca ou um simulado? Registre os acertos e o app calcula a nota${P.minPct ? " e diz se você passaria" : ""}.</p>`}
  </section>`;
  return pesos + crit + simHtml;
}
/* nota de um simulado pela estrutura do edital: por área quando há áreas, senão pelo total */
function notaSimulado(c, s) {
  const E = estrutura(c), P = c.prova, gs = E.grupos.filter(g => g.id && g.q);
  if (gs.length && s.r) {
    let nota = 0, ac = 0, zerou = false;
    for (const g of gs) { const a = +(s.r[g.id] || 0); nota += a * g.pts / g.q; ac += a; if (!a) zerou = true; }
    const q = sum(gs.map(g => g.q));
    return { nota, max: sum(gs.map(g => g.pts)), acertos: ac, q, passa: P.minPct ? ac >= Math.ceil(q * P.minPct / 100) && !(P.naoZerar && zerou) : null };
  }
  const a = +(s.acertos || 0), q = +(s.q || 0), max = E.q && E.pts && q === E.q ? E.pts : 0;
  return { nota: max ? a * E.pts / E.q : 0, max, acertos: a, q, passa: P.minPct && q ? a >= Math.ceil(q * P.minPct / 100) : null };
}
function graficoSimulados(c, sims) {
  if (sims.length < 2) return "";
  const R = sims.map(s => notaSimulado(c, s)), val = r => r.max ? r.nota : r.acertos;
  const max = Math.max(...R.map(r => r.max || r.q), 1);
  const W = 320, H = 120, pl = 8, pr = 8, pt = 14, pb = 18, n = sims.length;
  const x = i => pl + i * (W - pl - pr) / (n - 1), y = v => pt + (1 - v / max) * (H - pt - pb);
  const pts = R.map((r, i) => `${x(i).toFixed(1)},${y(val(r)).toFixed(1)}`).join(" ");
  return `<figure class="sim-graf"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolução das notas dos simulados">
    <line x1="${pl}" x2="${W - pr}" y1="${y(0)}" y2="${y(0)}" class="ax"/>
    <polyline points="${pts}" class="ln"/>
    ${R.map((r, i) => `<circle cx="${x(i)}" cy="${y(val(r))}" r="4.5" class="dt"><title>${dCurta(sims[i].d)}: ${r.max ? dec(r.nota, 2) + " pontos" : r.acertos + " acertos"}</title></circle>`).join("")}
    <text x="${x(n - 1)}" y="${y(val(R[n - 1])) - 8}" text-anchor="end" class="lb">${R[n - 1].max ? dec(R[n - 1].nota, 1) : R[n - 1].acertos}</text>
  </svg><figcaption>Nota de cada simulado, do mais antigo ao mais recente, numa escala até ${dec(max)}.</figcaption></figure>`;
}
function simuladoSheet(cid, id) {
  const c = editalPorId(cid); if (!c) return;
  const s = id ? DB.simulados.find(x => x.id === id) : null, P = c.prova, E = estrutura(c), gs = E.grupos.filter(g => g.id && g.q);
  const v = s || { d: today(), nome: "", r: {}, obs: "", q: E.q || "" };
  openSheet({ title: s ? "Editar simulado" : "Registrar simulado", sub: nomeEdital(c),
    body: `<div class="grid2"><label class="field"><span class="lbl">Data</span><input type="date" id="si-d" value="${v.d}"></label><label class="field"><span class="lbl">Nome</span><input type="text" id="si-n" value="${esc(v.nome)}" placeholder="Ex.: prova de 2024, simulado 1"></label></div>
      ${gs.length ? gs.map(g => `<label class="field"><span class="lbl">${esc(g.nome)}: acertos de ${numTxt(g.q)}</span><input type="number" inputmode="numeric" min="0" max="${Math.round(g.q)}" id="si-${g.id}" value="${(v.r || {})[g.id] ?? ""}" data-si></label>`).join("")
        : `<div class="grid2"><label class="field"><span class="lbl">Acertos</span><input type="number" inputmode="numeric" min="0" id="si-a" value="${v.acertos ?? ""}" data-si></label><label class="field"><span class="lbl">Questões</span><input type="number" inputmode="numeric" min="1" id="si-q" value="${v.q ?? ""}" data-si></label></div>`}
      <p class="aviso" id="si-res" aria-live="polite"></p>
      <label class="field"><span class="lbl">Anotações</span><textarea id="si-o" rows="2" placeholder="O que mais errou, tempo de prova…">${esc(v.obs || "")}</textarea></label>`,
    foot: `${s ? `<button class="btn ghost danger" data-del>${I.lixo}Excluir</button>` : ""}<button class="btn pri" data-ok>Salvar</button>`,
    onMount: sh => {
      const ler = () => {
        const o = { d: $("#si-d", sh).value || today(), nome: $("#si-n", sh).value.trim(), obs: $("#si-o", sh).value.trim() };
        if (gs.length) { o.r = {}; for (const g of gs) o.r[g.id] = clamp(parseInt($("#si-" + g.id, sh).value) || 0, 0, Math.round(g.q)); }
        else { o.acertos = Math.max(0, parseInt($("#si-a", sh).value) || 0); o.q = Math.max(o.acertos, parseInt($("#si-q", sh).value) || 0); }
        return o;
      };
      const res = () => {
        const o = ler(), r = notaSimulado(c, o);
        const falta = P.minPct && r.q ? Math.max(0, Math.ceil(r.q * P.minPct / 100) - r.acertos) : 0;
        $("#si-res", sh).innerHTML = `<b>${r.max ? `${dec(r.nota, 2)} de ${dec(r.max)} pontos, ` : ""}${r.acertos} de ${r.q || 0} questões</b> (${pctTxt(pct(r.acertos, r.q))}). `
          + (r.passa === null ? "" : r.passa ? "Com esse resultado você passaria." : falta ? `Faltariam ${plural(falta, "acerto", "acertos")} para passar.` : "Zerar uma área elimina, mesmo com nota alta.");
      };
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
    <p class="hint">Cronograma do concurso. Datas marcadas como <b>Depende de você</b> exigem uma ação sua, como pagar a taxa ou enviar documentos. Confira as retificações no site do concurso.</p>
    <div class="btns"><button class="btn ghost sm" data-act="datas-editar" data-id="${c.id}">${I.lapis}${todas.length ? "Editar datas" : "Adicionar datas"}</button>${todas.length ? `<button class="btn ghost sm" data-act="ics">${I.baixar}Levar para a agenda do celular</button>` : ""}</div>
  </section>
  ${ds.length ? h : todas.length ? h : vazio("Nenhuma data cadastrada", "Adicione as datas do cronograma: inscrições, pagamento da taxa, prova, resultados.")}`;
}
function edSobre(c) {
  const p = perfilDe(c);
  const kv = [["Órgão", c.orgao], ["Sigla", c.sigla], ["Cargo", c.cargo], ["Banca", c.banca], ["Edital", c.numero ? "nº " + c.numero : ""], ["Prova", c.dataProva ? `${br(c.dataProva)}${c.horaProva ? ", " + c.horaProva : ""}` : ""], ["Local da prova", c.local], ["Remuneração", c.remuneracao], ["Lotação", c.lotacao], ["Regime", c.regime], ["Taxa de inscrição", c.taxa], ["Validade", c.validade], ["Vagas", p ? `${plural(p.vagas, "imediata", "imediatas")} e ${p.cr} no cadastro reserva, no perfil ${p.nome}` : c.vagas || ""]].filter(x => x[1]);
  return `<section class="bloco">${kv.length ? `<dl class="dl">${kv.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : ""}
    <div class="btns"><button class="btn ghost sm" data-act="ed-dados" data-id="${c.id}">${I.lapis}Editar dados</button>${c.site ? `<a class="btn ghost sm" href="${esc(c.site)}" target="_blank" rel="noopener">${I.externo}Página do concurso</a>` : ""}${c.email ? `<a class="btn ghost sm" href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : ""}</div></section>
  ${p ? `<section class="bloco"><h2 class="b-h">Requisitos do perfil ${esc(p.nome)}</h2><p>${esc(p.requisito)}</p><p class="hint">Os documentos são exigidos só na contratação.</p></section>` : ""}
  ${c.provaNotas && c.provaNotas.length ? `<section class="bloco"><h2 class="b-h">Como é a prova</h2><ul class="notas">${c.provaNotas.map(n => `<li>${esc(n)}</li>`).join("")}</ul></section>` : ""}
  ${c.etapas && c.etapas.length ? `<section class="bloco"><h2 class="b-h">Etapas e pontuação</h2><ul class="etapas">${c.etapas.map(e => `<li><div class="et-h"><b>${esc(e.nome)}</b><span>${dec(e.pontos)} pontos</span></div><p class="hint">${esc(e.tipo)}. ${esc(e.texto)}</p></li>`).join("")}</ul>
    <p class="hint">A nota final soma as etapas, até ${dec(sum(c.etapas.map(e => e.pontos)))} pontos.${c.desempate ? ` Desempate: ${esc(c.desempate)}` : ""}</p></section>` : ""}
  <p class="centro"><button class="btn link sm danger" data-act="ed-excluir" data-id="${c.id}">${I.lixo}Excluir este edital</button></p>`;
}

/* ---------- janelas do edital ---------- */
function vinculoSheet(cid, mid) {
  const c = editalPorId(cid), l = c && c.disc.find(x => x.m === mid), m = ix().matById.get(mid); if (!l || !m) return;
  const todos = ix().topsAll.get(mid) || [], gs = c.prova.grupos;
  openSheet({ title: m.nome, sub: `No edital ${nomeEdital(c)}`, tall: true,
    body: `<div class="grid2"><label class="field"><span class="lbl">Questões na prova</span><input type="number" inputmode="decimal" min="0" step="0.1" id="vi-q" value="${l.q || ""}" placeholder="0"></label>
      <label class="field"><span class="lbl">Pontos por questão</span><input type="number" inputmode="decimal" min="0" step="0.05" id="vi-v" value="${l.valor ?? 1}"></label></div>
      ${gs.length ? `<label class="field"><span class="lbl">Área da prova</span><select id="vi-g"><option value="">Sem área</option>${gs.map(g => `<option value="${g.id}" ${l.g === g.id ? "selected" : ""}>${esc(g.nome)}</option>`).join("")}</select></label>` : ""}
      <div class="field"><div class="b-hr"><span class="lbl">Assuntos cobrados neste edital</span>${todos.length > 1 ? `<button class="btn link sm" data-todos>Marcar ou desmarcar todos</button>` : ""}</div>
        ${todos.length ? `<ul class="chk-lista">${todos.map(t => `<li><label class="check"><input type="checkbox" value="${t.id}" ${l.t.includes(t.id) ? "checked" : ""}><span>${esc(t.nome)}</span></label></li>`).join("")}</ul>` : `<p class="hint">A disciplina ainda não tem assuntos.</p>`}</div>
      <label class="field"><span class="lbl">Novos assuntos, um por linha</span><textarea id="vi-n" rows="3" placeholder="Entram na disciplina e neste edital"></textarea></label>
      <p class="hint">A disciplina é a mesma em todos os editais: o que você estuda num assunto vale em todos os que o cobram. Para renomear ou apagar assuntos, <button class="btn link sm" data-go="disciplinas/${mid}">abra a disciplina</button>.</p>`,
    foot: `<button class="btn ghost danger" data-del>Tirar do edital</button><button class="btn pri" data-ok>Salvar</button>`,
    onMount: s => {
      const tb = $("[data-todos]", s); if (tb) tb.onclick = () => { const cb = $$(".chk-lista input", s), all = cb.every(x => x.checked); cb.forEach(x => { x.checked = !all; }); };
      $("[data-ok]", s).onclick = () => {
        const num = id => Math.max(0, parseFloat(String($(id, s).value).replace(",", ".")) || 0);
        const t = $$(".chk-lista input", s).filter(x => x.checked).map(x => x.value);
        const novos = $("#vi-n", s).value.split("\n").map(x => x.trim()).filter(Boolean);
        if (novos.length) for (const id of incorporar([{ id: mid, nome: m.nome, tops: novos.map(nome => ({ nome })) }])[0].t) if (!t.includes(id)) t.push(id);
        Object.assign(l, { q: num("#vi-q"), valor: $("#vi-v", s).value === "" ? 1 : num("#vi-v"), t });
        const g = $("#vi-g", s); if (g) l.g = g.value;
        commit(); closeSheet(); toast("Disciplina atualizada neste edital.");
      };
      $("[data-del]", s).onclick = () => { closeSheet(true); confirmSheet("Tirar a disciplina do edital?", `${esc(m.nome)} deixa de fazer parte de ${esc(nomeEdital(c))}. O que você já estudou continua em Disciplinas.`, "Tirar do edital", () => {
        c.disc = c.disc.filter(x => x.m !== mid); limparOrfas([mid]); commit(); toast("Disciplina retirada do edital.");
      }); };
    } });
}
function discAddSheet(cid) {
  const c = editalPorId(cid); if (!c) return;
  const X = ix(), fora = DB.materias.filter(m => !c.disc.some(l => l.m === m.id)).sort((a, b) => fold(a.nome).localeCompare(fold(b.nome)));
  openSheet({ title: "Adicionar disciplinas", sub: nomeEdital(c), tall: true,
    body: `${fora.length ? `<div class="field"><span class="lbl">Disciplinas que você já cadastrou</span><ul class="chk-lista">${fora.map(m => `<li><label class="check"><input type="checkbox" value="${m.id}"><span>${esc(m.nome)} <small>${plural((X.topsAll.get(m.id) || []).length, "assunto", "assuntos")}</small></span></label></li>`).join("")}</ul>
        <p class="hint">Entram com todos os assuntos. Depois ajuste as questões e os assuntos cobrados.</p></div>` : ""}
      <div class="field"><span class="lbl">${fora.length ? "Ou crie uma disciplina nova" : "Nova disciplina"}</span><input type="text" id="da-n" placeholder="Ex.: Direito Administrativo"></div>
      <div class="grid2"><label class="field"><span class="lbl">Questões na prova</span><input type="number" inputmode="decimal" min="0" step="0.1" id="da-q" placeholder="0"></label><label class="field"><span class="lbl">Pontos por questão</span><input type="number" inputmode="decimal" min="0" step="0.05" id="da-v" value="1"></label></div>
      <label class="field"><span class="lbl">Assuntos da disciplina nova, um por linha</span><textarea id="da-t" rows="6"></textarea></label>
      <p class="hint">Tem o conteúdo programático em texto? <button class="btn link sm" data-act="conteudo-colar" data-id="${c.id}">Cole aqui</button> e o app separa disciplinas e assuntos.</p>`,
    foot: `<button class="btn ghost" data-no>Cancelar</button><button class="btn pri" data-ok>Adicionar</button>`,
    onMount: s => {
      $("[data-no]", s).onclick = () => closeSheet();
      $("[data-ok]", s).onclick = () => {
        let n = 0;
        for (const cb of $$(".chk-lista input", s).filter(x => x.checked)) { c.disc.push({ m: cb.value, g: "", q: 0, valor: 1, t: (X.topsAll.get(cb.value) || []).map(t => t.id) }); n++; }
        const nome = $("#da-n", s).value.trim(), tops = $("#da-t", s).value.split("\n").map(x => x.trim()).filter(Boolean);
        if (nome) {
          const num = id => Math.max(0, parseFloat(String($(id, s).value).replace(",", ".")) || 0);
          vincular(c, incorporar([{ nome, q: num("#da-q"), valor: $("#da-v", s).value === "" ? 1 : num("#da-v"), tops: tops.map(t => ({ nome: t })) }])); n++;
        } else if (tops.length) return toast("Dê um nome à disciplina nova.");
        if (!n) return toast("Escolha uma disciplina ou crie uma nova.");
        commit(); closeSheet(); toast(`${plural(n, "disciplina adicionada", "disciplinas adicionadas")} ao edital.`);
      };
    } });
}
function provaSheet(cid) {
  const c = editalPorId(cid); if (!c) return;
  const P = c.prova;
  const linha = g => `<li class="ar-row"><input type="text" value="${esc(g.nome)}" data-gid="${g.id}" aria-label="Nome da área" placeholder="Ex.: Conhecimentos básicos"><button class="icon-btn" data-rem aria-label="Remover área">${I.lixo}</button></li>`;
  openSheet({ title: "Regras da prova", sub: nomeEdital(c),
    body: `<label class="field"><span class="lbl">Acerto mínimo para passar (%)</span><input type="number" inputmode="numeric" min="0" max="100" id="pr-m" value="${P.minPct || ""}" placeholder="Não informado"></label>
      <label class="check"><input type="checkbox" id="pr-z" ${P.naoZerar ? "checked" : ""}><span>Quem zera alguma área é eliminado</span></label>
      <div class="field"><span class="lbl">Áreas da prova</span><p class="hint">Opcional. Por exemplo, conhecimentos gerais e específicos. Cada disciplina vai para uma área em Questões e assuntos.</p>
        <ul class="ar-lista">${P.grupos.map(linha).join("")}</ul><button class="btn ghost sm" data-add>${I.plus}Adicionar área</button></div>`,
    foot: `<button class="btn ghost" data-no>Cancelar</button><button class="btn pri" data-ok>Salvar</button>`,
    onMount: s => {
      const ul = $(".ar-lista", s);
      $("[data-add]", s).onclick = () => { ul.insertAdjacentHTML("beforeend", linha({ id: "g" + uid(), nome: "" })); $("li:last-child input", ul).focus(); };
      ul.addEventListener("click", e => { const b = e.target.closest("[data-rem]"); if (b) b.closest("li").remove(); });
      $("[data-no]", s).onclick = () => closeSheet();
      $("[data-ok]", s).onclick = () => {
        const grupos = $$("input", ul).map(i => ({ id: i.dataset.gid, nome: i.value.trim() })).filter(g => g.nome);
        c.prova = { minPct: clamp(parseInt($("#pr-m", s).value) || 0, 0, 100), naoZerar: $("#pr-z", s).checked, grupos };
        for (const l of c.disc) if (l.g && !grupos.some(g => g.id === l.g)) l.g = "";
        commit(); closeSheet(); toast("Regras salvas.");
      };
    } });
}
const CAMPOS_ED = [["orgao", "Órgão", "Ex.: Tribunal Regional Federal da 1ª Região"], ["sigla", "Sigla", "Ex.: TRF1"], ["cargo", "Cargo", "Ex.: Analista Judiciário"], ["banca", "Banca", "Ex.: FGV, Cebraspe"], ["numero", "Número do edital", "Ex.: 01/2026"],
  ["horaProva", "Horário da prova", "Ex.: 13h às 17h"], ["local", "Local da prova", ""], ["remuneracao", "Remuneração", "Ex.: R$ 13.994,78"], ["vagas", "Vagas", "Ex.: 20 vagas"], ["taxa", "Taxa de inscrição", ""], ["site", "Site do concurso", "https://"]];
function dadosSheet(cid) {
  const c = cid ? editalPorId(cid) : null, v = c || {};
  const campo = ([k, l, ph]) => `<label class="field"><span class="lbl">${l}</span><input type="${k === "site" ? "url" : "text"}" id="ed-${k}" value="${esc(v[k] || "")}" placeholder="${esc(ph)}"></label>`;
  openSheet({ title: c ? "Dados do edital" : "Novo edital", tall: true,
    body: `${campo(CAMPOS_ED[0])}<div class="grid2">${campo(CAMPOS_ED[1])}${campo(CAMPOS_ED[3])}</div>${campo(CAMPOS_ED[2])}
      <div class="grid2"><label class="field"><span class="lbl">Data da prova</span><input type="date" id="ed-dataProva" value="${v.dataProva || ""}"></label>${campo(CAMPOS_ED[5])}</div>
      <details class="mais-campos" ${c ? "open" : ""}><summary>Mais informações (opcional)</summary>${campo(CAMPOS_ED[4])}${campo(CAMPOS_ED[6])}<div class="grid2">${campo(CAMPOS_ED[7])}${campo(CAMPOS_ED[8])}</div><div class="grid2">${campo(CAMPOS_ED[9])}${campo(CAMPOS_ED[10])}</div></details>`,
    foot: `<button class="btn ghost" data-no>Cancelar</button><button class="btn pri" data-ok>${c ? "Salvar" : "Criar e colar o conteúdo"}</button>`,
    onMount: s => {
      $("[data-no]", s).onclick = () => closeSheet();
      $("[data-ok]", s).onclick = () => {
        const o = {}; for (const [k] of CAMPOS_ED) o[k] = $("#ed-" + k, s).value.trim();
        if (!o.orgao && !o.sigla) return toast("Informe o órgão ou a sigla do concurso.");
        const dp = $("#ed-dataProva", s).value;
        const alvo = c || { id: uid(), status: "estudando", prova: provaVazia(), disc: [], datas: [], criado: today() };
        Object.assign(alvo, o);
        definirDataProva(alvo, dp);
        if (c) { commit(); closeSheet(); toast("Dados salvos."); return; }
        DB.concursos.push(alvo); commit({ quiet: true });
        colarConteudoSheet(alvo.id, "", true);
      };
    } });
}
/* a data da prova fica também no cronograma, como uma data do tipo Prova */
function definirDataProva(c, d) {
  const pv = c.datas.find(x => x.tipo === "prova");
  if (d) { if (pv) pv.ini = d; else c.datas.push({ id: "u" + uid(), tipo: "prova", titulo: "Prova", ini: d }); }
  else if (pv && pv.ini === c.dataProva) c.datas = c.datas.filter(x => x !== pv);
  c.datas.sort((a, b) => a.ini.localeCompare(b.ini));
  c.dataProva = d;
}
function perfilSheet(cid) {
  const c = cid ? editalPorId(cid) : null, perfis = c ? c.perfis || [] : EDITAL_ABDI.perfis;
  openSheet({ title: c ? "Trocar de perfil" : `${EDITAL_ABDI.sigla}: escolha o perfil`, tall: true, sub: c ? "" : EDITAL_ABDI.cargo,
    body: `<p class="hint">${c ? "Os conhecimentos gerais e institucionais continuam iguais. Os específicos do perfil atual que você já estudou ficam guardados em Disciplinas e voltam se escolher o perfil de novo." : "Os conhecimentos gerais e institucionais são iguais para todos. O perfil define os 20 conhecimentos específicos. Dá para trocar depois."}</p>
      <div class="perfis" role="radiogroup" aria-label="Perfil">${perfis.map(p => `<label class="perfil${c && c.perfil === p.id ? " on" : ""}"><input type="radio" name="pf" value="${p.id}" ${c && c.perfil === p.id ? "checked" : ""}><span class="perfil-n">${esc(p.nome)}</span><span class="perfil-v">${plural(p.vagas, "vaga", "vagas")} e ${p.cr} no cadastro reserva</span></label>`).join("")}</div>`,
    foot: `<button class="btn ghost" data-no>Cancelar</button><button class="btn pri" data-ok>${c ? "Trocar" : "Adicionar edital"}</button>`,
    onMount: s => {
      s.addEventListener("change", () => $$(".perfil", s).forEach(l => l.classList.toggle("on", $("input", l).checked)));
      $("[data-no]", s).onclick = () => closeSheet();
      $("[data-ok]", s).onclick = () => {
        const v = ($('input[name="pf"]:checked', s) || {}).value;
        if (!v) return toast("Escolha um perfil.");
        if (c) { closeSheet(true); if (v !== c.perfil) trocarPerfil(c, v); return; }
        const nc = adicionarAbdi(v);
        editalCriado(nc, `Edital da ${EDITAL_ABDI.sigla} adicionado.`);
      };
    } });
}
const TIPOS_DATA = [["inscricao", "Inscrições"], ["isencao", "Isenção da taxa"], ["pagamento", "Pagamento"], ["envio", "Envio de documentos"], ["aviso", "Aviso"], ["prova", "Prova"], ["gabarito", "Gabarito"], ["recurso", "Recursos"], ["resultado", "Resultado"], ["convocacao", "Convocação"], ["etapa", "Outra etapa"], ["final", "Resultado final"], ["publicacao", "Publicação"], ["outro", "Outra data"]];
function datasSheet(cid) {
  const c = editalPorId(cid); if (!c) return;
  const lista = clone(c.datas);
  const linha = d => `<li class="dt-row">
    <input type="text" data-k="titulo" value="${esc(d.titulo)}" aria-label="Descrição" placeholder="Descrição">
    <div class="grid3"><label><span>Início</span><input type="date" data-k="ini" value="${d.ini || ""}"></label><label><span>Fim, se for período</span><input type="date" data-k="fim" value="${d.fim || ""}"></label>
    <label><span>Tipo</span><select data-k="tipo">${TIPOS_DATA.map(([k, l]) => `<option value="${k}" ${d.tipo === k ? "selected" : ""}>${l}</option>`).join("")}</select></label></div>
    <div class="dt-f"><label class="check sm"><input type="checkbox" data-k="acao" ${d.acao ? "checked" : ""}><span>Depende de mim</span></label><button class="btn link sm danger" data-rem>${I.lixo}Remover</button></div></li>`;
  openSheet({ title: "Datas do concurso", sub: nomeEdital(c), tall: true, wide: true,
    body: `<p class="hint">Atualize quando sair uma retificação. A data do tipo Prova define a contagem regressiva.</p><ul class="dt-lista">${lista.map(linha).join("")}</ul><button class="btn ghost sm" data-add>${I.plus}Adicionar data</button>`,
    foot: `<button class="btn ghost" data-no>Cancelar</button><button class="btn pri" data-ok>Salvar datas</button>`,
    onMount: s => {
      const ul = $(".dt-lista", s);
      $("[data-add]", s).onclick = () => { ul.insertAdjacentHTML("beforeend", linha({ titulo: "", ini: "", fim: "", tipo: "outro" })); $("li:last-child input", ul).focus(); };
      if (!lista.length) $("[data-add]", s).click();
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
/* comparação de dois editais: quanto do conteúdo se repete */
function compararSheet(aId, bId) {
  const L = DB.concursos; if (L.length < 2) return;
  const A = editalPorId(aId) || L[0], B = editalPorId(bId && bId !== A.id ? bId : "") || L.find(x => x !== A);
  const EA = estrutura(A), EB = estrutura(B), tA = new Set(EA.tops.map(t => t.id)), tB = new Set(EB.tops.map(t => t.id));
  const comum = [...tA].filter(id => tB.has(id)).length;
  const ids = [...new Set([...EA.links.map(l => l.m), ...EB.links.map(l => l.m)])];
  const linhas = ids.map(m => {
    const la = EA.links.find(l => l.m === m), lb = EB.links.find(l => l.m === m);
    const a = la ? la.tops.length : 0, b = lb ? lb.tops.length : 0, c = la && lb ? la.tops.filter(t => tB.has(t.id)).length : 0;
    return { nome: matNome(m), a, b, c, la, lb };
  }).sort((x, y) => y.c - x.c || fold(x.nome).localeCompare(fold(y.nome)));
  const sel = (id, atual, outro) => `<select id="${id}">${L.map(c => `<option value="${c.id}" ${c === atual ? "selected" : ""} ${c === outro ? "disabled" : ""}>${esc(nomeEdital(c))}${c.cargo ? `: ${esc(c.cargo)}` : ""}</option>`).join("")}</select>`;
  openSheet({ title: "Comparar editais", tall: true, wide: true,
    body: `<div class="grid2"><label class="field"><span class="lbl">Edital A</span>${sel("cp-a", A, B)}</label><label class="field"><span class="lbl">Edital B</span>${sel("cp-b", B, A)}</label></div>
      <div class="aviso"><p><b>${plural(comum, "assunto em comum", "assuntos em comum")}.</b> ${comum ? `São ${pctTxt(pct(comum, tA.size))} do edital ${esc(nomeEdital(A))} e ${pctTxt(pct(comum, tB.size))} do ${esc(nomeEdital(B))}. O que você estuda para um adianta o outro.` : "Os dois editais não têm assuntos iguais cadastrados. Disciplinas com o mesmo nome são reconhecidas como a mesma."}</p></div>
      <table class="tb cp"><thead><tr><th>Disciplina</th><th class="n">${esc(nomeEdital(A))}</th><th class="n">${esc(nomeEdital(B))}</th><th class="n">Em comum</th></tr></thead><tbody>
        ${linhas.map(l => `<tr${l.c ? "" : ' class="mute"'}><td>${esc(l.nome)}</td><td class="n">${l.la ? l.a : "—"}</td><td class="n">${l.lb ? l.b : "—"}</td><td class="n">${l.c ? `<b>${l.c}</b>` : "—"}</td></tr>`).join("")}
      </tbody></table><p class="hint">Números de assuntos de cada disciplina em cada edital.</p>`,
    onMount: s => {
      $("#cp-a", s).onchange = e => compararSheet(e.target.value, B.id === e.target.value ? A.id : B.id);
      $("#cp-b", s).onchange = e => compararSheet(A.id === e.target.value ? B.id : A.id, e.target.value);
    } });
}
/* exportar datas para a agenda do celular */
const icsTxt = s => String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
function icsDobra(l) { const out = []; while (l.length > 70) { out.push(l.slice(0, 70)); l = " " + l.slice(70); } out.push(l); return out.join("\r\n"); }
function horaIcs(txt) { const m = String(txt || "").match(/(\d{1,2})\s*(?:h|:)\s*(\d{2})?/i); return m ? `${pad(+m[1])}:${m[2] || "00"}` : ""; }
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
  for (const c of editaisVivos()) {
    const nome = nomeEdital(c), desc = `${c.orgao || nome}${c.site ? ". " + c.site : ""}`;
    for (const d of datasConcurso(c)) {
      if ((d.fim || d.ini) < today()) continue;
      ev(`${c.id}-${d.id}-${d.ini}`, d.ini, d.fim, `${d.titulo} (${nome})`, desc, d.tipo === "prova" ? horaIcs(c.horaProva) : "");
      if (d.fim && d.fim !== d.ini) ev(`${c.id}-${d.id}-fim`, d.fim, null, `Último dia: ${d.titulo} (${nome})`, desc);
    }
  }
  for (const v of DB.eventos) if (v.d >= today()) ev(`v${v.id}`, v.d, null, v.titulo, v.obs || "", v.hora);
  L.push("END:VCALENDAR");
  return n ? L.map(icsDobra).join("\r\n") + "\r\n" : "";
}
const STATUS_MSG = { estudando: "Os assuntos deste edital entram no plano do dia.", espera: "Edital em espera: sai do plano do dia, mas as datas continuam na agenda.", encerrado: "Edital encerrado: sai do plano e da agenda. O histórico continua." };
Object.assign(ACT, {
  "perfil": el => perfilSheet(el.dataset.id),
  "bib-abdi": () => perfilSheet(null),
  "ed-novo-mao": () => dadosSheet(null),
  "ed-dados": el => dadosSheet(el.dataset.id),
  "ed-status": el => { const c = editalPorId(el.dataset.id); if (!c || c.status === el.dataset.s) return; c.status = el.dataset.s; commit(); toast(STATUS_MSG[c.status]); },
  "ed-excluir": el => { const c = editalPorId(el.dataset.id); if (!c) return; confirmSheet("Excluir o edital?", `${esc(nomeEdital(c))} sai do app, com as datas e os simulados. As disciplinas que você já estudou continuam em Disciplinas, com o histórico.`, "Excluir", () => {
    const ms = c.disc.map(l => l.m);
    DB.simulados = DB.simulados.filter(s => s.c !== c.id); DB.concursos = DB.concursos.filter(x => x !== c);
    limparOrfas(ms); commit({ quiet: true }); go("editais", true); toast("Edital excluído.");
  }); },
  "vinculo": el => vinculoSheet(el.dataset.id, el.dataset.m),
  "disc-add": el => discAddSheet(el.dataset.id),
  "prova-regras": el => provaSheet(el.dataset.id),
  "simulado": el => simuladoSheet(el.dataset.c, el.dataset.id),
  "datas-editar": el => datasSheet(el.dataset.id),
  "dt-passadas": () => { UI.dtPassadas = !UI.dtPassadas; render(); },
  "comparar": () => compararSheet(),
  "conc-novo": () => novoConcursoSheet(),
  "conteudo-colar": el => colarConteudoSheet(el.dataset.id),
  "ics": () => { const t = gerarIcs(); if (!t) return toast("Não há datas futuras para levar."); if (baixar("estudo-facil-datas.ics", new Blob([t], { type: "text/calendar;charset=utf-8" }))) toast("Arquivo baixado. Abra-o para adicionar as datas à agenda."); }
});

/* ================= novo edital: biblioteca, PDF ou à mão ================= */
function novoConcursoSheet() {
  const bib = BIBLIOTECA.filter(b => !DB.concursos.some(c => c.id === b.id)), t = today();
  openSheet({ title: "Adicionar edital",
    body: `<div class="opcoes">
      ${bib.map(b => `<button class="opcao" data-act="bib-abdi"><span class="op-k">Edital pronto</span><span class="op-n">${esc(b.orgao)} (${esc(b.sigla)})</span><span class="op-d">${esc(b.cargo)}. Banca ${esc(b.banca)}, prova em ${dLonga(b.dataProva)}${b.dataProva >= t ? `, daqui a ${plural(diffD(t, b.dataProva), "dia", "dias")}` : ""}.</span></button>`).join("")}
      <label class="opcao" for="pdf-in"><span class="op-k">${I.arquivo}PDF do edital</span><span class="op-n">Ler o PDF</span><span class="op-d">O app lê o arquivo aqui no aparelho e separa disciplinas, assuntos e datas. Você confere antes de salvar.</span></label>
      <input type="file" id="pdf-in" accept="application/pdf,.pdf" data-on="pdf" hidden>
      <button class="opcao" data-act="ed-novo-mao"><span class="op-k">${I.lapis}À mão</span><span class="op-n">Cadastrar o edital</span><span class="op-d">Digite órgão, cargo e data da prova. Depois cole o conteúdo programático ou escolha as disciplinas.</span></button>
    </div>` });
}
Object.assign(ON, { "pdf": el => { const f = el.files && el.files[0]; el.value = ""; if (f) lerPdfEdital(f); } });
function colarConteudoSheet(cid, texto, novo) {
  const c = editalPorId(cid); if (!c) return;
  openSheet({ title: "Conteúdo programático", sub: nomeEdital(c), tall: true,
    body: `<p class="hint">Copie do edital a parte com as disciplinas e os assuntos do seu cargo e cole abaixo. O app separa as disciplinas e os assuntos, e você confere antes de salvar.</p>
      <textarea id="cc-txt" rows="12" placeholder="LÍNGUA PORTUGUESA: 1 Compreensão de textos. 2 Ortografia oficial. 3 Crase.&#10;DIREITO ADMINISTRATIVO: 1 Atos administrativos. 2 Licitações.">${esc(texto || "")}</textarea>`,
    foot: `<button class="btn ghost" data-no>${novo ? "Depois" : "Cancelar"}</button><button class="btn pri" data-ok>Separar disciplinas</button>`,
    onMount: s => {
      $("[data-no]", s).onclick = () => { if (novo) editalCriado(c, "Edital salvo. Adicione o conteúdo quando quiser."); else closeSheet(); };
      $("[data-ok]", s).onclick = async () => {
        const txt = $("#cc-txt", s).value; if (!txt.trim()) return toast("Cole o conteúdo do edital.");
        try { await carregarLeitor(); } catch { return toast("Sem internet para carregar o leitor. Tente de novo."); }
        const grupos = analisarEdital(txt);
        if (!grupos.length) return toast("Não encontrei disciplinas nesse texto. Confira se colou o conteúdo programático.");
        previaConteudo(cid, grupos, txt, novo);
      };
    } });
}
function previaConteudo(cid, grupos, texto, novo) {
  const c = editalPorId(cid); if (!c) return;
  const nA = sum(grupos.map(g => g.assuntos.length));
  const existe = n => DB.materias.find(m => chave(m.nome) === chave(n));
  openSheet({ title: "Confira antes de salvar", tall: true, wide: true, sub: `${plural(grupos.length, "disciplina", "disciplinas")} e ${plural(nA, "assunto", "assuntos")}`,
    body: `<p class="hint">Corrija os nomes, apague linhas que não são assuntos e desmarque o que não quiser. Disciplinas com o nome de uma que você já tem são juntadas a ela. Tudo pode ser editado depois.</p>
      ${grupos.map((g, i) => `<div class="pv"><label class="check"><input type="checkbox" id="pv-on-${i}" checked><span>Incluir${existe(g.nome) ? ` <small class="tag">Junta com a sua ${esc(existe(g.nome).nome)}</small>` : ""}</span></label>
        <label class="field"><span class="lbl">Disciplina</span><input type="text" id="pv-n-${i}" value="${esc(g.nome)}"></label>
        <label class="field"><span class="lbl">Assuntos, um por linha</span><textarea id="pv-t-${i}" rows="${Math.min(10, g.assuntos.length + 1)}">${esc(g.assuntos.join("\n"))}</textarea></label></div>`).join("")}`,
    foot: `<button class="btn ghost" data-no>Voltar ao texto</button><button class="btn pri" data-ok>Salvar conteúdo</button>`,
    onMount: s => {
      $("[data-no]", s).onclick = () => colarConteudoSheet(cid, texto, novo);
      $("[data-ok]", s).onclick = () => {
        const lista = [];
        grupos.forEach((g, i) => {
          if (!$("#pv-on-" + i, s).checked) return;
          const nome = $("#pv-n-" + i, s).value.trim(), tops = $("#pv-t-" + i, s).value.split("\n").map(x => x.trim()).filter(Boolean);
          if (nome && tops.length) lista.push({ nome, tops: tops.map(t => ({ nome: t })) });
        });
        if (!lista.length) return toast("Deixe pelo menos uma disciplina com assuntos.");
        const links = incorporar(lista); vincular(c, links);
        const n = sum(links.map(l => l.t.length));
        editalCriado(c, `${plural(links.length, "disciplina", "disciplinas")} e ${plural(n, "assunto", "assuntos")} no edital.`);
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
    openSheet({ title: "Não deu para ler o PDF", body: `<p class="lead">${esc(e && e.message === "senha" ? "Este PDF tem senha. Salve uma cópia sem senha e tente de novo." : e && e.message === "imagem" ? "Este PDF parece ser uma imagem digitalizada, sem texto que o app consiga ler." : "Confira a conexão com a internet e tente de novo, ou cadastre o edital à mão e cole o conteúdo.")}</p>`,
      foot: `<button class="btn pri" data-act="ed-novo-mao">Cadastrar à mão</button>` });
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
      <div class="field"><span class="lbl">Datas encontradas</span>${(r.datas || []).length ? `<ul class="rp-datas">${r.datas.map((d, i) => `<li><label class="check"><input type="checkbox" id="rp-d-${i}" ${d.on ? "checked" : ""}><span><b>${dataRot(d)}</b> ${esc(d.titulo)}</span></label>${d.trecho ? `<p class="hint">“${esc(d.trecho)}”</p>` : ""}</li>`).join("")}</ul>` : `<p class="hint">Nenhuma data encontrada. Adicione depois em Datas.</p>`}</div>
      <div class="field"><span class="lbl">Conteúdo programático</span>${(r.blocos || []).length ? `<ul class="rp-datas">${r.blocos.map((b, i) => `<li><label class="check"><input type="checkbox" id="rp-b-${i}" ${b.on ? "checked" : ""}><span><b>${esc(b.titulo)}</b>: ${plural(b.grupos.length, "disciplina", "disciplinas")}, ${plural(b.nA, "assunto", "assuntos")}</span></label></li>`).join("")}</ul><p class="hint">Marque os conhecimentos gerais e os do seu cargo.</p>` : `<p class="hint">Não encontrei o conteúdo programático. Depois de salvar, cole o conteúdo no edital.</p>`}</div>`,
    foot: `<button class="btn ghost" data-no>Cancelar</button><button class="btn pri" data-ok>Continuar</button>`,
    onMount: s => {
      $("[data-no]", s).onclick = () => closeSheet();
      $("[data-ok]", s).onclick = () => {
        const sel = $('input[name="rp-c"]:checked', s), cg = $("#rp-c", s).value.trim() || (sel ? cargos[+sel.value].nome : "");
        const org = $("#rp-o", s).value.trim();
        if (!org || !cg) return toast("Informe o órgão e o cargo.");
        const datas = (r.datas || []).filter((d, i) => $("#rp-d-" + i, s).checked).map(d => ({ id: "u" + uid(), tipo: TIPOS_DATA.some(x => x[0] === d.tipo) ? d.tipo : "outro", titulo: d.titulo, ini: d.ini, ...(d.fim ? { fim: d.fim } : {}) }));
        const pv = datas.find(d => d.tipo === "prova"), cs = sel ? cargos[+sel.value] : null;
        const c = { id: uid(), sigla: "", orgao: org, cargo: cg, banca: $("#rp-b", s).value.trim(), numero: $("#rp-n", s).value.trim(), taxa: $("#rp-tx", s).value.trim(), site: $("#rp-s", s).value.trim(),
          vagas: cs && cs.vagas ? cs.vagas + " vagas" : "", remuneracao: cs ? cs.rem || "" : "", dataProva: pv ? pv.ini : "", datas, status: "estudando", prova: provaVazia(), disc: [], criado: today() };
        DB.concursos.push(c); commit({ quiet: true });
        const blocos = (r.blocos || []).filter((b, i) => $("#rp-b-" + i, s).checked);
        if (blocos.length) previaConteudo(c.id, juntarGrupos(blocos), blocos.map(b => b.texto).join("\n\n"), true);
        else editalCriado(c, "Edital salvo. Cole o conteúdo programático em Conteúdo.");
      };
    } });
}

/* ================= DISCIPLINAS ================= */
VIEWS.disciplinas = r => {
  if (r && r.sub) return disciplinaPg(r.sub);
  const X = ix(), q = fold(UI.buscaD || "");
  const L = DB.materias.slice().sort((a, b) => fold(a.nome).localeCompare(fold(b.nome)))
    .filter(m => !q || fold(m.nome).includes(q) || (X.topsAll.get(m.id) || []).some(t => fold(t.nome).includes(q)));
  const card = m => {
    const tops = X.topsAll.get(m.id) || [], R = resumoEdital(tops), sm = X.stM.get(m.id), eds = DB.concursos.filter(c => c.disc.some(l => l.m === m.id));
    return `<li><button class="ed-card" data-go="disciplinas/${m.id}">
      <span class="ed-c-h"><b>${esc(m.nome)}</b></span>
      <span class="ed-c-i">${plural(tops.length, "assunto", "assuntos")}, ${R.teo} com a teoria concluída${sm && sm.s ? `. ${dur(sm.s)} estudadas` : ""}.</span>
      <span class="ed-c-t">${eds.length ? eds.map(c => `<span class="tag">${esc(nomeEdital(c))}</span>`).join("") : `<span class="tag mute">Fora dos editais</span>`}</span>
      ${tops.length ? barraMat(R) : ""}
    </button></li>`;
  };
  return `<div class="pg">
    ${cabecalho("Disciplinas", "Suas disciplinas e os assuntos de cada uma. Elas valem para todos os editais: o que você estuda num assunto conta em todos os que o cobram.",
      { acoes: DB.concursos.length ? "" : `<button class="btn ghost" data-act="conc-novo">Adicionar edital</button>`, criar: { rotulo: "Nova disciplina", attrs: 'data-act="mat-nova"' } })}
    ${DB.materias.length ? `<label class="busca">${I.busca}<input type="search" id="busca-disc" placeholder="Buscar disciplina ou assunto" value="${esc(UI.buscaD || "")}" autocomplete="off" aria-label="Buscar disciplina"></label>
      ${L.length ? `<ul class="cards">${L.map(card).join("")}</ul>` : vazio("Nada encontrado", "Tente outra palavra.")}`
      : vazio("Nenhuma disciplina cadastrada", "Crie as disciplinas que vai estudar e liste os assuntos de cada uma. Se tem o edital, adicione o edital: o app separa as disciplinas do conteúdo programático.")}
  </div>`;
};
VIEWS.disciplinas.after = () => {
  const i = $("#busca-disc");
  if (i) i.addEventListener("input", () => { UI.buscaD = i.value; clearTimeout(UI.bD); UI.bD = setTimeout(() => { const pos = i.selectionStart; render({ force: true }); const j = $("#busca-disc"); if (j) { j.focus(); try { j.setSelectionRange(pos, pos); } catch {} } }, 180); });
};
function disciplinaPg(id) {
  const X = ix(), m = X.matById.get(id);
  if (!m) return VIEWS.disciplinas({ sub: "" });
  const tops = X.topsAll.get(id) || [], R = resumoEdital(tops), sm = X.stM.get(id) || { s: 0, a: 0, e: 0 }, q = sm.a + sm.e;
  const eds = DB.concursos.filter(c => c.disc.some(l => l.m === id));
  const cobra = t => eds.filter(c => c.disc.find(l => l.m === id).t.includes(t.id));
  const marcas = t => { const em = cobra(t); if (!eds.length) return ""; if (!em.length) return `<span class="tag mute">Fora dos editais</span>`; return eds.length > 1 ? em.map(c => `<span class="tag">${esc(nomeEdital(c))}</span>`).join("") : ""; };
  return `<div class="pg">
    <p class="voltar"><button class="btn link sm" data-go="disciplinas">${I.chevL}Disciplinas</button></p>
    <header class="pg-h"><h1>${esc(m.nome)}</h1>
      <p class="lead">${eds.length ? `Cobrada em ${eds.map(c => `<button class="btn link" data-go="edital/${c.id}">${esc(nomeEdital(c))}</button>`).join(", ")}.` : DB.concursos.length ? "Fora dos editais. Ela entra no plano do dia só quando nenhum edital está em estudo." : "Entra no plano do dia com as suas outras disciplinas."}</p></header>
    ${tops.length ? `<section class="ed-res"><p><b>${R.teo} de ${R.n}</b> assuntos com a teoria concluída${R.est > R.teo ? ` e ${R.est - R.teo} em andamento` : ""}.${sm.s ? ` ${dur(sm.s)} estudadas${q ? `, ${pctTxt(pct(sm.a, q))} de acerto em ${q} questões` : ""}.` : ""}</p>
      <div class="trilha" aria-hidden="true"><span style="width:${R.pc}%"></span><span class="tr-b" style="width:${pct(R.est - R.teo, R.n)}%"></span></div></section>` : ""}
    <section class="bloco"><div class="b-hr"><h2 class="b-h">Assuntos</h2><button class="btn ghost sm" data-act="mat-editar" data-id="${id}">${I.lapis}Editar</button></div>
      ${tops.length ? `<ul class="tops">${tops.map(t => `<li><button class="top-row" data-act="topico" data-id="${t.id}">${glifo(t)}${nomeTop(t)}<span class="top-r">${revTxt(t)}${marcas(t)}</span></button></li>`).join("")}</ul>` : `<p class="hint">Nenhum assunto ainda. Toque em Editar e liste os assuntos, um por linha.</p>`}
    </section>
    <p class="centro"><button class="btn link sm danger" data-act="mat-excluir" data-id="${id}">${I.lixo}Excluir a disciplina</button></p>
  </div>`;
};
function materiaSheet(mid) {
  const X = ix(), m = mid ? X.matById.get(mid) : null, tops = m ? X.topsAll.get(m.id) || [] : [];
  const eds = DB.concursos, tem = c => !!m && c.disc.some(l => l.m === m.id);
  const ativos = eds.filter(c => c.status === "estudando");
  openSheet({ title: m ? "Editar disciplina" : "Nova disciplina", tall: true,
    body: `<label class="field"><span class="lbl">Nome</span><input type="text" id="ms-n" value="${esc(m ? m.nome : "")}" placeholder="Ex.: Direito Administrativo"></label>
      <label class="field"><span class="lbl">Assuntos, um por linha</span><textarea id="ms-t" rows="12" placeholder="Atos administrativos&#10;Licitações e contratos&#10;Improbidade administrativa">${esc(tops.map(t => t.nome).join("\n"))}</textarea></label>
      <p class="hint">${m ? "Corrigir o nome de um assunto mantém o histórico dele. Apagar uma linha tira o assunto da disciplina e dos editais." : "Copie a lista do edital ou do índice do seu material."}</p>
      ${eds.length ? `<div class="field"><span class="lbl">Cobrada nos editais</span>${eds.map(c => `<label class="check"><input type="checkbox" data-ed="${c.id}" ${tem(c) || (!m && ativos.length === 1 && ativos[0] === c) ? "checked" : ""}><span>${esc(nomeEdital(c))}${c.cargo ? ` <small>${esc(c.cargo)}</small>` : ""}</span></label>`).join("")}
        <p class="hint">Assuntos novos entram nos editais que já cobram a disciplina inteira. Questões, peso e assuntos de cada edital ficam no próprio edital.</p></div>` : ""}`,
    foot: `${m ? `<button class="btn ghost danger" data-del>${I.lixo}Excluir</button>` : ""}<button class="btn pri" data-ok>Salvar</button>`,
    onMount: s => {
      $("[data-ok]", s).onclick = () => {
        const nome = $("#ms-n", s).value.replace(/\s+/g, " ").trim(); if (!nome) return toast("Dê um nome à disciplina.");
        if (DB.materias.some(x => x !== m && fold(x.nome) === fold(nome))) return toast("Já existe uma disciplina com esse nome.");
        const linhas = $("#ms-t", s).value.split("\n").map(x => x.replace(/\s+/g, " ").trim()).filter(Boolean);
        if (!linhas.length) return toast("Liste pelo menos um assunto.");
        let mat = m;
        if (!mat) { mat = { id: uid(), nome }; DB.materias.push(mat); }
        mat.nome = nome;
        const antes = DB.topicos.filter(t => t.m === mat.id);
        const completos = new Set(DB.concursos.filter(c => { const l = c.disc.find(x => x.m === mat.id); return l && antes.every(t => l.t.includes(t.id)); }));
        const usados = new Set(), ids = [];
        linhas.forEach((ln, i) => {
          let t = antes.find(x => !usados.has(x.id) && fold(x.nome) === fold(ln)) || (antes[i] && !usados.has(antes[i].id) && !linhas.some(l => fold(l) === fold(antes[i].nome)) ? antes[i] : null);
          if (!t) { t = novoTopico(uid(), mat.id, ln, i); DB.topicos.push(t); }
          t.nome = ln; t.ord = i; usados.add(t.id); ids.push(t.id);
        });
        DB.topicos = DB.topicos.filter(t => t.m !== mat.id || usados.has(t.id));
        for (const c of DB.concursos) {
          const l = c.disc.find(x => x.m === mat.id); if (!l) continue;
          l.t = completos.has(c) ? ids.slice() : l.t.filter(id => usados.has(id));
        }
        for (const cb of $$("[data-ed]", s)) {
          const c = editalPorId(cb.dataset.ed), l = c && c.disc.find(x => x.m === mat.id); if (!c) continue;
          if (cb.checked && !l) c.disc.push({ m: mat.id, g: "", q: 0, valor: 1, t: ids.slice() });
          if (!cb.checked && l) c.disc = c.disc.filter(x => x !== l);
        }
        commit(); closeSheet(); toast("Disciplina salva.");
        if (!m) go("disciplinas/" + mat.id);
      };
      const d = $("[data-del]", s); if (d) d.onclick = () => { closeSheet(true); excluirDisciplina(m.id); };
    } });
}
function excluirDisciplina(id) {
  const m = ix().matById.get(id); if (!m) return;
  const eds = DB.concursos.filter(c => c.disc.some(l => l.m === id));
  confirmSheet("Excluir a disciplina?", `${esc(m.nome)} e seus assuntos saem do app${eds.length ? ` e de ${eds.length === 1 ? "um edital" : eds.length + " editais"}` : ""}. As sessões já registradas continuam no histórico.`, "Excluir", () => {
    DB.materias = DB.materias.filter(x => x.id !== id); DB.topicos = DB.topicos.filter(t => t.m !== id);
    for (const c of DB.concursos) c.disc = c.disc.filter(l => l.m !== id);
    commit({ quiet: true }); go("disciplinas", true); toast("Disciplina excluída.");
  });
}
Object.assign(ACT, {
  "mat-editar": el => materiaSheet(el.dataset.id),
  "mat-nova": () => materiaSheet(null),
  "mat-excluir": el => excluirDisciplina(el.dataset.id)
});

/* ================= início ================= */
(function boot() {
  aplicarTema();
  try { history.scrollRestoration = "manual"; } catch {}
  const linkToken = SY.tokenDoLink();
  if (linkToken) history.replaceState({ d: 0 }, "", "#/ajustes");
  if (!location.hash) history.replaceState({ d: 0 }, "", "#/hoje");
  else if (!history.state) history.replaceState({ d: 0 }, "", location.hash);
  document.getElementById("marca").innerHTML = MARCA;
  document.getElementById("rail-marca").innerHTML = MARCA;
  if (DB.ativa) UI.focoAberto = true;
  render({ top: true });
  SY.iniciar({ token: linkToken, silencioso: true, textoConfirmar: "Os dados deste aparelho se juntam aos da nuvem. Os ajustes passam a ser os da nuvem." });
  let ultimoDia = today();
  setInterval(() => { if (today() !== ultimoDia) { ultimoDia = today(); VER++; agendarRender(); } }, 60000);
  if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
})();
