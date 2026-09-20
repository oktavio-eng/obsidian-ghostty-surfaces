'use strict';
// Terminal Cursor — plugin mínimo.
//
// O Obsidian usa uma versão modificada do drawSelection do CodeMirror que
// NUNCA desenha o cursor principal (só cursores de seleção/multi-cursor);
// o cursor principal fica sendo o caret nativo do sistema, que não aceita
// largura via CSS. A versão original do drawSelection, exportada em
// "@codemirror/view", desenha o cursor principal como <div class="cm-cursor">
// e esconde o caret nativo. Registramos ela aqui com cursorBlinkRate: 0.
// O bloco grosso/cor/sem-piscar é feito pelo snippet terminal-editor.css.

const { Plugin } = require('obsidian');
const { drawSelection } = require('@codemirror/view');

module.exports = class TerminalCursorPlugin extends Plugin {
  onload() {
    let ext = drawSelection({ cursorBlinkRate: 0, drawRangeCursor: true });
    // drawSelection() devolve [configFacet, cursorLayer, selectionLayer, hideNativeCaretTheme, nativeSelectionHidden].
    // O Obsidian já desenha a camada de seleção; removemos a duplicada para
    // a seleção não ficar com opacidade dobrada. Se o formato mudar, usa tudo.
    if (Array.isArray(ext) && ext.length === 5) {
      ext = [ext[0], ext[1], ext[3], ext[4]];
    }
    this.registerEditorExtension(ext);
  }
};
