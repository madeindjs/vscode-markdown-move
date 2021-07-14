const stringScanner = require("string-scanner");
const {assert} = require("chai");
const {describe, it} = require("mocha");

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
 * @returns {string | undefined}
 */
function getSection(content, position) {
  const scanner = stringScanner(content);
  scanner.cursor(position);

  // find title of current cursor
  const token = scanner.previous(/(\#+)/);

  if (!token) {
    return undefined;
  }

  const sectionDepth = token.length;
  const beginLinePosition = scanner.offset;

  // go to next title
  scanner.next(/\n/);
  const nextHeaderRe = new RegExp(`(\\#){1,${sectionDepth}}\ `, "g");
  const nextHeader = scanner.next(nextHeaderRe);

  const endLinePosition = scanner.offset;

  // console.log({
  //   line,
  //   beginLinePosition,
  //   endLinePosition,
  //   sectionDepth,
  //   nextHeader,
  // });

  return (
    content.slice(
      beginLinePosition,
      endLinePosition - (nextHeader?.length ?? -1)
    ) || undefined
  );
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

  const beginSection = content.indexOf(section);
  const endSection = beginSection + section.length;

  const nextSection = getSection(content, endSection);

  // todo replace section by nextSection
  console.log({section, nextSection, endSection});
}

describe("getSection", () => {
  it("expected to find section 1.2", () => {
    assert.strictEqual(getSection(md, 100), "## Title 1.2\n\nLorem ipsum\n\n");
  });
  it("expected to find section 1.2 for 125", () => {
    assert.strictEqual(getSection(md, 125), "## Title 1.2\n\nLorem ipsum\n\n");
  });
  it("expected to find section 2.1", () => {
    assert.strictEqual(getSection(md, 150), "## Title 2.1\n\nLorem ipsum\n\n");
  });

  it("expected to not found when outside of document", () => {
    assert.strictEqual(getSection(md, 100000), undefined);
  });
});

describe("moveDown", () => {
  it("works", () => {
    moveDown(md, 100);
  });
});
