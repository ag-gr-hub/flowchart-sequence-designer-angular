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
import { CommonModule } from "@angular/common";
import type { DiagramModel, ExportFormat } from "flowchart-sequence-designer";
import type { DiagramEditorProps, ThemeColors } from "flowchart-sequence-designer/ui";
import { ReactBridge } from "./react-bridge";

@Component({
  selector: "fsd-diagram",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span *ngIf="loading" class="fsd-loading">Loading editor…</span>
    <span *ngIf="error" class="fsd-error">{{ error }}</span>
    <div #container [style.height.px]="normalizedHeight" [style.display]="loading || error ? 'none' : 'block'" style="width:100%"></div>
  `,
  styles: [`
    :host { display: block; }
    .fsd-loading { color: #888; font-size: 14px; padding: 16px; display: inline-block; }
    .fsd-error { color: #c00; font-size: 14px; padding: 16px; display: inline-block; }
  `],
})
export class FsdDiagramComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild("container", { static: true }) containerRef!: ElementRef<HTMLElement>;

  @Input() initialModel?: DiagramModel;
  @Input() height?: string | number;
  @Input() allowedExports?: ExportFormat[];
  @Input() allowImport?: boolean;
  @Input() variant?: DiagramEditorProps["variant"];
  @Input() theme?: "light" | "dark" | "auto";
  @Input() themeOverrides?: Partial<ThemeColors>;

  @Output() modelChange = new EventEmitter<DiagramModel>();
  @Output() exportEvent = new EventEmitter<{ format: ExportFormat; content: string | Blob }>();

  loading = true;
  error: string | null = null;

  private bridge: ReactBridge<DiagramEditorProps> | null = null;

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {}

  get normalizedHeight(): number {
    if (typeof this.height === 'number') return this.height;
    if (typeof this.height === 'string') return parseInt(this.height, 10) || 500;
    return 500;
  }

  ngOnInit(): void {
    import("flowchart-sequence-designer/ui").then(
      ({ DiagramEditor }) => {
        this.loading = false;
        this.bridge = new ReactBridge<DiagramEditorProps>(
          DiagramEditor,
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
      // Force full re-mount when initialModel changes (React treats it as initial state)
      this.bridge.unmount();
      this.bridge = new ReactBridge<DiagramEditorProps>(
        this.bridge["component"],
        this.buildProps(),
        this.zone,
      );
      this.bridge.mount(this.containerRef.nativeElement);
      return;
    }
    const updateKeys = ["height", "allowedExports", "allowImport", "variant", "theme", "themeOverrides"];
    if (updateKeys.some((k) => k in changes)) {
      this.bridge.update(this.buildProps());
    }
  }

  ngOnDestroy(): void {
    this.bridge?.unmount();
    this.bridge = null;
  }

  private buildProps(): DiagramEditorProps {
    return {
      initialModel: this.initialModel,
      onChange: (model: DiagramModel) => this.zone.run(() => this.modelChange.emit(model)),
      onExport: (format: ExportFormat, content: string | Blob) =>
        this.zone.run(() => this.exportEvent.emit({ format, content })),
      height: "100%",
      allowedExports: this.allowedExports,
      allowImport: this.allowImport,
      variant: this.variant,
      theme: this.theme,
      themeOverrides: this.themeOverrides,
    };
  }
}
