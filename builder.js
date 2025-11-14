// ----------------------
// Portfolio Builder Logic (Offline ZIP + /assets folder)
// ----------------------

document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("previewFrame");
  // const exportBtn = document.getElementById("exportBtn");
  // const downloadZipBtn = document.getElementById("downloadZipBtn");
  const templateSelect = document.getElementById("templateSelect");

  // Inputs
  const nameInput = document.getElementById("nameInput");
  const taglineInput = document.getElementById("taglineInput");
  const profileImageInput = document.getElementById("profileImageInput");
  const profileImageUpload = document.getElementById("profileImageUpload");
  const aboutInput = document.getElementById("aboutInput");
  const aboutImageUpload = document.getElementById("aboutImageUpload");
  const phoneInput = document.getElementById("phoneInput");
  const emailInput = document.getElementById("emailInput");
  const linkedinInput = document.getElementById("linkedinInput");
  const githubInput = document.getElementById("githubInput");

  const skillsContainer = document.getElementById("skillsContainer");
  const addSkillBtn = document.getElementById("addSkillBtn");
  const projectsContainer = document.getElementById("projectsContainer");
  const educationsContainer = document.getElementById("educationsContainer");
  const addProjectBtn = document.getElementById("addProjectBtn");
  const addEducationBtn = document.getElementById("addEducationBtn");

  let portfolioData = {
    name: "",
    tagline: "",
    about: "",
    profileImage: "",
    aboutImage: "",
    skills: [],
    projects: [],
    educations: [],
    phone: "",
    email: "",
    linkedin: "",
    github: "",
    template: "modern",
  };

  // --------------------------
  // Load saved data
  // --------------------------
  const saved = localStorage.getItem("portfolioData");
  if (saved) {
    try {
      portfolioData = JSON.parse(saved);
      restoreForm();
      sendToPreview();
    } catch {
      console.warn("Invalid saved portfolio data");
    }
  }

  // --------------------------
  // Event Listeners
  // --------------------------
  [
    nameInput,
    taglineInput,
    aboutInput,
    phoneInput,
    emailInput,
    linkedinInput,
    githubInput,
    templateSelect,
    profileImageInput,
  ].forEach((input) => input.addEventListener("input", updateData));

  profileImageUpload.addEventListener("change", handleProfileImageUpload);
  aboutImageUpload.addEventListener("change", handleAboutImageUpload);
  addSkillBtn.addEventListener("click", () => addSkill());
  addProjectBtn.addEventListener("click", () => addProject());
  addEducationBtn.addEventListener("click", () => addEducation());
  document.querySelectorAll(".exportBtn").forEach(btn =>
    btn.addEventListener("click", handleExport)
  );

  document.querySelectorAll(".downloadZipBtn").forEach(btn =>
    btn.addEventListener("click", handleDownloadZip)
  );


  // --------------------------
  // Core Functions
  // --------------------------
  function updateData() {
    portfolioData.name = nameInput.value.trim();
    portfolioData.tagline = taglineInput.value.trim();
    portfolioData.about = aboutInput.value.trim();
    portfolioData.profileImage = profileImageInput.value.trim();
    portfolioData.phone = phoneInput.value.trim();
    portfolioData.email = emailInput.value.trim();
    portfolioData.linkedin = linkedinInput.value.trim();
    portfolioData.github = githubInput.value.trim();
    portfolioData.template = templateSelect.value;
    saveToLocalStorage();
    sendToPreview();
  }

  function handleProfileImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      portfolioData.profileImage = ev.target.result; // Base64 image
      profileImageInput.value = ""; // Clear URL field
      saveToLocalStorage();
      sendToPreview();
    };
    reader.readAsDataURL(file);
  }

  function handleAboutImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      portfolioData.aboutImage = ev.target.result; // Base64 image
      saveToLocalStorage();
      sendToPreview();
    };
    reader.readAsDataURL(file);
  }

  function addSkill(value = "") {
    const div = document.createElement("div");
    div.className = "flex items-center space-x-2";
    div.innerHTML = `
      <input type="text" value="${value}" placeholder="Skill" 
        class="flex-1 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 skill-input">
      <button class="remove-skill text-red-500 hover:text-red-700">✕</button>`;
    skillsContainer.appendChild(div);

    div.querySelector("input").addEventListener("input", collectSkills);
    div.querySelector(".remove-skill").addEventListener("click", () => {
      div.remove();
      collectSkills();
    });
  }

  function collectSkills() {
    portfolioData.skills = Array.from(
      skillsContainer.querySelectorAll(".skill-input")
    )
      .map((i) => i.value.trim())
      .filter(Boolean);
    saveToLocalStorage();
    sendToPreview();
  }

  function addProject(p = {}) {
    const box = document.createElement("div");
    box.className = "border border-gray-200 rounded-md p-3 space-y-2";
    box.innerHTML = `
      <input type="text" placeholder="Project Title" value="${p.title || ""}" 
        class="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 project-title">
      <textarea placeholder="Description" 
        class="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 project-description">${p.description || ""}</textarea>
      <input type="url" placeholder="Project Link (optional)" value="${p.link || ""}" 
        class="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 project-link">
      <input type="url" placeholder="Image URL (optional)" value="${p.image || ""}" 
        class="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 project-image">
      <button class="remove-project text-red-500 hover:text-red-700 text-sm mt-1">Remove</button>`;
    projectsContainer.appendChild(box);

    box.querySelectorAll("input, textarea").forEach((el) =>
      el.addEventListener("input", collectProjects)
    );
    box.querySelector(".remove-project").addEventListener("click", () => {
      box.remove();
      collectProjects();
    });
  }

  function collectProjects() {
    portfolioData.projects = Array.from(projectsContainer.children).map((box) => ({
      title: box.querySelector(".project-title").value.trim(),
      description: box.querySelector(".project-description").value.trim(),
      link: box.querySelector(".project-link").value.trim(),
      image: box.querySelector(".project-image").value.trim(),
    }));
    saveToLocalStorage();
    sendToPreview();
  }

  function addEducation(e = {}) {
    const box = document.createElement("div");
    box.className = "border border-gray-200 rounded-md p-3 space-y-2";
    box.innerHTML = `
      <input type="text" placeholder="Education Title" value="${e.title || ""}" 
        class="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 education-title">
      <textarea placeholder="Description" 
        class="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 education-description">${e.description || ""}</textarea>
      <button class="remove-education text-red-500 hover:text-red-700 text-sm mt-1">Remove</button>`;
    educationsContainer.appendChild(box);

    box.querySelectorAll("input, textarea").forEach((el) =>
      el.addEventListener("input", collectEducations)
    );
    box.querySelector(".remove-education").addEventListener("click", () => {
      box.remove();
      collectEducations();
    });
  }

  function collectEducations() {
    portfolioData.educations = Array.from(educationsContainer.children).map((box) => ({
      title: box.querySelector(".education-title").value.trim(),
      description: box.querySelector(".education-description").value.trim(),
    }));
    saveToLocalStorage();
    sendToPreview();
  }

  function sendToPreview() {
    iframe.contentWindow.postMessage(portfolioData, "*");
  }

  function saveToLocalStorage() {
    localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
  }

  function restoreForm() {
    nameInput.value = portfolioData.name;
    taglineInput.value = portfolioData.tagline;
    aboutInput.value = portfolioData.about;
    profileImageInput.value =
      portfolioData.profileImage.startsWith("data:") ? "" : portfolioData.profileImage;
    phoneInput.value = portfolioData.phone;
    emailInput.value = portfolioData.email;
    linkedinInput.value = portfolioData.linkedin;
    githubInput.value = portfolioData.github;
    templateSelect.value = portfolioData.template || "modern";

    skillsContainer.innerHTML = "";
    (portfolioData.skills || []).forEach((s) => addSkill(s));

    projectsContainer.innerHTML = "";
    (portfolioData.projects || []).forEach((p) => addProject(p));

    educationsContainer.innerHTML = "";
    (portfolioData.educations || []).forEach((e) => addEducation(e));
  }

  // --------------------------
  // EXPORT (HTML only)
  // --------------------------
  async function handleExport() {
    const html = generatePortfolioHTML(portfolioData);
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${portfolioData.name || "portfolio"}.html`;
    a.click();
  }

  // --------------------------
  // DOWNLOAD ZIP (Offline-ready, /assets/)
  // --------------------------
  async function handleDownloadZip() {
    const zip = new JSZip();
    const assets = zip.folder("assets");
    const localData = JSON.parse(JSON.stringify(portfolioData));
    const tasks = [];

    // Profile image
    if (localData.profileImage) {
      if (localData.profileImage.startsWith("data:image")) {
        const [meta, base64] = localData.profileImage.split(",");
        const ext = meta.match(/data:image\/(.*?);/)[1] || "png";
        assets.file(`profile.${ext}`, base64, { base64: true });
        localData.profileImage = `assets/profile.${ext}`;
      } else {
        tasks.push(
          fetch(localData.profileImage)
            .then((r) => r.blob())
            .then((b) => {
              const ext = b.type.split("/")[1] || "jpg";
              assets.file(`profile.${ext}`, b);
              localData.profileImage = `assets/profile.${ext}`;
            })
            .catch(() => {
              console.warn("Profile image fetch failed");
              localData.profileImage = "";
            })
        );
      }
    }

    //about image
    if (localData.aboutImage) {
      if (localData.aboutImage.startsWith("data:image")) {
        const [meta, base64] = localData.aboutImage.split(",");
        const ext = meta.match(/data:image\/(.*?);/)[1] || "png";
        assets.file(`about.${ext}`, base64, { base64: true });
        localData.aboutImage = `assets/about.${ext}`;
      } else {
        tasks.push(
          fetch(localData.aboutImage)
            .then((r) => r.blob())
            .then((b) => {
              const ext = b.type.split("/")[1] || "jpg";
              assets.file(`about.${ext}`, b);
              localData.aboutImage = `assets/about.${ext}`;
            })
            .catch(() => {
              console.warn("About image fetch failed");
              localData.aboutImage = "";
            })
        );
      }
    }

    // Project images
    localData.projects.forEach((p, i) => {
      if (!p.image) return;
      if (p.image.startsWith("data:image")) {
        const [meta, base64] = p.image.split(",");
        const ext = meta.match(/data:image\/(.*?);/)[1] || "png";
        assets.file(`project-${i + 1}.${ext}`, base64, { base64: true });
        localData.projects[i].image = `assets/project-${i + 1}.${ext}`;
      } else {
        tasks.push(
          fetch(p.image)
            .then((r) => r.blob())
            .then((b) => {
              const ext = b.type.split("/")[1] || "jpg";
              assets.file(`project-${i + 1}.${ext}`, b);
              localData.projects[i].image = `assets/project-${i + 1}.${ext}`;
            })
            .catch(() => {
              console.warn(`Project ${i + 1} image fetch failed`);
              localData.projects[i].image = "";
            })
        );
      }
    });

    await Promise.all(tasks);

    // HTML referencing assets/
    const html = generatePortfolioHTML(localData);
    zip.file(`${localData.name || "portfolio"}.html`, html);

    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${localData.name || "portfolio"}.zip`;
    a.click();
  }

  // --------------------------
  // HTML Generator
  // --------------------------
  function generatePortfolioHTML(data) {
    const body = renderTemplate(data);
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Craftolio Preview</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Momo+Trust+Display&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
    </style>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  </head>
  ${body}
</html>`;
  }

  // --------------------------
  // Templates
  // --------------------------
  function renderTemplate(data) {
    switch (data.template) {
      case "classic":
        return renderClassicTemplate(data);
      case "minimal":
        return renderMinimalTemplate(data);
      default:
        return renderModernTemplate(data);
    }
  }

  function renderModernTemplate(data) {
    const skills = (data.skills || [])
      .map((s) => `<li class="px-4 py-1 bg-white/10 text-gray-200 rounded-full text-sm font-medium hover:bg-white/20 transition">${s}</li>`)
      .join(" ");
    const projects = (data.projects || [])
      .map(
        (p) => `
      <div class="flex-1 min-w-[300px] border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
        <img src="${p.image || "https://img.icons8.com/ios-filled/100/image.png"}" class="rounded-md mb-3">
        <h3 class="font-semibold text-lg mb-1">${p.title || "Untitled"}</h3>
        <p class="text-gray-300 text-sm mb-2">${p.description || ""}</p>
        <a href="${p.link}" target="_blank"
              class="text-pink-400 text-sm hover:underline"
              >View Project →</a>
      </div>`
      )
      .join("");
    const educations = (data.educations || [])
      .map(
        (e) => `
      <div class="w-full sm:w-[45%] md:w-[30%]">
        <h4 class="text-indigo-400 font-bold text-2xl">${e.title || "Untitled"}</h4>
        <p>${e.description || ""}</p>
      </div>`
      )
      .join("");

    return `
    <body
    class="text-white bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 font-[Poppins]"
  >
    <!-- Wrapper -->
    <div id="portfolio">
    <!-- Header Section -->
    <header class="h-screen flex items-center justify-center px-4">
        <div class="flex flex-col md:flex-row items-center gap-8 md:gap-40">
          <!-- Left Side: Image -->
      ${data.profileImage ? `<img src="${data.profileImage}" alt="Profile" class="w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 object-cover rounded-full">` : "images/person.jpg"}
      <!-- Right Side: Text -->
          <div
            class="flex flex-col items-center text-center md:items-start md:text-left"
          >
      <h1 class="text-4xl md:text-5xl font-bold">${data.name}</h1>
      <p class="text-lg md:text-xl text-gray-300">${data.tagline}</p>
      </div>
      </div>
    </header>

    <!-- About Section -->
    <section class="m-8 my-12 bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-700">
      <h2 class="text-2xl font-semibold text-center pb-2 mb-4 text-gray-100">About Me</h2>
      <div class="flex flex-col md:flex-row items-center relative p-6 md:p-10">
      
          <!-- Middle Line -->
          <div
            class="hidden md:block absolute left-1/2 top-0 h-full border-l border-gray-600"
          ></div>
          <!-- Left: Text -->
          <div
            class="w-full md:w-1/2 flex justify-center md:justify-end pr-0 md:pr-10 z-10"
          >
          <p class="text-gray-200 leading-relaxed text-center md:text-center max-w-md">${data.about}</p>
          </div>
          <!-- Right: Image -->
          <div
            class="w-full md:w-1/2 flex justify-center md:justify-center mt-8 md:mt-0 z-10"
          >
        ${data.aboutImage ? `<img src="${data.aboutImage}" alt="About Image" class="w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover">` : "images/person.jpg"}
      </div>
      </div>
    </section>

    <!-- Skills Section -->
      <section class="m-8 p-6">
        <h2 class="text-center text-2xl font-semibold pb-2 mb-4">Skills</h2>
      <ul class="flex flex-wrap gap-2">${skills}</ul>
    </section>
    <!-- Projects Section -->
      <section class="m-8 p-6">
        <h2 class="text-2xl font-semibold text-center pb-2 mb-6">Projects</h2>
      <div class="flex flex-wrap gap-6 justify-center">${projects}</div>
    </section>
    <!-- Education Section -->
    <section class="m-8 p-6 text-center">
      <h2 class="text-2xl font-semibold pb-2 mb-4">Education</h2>
      <div class="flex flex-col md:flex-row justify-center gap-6 max-w-6xl mx-auto">${educations}</div>
    </section>
    
    <!-- Contact -->
    <section class="m-8 p-6">
      <h2 class="text-2xl font-semibold border-b border-gray-200 pb-2 mb-4">Contact</h2>
      <div class="flex flex-wrap gap-4">
        ${data.phone ? `<a href="tel:+91${data.phone}" class="text-shadow-pink-400 hover:text-pink-400 transition">📞 Phone</a>` : ""}
        ${data.email ? `<a href="mailto:${data.email}" class="text-shadow-pink-400 hover:text-pink-400 transition">📧 Email</a>` : ""}
        ${data.linkedin ? `<a href="${data.linkedin}" class="text-shadow-pink-400 hover:text-pink-400 transition">💼 LinkedIn</a>` : ""}
        ${data.github ? `<a href="${data.github}" class="text-shadow-pink-400 hover:text-pink-400 transition">🐙 GitHub</a>` : ""}
      </div>
    </section>
  </div>
</body>
        `;
  }

  function renderClassicTemplate(data) {
    const skills = (data.skills || []).map((s) => `<li class="list-disc ml-6">${s}</li>`).join("");
    const projects = (data.projects || [])
      .map(
        (p) => `
      <div class="mb-4">
        <h3 class="font-semibold">${p.title}</h3>
        <p class="text-sm text-gray-600">${p.description}</p>
      </div>`
      )
      .join("");

    return `
    <header class="border-b pb-2 mb-6">
      ${data.profileImage ? `<img src="${data.profileImage}" class="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm mb-2">` : ""}
      <h1 class="text-3xl font-bold">${data.name}</h1>
      <p class="italic text-gray-500">${data.tagline}</p>
    </header>
    <section class="mb-6">
      <h2 class="font-semibold text-lg">About</h2>
      <p>${data.about}</p>
    </section>
    <section class="mb-6">
      <h2 class="font-semibold text-lg">Skills</h2>
      <ul>${skills}</ul>
    </section>
    <section class="mb-6">
      <h2 class="font-semibold text-lg">Projects</h2>
      ${projects}
    </section>`;
  }

  function renderMinimalTemplate(data) {
    const skills = (data.skills || [])
      .map((s) => `<li class="px-4 py-1 bg-neutral-200 text-gray-700 rounded-full text-sm font-medium hover:bg-neutral-300 transition">${s}</li>`
      ).join(" ");
    const projects = (data.projects || []).map((p) =>
      `
        <div class="flex-1 min-w-[300px] border border-neutral-200 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <img src="${p.image || 'https://img.icons8.com/ios-filled/100/image.png'}" class="rounded-lg mb-4 w-full object-cover">
          <h3 class="font-semibold text-lg text-gray-800 mb-2">${p.title || "Untitled"}</h3>
          <p class="text-gray-600 text-sm mb-3 leading-relaxed">${p.description || ""}</p>
          <a href="${p.link}" target="_blank" class="text-gray-700 text-sm font-medium hover:text-black underline-offset-2 hover:underline transition">
            View Project →
          </a>
        </div>
      `).join("");
    const educations = (data.educations || []).map((e) =>
      `
    <div class="w-full sm:w-[45%] md:w-[30%] p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
      <h4 class="font-semibold text-xl text-gray-800 mb-1">
        ${e.title || "Untitled"}
      </h4>
      <p class="text-gray-600 text-sm leading-relaxed">
        ${e.description || ""}
      </p>
    </div>
    `).join("");
    return `
    <body class="bg-linear-to-b from-neutral-50 to-neutral-300 font-[Outfit] text-gray-800">

  <!-- Wrapper -->
  <div id="portfolio">

    <!-- HEADER -->
    <header class="py-24 px-6 md:px-16 lg:px-28">
      <div class="grid md:grid-cols-2 items-center gap-16">

        <!-- Image -->
        <div class="flex justify-center md:justify-start">
          ${data.profileImage
        ? `<img src="${data.profileImage}" class="w-48 h-48 md:w-64 md:h-64 rounded-3xl object-cover shadow-sm" />`
        : `images/person.jpg`
      }
        </div>

        <!-- Text -->
        <div>
          <h1 class="text-4xl md:text-5xl font-semibold tracking-tight">
            ${data.name}
          </h1>
          <p class="text-lg md:text-xl text-gray-600 mt-3">
            ${data.tagline}
          </p>
        </div>

      </div>
    </header>


    <!-- ABOUT SECTION -->
    <section class="px-6 md:px-16 lg:px-28 py-16 bg-white rounded-3xl shadow-sm border border-neutral-200">
      <h2 class="text-2xl font-semibold mb-8 tracking-tight text-center">About Me</h2>

      <div class="grid md:grid-cols-3 gap-12">

        <!-- Text -->
        <div class="md:col-span-2 flex justify-center md:justify-start">
          <p class="text-gray-700 leading-relaxed max-w-xl text-center md:text-left">
            ${data.about}
          </p>
        </div>

        <!-- Image -->
        <div class="flex justify-center md:justify-end">
          ${data.aboutImage
        ? `<img src="${data.aboutImage}" class="w-40 h-40 md:w-48 md:h-48 rounded-xl object-cover shadow-sm" />`
        : `images/person.jpg`
      }
        </div>

      </div>
    </section>


    <!-- SKILLS SECTION -->
    <section class="px-6 md:px-16 lg:px-28 py-16">
      <h2 class="text-2xl font-semibold mb-8 tracking-tight text-center">Skills</h2>
      <ul class="flex flex-wrap gap-3 justify-center">${skills}</ul>
    </section>


    <!-- PROJECTS -->
    <section class="px-6 md:px-16 lg:px-28 py-16">
      <h2 class="text-2xl font-semibold mb-10 tracking-tight text-center">Projects</h2>
      <div class="grid md:grid-cols-2 gap-10 justify-center">${projects}</div>
    </section>


    <!-- EDUCATION -->
    <section class="px-6 md:px-16 lg:px-28 py-16">
      <h2 class="text-2xl font-semibold mb-10 tracking-tight text-center">Education</h2>

      <div class="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">${educations}</div>
      
    </section>


    <!-- CONTACT -->
    <section class="px-6 md:px-16 lg:px-28 py-16">
      <h2 class="text-2xl font-semibold border-b pb-2 mb-4 tracking-tight">Contact</h2>

      <div class="flex flex-wrap gap-4">
        ${data.phone ? `<a href="tel:+91${data.phone}" class="text-gray-700 hover:text-black transition">📞 Phone</a>` : ""}
        ${data.email ? `<a href="mailto:${data.email}" class="text-gray-700 hover:text-black transition">📧 Email</a>` : ""}
        ${data.linkedin ? `<a href="${data.linkedin}" class="text-gray-700 hover:text-black transition">💼 LinkedIn</a>` : ""}
        ${data.github ? `<a href="${data.github}" class="text-gray-700 hover:text-black transition">🐙 GitHub</a>` : ""}
      </div>
    </section>

  </div>
</body>
`;
    // const projects = (data.projects || [])
    //   .map(
    //     (p) => `
    //   <div>
    //     <h3 class="font-medium">${p.title}</h3>
    //     <p class="text-sm">${p.description}</p>
    //   </div>`
    //   )
    //   .join("");

    // return `
    // <body class="bg-linear-to-b from-neutral-50 to-neutral-100">
    // <header class="text-center space-y-2">
    //   ${data.profileImage ? `<img src="${data.profileImage}" class="w-24 h-24 rounded-full mx-auto object-cover border border-gray-300 shadow-sm">` : ""}
    //   <h1 class="text-3xl font-bold">${data.name}</h1>
    //   <p class="text-gray-500">${data.tagline}</p>
    // </header>
    // <p class="text-center max-w-lg mx-auto my-4">${data.about}</p>
    // <div class="grid gap-3">${projects}</div>
    // </body>`
    // ;
  }
});
