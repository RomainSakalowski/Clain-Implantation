const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================
   Menu premium
   ========================= */
(function initPremiumMenu(){
  const btn = document.getElementById("menuBtn");
  const list = document.getElementById("menuList");

  if (!btn || !list) return;

  function openMenu(){
    list.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
  }

  function closeMenu(){
    list.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    list.classList.contains("open") ? closeMenu() : openMenu();
  });

  document.addEventListener("click", (e) => {
    if (!list.classList.contains("open")) return;
    if (btn.contains(e.target) || list.contains(e.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
})();

/* =========================
   Effet lumière souris premium
   ========================= */
(function initPointerGlow(){
  const root = document.documentElement;

  window.addEventListener("pointermove", (e) => {
    const x = Math.round((e.clientX / window.innerWidth) * 100);
    const y = Math.round((e.clientY / window.innerHeight) * 100);

    root.style.setProperty("--mx", `${x}%`);
    root.style.setProperty("--my", `${y}%`);
  }, { passive: true });
})();

/* =========================
   Apparition au scroll
   ========================= */
(function initReveal(){
  const revealItems = document.querySelectorAll(
    ".premium-hero-kicker, .premium-hero-title, .premium-hero-lead, .premium-hero-actions, .premium-metrics, .home-badge, .home-center, .home-text-badge, .card, .hero-inner"
  );

  revealItems.forEach((el, index) => {
    el.classList.add("reveal-item");
    el.style.setProperty("--reveal-delay", `${Math.min(index * 55, 420)}ms`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  revealItems.forEach((el) => observer.observe(el));
})();

/* =========================
   Custom Select (Secteur)
   ========================= */
(function initCustomSelects(){
  document.querySelectorAll('.cselect').forEach(setup);

  function setup(root){
    const btn = root.querySelector('.cselect-btn');
    const list = root.querySelector('.cselect-list');
    const valueEl = root.querySelector('.cselect-value');
    const hidden = root.querySelector('input[type="hidden"]');
    const options = Array.from(root.querySelectorAll('.cselect-option'));

    if (!btn || !list || !valueEl || !hidden || options.length === 0) return;

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

    document.addEventListener('click', (e) => {
      if (!root.classList.contains('open')) return;
      if (root.contains(e.target)) return;
      close();
    });

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
      }
    });

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

/* =========================
   Images – anti flash + fade-in
   ========================= */
window.applyImageFade = (root = document) => {
  const markLoaded = (img) => img.classList.add('is-loaded');
  const markError  = (img) => img.classList.add('is-error');

  const handle = (img) => {
    if (img.classList.contains('is-loaded')) return;

    if (img.complete && img.naturalWidth > 0) {
      if (img.decode) img.decode().catch(() => {}).finally(() => markLoaded(img));
      else markLoaded(img);
      return;
    }

    img.addEventListener('load', () => {
      if (img.decode) img.decode().catch(() => {}).finally(() => markLoaded(img));
      else markLoaded(img);
    }, { once: true });

    img.addEventListener('error', () => {
      markError(img);
      markLoaded(img);
    }, { once: true });
  };

  root.querySelectorAll('img').forEach(handle);
};

document.addEventListener('DOMContentLoaded', () => {
  window.applyImageFade(document);
});

function initHeaderShrink() {
  const header = document.getElementById("site-header");
  if (!header) return;

  function updateHeader() {
    if (window.scrollY > 30) {
      header.classList.add("is-condensed");
    } else {
      header.classList.remove("is-condensed");
    }
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

initHeaderShrink();