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
  position: {begin: number; end: number};
}

export function getSection(
  content: string,
  position: number
): Section | undefined {
  if (position > content.length) {
    return undefined;
  }

  log(
    "try to get section for position started at `%s`",
    content.slice(position, position + 10)
  );
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

  return {section, position: {begin: beginLinePosition, end: endLinePosition}};
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
  const after = content.slice(
    section.position.end + nextSection.section.length + 1
  );

  return [before, nextSection.section, section.section, after].join("");
}

export function moveUp(content: string, position: number): string {
  const section = getSection(content, position);

  if (section === undefined) {
    return content;
  }

  const previousSection = getSection(content, section.position.begin - 1);

  if (previousSection === undefined) {
    return content;
  }

  const before = content.slice(0, previousSection.position.begin);
  const after = content.slice(
    previousSection.position.end + section.section.length + 1
  );

  return [before, section.section, previousSection.section, after].join("");
}
