/* Estudo Fácil: leitura do edital (PDF ou texto colado), feita no próprio aparelho.
   Carregado só quando o usuário adiciona um concurso. Usa o pdf.js para extrair o texto das páginas. */
"use strict";
(function () {
const SEM_ACENTO = /\p{M}/gu;
const normaliza = s => String(s || "").normalize("NFD").replace(SEM_ACENTO, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const RX_MARC = /^(?:\d{1,2}(?:\.\d{1,2}){0,3}[.)]?|[a-z][.)]|[•▪◦●·*\-–—])\s+/;
const RX_RUIDO = /^(anexo|cargo|cargos|edital|conteudos? programaticos?|nivel (superior|medio|fundamental)|pagina)\b/;
const DISC_COMUNS = /^(portugues|lingua portuguesa|matematica|informatica|ingles|lingua inglesa|espanhol|lingua espanhola|estatistica|contabilidade|economia|administracao|arquivologia|legislacao|atualidades|redacao|fisica|quimica|biologia|historia|geografia|sociologia|filosofia|literatura|etica|criminologia|pedagogia|didatica|psicologia|auditoria|financas|raciocinio logico)$/;
const MINUSC = new Set(["a", "o", "as", "os", "à", "às", "ao", "aos", "de", "da", "do", "das", "dos", "e", "em", "no", "na", "nos", "nas", "para", "com", "sobre", "por", "pela", "pelo", "pelas", "pelos", "ou", "um", "uma", "à", "até"]);
const CURTAS = new Set(["lei", "uso", "ato", "via", "ser", "bem", "mar", "rio", "sul", "paz", "fé", "dia", "mês", "ano", "sem", "sob", "que", "não", "sua", "seu", "só", "já", "dez", "cem", "fim", "mãe", "pai", "boa", "bom", "gás", "lar", "sol", "luz", "voz", "cor", "dor", "era", "fio", "ética", "ódio", "três", "réu", "rés", "vez", "mal", "pé", "lá", "cá", "nós", "vós", "eu", "ele", "ela", "seu", "teu", "meu", "fé", "tal", "mil", "ida", "oca", "ira", "elo", "lua", "pró", "pré", "pós", "ex", "vice", "sub", "co", "bem", "mãe"]);
const ROMANOS = /^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii|xiii|xiv|xv)$/;
function letrasMaiusculas(s) {
  const l = String(s).replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, ""); if (l.length < 3) return 0;
  return l.replace(/[^A-ZÀ-ÖØ-Þ]/g, "").length / l.length;
}
function capPalavra(p) { const k = p.search(/[a-zà-ÿ]/); return k < 0 ? p : p.slice(0, k) + p.charAt(k).toUpperCase() + p.slice(k + 1); }
function tituloBr(s) {
  s = String(s || "").replace(/\s+/g, " ").trim();
  if (letrasMaiusculas(s) < 0.7) return s;
  return s.toLowerCase().split(" ").map((w, i) => {
    if (i && MINUSC.has(w)) return w;
    if (/\d/.test(w) && /[a-z]{2}/.test(w)) return w.toUpperCase();
    return w.split("-").map(p => {
      const nu = p.replace(/[^a-zà-ÿ]/g, "");
      if (nu.length > 1 && ROMANOS.test(nu)) return p.toUpperCase();
      if (/^[a-zà-ÿ]{2,3}$/.test(nu) && !MINUSC.has(nu) && !CURTAS.has(nu)) return p.toUpperCase();
      return capPalavra(p);
    }).join("-");
  }).join(" ");
}
function ehTitulo(s) {
  const ws = s.trim().split(/\s+/); if (ws.length < 2 || ws.length > 9) return false;
  const fortes = ws.filter(w => w.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, "").length >= 4);
  return fortes.length > 0 && fortes.every(w => /^[^A-Za-zÀ-ÖØ-öø-ÿ]*[A-ZÀ-ÖØ-Þ]/.test(w));
}
function ehRuido(l) {
  const n = normaliza(l);
  if (/^\d{1,3}$/.test(n) || /^pagina \d+( de \d+)?$/.test(n)) return true;
  return letrasMaiusculas(l) >= 0.6 && RX_RUIDO.test(n);
}
function nomeDisciplina(s) {
  s = String(s).replace(/\s+/g, " ").replace(/^[\d.)\s–—-]+/, "").replace(/[\s:.;,–—-]+$/, "").trim();
  return tituloBr(s) || "Disciplina";
}
function cabecalho(linha, prox, ant) {
  if (RX_MARC.test(linha) || /^\d/.test(linha)) return null;
  const m = linha.match(/^(.{2,90}?)(?:\s*:\s*|\s+[–—-]\s+)(.*)$/);
  if (m) {
    const nome = m[1].trim(), resto = m[2].trim(), nw = nome.split(/\s+/).length;
    if (/\d/.test(nome) || /[.;,]$/.test(nome)) return null;
    if (letrasMaiusculas(nome) >= 0.7 && nw <= 14) return { nome, resto };
    if (nw <= 9 && (ehTitulo(nome) || DISC_COMUNS.test(normaliza(nome)))) return { nome, resto };
    return null;
  }
  if (/[.;,]$/.test(linha)) return null;
  const nw = linha.split(/\s+/).length;
  if (letrasMaiusculas(linha) >= 0.7 && nw <= 14 && !/\d{3,}/.test(linha)) return { nome: linha, resto: "" };
  if (nw <= 8 && (ehTitulo(linha) || DISC_COMUNS.test(normaliza(linha))) && prox) {
    if (RX_MARC.test(prox)) return { nome: linha, resto: "" };
    const antOk = !ant || /[.;:]$/.test(ant) || letrasMaiusculas(ant) >= 0.7;
    if (antOk && /^[A-ZÀ-ÖØ-Þ"“(]/.test(prox) && prox.split(/\s+/).length > nw && !ehTitulo(prox)) return { nome: linha, resto: "" };
  }
  return null;
}
function dividirNumerados(txt) {
  const rx = /(^|[.;:]\s+)(\d{1,2}(?:\.\d{1,2}){0,3})[.)]?\s+(?=[A-Za-zÀ-ÖØ-öø-ÿ"“(])/g;
  const pos = []; let m;
  while ((m = rx.exec(txt))) {
    if (m[1] && /\b(?:arts?|incs?|n|nº|p|pp|pág|pag|cap|caps|al|par|fls?)\s*\.$/i.test(txt.slice(Math.max(0, m.index - 8), m.index + 1))) continue;
    pos.push(m.index + m[1].length);
  }
  if (pos.length < 2) return [txt];
  const out = [], pre = txt.slice(0, pos[0]).trim(); if (pre) out.push(pre);
  for (let i = 0; i < pos.length; i++) out.push(txt.slice(pos[i], pos[i + 1]));
  return out;
}
function dividirLetras(txt) {
  const pos = []; for (const m of txt.matchAll(/(^|[.;]\s+)([a-z])\)\s+(?=\S)/g)) pos.push(m.index + m[1].length);
  if (pos.length < 2) return [txt];
  const out = [], pre = txt.slice(0, pos[0]).trim(); if (pre) out.push(pre);
  for (let i = 0; i < pos.length; i++) out.push(txt.slice(pos[i], pos[i + 1]));
  return out;
}
function dividirFrases(txt) { return txt.replace(/([.;])\s+(?=[A-ZÀ-ÖØ-Þ"“(])/g, "$1\u0001").split("\u0001"); }
function limparItens(itens) {
  const vistos = new Set(), out = [];
  for (let s of itens) {
    s = String(s).replace(/\s+/g, " ").trim();
    let num = "";
    const m = s.match(/^(\d{1,2}(?:\.\d{1,2}){0,3})[.)]?\s+/);
    if (m) { num = m[1]; s = s.slice(m[0].length); }
    else s = s.replace(/^(?:[a-z][.)]|[•▪◦●·*\-–—])\s+/, "");
    s = s.replace(/[\s.;:,]+$/, "").trim();
    if (s.length < 3 || ehRuido(s)) continue;
    if (s.length > 200) s = s.slice(0, 197).replace(/\s+\S*$/, "") + "…";
    const nome = num ? `${num} ${s}` : s, k = normaliza(nome);
    if (vistos.has(k)) continue; vistos.add(k); out.push(nome);
  }
  return out;
}
function separarAssuntos(linhas) {
  if (!linhas.length) return [];
  const marc = linhas.filter(l => RX_MARC.test(l)).length;
  let itens;
  if (linhas.length >= 2 && marc / linhas.length >= 0.5) {
    itens = [];
    for (const l of linhas) { if (RX_MARC.test(l) || !itens.length) itens.push(l); else itens[itens.length - 1] += " " + l; }
    itens = itens.flatMap(dividirNumerados).flatMap(dividirLetras);
  } else {
    const txt = linhas.join(" "), num = dividirNumerados(txt);
    const let_ = num.length >= 2 ? num : dividirLetras(txt);
    itens = let_.length >= 2 ? let_ : dividirFrases(txt);
  }
  return limparItens(itens);
}
function prepararTexto(texto) {
  let t = String(texto || "").replace(/\r/g, "").replace(/­/g, "").replace(/[\t ]+/g, " ");
  t = t.replace(/([a-zà-ÿ])-\n(?=[a-zà-ÿ])/g, "$1");
  t = t.replace(/([.;])[ ]+(?=[A-ZÀ-ÖØ-Þ][A-ZÀ-ÖØ-Þ ,]{3,80}:)/g, "$1\n");
  return t.split("\n").map(l => l.replace(/\s+/g, " ").trim()).filter(l => l && !ehRuido(l));
}
function analisarEdital(texto) {
  const linhas = prepararTexto(texto);
  const grupos = []; let g = null;
  for (let i = 0; i < linhas.length; i++) {
    const c = cabecalho(linhas[i], linhas[i + 1], linhas[i - 1]);
    if (c) { g = { nome: nomeDisciplina(c.nome), linhas: [] }; grupos.push(g); if (c.resto) g.linhas.push(c.resto); continue; }
    if (!g) { g = { nome: "Conteúdo do edital", linhas: [] }; grupos.push(g); }
    g.linhas.push(linhas[i]);
  }
  const out = [];
  for (const x of grupos) {
    const assuntos = separarAssuntos(x.linhas); if (!assuntos.length) continue;
    const ex = out.find(o => normaliza(o.nome) === normaliza(x.nome));
    if (ex) { for (const a of assuntos) if (!ex.assuntos.some(b => normaliza(b) === normaliza(a))) ex.assuntos.push(a); }
    else out.push({ nome: x.nome, assuntos });
  }
  return out;
}

const MESES_PT = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const RX_MES = "(janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)";
const TIPOS_DATA = [
  ["inscricao", "Período de inscrições", "Inscrições"],
  ["isencao", "Pedido de isenção da taxa", "Isenção"],
  ["isencao_res", "Resultado da isenção", "Resultado da isenção"],
  ["pagamento", "Pagamento da taxa", "Pagamento"],
  ["locais", "Divulgação dos locais de prova", "Locais de prova"],
  ["prova", "Prova objetiva", "Prova"],
  ["discursiva", "Prova discursiva", "Prova discursiva"],
  ["gabarito", "Gabarito preliminar", "Gabarito"],
  ["recurso", "Prazo para recursos", "Recursos"],
  ["resultado", "Resultado", "Resultado"],
  ["final", "Resultado final", "Resultado final"],
  ["taf", "Teste de aptidão física", "Teste físico"],
  ["psico", "Avaliação psicológica", "Avaliação psicológica"],
  ["medica", "Avaliação médica", "Exame médico"],
  ["hetero", "Heteroidentificação", "Heteroidentificação"],
  ["titulos", "Avaliação de títulos", "Títulos"],
  ["formacao", "Curso de formação", "Curso de formação"],
  ["publicacao", "Publicação do edital", "Edital publicado"],
  ["outro", "Outra data", ""]
];
const TIPO_INFO = Object.fromEntries(TIPOS_DATA.map(([k, l, c]) => [k, { l, c }]));
const rotuloTipo = k => (TIPO_INFO[k] || TIPO_INFO.outro).l;
const curtoTipo = (k, titulo) => (TIPO_INFO[k] && TIPO_INFO[k].c) || titulo || "Data";
const REGRAS_DATA = [
  ["isencao", c => /isencao/.test(c) && !/resultado|relacao|deferid|indeferid|divulga|homolog/.test(c)],
  ["isencao_res", c => /isencao/.test(c)],
  ["pagamento", c => /pagamento|\bpago\b|boleto|recolhimento|\bgru\b|vencimento/.test(c)],
  ["locais", c => /loca(l|is)\s+(e\s+(os\s+)?horarios?\s+)?(de\s+)?(realizacao\s+d[ao]s?\s+|aplicacao\s+d[ao]s?\s+)?provas?|cartao de confirmacao|convocacao para (a|as) provas?|consulta (ao|aos|do|dos) loca/.test(c)],
  ["gabarito", c => /gabarito/.test(c) && !/recurso/.test(c)],
  ["recurso", c => /recurso/.test(c)],
  ["final", c => /resultado final|homologacao/.test(c)],
  ["resultado", c => /resultado/.test(c)],
  ["taf", c => /aptidao fisica|\btaf\b|capacidade fisica|exame fisico/.test(c)],
  ["psico", c => /psicolog|psicotecnic/.test(c)],
  ["medica", c => /exames? medicos?|avaliacao medica|pericia medica|inspecao de saude|exame de saude|exames? clinicos?/.test(c)],
  ["hetero", c => /heteroidentificacao|verificacao da (condicao|autodeclaracao)/.test(c)],
  ["titulos", c => /\btitulos\b/.test(c)],
  ["formacao", c => /curso de formacao/.test(c)],
  ["discursiva", c => /discursiva|redacao|prova pratica|prova oral/.test(c) && !/objetiva/.test(c)],
  ["prova", c => /\bprovas?\b/.test(c) && /aplica|realiza|data provavel|objetiva|escrita|data da prova|dia da prova/.test(c)],
  ["inscricao", c => /inscric/.test(c)],
  ["publicacao", c => /publicacao|publicad|edital de abertura|edital n[º°o]/.test(c)]
];
function classificarData(c) { for (const [k, f] of REGRAS_DATA) if (f(c)) return k; return null; }
const BANCAS = [
  ["Cebraspe", "\\bcebraspe\\b|centro brasileiro de pesquisa em avaliacao|\\bcespe\\b"],
  ["FGV", "fundacao getulio vargas|\\bfgv\\b"],
  ["FCC", "fundacao carlos chagas|\\bfcc\\b"],
  ["Vunesp", "\\bvunesp\\b|fundacao para o vestibular da universidade estadual paulista"],
  ["Cesgranrio", "cesgranrio"],
  ["IBFC", "\\bibfc\\b|instituto brasileiro de formacao e capacitacao"],
  ["Instituto AOCP", "\\baocp\\b"],
  ["Idecan", "\\bidecan\\b"],
  ["Quadrix", "\\bquadrix\\b"],
  ["Iades", "\\biades\\b"],
  ["Instituto Consulplan", "\\bconsulplan\\b"],
  ["Fundatec", "\\bfundatec\\b"],
  ["Ibade", "\\bibade\\b"],
  ["Instituto Selecon", "\\bselecon\\b"],
  ["Fepese", "\\bfepese\\b"],
  ["Fundep", "\\bfundep\\b|gestao de concursos"],
  ["Idib", "\\bidib\\b"],
  ["Ibam", "\\bibam\\b"],
  ["Instituto Access", "instituto access"],
  ["Fumarc", "\\bfumarc\\b"],
  ["Objetiva Concursos", "objetiva concursos"],
  ["Legalle", "\\blegalle\\b"],
  ["Avança SP", "avanca sp"],
  ["Instituto Mais", "instituto mais\\b"],
  ["Funrio", "\\bfunrio\\b"],
  ["Ieses", "\\bieses\\b"],
  ["NC-UFPR", "nc[- ]ufpr|nucleo de concursos da (universidade federal do parana|ufpr)"],
  ["Comperve", "\\bcomperve\\b"],
  ["Copeve/UFAL", "\\bcopeve\\b"],
  ["Coseac", "\\bcoseac\\b"],
  ["UECE-CEV", "uece[- ]cev"],
  ["Fundação La Salle", "fundacao la salle"],
  ["Instituto Verbena", "instituto verbena"],
  ["Consulpam", "\\bconsulpam\\b"],
  ["Igeduc", "\\bigeduc\\b"],
  ["Fafipa", "\\bfafipa\\b"],
  ["Instituto Cidades", "instituto cidades"],
  ["Cetap", "\\bcetap\\b"],
  ["IBGP", "\\bibgp\\b"],
  ["Fauel", "\\bfauel\\b"],
  ["Acafe", "\\bacafe\\b"],
  ["Gualimp", "\\bgualimp\\b"],
  ["Reis & Reis", "reis\\s*&\\s*reis"]
];
const DOMINIO_BANCA = { Cebraspe: "cebraspe", FGV: "fgv", FCC: "concursosfcc", Vunesp: "vunesp", Cesgranrio: "cesgranrio", IBFC: "ibfc", "Instituto AOCP": "aocp", Idecan: "idecan", Quadrix: "quadrix", Iades: "iades", "Instituto Consulplan": "consulplan", Fundatec: "fundatec", Ibade: "ibade", "Instituto Selecon": "selecon", Fepese: "fepese", Fundep: "gestaodeconcursos" };
const PALAVRAS_CARGO = "analista|tecnico|auxiliar|agente|assistente|escrivao|delegado|perito|investigador|soldado|oficial|inspetor|auditor|fiscal|professor|enfermeiro|medico|escriturario|procurador|defensor|engenheiro|contador|administrador|psicologo|policial|papiloscopista|bibliotecario|arquivista|economista|nutricionista|farmaceutico|fisioterapeuta|motorista|operador|especialista|pesquisador|tecnologista|gestor|escrevente|atendente|guarda|bombeiro|odontologo|cirurgiao|terapeuta|fonoaudiologo|veterinario|advogado|secretario|cuidador|monitor|vigilante|recepcionista|telefonista|eletricista|mecanico|servente|zelador|cozinheiro|merendeira|juiz|promotor|consultor|estatistico|geologo|arquiteto|biologo|quimico|jornalista|programador|tradutor|interprete|controlador|piloto|educador|pedagogo|orientador|supervisor|coordenador|cadete|sargento|tenente|comissario|regulador|ouvidor|tesoureiro|almoxarife|bioquimico|biomedico";
const RX_CARGO_INI = new RegExp(`^(?:\\d{1,3}\\s+)?(?:${PALAVRAS_CARGO})\\b`);
const RX_INI_CONT = /^(?:anexo\s+[ivxlc\d]+\s*[-–—:.]?\s*)?(?:(?:\d+(?:\.\d+)*\.?|[ivxlc]{1,5}\s*[-–—.)])\s+)?(?:d[oa]s?\s+)?(?:conteudos?\s+programaticos?|objetos?\s+de\s+avaliacao|programas?\s+(?:de|das)\s+provas?|conhecimentos\s+(?:basicos|gerais|especificos|comuns))/;
const RX_BLOCO = /^(?:\d+(?:\.\d+)*\.?\s+)?(?:conhecimentos\b|cargos?\s+\d|para\s+(?:todos\s+)?os\s+cargos|comum\s+a|nivel\s+(?:superior|medio|fundamental|tecnico)|area\s*:|especialidade\s*:|parte\s+[ivx]+\b|modulo\s+[ivx\d]+|bloco\s+[ivx\d]+|grupo\s+[ivx\d]+|prova\s+(?:objetiva|discursiva)|conteudo\s+(?:programatico|especifico|comum)|disciplinas?\s+(?:basicas|especificas|comuns))/;
const RX_INST = /^(poder judiciario|poder executivo|poder legislativo|ministerio|tribunal|prefeitura|governo|secretaria|estado d|camara|assembleia|policia|corpo de bombeiros|banco|caixa|instituto|agencia|universidade|conselho|defensoria|procuradoria|senado|departamento|empresa|companhia|fundacao|servico|superior tribunal|supremo|controladoria|advocacia|receita|municipio|autarquia|autoridade|comando|marinha|exercito|aeronautica|forca aerea|guarda|hospital|consorcio|superintendencia|ordem dos|petroleo|correios|justica|escola|centro|distrito)/;
const RX_INST_GENERICO = /^(poder (judiciario|executivo|legislativo)( da uniao)?|republica federativa do brasil|governo federal|estado d[eoa] [a-z ]+|justica (federal|do trabalho|eleitoral|militar)|ministerio publico da uniao|uniao)$/;
const RX_ENTRE = /^[\s,]*(?:a|ate|e|ao|as|-|–|—)(?:\s+(?:as|a|o))?(?:\s+\d{1,2}\s*(?:h|horas?)(?:\s*e?\s*\d{1,2}\s*(?:min|minutos?)?)?)?(?:\s+(?:do dia|de|dia|o dia))?\s*$/;

function limparTexto(s) {
  return String(s || "").replace(/[ﬀ-ﬆ]/g, c => c.normalize("NFKC")).replace(/[    - ]/g, " ").replace(/[‐‑−]/g, "-").replace(/­/g, "");
}
/* Minúsculas e sem acentos, com o mesmo tamanho do texto original (posições batem) */
function normPos(s) {
  return String(s).replace(/[^\x00-\x7f]/g, ch => { const n = ch.normalize("NFD").replace(SEM_ACENTO, "").toLowerCase(); return n.length === 1 ? n : (n.charAt(0) || " "); }).toLowerCase();
}
function ymdDe(y, m, d) {
  if (!(y >= 1900 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31)) return null;
  const dt = new Date(y, m - 1, d, 12);
  if (dt.getMonth() !== m - 1) return null;
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function somaDias(iso, n) { const [y, m, d] = iso.split("-").map(Number); const dt = new Date(y, m - 1, d + n, 12); return ymdDe(dt.getFullYear(), dt.getMonth() + 1, dt.getDate()); }

/* ---------- Texto das páginas ---------- */
function linhasDaPagina(items) {
  const its = [];
  for (const i of items || []) {
    if (!i || typeof i.str !== "string" || !i.str.trim() || !Array.isArray(i.transform)) continue;
    const [a, b, c, d, x, y] = i.transform;
    if (Math.abs(b) > Math.abs(a) + 0.01) continue;
    const h = Math.abs(d) || Math.hypot(c, d) || Math.abs(i.height) || 10;
    its.push({ s: i.str, x, y, w: Math.abs(i.width || 0), h });
  }
  its.sort((p, q) => q.y - p.y || p.x - q.x);
  const linhas = [];
  for (const it of its) {
    const L = linhas[linhas.length - 1];
    if (L && Math.abs(L.y - it.y) <= Math.max(1.5, Math.min(L.h, it.h) * 0.5)) L.its.push(it);
    else linhas.push({ y: it.y, h: it.h, its: [it] });
  }
  return linhas.map(L => {
    L.its.sort((p, q) => p.x - q.x);
    let t = "", fim = null;
    for (const it of L.its) {
      if (fim !== null) {
        const gap = it.x - fim;
        if (gap > Math.max(it.h, 6) * 1.6) t += "\t";
        else if (gap > it.h * 0.12 && !/\s$/.test(t) && !/^\s/.test(it.s)) t += " ";
      }
      t += it.s; fim = it.x + it.w;
    }
    return limparTexto(t).replace(/ +/g, " ").replace(/ *\t[ \t]*/g, "\t").trim();
  }).filter(Boolean);
}
/* Tira cabeçalhos e rodapés que se repetem nas páginas */
function limparPaginas(paginas) {
  const n = paginas.length; if (n < 3) return paginas;
  const chave = l => normaliza(l).replace(/\d+/g, "#");
  const cont = new Map();
  for (const p of paginas) {
    const vistas = new Set([...p.slice(0, 3), ...p.slice(-3)].map(chave));
    for (const k of vistas) if (k) cont.set(k, (cont.get(k) || 0) + 1);
  }
  const lim = Math.max(3, Math.ceil(n * 0.4));
  const rep = new Set([...cont].filter(([, c]) => c >= lim).map(([k]) => k));
  if (!rep.size) return paginas;
  return paginas.map(p => p.filter((l, i) => !((i < 3 || i >= p.length - 3) && rep.has(chave(l)))));
}

/* ---------- Dados gerais ---------- */
function acharNumero(T) {
  const rx = /edital(?:\s+(?:de|do|da|das|dos|abertura|inscricoes|inscricao|concurso|publico|selecao|processo|seletivo|normativo|regulador)){0,6}\s+(?:n[º°o.]*|numero)\s*(\d{1,4})(?:\s*[\/.-]\s*(\d{4}|\d{2})(?!\d))?/;
  const m = T.slice(0, 6000).match(rx) || T.match(rx);
  if (!m) return {};
  let ano = m[2] ? (m[2].length === 2 ? 2000 + +m[2] : +m[2]) : null;
  const viz = T.slice(m.index, m.index + 160);
  const mp = viz.match(new RegExp(`de\\s+(\\d{1,2})(?:º|o)?\\s+de\\s+${RX_MES}\\s+de\\s+(\\d{4})`));
  const pub = mp ? ymdDe(+mp[3], MESES_PT.indexOf(mp[2]) + 1, +mp[1]) : null;
  if (!ano && pub) ano = +pub.slice(0, 4);
  return { numero: m[1] + (ano ? "/" + ano : ""), ano, pub };
}
function anoMaisComum(s) {
  const c = new Map(); for (const m of s.matchAll(/\b(20[2-4]\d)\b/g)) c.set(m[1], (c.get(m[1]) || 0) + 1);
  let best = null, n = 0; for (const [y, k] of c) if (k > n) { best = +y; n = k; }
  return best;
}
function acharBanca(T) {
  let best = "", n = 0;
  for (const [nome, src] of BANCAS) { const k = (T.match(new RegExp(src, "g")) || []).length; if (k > n) { best = nome; n = k; } }
  return best;
}
function acharOrgao(linhas, T, orig) {
  const cand = [];
  for (let i = 0; i < Math.min(linhas.length, 25); i++) {
    const l = linhas[i].replace(/\t+/g, " "), n = normaliza(l);
    if (l.length > 160 || (/[.;]$/.test(l) && l.length > 80)) break;
    if (/\bedital\b|\bconcurso\b|processo seletivo|selecao publica/.test(n)) continue;
    if (l.length < 6 || l.length > 140 || letrasMaiusculas(l) < 0.6 || !RX_INST.test(n)) continue;
    cand.push(l);
  }
  const esp = cand.filter(l => !RX_INST_GENERICO.test(normaliza(l)));
  if (esp.length) return tituloBr(esp[esp.length - 1]);
  const rx = /\b(?:o|a)\s+(?:excelentissim[oa]\s+(?:senhora?\s+)?)?(presidente|presidenta|prefeit[oa](?:\s+municipal)?|secretari[oa](?:\s+de\s+estado)?|diretor[a]?(?:[- ]geral)?|procurador[a]?[- ]geral|defensor[a]?\s+public[oa][- ]geral|reitor[a]?|comandante(?:[- ]geral)?|delegad[oa][- ]geral|governador[a]?|superintendente|corregedor[a]?(?:[- ]geral)?)\s+(?:em exercicio\s+|interin[oa]\s+|substitut[oa]\s+)?(d[oa]s?|de)\s+([^,()]{4,160}?)(?=,|\s+no uso\b|\s+torna\b|\s+faz saber\b|\s+considerando\b|\s+resolve\b|\s*\()/;
  const m = T.slice(0, 15000).match(rx);
  if (m) {
    const ini = m.index + m[0].length - m[3].length;
    let nome = orig.slice(ini, ini + m[3].length).replace(/\s+/g, " ").trim();
    const papel = m[1];
    if (/^prefeit/.test(papel)) nome = "Prefeitura de " + nome.replace(/^munic[íi]pio\s+de\s+/i, "");
    else if (/^governador/.test(papel)) nome = "Governo " + m[2] + " " + nome;
    else if (/^secretari/.test(papel)) nome = "Secretaria " + (/estado/.test(papel) ? "de Estado " : "") + m[2] + " " + nome;
    if (!/comissao|banca/.test(normaliza(nome))) return tituloBr(nome);
  }
  return cand.length ? tituloBr(cand[cand.length - 1]) : "";
}
function acharTaxa(T, orig) {
  const vals = [];
  for (const m of T.matchAll(/(?:taxa|valor)\s+(?:da|de)\s+inscricao/g)) {
    const win = T.slice(m.index, m.index + 280);
    for (const v of win.matchAll(/r\$\s*(\d{1,3}(?:\.\d{3})*,\d{2})/g)) { const s = "R$ " + v[1]; if (!vals.includes(s)) vals.push(s); if (vals.length >= 3) break; }
    if (vals.length) break;
  }
  return vals.join(" / ");
}
function acharSite(orig, banca) {
  const cont = new Map();
  for (const m of orig.matchAll(/\b(?:https?:\/\/|www\.)[^\s<>()"'\]]+/gi)) {
    let u = m[0].replace(/[.,;:)\]]+$/, ""); if (u.length < 10) continue;
    if (!/^https?:/i.test(u)) u = "https://" + u;
    cont.set(u, (cont.get(u) || 0) + 1);
  }
  const dom = DOMINIO_BANCA[banca] || normaliza(banca).split(" ").pop() || "§";
  const nota = ([u, c]) => c + (u.toLowerCase().includes(dom) ? 6 : 0) + (/concurso|selec/.test(u.toLowerCase()) ? 3 : 0) - (/planalto|in\.gov|imprensanacional|dou|jusbrasil/.test(u.toLowerCase()) ? 5 : 0);
  const l = [...cont].sort((a, b) => nota(b) - nota(a));
  return l.length ? l[0][0] : "";
}

/* ---------- Cargos ---------- */
function limparNomeCargo(s) {
  s = String(s || "").replace(/\s+/g, " ").replace(/^[\d\s.)–—-]+/, "").replace(/[\s:.;,–—-]+$/, "").trim();
  return s.length > 110 ? "" : tituloBr(s);
}
function infoCargo(jan) {
  const out = {};
  const r = jan.match(/r\$\s*(\d{1,3}(?:\.\d{3})*,\d{2})/); if (r) out.rem = "R$ " + r[1];
  const v = jan.match(/\b(\d{1,4})\s*(?:\([a-z\s-]+\)\s*)?vagas?\b/) || jan.match(/\bvagas?\s*:?\s*(\d{1,4})\b/);
  if (v) out.vagas = v[1];
  else if (/cadastro de reserva/.test(jan)) out.vagas = "Cadastro reserva";
  return out;
}
function acharCargos(linhas, T, orig) {
  const mapa = new Map();
  const chave = n => normaliza(n).replace(/\b(cargo|area|especialidade|nivel)\b/g, " ").replace(/\s+/g, " ").trim();
  const add = (nome, extra, fonte) => {
    nome = limparNomeCargo(nome); if (!nome || nome.length < 4) return;
    const k = chave(nome); if (k.length < 4) return;
    const ex = mapa.get(k);
    if (ex) { for (const f of ["num", "vagas", "rem"]) if (!ex[f] && extra[f]) ex[f] = extra[f]; return; }
    mapa.set(k, { nome, num: extra.num || null, vagas: extra.vagas || "", rem: extra.rem || "", fonte, k });
  };
  const ocA = [...T.matchAll(/\bcargo\s+(\d{1,3})\s*(?:\([^)\n]{0,40}\))?\s*[:\-–—]\s*([^\n\t]{3,160})/g)];
  ocA.forEach((m, i) => {
    const ini = m.index + m[0].length - m[2].length, txt = m[2];
    const corte = txt.search(/\s{2,}|\b(requisitos?|remuneracao|vencimentos?|subsidio|vagas?|descricao|atribuicoes|carga horaria|jornada|taxa)\b/);
    if (corte === 0) return;
    const fimJan = i + 1 < ocA.length ? Math.min(ocA[i + 1].index, m.index + 1500) : m.index + 1500;
    add(orig.slice(ini, ini + (corte > 0 ? corte : txt.length)), { num: +m[1], ...infoCargo(T.slice(m.index, fimJan)) }, "cargo");
  });
  let cab = null;
  for (const l of linhas) {
    if (!l.includes("\t")) continue;
    const cel = l.split("\t").map(c => c.trim()).filter(Boolean);
    const nc = cel.map(c => normaliza(c));
    if (nc.some(c => /^(vagas|total|vencimento|remuneracao|salario|subsidio)/.test(c)) && !cel.some(c => /\d/.test(c))) { cab = nc; continue; }
    if (cel.length < 2 || !RX_CARGO_INI.test(nc[0])) continue;
    const resto = cel.slice(1);
    const col = rx => cab && cab.length === cel.length ? cab.findIndex(c => rx.test(c)) : -1;
    const iT = col(/^total/), iV = col(/vagas/), iR = col(/^(vencimento|remuneracao|salario|subsidio)/);
    const rem = iR > 0 ? cel[iR] : resto.find(c => /r\$\s*\d/i.test(c));
    const vag = iT > 0 ? cel[iT] : iV > 0 ? cel[iV] : resto.find(c => /^\d{1,4}$/.test(c) || /^(cr|cadastro)/i.test(c));
    if (!rem && !vag) continue;
    add(cel[0], { rem: rem ? "R$ " + rem.replace(/^.*?r\$\s*/i, "") : "", vagas: vag ? (/^\d/.test(vag) ? vag : "Cadastro reserva") : "" }, "tabela");
  }
  for (const m of T.matchAll(/(?:^|\n)[ \t]*(?:cargo|emprego|cargo\/area|cargo\/especialidade)\s*:\s*([^\n\t]{3,120})/g)) {
    const ini = m.index + m[0].length - m[1].length, txt = m[1];
    const corte = txt.search(/\s{2,}|\b(requisitos?|remuneracao|vencimentos?|vagas?|carga horaria|jornada)\b/);
    if (corte === 0) continue;
    add(orig.slice(ini, ini + (corte > 0 ? corte : txt.length)), infoCargo(T.slice(ini, Math.min(T.length, ini + 900))), "rotulo");
  }
  const ab = T.slice(0, 8000).match(/\b(?:nos?|para\s+os?|aos?|dos?)\s+cargos?\s+(?:efetivos?\s+|publicos?\s+)?d[eo]s?\s+([^.;:]{3,260})/);
  if (ab) {
    const ini = ab.index + ab[0].length - ab[1].length;
    for (let p of orig.slice(ini, ini + ab[1].length).split(/,\s*|\s+e\s+(?:d[eo]s?\s+)?|\n/i)) {
      p = p.replace(/^d[eo]s?\s+/i, "").trim();
      if (RX_CARGO_INI.test(normaliza(p)) && p.split(/\s+/).length <= 8) add(p, {}, "abertura");
    }
  }
  let lista = [...mapa.values()];
  lista = lista.filter(c => !(c.fonte === "abertura" || c.fonte === "rotulo") || !lista.some(o => o !== c && o.k.startsWith(c.k + " ")));
  return lista.slice(0, 40).map(c => ({ nome: c.nome, num: c.num, vagas: c.vagas, rem: c.rem }));
}

/* ---------- Conteúdo programático em blocos ---------- */
function acharConteudo(linhas, cargos) {
  const N = linhas.length, low = linhas.map(l => normPos(l).trim());
  const ehHead = i => letrasMaiusculas(linhas[i]) >= 0.6 && linhas[i].length <= 170;
  const pareceDisc = i => !!cabecalho(linhas[i], linhas[i + 1], linhas[i - 1]) || /^\d{1,2}(\.\d{1,2})*\.?\s+[A-ZÀ-Ú]/.test(linhas[i]);
  let ini = -1;
  for (let i = 0; i < N; i++) {
    if (!ehHead(i) || !RX_INI_CONT.test(low[i])) continue;
    let sc = 0; for (let j = i + 1; j < Math.min(N, i + 40); j++) if (pareceDisc(j)) sc++;
    if (sc >= 3) { ini = i; break; }
  }
  if (ini < 0) return { ini: null, fim: null, blocos: [] };
  let fim = N;
  for (let i = ini + 1; i < N; i++) {
    const l = low[i];
    if (ehHead(i) && /^anexo\s+[ivxlc\d]+\b/.test(l) && !RX_INI_CONT.test(l)) { fim = i; break; }
    if (ehHead(i) && /^\d{1,2}\.?\s+d[ao]s?\s+[a-z]/.test(l) && !RX_INI_CONT.test(l)) { fim = i; break; }
    if (/^[IVXLC]{1,5}\s*[-–—.)]\s*D[AO]S?\s/.test(linhas[i]) && ehHead(i) && !RX_INI_CONT.test(l)) { fim = i; break; }
    if (/^[a-z][a-z\s]{2,40}(\/[a-z]{2})?\s*,\s*\d{1,2}(º|o)?\s+de\s+[a-z]+\s+de\s+\d{4}\.?$/.test(l)) { fim = i; break; }
  }
  const nomesC = cargos.map(c => normaliza(c.nome)).filter(n => n.length >= 6);
  const ehBloco = i => {
    if (!ehHead(i)) return false;
    const l = low[i], nl = normaliza(linhas[i]);
    if (/:\s*(?:\d|[a-zà-ÿ])/.test(linhas[i]) && !/^(?:\d+(?:\.\d+)*\.?\s+)?cargos?\b/.test(l)) return false;
    if (RX_BLOCO.test(l)) return true;
    if (nomesC.some(c => nl === c || nl.startsWith(c + " "))) return true;
    return RX_CARGO_INI.test(nl) && nl.split(" ").length <= 10 && !linhas[i].includes(":");
  };
  const blocos = []; let b = { titulos: [], linhas: [], pre: true };
  const l0 = low[ini].replace(/^(?:anexo\s+[ivxlc\d]+\s*[-–—:.]?\s*)/, "").replace(/^(?:\d+(?:\.\d+)*\.?|[ivxlc]{1,5}\s*[-–—.)])\s+/, "");
  if (RX_BLOCO.test(l0) && !/^(?:d[oa]s?\s+)?(?:conteudos?\s+programaticos?|objetos?\s+de\s+avaliacao)/.test(l0)) b.titulos.push(linhas[ini].replace(/\t+/g, " ").replace(/^\d+(?:\.\d+)*\.?\s+/, ""));
  for (let i = ini + 1; i < fim; i++) {
    if (ehBloco(i)) {
      if (b.linhas.length) { blocos.push(b); b = { titulos: [], linhas: [] }; }
      b.titulos.push(linhas[i].replace(/\t+/g, " ").replace(/^\d+(?:\.\d+)*\.?\s+/, ""));
      continue;
    }
    b.linhas.push(linhas[i].replace(/\t+/g, " "));
  }
  if (b.linhas.length) blocos.push(b);
  const out = [];
  for (const x of blocos) {
    let grupos = analisarEdital(x.linhas.join("\n"));
    if (grupos.length > 1 || x.pre) grupos = grupos.filter(g => g.nome !== "Conteúdo do edital");
    const nA = grupos.reduce((a, g) => a + g.assuntos.length, 0); if (!nA) continue;
    const tts = x.titulos.map(t => tituloBr(t.replace(/[\s:–—-]+$/, "")));
    const fin = tts.filter((t, i) => !tts.slice(i + 1).some(u => normaliza(u).includes(normaliza(t))));
    out.push({ titulo: fin.slice(-2).join(" · ") || "Conteúdo programático", texto: x.linhas.join("\n"), grupos, nA, on: true });
  }
  return { ini, fim, blocos: out };
}
function cargoNoTitulo(tn, num) {
  if (!num) return false;
  for (const m of tn.matchAll(/\bcargos?\s+((?:\d+\s*(?:a|ao|e)?\s*)+)/g)) {
    const nums = m[1].match(/\d+/g).map(Number), txt = m[1];
    if (nums.includes(num)) return true;
    if (nums.length === 2 && /\d+\s*(?:a|ao)\s*\d+/.test(txt) && num >= nums[0] && num <= nums[1]) return true;
  }
  return false;
}
const RX_PALAVRA_CARGO = new RegExp(`\\b(?:${PALAVRAS_CARGO})\\b`);
function marcarBlocos(blocos, cargo, nCargos) {
  if (!blocos.length) return;
  if (blocos.length === 1 || (nCargos != null && nCargos <= 1)) { blocos.forEach(b => { b.on = true; }); return; }
  const pal = s => normaliza(s).split(" ").filter(w => w.length >= 4 && !["area", "cargo", "cargos", "nivel", "especialidade"].includes(w));
  const pc = cargo ? pal(cargo.nome || "") : [];
  for (const b of blocos) {
    const tn = normaliza(b.titulo);
    const listaNum = /\bcargos?\s+\d/.test(tn);
    const doCargo = !!cargo && ((pc.length && pc.every(w => tn.includes(w))) || cargoNoTitulo(tn, cargo.num));
    const nomeiaCargo = listaNum || /\barea\b|especialidade/.test(tn) || RX_PALAVRA_CARGO.test(tn);
    b.on = !!(doCargo || !nomeiaCargo);
  }
}

/* ---------- Datas ---------- */
function tokensData(T) {
  const tk = [], usado = [];
  const livre = (a, b) => !usado.some(([x, y]) => a < y && b > x);
  const Y = y => y == null ? null : (String(y).length === 2 ? 2000 + +y : +y);
  let rx = new RegExp(`(?<!\\d)(\\d{1,2})(?:º|o)?\\s+(?:a|e|ate|ao)\\s+(\\d{1,2})(?:º|o)?\\s+de\\s+${RX_MES}(?:\\s+de\\s+(\\d{4}))?`, "g");
  for (const m of T.matchAll(rx)) {
    const mes = MESES_PT.indexOf(m[3]) + 1, rel2 = m[0].indexOf(m[2], m[1].length + 1);
    tk.push({ pos: m.index, fim: m.index + m[1].length, d: +m[1], m: mes, y: Y(m[4]), ligado: true });
    tk.push({ pos: m.index + rel2, fim: m.index + m[0].length, d: +m[2], m: mes, y: Y(m[4]) });
    usado.push([m.index, m.index + m[0].length]);
  }
  rx = new RegExp(`(?<!\\d)(\\d{1,2})(?:º|o)?\\s+de\\s+${RX_MES}(?:\\s+de\\s+(\\d{4}))?`, "g");
  for (const m of T.matchAll(rx)) if (livre(m.index, m.index + m[0].length)) { tk.push({ pos: m.index, fim: m.index + m[0].length, d: +m[1], m: MESES_PT.indexOf(m[2]) + 1, y: Y(m[3]) }); usado.push([m.index, m.index + m[0].length]); }
  for (const m of T.matchAll(/(?<![\d\/.,])(\d{1,2})\s+(?:a|e|ate|ao)\s+(\d{1,2}) ?\/ ?(\d{1,2})(?: ?\/ ?(\d{4}|\d{2}))?(?![\d\/])/g)) {
    if (!livre(m.index, m.index + m[0].length)) continue;
    const rel2 = m[0].search(/\d{1,2} ?\/ ?\d/);
    tk.push({ pos: m.index, fim: m.index + m[1].length, d: +m[1], m: +m[3], y: Y(m[4]), semAno: !m[4], ligado: true });
    tk.push({ pos: m.index + rel2, fim: m.index + m[0].length, d: +m[2], m: +m[3], y: Y(m[4]), semAno: !m[4] });
    usado.push([m.index, m.index + m[0].length]);
  }
  for (const m of T.matchAll(/(?<![\d\/.,])(\d{1,2}) ?\/ ?(\d{1,2})(?: ?\/ ?(\d{4}|\d{2}))?(?![\d\/])/g)) if (livre(m.index, m.index + m[0].length)) { tk.push({ pos: m.index, fim: m.index + m[0].length, d: +m[1], m: +m[2], y: Y(m[3]), semAno: !m[3] }); usado.push([m.index, m.index + m[0].length]); }
  for (const m of T.matchAll(/(?<![\d.,])(\d{1,2})[.-](\d{1,2})[.-](\d{4})(?![\d.])/g)) if (livre(m.index, m.index + m[0].length)) { tk.push({ pos: m.index, fim: m.index + m[0].length, d: +m[1], m: +m[2], y: Y(m[3]) }); usado.push([m.index, m.index + m[0].length]); }
  return tk.sort((a, b) => a.pos - b.pos);
}
function resolverAnos(tk, anoBase, pub) {
  for (let i = 0; i < tk.length; i++) {
    const t = tk[i]; if (t.y) continue;
    const nx = tk.slice(i + 1, i + 3).find(x => x.y && x.pos - t.fim < 70);
    let y = nx ? nx.y : anoBase;
    if (nx && (t.m > nx.m || (t.m === nx.m && t.d > nx.d))) y -= 1;
    if (!nx && pub) { const iso = ymdDe(y, t.m, t.d); if (iso && iso < somaDias(pub, -60)) y += 1; }
    t.y = y;
  }
  for (const t of tk) t.iso = ymdDe(t.y, t.m, t.d);
}
function refLegal(T, pos) {
  const w = T.slice(Math.max(0, pos - 70), pos).replace(/(\d)\.(\d)/g, "$1$2");
  return /\b(lei|leis|decreto|decreto-lei|portaria|resolucao|instrucao normativa|emenda constitucional|medida provisoria|sumula|acordao|lei complementar|deliberacao|provimento|regimento|constituicao|estatuto|codigo|ato normativo|parecer)\b[^;\n\t]{0,40}?\bde\s*$/.test(w);
}
function inicioItem(orig, k) { const s = orig.slice(k, k + 16); return /^[ \t]*\d{1,2}(?:\.\d{1,2})*\.?\s+[A-ZÀ-ÖØ-Þ]/.test(s) && !/^[ \t]*\d{1,2}\s+de\s/i.test(s); }
function pontoFinal(T, i) {
  if (!/\s/.test(T[i + 1] || " ")) return false;
  const w = T.slice(Math.max(0, i - 6), i).match(/([a-zº]+)$/);
  return !(w && /^(art|arts|inc|n|no|nº|p|pp|dr|dra|sr|sra|prof|cf|ex|obs|av|tel|etc|fl|fls|cap|ed|vol|min|aprox|h)$/.test(w[1]));
}
function limpaTrecho(s) {
  s = String(s).replace(/\s+/g, " ").trim();
  return s.length > 170 ? s.slice(0, 167).replace(/\s+\S*$/, "") + "…" : s;
}
function contextoData(T, orig, pos, end) {
  const ls = T.lastIndexOf("\n", pos - 1) + 1; let le = T.indexOf("\n", end); if (le < 0) le = T.length;
  const linha = T.slice(ls, le);
  if (linha.includes("\t")) {
    let a = ls;
    const resto = linha.replace(/\d{1,2}\s*[\/.-]\s*\d{1,2}(?:\s*[\/.-]\s*\d{2,4})?/g, "").replace(/\d{1,2}(?:º|o)?\s+de\s+[a-z]+(?:\s+de\s+\d{4})?/g, "").replace(/\b(a|e|ate|de|das|dos|do|da)\b/g, "").replace(/[^a-z]/g, "");
    if (resto.length < 6 && ls > 0) a = T.lastIndexOf("\n", ls - 2) + 1;
    const c = T.slice(a, le).replace(/\t+/g, " · ");
    return { clausula: c, frase: c, trecho: limpaTrecho(orig.slice(a, le).replace(/\t+/g, " · ")), tabela: true };
  }
  let a = pos; const lim = Math.max(0, pos - 450);
  while (a > lim) {
    const ch = T[a - 1];
    if (ch === ";" || ch === "\t") break;
    if (ch === "." && pontoFinal(T, a - 1)) break;
    if (ch === "\n" && inicioItem(orig, a)) break;
    a--;
  }
  let b = end; const limB = Math.min(T.length, end + 260);
  while (b < limB) {
    const ch = T[b];
    if (ch === ";" || ch === "\t") break;
    if (ch === "." && pontoFinal(T, b)) break;
    if (ch === "\n" && inicioItem(orig, b + 1)) break;
    b++;
  }
  const clausulaDe = (x, y) => {
    const fr = T.slice(x, y), rel = pos - x, relF = end - x;
    let cs = 0, ce = fr.length;
    for (const m of fr.matchAll(/,\s+e\s+|,\s+bem como\s+|,\s+sendo\s+|,\s+enquanto\s+/g)) {
      if (m.index + m[0].length <= rel) cs = m.index + m[0].length;
      else if (m.index >= relF) ce = Math.min(ce, m.index);
    }
    return fr.slice(cs, ce);
  };
  const out = { clausula: clausulaDe(a, b), frase: T.slice(a, b), trecho: limpaTrecho(orig.slice(a, b)), tabela: false };
  const antes = T.slice(ls, pos).replace(/[^a-z]/g, "");
  if (/^[\s.;,)]*$/.test(T.slice(end, le)) && antes.length >= 12 && !/[.;]\s*$/.test(T.slice(ls, pos))) {
    out.linha = T.slice(ls, le); out.clausulaLinha = clausulaDe(ls, le);
    out.trechoLinha = limpaTrecho(orig.slice(ls, le)); out.semTab = true;
  }
  return out;
}
function tituloData(d) {
  if (d.tipo === "publicacao") return /edital/.test(d.ctx) ? "Publicação do edital" : "Publicação";
  if (d.tipo !== "outro") return rotuloTipo(d.tipo);
  const t = d.trecho.replace(/\d{1,2}\s*\/\s*\d{1,2}(\s*\/\s*\d{2,4})?/g, "").replace(/\s+/g, " ").trim();
  return t.length > 60 ? t.slice(0, 57).replace(/\s+\S*$/, "") + "…" : t;
}
function acharDatas(T, orig, anoBase, pub, pular) {
  const tk = tokensData(T);
  resolverAnos(tk, anoBase, pub);
  const itens = [];
  for (let i = 0; i < tk.length; i++) {
    const a = tk[i]; if (!a.iso) continue;
    const b = tk[i + 1];
    if (b && b.iso && b.iso > a.iso && (a.ligado || (b.pos - a.fim <= 45 && RX_ENTRE.test(T.slice(a.fim, b.pos))))) { itens.push({ ini: a.iso, fim: b.iso, pos: a.pos, end: b.fim, semAno: a.semAno && b.semAno }); i++; }
    else itens.push({ ini: a.iso, fim: null, pos: a.pos, end: a.fim, semAno: a.semAno });
  }
  const out = [];
  for (const it of itens) {
    const y1 = +it.ini.slice(0, 4), y2 = it.fim ? +it.fim.slice(0, 4) : y1;
    if (y1 < anoBase - 1 || y2 > anoBase + 3) continue;
    if (pular && it.pos >= pular[0] && it.pos < pular[1]) continue;
    if (refLegal(T, it.pos)) continue;
    const ctx = contextoData(T, orig, it.pos, it.end);
    if (it.semAno && !ctx.tabela && !ctx.semTab) continue;
    const tLinha = ctx.semTab ? (classificarData(ctx.clausulaLinha) || classificarData(ctx.linha)) : null;
    const tFrase = classificarData(ctx.clausula) || classificarData(ctx.frase);
    const tipo = tLinha || tFrase || "outro";
    const daLinha = !!tLinha && tLinha !== tFrase;
    out.push({ tipo, ini: it.ini, fim: it.fim, trecho: daLinha ? ctx.trechoLinha : ctx.trecho, tabela: ctx.tabela || daLinha, ctx: daLinha ? ctx.linha : ctx.frase });
  }
  const vistos = new Map();
  for (const d of out) {
    const k = d.tipo + "|" + d.ini + "|" + (d.fim || "");
    if (!vistos.has(k) || (d.tabela && !vistos.get(k).tabela)) vistos.set(k, d);
  }
  let lista = [...vistos.values()];
  const mesma = (a, b) => a.ini === b.ini && (a.fim || "") === (b.fim || "");
  lista = lista.filter(d => !(d.tipo === "outro" && lista.some(o => o !== d && o.tipo !== "outro" && mesma(o, d))));
  lista = lista.filter(d => !(d.tipo === "publicacao" && lista.some(o => o !== d && !["outro", "publicacao"].includes(o.tipo) && mesma(o, d))));
  lista = lista.filter(d => d.fim || !lista.some(o => o !== d && o.fim && o.tipo === d.tipo && (o.ini === d.ini || o.fim === d.ini)));
  lista = lista.filter(d => !(d.fim && !d.tabela && lista.some(o => o !== d && o.tabela && mesma(o, d))));
  lista.sort((a, b) => a.ini.localeCompare(b.ini) || (a.fim || "").localeCompare(b.fim || ""));
  let outros = 0;
  return lista.filter(d => d.tipo !== "outro" || outros++ < 8).slice(0, 45)
    .map((d, i) => ({ id: "p" + i, on: d.tipo !== "outro", tipo: d.tipo, titulo: tituloData(d), ini: d.ini, fim: d.fim, trecho: d.trecho }));
}

/* ---------- Tudo junto ---------- */
function analisarPdfEdital(paginas, arquivo) {
  const pags = limparPaginas(paginas.map(p => p.map(limparTexto)));
  const linhas = [], offs = []; let orig = "";
  pags.forEach(p => p.forEach(t => { offs.push(orig.length); linhas.push(t); orig += t + "\n"; }));
  const T = normPos(orig);
  const res = { arquivo, paginas: paginas.length, caracteres: orig.replace(/\s/g, "").length, cargos: [], datas: [], blocos: [] };
  res.legivel = res.caracteres >= Math.max(500, paginas.length * 150);
  if (!res.legivel) return res;
  const num = acharNumero(T);
  res.numero = num.numero || ""; res.publicado = num.pub || null;
  res.banca = acharBanca(T);
  res.orgao = acharOrgao(linhas, T, orig);
  res.cargos = acharCargos(linhas, T, orig);
  const cont = acharConteudo(linhas, res.cargos);
  res.blocos = cont.blocos;
  const pular = cont.ini != null ? [offs[cont.ini], cont.fim < linhas.length ? offs[cont.fim] : orig.length] : null;
  res.anoBase = num.ano || anoMaisComum(T.slice(0, 8000)) || new Date().getFullYear();
  res.datas = acharDatas(T, orig, res.anoBase, res.publicado, pular);
  res.taxa = acharTaxa(T, orig);
  res.site = acharSite(orig, res.banca);
  const pv = res.datas.filter(d => d.tipo === "prova").sort((a, b) => a.ini.localeCompare(b.ini))[0];
  res.prova = pv ? pv.ini : null;
  return res;
}

/* ---------- carregar o pdf.js e extrair as páginas ---------- */
const PDFJS_V = "3.11.174";
const PDFJS_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_V}/pdf.min.js`;
const PDFJS_WORKER = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_V}/pdf.worker.min.js`;
const espera = ms => new Promise(r => setTimeout(r, ms));
function carregarScript(src) { return new Promise((ok, err) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = err; document.head.appendChild(s); }); }
async function pdfLib() {
  if (!window.pdfjsLib) { try { await carregarScript(PDFJS_URL); } catch (e) { throw new Error("sem-biblioteca"); } }
  for (let i = 0; i < 60 && !window.pdfjsLib; i++) await espera(100);
  const lib = window.pdfjsLib; if (!lib) throw new Error("sem-biblioteca");
  try { if (lib.GlobalWorkerOptions && !lib.GlobalWorkerOptions.workerSrc) lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER; } catch (e) { }
  return lib;
}
async function extrairPaginas(file, prog) {
  const lib = await pdfLib();
  const dados = new Uint8Array(await file.arrayBuffer());
  let doc;
  try { doc = await lib.getDocument({ data: dados, isEvalSupported: false, disableFontFace: true, verbosity: 0, cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_V}/cmaps/`, cMapPacked: true }).promise; }
  catch (e) { throw new Error(e && e.name === "PasswordException" ? "senha" : "invalido"); }
  const pags = [];
  for (let n = 1; n <= doc.numPages; n++) {
    prog(n, doc.numPages);
    const pg = await doc.getPage(n);
    const tc = await pg.getTextContent();
    pags.push(linhasDaPagina(tc.items));
    try { pg.cleanup(); } catch (e) { }
    if (n % 4 === 0) await espera(0);
  }
  try { await doc.destroy(); } catch (e) { }
  return pags;
}
/* tipos de data do leitor convertidos para os tipos do app */
const TIPO_APP = { inscricao: "inscricao", isencao: "isencao", isencao_res: "resultado", pagamento: "pagamento", locais: "aviso", prova: "prova", discursiva: "etapa", gabarito: "gabarito", recurso: "recurso", resultado: "resultado", final: "final", taf: "etapa", psico: "etapa", medica: "etapa", hetero: "etapa", titulos: "envio", formacao: "etapa", publicacao: "publicacao", outro: "outro" };
async function lerEditalPdf(file, prog) {
  const pags = await extrairPaginas(file, prog);
  const r = analisarPdfEdital(pags, file.name);
  if (!r.legivel) throw new Error("imagem");
  marcarBlocos(r.blocos, r.cargos.length === 1 ? r.cargos[0] : null, r.cargos.length);
  r.datas = r.datas.map(d => ({ ...d, tipo: TIPO_APP[d.tipo] || "outro" }));
  return r;
}
function juntarGrupos(blocos) {
  const out = [];
  for (const b of blocos) for (const g of b.grupos) {
    const ex = out.find(o => normaliza(o.nome) === normaliza(g.nome));
    if (ex) { for (const a of g.assuntos) if (!ex.assuntos.some(x => normaliza(x) === normaliza(a))) ex.assuntos.push(a); }
    else out.push({ nome: g.nome, assuntos: g.assuntos.slice() });
  }
  return out;
}
window.analisarEdital = analisarEdital;
window.lerEditalPdf = lerEditalPdf;
window.juntarGrupos = juntarGrupos;
})();
