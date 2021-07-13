import { commands, ExtensionContext, window } from "vscode";

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "markdown-move" is now active!');

  let disposable = commands.registerCommand("markdown-move.move-down", () => {
    window.showInformationMessage("Hello World from markdown-move!");
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
