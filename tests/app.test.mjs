/* Estudo Fácil 1.14 · testes do app (npm test). Rodam num Chromium (ou no Google Chrome instalado), sem internet:
   o GitHub (sincronização) é simulado por comum/testes/ambiente.mjs. O dia é fixado com ?hoje=AAAA-MM-DD.
   A varredura de acessibilidade fica em tests/acessibilidade.test.mjs. */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { preparar, aparelho, githubFalso, semRolagemLateral, conferirTopo, conferirNavAjustes, guiasAjustes, GUIAS_COMUNS, TOKEN_TESTE, RAIZ, semCampoEmFoco } from '../comum/testes/ambiente.mjs';

let amb, versao;
before(async () => { amb = await preparar(); versao = JSON.parse(await readFile(RAIZ + '/package.json', 'utf8')).version; });
after(async () => { await amb?.encerrar(); });
const esperar = async (cond, ms = 8000) => { const fim = Date.now() + ms; while (Date.now() < fim) { if (await cond()) return true; await new Promise(r => setTimeout(r, 50)); } return false; };
const HOJE = '2026-11-23'; // uma segunda-feira
const abrir = (o = {}) => aparelho(amb, { caminho: '?hoje=' + (o.hoje || HOJE), ...o });
const TELAS = [[{ width: 320, height: 568 }, 'celular mínimo (zoom 400%)'], [{ width: 360, height: 740 }, 'celular pequeno'], [{ width: 390, height: 844 }, 'celular'], [{ width: 820, height: 1180 }, 'tablet'], [{ width: 1440, height: 900 }, 'computador']];
const nav = (p, id) => p.locator(`#kf-nav-${id}:visible, #kf-trilho-${id}:visible`).first().click();
const pronto = p => p.waitForFunction(() => typeof apPronta === 'function' && apPronta('anpd-lgpd'));
const fecharFesta = async p => { await p.locator('#festa-ok').click(); await p.locator('.festa').waitFor({ state: 'detached' }); };
const fecharMedalhas = async p => { for (let i = 0; i < 4; i++) { const b = p.locator('#mn-ok'); if (await b.count()) { await b.click(); await p.waitForTimeout(700); } else await p.waitForTimeout(300); } };

test('abre sem erros em celular, tablet e computador, sem rolagem lateral, com os dois editais de fábrica', async () => {
  for (const [viewport, nome] of TELAS) {
    const a = await abrir({ viewport });
    await a.page.locator('#view .hoje-folha').waitFor(); await pronto(a.page);
    assert.equal(await a.page.getAttribute('html', 'lang'), 'pt-BR');
    assert.equal(await a.page.evaluate(() => VERSAO), versao);
    assert.ok(await semRolagemLateral(a.page), `rolagem lateral em ${nome}`);
    const topo = await conferirTopo(a.page); assert.deepEqual(topo.erros, [], `barra de cima em ${nome}`);
    const navAj = await conferirNavAjustes(a.page); assert.deepEqual(navAj.erros, [], `navegação em ${nome}`);
    for (const t of ['apostilas', 'relembrar', 'mais']) { await nav(a.page, t); await a.page.waitForTimeout(150); assert.ok(await semRolagemLateral(a.page), `rolagem lateral em ${t}, ${nome}`); }
    await a.page.evaluate(() => { concluirCapitulo('anpd-lgpd-01'); for (const c of DB.cartoes) c.due = hojeISO(); salvar(); });
    for (const t of ['hoje', 'edital', 'apostila', 'capitulo', 'dose', 'relembrar', 'medalhas', 'semanas', 'leis', 'discursivas', 'discursiva']) {
      await a.page.evaluate(t => { redId = 'antt24-sandbox'; apId = 'anpd-lgpd'; capId = 'anpd-lgpd-10'; doseId = 'anpd-lgpd-10'; editalConc = 'cofen-2027'; irPara(t); }, t);
      if (t === 'dose') await a.page.locator('#view .lei-folha p').first().waitFor();
      await a.page.waitForTimeout(150); assert.ok(await semRolagemLateral(a.page), `rolagem lateral em ${t}, ${nome}`);
    }
    assert.deepEqual(a.erros, [], `erros no console em ${nome}`);
    await a.fechar();
  }
  const a = await abrir();
  const d = await a.page.evaluate(() => ({ c: DB.concursos.map(c => [c.id, c.situacao, c.previsto, c.disc.length, c.banca]), m: DB.materias.length, t: DB.topicos.length, v: DB.v, dias: cfg().dias, bib: BIBLIOTECA.map(e => e.id), robos: document.querySelector('meta[name="robots"]').content }));
  assert.deepEqual(d, { c: [['anpd-2027', 'ativo', true, 12, 'Cebraspe'], ['cofen-2027', 'ativo', false, 13, 'Instituto Quadrix']], m: 20, t: 201, v: 4, dias: [1, 2, 3, 4, 5], bib: ['anpd-2027', 'cofen-2027'], robos: 'noindex, nofollow' });
  // a barra de baixo, a tela Mais e o que saiu de vez
  const f = await a.page.evaluate(() => { irPara('mais'); return { mais: [...document.querySelectorAll('#view .kf-mais-lin')].map(b => b.dataset.kfIr || b.dataset.kf), nav: [...document.querySelectorAll('#tabs .kf-nav-it')].map(b => b.dataset.kfIr),
    fora: ['abrirEstudar', 'focoAbrir', 'treinoAbrir', 'planoDoDia', 'missoes', 'registrarSessao', 'agendarRevisoes', 'viewInstrutor', 'lancarEstudo'].filter(n => typeof window[n] !== 'undefined'), relogio: !!document.querySelector('#sessao') }; });
  assert.deepEqual(f.nav, ['hoje', 'apostilas', 'estudar', 'relembrar', 'mais']); assert.deepEqual(f.mais, ['edital', 'medalhas', 'semanas', 'leis', 'discursivas', 'ajustes']);
  assert.deepEqual([f.fora, f.relogio], [[], false], 'cronômetro, metas, missões, plano por blocos e revisões saíram de vez');
  await a.fechar();
});

test('Hoje limpo: sequência, semana, uma leitura e um botão; sem relógio, porcentagem ou contagem regressiva', async () => {
  const a = await abrir(), p = a.page; await p.locator('#view .hoje-folha').waitFor(); await pronto(p); await p.evaluate(() => render());
  const t = await p.locator('#view').innerText();
  assert.match(t, /0 dias seguidos/); assert.match(t, /Um capítulo concluído ou a revisão fazem o dia valer\./); assert.match(t, /Próxima leitura\s+Para quem a lei vale e para quem não vale \(arts\. 1º a 4º\)\s+Capítulo 1 de 19 · LGPD/);
  assert.doesNotMatch(t, /%|Faltam \d+ dias|\d\d:\d\d|pontos|Nível/, 'a tela Hoje não mostra relógio, porcentagem, contagem regressiva nem pontos');
  assert.equal(await p.locator('#view .kf-btn').count(), 1, 'um botão só'); assert.equal((await p.locator('#hoje-estudar').innerText()).trim(), 'Ler agora');
  assert.equal(await p.locator('#view .semana .dia').count(), 7); assert.equal(await p.locator('#hoje-relembrar').count(), 0, 'sem cartões, sem linha de Relembrar');
  assert.equal(await p.locator('#view .kf-faixa').count(), 0, 'nenhuma data perto');
  await p.click('#view [data-act="sobre-sequencia"]'); assert.match(await p.locator('.kf-dlg').innerText(), /um capítulo concluído[\s\S]*Sábado e domingo não quebram a sequência/); await p.keyboard.press('Escape');
  await a.fechar();
  // uma data só aparece em Hoje quando está perto e pede ação: o fim da inscrição do Cofen (11/01/2027)
  const b = await abrir({ hoje: '2027-01-08' }); await b.page.locator('#view .hoje-folha').waitFor();
  assert.match(await b.page.locator('#view .kf-faixa').first().innerText(), /Em 3 dias: Cofen: último dia de inscrição \(11 de jan de 2027\)\. Há mais 1 data perto\./); assert.equal(await b.page.locator('#view .kf-faixa').count(), 1, 'só a data mais próxima vai para a tela Hoje');
  await b.page.locator('#view .kf-faixa [data-act="ver-edital"]').first().click(); assert.equal(await b.page.evaluate(() => tab + ':' + editalConc), 'edital:cofen-2027');
  // a prova estimada de edital que ainda não saiu não vira alerta; a do Cofen, na semana da prova, sim
  assert.deepEqual(await b.page.evaluate(() => datasPerto(200).filter(d => d.tipo === 'prova').map(d => d.c)), ['cofen-2027']);
  await b.fechar();
});

test('editais: os blocos somam, os assuntos em comum são os mesmos e o painel traz cobertura, contagem e datas', async () => {
  const a = await abrir(), p = a.page; await p.locator('#view .hoje-folha').waitFor();
  const r = await p.evaluate(() => { const [an, co] = DB.concursos, ids = c => new Set(c.disc.flatMap(d => d.topicos)), A = ids(an), C = ids(co);
    return { an: an.prova.grupos.map(g => [g.q, an.disc.filter(d => d.grupo === g.id).reduce((x, d) => x + d.q, 0)]), co: co.prova.grupos.map(g => [g.q, co.disc.filter(d => d.grupo === g.id).reduce((x, d) => x + d.q, 0)]),
      comum: [...C].filter(x => A.has(x)).length, lgpd: co.disc.find(d => d.m === 'anpd-lgpd').topicos.length, cb: [cobertura(an), cobertura(co)], ct: [contagem(an), contagem(co)] }; });
  assert.deepEqual(r.an, [[50, 50], [70, 70]]); assert.deepEqual(r.co, [[40, 40], [30, 30], [50, 50]]); assert.equal(r.comum, 46); assert.equal(r.lgpd, 19);
  assert.deepEqual(r.cb, [{ n: 119, feitos: 0, pct: 0 }, { n: 128, feitos: 0, pct: 0 }]);
  assert.deepEqual(r.ct, [{ n: 146, texto: 'Faltam 146 dias', estimada: true }, { n: 97, texto: 'Faltam 97 dias', estimada: false }]);
  // um capítulo de assunto em comum conta nos dois editais
  await p.evaluate(() => { concluirCapitulo('anpd-lgpd-01'); salvar(); jogoConferir({ silencioso: true }); irPara('edital'); });
  const an = await p.locator('#view').innerText();
  assert.match(an, /Especialista em Regulação de Proteção de Dados\s+1%\s+do edital coberto\s+1 de 119 assuntos concluídos/); assert.match(an, /Prova\s+18 de abr de 2027 \(estimada\)[\s\S]*Contagem\s+Faltam 146 dias \(estimativa\)[\s\S]*Banca\s+Cebraspe/); assert.match(an, /Edital ainda não publicado/);
  await p.click('#ed-conc [data-v="cofen-2027"]'); await p.locator('#view .capa-t', { hasText: 'Analista Técnico' }).waitFor();
  const co = await p.locator('#view').innerText();
  assert.match(co, /1%\s+do edital coberto\s+1 de 128 assuntos concluídos/); assert.match(co, /Prova\s+28 de fev de 2027[\s\S]*Contagem\s+Faltam 97 dias\s+Banca\s+Instituto Quadrix/);
  assert.match(co, /Datas importantes[\s\S]*11 de jan de 2027\s+Cofen: último dia de inscrição[\s\S]*28 de fev de 2027\s+Cofen: provas objetiva e discursiva/);
  assert.equal(await p.locator('#view .datas-passadas .datas li').count(), 0, 'o edital publicado em 25/11 ainda é futuro em 23/11');
  // as disciplinas vêm na ordem da fila: o que serve aos dois primeiro
  assert.deepEqual((await p.locator('#view details.disc .disc-tx b').allInnerTexts()).slice(0, 5), ['Língua Portuguesa', 'Direito Administrativo', 'Direito Constitucional', 'LGPD (Lei 13.709/2018)', 'Ética, integridade e acesso à informação']);
  // a ficha do assunto: abre o capítulo, e marca à mão o que foi estudado por fora (sem fazer o dia valer)
  await p.locator('#view [data-disc="anpd-lp"] summary').click(); await p.locator('#view [data-disc="anpd-lp"] [data-act="assunto"]').first().click(); await p.locator('#af-feito').waitFor();
  assert.match(await p.locator('.kf-dlg').innerText(), /Situação\s+Não lido\s+Apostila\s+ainda não escrita/); assert.equal(await p.locator('#af-abrir').count(), 0);
  await p.evaluate(() => { DB.dias = []; salvar(); }); await p.click('#af-feito');
  assert.deepEqual(await p.evaluate(() => [!!topico('anpd-lp-01').teoria, DB.dias.filter(d => d.vale).length, cobertura(DB.concursos[1]).feitos]), [true, 0, 2]);
  await p.locator('.kf-toast [data-kf-acao], .kf-toast button').first().click(); assert.ok(await esperar(() => p.evaluate(() => !topico('anpd-lp-01').teoria)), 'Desfazer');
  await p.evaluate(() => assuntoFicha('anpd-lgpd-10')); await p.locator('#af-abrir').click();
  assert.equal(await p.evaluate(() => tab + ':' + capId), 'capitulo:anpd-lgpd-10');
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('fila até a prova do Cofen: o que serve aos dois, depois o resto do Cofen, e a ANPD pura por último', async () => {
  const a = await abrir(), p = a.page; await p.locator('#view .hoje-folha').waitFor(); await pronto(p);
  const o = ids => p.evaluate(ids => ids.map(id => ordemDoAssunto(topico(id))), ids);
  const [lp, da, dc, lgpd, etica, ct, rlm, reg, daSo] = await o(['anpd-lp-01', 'anpd-da-01', 'anpd-dc-01', 'anpd-lgpd-01', 'anpd-etica-03', 'cofen-ct-01', 'cofen-rlm-01', 'anpd-reg-01', 'anpd-da-08']);
  assert.ok(lp < da && da < dc && dc < lgpd && lgpd < etica, 'comuns: Português, Administrativo, Constitucional, LGPD'); assert.ok(etica < ct && ct < rlm, 'depois, contratos e o resto do Cofen'); assert.ok(rlm < reg && rlm < daSo, 'ANPD pura fica para depois');
  assert.deepEqual(await p.evaluate(() => [fila().length, fila()[0], fila().every(x => x.tipo === 'cap'), capitulosEmOrdem().map(t => t.id).join() === APOSTILAS[0].ids.join()]), [19, { tipo: 'cap', t: 'anpd-lgpd-01' }, true, true]);
  await a.fechar();
  // depois da prova do Cofen, a ANPD pura entra na ordem normal
  const b = await abrir({ hoje: '2027-03-01' }); await b.page.locator('#view .hoje-folha').waitFor();
  assert.ok(await b.page.evaluate(() => ordemDoAssunto(topico('anpd-reg-01')) < ordemDoAssunto(topico('cofen-ct-01'))));
  await b.fechar();
});

test('apostila da LGPD: 19 capítulos, cartões em todos, cada um dentro do trecho que responde', async () => {
  const txt = readFileSync(new URL('../apostilas/anpd-lgpd.md', import.meta.url), 'utf8');
  const a = await abrir(), p = a.page; await p.locator('#view .hoje-folha').waitFor(); await pronto(p);
  const r = await p.evaluate(() => { const A = AP_TXT['anpd-lgpd'], C = A.caps.flatMap(c => c.cartoes);
    return { caps: A.caps.map(c => c.t), n: A.caps.map(c => c.cartoes.length), ids: new Set(C.map(c => c.id)).size, tot: C.length, semSec: C.filter(c => c.sec < 0).length,
      vazio: A.caps.flatMap(c => c.cartoes.filter(k => apTrecho(c, k.sec).html.length < 80 || !apTrecho(c, k.sec).titulo).map(k => k.id)), curto: C.filter(c => c.f.length < 12 || c.v.length < 2 || !/\?$|\.$/.test(c.f)).map(c => c.id),
      linhaCartao: A.caps.some(c => c.b.some(b => /^\?/.test(b[1]))), itens: A.caps.every(c => c.b.filter(b => b[0] === 'item').length >= 3 && c.b.some(b => b[0] === 'res')) }; });
  assert.deepEqual(r.caps, Array.from({ length: 19 }, (_, i) => 'anpd-lgpd-' + String(i + 1).padStart(2, '0'))); assert.ok(r.n.every(n => n >= 4 && n <= 8), 'de 4 a 8 cartões por capítulo: ' + r.n);
  assert.equal(r.tot, (txt.match(/^\? /gm) || []).length); assert.equal(r.ids, r.tot, 'ids únicos'); assert.equal(r.tot, 103);
  assert.deepEqual([r.semSec, r.vazio, r.curto, r.linhaCartao, r.itens], [0, [], [], false, true], 'todo cartão tem trecho; a linha do cartão não vira parágrafo');
  // o trecho é só a parte que responde: do subtítulo ao próximo, sem a caixa da banca, os modelos de item e o resumo
  const tr = await p.evaluate(() => { const c = capituloDe('anpd-lgpd-10'), k = c.cartoes.find(x => /prazos/.test(x.f)); const t = apTrecho(c, k.sec); return [t.titulo, /15 dias/.test(t.html), /Modelo de item|Para a prova|Como o Cebraspe cobra|Os nove direitos/.test(t.html)]; });
  assert.deepEqual(tr, ['Os prazos do art. 19', true, false]);
  // a lista da apostila e a tela do capítulo: um capítulo por tela, sem os cartões no meio do texto
  await nav(p, 'apostilas'); assert.match(await p.locator('#view').innerText(), /LGPD para quem nunca viu[\s\S]*0 de 19 capítulos concluídos[\s\S]*Ainda sem apostila[\s\S]*Língua Portuguesa\s+Direito Administrativo\s+Direito Constitucional\s+Contratos/);
  await p.click('#view [data-act="abrir-apostila"]'); assert.equal(await p.locator('#view .ap-caps [data-act="abrir-cap"]').count(), 19);
  await p.click('#view [data-act="abrir-cap"][data-id="anpd-lgpd-18"]'); await p.locator('#view .ap-folha').waitFor();
  const cap = await p.locator('#view').innerText();
  assert.match(cap, /As sanções administrativas \(arts\. 52 a 54\)\s+Capítulo 18 de 19 · LGPD/); assert.match(cap, /até 2% do faturamento/); assert.match(cap, /Como o Cebraspe cobra/); assert.match(cap, /Modelo de item errado/); assert.match(cap, /Para a prova/);
  assert.doesNotMatch(cap, /Quais são os números da multa simples\?/, 'o cartão não aparece no texto do capítulo'); assert.doesNotMatch(cap, /Sessão|tempo está contando|Estudar este capítulo/);
  assert.equal(await p.locator('#view .ap-folha h2.ap-h').count() >= 4, true); assert.equal(await p.locator('#view h1').count(), 1);
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('capítulo pela tela: Entendi conclui, ativa os cartões, faz o dia valer e mostra a lei seca, o próximo e o Tec', async () => {
  const a = await abrir(), p = a.page; await p.locator('#view .hoje-folha').waitFor(); await pronto(p);
  await p.click('#kf-nav-estudar'); await p.locator('#view .ap-folha').waitFor();
  assert.equal(await p.evaluate(() => tab + ':' + capId), 'capitulo:anpd-lgpd-01', 'o botão do centro abre a leitura sugerida');
  assert.deepEqual(await p.locator('#view .ap-fim .kf-btn').allInnerTexts().then(L => L.map(x => x.trim())), ['Quero reler depois', 'Entendi']);
  await p.click('#cap-entendi'); await p.locator('#festa-ok').waitFor();
  assert.match(await p.locator('.festa').innerText(), /O dia valeu!\s+Para quem a lei vale e para quem não vale[\s\S]*Capítulo\s+concluído\s+Cartões novos\s+6/); await fecharFesta(p);
  const d = await p.evaluate(() => ({ teoria: !!topico('anpd-lgpd-01').teoria, dia: DB.dias, c: DB.cartoes.map(c => [c.id, c.cx, c.due, c.ok, c.no]), seq: sequencia().n, sug: sugestao(), tot: totais(), pts: pontosBase() }));
  assert.deepEqual(d.dia, [{ id: HOJE, cap: 1, car: 0, lei: 0, vale: true }]); assert.equal(d.c.length, 6); assert.ok(d.c.every(c => c[1] === 0 && c[2] === '2026-11-24' && c[3] === 0), 'os cartões voltam a partir do dia seguinte');
  assert.deepEqual([d.teoria, d.seq, d.sug, d.tot.caps, d.pts], [true, 1, { tipo: 'lei', t: 'anpd-lgpd-01' }, 1, 50], 'depois do capítulo vem a lei seca dele');
  const fim = await p.locator('#ap-fim').innerText();
  assert.match(fim, /Capítulo concluído\s+6 cartões deste capítulo voltam a partir de amanhã, em Relembrar\.[\s\S]*Ler a lei seca deste capítulo\s+Lei 13\.709\/2018 · arts\. 1º a 4º[\s\S]*Próximo capítulo\s+O vocabulário da lei: quem é quem \(art\. 5º\)[\s\S]*Abrir o Tec Concursos/);
  assert.deepEqual(await p.locator('#ap-fim a.lin').evaluate(e => [e.href, e.target, e.rel]), ['https://www.tecconcursos.com.br/', '_blank', 'noopener noreferrer'], 'o atalho só abre o Tec');
  await fecharMedalhas(p);
  // Desfazer volta tudo: o capítulo, os cartões e o dia
  await p.locator('#view [data-act="abrir-cap"][data-id="anpd-lgpd-02"]').click(); await p.locator('#view .tela-t', { hasText: 'O vocabulário da lei' }).waitFor();
  await p.click('#cap-reler'); await p.locator('.kf-toast').waitFor();
  assert.match(await p.locator('.kf-toast').innerText(), /Capítulo concluído\. Guardado para reler depois\./); assert.match(await p.locator('#ap-fim').innerText(), /Ele fica guardado para você reler depois\. 7 cartões/);
  assert.deepEqual(await p.evaluate(() => [!!topico('anpd-lgpd-02').reler, DB.cartoes.length, DB.dias[0].cap, !!document.querySelector('.festa')]), [true, 13, 2, false], 'a festa é uma vez por dia');
  await p.locator('.kf-toast button').first().click();
  assert.ok(await esperar(() => p.evaluate(() => !topico('anpd-lgpd-02').teoria && !topico('anpd-lgpd-02').reler && DB.cartoes.length === 6 && DB.dias[0].cap === 1 && !!document.querySelector('#cap-entendi'))), 'Desfazer');
  // Quero reler depois: o capítulo conta, e volta no fim da fila; a releitura limpa a marca
  await p.evaluate(() => { concluirCapitulo('anpd-lgpd-02', { reler: true }); salvar(); });
  assert.deepEqual(await p.evaluate(() => { const F = fila(); return [F[0], F[F.length - 1], F.filter(x => x.tipo === 'cap').length]; }), [{ tipo: 'lei', t: 'anpd-lgpd-01' }, { tipo: 'reler', t: 'anpd-lgpd-02' }, 17]);
  await p.evaluate(() => irPara('apostila')); assert.match(await p.locator('#view [data-act="abrir-cap"][data-id="anpd-lgpd-02"]').innerText(), /Capítulo 2 · Para reler/); assert.match(await p.locator('#view [data-act="abrir-cap"][data-id="anpd-lgpd-01"]').innerText(), /Capítulo 1 · Concluído/);
  await p.evaluate(() => { concluirCapitulo('anpd-lgpd-02'); salvar(); }); assert.equal(await p.evaluate(() => fila().some(x => x.tipo === 'reler')), false);
  // tudo lido e nada pendente: a leitura mais antiga volta como sugestão, para o dia nunca ficar sem leitura
  await p.evaluate(() => { let k = 1; for (const t of capitulosEmOrdem()) { t.teoria = t.teoria || 1000 + k; t.lido = 1000 + k++; t.lei = 1; } salvar(); });
  assert.deepEqual(await p.evaluate(() => fila()), [{ tipo: 'reler', t: 'anpd-lgpd-01', antigo: true }]);
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('a leitura continua de onde parou: o app guarda a posição e a tela Hoje oferece continuar', async () => {
  const a = await abrir(), p = a.page; await p.locator('#view .hoje-folha').waitFor(); await pronto(p);
  await p.click('#hoje-estudar'); await p.locator('#view .ap-folha').waitFor(); await p.waitForTimeout(700);
  const alvo = await p.evaluate(() => { const e = [...document.querySelectorAll('#view .ap-folha [data-b]')][12]; e.scrollIntoView({ block: 'start' }); return +e.dataset.b; });
  assert.ok(await esperar(() => p.evaluate(alvo => { const b = lendo().pos['anpd-lgpd-01'] || 0; return b >= alvo - 2 && b <= alvo + 1 && lendo().t === 'anpd-lgpd-01'; }, alvo)), 'a posição não foi guardada');
  const b = await p.evaluate(() => lendo().pos['anpd-lgpd-01']);
  await nav(p, 'hoje'); assert.match(await p.locator('#view .sugestao').innerText(), /Continue de onde parou\s+Para quem a lei vale/); assert.equal((await p.locator('#hoje-estudar').innerText()).trim(), 'Continuar a leitura');
  await p.reload(); await p.locator('#view .hoje-folha').waitFor(); await pronto(p);
  await p.click('#hoje-estudar'); await p.locator('#view .ap-folha').waitFor(); await p.waitForTimeout(900);
  const y = await p.evaluate(b => { const r = document.querySelector(`#view .ap-folha [data-b="${b}"]`).getBoundingClientRect(); return r.top; }, b);
  assert.ok(y > -5 && y < 200, 'o capítulo reabre no ponto em que a leitura parou: ' + y);
  // concluir limpa a posição
  await p.evaluate(() => { concluirCapitulo('anpd-lgpd-01'); salvar(); }); assert.deepEqual(await p.evaluate(() => [lendo().t, lendo().pos['anpd-lgpd-01'] || 0]), ['', 0]);
  await a.fechar();
});

test('lei seca na fila: a dose traz só os artigos do capítulo, com o texto do Planalto sem alteração', async () => {
  const lgpd = JSON.parse(readFileSync(new URL('../leis/lgpd.json', import.meta.url), 'utf8'));
  const a = await abrir(), p = a.page; await p.locator('#view .hoje-folha').waitFor(); await pronto(p);
  const D = await p.evaluate(P => APOSTILAS[0].ids.map(id => { const d = doseDe(id), L = doseParagrafos(P, d); return [id, doseRotulo(d), L.length, L[0][0].t.slice(0, 12), L[L.length - 1][1], L[0][1], !!L[L.length - 1][0].c, artDoParagrafo(P[L[L.length - 1][1] + 1] || { t: '' })]; }), lgpd.p);
  assert.equal(D.length, 19); for (const d of D) { assert.ok(d[2] >= 1 && !d[6], d[0] + ': a dose não termina em título de capítulo'); assert.match(d[3], /^Art\. ?\d/, d[0]); }
  assert.deepEqual(D[0].slice(0, 4), ['anpd-lgpd-01', 'Lei 13.709/2018 · arts. 1º a 4º', 40, 'Art. 1º Esta']); assert.deepEqual(D[1].slice(1, 4), ['Lei 13.709/2018 · art. 5º', 30, 'Art. 5º Para']);
  assert.match(lgpd.p[D[9][5]].t, /^Art\. 17\./); assert.match(lgpd.p[D[9][4] + 1].t, /^CAP[ÍI]TULO IV/); assert.match(lgpd.p[D[17][5]].t, /^Art\. 52\./); assert.match(lgpd.p[D[18][5]].t, /^Art\. 55-A\./);
  assert.match(lgpd.p.slice(D[18][4] + 1).find(x => /^Art\./.test(x.t)).t, /^Art\. 59\./, 'a dose da ANPD vai até o art. 58-B, com as redações antigas que o Planalto mantém');
  // pela tela: do fim do capítulo para a dose; marcar como lida tira a dose da fila e entra no resumo da semana
  await p.evaluate(() => { concluirCapitulo('anpd-lgpd-10'); for (const id of APOSTILAS[0].ids.slice(0, 9)) { const t = topico(id); t.teoria = 1; t.lei = 1; } salvar(); jogoConferir({ silencioso: true }); irPara('hoje'); });
  await p.locator('#view .sugestao', { hasText: 'Lei seca do capítulo' }).waitFor();
  assert.match(await p.locator('#view .sugestao').innerText(), /Lei seca do capítulo\s+Os direitos do titular \(arts\. 17 a 22\)\s+Lei 13\.709\/2018 · arts\. 17 a 22/); assert.equal((await p.locator('#hoje-estudar').innerText()).trim(), 'Ler a lei');
  await p.click('#hoje-estudar'); await p.locator('#view .lei-folha p').first().waitFor();
  const tela = await p.locator('#view .lei-folha p').allTextContents();
  assert.deepEqual(tela, lgpd.p.slice(D[9][5], D[9][4] + 1).map(x => x.t), 'o texto da dose é o do arquivo, sem alteração'); assert.match(tela[0], /^Art\. 17\./); assert.ok(tela.some(t => /^Art\. 22\./.test(t)) && !tela.some(t => /^Art\. 23\./.test(t)));
  assert.equal(await p.locator('#view .lei-folha .lei-r s').count(), lgpd.p.slice(D[9][5], D[9][4] + 1).filter(x => x.r).length, 'o revogado vem riscado, como no Planalto');
  await p.click('#dose-lida'); assert.ok(await esperar(() => p.evaluate(() => !!topico('anpd-lgpd-10').lei && DB.dias[0].lei === 1 && sugestao().tipo === 'cap' && sugestao().t === 'anpd-lgpd-11')));
  await p.locator('#dose-lida[aria-pressed="true"]', { hasText: 'Desmarcar lei lida' }).waitFor(); assert.match(await p.locator('#view .ap-fim').innerText(), /Próxima leitura/);
  await p.locator('.kf-toast button').first().click(); assert.ok(await esperar(() => p.evaluate(() => !topico('anpd-lgpd-10').lei && DB.dias[0].lei === 0)), 'Desfazer');
  await p.click('#view [data-act="dose-inteira"]'); await p.locator('#view #lei-sumario').waitFor(); assert.equal(await p.evaluate(() => tab + ':' + leiId), 'lei:lgpd');
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('Relembrar: lembrou sobe de caixa; não lembrou abre só o trecho e volta amanhã; mais da metade devolve o capítulo à fila', async () => {
  const a = await abrir(), p = a.page; await p.locator('#view .hoje-folha').waitFor(); await pronto(p);
  await nav(p, 'relembrar'); assert.match(await p.locator('#view').innerText(), /Os cartões nascem dos capítulos/);
  // ontem ele leu o capítulo 10; hoje os 6 cartões voltam
  await p.evaluate(() => { concluirCapitulo('anpd-lgpd-10'); DB.dias = []; for (const c of DB.cartoes) c.due = hojeISO(); salvar(); irPara('hoje'); });
  assert.match(await p.locator('#hoje-relembrar').innerText(), /Relembrar\s+6 cartões para hoje/); assert.match(await p.locator('#kf-nav-relembrar').innerText(), /6\s*, 6 cartões para hoje/);
  await p.click('#hoje-relembrar'); await p.locator('#rel-ver').waitFor();
  assert.match(await p.locator('#view').innerText(), /Cartão 1 de 6[\s\S]*LGPD \(Lei 13\.709\/2018\) · Os direitos do titular \(arts\. 17 a 22\)\s+Quando e como o titular exerce os direitos do art\. 18\?/);
  assert.equal(await p.locator('#view .rel-v').count(), 0, 'a resposta só aparece depois do toque');
  await p.click('#rel-ver'); assert.match(await p.locator('#view .rel-v').innerText(), /Resposta\s+A qualquer momento, mediante requisição ao controlador\./);
  assert.deepEqual(await p.locator('#view .rel-botoes .kf-btn').allInnerTexts().then(L => L.map(x => x.trim())), ['Não lembrei', 'Lembrei']);
  await p.click('#rel-sim'); await p.locator('#rel-ver').waitFor();
  assert.deepEqual(await p.evaluate(() => { const c = DB.cartoes.find(x => x.id === 'anpd-lgpd-10#a'); return [c.cx, c.due, c.ok, c.ult, DB.dias[0].car, DB.dias[0].vale]; }), [1, '2026-11-26', 1, 'ok', 1, false], 'lembrou: volta em 3 dias; a rodada ainda não acabou');
  // não lembrou: o app abre na hora só o trecho do capítulo, e o cartão volta no dia seguinte
  await p.click('#rel-ver'); await p.click('#rel-nao'); await p.locator('#rel-seguir').waitFor();
  const tr = await p.locator('#view .rel-trecho').innerText();
  assert.match(tr, /O trecho do capítulo que responde\s+Os nove direitos do art\. 18[\s\S]*Anonimização, bloqueio ou eliminação[\s\S]*Este cartão volta amanhã\./); assert.doesNotMatch(tr, /Os prazos do art\. 19|Como se exerce|Modelo de item/, 'só o trecho, não o capítulo');
  assert.deepEqual(await p.evaluate(() => { const c = DB.cartoes.find(x => x.id === 'anpd-lgpd-10#b'); return [c.cx, c.due, c.no, c.ult, !!topico('anpd-lgpd-10').volta]; }), [0, '2026-11-24', 1, 'no', false]);
  await p.click('#rel-seguir');
  for (let i = 0; i < 2; i++) { await p.click('#rel-ver'); await p.click('#rel-nao'); await p.click('#rel-seguir'); }
  assert.equal(await p.evaluate(() => !!topico('anpd-lgpd-10').volta), false, 'três de seis não é mais da metade');
  await p.click('#rel-ver'); await p.click('#rel-nao'); await p.locator('#rel-seguir').waitFor();
  assert.match(await p.locator('#view .rel-trecho .kf-faixa').innerText(), /Mais da metade dos cartões deste capítulo não foi lembrada\. Ele voltou para a sua fila de leitura\./);
  assert.deepEqual(await p.evaluate(() => [!!topico('anpd-lgpd-10').volta, fila()[0]]), [true, { tipo: 'volta', t: 'anpd-lgpd-10' }]);
  await p.click('#rel-seguir'); await p.click('#rel-ver'); await p.click('#rel-sim');
  // fim da rodada: a revisão faz o dia valer, mesmo sem capítulo
  await p.locator('#festa-ok').waitFor(); assert.match(await p.locator('.festa').innerText(), /O dia valeu!\s+Revisão feita[\s\S]*Cartões\s+2 de 6 lembrados/); await fecharFesta(p);
  assert.match(await p.locator('#view').innerText(), /Revisão feita\.\s+2 de 6 cartões lembrados\s+Os que você não lembrou voltam amanhã\./);
  assert.deepEqual(await p.evaluate(() => [DB.dias, sequencia().n, cartoesDeHoje().length, totais().lembrados]), [[{ id: HOJE, cap: 0, car: 6, lei: 0, vale: true }], 1, 0, 2]);
  await fecharMedalhas(p);
  // o capítulo que voltou aparece em Hoje e na tela dele; reler zera a conta dos cartões
  await nav(p, 'hoje'); assert.match(await p.locator('#view .sugestao').innerText(), /Para reler: os cartões pediram\s+Os direitos do titular/);
  await p.click('#hoje-estudar'); await p.locator('#view .ap-folha').waitFor(); assert.match(await p.locator('#view .kf-faixa').innerText(), /Este capítulo voltou para a fila/);
  await p.click('#cap-entendi'); assert.ok(await esperar(() => p.evaluate(() => !topico('anpd-lgpd-10').volta && DB.cartoes.every(c => c.ult === '') && DB.cartoes.length === 6 && DB.dias[0].cap === 1)));
  await nav(p, 'relembrar'); assert.match(await p.locator('#view').innerText(), /Nenhum cartão para hoje\s+Os próximos voltam amanhã\.[\s\S]*Cartões no baralho\s+6\s+Vezes em que você lembrou\s+2/);
  // as caixas: 1, 3, 7, 15, 30 e 60 dias
  assert.deepEqual(await p.evaluate(() => { const id = 'anpd-lgpd-10#f', c = DB.cartoes.find(x => x.id === id), L = []; c.cx = 0; for (let i = 0; i < 7; i++) { responderCartao(id, true); L.push(entreDias(hojeISO(), c.due)); } responderCartao(id, false); L.push(entreDias(hojeISO(), c.due), c.cx); return L; }), [3, 7, 15, 30, 60, 60, 60, 1, 0]);
  // a rodada tem até 15 cartões; o que sobra fica para outra rodada
  await p.evaluate(() => { for (const id of ['anpd-lgpd-01', 'anpd-lgpd-02', 'anpd-lgpd-03']) concluirCapitulo(id); for (const c of DB.cartoes) c.due = hojeISO(); salvar(); REL = null; irPara('hoje'); });
  await nav(p, 'relembrar'); await p.locator('#rel-ver').waitFor(); assert.match(await p.locator('#view .tela-sub').innerText(), /Cartão 1 de 15/); assert.equal(await p.evaluate(() => cartoesDeHoje().length), 24);
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('sequência: o dia vale com capítulo ou revisão; sábado e domingo são livres; a folga salva um dia; recorde', async () => {
  const a = await abrir(), p = a.page; await p.locator('#view .hoje-folha').waitFor();
  const seq = dias => p.evaluate(dias => { DB.dias = dias.map(id => ({ id, cap: 1, car: 0, lei: 0, vale: true })); salvar({ quieto: true }); const s = sequencia(); return [s.n, s.hojeFeito, s.folgas, s.recorde, s.livre, [...s.protegidos]]; }, dias);
  // hoje é segunda, 23/11: sexta feita, fim de semana sem estudo, segunda feita
  assert.deepEqual(await seq(['2026-11-19', '2026-11-20', '2026-11-23']), [3, true, 1, 3, false, []], 'o fim de semana não quebra');
  assert.deepEqual(await seq(['2026-11-20', '2026-11-21', '2026-11-22']), [3, false, 1, 3, false, []], 'estudar no fim de semana soma');
  assert.deepEqual(await seq(['2026-11-17', '2026-11-18', '2026-11-20']), [3, false, 0, 3, false, ['2026-11-19']], 'a folga de fábrica salva a quinta');
  assert.deepEqual(await seq(['2026-11-16', '2026-11-20']), [1, false, 0, 1, false, ['2026-11-17']], 'sem folga, a quarta quebra a sequência');
  assert.deepEqual(await seq(['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', '2026-11-13']), [0, false, 0, 5, false, ['2026-11-09']], 'o recorde fica');
  // dia com cartão respondido mas sem rodada fechada não vale
  await p.evaluate(() => { DB.dias = [{ id: '2026-11-20', cap: 0, car: 3, lei: 1, vale: false }]; salvar({ quieto: true }); }); assert.equal(await p.evaluate(() => sequencia().n), 0);
  await a.fechar();
  const b = await abrir({ hoje: '2026-11-21' }); await b.page.locator('#view .hoje-folha').waitFor(); // sábado
  assert.match(await b.page.locator('#view .hf-seq-tx').innerText(), /Hoje é dia livre: não quebra a sequência\./); assert.equal(await b.page.locator('#view .semana .dia.livre').count(), 2);
  await b.fechar();
});

test('resumo semanal: registro do que foi feito, sem meta; a tela Hoje traz a frase da semana', async () => {
  const a = await abrir(), p = a.page; await p.locator('#view .hoje-folha').waitFor();
  await p.evaluate(() => irPara('semanas')); assert.match(await p.locator('#view').innerText(), /Sua primeira semana começa agora/);
  await p.evaluate(() => { DB.dias = [{ id: '2026-11-16', cap: 2, car: 10, lei: 1, vale: true }, { id: '2026-11-18', cap: 3, car: 12, lei: 0, vale: true }, { id: '2026-11-20', cap: 0, car: 4, lei: 0, vale: false }, { id: '2026-11-03', cap: 1, car: 0, lei: 0, vale: true }]; salvar(); irPara('hoje'); });
  assert.deepEqual(await p.evaluate(() => [resumoSemana('2026-11-16'), fraseSemana(resumoSemana('2026-11-16'))]), [{ seg: '2026-11-16', cap: 5, car: 26, lei: 1, dias: 2, vazio: false }, '5 capítulos, 26 cartões e 1 dose de lei seca']);
  assert.match(await p.locator('#view .hf-semana').innerText(), /Semana passada: 5 capítulos, 26 cartões e 1 dose de lei seca\./);
  await p.evaluate(() => { concluirCapitulo('anpd-lgpd-01'); salvar(); }); await p.locator('#view .hf-semana', { hasText: 'Esta semana: 1 capítulo.' }).waitFor();
  await nav(p, 'mais'); assert.match(await p.locator('#view [data-kf-ir="semanas"]').innerText(), /Esta semana: 1 capítulo/); await p.click('#view [data-kf-ir="semanas"]');
  const t = await p.locator('#view').innerText();
  assert.match(t, /É registro, não é meta\.\s+Esta semana\s+Capítulos concluídos\s+1[\s\S]*Semana passada\s+Capítulos concluídos\s+5\s+Cartões respondidos\s+26\s+Doses de lei seca\s+1\s+Dias que valeram\s+2\s+2 de nov a 8 de nov/);
  assert.doesNotMatch(t, /meta de|%/);
  await a.fechar();
});

test('medalhas e níveis refeitos: 30 medalhas sobre dias seguidos, capítulos, conceitos lembrados e disciplina fechada', async () => {
  const a = await abrir(), p = a.page; await p.locator('#view .hoje-folha').waitFor(); await pronto(p);
  const m = await p.evaluate(() => ({ n: MEDALHAS.length, ids: new Set(MEDALHAS.map(x => x.id)).size, fam: [...new Set(MEDALHAS.map(x => x.fam))], metais: METAL_ORDEM.map(k => MEDALHAS.filter(x => x.metal === k).length), series: SERIES.map(s => [s.id, s.k, s.alvos.length]), como: MEDALHAS.map(x => x.como).join(' '), niveis: NIVEIS.length, pts: PONTOS }));
  assert.equal(m.n, 30); assert.equal(m.ids, 30); assert.deepEqual(m.fam, ['constancia', 'capitulos', 'memoria', 'disciplinas', 'app']); assert.ok(m.metais.every(n => n >= 4), 'quatro metais: ' + m.metais);
  assert.deepEqual(m.series, [['seq', 'recorde', 7], ['dia', 'dias', 5], ['cap', 'caps', 7], ['mem', 'lembrados', 6], ['df', 'discFechadas', 4]]);
  assert.doesNotMatch(m.como, /hora|questõ|acert|minuto|simulado|meta/i, 'saíram as de horas, questões, acertos, pontos por minuto e simulados'); assert.equal(m.niveis, 10); assert.deepEqual(m.pts, { capitulo: 30, lembrado: 3, lei: 10, dia: 20, medalha: 50 });
  // os dados dizem: 19 capítulos fecham a disciplina; cartões lembrados contam conceitos
  await p.evaluate(() => { for (const id of APOSTILAS[0].ids) concluirCapitulo(id); for (const c of DB.cartoes.slice(0, 12)) responderCartao(c.id, true); salvar(); jogoConferir({ silencioso: true }); });
  const s = await p.evaluate(() => { const s = jogoEstado(); return [s.caps, s.lembrados, s.discFechadas, s.dias, s.ganhas.sort().join(), s.xp, s.nivel]; });
  assert.deepEqual(s, [19, 12, 1, 1, 'cap1,cap10,cap5,df1,dia1,mem10', 19 * 30 + 12 * 3 + 20 + 6 * 50, 4]);
  await nav(p, 'mais'); await p.click('#view [data-kf-ir="medalhas"]');
  const t = await p.locator('#view').innerText(); assert.match(t, /6\s*de 30 medalhas/); for (const f of ['Dias seguidos', 'Capítulos', 'Conceitos lembrados', 'Disciplina fechada', 'Quase lá']) assert.ok(t.includes(f), f);
  assert.equal(await p.locator('#view .medalhas .medalha').count(), 30); assert.equal(await p.locator('#view .medalhas .medalha.tem').count(), 6);
  // medalha em 3D: gira com as setas; com movimento reduzido fica parada
  await p.emulateMedia({ reducedMotion: 'reduce' });
  await p.click('#view .medalhas [data-act="medalha"][data-id="cap1"]'); await p.locator('.kf-dlg .med3d').waitFor();
  if (await p.evaluate(() => document.querySelector('.kf-dlg .med3d').classList.contains('med3d-viva'))) {
    const a0 = await p.getAttribute('.kf-dlg .med3d', 'data-ang'); await p.waitForTimeout(400);
    assert.equal(await p.getAttribute('.kf-dlg .med3d', 'data-ang'), a0, 'com movimento reduzido a medalha não gira sozinha');
    await p.focus('.kf-dlg .med3d'); await p.keyboard.press('ArrowRight'); assert.notEqual(await p.getAttribute('.kf-dlg .med3d', 'data-ang'), a0, 'as setas giram a medalha');
  } else assert.ok(await p.locator('.kf-dlg .med3d .med-svg').isVisible(), 'sem WebGL, fica a medalha desenhada');
  assert.match(await p.getAttribute('.kf-dlg .med3d', 'aria-label'), /Medalha Capítulo I/); await p.keyboard.press('Escape');
  // desligadas, somem da tela Mais e da festa; nada é apagado
  await p.evaluate(() => { cfg().jogo = false; salvar(); irPara('mais'); }); assert.equal(await p.locator('#view [data-kf-ir="medalhas"]').count(), 0); assert.equal(await p.evaluate(() => DB.marcos.filter(x => x.id.startsWith('m:')).length), 6);
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('leis na íntegra: lista por disciplina, texto do Planalto sem alteração, sumário e revogados; abrir não conta nada', async () => {
  const arqs = readdirSync(new URL('../leis/', import.meta.url)).filter(f => f.endsWith('.json'));
  const a = await abrir(), p = a.page; await p.locator('#view .hoje-folha').waitFor();
  const L = await p.evaluate(() => LEIS.map(l => [l.id, !!topico(l.t)])); assert.equal(L.length, 24); assert.ok(L.every(x => x[1]), 'toda lei tem assunto'); assert.deepEqual(arqs.sort(), L.map(x => x[0] + '.json').sort());
  for (const f of arqs) { const j = JSON.parse(readFileSync(new URL('../leis/' + f, import.meta.url), 'utf8')); assert.match(j.fonte, /^https:\/\/www\.planalto\.gov\.br\/ccivil_03\//); assert.ok(j.p.length > 50 && j.p.every(x => typeof x.t === 'string' && x.t), f); }
  await nav(p, 'mais'); await p.click('#view [data-kf-ir="leis"]'); assert.equal(await p.locator('#view [data-act="abrir-lei"]').count(), 24);
  await p.click('#view [data-act="abrir-lei"][data-id="lgpd"]'); await p.locator('#view .lei-folha p').first().waitFor();
  const lgpd = JSON.parse(readFileSync(new URL('../leis/lgpd.json', import.meta.url), 'utf8'));
  const tela = await p.evaluate(() => ({ txt: [...document.querySelectorAll('.lei-folha p')].map(e => e.textContent), risc: document.querySelectorAll('.lei-folha .lei-r s').length, art: document.querySelector('.lei-folha .lei-art b').textContent, link: document.querySelector('#view .apoio a').href, botoes: [...document.querySelectorAll('#view .kf-btn')].map(b => b.textContent.trim()) }));
  assert.deepEqual(tela.txt, lgpd.p.map(x => x.t), 'o texto da tela é o do arquivo, sem alteração'); assert.equal(tela.risc, lgpd.p.filter(x => x.r).length); assert.equal(tela.art, 'Art. 1º'); assert.equal(tela.link, lgpd.fonte);
  assert.deepEqual(tela.botoes, ['Sumário'], 'não há mais botão de sessão na lei');
  const sum = await p.locator('#lei-sumario .lei-ir b').allInnerTexts(); assert.ok(sum.length >= 10 && sum[0] === 'CAPÍTULO I' && sum.includes('CAPÍTULO IX'), 'capítulos e seções da LGPD');
  await p.locator('#lei-sumario .lei-ir', { hasText: 'CAPÍTULO VIII' }).first().click(); await p.waitForTimeout(3000);
  const ir = await p.evaluate(() => { const e = document.activeElement, y = e.getBoundingClientRect().top; return [e.textContent, y >= 0 && y < innerHeight / 2 || Math.round(y) + '/' + innerHeight, document.querySelector('#lei-topo').classList.contains('visivel')]; }); assert.deepEqual(ir, ['CAPÍTULO VIII DA FISCALIZAÇÃO', true, true]);
  assert.ok(await p.locator('.lei-folha .lei-r').first().isVisible()); await p.click('label[for="lei-rev"], #lei-rev >> xpath=..'); assert.equal(await p.locator('.lei-folha .lei-r').first().isVisible(), false, 'dá para ocultar o revogado');
  assert.deepEqual(await p.evaluate(() => [DB.dias.length, leiDoAssunto('anpd-lgpd-10'), leiDoAssunto('anpd-dc-09'), leiDoAssunto('anpd-etica-03'), leiDoAssunto('anpd-ti-07')]), [0, { id: 'lgpd', art: '17' }, { id: 'cf', art: '170' }, { id: 'l12527', art: '' }, null], 'abrir a lei não conta nada');
  await p.evaluate(() => { leiId = 'd9203'; irPara('lei'); }); await p.locator('#lei-sumario .lei-arts .lei-ir').first().waitFor(); assert.ok(await p.locator('#lei-sumario .lei-arts .lei-ir').count() >= 15);
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('discursiva: temas oficiais e do instrutor, contagem de linhas, rascunho guardado e envio para correção dentro da tela', async () => {
  const a = await abrir(), p = a.page; await p.locator('#view .hoje-folha').waitFor();
  const d = await p.evaluate(() => DISCURSIVAS.map(x => [x.id, x.oficial, !x.url || /^https:\/\/cdn\.cebraspe\.org\.br\//.test(x.url), !!materia(x.m), x.topicos.length >= 3, x.espera.length >= 3, x.oficial ? !!x.url : !x.url]));
  assert.equal(d.length, 6); assert.equal(d.filter(x => x[1]).length, 3); for (const x of d) assert.deepEqual(x.slice(2), [true, true, true, true, true], x[0]);
  await nav(p, 'mais'); await p.click('#view [data-kf-ir="discursivas"]'); await p.click('#view [data-act="abrir-red"][data-id="i-incidente"]'); await p.locator('#ds-txt').waitFor();
  assert.ok(await semCampoEmFoco(p), 'a tela abriu com a caixa de texto em foco');
  assert.match(await p.locator('#view .disc-top').innerText(), /7,5 pts/); assert.equal(await p.locator('#view [aria-labelledby="ds-es"] details').evaluate(e => e.open), false, 'o espelho fica fechado até a pessoa abrir');
  await p.evaluate(() => { window.copiarTexto = async t => { window.__copiado = t; return true; }; window.open = (...x) => { window.__abriu = x; }; });
  await p.fill('#ds-txt', 'Texto curto.'); await p.click('#ds-enviar');
  assert.equal(await p.evaluate(() => window.__copiado || ''), '', 'texto curto demais não é enviado'); assert.equal(await p.getAttribute('#ds-txt', 'aria-invalid'), 'true');
  const frase = 'O controlador comunica à ANPD e aos titulares o incidente que possa acarretar risco ou dano relevante. ';
  await p.fill('#ds-txt', frase.repeat(22)); assert.match(await p.locator('#ds-cont').innerText(), /374 palavras, perto de 34 linhas de 30\. Passou do limite/);
  await p.fill('#ds-txt', frase.repeat(12)); await p.locator('#ds-txt').blur();
  assert.deepEqual(await p.evaluate(() => DB.redacoes.map(r => [r.id, r.txt.length > 1000, r.env])), [['i-incidente', true, 0]], 'o rascunho fica guardado');
  await p.click('#ds-enviar');
  assert.match(await p.evaluate(() => window.__copiado), /\[Estudo Fácil · discursiva para correção\][\s\S]*id i-incidente[\s\S]*até 30 linhas, 30 pontos[\s\S]*Meu texto \(cerca de 19 linhas\)[\s\S]*Corrija como a banca/);
  assert.ok(await esperar(() => p.evaluate(() => DB.redacoes[0].env > 0 && /claude\.ai\/project/.test(window.__abriu[0]))), 'o envio abre o Claude');
  // a correção gravada pelo instrutor aparece junto do texto, que continua lá; a tela Instrutor saiu
  await p.evaluate(() => { INSTRUTOR = { 'disc:i-incidente': [{ em: '16/11/2026', r: 'Tópico 1: 6,5 de 7,5. Faltou citar o art. 48.' }] }; render(); });
  assert.match(await p.locator('#view [aria-labelledby="ds-co"]').innerText(), /Faltou citar o art\. 48/); assert.ok((await p.inputValue('#ds-txt')).startsWith('O controlador comunica'));
  assert.equal(await p.evaluate(() => { irPara('instrutor'); return tab; }), 'hoje', 'a tela Instrutor não existe mais');
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('Ajustes: as oito guias comuns e as duas do app; dias de estudo e nome (com a primeira medalha)', async () => {
  const a = await abrir(), p = a.page; await p.locator('#view .hoje-folha').waitFor();
  await nav(p, 'mais'); await p.click('#view [data-kf="ajustes"]'); await p.locator('.kf-aj-h').waitFor();
  const g = await guiasAjustes(p);
  assert.deepEqual(g.comuns, GUIAS_COMUNS); assert.deepEqual(g.produto, ['Rotina', 'Medalhas e apresentação']);
  await p.click('.kf-aj-lista [data-kf-aj-ir="rotina"]'); await p.locator('[data-dia="6"]').waitFor();
  assert.deepEqual(await p.locator('[data-dia][aria-pressed="true"]').evaluateAll(L => L.map(b => +b.dataset.dia)), [1, 2, 3, 4, 5], 'de fábrica, sábado e domingo são livres');
  assert.equal(await p.locator('#aj-meta, #aj-q, #aj-bloco, #aj-rev, #aj-som').count(), 0, 'sem meta de tempo, de questões, blocos, revisões ou som');
  await p.click('[data-dia="6"]'); assert.deepEqual(await p.evaluate(() => cfg().dias), [1, 2, 3, 4, 5, 6]);
  await p.evaluate(() => KitFacil.ajustes.ir('conta')); await p.locator('#aj-nome').waitFor();
  await p.fill('#aj-nome', 'Bruno'); await p.click('#aj-nome-f button[type=submit]');
  await p.locator('.kf-dlg .mn-nome', { hasText: 'Prazer em conhecer' }).waitFor();
  assert.equal(await p.evaluate(() => cfg().nome), 'Bruno'); await p.keyboard.press('Escape');
  // apagar tudo: o app volta ao começo, com os editais de fábrica
  await p.evaluate(() => { concluirCapitulo('anpd-lgpd-01'); salvar({ quieto: true }); jogoConferir({ silencioso: true }); KitFacil.ajustes.ir('privacidade'); }); await p.locator('#aj-apagar').waitFor();
  await p.click('#aj-apagar'); await p.locator('.kf-dlg [data-kf-ok]').click();
  assert.ok(await esperar(() => p.evaluate(() => DB.concursos.length === 2 && DB.topicos.length === 201 && !DB.topicos.some(t => t.teoria) && !DB.dias.length && !DB.marcos.some(m => m.id.startsWith('m:')) && cfg().nome === '')), 'apagar tudo');
  assert.deepEqual(a.erros, []);
  await a.fechar();
});

test('segurança: texto de fora é protegido antes de ir para a tela', async () => {
  const a = await abrir(), p = a.page; await p.locator('#view .hoje-folha').waitFor(); await pronto(p);
  await p.evaluate(() => { const x = '<img src=x onerror="window.__xss=1"><b id="inj">oi</b>'; cfg().nome = x; for (const m of DB.materias) m.nome = x; for (const t of DB.topicos) t.nome = x; for (const c of DB.concursos) { c.sigla = x; c.cargo = x; c.orgao = x; c.banca = x; c.datas.forEach(d => { d.titulo = x; }); }
    const A = AP_TXT['anpd-lgpd']; A.base = x; for (const c of A.caps) { c.titulo = x; c.b.push(['p', x], ['h', x], ['li', x], ['lei', x], ['ex', x], ['banca', x], ['item', 'C', x, x], ['res', x]); for (const k of c.cartoes) { k.f = x; k.v = x; } }
    concluirCapitulo('anpd-lgpd-01'); for (const c of DB.cartoes) c.due = hojeISO(); DB.redacoes.push({ id: 'anm24-lgpd', txt: '</textarea><b id="inj">t</b>', env: 0 }); INSTRUTOR = { 'disc:anm24-lgpd': [{ em: '<i id="inj">x</i>', r: '<img src=x onerror="window.__xss=1">' }] }; salvar(); jogoConferir({ silencioso: true }); });
  for (const t of ['hoje', 'apostilas', 'apostila', 'capitulo', 'dose', 'relembrar', 'edital', 'medalhas', 'semanas', 'leis', 'discursivas', 'discursiva', 'mais', 'ajustes']) {
    await p.evaluate(t => { apId = 'anpd-lgpd'; capId = 'anpd-lgpd-01'; doseId = 'anpd-lgpd-01'; redId = 'anm24-lgpd'; capFim = t === 'capitulo' ? { t: 'anpd-lgpd-01', novos: 3, reler: true } : null; irPara(t); }, t); await p.waitForTimeout(150);
    if (t === 'edital') { await p.locator('#view details.disc summary').first().click(); await p.locator('#view [data-act="assunto"]').first().click(); await p.waitForTimeout(200); await p.keyboard.press('Escape'); }
    if (t === 'relembrar') { await p.click('#rel-ver'); await p.click('#rel-nao'); await p.locator('#rel-seguir').waitFor(); }
    assert.equal(await p.evaluate(() => !!document.querySelector('#inj') || !!window.__xss), false, 'HTML injetado em ' + t);
  }
  await p.evaluate(() => sobreSequencia()); await p.waitForTimeout(200); assert.equal(await p.evaluate(() => !!document.querySelector('#inj') || !!window.__xss), false);
  const csp = await p.evaluate(() => document.querySelector('meta[http-equiv="Content-Security-Policy"]').content); assert.match(csp, /object-src 'none'/); assert.match(csp, /script-src 'self' https:\/\/cdnjs/); assert.doesNotMatch(csp, /script-src[^;]*'unsafe-inline'/);
  await a.fechar();
});

test('quem vem da 1.13 (formato 3) chega ao desenho novo com nome, capítulos, dias e discursiva; a cópia antiga fica guardada', async () => {
  const v3 = { v: 3, cfg: { nome: 'Bruno', metaMin: 60, dias: [0, 1, 2, 3, 4, 5, 6], jogo: true }, ativa: { t: 'anpd-lgpd-02' }, concursos: [{ id: 'anpd-2027', disc: [] }], materias: [], topicos: [{ id: 'anpd-lgpd-01', m: 'anpd-lgpd', nome: 'x', teoria: 1764000000000 }, { id: 'anpd-lgpd-02', m: 'anpd-lgpd', nome: 'y', teoria: 0 }],
    sessoes: [{ id: 's1', t: 'anpd-lgpd-01', seg: 3600 }], revisoes: [{ id: 'r1', t: 'anpd-lgpd-01', due: '2026-11-27' }], respostas: [{ id: 'lgpd-001', ok: true }], cadernos: [], textos: [], redacoes: [{ id: 'i-incidente', txt: 'Meu texto', env: 0 }], dias: [{ id: '2026-11-19', min: 60 }, { id: '2026-11-20', min: 60 }], marcos: [{ id: 'm:primeira', em: 1 }], simulados: [], eventos: [] };
  const b = await abrir(), p = b.page; await p.locator('#view .hoje-folha').waitFor();
  await p.evaluate(v3 => { localStorage.clear(); localStorage.setItem('estudofacil.db', JSON.stringify(v3)); }, v3); await p.reload(); await p.locator('#view .hoje-folha').waitFor(); await pronto(p);
  const r = await p.evaluate(() => ({ v: DB.v, nome: cfg().nome, dias: cfg().dias, feitos: DB.topicos.filter(t => t.teoria).map(t => t.id), dd: DB.dias, red: DB.redacoes.map(x => x.id), marcos: DB.marcos.filter(m => m.id.startsWith('m:') && m.id === 'm:primeira').length, colls: Object.keys(DB).sort(), antigo: JSON.parse(localStorage.getItem('estudofacil.db_v3')).sessoes.length, seq: sequencia().n, conc: DB.concursos.map(c => c.disc.length) }));
  assert.deepEqual(r, { v: 4, nome: 'Bruno', dias: [1, 2, 3, 4, 5], feitos: ['anpd-lgpd-01'], dd: [{ id: '2026-11-19', cap: 0, car: 0, lei: 0, vale: true }, { id: '2026-11-20', cap: 0, car: 0, lei: 0, vale: true }], red: ['i-incidente'], marcos: 0, colls: ['cartoes', 'cfg', 'concursos', 'dias', 'marcos', 'materias', 'redacoes', 'topicos', 'v'], antigo: 1, seq: 2, conc: [12, 13] });
  // o capítulo que já estava concluído recebe os cartões quando a apostila chega
  assert.ok(await esperar(() => p.evaluate(() => DB.cartoes.length === 6 && DB.cartoes.every(c => c.t === 'anpd-lgpd-01' && c.due === '2026-11-24'))), 'os cartões do capítulo já concluído');
  assert.deepEqual(await p.evaluate(() => Object.keys(localStorage).filter(k => !k.startsWith('estudofacil.') && !k.startsWith('kitfacil.'))), [], 'restaurar padrões usa o prefixo do app');
  // formato mais antigo ainda (0.x): começa de novo, com a cópia guardada
  await p.evaluate(() => { localStorage.clear(); localStorage.setItem('estudofacil.db', JSON.stringify({ v: 2, materias: [{ id: 'x', nome: 'Antiga' }] })); }); await p.reload(); await p.locator('#view .hoje-folha').waitFor();
  assert.deepEqual(await p.evaluate(() => [DB.v, DB.materias.some(m => m.nome === 'Antiga'), JSON.parse(localStorage.getItem('estudofacil.db_antigo')).v]), [4, false, 2]);
  await b.fechar();
});

test('cópia de segurança: baixa no formato da família e restaura', async () => {
  const a = await abrir(), p = a.page; await p.locator('#view .hoje-folha').waitFor(); await pronto(p);
  await p.evaluate(() => { concluirCapitulo('anpd-lgpd-01'); salvar(); jogoConferir({ silencioso: true }); });
  await nav(p, 'mais'); await p.click('#view [data-kf="ajustes"]'); await p.click('.kf-aj-lista [data-kf-aj-ir="sincronizacao"]');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('[data-kf="copia-baixar"]')]);
  const caminho = await dl.path(), copia = JSON.parse(await readFile(caminho, 'utf8'));
  assert.equal(copia.formato, 'copia-facil'); assert.equal(copia.app, 'estudo-facil'); assert.equal(copia.dados.v, 4); assert.equal(copia.dados.cartoes.length, 6); assert.equal(copia.dados.dias.length, 1);
  await p.evaluate(() => { DB.cartoes = []; DB.dias = []; topico('anpd-lgpd-01').teoria = 0; salvar(); });
  const [seletor] = await Promise.all([p.waitForEvent('filechooser'), p.click('[data-kf="copia-restaurar"]')]);
  await seletor.setFiles(caminho); await p.locator('.kf-dlg [data-kf-ok]').click();
  assert.ok(await esperar(() => p.evaluate(() => DB.cartoes.length === 6 && DB.dias.length === 1 && !!topico('anpd-lgpd-01').teoria)), 'a cópia não foi restaurada');
  await a.fechar();
});

test('sincronização: o outro aparelho recebe capítulos, cartões, dias e medalhas; a exclusão também viaja; o gist vai criptografado', async () => {
  const gh = githubFalso(), A = await abrir({ github: gh }), B = await abrir({ github: gh });
  await A.page.locator('#view .hoje-folha').waitFor(); await B.page.locator('#view .hoje-folha').waitFor(); await pronto(A.page); await pronto(B.page);
  const ligar = async p => { await p.click('[data-kf-nuvem]'); await p.click('.kf-dlg [data-kf="sync-ativar"]'); await p.fill('#kf-token', TOKEN_TESTE); await p.click('[data-kf-conectar]'); };
  await A.page.evaluate(() => { cfg().nome = 'Bruno'; concluirCapitulo('anpd-lgpd-01'); lerDose('anpd-lgpd-01'); responderCartao('anpd-lgpd-01#a', true); DB.redacoes.push({ id: 'i-agencia', txt: 'Rascunho', env: 0 }); salvar(); jogoConferir({ silencioso: true }); });
  await ligar(A.page);
  assert.ok(await esperar(() => A.page.evaluate(() => SY.ligada() && SY.estado.lastSync > 0)), 'A não sincronizou');
  assert.ok(await esperar(async () => (await A.page.getAttribute('[data-kf-nuvem]', 'data-estado')) === 'sincronizado'), 'a nuvem não mostra Sincronizado');
  const arq = gh.arquivo('estudo-facil.json'); assert.ok(arq && !/anpd-lgpd/.test(arq.conteudo), 'o gist deveria estar criptografado');
  await ligar(B.page);
  assert.ok(await esperar(() => B.page.evaluate(() => cfg().nome === 'Bruno' && !!topico('anpd-lgpd-01').teoria && !!topico('anpd-lgpd-01').lei && DB.cartoes.length === 6 && DB.cartoes.find(c => c.id === 'anpd-lgpd-01#a').ok === 1 && DB.dias.length === 1 && DB.dias[0].vale && temMarco('m:cap1') && DB.redacoes.length === 1)), 'B não recebeu capítulo, cartões, dia, medalha e rascunho');
  assert.equal(await B.page.evaluate(() => DB.concursos.length + ':' + DB.materias.length + ':' + DB.topicos.length), '2:20:201', 'nada duplicado ao juntar');
  // B apaga o rascunho; A recebe a exclusão
  await B.page.evaluate(() => { DB.redacoes = []; salvar(); return SY.agora({ quiet: true }); });
  assert.ok(await esperar(() => B.page.evaluate(async () => { await SY.agora({ quiet: true }); return !SY.estado.sujo; })), 'B não enviou a exclusão');
  assert.ok(await esperar(() => A.page.evaluate(async () => { await SY.agora({ quiet: true }); return DB.redacoes.length === 0 && DB.cartoes.length === 6; })), 'a exclusão não chegou ao A');
  assert.deepEqual(A.erros.concat(B.erros), []);
  await A.fechar(); await B.fechar();
});

test('abertura: quatro telas, uma vez só; o cartão de exemplo vira; quem diz o nome ganha a primeira medalha', async () => {
  const a = await abrir({ antes: () => { window.EF_TESTE_ABERTURA = true; } }), p = a.page;
  await p.locator('.kf-abertura').waitFor();
  assert.equal(await p.locator('.kf-ab-pontos i').count(), 4); assert.match(await p.locator('.kf-ab-t').innerText(), /Estudar no caminho, do jeito fácil/);
  await p.click('#kf-ab-prox'); assert.match(await p.locator('.kf-ab-p').innerText(), /um capítulo concluído ou com a revisão dos cartões\. Sábado e domingo são livres/);
  await p.click('#kf-ab-prox'); await p.click('[data-ab-virar]'); assert.match(await p.locator('.ab-cartao .rel-v').innerText(), /O controlador decide/);
  await p.click('#kf-ab-prox'); await p.locator('#ab-eu').waitFor();
  assert.equal(await p.locator('#kf-ab-pular').isVisible(), false, 'a última tela não tem Pular');
  assert.ok(await semCampoEmFoco(p)); await p.fill('#ab-eu', 'Bruno'); await p.click('#kf-ab-prox');
  await p.locator('.kf-dlg .mn-nome', { hasText: 'Prazer em conhecer' }).waitFor();
  assert.equal(await p.evaluate(() => cfg().nome + ':' + KitFacil.abertura.vista()), 'Bruno:true');
  await p.reload(); await p.locator('#view .hoje-folha').waitFor();
  assert.equal(await p.locator('.kf-abertura').count(), 0, 'a abertura não volta sozinha');
  assert.match(await p.locator('#view .tela-sub').innerText(), /Bruno/);
  assert.deepEqual(a.erros, []);
  await a.fechar();
});
