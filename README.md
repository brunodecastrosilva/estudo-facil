# Estudo Fácil

Estudo por questões para o concurso da ANPD (Especialista em Regulação de Proteção de Dados, banca Cebraspe), no celular
e no computador. O app gira em torno de **cadernos de questões** de certo ou errado, todas escritas dentro dele e
comentadas; transforma os erros em flashcards, traz as provas oficiais da banca com correção, treina a discursiva, lembra
das revisões e mostra a evolução, com sequência de dias, missões e mais de cem medalhas.

Versão **1.8.0** · Kit Fácil 0.9.0 · app web em <https://brunodecastrosilva.github.io/estudo-facil/>

> **Fase de testes fechada (provisória).** Desde a 1.1.0 o app é de uso exclusivo do Bruno e todo voltado ao concurso
> da ANPD. Desde a 1.3.0, as funções gerais do app público (Concursos, Disciplinas, Simulados, Agenda e o guia) ficam
> fora da tela. No futuro ele volta a ser publicado para o público geral. Veja "Exceções ao padrão".

Faz parte do **Projeto Fácil** (Conta Fácil, Elétrica Fácil, Estudo Fácil e Guitarra Fácil) e segue o
[Código do Projeto Fácil](comum/CODIGO.md). Na versão 1.0.0 o app foi refeito do zero, seguindo o Conta Fácil, que é a
referência do projeto (Art. 93).

## O que o app faz

- **Cadernos de questões:** um caderno por disciplina (as doze do plano), com as questões agrupadas por assunto. Cada caderno guarda o seu andamento: continuar de onde parou, abrir qualquer questão pelo número, refazer só as erradas ou zerar as respostas
- **Atalhos:** só as que errei, nunca resolvidas e o desafio do dia
- **Meus cadernos:** cadernos montados por disciplina, filtro (todas, nunca resolvidas ou as que errei) e tamanho
- **Questões nativas:** 220 questões de certo ou errado no estilo Cebraspe, **escritas dentro do app** (`questoes.js` e `questoes2.js`) a partir da lei e das armadilhas vistas nas provas oficiais. Cada uma tem gabarito, comentário e fundamento, e leva o selo "Feita por IA". Não são questões de prova
- **Questões oficiais do Cebraspe:** o texto das provas cadastradas chega ao aparelho e cada prova vira caderno, só com os itens do edital, com comando, texto de apoio, gabarito definitivo e comentário do instrutor. As questões de prova também entram no caderno da disciplina, nos atalhos, nos cadernos montados e nos flashcards. **O texto fica só nos dados de quem usa; não entra no repositório** (veja "A ponte das provas")
- **Leis na íntegra** (em Mais): 24 normas do edital com o texto compilado do Planalto, sem alteração (`leis/<id>.json`: `fonte`, `lido` e `p`, a lista de parágrafos, com `r` no que está revogado e `c` no que é centralizado). O tempo de leitura vira sessão de "Lei seca" no assunto da lei. A lista e a tela ficam em `leis.js`
- **Hoje:** a sequência de dias, a meta do dia, as três missões, o caderno em andamento e o plano de hoje
- **Plano do dia:** revisões vencidas primeiro; depois, blocos das disciplinas mais atrasadas em relação ao peso na prova
- **Edital da ANPD** (em Mais): 12 disciplinas, 119 assuntos, pesos, três fases até a prova e fontes oficiais; cada assunto estudado fica grifado e a prontidão sobe. O edital ainda não saiu: o que é estimativa está marcado como estimativa
- **Folha de respostas das provas:** sete cadernos oficiais (ANATEL 2024, ANAC 2024, ANM 2025, DATAPREV 2023 e três da ANTT 2024: básicos, cargo 1 e cargo 2). Sem o texto no aparelho, o caderno abre no site da banca; o app mostra só os blocos do edital da ANPD, com folha de respostas, correção pelo gabarito oficial definitivo (errado desconta um ponto) e comentário do instrutor. O texto das provas não fica no app
- **Como a banca escreve:** as armadilhas que mais apareceram nessas provas; a versão completa é o `instrutor/caderno-da-banca.md`, que guia as questões e as apostilas
- **Discursiva:** três temas que o Cebraspe cobrou (com o endereço do enunciado e do padrão de resposta) e três temas inéditos do instrutor para a ANPD; contagem de linhas, rascunho guardado, o que a banca espera e envio do texto para correção
- **Flashcards** das questões erradas, que voltam em 1, 3, 7, 15 e 30 dias; **combo** de acertos seguidos
- **Instrutor:** "Perguntar ao instrutor" copia a questão e a dúvida para levar ao Claude (Projeto Estudo Fácil); a resposta fica gravada em `instrutor/respostas.json` e aparece junto da questão
- **Modo foco:** cronômetro em tela cheia para lei seca, teoria e assuntos ainda sem questões do app; dá para recolher sem parar o tempo
- **Revisões** em 1, 7 e 30 dias depois da teoria (ou os dias que você escolher)
- **Sequência e folgas:** dias seguidos com a meta batida; a folga guardada salva um dia de falta
- **Pontos, 10 níveis e 111 medalhas** em quatro metais (bronze, prata, ouro e diamante), com tela própria na barra de baixo; em 3D (WebGL), giram com o dedo. Dá para desligar nos Ajustes
- **Evolução:** prontidão, constância, horas por semana, acertos por disciplina e totais
- **Abertura** na primeira vez
- **Use em vários aparelhos (opcional):** dados sincronizados, criptografados, num gist secreto da sua conta GitHub
- **Avaliação e relato de problemas** pelo balão no alto da tela; **presente para o criador** (Pix, opcional)
- Tema claro, escuro ou automático; instalável; funciona sem internet depois da primeira visita

**Fora da tela nesta fase** (o código continua no repositório): Concursos (outros editais), Disciplinas (cadastro),
Simulados, Agenda e o guia. Em `localhost`, `?geral=1` liga essas telas, para os testes.

## Como usar

Abra o endereço em qualquer navegador, no celular, no tablet ou no computador. Para instalar:

- **iPhone:** no Safari, toque em **Compartilhar → Adicionar à Tela de Início**
- **Android:** no Chrome, menu **⋮ → Instalar app**
- **Computador:** ícone de instalar na barra de endereço do Chrome ou do Edge

## Onde ficam os dados

| Dado | Onde fica |
|---|---|
| Concursos, disciplinas, sessões, respostas das questões (com os flashcards), andamento dos cadernos, texto das provas oficiais trazidas pela ponte, marcações das provas oficiais, textos da discursiva, revisões, dias com a meta batida, medalhas, simulados, agenda e ajustes | neste aparelho (armazenamento do navegador, chaves `estudofacil.*`) |
| Os mesmos dados, com a sincronização ligada | gist secreto na conta GitHub do usuário, criptografado no aparelho (AES-256) |
| Perguntas ao instrutor e discursivas enviadas | o app só copia o texto; quem envia é a pessoa, no Claude. As respostas gravadas ficam no repositório (`instrutor/respostas.json`), que é público: nada pessoal entra nelas |
| Avaliações e relatos de problema enviados | Firestore do projeto no Firebase (Google), coleção `feedback`; apagados depois de 2 anos |

Quem usava a versão 0.x começa de novo: o formato mudou e os dados não são trazidos (Código, Art. 32-A). A cópia antiga
fica guardada no aparelho, na chave `estudofacil.db_antigo`, até uma restauração de fábrica.

## Para desenvolver

O app não tem etapa de build nem dependências: o que está no repositório é o que vai para o ar.
O Node (22 ou mais novo) só é usado para o servidor local, os testes e a verificação.

```bash
npm start                         # abre em http://localhost:8080/estudo-facil/
npm install                       # primeira vez: instala o Playwright e o axe, usados nos testes
npx playwright install chromium   # primeira vez (sem ele, os testes usam o Google Chrome instalado)
npm test                          # testes do Kit Fácil e do app, sem internet (inclui o guia inteiro, uns 6 minutos)
node --test tests/app.test.mjs    # só os testes do app
npm run verificar                 # Código do Projeto Fácil, segredos, versão, service worker, CSP e SRI
```

Nos testes, `?hoje=AAAA-MM-DD` fixa o dia (só vale em `localhost`). Os testes simulam o GitHub; nada toca nos dados reais.
O modo sem internet (service worker) só funciona em `https`, ou seja, no endereço publicado.
Ao mudar a versão, atualize também o `?v=` dos arquivos no `index.html`.

## Estrutura

| Arquivo | Conteúdo |
|---|---|
| `index.html` | moldura da página: barra de cima, navegação e a política de segurança (CSP) |
| `estilo.css` | identidade visual "caderno e marca-texto" e todas as telas |
| `editais.js` | a biblioteca: o plano da ANPD (edital previsto, banca Cebraspe) |
| `questoes.js` e `questoes2.js` | o banco de questões do app (questões inéditas de certo ou errado, com comentário e fundamento) e uma aula curta por assunto: LGPD no primeiro, as outras onze disciplinas no segundo |
| `cadernos.js` | cadernos de questões: por disciplina, atalhos, cadernos montados e o andamento de cada um |
| `app.js` | motor: dados, plano do dia, sequência, pontos, domínio, revisões e sincronização |
| `jogo.js` | níveis, medalhas (séries em quatro metais, desenhadas e em 3D) e a festa de fim de sessão |
| `treino.js` | treino de questões em tela cheia, flashcards, desafio do dia e a ponte com o instrutor |
| `provas.js` | provas oficiais do Cebraspe (endereços, gabarito definitivo, blocos por disciplina e comentários; sem o texto das provas), folha de respostas e o treino da discursiva |
| `instrutor/caderno-da-banca.md` | o que o instrutor aprendeu sobre o jeito de a banca escrever; toda conversa que escreve material lê e melhora |
| `instrutor/leitor-de-prova.js` | a ferramenta da ponte: lê o PDF oficial no navegador (duas colunas, itens, comandos e textos de apoio) e manda o resultado ao app pelo endereço. Não é carregada pelo app |
| `instrutor/respostas.json` | respostas do instrutor (Claude), por questão; o app lê ao abrir |
| `estudar.js` | escolher o que estudar, modo foco, fechar a sessão, lançar estudo feito e a ficha do assunto |
| `telas.js` | Hoje, Edital, Medalhas, Evolução, Instrutor, Mais e Revisões; e as telas gerais, fora da fase fechada (Concursos, Disciplinas, Simulados e Agenda) |
| `casca.js` | navegação, Ajustes, abertura e arranque (e o guia, desligado nesta fase) |
| `comum/` | **Kit Fácil**: sincronização, avaliação, apoio, cópia de segurança, Ajustes, janelas e avisos. Igual nos quatro apps: não edite só aqui |
| `sw.js`, `manifest.webmanifest`, `icons/` | instalação e uso sem internet |
| `tests/` | testes do app, de acessibilidade e do leitor de prova, este com um PDF inventado (o do guia fica pulado enquanto o guia estiver desligado) |

## Modelo de dados

Tudo fica num objeto só (`estudofacil.db`, formato 3). Cada lista tem registros com `id`; a sincronização junta registro a registro.

| Lista | O que guarda |
|---|---|
| `concursos` | editais: situação (Estudando, Em espera ou Encerrado), previsto ou publicado, datas, prova (nota mínima e áreas com peso) e os vínculos `disc` (disciplina, área, itens, se está fora do plano e os assuntos cobrados) |
| `materias` e `topicos` | disciplinas e assuntos, **globais**; o assunto guarda quando a teoria foi concluída |
| `sessoes` | sessões de estudo: assunto, tipo (teoria, questões, revisão, lei seca), tempo, acertos, erros e o dia; nos treinos, também o bônus e o maior combo |
| `respostas` | uma por questão do app já respondida (`id` = o da questão): vezes, acertos, a última resposta e a caixa do flashcard (`cx`, `due`, `rv`); e uma por item de prova oficial marcado (`pv:<prova>:<item>`, com `v` e `cor`) |
| `cadernos` | andamento dos cadernos: as respostas dadas em cada um (`r`), por questão; o caderno de disciplina tem `id` `m:<disciplina>` e o montado guarda também o nome e a lista de questões (`itens`) |
| `textos` | texto das provas oficiais que já chegaram ao aparelho (`id` = o da prova): `itens` (número → enunciado) e `grupos` (a partir de qual item valem o comando e o texto de apoio). Só existe nos dados de quem usa |
| `redacoes` | textos do treino da discursiva (`id` = o do tema), com a data do envio ao instrutor |
| `revisoes` | revisões marcadas e feitas de cada assunto |
| `dias` | dias em que a meta foi batida (a sequência sai daqui) |
| `marcos` | medalhas já ganhas (`m:`), dias perfeitos (`p:`), desafios do dia feitos (`d:`) e marcas do app (`f:`) |
| `simulados` e `eventos` | resultados de simulados e compromissos da agenda |
| `cfg` e `ativa` | ajustes (nome, meta, dias de estudo, bloco, revisões, som, vibração, medalhas) e a sessão em andamento |

Regras:

- **peso** de uma disciplina: itens × peso da área, sobre o total da prova; com vários concursos em estudo, a média. Enquanto o edital é previsto, o fator `f1` puxa para a frente o que quase certamente cai;
- **plano do dia:** até 5 revisões vencidas e, depois, `meta ÷ bloco` blocos das disciplinas mais atrasadas em relação ao peso (estudo dos últimos 14 dias, até ontem);
- **domínio** do assunto: 0 Novo · 1 Começado · 2 Estudado (teoria concluída) · 3 Revisado (1 revisão, ou 10 questões com 70%) · 4 Dominado (todas as revisões, ou 2 revisões e 20 questões com 80%);
- **prontidão:** média do domínio dos assuntos, com o peso de cada disciplina;
- **sequência:** dias seguidos em `dias`; dia fora da rotina é neutro; a cada 7 dias seguidos entra uma folga (até 2), gasta sozinha num dia de falta;
- **treino:** primeiro os itens errados por último, depois os nunca respondidos, depois os mais antigos. Respondeu todas as questões de um assunto, ele fica grifado e as revisões entram;
- **provas oficiais:** a correção é por bloco; a nota é a líquida da banca (certo +1, errado −1, em branco e anulado 0) e cada bloco corrigido vira uma sessão de questões da disciplina;
- **integração:** a resposta dada em qualquer lugar (plano de hoje, treino, caderno) vale em todo caderno de fábrica que tem a questão: o da disciplina e, se for de prova, o da prova;
- **assunto da questão oficial:** o bloco da prova tem um assunto de partida e as palavras do comando e do item apontam o mais específico (`ASSUNTO_DO_BLOCO` e `REGRAS_ASSUNTO`, em `provas.js`); é automático e pode errar;
- **tempo:** cada segundo com a questão na tela soma no assunto dela (o relógio para quando o app sai da tela e não passa de 30 minutos por questão); o treino de um assunto segue pelos próximos assuntos da disciplina; todo tempo aparece em hh:mm:ss;
- **plano do dia e missões:** as questões do plano somam a meta de questões (50 por dia, de fábrica), em pelo menos duas disciplinas;
- **cadernos:** a resposta vale duas vezes: no caderno (o andamento, que pode ser zerado) e no histórico geral da questão (flashcards, estatísticas e medalhas, que ficam). "Refazer as erradas" tira do caderno as respostas erradas e volta nelas; ao sair, as questões respondidas viram uma sessão por assunto;
- **flashcards:** item errado entra na caixa 0 e volta no dia seguinte; "Lembrei" sobe de caixa (1, 3, 7, 15 e 30 dias) e "Não lembrei" volta para o começo;
- **pontos:** 1 por minuto, 1 por questão e mais 2 por acerto, 1 de bônus por acerto a partir do terceiro seguido, 20 pelo desafio do dia (mais 30 com 80% de acertos), 2 por flashcard revisto, 15 por revisão, 25 por assunto grifado, 30 por dia com a meta batida e 50 por medalha. Tudo sai dos dados, então acompanha a sincronização.

### A ponte das provas

O texto das provas não fica no repositório. O site da banca também não deixa o app buscar o PDF sozinho (bloqueio de
CORS). Por isso existe a ponte, operada pelo Claude no navegador do Bruno (Claude in Chrome), sem trabalho para ele:

1. abre-se uma página de `cdn.cebraspe.org.br` e, nela, carregam-se o pdf.js 3.11.174 e `instrutor/leitor-de-prova.js`;
2. `enviarProvaAoApp(pdfjsLib, id, endereço do caderno, primeiro item, último item)` lê o PDF e confere se achou todos os itens;
3. a página segue para o app com a prova no endereço (`#prova=...`, que não vai para servidor nenhum);
4. o app só aceita se a página anterior for o site da banca e se os itens baterem com o gabarito cadastrado em `provas.js`; então guarda em `textos`. Com a sincronização ligada, os outros aparelhos recebem.

**De um aparelho para outro:** com a sincronização ligada, o texto acompanha os dados. Sem ela, usa-se o **arquivo das
provas** (`estudo-facil-provas.json`): em Cadernos → Provas do Cebraspe, "Baixar arquivo das provas" no aparelho que já
tem as questões e "Abrir arquivo das provas" no outro. O arquivo fica com quem usa; não entra no repositório.

Itens anulados e itens que dependem de figura (sem texto) ficam fora dos cadernos. A leitura é automática: confira no
caderno oficial quando um item parecer truncado.

### Como o instrutor grava uma resposta

`instrutor/respostas.json` é um objeto: a chave é o `id` da questão (ou `pv:<prova>:<item>` para item de prova oficial,
`disc:<tema>` para a correção de uma discursiva, ou `geral`) e o valor, uma lista de
`{ "em": "16/11/2026", "p": "a dúvida, resumida", "r": "a resposta" }`. Só texto simples: o app protege tudo antes de
mostrar. O arquivo é público: não entra nome, e-mail nem nada pessoal.

## Exceções ao padrão

| Exceção | Por quê |
|---|---|
| Código dividido em vários `.js`, carregados com `?v=<versão>` | Regras do Estudo Fácil, Art. 5º (exceção já aprovada) |
| **Fase de testes fechada (desde a 1.1.0, provisória):** o app é de uso exclusivo do Bruno e só do concurso da ANPD; a página pede para não entrar em buscadores (`noindex`) e os outros apps não devem listá-lo em "Outros apps da família" | Decisão do Bruno em 16/11/2026. Exceção ao Código, Art. 10 (app feito para o mercado), e às Regras do Estudo Fácil, Art. 1º (controle de estudos geral). No futuro o app volta a ser publicado para o público geral. **Falta o registro no Painel do Integrador** (Art. 5º, III) e a mudança no Kit, que só o Integrador faz (proposta 0) |
| **Sem guia (desde a 1.3.0, provisória):** o guia sai da tela e a função nova (cadernos) não entra nele | Decisão do Bruno em 16/11/2026: na fase fechada o guia deixa o app extenso e não ajuda quem é o único usuário. Exceção ao Código, Arts. 77 a 80. Volta, refeito, quando o app for aberto ao público. **Falta o registro no Painel** |
| **Funções gerais fora da tela (desde a 1.3.0, provisória):** Concursos, Disciplinas, Simulados e Agenda; a barra de baixo passa a ser Hoje, Cadernos, Estudar, Medalhas e Mais | Mesma decisão. Diverge das Regras do Estudo Fácil, Arts. 6º a 9º, até o Integrador atualizar o texto (proposta 0, c). **Falta o registro no Painel** |

**Peças próprias do app** (não substituem peça do Kit; Código, Art. 72, § 4º): a medalha em 3D (`jogo.js`), o modo foco, o treino
de questões e a festa de fim de sessão, que são telas cheias de marca (Art. 68, § 4º). O que pode virar padrão está em
[PROPOSTA-PARA-O-INTEGRADOR.md](PROPOSTA-PARA-O-INTEGRADOR.md).

## Serviços externos e configuração

| Serviço | Para quê | Custo | O que configurar |
|---|---|---|---|
| GitHub (gist) | sincronização entre aparelhos | gratuito | nada no projeto; cada pessoa usa a própria conta |
| Firebase (projeto `conta-facil-2c1f9`, compartilhado pelo projeto) | receber as avaliações | plano gratuito | regra de [`comum/regras-firestore-feedback.txt`](comum/regras-firestore-feedback.txt) publicada |
| Cebraspe (`cdn.cebraspe.org.br`) | cadernos, gabaritos, enunciados e padrões de resposta, abertos por link | gratuito | nada; o app não baixa nem guarda os arquivos |
| Google Fonts, cdnjs | fontes (Atkinson Hyperlegible e Fraunces) e o QR code do apoio | gratuito | nada |

## Publicação

GitHub Pages a partir da branch `main`, pasta raiz. Antes de publicar: `npm run verificar` e os testes da parte que mudou
(o guia inteiro só roda quando a mudança mexe no guia). Confira o app no celular e no computador, no claro e no escuro.
Se o app abrir com erro no ar, desfaça o envio na hora (`git revert`) e só depois investigue.
O que mudou em cada versão está no [`CHANGELOG.md`](CHANGELOG.md).

## Uso do código

O código está público durante a fase de testes, sem licença de uso definida: todos os direitos reservados.
