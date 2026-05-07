const roles = [
  "Co-founder & CTO at Pathsutra",
  "IT Student & Developer",
  "Community Leader & Innovator",
  "Public Speaker & Debater"
];

const typewriterTarget = document.getElementById("typewriter");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("site-menu");
const navLinks = document.querySelectorAll(".nav-link");
const revealElements = document.querySelectorAll("[data-reveal]");
const sections = document.querySelectorAll("main section[id]");
const currentYear = document.getElementById("current-year");
const contactForm = document.getElementById("contact-form");
const formNote = document.getElementById("form-note");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let roleIndex = 0;
let characterIndex = 0;
let isDeleting = false;

function typeRoles() {
  if (!typewriterTarget || prefersReducedMotion) {
    if (typewriterTarget) {
      typewriterTarget.textContent = roles[0];
    }
    return;
  }

  const activeRole = roles[roleIndex];
  const visibleText = activeRole.slice(0, characterIndex);
  typewriterTarget.textContent = visibleText;

  let timeout = 85;

  if (!isDeleting) {
    characterIndex += 1;
    if (characterIndex > activeRole.length) {
      isDeleting = true;
      timeout = 1800;
    }
  } else {
    characterIndex -= 1;
    timeout = 45;
    if (characterIndex < 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      characterIndex = 0;
      timeout = 250;
    }
  }

  window.setTimeout(typeRoles, timeout);
}

function setCurrentYear() {
  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }
}

function toggleMenu(forceState) {
  if (!navToggle || !navMenu) {
    return;
  }

  const shouldOpen = typeof forceState === "boolean"
    ? forceState
    : !navMenu.classList.contains("is-open");

  navMenu.classList.toggle("is-open", shouldOpen);
  navToggle.classList.toggle("is-open", shouldOpen);
  navToggle.setAttribute("aria-expanded", String(shouldOpen));
  document.body.classList.toggle("menu-open", shouldOpen);
}

function setupMobileMenu() {
  if (!navToggle || !navMenu) {
    return;
  }

  navToggle.addEventListener("click", () => toggleMenu());

  navLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900) {
      toggleMenu(false);
    }
  });
}

function setupRevealObserver() {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

function setupActiveNavigation() {
  if (!("IntersectionObserver" in window)) {
    return;
  }

  const activateLink = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleSection) {
        activateLink(visibleSection.target.id);
      }
    },
    {
      threshold: 0.45,
      rootMargin: "-20% 0px -40% 0px"
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function setupContactForm() {
  if (!contactForm) {
    return;
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;

    if (formNote) {
      formNote.textContent = "Your email client should open with the message ready to send.";
    }
  });
}

setCurrentYear();
typeRoles();
setupMobileMenu();
setupRevealObserver();
setupActiveNavigation();
setupContactForm();
