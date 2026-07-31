---
name: spec-driven-development
description: Enforces Spec Driven Development (SDD) methodology. Use this skill to strictly manage feature creation, task implementation, bug-fixing, refactoring, and code review using a rigorous specification-first approach.
---

# Spec Driven Development (SDD) Skill Router

You are operating under the Spec Driven Development (SDD) methodology.
Your primary directive is: **NEVER write code without an approved specification and an implementation plan.**

## Workflow Routing (MANDATORY)

To prevent hallucination and ensure strict adherence to SDD, you MUST NOT guess the steps. 
Depending on the user's request, you **MUST** use the `view_file` tool to read the corresponding workflow document in the `workflows/` directory of this skill BEFORE taking any action.

- **Feature Request** (e.g., "buat fitur", "bikin halaman baru"):
  👉 **MUST READ**: `workflows/feature.md`

- **Existing Task** (e.g., "lanjutkan task", "implement"):
  👉 **MUST READ**: `workflows/task.md`

- **Bug Fix** (e.g., "perbaiki bug", terdapat error runtime/build):
  👉 **MUST READ**: `workflows/bug-fix.md`

- **Refactoring** (e.g., "refactor", "rapikan kode"):
  👉 **MUST READ**: `workflows/refactor.md`

- **Code Review** (e.g., "tolong review"):
  👉 **MUST READ**: `workflows/review.md`

- **Update Specification** (e.g., "update spec", "ubah requirements"):
  👉 **MUST READ**: `workflows/update-spec.md`

- **Update Steering / Context** (e.g., "update steering"):
  👉 **MUST READ**: `workflows/update-steering.md`

## Specification Standards

When any workflow instructs you to create or modify specifications (`requirements.md`, `design.md`, `tasks.md`), you **MUST** first read the specification standards:
👉 **MUST READ**: `standards/specification.md`

## Instruction Priority
When conflicts occur, follow this order of priority:
1. User's explicit request
2. This SKILL.md document and its loaded workflows
3. Project Context (`.sdd/steering/*`)
4. Feature Specifications (`.sdd/features/*`)
5. Existing code patterns
