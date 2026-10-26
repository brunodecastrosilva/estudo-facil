# Estudo Fácil

Controle de estudos para concursos, direto no celular e no computador. Você cadastra os editais e as disciplinas, e o app monta o plano de cada dia.

- Cadastre editais de três jeitos: prontos da biblioteca (hoje, o Processo Seletivo ABDI 2026), lidos do PDF ou digitados com o conteúdo programático colado
- Mantenha suas disciplinas e assuntos num só lugar. Eles valem para todos os editais: o que você estuda num assunto conta em todos os que o cobram
- Informe, em cada edital, as questões e o valor de cada disciplina, as áreas da prova e a nota mínima
- Acompanhe vários concursos ao mesmo tempo. O plano do dia junta os editais marcados como Estudando e dá mais tempo ao que vale mais na prova
- Veja o plano de cada dia: as revisões vencidas e os assuntos novos no ritmo certo para terminar a teoria antes da prova
- Estude com o cronômetro em tela cheia, marque acertos e erros e troque de assunto sem parar o tempo
- Receba as revisões no ciclo de 1, 7 e 30 dias (ou outro que você escolher)
- Confira o cronograma de cada concurso, com as datas que dependem de você, e leve as datas para a agenda do celular
- Registre simulados e veja a nota calculada pela regra da prova
- Compare dois editais e veja quantos assuntos eles têm em comum
- Use no celular, no tablet e no computador com os mesmos dados: a sincronização guarda tudo criptografado num gist secreto da sua conta GitHub

App web instalável: no iPhone, abra o endereço no Safari e toque em **Compartilhar → Adicionar à Tela de Início**. No Android, use **Instalar app** no menu do Chrome. Sem a sincronização, os dados ficam só no aparelho; ative em **Ajustes → Usar em vários aparelhos**.

- `index.html`: estrutura e visual do app
- `app.js`: dados, sincronização, plano do dia e cronômetro
- `telas.js`: Hoje, Estudar, Agenda, Desempenho e Ajustes
- `cadastros.js`: Editais, Disciplinas, biblioteca e leitura de editais
- `editais.js`: o edital da ABDI na biblioteca (disciplinas, assuntos, cronograma e prova)
- `leitor-pdf.js`: leitura de editais em PDF, carregada só quando você usa
- `sw.js` / `manifest.webmanifest` / `icons/`: instalação e uso offline
