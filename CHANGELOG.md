# Mudanças

Formato: versão, data e o que muda para quem usa. Versões no formato `maior.menor.correção`; enquanto a versão começar
com `0.`, o app está em fase de testes (rascunho).

## 1.7.3 · 2026-11-16

- **Texto de apoio:** abre inteiro, sem rolagem dentro da caixa. Fica logo abaixo do enunciado, que continua no alto da tela.
- **Botões de resposta:** acompanham a rolagem; Certo e Errado ficam sempre à mão.
- **Testes pulados nesta versão:** os testes do Kit e o do guia (desligado). Rodaram a verificação do padrão, os testes do app e a varredura de acessibilidade.

## 1.7.2 · 2026-11-16

- **Correção:** com o texto de apoio aberto, a tela da questão não rolava e o enunciado ficava cortado. Agora rola, e o enunciado aparece inteiro.
- **Testes pulados nesta versão:** os testes do Kit e o do guia (desligado). Rodaram a verificação do padrão, os testes do app e a varredura de acessibilidade.

## 1.7.1 · 2026-11-16

- **Plano de hoje:** quando uma disciplina tem menos questões que a sua parte da meta, as outras disciplinas do plano completam as 50.
- **Testes pulados nesta versão:** os testes do Kit e o do guia (desligado). Rodaram a verificação do padrão, os 23 testes do app e a varredura de acessibilidade.

## 1.7.0 · 2026-11-16

O app passa a funcionar como uma coisa só: plano, cadernos, provas, tempo e edital conversam.

- **Cadernos integrados:** a questão resolvida no plano de hoje, num treino ou em outro caderno aparece resolvida em todo caderno que a contém. O que você já tinha respondido entrou junto.
- **Cada questão de prova tem o seu assunto:** além da disciplina, a questão oficial é ligada ao assunto do edital. A ligação é automática, pelo comando e pelas palavras do item, e pode errar.
- **Tempo por questão:** cada segundo com a questão na tela soma no assunto dela e na meta do dia, mesmo sem responder. O relógio para quando o app sai da tela.
- **O treino não acaba no assunto:** esgotadas as questões, ele segue no próximo assunto da disciplina.
- **Meta de 50 questões por dia** (dá para mudar em Ajustes → Rotina e metas).
- **Plano de hoje do tamanho das missões:** as questões do plano somam a meta do dia, em pelo menos duas disciplinas.
- **Tempo em hh:mm:ss** em todo o app.
- **Texto de apoio:** rola dentro da própria caixa; aberto, não esconde mais o enunciado.
- **Selo "Feita por IA"** nas questões escritas pelo instrutor. As de prova mostram a banca, a prova e o item.
- **Saiu** a "Aula do assunto".
- **Ainda não entrou:** as leis na íntegra dentro do app e o tempo de leitura de PDF (dependem de trazer os textos oficiais do Planalto).
- **Testes pulados nesta versão:** os testes do Kit e o do guia (desligado). Rodaram a verificação do padrão, os 23 testes do app, os 2 do leitor de prova e a varredura de acessibilidade.

## 1.6.0 · 2026-11-16

- **Três provas novas do Cebraspe:** ANTT 2024, conhecimentos básicos (todos os cargos) e específicos do cargo 1 (qualquer área) e do cargo 2 (Direito), com gabarito definitivo.
- **Mais 124 questões oficiais do seu edital:** Português, regulação, Administrativo, Constitucional, ética e LAI, concorrência, consumidor, crimes cibernéticos, Marco Civil, LGPD e inteligência artificial. São 259 no total.
- **Para resolvê-las no app:** abra o arquivo das provas atualizado, em Cadernos → Provas do Cebraspe.
- **Sem comentário, por enquanto:** os itens da ANTT mostram só o gabarito oficial.
- **Leitor de prova:** aceita cadernos com os itens mais espaçados que o texto de apoio, como os da ANTT.
- **Testes pulados nesta versão:** os testes do Kit e o do guia (desligado). Rodaram a verificação do padrão, os testes do app, os 2 do leitor de prova e a varredura de acessibilidade.

## 1.5.0 · 2026-11-16

- **Arquivo das provas:** leva as questões oficiais de um aparelho para outro, sem sincronização e sem passar pelo repositório.
- **Como usar:** em Cadernos → Provas do Cebraspe, toque em "Baixar arquivo das provas" no aparelho que já tem as questões. No outro, toque em "Abrir arquivo das provas" e escolha o arquivo.
- **Conferência:** o app só aceita prova cadastrada, com todos os itens do gabarito. O seu andamento não muda.
- **Testes pulados nesta versão:** os testes do Kit e o do guia (desligado). Rodaram a verificação do padrão, os 23 testes do app, os 2 do leitor de prova e a varredura de acessibilidade.

## 1.4.0 · 2026-11-16

As questões oficiais do Cebraspe passam a ser resolvidas dentro do app.

- **Provas viram cadernos:** em Cadernos, a seção Provas do Cebraspe traz um caderno por prova, só com os itens do seu edital.
- **Como na prova:** cada item aparece com o comando e, quando há, o texto de apoio. Depois da resposta vêm o gabarito definitivo e o comentário do instrutor, quando existe.
- **Por disciplina também:** o caderno da disciplina ganha as questões de prova, depois das questões do app.
- **Erros viram flashcard**, e as questões oficiais entram nos atalhos e nos cadernos que você monta.
- **Onde fica o texto:** só nos seus dados (e na sua sincronização criptografada). Não vai para o repositório do app.
- **Como chega:** pela ponte. O Claude lê o PDF oficial no seu navegador, numa página do site da banca, e entrega ao app. Você não precisa fazer nada.
- **Ficam de fora** os itens anulados e os que dependem de figura.
- **Testes pulados nesta versão:** os testes do Kit (a pasta `comum/` não mudou) e o do guia (desligado). Rodaram a verificação do padrão, os 23 testes do app, os 2 do leitor de prova e a varredura de acessibilidade.

## 1.3.0 · 2026-11-16

O app fica mais enxuto e passa a girar em torno de **cadernos de questões**, com todas as questões escritas dentro dele.

- **Cadernos de questões:** a tela nova, na barra de baixo. Há um caderno por disciplina, com as questões agrupadas por assunto.
- **Andamento próprio:** cada caderno lembra onde você parou. Dá para abrir qualquer questão pelo número, refazer só as erradas ou zerar as respostas.
- **Atalhos:** só as que errei, nunca resolvidas e o desafio do dia.
- **Meus cadernos:** monte o seu, escolhendo as disciplinas, o filtro e o tamanho.
- **Banco de questões:** de 63 para 220, agora nas doze disciplinas do plano. Todas escritas no app, com gabarito, comentário, fundamento e aula curta do assunto. Não são questões de prova.
- **App mais enxuto:** saíram da tela Concursos, Disciplinas, Simulados, Agenda e o guia. Voltam quando o app for aberto ao público.
- **Barra de baixo:** Hoje, Cadernos, Estudar, Medalhas e Mais. O edital foi para Mais.
- **Tela Hoje:** mostra o caderno em andamento, para continuar com um toque.
- **Medalhas:** duas novas, Caderno fechado e Caderno sob medida. A do guia fica guardada. São 111.
- **Correção:** a janela de medalha nova não abre mais por cima do treino; espera você sair.
- **Exceções registradas** (provisórias, no README): app sem guia (Código, Arts. 77 a 80) e funções gerais fora da tela.
- **Testes pulados nesta versão:** os testes do Kit (a pasta `comum/` não mudou) e o teste do guia (o guia está desligado). Rodaram a verificação do padrão, os 22 testes do app e a varredura de acessibilidade (WCAG 2.2 AA), no claro e no escuro.

## 1.2.0 · 2026-11-16

O material do app passa a nascer das provas oficiais da banca: primeiro as provas, depois as questões e as apostilas.

- **Provas do Cebraspe:** quatro cadernos oficiais com gabarito definitivo: ANATEL 2024 e ANAC 2024 (conhecimentos básicos de especialista em regulação), ANM 2025 (conhecimentos gerais) e DATAPREV 2023 (segurança da informação e proteção de dados). São 220 itens; 140 servem para o edital da ANPD.
- **Só o que é do seu edital:** cada prova mostra os blocos que servem para a ANPD (Português, Inglês, regulação, Administrativo, Constitucional, ética, LGPD, direito digital e segurança) e lista à parte o que ficou de fora.
- **Folha de respostas:** o caderno abre no site do Cebraspe; no app você marca certo ou errado e corrige o bloco. A nota é a líquida da banca: errado desconta um ponto.
- **Comentário do instrutor** em 73 itens, com a base legal. Em qualquer item dá para perguntar ao instrutor.
- **Como a banca escreve:** sete armadilhas que se repetiram nessas provas, na tela Provas.
- **Discursiva:** três temas que o Cebraspe cobrou (LGPD na ANM, sandbox com IA na ANTT e requisição de dados na ANATEL) e três temas inéditos do instrutor para a ANPD. Cada tema tem os tópicos com pontuação, o que a banca espera e envio do texto para correção.
- **Seis itens novos de LGPD** no banco do app, feitos a partir das armadilhas vistas nas provas. São 63 itens.
- **Medalhas:** duas séries novas, Prova real e Redator. São 110 medalhas.
- **O que não entra:** o texto das provas não é copiado para o app. Ficam o endereço oficial, o gabarito e o comentário.
- **Ainda não entrou:** a prova da ANTT 2024, porque o gabarito definitivo não apareceu em endereço oficial alcançável.
- **Guia:** 27 passos; os novos mostram as provas e a discursiva.
- **Testes pulados nesta versão:** os testes do Kit (a pasta `comum/` não mudou). Rodaram a verificação do padrão, os 21 testes do app, o guia inteiro e a varredura de acessibilidade (WCAG 2.2 AA), no claro e no escuro.

## 1.1.0 · 2026-11-16

Começa a **fase de testes fechada**: o app passa a ser de uso exclusivo do Bruno e todo voltado ao concurso da ANPD
(exceção provisória ao Código, Art. 10, registrada no README).

- **Treino de questões no estilo Cebraspe:** itens de certo ou errado, um por vez, em tela cheia. Depois da resposta vêm o gabarito, o comentário, o fundamento legal e uma aula curta do assunto. No teclado, C e E respondem.
- **Banco de questões do app:** 57 itens inéditos da LGPD (três por assunto), escritos a partir da lei. Não são questões de prova.
- **Flashcards:** o item errado volta em 1, 3, 7, 15 e 30 dias. "Lembrei" adia; "Não lembrei" recomeça.
- **Desafio do dia:** dez itens sorteados, os mesmos em todos os aparelhos, com bônus de pontos. Acertos seguidos viram combo.
- **Perguntar ao instrutor:** o app copia a questão e a sua dúvida e abre o Claude. A resposta fica gravada junto da questão e na tela Instrutor, em Mais.
- **Medalhas:** eram 27 e agora são 103, em quatro metais (bronze, prata, ouro e diamante), com desenho novo: cada metal tem o seu contorno. Há séries (Chama, Resolvedor, Mira, Combo, Baralho, Grifo e outras) e uma medalha por disciplina.
- **Medalhas na barra de baixo:** Hoje, Plano, Estudar, Medalhas e Mais. A Evolução foi para Mais (no computador, continua no trilho). Com as medalhas desligadas, a Evolução volta para a barra.
- **Estudo por questões:** assunto com questões do app entra no plano do dia como treino. Respondeu todas, o assunto fica grifado e as revisões são marcadas. O cronômetro continua para lei seca, teoria e assuntos sem questões.
- **Pontos:** o acerto vale 2 (valia 1); há bônus de combo e do desafio do dia, e 2 pontos por flashcard revisto.
- **Banca do concurso da ANPD: Cebraspe** (despacho de 14/11/2026). A biblioteca ficou só com a ANPD; o edital da ABDI saiu.
- **Guia:** 25 passos; os novos mostram o treino, a aula, o instrutor, os flashcards, o desafio do dia e a tela Medalhas.
- **Por dentro:** a página pede para não entrar em buscadores (`noindex`). Os outros apps ainda listam o Estudo Fácil em "Outros apps da família": isso muda no Kit, pelo Integrador (PROPOSTA-PARA-O-INTEGRADOR.md, item 0).
- **Testes pulados nesta versão:** os testes do Kit (a pasta `comum/` não mudou). Rodaram a verificação do padrão, os 19 testes do app, o guia inteiro e a varredura de acessibilidade (WCAG 2.2 AA), no claro e no escuro.

## 1.0.0 · 2026-11-15

O Estudo Fácil foi refeito do zero, na vez dele de seguir o Conta Fácil (Código, Art. 93, § 2º). Nada da versão 0.x foi
mantido além da marca, do azul caneta e do marca-texto.

- **Cinco lugares:** Hoje, Plano, Estudar (no centro da barra), Evolução e Mais (Concursos, Disciplinas, Revisões, Simulados, Agenda, o guia e os Ajustes).
- **Plano de fábrica para a ANPD** (Especialista em Regulação de Proteção de Dados): 12 disciplinas, 119 assuntos, pesos estimados, três fases até a prova, semana modelo e fontes oficiais. O edital ainda não saiu (situação conferida em 15/11/2026): banca, itens, pesos e data da prova são estimativas e estão marcados assim no app. O edital da ABDI 2026 continua na biblioteca.
- **Sequência de dias:** cada dia com a meta batida (uma hora, de fábrica) aumenta a sequência. A cada 7 dias o app guarda uma folga (até 2), gasta sozinha se você faltar um dia. Dia de descanso da rotina não quebra a sequência.
- **Missões do dia:** tempo, questões e revisões (ou variar de disciplina). As três cumpridas fazem o dia perfeito.
- **Pontos, 10 níveis e 27 medalhas em 3D,** que giram com o dedo e com as setas do teclado. Dá para desligar nos Ajustes.
- **O edital vira caderno:** cada assunto tem um domínio de 0 a 4 (Novo, Começado, Estudado, Revisado, Dominado) e fica grifado conforme você estuda. A prontidão para a prova é a parte do edital já dominada, contando o peso de cada disciplina.
- **Modo foco em tela cheia:** cronômetro, acertos e erros, pausar e concluir. O foco pode ser recolhido sem parar o tempo. No fim, a festa mostra os pontos, o nível e as medalhas novas.
- **Revisões** em 1, 7 e 30 dias depois da teoria (ou os dias que você escolher). Revisão difícil volta em 2 dias.
- **Evolução:** prontidão por semana, constância (12 semanas), horas por semana, acertos por disciplina e totais.
- **Lançar estudo feito** sem o cronômetro, inclusive em dia que já passou.
- **Abertura** de quatro telas na primeira vez e **guia único**, de 19 passos, que faz cada ação numa demonstração que não grava nada.
- **Saíram:** a leitura de editais em PDF (reconhecia mal o conteúdo; agora se cola o conteúdo programático), a comparação entre editais e a janela a cada abertura.
- **Dados:** o formato mudou (versão 3) e os dados da 0.x não são trazidos (Código, Art. 32-A). A cópia antiga fica guardada no aparelho, na chave `estudofacil.db_antigo`. Na sincronização, o arquivo antigo da nuvem é substituído pelo novo.
- **Testes pulados nesta versão:** nenhum. Rodaram a verificação do padrão, os testes do Kit, os 16 do app, o guia inteiro e a varredura de acessibilidade (WCAG 2.2 AA), no claro e no escuro.

## 0.7.1 · 2026-11-15

- **Kit Fácil 0.9.0 (Código 0.9, Proposta 4 do Conta Fácil):** para quem usa este app, muda:
  - **Avaliação e feedback:** as duas opções ("Avaliar o app" e "Relatar um problema") são linhas com ícone, título, apoio e seta. Antes saíam amassadas, com borda de pílula e o apoio em negrito.
  - **Janelas sem "Fechar" sozinho no pé:** Avaliação e feedback, Sobre o aplicativo, Mensagem enviada e Mais fecham pelo X (Código, Art. 68, § 1º).
  - **"O que é enviado e para onde":** a linha abre com a seta do Kit.
- **Por dentro:** o CSS do Kit perdeu 184 regras repetidas (19 kB a menos), sem mudar o desenho, e a verificação passou a acusá-las. O guia único do Kit ganhou o que o Conta Fácil pediu (alvo à vista dentro da janela, janela aberta de um passo para o outro, destaque de área e tela cheia); este app passa a usá-lo na sua vez (Art. 93, § 2º).

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
