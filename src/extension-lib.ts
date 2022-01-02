import { Position, Range, TextEditorEdit } from "vscode";
import { getSection, Section } from "./lib";

export function sectionToRange(section: Section, lines: string[]): Range {
  const from = new Position(section[0], 0);
  const lastCharPosition = lines[section[1]].length;
  const to = new Position(section[1], lastCharPosition);

  return new Range(from, to);
}

export function moveUpEditor(lines: string[], positionLine: number, editor: TextEditorEdit): void {
  const section = getSection(lines, positionLine);
  const previousSection = getSection(lines, section[0] - 1);

  if (previousSection[1] >= section[0]) {
    previousSection[1] = section[0] - 1;
  }

  const newText = [
    ...lines.slice(section[0], section[1] + 1),
    ...lines.slice(previousSection[0], previousSection[1] + 1),
  ].join("\n");

  const sectionToReplace = sectionToRange([previousSection[0], section[1]], lines);

  editor.replace(sectionToReplace, newText);
}

export function moveDownEditor(lines: string[], positionLine: number, editor: TextEditorEdit): void {
  const section = getSection(lines, positionLine);
  const nextSection = getSection(lines, section[1] + 1);
  const newText = [...lines.slice(nextSection[0], nextSection[1] + 1), ...lines.slice(section[0], section[1] + 1)].join(
    "\n"
  );

  const sectionToReplace = sectionToRange([section[0], nextSection[1]], lines);
  editor.replace(sectionToReplace, newText);
}

export function promoteEditor(lines: string[], positionLine: number, editor: TextEditorEdit): void {
  const section = getSection(lines, positionLine);
  const newLines = [...lines];

  for (let i = section[0]; i <= section[1]; i++) {
    const line = newLines[i];

    if (line.match(/^(\#){2,6} +/) !== null) {
      editor.delete(new Range(new Position(i, 1), new Position(i, 2)));
    }
  }
}

export function demoteEditor(lines: string[], positionLine: number, editor: TextEditorEdit): void {
  const section = getSection(lines, positionLine);
  const newLines = [...lines];

  for (let i = section[0]; i <= section[1]; i++) {
    const line = newLines[i];

    if (line.match(/^(\#){1,5} +/) !== null) {
      editor.insert(new Position(i, 1), "#");
    }
  }
}
