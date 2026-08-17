// Navbar scroll effect
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('toggle');
        navbar.classList.toggle('nav-open');
    });

    // Close menu when a link or theme toggle is clicked
    document.querySelectorAll('.nav-links a, .theme-toggle').forEach(element => {
        element.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
            navbar.classList.remove('nav-open');
        });
    });
}

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Simple reveal animation on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .project-card, .section-header, .logo-cloud').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    observer.observe(el);
});

// Special observer for staggered reveal groups
const groupObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            groupObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.mission-vision-group').forEach(el => {
    groupObserver.observe(el);
});

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.textContent;

        btn.textContent = 'Sending...';
        btn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            btn.textContent = 'Message Sent!';
            btn.style.background = '#10b981'; // Success green
            contactForm.reset();

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

// Testimonial Slider
const track = document.getElementById('testimonial-track');
if (track) {
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const dotsNav = document.getElementById('slider-dots');

    let currentSlideIndex = 0;

    function updateSlider() {
        const slideWidth = slides[0].getBoundingClientRect().width + 30; // 30 is the gap
        track.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;

        // Update dots
        if (dotsNav) {
            const dots = Array.from(dotsNav.children);
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlideIndex);
            });
        }
    }

    // Create dots
    if (dotsNav) {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentSlideIndex = index;
                updateSlider();
            });
            dotsNav.appendChild(dot);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            updateSlider();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
            updateSlider();
        });
    }

    // Auto-play
    let autoPlay = setInterval(() => {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        updateSlider();
    }, 5000);

    // Pause auto-play on hover
    track.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.parentElement.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => {
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            updateSlider();
        }, 5000);
    });

    // Responsive handling
    window.addEventListener('resize', updateSlider);
}

// --- Intuitive Hero Animations ---

// Mouse Parallax Effect
const heroSection = document.querySelector('.hero');
const visualEl = document.querySelector('.hero-visual');
const glowOrb = document.querySelector('.glow-orb');

if (heroSection && visualEl) {
    heroSection.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const moveX = (clientX - innerWidth / 2) / 30;
        const moveY = (clientY - innerHeight / 2) / 30;

        visualEl.style.transform = `translate(${moveX}px, ${moveY}px) rotateY(${moveX / 5}deg) rotateX(${moveY / -5}deg)`;
        if (glowOrb) {
            glowOrb.style.transform = `translate(${moveX * -1.5}px, ${moveY * -1.5}px)`;
        }
    });

    // Reset on leave
    heroSection.addEventListener('mouseleave', () => {
        visualEl.style.transform = `translate(0, 0) rotateY(0) rotateX(0)`;
        if (glowOrb) glowOrb.style.transform = `translate(0, 0)`;
    });
}

// Stats Counting Animation
const statsItems = document.querySelectorAll('.stat-item h3');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const text = target.innerText;
            const targetValue = parseInt(text);
            const suffix = text.replace(/[0-9]/g, '');

            let startValue = 0;
            const duration = 2000;
            const startTime = performance.now();

            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out expo
                const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentValue = Math.floor(easeProgress * targetValue);

                target.innerText = currentValue + suffix;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    target.innerText = targetValue + suffix;
                }
            }

            requestAnimationFrame(animate);
            statsObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 });

statsItems.forEach(stat => statsObserver.observe(stat));

document.addEventListener('DOMContentLoaded', () => {
    // Other initializations can go here
});

console.log('Epoq Zero initialized.');

// Typing Animation Logic
const typingEl = document.querySelector('.typing-text');
if (typingEl) {
    const phrases = [
        'Unlock Smarter CRM',
        'Drive Real Growth',
        'Empower Your Team'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 150;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Faster deleting
        } else {
            typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; // Faster typing
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 1200; // Shorter pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 300; // Shorter pause before restarting
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing
    setTimeout(type, 1000);
}
