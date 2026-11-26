# Estudo Fácil

Estudo para os concursos da ANPD (Especialista em Regulação de Proteção de Dados, banca Cebraspe: o foco) e do Cofen
(Analista Técnico, banca Instituto Quadrix), feito para estudar no caminho, pelo celular. O app **entrega a teoria em
capítulos**, diz qual é a próxima leitura, traz de volta o que foi lido em **cartões de conceito**, mostra a **lei seca**
de cada capítulo e mantém o hábito com a sequência de dias. **As questões são resolvidas fora do app, no Tec Concursos.**

Versão **1.15.0** · Kit Fácil 0.9.0 · app web em <https://brunodecastrosilva.github.io/estudo-facil/>

> **Fase de testes fechada (provisória).** Desde a 1.1.0 o app é de uso exclusivo do Bruno; desde a 1.13.0, voltado aos
> concursos da ANPD e do Cofen. Na 1.15.0 ele foi refeito no desenho combinado em 26/11/2026 ("estudo no ônibus"). No
> futuro volta a ser publicado para o público geral. Veja "Exceções ao padrão".

Faz parte do **Projeto Fácil** (Conta Fácil, Elétrica Fácil, Estudo Fácil e Guitarra Fácil) e segue o
[Código do Projeto Fácil](comum/CODIGO.md).

## O que o app faz

- **Hoje limpo:** a sequência de dias, a semana, **uma leitura sugerida e um botão**. Sem relógio, sem porcentagem e sem
  contagem regressiva. Uma data só aparece ali quando está a até 7 dias e pede uma ação (por exemplo, o fim da inscrição)
- **A unidade de estudo é o capítulo concluído**, não o tempo nem a questão. No fim de cada capítulo: **Entendi** ou
  **Quero reler depois** (que guarda o capítulo na fila, sem concluir); em seguida, a lei seca do capítulo, o próximo capítulo e um atalho que só abre o Tec Concursos. Na leitura há barrinha de progresso e escolha do tamanho da letra
- **A leitura continua de onde parou:** o app guarda, no aparelho, o ponto de cada capítulo em que a leitura ficou
- **Apostilas:** teoria do instrutor (Claude) para quem nunca viu o assunto, voltada à banca. O texto fica em
  `apostilas/<disciplina>.md`, um capítulo por assunto do edital (formato no cabeçalho de `apostilas.js`). Existem a de
  Língua Portuguesa (15 capítulos: 12 da ANPD e 3 só do Cofen), a de Direito Administrativo (16 capítulos: 12 assuntos da ANPD e 4 só do Cofen, em `mais`) e a da LGPD (19 capítulos)
- **Lei seca, sem travar a fila:** de cada capítulo concluído, uma dose só com os artigos daquele assunto, recortados do texto oficial
  (`DOSES`, em `leis.js`). O texto não muda: redações antigas e trechos riscados aparecem como no Planalto
- **Relembrar:** cartões de conceito (frente pergunta, verso responde; **Lembrei** ou **Não lembrei**), escritos junto
  com cada capítulo. Nascem quando o capítulo é concluído e voltam em 1, 3, 7, 15, 30 e 60 dias. Não são questões de
  banca. Cartão não lembrado: o app abre na hora **só o trecho** do capítulo que responde, e o cartão volta no dia
  seguinte. O capítulo inteiro só volta à fila quando **mais da metade** dos cartões dele está como "não lembrei"
- **Sequência:** o dia vale com um capítulo concluído **ou** com a revisão (uma rodada de cartões até o fim). Sábado e
  domingo são livres: não quebram a sequência e, com estudo, somam. A cada 7 dias seguidos entra uma folga (até 2)
- **Fila de leitura até 28/02/2027:** primeiro o que serve aos dois concursos (Português, Direito Administrativo,
  Constitucional e LGPD); depois contratos e o resto do Cofen; o que é só da ANPD, depois da prova do Cofen. Só entra na
  fila o assunto que já tem apostila
- **Edital = painel:** cobertura em porcentagem (assuntos concluídos sobre assuntos do edital), contagem regressiva de
  cada prova, as datas importantes e as disciplinas, assunto por assunto. É lá que os números ficam. O assunto estudado
  por outro material pode ser marcado à mão (não faz o dia valer)
- **Resumo semanal:** registro do que foi feito em cada semana (capítulos, cartões, doses de lei e dias), sem meta
- **Medalhas e níveis:** 30 medalhas em quatro metais, sobre o que o app mede: dias seguidos, capítulos concluídos,
  conceitos lembrados e disciplina fechada. Em 3D (WebGL), giram com o dedo. Dá para desligar nos Ajustes
- **Leis na íntegra** (em Mais): 24 normas dos editais com o texto compilado do Planalto, sem alteração
  (`leis/<id>.json`: `fonte`, `lido` e `p`, a lista de parágrafos, com `r` no que está revogado e `c` no que é
  centralizado), com sumário montado na hora
- **Discursiva:** três temas que o Cebraspe cobrou e três temas inéditos do instrutor; contagem de linhas, rascunho
  guardado, o que a banca espera e **envio do texto para correção** (o app copia o texto; a correção acontece na conversa
  do Claude e fica gravada em `instrutor/respostas.json`)
- **Abertura** na primeira vez; **use em vários aparelhos (opcional)**, com dados criptografados num gist secreto da
  sua conta GitHub; **avaliação e relato de problemas** pelo balão; **presente para o criador** (Pix, opcional)
- Tema claro, escuro ou automático; instalável; funciona sem internet depois da primeira visita

**Saíram de vez na 1.15.0:** cronômetro e modo foco, meta de tempo, meta de 50 questões, missões do dia, lançamento de
acertos e erros, plano do dia por blocos, revisões de 1, 7 e 30 dias (os cartões as substituem), a tela Evolução, a tela
Instrutor e as medalhas de horas, questões, acertos e simulados. O código das questões dentro do app (cadernos, treino,
flashcards e provas do Cebraspe), das telas gerais (Concursos, Disciplinas, Simulados e Agenda) e do guia também saiu do
repositório: está guardado no histórico, no commit `537c861` (versão 1.13.0). As ferramentas do levantamento de provas
continuam em `instrutor/`.

## Como usar

Abra o endereço em qualquer navegador, no celular, no tablet ou no computador. Para instalar:

- **iPhone:** no Safari, toque em **Compartilhar → Adicionar à Tela de Início**
- **Android:** no Chrome, menu **⋮ → Instalar app**
- **Computador:** ícone de instalar na barra de endereço do Chrome ou do Edge

## Onde ficam os dados

| Dado | Onde fica |
|---|---|
| Capítulos concluídos, cartões, dias de estudo, medalhas, textos da discursiva e ajustes | neste aparelho (armazenamento do navegador, chaves `estudofacil.*`) |
| O ponto em que cada leitura parou e as preferências (tema, mostrar o texto revogado) | só neste aparelho; não sincronizam |
| Os mesmos dados da primeira linha, com a sincronização ligada | gist secreto na conta GitHub do usuário, criptografado no aparelho (AES-256) |
| Discursivas enviadas para correção | o app só copia o texto; quem envia é a pessoa, no Claude. As correções gravadas ficam no repositório (`instrutor/respostas.json`), que é público: nada pessoal entra nelas |
| Avaliações e relatos de problema enviados | Firestore do projeto no Firebase (Google), coleção `feedback`; apagados depois de 2 anos |

**Quem vem da 1.13 (formato 3):** chegam ao formato novo o nome, os capítulos já concluídos, os dias da sequência e os
textos da discursiva. Sessões, tempo, medalhas antigas e respostas de questões não têm lugar no desenho novo e não são
trazidas (Código, Art. 32-A); a cópia do formato antigo fica guardada no aparelho, na chave `estudofacil.db_v3`, até uma
restauração de fábrica. O texto das provas guardado no IndexedDB do aparelho não é tocado.

## Para desenvolver

O app não tem etapa de build nem dependências: o que está no repositório é o que vai para o ar.
O Node (22 ou mais novo) só é usado para o servidor local, os testes e a verificação.

```bash
npm start                         # abre em http://localhost:8080/estudo-facil/
npm install                       # primeira vez: instala o Playwright e o axe, usados nos testes
npx playwright install chromium   # primeira vez (sem ele, os testes usam o Google Chrome instalado)
npm test                          # testes do Kit Fácil e do app, sem internet
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
| `editais.js` | a biblioteca: o plano da ANPD (edital previsto, banca Cebraspe) e o edital do Cofen (publicado, banca Instituto Quadrix), com os assuntos em comum ligados |
| `app.js` | motor: dados, fila de leitura, cartões, o dia e a sequência, pontos, cobertura do edital e sincronização |
| `jogo.js` | níveis, medalhas (séries em quatro metais, desenhadas e em 3D) e a festa do dia |
| `telas.js` | Hoje, Edital, a ficha do assunto, Medalhas, Resumo semanal e Mais |
| `apostilas.js` e `apostilas/` | a lista, o leitor do formato, a tela de cada capítulo, o fim do capítulo e a tela da dose de lei seca; o texto de cada apostila, em `.md`, com os cartões |
| `cartoes.js` | Relembrar: a ligação dos cartões com a apostila e a rodada de revisão |
| `leis.js` e `leis/` | as leis na íntegra: lista, sumário, leitura e o recorte da dose de cada capítulo |
| `discursiva.js` | os temas da discursiva, o texto e o envio para correção |
| `casca.js` | navegação, ações, Ajustes, abertura e arranque |
| `instrutor/caderno-da-banca.md` | o que o instrutor aprendeu sobre o jeito de a banca escrever; toda conversa que escreve material lê e melhora |
| `instrutor/respostas.json` | correções de discursiva gravadas pelo instrutor (chave `disc:<tema>`); o app lê ao abrir |
| `instrutor/levantamento.js` e `instrutor/leitor-de-prova.js` | ferramentas do levantamento de provas do Cebraspe (contagem do que cai). Não são carregadas pelo app |
| `comum/` | **Kit Fácil**: sincronização, avaliação, apoio, cópia de segurança, Ajustes, janelas e avisos. Igual nos quatro apps: não edite só aqui |
| `sw.js`, `manifest.webmanifest`, `icons/` | instalação e uso sem internet |
| `tests/` | testes do app, de acessibilidade e do leitor de prova (este, com um PDF inventado) |

## Modelo de dados

Tudo fica num objeto só (`estudofacil.db`, formato 4). Cada lista tem registros com `id`; a sincronização junta registro a registro.

| Lista | O que guarda |
|---|---|
| `concursos` | editais: previsto ou publicado, datas (`acao` marca a que pede uma ação), prova e os vínculos `disc` (disciplina, área, itens e os assuntos cobrados) |
| `materias` e `topicos` | disciplinas e assuntos, **globais**. No assunto: `teoria` (quando o capítulo foi concluído pela primeira vez), `lido` (última leitura), `reler` (pediu para reler depois), `volta` (voltou à fila pelos cartões) e `lei` (dose de lei seca lida) |
| `cartoes` | um por cartão já ativado (`id` = `<assunto>#<letra>`, a mesma letra da apostila): caixa (`cx`), quando volta (`due`), vezes lembrado (`ok`) e não lembrado (`no`) e a última resposta (`ult`) |
| `dias` | um por dia com estudo: capítulos (`cap`), cartões respondidos (`car`), doses de lei (`lei`) e se o dia vale para a sequência (`vale`) |
| `marcos` | medalhas já ganhas (`m:`) e marcas do app (`f:`) |
| `redacoes` | textos do treino da discursiva (`id` = o do tema), com a data do envio |
| `cfg` | ajustes: nome, dias de estudo (de fábrica, segunda a sexta), medalhas e vibração |

Regras:

- **o dia vale** quando um capítulo é lido até o fim no app (Entendi ou Quero reler depois) ou quando 5 cartões são
  respondidos no dia (`CARTOES_DO_DIA`; menos, se a rodada for menor). Marcar um assunto à mão no Edital não faz o dia valer;
- **sequência:** dias seguidos que valeram; dia fora da rotina é neutro (se houver estudo, soma); a cada 7 dias seguidos
  entra uma folga (até 2), gasta sozinha num dia de falta;
- **fila:** capítulos que voltaram pelos cartões; depois, na ordem dos assuntos, os capítulos não lidos; depois os
  guardados para reler (ainda não concluídos); por último, as doses de lei dos capítulos concluídos. Em Hoje, a dose
  aparece como segunda opção ("Lei seca, se quiser") e os cartões do dia vêm antes da leitura. Sem nada pendente, a leitura mais antiga volta como
  sugestão. O capítulo em que a leitura parou no meio vem antes de tudo;
- **ordem dos assuntos:** grupo (comum aos dois concursos, só Cofen, só ANPD), disciplina (`ORDEM_DISC`, em `app.js`) e
  a ordem do edital. Depois da prova de um concurso, o que só ele cobra vai para o fim;
- **cartões:** nascem com volta no dia seguinte; "Lembrei" sobe de caixa (3, 7, 15, 30 e 60 dias); "Não lembrei" volta
  para o começo (1 dia). A rodada tem até 15 cartões. A medalha nova espera o fim da rodada;
- **capítulo de volta à fila:** quando mais da metade dos cartões dele tem a última resposta "não lembrei". Reler o
  capítulo zera essa conta;
- **cobertura:** assuntos concluídos sobre assuntos do edital, sem peso;
- **pontos:** 30 por capítulo concluído, 3 por conceito lembrado, 10 por dose de lei seca, 20 por dia que valeu e 50 por
  medalha. Tudo sai dos dados, então acompanha a sincronização.

### Como escrever cartões

Na apostila, dentro do trecho (`###`) que responde: `? <letra> | pergunta :: resposta`. A letra é única no capítulo e
não muda depois de publicada (é o `id` do cartão nos dados de quem usa). O cartão pergunta um conceito, com as palavras
da apostila; não imita item de prova. Todo número é conferido no texto da lei em `leis/<id>.json`.

### Como o instrutor grava uma correção

`instrutor/respostas.json` é um objeto: a chave é `disc:<tema>` e o valor, uma lista de
`{ "em": "16/11/2026", "p": "o pedido, resumido", "r": "a correção" }`. Só texto simples: o app protege tudo antes de
mostrar. O arquivo é público: não entra nome, e-mail nem nada pessoal.

## Exceções ao padrão

| Exceção | Por quê |
|---|---|
| Código dividido em vários `.js`, carregados com `?v=<versão>` | Regras do Estudo Fácil, Art. 5º (exceção já aprovada) |
| **Fase de testes fechada (desde a 1.1.0, provisória):** o app é de uso exclusivo do Bruno e só dos concursos dele (ANPD e Cofen); a página pede para não entrar em buscadores (`noindex`) e os outros apps não devem listá-lo em "Outros apps da família" | Decisão do Bruno em 16/11/2026. Exceção ao Código, Art. 10 (app feito para o mercado), e às Regras do Estudo Fácil, Art. 1º (controle de estudos geral). No futuro o app volta a ser publicado para o público geral. Registrada no Painel do Integrador (Art. 5º, III) |
| **Sem guia (desde a 1.3.0, provisória)** | Decisão do Bruno em 16/11/2026: na fase fechada o guia deixa o app extenso e não ajuda quem é o único usuário. Exceção ao Código, Arts. 77 a 80. Volta, refeito, quando o app for aberto ao público. Registrada no Painel do Integrador |
| **Desenho "estudo no ônibus" (desde a 1.15.0):** a barra de baixo é Hoje, Apostilas, Estudar (a leitura sugerida), Relembrar e Mais; não há cadastro de editais nem de disciplinas; as guias próprias dos Ajustes são Rotina e Medalhas e apresentação | Escopo fechado com o Bruno em 26/11/2026. Diverge das Regras do Estudo Fácil, Arts. 6º a 10, até o texto das Regras ser atualizado (pendência para o Bruno e para o Painel do Integrador, D18) |

**Peças próprias do app** (não substituem peça do Kit; Código, Art. 72, § 4º): a medalha em 3D (`jogo.js`) e a festa do
dia, que é uma tela cheia de marca (Art. 68, § 4º).

## Serviços externos e configuração

| Serviço | Para quê | Custo | O que configurar |
|---|---|---|---|
| GitHub (gist) | sincronização entre aparelhos | gratuito | nada no projeto; cada pessoa usa a própria conta |
| Firebase (projeto `conta-facil-2c1f9`, compartilhado pelo projeto) | receber as avaliações | plano gratuito | regra de [`comum/regras-firestore-feedback.txt`](comum/regras-firestore-feedback.txt) publicada |
| Tec Concursos (`tecconcursos.com.br`) | resolver questões: o app só abre o site, em outra aba | por conta de quem usa | nada; o app não entra na conta, não automatiza o site e não copia nada de lá |
| Cebraspe (`cdn.cebraspe.org.br`) | enunciados e padrões de resposta da discursiva, abertos por link | gratuito | nada; o app não baixa nem guarda os arquivos |
| Google Fonts, cdnjs | fontes (Atkinson Hyperlegible e Fraunces) e o QR code do apoio | gratuito | nada |

## Publicação

GitHub Pages a partir da branch `main`, pasta raiz. Antes de publicar: `npm run verificar` e os testes da parte que mudou
Confira o app no celular e no computador, no claro e no escuro.
Se o app abrir com erro no ar, desfaça o envio na hora (`git revert`) e só depois investigue.
O que mudou em cada versão está no [`CHANGELOG.md`](CHANGELOG.md).

## Uso do código

O código está público durante a fase de testes, sem licença de uso definida: todos os direitos reservados.
