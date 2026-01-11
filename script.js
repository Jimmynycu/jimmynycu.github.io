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
   GitHub Repos - Auto-Update from API
   =================================== */
function initGitHubRepos() {
    const GITHUB_USERNAME = 'Jimmynycu';
    const reposGrid = document.getElementById('repos-grid');

    if (!reposGrid) return;

    const languageColors = {
        'Python': '#3572A5',
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'Java': '#b07219',
        'C++': '#f34b7d',
        'C': '#555555',
        'Shell': '#89e051',
        'Jupyter Notebook': '#DA5B0B'
    };

    fetch('https://api.github.com/users/' + GITHUB_USERNAME + '/repos?sort=updated&per_page=6')
        .then(function (response) {
            if (!response.ok) throw new Error('Failed to fetch');
            return response.json();
        })
        .then(function (repos) {
            var filteredRepos = repos.filter(function (repo) {
                return !repo.fork && repo.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase() + '.github.io';
            }).slice(0, 6);

            if (filteredRepos.length === 0) {
                reposGrid.innerHTML = '<div class="repos-error"><p>No public repositories found yet.</p></div>';
                return;
            }

            var html = '';
            filteredRepos.forEach(function (repo, index) {
                var langColor = languageColors[repo.language] || '#8b5cf6';
                var langHtml = repo.language ?
                    '<span class="repo-meta-item"><span class="repo-language-dot" style="background:' + langColor + '"></span>' + repo.language + '</span>' : '';

                html += '<div class="repo-card reveal reveal-up" style="--reveal-delay:' + (0.1 * (index + 1)) + 's">' +
                    '<div class="repo-header">' +
                    '<h3 class="repo-name"><svg viewBox="0 0 16 16" fill="currentColor" width="18" height="18"><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/></svg>' + repo.name + '</h3>' +
                    '<span class="repo-visibility">' + (repo.private ? 'Private' : 'Public') + '</span>' +
                    '</div>' +
                    '<p class="repo-description">' + (repo.description || 'No description available') + '</p>' +
                    '<div class="repo-meta">' + langHtml +
                    '<span class="repo-meta-item"><svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/></svg>' + repo.stargazers_count + '</span>' +
                    '<span class="repo-meta-item"><svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v2.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013 6.25v-.878a2.25 2.25 0 111.5 0zM5 3.25a.75.75 0 10-1.5 0 .75.75 0 001.5 0zm6.75.75a.75.75 0 100-1.5.75.75 0 000 1.5zm-3 8.75a.75.75 0 10-1.5 0 .75.75 0 001.5 0z"/></svg>' + repo.forks_count + '</span>' +
                    '</div>' +
                    '<a href="' + repo.html_url + '" class="repo-link" target="_blank" rel="noopener">View Repository <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16"><path d="M8.22 2.97a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06l2.97-2.97H3.75a.75.75 0 010-1.5h7.44L8.22 4.03a.75.75 0 010-1.06z"/></svg></a>' +
                    '</div>';
            });

            reposGrid.innerHTML = html;

            // Re-init reveal animations
            var newCards = reposGrid.querySelectorAll('.reveal');
            setTimeout(function () {
                newCards.forEach(function (card) {
                    card.classList.add('active');
                });
            }, 100);
        })
        .catch(function (error) {
            console.error('Error fetching repos:', error);
            reposGrid.innerHTML = '<div class="repos-error"><p>Unable to load repositories. Visit my GitHub directly.</p></div>';
        });
}

// Initialize GitHub repos on page load
document.addEventListener('DOMContentLoaded', initGitHubRepos);

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
