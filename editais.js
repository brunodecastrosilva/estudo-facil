/* Edital que acompanha o app: Processo Seletivo ABDI 2026 (Edital nº 01/2026, FGV).
   Conteúdo do Anexo II separado em matérias e tópicos, cronograma previsto e estrutura da prova.
   Os ids são fixos para que dois aparelhos sincronizados reconheçam os mesmos tópicos. */
"use strict";

const EDITAL_ABDI = {
  id: "abdi-2026",
  base: "abdi",
  notaPesos: "O edital não divide as 20 questões específicas entre os temas do perfil. A estimativa por tema segue o número de assuntos de cada um.",
  sigla: "ABDI",
  orgao: "Agência Brasileira de Desenvolvimento Industrial",
  cargo: "Analista de Produtividade e Inovação",
  banca: "FGV",
  numero: "01/2026",
  site: "https://conhecimento.fgv.br/concursos/psabdi",
  email: "psabdi@fgv.br",
  remuneracao: "R$ 16.034,70",
  taxa: "R$ 100,00",
  lotacao: "Brasília/DF",
  regime: "CLT, 40 horas semanais",
  validade: "2 anos, prorrogável por mais 2",
  dataProva: "2026-12-20",
  horaProva: "13h30 às 17h",
  local: "On-line, em casa",
  provaNotas: [
    "A prova é on-line, em casa, das 13h30 às 17h (horário de Brasília). Entre no link com pelo menos 5 minutos de antecedência: depois das 13h30 não dá para entrar.",
    "Use computador (não celular) com webcam e microfone ligados o tempo todo, documento de identidade original com foto e conexão estável.",
    "O teste da plataforma é obrigatório, no mesmo computador e internet do dia da prova. O período sai em comunicado no dia 3 de dezembro.",
    "É proibido sair do campo de visão da câmera, consultar qualquer material e usar calculadora, relógio, celular, lápis ou marca-texto. Fique pelo menos 2 horas na prova."
  ],
  prova: {
    total: 25,
    questoes: 60,
    minPct: 50,
    naoZerar: true,
    grupos: [
      { id: "gerais", nome: "Conhecimentos gerais", q: 20, valor: 0.3 },
      { id: "inst", nome: "Conhecimentos institucionais", q: 20, valor: 0.3 },
      { id: "esp", nome: "Conhecimentos específicos", q: 20, valor: 0.65 }
    ]
  },
  etapas: [
    { nome: "Prova objetiva", tipo: "Eliminatória e classificatória", pontos: 25, texto: "60 questões de 5 alternativas. Aprova quem acerta pelo menos 30 (50%) e não zera nenhuma das três áreas." },
    { nome: "Títulos e experiência", tipo: "Classificatória", pontos: 10, texto: "Especialização 1 ponto cada (até 2), mestrado 1,5, doutorado 2,5, certificações 0,5 cada (até 2) e 0,5 por ano de experiência na área do perfil (até 2). Envio de 3 a 22 de dezembro." },
    { nome: "Entrevista por competências", tipo: "Classificatória", pontos: 15, texto: "On-line e filmada. Avalia comunicação, visão sistêmica, criatividade e adaptabilidade, foco nos resultados e competências técnicas (3 pontos cada). O currículo padrão (Anexo IV) é obrigatório: quem não envia é eliminado." }
  ],
  desempate: "idade igual ou maior que 60 anos, entrevista, títulos, conhecimentos específicos, conhecimentos gerais, maior idade e sorteio.",
  perfis: [
    { id: "cont", nome: "Contabilidade", vagas: 2, cr: 8, requisito: "Graduação em Ciências Contábeis ou correlato, registro ativo no CRC e 6 meses de experiência em atividades contábeis, financeiras ou orçamentárias." },
    { id: "adm", nome: "Administrativo", vagas: 2, cr: 24, requisito: "Graduação em qualquer área e 6 meses de experiência em processos administrativos ou projetos institucionais (contratações, contratos e convênios, patrimônio, planejamento, gestão de projetos e indicadores)." },
    { id: "dados", nome: "Analista de Dados", vagas: 2, cr: 16, requisito: "Graduação em Ciência de Dados, Estatística, Matemática, Economia, Computação ou correlato e 6 meses de experiência com tratamento, análise, modelagem ou visualização de dados." },
    { id: "prod", nome: "Produtividade Industrial", vagas: 6, cr: 48, requisito: "Graduação em qualquer área e 6 meses de experiência em planejamento, execução, acompanhamento ou avaliação de programas e projetos." },
    { id: "ti", nome: "Desenvolvimento de TI", vagas: 2, cr: 16, requisito: "Graduação em Computação, Sistemas de Informação, Engenharia de Software ou correlato e 6 meses de experiência em desenvolvimento, manutenção, teste ou integração de sistemas." },
    { id: "infra", nome: "Infraestrutura e Operação", vagas: 2, cr: 16, requisito: "Graduação em Computação, Redes, Segurança da Informação ou correlato e 6 meses de experiência com infraestrutura de TI (redes, servidores, nuvem, segurança, backup)." },
    { id: "jur", nome: "Jurídico", vagas: 2, cr: 16, requisito: "Bacharelado em Direito, inscrição ativa na OAB e 6 meses de experiência em assessoria, consultoria, pareceres ou contencioso." },
    { id: "rh", nome: "Gestão de Pessoas", vagas: 1, cr: 8, requisito: "Graduação em Administração, Psicologia, Gestão de RH ou correlato e 6 meses de experiência em processos de recursos humanos." },
    { id: "com", nome: "Comunicação e Marketing", vagas: 1, cr: 8, requisito: "Graduação em Comunicação Social, Jornalismo, Publicidade, Relações Públicas, Marketing ou correlato e 6 meses de experiência em comunicação ou marketing." }
  ],
  /* Cronograma previsto (publicado em 20/10/2026). "acao" marca o que depende do candidato. */
  datas: [
    { id: "d01", tipo: "publicacao", titulo: "Publicação do edital", ini: "2026-10-20" },
    { id: "d02", tipo: "isencao", titulo: "Pedido de isenção da taxa (até 16h de 22/10)", ini: "2026-10-20", fim: "2026-10-22" },
    { id: "d03", tipo: "inscricao", titulo: "Inscrições (até 18h do último dia)", ini: "2026-10-20", fim: "2026-11-10", acao: true },
    { id: "d04", tipo: "resultado", titulo: "Resultado preliminar dos pedidos de isenção", ini: "2026-10-30" },
    { id: "d05", tipo: "recurso", titulo: "Recursos contra o resultado da isenção", ini: "2026-11-03", fim: "2026-11-04" },
    { id: "d06", tipo: "resultado", titulo: "Resultado definitivo dos pedidos de isenção", ini: "2026-11-10" },
    { id: "d07", tipo: "pagamento", titulo: "Último dia para pagar a taxa (boleto, até 23h59)", ini: "2026-11-11", acao: true },
    { id: "d08", tipo: "resultado", titulo: "Relação preliminar de inscrições", ini: "2026-11-19" },
    { id: "d09", tipo: "recurso", titulo: "Recursos contra a relação de inscrições", ini: "2026-11-23", fim: "2026-11-24" },
    { id: "d10", tipo: "resultado", titulo: "Relação definitiva de inscrições", ini: "2026-12-02" },
    { id: "d11", tipo: "convocacao", titulo: "Convocação para envio de títulos, experiência e currículo", ini: "2026-12-02" },
    { id: "d12", tipo: "aviso", titulo: "Comunicado do teste obrigatório da plataforma de prova", ini: "2026-12-03", acao: true },
    { id: "d13", tipo: "envio", titulo: "Envio do currículo padrão (obrigatório, até 16h)", ini: "2026-12-03", fim: "2026-12-22", acao: true },
    { id: "d14", tipo: "envio", titulo: "Envio de títulos e experiência (até 16h)", ini: "2026-12-03", fim: "2026-12-22", acao: true },
    { id: "d15", tipo: "aviso", titulo: "Link da prova disponível no site da FGV", ini: "2026-12-17" },
    { id: "d16", tipo: "prova", titulo: "Prova objetiva, on-line, das 13h30 às 17h", ini: "2026-12-20", acao: true },
    { id: "d17", tipo: "gabarito", titulo: "Gabarito preliminar", ini: "2026-12-21" },
    { id: "d18", tipo: "recurso", titulo: "Recursos contra o gabarito e a aplicação da prova", ini: "2026-12-22", fim: "2026-12-23" },
    { id: "d19", tipo: "resultado", titulo: "Gabarito definitivo e resultado preliminar da prova", ini: "2027-01-29" },
    { id: "d20", tipo: "recurso", titulo: "Recursos contra o resultado preliminar da prova", ini: "2027-02-01", fim: "2027-02-03" },
    { id: "d21", tipo: "resultado", titulo: "Resultado definitivo da prova objetiva", ini: "2027-02-23" },
    { id: "d22", tipo: "convocacao", titulo: "Convocação para heteroidentificação e avaliação biopsicossocial", ini: "2027-02-23" },
    { id: "d23", tipo: "resultado", titulo: "Resultado preliminar da avaliação de títulos", ini: "2027-03-04" },
    { id: "d24", tipo: "recurso", titulo: "Recursos contra o resultado dos títulos", ini: "2027-03-05", fim: "2027-03-08" },
    { id: "d25", tipo: "etapa", titulo: "Heteroidentificação e avaliação biopsicossocial", ini: "2027-03-07" },
    { id: "d26", tipo: "resultado", titulo: "Resultado preliminar da heteroidentificação e avaliação biopsicossocial", ini: "2027-03-11" },
    { id: "d27", tipo: "recurso", titulo: "Recursos contra a heteroidentificação e avaliação biopsicossocial", ini: "2027-03-12", fim: "2027-03-15" },
    { id: "d28", tipo: "resultado", titulo: "Resultado definitivo da avaliação de títulos", ini: "2027-03-19" },
    { id: "d29", tipo: "convocacao", titulo: "Convocação para a entrevista por competências", ini: "2027-03-29" },
    { id: "d30", tipo: "resultado", titulo: "Resultado definitivo da heteroidentificação e avaliação biopsicossocial", ini: "2027-03-29" },
    { id: "d31", tipo: "etapa", titulo: "Entrevista individual por competências", ini: "2027-04-08", fim: "2027-04-14", acao: true },
    { id: "d32", tipo: "resultado", titulo: "Resultado preliminar das entrevistas", ini: "2027-04-20" },
    { id: "d33", tipo: "recurso", titulo: "Recursos contra o resultado das entrevistas", ini: "2027-04-22", fim: "2027-04-23" },
    { id: "d34", tipo: "final", titulo: "Resultado definitivo das entrevistas e resultado final", ini: "2027-05-06" }
  ],
  /* Conhecimentos gerais e institucionais: comuns a todos os perfis */
  materias: [
    { id: "abdi-lp", grupo: "gerais", nome: "Língua Portuguesa", q: 8, topicos: [
      "Compreensão e interpretação de textos de gêneros variados",
      "Tipos e gêneros textuais",
      "Ortografia oficial",
      "Coesão textual: referenciação, substituição, repetição e conectores",
      "Emprego de tempos e modos verbais",
      "Classes de palavras",
      "Coordenação entre orações e entre termos da oração",
      "Subordinação entre orações e entre termos da oração",
      "Pontuação",
      "Concordância verbal e nominal",
      "Regência verbal e nominal",
      "Crase",
      "Colocação dos pronomes átonos",
      "Reescrita: significação das palavras e substituição de trechos",
      "Reescrita: reorganização de orações e períodos",
      "Reescrita em diferentes gêneros e níveis de formalidade"
    ] },
    { id: "abdi-rl", grupo: "gerais", nome: "Raciocínio Lógico", q: 6, topicos: [
      "Estruturas lógicas",
      "Lógica de argumentação: analogias, inferências, deduções e conclusões",
      "Proposições simples e compostas",
      "Tabelas-verdade",
      "Equivalências lógicas",
      "Diagramas lógicos",
      "Lógica de primeira ordem",
      "Problemas aritméticos, geométricos e matriciais"
    ] },
    { id: "abdi-inf", grupo: "gerais", nome: "Noções de Informática", q: 6, topicos: [
      "Hardware, software, periféricos, arquivos, pastas e extensões",
      "Windows 10 e Windows 11",
      "Microsoft Word",
      "Microsoft Excel",
      "Microsoft PowerPoint e Outlook",
      "LibreOffice Writer, Calc e Impress",
      "Internet, intranet, navegadores e mecanismos de busca",
      "Correio eletrônico",
      "Segurança da informação: malwares, phishing, antivírus, firewall e backup",
      "Computação em nuvem",
      "Inteligência artificial e IA generativa no trabalho",
      "Digitalização, impressão, atalhos e acessibilidade",
      "Lei de Acesso à Informação (Lei 12.527/2011)",
      "Lei de Delitos Informáticos (12.737/2012) e Marco Civil da Internet (12.965/2014)",
      "Lei Geral de Proteção de Dados (Lei 13.709/2018)"
    ] },
    { id: "abdi-ssa", grupo: "inst", nome: "Serviços Sociais Autônomos", q: 4, topicos: [
      "Conceito, natureza jurídica e finalidade (Lei 11.080/2004, art. 1º; Decreto 5.352/2005, arts. 1º e 2º)",
      "Direito privado, sem fins lucrativos, interesse coletivo e utilidade pública",
      "Autonomia administrativa e gestão de pessoal (Lei 11.080/2004, art. 11)",
      "Regime jurídico, contrato de gestão e relações com o Poder Público (arts. 8º a 12)",
      "Supervisão, fiscalização, controle e prestação de contas"
    ] },
    { id: "abdi-lei", grupo: "inst", nome: "Lei de criação e Estatuto da ABDI", q: 4, topicos: [
      "Lei 11.080/2004 e alterações (Lei 14.440/2022)",
      "Decreto 5.352/2005 e alterações",
      "Estatuto Social: natureza, finalidade, princípios e competências",
      "Organização administrativa e estrutura de governança",
      "Conselho Deliberativo, Conselho Fiscal e Diretoria-Executiva",
      "Patrimônio, receitas, contrato de gestão e prestação de contas"
    ] },
    { id: "abdi-lic", grupo: "inst", nome: "Licitações, contratos e convênios da ABDI", q: 8, topicos: [
      "Regulamento de Licitações e Contratos: princípios e disposições gerais",
      "Modalidades, procedimentos, critérios de julgamento e habilitação",
      "Contratação direta: dispensa e inexigibilidade",
      "Contratos: formalização, execução, fiscalização, alteração e extinção",
      "Sanções e responsabilidades contratuais",
      "Regulamento de Convênios: disposições gerais, conceitos e modalidades",
      "Celebração de convênios, plano de trabalho, habilitação e contrapartidas",
      "Execução, acompanhamento, fiscalização e alteração de convênios",
      "Prestação de contas de convênios e responsabilidades"
    ] },
    { id: "abdi-etica", grupo: "inst", nome: "Ética, missão e atuação da ABDI", q: 4, topicos: [
      "Regulamento de Ética e Conduta: objetivo, valores e princípios (arts. 1º a 3º)",
      "Direitos, deveres e vedações (arts. 4º a 6º)",
      "Mídias sociais, confidencialidade, propriedade intelectual, recursos e doações (arts. 7º a 11)",
      "Conflito de interesses, brindes e informações privilegiadas (arts. 12 a 17)",
      "Descumprimento, medidas disciplinares e denúncias (arts. 18 a 25)",
      "Missão, visão, valores e Planejamento Estratégico 2024–2029",
      "Atuação da ABDI: indústria, inovação, transformação digital e sustentabilidade"
    ] }
  ],
  /* Conhecimentos específicos: 20 questões, divididas entre as matérias do perfil pelo número de tópicos */
  especificos: {
    adm: [
      { nome: "Administração geral", topicos: [
        "Teorias da Administração e evolução do pensamento administrativo",
        "Funções administrativas: planejamento, organização, direção e controle",
        "Planejamento estratégico, tático e operacional",
        "Gestão estratégica: análise de ambientes, indicadores e Balanced Scorecard",
        "Estruturas organizacionais, departamentalização e descentralização",
        "Processo decisório",
        "Cultura e clima organizacional"
      ] },
      { nome: "Pessoas e comportamento organizacional", topicos: [
        "Recrutamento, seleção, treinamento e desenvolvimento",
        "Gestão por competências, avaliação de desempenho, remuneração e qualidade de vida",
        "Motivação, liderança, comunicação, equipes e gestão de conflitos"
      ] },
      { nome: "Processos, projetos e governança", topicos: [
        "Gestão de processos: modelagem, análise, redesenho e indicadores",
        "Gestão da qualidade e melhoria contínua",
        "Gestão de projetos: ciclo de vida e metodologias tradicionais e ágeis",
        "Gestão de riscos e controles internos",
        "Governança corporativa, compliance, integridade e ética"
      ] },
      { nome: "Recursos, finanças e orçamento", topicos: [
        "Materiais, patrimônio, estoques, compras e cadeia de suprimentos",
        "Gestão de contratos",
        "Administração financeira: fluxo de caixa, capital de giro, investimentos e indicadores",
        "Orçamento empresarial"
      ] },
      { nome: "Estatais, inovação e TI", topicos: [
        "Sustentabilidade e responsabilidade socioambiental",
        "Gestão do conhecimento, inovação e mudança organizacional",
        "Administração e governança de empresas estatais",
        "Lei das Estatais (Lei 13.303/2016)",
        "Sistemas de informação: análise, entrada e saída de dados, arquivos e controle"
      ] }
    ],
    com: [
      { nome: "Teoria e planejamento da comunicação", topicos: [
        "Teorias da comunicação",
        "Processos, elementos, modelos e funções da comunicação",
        "Comunicação social, institucional, organizacional e pública",
        "Planejamento estratégico de comunicação e comunicação integrada",
        "Identidade, imagem, marca e reputação institucional"
      ] },
      { nome: "Jornalismo e assessoria de imprensa", topicos: [
        "Assessoria de comunicação e de imprensa",
        "Relacionamento com a imprensa e fontes de informação",
        "Gêneros jornalísticos",
        "Redação jornalística: notícia, reportagem, entrevista, nota, release e artigo",
        "Edição e revisão de conteúdos",
        "Comunicação interna e públicos internos"
      ] },
      { nome: "Digital, audiovisual e eventos", topicos: [
        "Comunicação digital e produção de conteúdo",
        "Redes sociais: planejamento, publicação, monitoramento e métricas",
        "Conteúdo multimídia",
        "Fotografia, vídeo e áudio",
        "Comunicação visual, identidade visual e produção gráfica",
        "Planejamento e organização de eventos"
      ] },
      { nome: "Gestão, públicos e ética", topicos: [
        "Pesquisa de opinião e avaliação de resultados",
        "Gestão de crises e comunicação de risco",
        "Relacionamento com públicos de interesse e comunidades",
        "Comunicação científica, tecnológica e ambiental",
        "Ética e legislação aplicadas à comunicação",
        "Direito à informação, transparência e acesso à informação",
        "Proteção de dados pessoais na comunicação",
        "Acessibilidade, inclusão e linguagem simples"
      ] }
    ],
    cont: [
      { nome: "Contabilidade geral e demonstrações", topicos: [
        "Patrimônio, fatos contábeis, contas, escrituração e apuração do resultado",
        "Estrutura Conceitual para Relatório Financeiro",
        "Demonstrações contábeis: apresentação, estrutura e elaboração",
        "Balanço patrimonial",
        "Demonstração do resultado e do resultado abrangente",
        "Demonstração das mutações do patrimônio líquido",
        "Demonstração dos fluxos de caixa",
        "Demonstração do valor adicionado e notas explicativas"
      ] },
      { nome: "Ativos, passivos e normas contábeis", topicos: [
        "Disponibilidades, contas a receber e estoques",
        "Ativo imobilizado e intangível",
        "Depreciação, amortização e exaustão",
        "Redução ao valor recuperável de ativos",
        "Provisões, passivos e ativos contingentes",
        "Arrendamentos",
        "Reconhecimento e mensuração de receitas",
        "Instrumentos financeiros",
        "Lei 6.404/1976 e contabilidade societária",
        "Pronunciamentos, interpretações e orientações do CPC"
      ] },
      { nome: "Custos, análise e orçamento", topicos: [
        "Custos: terminologia, classificação e comportamento",
        "Métodos de custeio",
        "Custos para controle e tomada de decisão",
        "Análise das demonstrações: liquidez, estrutura de capital, rentabilidade e atividade",
        "Análise econômico-financeira",
        "Matemática financeira aplicada",
        "Orçamento empresarial: planejamento integrado, operacional, de investimento e base zero"
      ] },
      { nome: "Tributos, SPED e auditoria", topicos: [
        "IRPJ, CSLL e IRRF",
        "ICMS e ISS",
        "PIS/PASEP, COFINS, CIDE e participações governamentais",
        "Contribuição previdenciária",
        "Reforma tributária: EC 132/2023 e LC 214/2025",
        "SPED contábil e fiscal e escrituração contábil digital (ECD)",
        "Auditoria contábil e controles internos",
        "Ética e legislação profissional"
      ] }
    ],
    ti: [
      { nome: "Engenharia de software", topicos: [
        "Ciclo de vida e processos de desenvolvimento de software",
        "Engenharia de requisitos e modelagem UML",
        "Arquitetura de software, padrões de projeto e microsserviços",
        "Documentação, manutenção e evolução de sistemas"
      ] },
      { nome: "Programação e desenvolvimento web", topicos: [
        "Lógica de programação, algoritmos e estruturas de dados",
        "Programação orientada a objetos",
        "Java, PHP e JavaScript",
        "Node.js",
        "HTML5, CSS3 e aplicações web responsivas"
      ] },
      { nome: "Banco de dados", topicos: [
        "Modelagem de dados e modelo relacional",
        "Normalização e integridade referencial",
        "SQL: consultas, junções, subconsultas e manipulação de dados",
        "Transações, índices e otimização de consultas"
      ] },
      { nome: "Integração de sistemas e APIs", topicos: [
        "Serviços web e arquitetura REST",
        "HTTP e HTTPS",
        "JSON e XML",
        "Desenvolvimento, consumo, autenticação e segurança de APIs"
      ] },
      { nome: "Metodologias ágeis e DevOps", topicos: [
        "Scrum e Kanban",
        "Histórias de usuário, backlog e critérios de aceitação",
        "Git, GitHub e GitLab",
        "Integração e entrega contínuas (CI/CD)",
        "Automação e implantação de aplicações"
      ] },
      { nome: "Qualidade e segurança de software", topicos: [
        "Testes unitários, funcionais, de integração e de regressão",
        "Depuração, revisão de código e qualidade de software",
        "Desenvolvimento seguro e OWASP Top 10",
        "Autenticação, autorização e controle de acesso",
        "LGPD no desenvolvimento de software"
      ] },
      { nome: "Sustentação e gestão de soluções de TI", topicos: [
        "Manutenção, monitoramento e suporte a aplicações",
        "Gerenciamento de incidentes, problemas e mudanças",
        "Acordos de Nível de Serviço (SLA)",
        "Especificação técnica e homologação de soluções",
        "Acompanhamento de contratos, fornecedores e entregas de software"
      ] }
    ],
    rh: [
      { nome: "Gestão estratégica de pessoas", topicos: [
        "Fundamentos, modelos e processos de gestão de pessoas",
        "Planejamento estratégico e dimensionamento da força de trabalho",
        "Gestão por competências",
        "Indicadores de gestão de pessoas e análise de dados"
      ] },
      { nome: "Recrutamento, seleção e desenvolvimento", topicos: [
        "Recrutamento e seleção de pessoal",
        "Integração e desenvolvimento de empregados",
        "Levantamento de necessidades de treinamento",
        "Educação corporativa e gestão do conhecimento",
        "Avaliação de resultados de capacitação"
      ] },
      { nome: "Desempenho e carreiras", topicos: [
        "Métodos e instrumentos de avaliação de desempenho",
        "Gestão por resultados, metas e competências",
        "Feedback e desenvolvimento profissional",
        "Planos de carreira, cargos e salários",
        "Remuneração, benefícios e reconhecimento"
      ] },
      { nome: "Administração de pessoal e legislação trabalhista", topicos: [
        "CLT: contrato, jornada, remuneração, férias e rescisão",
        "Admissão, movimentação e desligamento",
        "Folha de pagamento e encargos trabalhistas e previdenciários",
        "Controle de frequência, banco de horas e benefícios",
        "eSocial e obrigações acessórias",
        "Acordos coletivos de trabalho"
      ] },
      { nome: "Cultura e qualidade de vida no trabalho", topicos: [
        "Cultura e clima organizacional",
        "Comunicação interna e relacionamento interpessoal",
        "Motivação, liderança e gestão de conflitos",
        "Saúde, segurança e qualidade de vida no trabalho",
        "Diversidade, inclusão e prevenção ao assédio e à discriminação"
      ] },
      { nome: "Processos e indicadores de pessoas", topicos: [
        "Mapeamento, análise e melhoria de processos de RH",
        "Indicadores de desempenho, absenteísmo e rotatividade",
        "Sistemas de informação para gestão de pessoas",
        "Riscos, controles internos e conformidade em pessoal",
        "LGPD na gestão de pessoas"
      ] },
      { nome: "Normas de pessoas da ABDI", topicos: [
        "Plano de Carreira, Cargos e Salários da ABDI (2026)",
        "Acordo Coletivo de Trabalho da ABDI (2026–2028)",
        "Competências, desempenho e desenvolvimento na ABDI",
        "Procedimentos de administração de pessoal e benefícios"
      ] }
    ],
    infra: [
      { nome: "Infraestrutura de TI", topicos: [
        "Arquitetura e componentes de infraestrutura",
        "Servidores, armazenamento e processamento",
        "Virtualização de servidores e contêineres",
        "Computação em nuvem: IaaS, PaaS e SaaS",
        "Capacidade, disponibilidade e desempenho"
      ] },
      { nome: "Sistemas operacionais e servidores", topicos: [
        "Windows Server e Linux",
        "Instalação, configuração, atualização e manutenção de sistemas",
        "Usuários, permissões e serviços",
        "Active Directory, DNS e DHCP",
        "Scripts PowerShell e Shell"
      ] },
      { nome: "Redes de computadores", topicos: [
        "Arquiteturas, topologias e protocolos",
        "Modelos OSI e TCP/IP",
        "IPv4, IPv6, roteamento e VLANs",
        "LAN, WAN e VPN",
        "Switches, roteadores, firewalls e redes sem fio",
        "Monitoramento e diagnóstico de redes"
      ] },
      { nome: "Segurança da informação", topicos: [
        "Princípios e políticas de segurança",
        "Controle de acesso, autenticação e identidades",
        "Segurança de redes, servidores e nuvem",
        "Vulnerabilidades, atualizações e incidentes",
        "Criptografia, certificados digitais, backup e recuperação",
        "LGPD na infraestrutura"
      ] },
      { nome: "Operação e continuidade", topicos: [
        "Administração e operação de ambientes de TI",
        "Monitoramento de disponibilidade, desempenho e capacidade",
        "Incidentes, problemas e mudanças",
        "Backup, restauração e recuperação de desastres",
        "Continuidade de serviços e contingência",
        "Acordos de Nível de Serviço (SLA)"
      ] },
      { nome: "Governança e serviços de TI", topicos: [
        "Fundamentos de governança de TI",
        "ITIL 4",
        "COBIT 2019",
        "Ativos, configurações e licenciamento de software",
        "Riscos e indicadores de serviços de TI",
        "Contratos e fornecedores de tecnologia"
      ] },
      { nome: "Suporte e automação", topicos: [
        "Atendimento e suporte técnico a usuários",
        "Diagnóstico e resolução de falhas",
        "Gerenciamento remoto e central de serviços",
        "Automação e gerenciamento de configurações",
        "DevOps e infraestrutura como código (IaC)",
        "Documentação técnica e melhoria contínua"
      ] }
    ],
    jur: [
      { nome: "Direito Constitucional", topicos: [
        "Princípios fundamentais, direitos e garantias fundamentais",
        "Organização do Estado e repartição de competências",
        "Administração Pública: princípios constitucionais e regime jurídico",
        "Ordem econômica e financeira e atuação do Estado na economia",
        "Controle de constitucionalidade"
      ] },
      { nome: "Direito Administrativo", topicos: [
        "Administração direta e indireta, paraestatais e Serviços Sociais Autônomos",
        "Atos e poderes administrativos",
        "Controle da Administração e Tribunais de Contas",
        "Responsabilidade civil do Estado",
        "Processo administrativo (Lei 9.784/1999)",
        "Improbidade administrativa (Lei 8.429/1992)",
        "Acesso à informação (Lei 12.527/2011)",
        "Lei Anticorrupção (Lei 12.846/2013 e Decreto 11.129/2022)"
      ] },
      { nome: "Licitações, contratos e convênios", topicos: [
        "Princípios e procedimentos de licitação e contratação",
        "Regulamento de Licitações e Contratos da ABDI",
        "Contratação direta: dispensa e inexigibilidade",
        "Contratos: formalização, execução, fiscalização, alteração e extinção",
        "Regulamento de Convênios da ABDI",
        "Acordos de cooperação técnica e instrumentos de parceria"
      ] },
      { nome: "Direito Civil e contratual", topicos: [
        "LINDB (Decreto-Lei 4.657/1942)",
        "Pessoas jurídicas: personalidade, capacidade e responsabilidade",
        "Fatos e negócios jurídicos, prescrição e decadência",
        "Obrigações: modalidades, cumprimento e inadimplemento",
        "Contratos: princípios, formação, interpretação, execução e extinção",
        "Responsabilidade civil e reparação de danos"
      ] },
      { nome: "Processo Civil", topicos: [
        "CPC: princípios, jurisdição, ação e competência",
        "Sujeitos do processo e atos processuais",
        "Processo de conhecimento, provas e tutelas provisórias",
        "Sentença, coisa julgada, cumprimento de sentença e execução",
        "Recursos e ações autônomas de impugnação",
        "Conciliação, mediação e arbitragem (Lei 9.307/1996)"
      ] },
      { nome: "Direito do Trabalho", topicos: [
        "CLT: contrato, jornada, remuneração, férias e rescisão",
        "Direitos e deveres do empregado e do empregador",
        "Negociação coletiva, convenções e acordos coletivos",
        "Relações de trabalho nos Serviços Sociais Autônomos"
      ] },
      { nome: "Proteção de dados (LGPD)", topicos: [
        "LGPD: fundamentos, princípios e aplicação",
        "Tratamento de dados, bases legais e direitos dos titulares",
        "Agentes de tratamento, responsabilidades e segurança",
        "ANPD: competências, fiscalização e sanções"
      ] },
      { nome: "Direito Ambiental", topicos: [
        "Meio ambiente na Constituição (arts. 170, VI, e 225) e princípios",
        "Política Nacional do Meio Ambiente (Lei 6.938/1981) e SISNAMA",
        "Licenciamento ambiental e LC 140/2011",
        "Responsabilidade ambiental (Lei 9.605/1998 e Decreto 6.514/2008)",
        "Política Nacional de Resíduos Sólidos (Lei 12.305/2010)",
        "Economia circular, descarbonização e transição energética"
      ] }
    ],
    prod: [
      { nome: "Fundamentos de produtividade industrial", topicos: [
        "Produtividade, eficiência, eficácia e competitividade",
        "Produtividade do trabalho e produtividade total dos fatores",
        "Indicadores de desempenho industrial",
        "Diagnóstico de processos produtivos e oportunidades de melhoria"
      ] },
      { nome: "Gestão e melhoria de processos produtivos", topicos: [
        "Planejamento e controle da produção (PCP)",
        "Mapeamento, análise e otimização de processos",
        "Manufatura enxuta (Lean): princípios, ferramentas e desperdícios",
        "Estoques, capacidade produtiva e fluxos de produção",
        "Melhoria contínua: Kaizen, PDCA e 5S"
      ] },
      { nome: "Qualidade e eficiência operacional", topicos: [
        "Gestão da qualidade e ISO 9001",
        "Ferramentas da qualidade e controle estatístico de processos",
        "Indicadores de qualidade, custos e eficiência",
        "Gestão da manutenção e OEE",
        "Redução de perdas, retrabalho e custos"
      ] },
      { nome: "Transformação digital e Indústria 4.0", topicos: [
        "Tecnologias habilitadoras da Indústria 4.0",
        "Automação industrial, IIoT e sistemas ciberfísicos",
        "Inteligência artificial, análise de dados e Big Data na produção",
        "ERP, MES e sensores inteligentes",
        "Maturidade digital e adoção de tecnologias"
      ] },
      { nome: "Inovação e competitividade", topicos: [
        "Gestão da inovação e desenvolvimento tecnológico",
        "Difusão e transferência de tecnologias",
        "Projetos de modernização produtiva",
        "Cadeias produtivas, APLs e competitividade",
        "Avaliação técnica e econômica de investimentos"
      ] },
      { nome: "Sustentabilidade e eficiência de recursos", topicos: [
        "Produção mais limpa e ecoeficiência",
        "Eficiência energética e uso racional de recursos",
        "Economia circular e resíduos industriais",
        "Indicadores de sustentabilidade e desempenho ambiental",
        "Descarbonização na indústria"
      ] },
      { nome: "Políticas de desenvolvimento industrial", topicos: [
        "Política industrial brasileira e Nova Indústria Brasil (NIB)",
        "Programa Brasil Mais Produtivo",
        "Atuação da ABDI em produtividade, inovação e transformação digital",
        "Diagnóstico de maturidade produtiva e digital de empresas",
        "Avaliação de resultados e indicadores de impacto de programas"
      ] }
    ],
    dados: [
      { nome: "Fundamentos de análise de dados", topicos: [
        "Análise de dados, ciência de dados e inteligência de negócios",
        "Tipos, fontes e estruturas de dados",
        "Coleta, tratamento, limpeza e transformação",
        "Análise exploratória e interpretação de resultados",
        "Indicadores de desempenho e tomada de decisão"
      ] },
      { nome: "Estatística computacional", topicos: [
        "Estatística descritiva",
        "Distribuições, amostragem, valores atípicos e dados ausentes",
        "Correlação, regressão e séries temporais",
        "Métodos computacionais de análise",
        "Ferramentas estatísticas e automação de análises"
      ] },
      { nome: "Banco de dados e modelagem", topicos: [
        "Bancos relacionais e NoSQL",
        "Modelagem conceitual, lógica e física",
        "Normalização, integridade e qualidade dos dados",
        "SQL: consultas, junções, subconsultas e agregações",
        "Data Warehouse, Data Mart e modelagem dimensional"
      ] },
      { nome: "BI e visualização de dados", topicos: [
        "Fundamentos de Business Intelligence",
        "Power BI: modelagem, Power Query, DAX e dashboards",
        "Relatórios, gráficos, tabelas e indicadores",
        "Visualização e comunicação de resultados",
        "Indicadores estratégicos e operacionais"
      ] },
      { nome: "Programação e engenharia de dados", topicos: [
        "Python para análise de dados: Pandas e NumPy",
        "Integração de dados e ETL/ELT",
        "Integração de sistemas e consumo de APIs",
        "Big Data: Hadoop e Apache Spark",
        "Pipelines de dados com Apache Airflow"
      ] },
      { nome: "Inteligência artificial e análise preditiva", topicos: [
        "Fundamentos de IA e aprendizado de máquina",
        "Aprendizado supervisionado e não supervisionado",
        "Classificação, regressão e agrupamento",
        "Treinamento, validação e avaliação de modelos",
        "IA aplicada à análise de dados e decisão"
      ] },
      { nome: "Governança e segurança de dados", topicos: [
        "Governança de dados: princípios, políticas e papéis",
        "Qualidade, integridade e rastreabilidade",
        "Metadados, catalogação e integração de fontes",
        "Segurança da informação e controle de acesso",
        "LGPD na gestão de dados"
      ] }
    ]
  }
};

/* Edital previsto: ANPD, Especialista em Regulação de Proteção de Dados (concurso autorizado em 2026, edital ainda não publicado).
   Disciplinas e pesos estimados a partir da Lei 15.352/2026, da LGPD, dos regulamentos da ANPD e do que se repete
   nos concursos de agências reguladoras. A data da prova é provisória. Trocar pelo edital oficial quando sair. */
const EDITAL_ANPD = {
  id: "anpd-2027",
  base: "anpd",
  previsto: true,
  resumoPrevisto: "Edital ainda não publicado: conteúdo provável e prova estimada para abril de 2027.",
  notaPesos: "Pesos estimados: o edital ainda não saiu. Específicos (proteção de dados e regulação) valem mais, como nas agências reguladoras.",
  sigla: "ANPD",
  orgao: "Agência Nacional de Proteção de Dados",
  cargo: "Especialista em Regulação de Proteção de Dados",
  banca: "A definir",
  numero: "",
  site: "https://www.gov.br/anpd/",
  email: "",
  remuneracao: "R$ 17.726,42 (inicial)",
  taxa: "",
  lotacao: "Brasília/DF",
  regime: "Estatutário (Lei 8.112/1990), carreira própria criada pela Lei 15.352/2026",
  validade: "",
  vagas: "50 imediatas (31 ampla concorrência, 13 pessoas negras, 3 PcD, 2 indígenas, 1 quilombola)",
  dataProva: "2027-04-18",
  horaProva: "",
  local: "",
  provaNotas: [
    "Edital ainda não publicado. Banca, conteúdo, número de questões e data da prova são estimativas.",
    "A estrutura provável segue a das agências reguladoras: conhecimentos gerais e conhecimentos específicos, com os específicos valendo mais.",
    "Antes do edital, estude a base que quase certamente será cobrada: LGPD, regulamentos da ANPD, regulação e Direito Administrativo.",
    "Quando o edital sair, confira o conteúdo na aba Conteúdo, ajuste questões e pesos e troque a data da prova."
  ],
  plano: [
    "Fase 1, até o edital sair: LGPD e regulamentos da ANPD todos os dias; alterne com Regulação, Direito Administrativo e Constitucional. Português e Inglês duas vezes por semana.",
    "Fase 2, do edital até 30 dias antes da prova: siga o plano do dia do app com o edital oficial. Resolva questões de cada assunto logo depois da teoria.",
    "Fase 3, últimos 30 dias: só revisões, lei seca (LGPD, Lei 13.848, Lei 15.352 e ECA Digital) e simulados semanais registrados no app.",
    "Até a banca ser definida, treine com provas de agências reguladoras (ANATEL, ANAC, ANS) e do processo seletivo da ANPD de 2025."
  ],
  prova: {
    minPct: 50,
    naoZerar: false,
    grupos: [
      { id: "gerais", nome: "Conhecimentos gerais", q: 40, valor: 1 },
      { id: "esp", nome: "Conhecimentos específicos", q: 60, valor: 1.5 }
    ]
  },
  etapas: [
    { nome: "Prova objetiva", tipo: "Provável, eliminatória e classificatória", texto: "Conhecimentos gerais e específicos. Número de questões e pontos a confirmar no edital." },
    { nome: "Prova discursiva", tipo: "Possível", texto: "Comum em carreiras de agência reguladora. Treine respostas curtas sobre LGPD e regulação." },
    { nome: "Curso de formação", tipo: "Previsto na carreira, eliminatório e classificatório", texto: "Detalhes a confirmar no edital." }
  ],
  datas: [
    { id: "d01", tipo: "aviso", titulo: "Concurso autorizado: 50 vagas de Especialista", ini: "2026-06-24" },
    { id: "d02", tipo: "aviso", titulo: "Comissão organizadora instituída (Portaria nº 759, DOU de 11/11)", ini: "2026-11-11" },
    { id: "d03", tipo: "publicacao", titulo: "Prazo previsto para publicar o edital", ini: "2027-01-03", acao: true },
    { id: "d04", tipo: "prova", titulo: "Prova (data estimada, confirme no edital)", ini: "2027-04-18", acao: true }
  ],
  materias: [
    { id: "anpd-lp", grupo: "gerais", nome: "Língua Portuguesa", q: 10, topicos: [
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
    { id: "anpd-ing", grupo: "gerais", nome: "Língua Inglesa", q: 5, topicos: [
      "Compreensão de textos técnicos sobre privacidade e tecnologia",
      "Vocabulário de proteção de dados (GDPR, data subject, controller, processor)",
      "Estruturas gramaticais e conectores",
      "Inferência e ideia principal"
    ] },
    { id: "anpd-dc", grupo: "gerais", nome: "Direito Constitucional", q: 8, topicos: [
      "Princípios fundamentais da Constituição",
      "Direitos e garantias fundamentais",
      "Proteção de dados pessoais como direito fundamental (EC 115/2022, art. 5º, LXXIX)",
      "Intimidade, vida privada, sigilo das comunicações e habeas data",
      "Organização do Estado e competência da União sobre proteção de dados (art. 22, XXX)",
      "Administração pública: princípios e disposições gerais (arts. 37 a 41)",
      "Poder Executivo e Poder Legislativo: atribuições e processo legislativo",
      "Controle de constitucionalidade: noções",
      "Ordem econômica: princípios e atuação do Estado como regulador (arts. 170 a 174)"
    ] },
    { id: "anpd-da", grupo: "gerais", nome: "Direito Administrativo", q: 12, topicos: [
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
    { id: "anpd-etica", grupo: "gerais", nome: "Ética, integridade e acesso à informação", q: 5, topicos: [
      "Código de Ética do Servidor Público Federal (Decreto 1.171/1994)",
      "Conflito de interesses (Lei 12.813/2013)",
      "Lei de Acesso à Informação (Lei 12.527/2011) e Decreto 7.724/2012",
      "LAI e LGPD: convivência entre transparência e proteção de dados",
      "Governança pública e integridade (Decreto 9.203/2017)"
    ] },
    { id: "anpd-lgpd", grupo: "esp", nome: "LGPD (Lei 13.709/2018)", q: 14, topicos: [
      "Aplicação da lei: abrangência territorial e exceções (arts. 1º a 4º)",
      "Conceitos: dado pessoal, sensível, anonimizado, titular, controlador, operador e encarregado (art. 5º)",
      "Princípios do tratamento (art. 6º)",
      "Bases legais do tratamento (art. 7º)",
      "Consentimento: requisitos e revogação (arts. 8º e 9º)",
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
      "Segurança e sigilo dos dados (arts. 46 a 49)",
      "Boas práticas e governança (arts. 50 e 51)",
      "Sanções administrativas (arts. 52 a 54)",
      "ANPD e Conselho Nacional de Proteção de Dados (arts. 55-A a 58-B)"
    ] },
    { id: "anpd-reg", grupo: "esp", nome: "Regulamentos e orientações da ANPD", q: 10, topicos: [
      "Fiscalização e processo administrativo sancionador (Resolução CD/ANPD nº 1/2021)",
      "Agentes de tratamento de pequeno porte (Resolução CD/ANPD nº 2/2022)",
      "Dosimetria e aplicação de sanções (Resolução CD/ANPD nº 4/2023)",
      "Comunicação de incidente de segurança (Resolução CD/ANPD nº 15/2024)",
      "Atuação do encarregado (Resolução CD/ANPD nº 18/2024)",
      "Transferência internacional e cláusulas-padrão contratuais (Resolução CD/ANPD nº 19/2024)",
      "Decisão de adequação da União Europeia (Resolução CD/ANPD nº 32/2026)",
      "Agenda regulatória e processo normativo da ANPD",
      "Guias orientativos: agentes de tratamento e encarregado",
      "Guias orientativos: legítimo interesse e tratamento pelo poder público",
      "Guias orientativos: cookies, segurança da informação e relatório de impacto",
      "Enunciados e decisões relevantes do Conselho Diretor"
    ] },
    { id: "anpd-inst", grupo: "esp", nome: "A ANPD como agência e o ECA Digital", q: 6, topicos: [
      "Lei 15.352/2026: transformação da ANPD em agência reguladora",
      "Natureza de autarquia especial: autonomia técnica, decisória, administrativa e financeira",
      "Estrutura: Conselho Diretor, Conselho Nacional de Proteção de Dados e órgãos internos",
      "Carreira de Especialista em Regulação de Proteção de Dados: atribuições",
      "Competências da ANPD na LGPD e na lei de criação",
      "ECA Digital (Lei 15.211/2025): proteção de crianças e adolescentes em ambientes digitais",
      "ECA Digital: deveres de plataformas, verificação de idade e supervisão parental",
      "ECA Digital: fiscalização e sanções a cargo da ANPD",
      "Planejamento estratégico e relatórios de gestão da ANPD"
    ] },
    { id: "anpd-regul", grupo: "esp", nome: "Regulação e agências reguladoras", q: 10, topicos: [
      "Estado regulador: fundamentos e evolução no Brasil",
      "Falhas de mercado: externalidades, assimetria de informação, poder de mercado e bens públicos",
      "Teorias da regulação: interesse público, captura e escolha pública",
      "Lei Geral das Agências Reguladoras (Lei 13.848/2019)",
      "Gestão de recursos humanos das agências (Lei 9.986/2000) e carreiras (Lei 10.871/2004)",
      "Análise de Impacto Regulatório (Decreto 10.411/2020) e avaliação de resultado regulatório",
      "Lei de Liberdade Econômica (Lei 13.874/2019): abuso do poder regulatório e AIR",
      "Consulta e audiência públicas, agenda regulatória e transparência",
      "Regulação responsiva, sandbox regulatório e enforcement",
      "Controle das agências: TCU, Congresso e Judiciário",
      "Articulação entre reguladores e com o CADE"
    ] },
    { id: "anpd-econ", grupo: "esp", nome: "Economia da regulação e concorrência", q: 4, topicos: [
      "Microeconomia aplicada: estruturas de mercado e eficiência",
      "Economia dos dados e de plataformas digitais: efeitos de rede e mercados de dois lados",
      "Defesa da concorrência (Lei 12.529/2011) e interface com proteção de dados",
      "Análise custo-benefício e indicadores regulatórios"
    ] },
    { id: "anpd-ti", grupo: "esp", nome: "Tecnologia, segurança da informação e IA", q: 10, topicos: [
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
      "Regulação de IA no Brasil (PL 2.338/2023) e no mundo (AI Act da União Europeia)",
      "Cookies, rastreamento on-line e publicidade direcionada"
    ] },
    { id: "anpd-dig", grupo: "esp", nome: "Direito digital e proteção de dados no mundo", q: 6, topicos: [
      "Marco Civil da Internet (Lei 12.965/2014) e Decreto 8.771/2016",
      "Crimes cibernéticos (Lei 12.737/2012) e Convenção de Budapeste",
      "Código de Defesa do Consumidor aplicado ao ambiente digital",
      "Cadastro Positivo (Lei 12.414/2011)",
      "GDPR da União Europeia: princípios, bases legais e autoridades",
      "Convenção 108+ do Conselho da Europa e diretrizes da OCDE",
      "Jurisprudência do STF sobre proteção de dados (ADI 6387 e compartilhamento de dados)",
      "Proteção de dados no setor público: compartilhamento e interoperabilidade"
    ] }
  ]
};
