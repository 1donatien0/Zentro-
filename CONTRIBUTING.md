# Contributing to Zentro

Thank you for your interest in contributing to **Zentro**!

Zentro is currently an **early-stage static frontend prototype** built with plain HTML5, CSS3, and Vanilla JavaScript. Every feature currently runs in the browser using hardcoded HTML product cards and `localStorage`—there is no backend server, database, Firebase integration, real authentication, or real payment processing yet.

Because the project is at an early stage, thoughtful contributions can make a huge impact.

---

## Ways You Can Contribute

- **Bug Fixes:** Fix layout glitches, cart edge cases, broken links, or console errors.
- **UI/UX Improvements:** Improve dark-theme polish, responsive behavior across mobile/tablet/desktop, empty states, and interaction clarity.
- **Accessibility (a11y) Improvements:** Add missing `alt` attributes, semantic HTML controls, `<label>` associations, focus states, and keyboard navigation support.
- **Frontend Development:** Help refactor hardcoded markup, improve client-side state handling, and build foundational storefront features aligned with the [roadmap](README.md#planned-roadmap).
- **Documentation:** Clarify setup instructions, fix typos, or improve developer and contributor docs.
- **Testing:** Manually test user flows across browsers and screen sizes, document reproduction steps for issues, or propose lightweight testing setups (after discussing in an issue first).
- **Performance Improvements:** Optimize images, reduce duplicate CSS/JS, and improve page load behavior.

---

## Prerequisites & Local Environment

Zentro currently requires **no package manager, build step, or external dependencies**. You only need:

- [Git](https://git-scm.com/)
- A modern web browser (Chrome, Brave, Firefox, Safari, or Edge)
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/) (optional: the **Live Server** extension works out of the box with [`.vscode/settings.json`](.vscode/settings.json) on port `5501`)
- Alternatively, Python 3 (built-in `http.server`) to serve static files locally

---

## Contribution Workflow

> **Discuss Substantial Changes First:** Before starting work on large features, architectural changes, new dependencies, or backend/database integrations, please [open an issue](https://github.com/Ayaan-20-11/Zentro-/issues) to discuss your approach with the maintainer. If you would like to work on an existing issue, leave a comment asking to be assigned before opening a pull request.

### 1. Fork the Repository

Click **Fork** at the top right of [`https://github.com/Ayaan-20-11/Zentro-`](https://github.com/Ayaan-20-11/Zentro-) to create your own copy under your GitHub account.

### 2. Clone Your Fork

```bash
git clone https://github.com/<your-username>/Zentro-.git
cd Zentro-
```

Add the original repository as `upstream` so you can keep your fork up to date:

```bash
git remote add upstream https://github.com/Ayaan-20-11/Zentro-.git
```

### 3. Create a Descriptive Feature Branch

Sync with `upstream/main` and create a new branch from `main`:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git checkout -b <type>/<short-description>
```

Suggested branch prefixes: `fix/`, `feat/`, `docs/`, `style/`, `a11y/`, `refactor/` (for example, `git checkout -b fix/empty-cart-message`).

### 4. Make Focused Changes

- Keep each branch and pull request focused on a single bug, improvement, or documentation update.
- Do not add unrelated files, dependencies, or unused media assets.
- Do not modify [`LICENSE`](LICENSE) unless explicitly agreed in an issue.

### 5. Validate & Test Your Changes

Because Zentro does not currently have an automated test suite, linter, or build script, validate your changes manually:

1. **Serve the site locally** using VS Code Live Server (port `5501`) or:
   ```bash
   python3 -m http.server 5501
   ```
   Open `http://localhost:5501/index.html` in your browser.
2. **Test affected user flows:**
   - Entry form (`index.html`) → Storefront (`home.html`) → Search / Product Modal / Cart Sidebar → Checkout (`checkout.html`) → Confirmation (`success.html`).
   - Check the browser DevTools **Console** and **Network** tabs for errors.
   - Test across desktop and mobile viewport sizes using browser DevTools responsive mode.
   - Verify `localStorage` persistence across page refreshes where applicable.
3. **Check your diff for whitespace or unintended edits:**
   ```bash
   git diff --check
   git status
   ```

### 6. Commit with a Meaningful Message

Stage only the files you intentionally changed (avoid `git add .` if untracked local files are present):

```bash
git add <file1> <file2>
git commit -m "<type>: <concise description>"
```

Example commit messages:
- `fix: show empty cart message after decrementing last item`
- `a11y: add alt text to product card images`
- `docs: clarify local server setup in README`

### 7. Push to Your Fork

```bash
git push -u origin <type>/<short-description>
```

### 8. Open a Pull Request

1. Navigate to your fork on GitHub and click **Compare & pull request**.
2. Target the `main` branch of `Ayaan-20-11/Zentro-`.
3. Complete all sections of the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md), link any related issue (e.g., `Fixes #12`), and include screenshots or screen recordings for any UI changes.

---

## Code Quality & Formatting Expectations

- **HTML:** Write clean, semantic HTML5; include meaningful `alt` attributes on images, `<label>` elements on form inputs, and valid nesting (`<script>` tags at the end of `<body>` or with `defer`).
- **CSS:** Keep styling consistent with Zentro's existing dark theme, avoid duplicating selectors across `style.css` and page `<style>` blocks, and verify layouts on mobile viewports (`320px–768px`) as well as desktop.
- **JavaScript:** Keep functions readable and focused; avoid introducing DOM XSS (prefer `textContent` or safe DOM creation over unescaped `innerHTML` for user-supplied or `localStorage` data).
- **Security & Privacy:** Never commit secrets, API keys, tokens, credentials, or `.env` files.

---

## Community Standards

All contributors are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md). For general questions or bug reporting guidance, see [SUPPORT.md](SUPPORT.md). To report a security issue, please review [SECURITY.md](SECURITY.md).
