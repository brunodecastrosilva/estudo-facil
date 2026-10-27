# Mudanças

Formato: versão, data e o que muda para quem usa. Versões no formato `maior.menor.correção`.

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
