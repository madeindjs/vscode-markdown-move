const stringScanner = require("string-scanner");
const {assert} = require("chai");

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
 */
function getCurrentSection(content, position) {
  const scanner = stringScanner(content);
  scanner.cursor(position);

  // find title of current cursor
  const token = scanner.previous(/^(\#+)/);
  const sectionDepth = token.length;
  const beginLinePosition = scanner.offset;

  // go to next title
  scanner.next(/\n/);
  const nextHeader = new RegExp(`(\\#){1,${sectionDepth}}`, "g");
  scanner.next(nextHeader);

  const endLinePosition = scanner.offset;

  // console.log({
  //   line,
  //   beginLinePosition,
  //   endLinePosition,
  //   sectionDepth,
  //   nextHeader,
  // });

  return content.slice(beginLinePosition, endLinePosition - 1);
}

assert.strictEqual(
  getCurrentSection(md, 100),
  "## Title 1.2\n\nLorem ipsum\n\n",
  "expected to find section 1.2"
);

assert.strictEqual(
  getCurrentSection(md, 150),
  "## Title 2.1\n\nLorem ipsum\n\n",
  "expected to find section 2.1"
);
