/* Plano de fábrica: ANPD, Especialista em Regulação de Proteção de Dados.
   Situação conferida em 16/11/2026: concurso autorizado (Portaria MGI nº 5.092/2026, 50 vagas), comissão organizadora
   instituída (Portaria GABPR/ANPD nº 759, DOU de 11/11/2026), Cebraspe escolhido como banca (despacho de 14/11/2026) e
   edital ainda NÃO publicado (previsão da ANPD: até 24/12/2026).
   Disciplinas, número de itens, pesos e data da prova são ESTIMATIVAS do app, no formato comum do Cebraspe para agências
   reguladoras. Quando o edital sair, troque tudo pelo oficial (Mais → Concursos).
   Os ids são fixos para que dois aparelhos sincronizados reconheçam os mesmos assuntos. */
const EDITAL_ANPD = {
  id: "anpd-2027",
  base: "anpd",
  previsto: true,
  conferido: "2026-11-16",
  sigla: "ANPD",
  orgao: "Agência Nacional de Proteção de Dados",
  cargo: "Especialista em Regulação de Proteção de Dados",
  banca: "Cebraspe",
  site: "https://www.gov.br/anpd/pt-br",
  remuneracao: "R$ 17.726,42 (inicial)",
  vagas: "50 imediatas: 31 de ampla concorrência, 13 para pessoas negras, 3 para pessoas com deficiência, 2 para indígenas e 1 para quilombolas",
  lotacao: "A confirmar no edital (a sede da ANPD fica em Brasília/DF)",
  regime: "Estatutário, na carreira de Regulação e Fiscalização de Proteção de Dados (Lei 15.352/2026)",
  dataEdital: "2026-12-24",
  dataProva: "2027-04-18",
  resumoPrevisto: "Edital ainda não publicado. A ANPD prevê publicar até 24/12/2026; a prova só pode acontecer pelo menos dois meses depois.",
  notaPesos: "Estimativa do Estudo Fácil: 50 itens de certo ou errado de conhecimentos gerais (peso 1) e 70 de específicos (peso 2), como é comum no Cebraspe. Troque pelos números do edital quando ele sair.",
  fatos: [
    ["Autorização", "Portaria MGI nº 5.092/2026, publicada em 24/06/2026: 50 vagas"],
    ["Carreira", "Lei 15.352/2026: 200 cargos de Especialista, subsídio de R$ 17.726,42 a R$ 29.119,71"],
    ["Comissão", "Portaria GABPR/ANPD nº 759, no DOU de 11/11/2026"],
    ["Banca", "Cebraspe: contratação autorizada em 14/11/2026, com assinatura prevista para 20/11"],
    ["Cadastro de reserva", "Até 150 candidatos, segundo o despacho da contratação"],
    ["Edital", "Previsto pela ANPD até 24/12/2026"],
    ["Prova", "No mínimo dois meses depois do edital; abril de 2027 é estimativa do app"],
    ["Etapas", "Objetiva e, provavelmente, discursiva; o curso de formação está previsto na lei da carreira"],
    ["Áreas", "A imprensa fala em quatro especialidades; os nomes saem no edital"]
  ],
  fases: [
    { id: "f1", nome: "Base antes do edital", ini: "2026-11-15", fim: "2026-12-24", ate: "até o edital sair",
      foco: "O que quase certamente cai: LGPD, regulamentos da ANPD, regulação e Direito Administrativo.",
      metas: [
        "Leia a LGPD inteira uma vez, com a lei aberta ao lado.",
        "Estude as resoluções 1/2021, 4/2023, 15/2024, 18/2024 e 19/2024.",
        "Leia a Lei 13.848/2019 e a Lei 15.352/2026.",
        "Feche metade de Direito Administrativo.",
        "Português duas vezes por semana, sempre com questões."
      ] },
    { id: "f2", nome: "Edital na mão", ini: "2026-12-25", fim: "2027-03-18", ate: "do edital até 30 dias antes da prova",
      foco: "Cobrir o edital oficial inteiro e resolver questões da banca a cada assunto.",
      metas: [
        "No dia do edital, troque as disciplinas, os pesos e a data da prova pelo oficial.",
        "Termine a teoria de todos os assuntos.",
        "Resolva pelo menos 20 itens do Cebraspe por assunto estudado.",
        "Escreva uma discursiva por semana sobre LGPD ou regulação.",
        "Mantenha as revisões em dia: elas valem mais que assunto novo."
      ] },
    { id: "f3", nome: "Reta final", ini: "2027-03-19", fim: "2027-04-18", ate: "últimos 30 dias",
      foco: "Nada de assunto novo: revisão, lei seca e simulados.",
      metas: [
        "Um simulado completo por semana, registrado no app.",
        "Releia LGPD, Lei 13.848, Lei 15.352 e ECA Digital.",
        "Refaça as questões que você errou.",
        "Duas discursivas por semana, com tempo marcado.",
        "Na última semana, só revisões leves e sono em dia."
      ] }
  ],
  semana: [
    "Todo dia: 1 bloco de LGPD ou de regulamentos da ANPD.",
    "Segunda, quarta e sexta: Direito Administrativo ou Regulação.",
    "Terça e quinta: Português ou Direito Constitucional.",
    "Sábado: questões e revisão da semana; discursiva a partir do edital.",
    "Domingo: descanso, ou só as revisões do dia."
  ],
  fontes: [
    ["LGPD (Lei 13.709/2018), texto compilado", "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"],
    ["Lei 15.352/2026: a ANPD como agência e a carreira", "https://www2.camara.leg.br/legin/fed/lei/2026/lei-15352-25-fevereiro-2026-798731-publicacaooriginal-178208-pl.html"],
    ["Lei Geral das Agências (Lei 13.848/2019)", "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2019/lei/l13848.htm"],
    ["Regulamentações da ANPD (resoluções)", "https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd"],
    ["Site da ANPD: guias, notícias e o edital, quando sair", "https://www.gov.br/anpd/pt-br"]
  ],
  prova: {
    minPct: 50,
    naoZerar: false,
    grupos: [
      { id: "gerais", nome: "Conhecimentos gerais", q: 50, valor: 1 },
      { id: "esp", nome: "Conhecimentos específicos", q: 70, valor: 2 }
    ]
  },
  datas: [
    { id: "d01", tipo: "aviso", titulo: "Lei 15.352/2026: ANPD vira agência e ganha carreira própria", ini: "2026-02-25" },
    { id: "d02", tipo: "aviso", titulo: "Concurso autorizado: 50 vagas (Portaria MGI nº 5.092/2026)", ini: "2026-06-24" },
    { id: "d03", tipo: "aviso", titulo: "Comissão organizadora instituída (Portaria nº 759)", ini: "2026-11-11" },
    { id: "d03b", tipo: "aviso", titulo: "Cebraspe escolhido como banca do concurso", ini: "2026-11-14" },
    { id: "d04", tipo: "publicacao", titulo: "Prazo previsto pela ANPD para publicar o edital", ini: "2026-12-24", acao: true },
    { id: "d05", tipo: "prova", titulo: "Prova (data estimada pelo app; confirme no edital)", ini: "2027-04-18", acao: true }
  ],
  /* q: itens estimados; f1: quanto a disciplina pesa na fase 1 (antes do edital); dica: como estudar */
  materias: [
    { id: "anpd-lgpd", grupo: "esp", nome: "LGPD (Lei 13.709/2018)", q: 18, f1: 2, cor: 0,
      dica: "É o coração do cargo. Leia a lei seca primeiro; depois resolva questões artigo por artigo.",
      topicos: [
        "Aplicação da lei: abrangência territorial e exceções (arts. 1º a 4º)",
        "Conceitos: dado pessoal, sensível, anonimizado, titular, controlador, operador e encarregado (art. 5º)",
        "Princípios do tratamento (art. 6º)",
        "Bases legais do tratamento (art. 7º)",
        "Consentimento e transparência ao titular (arts. 8º e 9º)",
        "Legítimo interesse (art. 10)",
        "Dados pessoais sensíveis (arts. 11 a 13)",
        "Dados de crianças e adolescentes (art. 14)",
        "Término do tratamento e eliminação (arts. 15 e 16)",
        "Direitos do titular (arts. 17 a 22)",
        "Decisões automatizadas e revisão (art. 20)",
        "Tratamento pelo poder público (arts. 23 a 32)",
        "Transferência internacional de dados (arts. 33 a 36)",
        "Agentes de tratamento, registro das operações e relatório de impacto (arts. 37 a 41)",
        "Responsabilidade e ressarcimento de danos (arts. 42 a 45)",
        "Segurança, sigilo e incidentes (arts. 46 a 49)",
        "Boas práticas e governança (arts. 50 e 51)",
        "Sanções administrativas (arts. 52 a 54)",
        "ANPD e Conselho Nacional de Proteção de Dados (arts. 55-A a 58-B)"
      ] },
    { id: "anpd-reg", grupo: "esp", nome: "Regulamentos e orientações da ANPD", q: 12, f1: 1.6, cor: 1,
      dica: "Leia cada resolução logo depois do capítulo da LGPD que ela regulamenta.",
      topicos: [
        "Fiscalização e processo administrativo sancionador (Resolução CD/ANPD nº 1/2021)",
        "Agentes de tratamento de pequeno porte (Resolução CD/ANPD nº 2/2022)",
        "Dosimetria e aplicação de sanções (Resolução CD/ANPD nº 4/2023)",
        "Comunicação de incidente de segurança (Resolução CD/ANPD nº 15/2024)",
        "Atuação do encarregado (Resolução CD/ANPD nº 18/2024)",
        "Transferência internacional e cláusulas-padrão contratuais (Resolução CD/ANPD nº 19/2024)",
        "Mapa de Temas Prioritários 2026-2027 (Resolução CD/ANPD nº 30/2025)",
        "Decisão de adequação da União Europeia (Resolução CD/ANPD nº 32/2026)",
        "Agenda regulatória e processo normativo da ANPD",
        "Guias orientativos: agentes de tratamento e encarregado",
        "Guias orientativos: legítimo interesse e tratamento pelo poder público",
        "Guias orientativos: cookies, segurança da informação e relatório de impacto",
        "Enunciados e decisões relevantes do Conselho Diretor"
      ] },
    { id: "anpd-inst", grupo: "esp", nome: "A ANPD como agência e o ECA Digital", q: 8, f1: 1.3, cor: 2,
      dica: "Assunto novo, sem questões antigas: estude pela lei e pelas notícias do site da ANPD.",
      topicos: [
        "Lei 15.352/2026: transformação da ANPD em agência reguladora",
        "Autonomia funcional, técnica, decisória, administrativa e financeira",
        "Estrutura regimental (Decreto 12.881/2026): Conselho Diretor e superintendências",
        "Conselho Nacional de Proteção de Dados Pessoais e da Privacidade",
        "Carreira de Regulação e Fiscalização de Proteção de Dados: cargo e atribuições",
        "Competências da ANPD na LGPD (art. 55-J)",
        "ECA Digital (Lei 15.211/2025): proteção de crianças e adolescentes em ambientes digitais",
        "ECA Digital: deveres de plataformas, verificação de idade e supervisão parental",
        "ECA Digital: fiscalização e sanções a cargo da ANPD",
        "Planejamento estratégico e relatórios de gestão da ANPD"
      ] },
    { id: "anpd-regul", grupo: "esp", nome: "Regulação e agências reguladoras", q: 10, f1: 1.3, cor: 3,
      dica: "Base de todo concurso de agência. Comece pela Lei 13.848/2019 e pelo decreto da AIR.",
      topicos: [
        "Estado regulador: fundamentos e evolução no Brasil",
        "Falhas de mercado: externalidades, assimetria de informação, poder de mercado e bens públicos",
        "Teorias da regulação: interesse público, captura e escolha pública",
        "Lei Geral das Agências Reguladoras (Lei 13.848/2019)",
        "Gestão de recursos humanos das agências (Lei 9.986/2000) e carreiras (Lei 10.871/2004)",
        "Análise de Impacto Regulatório (Decreto 10.411/2020) e avaliação de resultado regulatório",
        "Lei de Liberdade Econômica (Lei 13.874/2019): abuso do poder regulatório",
        "Consulta e audiência públicas, agenda regulatória e transparência",
        "Regulação responsiva, sandbox regulatório e enforcement",
        "Controle das agências: TCU, Congresso e Judiciário",
        "Articulação entre reguladores e com o CADE"
      ] },
    { id: "anpd-ti", grupo: "esp", nome: "Tecnologia, segurança da informação e IA", q: 10, f1: 0.8, cor: 4,
      dica: "Foque nos conceitos que aparecem na LGPD: anonimização, incidentes e segurança.",
      topicos: [
        "Segurança da informação: confidencialidade, integridade, disponibilidade e autenticidade",
        "Gestão de riscos e controles (ISO/IEC 27001, 27002 e 27701)",
        "Criptografia, controle de acesso e autenticação",
        "Incidentes de segurança: tipos de ataque, resposta e notificação",
        "Anonimização, pseudonimização e técnicas de reidentificação",
        "Privacy by design e privacy by default",
        "Bancos de dados, modelagem e qualidade de dados",
        "Computação em nuvem e transferência de dados",
        "Big data, ciência de dados e perfilamento",
        "Inteligência artificial: conceitos, riscos e vieses",
        "Regulação de IA: marco legal brasileiro (PL 2.338/2023) e AI Act da União Europeia",
        "Cookies, rastreamento on-line e publicidade direcionada"
      ] },
    { id: "anpd-dig", grupo: "esp", nome: "Direito digital e proteção de dados no mundo", q: 8, f1: 0.8, cor: 5,
      dica: "Compare sempre com a LGPD: o que é igual e o que muda no GDPR e no Marco Civil.",
      topicos: [
        "Marco Civil da Internet (Lei 12.965/2014) e Decreto 8.771/2016",
        "Crimes cibernéticos (Lei 12.737/2012) e Convenção de Budapeste",
        "Código de Defesa do Consumidor aplicado ao ambiente digital",
        "Cadastro Positivo (Lei 12.414/2011)",
        "GDPR da União Europeia: princípios, bases legais e autoridades",
        "Convenção 108+ do Conselho da Europa e diretrizes da OCDE",
        "Jurisprudência do STF sobre proteção de dados (ADI 6387 e compartilhamento de dados)",
        "Proteção de dados no setor público: compartilhamento e interoperabilidade"
      ] },
    { id: "anpd-econ", grupo: "esp", nome: "Economia da regulação e concorrência", q: 4, f1: 0.5, cor: 6,
      dica: "Deixe para depois do edital, a menos que sua área seja Economia.",
      topicos: [
        "Microeconomia aplicada: estruturas de mercado e eficiência",
        "Economia dos dados e de plataformas digitais: efeitos de rede e mercados de dois lados",
        "Defesa da concorrência (Lei 12.529/2011) e interface com proteção de dados",
        "Análise custo-benefício e indicadores regulatórios"
      ] },
    { id: "anpd-da", grupo: "gerais", nome: "Direito Administrativo", q: 14, f1: 1.2, cor: 7,
      dica: "Cai em toda prova. Teoria curta e muitas questões.",
      topicos: [
        "Regime jurídico-administrativo e princípios",
        "Organização administrativa: autarquias, autarquias especiais e agências",
        "Poderes administrativos, com ênfase no poder de polícia",
        "Atos administrativos",
        "Processo administrativo federal (Lei 9.784/1999)",
        "Licitações e contratos (Lei 14.133/2021)",
        "Agentes públicos e regime da Lei 8.112/1990",
        "Responsabilidade civil do Estado",
        "Controle da administração: interno, externo (TCU) e judicial",
        "Improbidade administrativa (Lei 8.429/1992)",
        "Lei Anticorrupção (Lei 12.846/2013)",
        "Lei do Governo Digital (Lei 14.129/2021)"
      ] },
    { id: "anpd-lp", grupo: "gerais", nome: "Língua Portuguesa", q: 14, f1: 1, cor: 8,
      dica: "Pouca teoria, muita questão. Duas sessões curtas por semana bastam para manter.",
      topicos: [
        "Compreensão e interpretação de textos",
        "Tipologia e gêneros textuais",
        "Ortografia e acentuação",
        "Coesão e coerência: referenciação e conectores",
        "Classes de palavras e emprego de tempos e modos verbais",
        "Coordenação e subordinação",
        "Pontuação",
        "Concordância verbal e nominal",
        "Regência verbal e nominal e crase",
        "Colocação pronominal",
        "Reescrita de frases e parágrafos",
        "Redação oficial: Manual de Redação da Presidência da República"
      ] },
    { id: "anpd-dc", grupo: "gerais", nome: "Direito Constitucional", q: 8, f1: 0.9, cor: 9,
      dica: "Comece pelos direitos fundamentais e pela EC 115/2022, que ligam direto à LGPD.",
      topicos: [
        "Princípios fundamentais da Constituição",
        "Direitos e garantias fundamentais",
        "Proteção de dados pessoais como direito fundamental (EC 115/2022, art. 5º, LXXIX)",
        "Intimidade, vida privada, sigilo das comunicações e habeas data",
        "Competências da União sobre proteção de dados (arts. 21, XXVI, e 22, XXX)",
        "Administração pública: princípios e disposições gerais (arts. 37 a 41)",
        "Poder Executivo e Poder Legislativo: atribuições e processo legislativo",
        "Controle de constitucionalidade: noções",
        "Ordem econômica: princípios e atuação do Estado como regulador (arts. 170 a 174)"
      ] },
    { id: "anpd-etica", grupo: "gerais", nome: "Ética, integridade e acesso à informação", q: 8, f1: 0.7, cor: 10,
      dica: "Leis curtas: uma leitura atenta e questões resolvem. A LAI conversa com a LGPD.",
      topicos: [
        "Código de Ética do Servidor Público Federal (Decreto 1.171/1994)",
        "Conflito de interesses (Lei 12.813/2013)",
        "Lei de Acesso à Informação (Lei 12.527/2011) e Decreto 7.724/2012",
        "LAI e LGPD: convivência entre transparência e proteção de dados",
        "Governança pública e integridade (Decreto 9.203/2017)"
      ] },
    { id: "anpd-ing", grupo: "gerais", nome: "Língua Inglesa", q: 6, f1: 0.5, cor: 11,
      dica: "Leia textos de privacidade em inglês: vocabulário do GDPR já ajuda em duas disciplinas.",
      topicos: [
        "Compreensão de textos técnicos sobre privacidade e tecnologia",
        "Vocabulário de proteção de dados (data subject, controller, processor)",
        "Estruturas gramaticais e conectores",
        "Inferência e ideia principal"
      ] }
  ]
};

const BIBLIOTECA = [EDITAL_ANPD];
