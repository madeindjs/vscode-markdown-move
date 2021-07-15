import {commands, ExtensionContext, Range, window} from "vscode";
import {moveDown} from "./lib";

export function activate(context: ExtensionContext) {
  let disposable = commands.registerCommand("markdown-move.move-down", () => {
    const textEditor = window.activeTextEditor;

    if (textEditor === undefined) {
      window.showErrorMessage("You do not have any text editor opened");
      return;
    }

    const content = textEditor.document.getText();
    const position = textEditor.selection.active;

    const begin = textEditor.document.positionAt(0);
    const end = textEditor.document.positionAt(content.length);

    const newContent = moveDown(content, position.character);

    textEditor.edit((editBuilder) =>
      editBuilder.replace(new Range(begin, end), newContent)
    );
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
