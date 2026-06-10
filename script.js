const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll(".reveal");
const year = document.querySelector("#year");
const copyEmailButton = document.querySelector(".copy-email");
const filterChips = document.querySelectorAll(".filter-chip");
const projectGrid = document.querySelector("#project-grid");
const projectEmpty = document.querySelector(".project-empty");
const portfolioCube = document.querySelector("#portfolio-cube");
const adminProjectStorageKey = "samrat-portfolio-projects";
const fallbackProjects = [
  {
    id: "car-rental-app",
    title: "Car Rental App Design",
    category: "uiux",
    type: "UI/UX / Mobile App",
    description: "A Figma concept for browsing rental cars, comparing details, and moving users toward a simple booking flow.",
    thumbnail: "assets/car-rental-thumbnail.png",
    thumbnailAlt: "Car Rental UI/UX project cover thumbnail",
    thumbnailFit: "cover",
    link: "https://www.figma.com/design/K8MIwqShiX9xBMJSq4qwvT/Car-Rental?m=auto&t=MuV4mYMA06wiKh8d-6",
    actionLabel: "Open Figma",
    tags: ["Figma", "Mobile UI", "Booking Flow"],
  },
  {
    id: "chakrascope-interface",
    title: "Chakrascope Interface Design",
    category: "uiux",
    type: "UI/UX / Wellness Concept",
    description: "A calm Figma interface concept focused on visual balance, guided exploration, and a smooth product experience.",
    thumbnail: "assets/chakrascope-thumbnail.png",
    thumbnailAlt: "Chakrascope UI/UX project logo thumbnail",
    thumbnailFit: "contain",
    thumbnailBackground: "#ffffff",
    link: "https://www.figma.com/design/c0X8FNPZZhFoZX2AHwJlKF/Chakrascope--Copy-?m=auto&t=MuV4mYMA06wiKh8d-1",
    actionLabel: "Open Figma",
    tags: ["Figma", "Dashboard UI", "Wellness"],
  },
  {
    id: "climate-campaign-visuals",
    title: "Youth Innovation and Climate Campaign Visuals",
    category: "graphics",
    type: "Graphics Design / Climate & Youth",
    description: "Social posts and information graphics for climate fellowship, YECAP, agri-learning, and youth-focused communication.",
    thumbnail: "assets/cube-face-1.png",
    thumbnailAlt: "Climate fellowship, YECAP, and agri-entrepreneurship design collage",
    thumbnailFit: "cover",
    link: "",
    actionLabel: "",
    tags: ["Climate", "YECAP", "Infographics"],
  },
  {
    id: "rotaract-community-creatives",
    title: "Rotaract and Community Event Creatives",
    category: "graphics",
    type: "Graphics Design / Community",
    description: "Posters and announcements for women's day, team introductions, congratulations, donations, and club activities.",
    thumbnail: "assets/cube-face-2.png",
    thumbnailAlt: "Rotaract, donation, congratulations, and community event design collage",
    thumbnailFit: "cover",
    link: "",
    actionLabel: "",
    tags: ["Rotaract", "Social Posts", "Events"],
  },
  {
    id: "festival-countdown-designs",
    title: "Festival, Jatra, and Countdown Designs",
    category: "graphics",
    type: "Graphics Design / Culture & Events",
    description: "Visual concepts for local culture, countdowns, photo exhibitions, and Nepali festival/event storytelling.",
    thumbnail: "assets/festival-countdown-cover.png",
    thumbnailAlt: "Festival, jatra, and countdown design collage",
    thumbnailFit: "cover",
    link: "",
    actionLabel: "",
    tags: ["Culture", "Countdowns", "Photo Edits"],
  },
  {
    id: "ai-civic-tech-explainers",
    title: "AI, Civic Tech, and Digital Skills Explainers",
    category: "graphics",
    type: "Graphics Design / Learning & AI",
    description: "Educational carousel-style graphics explaining AI tools, productivity workflows, Canva, Trello, Notion, and civic tech.",
    thumbnail: "assets/cube-face-4.png",
    thumbnailAlt: "AI tools, civic tech, Canva, Trello, Notion, and training design collage",
    thumbnailFit: "cover",
    link: "",
    actionLabel: "",
    tags: ["AI Tools", "Explainers", "Digital Skills"],
  },
  {
    id: "travel-visual-experiments",
    title: "Travel, Countdown, and Visual Experiments",
    category: "graphics",
    type: "Graphics Design / Photo Manipulation",
    description: "Atmospheric edits mixing landscape photography, festival countdowns, city moods, and experimental visual treatments.",
    thumbnail: "assets/cube-face-5.png",
    thumbnailAlt: "Travel, festival countdown, and photo manipulation collage",
    thumbnailFit: "cover",
    link: "",
    actionLabel: "",
    tags: ["Editing", "Festival", "Visual Mood"],
  },
  {
    id: "srijansil-product-promotion",
    title: "Srijansil Product Promotion Concepts",
    category: "graphics",
    type: "Graphics Design / Product Branding",
    description: "Product-focused ad layouts for toilet cleaner, liquid soap, and household cleaning products using bold commercial visuals.",
    thumbnail: "assets/cube-face-6.png",
    thumbnailAlt: "Srijansil cleaning product branding and advertisement design collage",
    thumbnailFit: "cover",
    link: "",
    actionLabel: "",
    tags: ["Product Ads", "Branding", "Marketing"],
  },
];
let projectCards = [];
let activeProjectFilter = "all";
let revealObserver = null;

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

const revealElement = (item) => {
  if (revealObserver) {
    revealObserver.observe(item);
  } else {
    item.classList.add("visible");
  }
};

if ("IntersectionObserver" in window) {
  revealObserver = new IntersectionObserver(
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

  revealItems.forEach((item) => revealElement(item));
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

const updateProjectEmptyState = () => {
  if (!projectEmpty) return;

  const hasVisibleCards = projectCards.some((card) => !card.classList.contains("is-hidden"));
  projectEmpty.classList.toggle("visible", !hasVisibleCards);
};

const applyProjectFilter = () => {
  projectCards.forEach((card) => {
    const shouldShow = activeProjectFilter === "all" || card.dataset.category === activeProjectFilter;
    card.classList.toggle("is-hidden", !shouldShow);
  });

  updateProjectEmptyState();
};

const buildProjectCard = (project, index) => {
  const hasLink = Boolean(project.link);
  const card = document.createElement(hasLink ? "a" : "article");
  card.className = `project-card reveal${hasLink ? " project-link-card" : ""}`;
  card.dataset.category = project.category || "graphics";

  if (hasLink) {
    card.href = project.link;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.setAttribute("aria-label", `Open ${project.title}`);
  }

  if (project.thumbnail) {
    const media = document.createElement("figure");
    media.className = "project-media";

    if (project.thumbnailFit === "contain") {
      media.classList.add("project-media-contain");
    }

    if (project.thumbnailBackground) {
      media.style.background = project.thumbnailBackground;
    }

    const image = document.createElement("img");
    image.src = project.thumbnail;
    image.alt = project.thumbnailAlt || `${project.title} thumbnail`;
    image.loading = "lazy";
    media.append(image);
    card.append(media);
  }

  const number = document.createElement("div");
  number.className = "project-number";
  number.textContent = String(index + 1).padStart(2, "0");

  const type = document.createElement("p");
  type.className = "project-type";
  type.textContent = project.type || project.category || "Project";

  const title = document.createElement("h3");
  title.textContent = project.title;

  const description = document.createElement("p");
  description.textContent = project.description || "";

  card.append(number, type, title, description);

  if (hasLink && project.actionLabel) {
    const action = document.createElement("span");
    action.className = "project-action";
    action.textContent = project.actionLabel;
    card.append(action);
  }

  if (Array.isArray(project.tags) && project.tags.length > 0) {
    const tagList = document.createElement("div");
    tagList.className = "tag-list";

    project.tags.forEach((tag) => {
      const tagItem = document.createElement("span");
      tagItem.textContent = tag;
      tagList.append(tagItem);
    });

    card.append(tagList);
  }

  return card;
};

const renderProjects = (projects) => {
  if (!projectGrid) return;

  projectGrid.replaceChildren();
  projectCards = projects.map((project, index) => {
    const card = buildProjectCard(project, index);
    projectGrid.append(card);
    revealElement(card);
    return card;
  });

  applyProjectFilter();
};

const showProjectLoadError = () => {
  if (!projectGrid) return;

  const card = document.createElement("article");
  card.className = "project-card reveal visible";

  const type = document.createElement("p");
  type.className = "project-type";
  type.textContent = "Admin Data";

  const title = document.createElement("h3");
  title.textContent = "Projects could not load";

  const description = document.createElement("p");
  description.textContent = "Check data/projects.json or use the admin dashboard to export a fresh project file.";

  card.append(type, title, description);
  projectGrid.replaceChildren(card);
  projectCards = [];
  updateProjectEmptyState();
};

const loadProjects = async () => {
  if (!projectGrid) return;

  try {
    const savedProjects = localStorage.getItem(adminProjectStorageKey);
    if (savedProjects) {
      try {
        const projects = JSON.parse(savedProjects);
        if (Array.isArray(projects) && projects.length > 0) {
          renderProjects(projects);
          return;
        }

        localStorage.removeItem(adminProjectStorageKey);
      } catch {
        localStorage.removeItem(adminProjectStorageKey);
      }
    }

    const source = projectGrid.dataset.projectSource || "data/projects.json";
    const response = await fetch(source, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Could not load ${source}`);
    }

    const projects = await response.json();
    renderProjects(Array.isArray(projects) && projects.length > 0 ? projects : fallbackProjects);
  } catch {
    renderProjects(fallbackProjects);
  }
};

if (filterChips.length > 0) {
  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      activeProjectFilter = chip.dataset.filter;

      filterChips.forEach((item) => {
        const isActive = item === chip;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      applyProjectFilter();
    });
  });
}

loadProjects();

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
