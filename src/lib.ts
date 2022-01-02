export function moveDown(lines: string[], positionLine: number): string[] {
  const section = getSectionV2(lines, positionLine);

  const nextSection = getSectionV2(lines, section[1] + 1);

  const newLines = [
    ...lines.slice(0, section[0]),
    ...lines.slice(nextSection[0], nextSection[1] + 1),
    ...lines.slice(section[0], section[1]),
    ...lines.slice(nextSection[1]),
  ];

  return newLines;
}

export function moveUp(lines: string[], positionLine: number): string[] {
  const section = getSectionV2(lines, positionLine);

  const previousSection = getSectionV2(lines, section[0] - 1);

  const newLines = [
    ...lines.slice(0, previousSection[0]),
    ...lines.slice(section[0], section[1] + 1),
    ...lines.slice(previousSection[0], previousSection[1]),
    ...lines.slice(section[1]),
  ];

  return newLines;
}

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
export function getSectionV2(lines: string[], lineIndex: number): [number, number] {
  const titleLine = getPreviousTitleLine(lines, lineIndex);
  const sectionDeep = lines[titleLine].split(" ")[0].length;

  const lastLine = getEndOfSectionLine(lines, lineIndex, sectionDeep);

  return [titleLine, lastLine];
}

export function getLineOfPosition(lines: string[], position: number): number {
  let count = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (position >= count && position <= count + line.length) {
      return i;
    }
    count += line.length + 1;
  }

  throw Error("Cannot find line for position");
}
