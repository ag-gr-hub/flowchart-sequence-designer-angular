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
    <!-- Header -->
    <header class="header">
      <div class="header-inner">
        <div class="title-group">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#dd0031"><path d="M12 2L2 7l1.63 14.27L12 22l8.37-3.73L22 7L12 2zm0 2.21l6.9 3.33-.98 8.56L12 19.77l-5.92-3.67-.98-8.56L12 4.21z"/></svg>
          <h1>&#64;flowchart-sequence-designer/angular</h1>
        </div>
        <div class="framework-pills">
          <a href="https://ag-gr-hub.github.io/flowchart-sequence-designer/" class="pill pill-react">
            React
          </a>
          <a href="https://ag-gr-hub.github.io/flowchart-sequence-designer-angular/" class="pill pill-angular active">
            Angular (current)
          </a>
        </div>
        <div class="header-links">
          <a href="https://github.com/ag-gr-hub/flowchart-sequence-designer-angular" target="_blank">GitHub</a>
          <a href="https://www.npmjs.com/package/@flowchart-sequence-designer/angular" target="_blank">npm</a>
        </div>
      </div>
    </header>

    <!-- Tab bar -->
    <nav class="tabs">
      <button [class.active]="tab === 'flowchart'" (click)="switchTab('flowchart')">
        <span class="tab-label">Flowchart</span>
        <span class="tab-desc">General purpose flow</span>
      </button>
      <button [class.active]="tab === 'question'" (click)="switchTab('question')">
        <span class="tab-label">Question</span>
        <span class="tab-desc">Decision tree</span>
      </button>
      <button [class.active]="tab === 'journey'" (click)="switchTab('journey')">
        <span class="tab-label">Journey</span>
        <span class="tab-desc">Milestone steps</span>
      </button>
      <button [class.active]="tab === 'sequence'" (click)="switchTab('sequence')">
        <span class="tab-label">Sequence</span>
        <span class="tab-desc">Actor lifelines</span>
      </button>
      <div class="tab-spacer"></div>
      <div class="theme-toggle">
        @for (t of themes; track t) {
          <button [class.active]="theme === t" (click)="theme = t">
            {{ t === 'light' ? '☀' : t === 'dark' ? '☾' : '⊙' }} {{ t }}
          </button>
        }
      </div>
    </nav>

    <!-- Live Editor -->
    <main class="editor-area">
      @if (tab === 'sequence') {
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
    </main>

    <!-- Status bar -->
    <footer class="status-bar">
      <span class="status-badge">✓ Angular wrapper rendering live</span>
      <span class="status-info">
        Nodes: {{ nodeCount }} ·
        Tab: {{ tab }} ·
        Theme: {{ theme }}
      </span>
      @if (lastExport) {
        <span class="status-export">Last export: {{ lastExport.format }}</span>
      }
    </footer>
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

    .header {
      background: #0d1421;
      border-bottom: 1px solid #1e293b;
      padding: 0 20px;
      flex-shrink: 0;
    }
    .header-inner {
      display: flex;
      align-items: center;
      gap: 20px;
      height: 52px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .title-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .title-group h1 {
      font-size: 14px;
      font-weight: 700;
      color: #f1f5f9;
      white-space: nowrap;
    }
    .framework-pills {
      display: flex;
      gap: 8px;
    }
    .pill {
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
      text-decoration: none;
      border: 1px solid #334155;
      color: #94a3b8;
      background: #1e293b;
    }
    .pill-angular.active {
      background: rgba(221, 0, 49, 0.15);
      border-color: #dd0031;
      color: #ff6b6b;
    }
    .pill-react:hover {
      border-color: #4f46e5;
      color: #a5b4fc;
    }
    .header-links {
      margin-left: auto;
      display: flex;
      gap: 16px;
    }
    .header-links a {
      color: #64748b;
      font-size: 12px;
      text-decoration: none;
    }
    .header-links a:hover { color: #cbd5e1; }

    .tabs {
      display: flex;
      align-items: stretch;
      background: #0f172a;
      border-bottom: 1px solid #1e293b;
      padding: 0 20px;
      flex-shrink: 0;
      overflow-x: auto;
    }
    .tabs > button {
      padding: 10px 18px;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      color: #64748b;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
    }
    .tabs > button.active {
      border-bottom-color: #dd0031;
      color: #f1f5f9;
    }
    .tabs > button:hover { color: #cbd5e1; }
    .tab-label { font-size: 12px; font-weight: 600; }
    .tab-desc { font-size: 10px; opacity: 0.6; white-space: nowrap; }
    .tab-spacer { flex: 1; }
    .theme-toggle {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .theme-toggle button {
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid transparent;
      background: none;
      color: #475569;
      font-size: 11px;
      cursor: pointer;
    }
    .theme-toggle button.active {
      background: rgba(221, 0, 49, 0.15);
      border-color: #dd0031;
      color: #ff6b6b;
    }

    .editor-area {
      flex: 1;
      overflow: hidden;
      height: 100%;
    }

    .status-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 6px 20px;
      background: #0d1421;
      border-top: 1px solid #1e293b;
      font-size: 11px;
      flex-shrink: 0;
    }
    .status-badge {
      color: #10b981;
      font-weight: 600;
    }
    .status-info { color: #475569; }
    .status-export { color: #64748b; margin-left: auto; }
  `],
})
export class AppComponent {
  flowchartModel = presetFlowchartModel('flowchart');
  sequenceModel = presetSequenceModel();
  variant: 'flowchart' | 'question' | 'journey' = 'flowchart';
  theme: 'light' | 'dark' | 'auto' = 'dark';
  tab: 'flowchart' | 'question' | 'journey' | 'sequence' = 'flowchart';
  themes: ('light' | 'dark' | 'auto')[] = ['light', 'auto', 'dark'];
  lastExport: { format: string; preview: string } | null = null;
  editorHeight = 'calc(100vh - 130px)';

  private currentFlowchart = this.flowchartModel;
  private currentSequence = this.sequenceModel;

  get nodeCount(): number {
    if (this.tab === 'sequence') {
      return (this.currentSequence as any)?.actors?.length ?? 0;
    }
    return (this.currentFlowchart as any)?.nodes?.length ?? 0;
  }

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
