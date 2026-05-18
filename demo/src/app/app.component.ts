import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, FsdDiagramComponent, FsdSequenceComponent],
  template: `
    <h1>@flowchart-sequence-designer/angular</h1>
    <p>Interactive demo of the Angular wrapper components.</p>

    <!-- Flowchart Editor -->
    <h2>Flowchart Editor</h2>
    <div class="demo-section">
      <div class="controls">
        <select (change)="onVariantChange($event)">
          <option value="flowchart">Flowchart</option>
          <option value="question">Question Tree</option>
          <option value="journey">Journey</option>
        </select>
        <select (change)="onThemeChange($event)">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
        <button (click)="resetFlowchart()">Reset</button>
      </div>
      <fsd-diagram
        [initialModel]="flowchartModel"
        [height]="500"
        [variant]="variant"
        [theme]="theme"
        [allowImport]="true"
        (modelChange)="onFlowchartChange($event)"
        (exportEvent)="onExport($event)"
      />
      <div class="model-output" *ngIf="lastExport">
        <strong>Last export ({{ lastExport.format }}):</strong><br>
        {{ lastExport.preview }}
      </div>
    </div>

    <!-- Sequence Editor -->
    <h2>Sequence Diagram Editor</h2>
    <div class="demo-section">
      <fsd-sequence
        [initialModel]="sequenceModel"
        [height]="450"
        [theme]="theme"
        [allowImport]="true"
        (modelChange)="onSequenceChange($event)"
      />
    </div>

    <!-- Model Inspector -->
    <h2>Model Inspector</h2>
    <div class="demo-section">
      <div class="controls">
        <button (click)="activeInspector = 'flowchart'"
                [class.active]="activeInspector === 'flowchart'">Flowchart Model</button>
        <button (click)="activeInspector = 'sequence'"
                [class.active]="activeInspector === 'sequence'">Sequence Model</button>
      </div>
      <div class="model-output">
        <pre>{{ inspectedModel | json }}</pre>
      </div>
    </div>

    <footer>
      <a href="https://github.com/ag-gr-hub/flowchart-sequence-designer-angular">GitHub</a> ·
      <a href="https://www.npmjs.com/package/@flowchart-sequence-designer/angular">npm</a> ·
      <a href="https://www.npmjs.com/package/flowchart-sequence-designer">Core Library</a>
    </footer>
  `,
  styles: [`
    :host { display: block; max-width: 1000px; margin: 0 auto; }
    .controls button.active { border-color: var(--accent); background: var(--accent); color: #fff; }
  `],
})
export class AppComponent {
  flowchartModel = presetFlowchartModel('flowchart');
  sequenceModel = presetSequenceModel();
  variant: 'flowchart' | 'question' | 'journey' = 'flowchart';
  theme: 'light' | 'dark' | 'auto' = 'light';
  activeInspector: 'flowchart' | 'sequence' = 'flowchart';
  lastExport: { format: string; preview: string } | null = null;

  private currentFlowchart = this.flowchartModel;
  private currentSequence = this.sequenceModel;

  get inspectedModel(): DiagramModel {
    return this.activeInspector === 'flowchart' ? this.currentFlowchart : this.currentSequence;
  }

  onVariantChange(event: Event): void {
    this.variant = (event.target as HTMLSelectElement).value as typeof this.variant;
    this.flowchartModel = presetFlowchartModel(this.variant);
  }

  onThemeChange(event: Event): void {
    this.theme = (event.target as HTMLSelectElement).value as typeof this.theme;
  }

  resetFlowchart(): void {
    this.flowchartModel = presetFlowchartModel(this.variant);
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
