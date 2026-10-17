const modal = document.getElementById("project-modal");
const closeButton = document.getElementById("modal-close");

closeButton.addEventListener("click", () => {
  modal.close();
});

// Close when clicking outside the dialog.
modal.addEventListener("click", event => {
  if (event.target !== modal) return;

  const bounds = modal.getBoundingClientRect();

  const outside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (outside) modal.close();
});

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;

  return element;
}

function createExternalLink(label, url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (!["https:", "http:"].includes(parsed.protocol)) {
      return null;
    }

    const link = createElement("a", "", label);

    link.href = parsed.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    return link;
  } catch {
    return null;
  }
}

function createProjectLinks(project) {
  const links = createElement("div", "project-links");

  const destinations = [
    ["GitHub", project.github],
    ["Project Page", project.projectUrl],
    ["Live Demo", project.demo]
  ];

  destinations.forEach(([label, url]) => {
    if (!url || url.includes("/your-repo")) return;

    const link = createExternalLink(label, url);

    if (link) links.append(link);
  });

  return links;
}

function renderExperience(items) {
  const container = document.getElementById("experience-list");
  container.replaceChildren();

  if (!items.length) {
    container.append(
      createElement("p", "muted", "Experience details will be added here.")
    );
    return;
  }

  items.forEach(item => {
    const article = createElement("article", "entry");
    const heading = createElement("div", "entry-heading");

    heading.append(
      createElement("h3", "", item.company),
      createElement("span", "entry-date", item.period)
    );

    article.append(
      heading,
      createElement("p", "", item.role),
      createElement("p", "", item.description)
    );

    container.append(article);
  });
}

function renderProjects(items) {
  const container = document.getElementById("projects-list");
  container.replaceChildren();

  if (!items.length) {
    container.append(
      createElement("p", "muted", "Project details will be added here.")
    );
    return;
  }

  items.forEach(project => {
    const article = createElement("article", "entry");
    const heading = createElement("h3");
    const button = createElement(
      "button",
      "project-button",
      project.name
    );

    button.type = "button";
    button.setAttribute("aria-haspopup", "dialog");

    button.addEventListener("click", () => {
      openProjectModal(project);
    });

    heading.append(button);

    article.append(
      heading,
      createElement("p", "", project.description)
    );

    if (project.tech?.length) {
      article.append(
        createElement("p", "entry-meta", project.tech.join(" · "))
      );
    }

    article.append(createProjectLinks(project));
    container.append(article);
  });
}

function openProjectModal(project) {
  document.getElementById("modal-title").textContent = project.name;

  document.getElementById("modal-description").textContent =
    project.details || project.description;

  document.getElementById("modal-tech").textContent =
    (project.tech || []).join(" · ");

  const images = document.getElementById("modal-images");
  images.replaceChildren();

  (project.images || []).forEach((path, index) => {
    const image = document.createElement("img");

    image.alt = `${project.name} — image ${index + 1}`;

    // Hide unavailable images instead of showing broken-image icons.
    image.addEventListener("error", () => image.remove(), {
      once: true
    });

    image.src = path;
    images.append(image);
  });

  const actions = document.getElementById("modal-actions");
  actions.replaceChildren(createProjectLinks(project));
  modal.showModal();
  modal.scrollTop = 0;
}

async function loadPortfolio() {
  try {
    const response = await fetch("./about.json");

    if (!response.ok) {
      throw new Error(`Could not load about.json: ${response.status}`);
    }

    const data = await response.json();

    renderExperience(data.experience || []);
    renderProjects(data.projects || []);
  } catch (error) {
    console.error("Portfolio loading error:", error);

    ["experience-list", "projects-list"].forEach(id => {
      document.getElementById(id).replaceChildren(
        createElement(
          "p",
          "muted",
          "This section could not load. Please refresh the page."
        )
      );
    });
  }
}

loadPortfolio();