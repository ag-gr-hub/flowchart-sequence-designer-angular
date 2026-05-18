import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import type { DiagramModel, ExportFormat } from "flowchart-sequence-designer";
import type { DiagramEditorProps, ThemeColors } from "flowchart-sequence-designer/ui";
import { ReactBridge } from "./react-bridge";

@Component({
  selector: "fsd-diagram",
  standalone: true,
  template: `<div #container [style.height]="height ?? '500px'" style="width:100%"></div>`,
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

  private bridge: ReactBridge<DiagramEditorProps> | null = null;

  ngOnInit(): void {
    import("flowchart-sequence-designer/ui").then(({ DiagramEditor }) => {
      this.bridge = new ReactBridge<DiagramEditorProps>(DiagramEditor, this.buildProps());
      this.bridge.mount(this.containerRef.nativeElement);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.bridge) return;
    // Only update non-initial props (initialModel is only read once by the React component)
    const updateKeys = ["height", "allowedExports", "allowImport", "variant", "theme", "themeOverrides"];
    const hasRelevant = updateKeys.some((k) => k in changes);
    if (hasRelevant) {
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
      onChange: (model: DiagramModel) => this.modelChange.emit(model),
      onExport: (format: ExportFormat, content: string | Blob) =>
        this.exportEvent.emit({ format, content }),
      height: this.height,
      allowedExports: this.allowedExports,
      allowImport: this.allowImport,
      variant: this.variant,
      theme: this.theme,
      themeOverrides: this.themeOverrides,
    };
  }
}
