# Proposta para o Integrador · Estudo Fácil 1.0.0 (15/11/2026)

O Estudo Fácil foi refeito do zero, na vez dele de seguir o Conta Fácil (Código, Art. 93, § 2º). O que segue precisa de
decisão no Integrador (Código, Art. 7º). Nada aqui foi alterado na pasta `comum/`.

## 1. Anexo I: identidade do Estudo Fácil

| Item | Hoje no Anexo I | Proposta |
|---|---|---|
| Fonte dos títulos | Atkinson | **Fraunces** (SIL OFL), só nos títulos, na marca e nos números grandes (Art. 56, IV) |
| Cor de começar (Art. 66, II) | a escolher | **verde-limão do marca-texto `#DFF65C`**, com texto `#131A3A` |
| Cor do foco | não consta | rosa de marca-texto `#E0368C` (claro) e `#FF6DB1` (escuro), 3:1 sobre o papel e sobre a barra de baixo |
| Guias próprias nos Ajustes | Rotina e metas · Revisões | Rotina e metas · Revisões · **Medalhas e apresentação** |
| Extras nas guias comuns | Notificações e Privacidade | os mesmos, mais **Conta e perfil: "Você no app"** (o nome) |
| Estrutura (Anexo II) | `index.html` com vários `.js` | `estilo.css` à parte, como no Conta Fácil |

**Impacto nos outros apps:** nenhum.

## 2. Regras do Estudo Fácil (instruções do Projeto no claude.ai)

Os artigos 6º, 7º, 8º, 10 e 11 descrevem o app antigo. Texto proposto:

- **Art. 6º** A barra de baixo tem Hoje, Plano, Estudar (botão redondo, no centro), Evolução e "Mais" (Concursos, Disciplinas, Revisões, Simulados, Agenda, o guia e os Ajustes). **Parágrafo único.** No computador, o trilho mostra todas as seções.
- **Art. 7º** Na primeira vez, o app mostra a abertura de quatro telas (Código, Art. 75) e já vem com o plano da ANPD instalado; a rotina começa com o padrão (todos os dias, 1 hora por dia) e se ajusta em *Ajustes → Rotina e metas*.
- **Art. 8º** Os editais entram de dois jeitos: prontos da biblioteca ou digitados, com o conteúdo programático colado.
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
