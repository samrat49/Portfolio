const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll(".reveal");
const year = document.querySelector("#year");
const copyEmailButton = document.querySelector(".copy-email");
const filterChips = document.querySelectorAll(".filter-chip");
const projectCards = document.querySelectorAll(".project-card[data-category]");
const projectEmpty = document.querySelector(".project-empty");
const portfolioCube = document.querySelector("#portfolio-cube");

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

      if (projectEmpty) {
        const hasVisibleCards = [...projectCards].some((card) => !card.classList.contains("is-hidden"));
        projectEmpty.classList.toggle("visible", !hasVisibleCards);
      }
    });
  });
}

if (portfolioCube) {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let rotationX = -18;
  let rotationY = 32;
  let previousFrameTime = 0;
  const autoRotateSpeed = 0.026;

  const rotateCube = () => {
    portfolioCube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  };

  const animateCube = (timestamp) => {
    if (!previousFrameTime) {
      previousFrameTime = timestamp;
    }

    const deltaTime = timestamp - previousFrameTime;
    previousFrameTime = timestamp;

    if (!isDragging) {
      rotationY += deltaTime * autoRotateSpeed;
      rotateCube();
    }

    window.requestAnimationFrame(animateCube);
  };

  portfolioCube.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    portfolioCube.classList.add("is-dragging");
    rotateCube();
    portfolioCube.setPointerCapture(event.pointerId);
  });

  portfolioCube.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    event.preventDefault();

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    startX = event.clientX;
    startY = event.clientY;
    rotationY += deltaX * 0.45;
    rotationX -= deltaY * 0.35;
    rotationX = Math.max(-70, Math.min(70, rotationX));
    rotateCube();
  });

  const stopDragging = (event) => {
    if (!isDragging) return;

    isDragging = false;
    portfolioCube.classList.remove("is-dragging");
    if (portfolioCube.hasPointerCapture(event.pointerId)) {
      portfolioCube.releasePointerCapture(event.pointerId);
    }
  };

  portfolioCube.addEventListener("pointerup", stopDragging);
  portfolioCube.addEventListener("pointercancel", stopDragging);
  portfolioCube.addEventListener("dragstart", (event) => event.preventDefault());
  rotateCube();
  window.requestAnimationFrame(animateCube);
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
