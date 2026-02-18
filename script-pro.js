// ========================================
// PORTFOLIO PROFESSIONNEL - JavaScript QoL
// ========================================

// Configuration
const CONFIG = {
    typewriterTexts: [
        'Technicien Systèmes & Réseaux',
        'Passionné de Cybersécurité',
        'Administrateur Réseau en formation',
        'Support IT Multi-environnement'
    ],
    typewriterSpeed: 100,
    typewriterDelay: 2000
};

// ========================================
// 1. BARRE DE PROGRESSION DE SCROLL
// ========================================
class ScrollProgress {
    constructor() {
        this.bar = document.getElementById('scroll-progress');
        this.init();
    }

    init() {
        if (!this.bar) return;
        window.addEventListener('scroll', () => this.update());
    }

    update() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        this.bar.style.width = scrolled + '%';
    }
}

// ========================================
// 2. EFFET TYPEWRITER
// ========================================
class Typewriter {
    constructor(element, texts) {
        this.element = element;
        this.texts = texts;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        if (!this.element) return;
        setTimeout(() => this.type(), 1000);
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? 50 : CONFIG.typewriterSpeed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = CONFIG.typewriterDelay;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ========================================
// 3. COMPTEURS ANIMÉS
// ========================================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.counter');
        this.animated = false;
        this.init();
    }

    init() {
        if (this.counters.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animated = true;
                    this.animateCounters();
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }
}

// ========================================
// 4. BOUTON RETOUR EN HAUT
// ========================================
class BackToTop {
    constructor() {
        this.button = document.getElementById('back-to-top');
        this.init();
    }

    init() {
        if (!this.button) return;
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.button.classList.add('show');
            } else {
                this.button.classList.remove('show');
            }
        });

        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ========================================
// 5. FILTRES DE PROJETS
// ========================================
class ProjectFilter {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.projects = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        if (this.filterBtns.length === 0) return;

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.filter(btn));
        });
    }

    filter(btn) {
        const category = btn.getAttribute('data-category');
        
        // Update active button
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter projects
        this.projects.forEach(project => {
            const projectCategory = project.getAttribute('data-category');
            
            if (category === 'all' || projectCategory === category) {
                project.classList.remove('hidden');
                project.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                project.classList.add('hidden');
            }
        });
    }
}

// ========================================
// 6. COPIER EMAIL
// ========================================
class CopyToClipboard {
    constructor() {
        this.copyBtns = document.querySelectorAll('[data-copy]');
        this.init();
    }

    init() {
        this.copyBtns.forEach(btn => {
            btn.addEventListener('click', () => this.copy(btn));
        });
    }

    copy(btn) {
        const text = btn.getAttribute('data-copy');
        
        navigator.clipboard.writeText(text).then(() => {
            this.showSuccess(btn);
        }).catch(() => {
            this.showError();
        });
    }

    showSuccess(btn) {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copié !';
        btn.classList.add('copied');
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('copied');
        }, 2000);
        
        this.showToast('Email copié dans le presse-papier !', 'success');
    }

    showError() {
        this.showToast('Erreur lors de la copie', 'error');
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// ========================================
// 7. LAZY LOADING IMAGES
// ========================================
class LazyLoad {
    constructor() {
        this.images = document.querySelectorAll('img[loading="lazy"]');
        this.init();
    }

    init() {
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading supported
            this.images.forEach(img => {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            });
        } else {
            // Fallback for browsers that don't support native lazy loading
            this.lazyLoadFallback();
        }
    }

    lazyLoadFallback() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        this.images.forEach(img => imageObserver.observe(img));
    }
}

// ========================================
// 8. SMOOTH SCROLL AMÉLIORÉ
// ========================================
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#' || href === '') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ========================================
// 9. TÉLÉCHARGER CV
// ========================================
class DownloadCV {
    constructor() {
        this.downloadBtn = document.getElementById('download-cv-btn');
        this.init();
    }

    init() {
        if (!this.downloadBtn) return;
        
        this.downloadBtn.addEventListener('click', () => {
            // Simuler le téléchargement (à remplacer par le vrai fichier CV)
            this.download();
        });
    }

    download() {
        this.downloadBtn.classList.add('loading');
        
        setTimeout(() => {
            this.downloadBtn.classList.remove('loading');
            this.showToast('CV téléchargé avec succès !', 'success');
        }, 1000);
        
        // Code réel pour télécharger le CV :
        // const link = document.createElement('a');
        // link.href = 'path/to/cv.pdf';
        // link.download = 'CV_Seghour_Rayan.pdf';
        // link.click();
    }

    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// ========================================
// 10. EFFET 3D TILT
// ========================================
class TiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.project-card, .about-card, .contact-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleTilt(e, card));
            card.addEventListener('mouseleave', () => this.resetTilt(card));
        });
    }

    handleTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    resetTilt(card) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
}

// ========================================
// 11. ANIMATIONS AU SCROLL
// ========================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-animate]');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-on-scroll');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(el => observer.observe(el));
    }
}

// ========================================
// ANCIENNES FONCTIONS (Conservation)
// ========================================

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu mobile
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Fermer le menu mobile sur clic lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // Navbar scrolled
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // Active link on scroll
    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

// Modals
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on ESC or outside click
document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal.id);
                }
            });
        }
    });
});

// Particules (version optimisée)
class ParticleSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.particleCount = 30; // Réduit pour performance
        this.init();
    }

    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            animation: float ${duration}s ${delay}s infinite;
        `;
        
        this.container.appendChild(particle);
    }
}

// ========================================
// INITIALISATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser toutes les fonctionnalités
    const scrollProgress = new ScrollProgress();
    const typewriter = new Typewriter(
        document.getElementById('typewriter'),
        CONFIG.typewriterTexts
    );
    const counterAnimation = new CounterAnimation();
    const backToTop = new BackToTop();
    const projectFilter = new ProjectFilter();
    const copyToClipboard = new CopyToClipboard();
    const lazyLoad = new LazyLoad();
    const smoothScroll = new SmoothScroll();
    const downloadCV = new DownloadCV();
    const tiltEffect = new TiltEffect();
    const scrollAnimations = new ScrollAnimations();
    const particleSystem = new ParticleSystem('particles');
    
    // Anciennes fonctionnalités
    initNavigation();
    initSkillBars();
    
    console.log('🚀 Portfolio professionnel chargé avec succès !');
});

// Export des fonctions globales
window.scrollToSection = scrollToSection;
window.openModal = openModal;
window.closeModal = closeModal;
