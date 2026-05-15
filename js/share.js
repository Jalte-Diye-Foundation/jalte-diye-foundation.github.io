// Fix: Accept both ?donor= and ?name= for donor name
const params = new URLSearchParams(window.location.search);
const donorName = params.get("donor") || params.get("name") || "Proud Supporter";
const campaign = params.get("campaign") || "Miyawaki Forestation";
const donateURL = "https://jaltediyefoundation.org/donate.html";
const sharePageURL = window.location.href;

document.getElementById("donor-name").textContent = donorName;
document.getElementById("campaign-name").textContent = campaign;

if (params.get("donor") || params.get("name")) {
    const welcomeEl = document.getElementById("welcome-message");
    welcomeEl.textContent = `Welcome, ${donorName}!`;
    welcomeEl.classList.remove("hidden");
}

const qrContainer = document.getElementById("qr-code");
new QRCode(qrContainer, {
    text: donateURL,
    width: 80,
    height: 80,
    colorDark: "#064e3b",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
});

const shareText = `I just supported Jalte Diye Foundation as ${donorName}. See my support card: ${sharePageURL}`;
const encodedShareText = encodeURIComponent(shareText);
const encodedShareUrl = encodeURIComponent(sharePageURL);

async function generateCardBlob() {
    const card = document.getElementById("share-card");
    const canvas = await html2canvas(card, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false
    });

    // RECTANGULAR: Remove all corner rounding
    const clippedCanvas = document.createElement("canvas");
    clippedCanvas.width = canvas.width;
    clippedCanvas.height = canvas.height;

    const clippedCtx = clippedCanvas.getContext("2d");
    clippedCtx.clearRect(0, 0, clippedCanvas.width, clippedCanvas.height);
    // No clipping path, just draw the full rectangle
    clippedCtx.drawImage(canvas, 0, 0);

    return await new Promise((resolve, reject) => {
        clippedCanvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("Could not generate image blob"));
                return;
            }
            resolve(blob);
        }, "image/png");
    });
}

async function shareCardImage() {
    const fileName = `jdf-share-card-${donorName.replace(/\s+/g, "-").toLowerCase()}.png`;

    try {
        const blob = await generateCardBlob();
        const file = new File([blob], fileName, { type: "image/png" });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: "My Jalte Diye Support Card",
                text: `I just supported Jalte Diye Foundation as ${donorName}.`
            });
            return;
        }

        const link = document.createElement("a");
        link.download = fileName;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
        alert("Direct image share is not supported on this browser. The card has been downloaded; you can upload it in your social app.");
    } catch (err) {
        console.error(err);
        alert("Unable to prepare image for sharing. Please try again.");
    }
}

const primaryRow = document.getElementById("share-row-primary");
const socialRow = document.getElementById("share-row-social");

const downloadBtn = document.createElement("button");
downloadBtn.className = "download-btn";
downloadBtn.textContent = "Download Share Card";
downloadBtn.onclick = downloadCard;
primaryRow.appendChild(downloadBtn);

const imageShareBtn = document.createElement("button");
imageShareBtn.className = "share-btn";
imageShareBtn.textContent = "Share Card Image";
imageShareBtn.onclick = async () => {
    const originalText = imageShareBtn.textContent;
    imageShareBtn.textContent = "Preparing Image...";
    imageShareBtn.disabled = true;
    await shareCardImage();
    imageShareBtn.textContent = originalText;
    imageShareBtn.disabled = false;
};
primaryRow.appendChild(imageShareBtn);

const copyBtn = document.createElement("button");
copyBtn.className = "share-btn";
copyBtn.textContent = "Copy Link";
copyBtn.onclick = () => {
    navigator.clipboard.writeText(sharePageURL);
    copyBtn.textContent = "Copied";
    setTimeout(() => {
        copyBtn.textContent = "Copy Link";
    }, 2000);
};
primaryRow.appendChild(copyBtn);

const socialButtons = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}` },
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}&quote=${encodedShareText}` },
    { label: "X / Twitter", href: `https://twitter.com/intent/tweet?text=${encodedShareText}` }
];

socialButtons.forEach((btn) => {
    const a = document.createElement("a");
    a.href = btn.href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "share-btn";
    a.textContent = btn.label;
    socialRow.appendChild(a);
});

function downloadCard() {
    const button = document.querySelector(".download-btn");
    const originalText = button.textContent;
    button.textContent = "Generating...";
    button.disabled = true;

    generateCardBlob().then((blob) => {
        const link = document.createElement("a");
        link.download = `jdf-share-card-${donorName.replace(/\s+/g, "-").toLowerCase()}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);

        button.textContent = originalText;
        button.disabled = false;
    }).catch((err) => {
        console.error(err);
        alert("Download failed. Please try screenshot instead.");
        button.textContent = originalText;
        button.disabled = false;
    });
}

function fireConfetti() {
    const end = Date.now() + 2500;
    const colors = ["#10b981", "#34d399", "#6ee7b7", "#fbbf24", "#f59e0b"];

    (function frame() {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
    })();
}

setTimeout(() => fireConfetti(), 600);

// Load testimonials from JSON and render slider
function loadTestimonials(containerId, indicatorsId) {
    fetch('testimonials.json')
        .then(response => response.json())
        .then(testimonials => {
            const container = document.getElementById(containerId);
            const indicators = document.getElementById(indicatorsId);
            if (!container || !Array.isArray(testimonials)) return;
            container.innerHTML = '';
            testimonials.forEach((t, i) => {
                const div = document.createElement('div');
                div.className = 'testimonial slider-item' + (i === 0 ? ' active' : '');
                div.innerHTML = `
                    <p>"${t.text}"</p>
                    <div class="author">${t.author}</div>
                    <a class="learn-more-link post-link" href="${t.link}" target="_blank" rel="noopener">View LinkedIn post</a>
                `;
                container.appendChild(div);
            });
            if (indicators) indicators.innerHTML = '';
            // Re-init slider after DOM update
            if (typeof initTestimonialSlider === 'function') {
                initTestimonialSlider({
                    containerId,
                    indicatorsId,
                    itemSelector: '.slider-item',
                    autoSlideMs: 3000,
                    swipeThreshold: 40
                });
            }
        });
}
// On page load, replace static testimonials with dynamic
loadTestimonials('testimonialContainer', 'indicators');
