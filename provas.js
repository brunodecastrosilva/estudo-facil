/* Estudo Fácil · provas oficiais do Cebraspe e treino da prova discursiva.
   O QUE ENTRA AQUI: o endereço oficial de cada caderno e de cada gabarito (cdn.cebraspe.org.br), o gabarito oficial
   definitivo item a item, os blocos de itens por disciplina e os comentários escritos pelo instrutor (Claude).
   O QUE NÃO ENTRA: o texto das provas. O caderno é aberto no site do Cebraspe; aqui fica só a folha de respostas.
   Cada gabarito foi lido duas vezes no arquivo oficial e conferido com o conteúdo dos itens. X = item anulado.
   m = disciplina do plano da ANPD (null = fora do seu edital). Conferido em 16/11/2026. */
"use strict";

const CDN = 'https://cdn.cebraspe.org.br/concursos/';
const PROVAS = [
  { id: 'anatel24-cb1', org: 'ANATEL', ano: 2024, aplic: '15/09/2024', codigo: '961_ANATEL_CB1_01',
    nome: 'Especialista em Regulação · Conhecimentos básicos', de: 1,
    caderno: CDN + 'ANATEL_24/arquivos/961_ANATEL_CB1_01.PDF', gabUrl: CDN + 'anatel_24/arquivos/GAB_DEFINITIVO_961_ANATEL_CB1_01.PDF',
    gab: 'EECCCEECECEECECCECXE' + 'EECCECCCEECCECXECCXE' + 'EEEEECEEEC',
    blocos: [
      { de: 1, ate: 15, m: 'anpd-lp', tema: 'Interpretação e gramática de dois textos' },
      { de: 16, ate: 23, m: 'anpd-ing', tema: 'Compreensão de dois textos em inglês' },
      { de: 24, ate: 29, m: 'anpd-regul', tema: 'Teoria da regulação, boas práticas e regulação responsiva' },
      { de: 30, ate: 33, m: null, tema: 'Lei Geral de Telecomunicações e órgãos da Anatel' },
      { de: 34, ate: 42, m: 'anpd-da', tema: 'Agências, atos, processo administrativo, concessão e LAI' },
      { de: 43, ate: 50, m: 'anpd-dc', tema: 'Direitos fundamentais, defesa do Estado, ordem econômica e social' },
    ],
    itens: {
      24: 'Monopólio natural é a justificativa clássica da regulação econômica: sem concorrência, o regulador controla o preço para evitar lucro extraordinário.',
      25: 'Agência reguladora não se subordina a ministério, nem em matéria regulatória. A Lei 13.848/2019 fala em ausência de tutela e de subordinação hierárquica (art. 3º).',
      26: 'É o desenho da reforma dos anos 1990: delimitar o serviço, fixar as regras de tarifa, fiscalizar e estimular os prestadores.',
      27: 'Proporcionalidade, na avaliação de resultado regulatório, é dosar o esforço da análise pela relevância e pela complexidade da norma revista.',
      28: 'Regulação responsiva combina persuasão e punição, em pirâmide: começa pelo diálogo e só escala se o regulado não corrige a conduta.',
      29: 'Trocaram os instrumentos. Quem olha para a norma já adotada e confere se os objetivos foram alcançados é a ARR. A AIR vem antes da norma (Decreto 10.411/2020).',
      34: 'É o poder normativo técnico: atos gerais e abstratos, dentro dos limites da lei e da Constituição. Não inova contra a lei.',
      36: 'Decreto regulamentar é do chefe do Executivo (CF, art. 84, IV). Agência edita resolução e regimento interno.',
      37: 'É o regime especial do art. 3º da Lei 13.848/2019: autonomia funcional, decisória, administrativa e financeira, mandato fixo e estabilidade dos dirigentes.',
      38: 'Lei 9.784/1999: o interessado prova o que alega (art. 36). Provas ilícitas, impertinentes, desnecessárias ou protelatórias podem ser recusadas, com decisão fundamentada (art. 38, § 2º).',
      40: 'A reversão existe para garantir a continuidade do serviço, não para indenizar a administração. Quem pode ser indenizado é o concessionário, pelos bens ainda não amortizados (Lei 8.987/1995, art. 36).',
      41: 'O reajuste segue a fórmula do contrato. Não há regra que mande trocá-la pelo índice de inflação; modicidade não autoriza descumprir o contrato.',
      42: 'A LAI alcança entidades privadas sem fins lucrativos que recebem recursos públicos, na parcela recebida (art. 2º). Empresa contratada, com fim de lucro, não entra nessa regra.',
      43: 'Desde a EC 131/2023, quem renuncia à nacionalidade brasileira pode readquirir a originária, na forma da lei (CF, art. 12, § 5º).',
      44: 'Leitura fina do art. 5º, XII: pelo texto, a ressalva da ordem judicial vale "no último caso", o das comunicações telefônicas. O item estendeu a exceção a tudo.',
      45: 'O rito é o das emendas: cada Casa do Congresso, dois turnos, três quintos dos votos (CF, art. 5º, § 3º). Nada de sessão unicameral nem de dois terços.',
      46: 'CF, art. 136, § 1º: o decreto fixa a duração, as áreas e as medidas, entre elas restrições ao sigilo de correspondência e de comunicação telegráfica e telefônica.',
      47: 'Inverteram. A forma republicana é princípio sensível (art. 34, VII, a) e não está no rol de cláusulas pétreas do art. 60, § 4º. O presidencialismo não é princípio sensível.',
      48: 'Valorização do trabalho e livre iniciativa fundam a ordem econômica (art. 170), e o exercício de atividade econômica independe de autorização, salvo nos casos da lei.',
      49: 'Inverteram os papéis: o Estado planeja as políticas sociais, e a sociedade participa da formulação, do monitoramento, do controle e da avaliação (CF, art. 193, parágrafo único).',
      50: 'CF, art. 175: diretamente ou sob concessão ou permissão, sempre por licitação.',
    } },
  { id: 'anac24-cb1', org: 'ANAC', ano: 2024, aplic: '03/03/2024', codigo: '945_ANAC_23_CB1_01',
    nome: 'Especialista em Regulação de Aviação Civil · Conhecimentos básicos', de: 1,
    caderno: CDN + 'ANAC_23/arquivos/945_ANAC_23_CB1_01.PDF', gabUrl: CDN + 'anac_23/arquivos/GAB_DEFINITIVO_945_ANAC_23_CB1_01.PDF',
    gab: 'CEECCECXCEECEEECCEEC' + 'ECCECEECECECCEEECCCC' + 'EECECEECCE',
    blocos: [
      { de: 1, ate: 10, m: 'anpd-ing', tema: 'Compreensão de dois textos em inglês' },
      { de: 11, ate: 18, m: 'anpd-da', tema: 'Recurso administrativo, agências, responsabilidade civil e controle' },
      { de: 19, ate: 24, m: 'anpd-etica', tema: 'Regime disciplinar, improbidade, ética, assédio e Lei Anticorrupção' },
      { de: 25, ate: 28, m: null, tema: 'Teoria geral dos direitos humanos' },
      { de: 29, ate: 30, m: 'anpd-dc', tema: 'Direitos e garantias fundamentais' },
      { de: 31, ate: 42, m: null, tema: 'Direitos humanos, informática, banco de dados e direito aeronáutico' },
      { de: 43, ate: 46, m: 'anpd-regul', tema: 'Carreiras das agências reguladoras (Lei 10.871/2004)' },
      { de: 47, ate: 50, m: null, tema: 'Lei da ANAC e atribuições da agência' },
    ],
    itens: {
      11: 'Recurso administrativo é controle administrativo, feito pela própria administração. Controle judicial é o do Poder Judiciário.',
      12: 'Agência reguladora é autarquia de regime especial, parte da administração indireta.',
      13: 'O recurso administrativo vem do direito de petição e do controle interno da administração, não do poder de polícia.',
      14: 'A agência é vinculada ao ministério, sem subordinação hierárquica (Lei 13.848/2019, art. 3º).',
      15: 'Recurso hierárquico próprio corre dentro da mesma entidade e não depende de previsão expressa. O impróprio, dirigido a outra pessoa jurídica, é que só cabe quando a lei prevê.',
      16: 'Ação judicial contra a agência é controle externo, feito pelo Judiciário, sobre a atuação administrativa.',
      17: 'Agência é autarquia: seus servidores efetivos são estatutários e seguem as regras constitucionais dos servidores públicos.',
      18: 'Na responsabilidade objetiva (CF, art. 37, § 6º), o terceiro prova o dano e o nexo, não a culpa. A culpa do agente só importa na ação de regresso.',
      19: 'Recusar inspeção médica sem motivo gera suspensão de até 15 dias (Lei 8.112/1990, art. 130, § 1º). O registro de suspensão é cancelado após cinco anos, e o cancelamento não retroage (art. 131).',
      20: 'Lei 8.429/1992, art. 11, § 1º: a improbidade contra princípios exige o fim de obter proveito ou benefício indevido para si ou para outrem.',
      21: 'A comissão de ética só aplica censura (Decreto 1.171/1994). As penas listadas são disciplinares, da Lei 8.112/1990.',
      23: 'A conduta ética acompanha o agente público dentro e fora do serviço.',
      24: 'Lei 12.846/2013, art. 5º, § 3º: é agente público estrangeiro quem exerce cargo, emprego ou função, ainda que transitoriamente ou sem remuneração.',
      29: 'Inverteram: a liberdade de locomoção é o direito; o habeas corpus é a garantia que o protege.',
      30: 'Privacidade é o direito; a inviolabilidade do domicílio é uma das garantias que o protegem.',
    } },
  { id: 'anm24-cg4', org: 'ANM', ano: 2025, aplic: '16/02/2025', codigo: '038_ANM_CG4_01',
    nome: 'Especialista em Recursos Minerais · Conhecimentos gerais (cargos 16 a 21 e 23)', de: 1,
    caderno: CDN + 'anm_24/arquivos/038_ANM_CG4_01.PDF', gabUrl: CDN + 'anm_24/arquivos/Gab_Definitivo_038_ANM_CG4_01.PDF',
    gab: 'CEECECCCCEECEECCEECC' + 'CECXCXCECECECCEEEEXE' + 'CXCECCECEC',
    blocos: [
      { de: 1, ate: 8, m: 'anpd-lp', tema: 'Ideias do texto e aspectos linguísticos' },
      { de: 9, ate: 13, m: 'anpd-ing', tema: 'Compreensão de texto em inglês' },
      { de: 14, ate: 17, m: 'anpd-dc', tema: 'Ordem econômica e organização do Estado' },
      { de: 18, ate: 21, m: 'anpd-da', tema: 'Requisição, improbidade, decadência e servidores' },
      { de: 22, ate: 29, m: null, tema: 'Informática e Código de Ética da ANM' },
      { de: 30, ate: 30, m: 'anpd-lgpd', tema: 'Alcance da LGPD' },
      { de: 31, ate: 31, m: 'anpd-etica', tema: 'Lei de Acesso à Informação' },
      { de: 32, ate: 36, m: 'anpd-regul', tema: 'Melhoria regulatória, Estado regulador e tarifação' },
      { de: 37, ate: 50, m: null, tema: 'Legislação mineral e raciocínio lógico' },
    ],
    itens: {
      14: 'O planejamento é determinante para o setor público e indicativo para o setor privado (CF, art. 174). O item fez indicativo para os dois.',
      15: 'CF, art. 173: o Estado só explora atividade econômica diretamente por segurança nacional ou relevante interesse coletivo, definidos em lei.',
      16: 'CF, art. 18, § 4º: lei estadual, no período fixado em lei complementar federal, com plebiscito e estudos de viabilidade divulgados.',
      17: 'A delegação do art. 22, parágrafo único, exige lei complementar e alcança só os estados, em questões específicas.',
      18: 'A requisição é irrecusável (Decreto 10.835/2021). Concordância é coisa da cessão.',
      19: 'Lei 8.429/1992, art. 1º, § 2º: dolo é a vontade livre e consciente de alcançar o resultado ilícito; a mera voluntariedade não basta.',
      20: 'Lei 9.784/1999, art. 54, § 1º: com efeitos patrimoniais contínuos, os cinco anos contam da percepção do primeiro pagamento.',
      21: 'CF, art. 41, § 1º: sentença transitada em julgado ou processo administrativo com ampla defesa. Há ainda a avaliação periódica de desempenho.',
      30: 'A LGPD vale para qualquer tratamento, por pessoa natural ou jurídica, de direito público ou privado (arts. 1º e 3º). O item encolheu o alcance da lei.',
      31: 'LAI, art. 7º, VI: o acesso compreende a informação sobre administração do patrimônio público, uso de recursos públicos, licitações e contratos.',
      32: 'A Estratégia Nacional de Melhoria Regulatória (Decreto 12.150/2024) é federal: administração direta, autárquica e fundacional da União. Estados não entram.',
      33: 'É a ideia de Estado regulador: sai da execução direta e passa a regular e fiscalizar, equilibrando usuários, mercado e interesse público.',
      34: 'Lei 10.871/2004, art. 23: o servidor de agência não pode exercer outra atividade profissional, ressalvados os casos admitidos em lei.',
      35: 'Fator de eficiência (fator X) é marca do preço-teto (price cap). No custo do serviço, a receita cobre os custos mais a remuneração do capital, sem esse desconto.',
      36: 'Proteger a saúde financeira da regulada não justifica restringir a concorrência à custa do consumidor.',
    } },
  { id: 'dataprev23-seg', org: 'DATAPREV', ano: 2023, aplic: '01/10/2023', codigo: '893_DATAPREV_020_01',
    nome: 'Analista de TI · Segurança da Informação e Proteção de Dados · Conhecimentos específicos', de: 51,
    caderno: CDN + 'DATAPREV_23/arquivos/893_DATAPREV_020_01.PDF', gabUrl: CDN + 'dataprev_23/arquivos/GAB_DEFINITIVO_893_DATAPREV_020_01.PDF',
    gab: 'EECCECCEEECECCECECEE' + 'CXEECECCECCEEEECCEEC' + 'CCEECXCXEEEECECEEECC' + 'CECCEEEECC',
    blocos: [
      { de: 51, ate: 54, m: 'anpd-dig', tema: 'LAI, crimes informáticos, Marco Civil e LGPD' },
      { de: 55, ate: 65, m: 'anpd-ti', tema: 'Segurança cibernética nacional e instruções normativas do GSI' },
      { de: 66, ate: 70, m: 'anpd-lgpd', tema: 'Direitos do titular, sanções, ANPD e conceitos' },
      { de: 71, ate: 74, m: 'anpd-dig', tema: 'Regulamento europeu de proteção de dados (RGPD)' },
      { de: 75, ate: 82, m: 'anpd-ti', tema: 'SGSI, biometria, criptografia, blockchain e ataques' },
      { de: 83, ate: 93, m: null, tema: 'Computação em nuvem, redes e programação' },
      { de: 94, ate: 95, m: 'anpd-ti', tema: 'Segurança e privacidade desde a concepção e por padrão' },
      { de: 96, ate: 104, m: null, tema: 'Produtos de nuvem e gestão de projetos' },
      { de: 105, ate: 106, m: 'anpd-ti', tema: 'Análise e nível de risco' },
      { de: 107, ate: 120, m: null, tema: 'ITIL, COBIT, BPMN e arquitetura em nuvem' },
    ],
    itens: {
      51: 'Depois da CGU ainda cabe recurso à Comissão Mista de Reavaliação de Informações (LAI, art. 16, § 3º).',
      52: 'A regra é ação mediante representação, mas, contra a administração pública ou concessionária de serviço público, a ação é pública incondicionada (CP, art. 154-B).',
      53: 'LGPD, art. 4º, II, a: fins exclusivamente jornalísticos e artísticos ficam fora da lei.',
      54: 'Marco Civil, art. 7º, IV: a conexão não pode ser suspensa, salvo por débito decorrente da própria utilização.',
      66: 'LGPD, art. 18, IV: a qualquer momento, mediante requisição, o titular obtém anonimização, bloqueio ou eliminação. Na lei, o direito vale para dados desnecessários, excessivos ou tratados em desconformidade.',
      67: 'O número certo é 2% do faturamento, limitado a R$ 50 milhões por infração (art. 52, II). Trocar o percentual é pegadinha frequente.',
      68: 'LGPD, art. 55-D: cinco diretores, incluído o Diretor-Presidente.',
      69: 'Quem trata dados em nome do controlador é o operador. O encarregado é o canal de comunicação com os titulares e a ANPD (art. 5º, VII e VIII).',
      70: 'A descrição é de pseudonimização (art. 13, § 4º): o dado só volta a identificar alguém com informação adicional guardada à parte. Na anonimização, o vínculo se perde.',
      71: 'O RGPD protege as pessoas que se encontram na União Europeia e vale também no Espaço Econômico Europeu.',
      73: 'O RGPD revogou a Diretiva 95/46/CE; não a complementa.',
      74: 'O RGPD alcança também o tratamento não automatizado de dados contidos, ou destinados a constar, em ficheiros (art. 2º, 1).',
      75: 'O PDCA (ciclo de Deming) é o motor da melhoria contínua do sistema de gestão de segurança da informação.',
      76: 'Guarda por prazo sempre indeterminado contraria o princípio da necessidade e as regras de término do tratamento (LGPD, arts. 6º, III, 15 e 16).',
      77: 'O endereço IP identifica o terminal na rede; por isso funciona como identificador e pode ser dado pessoal.',
      78: 'Criptografia assimétrica: um par de chaves; o que uma cifra, a outra decifra.',
      79: 'Duas chaves é criptografia assimétrica. Na simétrica, a mesma chave cifra e decifra.',
      82: 'A descrição é do ataque man-in-the-middle. Phishing é a isca: mensagem ou site falso para a vítima entregar os próprios dados.',
      94: 'Segurança desde a concepção vale desde o começo do projeto, não depois do desenho pronto.',
      95: 'Privacy by design: privacidade em todo o ciclo de vida. Privacy by default: a configuração padrão já é a mais protetiva.',
      105: 'Analisar o risco é entender causas e fontes, a probabilidade do evento e as consequências (ISO 31000).',
      106: 'Nível de risco combina consequências e probabilidade. "Consequência e impacto" é a mesma coisa dita duas vezes.',
    } },
  { id: 'antt24-cb1', org: 'ANTT', ano: 2024, aplic: '14/04/2024', codigo: '951_ANTT_CB1_01',
    nome: 'Especialista em Regulação de Transportes Terrestres · Conhecimentos básicos', de: 1,
    caderno: CDN + 'ANTT_23/arquivos/951_ANTT_CB1_01.PDF', gabUrl: CDN + 'ANTT_23/arquivos/GAB_DEFINITIVO_951_ANTT_CB1_01.PDF',
    gab: 'CCECEEEECECCECCECCCX' + 'CCEEXCECCECCEEECECEC' + 'ECCCECEEEC',
    blocos: [
      { de: 1, ate: 15, m: 'anpd-lp', tema: 'Interpretação e aspectos linguísticos de dois textos' },
      { de: 16, ate: 21, m: 'anpd-regul', tema: 'Papel regulador do Estado, história da regulação e regulação de preços' },
      { de: 22, ate: 25, m: null, tema: 'Regimento Interno da ANTT' },
      { de: 26, ate: 27, m: 'anpd-regul', tema: 'Carreiras das agências reguladoras (Lei 10.871/2004)' },
      { de: 28, ate: 36, m: null, tema: 'Transporte de cargas, atribuições da ANTT e concessão de serviços públicos' },
      { de: 37, ate: 41, m: 'anpd-da', tema: 'Extinção dos atos, poderes, delegação de serviços e controle da administração' },
      { de: 42, ate: 43, m: 'anpd-etica', tema: 'Código de Ética do servidor (Decreto 1.171/1994) e Código de Ética da ANTT' },
      { de: 44, ate: 50, m: 'anpd-dc', tema: 'Direitos fundamentais, organização do Estado, fiscalização financeira e ordem econômica' },
    ],
    itens: {} },
  { id: 'antt24-c1', org: 'ANTT', ano: 2024, aplic: '14/04/2024', codigo: '951_ANTT_001_01',
    nome: 'Especialista em Regulação · Conhecimentos específicos do cargo 1 (qualquer área)', de: 1,
    caderno: CDN + 'ANTT_23/arquivos/951_ANTT_001_01.PDF', gabUrl: CDN + 'ANTT_23/arquivos/GAB_DEFINITIVO_951_ANTT_001_01.PDF',
    gab: 'ECEECECCCEEEEECXXCCC' + 'ECCECCCCCECECCXECECE' + 'CECCEECEECCECECECCEE' + 'EECCCCEECCECECEECCEE' + 'CCCCCEEECEECCEECCCEE' + 'CCECCCECEECCEECEECEC',
    blocos: [
      { de: 1, ate: 23, m: 'anpd-ti', tema: 'Aprendizado de máquina, redes neurais, ETL, IA, linguagem natural, visão computacional e mineração de dados' },
      { de: 24, ate: 26, m: null, tema: 'Ferramenta SAS' },
      { de: 27, ate: 30, m: 'anpd-etica', tema: 'Lei de Acesso à Informação' },
      { de: 31, ate: 120, m: null, tema: 'Contabilidade, governança corporativa, gestão, finanças públicas e meio ambiente' },
    ],
    itens: {} },
  { id: 'antt24-c2', org: 'ANTT', ano: 2024, aplic: '14/04/2024', codigo: '951_ANTT_002_01',
    nome: 'Especialista em Regulação · Conhecimentos específicos do cargo 2 (Direito)', de: 1,
    caderno: CDN + 'ANTT_23/arquivos/951_ANTT_002_01.PDF', gabUrl: CDN + 'ANTT_23/arquivos/GAB_DEFINITIVO_951_ANTT_002_01.PDF',
    gab: 'CECCEEEECECEXCCEECEC' + 'ECECECEECCEECCCECEEE' + 'EEECCEEEECECCCECECCC' + 'CCEEEECEEECCCCCECECE' + 'CECEEEEECECEECCCCECE' + 'CECECEECCCECXCCCCEEC',
    blocos: [
      { de: 1, ate: 7, m: 'anpd-dc', tema: 'Princípios da ordem econômica e intervenção do Estado' },
      { de: 8, ate: 13, m: 'anpd-econ', tema: 'Defesa da concorrência' },
      { de: 14, ate: 15, m: 'anpd-regul', tema: 'Autoridades de concorrência e reguladoras' },
      { de: 16, ate: 18, m: null, tema: 'Crimes tributários e controle de atividades financeiras' },
      { de: 19, ate: 20, m: 'anpd-dc', tema: 'Elementos gerais da ordem econômica' },
      { de: 21, ate: 25, m: 'anpd-dig', tema: 'Código de Defesa do Consumidor' },
      { de: 26, ate: 35, m: null, tema: 'Transporte terrestre e sanções' },
      { de: 36, ate: 40, m: 'anpd-da', tema: 'Licitações e contratos (Lei 14.133/2021)' },
      { de: 41, ate: 45, m: null, tema: 'Convênios (Decreto 11.531/2023)' },
      { de: 46, ate: 50, m: 'anpd-da', tema: 'Contratos administrativos: formalização e fiscalização' },
      { de: 51, ate: 59, m: null, tema: 'Terceirização e contratações' },
      { de: 60, ate: 60, m: 'anpd-da', tema: 'Lei 14.133/2021' },
      { de: 61, ate: 85, m: null, tema: 'Transporte terrestre' },
      { de: 86, ate: 88, m: 'anpd-dig', tema: 'Crimes cibernéticos' },
      { de: 89, ate: 91, m: 'anpd-lgpd', tema: 'LGPD' },
      { de: 92, ate: 94, m: 'anpd-dig', tema: 'Marco Civil da Internet' },
      { de: 95, ate: 97, m: 'anpd-etica', tema: 'Lei de Acesso à Informação' },
      { de: 98, ate: 100, m: null, tema: 'Ciência, tecnologia e inovação na Constituição' },
      { de: 101, ate: 116, m: 'anpd-da', tema: 'Controle da administração pública' },
      { de: 117, ate: 118, m: 'anpd-regul', tema: 'Controle do TCU sobre as agências reguladoras' },
      { de: 119, ate: 120, m: 'anpd-da', tema: 'Controle da administração e Ministério Público' },
    ],
    itens: {} },
];
const PROVA = new Map(PROVAS.map(p => [p.id, p]));
/* o que estas provas ensinaram sobre o jeito de a banca escrever itens; a versão completa fica em instrutor/caderno-da-banca.md */
const ESTILO_BANCA = [
  ['Troca de conceito vizinho', 'AIR por ARR, encarregado por operador, anonimização por pseudonimização, preço-teto por custo do serviço, phishing por interceptação.'],
  ['Número ou quórum trocado', 'Multa de 5% no lugar de 2%; dois terços em sessão única no lugar de três quintos em dois turnos.'],
  ['Papéis invertidos', 'A sociedade planeja e o Estado participa; o direito vira garantia e a garantia vira direito.'],
  ['Subordinação que não existe', 'Em três provas, a agência aparece subordinada ao ministério. Vinculação não é hierarquia.'],
  ['Alcance encolhido ou esticado', 'A LGPD "só" entre particulares e poder público; a exceção da ordem judicial estendida a todo sigilo; guarda "sempre" indeterminada.'],
  ['Competência do vizinho', 'Agência editando decreto; lei ordinária onde a Constituição pede complementar; CGU como última instância da LAI.'],
  ['Item certo é a lei com outras palavras', 'Quando o item reproduz o artigo com leve paráfrase e sem palavra absoluta, costuma estar certo.'],
];
const blocosDoEdital = p => p.blocos.filter(b => b.m && materia(b.m));
const gabDe = (p, n) => p.gab[n - p.de] || '';
const idResp = (p, n) => `pv:${p.id}:${n}`;

/* ---------- o texto das provas ----------
   Fica só nos dados de quem usa (DB.textos, que acompanha a sincronização criptografada); nunca no repositório.
   Chega pela "ponte": o PDF oficial é lido no navegador, numa página do site da banca, e o resultado vem no endereço
   (#prova=...). A ferramenta e o passo a passo estão em instrutor/leitor-de-prova.js. */
const textoDe = id => DB.textos.find(x => x.id === id) || null;
// \u0001 e \u0002 cercam o destaque (negrito ou itálico) do caderno; o texto é protegido antes de virar tela
const marcado = s => { let ab = 0; return esc(String(s || '')).replace(/[\u0001\u0002]/g, c => c === '\u0001' ? (ab++ ? '' : '<b>') : (ab ? (ab = 0, '</b>') : '')) + (ab ? '</b>' : ''); };
const semMarca = s => String(s || '').replace(/[\u0001\u0002]/g, '');
function receberProva() {
  const h = /^#prova=([\w-]+)$/.exec(location.hash); if (!h) return;
  try { history.replaceState(null, '', location.pathname + location.search); } catch {}
  // só vale quando a página anterior é o site da banca (ou nos testes, em localhost)
  if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && !/^https:\/\/cdn\.cebraspe\.org\.br\//.test(document.referrer)) return;
  try {
    const bin = atob(h[1].replace(/-/g, '+').replace(/_/g, '/')), o = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0))));
    const p = o && o.v === 1 ? guardarProva(o) : null; if (!p) throw 0; salvar({ quieto: true });
    setTimeout(() => avisar(`Prova no app: ${p.org} ${p.ano}.`), 700);
  } catch { setTimeout(() => avisar('Não deu para trazer a prova.'), 700); }
}
// confere uma prova que vem de fora (ponte ou arquivo): tem de ser uma prova cadastrada, com todos os itens do gabarito
function guardarProva(o) {
  const p = o && typeof o === 'object' ? PROVA.get(o.prova) : null; if (!p || !o.itens || typeof o.itens !== 'object') return null;
  const itens = {}; for (let k = 0; k < p.gab.length; k++) { const n = p.de + k, s = o.itens[n]; if (typeof s !== 'string' || s.length > 4000) return null; itens[n] = s; }
  const grupos = (Array.isArray(o.grupos) ? o.grupos : []).filter(g => g && Number.isInteger(g.de)).slice(0, 200).map(g => ({ de: g.de, cmd: String(g.cmd || '').slice(0, 2000), apoio: String(g.apoio || '').slice(0, 12000) })).sort((a, b) => a.de - b.de);
  DB.textos = DB.textos.filter(x => x.id !== p.id); DB.textos.push({ id: p.id, itens, grupos, em: agora() }); return p;
}
/* o arquivo das provas: leva o texto de um aparelho para outro sem passar pelo repositório nem pela sincronização.
   Baixa-se no aparelho que já tem as provas e abre-se no outro, em Cadernos. */
const ARQ_PROVAS = 'estudo-facil-provas.json';
function baixarProvas() {
  if (!DB.textos.length) { avisar('Ainda não há provas neste aparelho.'); return; }
  const dados = { app: 'estudo-facil', tipo: 'provas', v: 1, provas: DB.textos.map(t => ({ prova: t.id, itens: t.itens, grupos: t.grupos })) };
  try {
    const url = URL.createObjectURL(new Blob([JSON.stringify(dados)], { type: 'application/json' })), a = document.createElement('a');
    a.href = url; a.download = ARQ_PROVAS; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
    avisar('Arquivo baixado. Abra-o no app do outro aparelho, em Cadernos.');
  } catch { avisar('Não foi possível baixar o arquivo neste navegador.'); }
}
async function abrirArquivoDeProvas(arq) {
  try {
    if (!arq || arq.size > 3e6) throw 0; const o = JSON.parse(await arq.text());
    if (!o || o.app !== 'estudo-facil' || o.tipo !== 'provas' || !Array.isArray(o.provas)) throw 0;
    const ok = o.provas.slice(0, 60).map(guardarProva).filter(Boolean); if (!ok.length) throw 0;
    salvar(); avisar(`${plural(ok.length, 'prova no app', 'provas no app')}: ${plural(oficiais().length, 'questão oficial', 'questões oficiais')}.`);
  } catch { avisar('Este arquivo não é o das provas do Estudo Fácil.'); }
}
document.addEventListener('change', e => { const el = e.target; if (el && el.id === 'pv-arquivo') { abrirArquivoDeProvas(el.files && el.files[0]); el.value = ''; } });
// as questões oficiais que já têm texto no aparelho, só dos blocos do edital; anuladas e itens com figura ficam de fora
let ofMemo = { k: null, L: [] };
function oficiais() {
  const k = DB.textos.map(x => x.id + ':' + x.em).join() + '|' + DB.materias.length;
  if (ofMemo.k === k) return ofMemo.L;
  const L = [];
  for (const p of PROVAS) {
    const tx = textoDe(p.id); if (!tx) continue;
    for (const b of blocosDoEdital(p)) for (let n = b.de; n <= b.ate; n++) {
      const g = gabDe(p, n), e = tx.itens[n]; if ((g !== 'C' && g !== 'E') || !semMarca(e).trim()) continue;
      let gi = -1; tx.grupos.forEach((x, i) => { if (x.de <= n) gi = i; });
      const gr = gi >= 0 ? tx.grupos[gi] : null, cmd = gr ? gr.cmd : '';
      // texto de apoio: o do próprio grupo; se o comando fala em "texto", o último texto apresentado antes
      let apoio = gr ? gr.apoio : ''; if (!apoio && /\btext[o]?\b/i.test(cmd)) for (let i = gi - 1; i >= 0 && !apoio; i--) if (tx.grupos[i].de >= b.de) apoio = tx.grupos[i].apoio;
      L.push({ id: idResp(p, n), m: b.m, g, e, c: p.itens[n] || '', f: `Cebraspe · ${p.org} ${p.ano} · item ${n}`, of: { p: p.id, n, cmd, apoio, rot: `${p.org} ${p.ano}` } });
    }
  }
  for (const id of [...QID.keys()]) if (id.startsWith('pv:')) QID.delete(id);
  L.forEach(q => QID.set(q.id, q));
  ofMemo = { k, L }; return L;
}
const marcaDe = (p, n) => idx().resp.get(idResp(p, n)) || null;
const itensDo = b => Array.from({ length: b.ate - b.de + 1 }, (_, i) => b.de + i);
// situação de um bloco: quantos marcados, se já foi corrigido e a nota no padrão da banca (certo +1, errado -1)
function blocoEstado(p, b) {
  const L = itensDo(b), M = L.map(n => marcaDe(p, n)), corr = M.some(r => r && r.cor);
  let ac = 0, er = 0, an = 0, br = 0;
  if (corr) L.forEach((n, i) => { const g = gabDe(p, n), r = M[i]; if (g === 'X') an++; else if (!r || !r.v) br++; else if (r.v === g) ac++; else er++; });
  return { n: L.length, marcados: M.filter(r => r && r.v).length, corr, ac, er, an, br, liquida: ac - er };
}
function provaResumo(p) {
  const B = blocosDoEdital(p), E = B.map(b => blocoEstado(p, b)), fe = E.filter(e => e.corr);
  return { blocos: B.length, itens: soma(E, e => e.n), feitos: fe.length, ac: soma(fe, e => e.ac), er: soma(fe, e => e.er) };
}

/* ---------- telas: lista de provas e folha de respostas ---------- */
let provaId = null, provaIni = 0;
const viewProvas = {
  html() {
    return `${voltaMais()}${cab('Provas do Cebraspe', 'Cadernos e gabaritos oficiais. Aqui ficam só os itens do seu edital.')}
      <ul class="card lista">${PROVAS.map(p => { const r = provaResumo(p), tot = r.ac + r.er;
        return `<li><button type="button" class="lin" data-act="abrir-prova" data-id="${p.id}"><span class="lin-ic">${I.simulado}</span><span class="lin-tx"><b>${esc(p.org)} ${p.ano}</b><small>${esc(p.nome)}</small><small>${r.itens} itens do seu edital · ${r.feitos ? `${r.feitos} de ${plural(r.blocos, 'bloco corrigido', 'blocos corrigidos')}${tot ? ` · ${pct(r.ac, tot)}% de acertos` : ''}` : 'ainda não resolvida'}</small></span>${I.seta}</button></li>`; }).join('')}</ul>
      <section aria-labelledby="pv-est"><div class="sec-cab"><h2 class="sec-t" id="pv-est">Como a banca escreve</h2></div>
        <div class="card apoio-secoes">${ESTILO_BANCA.map(([t, d]) => `<details data-kf-secao="grupo"><summary><b>${esc(t)}</b></summary><p>${esc(d)}</p></details>`).join('')}</div>
        <p class="apoio">Anotações do instrutor a partir destas ${PROVAS.length} provas. Elas guiam as questões e as apostilas do app.</p></section>
      <p class="apoio">O texto das provas não fica no app: o caderno abre no site do Cebraspe.</p>`;
  },
};
const viewProva = {
  html() {
    const p = PROVA.get(provaId); if (!p) return '';
    const B = blocosDoEdital(p), fora = p.blocos.filter(b => !b.m || !materia(b.m));
    return `<button type="button" class="volta" data-kf-ir="provas">${I.volta}<span>Provas</span></button>${cab(`${p.org} ${p.ano}`, esc(p.nome))}
      <section class="folha prova-capa"><dl class="resumo"><div><dt>Aplicação</dt><dd>${esc(p.aplic)}</dd></div><div><dt>Caderno</dt><dd>${esc(p.codigo)}</dd></div><div><dt>Itens do seu edital</dt><dd>${soma(B, b => b.ate - b.de + 1)} de ${p.gab.length}</dd></div></dl>
        <a class="kf-btn kf-pri bloco" href="${esc(p.caderno)}" target="_blank" rel="noopener noreferrer">Abrir o caderno oficial<span class="kf-so-leitor"> (abre em outra aba)</span></a>
        <a class="kf-btn kf-link" href="${esc(p.gabUrl)}" target="_blank" rel="noopener noreferrer">Ver o gabarito no site do Cebraspe<span class="kf-so-leitor"> (abre em outra aba)</span></a>
        ${textoDe(p.id) ? `<button type="button" class="kf-btn kf-comecar bloco" data-act="abrir-cad" data-id="p:${esc(p.id)}" id="pv-caderno">${I.play}Resolver no caderno</button>` : ''}
        <p class="apoio">${textoDe(p.id) ? 'As questões desta prova já estão no app. Aqui fica a folha de respostas, com a nota líquida por bloco.' : 'Leia o item no caderno, marque aqui e corrija o bloco. Errado desconta um ponto, como na prova.'}</p></section>
      ${B.map((b, k) => blocoHTML(p, b, k)).join('')}
      ${fora.length ? `<section aria-labelledby="pv-fora"><div class="sec-cab"><h2 class="sec-t" id="pv-fora">Fora do seu edital</h2></div><ul class="card lista-simples">${fora.map(b => `<li>Itens ${b.de}${b.ate > b.de ? ' a ' + b.ate : ''}: ${esc(b.tema)}</li>`).join('')}</ul></section>` : ''}`;
  },
  ligar(v) {
    v.addEventListener('click', e => {
      const p = PROVA.get(provaId); if (!p) return;
      const m = e.target.closest('button[data-item]');
      if (m) { // marcar C ou E; tocar de novo desmarca
        const n = +m.dataset.item, id = idResp(p, n); let r = DB.respostas.find(x => x.id === id);
        if (r && r.cor) return;
        if (!provaIni) provaIni = Date.now();
        if (!r) { r = { id }; DB.respostas.push(r); }
        r.v = r.v === m.dataset.v ? '' : m.dataset.v; r.em = agora();
        $$('button[data-item]', m.parentElement).forEach(x => x.setAttribute('aria-pressed', String(x.dataset.v === r.v)));
        salvar({ quieto: true }); return;
      }
      const c = e.target.closest('[data-corrigir]'); if (c) return corrigirBloco(p, blocosDoEdital(p)[+c.dataset.corrigir]);
      const z = e.target.closest('[data-refazer]'); if (z) return refazerBloco(p, blocosDoEdital(p)[+z.dataset.refazer]);
      const q = e.target.closest('[data-perg]'); if (q) return perguntarInstrutor(null, null, { rotulo: `${p.org} ${p.ano} · ${p.codigo} · item ${q.dataset.perg}`, linhas: [`Prova: ${p.org} ${p.ano}, caderno ${p.codigo} (${p.caderno})`, `Item ${q.dataset.perg} · gabarito oficial: ${GAB[gabDe(p, +q.dataset.perg)] || 'anulado'}${(marcaDe(p, +q.dataset.perg) || {}).v ? ' · marquei: ' + GAB[marcaDe(p, +q.dataset.perg).v] : ''}`] });
    });
  },
};
function blocoHTML(p, b, k) {
  const E = blocoEstado(p, b), m = materia(b.m);
  return `<section class="card bloco-prova" aria-labelledby="bl-${k}" data-bloco="${k}">
      <div class="bl-cab">${pontoCor(m)}<span class="bl-tx"><h2 class="sec-t" id="bl-${k}">${esc(m.nome)}</h2><small>Itens ${b.de}${b.ate > b.de ? ' a ' + b.ate : ''} · ${esc(b.tema)}</small></span></div>
      ${E.corr ? `<p class="bl-nota" role="status"><b>${E.liquida > 0 ? '+' : ''}${E.liquida}</b><span>nota líquida · ${plural(E.ac, 'certo', 'certos')}, ${plural(E.er, 'errado', 'errados')}${E.br ? `, ${E.br} em branco` : ''}${E.an ? `, ${plural(E.an, 'anulado', 'anulados')}` : ''}</span></p>` : ''}
      <ol class="folha-resp">${itensDo(b).map(n => { const r = marcaDe(p, n), v = r && r.v || '', g = gabDe(p, n), ok = E.corr && g !== 'X' && v && v === g, com = p.itens[n];
        const estado = !E.corr ? '' : g === 'X' ? 'Anulado' : !v ? `Em branco · gabarito: ${GAB[g]}` : ok ? `Acertou · gabarito: ${GAB[g]}` : `Errou · gabarito: ${GAB[g]}`;
        return `<li class="fr-item ${E.corr ? (g === 'X' ? 'an' : !v ? 'br' : ok ? 'ok' : 'no') : ''}"><div class="fr-linha"><span class="fr-n">Item ${n}</span>
            <span class="kf-seg fr-seg" role="group" aria-label="Item ${n}">${['C', 'E'].map(x => `<button type="button" data-item="${n}" data-v="${x}" aria-pressed="${v === x}" ${E.corr ? 'disabled' : ''}>${GAB[x]}</button>`).join('')}</span></div>
          ${E.corr ? `<p class="fr-res"><span class="fr-ic" aria-hidden="true">${g === 'X' || !v ? I.questoes : ok ? I.check : I.x}</span><b>${estado}</b></p>${com ? `<p class="fr-com">${esc(com)}</p>` : ''}
            ${(INSTRUTOR[idResp(p, n)] || []).slice(-1).map(x => `<div class="tr-inst"><span class="rotulo-mini">Instrutor · ${esc(x.em || '')}</span><p>${esc(x.r || '')}</p></div>`).join('')}
            ${g !== 'X' ? `<button type="button" class="kf-btn kf-link" data-perg="${n}">Perguntar sobre o item ${n}</button>` : ''}` : ''}</li>`; }).join('')}</ol>
      ${E.corr ? `<button type="button" class="kf-btn kf-sec bloco" data-refazer="${k}">Refazer o bloco</button>` : `<button type="button" class="kf-btn kf-pri bloco" data-corrigir="${k}">Corrigir o bloco</button>`}
    </section>`;
}
function corrigirBloco(p, b) {
  const E0 = blocoEstado(p, b); if (!b || E0.corr) return;
  if (!E0.marcados) { avisar('Marque pelo menos um item antes de corrigir.'); return; }
  const fazer = () => {
    const antes = { s: jogoEstado(), perfeito: missoes().perfeito }, h = agora();
    itensDo(b).forEach(n => { const id = idResp(p, n); let r = DB.respostas.find(x => x.id === id); if (!r) { r = { id, v: '' }; DB.respostas.push(r); } r.cor = h; r.ok = !!r.v && r.v === gabDe(p, n); });
    VER++; const E = blocoEstado(p, b), seg = provaIni ? Math.min((Date.now() - provaIni) / 1000, E.n * 240) : E.marcados * 60; provaIni = 0;
    const fez = registrarSessao({ m: b.m, tipo: 'questoes', seg, ac: E.ac, er: E.er, extra: { prova: p.id, bloco: b.de } });
    fez.rotulo = `${p.org} ${p.ano} · itens ${b.de} a ${b.ate}`; fez.extra = [['Nota líquida', `${E.liquida > 0 ? '+' : ''}${E.liquida} de ${E.n - E.an}`]];
    salvar({ quieto: true });
    if (!festa(fez, antes, { aoFechar: () => { render(); setTimeout(medalhaFilaMostrar, 500); } })) { jogoConferir(); render(); }
  };
  if (E0.marcados < E0.n) confirmar('Corrigir com itens em branco?', `Você marcou ${E0.marcados} de ${E0.n} itens. Item em branco não soma nem desconta.`, 'Corrigir o bloco', fazer); else fazer();
}
function refazerBloco(p, b) {
  confirmar('Refazer o bloco?', 'As suas marcações deste bloco são apagadas. A sessão já registrada continua valendo.', 'Refazer o bloco', () => {
    const ids = new Set(itensDo(b).map(n => idResp(p, n))); DB.respostas = DB.respostas.filter(r => !ids.has(r.id)); salvar(); avisar('Bloco pronto para refazer.');
  });
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
      ${corr ? `<section class="card" aria-labelledby="ds-co"><h2 class="sec-t" id="ds-co">Correção do instrutor</h2><div class="tr-inst"><span class="rotulo-mini">${esc(corr.em || '')}</span><p>${esc(corr.r || '')}</p></div></section>` : ''}
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
      if (ok) { const r = redacaoDe(d.id); r.env = agora(); salvar({ quieto: true }); if (!semSalvar) window.open(URL_CLAUDE, '_blank', 'noopener'); setTimeout(() => jogoConferir(), 600); }
      avisar(ok ? 'Texto copiado. Cole no Claude e envie.' : 'Não deu para copiar. Tente de novo.');
    });
  },
};
const contagemDisc = (L, d) => !L.palavras ? `Limite: ${d.linhas} linhas, perto de ${d.linhas * 11} palavras.` : `${plural(L.palavras, 'palavra', 'palavras')}, perto de ${plural(L.linhas, 'linha', 'linhas')} de ${d.linhas}.${L.linhas > d.linhas ? ' Passou do limite: a banca despreza o excesso.' : ''}`;
