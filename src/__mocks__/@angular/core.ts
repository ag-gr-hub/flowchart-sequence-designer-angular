// Minimal Angular core mocks for testing
export class EventEmitter<T = any> {
  private listeners: ((value: T) => void)[] = [];
  emit(value: T): void {
    this.listeners.forEach((fn) => fn(value));
  }
  subscribe(fn: (value: T) => void) {
    this.listeners.push(fn);
    return { unsubscribe: () => {} };
  }
}

export class ElementRef<T = any> {
  constructor(public nativeElement: T) {}
}

export class NgZone {
  run<T>(fn: () => T): T { return fn(); }
  runOutsideAngular<T>(fn: () => T): T { return fn(); }
}

export class ChangeDetectorRef {
  markForCheck(): void {}
  detectChanges(): void {}
}

// Decorators (no-ops)
export function Component(_: any): ClassDecorator { return (target: any) => target; }
export function Input(_?: any): PropertyDecorator { return () => {}; }
export function Output(): PropertyDecorator { return () => {}; }
export function ViewChild(_: any, __?: any): PropertyDecorator { return () => {}; }

export const ChangeDetectionStrategy = { OnPush: 1, Default: 0 };

export interface OnInit { ngOnInit(): void; }
export interface OnChanges { ngOnChanges(changes: any): void; }
export interface OnDestroy { ngOnDestroy(): void; }
export type SimpleChanges = Record<string, any>;
