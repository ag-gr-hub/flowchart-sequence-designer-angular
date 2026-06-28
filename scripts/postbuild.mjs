// Post-process the ng-packagr output. ng-packagr copies through top-level
// fields from the project package.json that are install-time-only and should
// not ship to consumers (notably `overrides`, used to pin patched transitive
// dev/build dependencies). Strip them from the published dist/package.json.
import { readFileSync, writeFileSync } from "node:fs";

const distPkgPath = new URL("../dist/package.json", import.meta.url);
const pkg = JSON.parse(readFileSync(distPkgPath, "utf8"));

// `overrides` is install-time-only; `private` guards the project root against
// accidental `npm publish` but must not reach the publishable dist package.
const STRIP = ["overrides", "private"];
let removed = [];
for (const key of STRIP) {
  if (key in pkg) {
    delete pkg[key];
    removed.push(key);
  }
}

writeFileSync(distPkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(
  removed.length
    ? `postbuild: stripped ${removed.join(", ")} from dist/package.json`
    : "postbuild: nothing to strip",
);
