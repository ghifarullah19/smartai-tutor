# Update Specification Workflow

Use this workflow when changing:

- requirements.md
- design.md
- tasks.md

## Phase 1 - Impact Analysis

Before modifying specification:

Analyze:

- reason for change
- affected documents
- impact on existing implementation

Provide:

1. Current specification
2. Proposed change
3. Implementation impact

Wait for approval.

## Phase 2 - Update Specification

After approval:

Update only required files.

Rules:

- Maintain consistency between requirements.md, design.md, tasks.md.
- Do not remove completed decisions without explanation.
- Update task dependencies if required.

## Phase 3 - Implementation Sync

After specification changes:

Identify whether:

- existing code requires modification
- migration is required
- no implementation change is needed
