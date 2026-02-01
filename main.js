const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// =========================
// Custom Select (Secteur)
// =========================
(function initCustomSelects(){
  document.querySelectorAll('.cselect').forEach(setup);

  function setup(root){
    const btn = root.querySelector('.cselect-btn');
    const list = root.querySelector('.cselect-list');
    const valueEl = root.querySelector('.cselect-value');
    const hidden = root.querySelector('input[type="hidden"]');
    const options = Array.from(root.querySelectorAll('.cselect-option'));

    if (!btn || !list || !valueEl || !hidden || options.length === 0) return;

    // init selected
    setSelected(hidden.value || options[0].dataset.value || options[0].textContent);

    function open(){
      closeAllExcept(root);
      root.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      list.focus({ preventScroll: true });
    }

    function close(){
      root.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }

    function toggle(){
      root.classList.contains('open') ? close() : open();
    }

    function setSelected(val){
      hidden.value = val;
      valueEl.textContent = val;

      options.forEach(o => {
        const isSel = (o.dataset.value || o.textContent.trim()) === val;
        o.setAttribute('aria-selected', String(isSel));
      });
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggle();
    });

    options.forEach((opt) => {
      opt.addEventListener('click', () => {
        const val = opt.dataset.value || opt.textContent.trim();
        setSelected(val);
        close();
        btn.focus({ preventScroll: true });
      });
    });

    // click outside
    document.addEventListener('click', (e) => {
      if (!root.classList.contains('open')) return;
      if (root.contains(e.target)) return;
      close();
    });

    // keyboard
    root.addEventListener('keydown', (e) => {
      const isOpen = root.classList.contains('open');

      if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        open();
        return;
      }

      if (isOpen && e.key === 'Escape') {
        e.preventDefault();
        close();
        btn.focus({ preventScroll: true });
        return;
      }
    });

    // close when tabbing away
    root.addEventListener('focusout', (e) => {
      if (!root.classList.contains('open')) return;
      if (root.contains(e.relatedTarget)) return;
      close();
    });
  }

  function closeAllExcept(except){
    document.querySelectorAll('.cselect.open').forEach(el => {
      if (el !== except) el.classList.remove('open');
      const b = el.querySelector('.cselect-btn');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
})();

// =========================
// Images – anti flash bleu / placeholder mobile (iOS & Android)
// =========================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img').forEach((img) => {
    img.classList.add('img-fade');

    // Image déjà en cache
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('is-loaded');
      return;
    }

    // Chargement réel
    img.addEventListener('load', () => {
      img.classList.add('is-loaded');
    }, { once: true });

    // Sécurité si erreur
    img.addEventListener('error', () => {
      img.classList.add('is-loaded');
    }, { once: true });
  });
});

// Anti flash image (progressive jpeg / mobile)
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img").forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("is-loaded");
      return;
    }
    img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
    img.addEventListener("error", () => img.classList.add("is-loaded"), { once: true });
  });
});
