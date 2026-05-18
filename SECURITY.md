# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 0.x     | ✅ Active support  |

## Reporting a Vulnerability

If you discover a security vulnerability in `@flowchart-sequence-designer/angular`,
please report it responsibly:

1. **Do NOT open a public GitHub issue.**
2. Use GitHub's [private vulnerability reporting](https://github.com/ag-gr-hub/flowchart-sequence-designer-angular/security/advisories/new) feature.
3. Include:
   - A description of the vulnerability
   - Steps to reproduce
   - Impact assessment
   - Suggested fix (if any)

We aim to acknowledge reports within **48 hours** and provide a fix or
mitigation within **7 days** for confirmed issues.

## Scope

This package is a thin Angular wrapper around the React-based
`flowchart-sequence-designer` editor. The primary attack surface is:

- **React Bridge** — mounts a React root inside Angular's DOM; props are
  passed through without transformation.
- **Dynamic import** — the editor is loaded at runtime via `import()`.
- **Dependencies** — React, ReactDOM, and Angular are peer dependencies;
  the core editor handles sanitization of user input.

## Security Practices

- All GitHub Actions use version-pinned tags
- CI workflows use minimal `permissions`
- No `eval()`, `innerHTML`, or `bypassSecurityTrust*` in source
- All user callbacks are wrapped in `NgZone.run()` (no zone escape vectors)
