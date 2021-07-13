import { window } from "vscode";
const parse = require("markdown-to-ast").parse;

function getActiveAst() {
  const content = window.activeTextEditor?.document.getText();

  if (content === undefined) {
    throw Error("Cannot read content from active text editor");
  }

  return parse(content);
}

export function moveDown() {
  const ast = getActiveAst();
  console.log(ast);
}
