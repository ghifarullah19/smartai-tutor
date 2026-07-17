# Agent Instructions

## Project Context

This project follows Spec Driven Development.

## Steering Rules

Before making any changes, read:

- .ai/steering/product.md
- .ai/steering/tech.md
- .ai/steering/structure.md

These files define:

- product goals
- technical decisions
- coding standards
- architecture constraints

## Development Workflow

For every feature:

1. Read related specification inside `.ai/specs`
2. Review requirements.md
3. Review design.md
4. Follow tasks.md
5. Suggest tasks plan
6. Implement only approved tasks plan

## Modification Rules

- Do not violate architecture.md
- Do not introduce new dependencies without justification
- Update documentation if architecture changes
- Keep implementation aligned with requirements

## Task Status Rules

The checkbox status in `.ai/specs/*/tasks.md` represents implementation progress.

Rules:

- [x] = completed, do not redo
- [ ] = pending, candidate for implementation
- [ ]\* = optional task, implement only if requested
