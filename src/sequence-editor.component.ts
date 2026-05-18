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
import type { SequenceEditorProps, SequenceThemeColors } from "flowchart-sequence-designer/ui";
import { ReactBridge } from "./react-bridge";

@Component({
  selector: "fsd-sequence",
  standalone: true,
  template: `<div #container [style.height]="height ?? '500px'" style="width:100%"></div>`,
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

  private bridge: ReactBridge<SequenceEditorProps> | null = null;

  ngOnInit(): void {
    import("flowchart-sequence-designer/ui").then(({ SequenceEditor }) => {
      this.bridge = new ReactBridge<SequenceEditorProps>(SequenceEditor, this.buildProps());
      this.bridge.mount(this.containerRef.nativeElement);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.bridge) return;
    const updateKeys = ["height", "allowedExports", "allowImport", "theme", "themeOverrides"];
    const hasRelevant = updateKeys.some((k) => k in changes);
    if (hasRelevant) {
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
      onChange: (model: DiagramModel) => this.modelChange.emit(model),
      onExport: (format: ExportFormat, content: string | Blob) =>
        this.exportEvent.emit({ format, content }),
      height: this.height,
      allowedExports: this.allowedExports,
      allowImport: this.allowImport,
      theme: this.theme,
      themeOverrides: this.themeOverrides,
    };
  }
}
