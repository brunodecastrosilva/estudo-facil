/* Estudo Fácil 1.2 · testes do app (npm test). Rodam num Chromium (ou no Google Chrome instalado), sem internet:
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
    for (const t of ['plano', 'medalhas', 'mais']) { await nav(a.page, t); await a.page.waitForTimeout(150); assert.ok(await semRolagemLateral(a.page), `rolagem lateral em ${t}, ${nome}`); }
    for (const t of ['evolucao', 'instrutor', 'provas', 'prova', 'discursivas', 'discursiva']) { await a.page.evaluate(t => { provaId = 'dataprev23-seg'; redId = 'antt24-sandbox'; irPara(t); }, t); await a.page.waitForTimeout(150); assert.ok(await semRolagemLateral(a.page), `rolagem lateral em ${t}, ${nome}`); }
    await a.page.evaluate(() => treinoAbrir({ t: 'anpd-lgpd-01' })); await a.page.locator('#treino.dentro').waitFor(); await a.page.click('#treino [data-resp="E"]'); await a.page.locator('#tr-prox').waitFor();
    assert.ok(await a.page.evaluate(() => { const e = document.querySelector('#treino'); return e.scrollWidth <= e.clientWidth + 1; }), `rolagem lateral no treino, ${nome}`); await a.page.keyboard.press('Escape'); await a.page.locator('#festa-ok').click();
    assert.deepEqual(a.erros, [], `erros no console em ${nome}`);
    await a.fechar();
  }
  const a = await abrir();
  const d = await a.page.evaluate(() => ({ c: DB.concursos.map(c => [c.id, c.situacao, c.previsto, c.disc.length, c.banca]), m: DB.materias.length, t: DB.topicos.length, v: DB.v, bib: BIBLIOTECA.map(e => e.id), robos: document.querySelector('meta[name="robots"]').content }));
  assert.deepEqual(d, { c: [['anpd-2027', 'ativo', true, 12, 'Cebraspe']], m: 12, t: 119, v: 3, bib: ['anpd-2027'], robos: 'noindex, nofollow' }, 'teste fechado: só a ANPD, banca Cebraspe, fora dos buscadores');
  // quem já tinha o plano de fábrica com a banca a definir recebe a banca nova
  await a.page.evaluate(() => { const c = DB.concursos[0]; c.banca = 'A definir'; c.datas = c.datas.filter(x => x.id !== 'd03b'); salvar(); });
  await a.page.reload(); await a.page.locator('#view .hoje-folha').waitFor();
  assert.deepEqual(await a.page.evaluate(() => [DB.concursos[0].banca, DB.concursos[0].datas.filter(x => x.id === 'd03b').length]), ['Cebraspe', 1]);
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
  assert.equal(r.fase, 'f1'); assert.equal(r.conferido, '2026-11-16'); assert.ok(r.fontes, 'fontes só de sites oficiais');
  await a.fechar();
});

test('plano do dia: dois blocos, o primeiro de questões da LGPD; revisões vencidas vêm antes', async () => {
  const a = await abrir(), p = a.page;
  let pl = await p.evaluate(() => planoDoDia().itens.map(i => [i.tipo, i.m, i.nq || i.min]));
  assert.equal(pl.length, 2); assert.deepEqual(pl[0], ['questoes', 'anpd-lgpd', 3], 'assunto com questões do app: o estudo é pelo treino'); assert.notEqual(pl[1][1], 'anpd-lgpd');
  await estudar(p, { dia: '2026-11-15', min: 40 });
  pl = await p.evaluate(() => planoDoDia().itens.map(i => [i.tipo, i.t]));
  assert.equal(pl[0][0], 'revisao', 'a revisão de 1 dia abre o plano de hoje');
  assert.equal(pl[0][1], 'anpd-lgpd-01');
  await p.locator('#view .plano-hoje .pl-item').first().waitFor();
  assert.match(await p.locator('#view .plano-hoje').innerText(), /Revisão/);
  await a.fechar();
});

test('sessão no cronômetro (assunto sem questões do app): foco, acertos, teoria concluída, festa, revisões e pontos', async () => {
  const a = await abrir(), p = a.page;
  await p.click('#hoje-estudar'); await p.locator('#es-ok').waitFor();
  assert.ok(await semCampoEmFoco(p), 'a janela de Estudar abriu com um campo em foco');
  assert.match(await p.locator('.kf-dlg .sugestao').innerText(), /Aplicação da lei/);
  assert.equal(await p.locator('#es-alvo-c').isVisible(), false, 'no treino de questões não se escolhe o tempo');
  await p.evaluate(() => { const e = document.querySelector('#es-m'); e.value = 'anpd-da'; e.dispatchEvent(new Event('change', { bubbles: true })); }); await p.click('#es-tipo [data-v="teoria"]');
  assert.match(await p.locator('#es-banco').innerText(), /Sem questões do app/); assert.equal(await p.locator('#es-alvo-c').isVisible(), true);
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
  const r = await p.evaluate(() => ({ s: DB.sessoes.map(s => [s.t, s.tipo, Math.round(s.seg / 60), s.ac, s.er]), teoria: !!topico('anpd-da-01').teoria, rev: DB.revisoes.map(r => r.due), dia: DB.dias.map(d => d.id), seq: sequencia().n, ativa: DB.ativa, dom: dominio(topico('anpd-da-01')), pts: pontosBase(), ganhas: jogoEstado().ganhas }));
  assert.deepEqual(r.s, [['anpd-da-01', 'teoria', 61, 4, 1]]);
  assert.ok(r.teoria); assert.deepEqual(r.rev, ['2026-11-17', '2026-11-23', '2026-12-16']);
  assert.deepEqual(r.dia, [HOJE]); assert.equal(r.seq, 1); assert.equal(r.ativa, null); assert.equal(r.dom, 2);
  assert.equal(r.pts, 61 + 5 + 4 * 2 + 25 + 30, 'minutos, questões, acertos (em dobro), assunto e dia');
  for (const m of ['primeira', 'dia1', 'as1']) assert.ok(r.ganhas.includes(m), 'medalha ' + m);
  assert.match(await p.locator('#view .hf-estado').innerText(), /Meta batida/);
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('treino de questões pela tela: certo ou errado, comentário, aula, combo, assunto grifado e flashcard do erro', async () => {
  const a = await abrir(), p = a.page;
  await p.click('#hoje-estudar'); await p.locator('#es-ok').waitFor();
  assert.match(await p.locator('#es-banco').innerText(), /3 questões do app/);
  await p.click('#es-ok'); await p.locator('#treino.dentro').waitFor();
  assert.equal(await p.evaluate(() => !DB.ativa && treinoAberto() && TR.lista.map(q => q.id).join()), 'lgpd-001,lgpd-002,lgpd-003');
  assert.equal(await p.locator('#tr-prox').count(), 0, 'o comentário só aparece depois da resposta');
  await p.keyboard.press('c'); await p.locator('#tr-prox').waitFor();
  assert.match(await p.locator('#treino .tr-fb').innerText(), /Você acertou[\s\S]*Gabarito: Certo/);
  assert.match(await p.locator('#treino .tr-fund').innerText(), /LGPD, art\. 3º, III/);
  await p.click('#treino .tr-aula summary'); assert.match(await p.locator('#treino .tr-aula').innerText(), /uso particular e não econômico/);
  assert.equal(await p.evaluate(() => document.activeElement.closest('#treino') !== null), true, 'o foco fica dentro do treino');
  await p.click('#tr-prox'); await p.click('#treino [data-resp="C"]'); await p.locator('#treino .tr-combo').waitFor();
  await p.click('#tr-prox'); await p.click('#treino [data-resp="C"]');
  assert.match(await p.locator('#treino .tr-fb').innerText(), /Você errou[\s\S]*Gabarito: Errado · você marcou Certo/);
  assert.match(await p.locator('#treino .tr-fc').innerText(), /virou flashcard/);
  assert.equal(await p.locator('#tr-prox').innerText(), 'Concluir treino');
  await p.click('#tr-prox'); await p.locator('#festa-ok').waitFor();
  assert.match(await p.locator('#festa-t').innerText(), /Assunto grifado/);
  await p.click('#festa-ok'); await p.locator('.festa').waitFor({ state: 'detached' });
  const r = await p.evaluate(() => ({ s: DB.sessoes.map(s => [s.t, s.tipo, s.ac, s.er, s.combo]), resp: DB.respostas.map(r => [r.id, r.n, r.ac, r.ok, r.cx ?? null, r.due || '']), teoria: !!topico('anpd-lgpd-01').teoria, rev: DB.revisoes.map(r => r.due), fc: flashcardsDeHoje().length, plano: planoDoDia().itens[0].feito, pts: pontosBase() - Math.round(DB.sessoes[0].seg / 60), ganhas: jogoEstado().ganhas }));
  assert.deepEqual(r.s, [['anpd-lgpd-01', 'questoes', 2, 1, 2]]);
  assert.deepEqual(r.resp, [['lgpd-001', 1, 1, true, null, ''], ['lgpd-002', 1, 1, true, null, ''], ['lgpd-003', 1, 0, false, 0, '2026-11-17']]);
  assert.ok(r.teoria, 'respondeu todas as questões do assunto: ele fica grifado'); assert.deepEqual(r.rev, ['2026-11-17', '2026-11-23', '2026-12-16']);
  assert.equal(r.fc, 0, 'o flashcard do erro só volta amanhã'); assert.equal(r.plano, true, 'o item do plano fica feito');
  assert.equal(r.pts, 3 + 2 * 2 + 25, 'questões, acertos em dobro e assunto grifado');
  for (const m of ['primeira', 'as1']) assert.ok(r.ganhas.includes(m), 'medalha ' + m);
  // o treino seguinte começa pelo item errado
  assert.equal(await p.evaluate(() => escolherQuestoes({ m: 'anpd-lgpd', n: 3 }).map(q => q.id).join()), 'lgpd-003,lgpd-004,lgpd-005');
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('flashcards, desafio do dia e instrutor: o erro volta, o desafio rende bônus e a pergunta é copiada', async () => {
  const a = await abrir(), p = a.page;
  // um erro de ontem: o flashcard vence hoje
  await p.evaluate(() => { DB.respostas.push({ id: 'lgpd-004', n: 1, ac: 0, ok: false, em: agora() - 864e5, cx: 0, due: hojeISO(), rv: 0 }); salvar(); });
  assert.match(await p.locator('#view [data-act="flashcards"]').innerText(), /1 item que você errou volta hoje/);
  await p.click('#view [data-act="flashcards"]'); await p.locator('#fc-ver').waitFor();
  assert.equal(await p.locator('.kf-dlg .tr-exp').count(), 0, 'a resposta fica escondida até a pessoa pedir');
  await p.click('#fc-ver'); assert.match(await p.locator('.kf-dlg .tr-exp').innerText(), /Errado\.[\s\S]*art\. 5º, II/);
  await p.click('#fc-sim'); await semJanela(p);
  assert.deepEqual(await p.evaluate(() => { const r = DB.respostas[0]; return [r.cx, r.due, r.rv, flashcardsDeHoje().length, totais().flash]; }), [1, '2026-11-19', 1, 0, 1], 'lembrou: sobe de caixa e volta em 3 dias');
  // desafio do dia: dez itens, os mesmos em qualquer aparelho, uma vez por dia
  const D = await p.evaluate(() => [desafioDoDia().lista.map(q => q.id).join(), desafioDoDia('2026-11-17').lista.map(q => q.id).join(), desafioDoDia().lista.length]);
  assert.equal(D[2], 10); assert.notEqual(D[0], D[1], 'cada dia tem o seu sorteio');
  await p.click('#view [data-act="desafio"]'); await p.locator('#treino.dentro').waitFor();
  assert.equal(await p.evaluate(() => TR.lista.map(q => q.id).join()), D[0]);
  // a pergunta ao instrutor leva a questão e a dúvida; nada é enviado pelo app
  await p.evaluate(() => { window.copiarTexto = async t => { window.__copiado = t; return true; }; window.open = (...x) => { window.__abriu = x; }; });
  for (let i = 0; i < 10; i++) {
    await p.click(`#treino [data-resp="${await p.evaluate(() => TR.lista[TR.i].g)}"]`); await p.locator('#tr-prox').waitFor();
    if (i === 0) { await p.click('#tr-perguntar'); await p.locator('#in-ok').waitFor(); assert.ok(await semCampoEmFoco(p)); await p.fill('#in-d', 'Não entendi a exceção.'); await p.click('#in-ok'); await semJanela(p);
      const c = await p.evaluate(() => [window.__copiado, window.__abriu[0], temMarco('f:instrutor')]);
      assert.match(c[0], /Questão lgpd-\d{3}[\s\S]*Gabarito: (Certo|Errado) · marquei: (Certo|Errado)[\s\S]*Minha dúvida: Não entendi a exceção\./); assert.match(c[1], /^https:\/\/claude\.ai\//); assert.equal(c[2], true); }
    await p.click('#tr-prox');
  }
  await p.locator('#festa-ok').waitFor(); assert.match(await p.locator('.festa').innerText(), /Desafio do dia[\s\S]*Maior combo[\s\S]*10 acertos seguidos[\s\S]*Bônus/);
  await p.click('#festa-ok'); await p.locator('.festa').waitFor({ state: 'detached' });
  const r = await p.evaluate(() => ({ feito: desafioDoDia().feito, q: totais().questoes, bonus: DB.sessoes.reduce((x, s) => x + (s.bonus || 0), 0), combo: totais().combo, ganhas: jogoEstado().ganhas }));
  assert.deepEqual([r.feito, r.q, r.bonus, r.combo], [true, 10, 8 + 20 + 30, 10], 'bônus: 1 por acerto a partir do terceiro seguido, 20 do desafio e 30 por acertar 80% ou mais');
  for (const m of ['des1', 'cb5', 'cb10', 'gab', 'inst', 'fc10'].slice(0, 5)) assert.ok(r.ganhas.includes(m), 'medalha ' + m);
  for (let i = 0; i < 4; i++) { const b = p.locator('#mn-ok'); if (await b.count()) { await b.click(); await p.waitForTimeout(700); } else await p.waitForTimeout(300); }
  await p.click('#view [data-act="desafio"]'); assert.equal(await p.evaluate(() => treinoAberto()), false, 'o desafio é um por dia');
  // as respostas gravadas pelo instrutor aparecem junto da questão e na tela Instrutor
  await p.route('**/instrutor/respostas.json', r => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ 'lgpd-001': [{ em: '16/11/2026', p: 'Não entendi a exceção.', r: 'A lei mira onde os dados foram coletados.' }] }) }));
  await p.evaluate(() => instrutorCarregar().then(() => irPara('instrutor')));
  await p.locator('#view .resp').waitFor(); assert.match(await p.locator('#view .respostas').innerText(), /Não entendi a exceção\.[\s\S]*A lei mira onde os dados foram coletados\./);
  await p.evaluate(() => treinoAbrir({ lista: [QID.get('lgpd-001')] })); await p.click('#treino [data-resp="C"]');
  assert.match(await p.locator('#treino .tr-inst').innerText(), /Instrutor · 16\/11\/2026[\s\S]*A lei mira/);
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('provas do Cebraspe: só fonte oficial, sem texto de prova; folha de respostas, correção pelo gabarito e comentário', async () => {
  const a = abrir(), p = (await a).page, A = await a;
  const d = await p.evaluate(() => PROVAS.map(x => ({ id: x.id, urls: [x.caderno, x.gabUrl].every(u => /^https:\/\/cdn\.cebraspe\.org\.br\/concursos\/[\w]+\/arquivos\/[\w]+\.PDF$/i.test(u)), gab: /^[CEX]+$/.test(x.gab), cobre: x.blocos.reduce((n, b) => n + b.ate - b.de + 1, 0) === x.gab.length && x.blocos.every((b, i) => b.de === (i ? x.blocos[i - 1].ate + 1 : x.de)),
    disc: x.blocos.every(b => !b.m || !!materia(b.m)), com: Object.keys(x.itens).every(n => 'CE'.includes(x.gab[n - x.de]) && x.blocos.some(b => b.m && n >= b.de && n <= b.ate)), curto: Object.values(x.itens).every(c => c.split(' ').length <= 40), doEdital: blocosDoEdital(x).reduce((n, b) => n + b.ate - b.de + 1, 0) })));
  assert.equal(d.length, 4);
  for (const x of d) assert.deepEqual([x.urls, x.gab, x.cobre, x.disc, x.com, x.curto], [true, true, true, true, true, true], x.id);
  assert.deepEqual(d.map(x => x.doEdital), [46, 30, 28, 36], 'itens do edital da ANPD em cada prova');
  await p.click('#view [data-kf-ir="provas"]'); await p.locator('#view [data-act="abrir-prova"]').first().waitFor();
  assert.equal(await p.locator('#view details[data-kf-secao]').count(), 7, 'as sete armadilhas da banca');
  await p.click('#view [data-act="abrir-prova"][data-id="anatel24-cb1"]'); await p.locator('#view .prova-capa').waitFor();
  assert.match(await p.getAttribute('#view .prova-capa a.kf-pri', 'href'), /cdn\.cebraspe\.org\.br.*961_ANATEL_CB1_01\.PDF$/);
  assert.equal(await p.getAttribute('#view .prova-capa a.kf-pri', 'rel'), 'noopener noreferrer');
  assert.equal(await p.locator('#view .bloco-prova').count(), 5, 'o bloco da lei do setor fica de fora'); assert.match(await p.locator('#view [aria-labelledby="pv-fora"]').innerText(), /Itens 30 a 33/);
  const b = '#view [data-bloco="2"]', marca = (n, v) => p.click(`${b} [data-item="${n}"][data-v="${v}"]`);
  await marca(24, 'C'); await marca(25, 'C'); await marca(26, 'E'); await marca(26, 'E'); await marca(27, 'E');
  assert.equal(await p.evaluate(() => document.activeElement.dataset.item), '27', 'marcar não tira o foco do botão');
  assert.deepEqual(await p.evaluate(() => [24, 25, 26, 27].map(n => (marcaDe(PROVA.get('anatel24-cb1'), n) || {}).v)), ['C', 'C', '', 'E'], 'tocar de novo desmarca');
  assert.equal(await p.locator(`${b} .fr-com`).count(), 0, 'comentário e gabarito só depois de corrigir');
  await p.click(`${b} [data-corrigir]`); assert.match(await p.locator('.kf-dlg').innerText(), /3 de 6 itens/); await p.locator('.kf-dlg [data-kf-ok]').click();
  await p.locator('#festa-ok').waitFor(); assert.match(await p.locator('.festa').innerText(), /ANATEL 2024 · itens 24 a 29[\s\S]*Nota líquida[\s\S]*-1 de 6/);
  await p.click('#festa-ok'); await p.locator('.festa').waitFor({ state: 'detached' });
  for (let i = 0; i < 3; i++) { const m = p.locator('#mn-ok'); if (await m.count()) { await m.click(); await p.waitForTimeout(700); } else await p.waitForTimeout(250); }
  assert.match(await p.locator(`${b} .bl-nota`).innerText(), /-1[\s\S]*1 certo, 2 errados, 3 em branco/);
  assert.match(await p.locator(`${b} .fr-item.no`).first().innerText(), /Errou · gabarito: Errado[\s\S]*não se subordina a ministério/);
  assert.equal(await p.locator(`${b} [data-item]:not([disabled])`).count(), 0, 'depois de corrigir, a folha do bloco trava');
  const r = await p.evaluate(() => ({ s: DB.sessoes.map(s => [s.m, s.t, s.tipo, s.ac, s.er, s.prova, s.bloco]), ganhas: jogoEstado().ganhas.includes('pv1'), blocos: totais().blocos, resumo: provaResumo(PROVA.get('anatel24-cb1')) }));
  assert.deepEqual(r.s, [['anpd-regul', null, 'questoes', 1, 2, 'anatel24-cb1', 24]]); assert.equal(r.ganhas, true); assert.equal(r.blocos, 1); assert.deepEqual([r.resumo.feitos, r.resumo.ac, r.resumo.er], [1, 1, 2]);
  // pergunta sobre um item: vai a referência e o gabarito, nunca o texto da prova
  await p.evaluate(() => { window.copiarTexto = async t => { window.__copiado = t; return true; }; window.open = (...x) => { window.__abriu = x; }; });
  await p.click(`${b} [data-perg="25"]`); await p.locator('#in-ok').waitFor(); await p.fill('#in-d', 'Por que está errado?'); await p.click('#in-ok'); await semJanela(p);
  assert.match(await p.evaluate(() => window.__copiado), /caderno 961_ANATEL_CB1_01[\s\S]*Item 25 · gabarito oficial: Errado · marquei: Certo[\s\S]*Minha dúvida: Por que está errado\?/);
  await p.click(`${b} [data-refazer]`); await p.locator('.kf-dlg [data-kf-ok]').click(); await p.locator(`${b} [data-corrigir]`).waitFor();
  assert.equal(await p.evaluate(() => DB.respostas.length + ':' + DB.sessoes.length), '0:1', 'refazer apaga as marcações; a sessão continua');
  assert.deepEqual(A.erros, []);
  await A.fechar();
});

test('discursiva: temas oficiais e do instrutor, contagem de linhas, rascunho guardado e envio para correção', async () => {
  const a = await abrir(), p = a.page;
  const d = await p.evaluate(() => DISCURSIVAS.map(x => [x.id, x.oficial, !x.url || /^https:\/\/cdn\.cebraspe\.org\.br\//.test(x.url), !!materia(x.m), x.topicos.length >= 3, x.espera.length >= 3, x.oficial ? !!x.url : !x.url]));
  assert.equal(d.length, 6); assert.equal(d.filter(x => x[1]).length, 3); for (const x of d) assert.deepEqual(x.slice(2), [true, true, true, true, true], x[0]);
  await p.evaluate(() => irPara('discursivas')); await p.click('#view [data-act="abrir-red"][data-id="i-incidente"]'); await p.locator('#ds-txt').waitFor();
  assert.ok(await semCampoEmFoco(p), 'a tela abriu com a caixa de texto em foco');
  assert.match(await p.locator('#view .disc-top').innerText(), /7,5 pts/); assert.match(await p.locator('#view [aria-labelledby="ds-tp"]').innerText(), /Apresentação e estrutura do texto: 1,5 ponto/);
  assert.equal(await p.locator('#view [aria-labelledby="ds-es"] details').evaluate(e => e.open), false, 'o espelho fica fechado até a pessoa abrir');
  await p.evaluate(() => { window.copiarTexto = async t => { window.__copiado = t; return true; }; window.open = (...x) => { window.__abriu = x; }; });
  await p.fill('#ds-txt', 'Texto curto.'); await p.click('#ds-enviar');
  assert.equal(await p.evaluate(() => window.__copiado || ''), '', 'texto curto demais não é enviado'); assert.equal(await p.getAttribute('#ds-txt', 'aria-invalid'), 'true');
  const frase = 'O controlador comunica à ANPD e aos titulares o incidente que possa acarretar risco ou dano relevante. ';
  await p.fill('#ds-txt', frase.repeat(22)); assert.match(await p.locator('#ds-cont').innerText(), /374 palavras, perto de 34 linhas de 30\. Passou do limite/);
  await p.fill('#ds-txt', frase.repeat(12)); await p.locator('#ds-txt').blur();
  assert.deepEqual(await p.evaluate(() => DB.redacoes.map(r => [r.id, r.txt.length > 1000, r.env])), [['i-incidente', true, 0]], 'o rascunho fica guardado');
  await p.click('#ds-enviar');
  assert.match(await p.evaluate(() => window.__copiado), /\[Estudo Fácil · discursiva para correção\][\s\S]*id i-incidente[\s\S]*até 30 linhas, 30 pontos[\s\S]*Meu texto \(cerca de 19 linhas\)[\s\S]*Corrija como a banca/);
  assert.ok(await esperar(() => p.evaluate(() => DB.redacoes[0].env > 0 && totais().redacoes === 1 && jogoEstado().ganhas.includes('red1'))), 'o envio conta para a medalha');
  for (let i = 0; i < 3; i++) { const m = p.locator('#mn-ok'); if (await m.count()) { await m.click(); await p.waitForTimeout(700); } else await p.waitForTimeout(300); }
  // a correção gravada pelo instrutor aparece junto do texto, que continua lá
  await p.evaluate(() => { INSTRUTOR = { 'disc:i-incidente': [{ em: '16/11/2026', r: 'Tópico 1: 6,5 de 7,5. Faltou citar o art. 48.' }] }; render(); });
  assert.match(await p.locator('#view [aria-labelledby="ds-co"]').innerText(), /Faltou citar o art\. 48/); assert.ok((await p.inputValue('#ds-txt')).startsWith('O controlador comunica'));
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('medalhas: mais de cem, com ids únicos, em quatro metais e cinco famílias; a tela mostra a coleção', async () => {
  const a = await abrir(), p = a.page;
  const m = await p.evaluate(() => ({ n: medalhasDoApp().length, ids: new Set(MEDALHAS.map(x => x.id)).size, metais: [...new Set(MEDALHAS.map(x => x.metal))].sort(), fam: [...new Set(MEDALHAS.map(x => x.fam))].sort(), ic: MEDALHAS.every(x => MED_IC[x.ic]), como: MEDALHAS.every(x => x.como && x.como.split(' ').length <= 14), formas: new Set(['bronze', 'prata', 'ouro', 'diamante'].map(formaMetal)).size, antigas: ['seq3', 'seq7', 'seq14', 'seq30', 'seq100', 'h10', 'h50', 'h100', 'q100', 'q500', 'q1000', 'rev10', 'ed25', 'ed50', 'ed90', 'dia1', 'primeira', 'nome', 'cedo', 'guia', 'nuvem'].filter(i => !MEDALHAS.some(x => x.id === i)) }));
  assert.ok(m.n > 100, `são ${m.n} medalhas`); assert.equal(m.ids, m.n, 'ids repetidos');
  assert.deepEqual(m.metais, ['bronze', 'diamante', 'ouro', 'prata']); assert.deepEqual(m.fam, ['app', 'constancia', 'disciplinas', 'edital', 'questoes']);
  assert.ok(m.ic && m.como, 'toda medalha tem ícone e um jeito curto de ganhar'); assert.equal(m.formas, 4, 'cada metal tem o seu contorno (não é só a cor)');
  assert.deepEqual(m.antigas, [], 'as medalhas da 1.0 que continuam mantêm o id');
  await estudar(p, {}); await nav(p, 'medalhas');
  assert.match(await p.locator('#view .vitrine').innerText(), /de \d+ medalhas[\s\S]*Bronze[\s\S]*Prata[\s\S]*Ouro[\s\S]*Diamante/);
  assert.equal(await p.locator('#view .medalhas [data-act="medalha"]').count(), m.n);
  const perto = await p.locator('#view [aria-labelledby="me-p"] .lin b').allInnerTexts();
  assert.equal(new Set(perto.map(x => x.replace(/ [IVX]+$/, ''))).size, perto.length, 'em Quase lá, só o próximo grau de cada série');
  // com as medalhas desligadas, a Evolução volta para a barra
  await p.evaluate(() => { cfg().jogo = false; salvar(); render(); });
  assert.equal(await p.locator('#kf-nav-medalhas').count(), 0); assert.equal(await p.locator('#kf-nav-evolucao').count(), 1);
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
  const fez = await p.evaluate(() => [missoes().perfeito, temMarco('p:' + hojeISO()), jogoEstado().ganhas.includes('perf1')]);
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

test('concursos: concurso digitado com o conteúdo colado, edital publicado e exclusão', async () => {
  const a = await abrir(), p = a.page;
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
  for (const t of ['hoje', 'plano', 'medalhas', 'evolucao', 'instrutor', 'provas', 'prova', 'discursivas', 'discursiva', 'mais', 'concursos', 'concurso', 'disciplinas', 'disciplina', 'revisoes', 'simulados', 'agenda', 'ajustes']) {
    await p.evaluate(t => { concId = DB.concursos[0].id; discId = DB.materias[0].id; provaId = 'anatel24-cb1'; redId = 'anm24-lgpd'; INSTRUTOR = { 'pv:anatel24-cb1:1': [{ em: '<i id="inj">x</i>', r: '<b id="inj">r</b>' }], 'disc:anm24-lgpd': [{ em: 'x', r: '<img src=x onerror="window.__xss=1">' }] }; if (!DB.respostas.some(r => r.id === 'pv:anatel24-cb1:1')) DB.respostas.push({ id: 'pv:anatel24-cb1:1', v: 'C', cor: 1, ok: false }); if (!DB.redacoes.length) DB.redacoes.push({ id: 'anm24-lgpd', txt: '</textarea><b id="inj">t</b>', env: 0 }); VER++; irPara(t); }, t); await p.waitForTimeout(120);
    if (t === 'plano') { await p.locator('#view details.disc summary').first().click(); await p.locator('#view [data-act="assunto"]').first().click(); await p.waitForTimeout(200); await p.keyboard.press('Escape'); }
    assert.equal(await p.evaluate(() => !!document.querySelector('#inj') || !!window.__xss), false, 'HTML injetado em ' + t);
  }
  await p.evaluate(() => irPara('hoje')); await p.click('#hoje-estudar'); await p.waitForTimeout(300);
  assert.equal(await p.evaluate(() => !!document.querySelector('#inj') || !!window.__xss), false, 'HTML injetado na janela de Estudar');
  await p.keyboard.press('Escape');
  // a resposta do instrutor vem de um arquivo: também é protegida, no treino e na tela Instrutor
  await p.evaluate(() => { INSTRUTOR = { 'lgpd-001': [{ em: '<i id="inj">x</i>', p: '<b id="inj">p</b>', r: '<img src=x onerror="window.__xss=1">' }] }; treinoAbrir({ t: DB.topicos[0].id }); });
  await p.locator('#treino.dentro').waitFor(); await p.click('#treino [data-resp="C"]'); await p.locator('#treino .tr-inst').waitFor();
  assert.equal(await p.evaluate(() => !!document.querySelector('#inj') || !!window.__xss), false, 'HTML injetado no treino');
  await p.evaluate(() => { treinoFechar(); irPara('instrutor'); }); await p.locator('#view .resp').waitFor();
  assert.equal(await p.evaluate(() => !!document.querySelector('#inj') || !!window.__xss), false, 'HTML injetado na tela Instrutor');
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
  await estudar(A.page, { min: 61, ac: 4, er: 1 }); await A.page.evaluate(() => { cfg().nome = 'Bruno'; DB.respostas.push({ id: 'lgpd-003', n: 1, ac: 0, ok: false, em: agora(), cx: 0, due: '2026-11-17', rv: 0 }); salvar(); jogoConferir({ silencioso: true }); });
  await ligar(A.page);
  assert.ok(await esperar(() => A.page.evaluate(() => SY.ligada() && SY.estado.lastSync > 0)), 'A não sincronizou');
  assert.ok(await esperar(async () => (await A.page.getAttribute('[data-kf-nuvem]', 'data-estado')) === 'sincronizado'), 'a nuvem não mostra Sincronizado');
  const arq = gh.arquivo('estudo-facil.json'); assert.ok(arq && !/anpd-lgpd/.test(arq.conteudo), 'o gist deveria estar criptografado');
  await ligar(B.page);
  assert.ok(await esperar(() => B.page.evaluate(() => DB.sessoes.length === 1 && cfg().nome === 'Bruno' && DB.dias.length === 1 && temMarco('m:primeira') && DB.respostas.length === 1 && DB.respostas[0].due === '2026-11-17')), 'B não recebeu sessões, dias, medalhas e respostas');
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
  await estudar(p, {}); await p.evaluate(() => irPara('medalhas'));
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
