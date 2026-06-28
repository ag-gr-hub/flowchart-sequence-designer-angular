# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@flowchart-sequence-designer/angular` is a thin Angular wrapper that mounts the
React-based [`flowchart-sequence-designer`](https://www.npmjs.com/package/flowchart-sequence-designer)
editor inside Angular standalone components. The published package is the library in `src/`;
`demo/` is a separate Angular app (the GitHub Pages live demo/docs) that consumes it.

## Commands

Library (root):

```bash
npm run build        # ng-packagr → dist/ (partial-Ivy FESM2022 + .d.ts), then scripts/postbuild.mjs
npm run typecheck    # tsc --noEmit
npm run lint         # eslint src/ demo/src/
npm test             # jest
npm run format       # prettier --write
```

The library is built with **ng-packagr** (Angular's standard library packager), which
runs the Angular compiler in `compilationMode: "partial"` and emits a FESM2022 bundle
plus type declarations into `dist/`. This is what makes the package consumable by
**AOT** Angular apps (the default `ng build`) — a plain esbuild/tsup transpile does *not*
produce the partial-Ivy `ɵɵngDeclare*` output AOT requires, so don't reintroduce it.
ng-packagr generates `dist/package.json` (correct `exports`/`module`/`peerDependencies`),
so **the publishable package is `dist/`, not the project root**. The root `package.json`
is marked `private` to prevent accidental root publishes; `scripts/postbuild.mjs` strips
`private` and `overrides` from the generated `dist/package.json`. Publish with
`npm publish ./dist` (the `publish.yml` workflow does this after `npm run build`).

Run a single test: `npx jest src/react-bridge.spec.ts` or filter with `npx jest -t "name"`.

Demo app (`cd demo`):

```bash
npm start            # ng serve (local dev against the built library)
npm run build        # ng build → demo/dist (deployed to GitHub Pages)
```

## Architecture

The core pattern is a **React-in-Angular bridge**. Each Angular component owns a DOM
container and renders a React component into it via `ReactBridge` (`src/react-bridge.ts`).

- **`ReactBridge<P>`** wraps `react-dom/client`'s `createRoot`. It mounts/updates/unmounts
  the React tree. Critical detail: React rendering runs inside `NgZone.runOutsideAngular()`
  so React's internal re-renders don't thrash Angular change detection. The bridge is
  constructed with the React component, initial props, and the `NgZone`.

- **Angular → React** flows through `buildProps()` in each component, called on init and on
  relevant `@Input` changes (`ngOnChanges`). Props pass straight through to the React editor.

- **React → Angular** callbacks (`onChange`, `onExport`) are wrapped in `zone.run(...)` so
  emitting an `@Output` `EventEmitter` triggers Angular change detection. Forgetting the
  `zone.run` wrap is the classic bug — outputs fire but the host view never updates.

- **`initialModel` is special.** React treats `initialModel` as initial state only, so
  changing it after mount does nothing through a normal prop update. Components detect a
  changed `initialModel` in `ngOnChanges` and **fully unmount + remount** the bridge.
  Other inputs (`height`, `theme`, `variant`, etc.) use `bridge.update()`.

- Components use `ChangeDetectionStrategy.OnPush` and lazy-load the React editor via dynamic
  `import("flowchart-sequence-designer/ui")` in `ngOnInit`, tracking `loading`/`error` state.

### Components (`src/`)

`FsdDiagramComponent` (`<fsd-diagram>`), `FsdSequenceComponent` (`<fsd-sequence>`),
`FsdToolbarComponent` (`<fsd-toolbar>`), `FsdStepEditorComponent` (`<fsd-step-editor>`).
All standalone, all exported from `src/index.ts`, which also re-exports core types and the
`presetFlowchartModel` / `presetSequenceModel` / `emptyModel` factories so consumers need
only one import.

## Dependencies & build boundaries

- `flowchart-sequence-designer`, `flowchart-sequence-designer/ui`, `react`, `react-dom`,
  and `@angular/*` are **peers** (declared in `peerDependencies`). ng-packagr treats every
  peer dependency as external automatically, so they are never bundled into the FESM output.
  When adding an import that should ship as a peer (not be bundled), add it to
  `peerDependencies`; ng-packagr errors on imports that are neither peer nor dependency.
- The library is built by **ng-packagr** with Angular `compilationMode: "partial"`
  (`tsconfig.lib.json`); `strictTemplates` and strict injection are on. The partial-Ivy
  output is what AOT consumers need — see the Commands section.

## Testing

- Jest with `@swc/jest`, `jsdom` environment.
- `@angular/core`, `@angular/common`, `flowchart-sequence-designer`, and
  `flowchart-sequence-designer/ui` are all **mocked** via `moduleNameMapper` →
  `src/__mocks__/`. Tests do not boot a real Angular app or the real React editor; the mocks
  return no-op components and stub model factories. Test the bridge logic and prop wiring,
  not the editor itself.

## CI / release

`.github/workflows/`: `test.yml` (lint + typecheck + test), `codeql.yml`, `deploy-docs.yml`
(builds `demo/` to Pages), `publish.yml` (npm publish; `prepublishOnly` runs `build`).
