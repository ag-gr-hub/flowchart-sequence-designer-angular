import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: false, // ngc generates declarations
  sourcemap: true,
  clean: true,
  external: [
    "@angular/core",
    "@angular/common",
    "flowchart-sequence-designer",
    "flowchart-sequence-designer/ui",
    "react",
    "react-dom",
    "react-dom/client",
    "rxjs",
  ],
});
