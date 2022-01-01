import { assert, expect } from "chai";
import { describe, it } from "mocha";
import {
  getCharacterPositionFromPosition,
  getCharPositionOfLine,
  getEndOfSectionLine,
  getLineOfPosition,
  getPreviousTitleLine,
  getSection,
  getSectionV2,
  moveDown,
  moveUp,
} from "./lib";

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

describe("getSection", () => {
  it("expected to find section 1.2", () => {
    assert.strictEqual(getSection(md, 100)?.section, "## Title 1.2\n\nLorem ipsum\n\n");
  });

  it("expected to find section 2 for 126", () => {
    assert.strictEqual(getSection(md, 126)?.section, "# Title 2\n\nLorem ipsum\n\n## Title 2.1\n\nLorem ipsum\n\n");
  });

  it("expected to find section 2.1", () => {
    assert.strictEqual(getSection(md, 150)?.section, "## Title 2.1\n\nLorem ipsum\n\n");
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
    assert.strictEqual(moveUp(md, 100), expectedMd);
  });
});

describe("getCharacterPositionFromPosition", () => {
  const content = "012\n45\n7\n9";

  it("works on first char", () => {
    const position = { line: 0, character: 0 };
    const index = getCharacterPositionFromPosition(content, position);

    assert.strictEqual(index, 0);
    assert.strictEqual(content.charAt(index), "0");
  });

  it("works on first line", () => {
    const position = { line: 0, character: 2 };
    const index = getCharacterPositionFromPosition(content, position);

    assert.strictEqual(index, 2);
    assert.strictEqual(content.charAt(index), "2");
  });

  it("works on second line", () => {
    const position = { line: 1, character: 1 };
    const index = getCharacterPositionFromPosition(content, position);

    assert.strictEqual(index, 5);
    assert.strictEqual(content.charAt(index), "5");
  });

  it("works on third line", () => {
    const position = { line: 2, character: 0 };
    const index = getCharacterPositionFromPosition(content, position);

    assert.strictEqual(index, 7);
    assert.strictEqual(content.charAt(index), "7");
  });

  it("works on last line", () => {
    const position = { line: 3, character: 0 };
    const index = getCharacterPositionFromPosition(content, position);

    assert.strictEqual(index, 9);
    assert.strictEqual(content.charAt(index), "9");
  });
});

describe("getLineOfPosition", () => {
  const lines = ["012", "45", "6"];

  it("should get first line", () => {
    expect(getLineOfPosition(lines, 0)).eq(0);
  });
  it("should get second line", () => {
    expect(getLineOfPosition(lines, 4)).eq(1);
  });
  it("should get third line", () => {
    expect(getLineOfPosition(lines, 6)).eq(2);
  });
});

describe("getPreviousTitleLine", () => {
  it("should find for current line", () => {
    const lines = ["# 234"];
    expect(getPreviousTitleLine(lines, 4)).eq(0);
  });

  it("should find for second line", () => {
    const lines = ["# 2345", "78"];
    expect(getPreviousTitleLine(lines, 7)).eq(0);
  });
});

describe("getEndOfSectionLine", () => {
  const lines = ["# 2", "4", "# 8"];
  it("should throw for first line", () => {
    expect(() => getEndOfSectionLine(lines, 2, "# ")).throw();
  });
  it("should find for second line", () => {
    expect(getEndOfSectionLine(lines, 4, "# ")).eq(1);
  });
  it("should throw for third line", () => {
    expect(() => getEndOfSectionLine(lines, 8, "# ")).throw();
  });
});

describe("getSectionV2", () => {
  it("should find for current line", () => {
    const lines = "# 2\n4\n# 8";
    expect(getSectionV2(lines, 4)).deep.eq([0, 1]);
  });
});

describe("getCharPositionOfLine", () => {
  const lines = ["# 2", "4", "# 8"];

  it("should throw for first line", () => {
    expect(getCharPositionOfLine(lines, 0)).eq(0);
  });
  it("should find for second line", () => {
    expect(getCharPositionOfLine(lines, 1)).eq(4);
  });
  it("should throw for third line", () => {
    expect(getCharPositionOfLine(lines, 2)).eq(6);
  });
});
