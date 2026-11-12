# Mudanças

Formato: versão, data e o que muda para quem usa. Versões no formato `maior.menor.correção`; enquanto a versão começar
com `0.`, o app está em fase de testes (rascunho).

## 0.4.0 · 2026-11-12

- **Guia completo ao vivo (Código, Arts. 77 e 78):** cada um dos 10 passos tem ação. A pessoa lê, toca em Mostrar e o app faz o passo na tela, trocando de tela pela barra de baixo (ou pelo "Mais"), como a pessoa faria. A demonstração usa uma cópia dos dados (ou o edital da ANPD, se o app estiver vazio) e não grava nada, nem na nuvem.
- **Plano começa pelo que mais vale:** as disciplinas avançam por igual; no empate, vai primeiro a que tem a maior fatia da nota. Antes, o desempate favorecia disciplinas com poucos assuntos (na ANPD, o plano começava por Microeconomia; agora começa pela LGPD).
- **Correção (Código, Art. 79):** com o guia aberto, o cronômetro em tela cheia ficava por cima do cartão do guia.

## 0.3.0 · 2026-11-12

- **Tela Hoje mais simples:** uma coluna só, com a contagem, o que estudar agora e o plano do dia. A meta de tempo fica dentro do plano. As próximas datas saem da tela (estão na Agenda) e os últimos 7 dias viram o link para o Desempenho.
- **Edital previsto da ANPD na biblioteca:** Especialista em Regulação de Proteção de Dados, com 12 disciplinas e 117 assuntos prováveis, pesos estimados, prova provisória em 18/04/2027 e um plano de estudos em três fases. Uma faixa avisa que o edital ainda não foi publicado.
- **Biblioteca com vários editais:** o app aceita mais de um edital pronto, com ou sem perfis.
- **Guia em dois níveis (Código, Art. 77):** Simplificado e Completo, no lugar de Essencial, Exploração e Completo.
- **Por dentro:** o `?v=` dos scripts volta a acompanhar a versão do app.

## 0.2.1 · 2026-11-11

- **Aviso rápido (Kit Fácil 0.5.0, Código 0.4):** o aviso com Desfazer não some enquanto tem o foco ou o ponteiro em cima; ao sair, a contagem recomeça.
- **Por dentro:** varredura automática de acessibilidade (WCAG 2.2 AA) e tela de 320 px nos testes.

## 0.2.0 · 2026-11-11

- **Janelas mais confortáveis (Kit Fácil 0.4.0, Código 0.3):** com o teclado aberto num campo de janela, no celular e no tablet, a janela fica acima do teclado; quando muda de lugar, desliza em 240 ms em vez de pular; o aviso rápido aparece acima dos botões do pé da janela aberta; a linha de apoio da janela vem abaixo do título.
- **Kit Fácil 0.4.0, peças novas para os próximos desenhos:** linha de adicionar no fim da lista, botão de fato (pago, feito) com Desfazer, item novo que a tela mostra e que pisca, carrossel de cartões, arrastar e soltar, texto só para leitor de tela e escala única de letras nas listas. Seções que abrem descontam o cabeçalho fixo do app.
- **Kit Fácil 0.2.0 e 0.3.0:** o app sai do Kit 0.1.0. No guia, o dedo fica na ponta direita dos campos de texto e o cartão não cobre a parte que a pessoa está conhecendo; o guia em vídeo do Kit fica disponível, mas o app continua com o guia em dois níveis.

## 0.1.0 · 2026-11-08

- **Recomeço da numeração:** o Estudo Fácil e o Kit Fácil recomeçam em 0.1.0, junto com o Código do Projeto Fácil 0.1 (rascunho). Tudo o que existia na 2.15.2 continua igual.
- **Segurança:** a política de segurança de conteúdo (CSP) não aceita mais script escrito dentro da página.
- **Kit Fácil 0.1.0:** teste das regras do Firestore no projeto de verdade (`npm run testar-regras`); verificação do padrão confere a CSP sem script dentro da página; Código e Anexos revisados (`comum/CODIGO.md` e `comum/ANEXOS.md`).
