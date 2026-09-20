# obsidian-ghostty-surfaces

CSS snippets for Obsidian that bring a terminal editor and the surface craft of [oktavio.vercel.app](https://oktavio.vercel.app) to the vault, plus the matching [Ghostty](https://ghostty.org) light theme.

Snippets de CSS para o Obsidian: editor com cara de terminal e superfícies no padrão do site (branco 100% sobre `#FAF9F5`, borda de 1px, shell de duas camadas, raios concêntricos de 14px). Inclui o tema claro equivalente para o Ghostty.

> Feito para o tema **Border** (com o plugin Style Settings). Nada aqui foi verificado por teste automatizado; o resultado foi conferido a olho no Obsidian.

## Conteúdo

| Caminho | O que é |
|---|---|
| `snippets/terminal-editor.css` | Editor: fonte mono, cursor de bloco, prompt `❯`, gap de parágrafo, caixa dos blocos de código |
| `snippets/ghostty-blocks.css` | Blocos e chrome: código, callouts, citações, tabelas, tarefas, tags, destaques, embeds, abas. Claro e escuro |
| `snippets/copy-code-button.css` | Botão "Copy" dos blocos de código (opcional) |
| `plugin/terminal-cursor/` | Plugin mínimo que desenha o cursor principal como bloco (o Obsidian só desenha o caret nativo) |
| `ghostty/` | `config` e temas `obsidian-light` / `obsidian-dark` do Ghostty com as mesmas cores |
| `docs/DESIGN.md` | Tokens, decisões, experimentos descartados e limitações |

## Instalação

1. Copie `snippets/*.css` para `<vault>/.obsidian/snippets/` e ative em *Settings › Appearance › CSS snippets*.
2. Copie `plugin/terminal-cursor/` para `<vault>/.obsidian/plugins/` e ative o plugin (sem ele o cursor volta a ser o caret fino nativo).
3. Em *Style Settings › Border*, ajuste o fundo do painel principal para `#FAF9F5` no claro. O fundo escuro (`#07121c`) já é definido pelo snippet.
4. Ghostty: copie `ghostty/themes/obsidian-light` e `obsidian-dark` para `~/.config/ghostty/themes/` e use a linha `theme` de `ghostty/config` (sem espaço depois de `light:`). Recarregue com Cmd+Shift+,.

A fonte Berkeley Mono é paga e não está incluída; sem ela, a pilha cai para SF Mono / Geist Mono.

## Licença

MIT
