export type Section = [number, number];

export function getPreviousTitleLine(lines: string[], lineIndex: number): number {
  do {
    const line = lines[lineIndex];

    if (line.match(/#+ /) !== null) {
      return lineIndex;
    }

    lineIndex--;
  } while (lineIndex >= 0);

  throw Error("cannot find previous title");
}

export function getEndOfSectionLine(lines: string[], lineIndex: number, sectionDepth: number): number {
  const nextHeaderRe = new RegExp(`^(\\#){1,${sectionDepth}} `);

  let cursor = lineIndex + 1;

  while (lines[cursor] !== undefined) {
    const line = lines[cursor];

    if (line.match(nextHeaderRe) && cursor !== 0) {
      return cursor - 1;
    }

    cursor++;
  }

  return lines.length - 1;
}

/**
 * @returns index of started / ended line index
 */
export function getSection(lines: string[], lineIndex: number): Section {
  const titleLine = getPreviousTitleLine(lines, lineIndex);
  const sectionDeep = lines[titleLine].split(" ")[0].length;

  const lastLine = getEndOfSectionLine(lines, lineIndex, sectionDeep);

  return [titleLine, lastLine];
}

export function promote(lines: string[], lineIndex: number): string[] {
  const section = getSection(lines, lineIndex);
  const newLines = [...lines];

  for (let i = section[0]; i <= section[1]; i++) {
    const line = newLines[i];

    if (line.match(/^(\#){2,6} +/) !== null) {
      newLines[i] = line.substring(1);
    }
  }

  return newLines;
}

export function demote(lines: string[], lineIndex: number): string[] {
  const section = getSection(lines, lineIndex);
  const newLines = [...lines];

  for (let i = section[0]; i <= section[1]; i++) {
    const line = newLines[i];

    if (line.match(/^(\#){1,5} +/) !== null) {
      newLines[i] = "#".concat(line);
    }
  }

  return newLines;
}
