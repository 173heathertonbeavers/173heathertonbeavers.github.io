// ===============================
// 🧩 Web Component (MUST be first)
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

// جلوگیری duplicate error
if (!customElements.get('info-card')) {
  customElements.define('info-card', InfoCard);
}


// ===============================
// 📥 Load header
// ===============================
fetch('header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;

    // ===============================
    // 🎯 Active page highlight
    // ===============================
    const links = document.querySelectorAll('nav a');
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    links.forEach(link => {
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");

        // 🔥 Activate parent dropdown
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
  });


// ===============================
// 🖱️ Dropdown click handling
// ===============================
document.addEventListener('click', function(e) {

  const toggle = e.target.closest('.dropdown-toggle');

  // Clicked dropdown toggle
  if (toggle) {
    const parent = toggle.parentElement;

    if (!parent.classList.contains('active')) {
      e.preventDefault();

      // Close others
      document.querySelectorAll('.dropdown').forEach(d => {
        d.classList.remove('active');
      });

      parent.classList.add('active');
    }

    return;
  }

  // Click outside → close all
  document.querySelectorAll('.dropdown').forEach(drop => {
    if (!drop.contains(e.target)) {
      drop.classList.remove('active');
    }
  });

});
