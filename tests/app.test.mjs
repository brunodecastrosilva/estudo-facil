/* Estudo Fácil · testes do app (npm test). Rodam num Chromium, sem internet:
   o GitHub (sincronização) e o Firestore (avaliações) são simulados por comum/testes/ambiente.mjs. */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { preparar, aparelho, githubFalso, firestoreFalso, semRolagemLateral, TOKEN_TESTE, RAIZ } from '../comum/testes/ambiente.mjs';

let amb, versao;
before(async () => { amb = await preparar(); versao = JSON.parse(await readFile(RAIZ + '/package.json', 'utf8')).version; });
after(async () => { await amb?.encerrar(); });
const esperar = async (cond, ms = 8000) => { const fim = Date.now() + ms; while (Date.now() < fim) { if (await cond()) return true; await new Promise(r => setTimeout(r, 50)); } return false; };
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
    assert.equal(await a.page.isVisible('.rail'), viewport.width >= 1024, 'trilho lateral só no computador');
    assert.deepEqual(a.erros, [], `erros no ${nome}`);
    await a.fechar();
  }
});

test('zoom liberado para quem precisa ampliar a tela', async () => {
  const a = await aparelho(amb);
  assert.doesNotMatch(await a.page.getAttribute('meta[name="viewport"]', 'content'), /maximum-scale|user-scalable/);
  await a.fechar();
});

test('Ajustes: seções do padrão e versão', async () => {
  const a = await aparelho(amb);
  await prontoComDisciplina(a.page, 'Matemática', ['Frações']);
  await a.page.goto(amb.url + '#/ajustes');
  const t = await a.page.textContent('#main');
  for (const s of ['Usar em vários aparelhos', 'Aparência', 'Cópia de segurança', 'Ajude a melhorar', 'Sobre e privacidade', `Estudo Fácil ${versao}`]) assert.ok(t.includes(s), `falta "${s}" nos Ajustes`);
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('avaliação: sai do app com o nome do app, a versão e a tela', async () => {
  const fs = firestoreFalso();
  const a = await aparelho(amb, { firestore: fs });
  await prontoComDisciplina(a.page, 'Matemática', ['Frações']);
  await a.page.goto(amb.url + '#/ajustes');
  await a.page.click('#main [data-kf="avaliar"]');
  await a.page.click('label[for="kf-n4"]');
  await a.page.click('.kf-opcao:has-text("Sugestão")');
  await a.page.fill('#kf-msg', 'Queria importar edital de outra banca.');
  await a.page.click('[data-kf-enviar]');
  await a.page.locator('text=Recebemos sua mensagem').waitFor();
  const [doc] = [...fs.estado.docs.values()];
  assert.equal(doc.dados.app, 'estudo-facil');
  assert.equal(doc.dados.versao, versao);
  assert.equal(doc.dados.tela, 'ajustes');
  assert.equal(fs.estado.recusas.length, 0);
  await a.fechar();
});

test('aparência: o tema escuro fica guardado junto com as outras preferências do aparelho', async () => {
  const a = await aparelho(amb);
  const p = a.page;
  await prontoComDisciplina(p, 'Matemática', ['Frações']);
  await p.goto(amb.url + '#/ajustes');
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
  await A.page.goto(amb.url + '#/ajustes');
  await A.page.click('#main [data-kf="sync-ativar"]');
  await A.page.fill('#kf-token', TOKEN_TESTE);
  await A.page.click('[data-kf-conectar]');
  assert.ok(await esperar(() => A.page.evaluate(() => SY.ligada() && sync.lastSync > 0)), 'A não sincronizou');
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
