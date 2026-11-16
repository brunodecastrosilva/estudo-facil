/* Estudo Fácil 1.4 · teste do leitor de caderno de prova (instrutor/leitor-de-prova.js), a ferramenta da "ponte".
   O PDF é montado aqui, com texto inventado, no desenho dos cadernos do Cebraspe: duas colunas, número do item sozinho
   na margem, linhas do item recuadas, texto de apoio e comando na margem. Nenhum texto de prova entra no repositório. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const pdfjs = createRequire(import.meta.url)('pdfjs-dist/legacy/build/pdf.js');
const { lerCadernoPDF } = new Function(readFileSync(new URL('../instrutor/leitor-de-prova.js', import.meta.url), 'utf8') + '\nreturn { lerCadernoPDF };')();

// cada pedaço: [x, y, fonte (1 normal, 2 negrito), tamanho, texto]
function pdf(paginas) {
  const objs = [], add = s => objs.push(s);
  add('<< /Type /Catalog /Pages 2 0 R >>'); add(null);
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  const kids = [];
  for (const P of paginas) {
    const c = P.map(([x, y, f, t, s]) => `BT /F${f} ${t} Tf 1 0 0 1 ${x} ${y} Tm (${s.replace(/([\\()])/g, '\\$1')}) Tj ET`).join('\n');
    add(`<< /Length ${Buffer.byteLength(c, 'latin1')} >>\nstream\n${c}\nendstream`);
    add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${objs.length} 0 R >>`); kids.push(objs.length);
  }
  objs[1] = `<< /Type /Pages /Kids [${kids.map(k => k + ' 0 R').join(' ')}] /Count ${kids.length} >>`;
  let out = '%PDF-1.4\n'; const pos = [];
  objs.forEach((o, i) => { pos.push(Buffer.byteLength(out, 'latin1')); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const x = Buffer.byteLength(out, 'latin1');
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${pos.map(p => String(p).padStart(10, '0') + ' 00000 n \n').join('')}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`;
  return new Uint8Array(Buffer.from(out, 'latin1'));
}
const CADERNO = [[
  [405, 803, 1, 8, 'BANCA INVENTADA - cabeçalho da página'],
  [28, 787, 1, 10, 'Instruções: cada item vale um ponto e a marcação'], [324, 787, 1, 10, 'continua do outro lado, na largura toda.'],
  [42, 775, 1, 10, 'errada desconta um ponto.'], [324, 775, 1, 10, 'Marque C, caso'],
  [207, 500, 2, 15, '-- PROVAS OBJETIVAS --'],
  // coluna da esquerda
  [28, 480, 2, 10, 'Texto CB1'],
  [57, 467, 1, 10, 'Primeiro parágrafo do texto inventado,'], [28, 456, 1, 10, 'que continua na linha de baixo.'],
  [120, 440, 1, 6, 'Fonte inventada, 2026.'],
  [28, 420, 1, 10, 'Com base no texto CB1, julgue os itens'], [28, 409, 1, 10, 'a seguir.'],
  [28, 395, 2, 9, '1'], [46, 395, 1, 10, 'O item um afirma algo'],
  [46, 384, 1, 10, 'com a Lei n.'], [104, 388, 1, 6, 'o'], [112, 384, 1, 10, '9.784.'],
  [28, 370, 2, 9, '2'], [46, 370, 1, 10, 'O item dois traz'], [124, 370, 2, 10, 'um trecho'], [176, 370, 1, 10, 'em destaque'],
  // coluna da direita: o item 2 termina aqui; depois vem uma situação hipotética sem título
  [321, 480, 1, 10, 'e termina na outra coluna.'],
  [332, 455, 1, 10, 'Um servidor inventado pediu vista.'], [303, 444, 1, 10, 'O pedido foi negado.'],
  [303, 424, 1, 10, 'Considerando essa situação, julgue o item'], [303, 413, 1, 10, 'seguinte.'],
  [303, 399, 2, 9, '3'], [321, 399, 1, 10, 'O item três é curto.'],
  [303, 380, 2, 9, '4'],
  [303, 360, 1, 10, 'Julgue os próximos itens.'],
  [303, 346, 2, 9, '5'], [321, 346, 1, 10, 'O item cinco tem 2 partes e'], [321, 335, 1, 10, '3 anos de prazo.'],
  [350, 300, 2, 10, 'Espaço livre'],
], [
  [405, 803, 1, 8, 'BANCA INVENTADA - cabeçalho da página'],
  [28, 780, 2, 9, '6'], [46, 780, 1, 10, 'O item seis fecha a prova.'],
  [28, 760, 1, 10, 'Depois da prova objetiva vem a discursiva,'], [28, 749, 1, 10, 'que não entra.'],
  [28, 738, 1, 10, 'Linha na margem.'], [28, 727, 1, 10, 'Outra linha na margem.'], [28, 716, 1, 10, 'Mais uma.'],
]];

test('leitor: acha os itens, junta o item que muda de coluna, separa texto de apoio e comando e ignora o que não é prova', async () => {
  const r = await lerCadernoPDF(pdfjs, pdf(CADERNO), { de: 1, ate: 6 });
  assert.deepEqual(Object.keys(r.itens).map(Number), [1, 2, 3, 4, 5, 6]);
  assert.match(r.itens[1], /^O item um afirma algo com a Lei n\. ?o ?9\.784\.$/, 'o sobrescrito entra na linha');
  assert.equal(r.itens[2], 'O item dois traz \u0001um trecho\u0002 em destaque e termina na outra coluna.', 'destaque marcado e item que muda de coluna');
  assert.equal(r.itens[3], 'O item três é curto.'); assert.equal(r.itens[4], '', 'item só com figura fica vazio');
  assert.equal(r.itens[5], 'O item cinco tem 2 partes e 3 anos de prazo.', 'número no começo de linha recuada não é item');
  assert.equal(r.itens[6], 'O item seis fecha a prova.', 'depois do último item, nada entra');
  assert.deepEqual(r.grupos.map(g => g.de), [1, 3, 5]);
  assert.equal(r.grupos[0].cmd, 'Com base no texto CB1, julgue os itens a seguir.');
  assert.equal(r.grupos[0].apoio, '\u0001Texto CB1\u0002\nPrimeiro parágrafo do texto inventado, que continua na linha de baixo.\nFonte inventada, 2026.', 'título, parágrafo e crédito; sem instruções nem cabeçalho');
  assert.equal(r.grupos[1].cmd, 'Considerando essa situação, julgue o item seguinte.');
  assert.equal(r.grupos[1].apoio, 'Um servidor inventado pediu vista. O pedido foi negado.', 'a situação hipotética não gruda no item anterior');
  assert.deepEqual([r.grupos[2].cmd, r.grupos[2].apoio], ['Julgue os próximos itens.', '']);
});

test('leitor: prova que começa em outro número (conhecimentos específicos)', async () => {
  const P = [[[207, 780, 2, 15, '-- CONHECIMENTOS ESPECÍFICOS --'], [28, 750, 1, 10, 'Julgue os itens a seguir.'],
    ...[51, 52, 53, 54, 55].flatMap((n, i) => [[28, 730 - i * 24, 2, 9, String(n)], [46, 730 - i * 24, 1, 10, `Item ${n} inventado,`], [46, 719 - i * 24, 1, 10, 'em duas linhas.']])]];
  const r = await lerCadernoPDF(pdfjs, pdf(P), { de: 51, ate: 55 });
  assert.deepEqual(Object.keys(r.itens).map(Number), [51, 52, 53, 54, 55]); assert.equal(r.itens[53], 'Item 53 inventado, em duas linhas.'); assert.equal(r.grupos[0].cmd, 'Julgue os itens a seguir.');
});
