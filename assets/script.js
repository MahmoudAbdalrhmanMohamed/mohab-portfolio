const header = document.querySelector(".site-header");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.querySelectorAll("nav a");
menuBtn.addEventListener("click", () => header.classList.toggle("open"));
navLinks.forEach((link) =>
  link.addEventListener("click", () => header.classList.remove("open")),
);
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
const text = h1.getAttribute("data-text");
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
