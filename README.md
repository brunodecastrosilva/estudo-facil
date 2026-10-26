# Estudo Fácil

Controle de estudos para concursos, direto no celular e no computador. Já vem com o edital do Processo Seletivo ABDI 2026 (Edital nº 01/2026, FGV) dividido em tópicos.

- Veja o plano de cada dia: as revisões vencidas e os tópicos novos no ritmo certo para terminar a teoria antes da prova
- Estude com o cronômetro em tela cheia, marque acertos e erros e troque de tópico sem parar o tempo
- Acompanhe o edital como um edital verticalizado: o que já tem a teoria concluída fica marcado com marca-texto
- Receba as revisões no ciclo de 1, 7 e 30 dias (ou outro que você escolher)
- Confira o cronograma do concurso, com as datas que dependem de você, e leve as datas para a agenda do celular
- Registre simulados e veja a nota calculada pela regra da prova
- Compare o seu tempo de estudo com o peso de cada área na nota
- Adicione outros concursos a partir do PDF do edital ou do conteúdo programático colado
- Use no celular, no tablet e no computador com os mesmos dados: a sincronização guarda tudo criptografado num gist secreto da sua conta GitHub

App web instalável: no iPhone, abra o endereço no Safari e toque em **Compartilhar → Adicionar à Tela de Início**. No Android, use **Instalar app** no menu do Chrome. Sem a sincronização, os dados ficam só no aparelho; ative em **Ajustes → Usar em vários aparelhos**.

- `index.html` — estrutura e visual do app
- `app.js` — dados, sincronização, plano do dia e cronômetro
- `telas.js` — telas e janelas
- `editais.js` — o edital da ABDI: matérias, tópicos, cronograma e prova
- `leitor-pdf.js` — leitura de outros editais em PDF, carregada só quando você usa
- `sw.js` / `manifest.webmanifest` / `icons/` — instalação e uso offline
