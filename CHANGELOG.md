# Mudanças

Formato: versão, data e o que muda para quem usa. Versões no formato `maior.menor.correção`.

## 2.3.1 · 2026-10-29

- **Pague um chopp para o criador!** O chopp passa a aparecer no alto da tela (e em *Sobre o aplicativo*), com QR code e Pix copia e cola. É opcional: o app continua gratuito e igual para todos.
- Kit Fácil 2.1.1.

## 2.3.0 · 2026-10-28

Kit Fácil 2.1, igual nos três apps (Leis Globais v1.5 do Projeto Integrador).

- **Ajustes na barra de baixo:** Ajustes deixa o alto da tela e vira o último item da barra de baixo, depois de Agenda; no computador, fica no pé do menu lateral. Tocar de novo volta para a lista de guias.
- **Alto da tela:** chopp, nuvem e balão, nessa ordem; Desempenho continua no alto, à esquerda deles.
- **Pague um chopp para o criador!** Janela com QR code e Pix copia e cola, também em *Sobre o aplicativo*. É opcional: o app continua gratuito e igual para todos. O ícone aparece quando a chave Pix do criador for cadastrada no Kit.
- **Novidades:** depois de cada atualização, o app mostra uma vez o que mudou; a lista fica em *Sobre o aplicativo*. Quem está começando vê a tela de primeiro uso do próprio app, sem janela a mais.

## 2.2.0 · 2026-10-27

Padronização da interface e dos Ajustes com o Conta Fácil e o Elétrica Fácil (Kit Fácil 2).

- **Alto da tela:** Ajustes, a **nuvem** e o **balão** ficam no canto direito, iguais nos três apps, também no computador
  (antes a barra de cima sumia no computador). A nuvem mostra o estado real da sincronização; tocar nela mostra a conta,
  a última sincronização e as ações. O indicador de sincronização do menu lateral deu lugar à nuvem.
- **Balão:** escolha entre **Avaliar o app** (nota de 1 a 5 e comentário opcional) e **Relatar um problema**
  (descrição, com categoria e gravidade opcionais).
- **Ajustes em guias:** as oito guias comuns da família e as guias do Estudo Fácil (Rotina e metas, Revisões).
  No computador, a lista e a guia ficam lado a lado. Ajustes saiu do menu lateral: abre pela engrenagem do topo.
  "Ajustar" no plano do dia leva direto para Rotina e metas.
- **Notificações:** nova opção para desligar o som e a vibração do fim do tempo de estudo neste aparelho.
- **Cópia de segurança:** agora no formato comum da família; as cópias feitas nas versões anteriores continuam
  sendo aceitas na restauração.
- **Privacidade e segurança:** "Apagar todos os dados" (inclusive na nuvem) e o novo "Apagar dados deste aparelho"
  (só neste navegador).
- Barra de baixo e menu lateral com os componentes comuns da família; cores de aviso, erro e sucesso iguais nos três apps.

## 2.1.0 · 2026-10-26

Adequação às diretrizes do Projeto Integrador.

- **Avaliar o app e relatar problemas:** formulário padrão do projeto (nota, tipo, mensagem e contato opcional) em
  Ajustes → Ajude a melhorar, com fila no aparelho quando estiver sem internet.
- **Sobre e privacidade:** versão do app, onde ficam os dados e os outros apps do projeto.
- **Sincronização:** passa a usar o motor comum do projeto (Kit Fácil). O arquivo no gist é o mesmo, então aparelhos
  com a versão anterior continuam sincronizando. Se você já sincroniza outro app do projeto neste aparelho, dá para
  aproveitar a mesma chave (antes, só a do Elétrica Fácil). Correção: depois de excluir algo que já tinha sido alterado,
  os aparelhos regravavam o gist a cada sincronização.
- **Aparência:** o seletor de tema agora é o componente comum do projeto (a escolha feita antes continua valendo).
- Para quem desenvolve: Kit Fácil em `comum/`, `npm start`, `npm test` (testes automáticos no navegador),
  `npm run verificar`, README e este histórico.

## 2.0.0

Versão anterior: vários editais ao mesmo tempo, disciplinas e assuntos comuns, plano do dia, cronômetro, revisões,
agenda, desempenho, simulados, biblioteca (ABDI 2026), leitura de edital em PDF, sincronização por gist e uso sem internet.
