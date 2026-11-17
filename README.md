# Zentro

**Zentro** is a dark-themed, static e-commerce storefront prototype built with HTML5, CSS3, and Vanilla JavaScript.

> **Current Status:** Early Frontend Prototype. Zentro is currently a client-side UI and shopping-flow prototype powered by hardcoded HTML product cards and browser `localStorage`. It does **not** yet include a backend server, database persistence, Firebase integration, real user authentication, or real payment processing.

---

## Project Vision

Zentro aims to evolve into a modern, fast, and responsive full-stack e-commerce web application offering a sleek dark-mode shopping experience, secure user authentication, dynamic product discovery, persistent carts and order history, and sandboxed/production payment checkout.

---

## Existing Features

Based on the current implementation:

- **Entry / Simulated Login Screen (`index.html`)**
  - Glassmorphic entry form accepting Full Name and a 10-digit Mobile Number (client-side validation only, stored in `localStorage`).
  - Interactive animated **Zentro Bot** mascot reacting to input focus and typing, plus floating particles and mouse-follow glow effect.
- **Storefront & Product Catalog (`home.html`)**
  - Sticky navigation bar with live search input, user greeting (`Welcome, <name>`), cart counter badge, and cart reset control.
  - Hero banner and animated statistics section (`10K+`, `500+`, `24/7` counters triggered via `IntersectionObserver`).
  - 16 hardcoded product cards displaying product images, titles, INR (`₹`) pricing, and **Add To Cart** actions.
  - Live client-side product search filtering cards by title (`searchProducts()`).
  - Product quick-view modal (`#product-popup`) displaying title, image, price, and an **Add To Cart** action.
- **Client-Side Shopping Cart (`home.html`, `style.css`, `script.js`)**
  - Slide-out cart sidebar (`#cart-sidebar`) persisted in browser `localStorage`.
  - Add items, increment/decrement quantities (`+` / `-`), clear cart, and view dynamically computed item count and total price (`₹`).
  - Toast notification feedback when new items are added or the cart is reset.
- **Simulated Checkout & Confirmation (`checkout.html`, `success.html`)**
  - Checkout form with Full Name, Address, and Phone Number fields.
  - Transfers `cart` to `lastOrder` in `localStorage` and redirects to `success.html`, which displays a generated client-side Order ID (`ZT...`), customer greeting, and ordered item list.

---

## Technology Stack

- **Markup:** HTML5
- **Styling:** CSS3 (`style.css` + page-level `<style>` blocks, Google Fonts `Poppins`)
- **Scripting:** Vanilla JavaScript (ES6+, `script.js` + inline `<script>` blocks)
- **Client Storage:** Browser `localStorage`
- **External Media:** Unsplash product image URLs

---

## Screenshots

> *Placeholders — actual application screenshots will be added in an upcoming update.*

| Entry Screen (`index.html`) | Storefront (`home.html`) |
| :---: | :---: |
| *Screenshot placeholder* | *Screenshot placeholder* |

| Cart Sidebar & Quick View | Checkout & Confirmation |
| :---: | :---: |
| *Screenshot placeholder* | *Screenshot placeholder* |

---

## Project Structure

```text
Zentro/
├── .vscode/
│   └── settings.json      # VS Code Live Server configuration (port 5501)
├── .gitignore             # Git ignore rules for OS, editor, env, logs, and unused media
├── README.md              # Project documentation
├── index.html             # Entry / simulated login page with animated bot
├── home.html              # Main storefront, 16 product cards, search, cart sidebar, modal
├── checkout.html          # Simulated checkout form
├── success.html           # Client-side order confirmation page
├── style.css              # Shared styles for cart sidebar, modal, scroll reveal, footer, toast
├── script.js              # User greeting, cart sidebar toggle, and scroll reveal logic
├── background.jpg         # Background image used in index.html
└── hero-bg.jpg            # Hero section background image used in home.html
```

---

## Local Setup

Because Zentro is currently a static frontend project, no package installation or build step is required.

1. **Clone the repository** (once published):
   ```bash
   git clone <your-github-repo-url>
   cd Zentro
   ```
2. **Serve the project locally:**
   - **Option A — VS Code Live Server** (recommended; see below)
   - **Option B — Python built-in HTTP server:**
     ```bash
     python3 -m http.server 5501
     ```
     Then open `http://localhost:5501/index.html` in your browser.

---

## Running with VS Code Live Server

1. Open the `Zentro` folder in Visual Studio Code.
2. Install the **Live Server** extension (`ritwickdey.LiveServer`) if not already installed.
3. This repository includes [`.vscode/settings.json`](.vscode/settings.json) preconfigured to use port `5501`.
4. Open `index.html` and click **Go Live** in the VS Code status bar (or right-click `index.html` → **Open with Live Server**).

---

## Current Limitations

Zentro is strictly a frontend prototype at this stage:

- **No Real Authentication:** `index.html` stores the entered name and 10-digit number in `localStorage` without OTP verification, passwords, or session protection.
- **No Firebase or Backend:** There is no server, REST/GraphQL API, or Firebase integration.
- **No Database Persistence:** All cart and last-order state lives only in browser `localStorage` and is not shared across devices or scoped per user.
- **No Real Payment Processing:** `checkout.html` simulates order placement locally without payment gateways, form validation, or persistence of address/phone inputs.
- **Hardcoded Product Catalog:** All 16 products are static HTML blocks with no categories, filters, sorting, or dedicated product detail pages.
- **Inert UI Placeholders:** Wishlist (`❤️`) and profile (`👤`) navbar icons are currently non-interactive.
- **Responsive & Accessibility Gaps:** Several fixed-width containers overflow on narrow mobile screens, and product images/forms lack full accessibility attributes (`alt` text, `<label>` associations).

---

## Planned Roadmap

- **Phase 1: Foundation & Cleanup**
  - Initialize Git repository, `.gitignore`, and documentation *(current phase)*.
  - Remove dead/duplicated code, fix `innerHTML` XSS risks, fix cart edge cases, and improve mobile responsiveness and accessibility.
- **Phase 2: Core Storefront Enhancements**
  - Migrate hardcoded HTML products into a structured data source.
  - Add categories, filtering, sorting, dedicated product detail views, and proper checkout validation with order totals.
- **Phase 3: Backend & Database Integration**
  - Introduce a backend / BaaS (such as Firebase Firestore or Node.js/Express + database) for products, carts, and persistent order history.
- **Phase 4: Authentication & User Accounts**
  - Implement real authentication (e.g., Phone OTP / Email & Password), protected routes, user profiles, and order history.
- **Phase 5: Payments & Production Readiness**
  - Integrate sandbox/test payment processing, optimize assets, add automated tests, and prepare deployment configuration.

---

## Contributing

Contributions, suggestions, and bug reports are welcome once the repository is published.

1. Fork the repository and create a feature branch from `main`.
2. Keep changes focused and test pages locally in a browser before opening a pull request.
3. Note: A software license has **not yet been selected** for this project. All rights remain reserved by the author until a `LICENSE` file is added.
