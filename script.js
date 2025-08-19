// JavaScript for Incredible India Tourism Website

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap components
    if (typeof bootstrap !== 'undefined') {
        // Initialize all modals
        const modalElements = document.querySelectorAll('.modal');
        modalElements.forEach(modalEl => {
            new bootstrap.Modal(modalEl, {
                backdrop: true,
                keyboard: true,
                focus: true
            });
        });
    }
    
    // Initialize magical effects
    initMagicalEffects();
    initFloatingElements();
    initMagicalCursor();
    
    // Initialize all functions
    initLoader();
    initNavbar();
    initSmoothScrolling();
    initScrollAnimations();
    initTiltEffect();
    initContactForm();
    initParallax();
    initCarousel();
    initLazyLoading();
    initHeroTitleScroll();
});



// Loader Screen Management
function initLoader() {
    const loader = document.getElementById('loader');
    const loaderVideo = document.querySelector('.loader-video');
    if (!loader) return;
    
    const minLoadTime = 5000; // 5 seconds minimum for splash screen
    const startTime = Date.now();
    
    // Ensure video plays
    if (loaderVideo) {
        loaderVideo.muted = true;
        loaderVideo.autoplay = true;
        loaderVideo.loop = true;
        
        // Try to play the video
        const playPromise = loaderVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Video autoplay failed:', error);
                // Video will still show as background with fallback gradient
            });
        }
    }
    
    // Check if page is fully loaded
    function hideLoader() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - elapsedTime);
        
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            document.body.style.overflow = 'auto';
        }, remainingTime);
    }
    
    // Hide loader when page is fully loaded or after minimum time
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }
    
    // Prevent scrolling while loader is active
    document.body.style.overflow = 'hidden';
}

// Navbar Scroll Effect
function initNavbar() {
    const navbar = document.getElementById('mainNavbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const heroButton = document.querySelector('.btn-hero[href^="#"]');
    
    function smoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for navbar height
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    if (heroButton) {
        heroButton.addEventListener('click', smoothScroll);
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add fade-in class to elements that should animate
    const animateElements = document.querySelectorAll('.region-card, .food-card, .adventure-card, .contact-form');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// 3D Tilt Effect for Adventure Cards
function initTiltEffect() {
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.1s ease';
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.3s ease';
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('.btn-contact');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00A86B' : type === 'error' ? '#DC143C' : '#006994'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.7;
    }
`;
document.head.appendChild(notificationStyles);

// Parallax Effect
function initParallax() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-section');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Enhanced Carousel Functionality
function initCarousel() {
    const carousel = document.getElementById('festivalsCarousel');
    
    if (carousel) {
        // Auto-play carousel
        const carouselInstance = new bootstrap.Carousel(carousel, {
            interval: 5000,
            wrap: true,
            pause: 'hover'
        });
        
        // Add touch/swipe support for mobile
        let startX = 0;
        let endX = 0;
        
        carousel.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        carousel.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const threshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    carouselInstance.next();
                } else {
                    carouselInstance.prev();
                }
            }
        }
    }
}

// Modal Enhancement
document.addEventListener('shown.bs.modal', function(e) {
    const modal = e.target;
    const modalBody = modal.querySelector('.modal-body');
    
    // Add entrance animation
    modalBody.style.animation = 'fadeInUp 0.3s ease';
});

// Enhanced Modal functionality with proper Bootstrap integration
function initModalEnhancements() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        // Add magical entrance animation
        modal.addEventListener('show.bs.modal', function(e) {
            const modalDialog = this.querySelector('.modal-dialog');
            if (modalDialog) {
                modalDialog.style.transform = 'scale(0.7) translateY(-50px)';
                modalDialog.style.opacity = '0';
                
                setTimeout(() => {
                    modalDialog.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    modalDialog.style.transform = 'scale(1) translateY(0)';
                    modalDialog.style.opacity = '1';
                }, 50);
            }
        });
        
        // Add magical exit animation
        modal.addEventListener('hide.bs.modal', function(e) {
            const modalDialog = this.querySelector('.modal-dialog');
            if (modalDialog) {
                modalDialog.style.transition = 'all 0.2s ease-out';
                modalDialog.style.transform = 'scale(0.9) translateY(20px)';
                modalDialog.style.opacity = '0';
            }
        });
        
        // Reset styles when modal is completely hidden
        modal.addEventListener('hidden.bs.modal', function(e) {
            const modalDialog = this.querySelector('.modal-dialog');
            if (modalDialog) {
                modalDialog.style.transform = '';
                modalDialog.style.opacity = '';
                modalDialog.style.transition = '';
            }
        });
    });
}

// Initialize modal enhancements
initModalEnhancements();

// Magical Effects System
function initMagicalEffects() {
    // Add glow effects to cards
    const cards = document.querySelectorAll('.region-card, .festival-card, .flavor-card, .adventure-card');
    cards.forEach(card => {
        card.classList.add('glow-effect');
    });
}



// Floating Elements - Disabled
function initFloatingElements() {
    // Floating elements disabled for cleaner UI
    return;
}

// Magical Cursor Effect
function initMagicalCursor() {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        document.body.style.setProperty('--cursor-x', cursorX + 'px');
        document.body.style.setProperty('--cursor-y', cursorY + 'px');
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Show cursor trail on mouse move
    document.addEventListener('mousemove', debounce(() => {
        document.body.style.setProperty('--cursor-opacity', '1');
        setTimeout(() => {
            document.body.style.setProperty('--cursor-opacity', '0');
        }, 500);
    }, 50));
}

// Enhanced scroll animations with magical effects
function initEnhancedScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add magical sparkle effect
                if (entry.target.classList.contains('region-card')) {
                    setTimeout(() => {
                        createSparkleEffect(entry.target);
                    }, 300);
                }
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.scroll-animation').forEach(el => {
        observer.observe(el);
    });
}

// Create sparkle effect
function createSparkleEffect(element) {
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.fontSize = '20px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animation = 'sparkleFloat 2s ease-out forwards';
        
        element.style.position = 'relative';
        element.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 2000);
    }
}

// Initialize enhanced scroll animations
initEnhancedScrollAnimations();

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('loading');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('loading');
        imageObserver.observe(img);
    });
}

// Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll event
const optimizedScroll = debounce(function() {
    // Any scroll-based animations or effects
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScroll);

// Preload Critical Images
function preloadImages() {
    const criticalImages = [
        'assets/images/Regions/Varanasi.png',
        'assets/images/Regions/himalayan.png',
        'assets/images/Regions/Rajasthani.png',
        'assets/images/Regions/keral.png',
        'assets/images/Regions/goa.png',
        'assets/images/Regions/ladak.png',
        'assets/images/Regions/Tamil.png',
        'assets/images/Regions/norteast.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadImages();

// Hero Title Scroll Animation
function initHeroTitleScroll() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const fadeStart = 0;
        const fadeEnd = windowHeight * 0.5; // Fade out by 50% of viewport height
        
        if (scrollPosition <= fadeStart) {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0) scale(1)';
        } else if (scrollPosition >= fadeEnd) {
            heroTitle.style.opacity = '0';
            heroTitle.style.transform = 'translateY(-30px) scale(0.9)';
        } else {
            const fadeProgress = (scrollPosition - fadeStart) / (fadeEnd - fadeStart);
            const opacity = 1 - fadeProgress;
            const translateY = -30 * fadeProgress;
            const scale = 1 - (0.1 * fadeProgress);
            
            heroTitle.style.opacity = opacity;
            heroTitle.style.transform = `translateY(${translateY}px) scale(${scale})`;
        }
    });
}

// Add active state to navigation based on scroll position
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Add scroll listener for active navigation
window.addEventListener('scroll', debounce(updateActiveNavigation, 100));

// Add CSS for active navigation state
const activeNavStyles = document.createElement('style');
activeNavStyles.textContent = `
    .navbar-nav .nav-link.active {
        background: rgba(255, 215, 0, 0.2);
        color: var(--royal-gold) !important;
    }
`;
document.head.appendChild(activeNavStyles);

// Easter Egg: Konami Code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Add special effects
    document.body.style.animation = 'rainbow 2s ease-in-out';
    showNotification('🎉 Namaste! You found the secret! Welcome to Incredible India! 🇮🇳', 'success');
    
    // Add rainbow animation
    const rainbowStyles = document.createElement('style');
    rainbowStyles.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            25% { filter: hue-rotate(90deg); }
            50% { filter: hue-rotate(180deg); }
            75% { filter: hue-rotate(270deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyles);
    
    setTimeout(() => {
        document.body.style.animation = '';
        rainbowStyles.remove();
    }, 2000);
}

// Add loading states for better UX
function addLoadingStates() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('btn-contact')) return; // Skip contact form button
            
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 1000);
        });
    });
}

// Initialize loading states
addLoadingStates();

// Console welcome message
console.log(`
🇮🇳 Welcome to Incredible India! 🇮🇳

This website showcases the beauty and diversity of India.
Built with love using HTML, CSS, Bootstrap 5, and JavaScript.

Explore the regions, festivals, flavors, and adventures that await!

✨ Namaste! ✨
`);

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            
            if (loadTime > 3000) {
                console.warn('Page load time is high:', loadTime + 'ms');
            }
        }, 0);
    });
}