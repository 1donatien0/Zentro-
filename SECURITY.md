# Security Policy

## Project Security Status

**Zentro is currently an early-stage static frontend prototype.**

At this stage, Zentro runs purely in the browser (`HTML`, `CSS`, `Vanilla JavaScript`, and `localStorage`) and does **not** yet provide:

- Production-grade authentication or session management
- A backend server or API layer
- Database security or access-control rules
- Real payment processing

Do not deploy the current prototype with sensitive user data or real transactions. Security hardening (including fixing client-side DOM/XSS risks and introducing proper backend/auth controls) is part of the project roadmap in [`README.md`](README.md).

---

## Supported Versions

Because Zentro is in active early prototyping without versioned releases yet, only the latest state of the `main` branch receives fixes.

| Branch / Version | Supported |
| :--- | :--- |
| `main` (latest prototype) | Best-effort fixes |

---

## Reporting a Vulnerability

**Please do not disclose security vulnerabilities publicly** (such as in public GitHub Issues, Pull Requests, or comments) before they have been reviewed and addressed. Public disclosure before a fix is available puts users and contributors at unnecessary risk.

### How to Report Privately

1. **GitHub Private Vulnerability Reporting (Preferred if enabled):**
   Check the repository's **Security → Advisories** tab at [`https://github.com/Ayaan-20-11/Zentro-/security/advisories`](https://github.com/Ayaan-20-11/Zentro-/security/advisories) to submit a private vulnerability report directly to the maintainer.
2. **If Private Vulnerability Reporting is not enabled:**
   Contact the repository owner (`@Ayaan-20-11`) privately through GitHub before creating any public issue.

### What to Include in Your Report

To help evaluate and reproduce the issue quickly, please include:

- A clear description of the vulnerability and the affected file(s) or flow
- Step-by-step instructions or a minimal proof of concept to reproduce the issue
- Potential security impact (for example, XSS, data exposure, or client-side bypass)
- Browser/environment details, if relevant
- Any suggested fix or mitigation, if you have one

### What to Expect

- The repository maintainer will review your report, confirm whether the issue applies to the current codebase, and work on a fix on a private branch or coordinated patch.
- Because Zentro is a maintainer-run early prototype, no fixed response-time SLA is guaranteed, though reports will be addressed on a best-effort basis.
- Please allow time for a fix to be prepared and merged before sharing details publicly.
