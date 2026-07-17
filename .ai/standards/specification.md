# Specification Writing Rules

When creating `.kiro/specs`, do not create high-level product requirements.

Specifications must be implementation-ready.

Every requirement MUST contain:

1. User Story
2. Functional Requirement
3. Acceptance Criteria

Acceptance Criteria must:

- Be testable
- Define exact behavior
- Mention affected files/components when possible
- Include constraints
- Include edge cases
- Include verification method

Avoid vague statements:

Bad:
"Create modern UI"

Good:
"THE Dashboard_Page SHALL display order summary cards with..."

# SDD Specification Standard

When generating requirements.md:

Use this structure:

# Requirements Document

## Introduction

Explain:

- project context
- goal
- scope
- limitations

## Glossary

Define:

- components
- technical terms

## Requirements

For each requirement:

### Requirement X: Name

User Story:
"As a ... I want ... so that ..."

Acceptance Criteria:

1. THE [Component] SHALL...
2. WHEN [condition], THE [component] SHALL...
3. IF [error condition], THEN THE [system] SHALL...

Acceptance criteria should be measurable.

When creating design.md, include:

1. Current architecture impact
2. Component changes
3. File structure changes
4. Data flow
5. UI layout specification
6. Styling decisions
7. Responsive behavior
8. Technical constraints

When creating tasks.md:

Tasks must:

- Be ordered by dependency
- Be small enough to implement independently
- Reference requirement IDs
- Mention exact files
- Include implementation details

Example:

Good:

- [ ] 3. Update Login page styling
  - Modify Login.module.css
  - Replace hardcoded spacing with design tokens
  - Add responsive breakpoint <=768px
  - Requirements: 6.1, 6.2

Bad:

- [ ] Improve Login page
