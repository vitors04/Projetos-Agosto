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

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to elements and observe them
const animatedElements = document.querySelectorAll(`
    .benefit-card,
    .process-step,
    .testimonial-card,
    .technique-card,
    .pricing-card
`);

animatedElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Form submission
document.querySelector('.cta-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    
    if (email) {
        // Simulate form submission
        const button = this.querySelector('button');
        const originalText = button.textContent;
        
        button.textContent = 'Enviando...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = 'Enviado! ✓';
            button.style.background = '#27ae60';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
                this.reset();
            }, 2000);
        }, 1500);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-section');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Counter animation for pricing
const animateCounters = () => {
    const counters = document.querySelectorAll('.amount');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
};

// Trigger counter animation when pricing section is visible
const pricingSection = document.querySelector('.pricing-section');
if (pricingSection) {
    const pricingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                pricingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    pricingObserver.observe(pricingSection);
}

// Add hover effects for cards
document.querySelectorAll('.benefit-card, .testimonial-card, .technique-card, .pricing-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Mobile menu toggle (if needed)
const createMobileMenu = () => {
    const navbar = document.querySelector('.navbar');
    const navMenu = document.querySelector('.nav-menu');
    
    if (window.innerWidth <= 768) {
        if (!document.querySelector('.mobile-menu-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'mobile-menu-toggle';
            toggle.innerHTML = '☰';
            toggle.style.cssText = `
                background: none;
                border: none;
                font-size: 1.5rem;
                color: var(--primary-color);
                cursor: pointer;
                display: block;
            `;
            
            navbar.querySelector('.nav-container').appendChild(toggle);
            
            toggle.addEventListener('click', () => {
                navMenu.classList.toggle('mobile-active');
            });
        }
    }
};

window.addEventListener('resize', createMobileMenu);
createMobileMenu();
