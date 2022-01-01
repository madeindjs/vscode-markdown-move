import { Position } from "vscode";

const stringScanner = require("string-scanner");

function log(...args: any[]) {
  if (process.env.NODE_ENV === "testing") {
    return;
  }

  const message = args.shift();
  console.log(`LOG ${message}`, ...args);
}

interface Section {
  section: string;
  position: { begin: number; end: number };
}

export function getSection(content: string, position: number): Section | undefined {
  if (position > content.length) {
    return undefined;
  }

  log("try to get section for position started at `%s`", content.slice(position, position + 10));
  const scanner = stringScanner(content);
  scanner.cursor(position);
  scanner.next(/\n/);

  // find title of current cursor
  const token = scanner.previous(/(\#+)/);

  if (!token) {
    return undefined;
  }

  const sectionDepth = token.length;
  const beginLinePosition = scanner.offset;

  // go to next title
  scanner.next(/\n/);
  const nextHeaderRe = new RegExp(`\n(\\#){1,${sectionDepth}}\\s`, "g");
  const nextHeader = scanner.next(nextHeaderRe);

  if (!nextHeader) {
    return {
      section: content.slice(beginLinePosition),
      position: {
        begin: beginLinePosition,
        end: content.length,
      },
    };
  }

  const endLinePosition = scanner.offset - nextHeader.length;

  // console.log({
  //   line,
  //   beginLinePosition,
  //   endLinePosition,
  //   sectionDepth,
  //   nextHeader,
  // });

  const section = content.slice(beginLinePosition, endLinePosition) + "\n";

  if (section === undefined) {
    return undefined;
  }

  return { section, position: { begin: beginLinePosition, end: endLinePosition } };
}

export function moveDown(content: string, position: number): string {
  const section = getSection(content, position);

  if (section === undefined) {
    return content;
  }

  const nextSection = getSection(content, section.position.end + 1);

  if (nextSection === undefined) {
    return content;
  }

  const before = content.slice(0, section.position.begin);
  const after = content.slice(section.position.end + nextSection.section.length + 1);

  return [before, nextSection.section, section.section, after].join("");
}

export function moveUp(content: string, position: number): string {
  // const section = getSection(content, position);
  const lines = content.split("\n");

  try {
    const section = getSectionV2(content, position);

    const previousSectionPosition = getCharPositionOfLine(lines, section[0] - 1);
    const previousSection = getSectionV2(content, previousSectionPosition);

    return (
      [
        ...lines.slice(0, previousSection[0]),
        ...lines.slice(section[0], section[1]),
        ...lines.slice(previousSection[0], previousSection[1]),
        ...lines.slice(section[1] + 1, -1),
      ].join("\n") + "\n"
    );

    // const previous;
  } catch (e) {
    console.error(e);
    return content;
  }

  throw Error();

  // const previousSection = getSection(content, section.position.begin - 1);

  // if (previousSection === undefined) {
  //   return content;
  // }

  // const before = content.slice(0, previousSection.position.begin);
  // const after = content.slice(previousSection.position.end + section.section.length + 1);

  // return [before, section.section, previousSection.section, after].join("");
}

export function getCharacterPositionFromPosition(
  content: string,
  position: Position | { line: number; character: number }
): number {
  const lines = content.split("\n");

  let characterPosition = 0;
  let lineNumber = 0;

  for (const line of lines) {
    if (lineNumber === position.line) {
      return characterPosition + position.character;
    }

    lineNumber += 1;
    characterPosition += line.length + 1;
  }

  return characterPosition;
}

export function getPreviousTitleLine(lines: string[], position: number): number {
  let positionIndex = getLineOfPosition(lines, position);

  do {
    const line = lines[positionIndex];

    if (line.startsWith("#")) {
      return positionIndex;
    }

    positionIndex--;
  } while (positionIndex >= 0);

  throw Error("cannot find previous title");
}

export function getEndOfSectionLine(lines: string[], position: number, tag: string): number {
  let positionIndex = getLineOfPosition(lines, position) + 1;

  do {
    const line = lines[positionIndex];

    if (line.startsWith(tag) && positionIndex !== 0) {
      return positionIndex - 1;
    }

    positionIndex--;
  } while (positionIndex >= 0);

  throw Error("cannot end of section");
}

/**
 * @returns index of started / ended line index
 */
export function getSectionV2(content: string, position: number): [number, number] {
  const lines = content.split("\n");

  const titleLine = getPreviousTitleLine(lines, position);
  const [titleTag] = lines[titleLine].split(" ");

  const lastLine = getEndOfSectionLine(lines, position, titleTag);

  return [titleLine, lastLine];
}

export function getLineOfPosition(lines: string[], position: number): number {
  let count = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (position >= count && position <= count + line.length) {
      return i;
    }
    count += line.length;
  }

  throw Error("Cannot find line for position");
}

export function getCharPositionOfLine(lines: string[], lineIndex: number): number {
  let position = 0;

  for (let i = 0; i < lineIndex; i++) {
    position += lines[i].length + 1;
  }

  return position;
}
