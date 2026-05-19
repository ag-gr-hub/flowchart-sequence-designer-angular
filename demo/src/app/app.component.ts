import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {
  FsdDiagramComponent,
  FsdSequenceComponent,
  presetFlowchartModel,
  presetSequenceModel,
} from '@flowchart-sequence-designer/angular';
import type { DiagramModel, ExportFormat } from '@flowchart-sequence-designer/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JsonPipe, FsdDiagramComponent, FsdSequenceComponent],
  template: `
    <!-- Single top nav (mirrors React layout) -->
    <nav class="topnav">
      <a class="brand" href="https://github.com/ag-gr-hub/flowchart-sequence-designer-angular" target="_blank">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#dd0031"><path d="M12 2L2 7l1.63 14.27L12 22l8.37-3.73L22 7L12 2zm0 2.21l6.9 3.33-.98 8.56L12 19.77l-5.92-3.67-.98-8.56L12 4.21z"/></svg>
        &#64;flowchart-sequence-designer/angular
      </a>

      <button [class.active]="tab === 'flowchart'" (click)="switchTab('flowchart')">
        <span class="tab-label">Flowchart</span>
        <span class="tab-desc">General purpose — any shapes, any flow</span>
      </button>
      <button [class.active]="tab === 'question'" (click)="switchTab('question')">
        <span class="tab-label">Question Flow</span>
        <span class="tab-desc">Each node is a question; answers are side-by-side</span>
      </button>
      <button [class.active]="tab === 'journey'" (click)="switchTab('journey')">
        <span class="tab-label">Journey Map</span>
        <span class="tab-desc">Numbered milestone steps</span>
      </button>
      <button [class.active]="tab === 'sequence'" (click)="switchTab('sequence')">
        <span class="tab-label">Sequence</span>
        <span class="tab-desc">Actor lifelines + ordered messages</span>
      </button>
      <button class="docs-tab" [class.active]="tab === 'docs'" (click)="tab = 'docs'">
        <span class="tab-label">For Developers</span>
        <span class="tab-desc">API &amp; programmatic usage</span>
      </button>

      <div class="nav-spacer"></div>
      <div class="theme-toggle">
        @for (t of themes; track t) {
          <button [class.active]="theme === t" (click)="theme = t">
            {{ t === 'light' ? '☀ Light' : t === 'dark' ? '☾ Dark' : '⊙ Auto' }}
          </button>
        }
      </div>
    </nav>

    <!-- Content -->
    @if (tab === 'docs') {
      <main class="docs-page">
        <div class="docs-sidebar">
          <div class="sidebar-heading">Documentation</div>
          <a href="#install">Install</a>
          <a href="#quick-start">Quick Start</a>
          <div class="sidebar-group">Components</div>
          <a href="#fsd-diagram">fsd-diagram</a>
          <a href="#fsd-sequence">fsd-sequence</a>
          <div class="sidebar-group">Reference</div>
          <a href="#inputs">Inputs</a>
          <a href="#outputs">Outputs</a>
          <a href="#theming">Theming</a>
          <a href="#types">TypeScript Types</a>
          <div class="sidebar-divider"></div>
          <a href="https://ag-gr-hub.github.io/flowchart-sequence-designer/" target="_blank">↗ React Version</a>
          <a href="https://github.com/ag-gr-hub/flowchart-sequence-designer-angular" target="_blank">↗ GitHub</a>
          <a href="https://www.npmjs.com/package/@flowchart-sequence-designer/angular" target="_blank">↗ npm</a>
        </div>
        <div class="docs-content">
          <!-- Supported Frameworks -->
          <div class="frameworks-box">
            <div class="frameworks-label">Supported Frameworks</div>
            <div class="frameworks-pills">
              <a href="https://ag-gr-hub.github.io/flowchart-sequence-designer/" class="fw-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="currentColor" stroke-width="1"/><ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="currentColor" stroke-width="1" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="currentColor" stroke-width="1" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="2"/></svg>
                React
              </a>
              <a href="https://ag-gr-hub.github.io/flowchart-sequence-designer-angular/" class="fw-pill fw-active">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l1.63 14.27L12 22l8.37-3.73L22 7L12 2zm0 2.21l6.9 3.33-.98 8.56L12 19.77l-5.92-3.67-.98-8.56L12 4.21z"/></svg>
                Angular (current)
              </a>
            </div>
          </div>

          <!-- Hero -->
          <h1 class="docs-title">&#64;flowchart-sequence-designer/angular</h1>
          <p class="docs-subtitle">Angular wrapper components for the flowchart-sequence-designer library. Provides native Angular components with full two-way binding for diagram and sequence editors.</p>

          <!-- Install -->
          <section id="install">
            <h2>Install</h2>
            <div class="code-block"><code>npm install &#64;flowchart-sequence-designer/angular</code></div>
            <p class="docs-note">Peer dependencies: Angular 17+, flowchart-sequence-designer, react, react-dom</p>
          </section>

          <!-- Quick Start -->
          <section id="quick-start">
            <h2>Quick Start</h2>
            <div class="code-block"><code><span class="kw">import</span> {{ '{' }} FsdDiagramComponent, presetFlowchartModel {{ '}' }} <span class="kw">from</span> <span class="str">'&#64;flowchart-sequence-designer/angular'</span>;

&#64;Component({{ '{' }}
  standalone: <span class="kw">true</span>,
  imports: [FsdDiagramComponent],
  template: <span class="str">\`
    &lt;fsd-diagram
      [initialModel]="model"
      [height]="600"
      [variant]="'flowchart'"
      [theme]="'auto'"
      (modelChange)="onModelChange($event)"
    /&gt;
  \`</span>
{{ '}' }})
<span class="kw">export class</span> MyComponent {{ '{' }}
  model = presetFlowchartModel(<span class="str">'flowchart'</span>);
  onModelChange(m: DiagramModel) {{ '{' }} console.log(m); {{ '}' }}
{{ '}' }}</code></div>
          </section>

          <!-- Components -->
          <section id="fsd-diagram">
            <h2>&lt;fsd-diagram&gt;</h2>
            <p>Full-featured flowchart editor with drag-and-drop, connection drawing, and export capabilities.</p>
            <table class="props-table">
              <tr><th>Input</th><th>Type</th><th>Description</th></tr>
              <tr><td><code>[initialModel]</code></td><td>DiagramModel</td><td>Initial diagram data</td></tr>
              <tr><td><code>[height]</code></td><td>string | number</td><td>Editor height (px, %, calc, vh)</td></tr>
              <tr><td><code>[variant]</code></td><td>'flowchart' | 'question' | 'journey'</td><td>Editor variant</td></tr>
              <tr><td><code>[theme]</code></td><td>'light' | 'dark' | 'auto'</td><td>Color theme</td></tr>
              <tr><td><code>[allowImport]</code></td><td>boolean</td><td>Show import button</td></tr>
              <tr><td><code>[allowedExports]</code></td><td>ExportFormat[]</td><td>Enabled export formats</td></tr>
              <tr><td><code>[themeOverrides]</code></td><td>Partial&lt;ThemeColors&gt;</td><td>Custom color overrides</td></tr>
            </table>
            <table class="props-table">
              <tr><th>Output</th><th>Type</th><th>Description</th></tr>
              <tr><td><code>(modelChange)</code></td><td>DiagramModel</td><td>Emitted on every edit</td></tr>
              <tr><td><code>(exportEvent)</code></td><td>{{ '{' }} format, content {{ '}' }}</td><td>Emitted on export action</td></tr>
            </table>
          </section>

          <section id="fsd-sequence">
            <h2>&lt;fsd-sequence&gt;</h2>
            <p>Sequence diagram editor with actor lifelines and ordered messages.</p>
            <table class="props-table">
              <tr><th>Input</th><th>Type</th><th>Description</th></tr>
              <tr><td><code>[initialModel]</code></td><td>DiagramModel</td><td>Initial sequence data</td></tr>
              <tr><td><code>[height]</code></td><td>string | number</td><td>Editor height</td></tr>
              <tr><td><code>[theme]</code></td><td>'light' | 'dark' | 'auto'</td><td>Color theme</td></tr>
              <tr><td><code>[allowImport]</code></td><td>boolean</td><td>Show import button</td></tr>
              <tr><td><code>[themeOverrides]</code></td><td>Partial&lt;SequenceThemeColors&gt;</td><td>Custom color overrides</td></tr>
            </table>
            <table class="props-table">
              <tr><th>Output</th><th>Type</th><th>Description</th></tr>
              <tr><td><code>(modelChange)</code></td><td>DiagramModel</td><td>Emitted on every edit</td></tr>
              <tr><td><code>(exportEvent)</code></td><td>{{ '{' }} format, content {{ '}' }}</td><td>Emitted on export action</td></tr>
            </table>
          </section>

          <!-- Theming -->
          <section id="theming">
            <h2>Theming</h2>
            <div class="code-block"><code>&lt;fsd-diagram
  [theme]="'dark'"
  [themeOverrides]="{{ '{' }} canvasBg: '#1a1a2e', nodeBg: '#2d2d44' {{ '}' }}"
/&gt;</code></div>
          </section>

          <!-- Types -->
          <section id="types">
            <h2>TypeScript Types</h2>
            <div class="code-block"><code><span class="kw">import type</span> {{ '{' }}
  DiagramModel,
  DiagramNode,
  DiagramConnection,
  ExportFormat,
  ThemeColors,
  SequenceThemeColors,
{{ '}' }} <span class="kw">from</span> <span class="str">'&#64;flowchart-sequence-designer/angular'</span>;</code></div>
          </section>
        </div>
      </main>
    } @else if (tab === 'sequence') {
      <fsd-sequence
        [initialModel]="sequenceModel"
        [height]="editorHeight"
        [theme]="theme"
        [allowImport]="true"
        (modelChange)="onSequenceChange($event)"
      />
    } @else {
      <fsd-diagram
        [initialModel]="flowchartModel"
        [height]="editorHeight"
        [variant]="variant"
        [theme]="theme"
        [allowImport]="true"
        (modelChange)="onFlowchartChange($event)"
        (exportEvent)="onExport($event)"
      />
    }
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      background: #0a0f1a;
      color: #e2e8f0;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }

    /* ─── Single top nav bar (matches React) ─── */
    .topnav {
      display: flex;
      gap: 0;
      background: #0f172a;
      padding: 0 16px;
      align-items: stretch;
      flex-shrink: 0;
      border-bottom: 1px solid #1e293b;
      overflow-x: auto;
      overflow-y: hidden;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-right: 20px;
      color: #f1f5f9;
      font-size: 13px;
      font-weight: 700;
      border-right: 1px solid #1e293b;
      text-decoration: none;
      margin-right: 8px;
      white-space: nowrap;
    }
    .topnav > button {
      padding: 10px 18px;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      color: #64748b;
      font-size: 12px;
      font-weight: 400;
      font-family: ui-sans-serif, system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
    }
    .topnav > button.active {
      border-bottom-color: #dd0031;
      color: #f1f5f9;
      font-weight: 700;
    }
    .topnav > button:hover { color: #cbd5e1; }
    .topnav > button.docs-tab.active {
      border-bottom-color: #10b981;
      color: #6ee7b7;
    }
    .tab-label { font-size: 12px; }
    .tab-desc { font-size: 10px; opacity: 0.6; white-space: nowrap; }
    .nav-spacer { flex: 1; }
    .theme-toggle {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .theme-toggle button {
      padding: 4px 10px;
      background: none;
      border: 1px solid transparent;
      border-radius: 6px;
      cursor: pointer;
      color: #475569;
      font-size: 11px;
      font-weight: 400;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    .theme-toggle button.active {
      background: rgba(221, 0, 49, 0.25);
      border-color: #dd0031;
      color: #ff6b6b;
      font-weight: 600;
    }

    /* ─── Editor area ─── */
    fsd-diagram, fsd-sequence {
      flex: 1;
      display: block;
    }

    /* ─── Docs page (matches React DocsPage) ─── */
    .docs-page {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    .docs-sidebar {
      width: 220px;
      flex-shrink: 0;
      border-right: 1px solid #1e293b;
      overflow-y: auto;
      padding: 28px 0;
      background: #0d1421;
    }
    .sidebar-heading {
      padding: 0 16px 16px;
      font-size: 10px;
      font-weight: 700;
      color: #475569;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .sidebar-group {
      padding: 14px 16px 4px;
      font-size: 10px;
      font-weight: 700;
      color: #475569;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .docs-sidebar a {
      display: block;
      padding: 7px 20px;
      font-size: 13px;
      color: #64748b;
      text-decoration: none;
      border-left: 2px solid transparent;
    }
    .docs-sidebar a:hover { color: #cbd5e1; }
    .sidebar-divider {
      height: 1px;
      background: #1e293b;
      margin: 16px;
    }
    .docs-content {
      flex: 1;
      overflow-y: auto;
      padding: 40px 56px 80px;
    }
    .frameworks-box {
      margin-bottom: 32px;
      padding: 16px 20px;
      background: #0d1421;
      border: 1px solid #1e293b;
      border-radius: 10px;
    }
    .frameworks-label {
      font-size: 10px;
      font-weight: 700;
      color: #475569;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .frameworks-pills {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .fw-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 8px;
      color: #94a3b8;
      font-size: 12px;
      font-weight: 500;
      text-decoration: none;
    }
    .fw-pill:hover { border-color: #4f46e5; color: #a5b4fc; }
    .fw-active {
      background: rgba(221, 0, 49, 0.1);
      border-color: #dd0031;
      color: #ff6b6b;
      font-weight: 600;
    }
    .docs-title {
      font-size: 28px;
      font-weight: 800;
      color: #f8fafc;
      margin: 0 0 10px;
    }
    .docs-subtitle {
      color: #64748b;
      font-size: 15px;
      line-height: 1.6;
      max-width: 600px;
      margin-bottom: 40px;
    }
    .docs-content section {
      margin-bottom: 40px;
    }
    .docs-content h2 {
      font-size: 20px;
      font-weight: 700;
      color: #f1f5f9;
      margin: 0 0 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #1e293b;
    }
    .docs-content p {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 12px;
    }
    .docs-note {
      font-size: 12px;
      color: #64748b;
      margin-top: 8px;
    }
    .code-block {
      background: #0d1421;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 16px 20px;
      overflow-x: auto;
      margin-bottom: 12px;
    }
    .code-block code {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 13px;
      color: #e2e8f0;
      white-space: pre;
    }
    .kw { color: #c792ea; }
    .str { color: #c3e88d; }
    .props-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 13px;
    }
    .props-table th {
      text-align: left;
      padding: 8px 12px;
      background: #0d1421;
      color: #94a3b8;
      font-weight: 600;
      border-bottom: 1px solid #1e293b;
    }
    .props-table td {
      padding: 8px 12px;
      border-bottom: 1px solid #1e293b;
      color: #cbd5e1;
    }
    .props-table code {
      background: rgba(221, 0, 49, 0.1);
      color: #ff6b6b;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
    }
  `],
})
export class AppComponent {
  flowchartModel = presetFlowchartModel('flowchart');
  sequenceModel = presetSequenceModel();
  variant: 'flowchart' | 'question' | 'journey' = 'flowchart';
  theme: 'light' | 'dark' | 'auto' = 'auto';
  tab: 'flowchart' | 'question' | 'journey' | 'sequence' | 'docs' = 'flowchart';
  themes: ('light' | 'dark' | 'auto')[] = ['light', 'auto', 'dark'];
  lastExport: { format: string; preview: string } | null = null;
  editorHeight = 'calc(100vh - 52px)';

  private currentFlowchart = this.flowchartModel;
  private currentSequence = this.sequenceModel;

  switchTab(t: 'flowchart' | 'question' | 'journey' | 'sequence'): void {
    this.tab = t;
    if (t !== 'sequence') {
      this.variant = t;
      this.flowchartModel = presetFlowchartModel(t);
    }
  }

  onFlowchartChange(model: DiagramModel): void {
    this.currentFlowchart = model;
  }

  onSequenceChange(model: DiagramModel): void {
    this.currentSequence = model;
  }

  onExport(event: { format: ExportFormat; content: string | Blob }): void {
    const preview = typeof event.content === 'string'
      ? event.content.slice(0, 500)
      : `[Blob: ${event.content.size} bytes]`;
    this.lastExport = { format: event.format, preview };
  }
}
