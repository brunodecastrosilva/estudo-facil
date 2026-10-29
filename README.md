# Estudo Fácil

Controle de estudos para concursos, direto no celular e no computador. Você cadastra os editais e as disciplinas, e o app monta o plano de cada dia.

**Fase de testes** · versão 2.4.0 · app web em <https://brunodecastrosilva.github.io/estudo-facil/>

Faz parte do **Projeto Integrador** (Conta Fácil, Elétrica Fácil e Estudo Fácil) e segue o padrão comum descrito em
[`comum/PADRAO.md`](comum/PADRAO.md).

## O que o app faz

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
- **Use em vários aparelhos (opcional):** os mesmos dados no celular, no tablet e no computador, criptografados num gist secreto da sua conta GitHub
- **Avalie o app e relate problemas** pelo balão no alto da tela (ou em Ajustes → Avaliação e feedback)
- **Nuvem no alto da tela:** mostra se os dados estão sincronizados, sincronizando, pendentes, com erro ou sem internet
- **Ajustes na barra de baixo** (no computador, no pé do menu lateral), com as mesmas guias nos três apps
- **Pague um chopp para o criador!** O app é gratuito; o chopp no alto da tela, entre a nuvem e o balão, abre o Pix (QR code e copia e cola), se você quiser apoiar
- **Novidades:** depois de cada atualização, o app mostra uma vez o que mudou
- Tema claro, escuro ou automático; funciona sem internet depois da primeira visita

## Como usar

Abra o endereço em qualquer navegador, no celular, no tablet ou no computador. Para instalar:

- **iPhone:** no Safari, toque em **Compartilhar → Adicionar à Tela de Início**
- **Android:** no Chrome, menu **⋮ → Instalar app**
- **Computador:** ícone de instalar na barra de endereço do Chrome ou do Edge

Sem a sincronização, os dados ficam só no aparelho; toque na **nuvem** no alto da tela (ou vá em **Ajustes → Sincronização e armazenamento**).

## Onde ficam os dados

| Dado | Onde fica |
|---|---|
| Editais, disciplinas, sessões, revisões, simulados e ajustes | neste aparelho (armazenamento do navegador, chaves `estudofacil.*`) |
| Os mesmos dados, com a sincronização ligada | gist secreto na conta GitHub do usuário, criptografado no aparelho (AES-256) |
| Editais em PDF | lidos no próprio aparelho; o arquivo não é enviado |
| Avaliações e relatos de problema enviados | Firestore do projeto no Firebase (Google), coleção `feedback`; apagados depois de 2 anos |

A guia **Ajustes → Privacidade e segurança** explica isso para quem usa o app.

## Para desenvolver

O app não tem etapa de build nem dependências: o que está no repositório é o que vai para o ar.
O Node (22 ou mais novo) só é usado para o servidor local, os testes e a verificação do padrão.

```bash
npm start                         # abre em http://localhost:8080/estudo-facil/
npm install                       # primeira vez: instala o Playwright, usado nos testes
npx playwright install chromium   # primeira vez: baixa o navegador dos testes
npm test                          # testes do Kit Fácil e do app, sem internet
npm run verificar                 # padrão do Projeto Integrador, segredos e versão
```

Os testes simulam o GitHub (sincronização) e o Firebase (avaliações); nada toca nos dados reais.
O modo sem internet (service worker) só funciona em `https`, ou seja, no endereço publicado.
Ao mudar a versão, atualize também o `?v=` dos scripts no `index.html`.

## Interface

Segue o padrão comum da família (veja [`comum/PADRAO.md`](comum/PADRAO.md)):

- **Alto da tela, à direita:** Ajustes, nuvem da sincronização e balão de avaliação, nessa ordem. À esquerda deles,
  a ação própria do app (Desempenho). No celular estreito (menos de 400 px), a marca mostra só o ícone
- **Navegação:** Hoje, Editais, Estudar, Disciplinas e Agenda na barra de baixo (celular e tablet); no computador,
  menu lateral com Desempenho
- **Ajustes:** as oito guias comuns e as guias próprias **Rotina e metas** e **Revisões**. Em Notificações, o som e a
  vibração do fim do tempo podem ser desligados; em Privacidade e segurança, "Apagar todos os dados" (inclusive na nuvem)

## Estrutura

| Arquivo | Conteúdo |
|---|---|
| `index.html` | estrutura e visual do app |
| `app.js` | dados, sincronização, plano do dia e cronômetro |
| `telas.js` | Hoje, Estudar, Agenda, Desempenho e Ajustes |
| `cadastros.js` | Editais, Disciplinas, biblioteca e leitura de editais |
| `editais.js` | o edital da ABDI na biblioteca (disciplinas, assuntos, cronograma e prova) |
| `leitor-pdf.js` | leitura de editais em PDF, carregada só quando você usa |
| `comum/` | **Kit Fácil**: sistema de design comum, barra superior, Ajustes, avaliação, sincronização e o padrão do projeto. Igual nos três apps: não edite só aqui |
| `sw.js`, `manifest.webmanifest`, `icons/` | instalação e uso sem internet |
| `tests/` | testes do app |

## Serviços externos e configuração

| Serviço | Para quê | Custo | O que configurar |
|---|---|---|---|
| GitHub (gist) | sincronização entre aparelhos | gratuito | nada no projeto; cada pessoa usa a própria conta |
| Firebase (projeto `conta-facil-2c1f9`, compartilhado pelo projeto) | receber as avaliações | plano gratuito | publicar a regra de [`comum/regras-firestore-feedback.txt`](comum/regras-firestore-feedback.txt) |
| Google Fonts, cdnjs | fontes e leitor de PDF (pdf.js) | gratuito | nada |

## Publicação

GitHub Pages a partir da branch `main`, pasta raiz. Antes de publicar: `npm run verificar` e `npm test`, e confira o app
no celular e no computador. O que mudou em cada versão está no [`CHANGELOG.md`](CHANGELOG.md).

## Uso do código

O código está público durante a fase de testes, sem licença de uso definida: todos os direitos reservados.
