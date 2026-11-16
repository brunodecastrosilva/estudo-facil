/* Estudo Fácil 1.0 · varredura automática de acessibilidade (WCAG 2.2 A e AA) nas telas do app, nos temas claro e escuro.
   Usa o axe-core pelo pacote de desenvolvimento @axe-core/playwright (npm install). Sem ele, o teste é pulado com aviso:
   não conta como aprovado. Substitui, neste app, comum/testes/acessibilidade.test.mjs (os Ajustes ficam na tela Mais). */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { preparar, aparelho } from '../comum/testes/ambiente.mjs';

const ETIQUETAS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
async function carregarAxe() {
  for (const m of [process.env.AXE_MODULE, '@axe-core/playwright'].filter(Boolean)) { try { const x = await import(m); return x.AxeBuilder || x.default; } catch {} }
  return null;
}
let amb, AxeBuilder;
before(async () => { AxeBuilder = await carregarAxe(); if (AxeBuilder) amb = await preparar(); });
after(async () => { await amb?.encerrar(); });
const resumo = v => v.map(x => `${x.id} (${x.impact}): ${x.help} → ${x.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' | ')}`).join('\n');
async function varrer(page, onde) {
  const r = await new AxeBuilder({ page }).withTags(ETIQUETAS).analyze();
  assert.equal(r.violations.length, 0, `acessibilidade em ${onde}:\n${resumo(r.violations)}`);
}

for (const tema of ['light', 'dark']) {
  test(`acessibilidade (WCAG 2.2 AA): abertura, telas, foco, festa e Ajustes, tema ${tema === 'light' ? 'claro' : 'escuro'}`, async t => {
    if (!AxeBuilder) { t.skip('axe não instalado: rode npm install (pacote @axe-core/playwright)'); return; }
    const a = await aparelho(amb, { viewport: { width: 390, height: 844 }, caminho: '?hoje=2026-11-16', antes: () => { window.EF_TESTE_ABERTURA = true; } });
    const p = a.page, nome = tema === 'light' ? 'claro' : 'escuro';
    await p.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    await p.locator('.kf-abertura').waitFor();
    for (let i = 0; i < 4; i++) { await varrer(p, `abertura ${i + 1} (${nome})`); if (i < 3) await p.click('#kf-ab-prox'); }
    await p.click('#kf-ab-prox'); await p.locator('.kf-abertura').waitFor({ state: 'detached' });
    // um pouco de história: sessões, revisões, um simulado e um compromisso
    await p.evaluate(() => { const L = topicosDe('anpd-lgpd'); for (let d = 4; d >= 1; d--) { const dia = maisDias(hojeISO(), -d); registrarSessao({ t: L[4 - d].id, seg: 65 * 60, ac: 9, er: 3, teoria: true, dia, ini: deISO(dia).getTime() + 9 * 36e5 }); }
      DB.simulados.push({ id: 's1', c: 'anpd-2027', nome: 'Simulado 1', data: hojeISO(), r: { gerais: { ac: 20, tot: 50 }, esp: { ac: 20, tot: 70 } } }); DB.eventos.push({ id: 'e1', titulo: 'Aula', data: hojeISO(), hora: '19:00' }); salvar(); jogoConferir({ silencioso: true }); render(); });
    await varrer(p, `Hoje (${nome})`);
    await p.click('#kf-nav-plano'); await p.locator('#view [data-disc="anpd-lgpd"] summary').click(); await p.waitForTimeout(200); await varrer(p, `Plano (${nome})`);
    await p.locator('#view [data-act="assunto"]').first().click(); await p.locator('#af-estudar').waitFor(); await varrer(p, `ficha do assunto (${nome})`); await p.keyboard.press('Escape');
    await p.click('#kf-nav-evolucao'); await p.waitForTimeout(200); await varrer(p, `Evolução (${nome})`);
    await p.click('[data-evo="medalhas"]'); await p.waitForTimeout(200); await varrer(p, `Medalhas (${nome})`);
    await p.locator('[data-act="medalha"]').first().click(); await p.locator('.kf-dlg .med3d').waitFor(); await varrer(p, `ficha da medalha (${nome})`); await p.keyboard.press('Escape');
    await p.click('#kf-nav-mais'); await p.waitForTimeout(200); await varrer(p, `Mais (${nome})`);
    for (const tela of ['concursos', 'concurso', 'disciplinas', 'disciplina', 'revisoes', 'simulados', 'agenda']) { await p.evaluate(t => { concId = 'anpd-2027'; discId = 'anpd-lgpd'; irPara(t); }, tela); await p.waitForTimeout(200); await varrer(p, `${tela} (${nome})`); }
    await p.click('#kf-nav-hoje'); await p.click('#hoje-estudar'); await p.locator('#es-ok').waitFor(); await varrer(p, `Estudar (${nome})`);
    await p.click('#es-ok'); await p.locator('#foco.dentro').waitFor(); await varrer(p, `modo foco (${nome})`);
    await p.evaluate(() => { DB.ativa.acum = 61 * 60; DB.ativa.tocou = true; }); await p.click('#foco-fim'); await p.locator('#fs-ok').waitFor(); await varrer(p, `fechar a sessão (${nome})`);
    await p.click('#fs-ok'); await p.locator('#festa-ok').waitFor(); await varrer(p, `festa (${nome})`);
    await p.click('#festa-ok'); await p.locator('.festa').waitFor({ state: 'detached' });
    await p.click('#kf-nav-mais'); await p.locator('#view [data-kf="ajustes"]').click(); await p.locator('.kf-aj-h').waitFor(); await varrer(p, `Ajustes (${nome})`);
    for (const g of ['rotina', 'revisoes', 'medalhas', 'conta', 'notificacoes', 'privacidade']) { await p.evaluate(g => KitFacil.ajustes.ir(g), g); await p.waitForTimeout(200); await varrer(p, `Ajustes, ${g} (${nome})`); }
    await a.fechar();
  });
}
