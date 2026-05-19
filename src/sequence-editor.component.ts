import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import type { DiagramModel, ExportFormat } from "flowchart-sequence-designer";
import type { SequenceEditorProps, SequenceThemeColors } from "flowchart-sequence-designer/ui";
import { ReactBridge } from "./react-bridge";

@Component({
  selector: "fsd-sequence",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading) {
      <span class="fsd-loading">Loading editor…</span>
    }
    @if (error) {
      <span class="fsd-error">{{ error }}</span>
    }
    <div #container [style.height]="normalizedHeight" [style.display]="loading || error ? 'none' : 'block'" style="width:100%"></div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .fsd-loading { color: #888; font-size: 14px; padding: 16px; display: inline-block; }
    .fsd-error { color: #c00; font-size: 14px; padding: 16px; display: inline-block; }
  `],
})
export class FsdSequenceComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild("container", { static: true }) containerRef!: ElementRef<HTMLElement>;

  @Input() initialModel?: DiagramModel;
  @Input() height?: string | number;
  @Input() allowedExports?: ExportFormat[];
  @Input() allowImport?: boolean;
  @Input() theme?: "light" | "dark" | "auto";
  @Input() themeOverrides?: Partial<SequenceThemeColors>;

  @Output() modelChange = new EventEmitter<DiagramModel>();
  @Output() exportEvent = new EventEmitter<{ format: ExportFormat; content: string | Blob }>();

  loading = true;
  error: string | null = null;

  private bridge: ReactBridge<SequenceEditorProps> | null = null;

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {}

  get normalizedHeight(): string {
    if (typeof this.height === 'number') return `${this.height}px`;
    if (typeof this.height === 'string') {
      if (/^\d+$/.test(this.height)) return `${this.height}px`;
      return this.height;
    }
    return '500px';
  }

  ngOnInit(): void {
    import("flowchart-sequence-designer/ui").then(
      ({ SequenceEditor }) => {
        this.loading = false;
        this.bridge = new ReactBridge<SequenceEditorProps>(
          SequenceEditor,
          this.buildProps(),
          this.zone,
        );
        this.bridge.mount(this.containerRef.nativeElement);
        this.cdr.markForCheck();
      },
      (err) => {
        this.loading = false;
        this.error = `Failed to load editor: ${err?.message ?? err}`;
        this.cdr.markForCheck();
      },
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.bridge) return;
    if ("initialModel" in changes && !changes["initialModel"].firstChange) {
      this.bridge.unmount();
      this.bridge = new ReactBridge<SequenceEditorProps>(
        this.bridge["component"],
        this.buildProps(),
        this.zone,
      );
      this.bridge.mount(this.containerRef.nativeElement);
      return;
    }
    const updateKeys = ["height", "allowedExports", "allowImport", "theme", "themeOverrides"];
    if (updateKeys.some((k) => k in changes)) {
      this.bridge.update(this.buildProps());
    }
  }

  ngOnDestroy(): void {
    this.bridge?.unmount();
    this.bridge = null;
  }

  private buildProps(): SequenceEditorProps {
    return {
      initialModel: this.initialModel,
      onChange: (model: DiagramModel) => this.zone.run(() => this.modelChange.emit(model)),
      onExport: (format: ExportFormat, content: string | Blob) =>
        this.zone.run(() => this.exportEvent.emit({ format, content })),
      height: "100%",
      allowedExports: this.allowedExports,
      allowImport: this.allowImport,
      theme: this.theme,
      themeOverrides: this.themeOverrides,
    };
  }
}
