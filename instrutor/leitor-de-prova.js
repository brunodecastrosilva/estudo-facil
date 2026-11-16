/* Estudo Fácil · leitor de caderno de prova do Cebraspe (PDF). Não faz parte do app: é a ferramenta da "ponte".
   O texto da prova nunca entra no repositório. O PDF oficial é lido no navegador do Bruno, numa página do próprio
   site da banca (cdn.cebraspe.org.br), e o resultado segue pelo endereço (#prova=...) para o app, que guarda tudo só
   nos dados do aparelho (e na sincronização criptografada, se estiver ligada). O passo a passo está no fim do arquivo.
   Como o caderno é montado: duas colunas; o número do item fica sozinho na margem da coluna; as linhas seguintes do
   item vêm recuadas; texto de apoio e comando ("Julgue os itens...") começam na margem. */
async function lerCadernoPDF(pdfjs, bytes, { de = 1, ate = 0 } = {}) {
  const doc = await pdfjs.getDocument({ data: bytes }).promise, linhas = [], corpo = {}, altura = {};
  const MARCO = /^[-–—]{1,3}\s*[A-ZÁÉÍÓÚÂÊÔÃÕÇ ]{6,}\s*[-–—]{1,3}$/;
  for (let i = 1; i <= doc.numPages; i++) {
    const pg = await doc.getPage(i), vp = pg.getViewport({ scale: 1 }), tc = await pg.getTextContent(), cols = [[], []], peso = {}, alt = {};
    let T = tc.items.filter(it => it.str).map(it => ({ x: it.transform[4], y: it.transform[5], w: it.width, s: it.str, f: it.fontName, h: it.height }));
    // cabeçalho e rodapé da página; na primeira página, as instruções ficam acima do marco "-- PROVAS OBJETIVAS --"
    T = T.filter(t => t.y <= vp.height - 45 && t.y >= 25);
    const marcos = T.filter(t => MARCO.test(t.s.trim()));
    if (i === 1 && marcos.length) { const topo = Math.max(...marcos.map(t => t.y)); T = T.filter(t => t.y < topo + 1); }
    T = T.filter(t => !MARCO.test(t.s.trim()));
    for (const t of T) { if (t.s.trim()) { peso[t.f] = (peso[t.f] || 0) + t.s.length; alt[t.f] = t.h; } cols[t.x < vp.width / 2 ? 0 : 1].push(t); }
    corpo[i] = Object.keys(peso).sort((a, b) => peso[b] - peso[a])[0]; altura[i] = alt[corpo[i]] || 10;
    cols.forEach((C, c) => { C.sort((a, b) => b.y - a.y); const hc = altura[i], N = [], M = []; let L = null;
      for (const t of C.filter(t => t.h >= hc * 0.8)) { if (!L || Math.abs(L.y - t.y) > 2.5) { L = { pg: i, col: c, y: t.y, ts: [] }; N.push(L); } L.ts.push(t); }
      // sobrescritos (o "o" de "n.º") entram na linha de texto mais próxima; letra miúda solta (créditos) forma linha própria
      L = null; for (const t of C.filter(t => t.h < hc * 0.8)) { const p = N.filter(l => Math.abs(l.y - t.y) <= 6).sort((a, b) => Math.abs(a.y - t.y) - Math.abs(b.y - t.y))[0];
        if (p) p.ts.push(t); else { if (!L || Math.abs(L.y - t.y) > 2.5) { L = { pg: i, col: c, y: t.y, ts: [] }; M.push(L); } L.ts.push(t); } }
      linhas.push(...N.concat(M).sort((a, b) => b.y - a.y)); });
  }
  // cada linha vira texto: espaço onde há vão entre os pedaços; \u0001 e \u0002 cercam o trecho em destaque (negrito ou itálico)
  const conta = [{}, {}];
  for (const L of linhas) {
    L.ts.sort((a, b) => a.x - b.x); const v = L.ts.filter(t => t.s.trim());
    if (!v.length) { L.vazia = true; continue; }
    const fc = corpo[L.pg], hc = altura[L.pg]; L.x = v[0].x; L.h = v[0].h; L.hc = hc; L.v = v;
    let s = '', ant = null, enf = false;
    for (const t of L.ts) {
      if (!t.s.trim()) { if (s && !s.endsWith(' ')) s += ' '; continue; }
      const e = t.f !== fc && Math.abs(t.h - hc) < 0.8;
      if (ant && t.x - (ant.x + ant.w) > t.h * 0.16 && !s.endsWith(' ') && !t.s.startsWith(' ')) s += ' ';
      if (e !== enf) { s += e ? '\u0001' : '\u0002'; enf = e; }
      s += t.s; ant = t;
    }
    if (enf) s += '\u0002';
    L.t = s.replace(/\s+/g, ' ').replace(/\u0001 /g, ' \u0001').replace(/ \u0002/g, '\u0002 ').replace(/\u0002( ?)\u0001/g, '$1').replace(/\u0001\u0002/g, '').replace(/\s+/g, ' ').trim();
    if (/^[\u0001\u0002]*Espaço livre[\u0001\u0002]*$/i.test(L.t)) { L.vazia = true; continue; }
    const k = Math.round(L.x); conta[L.col][k] = (conta[L.col][k] || 0) + 1;
  }
  const uteis = linhas.filter(L => !L.vazia);
  const margem = conta.map(c => { const k = Object.keys(c).filter(x => c[x] >= 5).map(Number); return k.length ? Math.min(...k) : 0; });
  const saltos = []; for (let k = 1; k < uteis.length; k++) { const a = uteis[k - 1], b = uteis[k], d = a.y - b.y; if (a.pg === b.pg && a.col === b.col && d > 7 && d < 22) saltos.push(d); }
  saltos.sort((a, b) => a - b); const passo = saltos.length ? saltos[saltos.length >> 1] : 11;

  const itens = {}, grupos = []; let atual = null, ctx = [], prox = null, ult = null, fim = false;
  const fecha = () => { if (atual) { itens[atual.n] = atual.p.join(' ').replace(/\s+/g, ' ').trim(); atual = null; } };
  for (const L of uteis) {
    if (fim) break;
    const mg = margem[L.col], t0 = L.v[0], n = /^\d{1,3}$/.test(t0.s.trim()) && Math.abs(t0.x - mg) < 3 ? +t0.s.trim() : 0;
    const mesma = ult && ult.pg === L.pg && ult.col === L.col, salto = mesma ? ult.y - L.y : 0, recuada = L.x >= mg + 8;
    if (n && (n === prox || (prox === null && (n === 1 || n === de))) && (L.v.length === 1 || L.v[1].x >= mg + 8)) {
      fecha(); if (ctx.length) grupos.push({ de: n, L: ctx }); ctx = [];
      atual = { n, dx: (L.v[1] ? L.v[1].x : mg + 18) - mg, p: [L.t.replace(/^[\u0001\u0002]*\d{1,3}[\u0001\u0002]*\s*/, '')] }; prox = n + 1;
    // continua o item a linha no mesmo recuo dele (medido da margem da coluna, porque o item pode mudar de coluna); recuo maior (lista, código) só se vier colada na linha de cima
    } else if (atual && recuada && (Math.abs(L.x - mg - atual.dx) < 4 ? salto <= passo * 1.3 : mesma && L.x - mg > atual.dx && L.x <= mg + 60 && salto <= passo * 1.15)) atual.p.push(L.t);
    else {
      if (atual && ate && atual.n >= ate) { fecha(); fim = true; break; }
      fecha(); ctx.push({ t: L.t, par: !ctx.length || salto > passo * 1.3 || recuada, peq: L.h < L.hc - 1.5 });
    }
    ult = L;
  }
  fecha();
  // o que vem antes de um item: texto de apoio (parágrafos) e, por último, o comando
  for (const g of grupos) {
    const P = []; for (const l of g.L) { const u = P[P.length - 1]; if (l.par || !u || l.peq !== u.peq) P.push({ t: l.t, peq: l.peq }); else u.t += ' ' + l.t; }
    const u = P[P.length - 1]; g.cmd = u && /julgue|judge|ite[mn]s?\b/i.test(u.t) ? P.pop().t : ''; g.apoio = P.map(p => p.t).join('\n'); delete g.L;
  }
  return { itens, grupos };
}

/* A ponte (quem opera é o Claude, pelo Claude in Chrome, no computador do Bruno; ele não precisa fazer nada):
   1. abrir uma página qualquer de https://cdn.cebraspe.org.br/ (um endereço que não existe serve: dá a página 404);
   2. nela, carregar o pdf.js 3.11.174 (cdnjs: pdf.min.js e pdf.worker.min.js) e este arquivo, e chamar
      enviarProvaAoApp(pdfjsLib, '<id da prova em provas.js>', '<endereço do caderno>', de, ate);
   3. a página vai para o app com a prova no endereço; o app confere (veio do site da banca, bate com o gabarito
      cadastrado) e guarda. O site da banca não deixa o app buscar o PDF sozinho (CORS), por isso a ponte. */
async function enviarProvaAoApp(pdfjs, id, url, de, ate, app = 'https://brunodecastrosilva.github.io/estudo-facil/') {
  const bytes = await (await fetch(url)).arrayBuffer(), r = await lerCadernoPDF(pdfjs, bytes, { de, ate });
  const faltam = []; for (let n = de; n <= ate; n++) if (!(n in r.itens)) faltam.push(n);
  if (faltam.length) throw new Error('itens não encontrados: ' + faltam.join(', '));
  const json = JSON.stringify({ v: 1, prova: id, itens: r.itens, grupos: r.grupos }), b = new TextEncoder().encode(json);
  let bin = ''; for (let i = 0; i < b.length; i += 8192) bin += String.fromCharCode(...b.subarray(i, i + 8192));
  location.href = app + '#prova=' + btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
