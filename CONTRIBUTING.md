# Contributing

Welcome to the **Stefano Lunardi photographer** site, a headless portfolio built with
Astro + Wix Managed Headless. Thanks for your interest in contributing!

## First steps

1. **Familiarize yourself with the stack**:
   - [Astro](https://docs.astro.build) — the SSR frontend framework.
   - [Wix Managed Headless + Astro](https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/about-the-astro-integration) — how the Wix backend integrates with Astro.
2. **Set up your environment**: this project uses **npm**.

## How to contribute

### 1. Set up your environment

- **Fork the repository** and clone your fork.
- **Use the right Node version** (repo ships an [`.nvmrc`](.nvmrc)):

  ```sh
  nvm use
  ```

- **Install dependencies**:

  ```sh
  npm install
  ```

- **Link the project to a Wix site** if you'll work with live data:

  ```sh
  npm wix  # then: wix login
  ```

### 2. Work on your changes

- **Create a branch**:

  ```sh
  git switch -c feature/my-feature
  ```

- **Develop your changes** and check them in the browser:

  ```sh
  npm dev  # http://localhost:4321
  ```

- **Follow the project conventions** (defined in [AGENTS.md](AGENTS.md), worth reading fully):
  - Every file inside `src/` is **kebab-case** (lowercase, no CamelCase, no `_`, no spaces).
  - Named exports only in `.ts`/`.tsx` (no `export default`). Astro components (`.astro`)
    and API routes are the only exceptions.
  - Never use `any` — TypeScript must pass with zero warnings or errors.
  - Every asset referenced from `.astro`/`.ts`/`.tsx` must go through `baseUrl(...)` —
    plain CSS (e.g. `background-image: url(/assets/logo.svg)`) does not need it.
  - No code comments.
  - Tests live in `src/tests/`, never next to components.

- After testing locally, **close the dev server and free port 4321** (kill the PID of
  the `LISTENING` process). Never leave it open.

### 3. Send your changes

- **Check types before committing** — CI enforces the same check:

  ```sh
  npm check
  ```

- **Commit** with a clear, descriptive message (reference issues with `#123`).
- **Push and open a pull request** — the [PR template](.github/pull_request_template.md)
  will guide you. Keep it one change per PR.

## Good practices

- Check the open issues and PRs before starting, so you don't duplicate work in progress.
- Keep your branch up to date with `main` frequently.
- Don't assert on values injected by Wix in SSR (e.g. `<title>`, SEO meta) in tests —
  only assert what this repo controls.
- Take part in the discussion of your PR if reviewers leave comments.

## Need help?

Open an issue and we'll be glad to help.
