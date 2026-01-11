/* ===================================
   JavaScript - Interactive Features
   =================================== */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTypingAnimation();
    initNavbarScroll();
    initScrollReveal();
    initSkillBars();
    initCounterAnimation();
    initSmoothScroll();
    initMobileMenu();
});

/* ===================================
   Intense Particle Animation Background
   =================================== */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let mouseActive = false;

    // Resize canvas to fit window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        mouseActive = true;
    });

    document.addEventListener('mouseleave', () => {
        mouseActive = false;
    });

    // Particle class with enhanced behavior
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.baseSize = Math.random() * 2.5 + 1;
            this.size = this.baseSize;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
            this.baseOpacity = Math.random() * 0.5 + 0.3;
            this.opacity = this.baseOpacity;
            this.color = Math.random() > 0.6 ? '#8b5cf6' : (Math.random() > 0.5 ? '#06b6d4' : '#d946ef');
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulseOffset = Math.random() * Math.PI * 2;
        }

        update(time) {
            // Base movement
            this.x += this.speedX;
            this.y += this.speedY;

            // Pulsing size effect
            this.size = this.baseSize + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.5;
            this.opacity = this.baseOpacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.15;

            // Mouse interaction - attraction/repulsion
            if (mouseActive) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 200) {
                    const force = (200 - distance) / 200;
                    // Particles are attracted to mouse slightly
                    this.x += dx * force * 0.01;
                    this.y += dy * force * 0.01;
                    // And glow brighter
                    this.opacity = Math.min(1, this.opacity + force * 0.3);
                    this.size = this.baseSize + force * 2;
                }
            }

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            // Glow effect
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
            gradient.addColorStop(0, this.color + '40');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fill();

            // Core particle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
        }
    }

    // Create MORE particles for intense effect
    const particleCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 10000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Draw connections between nearby particles with glow
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 180) {
                    const opacity = (1 - distance / 180) * 0.4;

                    // Draw glowing line
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                    ctx.lineWidth = 1 + (1 - distance / 180) * 1.5;
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = '#8b5cf6';
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
            }
        }
    }

    // Draw mouse glow trail
    function drawMouseGlow() {
        if (mouseActive) {
            const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 150);
            gradient.addColorStop(0, 'rgba(139, 92, 246, 0.15)');
            gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.08)');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 150, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Animation loop
    let time = 0;
    function animate() {
        time += 16;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawMouseGlow();

        particles.forEach(particle => {
            particle.update(time);
            particle.draw();
        });

        drawConnections();
        ctx.globalAlpha = 1;

        requestAnimationFrame(animate);
    }

    animate();
}


/* ===================================
   Typing Animation
   =================================== */
function initTypingAnimation() {
    const element = document.getElementById('typing-text');
    const texts = [
        'AI Architecture Engineer',
        'LLM Specialist',
        'RAG Expert',
        'Multi-Agent Architect',
        'Deep Learning Engineer'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}

/* ===================================
   Navbar Scroll Effect
   =================================== */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ===================================
   Enhanced Scroll Reveal Animation
   =================================== */
function initScrollReveal() {
    // Get all reveal elements (already have reveal class in HTML)
    const revealElements = document.querySelectorAll('.reveal');

    // Create intersection observer with staggered reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add slight delay based on element position for staggered effect
                const delay = entry.target.style.getPropertyValue('--reveal-delay') || '0s';

                setTimeout(() => {
                    entry.target.classList.add('active');
                }, parseFloat(delay) * 1000);

                // Once revealed, don't re-observe
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });

    // Observe all reveal elements
    revealElements.forEach(el => observer.observe(el));

    // Add scroll progress indicator
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    // Update scroll progress on scroll
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / scrollHeight);
        scrollProgress.style.transform = `scaleX(${scrolled})`;
    });

    // Parallax effect for floating shapes
    const shapes = document.querySelectorAll('.shape');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        shapes.forEach((shape, i) => {
            const speed = 0.1 + (i * 0.05);
            shape.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.02}deg)`;
        });
    });
}


/* ===================================
   Skill Bars Animation
   =================================== */
function initSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = entry.target.getAttribute('data-skill');
                const progressBar = entry.target.querySelector('.skill-progress');

                setTimeout(() => {
                    progressBar.style.width = skillLevel + '%';
                }, 300);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    skillItems.forEach(item => observer.observe(item));
}

/* ===================================
   Counter Animation
   =================================== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        entry.target.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.textContent = target;
                    }
                };

                updateCounter();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => observer.observe(counter));
}

/* ===================================
   Smooth Scroll
   =================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile menu if open
                document.querySelector('.nav-links').classList.remove('active');
            }
        });
    });
}

/* ===================================
   Mobile Menu
   =================================== */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });
}

/* ===================================
   3D Card Tilt Effect (Optional)
   =================================== */
document.querySelectorAll('.project-card, .skill-category').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

/* ===================================
   Console Easter Egg
   =================================== */
console.log(`
%c👋 Hi there, curious developer!

%cI'm Jimmy Liu - an AI Architecture Engineer who loves building intelligent systems.

Check out my work:
🔗 GitHub: github.com/Jimmynycu
🔗 LinkedIn: linkedin.com/in/jimmyliu2025

Let's build something amazing together! 🚀
`,
    'font-size: 20px; font-weight: bold;',
    'font-size: 14px; color: #8b5cf6;'
);
