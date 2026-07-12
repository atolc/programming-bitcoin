# Contributing to Programming Bitcoin — Interactive Notes

Thank you for your interest in contributing! This guide will help you get set up and explain the different ways you can contribute.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How to run the project locally](#how-to-run-the-project-locally)
3. [Adding or editing chapter notes](#adding-or-editing-chapter-notes)
4. [Adding exercises](#adding-exercises)
5. [Adding a new language](#adding-a-new-language)
6. [Submitting a pull request](#submitting-a-pull-request)
7. [Commit conventions](#commit-conventions)

---

## Code of Conduct

Please be respectful and constructive in all interactions. This is an educational project — everyone is welcome regardless of experience level.

---

## How to run the project locally

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- [pnpm](https://pnpm.io/) ≥ 10

```bash
git clone https://github.com/caeher/programming-bitcoin.git
cd programming-bitcoin
pnpm install
pnpm dev
```

The dev server will start at <http://localhost:5173>.

---

## Adding or editing chapter notes

Chapter notes live in the `docs/` directory, organized by language:

```
docs/
├── es/   ← Spanish notes
│   ├── campos-finitos/
│   │   ├── 01-intro.md
│   │   ├── 02-definition.md
│   │   └── ...
│   └── ...
└── en/   ← English notes
    └── ...
```

### Markdown format

Each section file is a plain Markdown file. The following custom directives are supported:

#### Callouts

```markdown
:::note
This is a note callout.
:::

:::warning
This is a warning.
:::

:::tip
This is a tip.
:::
```

#### Math (LaTeX)

Inline: `$E = mc^2$`

Block:
```markdown
$$
a^2 + b^2 = c^2
$$
```

#### Quiz blocks

```markdown
:::quiz
question: What is the order of the secp256k1 curve?
answer: n = FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
:::
```

### Chapter manifest

After adding a new chapter folder, run:

```bash
pnpm generate:manifest
```

This regenerates `src/data/chapters-manifest.json` which the app uses to build the sidebar navigation.

---

## Adding exercises

Exercises are defined in JSON files discovered by `scripts/generate-exercises.mjs`. Each exercise has the following shape:

```json
{
  "id": "campos-finitos-ex-01",
  "chapterSlug": "campos-finitos",
  "locale": "es",
  "title": "FieldElement.__eq__",
  "description": "Implement the `__eq__` method for `FieldElement`.",
  "starterCode": "class FieldElement:\n    def __eq__(self, other):\n        # your code here\n        pass",
  "testCode": "assert FieldElement(2, 31) == FieldElement(2, 31)",
  "exampleCode": "# Example\nfe = FieldElement(2, 31)\nprint(fe)"
}
```

After editing the manifest, run:

```bash
pnpm generate:exercises
pnpm validate:exercises
```

---

## Adding a new language

1. Create a new directory under `docs/`, e.g. `docs/fr/`, mirroring the structure of `docs/es/`.
2. Add the locale code to `src/lib/locale.ts` → `LOCALES` array.
3. Add the UI translation strings to `src/locales/<lang>/ui.json` (copy from `es/ui.json` and translate).
4. Add the practice route segment to `src/lib/routes.ts` → `PRACTICE_SEGMENTS`.
5. Run `pnpm validate:locales` to check for missing keys.

---

## Submitting a pull request

1. **Fork** the repository and create your branch from `main`:
   ```bash
   git checkout -b feat/my-feature
   ```
2. Make your changes and follow the [Commit conventions](#commit-conventions) below.
3. Run the validation suite before pushing:
   ```bash
   pnpm validate:math
   pnpm validate:locales
   pnpm validate:chapters
   pnpm validate:exercises
   ```
4. Push your branch and open a Pull Request against `main`.
5. Describe **what** you changed and **why** in the PR description.

---

## Commit conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short description>
```

### Types

| Type | When to use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `chore` | Maintenance tasks, dependency updates |
| `style` | Formatting changes (no logic change) |
| `perf` | Performance improvements |
| `test` | Adding or fixing tests |
| `build` | Changes to the build system or scripts |
| `ci` | Changes to CI/CD configuration |

### Examples

```
feat(exercises): add interactive exercises for ch. 4 (serialization)
fix(editor): resolve race condition in PythonEditorPanel highlight effect
docs(readme): add quickstart and tech stack section
chore(deps): upgrade pyodide to 0.29.4
```

Commits referencing an issue should include `Closes #<number>` in the commit body:

```
fix(editor): unify Monaco readOnly mode to eliminate XSS risk

Replaces the shiki + dangerouslySetInnerHTML rendering path with a
single Monaco Editor instance using the readOnly option. This also
eliminates the async race condition in the highlight useEffect.

Closes #7
```
