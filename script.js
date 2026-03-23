fetch('header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;

    // Active page highlight
    const links = document.querySelectorAll('nav a');
    const currentPage = window.location.pathname.split("/").pop();

    links.forEach(link => {
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
      }
    });
  });


// 🔥 EVENT DELEGATION (this fixes your issue completely)
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
