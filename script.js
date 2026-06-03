const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll(".reveal");
const year = document.querySelector("#year");
const copyEmailButton = document.querySelector(".copy-email");
const filterChips = document.querySelectorAll(".filter-chip");
const projectCards = document.querySelectorAll(".project-card[data-category]");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

const sections = [...document.querySelectorAll("section[id]")];

if ("IntersectionObserver" in window && sections.length > 0) {
  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navItems.forEach((item) => {
          item.classList.toggle("active", item.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => activeObserver.observe(section));
}

if (filterChips.length > 0 && projectCards.length > 0) {
  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;

      filterChips.forEach((item) => {
        const isActive = item === chip;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      projectCards.forEach((card) => {
        const shouldShow = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });
}

if (copyEmailButton) {
  copyEmailButton.addEventListener("click", async () => {
    const email = copyEmailButton.dataset.email;
    const originalText = copyEmailButton.textContent;

    try {
      await navigator.clipboard.writeText(email);
      copyEmailButton.textContent = "Email Copied";
    } catch {
      copyEmailButton.textContent = email;
    }

    window.setTimeout(() => {
      copyEmailButton.textContent = originalText;
    }, 1800);
  });
}
