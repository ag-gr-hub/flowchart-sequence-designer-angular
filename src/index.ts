// Angular components
export { FsdDiagramComponent } from "./diagram-editor.component";
export { FsdSequenceComponent } from "./sequence-editor.component";
export { FsdToolbarComponent } from "./toolbar.component";
export { FsdStepEditorComponent } from "./step-editor.component";

// React bridge (for advanced use cases)
export { ReactBridge } from "./react-bridge";

// Re-export commonly needed types so consumers don't need a separate import
export type {
  DiagramModel,
  DiagramNode,
  DiagramEdge,
  DiagramType,
  DiagramVariant,
  ExportFormat,
  NodeShape,
  SequenceMessage,
} from "flowchart-sequence-designer";

// Re-export UI types
export type {
  DiagramEditorProps,
  SequenceEditorProps,
  ThemeColors,
  SequenceThemeColors,
} from "flowchart-sequence-designer/ui";

// Re-export model factories (useful for initialModel)
export {
  presetFlowchartModel,
  presetSequenceModel,
  emptyModel,
} from "flowchart-sequence-designer/ui";
