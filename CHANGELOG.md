# Changelog

## [Unreleased]

### Changed

- **Build toolchain moved to Angular 22** (`@angular/*` `^22.2.3`, ng-packagr
  `^22.2.4`, TypeScript `~6.0.3`) in both the library and the demo. The published
  peer range (`@angular/core >=16`) is unchanged; output built with Angular 22 was
  verified to AOT-link in an Angular 21 app.
- **Requires Node `^22.22.3 || ^24.15.0 || >=26.0.0`** (matches Angular 22);
  previously `^20.19.0 || ^22.12.0 || >=24.0.0`. CI now tests Node 22 and 24.
- Dropped tsconfig options deprecated in TypeScript 6 (`baseUrl`,
  `downlevelIteration`, `moduleResolution: node`).

### Security

- Clears the Angular `<21.2.20` advisories (sanitization bypass via host
  bindings; `HttpTransferCache` information leak).
- Regenerated the demo lockfile, removing vulnerable `hono`, `ip-address` and
  `http-cache-semantics` from the dependency tree.

## [0.4.0] — 2026-06-29

### Fixed

- **The package now works in AOT Angular apps.** Migrated the library build from
  tsup to **ng-packagr**, so the published package ships partial-Ivy
  (`ɵɵngDeclare*`) output. Previously the tsup/esbuild pipeline emitted plain
  transpiled classes with no Ivy metadata, and AOT consumers (`ng build`, the
  default) failed with `NG2012: Component imports must be standalone…`.

### Changed

- **Build/distribution overhaul.** ng-packagr emits a FESM2022 bundle plus type
  declarations; the publishable artifact is now `dist/` (with a generated
  `package.json`). The package is now **ESM-only — the previous CJS `require`
  entry has been removed**, and the `exports`/`module`/`types` paths changed.
- **Requires Node `^20.19.0 || ^22.12.0 || >=24.0.0`** (matches Angular 21);
  previously `>=18`. Node 18 can no longer build Angular 21.
- Bumped Angular to `21.2.17` and refreshed dependencies.

### Security

- Cleared all 39 Dependabot alerts — Angular `21.2.17` plus patched transitive
  build-chain dependencies via scoped npm `overrides` (shell-quote, undici,
  vite, esbuild, http-proxy-middleware, uuid, launch-editor, piscina, tar, hono,
  js-yaml, `@babel/core`).

### Internal

- Added `eslint` + `@typescript-eslint` so `npm run lint` actually runs; CI now
  runs lint, drops Node 18 from the matrix, and uses `actions/checkout@v7`.

## [0.2.0] — 2025-07-21

### Added
- `FsdToolbarComponent` (`<fsd-toolbar>`) — standalone export/import toolbar
- `FsdStepEditorComponent` (`<fsd-step-editor>`) — node property editor panel
- NgZone integration — React renders run outside zone, outputs trigger CD
- `ChangeDetectionStrategy.OnPush` on all components
- Loading and error states during dynamic import
- Model reset support — changing `initialModel` re-mounts the editor
- Re-exported types: `DiagramModel`, `DiagramNode`, `DiagramEdge`, `ExportFormat`, etc.
- Re-exported model factories: `presetFlowchartModel`, `presetSequenceModel`, `emptyModel`
- 18 unit tests covering ReactBridge and all components
- Demo Angular app (`demo/`)
- Documentation page (`docs/`) for GitHub Pages
- Full repo infrastructure: LICENSE, CODE_OF_CONDUCT, CONTRIBUTING, SECURITY
- Prettier + ESLint configs
- Issue/PR templates
- Dependabot config (npm + GitHub Actions)
- CodeQL security scanning workflow
- Deploy-docs workflow (GitHub Pages)

### Changed
- CI now runs typecheck + test + build (not just build)

## [0.1.0] — 2025-07-21

### Added
- `FsdDiagramComponent` — standalone Angular component wrapping `<DiagramEditor>`
- `FsdSequenceComponent` — standalone Angular component wrapping `<SequenceEditor>`
- React bridge utility for mounting/unmounting React components in Angular views
- Full TypeScript type support
- CI workflows (test + publish)
