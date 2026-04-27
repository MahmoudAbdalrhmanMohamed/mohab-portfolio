const header = document.querySelector(".site-header");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.querySelectorAll("nav a");
const langToggle = document.getElementById("langToggle");
let currentLang = "en";
menuBtn.addEventListener("click", () => header.classList.toggle("open"));
navLinks.forEach((link) =>
  link.addEventListener("click", () => header.classList.remove("open")),
);
langToggle.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "ar" : "en";
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  langToggle.textContent = currentLang === "en" ? "EN" : "AR";
  // Change h1 text
  text = currentLang === "en" ? "Mohab Mahmoud" : "محب محمود";
  h1.setAttribute("data-text", text);
  h1.textContent = "";
  i = 0;
  typeWriter();
});
document.getElementById("year").textContent = new Date().getFullYear();
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.14 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Typing effect for h1
const h1 = document.querySelector("h1");
let text = h1.getAttribute("data-text");
h1.textContent = "";
let i = 0;
function typeWriter() {
  if (i < text.length) {
    h1.textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, 100);
  }
}
typeWriter();

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
// Handle PWA install prompt
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Optionally show a custom install button
});

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
});
