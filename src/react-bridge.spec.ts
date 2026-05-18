import { ReactBridge } from "./react-bridge";

// Mock react-dom/client
const mockRender = jest.fn();
const mockUnmount = jest.fn();
jest.mock("react-dom/client", () => ({
  createRoot: jest.fn(() => ({ render: mockRender, unmount: mockUnmount })),
}));

// Mock react
const mockCreateElement = jest.fn((component: any, props: any) => ({ component, props }));
jest.mock("react", () => ({
  createElement: (a: any, b: any) => mockCreateElement(a, b),
}));

import { createRoot } from "react-dom/client";

describe("ReactBridge", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should mount and render a component", () => {
    const FakeComponent = () => null;
    const props = { value: 42 };
    const bridge = new ReactBridge(FakeComponent, props);

    const container = document.createElement("div");
    bridge.mount(container);

    expect(createRoot).toHaveBeenCalledWith(container);
    expect(mockRender).toHaveBeenCalledTimes(1);
    expect(mockCreateElement).toHaveBeenCalledWith(FakeComponent, props);
  });

  it("should not double-mount", () => {
    const bridge = new ReactBridge(() => null, {});
    const container = document.createElement("div");
    bridge.mount(container);
    bridge.mount(container);
    expect(createRoot).toHaveBeenCalledTimes(1);
  });

  it("should update props and re-render", () => {
    const Comp = () => null;
    const bridge = new ReactBridge(Comp, { a: 1, b: 2 });
    bridge.mount(document.createElement("div"));
    mockRender.mockClear();
    mockCreateElement.mockClear();

    bridge.update({ a: 99 });

    expect(mockRender).toHaveBeenCalledTimes(1);
    expect(mockCreateElement).toHaveBeenCalledWith(Comp, { a: 99, b: 2 });
  });

  it("should unmount cleanly", () => {
    const bridge = new ReactBridge(() => null, {});
    bridge.mount(document.createElement("div"));
    bridge.unmount();
    expect(mockUnmount).toHaveBeenCalledTimes(1);
  });

  it("should not render after unmount", () => {
    const bridge = new ReactBridge(() => null, {});
    bridge.mount(document.createElement("div"));
    bridge.unmount();
    mockRender.mockClear();

    bridge.update({ x: 1 });
    expect(mockRender).not.toHaveBeenCalled();
  });

  it("should run outside NgZone when zone is provided", () => {
    const runOutsideAngular = jest.fn((fn: () => void) => fn());
    const run = jest.fn((fn: () => void) => fn());
    const zone = { runOutsideAngular, run } as any;

    const bridge = new ReactBridge(() => null, {}, zone);
    bridge.mount(document.createElement("div"));

    expect(runOutsideAngular).toHaveBeenCalled();
    expect(mockRender).toHaveBeenCalled();
  });

  it("should also run updates outside NgZone", () => {
    const runOutsideAngular = jest.fn((fn: () => void) => fn());
    const zone = { runOutsideAngular, run: jest.fn() } as any;

    const bridge = new ReactBridge(() => null, { x: 1 }, zone);
    bridge.mount(document.createElement("div"));
    runOutsideAngular.mockClear();

    bridge.update({ x: 2 });
    expect(runOutsideAngular).toHaveBeenCalled();
  });
});
