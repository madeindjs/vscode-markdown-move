import { expect } from "chai";
import { describe, it } from "mocha";
import { demote, getEndOfSectionLine, getPreviousTitleLine, getSection, promote } from "./lib";

describe(getPreviousTitleLine.name, () => {
  it("should find for current line", () => {
    const lines = ["# 234"];
    expect(getPreviousTitleLine(lines, 0)).eq(0);
  });

  it("should find for second line", () => {
    const lines = ["# 2345", "78"];
    expect(getPreviousTitleLine(lines, 1)).eq(0);
  });
});

describe(getEndOfSectionLine.name, () => {
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

describe(getSection.name, () => {
  const lines = ["# 1", "body 1", "## 1.1", "body 1.1", "# 2"];

  it("should find for body line", () => {
    expect(getSection(lines, 1)).deep.eq([0, 3]);
  });
  it("should find for title 1", () => {
    expect(getSection(lines, 0)).deep.eq([0, 3]);
  });
  it("should find for title 1.1", () => {
    expect(getSection(lines, 2)).deep.eq([2, 3]);
  });
  it("should find for body 1.1", () => {
    expect(getSection(lines, 3)).deep.eq([2, 3]);
  });
  it("should find for title 2", () => {
    expect(getSection(lines, 4)).deep.eq([4, 4]);
  });
});

describe(promote.name, () => {
  it("should promote sub header", () => {
    expect(promote(["# 1", "## 1.1"], 1)).deep.eq(["# 1", "# 1.1"]);
  });

  it("should promote everything", () => {
    expect(promote(["# 1", "## 1.1"], 0)).deep.eq(["# 1", "# 1.1"]);
  });

  it("should promote sub sub header", () => {
    expect(promote(["# 1", "## 1.1", "### 1.1.1", "# 2"], 2)).deep.eq(["# 1", "## 1.1", "## 1.1.1", "# 2"]);
  });
});

describe(demote.name, () => {
  it("should promote sub header", () => {
    expect(demote(["# 1", "## 1.1"], 1)).deep.eq(["# 1", "### 1.1"]);
  });

  it("should promote everything", () => {
    expect(demote(["# 1", "## 1.1"], 0)).deep.eq(["## 1", "### 1.1"]);
  });

  it("should promote sub sub header", () => {
    expect(demote(["# 1", "## 1.1", "### 1.1.1", "# 2"], 2)).deep.eq(["# 1", "## 1.1", "#### 1.1.1", "# 2"]);
  });
});
