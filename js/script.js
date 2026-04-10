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

// Shared footer loader
const footerFallbackHtml = `
<footer class="footer">
    <div class="footer-content">
        <div class="footer-section">
            <p>&copy; 2025 <span>Jalte Diye Foundation</span>. All Rights Reserved.</p>
            <p><span style="font-size: 12px; color: #999;">This website contains AI-generated images used for illustration.</span></p>
        </div>
        <div class="footer-links">
            <a href="work-policy.html">Work Policy</a> | <a href="merchandise.html">Merchandise</a> | <a href="privacy-policy.html">Privacy Policy</a> | <a href="terms-of-use.html">Terms of Use</a>
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
