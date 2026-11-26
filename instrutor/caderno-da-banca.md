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

7. O "só", o "apenas" e o "sempre" são armadilha própria: o resto do item pode estar certo e a restrição derruba.
8. Nada de norma recente de memória: Lei 15.352/2026, ECA Digital e resoluções da ANPD só entram depois de conferidas
   em fonte oficial ou em mais de uma fonte; o que não foi confirmado fica de fora.

### Estado do banco (1.3.0, 16/11/2026)

- 220 questões nativas: 63 de LGPD (`questoes.js`) e 157 das outras onze disciplinas (`questoes2.js`); 109 certas e
  111 erradas.
- Nenhum assunto com três ou mais questões tem um gabarito só.
- Assuntos ainda sem questão nativa (o app mostra "Sem questões do app" e oferece o cronômetro):
  - Regulamentos da ANPD: Resoluções 30/2025 e 32/2026, agenda regulatória, os três grupos de guias e os enunciados
    do Conselho Diretor;
  - ANPD como agência: Decreto 12.881/2026, CNPD, art. 55-J e planejamento estratégico;
  - Tecnologia: big data e perfilamento; Direito digital: CDC no ambiente digital e Cadastro Positivo;
  - Português: interpretação, tipologia e coordenação e subordinação (dependem de texto de apoio);
  - Inglês: inferência e ideia principal (depende de texto de apoio).
- Português e Inglês da banca são presos a um texto. No app, por ora, as questões são de frase solta; falta criar o
  formato "texto de apoio + itens" com textos próprios.

### Provas no app (1.6.0, 16/11/2026)

- Sete cadernos: ANATEL 2024 (CB1), ANAC 2024 (CB1), ANM 2025 (CG4), DATAPREV 2023 (segurança) e ANTT 2024 (CB1,
  cargo 1 e cargo 2). São 259 questões oficiais do edital da ANPD; 73 têm comentário (nenhuma da ANTT ainda).
- Como achar os arquivos de um concurso: abrir `www.cebraspe.org.br/concursos/<concurso>` no Claude in Chrome e ler
  os links da página (texto do link e nome do arquivo). Não chamar a API do site diretamente. O concurso da ANTT de
  2024 fica em `ANTT_23`.
- Gabarito: extraído do PDF no navegador por dois caminhos (número com a letra logo abaixo; linhas de números e de
  letras emparelhadas) e conferido uma terceira vez pelo WebFetch, incluindo os anulados.
- Blocos por disciplina: saem dos comandos ("Julgue os itens...") que o leitor de prova separa.
- ANTT 2024: os específicos (P2) são numerados de 1 a 120; o cargo 2 (Direito) cobrou LGPD (itens 89 a 91), Marco
  Civil, crimes cibernéticos, LAI, concorrência e 20 itens de controle da administração; o cargo 1 cobrou 23 itens de
  aprendizado de máquina e IA.

### Levantamento em lote (1.12.0, 16/11/2026)

- Ferramenta: `instrutor/levantamento.js`, numa página de `cdn.cebraspe.org.br`, com o pdf.js e o leitor de prova.
- Lista de arquivos: as páginas dos concursos, abertas em quadros na página de concursos encerrados; só cadernos
  com gabarito definitivo de mesmo nome.
- Resultado: de 623 cadernos de 57 concursos, entraram 234 (46 concursos), com cerca de 4,7 mil itens do edital:
  Direito Administrativo e Tecnologia (1,2 mil cada), Português (960), Constitucional (570), Regulação (290),
  Ética (170), Inglês (160), LGPD (160), Direito digital (26) e Economia (15).
- Ficaram de fora: 80 cadernos de múltipla escolha, 290 com menos de 8 itens novos do edital (quase sempre os
  básicos repetidos de outro cargo), 10 com gabarito ou itens que não fecharam e 2 PDFs que travam o leitor (CTI).
- O cadastro dessas provas não fica no repositório: viaja com o texto e é conferido pelo app (`registrarProva`).
- A separação por disciplina é pelas palavras do comando (`LV_REGRAS`); o assunto, pelas `REGRAS_ASSUNTO` do app.
  É automático e pode errar; os itens não têm comentário.

## 7. O que falta levantar

- ANTT 2024: cargos 3 e 4 e as provas do curso de formação (arquivos listados na página do concurso).
- Os específicos de Direito e de formação geral da ANATEL 2024.
- ANM 2025: cargos 13 e 15 (regulação, AIR e Lei 13.848) e os de TI (24 a 26), que trazem LGPD.
- Cursos de formação da ANA, da ANTAQ, da ANS e da ANATEL, que cobram Lei 13.848 e AIR.
- Mais provas com LGPD: FUNPRESP-EXE 2024, SEPLAG-CE 2024, SUSEP 2025 e Câmara dos Deputados 2025.
- Português e Inglês: mapear os tipos de item (inferência, reescrita, regência, pontuação, vocabulário).

## 8. Apostilas (1.13.0, 26/11/2026)

- As questões saíram do app (o Bruno resolve no Tec). O caderno da banca passa a guiar as **apostilas**: cada capítulo
  tem o bloco "Como o Cebraspe cobra", com a armadilha da seção 3 que mais pega naquele assunto e a referência da prova
  (órgão, ano e número do item, sem o texto), e modelos de item certo e errado escritos pelo instrutor.
- Regras de escrita: leitor leigo (cada termo explicado onde aparece), frases curtas, um exemplo do dia a dia por
  ideia; todo número, prazo e artigo conferido no texto da lei que está em `leis/` no dia da escrita; o que não pôde
  ser conferido fica de fora ou é apontado para a norma certa (ex.: o prazo de comunicação de incidente está em
  resolução da ANPD, não na LGPD). Modelo de item nunca reescreve item de prova.
- Feita: LGPD (`apostilas/anpd-lgpd.md`, 19 capítulos, base: Planalto, cópia de 16/11/2026, com a Lei 15.352/2026).
- Fila, pela ordem do peso: Português, Direito Administrativo, Regulamentos da ANPD, Direito Constitucional,
  Regulação, e as demais; do Cofen, contratos administrativos primeiro.
- **O Cofen é do Instituto Quadrix**, não do Cebraspe. As apostilas são escritas para o Cebraspe (foco: ANPD). Antes de
  escrever material só do Cofen, levantar provas do Quadrix e anotar aqui o jeito de a banca escrever.
