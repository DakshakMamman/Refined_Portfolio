const CONTACT_EMAIL = "your-email@example.com";

const skills = [
  { name: "HTML", level: 90 },
  { name: "CSS", level: 85 },
  { name: "Tailwind CSS", level: 80 },
  { name: "JavaScript", level: 75 },
  { name: "Python", level: 35 }
];

const projects = [
  { title: "Task Tracker", text: "Add, complete and filter daily tasks. Data stays saved in the browser.", tags: ["HTML", "CSS", "JavaScript"] },
  { title: "Weather Dashboard", text: "Search a city and see a clear forecast with a responsive layout.", tags: ["Tailwind CSS", "JavaScript"] },
  { title: "Business Landing Page", text: "A fast, mobile-first marketing page built with utility classes.", tags: ["HTML", "Tailwind CSS"] },
  { title: "Expense Calculator", text: "A small Python script that totals expenses from a CSV file.", tags: ["Python"] },
  { title: "Personal Blog Layout", text: "A readable article template with dependency-free styles.", tags: ["HTML", "CSS"] }
];

const $ = (selector) => document.querySelector(selector);
let activeSkill = null;

$("#yr").textContent = new Date().getFullYear();

const skillList = $("#skills-list");
const skillChips = $("#chips");

skills.forEach((skill) => {
  skillList.insertAdjacentHTML(
    "beforeend",
    `<div class="skill"><span>${skill.name}</span><div class="bar"><i data-width="${skill.level}"></i></div><span>${skill.level}%</span></div>`
  );

  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "chip";
  chip.textContent = skill.name;
  chip.setAttribute("aria-pressed", "false");
  chip.addEventListener("click", () => {
    activeSkill = activeSkill === skill.name ? null : skill.name;
    renderProjects();
  });
  skillChips.appendChild(chip);
});

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll(".bar i").forEach((bar) => {
      bar.style.width = `${bar.dataset.width}%`;
    });
    skillObserver.disconnect();
  });
}, { threshold: 0.25 });

skillObserver.observe(skillList);

function renderProjects() {
  const grid = $("#grid");
  grid.replaceChildren();

  projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "card";
    if (activeSkill && !project.tags.includes(activeSkill)) card.classList.add("dim");
    card.innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.text}</p>
      <div class="tags">${project.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
    `;
    grid.appendChild(card);
  });

  skillChips.querySelectorAll(".chip").forEach((chip) => {
    chip.setAttribute("aria-pressed", String(chip.textContent === activeSkill));
  });
}

renderProjects();

const root = document.documentElement;

try {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) root.dataset.theme = savedTheme;
} catch (error) {
  // Storage can be unavailable in privacy-focused browser modes.
}

$("#theme").addEventListener("click", () => {
  const isDark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;

  root.dataset.theme = isDark ? "light" : "dark";
  try {
    localStorage.setItem("theme", root.dataset.theme);
  } catch (error) {
    // The selected theme still applies for the current page.
  }
});

$("#form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const message = $("#msg").value.trim();
  const status = $("#status");

  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message) {
    status.textContent = "Please enter your name, a valid email and a message.";
    return;
  }

  const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Portfolio message from ${name}`)}&body=${body}`;
  status.textContent = "Opening your email app…";
});
