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

1. **Email (Private Fallback & Direct Contact):**
   Email the maintainer privately at [avkapoor2011@gmail.com](mailto:avkapoor2011@gmail.com) before creating any public issue.
2. **GitHub Private Vulnerability Reporting (If Enabled):**
   If enabled on the repository, you may also check **Security → Advisories** at [`https://github.com/Ayaan-20-11/Zentro-/security/advisories`](https://github.com/Ayaan-20-11/Zentro-/security/advisories) (direct form: [`https://github.com/Ayaan-20-11/Zentro-/security/advisories/new`](https://github.com/Ayaan-20-11/Zentro-/security/advisories/new)) to submit a private vulnerability report. If that option is unavailable, use the email address above.

### What to Include in Your Report

To help evaluate and reproduce the issue quickly, please include:

- A clear description of the vulnerability and the affected component, file(s), or flow
- Step-by-step instructions to reproduce the issue
- Potential security impact (for example, XSS, data exposure, or client-side bypass)
- A minimal supporting proof of concept, if safe to provide
- Browser/environment details, if relevant
- Any suggested fix or mitigation, if you have one

### What to Expect

- Reports will be reviewed privately by the repository maintainer to determine whether the issue applies to the current codebase and how to address it.
- Zentro is a maintainer-run early prototype without a formal security response team, so no fixed response-time or fix-timeline SLA is guaranteed.
- Please allow time for a fix to be prepared and merged before sharing details publicly.
