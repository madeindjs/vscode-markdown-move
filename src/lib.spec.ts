import {assert} from "chai";
import {describe, it} from "mocha";
import {getSection, moveDown, moveUp} from "./lib";

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
    assert.strictEqual(
      getSection(md, 100)?.section,
      "## Title 1.2\n\nLorem ipsum\n\n"
    );
  });

  it("expected to find section 2 for 126", () => {
    assert.strictEqual(
      getSection(md, 126)?.section,
      "# Title 2\n\nLorem ipsum\n\n## Title 2.1\n\nLorem ipsum\n\n"
    );
  });

  it("expected to find section 2.1", () => {
    assert.strictEqual(
      getSection(md, 150)?.section,
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
