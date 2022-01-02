import { assert, expect } from "chai";
import { describe, it } from "mocha";
import { getEndOfSectionLine, getLineOfPosition, getPreviousTitleLine, getSectionV2, moveDown, moveUp } from "./lib";

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
    assert.deepEqual(moveDown(md.split("\n"), 15), expectedMd.split("\n"));
  });
});

describe("moveUp", () => {
  it("works", () => {
    const expectedMd = `---
title: testing markdown
---

before title

# Title 1

Lorem ipsum

## Title 1.2

Lorem ipsum

## Title 1.1

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
    assert.deepEqual(moveUp(md.split("\n"), 15), expectedMd.split("\n"));
  });
});

describe("getLineOfPosition", () => {
  const lines = ["012", "45", "7"];

  it("should get first line", () => {
    expect(getLineOfPosition(lines, 0)).eq(0);
  });
  it("should get second line", () => {
    expect(getLineOfPosition(lines, 4)).eq(1);
  });
  it("should get third line", () => {
    expect(getLineOfPosition(lines, 7)).eq(2);
  });
});

describe("getPreviousTitleLine", () => {
  it("should find for current line", () => {
    const lines = ["# 234"];
    expect(getPreviousTitleLine(lines, 0)).eq(0);
  });

  it("should find for second line", () => {
    const lines = ["# 2345", "78"];
    expect(getPreviousTitleLine(lines, 1)).eq(0);
  });
});

describe("getEndOfSectionLine", () => {
  const lines = ["# 2", "4", "# 8"];
  it("should throw for first line", () => {
    expect(getEndOfSectionLine(lines, 0, 1)).eq(1);
  });
  it("should find for second line", () => {
    expect(getEndOfSectionLine(lines, 1, 1)).eq(1);
  });
  it("should throw for third line", () => {
    expect(getEndOfSectionLine(lines, 2, 1)).eq(2);
  });
});

describe("getSectionV2", () => {
  const lines = ["# 1", "body 1", "## 1.1", "body 1.1", "# 2"];

  it("should find for body line", () => {
    expect(getSectionV2(lines, 1)).deep.eq([0, 3]);
  });
  it("should find for title 1", () => {
    expect(getSectionV2(lines, 0)).deep.eq([0, 3]);
  });
  it("should find for title 1.1", () => {
    expect(getSectionV2(lines, 2)).deep.eq([2, 3]);
  });
  it("should find for body 1.1", () => {
    expect(getSectionV2(lines, 3)).deep.eq([2, 3]);
  });
  it("should find for title 2", () => {
    expect(getSectionV2(lines, 4)).deep.eq([4, 4]);
  });
});
