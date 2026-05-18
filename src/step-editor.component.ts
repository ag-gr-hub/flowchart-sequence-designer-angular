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
import type { DiagramModel, DiagramVariant } from "flowchart-sequence-designer";
import type { ThemeColors } from "flowchart-sequence-designer/ui";
import { ReactBridge } from "./react-bridge";

interface StepEditorProps {
  nodeId: string;
  model: DiagramModel;
  onModelChange: (model: DiagramModel) => void;
  variant?: DiagramVariant;
  isDark?: boolean;
  t?: ThemeColors;
}

@Component({
  selector: "fsd-step-editor",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #container style="width:100%"></div>`,
  styles: [`:host { display: block; }`],
})
export class FsdStepEditorComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild("container", { static: true }) containerRef!: ElementRef<HTMLElement>;

  @Input({ required: true }) nodeId!: string;
  @Input({ required: true }) model!: DiagramModel;
  @Input() variant?: DiagramVariant;
  @Input() isDark?: boolean;
  @Input() themeColors?: ThemeColors;

  @Output() modelChange = new EventEmitter<DiagramModel>();

  private bridge: ReactBridge<StepEditorProps> | null = null;

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    import("flowchart-sequence-designer/ui").then(({ StepEditor }) => {
      this.bridge = new ReactBridge<StepEditorProps>(StepEditor, this.buildProps(), this.zone);
      this.bridge.mount(this.containerRef.nativeElement);
    });
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (!this.bridge) return;
    this.bridge.update(this.buildProps());
  }

  ngOnDestroy(): void {
    this.bridge?.unmount();
    this.bridge = null;
  }

  private buildProps(): StepEditorProps {
    return {
      nodeId: this.nodeId,
      model: this.model,
      onModelChange: (model: DiagramModel) => this.zone.run(() => this.modelChange.emit(model)),
      variant: this.variant,
      isDark: this.isDark,
      t: this.themeColors,
    };
  }
}
