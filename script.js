document.addEventListener("DOMContentLoaded", () => {

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

  // جلوگیری duplicate error (safe define)
  if (!customElements.get('info-card')) {
    customElements.define('info-card', InfoCard);
  }


  // ===============================
  // 📥 Load Header
  // ===============================
  const headerEl = document.getElementById('header');

  if (headerEl) {
    fetch('header.html')
      .then(response => {
        if (!response.ok) {
          throw new Error("Header file not found");
        }
        return response.text();
      })
      .then(data => {
        headerEl.innerHTML = data;
// ===============================
// 📥 Load Footer
// ===============================
const footerEl = document.getElementById('footer');

if (footerEl) {
  fetch('footer.html')
    .then(response => {
      if (!response.ok) {
        throw new Error("Footer file not found");
      }
      return response.text();
    })
    .then(data => {
      footerEl.innerHTML = data;
    })
    .catch(err => {
      console.error("❌ Footer failed to load:", err);
    });
}
        // ===============================
        // 🎯 Active Page Highlight
        // ===============================
        const links = document.querySelectorAll('nav a');
        const currentPage = window.location.pathname.split("/").pop() || "index.html";

        links.forEach(link => {
          const href = link.getAttribute("href");

          if (href === currentPage) {
            link.classList.add("active");

            // Highlight parent dropdown
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
      .catch(err => {
        console.error("❌ Header failed to load:", err);
      });
  }


  // ===============================
  // 🖱️ Dropdown Click Handling
  // ===============================
  document.addEventListener('click', function(e) {

    const toggle = e.target.closest('.dropdown-toggle');

    // If clicking a dropdown toggle
    if (toggle) {
      const parent = toggle.parentElement;

      if (!parent.classList.contains('active')) {
        e.preventDefault();

        // Close other dropdowns
        document.querySelectorAll('.dropdown').forEach(d => {
          d.classList.remove('active');
        });

        parent.classList.add('active');
      }

      return;
    }

    // Clicking outside → close all
    document.querySelectorAll('.dropdown').forEach(drop => {
      if (!drop.contains(e.target)) {
        drop.classList.remove('active');
      }
    });

  });

});
