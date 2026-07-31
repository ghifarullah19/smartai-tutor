# Refactoring Workflow

When refactoring existing code:

Before implementation:

Analyze:

- reason for refactor
- affected files
- expected improvement
- risks

Rules:

- Do not change functionality unless requested.
- Preserve existing behavior.
- Update design.md if architecture changes.

Provide plan before coding.

After implementation:
- Update `.sdd/changelog.md` with a summary of the refactoring changes to preserve context.
