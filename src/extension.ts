import {commands, ExtensionContext} from "vscode";
import {moveDown} from "./lib";

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "markdown-move" is now active!');

  let disposable = commands.registerCommand("markdown-move.move-down", () => {
    console.log("hello");
    moveDown();
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
