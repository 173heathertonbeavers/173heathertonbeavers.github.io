// ======================================================// 📥 LOAD HTML COMPONENTS// ======================================================
function loadComponent(id, url, callback) {
  const el = document.getElementById(id);
  if (!el) return;
  fetch(url)
    .then(res => res.text())
    .then(data => { el.innerHTML = data;  if (callback) callback();})
    .catch(err => console.error(`❌ ${id} failed:`, err));}
loadComponent("header", "/components/header.html", highlightActiveLink);
loadComponent("footer", "/components/footer.html");
// ======================================================// 🔗 ACTIVE NAV LINK// ======================================================
function highlightActiveLink() {
const currentPath = window.location.pathname;
  document.querySelectorAll("nav a").forEach(link => {
    const href = link.getAttribute("href");
    if (href && currentPath.endsWith(href)) {
      link.classList.add("active");
      const dropdown = link.closest(".dropdown");
      const parentLink = dropdown?.querySelector(".dropdown-toggle");
      if (parentLink) parentLink.classList.add("active");}});}
// ======================================================// 🖱️ DROPDOWN HANDLING// ======================================================
document.addEventListener("click", (e) => {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const toggle = e.target.closest(".dropdown-toggle");
  const dropdowns = document.querySelectorAll(".dropdown");
  if (isMobile && toggle) {
    const parent = toggle.closest(".dropdown");
    if (!parent.classList.contains("active")) {
      e.preventDefault();
      dropdowns.forEach(d => d.classList.remove("active"));
      parent.classList.add("active");}return;}
  if (!e.target.closest(".dropdown")) {
    dropdowns.forEach(d => d.classList.remove("active"));}});
// Reset dropdowns when navigating back
window.addEventListener("pageshow", () => {
  document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("active"));});
// ======================================================// 🖼️ FULLSCREEN IMAGES// ======================================================
function initFullscreenImages() {
  const fullscreen = document.getElementById("fullscreen");
  const fullImg = document.getElementById("fullImg");
  const closeBtn = document.getElementById("closeBtn");
  if (!fullscreen || !fullImg || !closeBtn) return;
  document.querySelectorAll(".clickable").forEach(img => {
    img.addEventListener("click", () => {
      fullscreen.style.display = "flex";
      fullImg.src = img.src; });});
  const close = () => fullscreen.style.display = "none";
  closeBtn.addEventListener("click", close);
  fullscreen.addEventListener("click", close);}
initFullscreenImages();
// ======================================================// 📰 NEWS SYSTEM// ======================================================
function initNews() {
  if (typeof posts === "undefined") return;
  const featured = document.getElementById("featured");
  const older = document.getElementById("older");
  if (!featured || !older) return;
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  const latest = posts[0];
  featured.innerHTML = `
    <h2>${latest.title}</h2>
    <p class="date">${latest.date}</p>
    ${latest.content}`;
  posts.slice(1).forEach(post => {
    const li = document.createElement("li");
    li.classList.add("post");
    li.innerHTML = `
      <div class="post-header">  <span class="triangle"></span>  <strong>${post.title}</strong> (${post.date})</div>
      <div class="post-content"> ${post.content} </div> `;
    li.querySelector(".post-header").onclick = () => {const isOpen = li.classList.contains("open");
      document.querySelectorAll(".post").forEach(p => p.classList.remove("open"));
      if (!isOpen) li.classList.add("open");}; older.appendChild(li);});}
initNews();