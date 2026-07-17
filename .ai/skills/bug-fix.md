# Fix Workflow

Use this workflow when:

- build errors occur
- runtime errors occur
- test failures occur
- lint errors occur
- UI does not match the approved specification
- application behavior does not match the approved specification
- business logic behaves incorrectly
- regressions are introduced

The purpose of this workflow is to fix the implementation while preserving the approved specification.

---

# Phase 1 - Root Cause Analysis

Before modifying any code:

Read:

- related requirements.md
- related design.md
- related tasks.md

Review:

- current implementation
- error message
- stack trace (if available)
- build/test output

Analyze:

1. Root cause
2. Related requirement
3. Whether the implementation violates the specification
4. Files that may require modification

Provide:

## Root Cause Summary

## Proposed Fix

## Files to Modify

## Risks

Wait for user approval.

Do NOT modify any code before approval.

---

# Phase 2 - Fix Implementation

After approval:

Rules:

- Fix only the root cause.
- Preserve approved functionality.
- Do not introduce unrelated refactoring.
- Do not modify requirements.md.
- Do not modify design.md.
- Do not modify unrelated tasks.

---

# Phase 3 - Verification

After implementation:

Verify:

- build
- lint
- tests (if available)

Confirm:

- original error resolved
- no regression introduced

Update:

- implementation summary
- modified files

Do NOT mark tasks as completed unless explicitly requested.

# Out of Scope

The Fix Workflow MUST NOT:

- Refactor unrelated code.
- Change project architecture.
- Update steering.
- Update specifications.
- Implement new features.
- Change completed tasks unless explicitly requested.