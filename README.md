# @flowchart-sequence-designer/angular

[![npm](https://img.shields.io/npm/v/@flowchart-sequence-designer/angular)](https://www.npmjs.com/package/@flowchart-sequence-designer/angular)
[![CI](https://github.com/ag-gr-hub/flowchart-sequence-designer-angular/actions/workflows/test.yml/badge.svg)](https://github.com/ag-gr-hub/flowchart-sequence-designer-angular/actions)

Angular wrapper for [flowchart-sequence-designer](https://www.npmjs.com/package/flowchart-sequence-designer) — embed the full-featured flowchart & sequence-diagram editor in Angular apps using standalone components.

## Installation

```bash
npm install @flowchart-sequence-designer/angular flowchart-sequence-designer react react-dom
```

## Components

| Component | Selector | Description |
|-----------|----------|-------------|
| `FsdDiagramComponent` | `<fsd-diagram>` | Full diagram editor (flowchart/question/journey) |
| `FsdSequenceComponent` | `<fsd-sequence>` | Sequence diagram editor |
| `FsdToolbarComponent` | `<fsd-toolbar>` | Standalone export/import toolbar |
| `FsdStepEditorComponent` | `<fsd-step-editor>` | Node property editor panel |

All components are **standalone** — import them directly, no NgModule required.

## Quick Start

### Flowchart Editor

```typescript
import { Component } from '@angular/core';
import { FsdDiagramComponent } from '@flowchart-sequence-designer/angular';
import type { DiagramModel } from '@flowchart-sequence-designer/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FsdDiagramComponent],
  template: `
    <fsd-diagram
      [height]="600"
      [theme]="'dark'"
      [allowImport]="true"
      (modelChange)="onModelChange($event)"
      (exportEvent)="onExport($event)"
    />
  `,
})
export class AppComponent {
  onModelChange(model: DiagramModel) {
    console.log('Model updated:', model);
  }

  onExport(event: { format: string; content: string | Blob }) {
    console.log('Exported:', event.format);
  }
}
```

### Sequence Diagram Editor

```typescript
import { Component } from '@angular/core';
import { FsdSequenceComponent, presetSequenceModel } from '@flowchart-sequence-designer/angular';

@Component({
  selector: 'app-sequence',
  standalone: true,
  imports: [FsdSequenceComponent],
  template: `
    <fsd-sequence
      [initialModel]="model"
      [height]="500"
      [theme]="'auto'"
      (modelChange)="onModelChange($event)"
    />
  `,
})
export class SequencePageComponent {
  model = presetSequenceModel();
  onModelChange(model: any) { /* ... */ }
}
```

### Using with an Initial Model

```typescript
import { presetFlowchartModel, emptyModel } from '@flowchart-sequence-designer/angular';

// Pre-built flowchart with sample nodes
const flowchart = presetFlowchartModel('flowchart');

// Empty model of any type
const blank = emptyModel('flowchart', 'question');
```

## API Reference

### `<fsd-diagram>` — FsdDiagramComponent

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `initialModel` | `DiagramModel` | preset | Pre-populate the editor |
| `height` | `string \| number` | `'500px'` | Container height |
| `allowedExports` | `ExportFormat[]` | all | Restrict export menu |
| `allowImport` | `boolean` | `false` | Show import button |
| `variant` | `'flowchart' \| 'question' \| 'journey'` | `'flowchart'` | Editor variant |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Color theme |
| `themeOverrides` | `Partial<ThemeColors>` | — | Custom colors |

| Output | Payload | Description |
|--------|---------|-------------|
| `modelChange` | `DiagramModel` | Emitted on every edit |
| `exportEvent` | `{ format, content }` | Emitted when user exports |

**Note:** Changing `initialModel` after first render will re-mount the entire editor (full reset).

### `<fsd-sequence>` — FsdSequenceComponent

Same as `<fsd-diagram>` except no `variant` input.

### `<fsd-toolbar>` — FsdToolbarComponent

| Input | Type | Description |
|-------|------|-------------|
| `allowedExports` | `ExportFormat[]` | Which formats to show |
| `allowImport` | `boolean` | Show import button |

| Output | Payload | Description |
|--------|---------|-------------|
| `exportRequest` | `ExportFormat` | Format the user chose |
| `importRequest` | `string` | Raw text the user imported |

### `<fsd-step-editor>` — FsdStepEditorComponent

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `nodeId` | `string` | ✓ | ID of the node to edit |
| `model` | `DiagramModel` | ✓ | Current diagram model |
| `variant` | `DiagramVariant` | | Editor variant |
| `isDark` | `boolean` | | Dark mode flag |
| `themeColors` | `ThemeColors` | | Theme color overrides |

| Output | Payload | Description |
|--------|---------|-------------|
| `modelChange` | `DiagramModel` | Updated model after edit |

## Re-exported Types

For convenience, common types are re-exported so you don't need a separate import:

```typescript
import type {
  DiagramModel,
  DiagramNode,
  DiagramEdge,
  DiagramType,
  DiagramVariant,
  ExportFormat,
  NodeShape,
  SequenceMessage,
  DiagramEditorProps,
  SequenceEditorProps,
  ThemeColors,
  SequenceThemeColors,
} from '@flowchart-sequence-designer/angular';
```

## Architecture

This wrapper uses a lightweight **React Bridge** pattern:

1. Each Angular component creates a React root inside its template `<div>`
2. Angular `@Input()` values are mapped to React props
3. React `onChange`/`onExport` callbacks are wrapped in `NgZone.run()` to trigger Angular change detection
4. React internal renders run **outside** Angular's zone (no unnecessary CD cycles)
5. On `ngOnDestroy`, the React root is cleanly unmounted

### Performance Considerations

- **OnPush compatible** — all components use `ChangeDetectionStrategy.OnPush`
- **Zone-optimized** — React renders don't trigger Angular's zone; only explicit outputs do
- **Lazy-loaded** — the React editor is loaded via dynamic `import()` (code-split friendly)
- **Minimal overhead** — the bridge is ~1KB; React+ReactDOM peer deps add ~45KB gzipped

## Requirements

- Angular 16+ (standalone components)
- `flowchart-sequence-designer` ≥ 1.2.0
- `react` & `react-dom` ≥ 18

## License

MIT
