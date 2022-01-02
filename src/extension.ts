import { commands, ExtensionContext, TextEditorEdit, window } from "vscode";
import { demoteEditor, moveDownEditor, moveUpEditor, promoteEditor } from "./extension-moves";

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

function promoteAction(): void {
  const textEditor = window.activeTextEditor;

  if (textEditor === undefined) {
    return showError("You do not have any text editor opened");
  }

  const content = textEditor.document.getText();
  const lines = content.split("\n");

  textEditor.edit((editBuilder) => promoteEditor(lines, textEditor.selection.active.line, editBuilder));
}

function demoteAction(): void {
  const textEditor = window.activeTextEditor;

  if (textEditor === undefined) {
    return showError("You do not have any text editor opened");
  }

  const content = textEditor.document.getText();
  const lines = content.split("\n");

  textEditor.edit((editBuilder) => demoteEditor(lines, textEditor.selection.active.line, editBuilder));
}

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand("markdown-move.moveDown", () => moveAction(moveDownEditor)),
    commands.registerCommand("markdown-move.moveUp", () => moveAction(moveUpEditor)),
    commands.registerCommand("markdown-move.promote", promoteAction),
    commands.registerCommand("markdown-move.demote", demoteAction)
  );
}

export function deactivate(_context: ExtensionContext) {}
