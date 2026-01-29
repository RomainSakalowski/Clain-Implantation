// ================================
// Cookie consent (final / robuste)
// ================================

// ====== CONFIG ======
const GTM_CONTAINER_ID = "GTM-N5RJ724P";
const STORAGE_KEY = "clain_cookie_consent_v1";

// ====== Storage helpers ======
function getConsent() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function setConsent(consent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
}

function hasAnalyticsConsent(consent) {
  return !!(consent && consent.analytics === true);
}

// ====== Script loader ======
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function enableGTM() {
  if (window.__gtm_enabled) return;
  window.__gtm_enabled = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

  const url = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_CONTAINER_ID)}`;
  await loadScript(url);
}

// ====== DOM helpers ======
function show(el) {
  if (el) el.removeAttribute("hidden");
}
function hide(el) {
  if (el) el.setAttribute("hidden", "");
}

function ensureMount() {
  let mount = document.getElementById("cookie-consent");
  if (!mount) {
    mount = document.createElement("div");
    mount.id = "cookie-consent";
    document.body.appendChild(mount);
  }
  return mount;
}

async function injectBannerHtml() {
  const mount = ensureMount();
  if (mount.dataset.injected === "1") return;

  // IMPORTANT : chemin RELATIF, robuste sur StackBlitz/Netlify
  const url = new URL("./consent-ui.html", window.location.href);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`fetch cookie-banner.html failed: ${res.status}`);
  }

  mount.innerHTML = await res.text();
  mount.dataset.injected = "1";
}

// ====== UI setup ======
function setupUIOnce() {
  if (window.__cookie_ui_setup) return;
  window.__cookie_ui_setup = true;

  const banner = document.getElementById("cookie-banner");
  const modal = document.getElementById("cookie-modal");

  const btnAccept = document.getElementById("cookie-accept");
  const btnRefuse = document.getElementById("cookie-refuse");
  const btnCustomize = document.getElementById("cookie-customize");

  const btnClose = document.getElementById("cookie-close");
  const btnSave = document.getElementById("cookie-save");
  const btnAcceptAll = document.getElementById("cookie-accept-all");

  const toggleAnalytics = document.getElementById("cookie-analytics-toggle");

  // Affichage initial
  const existing = getConsent();
  if (existing) {
    hide(banner);
    hide(modal);
    if (hasAnalyticsConsent(existing)) enableGTM().catch(console.error);
  } else {
    show(banner);
  }

  // Actions
  btnRefuse?.addEventListener("click", () => {
    setConsent({ analytics: false, ts: Date.now() });
    hide(banner);
    hide(modal);
  });

  btnAccept?.addEventListener("click", () => {
    const consent = { analytics: true, ts: Date.now() };
    setConsent(consent);
    hide(banner);
    hide(modal);
    enableGTM().catch(console.error);
  });

  btnCustomize?.addEventListener("click", () => {
    // Par défaut, OFF (tu peux aussi le mettre à l’état actuel si tu préfères)
    if (toggleAnalytics) toggleAnalytics.checked = false;
    show(modal);
  });

  btnClose?.addEventListener("click", () => hide(modal));

  btnSave?.addEventListener("click", () => {
    const consent = { analytics: !!toggleAnalytics?.checked, ts: Date.now() };
    setConsent(consent);
    hide(banner);
    hide(modal);
    if (hasAnalyticsConsent(consent)) enableGTM().catch(console.error);
  });

  btnAcceptAll?.addEventListener("click", () => {
    const consent = { analytics: true, ts: Date.now() };
    setConsent(consent);
    hide(banner);
    hide(modal);
    enableGTM().catch(console.error);
  });

  // Click outside modal panel closes it (si clic sur l’overlay)
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) hide(modal);
  });

  // ESC ferme la modale
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hide(modal);
  });
}

// ====== Open preferences (used by footer link) ======
async function openPreferences() {
  await injectBannerHtml();
  setupUIOnce();

  const banner = document.getElementById("cookie-banner");
  const modal = document.getElementById("cookie-modal");
  const toggleAnalytics = document.getElementById("cookie-analytics-toggle");

  const existing = getConsent();
  if (toggleAnalytics) toggleAnalytics.checked = hasAnalyticsConsent(existing);

  hide(banner);
  show(modal);
}

// Expose (pratique pour debug)
window.openCookiePreferences = openPreferences;

// ====== Boot (DOM ready) ======
document.addEventListener("DOMContentLoaded", async () => {
  // empêche une double init si script chargé 2 fois
  if (window.__cookie_booted) return;
  window.__cookie_booted = true;

  try {
    await injectBannerHtml();
    setupUIOnce();
  } catch (err) {
    console.error("[cookies] init error:", err);
  }
});

// ====== Interception clic "Gérer les cookies" (capture = prioritaire) ======
document.addEventListener(
  "click",
  (e) => {
    const link = e.target.closest("#manage-cookies");
    if (!link) return;

    e.preventDefault();
    e.stopPropagation();

    openPreferences().catch((err) =>
      console.error("[cookies] open prefs error:", err)
    );
  },
  true
);
