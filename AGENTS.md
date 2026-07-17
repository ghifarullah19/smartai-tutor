# Agent Instructions

This project uses Spec Driven Development.

Before any action:

Read:

## Core Instructions

.ai/instructions.md

## Project Context

.ai/steering/product.md
.ai/steering/tech.md
.ai/steering/structure.md

## Workflows

Feature request:

.ai/workflows/feature.md

Existing task:

.ai/workflows/task.md

Review:

.ai/workflows/review.md

Refactor:

.ai/workflows/refactor.md

Specification:

.ai/standards/specification.md

Follow these documents as the source of truth.

# Instruction Priority

When conflicts occur, follow this order:

1. User explicit request
2. AGENTS.md
3. .ai/instructions.md
4. .ai/steering/\*
5. .ai/specs/\*
6. Existing code pattern

---

# Command Interpretation

When user says:

"lanjutkan task"
→ Use Existing Task Workflow.

"buat fitur"
→ Use Feature Development Workflow.

"update spec"
→ Use Update Specification Workflow.

"update steering"
→ Use Update Steering Workflow.

"review"
→ Use Review Workflow.

"refactor"
→ Use Refactoring Workflow.

"implement"
→ Execute approved implementation plan.

---

Never skip approval checkpoints.

Ask confirmation before:

- creating specifications
- changing architecture
- implementing major features
