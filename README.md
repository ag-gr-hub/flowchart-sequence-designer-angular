# @flowchart-sequence-designer/angular

[![npm](https://img.shields.io/npm/v/@flowchart-sequence-designer/angular)](https://www.npmjs.com/package/@flowchart-sequence-designer/angular)
[![CI](https://github.com/ag-gr-hub/flowchart-sequence-designer-angular/actions/workflows/test.yml/badge.svg)](https://github.com/ag-gr-hub/flowchart-sequence-designer-angular/actions)
[![CodeQL](https://github.com/ag-gr-hub/flowchart-sequence-designer-angular/actions/workflows/codeql.yml/badge.svg)](https://github.com/ag-gr-hub/flowchart-sequence-designer-angular/actions/workflows/codeql.yml)

Angular wrapper for [flowchart-sequence-designer](https://www.npmjs.com/package/flowchart-sequence-designer) — embed the full-featured flowchart & sequence-diagram editor in Angular apps using standalone components.

**🔗 [Live demo & developer docs →](https://ag-gr-hub.github.io/flowchart-sequence-designer-angular/)**
Open it to drive the editor, switch variants (Flowchart / Question / Journey / Sequence), and explore the docs tab for API snippets. Every variant boots with a working sample diagram so you can poke without any setup.

## Installation

```bash
npm install @flowchart-sequence-designer/angular flowchart-sequence-designer react react-dom
```

Angular 16+ is required (standalone components). The core API has zero runtime dependencies; React 18+ is a peer dependency for the visual editor.

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

That's it — no provider, no theme setup, no required inputs. The editor
mounts with a sample diagram, a working toolbar, undo/redo, drag-to-pan,
scroll-to-zoom, and export buttons for Mermaid / PlantUML / JSON / SVG /
PNG. Pass `[theme]="'dark'"` or `[themeOverrides]="brandColors"` to
brand-match, or `[initialModel]="emptyModel('flowchart')"` to start blank.

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

---

## Programmatic API

The core library (`flowchart-sequence-designer`) exposes a fluent builder API, import/export functions, and a low-level Model class. These are re-exported from `@flowchart-sequence-designer/angular` for convenience.

### Flowchart builder

```typescript
import { flowchart } from 'flowchart-sequence-designer';

const diagram = flowchart('Order Flow')
  .node('start',   'Start',           { shape: 'circle' })
  .node('check',   'Payment valid?',  { shape: 'diamond' })
  .node('success', 'Confirm order',   { shape: 'rectangle' })
  .node('fail',    'Reject',          { shape: 'rectangle' })
  .edge('start',   'check')
  .edge('check',   'success', { label: 'Yes' })
  .edge('check',   'fail',    { label: 'No' });

console.log(diagram.toMermaid());
```

#### Node shapes

| Shape | Description |
|---|---|
| `rectangle` | Standard process box (default) |
| `diamond` | Decision / branch |
| `circle` | Start or end terminal |
| `parallelogram` | Input / output |

#### Edge options

```typescript
.edge(from, to, {
  label?: string,
  style?: 'solid' | 'dashed' | 'dotted',
  arrowhead?: 'arrow' | 'open' | 'none',
})
```

---

### Sequence diagram builder

```typescript
import { sequence } from 'flowchart-sequence-designer';

const diagram = sequence('Auth Flow')
  .actor('User')
  .actor('Server')
  .message('User',   'Server', 'POST /login')
  .message('Server', 'User',   '200 OK + token', { style: 'dashed' });

console.log(diagram.toMermaid());
```

Actors auto-register from `message()` calls, so you can skip `.actor()` if you prefer.

---

### Export formats

Every builder exposes the same export methods:

```typescript
diagram.toMermaid()   // string
diagram.toPlantUML()  // string
diagram.toJSON()      // string (serialised DiagramModel)
diagram.toSVG()       // string (SVG markup)
diagram.toPNG()       // Promise<Blob>  (browser only)
```

---

### Import

```typescript
import { fromMermaid, fromJSON } from 'flowchart-sequence-designer';

const model = fromMermaid('graph TD; A-->B; B-->C');
const model2 = fromJSON(jsonString);
```

Round-trip fidelity: `fromMermaid(diagram.toMermaid())` produces an equivalent model.

You can also feed imported models directly into the Angular component:

```typescript
import { Component } from '@angular/core';
import { FsdDiagramComponent } from '@flowchart-sequence-designer/angular';
import { fromMermaid } from 'flowchart-sequence-designer';

@Component({
  standalone: true,
  imports: [FsdDiagramComponent],
  template: `<fsd-diagram [initialModel]="model" />`,
})
export class ImportedComponent {
  model = fromMermaid('graph TD; A-->B; B-->C');
}
```

---

### Exporter / importer round-trip rules

The five export formats trade fidelity for portability:

| Format | Round-trip | Preserved | Dropped or lossy |
|---|---|---|---|
| **JSON** | ✅ full | every field — `variant`, `metadata`, `waypoint`, x/y positions, edge arrowheads, message order | nothing |
| **Mermaid (flowchart)** | partial | node shapes (`[]` `{}` `(())` `[/]`), labels, edge connectors (`-->`, `-.->`, `---`, `-.-`), edge labels, `subgraph` → `metadata.group` | positions, `waypoint`, `metadata.answers`, `variant`. Dotted edges collapse to dashed. |
| **Mermaid (sequence)** | partial | actor order, message arrows (`->>`, `-->>`), labels | message metadata, styling overrides |
| **PlantUML (flowchart)** | export-only | edge styles (`-->` / `-[dashed]->` / `-[dotted]->`), labels, node id | shape distinctions (PlantUML state-diagram syntax is coarser), positions, `metadata`, `variant` |
| **PlantUML (sequence)** | export-only | actor order, message style (`->`, `-->`), labels | – |
| **SVG** | export-only (rendered) | full visual parity with the canvas — same dot grid, same edge curves, same node styling | – |
| **PNG** | export-only (rendered, **browser-only**) | same as SVG, rasterized at `devicePixelRatio` | – |

If you need 100% round-trip fidelity, use JSON. If you need a format that
GitHub renders inline in markdown, use Mermaid. If you need a polished
image for documentation, use SVG or PNG.

---

### Presets & empty models

```typescript
import {
  presetFlowchartModel,
  presetSequenceModel,
  emptyModel,
} from '@flowchart-sequence-designer/angular';

presetFlowchartModel('flowchart')  // 6-node order flow with one decision
presetFlowchartModel('question')   // 1-question / 3-answer router
presetFlowchartModel('journey')    // 5-step onboarding sequence
presetSequenceModel()              // 3-actor login handshake

emptyModel('flowchart')            // { type:'flowchart', variant:'flowchart', nodes:[], edges:[] }
emptyModel('flowchart', 'journey') // same with variant: 'journey'
emptyModel('sequence')             // { type:'sequence', nodes:[], edges:[], actors:[], messages:[] }
```

All presets return a deep clone — mutate the result freely.

---

### Working with the model directly

```typescript
import { Model } from 'flowchart-sequence-designer';

const m = new Model('flowchart');
m.addNode({ id: 'a', label: 'Step A', shape: 'rectangle' });
m.addNode({ id: 'b', label: 'Step B', shape: 'rectangle' });
m.addEdge({ id: 'e1', from: 'a', to: 'b', label: 'next' });

console.log(m.toMermaid());
```

---

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

Same as `<fsd-diagram>` except no `variant` input. Accepts `Partial<SequenceThemeColors>` for `themeOverrides`.

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

---

### Diagram variants

| Variant | Description |
|---|---|
| `flowchart` | General purpose — any shapes, freeform connections |
| `question` | Each node is a question with lettered answer options (A, B, C…). Each answer has its own connection port. |
| `journey` | Numbered milestone steps — user path or process walkthrough |

---

### Editor features

**Canvas**
- Drag nodes to reposition (snaps to 24px grid)
- Scroll to zoom in/out (pinch to zoom on touch)
- Drag the canvas background to pan (one-finger pan on touch)
- Double-click a node to rename it inline
- Dashed alignment guides appear when a dragged node lines up with a sibling's edge or center, and it snaps within 4 px
- Bottom-right minimap — click or drag to pan the viewport
- Accessibility: every node, port, and control is keyboard-reachable with a visible focus ring; selection / add / delete actions announce via an `aria-live` status region; the edge-flow animation honours `prefers-reduced-motion`

**Connecting nodes**
- Hover a node to reveal the bottom port dot, then drag it to another node
- Question variant: each answer row has its own port dot — drag it to route that answer to a specific node

**Node Navigator (left panel)**
- Lists all nodes with shape badge, label, and connection counts
- Search/filter by name
- Click any row to jump to that node and center the canvas on it
- Collapses to a slim icon strip

**Step Editor (right panel)**
- Appears when a node is selected
- Edit the node name, change its shape
- Manage branches / answer options (add, remove, reorder)
- Question variant shows connection status per answer

**Context menu** (right-click)
- On canvas: Add node at cursor, Re-center, Undo, Redo
- On node: Rename, Duplicate, Disconnect all edges, Delete
- On edge: Style (solid/dashed/dotted), Arrowhead, Reset routing, Delete
- On touch devices: long-press the canvas (~550ms) opens the canvas menu

---

### Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Redo |
| `Ctrl+0` | Fit all nodes in view |
| `Ctrl+C` / `Ctrl+V` | Copy and paste the current selection (internal edges preserved, +24 px offset on paste) |
| `Ctrl+D` | Duplicate the current selection |
| `Delete` / `Backspace` | Remove the current selection |
| `Escape` | Deselect, cancel in-flight edge drag, close context menu |
| `Arrow` keys | Nudge selection by 1 grid unit (Shift = 4 units) |
| `Alt+Arrow` | Traverse to the nearest node in that direction from the current selection |
| `Shift+click` | Toggle a node in/out of the current selection |
| `Shift+drag` (empty canvas) | Box-select — add every intersected node to the selection |
| Double-click edge label | Rename the edge label inline |
| Drag edge midpoint | Route the edge through a waypoint (right-click → Reset routing to clear) |

---

### Theming

```typescript
// Force dark
<fsd-diagram [theme]="'dark'" />

// Force light
<fsd-diagram [theme]="'light'" />

// Follow system prefers-color-scheme (default)
<fsd-diagram [theme]="'auto'" />
```

To match the editor to a host application's brand, pass `themeOverrides` —
a `Partial<ThemeColors>` that is shallow-merged on top of the resolved
light/dark palette:

```typescript
import { Component } from '@angular/core';
import { FsdDiagramComponent } from '@flowchart-sequence-designer/angular';
import type { ThemeColors } from '@flowchart-sequence-designer/angular';

@Component({
  standalone: true,
  imports: [FsdDiagramComponent],
  template: `<fsd-diagram [theme]="'dark'" [themeOverrides]="brand" />`,
})
export class BrandedComponent {
  brand: Partial<ThemeColors> = {
    canvas: '#0b1020',
    nodeFill: '#111a2e',
    nodeStroke: '#2b3a5a',
    nodeSelectedFill: '#1a2447',
    edgeColor: '#7b8aa6',
    textPrimary: '#e6edf7',
  };
}
```

#### ThemeColors token groups (flowchart)

| Token group | Members | Where it shows up |
|---|---|---|
| Canvas | `canvas`, `dot` | Background + dot grid |
| Nodes | `nodeFill`, `nodeStroke`, `nodeSelectedFill` | Node body, border, selection tint |
| Edges | `edgeColor` | Edge stroke + arrowhead |
| Type ramp | `textPrimary`, `textSecondary`, `textMuted` | Labels, hints, secondary text |
| Chrome — panel | `panelBg`, `panelBorder` | Side panel surface |
| Chrome — controls | `ctrlsBg`, `ctrlsBorder` | Toolbar, zoom controls |
| Chrome — input | `inputBg`, `inputBorder`, `inputText` | Form fields in the side panel |
| Chrome — card | `cardBg`, `cardBorder` | Answer rows, branch rows |
| Chrome — section | `sectionBorder` | Divider between panel sections |
| Buttons | `btnSecBg`, `btnSecText`, `shapeBtnBg`, `shapeBtnBorder` | Secondary buttons, shape picker |
| Accents | `addFormBg`, `bannerBg`, `labelText`, `hintText`, `statusBg` | Add-form backdrop, validation banner |

#### SequenceThemeColors (sequence)

The sequence editor accepts the same `[themeOverrides]` input with a
slightly different shape — `Partial<SequenceThemeColors>`. It drops
node-specific tokens and adds `lifeline`, `arrow`, and `actorFill` /
`actorStroke` / `actorText` for the swim-lane elements.

---

### Restricting exports and import

```typescript
// Only allow JSON and SVG download
<fsd-diagram [allowedExports]="['json', 'svg']" />

// Hide the import button entirely
<fsd-diagram [allowImport]="false" />

// Handle exports yourself (e.g. send to an API)
<fsd-diagram
  (exportEvent)="handleExport($event)"
/>
// In component: handleExport(e: { format: string; content: string | Blob }) { ... }
```

---

## Accessibility & touch

The editor is keyboard-first and screen-reader-aware. Every interaction
reachable by mouse has a keyboard equivalent; every state change announces
via a polite `aria-live` region.

**Keyboard navigation** — Every node, port, and toolbar control is reachable
with Tab; selection moves with Arrow keys (1 grid unit, or 4 with Shift);
Alt+Arrow traverses the graph to the nearest connected neighbor in that
direction. The focus ring is visible at all times.

**ARIA roles** — The canvas is an `application` region with an `aria-label`;
selection, add, and delete actions update an `aria-live="polite"` status
region announced as "Selected {label}", "Added node {label}", etc. The
toolbar uses native `<button>` elements with explicit labels.

**Reduced motion** — The animated edge-flow dash honours
`prefers-reduced-motion` — when set, the dash freezes and the canvas renders
with no animation.

**Touch interactions:**
| Action | Gesture |
|---|---|
| Pan | One-finger drag on the canvas background |
| Zoom | Two-finger pinch |
| Context menu | Long-press (~550 ms) on the canvas or on a node |
| Larger hit targets | Port circles auto-enlarge on coarse-pointer devices (24 px vs. 14 px on mouse) |
| Drag node | Press and drag the node body. The 8 px drag threshold lets you tap to select without nudging. |

---

## Security

This package uses the same core editor as the React version, which takes
security seriously:

- **Input sanitization** — All user-provided text is sanitized before rendering
  (HTML tags, `javascript:`/`data:`/`vbscript:` URIs, `on*` event handlers, and
  control characters are stripped).
- **Resource limits** — Importers enforce hard caps (500 nodes, 2000 edges, 100
  actors, 2000 messages, 2MB input) to prevent resource exhaustion.
- **Prototype pollution defense** — JSON importer strips `__proto__`,
  `constructor`, and `prototype` keys recursively.
- **SVG export** — Defence-in-depth: sanitize first, then XML-escape. Safe even
  if consumed by less-strict parsers.
- **No `eval` / `innerHTML`** — The codebase never uses dynamic code execution
  or raw HTML injection.
- **CodeQL** — Automated security scanning runs weekly and on every PR.
- **Dependabot** — Dependency updates monitored weekly.

---

## Framework Wrappers

| Framework | Package | Docs |
|-----------|---------|------|
| React | [`flowchart-sequence-designer`](https://www.npmjs.com/package/flowchart-sequence-designer) | [Docs & Demo](https://ag-gr-hub.github.io/flowchart-sequence-designer/) |
| Angular | [`@flowchart-sequence-designer/angular`](https://www.npmjs.com/package/@flowchart-sequence-designer/angular) | [Docs & Demo](https://ag-gr-hub.github.io/flowchart-sequence-designer-angular/) |
| Vue | [`@flowchart-sequence-designer/vue`](https://www.npmjs.com/package/@flowchart-sequence-designer/vue) | [Docs & Demo](https://ag-gr-hub.github.io/flowchart-sequence-designer-vue/) |

---

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

### `DiagramModel`

```typescript
interface DiagramModel {
  type: 'flowchart' | 'sequence';
  variant?: DiagramVariant;    // 'flowchart' | 'question' | 'journey' (flowchart-type only)
  title?: string;
  nodes: DiagramNode[];        // always present (empty array for sequence models)
  edges: DiagramEdge[];        // always present (empty array for sequence models)
  actors?: string[];           // sequence models only — ordered actor names
  messages?: SequenceMessage[]; // sequence models only — ordered messages
}
```

### `DiagramNode`

```typescript
interface DiagramNode {
  id: string;
  label: string;
  shape?: 'rectangle' | 'diamond' | 'circle' | 'parallelogram';
  x?: number;
  y?: number;
  metadata?: Record<string, unknown>;
  // question variant: metadata.answers = string[]
}
```

### `DiagramEdge`

```typescript
interface DiagramEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  style?: 'solid' | 'dashed' | 'dotted';
  arrowhead?: 'arrow' | 'none' | 'open';
  waypoint?: { x: number; y: number }; // manual routing point (JSON only)
}
```

### `SequenceMessage`

```typescript
interface SequenceMessage {
  id: string;
  from: string;            // actor name
  to: string;              // actor name
  label: string;
  style?: 'solid' | 'dashed';
}
```

### `ValidationError`

```typescript
interface ValidationError {
  kind: 'dangling-from' | 'dangling-to' | 'duplicate-node-id' | 'duplicate-edge-id';
  id: string;
  message: string;
}
```

---

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

---

## Package structure

```
@flowchart-sequence-designer/angular/
├── dist/
│   ├── index.js / index.d.ts        ← Angular components + re-exports
│   └── public-api.ts                ← barrel export
└── src/
    ├── lib/
    │   ├── fsd-diagram.component.ts  # <fsd-diagram> (flowchart/question/journey)
    │   ├── fsd-sequence.component.ts # <fsd-sequence>
    │   ├── fsd-toolbar.component.ts  # <fsd-toolbar>
    │   └── fsd-step-editor.component.ts # <fsd-step-editor>
    └── public-api.ts                 # types + component re-exports
```

---

## Building from source

```bash
npm install
npm run build        # library → dist/
cd demo && npx ng build   # demo app
npm test             # unit tests
```

---

## Requirements

- Angular 16+ (standalone components)
- `flowchart-sequence-designer` ≥ 1.2.0
- `react` & `react-dom` ≥ 18

## License

MIT
