// Jalte Diye Foundation - Website JavaScript
// This file contains JavaScript functionality for the website

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Carousel functionality for activities section
const carousel = document.getElementById('activitiesCarousel');
const prevBtn = document.querySelector('.carousel-btn-prev');
const nextBtn = document.querySelector('.carousel-btn-next');

if (carousel && prevBtn && nextBtn) {
    let currentIndex = 0;
    let totalCards = 0;
    
    const initCarousel = () => {
        const cards = carousel.querySelectorAll('.activity-card');
        totalCards = cards.length;
        currentIndex = 0;
        carousel.scrollLeft = 0;
    };
    
    const scrollToCard = (index) => {
        const cards = carousel.querySelectorAll('.activity-card');
        if (cards.length === 0) return;
        
        // Use the carousel's client width as each card is 100% of it
        const cardWidth = carousel.clientWidth;
        const styles = window.getComputedStyle(carousel);
        const gap = parseFloat(styles.gap) || 30;
        
        // Calculate scroll position for this card
        const scrollPosition = index * (cardWidth + gap);
        
        carousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    };
    
    prevBtn.addEventListener('click', () => {
        // Move to previous card, wrap around to last card if at beginning
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        scrollToCard(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        // Move to next card, wrap around to first card if at end
        currentIndex = (currentIndex + 1) % totalCards;
        scrollToCard(currentIndex);
    });
    
    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousel);
    } else {
        initCarousel();
    }
    
    // Also reset after a small delay to ensure rendering is complete
    setTimeout(initCarousel, 100);
}

// Add any additional website functionality here

// Donor wall tag cloud on donate page
const donorWall = document.getElementById('donorWall');

const renderDonorWallMessage = (message, className = 'donor-wall-loading') => {
    if (!donorWall) return;
    donorWall.innerHTML = `<p class="${className}">${message}</p>`;
};

const getInlineDonorData = () => {
    const inlineDataElement = document.getElementById('donorWallData');
    if (!inlineDataElement) return null;

    try {
        const parsed = JSON.parse(inlineDataElement.textContent || '{}');
        return Array.isArray(parsed.donors) ? parsed : null;
    } catch {
        return null;
    }
};

const calculateTagSize = (amount, minAmount, maxAmount) => {
    // Uniform font size — small enough to fill the dome without overflow
    return 1.05;
};

const calculateFontWeight = (amount, minAmount, maxAmount) => {
    // All donors displayed at uniform font weight for consistent visual layout
    return 700;
};

const getDonorColor = (name, amount, minAmount, maxAmount) => {
    const palette = ['#1b4b44', '#255f8b', '#0f766e', '#6a4c93', '#9a3412', '#0f5132', '#7a2e7a'];
    const hash = Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const base = palette[hash % palette.length];

    if (minAmount === maxAmount) return base;

    const safeAmount = Math.max(amount, 1);
    const minSafe = Math.max(minAmount, 1);
    const maxSafe = Math.max(maxAmount, 1);
    const ratio = (Math.log(safeAmount) - Math.log(minSafe)) / (Math.log(maxSafe) - Math.log(minSafe));

    // Top donors get slightly darker, more prominent text tones.
    if (ratio > 0.72) return '#0b3f3a';
    return base;
};

const getBulbRowPlan = (count) => {
    if (count <= 0) return [];

    // Optimized profile to display exactly 18 names in a denser bulb silhouette.
    if (count === 18) {
        return [
            // Bulb silhouette: dome (rows 0-4) + narrow neck (row 5) + wider base (rows 6-7)
            // fontSize fills each row edge-to-edge: few names in narrow row → bigger font
            { width: 38, capacity: 2, count: 2, fontSize: 1.35 },  // dome tip
            { width: 60, capacity: 3, count: 3, fontSize: 1.25 },  // upper dome
            { width: 78, capacity: 4, count: 4, fontSize: 1.15 },  // dome widest
            { width: 70, capacity: 3, count: 3, fontSize: 1.3  },  // lower dome
            { width: 48, capacity: 2, count: 2, fontSize: 1.4  },  // dome base
            { width: 22, capacity: 1, count: 1, fontSize: 1.1  },  // neck
            { width: 32, capacity: 2, count: 2, fontSize: 0.95 },  // screw ring
            { width: 28, capacity: 1, count: 1, fontSize: 0.9  }   // screw tip
        ];
    }

    const rowCount = Math.max(6, Math.ceil(count / 3));
    const rows = Array.from({ length: rowCount }, (_, index) => {
        const t = rowCount === 1 ? 0 : index / (rowCount - 1);

        // Bulb curve: rounded head/body with a tapered neck+tip near the bottom.
        let width;
        if (t <= 0.68) {
            const arc = Math.sin((t / 0.68) * Math.PI);
            width = 30 + arc * 66;
        } else {
            const taper = (t - 0.68) / 0.32;
            width = 72 - taper * 46;
        }

        return {
            width: Math.max(24, Math.min(96, Math.round(width))),
            capacity: 0,
            count: 0
        };
    });

    rows.forEach(row => {
        row.capacity = Math.max(2, Math.floor(row.width / 11));
    });

    // Expand total capacity if list is longer than current plan.
    let totalCapacity = rows.reduce((sum, row) => sum + row.capacity, 0);
    while (totalCapacity < count) {
        rows.forEach(row => {
            if (row.width >= 44) {
                row.capacity += 1;
                totalCapacity += 1;
            }
        });
    }

    const plannedRows = rows.map((row) => ({
        width: row.width,
        capacity: row.capacity,
        count: 0
    }));

    let remaining = count;

    // First pass: ensure the bulb silhouette spans all selected rows.
    for (let i = 0; i < plannedRows.length && remaining > 0; i += 1) {
        plannedRows[i].count = 1;
        remaining -= 1;
    }

    // Second pass: distribute by width pressure so middle rows hold more names.
    while (remaining > 0) {
        let bestIndex = -1;
        let bestScore = -Infinity;

        for (let i = 0; i < plannedRows.length; i += 1) {
            const row = plannedRows[i];
            if (row.count >= row.capacity) continue;

            const score = row.width / (row.count + 0.8);
            if (score > bestScore) {
                bestScore = score;
                bestIndex = i;
            }
        }

        if (bestIndex === -1) break;
        plannedRows[bestIndex].count += 1;
        remaining -= 1;
    }

    return plannedRows.filter(row => row.count > 0);
};

const loadDonorWall = async () => {
    if (!donorWall) return;

    try {
        let payload = null;
        try {
            const response = await fetch('donors.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            payload = await response.json();
        } catch {
            payload = getInlineDonorData();
        }

        if (!payload) throw new Error('No donor payload available');

        const donors = Array.isArray(payload.donors) ? payload.donors : [];
        const validDonors = donors
            .filter(donor => donor && typeof donor.donor_name === 'string' && Number.isFinite(Number(donor.amount)))
            .map(donor => ({
                donor_name: donor.donor_name.trim(),
                amount: Number(donor.amount),
                donation_for_cause: donor.donation_for_cause || 'our initiatives'
            }))
            .filter(donor => donor.donor_name.length > 0 && donor.amount > 0)
            .sort((a, b) => b.amount - a.amount);

        if (validDonors.length === 0) {
            renderDonorWallMessage('No donor data available right now.');
            return;
        }

        const amounts = validDonors.map(donor => donor.amount);
        const minAmount = Math.min(...amounts);
        const maxAmount = Math.max(...amounts);

        donorWall.innerHTML = '';

        const cloud = document.createElement('div');
        cloud.className = 'donor-cloud donor-cloud--bulb';

        const rowPlan = getBulbRowPlan(validDonors.length);

        // Keep large donor lists readable and non-overlapping.
        const count = validDonors.length;
        const sizeScale = count > 60 ? 0.56 : count > 45 ? 0.64 : count > 32 ? 0.74 : count > 24 ? 0.86 : count > 16 ? 0.95 : 1.0;
        cloud.style.setProperty('--donor-size-scale', String(sizeScale));

        let donorCursor = 0;
        rowPlan.forEach((rowConfig, rowIndex) => {
            const row = document.createElement('div');
            row.className = 'donor-cloud-row';
            row.style.setProperty('--row-width', `${rowConfig.width}%`);

            for (let i = 0; i < rowConfig.count && donorCursor < validDonors.length; i += 1) {
                const donor = validDonors[donorCursor];
                donorCursor += 1;

                const donorTag = document.createElement('span');
                donorTag.className = 'donor-tag';
                donorTag.setAttribute('role', 'listitem');
                donorTag.textContent = donor.donor_name;
                donorTag.title = `Supports ${donor.donation_for_cause}`;

                // Use per-row font size to fill each row to its width
                const rowFontSize = rowConfig.fontSize || 1.05;
                donorTag.style.setProperty('--tag-size', `${(rowFontSize * sizeScale).toFixed(2)}rem`);

                const fontWeight = calculateFontWeight(donor.amount, minAmount, maxAmount);
                donorTag.style.setProperty('--tag-weight', String(fontWeight));

                const tagColor = getDonorColor(donor.donor_name, donor.amount, minAmount, maxAmount);
                donorTag.style.setProperty('--tag-color', tagColor);

                row.appendChild(donorTag);
            }

            cloud.appendChild(row);
        });

        donorWall.appendChild(cloud);
    } catch (error) {
        console.error('[JDF Donor Wall] Failed to load donors.json:', error);
        const isFileProtocol = typeof window !== 'undefined' && window.location && window.location.protocol === 'file:';
        const message = isFileProtocol
            ? 'Unable to load donor wall in direct file mode. Open the site through a local server.'
            : 'Unable to load donor wall right now. Please try again soon.';
        renderDonorWallMessage(message, 'donor-wall-error');
    }
};

if (donorWall) {
    loadDonorWall();
}

// Shared footer loader
const footerFallbackHtml = `
<footer class="footer">
    <div class="footer-content">
        <div class="footer-links">
            <a href="work-policy.html">Work Policy</a>
            <a href="merchandise.html">Merchandise</a>
            <a href="privacy-policy.html">Privacy Policy</a>
            <a href="terms-of-use.html">Terms of Use</a>
            <a href="social-media-guide.html">Social Media Guide</a>
            <a href="banner.html">Banner</a>
            <a href="verify.html">Verify Certificate</a>
        </div>
        <div class="footer-section">
            <p>&copy; 2025 <span>Jalte Diye Foundation</span>. All Rights Reserved.</p>
        </div>
    </div>
</footer>`;

const injectFooter = (html) => {
    const placeholder = document.getElementById('site-footer');
    if (placeholder) placeholder.outerHTML = html;
};

fetch('footer.html')
    .then(response => {
        if (!response.ok) {
            throw new Error('Footer request failed');
        }
        return response.text();
    })
    .then(injectFooter)
    .catch(() => {
        // Fallback keeps footer visible when opened directly from file://
        injectFooter(footerFallbackHtml);
    });
