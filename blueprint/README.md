# Blueprint: Implementation Specification

**Instructions for Code Claude:**
Code Claude will read the documents in this `/blueprint` folder, write the corresponding code in the monorepo structure, and execute verification steps. Use the provided schemas, API definitions, and business rules as the source of truth.

## Folder Contents
1. `architecture.md`: System design, tech stack details, and monorepo configuration.
2. `data-model.md`: Detailed Prisma schema and entity relationships.
3. `api-spec.md`: Endpoint definitions, authentication, and validation rules.
4. `ui-spec.md`: Design system, component hierarchy, and editorial layout requirements.

## Core Directives
- **Type Safety**: Enforce strict TypeScript across apps and shared packages.
- **Security**: Never store raw tokens; use Argon2 for admin passwords; implement rate limiting.
- **Performance**: Use `next/image` for all media; ensure LCP < 2.5s.
- **Clean Code**: Follow NestJS best practices (Modules, Services, Controllers) and Radix UI patterns.
