# Contributing

Thanks for your interest in improving `@flowchart-sequence-designer/angular`. This guide covers everything you need to get set up locally and submit a change.

## Development setup

Requires [Node.js](https://nodejs.org) 18+ and npm.

```bash
git clone https://github.com/ag-gr-hub/flowchart-sequence-designer-angular.git
cd flowchart-sequence-designer-angular
npm install
```

### Scripts

| Command | What it does |
|---|---|
| `npm run build` | Compile to `dist/` (ESM + CJS + `.d.ts`) |
| `npm run typecheck` | `tsc --noEmit` — type-check without emitting |
| `npm test` | Run the Jest test suite |
| `npm run lint` | ESLint over `src/` |
| `npm run format` | Prettier-format source files |
| `npm run format:check` | Check formatting without writing |

### Running the demo locally

```bash
npm run build              # build the wrapper first
cd demo
npm install
npm start                  # opens http://localhost:4200
```

The demo app imports the wrapper from the parent directory, so it reflects whatever you just built. Re-run `npm run build` in the root after changes.

## Project layout

```
src/
├── react-bridge.ts                # React↔Angular lifecycle bridge
├── diagram-editor.component.ts    # <fsd-diagram> component
├── sequence-editor.component.ts   # <fsd-sequence> component
├── toolbar.component.ts           # <fsd-toolbar> component
├── step-editor.component.ts       # <fsd-step-editor> component
├── index.ts                       # Barrel exports
├── __mocks__/                     # Jest module mocks
├── react-bridge.spec.ts           # Bridge unit tests
└── components.spec.ts             # Component unit tests
demo/                              # Angular app — live demo
docs/                              # GitHub Pages documentation
```

## Making a change

1. **Open an issue first** for non-trivial work (new features, breaking changes) so we can align on scope before you write code.
2. Fork, branch (`feat/foo` or `fix/bar`), commit, push, open a PR against `main`.
3. Make sure these all pass before requesting review:
   - `npm run typecheck`
   - `npm test`
   - `npm run build`
4. Add a `CHANGELOG.md` entry under `## [Unreleased]` describing the change.
5. If you added a feature, update the `README.md` and the demo app.

## Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/) loosely:

```
feat: <what>          # new feature
fix: <what>           # bug fix
docs: <what>          # README/CHANGELOG/comments
refactor: <what>      # no behavior change
test: <what>          # tests only
chore: <what>         # tooling, CI, deps
```

## Code style

- TypeScript strict mode is on — keep it that way.
- No `any`. Use `unknown` and narrow.
- Two-space indent, single quotes, semicolons.
- Prefer named exports over default exports.
- No comments that explain *what* the code does — only *why* if non-obvious.
- All Angular components must be `standalone` and use `ChangeDetectionStrategy.OnPush`.

## Reporting bugs

Open a [GitHub issue](https://github.com/ag-gr-hub/flowchart-sequence-designer-angular/issues/new/choose) with:
- A minimal reproduction
- What you expected vs. what happened
- Your environment (Node version, Angular version, OS)

## Code of Conduct

By participating, you agree to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md).
