# Proposta para o Integrador · Estudo Fácil 1.2.0 (16/11/2026)

O Estudo Fácil foi refeito do zero, na vez dele de seguir o Conta Fácil (Código, Art. 93, § 2º). O que segue precisa de
decisão no Integrador (Código, Art. 7º). Nada aqui foi alterado na pasta `comum/`.

## 0. Fase de testes fechada do Estudo Fácil (1.1.0, 16/11/2026)

Decisão do Bruno: por enquanto, o Estudo Fácil é de uso exclusivo dele e só do concurso da ANPD. É provisório; no
futuro o app volta a ser publicado para o público geral.

**a) Exceção a registrar no Painel** (Código, Art. 5º, III): exceção ao Art. 10 do Código e ao Art. 1º das Regras do
Estudo Fácil. No README e no CHANGELOG do app ela já está registrada.

**b) Kit Fácil: tirar o Estudo Fácil de "Outros apps da família" nos outros apps.** A lista sai de `FAMILIA`, em
`comum/kit-facil.js`, que também serve para os prefixos de armazenamento e para a chave de sincronização; por isso a
entrada não pode ser apagada. Proposta: uma marca `fechado: true` na entrada do Estudo Fácil e, na função que monta a
lista de *Sobre o aplicativo*, `FAMILIA.filter(f => f.app !== C.app && !f.fechado)`. Sobe a versão do Kit e a pasta
`comum/` é copiada para os quatro repositórios (Art. 30).

**Impacto:** Conta Fácil, Elétrica Fácil e Guitarra Fácil deixam de mostrar o Estudo Fácil em *Sobre o aplicativo*. No
Estudo Fácil nada muda. Para desfazer no futuro, basta tirar a marca.

**c) Regras do Estudo Fácil** (instruções do Projeto no claude.ai), texto proposto para esta fase:

- **Art. 1º** O Estudo Fácil é, nesta fase de testes fechada, o app de estudos do Bruno para o concurso da ANPD (Especialista em Regulação de Proteção de Dados, banca Cebraspe). **§ 1º** A fase fechada é provisória: no futuro o app volta a ser um controle de estudos geral, para o público. **§ 2º** Enquanto durar, os outros apps da família não o listam.
- **Art. 6º** A barra de baixo tem Hoje, Plano, Estudar (botão redondo, no centro), Medalhas e "Mais" (Evolução, Instrutor, Flashcards, Concursos, Disciplinas, Revisões, Simulados, Agenda, o guia e os Ajustes). **Parágrafo único.** Com as medalhas desligadas, a Evolução ocupa o lugar de Medalhas.
- **Art. 8º** O plano da ANPD vem de fábrica; outros concursos entram digitados, com o conteúdo programático colado.
- **Art. 14 (novo).** O estudo é por questões, e o material nasce das provas oficiais: primeiro se levantam as provas da banca no site do Cebraspe, depois se escrevem as questões, os comentários e as apostilas, seguindo o `instrutor/caderno-da-banca.md`. **§ 1º** Das provas oficiais ficam no repositório o endereço, o gabarito definitivo, os blocos por disciplina e o comentário do instrutor; o texto da prova, não. **§ 2º** Conteúdo de sites de questões não entra.
- **Art. 6º, complemento.** Em "Mais" entram também Provas do Cebraspe e Discursiva.
- **Art. 15 (novo).** O instrutor é o Claude, no Projeto Estudo Fácil: o app copia a dúvida, a resposta sai na conversa e fica gravada em `instrutor/respostas.json`, sem nada pessoal.

## 1. Anexo I: identidade do Estudo Fácil

| Item | Hoje no Anexo I | Proposta |
|---|---|---|
| Fonte dos títulos | Atkinson | **Fraunces** (SIL OFL), só nos títulos, na marca e nos números grandes (Art. 56, IV) |
| Cor de começar (Art. 66, II) | a escolher | **verde-limão do marca-texto `#DFF65C`**, com texto `#131A3A` |
| Cor do foco | não consta | rosa de marca-texto `#E0368C` (claro) e `#FF6DB1` (escuro), 3:1 sobre o papel e sobre a barra de baixo |
| Guias próprias nos Ajustes | Rotina e metas · Revisões | Rotina e metas · Revisões · **Medalhas e apresentação** |
| Navegação (desde a 1.1.0) | Hoje · Editais · Estudar · Agenda · Mais | Hoje · Plano · Estudar · **Medalhas** · Mais |
| Extras nas guias comuns | Notificações e Privacidade | os mesmos, mais **Conta e perfil: "Você no app"** (o nome) |
| Estrutura (Anexo II) | `index.html` com vários `.js` | `estilo.css` à parte, como no Conta Fácil |

**Impacto nos outros apps:** nenhum.

## 2. Regras do Estudo Fácil (instruções do Projeto no claude.ai)

Os artigos 6º, 7º, 8º, 10 e 11 descrevem o app antigo. Texto proposto:

- **Art. 6º** (ver o texto novo no item 0, c.)
- **Art. 7º** Na primeira vez, o app mostra a abertura de quatro telas (Código, Art. 75) e já vem com o plano da ANPD instalado; a rotina começa com o padrão (todos os dias, 1 hora por dia) e se ajusta em *Ajustes → Rotina e metas*.
- **Art. 8º** (ver o texto novo no item 0, c.)
- **Art. 10.** Nos Ajustes, as guias próprias são Rotina e metas · Revisões · Medalhas e apresentação; os extras são o nome (Conta e perfil), o som e a vibração do fim do tempo (Notificações) e apagar todos os dados, inclusive na nuvem (Privacidade e segurança).
- **Art. 11.** (Revogado: o leitor de PDF saiu na 1.0.0.)
- **Art. 12 (novo).** O edital da biblioteca marcado como previsto mostra sempre o que é estimativa (banca, itens, pesos e data da prova) e a data em que a situação foi conferida.
- **Art. 13 (novo).** Pontos, níveis e medalhas saem dos dados de estudo e reconhecem constância, revisão e acerto; nada premia virar a noite. Dá para desligar nos Ajustes.

## 3. Kit Fácil: objetos em 3D com a malha do app

O `comum/kit-jogo.js` só desenha a tampinha e o presente. A medalha do Estudo Fácil precisou de um motor próprio
(`jogo.js`, cerca de 90 linhas de WebGL), igual no giro, na inércia, nas setas e no movimento reduzido.

**Proposta:** `KitFacil.jogo.girar` aceitar uma cena do app (`{ malha, textura, cores }`), para os outros apps terem os
seus objetos (palheta no Guitarra, disjuntor no Elétrica) sem repetir o motor. **Impacto:** nenhum app muda; o Estudo
Fácil troca o motor próprio pelo do Kit.

## 4. Kit Fácil: peças que nasceram aqui e servem aos outros (Art. 29)

| Peça | Onde está | Serve para |
|---|---|---|
| Anel de progresso (`anelHTML`) e barra de progresso com contorno (`.barra`) | `telas.js`, `estilo.css` | metas e níveis em qualquer app |
| Lista de resumo rótulo e valor (`dl.resumo`) | `estilo.css` | Art. 65, V; hoje cada app tem a sua |
| Seções abertas que continuam abertas depois de redesenhar (`data-chave`) | `casca.js` | toda tela com `<details data-kf-secao>` |
| Tela cheia de marca com foco preso e Esc (modo foco e festa) | `estudar.js`, `jogo.js` | Art. 68, § 4º; hoje cada app escreve a sua |
| Dia fixo nos testes (`?hoje=`, só em endereço local) | `app.js` | testes de qualquer app com datas |

## 5. Verificação do padrão

`comum/testes/acessibilidade.test.mjs` procura os Ajustes na barra antiga. Como no Conta Fácil, este app usa o seu
(`tests/acessibilidade.test.mjs`) e o `npm test` não roda o comum. **Proposta:** o teste comum abrir os Ajustes pela
tela Mais quando a navegação é a do Kit 0.7.0.
