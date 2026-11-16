# Caderno da banca · Cebraspe

Anotações do instrutor (Claude) sobre como o Cebraspe escreve itens e provas discursivas, tiradas das provas oficiais
indexadas em `provas.js`. **Toda conversa que for escrever questões, comentários ou apostilas lê este arquivo antes e o
melhora depois.** Aqui não entra texto de prova: só a referência (prova e número do item) e a observação.

Atualizado em 16/11/2026 · base: 4 cadernos objetivos (220 itens, 140 do edital da ANPD) e 3 provas discursivas.

## 1. De onde vêm as provas

- Fonte única: `cdn.cebraspe.org.br/concursos/<CONCURSO>/arquivos/`. O caderno tem o código no nome
  (`961_ANATEL_CB1_01.PDF`); o gabarito definitivo é `GAB_DEFINITIVO_<código>.PDF` (às vezes `Gab_Definitivo_`).
- A página de cada concurso (`www.cebraspe.org.br/concursos/<concurso>`) depende de JavaScript: a busca na web é o
  caminho para achar os arquivos. Buscar o código do caderno entre aspas com "GABARITOS OFICIAIS DEFINITIVOS".
- Cada gabarito é lido duas vezes, em formatos diferentes, e conferido com o conteúdo dos itens antes de entrar no app.
- Sites de questões (Tec, QConcursos e outros) não são fonte.

## 2. Desenho das provas de agência reguladora

| Prova | Itens básicos | Como se dividem |
|---|---|---|
| ANATEL 2024 (CB1) | 50 | Português 15 · Inglês 8 · Regulação 6 · Lei do setor 4 · Administrativo 9 · Constitucional 8 |
| ANAC 2024 (CB1) | 50 | Inglês 10 · Administrativo 8 · Ética e integridade 6 · Direitos humanos 6 · Constitucional 2 · Informática e dados 6 · Lei do setor 8 · Carreiras das agências 4 |
| ANTT 2024 (CB1) | 50 | Português 15 · Regulação e economia 6 · Regimento e leis do setor 15 · Administrativo 5 · Ética 2 · Constitucional 7 |
| ANM 2025 (CG4) | 50 | Gerais e Português 8 · Inglês 5 · Constitucional 4 · Administrativo 4 · Informática 5 · Ética 3 · LGPD e LAI 2 · Regulação 5 · Lei do setor 12 · Lógica 2 |

- Padrão: 120 itens de certo ou errado, 50 básicos e 70 específicos. Errado desconta um ponto.
- Proporção de certos e errados perto de meio a meio, com leve folga para os errados (ANATEL: 21 C, 26 E, 3 anulados;
  ANM: 25 C, 21 E, 4 anulados; ANAC: 24 C, 25 E, 1 anulado; DATAPREV específicos: 31 C, 36 E, 3 anulados).
- De 3% a 8% dos itens são anulados. A justificativa mais comum: "possibilita mais de uma interpretação".
- Toda prova de agência traz itens da lei do próprio setor e do regimento da agência. Para a ANPD, espere LGPD,
  Lei 15.352/2026, regimento interno e resoluções do Conselho Diretor nesse lugar.
- A ANTT 2024 ainda não entrou no app: falta o gabarito definitivo do caderno CB1 em endereço oficial alcançável.

## 3. Como nasce um item errado

| Armadilha | Onde apareceu |
|---|---|
| Troca de conceito vizinho | AIR por ARR (ANATEL 29) · encarregado por operador (DATAPREV 69) · anonimização por pseudonimização (DATAPREV 70) · ordem econômica por ordem social (ANATEL 48) · preço-teto por custo do serviço (ANM 35) · simétrica por assimétrica (DATAPREV 79) · phishing por interceptação (DATAPREV 82) · transparência por adequação (curso de formação da ANM) |
| Número ou quórum trocado | 5% no lugar de 2% (DATAPREV 67) · dois terços em sessão única no lugar de três quintos em dois turnos (ANATEL 45) |
| Papéis invertidos | a sociedade planeja e o Estado participa (ANATEL 49) · direito e garantia trocados (ANAC 29) · forma republicana como cláusula pétrea (ANATEL 47) |
| Subordinação que não existe | agência subordinada ao ministério (ANATEL 25, ANAC 14, ANTT 23) |
| Alcance encolhido ou esticado | LGPD só entre particulares e poder público (ANM 30) · ressalva da ordem judicial para todo sigilo (ANATEL 44) · guarda "sempre" indeterminada (DATAPREV 76) · planejamento indicativo para os dois setores (ANM 14) · melhoria regulatória valendo para estados (ANM 32) |
| Competência do vizinho | agência editando decreto (ANATEL 36) · lei ordinária onde se exige complementar (ANM 17) · CGU como última instância da LAI (DATAPREV 51) · comissão de ética aplicando demissão (ANAC 21) · ouvidor como responsável pelos dados pessoais (ANTT 22) |
| Ônus ou requisito trocado | terceiro provando a culpa na responsabilidade objetiva (ANAC 18) · "segurança desde a concepção" só depois do desenho (DATAPREV 94) |
| Fundamento errado para instituto certo | reversão de bens para indenizar a administração (ANATEL 40) |

Como reconhecer um item certo: reproduz o artigo com leve paráfrase, sem palavra absoluta nova (ANATEL 31, 46 e 50;
DATAPREV 53, 54 e 68; ANM 15, 16, 19 e 20). Palavras como "apenas", "sempre", "em qualquer caso" e "todos" pedem
desconfiança, mas não decidem sozinhas: ANATEL 50 traz "sempre" e está certo, porque a Constituição diz "sempre".

## 4. O que a banca cobrou de proteção de dados

- Aplicação e exceções (art. 4º): fins jornalísticos e artísticos (DATAPREV 53); alcance público e privado (ANM 30).
- Conceitos (art. 5º): encarregado e operador (DATAPREV 69); anonimização e pseudonimização (DATAPREV 70).
- Direitos (art. 18): anonimização, bloqueio e eliminação a qualquer momento (DATAPREV 66).
- Sanções (art. 52): percentual e teto da multa (DATAPREV 67).
- ANPD (art. 55-D): composição do Conselho Diretor (DATAPREV 68).
- Princípios (art. 6º): transparência e adequação trocadas (curso de formação da ANM).
- Biometria e prazo de guarda (DATAPREV 76); privacidade desde a concepção e por padrão (DATAPREV 94 e 95).
- Fora da LGPD: RGPD (DATAPREV 71 a 74), Marco Civil (DATAPREV 54) e LAI (DATAPREV 51, ANM 31, ANATEL 42).
- Na discursiva: segurança desde a concepção, governança em privacidade, comunicação de incidente e boas práticas
  (ANM 2025, cargo 13).

## 5. Prova discursiva

- Formato: um texto de apoio ou uma situação, o comando e de três a quatro tópicos, cada um com a sua pontuação.
  Apresentação e estrutura valem 5% da nota (1,5 em 30; 1 em 20; 4 em 80).
- Extensão: 30 linhas no texto dissertativo curto, 45 no longo, 60 no parecer.
- O padrão de resposta lista "aspectos". A nota de cada quesito sobe pelo número de aspectos certos e bem
  desenvolvidos (conceitos de 0 a 3, 0 a 4, 0 a 6). Citar sem explicar vale o conceito mais baixo.
- No parecer (ANTT 2024), a banca plantou falhas na proposta: quem aprovou tudo ficou com zero na conclusão. Parecer
  pede posição clara, com ajustes viáveis.
- A banca cobra jurisprudência nomeada quando o tema pede (ANATEL 2024, Direito: ADC 51 do STF).
- Para treinar: responder tópico por tópico, na ordem do comando, nomeando o artigo e explicando em uma frase.

## 6. Regras para escrever os itens do app

1. Um item, uma ideia. Frase única, em terceira pessoa, sem "pegadinha" fora da lei.
2. Item errado nasce de uma das armadilhas da seção 3, e o comentário diz qual foi.
3. Item certo segue o artigo com outras palavras; o fundamento vai no campo próprio.
4. Metade certos, metade errados, com leve folga para os errados.
5. Nunca reescrever um item de prova: usar a armadilha, não o enunciado.
6. Conferir cada número, prazo e artigo na fonte oficial antes de publicar.

## 7. O que falta levantar

- Gabarito da ANTT 2024 (CB1) e os específicos de Direito e de formação geral da ANATEL 2024.
- ANM 2025: cargos 13 e 15 (regulação, AIR e Lei 13.848) e os de TI (24 a 26), que trazem LGPD.
- Cursos de formação da ANA, da ANTAQ, da ANS e da ANATEL, que cobram Lei 13.848 e AIR.
- Mais provas com LGPD: FUNPRESP-EXE 2024, SEPLAG-CE 2024, SUSEP 2025 e Câmara dos Deputados 2025.
- Português e Inglês: mapear os tipos de item (inferência, reescrita, regência, pontuação, vocabulário).
