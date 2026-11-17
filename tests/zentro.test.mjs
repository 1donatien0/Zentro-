import test from "node:test";
import assert from "node:assert/strict";
import { loadHtmlApp } from "./helpers/dom-harness.mjs";

test("index.html: enterWorld validates empty name, empty phone, and phone length", () => {
  const app = loadHtmlApp("index.html");
  const { document, window, localStorage, alerts, context } = app;

  document.getElementById("nameInput").value = "";
  document.getElementById("phoneInput").value = "9876543210";
  context.enterWorld();
  assert.equal(alerts.at(-1), "Please enter your full name");
  assert.equal(window.location.href, "index.html");

  document.getElementById("nameInput").value = "Demo Shopper";
  document.getElementById("phoneInput").value = "";
  context.enterWorld();
  assert.equal(alerts.at(-1), "Please enter your mobile number 📱");
  assert.equal(window.location.href, "index.html");

  document.getElementById("phoneInput").value = "12345";
  context.enterWorld();
  assert.equal(alerts.at(-1), "Please enter a valid 10-digit mobile number");
  assert.equal(localStorage.getItem("userName"), null);
  assert.equal(window.location.href, "index.html");
});

test("index.html: enterWorld stores user details and redirects to home.html on valid input", () => {
  const app = loadHtmlApp("index.html");
  const { document, window, localStorage, alerts, context } = app;

  document.getElementById("nameInput").value = "  Demo Shopper  ";
  document.getElementById("phoneInput").value = "9876543210";
  context.enterWorld();

  assert.equal(alerts.length, 0);
  assert.equal(localStorage.getItem("userName"), "Demo Shopper");
  assert.equal(localStorage.getItem("userPhone"), "9876543210");
  assert.equal(window.location.href, "home.html");
});

test("home.html + script.js: renders greeting, toggles cart sidebar, and parses 16 product cards", () => {
  const app = loadHtmlApp("home.html", { userName: "Demo Shopper" });
  const { document, context, productCards } = app;

  assert.equal(productCards.length, 16);
  assert.equal(document.getElementById("welcome-user").innerText, "Welcome, Demo Shopper 👋");
  assert.equal(document.getElementById("cart-count").innerText, 0);
  assert.equal(document.getElementById("cart-total").innerText, "Total: ₹0");

  context.openCart();
  assert.equal(document.getElementById("cart-sidebar").classList.contains("active"), true);
  context.closeCart();
  assert.equal(document.getElementById("cart-sidebar").classList.contains("active"), false);
});

test("home.html: cart add, repeat add, quantity controls, persistence, and reset work", () => {
  const app = loadHtmlApp("home.html");
  const { document, localStorage, context } = app;

  context.addToCart("iPhone 16", 79999);
  assert.equal(document.getElementById("cart-count").innerText, 1);
  assert.equal(document.getElementById("cart-total").innerText, "Total: ₹79,999");
  assert.equal(document.getElementById("toast").classList.contains("show"), true);

  context.addToCart("iPhone 16", 79999);
  assert.equal(document.getElementById("cart-count").innerText, 2);
  assert.equal(document.getElementById("cart-total").innerText, "Total: ₹159,998");

  context.increaseQuantity("iPhone 16");
  assert.equal(document.getElementById("cart-count").innerText, 3);

  context.decreaseQuantity("iPhone 16");
  assert.equal(document.getElementById("cart-count").innerText, 2);

  const saved = JSON.parse(localStorage.getItem("cart"));
  assert.deepEqual(saved, [{ name: "iPhone 16", price: 79999, quantity: 2 }]);

  const reloaded = loadHtmlApp("home.html", { cart: JSON.stringify(saved) });
  assert.equal(reloaded.document.getElementById("cart-count").innerText, 2);
  assert.equal(reloaded.document.getElementById("cart-total").innerText, "Total: ₹159,998");

  reloaded.context.clearCart();
  assert.equal(reloaded.localStorage.getItem("cart"), null);
  assert.equal(reloaded.document.getElementById("cart-count").innerText, 0);
  assert.equal(reloaded.document.getElementById("cart-total").innerText, "Total: ₹0");
  assert.equal(reloaded.document.getElementById("cart-items").innerHTML, "<p>No items yet</p>");
});

test("home.html: searchProducts filters cards by title and quick-view modal adds selected item", () => {
  const app = loadHtmlApp("home.html");
  const { document, context, productCards } = app;

  document.getElementById("searchInput").value = "watch";
  context.searchProducts();

  const visibleNames = productCards
    .filter((card) => card.style.display === "block")
    .map((card) => card.querySelector("h3").innerText);
  assert.deepEqual(visibleNames, ["Smart Watch", "Apple Watch", "Luxury Watch"]);

  const firstCard = productCards[0];
  context.showProduct(firstCard);
  assert.equal(document.getElementById("popup-title").innerText, "iPhone 16");
  assert.equal(document.getElementById("popup-price").innerText, "₹79,999");
  assert.equal(document.getElementById("product-popup").style.display, "flex");

  document.getElementById("popup-cart-btn").onclick();
  assert.equal(document.getElementById("cart-count").innerText, 1);
  assert.equal(document.getElementById("product-popup").style.display, "none");
});

test("checkout.html and success.html: mock checkout moves cart to lastOrder and confirmation renders it", () => {
  const cartPayload = JSON.stringify([{ name: "Smart Watch", price: 4999, quantity: 2 }]);
  const checkout = loadHtmlApp("checkout.html", { cart: cartPayload });

  checkout.document.getElementById("name").value = "Demo Shopper";
  checkout.context.placeOrder();

  assert.equal(checkout.localStorage.getItem("customerName"), "Demo Shopper");
  assert.equal(checkout.localStorage.getItem("lastOrder"), cartPayload);
  assert.equal(checkout.localStorage.getItem("cart"), null);
  assert.equal(checkout.window.location.href, "success.html");

  const success = loadHtmlApp("success.html", {
    customerName: checkout.localStorage.getItem("customerName"),
    lastOrder: checkout.localStorage.getItem("lastOrder"),
  });

  assert.match(success.document.getElementById("order-id").innerText, /^Order ID: ZT\d+$/);
  assert.equal(
    success.document.getElementById("customer-message").innerText,
    "Thank you for shopping with us, Demo Shopper ❤️"
  );
  assert.match(success.document.getElementById("order-items").innerHTML, /Smart Watch\s*\(2\)/);
});
