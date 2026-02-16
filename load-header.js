fetch("./header.html")
  .then(r => r.text())
  .then(html => {
    const host = document.getElementById('site-header');
    if (!host) return;

    host.innerHTML = html;

    // ✅ applique le fade/anti-flash aux images injectées (logo header)
    if (window.applyImageFade) window.applyImageFade(host);

    // ✅ Sous-titre selon la page (défini dans <body data-tagline="...">)
    const tagline = document.getElementById('pageTagline');
    const pageTag = document.body.getAttribute('data-tagline');
    if (tagline && pageTag) tagline.textContent = pageTag;

    // ✅ Menu déroulant : on initialise APRÈS injection
    initMenu();
  });

function initMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const menuList = document.getElementById('menuList');
  if (!menuBtn || !menuList) return;

  // évite les doubles listeners
  if (menuBtn.dataset.bound === "1") return;
  menuBtn.dataset.bound = "1";

  function setMenu(open) {
    menuList.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    setMenu(!menuList.classList.contains('open'));
  });

  // Ferme uniquement si clic en dehors du bouton / menu
  document.addEventListener('click', (e) => {
    if (!menuList.classList.contains('open')) return;
    if (menuBtn.contains(e.target) || menuList.contains(e.target)) return;
    setMenu(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });

  menuList.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setMenu(false));
  });
}