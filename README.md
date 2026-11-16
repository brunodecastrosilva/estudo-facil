# Estudo Fácil

Plano de estudos para concursos, no celular e no computador: o app diz o que estudar hoje, marca o tempo, lembra das
revisões e mostra a sua evolução, com sequência de dias, missões e medalhas.

Versão **1.0.0** · Kit Fácil 0.9.0 · app web em <https://brunodecastrosilva.github.io/estudo-facil/>

Faz parte do **Projeto Fácil** (Conta Fácil, Elétrica Fácil, Estudo Fácil e Guitarra Fácil) e segue o
[Código do Projeto Fácil](comum/CODIGO.md). Na versão 1.0.0 o app foi refeito do zero, seguindo o Conta Fácil, que é a
referência do projeto (Art. 93).

## O que o app faz

- **Hoje:** a sequência de dias, a meta do dia, as três missões e o plano de hoje, com o próximo assunto a um toque
- **Plano de fábrica para a ANPD** (Especialista em Regulação de Proteção de Dados): 12 disciplinas, 119 assuntos, pesos, três fases até a prova, semana modelo e fontes oficiais. O edital ainda não saiu: o que é estimativa está marcado como estimativa
- **Plano do dia:** revisões vencidas primeiro; depois, blocos das disciplinas mais atrasadas em relação ao peso na prova
- **Modo foco:** cronômetro em tela cheia, com acertos e erros; dá para recolher sem parar o tempo
- **O edital vira caderno:** cada assunto estudado fica grifado; a prontidão para a prova sobe com o que você domina
- **Revisões** em 1, 7 e 30 dias depois da teoria (ou os dias que você escolher)
- **Sequência e folgas:** dias seguidos com a meta batida; a folga guardada salva um dia de falta
- **Pontos, níveis e medalhas em 3D** (WebGL), que giram com o dedo; dá para desligar nos Ajustes
- **Evolução:** prontidão, constância, horas por semana, acertos por disciplina e totais
- **Concursos:** vários ao mesmo tempo, da biblioteca (ANPD e ABDI 2026) ou digitados com o conteúdo programático colado
- **Disciplinas e assuntos globais:** o que você estuda num assunto conta em todos os concursos que o cobram
- **Simulados** com a nota pela regra da prova, e **Agenda** com as datas do edital e os seus compromissos
- **Abertura** na primeira vez e **guia** que faz cada passo na tela, numa demonstração que não grava nada
- **Use em vários aparelhos (opcional):** dados sincronizados, criptografados, num gist secreto da sua conta GitHub
- **Avaliação e relato de problemas** pelo balão no alto da tela; **presente para o criador** (Pix, opcional)
- Tema claro, escuro ou automático; instalável; funciona sem internet depois da primeira visita

## Como usar

Abra o endereço em qualquer navegador, no celular, no tablet ou no computador. Para instalar:

- **iPhone:** no Safari, toque em **Compartilhar → Adicionar à Tela de Início**
- **Android:** no Chrome, menu **⋮ → Instalar app**
- **Computador:** ícone de instalar na barra de endereço do Chrome ou do Edge

## Onde ficam os dados

| Dado | Onde fica |
|---|---|
| Concursos, disciplinas, sessões, revisões, dias com a meta batida, medalhas, simulados, agenda e ajustes | neste aparelho (armazenamento do navegador, chaves `estudofacil.*`) |
| Os mesmos dados, com a sincronização ligada | gist secreto na conta GitHub do usuário, criptografado no aparelho (AES-256) |
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
npm test                          # testes do Kit Fácil e do app, sem internet (inclui o guia inteiro, uns 4 minutos)
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
| `editais.js` | a biblioteca: o plano da ANPD (previsto) e o edital da ABDI 2026 |
| `app.js` | motor: dados, plano do dia, sequência, pontos, domínio, revisões e sincronização |
| `jogo.js` | níveis, medalhas (desenhadas e em 3D) e a festa de fim de sessão |
| `estudar.js` | escolher o que estudar, modo foco, fechar a sessão, lançar estudo feito e a ficha do assunto |
| `telas.js` | Hoje, Plano, Evolução, Mais, Concursos, Disciplinas, Revisões, Simulados e Agenda |
| `casca.js` | navegação, Ajustes, abertura, guia e arranque |
| `comum/` | **Kit Fácil**: sincronização, avaliação, apoio, cópia de segurança, Ajustes, janelas e avisos. Igual nos quatro apps: não edite só aqui |
| `sw.js`, `manifest.webmanifest`, `icons/` | instalação e uso sem internet |
| `tests/` | testes do app, do guia e de acessibilidade |

## Modelo de dados

Tudo fica num objeto só (`estudofacil.db`, formato 3). Cada lista tem registros com `id`; a sincronização junta registro a registro.

| Lista | O que guarda |
|---|---|
| `concursos` | editais: situação (Estudando, Em espera ou Encerrado), previsto ou publicado, datas, prova (nota mínima e áreas com peso) e os vínculos `disc` (disciplina, área, itens, se está fora do plano e os assuntos cobrados) |
| `materias` e `topicos` | disciplinas e assuntos, **globais**; o assunto guarda quando a teoria foi concluída |
| `sessoes` | sessões de estudo: assunto, tipo (teoria, questões, revisão, lei seca), tempo, acertos, erros e o dia |
| `revisoes` | revisões marcadas e feitas de cada assunto |
| `dias` | dias em que a meta foi batida (a sequência sai daqui) |
| `marcos` | medalhas já ganhas, dias perfeitos e marcas do app (guia visto) |
| `simulados` e `eventos` | resultados de simulados e compromissos da agenda |
| `cfg` e `ativa` | ajustes (nome, meta, dias de estudo, bloco, revisões, som, vibração, medalhas) e a sessão em andamento |

Regras:

- **peso** de uma disciplina: itens × peso da área, sobre o total da prova; com vários concursos em estudo, a média. Enquanto o edital é previsto, o fator `f1` puxa para a frente o que quase certamente cai;
- **plano do dia:** até 5 revisões vencidas e, depois, `meta ÷ bloco` blocos das disciplinas mais atrasadas em relação ao peso (estudo dos últimos 14 dias, até ontem);
- **domínio** do assunto: 0 Novo · 1 Começado · 2 Estudado (teoria concluída) · 3 Revisado (1 revisão, ou 10 questões com 70%) · 4 Dominado (todas as revisões, ou 2 revisões e 20 questões com 80%);
- **prontidão:** média do domínio dos assuntos, com o peso de cada disciplina;
- **sequência:** dias seguidos em `dias`; dia fora da rotina é neutro; a cada 7 dias seguidos entra uma folga (até 2), gasta sozinha num dia de falta;
- **pontos:** 1 por minuto, 1 por questão e mais 1 por acerto, 15 por revisão, 25 por assunto com teoria, 30 por dia com a meta batida e 50 por medalha. Tudo sai dos dados, então acompanha a sincronização.

## Exceções ao padrão

| Exceção | Por quê |
|---|---|
| Código dividido em vários `.js`, carregados com `?v=<versão>` | Regras do Estudo Fácil, Art. 5º (exceção já aprovada) |

**Peças próprias do app** (não substituem peça do Kit; Código, Art. 72, § 4º): a medalha em 3D (`jogo.js`), o modo foco e a festa
de fim de sessão, que são telas cheias de marca (Art. 68, § 4º). O que pode virar padrão está em
[PROPOSTA-PARA-O-INTEGRADOR.md](PROPOSTA-PARA-O-INTEGRADOR.md).

## Serviços externos e configuração

| Serviço | Para quê | Custo | O que configurar |
|---|---|---|---|
| GitHub (gist) | sincronização entre aparelhos | gratuito | nada no projeto; cada pessoa usa a própria conta |
| Firebase (projeto `conta-facil-2c1f9`, compartilhado pelo projeto) | receber as avaliações | plano gratuito | regra de [`comum/regras-firestore-feedback.txt`](comum/regras-firestore-feedback.txt) publicada |
| Google Fonts, cdnjs | fontes (Atkinson Hyperlegible e Fraunces) e o QR code do apoio | gratuito | nada |

## Publicação

GitHub Pages a partir da branch `main`, pasta raiz. Antes de publicar: `npm run verificar` e os testes da parte que mudou
(o guia inteiro só roda quando a mudança mexe no guia). Confira o app no celular e no computador, no claro e no escuro.
Se o app abrir com erro no ar, desfaça o envio na hora (`git revert`) e só depois investigue.
O que mudou em cada versão está no [`CHANGELOG.md`](CHANGELOG.md).

## Uso do código

O código está público durante a fase de testes, sem licença de uso definida: todos os direitos reservados.
