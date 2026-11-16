/* Estudo Fácil 1.0 · testes do app (npm test). Rodam num Chromium (ou no Google Chrome instalado), sem internet:
   o GitHub (sincronização) é simulado por comum/testes/ambiente.mjs. O dia é fixado com ?hoje=AAAA-MM-DD.
   O guia inteiro fica em tests/guia.test.mjs e a varredura de acessibilidade, em tests/acessibilidade.test.mjs. */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { preparar, aparelho, githubFalso, semRolagemLateral, conferirTopo, conferirNavAjustes, guiasAjustes, GUIAS_COMUNS, TOKEN_TESTE, RAIZ, semCampoEmFoco } from '../comum/testes/ambiente.mjs';

let amb, versao;
before(async () => { amb = await preparar(); versao = JSON.parse(await readFile(RAIZ + '/package.json', 'utf8')).version; });
after(async () => { await amb?.encerrar(); });
const esperar = async (cond, ms = 8000) => { const fim = Date.now() + ms; while (Date.now() < fim) { if (await cond()) return true; await new Promise(r => setTimeout(r, 50)); } return false; };
const HOJE = '2026-11-16'; // uma segunda-feira
const abrir = (o = {}) => aparelho(amb, { caminho: '?hoje=' + HOJE, ...o });
const TELAS = [[{ width: 320, height: 568 }, 'celular mínimo (zoom 400%)'], [{ width: 360, height: 740 }, 'celular pequeno'], [{ width: 390, height: 844 }, 'celular'], [{ width: 820, height: 1180 }, 'tablet'], [{ width: 1440, height: 900 }, 'computador']];
const nav = (p, id) => p.locator(`#kf-nav-${id}:visible, #kf-trilho-${id}:visible`).first().click();
const semJanela = p => p.locator('.kf-dlg').first().waitFor({ state: 'detached' }).catch(() => {});
/* estuda um assunto pelas funções do app (sem passar pela tela) */
const estudar = (p, o) => p.evaluate(o => { const t = topicosDe(o.m || 'anpd-lgpd')[o.i || 0]; const r = registrarSessao({ t: t.id, tipo: o.tipo || 'teoria', seg: (o.min || 30) * 60, ac: o.ac || 0, er: o.er || 0, teoria: o.teoria !== false, conf: o.conf || 2, dia: o.dia || hojeISO(), ini: o.dia ? deISO(o.dia).getTime() + 9 * 36e5 : agora() }); salvar(); jogoConferir({ silencioso: true }); return { teoria: r.teoria, revisoes: r.revisoes, dia: r.dia, revisao: r.revisao }; }, o);

test('abre sem erros em celular, tablet e computador, sem rolagem lateral, com o plano da ANPD de fábrica', async () => {
  for (const [viewport, nome] of TELAS) {
    const a = await abrir({ viewport });
    await a.page.locator('#view .hoje-folha').waitFor();
    assert.equal(await a.page.getAttribute('html', 'lang'), 'pt-BR');
    assert.equal(await a.page.evaluate(() => VERSAO), versao);
    assert.ok(await semRolagemLateral(a.page), `rolagem lateral em ${nome}`);
    const topo = await conferirTopo(a.page); assert.deepEqual(topo.erros, [], `barra de cima em ${nome}`);
    const navAj = await conferirNavAjustes(a.page); assert.deepEqual(navAj.erros, [], `navegação em ${nome}`);
    for (const t of ['plano', 'evolucao', 'mais']) { await nav(a.page, t); await a.page.waitForTimeout(150); assert.ok(await semRolagemLateral(a.page), `rolagem lateral em ${t}, ${nome}`); }
    assert.deepEqual(a.erros, [], `erros no console em ${nome}`);
    await a.fechar();
  }
  const a = await abrir();
  const d = await a.page.evaluate(() => ({ c: DB.concursos.map(c => [c.id, c.situacao, c.previsto, c.disc.length]), m: DB.materias.length, t: DB.topicos.length, v: DB.v }));
  assert.deepEqual(d, { c: [['anpd-2027', 'ativo', true, 12]], m: 12, t: 119, v: 3 });
  await a.fechar();
});

test('edital da ANPD: itens somam as áreas, pesos somam 100% e os fatos trazem a data de conferência', async () => {
  const a = await abrir();
  const r = await a.page.evaluate(() => { const c = DB.concursos[0], F = fatias(c, { fase: false }), F1 = fatias(c);
    return { g: c.prova.grupos.map(g => [g.q, c.disc.filter(d => d.grupo === g.id).reduce((x, d) => x + d.q, 0)]), soma: Math.round([...F.values()].reduce((x, y) => x + y, 0) * 1000), lgpd: F.get('anpd-lgpd'), lgpdFase1: F1.get('anpd-lgpd'), fase: faseAtual(c).id, conferido: EDITAL_ANPD.conferido, fontes: EDITAL_ANPD.fontes.every(f => /^https:\/\/(www\.planalto\.gov\.br|www2\.camara\.leg\.br|www\.gov\.br)\//.test(f[1])) }; });
  assert.deepEqual(r.g, [[50, 50], [70, 70]]);
  assert.equal(r.soma, 1000);
  assert.ok(r.lgpd > 0.18 && r.lgpd < 0.2, 'LGPD vale 36 dos 190 pontos estimados');
  assert.ok(r.lgpdFase1 > r.lgpd, 'antes do edital, a LGPD pesa mais no plano');
  assert.equal(r.fase, 'f1'); assert.equal(r.conferido, '2026-11-15'); assert.ok(r.fontes, 'fontes só de sites oficiais');
  await a.fechar();
});

test('plano do dia: dois blocos de 30 min, o primeiro de LGPD; revisões vencidas vêm antes', async () => {
  const a = await abrir(), p = a.page;
  let pl = await p.evaluate(() => planoDoDia().itens.map(i => [i.tipo, i.m, i.min]));
  assert.equal(pl.length, 2); assert.deepEqual(pl[0], ['teoria', 'anpd-lgpd', 30]); assert.notEqual(pl[1][1], 'anpd-lgpd');
  await estudar(p, { dia: '2026-11-15', min: 40 });
  pl = await p.evaluate(() => planoDoDia().itens.map(i => [i.tipo, i.t]));
  assert.equal(pl[0][0], 'revisao', 'a revisão de 1 dia abre o plano de hoje');
  assert.equal(pl[0][1], 'anpd-lgpd-01');
  await p.locator('#view .plano-hoje .pl-item').first().waitFor();
  assert.match(await p.locator('#view .plano-hoje').innerText(), /Revisão/);
  await a.fechar();
});

test('sessão de estudo pela tela: foco, acertos, teoria concluída, festa, revisões em 1, 7 e 30 dias e pontos', async () => {
  const a = await abrir(), p = a.page;
  await p.click('#hoje-estudar'); await p.locator('#es-ok').waitFor();
  assert.ok(await semCampoEmFoco(p), 'a janela de Estudar abriu com um campo em foco');
  assert.match(await p.locator('.kf-dlg .sugestao').innerText(), /Aplicação da lei/);
  await p.click('#es-ok'); await p.locator('#foco.dentro').waitFor();
  assert.equal(await p.evaluate(() => !!DB.ativa && focoAberto()), true);
  for (let i = 0; i < 4; i++) await p.click('#foco [data-q="ac"][data-d="1"]');
  await p.click('#foco [data-q="er"][data-d="1"]');
  // recolhe o foco: a sessão continua, com a barra acima da navegação
  await p.click('#foco-min'); await p.locator('#sessao-barra').waitFor();
  await p.click('#sessao-barra'); await p.locator('#foco.dentro').waitFor();
  await p.evaluate(() => { DB.ativa.acum = 61 * 60; DB.ativa.tocou = true; focoPintar(); });
  assert.match(await p.locator('#foco-alvo').innerText(), /tempo cumprido/);
  await p.click('#foco-fim'); await p.locator('#fs-ok').waitFor();
  assert.ok(await semCampoEmFoco(p), 'a janela de fechar a sessão abriu com um campo em foco');
  assert.equal(await p.inputValue('#fs-ac'), '4'); assert.equal(await p.inputValue('#fs-er'), '1');
  await p.click('#fs-teoria'); await p.click('#fs-ok');
  await p.locator('#festa-ok').waitFor();
  assert.match(await p.locator('#festa-t').innerText(), /Meta do dia batida/);
  await p.click('#festa-ok'); await p.locator('.festa').waitFor({ state: 'detached' });
  const r = await p.evaluate(() => ({ s: DB.sessoes.map(s => [s.t, s.tipo, Math.round(s.seg / 60), s.ac, s.er]), teoria: !!topico('anpd-lgpd-01').teoria, rev: DB.revisoes.map(r => r.due), dia: DB.dias.map(d => d.id), seq: sequencia().n, ativa: DB.ativa, dom: dominio(topico('anpd-lgpd-01')), pts: pontosBase(), ganhas: jogoEstado().ganhas }));
  assert.deepEqual(r.s, [['anpd-lgpd-01', 'teoria', 61, 4, 1]]);
  assert.ok(r.teoria); assert.deepEqual(r.rev, ['2026-11-17', '2026-11-23', '2026-12-16']);
  assert.deepEqual(r.dia, [HOJE]); assert.equal(r.seq, 1); assert.equal(r.ativa, null); assert.equal(r.dom, 2);
  assert.equal(r.pts, 61 + 5 + 4 + 25 + 30, 'minutos, questões, acertos, assunto e dia');
  for (const m of ['primeira', 'dia1', 'grifo']) assert.ok(r.ganhas.includes(m), 'medalha ' + m);
  assert.match(await p.locator('#view .hf-estado').innerText(), /Meta batida/);
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('sequência: dias seguidos, folga que salva um dia, descanso que não quebra e recorde', async () => {
  const a = await abrir(), p = a.page;
  const seq = dias => p.evaluate(dias => { DB.dias = dias.map(id => ({ id, min: 60 })); VER++; const s = sequencia(); return [s.n, s.folgas, [...s.protegidos], s.recorde, s.hojeFeito]; }, dias);
  assert.deepEqual(await seq(['2026-11-13', '2026-11-14', '2026-11-15']), [3, 1, [], 3, false], 'três dias até ontem');
  assert.deepEqual(await seq(['2026-11-13', '2026-11-14', '2026-11-15', '2026-11-16']), [4, 1, [], 4, true]);
  assert.deepEqual(await seq(['2026-11-12', '2026-11-13', '2026-11-15']), [3, 0, ['2026-11-14'], 3, false], 'a folga salva o dia 14');
  assert.deepEqual(await seq(['2026-11-10', '2026-11-11', '2026-11-14', '2026-11-15']), [2, 0, ['2026-11-12'], 2, false], 'dois dias sem estudo: só uma folga, a sequência recomeça');
  const dez = Array.from({ length: 10 }, (_, i) => '2026-11-' + String(6 + i).padStart(2, '0'));
  assert.deepEqual((await seq(dez)).slice(0, 2), [10, 2], 'depois de 7 dias seguidos, guarda mais uma folga');
  await p.evaluate(() => { cfg().dias = [1, 2, 3, 4, 5, 6]; });
  assert.deepEqual(await seq(['2026-11-13', '2026-11-14']), [2, 1, [], 2, false], 'domingo de descanso não quebra nem gasta folga');
  await a.fechar();
});

test('domínio do assunto, prontidão e missões do dia', async () => {
  const a = await abrir(), p = a.page;
  const dom = () => p.evaluate(() => dominio(topico('anpd-lgpd-01')));
  assert.equal(await dom(), 0);
  await estudar(p, { teoria: false, min: 10, dia: '2026-11-10' }); assert.equal(await dom(), 1);
  await estudar(p, { min: 20, dia: '2026-11-11' }); assert.equal(await dom(), 2);
  await estudar(p, { tipo: 'revisao', min: 10, ac: 8, er: 2, dia: '2026-11-12' }); assert.equal(await dom(), 3);
  await estudar(p, { tipo: 'revisao', min: 10, ac: 9, er: 1, dia: '2026-11-18'.replace('18', '15') }); assert.equal(await dom(), 4, 'duas revisões e 20 questões com 85% de acertos');
  const pr = await p.evaluate(() => [prontidao(DB.concursos[0]), prontidao(DB.concursos[0], deISO('2026-11-10').getTime())]);
  assert.equal(pr[0], 1, 'um assunto dominado de 19 da LGPD, que vale 18,9% da prova'); assert.equal(pr[1], 0);
  const m0 = await p.evaluate(() => missoes().lista.map(m => [m.id, m.ok]));
  assert.deepEqual(m0.map(m => m[0]), ['tempo', 'questoes', 'variar'], 'sem revisão para hoje, a terceira missão é variar de disciplina');
  await estudar(p, { i: 1, min: 55, ac: 12, er: 3 }); await estudar(p, { m: 'anpd-da', min: 10 });
  assert.deepEqual(await p.evaluate(() => missoes('2026-11-17').lista.map(m => m.id)), ['tempo', 'questoes', 'revisoes'], 'amanhã há revisões: a missão muda');
  const fez = await p.evaluate(() => [missoes().perfeito, temMarco('p:' + hojeISO()), jogoEstado().ganhas.includes('perfeito')]);
  assert.deepEqual(fez, [true, true, true], 'dia perfeito');
  await a.fechar();
});

test('revisão difícil volta em 2 dias; lançar estudo feito em dia passado; desmarcar a teoria tem Desfazer', async () => {
  const a = await abrir(), p = a.page;
  await estudar(p, { dia: '2026-11-15' });
  const r1 = await estudar(p, { tipo: 'revisao', conf: 1, min: 10 });
  assert.equal(r1.revisao, true);
  assert.deepEqual(await p.evaluate(() => DB.revisoes.filter(r => !r.feita).map(r => r.due).sort()), ['2026-11-18', '2026-11-22', '2026-12-15']);
  // lançar estudo feito, pela tela
  await p.click('#hoje-estudar'); await p.click('#es-lancar'); await p.locator('#le-ok').waitFor();
  assert.ok(await semCampoEmFoco(p));
  await p.evaluate(() => { const d = document.querySelector('#le-dia'); d.value = '2026-11-14'; });
  await p.fill('#fs-min', '45'); await p.fill('#fs-ac', '7'); await p.fill('#fs-er', '3');
  await p.click('#le-ok'); await semJanela(p);
  const s = await p.evaluate(() => DB.sessoes.filter(x => x.manual).map(x => [x.dia, x.seg, x.ac, x.er]));
  assert.deepEqual(s, [['2026-11-14', 2700, 7, 3]]);
  // ficha do assunto: desmarcar a teoria e desfazer
  await nav(p, 'plano'); await p.click('[data-disc="anpd-lgpd"] summary'); await p.click('[data-act="assunto"][data-id="anpd-lgpd-01"]');
  await p.locator('#af-teoria').waitFor(); assert.match(await p.locator('#af-teoria').innerText(), /Desmarcar/);
  await p.click('#af-teoria'); await semJanela(p);
  assert.equal(await p.evaluate(() => !!topico('anpd-lgpd-01').teoria), false);
  await p.locator('.kf-toast button', { hasText: 'Desfazer' }).click();
  assert.equal(await p.evaluate(() => !!topico('anpd-lgpd-01').teoria && DB.revisoes.filter(r => !r.feita).length === 3), true);
  assert.equal(await p.locator('[data-disc="anpd-lgpd"]').evaluate(d => d.open), true, 'a disciplina continua aberta depois de redesenhar');
  await a.fechar();
});

test('concursos: ABDI com perfil, concurso digitado com o conteúdo colado, edital publicado e exclusão', async () => {
  const a = await abrir(), p = a.page;
  await p.evaluate(() => irPara('concursos')); await p.click('#conc-novo');
  await p.locator('.kf-dlg [data-bib="abdi-2026"]').click();
  await p.locator('.kf-dlg [data-p="jur"]').click(); await p.locator('#view .tela-t', { hasText: 'ABDI' }).waitFor();
  const abdi = await p.evaluate(() => { const c = DB.concursos.find(x => x.id === 'abdi-2026'); return [c.perfil, c.previsto, c.disc.filter(d => d.grupo === 'esp').length > 0, Math.round(c.disc.filter(d => d.grupo === 'esp').reduce((x, d) => x + d.q, 0)), DB.materias.filter(m => m.nome === 'Língua Portuguesa').length]; });
  assert.deepEqual(abdi, ['jur', false, true, 20, 1], 'Língua Portuguesa é uma disciplina só, dos dois concursos');
  // digitado
  await p.evaluate(() => irPara('concursos')); await p.click('#conc-novo'); await p.locator('.kf-dlg [data-bib=""]').click(); await p.locator('#dc-ok').waitFor();
  assert.ok(await semCampoEmFoco(p));
  await p.click('#dc-ok'); assert.equal(await p.getAttribute('#dc-sigla', 'aria-invalid'), 'true', 'campo que falta é apontado');
  await p.fill('#dc-sigla', 'ANATEL 2027'); await p.fill('#dc-txt', 'Regulação de telecomunicações:\n1. Lei Geral de Telecomunicações;\n- Serviços e outorgas.\n\n# Estatística\nMédia e mediana');
  await p.click('#dc-ok'); await p.locator('#view .tela-t', { hasText: 'ANATEL 2027' }).waitFor();
  const novo = await p.evaluate(() => { const c = DB.concursos.find(x => x.sigla === 'ANATEL 2027'); return c.disc.map(d => [materia(d.m).nome, d.topicos.map(t => topico(t).nome)]); });
  assert.deepEqual(novo, [['Regulação de telecomunicações', ['Lei Geral de Telecomunicações', 'Serviços e outorgas']], ['Estatística', ['Média e mediana']]]);
  // edital publicado, com Desfazer; excluir o concurso
  await p.evaluate(() => { concId = 'anpd-2027'; irPara('concurso'); }); await p.click('[data-act="edital-saiu"]');
  assert.equal(await p.evaluate(() => DB.concursos.find(c => c.id === 'anpd-2027').previsto), false);
  await p.click('[data-act="excluir-concurso"]'); await p.locator('.kf-dlg [data-kf-ok]').click();
  assert.equal(await p.evaluate(() => DB.concursos.some(c => c.id === 'anpd-2027') || DB.materias.length < 12), false, 'o concurso sai; as disciplinas ficam');
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('disciplinas, simulados e agenda: criar, ordenar e excluir', async () => {
  const a = await abrir(), p = a.page;
  await p.evaluate(() => irPara('disciplinas')); await p.click('[data-act="nova-disc"]'); await p.locator('#nj').waitFor(); assert.ok(await semCampoEmFoco(p));
  await p.fill('#nj', 'Raciocínio lógico'); await p.click('#nj-ok'); await p.locator('#view .tela-t', { hasText: 'Raciocínio lógico' }).waitFor();
  for (const n of ['Proposições', 'Conjuntos']) { await p.click('[data-act="novo-assunto"]'); await p.fill('#nj', n); await p.click('#nj-ok'); await semJanela(p); }
  await p.locator('#view [data-act="editar-assunto"]').nth(1).click(); await p.click('#ea-sobe'); await semJanela(p);
  assert.deepEqual(await p.evaluate(() => topicosDe(discId).map(t => t.nome)), ['Conjuntos', 'Proposições']);
  await p.click('[data-act="excluir-disc"]'); await p.locator('.kf-dlg [data-kf-ok]').click();
  assert.equal(await p.evaluate(() => DB.materias.some(m => m.nome === 'Raciocínio lógico') || DB.topicos.some(t => t.nome === 'Conjuntos')), false);
  // simulado: nota pela regra da prova (gerais valem 1, específicos valem 2)
  await p.evaluate(() => irPara('simulados')); await p.click('[data-act="novo-simulado"]'); await p.locator('#si-ok').waitFor();
  await p.fill('#si-a0', '30'); await p.fill('#si-t0', '50'); await p.fill('#si-a1', '49'); await p.fill('#si-t1', '70'); await p.click('#si-ok'); await semJanela(p);
  assert.deepEqual(await p.evaluate(() => { const n = notaSimulado(DB.simulados[0]); return [n.pts, n.max, n.pct, n.passou]; }), [128, 190, 67, true]);
  assert.match(await p.locator('#view .lin-valor').innerText(), /67%/);
  // agenda
  await p.evaluate(() => irPara('agenda')); assert.match(await p.locator('#view').innerText(), /Prazo previsto pela ANPD/);
  await p.click('[data-act="novo-evento"]'); await p.fill('#ev-t', 'Aula de LGPD'); await p.click('#ev-ok'); await semJanela(p);
  assert.deepEqual(await p.evaluate(() => DB.eventos.map(e => [e.titulo, e.data])), [['Aula de LGPD', HOJE.replace('16', '16')]]);
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('Ajustes: as oito guias comuns, as três do app, meta e nome (com a primeira medalha)', async () => {
  const a = await abrir(), p = a.page;
  await nav(p, 'mais'); await p.click('#view [data-kf="ajustes"]'); await p.locator('.kf-aj-h').waitFor();
  const g = await guiasAjustes(p);
  assert.deepEqual(g.comuns, GUIAS_COMUNS); assert.deepEqual(g.produto, ['Rotina e metas', 'Revisões', 'Medalhas e apresentação']);
  await p.click('.kf-aj-lista [data-kf-aj-ir="rotina"]'); await p.locator('#aj-meta').waitFor();
  await p.fill('#aj-meta', '90'); await p.locator('#aj-meta').dispatchEvent('change');
  await p.click('[data-dia="0"]');
  assert.deepEqual(await p.evaluate(() => [cfg().metaMin, cfg().dias]), [90, [1, 2, 3, 4, 5, 6]]);
  await p.evaluate(() => KitFacil.ajustes.ir('conta')); await p.locator('#aj-nome').waitFor();
  await p.fill('#aj-nome', 'Bruno'); await p.click('#aj-nome-f button[type=submit]');
  await p.locator('.kf-dlg .mn-nome', { hasText: 'Prazer em conhecer' }).waitFor();
  assert.equal(await p.evaluate(() => cfg().nome), 'Bruno');
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('segurança: texto de fora é protegido antes de ir para a tela', async () => {
  const a = await abrir(), p = a.page;
  await p.evaluate(() => { const x = '<img src=x onerror="window.__xss=1"><b id="inj">oi</b>'; cfg().nome = x; DB.materias[0].nome = x; DB.topicos[0].nome = x; DB.concursos[0].sigla = x; DB.concursos[0].cargo = x; DB.eventos.push({ id: 'e1', titulo: x, data: hojeISO(), hora: '' }); DB.simulados.push({ id: 's1', c: DB.concursos[0].id, nome: x, data: hojeISO(), r: {} }); registrarSessao({ t: DB.topicos[0].id, seg: 600, teoria: true }); salvar(); jogoConferir({ silencioso: true }); });
  for (const t of ['hoje', 'plano', 'evolucao', 'mais', 'concursos', 'concurso', 'disciplinas', 'disciplina', 'revisoes', 'simulados', 'agenda', 'ajustes']) {
    await p.evaluate(t => { concId = DB.concursos[0].id; discId = DB.materias[0].id; irPara(t); }, t); await p.waitForTimeout(120);
    if (t === 'plano') { await p.locator('#view details.disc summary').first().click(); await p.locator('#view [data-act="assunto"]').first().click(); await p.waitForTimeout(200); await p.keyboard.press('Escape'); }
    assert.equal(await p.evaluate(() => !!document.querySelector('#inj') || !!window.__xss), false, 'HTML injetado em ' + t);
  }
  await p.evaluate(() => irPara('hoje')); await p.click('#hoje-estudar'); await p.waitForTimeout(300);
  assert.equal(await p.evaluate(() => !!document.querySelector('#inj') || !!window.__xss), false, 'HTML injetado na janela de Estudar');
  assert.match(await p.evaluate(() => document.querySelector('meta[http-equiv="Content-Security-Policy"]').content), /object-src 'none'/);
  await a.fechar();
});

test('quem vem do formato antigo começa de novo, e a cópia antiga fica guardada; restaurar padrões usa o prefixo do app', async () => {
  const a = await abrir({ antes: () => { if (!localStorage.getItem('estudofacil.db')) localStorage.setItem('estudofacil.db', JSON.stringify({ v: 2, materias: [{ id: 'x', nome: 'Antiga' }], topicos: [], concursos: [], sessoes: [{ id: 's' }], cfg: {} })); } });
  const r = await a.page.evaluate(() => ({ v: DB.v, m: DB.materias.some(m => m.nome === 'Antiga'), antigo: JSON.parse(localStorage.getItem('estudofacil.db_antigo')).v, chaves: Object.keys(localStorage).filter(k => !k.startsWith('estudofacil.') && !k.startsWith('kitfacil.')) }));
  assert.deepEqual(r, { v: 3, m: false, antigo: 2, chaves: [] });
  await a.fechar();
});

test('cópia de segurança: baixa no formato da família e restaura', async () => {
  const a = await abrir(), p = a.page;
  await estudar(p, {});
  await nav(p, 'mais'); await p.click('#view [data-kf="ajustes"]'); await p.click('.kf-aj-lista [data-kf-aj-ir="sincronizacao"]');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('[data-kf="copia-baixar"]')]);
  const caminho = await dl.path(), copia = JSON.parse(await readFile(caminho, 'utf8'));
  assert.equal(copia.formato, 'copia-facil'); assert.equal(copia.app, 'estudo-facil'); assert.equal(copia.dados.v, 3); assert.equal(copia.dados.sessoes.length, 1);
  await p.evaluate(() => { DB.sessoes = []; salvar(); });
  const [seletor] = await Promise.all([p.waitForEvent('filechooser'), p.click('[data-kf="copia-restaurar"]')]);
  await seletor.setFiles(caminho); await p.locator('.kf-dlg [data-kf-ok]').click();
  assert.ok(await esperar(() => p.evaluate(() => DB.sessoes.length === 1)), 'a cópia não foi restaurada');
  await a.fechar();
});

test('sincronização: o outro aparelho recebe sessões e medalhas; a exclusão também viaja; o gist vai criptografado', async () => {
  const gh = githubFalso(), A = await abrir({ github: gh }), B = await abrir({ github: gh });
  const ligar = async p => { await p.click('[data-kf-nuvem]'); await p.click('.kf-dlg [data-kf="sync-ativar"]'); await p.fill('#kf-token', TOKEN_TESTE); await p.click('[data-kf-conectar]'); };
  await estudar(A.page, { min: 61, ac: 4, er: 1 }); await A.page.evaluate(() => { cfg().nome = 'Bruno'; salvar(); jogoConferir({ silencioso: true }); });
  await ligar(A.page);
  assert.ok(await esperar(() => A.page.evaluate(() => SY.ligada() && SY.estado.lastSync > 0)), 'A não sincronizou');
  assert.ok(await esperar(async () => (await A.page.getAttribute('[data-kf-nuvem]', 'data-estado')) === 'sincronizado'), 'a nuvem não mostra Sincronizado');
  const arq = gh.arquivo('estudo-facil.json'); assert.ok(arq && !/anpd-lgpd/.test(arq.conteudo), 'o gist deveria estar criptografado');
  await ligar(B.page);
  assert.ok(await esperar(() => B.page.evaluate(() => DB.sessoes.length === 1 && cfg().nome === 'Bruno' && DB.dias.length === 1 && temMarco('m:primeira'))), 'B não recebeu sessões, dias e medalhas');
  assert.equal(await B.page.evaluate(() => DB.concursos.length + ':' + DB.materias.length + ':' + DB.topicos.length), '1:12:119', 'nada duplicado ao juntar');
  // B exclui a sessão; A recebe a exclusão e não regrava à toa
  await B.page.evaluate(() => { DB.sessoes = []; salvar(); return SY.agora({ quiet: true }); });
  await A.page.evaluate(() => SY.agora({ quiet: true }));
  assert.ok(await esperar(() => A.page.evaluate(() => DB.sessoes.length === 0)), 'a exclusão não chegou ao A');
  assert.deepEqual(A.erros.concat(B.erros), []);
  await A.fechar(); await B.fechar();
});

test('abertura: quatro telas, uma vez só; quem diz o nome ganha a primeira medalha', async () => {
  const a = await abrir({ antes: () => { window.EF_TESTE_ABERTURA = true; } }), p = a.page;
  await p.locator('.kf-abertura').waitFor();
  assert.equal(await p.locator('.kf-ab-pontos i').count(), 4);
  await p.click('#kf-ab-prox'); await p.click('[data-ab-as="1"]'); assert.match(await p.locator('.ab-demo-r').innerText(), /50%/);
  await p.click('#kf-ab-prox'); await p.click('#kf-ab-prox'); await p.locator('#ab-eu').waitFor();
  assert.equal(await p.locator('#kf-ab-pular').isVisible(), false, 'a última tela não tem Pular');
  assert.ok(await semCampoEmFoco(p)); await p.fill('#ab-eu', 'Bruno'); await p.click('#kf-ab-prox');
  await p.locator('.kf-dlg .mn-nome', { hasText: 'Prazer em conhecer' }).waitFor();
  assert.equal(await p.evaluate(() => cfg().nome + ':' + KitFacil.abertura.vista()), 'Bruno:true');
  await p.reload(); await p.locator('#view .hoje-folha').waitFor();
  assert.equal(await p.locator('.kf-abertura').count(), 0, 'a abertura não volta sozinha');
  assert.match(await p.locator('#view .tela-sub').innerText(), /Bruno/);
  await a.fechar();
});

test('medalha em 3D: gira com o dedo e com as setas; com movimento reduzido fica parada', async () => {
  const a = await abrir(), p = a.page;
  await p.emulateMedia({ reducedMotion: 'reduce' });
  await estudar(p, {}); await p.evaluate(() => { evoAba = 'medalhas'; irPara('evolucao'); });
  await p.click('[data-act="medalha"][data-id="primeira"]'); await p.locator('.kf-dlg .med3d').waitFor();
  const viva = await p.evaluate(() => document.querySelector('.kf-dlg .med3d').classList.contains('med3d-viva'));
  if (viva) {
    const a0 = await p.getAttribute('.kf-dlg .med3d', 'data-ang'); await p.waitForTimeout(400);
    assert.equal(await p.getAttribute('.kf-dlg .med3d', 'data-ang'), a0, 'com movimento reduzido a medalha não gira sozinha');
    await p.focus('.kf-dlg .med3d'); await p.keyboard.press('ArrowRight');
    assert.notEqual(await p.getAttribute('.kf-dlg .med3d', 'data-ang'), a0, 'as setas giram a medalha');
  } else assert.ok(await p.locator('.kf-dlg .med3d .med-svg').isVisible(), 'sem WebGL, fica a medalha desenhada');
  assert.match(await p.getAttribute('.kf-dlg .med3d', 'aria-label'), /Medalha Primeira página/);
  await a.fechar();
});
