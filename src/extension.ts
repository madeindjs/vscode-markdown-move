import { commands, ExtensionContext, TextEditorEdit, window } from "vscode";
import { moveDown, moveUp } from "./position-moves";

function showWarning(message: string): void {
  window.showWarningMessage(`Markdown Move: ${message}`);
}

function showError(message: string): void {
  window.showErrorMessage(`Markdown Move: ${message}`);
}

function moveAction(func: (line: string[], positionLine: number, editor: TextEditorEdit) => void): void {
  const textEditor = window.activeTextEditor;

  if (textEditor === undefined) {
    return showError("You do not have any text editor opened");
  }

  const content = textEditor.document.getText();
  const lines = content.split("\n");

  textEditor.edit((editBuilder) => func(lines, textEditor.selection.active.line, editBuilder));
}

export function activate(context: ExtensionContext) {
  let moveDownDisposable = commands.registerCommand("markdown-move.moveDown", () => moveAction(moveDown));
  let moveUpDisposable = commands.registerCommand("markdown-move.moveUp", () => moveAction(moveUp));

  context.subscriptions.push(moveDownDisposable, moveUpDisposable);
}

export function deactivate() {}
