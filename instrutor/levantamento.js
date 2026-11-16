/* Estudo Fácil · levantamento em lote de provas do Cebraspe. Não faz parte do app: é ferramenta da "ponte".
   Roda numa página de https://cdn.cebraspe.org.br/ (o site da banca não deixa outro endereço buscar os PDFs), depois
   de carregados o pdf.js 3.11.174 e o leitor-de-prova.js. Para cada caderno com gabarito definitivo próprio:
   lê o gabarito (dois caminhos, que têm de concordar), lê o caderno, separa os itens por disciplina do edital da ANPD
   pelas palavras do comando, tira os itens repetidos entre cadernos e guarda o resultado no IndexedDB DESTA página.
   O texto das provas não vai para o repositório nem para a conversa: só segue, pela ponte, para o app. */
const LV = { vistos: new Set(), res: {}, erros: {}, feito: 0, total: 0, fim: 0 };
const lvBanco = () => new Promise((ok, no) => { const r = indexedDB.open('ef-levantamento', 1); r.onupgradeneeded = () => r.result.createObjectStore('provas'); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); });
const lvOp = async (modo, f) => { const db = await lvBanco(); return new Promise((ok, no) => { const tx = db.transaction('provas', modo), r = f(tx.objectStore('provas')); tx.oncomplete = () => ok(r && r.result); tx.onerror = () => no(tx.error); }); };
const lvPor = (k, v) => lvOp('readwrite', s => s.put(v, k));
const lvLer = k => lvOp('readonly', s => s.get(k));
const lvChaves = () => lvOp('readonly', s => s.getAllKeys());
const lvTudo = () => lvOp('readonly', s => s.getAll());

/* Gabarito definitivo: linhas de números com a linha de letras logo abaixo. Caminho A: cada número com a letra mais
   próxima abaixo dele. Caminho B: linhas emparelhadas, na ordem. Só vale se os dois concordarem. */
async function lerGabarito(pdfjs, bytes) {
  const doc = await pdfjs.getDocument({ data: bytes }).promise, T = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const tc = await (await doc.getPage(i)).getTextContent();
    for (const it of tc.items) { const s = it.str; if (!s.trim()) continue; const re = /\S+/g; let m;
      while ((m = re.exec(s))) T.push({ pg: i, y: it.transform[5], x: it.transform[4] + (s.length ? it.width * (m.index + m[0].length / 2) / s.length : 0), s: m[0] }); }
  }
  const linhas = []; T.sort((a, b) => a.pg - b.pg || b.y - a.y || a.x - b.x);
  for (const t of T) { const u = linhas[linhas.length - 1]; if (u && u.pg === t.pg && Math.abs(u.y - t.y) < 2.5) u.ts.push(t); else linhas.push({ pg: t.pg, y: t.y, ts: [t] }); }
  for (const L of linhas) { L.ts.sort((a, b) => a.x - b.x);
    const nums = L.ts.filter(t => /^\d{1,3}$/.test(t.s)), lets = L.ts.filter(t => /^[A-EX*]$/.test(t.s));
    L.tipo = nums.length >= 3 && nums.length >= L.ts.length * 0.8 ? 'n' : lets.length >= 3 && lets.length >= L.ts.length * 0.8 ? 'l' : ''; L.v = L.tipo === 'n' ? nums : L.tipo === 'l' ? lets : []; }
  const B = {}, A = {}; let okB = true, dup = false;
  for (let i = 0; i < linhas.length; i++) { const N = linhas[i]; if (N.tipo !== 'n') continue;
    const Lt = linhas.slice(i + 1).find(l => l.pg === N.pg && l.tipo); if (!Lt || Lt.tipo !== 'l' || Lt.v.length !== N.v.length) { okB = false; continue; }
    N.v.forEach((t, k) => { if (B[+t.s]) dup = true; B[+t.s] = Lt.v[k].s; });
    for (const t of N.v) { const c = Lt.v.filter(l => Math.abs(l.x - t.x) < 9).sort((a, b) => Math.abs(a.x - t.x) - Math.abs(b.x - t.x))[0]; if (c) A[+t.s] = c.s; } }
  const ns = Object.keys(B).map(Number).sort((a, b) => a - b); if (!ns.length || !okB || dup) return { erro: dup ? 'gab-repetido' : 'gab-linhas' };
  const de = ns[0], ate = ns[ns.length - 1]; if (ate - de + 1 !== ns.length) return { erro: 'gab-buraco' };
  const cobre = Object.keys(A).length / ns.length, igual = ns.filter(n => A[n] && A[n] === B[n]).length, comA = ns.filter(n => A[n]).length;
  if (cobre >= 0.5 && igual < comA) return { erro: 'gab-diverge' };
  const gab = ns.map(n => B[n] === '*' ? 'X' : B[n]).join(''); if (/[ABD]/.test(gab)) return { erro: 'gab-multipla' };
  return { de, ate, gab, conf: cobre >= 0.5 ? 2 : 1 };
}

/* Disciplina do edital da ANPD pelas palavras do comando. A ordem importa: a primeira regra que casar vale. */
const LV_FORA = /tribut|orçament|previdenci|penal|trabalh|eleitoral|direito civil|ambient|saúde|educaç|seguridade|financeir|contab|contáb|militar|notari|registr|empresarial|família|criança|idoso|estadual|distrital|municipal|estado d[eo]|lei orgânica|regimento interno|lei complementar n\.º \d+\/\d{4}, d[eo]/i;
const LV_PROF = /profission|psicólog|psicolog|médic|enfermag|contad|jornalis|bibliotec|serviço social|assistente social|engenh|arquitet|odont|farmac|nutri|advoca|magistrat|oab/i;
const LV_REGRAS = [
  ['ing', c => /\bjudge\b|\bfollowing items?\b|\bthe (preceding |previous |above )?text\b/i.test(c)],
  ['lp', c => /lingu[ií]stic|ideias (do|d[eo]s?|veiculadas|e a)|sentidos? d[oe]|gramatic|reescrit|redação oficial|manual de redação|tipologia|coes[ãa]o|(compreensão|interpretação) d[eo] texto|classes de palavras|sintax|sintát|pontuação|ortogr|acentuação|concordância|regência|crase|norma(-| )padrão|língua portuguesa|texto CB\w+/i.test(c)],
  ['lgpd', c => /13\.709|\blgpd\b|lei geral de proteção de dados/i.test(c)],
  ['regul', c => /agências? reguladoras?|13\.848|9\.986|10\.871|impacto regulatório|teorias? da regulação|regulação (econômica|setorial|responsiva|de mercados?)|poder regulatório|atividade regulatória|10\.411|resultado regulatório|estado regulador/i.test(c)],
  ['etica', c => !LV_PROF.test(c) && /1\.171|12\.527|acesso à informação|12\.813|conflito de interesses|9\.203|7\.724|governança pública|(^|[^a-zà-ú])ética (no|na|e) (serviço|setor|administração|função|moral|cidadania)|ética no serviço público/i.test(c)],
  ['dig', c => /12\.965|marco civil|crimes? (cibernétic|informátic|digita)|12\.737|defesa do consumidor|8\.078|\bcdc\b|12\.414|cadastro positivo|\bgdpr\b|direito digital/i.test(c)],
  ['econ', c => /12\.529|defesa da concorrência|\bcade\b|falhas? de mercado|estruturas? de mercado|microeconomi|economia da regulação|monopóli|oligopóli|concorrência perfeita|custo-benefício/i.test(c)],
  ['ti', c => /segurança da informação|segurança (cibernética|de redes|em redes|de dados)|criptograf|2700[1257]|27701|inteligência artificial|aprendizado de máquina|machine learning|big data|ciência de dados|mineração de dados|anonimiza|computação em nuvem|cloud computing|bancos? de dados|modelagem de dados|qualidade de dados|malware|ataques? (cibern|a redes|e ameaças)|autenticação|controle de acesso|privacidade|redes neurais|linguagem natural|ia generativa|\bsgbd\b|data (warehouse|lake|mining)/i.test(c)],
  ['da', c => !LV_FORA.test(c) && /direito administrativo|atos? administrativos?|licitaç|14\.133|8\.112|9\.784|processo administrativo|improbidade|8\.429|poder(es)? (administrativos?|de polícia)|agentes? públicos|controle da administração|responsabilidade civil do estado|12\.846|anticorrupção|14\.129|governo digital|organização administrativa|administração (direta|indireta)|serviços públicos|contratos administrativos|regime jurídico-administrativo/i.test(c)],
  ['dc', c => !LV_FORA.test(c) && /direito constitucional|constituição federal|constituição da república|\bcf\b|direitos e (garantias|deveres)|direitos fundamentais|organização (do estado|político-administrativa|dos poderes)|poder (legislativo|executivo|judiciário)|ordem (econômica|social)|controle de constitucionalidade|processo legislativo|princípios fundamentais/i.test(c)],
];
const LV_ITEM = [['lgpd', /13\.709|\blgpd\b|lei geral de proteção de dados/i], ['regul', /13\.848|agências? reguladoras?|impacto regulatório/i], ['etica', /12\.527|lei de acesso à informação|12\.813|1\.171/i], ['dig', /12\.965|marco civil da internet/i], ['econ', /12\.529/i], ['da', /9\.784|14\.133|8\.112|8\.429|12\.846|14\.129/i]];
const lvIngles = s => { const p = (s.toLowerCase().match(/[a-zà-ú]+/g) || []); if (p.length < 40) return false; const en = p.filter(w => /^(the|of|and|to|is|that|in|for|with|are|by|as|it|this|from)$/.test(w)).length, pt = p.filter(w => /^(de|que|em|para|uma|com|os|as|não|por|do|da)$/.test(w)).length; return en > pt * 2 && en / p.length > 0.12; };
const lvLimpo = s => String(s || '').replace(/[\u0001\u0002]/g, '');
function lvClasseDoGrupo(g) { const c = lvLimpo(g.cmd); if (!c) return null; if (lvIngles(lvLimpo(g.apoio))) return 'ing'; for (const [m, f] of LV_REGRAS) if (f(c)) return m; return null; }
function lvClasseDoItem(m, texto) { if (m === 'lp' || m === 'ing') return m; const s = lvLimpo(texto); if (LV_ITEM[0][1].test(s)) return 'lgpd'; if (m) return m; for (const [k, re] of LV_ITEM) if (re.test(s)) return k; return null; }
const lvChave = s => lvLimpo(s).toLowerCase().replace(/[^a-z0-9à-ú]+/g, ' ').trim();

/* Um caderno: devolve os dados do cadastro (sem texto) e guarda o texto, só dos itens do edital, no IndexedDB. */
async function lvCaderno(pdfjs, e) {
  const base = 'https://cdn.cebraspe.org.br/concursos/';
  const gb = await lerGabarito(pdfjs, await (await fetch(base + e.gab)).arrayBuffer()); if (gb.erro) return { erro: gb.erro };
  if (gb.gab.length < 20) return { erro: 'gab-curto' };
  const bytes = await (await fetch(base + e.cad)).arrayBuffer();
  let ano = 0; try { const d = await pdfjs.getDocument({ data: bytes.slice(0) }).promise, t = (await (await d.getPage(1)).getTextContent()).items.map(i => i.str).join(' '); const m = /Aplicaç[ãa]o:\s*(?:\d{1,2}\/\d{1,2}\/)?(\d{4})/i.exec(t) || /(?:Edital|EDITAL)[^\d]{0,30}(20\d\d)/.exec(t); if (m) ano = +m[1]; } catch {}
  const r = await lerCadernoPDF(pdfjs, bytes, { de: gb.de, ate: gb.ate });
  const faltam = []; for (let n = gb.de; n <= gb.ate; n++) if (!(n in r.itens)) faltam.push(n); if (faltam.length) return { erro: 'itens-faltando', q: faltam.length };
  r.grupos.sort((a, b) => a.de - b.de); const M = {}, conta = {};
  for (let n = gb.de; n <= gb.ate; n++) {
    let g = null; for (const x of r.grupos) if (x.de <= n) g = x;
    if (g && !('m' in g)) g.m = lvClasseDoGrupo(g);
    const tx = r.itens[n] || '', gl = gb.gab[n - gb.de]; let m = lvClasseDoItem(g ? g.m : null, tx);
    if (m && (lvLimpo(tx).trim().length < 15 || tx.length > 3800)) m = null;
    if (m) { const k = lvChave(tx); if (LV.vistos.has(k)) m = null; else LV.vistos.add(k); }
    M[n] = m; if (m && (gl === 'C' || gl === 'E')) conta[m] = (conta[m] || 0) + 1;
  }
  const blocos = []; for (let n = gb.de; n <= gb.ate; n++) { const u = blocos[blocos.length - 1]; if (u && u[2] === (M[n] || 0)) u[1] = n; else blocos.push([n, n, M[n] || 0]); }
  const q = Object.values(conta).reduce((a, b) => a + b, 0);
  const itens = {}; for (let n = gb.de; n <= gb.ate; n++) itens[n] = M[n] ? r.itens[n] : '';
  const grupos = r.grupos.filter(g => { const b = blocos.find(b => g.de >= b[0] && g.de <= b[1]); return b && b[2]; }).map(g => ({ de: g.de, cmd: (g.cmd || '').slice(0, 1900), apoio: (g.apoio || '').slice(0, 11500) }));
  const nulos = r.grupos.filter(g => !g.m && g.cmd).map(g => g.de + ':' + lvLimpo(g.cmd).slice(0, 70));
  return { de: gb.de, gab: gb.gab, conf: gb.conf, ano, blocos, conta, q, nulos, texto: { itens, grupos } };
}
/* A lista: [{ id, cad, gab, nome }]. Vai guardando; pode ser chamada de novo que pula o que já foi feito. */
async function lvRodar(pdfjs, lista, { vias = 3, minimo = 8 } = {}) {
  LV.total = lista.length; LV.feito = 0; LV.fim = 0;
  const fila = lista.slice(), um = async () => { while (fila.length) { const e = fila.shift();
    try { const r = await lvCaderno(pdfjs, e);
      if (e.semente) { /* prova que já está no app: só marca os itens como vistos */ }
      else if (r.erro) LV.erros[e.id] = r.erro + (r.q ? ':' + r.q : '');
      else if (r.q < minimo) LV.erros[e.id] = 'poucos:' + r.q;
      else { const { texto, ...meta } = r; await lvPor(e.id, { id: e.id, cad: e.cad, gabUrl: e.gab, nome: e.nome, ...meta, itens: texto.itens, grupos: texto.grupos }); LV.res[e.id] = meta; }
    } catch (x) { LV.erros[e.id] = 'falha:' + String(x && x.message || x).slice(0, 60); }
    LV.feito++; } };
  await Promise.all(Array.from({ length: vias }, um)); LV.fim = 1;
}
/* Manda um lote de provas guardadas para o app, pelo endereço. */
async function lvEnviar(ids, app = 'https://brunodecastrosilva.github.io/estudo-facil/') {
  const provas = []; for (const id of ids) { const p = await lvLer(id); if (p) provas.push({ prova: id, itens: p.itens, grupos: p.grupos }); }
  const b = new TextEncoder().encode(JSON.stringify({ v: 1, provas })); let bin = ''; for (let i = 0; i < b.length; i += 8192) bin += String.fromCharCode(...b.subarray(i, i + 8192));
  location.href = app + '#prova=' + btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
