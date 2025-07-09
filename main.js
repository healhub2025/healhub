// main.js
// Smooth fade-in

// Intersection Observer for fade-in
const faders = document.querySelectorAll('.fade');
const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('appear');
      obs.unobserve(en.target);
    }
  });
}, { threshold: 0.2 });

faders.forEach(el => io.observe(el));

// The language toggle functionality has been removed as it only changed text direction
// and did not provide actual translation, as per your request.
// The smooth scroll navigation has been removed as navigation now primarily
// occurs between different HTML pages, not within sections of a single page.