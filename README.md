# @flowchart-sequence-designer/angular

[![npm](https://img.shields.io/npm/v/@flowchart-sequence-designer/angular)](https://www.npmjs.com/package/@flowchart-sequence-designer/angular)
[![CI](https://github.com/ag-gr-hub/flowchart-sequence-designer-angular/actions/workflows/test.yml/badge.svg)](https://github.com/ag-gr-hub/flowchart-sequence-designer-angular/actions)

Angular wrapper for [flowchart-sequence-designer](https://www.npmjs.com/package/flowchart-sequence-designer) — embed the full-featured flowchart & sequence-diagram editor in Angular apps using standalone components.

## Installation

```bash
npm install @flowchart-sequence-designer/angular flowchart-sequence-designer react react-dom
```

## Quick Start

### Flowchart Editor

```typescript
import { Component } from '@angular/core';
import { FsdDiagramComponent } from '@flowchart-sequence-designer/angular';
import type { DiagramModel } from 'flowchart-sequence-designer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FsdDiagramComponent],
  template: `
    <fsd-diagram
      [height]="600"
      [theme]="'dark'"
      (modelChange)="onModelChange($event)"
    />
  `,
})
export class AppComponent {
  onModelChange(model: DiagramModel) {
    console.log('Model updated:', model);
  }
}
```

### Sequence Diagram Editor

```typescript
import { Component } from '@angular/core';
import { FsdSequenceComponent } from '@flowchart-sequence-designer/angular';

@Component({
  selector: 'app-sequence',
  standalone: true,
  imports: [FsdSequenceComponent],
  template: `
    <fsd-sequence
      [height]="500"
      [theme]="'auto'"
      (modelChange)="onModelChange($event)"
      (exportEvent)="onExport($event)"
    />
  `,
})
export class SequencePageComponent {
  onModelChange(model: any) { /* ... */ }
  onExport(event: { format: string; content: string | Blob }) { /* ... */ }
}
```

## API

### `<fsd-diagram>` — FsdDiagramComponent

| Input | Type | Description |
|-------|------|-------------|
| `initialModel` | `DiagramModel` | Pre-populate the editor |
| `height` | `string \| number` | Container height (default `'500px'`) |
| `allowedExports` | `ExportFormat[]` | Restrict export menu options |
| `allowImport` | `boolean` | Show import button |
| `variant` | `'flowchart' \| 'question' \| 'journey'` | Editor variant |
| `theme` | `'light' \| 'dark' \| 'auto'` | Color theme |
| `themeOverrides` | `Partial<ThemeColors>` | Custom colors |

| Output | Payload | Description |
|--------|---------|-------------|
| `modelChange` | `DiagramModel` | Emitted on every edit |
| `exportEvent` | `{ format, content }` | Emitted when user exports |

### `<fsd-sequence>` — FsdSequenceComponent

Same as above except no `variant` input.

## Requirements

- Angular 16+ (standalone components)
- `flowchart-sequence-designer` ≥ 1.2.0
- `react` & `react-dom` ≥ 18

## How It Works

This wrapper uses a lightweight React bridge that:
1. Creates a React root inside the Angular component's DOM element
2. Renders the React editor component with props derived from Angular inputs
3. Re-renders on input changes and cleanly unmounts on destroy

The React + ReactDOM peer dependency adds ~45 KB gzipped. The diagram editor itself (SVG canvas, toolbar, import/export) runs entirely within React's subtree.

## License

MIT
