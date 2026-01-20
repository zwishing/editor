<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

Maputnik is a MapLibre style editor written using React and TypeScript.

To get started, install all npm packages:

```
npm install
```

Verify code correctness by running ESLint:

```
npm run lint
```

Or try fixing lint issues with:

```
npm run lint -- --fix
```

The project type checked and built with:

```
npm run build
```

To run the tests make sure that xvfb is installed:

```
apt install xvfb
```

Run the development server in the background with Vite:

```
nohup npm run start &
```

Then start the Cypress tests with:

```
xvfb-run -a npm run test
```

## Pull Requests

- Pull requests should update `CHANGELOG.md` with a short description of the change.
