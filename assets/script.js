const profileData = window.PROFILE_DATA || {};
const header = document.querySelector(".site-header");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.querySelectorAll("nav a");
const langToggle = document.getElementById("langToggle");
const year = document.getElementById("year");

let currentLang = document.documentElement.lang === "ar" ? "ar" : "en";
let typingTimer;

function getProfile(language = currentLang) {
  return profileData.locales?.[language] || profileData.locales?.en || {};
}

function getSharedProfile() {
  return {
    email: profileData.email,
    phone: profileData.phone,
    phoneDisplay: profileData.phoneDisplay,
    cvPath: profileData.cvPath,
  };
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value || "";
  });
}

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;

  return element;
}

function renderNavigation(labels = {}) {
  const navItems = {
    about: document.querySelector('nav a[href="#about"]'),
    experience: document.querySelector('nav a[href="#experience"]'),
    skills: document.querySelector('nav a[href="#skills"]'),
    credentials: document.querySelector('nav a[href="#credentials"]'),
    projects: document.querySelector('nav a[href="#projects"]'),
    contact: document.querySelector('nav a[href="#contact"]'),
  };

  Object.entries(navItems).forEach(([key, link]) => {
    if (link && labels[key]) link.textContent = labels[key];
  });
}

function renderSectionTitles(sections = {}) {
  Object.entries(sections).forEach(([id, copy]) => {
    const section = document.getElementById(id);
    if (!section) return;

    const eyebrow = section.querySelector(".section-title > p");
    const title = section.querySelector(".section-title > h2");

    if (eyebrow) eyebrow.textContent = copy.eyebrow;
    if (title) title.textContent = copy.title;
  });
}

function renderStats(container, stats = []) {
  container.replaceChildren(
    ...stats.map((item) => {
      const stat = createElement("div");
      const value = createElement("strong", null, item.value);
      const label = createElement("span", null, item.label);

      stat.append(value, label);
      return stat;
    }),
  );
}

function renderSummary(container, summary = []) {
  container.replaceChildren(
    ...summary.map((copy) => createElement("p", null, copy)),
  );
}

function renderExperience(container, experience = []) {
  container.replaceChildren(
    ...experience.map((item) => {
      const article = createElement("article");
      const marker = createElement("span");
      const title = createElement("h3", null, item.title);
      const details = createElement("p", null, item.points.join(" "));

      article.append(marker, title, details);
      return article;
    }),
  );
}

function renderCards(container, cards = []) {
  container.replaceChildren(
    ...cards.map((item) => {
      const article = createElement("article", "card");
      const title = createElement("h3", null, item.title);
      const list = createElement("ul");

      item.items.forEach((text) => {
        list.append(createElement("li", null, text));
      });

      article.append(title, list);
      return article;
    }),
  );
}

function renderProject(container, projects = [], actionLabel) {
  const project = projects[0];
  if (!project) return;

  const details = createElement("div");
  const stack = createElement("p", "eyebrow", project.stack.join(" / "));
  const title = createElement("h3", null, project.title);
  const description = createElement("p", null, project.description);
  const action = createElement("a", "btn ghost", actionLabel);

  action.href = "#contact";
  details.append(stack, title, description);
  container.replaceChildren(details, action);
}

function renderContact(copy = {}) {
  const section = document.getElementById("contact");
  if (!section) return;

  const eyebrow = section.querySelector(".contact-card .eyebrow");
  const title = section.querySelector(".contact-card h2");
  const text = section.querySelector(".contact-card h2 + p");

  if (eyebrow) eyebrow.textContent = copy.eyebrow;
  if (title) title.textContent = copy.title;
  if (text) text.textContent = copy.text;
}

function updateLanguageButton() {
  if (!langToggle) return;

  const nextLanguage = currentLang === "en" ? "ar" : "en";
  langToggle.textContent = nextLanguage.toUpperCase();
  langToggle.setAttribute(
    "aria-label",
    nextLanguage === "ar" ? "Switch to Arabic" : "Switch to English",
  );
}

function updateMenuLabel() {
  if (!menuBtn || !header) return;

  const isOpen = header.classList.contains("open");
  const openText = currentLang === "ar" ? "فتح القائمة" : "Open navigation";
  const closeText = currentLang === "ar" ? "إغلاق القائمة" : "Close navigation";
  menuBtn.setAttribute("aria-label", isOpen ? closeText : openText);
}

function setDocumentLanguage(language) {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
}

function renderProfile(language = currentLang) {
  const data = getProfile(language);
  const shared = getSharedProfile();

  if (!data.name) return;

  currentLang = language;
  setDocumentLanguage(language);
  document.title = `${data.name} | ${data.title}`;

  const heading = document.querySelector(".hero h1");
  if (heading) heading.dataset.text = data.name;

  setText(".hero-copy > .eyebrow", data.heroEyebrow);
  setText('[data-profile="title"]', data.title);
  setText('[data-profile="heroText"]', data.heroText);
  setText('[data-profile="location"]', data.location);
  setText(".floating-badge", data.floatingBadge);

  renderNavigation(data.nav);
  renderSectionTitles(data.sections);
  renderContact(data.contact);

  document.querySelectorAll('[data-profile-link="email"]').forEach((link) => {
    link.href = `mailto:${shared.email}`;
    if (!link.classList.contains("btn")) link.textContent = shared.email;
  });

  document.querySelectorAll('[data-profile-link="phone"]').forEach((link) => {
    link.href = `tel:${shared.phone}`;
    link.textContent = shared.phoneDisplay;
  });

  document.querySelectorAll('[data-profile-link="cv"]').forEach((link) => {
    link.href = shared.cvPath;
  });

  const contactButton = document.querySelector(".cta-row .primary");
  const cvButton = document.querySelector(".cta-row .ghost");
  const stats = document.querySelector('[data-profile-list="stats"]');
  const summary = document.querySelector('[data-profile-list="summary"]');
  const experience = document.querySelector('[data-profile-list="experience"]');
  const skills = document.querySelector('[data-profile-list="skills"]');
  const credentials = document.querySelector('[data-profile-list="credentials"]');
  const projects = document.querySelector('[data-profile-list="projects"]');

  if (contactButton) contactButton.textContent = data.buttons.contact;
  if (cvButton) cvButton.textContent = data.buttons.downloadCv;
  if (stats) renderStats(stats, data.stats);
  if (summary) renderSummary(summary, data.summary);
  if (experience) renderExperience(experience, data.experience);
  if (skills) renderCards(skills, data.skills);
  if (credentials) renderCards(credentials, data.credentials);
  if (projects) renderProject(projects, data.projects, data.buttons.discussProject);

  updateLanguageButton();
  updateMenuLabel();
  typeName(data.name);
}

function setMenuOpen(isOpen) {
  if (!header || !menuBtn) return;

  header.classList.toggle("open", isOpen);
  menuBtn.setAttribute("aria-expanded", String(isOpen));
  updateMenuLabel();
}

function typeName(value) {
  const h1 = document.querySelector(".hero h1");
  if (!h1) return;

  const text = value || h1.dataset.text || "";
  let index = 0;

  clearTimeout(typingTimer);
  h1.textContent = "";

  function typeWriter() {
    if (index >= text.length) return;

    h1.textContent += text.charAt(index);
    index += 1;
    typingTimer = setTimeout(typeWriter, 100);
  }

  typeWriter();
}

if (menuBtn && header) {
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-controls", "nav");

  menuBtn.addEventListener("click", () => {
    setMenuOpen(!header.classList.contains("open"));
  });
}

navLinks.forEach((link) =>
  link.addEventListener("click", () => {
    setMenuOpen(false);
  }),
);

if (langToggle) {
  langToggle.addEventListener("click", () => {
    renderProfile(currentLang === "en" ? "ar" : "en");
  });
}

if (year) year.textContent = new Date().getFullYear();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.14 },
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
}

renderProfile(currentLang);

if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

let deferredPrompt;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
});

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
});
