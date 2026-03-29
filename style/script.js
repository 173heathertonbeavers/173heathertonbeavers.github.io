document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ JS LOADED");

  // ===============================
  // 🧩 Web Component: Info Card
  // ===============================
  class InfoCard extends HTMLElement {
    connectedCallback() {
      const link = this.getAttribute('link') || '#';
      const content = this.innerHTML;

      this.innerHTML = `
        <a href="${link}" class="card-link">
          <div class="card">
            ${content}
          </div>
        </a>
      `;
    }
  }

  if (!customElements.get('info-card')) {
    customElements.define('info-card', InfoCard);
  }

  // ===============================
  // 📥 Load Header
  // ===============================
  const headerEl = document.getElementById('header');

  if (headerEl) {
    fetch("/components/header.html")
      .then(res => res.text())
      .then(data => {
        headerEl.innerHTML = data;

        // ✅ Active link highlight
        const links = document.querySelectorAll('nav a');
        const currentPath = window.location.pathname;

        links.forEach(link => {
          const href = link.getAttribute("href");

          if (href && currentPath.endsWith(href)) {
            link.classList.add("active");

            const dropdown = link.closest('.dropdown');
            if (dropdown) {
              const parentLink = dropdown.querySelector('.dropdown-toggle');
              if (parentLink) {
                parentLink.classList.add('active');
              }
            }
          }
        });
      })
      .catch(err => console.error("❌ Header failed:", err));
  }

  // ===============================
  // 📥 Load Footer
  // ===============================
  const footerEl = document.getElementById('footer');

  if (footerEl) {
    fetch("/components/footer.html")
      .then(res => res.text())
      .then(data => {
        footerEl.innerHTML = data;
      })
      .catch(err => console.error("❌ Footer failed:", err));
  }

  // ===============================
  // 🖱️ Dropdown Handling
  // ===============================
  document.addEventListener("click", function (e) {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const toggle = e.target.closest(".dropdown-toggle");
    const allDropdowns = document.querySelectorAll(".dropdown");

    // 📱 Mobile behaviour
    if (isMobile && toggle) {
      const parent = toggle.closest(".dropdown");

      if (parent.classList.contains("active")) {
        return; // allow navigation
      }

      e.preventDefault();

      allDropdowns.forEach(d => d.classList.remove("active"));
      parent.classList.add("active");

      return;
    }

    // 🧼 Click outside closes all
    if (!e.target.closest(".dropdown")) {
      allDropdowns.forEach(d => d.classList.remove("active"));
    }
  });

  // ===============================
  // 🔄 Reset dropdowns on page show
  // ===============================
  window.addEventListener("pageshow", () => {
    document.querySelectorAll(".dropdown").forEach(d => {
      d.classList.remove("active");
    });
  });

  // ===============================
  // 🖼️ FULLSCREEN IMAGES
  // ===============================
  const fullscreen = document.getElementById("fullscreen");
  const fullImg = document.getElementById("fullImg");
  const closeBtn = document.getElementById("closeBtn");

  if (fullscreen && fullImg && closeBtn) {
    document.querySelectorAll(".clickable").forEach(img => {
      img.addEventListener("click", (e) => {
        e.stopPropagation();
        fullscreen.style.display = "flex";
        fullImg.src = img.src;
      });
    });

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      fullscreen.style.display = "none";
    });

    fullscreen.addEventListener("click", () => {
      fullscreen.style.display = "none";
    });

  } else {
    console.error("❌ Fullscreen elements not found");
  }

  // ===============================
  // 📰 News System
  // ===============================
  if (typeof posts !== "undefined") {

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const featured = document.getElementById("featured");
    const older = document.getElementById("older");

    if (featured && older) {
      const latest = posts[0];

      featured.innerHTML = `
        <h2>${latest.title}</h2>
        <p class="date">${latest.date}</p>
        ${latest.content}
      `;

      posts.slice(1).forEach(post => {
        const li = document.createElement("li");

        li.innerHTML = `
          <div class="post-title">
            <strong>${post.title}</strong> (${post.date})
          </div>
          <div class="post-content" style="display:none;">
            ${post.content}
          </div>
        `;

        const title = li.querySelector(".post-title");
        const content = li.querySelector(".post-content");

        title.style.cursor = "pointer";

        title.onclick = () => {
          const isOpen = content.style.display === "block";

          document.querySelectorAll(".post-content").forEach(el => {
            el.style.display = "none";
          });

          content.style.display = isOpen ? "none" : "block";
        };

        older.appendChild(li);
      });
    }
  }
});