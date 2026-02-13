function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setupYear() {
  setText("year", String(new Date().getFullYear()));
}

function setupLastUpdated() {
  const d = new Date(document.lastModified);
  if (Number.isNaN(d.getTime())) return;
  const formatted = d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  setText("last-updated", `Last updated: ${formatted}`);
}

function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  const close = () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  links.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.tagName === "A") close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Node)) return;
    if (toggle.contains(t) || links.contains(t)) return;
    close();
  });
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  // Fallback for non-secure contexts (should rarely happen on GitHub Pages)
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  ta.style.top = "0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  const ok = document.execCommand("copy");
  ta.remove();
  return ok;
}

function setupCitationCopy() {
  const btn = document.getElementById("copy-cite");
  const code = document.getElementById("bibtex");
  if (!btn || !code) return;

  const defaultLabel = btn.textContent || "Copy BibTeX";

  btn.addEventListener("click", async () => {
    try {
      const text = code.textContent || "";
      await copyTextToClipboard(text);
      btn.textContent = "Copied!";
      btn.disabled = true;
      window.setTimeout(() => {
        btn.textContent = defaultLabel;
        btn.disabled = false;
      }, 1200);
    } catch {
      btn.textContent = "Copy failed";
      window.setTimeout(() => {
        btn.textContent = defaultLabel;
      }, 1400);
    }
  });
}

setupYear();
setupLastUpdated();
setupMobileNav();
setupCitationCopy();
