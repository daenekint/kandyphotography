// Active menu link
(function () {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("nav a").forEach(a => {
      if (a.getAttribute("href") === path) a.classList.add("active");
    });
  })();
  
  // Gallery filter + lightbox (only runs if gallery exists)
  (function () {
    const grid = document.querySelector("[data-gallery-grid]");
    if (!grid) return;
  
    const items = Array.from(grid.querySelectorAll("[data-category]"));
    const chips = Array.from(document.querySelectorAll("[data-filter]"));
  
    function setFilter(cat){
      chips.forEach(c => c.classList.toggle("active", c.dataset.filter === cat));
      items.forEach(el => {
        const match = (cat === "all") || (el.dataset.category === cat);
        el.style.display = match ? "" : "none";
      });
    }
  
    chips.forEach(chip => chip.addEventListener("click", () => setFilter(chip.dataset.filter)));
  
    // Lightbox
    const lb = document.querySelector("[data-lightbox]");
    const lbImg = lb?.querySelector("[data-lightbox-img]");
    const lbCap = lb?.querySelector("[data-lightbox-cap]");
    const btnPrev = lb?.querySelector("[data-lightbox-prev]");
    const btnNext = lb?.querySelector("[data-lightbox-next]");
    const btnClose = lb?.querySelector("[data-lightbox-close]");
  
    let visibleLinks = [];
    let currentIndex = 0;
  
    function rebuildVisible(){
      visibleLinks = items
        .filter(el => el.style.display !== "none")
        .map(el => el.querySelector("a[data-full]"))
        .filter(Boolean);
    }
  
    function openAt(index){
      rebuildVisible();
      currentIndex = Math.max(0, Math.min(index, visibleLinks.length - 1));
      const a = visibleLinks[currentIndex];
      if (!a) return;
  
      lbImg.src = a.dataset.full;
      lbImg.alt = a.querySelector("img")?.alt || "Foto";
      lbCap.textContent = a.dataset.caption || "";
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  
    function close(){
      lb.classList.remove("open");
      document.body.style.overflow = "";
      lbImg.src = "";
    }
  
    function next(){
      openAt((currentIndex + 1) % visibleLinks.length);
    }
    function prev(){
      openAt((currentIndex - 1 + visibleLinks.length) % visibleLinks.length);
    }
  
    grid.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-full]");
      if (!a) return;
      e.preventDefault();
      rebuildVisible();
      const idx = visibleLinks.indexOf(a);
      openAt(idx >= 0 ? idx : 0);
    });
  
    btnClose?.addEventListener("click", close);
    btnNext?.addEventListener("click", next);
    btnPrev?.addEventListener("click", prev);
  
    lb?.addEventListener("click", (e) => {
      if (e.target === lb) close();
    });
  
    window.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });
  
    // default filter
    setFilter("all");
  })();