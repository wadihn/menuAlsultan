const navContainer = document.querySelector("#category-nav");
const menuSections = document.querySelector("#menu-sections");
const searchInput = document.querySelector("#menu-search");
const emptyState = document.querySelector("#empty-state");
const backToTopButton = document.querySelector(".back-to-top");
const quickTools = document.querySelector(".quick-tools");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const categoryVisuals = {
  shisha: {
    image: "assets/images/categories/hookah.webp",
    alt: "صورة قسم الأراجيل",
  },
  milkshake: {
    image: "assets/images/categories/milkshake.webp",
    alt: "صورة قسم الميلك شيك",
  },
  "hot-drinks": {
    image: "assets/images/categories/hot-drinks.webp",
    alt: "صورة قسم المشروبات الساخنة",
  },
  "iced-coffee": {
    image: "assets/images/categories/iced-coffee.webp",
    alt: "صورة قسم آيس كوفي",
  },
  waffle: {
    image: "assets/images/categories/waffle.webp",
    alt: "صورة قسم الوافل",
  },
  "cup-waffle": {
    image: "assets/images/categories/waffle-cup.webp",
    alt: "صورة قسم وافل بالكاسة",
  },
  crepe: {
    image: "assets/images/categories/crepe.webp",
    alt: "صورة قسم الكريب",
  },
  pancake: {
    image: "assets/images/categories/pancake.webp",
    alt: "صورة قسم البان كيك",
  },
  frappe: {
    image: "assets/images/categories/frappe.webp",
    alt: "صورة قسم الفرابيه",
  },
  "soft-drinks": {
    image: "assets/images/categories/soft-drinks.webp",
    alt: "صورة قسم المشروبات الغازية",
  },
  "energy-drinks": {
    image: "assets/images/categories/energy-drinks.webp",
    alt: "صورة قسم مشروبات الطاقة",
  },
  "iced-tea": {
    image: "assets/images/categories/iced-tea.webp",
    alt: "صورة قسم آيس تي",
  },
  "eastern-cocktails": {
    image: "assets/images/categories/cocktails.webp",
    alt: "صورة قسم الكوكتيلات الشرقية",
  },
  mojito: {
    image: "assets/images/categories/mojito.webp",
    alt: "صورة قسم الموهيتو",
  },
  smoothie: {
    image: "assets/images/categories/smoothie.webp",
    alt: "صورة قسم السموذي",
  },
  nuts: {
    image: "assets/images/categories/nuts.webp",
    alt: "صورة قسم المكسرات",
  },
};

let revealObserver;
let lastActiveSectionId = "";

function formatPrice(price) {
  return `${Number(price).toFixed(2)} د.أ`;
}

function normalizeText(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");
}

function createNavLink(section) {
  const link = document.createElement("a");
  link.className = "category-link";
  link.href = `#${section.id}`;
  link.textContent = section.title;
  link.dataset.target = section.id;
  link.addEventListener("click", (event) => {
    event.preventDefault();
    centerCategoryLink(link);
    scrollToSection(section.id);
    window.setTimeout(() => link.blur(), 120);
  });
  return link;
}

function createItemCard(item) {
  const card = document.createElement("article");
  card.className = "menu-card";

  if (item.image) {
    card.classList.add("has-image");
    const media = document.createElement("div");
    media.className = "item-media";

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.name;
    image.loading = "lazy";
    media.append(image);
    card.append(media);
  }

  const body = document.createElement("div");
  body.className = "item-body";

  const row = document.createElement("div");
  row.className = "item-row";

  const title = document.createElement("h3");
  title.className = "item-name";
  title.textContent = item.name;

  const price = document.createElement("span");
  price.className = "item-price";
  price.textContent = formatPrice(item.price);

  row.append(title, price);
  body.append(row);

  if (item.description) {
    const description = document.createElement("p");
    description.className = "item-description";
    description.textContent = item.description;
    body.append(description);
  }

  if (Array.isArray(item.tags) && item.tags.length > 0) {
    const tags = document.createElement("div");
    tags.className = "item-tags";

    item.tags.forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "item-tag";
      tagElement.textContent = tag;
      tags.append(tagElement);
    });

    body.append(tags);
  }

  card.append(body);
  return card;
}

function createSectionCover(section, items) {
  const visual = categoryVisuals[section.id];
  const cover = document.createElement("div");
  cover.className = "section-cover";
  cover.dataset.category = section.id;
  cover.dataset.imagePath = visual?.image || "";

  const imageWrap = document.createElement("div");
  imageWrap.className = "section-cover-media";

  if (visual?.image) {
    const image = document.createElement("img");
    image.src = visual.image;
    image.alt = visual.alt;
    image.loading = section.id === "shisha" ? "eager" : "lazy";
    image.addEventListener(
      "error",
      () => {
        image.remove();
        imageWrap.classList.add("is-placeholder");
      },
      { once: true }
    );
    imageWrap.append(image);
  } else {
    imageWrap.classList.add("is-placeholder");
  }

  const content = document.createElement("div");
  content.className = "section-cover-content";

  const label = document.createElement("span");
  label.className = "section-label";
  label.textContent = `${items.length} صنف`;

  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = section.title;

  content.append(label, title);
  cover.append(imageWrap, content);
  return cover;
}

function createSection(section, items) {
  const sectionElement = document.createElement("section");
  sectionElement.className = "menu-section reveal-on-scroll";
  sectionElement.id = section.id;

  const grid = document.createElement("div");
  grid.className = "items-grid";
  items.forEach((item) => grid.append(createItemCard(item)));

  sectionElement.append(createSectionCover(section, items), grid);
  return sectionElement;
}

function renderNav() {
  navContainer.replaceChildren(...menuData.map(createNavLink));
}

function renderMenu(searchTerm = "") {
  const query = normalizeText(searchTerm);
  const fragment = document.createDocumentFragment();
  let visibleItems = 0;

  menuData.forEach((section) => {
    const filteredItems = section.items.filter((item) => {
      const searchableText = normalizeText(
        [section.title, item.name, item.description, ...(item.tags || [])].join(" ")
      );
      return searchableText.includes(query);
    });

    if (filteredItems.length > 0) {
      visibleItems += filteredItems.length;
      fragment.append(createSection(section, filteredItems));
    }
  });

  menuSections.replaceChildren(fragment);
  emptyState.hidden = visibleItems > 0;
  observeSections();
}

function updateActiveNavLink() {
  const sections = [...document.querySelectorAll(".menu-section")];
  const links = [...document.querySelectorAll(".category-link")];
  const pageBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
  const currentSection = pageBottom
    ? sections.at(-1)
    : sections
        .map((section) => ({
          section,
          distance: Math.abs(section.getBoundingClientRect().top - 150),
        }))
        .sort((first, second) => first.distance - second.distance)[0]?.section;

  links.forEach((link) => {
    const isActive = link.dataset.target === currentSection?.id;
    link.classList.toggle("is-active", isActive);

    if (isActive && currentSection?.id !== lastActiveSectionId) {
      lastActiveSectionId = currentSection.id;
    }
  });
}

function toggleBackToTop() {
  backToTopButton.classList.toggle("is-visible", window.scrollY > 480);
}

function getStickyOffset() {
  return (quickTools?.offsetHeight || 0) + 14;
}

function scrollToSection(sectionId) {
  let section = document.getElementById(sectionId);

  if (!section && searchInput.value) {
    searchInput.value = "";
    renderMenu();
    section = document.getElementById(sectionId);
  }

  if (!section) {
    return;
  }

  const top = section.getBoundingClientRect().top + window.scrollY - getStickyOffset();
  window.scrollTo({
    top: Math.max(0, top),
    behavior: reduceMotion ? "auto" : "smooth",
  });

  history.replaceState(null, "", `#${sectionId}`);
}

function centerCategoryLink(link) {
  const scroller = navContainer.parentElement;

  if (!scroller) {
    return;
  }

  const linkRect = link.getBoundingClientRect();
  const scrollerRect = scroller.getBoundingClientRect();
  const distance =
    linkRect.left -
    scrollerRect.left -
    (scrollerRect.width - linkRect.width) / 2;

  scroller.scrollBy({
    left: distance,
    behavior: "auto",
  });
}

function observeSections() {
  const sections = document.querySelectorAll(".reveal-on-scroll");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
  }

  sections.forEach((section) => revealObserver.observe(section));
}

searchInput.addEventListener("input", (event) => {
  renderMenu(event.target.value);
  updateActiveNavLink();
});

window.addEventListener("scroll", () => {
  updateActiveNavLink();
  toggleBackToTop();
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderNav();
renderMenu();
updateActiveNavLink();
