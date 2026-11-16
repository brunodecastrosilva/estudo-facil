/* Estudo Fácil 1.1 · o guia inteiro, do começo ao fim (cerca de 6 minutos). Roda só quando a mudança mexe no guia
   (Código, Art. 23, I): node --test tests/guia.test.mjs */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { preparar, aparelho } from '../comum/testes/ambiente.mjs';

let amb;
before(async () => { amb = await preparar(); });
after(async () => { await amb?.encerrar(); });

test('guia: faz todos os passos na tela, numa demonstração que não grava nada, e devolve os dados', { timeout: 720000 }, async () => {
  const a = await aparelho(amb, { caminho: '?hoje=2026-11-16' }), p = a.page;
  await p.evaluate(() => { registrarSessao({ t: topicosDe('anpd-lgpd')[3].id, seg: 1800, ac: 3, er: 1, teoria: true }); cfg().metaMin = 90; salvar(); });
  const antes = await p.evaluate(() => [JSON.stringify(DB.sessoes), localStorage.getItem('estudofacil.db')]);
  await p.click('#kf-nav-mais'); await p.click('#ma-guia');
  const passos = new Set(); let n = 0;
  const fim = Date.now() + 680000;
  while (Date.now() < fim) {
    const e = await p.evaluate(() => KitFacil.guia.estado());
    if (!e) break; n = e.n; passos.add(e.i);
    assert.equal(await p.evaluate(() => localStorage.getItem('estudofacil.db')), antes[1], `o passo ${e.i + 1} gravou dados da demonstração`);
    await p.waitForTimeout(700);
  }
  assert.equal(await p.evaluate(() => guiaAtivo()), false, 'o guia não terminou a tempo');
  assert.ok(n >= 24 && passos.size === n, `o guia passou por ${passos.size} de ${n} passos`);
  const depois = await p.evaluate(() => [JSON.stringify(DB.sessoes), cfg().metaMin, temMarco('f:guia'), tab, !!DB.ativa]);
  assert.deepEqual(depois, [antes[0], 90, true, 'hoje', false], 'os dados de verdade voltaram, com a marca do guia');
  assert.deepEqual(a.erros, []);
  await a.fechar();
});
