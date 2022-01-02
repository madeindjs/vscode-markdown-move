import { Position, Range, TextEditorEdit } from "vscode";
import { getSectionV2 } from "./lib";

export function sectionToRange(section: [number, number], lines: string[]): Range {
  const from = new Position(section[0], 0);
  const lastCharPosition = lines[section[1]].length;
  const to = new Position(section[1], lastCharPosition);

  return new Range(from, to);
}

export function moveUp(lines: string[], positionLine: number, editor: TextEditorEdit): void {
  const section = getSectionV2(lines, positionLine);
  const previousSection = getSectionV2(lines, section[0] - 1);

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

export function moveDown(lines: string[], positionLine: number, editor: TextEditorEdit): void {
  const section = getSectionV2(lines, positionLine);
  const nextSection = getSectionV2(lines, section[1] + 1);
  const newText = [...lines.slice(nextSection[0], nextSection[1] + 1), ...lines.slice(section[0], section[1] + 1)].join(
    "\n"
  );

  const sectionToReplace = sectionToRange([section[0], nextSection[1]], lines);
  editor.replace(sectionToReplace, newText);
}
