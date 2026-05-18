import { createRoot, Root } from "react-dom/client";
import { createElement, ComponentType } from "react";
import { NgZone } from "@angular/core";

/**
 * Manages the lifecycle of a React component mounted inside an Angular component's DOM element.
 * Wraps all React→Angular callbacks in NgZone.run() to trigger change detection.
 */
export class ReactBridge<P extends object> {
  private root: Root | null = null;
  private component: ComponentType<P>;
  private currentProps: P;
  private zone: NgZone | null;

  constructor(component: ComponentType<P>, initialProps: P, zone?: NgZone) {
    this.component = component;
    this.currentProps = initialProps;
    this.zone = zone ?? null;
  }

  mount(container: HTMLElement): void {
    if (this.root) return;
    // Create React root outside Angular zone to avoid triggering unnecessary change detection
    // on every React internal re-render
    if (this.zone) {
      this.zone.runOutsideAngular(() => {
        this.root = createRoot(container);
        this.render();
      });
    } else {
      this.root = createRoot(container);
      this.render();
    }
  }

  update(props: Partial<P>): void {
    this.currentProps = { ...this.currentProps, ...props };
    if (this.zone) {
      this.zone.runOutsideAngular(() => this.render());
    } else {
      this.render();
    }
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
