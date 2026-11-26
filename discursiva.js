/* Estudo Fácil · treino da prova discursiva e a ponte com o instrutor (Claude).
   A correção não usa API: o app copia o texto, a pessoa cola na conversa do Claude (Projeto Estudo Fácil) e o instrutor
   grava a correção em instrutor/respostas.json (chave disc:<tema>), que o app lê ao abrir e mostra junto do tema.
   O arquivo é público: não entra nele nada pessoal. */
"use strict";
const CDN = 'https://cdn.cebraspe.org.br/concursos/';
const URL_CLAUDE = 'https://claude.ai/project/01a13276-3f92-72f9-bcdd-060873067561';
let INSTRUTOR = LS.get('instrutor', {}) || {};
async function instrutorCarregar() {
  try { const r = await fetch('instrutor/respostas.json', { cache: 'no-cache' }); if (!r.ok) return; const o = await r.json(); if (o && typeof o === 'object') { INSTRUTOR = o; LS.set('instrutor', o); } } catch {}
}
async function copiarTexto(txt) {
  try { await navigator.clipboard.writeText(txt); return true; } catch {}
  try { const a = document.createElement('textarea'); a.value = txt; a.setAttribute('readonly', ''); a.style.cssText = 'position:fixed;opacity:0;top:0;left:0'; document.body.appendChild(a); a.select(); const ok = document.execCommand('copy'); a.remove(); return ok; } catch { return false; }
}

/* ---------- prova discursiva: temas reais do Cebraspe e temas do instrutor ----------
   Dos temas oficiais ficam aqui só o resumo, com as palavras do instrutor, e os endereços do enunciado e do padrão de
   resposta. Os temas marcados como "do instrutor" são inéditos, escritos no formato que a banca usa. */
const DISCURSIVAS = [
  { id: 'anm24-lgpd', oficial: true, org: 'ANM', ano: 2025, m: 'anpd-lgpd', tipo: 'Texto dissertativo', linhas: 45, pontos: 30,
    tema: 'Comunicação institucional que protege dados pessoais e mantém a transparência, à luz da LGPD',
    url: CDN + 'ANM_24/arquivos/PROVA_DISCURSIVA_CARGO_13.PDF',
    topicos: [['Por que as medidas de segurança valem da concepção à execução do tratamento', 7.5], ['Como um programa de governança em privacidade ajuda a cumprir a LGPD', 7], ['Dois exemplos do que se comunica à ANPD num incidente com risco ou dano relevante', 7], ['Boas práticas e governança como reforço da confiança entre o órgão e o cidadão', 7]],
    espera: ['Art. 46, § 2º: segurança desde a concepção (privacy by design), em todo o ciclo de vida do dado.', 'Art. 50, § 2º, I: o programa de governança mostra comprometimento, mapeia riscos, tem plano de resposta a incidentes e é atualizado.', 'Art. 48, § 1º: natureza dos dados afetados, titulares envolvidos, medidas de segurança, riscos e medidas adotadas para reverter ou mitigar.', 'Transparência, prestação de contas e livre acesso (art. 6º) e as regras do poder público (art. 23).'] },
  { id: 'antt24-sandbox', oficial: true, org: 'ANTT', ano: 2024, m: 'anpd-regul', tipo: 'Parecer', linhas: 60, pontos: 80,
    tema: 'Parecer sobre proposta de ambiente regulatório experimental (sandbox) com inteligência artificial',
    url: CDN + 'antt_23/arquivos/951_ANTT_DISC.PDF', padrao: CDN + 'antt_23/arquivos/ANTT_23_PADRO_DE_RESPOSTA_DEFINITIVO.PDF',
    topicos: [['Contextualizar a inovação e ligá-la aos objetivos da regulação: preço, qualidade, eficiência e escala', 0], ['Aplicar ao caso os requisitos da norma do sandbox, um a um', 0], ['Concluir: reprovar ou aprovar com ajustes, com justificativa e ajustes viáveis', 0]],
    espera: ['A banca não aceitou aprovação integral: a proposta tinha falhas plantadas no enunciado.', 'A nota de cada quesito sobe com o número de requisitos da norma corretamente aplicados ao caso (um, dois, três, quatro ou mais).', 'Estrutura de parecer: introdução que contextualiza, análise à luz da norma e conclusão com posição clara.'] },
  { id: 'anatel24-dados', oficial: true, org: 'ANATEL', ano: 2024, m: 'anpd-dig', tipo: 'Texto dissertativo', linhas: 30, pontos: 20,
    tema: 'Requisição direta de dados e comunicações a provedores no país e no exterior (Constituição, Marco Civil e STF)',
    url: CDN + 'ANATEL_24/arquivos/961_ANATEL_003_DISC.PDF', padrao: CDN + 'ANATEL_24/arquivos/ANATEL_24_PADRO_DEFINITIVO_DE_RESPOSTAS___CARGO_3.PDF',
    topicos: [['Acesso a dados de provedores de conexão e de aplicações sediados no país', 2.5], ['O mesmo acesso quando o provedor está no exterior', 10], ['Requisito para acessar dados pessoais, comunicações privadas e registros de conexão', 4], ['Sanções para quem descumpre', 2.5]],
    espera: ['Marco Civil, art. 11: quem coleta ou trata dados no Brasil segue a lei brasileira, ainda que a sede seja no exterior.', 'STF, ADC 51: a requisição direta a provedor estrangeiro é válida, sem depender de cooperação internacional, quando há coleta no Brasil ou empresa com representação no país.', 'Conteúdo de comunicações e registros exigem ordem judicial; dados cadastrais podem ser requisitados por autoridade administrativa com competência legal (art. 10).', 'Marco Civil, art. 12: advertência, multa de até 10% do faturamento no Brasil, suspensão temporária e proibição das atividades.'] },
  { id: 'i-incidente', oficial: false, org: 'Instrutor', ano: 2026, m: 'anpd-lgpd', tipo: 'Texto dissertativo', linhas: 30, pontos: 30,
    tema: 'Um hospital público descobre que dados de saúde de pacientes ficaram expostos na internet por três semanas. Redija um texto sobre a resposta ao incidente, à luz da LGPD e do regulamento da ANPD',
    topicos: [['Quando o incidente precisa ser comunicado e a quem', 7.5], ['Prazo e conteúdo mínimo da comunicação à ANPD e aos titulares', 7], ['Por que o fato de serem dados sensíveis pesa na avaliação do risco', 7], ['Sanções que a ANPD pode aplicar a um órgão público', 7]],
    espera: ['Art. 48: comunica-se à ANPD e aos titulares o incidente que possa acarretar risco ou dano relevante.', 'Resolução CD/ANPD nº 15/2024: três dias úteis, contados do conhecimento de que dados pessoais foram afetados; natureza dos dados, titulares, medidas de segurança, riscos e mitigação.', 'Dado de saúde é sensível (art. 5º, II): o regulamento trata o envolvimento de dados sensíveis como critério de risco relevante.', 'Art. 52, § 3º: órgão público não leva multa; cabem advertência, publicização, bloqueio, eliminação, suspensões e proibição.'] },
  { id: 'i-air', oficial: false, org: 'Instrutor', ano: 2026, m: 'anpd-regul', tipo: 'Parecer', linhas: 45, pontos: 40,
    tema: 'A ANPD pretende editar resolução sobre a revisão de decisões automatizadas. A área técnica propõe dispensar a análise de impacto regulatório para ganhar tempo. Redija um parecer sobre a proposta',
    topicos: [['O que é a AIR e quando ela é obrigatória para uma agência reguladora', 10], ['Hipóteses em que a AIR pode ser dispensada e o que a dispensa exige', 9.5], ['Participação social no processo: consulta e audiência públicas', 9], ['Conclusão: posição sobre a dispensa, com justificativa', 9.5]],
    espera: ['Lei 13.848/2019, art. 6º, e Decreto 10.411/2020: a AIR precede atos normativos de interesse geral de agentes econômicos ou usuários.', 'Decreto 10.411/2020, art. 4º: urgência, baixo impacto e outras hipóteses, sempre com nota técnica que fundamente; na urgência, há avaliação de resultado em até três anos.', 'Lei 13.848/2019, art. 9º: consulta pública de pelo menos 45 dias, salvo urgência motivada; LGPD, art. 55-J, § 2º.', 'Ganhar tempo, sozinho, não é hipótese de dispensa: conclui-se pela realização da AIR ou pela demonstração de urgência real.'] },
  { id: 'i-agencia', oficial: false, org: 'Instrutor', ano: 2026, m: 'anpd-inst', tipo: 'Texto dissertativo', linhas: 30, pontos: 30,
    tema: 'A transformação da ANPD em agência reguladora: o que muda na autonomia, no processo decisório e no controle social',
    topicos: [['Natureza de autarquia especial e o que caracteriza a autonomia', 7.5], ['Decisão colegiada, mandato e estabilidade dos dirigentes', 7], ['Instrumentos de controle social e de prestação de contas', 7], ['Limites: controle externo e articulação com outros órgãos', 7]],
    espera: ['Lei 15.352/2026 e Lei 13.848/2019, art. 3º: ausência de tutela e de subordinação hierárquica; autonomia funcional, decisória, administrativa e financeira.', 'Decisões do Conselho Diretor por maioria absoluta, em reunião pública e gravada; mandato fixo e perda só nas hipóteses da lei.', 'AIR, consulta e audiência públicas, agenda regulatória, plano estratégico, plano de gestão anual, relatório anual e ouvidoria.', 'Controle externo pelo Congresso, com o auxílio do TCU, e articulação com defesa da concorrência e do consumidor.'] },
];
const DISC = new Map(DISCURSIVAS.map(d => [d.id, d]));
const redacaoDe = id => DB.redacoes.find(r => r.id === id) || null;
// uma linha manuscrita de prova leva perto de onze palavras
const linhasDe = txt => { const n = (txt || '').trim().split(/\s+/).filter(Boolean).length; return { palavras: n, linhas: Math.ceil(n / 11) }; };
let redId = null, discSalvar = 0;
const viewDiscursivas = {
  html() {
    const lin = d => { const r = redacaoDe(d.id), L = r ? linhasDe(r.txt) : null;
      return `<li><button type="button" class="lin" data-act="abrir-red" data-id="${d.id}"><span class="lin-ic">${I.lapis}</span><span class="lin-tx"><b>${esc(d.tema)}</b><small>${d.oficial ? `${esc(d.org)} ${d.ano} · ` : ''}${esc(d.tipo)} · até ${d.linhas} linhas</small><small>${r && r.env ? 'Enviada ao instrutor' : L && L.palavras ? `Rascunho com cerca de ${plural(L.linhas, 'linha', 'linhas')}` : 'Ainda não escrita'}</small></span>${I.seta}</button></li>`; };
    return `${voltaMais()}${cab('Discursiva', 'Escreva, compare com o que a banca espera e mande para o instrutor corrigir.')}
      <section aria-labelledby="ds-of"><div class="sec-cab"><h2 class="sec-t" id="ds-of">Temas que o Cebraspe cobrou</h2></div><ul class="card lista">${DISCURSIVAS.filter(d => d.oficial).map(lin).join('')}</ul></section>
      <section aria-labelledby="ds-in"><div class="sec-cab"><h2 class="sec-t" id="ds-in">Temas do instrutor para a ANPD</h2></div><ul class="card lista">${DISCURSIVAS.filter(d => !d.oficial).map(lin).join('')}</ul>
        <p class="apoio">Inéditos, no formato da banca: situação, tópicos com pontuação e limite de linhas.</p></section>`;
  },
};
const viewDiscursiva = {
  html() {
    const d = DISC.get(redId); if (!d) return '';
    const r = redacaoDe(d.id), txt = r ? r.txt || '' : '', L = linhasDe(txt), corr = (INSTRUTOR['disc:' + d.id] || []).slice(-1)[0];
    return `<button type="button" class="volta" data-kf-ir="discursivas">${I.volta}<span>Discursiva</span></button>${cab(d.oficial ? `${d.org} ${d.ano}` : 'Tema do instrutor', esc(d.tipo))}
      <section class="folha disc-capa"><p class="disc-tema">${esc(d.tema)}</p>
        <dl class="resumo"><div><dt>Extensão</dt><dd>até ${d.linhas} linhas</dd></div><div><dt>Valor</dt><dd>${nBR(d.pontos)} pontos</dd></div></dl>
        ${d.url ? `<a class="kf-btn kf-sec bloco" href="${esc(d.url)}" target="_blank" rel="noopener noreferrer">Abrir o enunciado oficial<span class="kf-so-leitor"> (abre em outra aba)</span></a>` : ''}</section>
      <section class="card" aria-labelledby="ds-tp"><h2 class="sec-t" id="ds-tp">O que desenvolver</h2><ol class="disc-top">${d.topicos.map(([t, v]) => `<li><span>${esc(t)}</span>${v ? `<b>${nBR(v)} pts</b>` : ''}</li>`).join('')}</ol>
        <p class="apoio">${soma(d.topicos, t => t[1]) ? `Apresentação e estrutura do texto: ${nBR(Math.round((d.pontos - soma(d.topicos, t => t[1])) * 100) / 100)} ${d.pontos - soma(d.topicos, t => t[1]) === 1 ? 'ponto' : 'pontos'}.` : 'A banca não divulgou os pontos por tópico; apresentação e estrutura valem 4 pontos.'}</p></section>
      <section class="card" aria-labelledby="ds-tx"><h2 class="sec-t" id="ds-tx">Seu texto</h2>
        <div class="kf-campo"><label class="kf-rotulo" for="ds-txt">Escreva aqui</label><textarea id="ds-txt" class="kf-entrada disc-txt" rows="14" maxlength="12000" spellcheck="true">${esc(txt)}</textarea></div>
        <p class="apoio" id="ds-cont" role="status">${contagemDisc(L, d)}</p>
        <button type="button" class="kf-btn kf-pri bloco" id="ds-enviar">Enviar ao instrutor</button>
        ${r && r.env ? `<p class="apoio">Enviada em ${fmtData(iso(new Date(r.env)))}. A correção aparece aqui quando o instrutor gravar.</p>` : ''}</section>
      ${corr ? `<section class="card" aria-labelledby="ds-co"><h2 class="sec-t" id="ds-co">Correção do instrutor</h2><div class="correcao"><span class="rotulo-mini">${esc(corr.em || '')}</span><p>${esc(corr.r || '')}</p></div></section>` : ''}
      <section aria-labelledby="ds-es"><div class="sec-cab"><h2 class="sec-t" id="ds-es">Depois de escrever</h2></div><div class="card apoio-secoes">
        <details data-kf-secao="grupo"><summary><b>Ver o que a banca espera</b></summary><ol class="lista-simples">${d.espera.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
          ${d.padrao ? `<a class="kf-btn kf-link" href="${esc(d.padrao)}" target="_blank" rel="noopener noreferrer">Abrir o padrão de resposta oficial<span class="kf-so-leitor"> (abre em outra aba)</span></a>` : `<p class="apoio">${d.oficial ? 'Resumo do instrutor, com base na lei.' : 'Espelho do instrutor.'}</p>`}</details></div></section>`;
  },
  ligar(v) {
    const d = DISC.get(redId), ta = $('#ds-txt', v); if (!d || !ta) return;
    const guardar = () => { clearTimeout(discSalvar); let r = redacaoDe(d.id); if (!r) { if (!ta.value.trim()) return; r = { id: d.id, txt: '', env: 0 }; DB.redacoes.push(r); } if (r.txt === ta.value) return; r.txt = ta.value; r.em = agora(); salvar({ quieto: true }); };
    ta.addEventListener('input', () => { $('#ds-cont', v).textContent = contagemDisc(linhasDe(ta.value), d); clearTimeout(discSalvar); discSalvar = setTimeout(guardar, 900); });
    ta.addEventListener('blur', guardar);
    $('#ds-enviar', v).addEventListener('click', async () => {
      guardar(); const L = linhasDe(ta.value);
      if (L.palavras < 30) { KitFacil.apontar(ta); avisar('Escreva o seu texto antes de enviar.'); return; }
      const txt = ['[Estudo Fácil · discursiva para correção]', `Tema (${d.oficial ? `${d.org} ${d.ano}, oficial` : 'do instrutor'}; id ${d.id}): ${d.tema}`, `${d.tipo}, até ${d.linhas} linhas, ${d.pontos} pontos. Tópicos: ${d.topicos.map(([t, p], i) => `${i + 1}) ${t}${p ? ` [${p}]` : ''}`).join(' ')}`, `Meu texto (cerca de ${L.linhas} linhas):\n${ta.value.trim()}`, 'Corrija como a banca: nota por tópico, o que faltou, erros de português e uma nota final. Grave a correção no app.'].join('\n\n');
      const ok = await copiarTexto(txt);
      if (ok) { const r = redacaoDe(d.id); r.env = agora(); salvar({ quieto: true }); window.open(URL_CLAUDE, '_blank', 'noopener'); }
      avisar(ok ? 'Texto copiado. Cole no Claude e envie.' : 'Não deu para copiar. Tente de novo.');
    });
  },
};
const contagemDisc = (L, d) => !L.palavras ? `Limite: ${d.linhas} linhas, perto de ${d.linhas * 11} palavras.` : `${plural(L.palavras, 'palavra', 'palavras')}, perto de ${plural(L.linhas, 'linha', 'linhas')} de ${d.linhas}.${L.linhas > d.linhas ? ' Passou do limite: a banca despreza o excesso.' : ''}`;
