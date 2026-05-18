import {
  ChangeDetectionStrategy,
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
import type { ExportFormat } from "flowchart-sequence-designer";
import { ReactBridge } from "./react-bridge";

interface ToolbarProps {
  onExport: (format: ExportFormat) => void;
  onImport?: (text: string) => void;
  allowedExports?: ExportFormat[];
  allowImport?: boolean;
}

@Component({
  selector: "fsd-toolbar",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #container style="width:100%"></div>`,
  styles: [`:host { display: block; }`],
})
export class FsdToolbarComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild("container", { static: true }) containerRef!: ElementRef<HTMLElement>;

  @Input() allowedExports?: ExportFormat[];
  @Input() allowImport?: boolean;

  @Output() exportRequest = new EventEmitter<ExportFormat>();
  @Output() importRequest = new EventEmitter<string>();

  private bridge: ReactBridge<ToolbarProps> | null = null;

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    import("flowchart-sequence-designer/ui").then(({ Toolbar }) => {
      this.bridge = new ReactBridge<ToolbarProps>(Toolbar, this.buildProps(), this.zone);
      this.bridge.mount(this.containerRef.nativeElement);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.bridge) return;
    if ("allowedExports" in changes || "allowImport" in changes) {
      this.bridge.update(this.buildProps());
    }
  }

  ngOnDestroy(): void {
    this.bridge?.unmount();
    this.bridge = null;
  }

  private buildProps(): ToolbarProps {
    return {
      onExport: (format: ExportFormat) => this.zone.run(() => this.exportRequest.emit(format)),
      onImport: this.allowImport
        ? (text: string) => this.zone.run(() => this.importRequest.emit(text))
        : undefined,
      allowedExports: this.allowedExports,
      allowImport: this.allowImport,
    };
  }
}
