document.addEventListener("DOMContentLoaded", () => {

  console.log("✅ JS LOADED");

  // ===============================
  // 🧩 Web Component: Info Card
  // ===============================
  class InfoCard extends HTMLElement {
    connectedCallback() {
      const title = this.getAttribute('title') || '';
      const content = this.getAttribute('content') || '';
      const link = this.getAttribute('link') || '#';

      this.innerHTML = `
        <a href="${link}" class="card-link">
          <div class="card">
            <h3>${title}</h3>
            <p>${content}</p>
          </div>
        </a>
      `;
    }
  }

  if (!customElements.get('info-card')) {
    customElements.define('info-card', InfoCard);
  }


  // ===============================
  // 🧠 Get correct base path (WORKING VERSION)
  // ===============================
  const pathParts = window.location.pathname.split('/');
  const repoName = pathParts[1]; // e.g. "173-Heatherton-Scouts"

  const base = window.location.hostname.includes('github.io')
    ? `/${repoName}/`
    : './';


  // ===============================
  // 📥 Load Header
  // ===============================
  const headerEl = document.getElementById('header');

  if (headerEl) {
   fetch('/173-Heatherton-Scouts/components/header.html')
      .then(res => res.text())
      .then(data => {
        headerEl.innerHTML = data;

        // Active link highlight
        const links = document.querySelectorAll('nav a');
        const currentPath = window.location.pathname;

        links.forEach(link => {
          const href = link.getAttribute("href");

          if (currentPath.endsWith(href)) {
            link.classList.add("active");

            const dropdown = link.closest('.dropdown');
            if (dropdown) {
              dropdown.classList.add('active');

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
  fetch('/173-Heatherton-Scouts/components/footer.html')
      .then(res => res.text())
      .then(data => {
        footerEl.innerHTML = data;
      })
      .catch(err => console.error("❌ Footer failed:", err));
  }


  // ===============================
  // 🖱️ Dropdown Click Handling
  // ===============================
  document.addEventListener('click', function(e) {

    const toggle = e.target.closest('.dropdown-toggle');

    if (toggle) {
      const parent = toggle.parentElement;

      if (!parent.classList.contains('active')) {
        e.preventDefault();

        document.querySelectorAll('.dropdown').forEach(d => {
          d.classList.remove('active');
        });

        parent.classList.add('active');
      }

      return;
    }

    document.querySelectorAll('.dropdown').forEach(drop => {
      if (!drop.contains(e.target)) {
        drop.classList.remove('active');
      }
    });

  });

});
