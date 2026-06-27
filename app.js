/* ─── TYPING EFFECT ─── */
const words = [
  "Frontend Developer",
  "CSE Data Science Student",
  "UI/UX Enthusiast",
  "Problem Solver"
];

let wordIndex  = 0;
let charIndex  = 0;
let isDeleting = false;

function typeEffect() {
  const current = words[wordIndex];
  const el = document.getElementById("typing");
  if (!el) return;

  el.textContent = isDeleting
    ? current.substring(0, charIndex--)
    : current.substring(0, charIndex++);

  let speed = isDeleting ? 45 : 90;

  if (!isDeleting && charIndex > current.length) {
    speed = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex < 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    speed = 450;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();

/* ─── NAVBAR SCROLL ─── */
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
});

/* ─── HAMBURGER MENU ─── */
const hamburger = document.getElementById("hamburger");
const mobileNav = document.querySelector("nav");

hamburger?.addEventListener("click", () => {
  mobileNav.classList.toggle("open");
  const spans = hamburger.querySelectorAll("span");
  if (mobileNav.classList.contains("open")) {
    spans[0].style.transform = "rotate(45deg) translate(5px,5px)";
    spans[1].style.opacity   = "0";
    spans[2].style.transform = "rotate(-45deg) translate(5px,-5px)";
  } else {
    spans.forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
  }
});

mobileNav?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    hamburger.querySelectorAll("span").forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
  });
});

/* ─── SCROLL REVEAL (lightweight AOS) ─── */
const aosEls = document.querySelectorAll("[data-aos]");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("aos-animate");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

aosEls.forEach(el => observer.observe(el));

/* ─── PARTICLE CANVAS ─── */
const canvas  = document.getElementById("particles");
const ctx     = canvas.getContext("2d");

let W, H, particles;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function Particle() {
  this.x    = Math.random() * W;
  this.y    = Math.random() * H;
  this.r    = Math.random() * 1.4 + 0.4;
  this.dx   = (Math.random() - 0.5) * 0.35;
  this.dy   = (Math.random() - 0.5) * 0.35;
  this.alpha = Math.random() * 0.55 + 0.15;
}

function initParticles() {
  particles = Array.from({ length: 90 }, () => new Particle());
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(99,179,237,${p.alpha})`;
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > W) p.dx *= -1;
    if (p.y < 0 || p.y > H) p.dy *= -1;
  });

  // draw connecting lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(99,179,237,${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawParticles);
}

window.addEventListener("resize", () => { resize(); initParticles(); });
resize();
initParticles();

// skip particles if user prefers reduced motion
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  drawParticles();
}

/* ─── SMOOTH ACTIVE NAV LINK ─── */
const sections   = document.querySelectorAll("section[id]");
const navLinks   = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute("href") === `#${current}` ? "var(--accent)" : "";
  });
});

/* ─── STAT COUNTER ANIMATION ─── */
function animateCounters() {
  document.querySelectorAll(".stat-num").forEach(el => {
    const text  = el.textContent;
    const num   = parseInt(text);
    if (isNaN(num)) return; // skip ∞

    let start    = 0;
    const dur    = 1400;
    const step   = 16;
    const inc    = num / (dur / step);
    const suffix = text.replace(/[0-9]/g, "");

    const counter = setInterval(() => {
      start = Math.min(start + inc, num);
      el.textContent = Math.floor(start) + suffix;
      if (start >= num) clearInterval(counter);
    }, step);
  });
}

const statsSection = document.querySelector(".about-stats");
if (statsSection) {
  const statsObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statsObs.disconnect();
    }
  }, { threshold: 0.5 });
  statsObs.observe(statsSection);
}
