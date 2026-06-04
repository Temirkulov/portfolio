async function loadPortfolio() {
  try {
    const response = await fetch("./about.json");

    if (!response.ok) {
      throw new Error(`Failed to load about.json: ${response.status}`);
    }

    const data = await response.json();

    document.title = `${data.name} | Portfolio`;

    document.getElementById("name").textContent = data.name;
    document.getElementById("title").textContent = data.title;
    document.getElementById("location").textContent = data.location;
    document.getElementById("summary").textContent = data.summary;

    const profileImage = document.getElementById("profile-image");

    if (data.profileImage) {
      profileImage.src = data.profileImage;
    }

    renderLinks(data.links);
    renderSkills(data.skills);
    renderProjects(data.projects);
    renderExperience(data.experience);
    setupModalClose();
  } catch (error) {
    console.error("Portfolio loading error:", error);
  }
}

function renderLinks(linksData) {
  const links = document.getElementById("links");
  links.innerHTML = "";

  const icons = {
    github: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg",
    linkedin: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg",
    email: "https://cdn.jsdelivr.net/npm/lucide-static@0.468.0/icons/mail.svg"
  };

  Object.entries(linksData).forEach(([label, url]) => {
    const a = document.createElement("a");

    a.href = url;
    a.target = label === "email" ? "_self" : "_blank";
    a.className = "link-button";

    a.innerHTML = `
      <img src="${icons[label] || ""}" alt="" />
      <span>${label}</span>
    `;

    links.appendChild(a);
  });
}

function renderSkills(skillsData) {
  const skills = document.getElementById("skills");
  skills.innerHTML = "";

  skillsData.forEach(skill => {
    const span = document.createElement("span");
    span.className = "skill";
    span.textContent = skill;
    skills.appendChild(span);
  });
}

function renderProjects(projectsData) {
  const projects = document.getElementById("projects");
  projects.innerHTML = "";

  projectsData.forEach(project => {
    const card = document.createElement("article");

    card.className = "card project-card";
    card.tabIndex = 0;

    card.innerHTML = `
      <h4>${project.name}</h4>
      <p>${project.description}</p>
      <p class="tech">${project.tech.join(" · ")}</p>
    `;

    card.addEventListener("click", () => openProjectModal(project));

    card.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        openProjectModal(project);
      }
    });

    projects.appendChild(card);
  });
}

function renderExperience(experienceData) {
  const experience = document.getElementById("experience");
  experience.innerHTML = "";

  experienceData.forEach(item => {
    const card = document.createElement("article");

    card.className = "card experience-card";

    card.innerHTML = `
      <div class="experience-header">
        ${
          item.logo
            ? `<img class="company-logo" src="${item.logo}" alt="${item.company} logo" />`
            : ""
        }

        <div>
          <h4>${item.role} — ${item.company}</h4>
          <p class="tech">${item.period}</p>
        </div>
      </div>

      <p>${item.description}</p>
    `;

    experience.appendChild(card);
  });
}

function openProjectModal(project) {
  const modal = document.getElementById("project-modal");

  document.getElementById("modal-title").textContent = project.name;
  document.getElementById("modal-description").textContent =
    project.details || project.description;
  document.getElementById("modal-tech").textContent = project.tech.join(" · ");

  const imagesContainer = document.getElementById("modal-images");
  imagesContainer.innerHTML = "";

  if (project.images && project.images.length > 0) {
    project.images.forEach(imagePath => {
      const img = document.createElement("img");

      img.src = imagePath;
      img.alt = `${project.name} image`;

      imagesContainer.appendChild(img);
    });
  }

  const githubButton = document.getElementById("modal-github");
  const demoButton = document.getElementById("modal-demo");

  if (project.github) {
    githubButton.href = project.github;
    githubButton.style.display = "inline-flex";
  } else {
    githubButton.style.display = "none";
  }

  if (project.demo) {
    demoButton.href = project.demo;
    demoButton.style.display = "inline-flex";
  } else {
    demoButton.style.display = "none";
  }

  modal.classList.add("active");
}

function setupModalClose() {
  const modal = document.getElementById("project-modal");
  const closeButton = document.getElementById("modal-close");

  closeButton.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      modal.classList.remove("active");
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      modal.classList.remove("active");
    }
  });
}

loadPortfolio();