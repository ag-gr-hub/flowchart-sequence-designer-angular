---
name: Bug report
about: Report something that isn't working as documented
title: '[Bug] '
labels: bug
---

## What happened

<!-- A clear description of the bug. -->

## Expected behavior

<!-- What you thought would happen. -->

## Minimal reproduction

<!-- A runnable snippet or StackBlitz link. The smaller the better. -->

```typescript
// e.g.
@Component({
  imports: [FsdDiagramComponent],
  template: `<fsd-diagram [theme]="'dark'" (modelChange)="log($event)" />`
})
export class TestComponent {
  log(m: any) { console.log(m); } // → unexpected behavior
}
```

## Environment

- Package version: `0.1.0`
- Angular version:
- Node version:
- OS:
- Browser:

## Additional context

<!-- Screenshots, related issues, anything else useful. -->
