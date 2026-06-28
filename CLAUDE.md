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
npm run build        # tsup bundles esm+cjs, then tsc emits .d.ts (declarations come from tsc, NOT tsup)
npm run typecheck    # tsc --noEmit
npm run lint         # eslint src/ demo/src/
npm test             # jest
npm run format       # prettier --write
```

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
  `@angular/*`, and `rxjs` are **peer/external** — `tsup.config.ts` lists them in `external`
  so they are never bundled. When adding an import that should not ship in the bundle, add it
  to that list too.
- The library compiles with Angular `compilationMode: "partial"` (Ivy partial-Ivy for
  distribution); `strictTemplates` and strict injection are on.

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
