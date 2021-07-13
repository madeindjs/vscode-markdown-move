import {window} from "vscode";
const parse = require("markdown-to-ast").parse;

function getActiveAst(): AstNode {
  window.activeTextEditor;
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

interface AstNode {
  type: "Header" | "Document" | "Paragraph" | "Str" | "Emphasis";
  depth: number;
  childer: AstNode[];
  raw: string;
  loc: {
    start: {
      line: number;
      column: number;
    };
    end: {
      line: number;
      column: number;
    };
    range: number[];
  };
}
