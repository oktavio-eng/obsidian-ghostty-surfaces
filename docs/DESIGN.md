# Design

Como as superfícies do Obsidian foram alinhadas ao site (`oktavio.vercel.app`) e ao Ghostty. Valores do site lidos de `styles/tokens/colors.css` e `styles/main.css` (OKLCH convertido para sRGB de 8 bits).

## Tokens

| Token do site | Claro | Escuro |
|---|---|---|
| `--bg` (fundo) | `#FAF9F5` | `#07121c` — `oklch(0.179 0.026 246)` |
| `--white` (superfície) | `#ffffff` | `#111c25` — `oklch(0.2193 0.024 246)` |
| `--line` (borda 1px) | `#eaeaea` | `#262f37` — `oklch(0.2993 0.02 246)` |
| `--row-hover` (fill de hover / cabeçalho de tabela) | `#f4f2ee` | `#131b23` — `oklch(0.2193 0.02 246)` |
| `--ink` | `#000000` (mantido do vault) | `#f2f2f2` |
| `--muted` / `--faint` | do tema | `#909daa` / `#7e8891` |
| Acento | `#07b0f2` | `#07b0f2` |

Fixos por pedido: `line-height` 1.5, gap de parágrafo 8px, acento `#07b0f2`, texto preto e seleção azul do macOS no claro.

## O padrão de superfície

Vem do `--shadow-lift` do site, usado no gráfico de contribuições e no ícone de documento:

- **Camada interna:** superfície (`--white`), borda de 1px em `--line`, raio 14px, `corner-shape: superellipse(1.65)` (o `--corner-lg` do site).
- **Camada externa (shell):** 4px de respiro na cor da página + anel de 1px a 6% de preto + duas sombras curtas. Feita só com `box-shadow`: como o *spread* segue o raio, o anel externo sai concêntrico (14 + 4 = 18) sem elemento extra.
- **Dark:** o site zera todas as sombras no escuro (`--shadow-a* = 0`). O shell vira só respiro de 4px; a separação vem da borda `--line`.
- **Folga:** o shell sangra 5px para fora. Blocos ocupam 100% da largura e o container cortava as laterais (bug dos callouts), então cada bloco ganha `margin-inline: 6px`.

## Mapa dos blocos

| Bloco | Tratamento |
|---|---|
| Código (reading view e widget do Live Preview) | Superfície + linha + shell |
| Código em edição (Live Preview) | Uma `.cm-line` por linha; cada uma carrega o shell e `clip-path` com inset negativo mostra o anel só nos lados certos (abertura: topo + laterais; miolo: laterais; fechamento: base + laterais) |
| Callouts | Superfície + linha + shell; cor do tipo só no ícone |
| Embeds | Superfície + linha + shell (é a referência do padrão) |
| Citações e callouts em edição | A sequência de linhas `> ...` é um bloco só: primeira linha = topo + raio superior, meio = laterais, última = base + raio inferior, linha única = quatro cantos; shell via `clip-path`. Reading view: shell normal |
| Tabelas | A `<table>` é o cartão (`border-collapse: separate`, `overflow: hidden`, raio 14px); `<tr>` sem fundo; cabeçalho em `--row-hover`; wrapper com 6px de folga |
| Tarefas | Caixinha de 5px de raio; marcada usa o acento (era verde) |
| Tags | Etiqueta de 6px de raio, superfície + linha |
| Destaques `==x==` | Amarelo ANSI do Ghostty (`#F0C674`) suavizado |
| Aba ativa / item ativo do explorer | Superfície + anel de 1px |
| Sintaxe de código | Matizes da paleta ANSI do Ghostty: escurecidas no claro (contraste sobre `#FAF9F5`), originais no escuro |

## Decisões e experimentos descartados

- **Cursor de bloco sólido com `mix-blend-mode: difference`** (para imitar o `cursor-text` do Ghostty): saiu branco sobre o bege. Revertido; o cursor é cinza translúcido (`rgba(0,0,0,.45)`), que mantém a letra visível.
- **Paleta Atom One Light literal:** descartada. O Ghostty é referência de estilo; texto preto e seleção azul do vault ficam.
- **Tabela com raio só nas células:** deixava o contorno pontudo — o fundo retangular de `thead tr` (Border) e as bordas colapsadas ficavam por cima. A solução é a tabela ser o cartão.
- **Callout com barra lateral colorida:** removida, o embed não tem.
- **Shell por linha sem `clip-path`:** o spread de uma linha cobriria as vizinhas; o recorte resolve.
- **Raio em cada linha da citação:** ao editar, cada `> ...` virava um "comprimido" com entalhe entre as linhas (e o gap de parágrafo de 8px somava padding em cada uma). Corrigido tratando a sequência como um bloco (primeira/meio/última).

## Bugs encontrados e corrigidos

- **Prompt `❯` em título ativo:** o Border desenha a barrinha de título (3px, acento) no mesmo `::before` de `.HyperMD-header-N`; na linha ativa o `❯` herdava largura, altura, fundo, raio, margem e `translateY(4px)`, e o texto do título pulava ~9px. O snippet zera essas propriedades só em linhas de título ativas.
- **Régua `---` azulada:** o Border a tingia de azul; agora `--hr-color: var(--line)`.
- **Callouts sem laterais:** o shell era cortado pelo container (ver "Folga").
- **Tabela com contorno pontudo:** ver acima.
- **Barrinha fina à esquerda ao editar citação/callout:** é o `::before` de `.HyperMD-quote` (e de `.cm-blockquote-border`), com `border-inline-start: var(--blockquote-border-thickness) solid var(--blockquote-border-color)` (lido no `app.css` do Obsidian). O Border só zera a largura (`width: 0 !important`); a borda de 2px continua desenhada e ainda vazava no `❯` da linha ativa, que usa o mesmo pseudo-elemento. Corrigido zerando a borda no `::before`. A primeira tentativa (esconder o elemento `.cm-blockquote-border` e o `::after` de hover) não pegava o pseudo-elemento certo.
- **Anel de hover nos widgets do Live Preview:** o Obsidian desenha um anel azulado no `.cm-embed-block` ao passar o mouse, duplicando o shell. Removido (exceto em `.markdown-embed`, cujo shell vive no próprio wrapper); o botão `</>` de editar continua aparecendo no hover.

## Limitações conhecidas

- Feito para o tema Border; em outro tema os seletores e variáveis (`--table-*`, `--blockquote-*`, `--callout-*`) podem divergir.
- `:has()` e `:not()` com seletor complexo (usados para primeira/última linha de citação) exigem um Chromium recente; em versões antigas o Obsidian ignora a regra e a citação em edição volta a ser um bloco sem raio.
- O plugin `terminal-cursor` usa o `drawSelection` original do `@codemirror/view`; uma mudança de formato no Obsidian pode quebrá-lo.
- Berkeley Mono não é distribuída aqui.
- O resultado visual foi conferido no Obsidian, sem testes automatizados.
