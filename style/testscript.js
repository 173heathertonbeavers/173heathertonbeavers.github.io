// ======================================================
// 📥 LOAD HTML COMPONENTS
// ======================================================
function loadComponent(id, url, callback) {
  const el = document.getElementById(id);
  if (!el) return;

  fetch(url)
    .then(res => res.text())
    .then(data => {
      el.innerHTML = data;
      if (callback) callback();
    })
    .catch(err => console.error(`❌ ${id} failed:`, err));
}

// Load header and footer
loadComponent("header", "/components/header.html", () => {
  highlightActiveLink();
  initMenu();
  initFullscreenImages();
});
loadComponent("footer", "/components/footer.html", initFullscreenImages);

// ======================================================
// 🖼️ CAROUSEL + FULLSCREEN IMAGES
// ======================================================
let nextPhoto, prevPhoto;

function initFullscreenImages() {
  const carouselContainer = document.getElementById("photo");
  const carouselDots = document.getElementById("dots");
  const photos = carouselContainer ? [
    "images/quote1.png",
    "images/quote2.png",
    "images/quote3.png"
  ] : [];

  let index = 0;

  const fullscreen = document.getElementById("fullscreen");
  const fullImg = document.getElementById("fullImg");
  const closeBtn = document.getElementById("closeBtn");
  const dotsFull = document.getElementById("fullscreenDots");
  const prevFull = document.getElementById("prevFull");
  const nextFull = document.getElementById("nextFull");

  // Normalize src (relative vs absolute)
  function normalize(src) {
    const a = document.createElement("a");
    a.href = src;
    return a.pathname.replace(/^\/+/, "");
  }

  // --------------------------
  // Normal Carousel Dots
  // --------------------------
  if (carouselContainer && carouselDots) {
    carouselDots.innerHTML = "";
    photos.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      dot.addEventListener("click", () => showNormalPhoto(i));
      carouselDots.appendChild(dot);
    });
  }

  // --------------------------
  // All Photos for fullscreen
  // --------------------------
  const clickableImgs = Array.from(document.querySelectorAll(".clickable"))
    .map(img => normalize(img.src))
    .filter(src => src);

  const seen = new Set();
  const allPhotos = [];

  photos.forEach(src => {
    if (src && !seen.has(src)) {
      seen.add(src);
      allPhotos.push(src);
    }
  });
  clickableImgs.forEach(src => {
    if (!seen.has(src)) {
      seen.add(src);
      allPhotos.push(src);
    }
  });

  // --------------------------
  // Fullscreen dots
  // --------------------------
  if (dotsFull) {
    dotsFull.innerHTML = "";
    allPhotos.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      dot.addEventListener("click", e => {
        e.stopPropagation();
        showFullscreenPhoto(i);
      });
      dotsFull.appendChild(dot);
    });
  }

  // --------------------------
  // Show normal photo
  // --------------------------
  function showNormalPhoto(i) {
    index = i;
    if (carouselContainer) carouselContainer.src = photos[i];

    if (carouselDots) {
      carouselDots.querySelectorAll(".dot").forEach((dot, j) => {
        dot.classList.toggle("active", j === i);
      });
    }

    // Sync fullscreen if open
    if (fullscreen && fullscreen.style.display === "flex") {
      const fullIndex = allPhotos.findIndex(p => normalize(p) === normalize(photos[i]));
      if (fullIndex >= 0) showFullscreenPhoto(fullIndex);
    }
  }

  // --------------------------
  // Show fullscreen photo
  // --------------------------
  function showFullscreenPhoto(i) {
    index = i;
    if (!fullImg) return;
    fullImg.src = allPhotos[i];

    if (dotsFull) {
      dotsFull.querySelectorAll(".dot").forEach((dot, j) => {
        dot.classList.toggle("active", j === i);
      });
    }

    if (carouselContainer && photos.includes(allPhotos[i]) && carouselDots) {
      const carouselIndex = photos.indexOf(allPhotos[i]);
      carouselDots.querySelectorAll(".dot").forEach((dot, j) => {
        dot.classList.toggle("active", j === carouselIndex);
      });
    }
  }

  // --------------------------
  // Open fullscreen
  // --------------------------
  Array.from(document.querySelectorAll(".clickable")).forEach(img => {
    img.addEventListener("click", () => {
      if (!fullscreen) return;
      fullscreen.style.display = "flex";
      const fullIndex = allPhotos.findIndex(p => normalize(p) === normalize(img.src));
      if (fullIndex >= 0) showFullscreenPhoto(fullIndex);
    });
  });

  // --------------------------
  // Fullscreen arrows
  // --------------------------
  if (prevFull && nextFull) {
    prevFull.addEventListener("click", e => {
      e.stopPropagation();
      showFullscreenPhoto((index - 1 + allPhotos.length) % allPhotos.length);
    });
    nextFull.addEventListener("click", e => {
      e.stopPropagation();
      showFullscreenPhoto((index + 1) % allPhotos.length);
    });
  }

  // --------------------------
  // Close fullscreen
  // --------------------------
  if (closeBtn && fullscreen) {
    const close = () => fullscreen.style.display = "none";
    closeBtn.addEventListener("click", close);
    fullscreen.addEventListener("click", e => {
      if (e.target === fullscreen) close();
    });
  }

  // --------------------------
  // Normal carousel arrows
  // --------------------------
  nextPhoto = () => {
    if (!carouselContainer) return;
    const currentIndex = photos.findIndex(p => normalize(p) === normalize(carouselContainer.src));
    const nextIndex = (currentIndex + 1) % photos.length;
    showNormalPhoto(nextIndex);
  };
  prevPhoto = () => {
    if (!carouselContainer) return;
    const currentIndex = photos.findIndex(p => normalize(p) === normalize(carouselContainer.src));
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    showNormalPhoto(prevIndex);
  };

  if (photos.length) showNormalPhoto(0);
}

// ======================================================
// 🔗 ACTIVE NAV LINK
// ======================================================
function highlightActiveLink() {
  const currentPath = window.location.pathname;

  document.querySelectorAll("nav a").forEach(link => {
    const href = link.getAttribute("href");

    if (href && currentPath.endsWith(href)) {
      link.classList.add("active");

      const dropdown = link.closest(".dropdown");
      const parentLink = dropdown?.querySelector(".dropdown-toggle");

      if (parentLink) parentLink.classList.add("active");
    }
  });
}

// ======================================================
// 🍔 MOBILE MENU
// ======================================================
function initMenu() {
  const toggleBtn = document.getElementById("menuToggle");
  const nav = document.querySelector("nav");

  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener("click", () => nav.classList.toggle("open"));

  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", () => {
      if (!(link.classList.contains("dropdown-toggle") && window.innerWidth <= 768)) {
        nav.classList.remove("open");
      }
    });
  });

  document.addEventListener("click", e => {
    if (!e.target.closest("nav") && !e.target.closest("#menuToggle")) {
      nav.classList.remove("open");
    }
  });
}

// ======================================================
// 🖱️ DROPDOWN HANDLING
// ======================================================
document.addEventListener("click", e => {
  const isMobile = window.innerWidth <= 768;
  const toggle = e.target.closest(".dropdown-toggle");
  const dropdowns = document.querySelectorAll(".dropdown");

  if (isMobile && toggle) {
    const parent = toggle.closest(".dropdown");
    const isOpen = parent.classList.contains("active");
    dropdowns.forEach(d => d.classList.remove("active"));
    if (!isOpen) {
      e.preventDefault();
      parent.classList.add("active");
    }
    return;
  }

  if (!e.target.closest(".dropdown")) dropdowns.forEach(d => d.classList.remove("active"));
});

// ======================================================
// 📰 NEWS SYSTEM
// ======================================================
function initNews() {
  if (typeof posts === "undefined") return;

  const featured = document.getElementById("featured");
  const older = document.getElementById("older");
  if (!featured || !older) return;

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const latest = posts[0];
  featured.innerHTML = `<h2>${latest.title}</h2><p class="date">${latest.date}</p>${latest.content}`;

  posts.slice(1).forEach(post => {
    const li = document.createElement("li");
    li.classList.add("post");
    li.innerHTML = `
      <div class="post-header">
        <span class="triangle"></span>
        <strong>${post.title}</strong> (${post.date})
      </div>
      <div class="post-content">${post.content}</div>
    `;
    li.querySelector(".post-header").onclick = () => {
      const isOpen = li.classList.contains("open");
      document.querySelectorAll(".post").forEach(p => p.classList.remove("open"));
      if (!isOpen) li.classList.add("open");
    };
    older.appendChild(li);
  });

  initFullscreenImages();
}

initNews();

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    const nav = document.querySelector("nav");
    if (nav) nav.classList.remove("open");
  }
});