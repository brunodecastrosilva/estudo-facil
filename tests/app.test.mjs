/* Estudo Fácil · testes do app (npm test). Rodam num Chromium, sem internet:
   o GitHub (sincronização) e o Firestore (avaliações) são simulados por comum/testes/ambiente.mjs. */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { preparar, aparelho, githubFalso, firestoreFalso, semRolagemLateral, conferirTopo, guiasAjustes, GUIAS_COMUNS, TOKEN_TESTE, RAIZ } from '../comum/testes/ambiente.mjs';

let amb, versao;
before(async () => { amb = await preparar(); versao = JSON.parse(await readFile(RAIZ + '/package.json', 'utf8')).version; });
after(async () => { await amb?.encerrar(); });
const esperar = async (cond, ms = 8000) => { const fim = Date.now() + ms; while (Date.now() < fim) { if (await cond()) return true; await new Promise(r => setTimeout(r, 50)); } return false; };
const AJ = '.kf-topo [data-kf="ajustes"]';
/* abre uma guia dos Ajustes (no celular, a lista vira a guia aberta) */
const guia = async (p, id) => { if (!(await p.locator('[data-kf-aj]').count())) await p.click(AJ); await p.click(`.kf-aj-lista [data-kf-aj-ir="${id}"]`); await p.locator(`#kf-aj-${id}.kf-aberta, [data-kf-aj][data-ativa="${id}"]`).first().waitFor(); };
const TELAS = [[{ width: 360, height: 740 }, 'celular pequeno'], [{ width: 390, height: 844 }, 'celular'], [{ width: 820, height: 1180 }, 'tablet'], [{ width: 1440, height: 900 }, 'computador']];

/* deixa o app pronto (como depois da tela inicial), com uma disciplina e dois assuntos, usando as funções do app */
const prontoComDisciplina = (p, nome, assuntos) => p.evaluate(([nome, assuntos]) => {
  const m = { id: uid(), nome };
  DB.materias.push(m);
  assuntos.forEach((a, i) => DB.topicos.push(novoTopico(uid(), m.id, a, i)));
  DB.cfg.pronto = true; commit();
}, [nome, assuntos]);

test('abre sem erros em celular, tablet e computador, sem rolagem lateral', async () => {
  for (const [viewport, nome] of TELAS) {
    const a = await aparelho(amb, { viewport });
    await a.page.locator('.onb-wrap').waitFor();
    assert.equal(await a.page.getAttribute('html', 'lang'), 'pt-BR');
    assert.ok(await semRolagemLateral(a.page), `rolagem lateral na tela inicial no ${nome}`);
    await prontoComDisciplina(a.page, 'Português', ['Crase', 'Concordância']);
    for (const tela of ['hoje', 'disciplinas', 'agenda', 'desempenho', 'ajustes']) {
      await a.page.goto(amb.url + '#/' + tela);
      await a.page.locator('#main > *').first().waitFor();
      assert.ok(await semRolagemLateral(a.page), `rolagem lateral em ${tela} no ${nome}`);
    }
    assert.equal(await a.page.isVisible('.kf-trilho'), viewport.width >= 1024, 'trilho lateral só no computador');
    const navs = await a.page.evaluate(() => ['.kf-nav', '.kf-trilho'].filter(q => document.querySelector(q).getClientRects().length));
    assert.deepEqual(navs, [viewport.width >= 1024 ? '.kf-trilho' : '.kf-nav'], `navegação no ${nome}`);
    await a.page.goto(amb.url + '#/hoje');
    const topo = await conferirTopo(a.page);
    assert.deepEqual(topo.erros, [], `área superior no ${nome}`);
    assert.equal(await a.page.locator('[data-go="ajustes"]').count(), 0, 'Ajustes abre pela engrenagem do topo, não pela navegação');
    assert.deepEqual(a.erros, [], `erros no ${nome}`);
    await a.fechar();
  }
});

test('zoom liberado para quem precisa ampliar a tela', async () => {
  const a = await aparelho(amb);
  assert.doesNotMatch(await a.page.getAttribute('meta[name="viewport"]', 'content'), /maximum-scale|user-scalable/);
  await a.fechar();
});

test('Ajustes: guias comuns na ordem do padrão, guias do Estudo Fácil e Voltar', async () => {
  const a = await aparelho(amb);
  const p = a.page;
  await prontoComDisciplina(p, 'Matemática', ['Frações']);
  await p.goto(amb.url + '#/agenda');
  await p.click(AJ);
  assert.deepEqual(await guiasAjustes(p), { comuns: GUIAS_COMUNS, produto: ['Rotina e metas', 'Revisões'] });
  assert.ok((await p.textContent('#main')).includes(`Estudo Fácil ${versao}`), 'falta a versão');
  assert.equal(await p.getAttribute(AJ, 'aria-current'), 'page');
  // guia própria: mudar a meta redesenha a tela e a guia continua aberta
  await guia(p, 'rotina');
  await p.click('[data-act="aj-step"][data-k="hDia"][data-d="0.5"]');
  assert.ok(await esperar(async () => (await p.getAttribute('[data-kf-aj]', 'data-ativa')) === 'rotina'));
  assert.ok(await p.locator('#kf-aj-rotina').isVisible());
  await p.goBack();
  assert.ok(await esperar(async () => (await p.getAttribute('[data-kf-aj]', 'data-ativa')) === ''), 'o Voltar não voltou para a lista');
  // a engrenagem de novo fecha os Ajustes e volta para a tela de antes
  await guia(p, 'revisoes');
  await p.click(AJ);
  assert.ok(await esperar(() => p.evaluate(() => route().v === 'agenda')), 'a engrenagem não fechou os Ajustes');
  // "Ajustar" no plano do dia leva direto para a guia Rotina e metas
  await p.evaluate(() => KitFacil.ajustes.ir('rotina'));
  assert.ok(await esperar(async () => (await p.locator('#kf-aj-rotina').isVisible())));
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('Notificações: o som do fim do tempo pode ser desligado neste aparelho', async () => {
  const a = await aparelho(amb);
  const p = a.page;
  await prontoComDisciplina(p, 'Matemática', ['Frações']);
  await guia(p, 'notificacoes');
  assert.equal(await p.textContent('[data-kf-aj-resumo="notificacoes"]'), 'Som e vibração no fim do tempo');
  await p.click('#kf-aj-notificacoes [data-on="aj-alarme"]');
  assert.equal(await p.evaluate(() => PREF.alarme), false);
  assert.equal(await p.textContent('[data-kf-aj-resumo="notificacoes"]'), 'Sem som no fim do tempo');
  await p.reload();
  assert.equal(await p.evaluate(() => JSON.parse(localStorage.getItem('estudofacil.pref')).alarme), false);
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('balão: avaliar o app e relatar um problema saem com o nome do app, a versão e a tela', async () => {
  const fs = firestoreFalso();
  const a = await aparelho(amb, { firestore: fs });
  const p = a.page;
  await prontoComDisciplina(p, 'Matemática', ['Frações']);
  await p.goto(amb.url + '#/agenda');
  await p.click('.kf-topo [data-kf="feedback"]');
  await p.click('.kf-dlg [data-kf="avaliar"]');
  await p.click('label[for="kf-n4"]');
  await p.click('.kf-opcao:has-text("Sugestão")');
  await p.fill('#kf-msg', 'Queria importar edital de outra banca.');
  await p.click('[data-kf-enviar]');
  await p.locator('text=Recebemos sua mensagem').waitFor();
  await p.keyboard.press('Escape');
  await p.click('.kf-topo [data-kf="feedback"]');
  await p.click('.kf-dlg [data-kf="problema"]');
  await p.click('.kf-opcao:has-text("Tela ou texto")');
  await p.fill('#kf-msg', 'O gráfico ficou cortado.');
  await p.click('[data-kf-enviar]');
  await p.locator('text=Recebemos sua mensagem').waitFor();
  const docs = [...fs.estado.docs.values()].map(d => d.dados);
  assert.equal(docs.length, 2);
  for (const d of docs) { assert.equal(d.app, 'estudo-facil'); assert.equal(d.versao, versao); assert.equal(d.tela, 'agenda'); }
  assert.equal(docs[0].tipo, 'sugestao'); assert.equal(docs[1].categoria, 'tela');
  assert.equal(fs.estado.recusas.length, 0);
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('cópia de segurança: formato comum da família, e a cópia antiga continua valendo', async () => {
  const a = await aparelho(amb);
  const p = a.page;
  await prontoComDisciplina(p, 'Português', ['Crase']);
  await guia(p, 'sincronizacao');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('[data-kf="copia-baixar"]')]);
  const caminho = await dl.path();
  const copia = JSON.parse(await readFile(caminho, 'utf8'));
  assert.equal(copia.formato, 'copia-facil');
  assert.equal(copia.app, 'estudo-facil');
  assert.deepEqual(copia.dados.materias.map(m => m.nome), ['Português']);
  await p.evaluate(() => { DB.materias = []; DB.topicos = []; commit({ quiet: true }); });
  await p.waitForTimeout(300); // a tela pode se redesenhar quando o download termina
  await p.setInputFiles('[data-kf-copia-arquivo]', caminho);
  await p.click('#sheet-root [data-ok]');
  assert.ok(await esperar(() => p.evaluate(() => DB.materias.length === 1)), 'não restaurou a cópia nova');
  // formato antigo (2.1 e anteriores)
  const antigo = caminho + '-antigo.json';
  await writeFile(antigo, JSON.stringify({ formato: 'estudo-facil', versao: 2, em: new Date().toISOString(), dados: { ...copia.dados, materias: [{ id: 'm1', nome: 'Antiga' }], topicos: [] } }));
  // pelo botão, como a pessoa faz (o seletor de arquivos abre e a tela pode se redesenhar enquanto isso)
  const [seletor] = await Promise.all([p.waitForEvent('filechooser'), p.click('#kf-aj-sincronizacao [data-kf="copia-restaurar"]')]);
  await p.evaluate(() => render());
  await seletor.setFiles(antigo);
  await p.click('#sheet-root [data-ok]');
  assert.ok(await esperar(() => p.evaluate(() => DB.materias.length === 1 && DB.materias[0].nome === 'Antiga')), 'não restaurou a cópia antiga');
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('aparência: o tema escuro fica guardado junto com as outras preferências do aparelho', async () => {
  const a = await aparelho(amb);
  const p = a.page;
  await prontoComDisciplina(p, 'Matemática', ['Frações']);
  await guia(p, 'aparencia');
  await p.click('[data-kf="tema"][data-v="escuro"]');
  assert.equal(await p.getAttribute('html', 'data-theme'), 'dark');
  await p.evaluate(() => { PREF.modo = 1; savePref(); });
  await p.reload();
  assert.equal(await p.getAttribute('html', 'data-theme'), 'dark');
  assert.deepEqual(await p.evaluate(() => [PREF.modo, JSON.parse(localStorage.getItem('estudofacil.pref')).tema]), [1, 'escuro']);
  assert.equal(await p.getAttribute('meta[name="theme-color"]', 'content'), '#10142A');
  await a.fechar();
});

test('sincronização: o outro aparelho entra pela tela inicial e recebe disciplinas, assuntos e exclusões', async () => {
  const gh = githubFalso();
  const A = await aparelho(amb, { github: gh });
  const B = await aparelho(amb, { github: gh });
  await prontoComDisciplina(A.page, 'Direito Constitucional', ['Direitos fundamentais', 'Organização do Estado']);
  await A.page.goto(amb.url + '#/hoje');
  await A.page.click('[data-kf-nuvem]');
  await A.page.click('.kf-dlg [data-kf="sync-ativar"]');
  await A.page.fill('#kf-token', TOKEN_TESTE);
  await A.page.click('[data-kf-conectar]');
  assert.ok(await esperar(() => A.page.evaluate(() => SY.ligada() && sync.lastSync > 0)), 'A não sincronizou');
  assert.ok(await esperar(async () => (await A.page.getAttribute('[data-kf-nuvem]', 'data-estado')) === 'sincronizado'), 'a nuvem não mostra Sincronizado');
  const arq = gh.arquivo('estudo-facil.json');
  assert.ok(arq && !/Direito Constitucional/.test(arq.conteudo), 'o gist deveria estar criptografado');

  // B ainda na tela inicial: "Já uso o Estudo Fácil em outro aparelho"
  await B.page.click('[data-act="onb-conectar"]');
  await B.page.fill('#kf-token', TOKEN_TESTE);
  await B.page.click('[data-kf-conectar]');
  assert.ok(await esperar(() => B.page.evaluate(() => DB.cfg.pronto && DB.materias.some(m => m.nome === 'Direito Constitucional'))), 'B não recebeu os dados');
  await B.page.locator('#main .pg, #main section').first().waitFor();
  assert.equal(await B.page.locator('.onb-wrap').count(), 0, 'B continuou na tela inicial');

  // assunto alterado e depois excluído no B some no A, sem regravar o gist à toa depois
  await B.page.evaluate(() => { const t = DB.topicos.find(x => x.nome === 'Organização do Estado'); t.nota = 'revisar'; commit(); });
  await B.page.evaluate(() => SY.agora({ quiet: true }));
  await A.page.evaluate(() => SY.agora({ quiet: true }));
  await B.page.evaluate(() => { DB.topicos = DB.topicos.filter(x => x.nome !== 'Organização do Estado'); commit(); });
  await B.page.evaluate(() => SY.agora({ quiet: true }));
  await A.page.evaluate(() => SY.agora({ quiet: true }));
  assert.deepEqual(await A.page.evaluate(() => DB.topicos.map(t => t.nome)), ['Direitos fundamentais']);
  await B.page.evaluate(() => SY.agora({ quiet: true }));
  const antes = gh.estado.chamadas.filter(c => c.startsWith('PATCH')).length;
  for (let i = 0; i < 2; i++) { await A.page.evaluate(() => SY.agora({ quiet: true })); await B.page.evaluate(() => SY.agora({ quiet: true })); }
  assert.equal(gh.estado.chamadas.filter(c => c.startsWith('PATCH')).length, antes, 'gravou o gist sem mudança');
  assert.deepEqual([...A.erros, ...B.erros], []);
  await A.fechar(); await B.fechar();
});

test('estudo com cronômetro continua funcionando', async () => {
  const a = await aparelho(amb);
  const p = a.page;
  await prontoComDisciplina(p, 'Informática', ['Redes']);
  await p.evaluate(() => iniciarSessao(DB.topicos[0].id, 'teoria'));
  assert.equal(await p.isVisible('#foco'), true);
  await p.evaluate(() => { DB.ativa.ini -= 120000; DB.ativa.itens[0].ini -= 120000; salvarSessao(new Set([DB.topicos[0].id])); });
  assert.equal(await p.evaluate(() => DB.sessoes.length), 1);
  assert.equal(await p.evaluate(() => DB.topicos[0].teoria), true);
  assert.deepEqual(a.erros, []);
  await a.fechar();
});
