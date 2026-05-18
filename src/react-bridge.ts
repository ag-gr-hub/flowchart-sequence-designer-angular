import { createRoot, Root } from "react-dom/client";
import { createElement, ComponentType } from "react";

/**
 * Manages the lifecycle of a React component mounted inside an Angular component's DOM element.
 */
export class ReactBridge<P extends object> {
  private root: Root | null = null;
  private component: ComponentType<P>;
  private currentProps: P;

  constructor(component: ComponentType<P>, initialProps: P) {
    this.component = component;
    this.currentProps = initialProps;
  }

  mount(container: HTMLElement): void {
    if (this.root) return;
    this.root = createRoot(container);
    this.render();
  }

  update(props: Partial<P>): void {
    this.currentProps = { ...this.currentProps, ...props };
    this.render();
  }

  unmount(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }

  private render(): void {
    if (!this.root) return;
    this.root.render(createElement(this.component, this.currentProps));
  }
}
