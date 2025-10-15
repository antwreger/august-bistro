// lazy-load the doc; show "Laddar meny…" while fetching.
// On success: show dynamic. On failure: show static.

function show(el) { if (el) el.hidden = false; }
function hide(el) { if (el) el.hidden = true; }

async function loadMenuFromGoogleDoc() {
  const PUB_URL = "https://docs.google.com/document/d/e/2PACX-1vTbHt9TdJ771nkiO6r2TJ1AIvTRg7-8iBnb-MHJSCo19uhb1TCoJx5SMtRb0nzkBXEPqRtfO-a9uX2d/pub";
  const READABLE_URL = "https://r.jina.ai/http://" + PUB_URL.replace(/^https?:\/\//, "");

  const loading = document.getElementById("menu-loading");
  const dynamic = document.getElementById("dynamic-menu");
  const fallback = document.getElementById("static-menu");

  show(loading);            
  hide(dynamic); hide(fallback); 

  try {
    const res = await fetch(READABLE_URL);
    const raw = await res.text();
    renderStructuredMenu(raw);    

    hide(loading);
    show(dynamic);
  } catch (err) {
    console.error("❌ Failed to load menu:", err);
    hide(loading);
    show(fallback);              
  }
}

function renderStructuredMenu(rawText) {
  let text = rawText
  const marker = "Markdown Content:"
  if (text.includes(marker)) text = text.split(marker)[1].trim()

  // normalize a few odd spaces from Google Docs
  text = text
    .replace(/\r/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/\u200B/g, "")
    .trim()

  const lines = text.split("\n").map(s => s.trim())

  const container = document.getElementById("dynamic-menu")
  if (!container) return
  container.innerHTML = ""

  const frag = document.createDocumentFragment()

  let sectionEl = null
  let itemsWrap = null
  let lastItemEl = null
  let prevBlank = true  // treat very first line as after a blank

  const isPriceLine = s => /\d+\s*kr\b/i.test(s)
  const isAddonLine = s => /^-\s+/.test(s)
  const looksLikeHeader = s =>
    s.length > 0 &&
    !s.includes("-") &&
    !isPriceLine(s) &&
    !isAddonLine(s)

  lines.forEach(raw => {
    const line = raw
    if (!line) { prevBlank = true; return }

    // start a new section if we hit a simple line after a blank
    if (prevBlank && looksLikeHeader(line)) {
      sectionEl = document.createElement("div")
      sectionEl.className = "dyn-section"

      const h3 = document.createElement("h3")
      h3.textContent = line
      sectionEl.appendChild(h3)

      itemsWrap = document.createElement("div")
      itemsWrap.className = "dyn-section__items"
      sectionEl.appendChild(itemsWrap)

      frag.appendChild(sectionEl)
      lastItemEl = null
      prevBlank = false
      return
    }

    // addons attach to the last item we created
    if (isAddonLine(line)) {
      if (lastItemEl) {
        const addon = document.createElement("div")
        addon.className = "dyn-item__addon"
        addon.textContent = line.replace(/^-+\s*/, "")
        lastItemEl.appendChild(addon)
      }
      prevBlank = false
      return
    }

    // if we somehow have items before a section, create a default section
    if (!itemsWrap) {
      sectionEl = document.createElement("div")
      sectionEl.className = "dyn-section"
      const h3 = document.createElement("h3")
      h3.textContent = "Meny"
      sectionEl.appendChild(h3)
      itemsWrap = document.createElement("div")
      itemsWrap.className = "dyn-section__items"
      sectionEl.appendChild(itemsWrap)
      frag.appendChild(sectionEl)
    }

    // normalize dashes/spacing just for splitting
    const normalized = line
      .replace(/[–—]/g, "-")
      .replace(/\s*-\s*/g, " - ")

    // grab trailing price if present
    let price = ""
    const priceMatch = normalized.match(/(\d+)\s*kr\b$/i)
    const beforePrice = priceMatch ? normalized.slice(0, priceMatch.index).trim() : normalized
    if (priceMatch) price = priceMatch[0].trim()

    // split once on first " - " → title + ingredients
    const idx = beforePrice.indexOf(" - ")
    const name = idx >= 0 ? beforePrice.slice(0, idx).trim() : beforePrice
    const ingredients = idx >= 0 ? beforePrice.slice(idx + 3).trim() : ""

    // build item
    const item = document.createElement("div")
    item.className = "dyn-item"

    const row = document.createElement("div")
    row.className = "dyn-item__row"

    const title = document.createElement("div")
    title.className = "dyn-item__title"
    title.textContent = name
    row.appendChild(title)

    if (price) {
      const priceEl = document.createElement("div")
      priceEl.className = "dyn-item__price"
      priceEl.textContent = price
      row.appendChild(priceEl)
    }

    item.appendChild(row)

    if (ingredients) {
      const desc = document.createElement("div")
      desc.className = "dyn-item__ingredients"
      desc.textContent = ingredients
      item.appendChild(desc)
    }

    itemsWrap.appendChild(item)
    lastItemEl = item
    prevBlank = false
  })

  container.appendChild(frag)
}

// Lazy-load when the menu section is in view (no blocking on page load)
function initMenuLazy() {
  const section = document.getElementById("meny");
  if (!section) return loadMenuFromGoogleDoc();

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        io.disconnect();
        loadMenuFromGoogleDoc();
      }
    }, { threshold: 0.1 });
    io.observe(section);
  } else {
    loadMenuFromGoogleDoc();
  }
}

document.addEventListener("DOMContentLoaded", initMenuLazy);