import {window} from "vscode";

const output = window.createOutputChannel("Markdown-move");

export function log(message: string) {
  output.appendLine(message);
}
