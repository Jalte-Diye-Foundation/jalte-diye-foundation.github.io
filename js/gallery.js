const IMAGE_EXTS = /\.(jpe?g|png|gif|webp|avif|svg)$/i;

const miyawakiContainer = document.getElementById("gallery-miyawaki");
const womenStemContainer = document.getElementById("gallery-women-stem");
const emptyMsg = document.getElementById("gallery-empty-msg");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCloseBtn = document.getElementById("lightbox-close");
const lightboxPrevBtn = document.getElementById("lightbox-prev");
const lightboxNextBtn = document.getElementById("lightbox-next");
let galleryImages = [];
let currentIndex = 0;

const getGalleryVariantClass = (index) => {
    const blockIndex = Math.floor(index / 3);
    const positionInBlock = index % 3;
    const isEvenBlock = blockIndex % 2 === 0;

    if (isEvenBlock) {
        if (positionInBlock === 0) return "gallery-item--hero-left";
        if (positionInBlock === 1) return "gallery-item--stack-right-top";
        return "gallery-item--stack-right-bottom";
    }

    if (positionInBlock === 0) return "gallery-item--stack-left-top";
    if (positionInBlock === 1) return "gallery-item--hero-right";
    return "gallery-item--stack-left-bottom";
};


function renderSectionGallery(images, container, sectionOffset) {
    if (!container) return;
    container.textContent = "";
    images.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "gallery-item " + getGalleryVariantClass(index);
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", "Gallery photo " + (sectionOffset + index + 1));
        card.dataset.galleryIndex = String(sectionOffset + index);
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = "Gallery photo " + (sectionOffset + index + 1);
        img.loading = "lazy";
        img.decoding = "async";
        card.appendChild(img);
        container.appendChild(card);
    });
}

function openLightbox(index) {
    currentIndex = index;
    const item = galleryImages[index];
    lightboxImg.src = item.src;
    lightboxImg.alt = "Gallery photo " + (index + 1);
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    lightboxImg.removeAttribute("src");
}

function showPrev() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    openLightbox(currentIndex);
}

function showNext() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    openLightbox(currentIndex);
}


fetch("gallery/images.json")
    .then((res) => {
        if (!res.ok) throw new Error("Could not load gallery/images.json");
        return res.json();
    })
    .then((sections) => {
        if (!sections || typeof sections !== "object") throw new Error("Invalid gallery data");
        let allImages = [];
        let offset = 0;

        // Miyawaki Section
        const miyawakiList = Array.isArray(sections["Miyawaki Awareness Talk"]) ? sections["Miyawaki Awareness Talk"] : [];
        const miyawakiImages = miyawakiList
            .filter((name) => IMAGE_EXTS.test(name) || /^https?:\/\//i.test(name))
            .map((name) => ({ src: /^https?:\/\//i.test(name) ? name : "gallery/" + name }));
        renderSectionGallery(miyawakiImages, miyawakiContainer, offset);
        allImages = allImages.concat(miyawakiImages);
        offset += miyawakiImages.length;

        // Women in STEM Section
        const womenStemList = Array.isArray(sections["Women in STEM Talk at DROID7.0"]) ? sections["Women in STEM Talk at DROID7.0"] : [];
        const womenStemImages = womenStemList
            .filter((name) => IMAGE_EXTS.test(name) || /^https?:\/\//i.test(name))
            .map((name) => ({ src: /^https?:\/\//i.test(name) ? name : "gallery/" + name }));
        renderSectionGallery(womenStemImages, womenStemContainer, offset);
        allImages = allImages.concat(womenStemImages);

        galleryImages = allImages;
        if (galleryImages.length === 0) {
            emptyMsg.classList.remove("is-hidden");
        } else {
            emptyMsg.classList.add("is-hidden");
        }
    })
    .catch(() => {
        emptyMsg.textContent = "Unable to load gallery. Please try again later.";
        emptyMsg.classList.remove("is-hidden");
    });


[miyawakiContainer, womenStemContainer].forEach((sectionContainer) => {
    if (!sectionContainer) return;
    sectionContainer.addEventListener("click", (e) => {
        const card = e.target.closest(".gallery-item");
        if (!card || !sectionContainer.contains(card)) return;
        const idx = Number(card.dataset.galleryIndex);
        if (Number.isInteger(idx)) openLightbox(idx);
    });
});


[miyawakiContainer, womenStemContainer].forEach((sectionContainer) => {
    if (!sectionContainer) return;
    sectionContainer.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        const card = e.target.closest(".gallery-item");
        if (!card || !sectionContainer.contains(card)) return;
        e.preventDefault();
        const idx = Number(card.dataset.galleryIndex);
        if (Number.isInteger(idx)) openLightbox(idx);
    });
});

lightboxCloseBtn.addEventListener("click", closeLightbox);
lightboxPrevBtn.addEventListener("click", showPrev);
lightboxNextBtn.addEventListener("click", showNext);
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
});
