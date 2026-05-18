// Mock for flowchart-sequence-designer/ui
export const DiagramEditor = () => null;
export const SequenceEditor = () => null;
export const Toolbar = () => null;
export const StepEditor = () => null;
export const presetFlowchartModel = () => ({ type: "flowchart", nodes: [], edges: [] });
export const presetSequenceModel = () => ({ type: "sequence", actors: [], messages: [] });
export const emptyModel = () => ({ type: "flowchart", nodes: [], edges: [] });
export type DiagramEditorProps = any;
export type SequenceEditorProps = any;
export type ThemeColors = any;
export type SequenceThemeColors = any;
