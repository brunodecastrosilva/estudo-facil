# Mudanças

Formato: versão, data e o que muda para quem usa. Versões no formato `maior.menor.correção`; enquanto a versão começar
com `0.`, o app está em fase de testes (rascunho).

## 0.7.0 · 2026-11-15

- **Kit Fácil 0.8.0 (Código 0.8, Proposta 3 do Conta Fácil):** para quem usa este app, muda:
  - **Puxar a janela:** no celular e no tablet, a janela tem uma barrinha no alto; puxe pelo cabeçalho para fechar, ou solte antes e ela volta. Arrastar no meio da janela não move mais a página por trás. O X e o Esc continuam.
  - **Teclado:** com o teclado aberto, o pé da janela se recolhe (nenhum botão sobe para cima dele) e o cursor só aparece com a janela parada.
  - **Excluir em vermelho:** os botões de perigo do Kit (como Restaurar padrões de fábrica e Desconectar) e toda confirmação que exclui, remove ou apaga são cheios e vermelhos, com texto branco. No modo escuro, antes o contraste era perto de 2,5:1; agora é 5,9:1.
  - **Janela que fecha:** com lista de escolha, data ou hora, a janela não dá mais um pulo para cima antes de descer.
  - **Avaliação:** em Relatar um problema, sem descrição o campo fica marcado, sem abrir o teclado sozinho.
- **Ainda não muda (a vez deste app, Art. 93, § 2º):** focos automáticos próprios do app em caixas de texto e botões de excluir próprios do app que não usam o Kit.

## 0.6.0 · 2026-11-15

- **Kit Fácil 0.7.0 (Código 0.7, Art. 93):** o Kit trouxe as peças do Conta Fácil. Para quem usa este app, muda:
  - **um relógio só:** tudo o que o Kit abre ou fecha dura 600 ms, na mesma curva (janelas, fundo escuro, seções, listas de escolha, calendário, relógio, avisos, troca de tela e de guia);
  - **janelas:** um mecanismo só para nascer, acompanhar o teclado, mudar de altura e trocar de janela; a janela que fecha desce pelo pé da tela e o fundo clareia junto; nenhuma janela abre com a caixa de texto selecionada;
  - **presente:** na barra de cima, o ícone de traço, da cor da nuvem e do balão (antes, o presente colorido que girava); a janela do apoio mostra o presente em 3D, que gira com o dedo, nas cores do app, e diz "É opcional: o Estudo Fácil continua igual para todos, com presente ou sem.";
  - **medidas:** cantos um pouco maiores (botões e campos 14 px, cartões 20 px, janelas 28 px) e barra de baixo mais baixa (54 px).
- **Contraste:** no cartão azul da tela Hoje, o link "Ajustar a rotina" estava azul sobre azul (contraste 1,2:1). Agora tem a cor do texto do cartão e fica sublinhado.
- **Ainda não muda (Art. 93, § 2º):** a navegação, o guia em níveis, a apresentação e o resto do desenho continuam os de antes até a vez deste app seguir o Conta Fácil (D14). A verificação do padrão avisa disso.

## 0.5.0 · 2026-11-12

- **Presente no lugar do chopp (Kit Fácil 0.6.0, Código 0.5):** o convite de apoio agora é "Gostando do app? Mande um presente para o criador!". O ícone é um presente colorido, em 3D, que dá uma volta quando o app abre e ao ser tocado; quem pede menos movimento no aparelho vê o presente parado. A janela do Pix e *Sobre o aplicativo* mostram o presente maior, com papel de bolinhas e laço.

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
