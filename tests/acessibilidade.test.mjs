/* Estudo Fácil 1.14 · varredura automática de acessibilidade (WCAG 2.2 A e AA) nas telas do app, nos temas claro e escuro.
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
  test(`acessibilidade (WCAG 2.2 AA): abertura, Hoje, leitura, lei seca, cartões, festa, Edital, medalhas e Ajustes, tema ${tema === 'light' ? 'claro' : 'escuro'}`, async t => {
    if (!AxeBuilder) { t.skip('axe não instalado: rode npm install (pacote @axe-core/playwright)'); return; }
    const a = await aparelho(amb, { viewport: { width: 390, height: 844 }, caminho: '?hoje=2026-11-23', antes: () => { window.EF_TESTE_ABERTURA = true; } });
    const p = a.page, nome = tema === 'light' ? 'claro' : 'escuro';
    await p.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    await p.locator('.kf-abertura').waitFor();
    for (let i = 0; i < 4; i++) { if (i === 2) await p.click('[data-ab-virar]'); await varrer(p, `abertura ${i + 1} (${nome})`); if (i < 3) await p.click('#kf-ab-prox'); }
    await p.click('#kf-ab-prox'); await p.locator('.kf-abertura').waitFor({ state: 'detached' });
    await p.waitForFunction(() => apPronta('anpd-lgpd'));
    // um pouco de história: dias que valeram, capítulos concluídos, um para reler e uma data perto
    await p.evaluate(() => { DB.dias = ['2026-11-18', '2026-11-19', '2026-11-20'].map(id => ({ id, cap: 1, car: 4, lei: 0, vale: true })); for (const id of ['anpd-lgpd-02', 'anpd-lgpd-03']) { const t = topico(id); t.teoria = t.lido = agora() - 4 * 864e5; cartoesAtivar(id); } topico('anpd-lgpd-03').reler = 1; for (const c of DB.cartoes) c.due = hojeISO();
      DB.concursos[1].datas.push({ id: 'x1', tipo: 'aviso', titulo: 'Cofen: data de teste', ini: maisDias(hojeISO(), 2), acao: true }); salvar(); jogoConferir({ silencioso: true }); render(); });
    await varrer(p, `Hoje (${nome})`);
    await p.click('#view [data-act="sobre-sequencia"]'); await p.locator('.kf-dlg').waitFor(); await varrer(p, `como funciona a sequência (${nome})`); await p.keyboard.press('Escape');
    await p.click('#kf-nav-apostilas'); await p.waitForTimeout(200); await varrer(p, `Apostilas (${nome})`);
    await p.click('#view [data-act="abrir-apostila"][data-id="anpd-da"]'); await p.locator('#view .ap-caps').waitFor(); await varrer(p, `Apostila de Direito Administrativo (${nome})`);
    await p.click('#view [data-act="abrir-cap"][data-id="cofen-da-02"]'); await p.locator('#view .ap-folha').waitFor(); await p.locator('#ap-letra button', { hasText: 'Maior' }).click(); await varrer(p, `Capítulo do Cofen, letra maior (${nome})`);
    await p.locator('#ap-letra button', { hasText: 'Normal' }).click();
    await p.click('#kf-nav-apostilas'); await p.click('#view [data-act="abrir-apostila"][data-id="anpd-lgpd"]'); await p.locator('#view .ap-caps').waitFor(); await varrer(p, `Apostila (${nome})`);
    await p.click('#view [data-act="abrir-cap"][data-id="anpd-lgpd-01"]'); await p.locator('#view .ap-folha').waitFor(); await varrer(p, `Capítulo (${nome})`);
    await p.click('#cap-entendi'); await p.locator('#festa-ok').waitFor(); await varrer(p, `festa do dia (${nome})`);
    await p.click('#festa-ok'); await p.locator('.festa').waitFor({ state: 'detached' });
    for (let i = 0; i < 4; i++) { const b = p.locator('#mn-ok'); if (await b.count()) { if (!i) await varrer(p, `medalha nova (${nome})`); await b.click(); await p.waitForTimeout(500); } else await p.waitForTimeout(250); }
    await varrer(p, `Capítulo concluído (${nome})`);
    await p.click('#view [data-act="abrir-dose"]'); await p.locator('#view .lei-folha p').first().waitFor(); await varrer(p, `Lei seca (${nome})`);
    await p.click('#dose-lida'); await p.locator('#dose-lida[aria-pressed="true"]').waitFor(); await varrer(p, `Lei seca lida (${nome})`);
    await p.evaluate(() => { capId = 'anpd-lgpd-03'; topico('anpd-lgpd-03').volta = 1; irPara('capitulo'); }); await p.locator('#view .ap-folha').waitFor(); await varrer(p, `Capítulo que voltou (${nome})`);
    await p.evaluate(() => capituloAbrir('anpd-lgpd-04')); await p.locator('#cap-reler').waitFor(); await p.click('#cap-reler'); await p.locator('.kf-toast').waitFor(); await varrer(p, `Guardado para reler (${nome})`);
    await p.evaluate(() => irPara('hoje')); await p.locator('#hoje-lei, #hoje-relembrar').first().waitFor(); await varrer(p, `Hoje com Relembrar e lei seca (${nome})`);
    // cartões: frente, verso, trecho e fim da rodada
    await p.click('#kf-nav-relembrar'); await p.locator('#rel-ver').waitFor(); await varrer(p, `cartão, frente (${nome})`);
    await p.click('#rel-ver'); await varrer(p, `cartão, verso (${nome})`);
    await p.click('#rel-nao'); await p.locator('#rel-seguir').waitFor(); await varrer(p, `cartão, trecho do capítulo (${nome})`);
    await p.click('#rel-seguir');
    for (let i = 0; i < 40; i++) { await p.locator('#rel-ver, #view .rel-fim').first().waitFor(); if (await p.locator('#view .rel-fim').count()) break; await p.click('#rel-ver'); await p.click('#rel-sim'); }
    await p.locator('#view .rel-fim').waitFor(); for (let i = 0; i < 4; i++) { const b = p.locator('#mn-ok'); if (await b.count()) { await b.click(); await p.waitForTimeout(500); } else await p.waitForTimeout(250); }
    await varrer(p, `fim da revisão (${nome})`);
    await p.evaluate(() => { REL = null; irPara('hoje'); irPara('relembrar'); }); await p.waitForTimeout(200); await varrer(p, `Relembrar, sem cartões para hoje (${nome})`);
    await p.click('#kf-nav-mais'); await p.waitForTimeout(200); await varrer(p, `Mais (${nome})`);
    await p.click('#view [data-kf-ir="edital"]'); await p.locator('#view [data-disc="anpd-lgpd"] summary').click(); await p.waitForTimeout(200); await varrer(p, `Edital da ANPD (${nome})`);
    await p.locator('#view [data-disc="anpd-lgpd"] [data-act="assunto"]').first().click(); await p.locator('#af-feito').waitFor(); await varrer(p, `ficha do assunto (${nome})`); await p.keyboard.press('Escape');
    await p.click('#ed-conc [data-v="cofen-2027"]'); await p.waitForTimeout(200); await varrer(p, `Edital do Cofen (${nome})`);
    await p.evaluate(() => irPara('medalhas')); await p.waitForTimeout(200); await varrer(p, `Medalhas (${nome})`);
    await p.locator('#view .medalhas [data-act="medalha"]').first().click(); await p.locator('.kf-dlg .med3d').waitFor(); await varrer(p, `ficha da medalha (${nome})`); await p.keyboard.press('Escape');
    await p.evaluate(() => irPara('semanas')); await p.waitForTimeout(200); await varrer(p, `Resumo semanal (${nome})`);
    await p.evaluate(() => irPara('discursivas')); await p.waitForTimeout(200); await varrer(p, `Discursivas (${nome})`);
    await p.click('#view [data-act="abrir-red"][data-id="anm24-lgpd"]'); await p.locator('#ds-txt').waitFor(); await p.fill('#ds-txt', 'A segurança acompanha o tratamento desde a concepção. '.repeat(8)); await p.click('#view [aria-labelledby="ds-es"] summary'); await p.waitForTimeout(200); await varrer(p, `Discursiva (${nome})`);
    await p.evaluate(() => irPara('leis')); await p.waitForTimeout(200); await varrer(p, `Leis (${nome})`);
    await p.evaluate(() => { leiId = 'l12813'; irPara('lei'); }); await p.locator('#view .lei-folha p').first().waitFor(); await varrer(p, `Lei (${nome})`);
    await p.click('#kf-nav-mais'); await p.locator('#view [data-kf="ajustes"]').click(); await p.locator('.kf-aj-h').waitFor(); await varrer(p, `Ajustes (${nome})`);
    for (const g of ['rotina', 'medalhas', 'conta', 'notificacoes', 'privacidade']) { await p.evaluate(g => KitFacil.ajustes.ir(g), g); await p.waitForTimeout(200); await varrer(p, `Ajustes, ${g} (${nome})`); }
    assert.deepEqual(a.erros, []);
    await a.fechar();
  });
}
