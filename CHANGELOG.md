# Changelog

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
