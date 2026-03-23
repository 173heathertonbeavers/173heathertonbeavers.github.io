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

    // 🔥 Delay fixes mobile inconsistency
    setTimeout(() => {

      // Dropdown toggle
      document.querySelectorAll('.dropdown-toggle').forEach(link => {
        link.addEventListener('click', function(e) {
          const parent = this.parentElement;

          if (!parent.classList.contains('active')) {
            e.preventDefault();
            parent.classList.add('active');
          }
        });
      });

      // Close when clicking outside
      document.addEventListener('click', function(e) {
        document.querySelectorAll('.dropdown').forEach(drop => {
          if (!drop.contains(e.target)) {
            drop.classList.remove('active');
          }
        });
      });

    }, 50); // small delay = big reliability boost

  });
