const stringScanner = require("string-scanner");
const {assert} = require("chai");
const {describe, it} = require("mocha");

function log(...args) {
  if (process.env.NODE_ENV === "testing") {
    return;
  }

  const message = args.shift();
  console.log(`LOG ${message}`, ...args);
}

// @ts-check

const md = `---
title: testing markdown
---

before title

# Title 1

Lorem ipsum

## Title 1.1

Lorem ipsum

## Title 1.2

Lorem ipsum

# Title 2

Lorem ipsum

## Title 2.1

Lorem ipsum

# Title 3

Lorem ipsum

## Title 3.1

Lorem ipsum
`;

/**
 * @param {string} content
 * @param {number} position
 * @returns {{section: string, position: {begin: number, end: number}} | undefined}
 */
function getSection(content, position) {
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

/**
 * @param {string} content
 * @param {number} position
 * @returns {string}
 */
function moveDown(content, position) {
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

describe("getSection", () => {
  it("expected to find section 1.2", () => {
    assert.strictEqual(
      getSection(md, 100).section,
      "## Title 1.2\n\nLorem ipsum\n\n"
    );
  });

  it("expected to find section 2 for 126", () => {
    assert.strictEqual(
      getSection(md, 126).section,
      "# Title 2\n\nLorem ipsum\n\n## Title 2.1\n\nLorem ipsum\n\n"
    );
  });

  it("expected to find section 2.1", () => {
    assert.strictEqual(
      getSection(md, 150).section,
      "## Title 2.1\n\nLorem ipsum\n\n"
    );
  });

  it("expected to not found when outside of document", () => {
    assert.strictEqual(getSection(md, 100000), undefined);
  });
});

describe("moveDown", () => {
  it("works", () => {
    const expectedMd = `---
title: testing markdown
---

before title

# Title 1

Lorem ipsum

## Title 1.1

Lorem ipsum

# Title 2

Lorem ipsum

## Title 2.1

Lorem ipsum

## Title 1.2

Lorem ipsum

# Title 3

Lorem ipsum

## Title 3.1

Lorem ipsum
`;
    assert.strictEqual(moveDown(md, 100), expectedMd);
  });
});
