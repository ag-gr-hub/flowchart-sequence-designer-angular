/**
 * Tests for Angular component classes.
 * Uses mocked Angular core and fsd packages via moduleNameMapper.
 */
import { FsdDiagramComponent } from "./diagram-editor.component";
import { FsdSequenceComponent } from "./sequence-editor.component";
import { FsdToolbarComponent } from "./toolbar.component";
import { FsdStepEditorComponent } from "./step-editor.component";

// Mock ReactBridge
const mockMount = jest.fn();
const mockUpdate = jest.fn();
const mockUnmount = jest.fn();
jest.mock("./react-bridge", () => ({
  ReactBridge: jest.fn().mockImplementation((_comp: any, _props: any, _zone: any) => ({
    mount: mockMount,
    update: mockUpdate,
    unmount: mockUnmount,
    component: _comp,
  })),
}));

import { ReactBridge } from "./react-bridge";

// Minimal NgZone that tracks calls
function createMockZone() {
  return {
    run: jest.fn((fn: () => any) => fn()),
    runOutsideAngular: jest.fn((fn: () => any) => fn()),
  };
}

describe("FsdDiagramComponent", () => {
  let component: FsdDiagramComponent;
  let zone: ReturnType<typeof createMockZone>;

  beforeEach(() => {
    jest.clearAllMocks();
    zone = createMockZone();
    component = new FsdDiagramComponent(zone as any);
    component.containerRef = { nativeElement: document.createElement("div") } as any;
  });

  it("should start in loading state", () => {
    expect(component.loading).toBe(true);
    expect(component.error).toBeNull();
  });

  it("should create bridge and mount after init", async () => {
    component.ngOnInit();
    await flushPromises();
    expect(component.loading).toBe(false);
    expect(ReactBridge).toHaveBeenCalled();
    expect(mockMount).toHaveBeenCalledWith(component.containerRef.nativeElement);
  });

  it("should wrap onChange callback in NgZone.run", async () => {
    component.ngOnInit();
    await flushPromises();
    const emitSpy = jest.spyOn(component.modelChange, "emit");
    const propsArg = (ReactBridge as jest.Mock).mock.calls[0][1];
    const model = { type: "flowchart", nodes: [], edges: [] };
    propsArg.onChange(model);
    expect(zone.run).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(model);
  });

  it("should wrap onExport callback in NgZone.run", async () => {
    component.ngOnInit();
    await flushPromises();
    const emitSpy = jest.spyOn(component.exportEvent, "emit");
    const propsArg = (ReactBridge as jest.Mock).mock.calls[0][1];
    propsArg.onExport("svg", "<svg></svg>");
    expect(zone.run).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith({ format: "svg", content: "<svg></svg>" });
  });

  it("should update bridge on input changes (not initialModel)", async () => {
    component.ngOnInit();
    await flushPromises();
    component.theme = "dark";
    component.ngOnChanges({
      theme: { currentValue: "dark", previousValue: "light", firstChange: false, isFirstChange: () => false },
    });
    expect(mockUpdate).toHaveBeenCalled();
  });

  it("should re-mount bridge when initialModel changes", async () => {
    component.ngOnInit();
    await flushPromises();
    const newModel = { type: "flowchart", nodes: [{ id: "n1", label: "X" }], edges: [] };
    component.initialModel = newModel;
    component.ngOnChanges({
      initialModel: { currentValue: newModel, previousValue: undefined, firstChange: false, isFirstChange: () => false },
    });
    expect(mockUnmount).toHaveBeenCalled();
    // New bridge created
    expect(ReactBridge).toHaveBeenCalledTimes(2);
  });

  it("should unmount on destroy", async () => {
    component.ngOnInit();
    await flushPromises();
    component.ngOnDestroy();
    expect(mockUnmount).toHaveBeenCalled();
  });

  it("should not crash if destroyed before load", () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});

describe("FsdSequenceComponent", () => {
  it("should load SequenceEditor", async () => {
    const zone = createMockZone();
    const component = new FsdSequenceComponent(zone as any);
    component.containerRef = { nativeElement: document.createElement("div") } as any;
    component.ngOnInit();
    await flushPromises();
    expect(ReactBridge).toHaveBeenCalled();
    expect(mockMount).toHaveBeenCalled();
  });
});

describe("FsdToolbarComponent", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should emit exportRequest inside zone", async () => {
    const zone = createMockZone();
    const component = new FsdToolbarComponent(zone as any);
    component.containerRef = { nativeElement: document.createElement("div") } as any;
    component.ngOnInit();
    await flushPromises();
    const lastCall = (ReactBridge as jest.Mock).mock.calls;
    const propsArg = lastCall[lastCall.length - 1][1];
    propsArg.onExport("json");
    expect(zone.run).toHaveBeenCalled();
    const emitSpy = jest.spyOn(component.exportRequest, "emit");
    // Re-call after attaching spy
    propsArg.onExport("json");
    expect(emitSpy).toHaveBeenCalledWith("json");
  });
});

describe("FsdStepEditorComponent", () => {
  it("should pass nodeId and model", async () => {
    const zone = createMockZone();
    const component = new FsdStepEditorComponent(zone as any);
    component.containerRef = { nativeElement: document.createElement("div") } as any;
    component.nodeId = "n1";
    component.model = { type: "flowchart", nodes: [], edges: [], title: "" } as any;
    component.ngOnInit();
    await flushPromises();
    expect(ReactBridge).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ nodeId: "n1" }),
      zone,
    );
  });
});

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
