import { commands, ExtensionContext, TextEditorEdit, window } from "vscode";
import { demoteEditor, moveDownEditor, moveUpEditor, promoteEditor } from "./extension-lib";

function showError(message: string): void {
  window.showErrorMessage(`Markdown Move: ${message}`);
}

function baseAction(func: (line: string[], positionLine: number, editor: TextEditorEdit) => void): void {
  const textEditor = window.activeTextEditor;

  if (textEditor === undefined) {
    return showError("You do not have any text editor opened");
  }

  const content = textEditor.document.getText();
  const lines = content.split("\n");

  try {
    textEditor.edit((editBuilder) => func(lines, textEditor.selection.active.line, editBuilder));
  } catch (e) {
    console.error(e);
  }
}

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand("markdown-move.moveDown", () => baseAction(moveDownEditor)),
    commands.registerCommand("markdown-move.moveUp", () => baseAction(moveUpEditor)),
    commands.registerCommand("markdown-move.promote", () => baseAction(promoteEditor)),
    commands.registerCommand("markdown-move.demote", () => baseAction(demoteEditor))
  );
}

export function deactivate(_context: ExtensionContext) {}
