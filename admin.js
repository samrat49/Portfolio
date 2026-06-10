const STORAGE_KEY = "samrat-portfolio-projects";
const DATA_SOURCE = "data/projects.json";

const form = document.querySelector("#project-form");
const formTitle = document.querySelector("#form-title");
const projectList = document.querySelector("#project-list");
const projectPreview = document.querySelector("#project-preview");
const projectCount = document.querySelector("#project-count");
const saveStatus = document.querySelector("#save-status");
const jsonOutput = document.querySelector("#json-output");
const resetFormButton = document.querySelector("#reset-form");
const exportButton = document.querySelector("#export-json");
const copyButton = document.querySelector("#copy-json");
const importButton = document.querySelector("#import-json");
const loadDefaultsButton = document.querySelector("#load-defaults");
const restoreProjectsButton = document.querySelector("#restore-projects");
const pushGithubButton = document.querySelector("#push-github");
const imageInput = document.querySelector("#project-image-file");

const fields = {
  id: document.querySelector("#project-id"),
  title: document.querySelector("#project-title"),
  category: document.querySelector("#project-category"),
  type: document.querySelector("#project-type"),
  description: document.querySelector("#project-description"),
  link: document.querySelector("#project-link"),
  actionLabel: document.querySelector("#project-action"),
  tags: document.querySelector("#project-tags"),
  thumbnail: document.querySelector("#project-thumbnail"),
  thumbnailAlt: document.querySelector("#project-thumbnail-alt"),
  thumbnailFit: document.querySelector("#project-thumbnail-fit"),
  thumbnailBackground: document.querySelector("#project-thumbnail-background"),
};

const githubFields = {
  owner: document.querySelector("#github-owner"),
  repo: document.querySelector("#github-repo"),
  branch: document.querySelector("#github-branch"),
  message: document.querySelector("#github-message"),
  token: document.querySelector("#github-token"),
};

const defaultProjects = [
  {
    id: "car-rental-app",
    title: "Car Rental App Design",
    category: "uiux",
    type: "UI/UX / Mobile App",
    description: "A Figma concept for browsing rental cars, comparing details, and moving users toward a simple booking flow.",
    thumbnail: "assets/car-rental-thumbnail.png",
    thumbnailAlt: "Car Rental UI/UX project cover thumbnail",
    thumbnailFit: "cover",
    thumbnailBackground: "",
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
    thumbnailBackground: "",
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
    thumbnailBackground: "",
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
    thumbnailBackground: "",
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
    thumbnailBackground: "",
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
    thumbnailBackground: "",
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
    thumbnailBackground: "",
    link: "",
    actionLabel: "",
    tags: ["Product Ads", "Branding", "Marketing"],
  },
];

let projects = [];
let editingId = "";

const setStatus = (message) => {
  saveStatus.textContent = message;
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || `project-${Date.now()}`;

const getProjectJson = () => JSON.stringify(projects, null, 2);

const cloneProjects = (projectItems) => JSON.parse(JSON.stringify(projectItems));

const encodeBase64 = (value) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
};

const persistProjects = (
  message = "Saved in this browser. Export JSON or push to GitHub to update the live site."
) => {
  try {
    localStorage.setItem(STORAGE_KEY, getProjectJson());
    updateJsonOutput();
    setStatus(message);
    return true;
  } catch (error) {
    updateJsonOutput();
    setStatus(
      `Could not save in browser storage: ${error.message}. Copy/export JSON or use smaller images.`
    );
    return false;
  }
};

const restoreDefaultProjects = (message = "Restored old portfolio projects in the admin hub.") => {
  projects = cloneProjects(defaultProjects);
  persistProjects(message);
  refreshUi();
  resetForm();
};

const splitTags = (value) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

const getFormProject = () => {
  const title = fields.title.value.trim();
  const id = fields.id.value || slugify(title);

  return {
    id,
    title,
    category: fields.category.value,
    type: fields.type.value.trim(),
    description: fields.description.value.trim(),
    thumbnail: fields.thumbnail.value.trim(),
    thumbnailAlt: fields.thumbnailAlt.value.trim(),
    thumbnailFit: fields.thumbnailFit.value,
    thumbnailBackground: fields.thumbnailBackground.value.trim(),
    link: fields.link.value.trim(),
    actionLabel: fields.actionLabel.value.trim(),
    tags: splitTags(fields.tags.value),
  };
};

const fillForm = (project) => {
  editingId = project.id;
  formTitle.textContent = "Edit project";
  fields.id.value = project.id || "";
  fields.title.value = project.title || "";
  fields.category.value = project.category || "graphics";
  fields.type.value = project.type || "";
  fields.description.value = project.description || "";
  fields.link.value = project.link || "";
  fields.actionLabel.value = project.actionLabel || "";
  fields.tags.value = Array.isArray(project.tags) ? project.tags.join(", ") : "";
  fields.thumbnail.value = project.thumbnail || "";
  fields.thumbnailAlt.value = project.thumbnailAlt || "";
  fields.thumbnailFit.value = project.thumbnailFit || "cover";
  fields.thumbnailBackground.value = project.thumbnailBackground || "";
  renderPreview();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const resetForm = () => {
  editingId = "";
  formTitle.textContent = "Add new project";
  form.reset();
  fields.category.value = "uiux";
  fields.thumbnailFit.value = "cover";
  renderPreview();
};

const renderTagList = (tags) => {
  const wrapper = document.createElement("div");
  wrapper.className = "preview-tags";

  tags.forEach((tag) => {
    const item = document.createElement("span");
    item.textContent = tag;
    wrapper.append(item);
  });

  return wrapper;
};

const createPreviewCard = (project, index = 0) => {
  const card = document.createElement("article");
  card.className = "preview-card";

  if (project.thumbnail) {
    const media = document.createElement("figure");
    media.className = `preview-media${project.thumbnailFit === "contain" ? " contain" : ""}`;

    if (project.thumbnailBackground) {
      media.style.background = project.thumbnailBackground;
    }

    const image = document.createElement("img");
    image.src = project.thumbnail;
    image.alt = project.thumbnailAlt || `${project.title || "Project"} thumbnail`;
    media.append(image);
    card.append(media);
  }

  const number = document.createElement("div");
  number.className = "preview-number";
  number.textContent = String(index + 1).padStart(2, "0");

  const type = document.createElement("p");
  type.className = "preview-type";
  type.textContent = project.type || "Project type";

  const title = document.createElement("h3");
  title.textContent = project.title || "Project title";

  const description = document.createElement("p");
  description.textContent = project.description || "Project description will appear here.";

  card.append(number, type, title, description);

  if (project.tags?.length) {
    card.append(renderTagList(project.tags));
  }

  return card;
};

const renderPreview = () => {
  const draft = getFormProject();
  projectPreview.replaceChildren(createPreviewCard(draft));
};

const renderProjectList = () => {
  projectList.replaceChildren();
  projectCount.textContent = `${projects.length} project${projects.length === 1 ? "" : "s"}`;

  if (projects.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No projects yet. Add your first card from the form above.";
    projectList.append(empty);
    return;
  }

  projects.forEach((project, index) => {
    const item = document.createElement("article");
    item.className = "project-item";

    const image = document.createElement("img");
    image.src = project.thumbnail || "assets/favicon.svg";
    image.alt = project.thumbnailAlt || `${project.title} thumbnail`;

    const copy = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = project.title;
    const meta = document.createElement("p");
    meta.textContent = `${project.type || "Project"} - ${project.category}`;
    copy.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "project-actions";

    const moveUp = document.createElement("button");
    moveUp.className = "ghost-button small";
    moveUp.type = "button";
    moveUp.textContent = "Up";
    moveUp.disabled = index === 0;
    moveUp.addEventListener("click", () => moveProject(index, -1));

    const moveDown = document.createElement("button");
    moveDown.className = "ghost-button small";
    moveDown.type = "button";
    moveDown.textContent = "Down";
    moveDown.disabled = index === projects.length - 1;
    moveDown.addEventListener("click", () => moveProject(index, 1));

    const edit = document.createElement("button");
    edit.className = "ghost-button small";
    edit.type = "button";
    edit.textContent = "Edit";
    edit.addEventListener("click", () => fillForm(project));

    const remove = document.createElement("button");
    remove.className = "danger-button small";
    remove.type = "button";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => deleteProject(project.id));

    actions.append(moveUp, moveDown, edit, remove);
    item.append(image, copy, actions);
    projectList.append(item);
  });
};

const updateJsonOutput = () => {
  jsonOutput.value = getProjectJson();
};

const refreshUi = () => {
  renderProjectList();
  updateJsonOutput();
};

const validateProject = (project) => {
  if (!project.title) return "Project title is required.";
  if (!project.type) return "Type / topic is required.";
  if (!project.description) return "Description is required.";
  return "";
};

const saveProject = (event) => {
  event.preventDefault();

  const project = getFormProject();
  const validationError = validateProject(project);

  if (validationError) {
    setStatus(validationError);
    return;
  }

  const existingIndex = projects.findIndex((item) => item.id === editingId);
  const previousProjects = cloneProjects(projects);

  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    const uniqueId = projects.some((item) => item.id === project.id)
      ? `${project.id}-${Date.now()}`
      : project.id;
    projects.push({ ...project, id: uniqueId });
  }

  const didSave = persistProjects();

  if (!didSave) {
    projects = previousProjects;
    refreshUi();
    return;
  }

  refreshUi();
  resetForm();
};

const deleteProject = (id) => {
  const project = projects.find((item) => item.id === id);
  if (!project || !window.confirm(`Delete "${project.title}"?`)) return;

  const previousProjects = cloneProjects(projects);
  projects = projects.filter((item) => item.id !== id);

  if (!persistProjects()) {
    projects = previousProjects;
    refreshUi();
    return;
  }

  refreshUi();

  if (editingId === id) {
    resetForm();
  }
};

const moveProject = (index, direction) => {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= projects.length) return;

  const previousProjects = cloneProjects(projects);
  [projects[index], projects[nextIndex]] = [projects[nextIndex], projects[index]];

  if (!persistProjects()) {
    projects = previousProjects;
    refreshUi();
    return;
  }

  refreshUi();
};

const exportJson = () => {
  const blob = new Blob([getProjectJson()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "projects.json";
  link.click();
  URL.revokeObjectURL(url);
  setStatus("Downloaded projects.json. Replace data/projects.json with it.");
};

const copyJson = async () => {
  try {
    await navigator.clipboard.writeText(getProjectJson());
    setStatus("Copied JSON to clipboard.");
  } catch {
    jsonOutput.select();
    document.execCommand("copy");
    setStatus("Copied JSON to clipboard.");
  }
};

const importJson = () => {
  try {
    const imported = JSON.parse(jsonOutput.value);
    if (!Array.isArray(imported)) {
      throw new Error("JSON must be an array of projects.");
    }

    projects = imported;
    persistProjects();
    refreshUi();
    resetForm();
    setStatus("Imported projects into this dashboard.");
  } catch (error) {
    setStatus(error.message);
  }
};

const requestGitHub = async (url, token, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    const message = data?.message || `GitHub request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
};

const pushProjectsToGitHub = async () => {
  const owner = githubFields.owner.value.trim();
  const repo = githubFields.repo.value.trim();
  const branch = githubFields.branch.value.trim() || "main";
  const message = githubFields.message.value.trim() || "Update portfolio projects";
  const token = githubFields.token.value.trim();
  const path = "data/projects.json";

  if (!owner || !repo || !token) {
    setStatus("Add GitHub owner, repo, and token before pushing.");
    return;
  }

  if (!window.confirm(`Push ${projects.length} project updates to ${owner}/${repo} on ${branch}?`)) {
    return;
  }

  pushGithubButton.disabled = true;
  pushGithubButton.textContent = "Pushing...";
  setStatus("Connecting to GitHub...");

  try {
    const apiBase = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
    const fileUrl = `${apiBase}/contents/${path}?ref=${encodeURIComponent(branch)}`;
    let sha = "";

    try {
      const existingFile = await requestGitHub(fileUrl, token);
      sha = existingFile.sha;
    } catch (error) {
      if (!error.message.includes("Not Found")) {
        throw error;
      }
    }

    await requestGitHub(`${apiBase}/contents/${path}`, token, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: encodeBase64(`${getProjectJson()}\n`),
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    setStatus("Pushed to GitHub. GitHub Pages should update in a few minutes.");
  } catch (error) {
    setStatus(`GitHub push failed: ${error.message}`);
  } finally {
    pushGithubButton.disabled = false;
    pushGithubButton.textContent = "Push to GitHub";
  }
};

const loadFromDataFile = async ({ force = false } = {}) => {
  if (!force) {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const savedProjects = JSON.parse(saved);
        if (Array.isArray(savedProjects) && savedProjects.length > 0) {
          projects = savedProjects;
          refreshUi();
          setStatus("Loaded projects saved in this browser.");
          return;
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  try {
    const response = await fetch(DATA_SOURCE);
    if (!response.ok) {
      throw new Error("Could not load data/projects.json.");
    }

    const fileProjects = await response.json();
    if (!Array.isArray(fileProjects) || fileProjects.length === 0) {
      throw new Error("data/projects.json has no projects.");
    }

    projects = fileProjects;
    persistProjects();
    refreshUi();
    setStatus("Loaded current data/projects.json.");
  } catch {
    restoreDefaultProjects("Restored old projects because data/projects.json could not load.");
  }
};

form.addEventListener("submit", saveProject);
resetFormButton.addEventListener("click", resetForm);
exportButton.addEventListener("click", exportJson);
copyButton.addEventListener("click", copyJson);
importButton.addEventListener("click", importJson);
restoreProjectsButton.addEventListener("click", () => {
  if (!window.confirm("Restore all old projects? This replaces the current admin draft.")) return;
  restoreDefaultProjects();
});
pushGithubButton.addEventListener("click", pushProjectsToGitHub);
loadDefaultsButton.addEventListener("click", async () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    await loadFromDataFile({ force: true });
    resetForm();
  } catch (error) {
    setStatus(error.message);
  }
});

Object.values(fields).forEach((field) => {
  field.addEventListener("input", renderPreview);
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    fields.thumbnail.value = reader.result;
    if (!fields.thumbnailAlt.value) {
      fields.thumbnailAlt.value = `${fields.title.value || "Project"} thumbnail`;
    }
    renderPreview();
    setStatus("Image embedded. Export JSON to keep it.");
  });
  reader.readAsDataURL(file);
});

loadFromDataFile()
  .catch((error) => {
    setStatus(error.message);
    projects = [];
    refreshUi();
  })
  .finally(resetForm);
