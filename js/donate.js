initTestimonialSlider({
    containerId: "testimonialContainer",
    indicatorsId: "indicators",
    itemSelector: ".slider-item",
    autoSlideMs: 3000,
    swipeThreshold: 40
});

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

// Donor Wall Linear Tag List with Dark Vivid Colors, Clickable Names, No Underline, Compact Spacing
fetch('donors.json')
  .then(response => response.json())
  .then(data => {
    const donorWall = document.getElementById('donorWall');
    donorWall.innerHTML = '';
    if (!data.donors || !Array.isArray(data.donors) || data.donors.length === 0) {
      donorWall.innerHTML = '<p>No donors yet.</p>';
      return;
    }
    // Most recent donors first (top of JSON)
    const donors = data.donors.slice().reverse();
    // Dark vivid color palette
    const darkColors = [
      '#b71c1c', // dark red
      '#4a148c', // dark purple
      '#1a237e', // dark blue
      '#004d40', // dark teal
      '#1b5e20', // dark green
      '#f57f17', // dark yellow
      '#e65100', // dark orange
      '#3e2723', // dark brown
      '#880e4f', // dark pink
      '#0d47a1', // dark light blue
      '#006064', // dark cyan
      '#33691e', // dark light green
      '#827717', // dark lime
      '#bf360c', // dark deep orange
      '#212121'  // dark gray
    ];
    donors.forEach((donor, i) => {
      const a = document.createElement('a');
      a.textContent = donor.donor_name;
      a.title = `₹${donor.amount} for ${donor.donation_for_cause}`;
      a.style.color = darkColors[i % darkColors.length];
      a.style.fontWeight = 'bold';
      a.style.fontSize = '1em'; // Match normal text size
      a.style.fontFamily = 'inherit';
      a.style.textDecoration = 'none';
      a.style.cursor = 'pointer';
      a.style.marginRight = '0.2em';
      a.style.whiteSpace = 'nowrap'; // Keep full name together
      a.href = `share.html?donor=${encodeURIComponent(donor.donor_name)}`;
      a.target = '_blank';
      donorWall.appendChild(a);
      if (i !== donors.length - 1) {
        donorWall.appendChild(document.createTextNode('\t'));
      }
    });
    donorWall.style.whiteSpace = 'pre-wrap';
    donorWall.style.lineHeight = '1.7';
    donorWall.style.textAlign = 'left'; // Left alignment
  })
  .catch(() => {
    const donorWall = document.getElementById('donorWall');
    donorWall.innerHTML = '<p>Unable to load donor wall.</p>';
  });
