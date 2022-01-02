import { commands, ExtensionContext, Range, window } from "vscode";
import { moveDown, moveUp } from "./lib";

function showWarning(message: string): void {
  window.showWarningMessage(`Markdown Move: ${message}`);
}

function showError(message: string): void {
  window.showErrorMessage(`Markdown Move: ${message}`);
}

function moveAction(func: (line: string[], positionLine: number) => string[]): void {
  const textEditor = window.activeTextEditor;

  if (textEditor === undefined) {
    return showError("You do not have any text editor opened");
  }

  const content = textEditor.document.getText().split("\n");

  const begin = textEditor.document.positionAt(0);
  const end = textEditor.document.positionAt(content.length);

  const newContent = func(content, textEditor.selection.active.line).join("\n");

  // if (newContent === content) {
  //   return showWarning("I cannot perform this action");
  // }

  textEditor.edit((editBuilder) => editBuilder.replace(new Range(begin, end), newContent));
}

export function activate(context: ExtensionContext) {
  let moveDownDisposable = commands.registerCommand("markdown-move.moveDown", () => moveAction(moveDown));

  let moveUpDisposable = commands.registerCommand("markdown-move.moveUp", () => moveAction(moveUp));

  context.subscriptions.push(moveDownDisposable, moveUpDisposable);
}

export function deactivate() {}
