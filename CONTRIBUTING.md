# Contributing to Zentro

---

## 1. Welcome to Zentro

Thank you for your interest in contributing to **Zentro**!

Zentro is an **early-stage static e-commerce frontend prototype** built with plain HTML5, CSS3, and Vanilla JavaScript. All current functionality runs in the browser using static HTML pages (`index.html`, `home.html`, `checkout.html`, `success.html`) and browser `localStorage`—there is no backend server, database, real authentication, or payment gateway yet.

First-time open-source contributors and experienced developers alike are warmly welcomed. Whether you are fixing a small CSS alignment bug, improving accessibility, writing tests, or building new frontend storefront features, we value respectful, thoughtful, and constructive collaboration.

---

## 2. Code of Conduct

All contributors and maintainers must follow our [Code of Conduct](CODE_OF_CONDUCT.md) (Contributor Covenant v2.1) across issues, pull requests, and reviews.

To report abusive, harassing, or unacceptable behavior privately without posting personal details in a public issue, email the repository maintainer at [avkapoor2011@gmail.com](mailto:avkapoor2011@gmail.com). See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for full details.

---

## 3. Before You Start

Before writing code, please:

1. **Browse existing issues** on the [Zentro Issue Tracker](https://github.com/Ayaan-20-11/Zentro-/issues) to see open bugs, planned improvements, and active discussions.
2. **Avoid duplicate work:** Check comments and linked pull requests on an issue to confirm nobody else is already actively implementing it.
3. **Choose an appropriate starter task:** Issues labeled [`good first issue`](https://github.com/Ayaan-20-11/Zentro-/issues?q=is%3Aopen+label%3A%22good+first+issue%22) are scoped for beginners, while [`help wanted`](https://github.com/Ayaan-20-11/Zentro-/issues?q=is%3Aopen+label%3A%22help+wanted%22) covers larger enhancements.
4. **Comment and ask before starting:** Leave a comment on the issue asking for clarification or maintainer confirmation before starting work. Wait for maintainer confirmation/assignment when appropriate.
5. **Discuss substantial changes first:** For large new features, architectural refactors, or introducing external dependencies, open an issue using our [Feature Request template](https://github.com/Ayaan-20-11/Zentro-/issues/new/choose) to align on scope before writing code.

---

## 4. Contribution Types

We welcome focused contributions across these areas (aligned with our [Planned Roadmap](README.md#planned-roadmap)):

- **Bug Fixes (`bug`):** Broken images, cart state bugs, console errors, or checkout regressions.
- **New Features (`enhancement`):** Category filtering, product sorting, wishlist persistence, recently viewed items, or checkout validation.
- **UI/UX Improvements (`enhancement`):** Consistent component styling, visual polish, empty states, and feedback transitions.
- **Responsive Design (`enhancement`):** Fixing mobile and tablet overflow or layout issues across `320px–1024px+` viewports.
- **Accessibility (`accessibility`):** Missing `alt` attributes, `<label>` associations, keyboard navigation, and `:focus-visible` states.
- **Performance (`enhancement`):** Image lazy loading, optimized asset sizes, and removing redundant DOM/listener work.
- **Documentation (`documentation`):** Keeping [README.md](README.md), setup steps, and contributor docs accurate and up to date.
- **Refactoring & Maintainability:** Removing dead/orphaned HTML/CSS, consolidating duplicate logic, and improving readability.
- **Automated Tests:** Expanding test coverage in [`tests/`](tests/zentro.test.mjs) for existing and new frontend behaviors.

> **Important:** Substantial changes (such as reorganizing the product catalog model or adding new dependencies) should always be discussed in a GitHub issue before implementation.

---

## 5. Development Environment Setup

Zentro requires **no bundler, database, or third-party npm packages**.

### Required Software
- [Git](https://git-scm.com/)
- A modern web browser (Chrome, Brave, Firefox, Safari, or Edge)
- [Node.js](https://nodejs.org/) `>= 20.0.0` (used to run the zero-dependency validation script and built-in `node --test` suite)
- [Ruby](https://www.ruby-lang.org/) (preinstalled on macOS and Ubuntu; used by validation to check `.github/` YAML syntax)
- **Local static server (pick one):**
  - [Visual Studio Code](https://code.visualstudio.com/) with the **Live Server** extension (`ritwickdey.LiveServer`), preconfigured via [`.vscode/settings.json`](.vscode/settings.json) on port `5501`
  - **Python 3** built-in HTTP server (`python3 -m http.server 5501`)

### Setup Steps

1. **Fork** [`https://github.com/Ayaan-20-11/Zentro-`](https://github.com/Ayaan-20-11/Zentro-) on GitHub.
2. **Clone your fork** and enter the project directory:
   ```bash
   git clone https://github.com/<your-username>/Zentro-.git
   cd Zentro-
   ```
3. **Start the application locally** using VS Code Live Server (**Go Live** on `index.html`) or Python:
   ```bash
   python3 -m http.server 5501
   ```
4. **Open in your browser:** Visit [`http://localhost:5501/index.html`](http://localhost:5501/index.html) (entry screen) and test the flow through `home.html` → `checkout.html` → `success.html`.

No `npm install` is required because `package.json` intentionally declares zero runtime or development dependencies.

---

## 6. Git Workflow

1. **Fork the repository** on GitHub.
2. **Clone your fork:**
   ```bash
   git clone https://github.com/<your-username>/Zentro-.git
   cd Zentro-
   ```
3. **Add the upstream remote:**
   ```bash
   git remote add upstream https://github.com/Ayaan-20-11/Zentro-.git
   ```
4. **Sync `main` and create a feature branch:**
   ```bash
   git fetch upstream
   git checkout main
   git merge --ff-only upstream/main
   git checkout -b fix/cart-empty-state
   ```
5. **Make focused changes** addressing only the target issue.
6. **Run automated checks and test manually in a browser:**
   ```bash
   npm run validate
   npm test
   ```
7. **Review your diff and check whitespace before committing:**
   ```bash
   git status
   git diff
   git diff --check
   ```
8. **Stage intended files explicitly and commit:**
   ```bash
   git add home.html tests/zentro.test.mjs
   git commit -m "fix: show empty cart message when last item is removed"
   ```
9. **Push your branch to your fork:**
   ```bash
   git push -u origin fix/cart-empty-state
   ```
10. **Open a pull request** on GitHub targeting `Ayaan-20-11/Zentro-` branch `main`.

### Synchronizing an Existing Fork with Upstream

If `upstream/main` advances while you are working:

```bash
git fetch upstream
git checkout main
git merge --ff-only upstream/main
git checkout <your-branch>
git merge main
```

---

## 7. Branch Naming Conventions

Use descriptive, lowercase, hyphen-separated branch names in the format:

`<type>/<short-description>`

Allowed prefixes:

| Prefix | Use Case | Example |
|---|---|---|
| `feat/` | New user-facing feature | `feat/product-filter` |
| `fix/` | Bug fix | `fix/cart-empty-state` |
| `docs/` | Documentation updates | `docs/contributing-guide` |
| `test/` | Adding or updating tests | `test/cart-validation` |
| `refactor/` | Code restructuring without behavior change | `refactor/catalog-data` |
| `style/` | CSS, formatting, or UI styling polish | `style/navbar-reset-button` |
| `chore/` | Tooling, CI, or cleanup tasks | `chore/remove-unused-markup` |

---

## 8. Commit Message Guidelines

Follow a Conventional Commit-style prefix format:

`<type>: <concise imperative description>`

Supported prefixes: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `style:`, `chore:` (plus `a11y:`, `perf:`, `ci:` when specific).

- **Good examples:**
  - `fix: show toast notification when adding duplicate cart item`
  - `feat: filter storefront cards by category`
  - `docs: document local test commands in CONTRIBUTING.md`
  - `test: cover checkout form submission and order summary rendering`
- **Avoid:**
  - `wip`, `fix`, `update`, `changes`, `final commit`
  - Committing temporary files, `.DS_Store`, `.env` files, or unrelated edits

### Single-Commit Policy

Zentro **does not impose a strict one-commit-per-PR rule**:

- For **small, self-contained changes** (e.g., a single bug fix or doc edit), one clean, focused commit is encouraged.
- For **larger features or refactors**, multiple logical commits (such as separate implementation, test, and documentation commits) are completely welcome.
- Avoid noisy `fixup`, typo, or `"oops"` commits where possible. Maintainers may request squashing or choose squash-merge on GitHub when appropriate.

---

## 9. Coding Standards

Follow the conventions derived from Zentro's current static architecture:

### HTML
- Include `<!DOCTYPE html>`, `<meta charset="UTF-8">`, and `<meta name="viewport" content="width=device-width, initial-scale=1.0">` on every page.
- Prefer semantic controls (`<button type="button">`, `<a href="...">`, `<nav>`, `<main>`, `<footer>`) over clickable `<div>`/`<span>` elements.
- Associate every `<input>` with a `<label for="...">` and provide descriptive `alt` text on every `<img>`.
- Place `<script>` tags at the end of `<body>` (or use `defer`) so DOM elements exist before script execution.

### CSS
- Match Zentro's dark slate (`#0f172a`, `#111827`, `#1e293b`) and electric cyan (`#00c2ff`) aesthetic.
- Avoid duplicating rules across [`style.css`](style.css) and inline `<style>` blocks in HTML pages.
- Test responsive behavior across `320px`, `375px`, `768px`, and `1440px` viewports so cards, modals, and drawers do not overflow horizontally.

### JavaScript
- Write clear, single-purpose functions with descriptive names; avoid polluting the global scope unnecessarily.
- Handle empty, missing, and invalid `localStorage` states gracefully (avoid printing `null` or leaving blank containers).
- **Never** interpolate user-supplied or `localStorage` values directly into `innerHTML`—use `document.createElement(...)`, `textContent`, and `addEventListener(...)` instead to prevent DOM XSS.
- Keep existing shopping flows working cleanly unless an issue explicitly changes them.

### General
- Keep pull requests narrowly scoped; avoid unrelated formatting rewrites or refactors.
- Remove temporary `console.log` debugging statements before opening a PR.
- Do not introduce npm dependencies, build tools, or backend frameworks without prior maintainer discussion in an issue.
- Never commit secrets, API keys, credentials, tokens, `.env` files, or real personal information.

---

## 10. Testing Guidelines

Zentro uses two lightweight, zero-dependency automated suites in addition to manual browser verification.

### Automated Checks

| Test Name | Purpose | Prerequisites | Exact Execution Command | Expected Result | What Failure Means |
|---|---|---|---|---|---|
| **Static Repository Validation** | Validates `.js`/`.mjs` and inline `<script>` syntax, HTML document structure, unique IDs, `getElementById` targets, balanced CSS braces/comments, local asset/link targets, `.github/` YAML syntax, Markdown links/anchors, conflict markers, and `.env`/secret hygiene. | Node.js `>= 20`, Ruby (`yaml`), Git | `npm run validate` *(or `node scripts/validate.mjs`)* | Prints `Validation passed cleanly across <N> repository files.` and exits `0`. | A syntax error, duplicate HTML `id`, broken local asset/link/anchor, invalid YAML, conflict marker, or forbidden file was detected—fix the reported file/line before pushing. |
| **Automated Functional & Integration Tests** | Executes actual scripts from `index.html`, `home.html`, `checkout.html`, `success.html`, and `script.js` inside a Node `vm` DOM/`localStorage` harness (`tests/zentro.test.mjs`) covering entry validation, cart add/repeat/quantity/reset/persistence, search filtering, quick-view modal, mock checkout, and order confirmation. | Node.js `>= 20` | `npm test` *(or `node --test tests/*.test.mjs`)* | All tests pass (`fail 0`) and exits `0`. | Either a regression broke existing entry/cart/search/checkout behavior or an intentional change requires updating the corresponding test assertions in `tests/zentro.test.mjs`. |
| **Diff Whitespace & Conflict Check** | Detects trailing whitespace, blank lines at EOF added by your changes, and conflict markers across uncommitted changes or PR diff. | Git | `git diff --check` *(or `git diff --check origin/main...HEAD`)* | Exits `0` with no output. | Your edits introduced trailing whitespace or unresolved markers—clean up the reported lines. |

### Manual Browser Testing (Required for UI, CSS, and Interactive Changes)

Automated DOM harness tests do not replace real browser rendering. Before submitting UI or interactive PRs, run `python3 -m http.server 5501` (or Live Server) and verify manually:

1. **Full Shopping Journey:** `index.html` validation & redirect → `home.html` greeting, search, quick-view modal, cart add/increment/decrement/reset, refresh persistence → `checkout.html` → `success.html`.
2. **Console & Network Tabs:** Confirm zero new uncaught JavaScript errors or broken local assets in browser DevTools.
3. **Responsive Viewports:** Inspect desktop (`1440×900`), tablet (`768×1024`), and mobile (`375×812`) layouts in DevTools Responsive Design Mode.
4. **Accessibility:** Navigate modified controls using `Tab`, `Enter`, and `Space` and inspect focus visibility, labels, and image `alt` attributes.

---

## 11. Pull Request Requirements

When opening a pull request against `main`, please use [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md) and ensure:

- **PR Title** follows `<type>: <short description>` (e.g., `fix: restore empty cart message`, `feat: add category filter`). Allowed types: `feat`, `fix`, `docs`, `test`, `refactor`, `style`, `chore`, `a11y`, `perf`, `ci`.
- **PR Description** clearly explains the problem, the solution, testing performed, and any known limitations.
- **Issue Linking:** Use `Fixes #<issue-number>` or `Closes #<issue-number>` only when your PR genuinely resolves that issue. Never claim to fix unrelated issues.
- **Screenshots / Recordings:** Include before/after screenshots for any HTML/CSS or visual change.
- **Target Branch:** Base your PR on the latest `main` branch without unrelated changes.

---

## 12. Pull Request Review Process

Typical pull request lifecycle:

`Opened` → `Automated Checks (CI)` → `Maintainer Review` → `Changes Requested (if needed)` → `Approval` → `Merge`

What to expect:
- **Automated CI checks** ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) run automatically on PRs targeting `main`:
  - `validate` (*Repository & Static Validation*)
  - `test` (*Automated Functional Tests*)
  - `pr-checks` (*Pull Request Hygiene*: PR title format, non-empty description, commit hygiene notices, newly added large binary warnings)
- **Recommended Required Status Checks (Future Branch Protection):** Once CI is active on `main`, `Repository & Static Validation` (`validate`) and `Automated Functional Tests` (`test`) are intended to be configured as required status checks in GitHub branch protection rules. *(Note: branch protection is not currently enabled on `main`.)*
- Passing CI is necessary for smooth review, though it does not automatically guarantee acceptance.
- Address maintainer review comments cleanly and avoid force-pushing during active review unless requested. No specific review or merge SLA timeline is guaranteed.

---

## 13. Security Guidelines

- Review [`SECURITY.md`](SECURITY.md) before reporting or handling security issues.
- **Never** commit API keys, tokens, passwords, private keys, or `.env` files.
- **Never** disclose unpatched security vulnerabilities in public GitHub issues, pull requests, or comments.
- Report security concerns privately via [avkapoor2011@gmail.com](mailto:avkapoor2011@gmail.com) (or GitHub Private Vulnerability Reporting under **Security → Advisories** if enabled).

---

## 14. Documentation Standards

- Update [`README.md`](README.md) whenever setup steps, project structure, implemented features, or limitations change.
- Update [`screenshots/`](screenshots/) and the README preview if a PR intentionally alters major UI screens.
- Run `npm run validate` after editing any `.md` or `.yml` file to verify all relative links, heading anchors, and YAML syntax remain intact.
- Keep descriptions honest—do not document roadmap plans as implemented features.

---

## 15. Getting Help

- **Questions, bug reports & feature ideas:** Use the [GitHub Issue Tracker](https://github.com/Ayaan-20-11/Zentro-/issues) (see [`SUPPORT.md`](SUPPORT.md) for guidance; GitHub Discussions are not currently enabled).
- **Private matters (Code of Conduct or Security):** Email [avkapoor2011@gmail.com](mailto:avkapoor2011@gmail.com).

---

## 16. Recognition

All accepted contributors are recognized through GitHub's commit and pull request history on the repository. Contributions are voluntary open-source participation under the [MIT License](LICENSE).

---

## 17. Final Contributor Checklist

Before submitting your pull request, confirm:

- [ ] You checked existing issues / discussed substantial changes first.
- [ ] Your branch name follows `<type>/<short-description>`.
- [ ] Changes are focused on a single issue with no unrelated edits.
- [ ] Code follows Zentro's HTML, CSS, JavaScript, and XSS-safety standards.
- [ ] `npm run validate` and `npm test` both pass locally.
- [ ] `git diff --check` reports zero whitespace or conflict errors.
- [ ] Affected flows were manually verified in a browser (desktop & mobile for UI changes).
- [ ] Documentation and screenshots were updated if applicable.
- [ ] Commit messages are clear and meaningful.
- [ ] PR title follows `<type>: <short description>` and the PR template is filled out.
- [ ] No secrets, credentials, `.env` files, or personal data were introduced.
