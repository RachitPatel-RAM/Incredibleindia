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
    initSearchFilter();
    initLazyLoading();
    initHeroTitleScroll();
    initMobileMenuClose();
});

// Search & Filter feature (non-destructive)
function initSearchFilter() {
    const searchInput = document.getElementById('siteSearch');
    const categorySelect = document.getElementById('searchCategory');
    const clearBtn = document.getElementById('searchClear');
    if (!searchInput || !categorySelect) return;

    const debouncedFilter = debounce(handleFilter, 200);

    searchInput.addEventListener('input', debouncedFilter);
    categorySelect.addEventListener('change', debouncedFilter);
    clearBtn && clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        categorySelect.value = 'all';
        handleFilter();
    });

    // Run once to ensure UI is consistent
    handleFilter();

    function handleFilter() {
        const query = (searchInput.value || '').trim().toLowerCase();
        const category = categorySelect.value;

        // Mapping category -> selector(s)
        const mapping = {
            regions: '.region-card',
            flavors: '.food-card',
            adventure: '.adventure-card',
            festivals: '.festival-slide',
            all: '.region-card, .food-card, .adventure-card, .festival-slide'
        };

        const selectors = mapping[category] || mapping['all'];
        // First, reset all items
        const allItems = document.querySelectorAll('.region-card, .food-card, .adventure-card, .festival-slide');
        allItems.forEach(item => {
            item.classList.remove('muted');
            item.style.display = '';
        });
        // Also restore any carousel-item wrappers that may have been hidden by previous searches
        const carouselItems = document.querySelectorAll('#festivalsCarousel .carousel-item');
        carouselItems.forEach(ci => {
            ci.style.display = '';
        });
        // Ensure the carousel container is visible again
        const festivalCarousel = document.getElementById('festivalsCarousel');
        if (festivalCarousel) festivalCarousel.style.display = '';

        if (!query) return; // empty query -> show everything

        // For each selected group, hide those that don't match query
        const items = document.querySelectorAll(selectors);
        const lowerQuery = query.toLowerCase();

        // Helper to get text to match from an element
        const getTextFor = (el) => {
            // Prefer titles inside overlay/h3/h4
            const h4 = el.querySelector('h4');
            if (h4 && h4.textContent) return h4.textContent.toLowerCase();
            const h3 = el.querySelector('h3');
            if (h3 && h3.textContent) return h3.textContent.toLowerCase();
            return (el.textContent || '').toLowerCase();
        };

    // First mark all as muted, then unmute matches so that non-matching areas are visually de-emphasized
    allItems.forEach(item => item.classList.add('muted'));

        let anyMatchInSection = false;
        items.forEach(item => {
            const text = getTextFor(item);
            if (text.indexOf(lowerQuery) !== -1) {
                // match -> unmute and ensure visible
                item.classList.remove('muted');
                item.style.display = '';
                anyMatchInSection = true;
            } else {
                // keep muted; leave in document for layout but de-emphasized
                // For festival slides (carousel items), hide the carousel-item when not matching so carousel doesn't show empty slides
                if (item.classList.contains('festival-slide')) {
                    // festival-slide inside carousel-item -> hide wrapper so carousel doesn't show empty slides
                    const carouselItem = item.closest('.carousel-item');
                    if (carouselItem) carouselItem.style.display = 'none';
                }
            }
        });

        // If filtering festivals only and none matched, leave a subtle notification
        if (category === 'festivals') {
            const carousel = document.getElementById('festivalsCarousel');
            if (carousel) {
                const anyVisible = Array.from(carousel.querySelectorAll('.carousel-item')).some(ci => ci.style.display !== 'none');
                // If none visible, hide the whole carousel container to avoid empty controls
                carousel.style.display = anyVisible ? '' : 'none';
            }
        }
    }
}



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

// Mobile Menu Auto-Close
function initMobileMenuClose() {
    const navbarCollapse = document.querySelector('#navbarNav');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // Close mobile menu when any navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Check if the navbar is currently expanded (mobile menu is open)
            if (navbarCollapse.classList.contains('show')) {
                // Use Bootstrap's collapse method to close the menu
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    });
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

// Travel Quiz Functionality
let currentQuestionIndex = 0;
let userAnswers = [];
let quizQuestions = [
    {
        question: "What type of vacation experience are you looking for?",
        options: [
            { text: "Adventure and thrill", value: "adventure" },
            { text: "Cultural and historical exploration", value: "culture" },
            { text: "Relaxation and beaches", value: "beach" },
            { text: "Spiritual and peaceful retreat", value: "spiritual" }
        ]
    },
    {
        question: "What's your preferred climate?",
        options: [
            { text: "Cool and mountainous", value: "mountain" },
            { text: "Tropical and warm", value: "tropical" },
            { text: "Desert and dry", value: "desert" },
            { text: "Moderate and pleasant", value: "moderate" }
        ]
    },
    {
        question: "Which activity interests you most?",
        options: [
            { text: "Trekking and hiking", value: "trekking" },
            { text: "Visiting temples and monuments", value: "monuments" },
            { text: "Water sports and beach activities", value: "watersports" },
            { text: "Photography and sightseeing", value: "photography" }
        ]
    },
    {
        question: "What's your ideal accommodation?",
        options: [
            { text: "Luxury resort or palace hotel", value: "luxury" },
            { text: "Heritage homestay", value: "heritage" },
            { text: "Beach resort", value: "beachresort" },
            { text: "Mountain lodge or camp", value: "lodge" }
        ]
    },
    {
        question: "Which cuisine excites you most?",
        options: [
            { text: "Spicy Rajasthani food", value: "rajasthani" },
            { text: "South Indian delicacies", value: "southindian" },
            { text: "Seafood and coastal cuisine", value: "seafood" },
            { text: "Street food and local snacks", value: "streetfood" }
        ]
    },
    {
        question: "How do you prefer to travel?",
        options: [
            { text: "Royal train journeys", value: "train" },
            { text: "Road trips and driving", value: "road" },
            { text: "Boat rides and cruises", value: "boat" },
            { text: "Domestic flights for convenience", value: "flight" }
        ]
    },
    {
        question: "What's your budget range?",
        options: [
            { text: "Luxury (₹50,000+ per person)", value: "luxury" },
            { text: "Premium (₹25,000-50,000 per person)", value: "premium" },
            { text: "Moderate (₹15,000-25,000 per person)", value: "moderate" },
            { text: "Budget (Under ₹15,000 per person)", value: "budget" }
        ]
    },
    {
        question: "When do you prefer to travel?",
        options: [
            { text: "Winter (December-February)", value: "winter" },
            { text: "Summer (March-May)", value: "summer" },
            { text: "Monsoon (June-September)", value: "monsoon" },
            { text: "Post-monsoon (October-November)", value: "postmonsoon" }
        ]
    }
];

let destinations = {
    rajasthan: {
        name: "Rajasthan - Land of Kings",
        description: "Experience royal heritage, magnificent palaces, and desert adventures in the land of maharajas. Perfect for those seeking luxury, culture, and desert experiences.",
        highlights: [
            { icon: "🏰", title: "Royal Palaces", desc: "Stay in converted palace hotels" },
            { icon: "🐪", title: "Desert Safari", desc: "Camel rides in Thar Desert" },
            { icon: "🎭", title: "Folk Culture", desc: "Traditional music and dance" },
            { icon: "🍛", title: "Royal Cuisine", desc: "Authentic Rajasthani delicacies" }
        ],
        bestTime: "October to March",
        duration: "7-10 days"
    },
    kerala: {
        name: "Kerala - God's Own Country",
        description: "Discover tropical backwaters, lush hill stations, and pristine beaches. Ideal for relaxation, nature lovers, and those seeking peaceful retreats.",
        highlights: [
            { icon: "🛶", title: "Backwaters", desc: "Houseboat cruises in Alleppey" },
            { icon: "🌴", title: "Hill Stations", desc: "Tea plantations in Munnar" },
            { icon: "🏖️", title: "Beaches", desc: "Pristine coastline of Kovalam" },
            { icon: "💆", title: "Ayurveda", desc: "Traditional wellness treatments" }
        ],
        bestTime: "September to March",
        duration: "5-8 days"
    },
    ladakh: {
        name: "Ladakh - Little Tibet",
        description: "Adventure in the high-altitude desert with stunning landscapes, monasteries, and thrilling activities. Perfect for adventure seekers and nature enthusiasts.",
        highlights: [
            { icon: "🏔️", title: "High Altitude", desc: "Breathtaking mountain landscapes" },
            { icon: "🏍️", title: "Bike Tours", desc: "Epic motorcycle journeys" },
            { icon: "🕌", title: "Monasteries", desc: "Ancient Buddhist temples" },
            { icon: "⭐", title: "Stargazing", desc: "Clear night skies" }
        ],
        bestTime: "May to September",
        duration: "6-9 days"
    },
    goa: {
        name: "Goa - Beach Paradise",
        description: "Relax on golden beaches, enjoy water sports, and experience vibrant nightlife. Perfect for beach lovers, party enthusiasts, and water sports fans.",
        highlights: [
            { icon: "🏖️", title: "Beaches", desc: "Golden sand beaches" },
            { icon: "🏄", title: "Water Sports", desc: "Surfing, parasailing, diving" },
            { icon: "🎉", title: "Nightlife", desc: "Beach parties and clubs" },
            { icon: "🍤", title: "Seafood", desc: "Fresh coastal cuisine" }
        ],
        bestTime: "November to February",
        duration: "4-6 days"
    },
    himachal: {
        name: "Himachal Pradesh - Land of Gods",
        description: "Experience snow-capped mountains, adventure sports, and hill station charm. Ideal for adventure lovers, honeymooners, and mountain enthusiasts.",
        highlights: [
            { icon: "⛷️", title: "Adventure Sports", desc: "Skiing, paragliding, trekking" },
            { icon: "🏔️", title: "Hill Stations", desc: "Shimla, Manali, Dharamshala" },
            { icon: "❄️", title: "Snow Activities", desc: "Winter sports and snow fun" },
            { icon: "🏛️", title: "Temples", desc: "Ancient mountain temples" }
        ],
        bestTime: "March to June, September to November",
        duration: "5-8 days"
    },
    uttarpradesh: {
        name: "Uttar Pradesh - Heart of India",
        description: "Explore the cultural and spiritual heart of India with iconic monuments, holy cities, and rich heritage. Perfect for culture enthusiasts and spiritual seekers.",
        highlights: [
            { icon: "🕌", title: "Taj Mahal", desc: "Wonder of the world in Agra" },
            { icon: "🛕", title: "Varanasi", desc: "Spiritual capital of India" },
            { icon: "🏛️", title: "Heritage", desc: "Mughal and ancient architecture" },
            { icon: "🎭", title: "Culture", desc: "Classical music and arts" }
        ],
        bestTime: "October to March",
        duration: "6-10 days"
    },
    northeast: {
        name: "Northeast India - Seven Sisters",
        description: "Discover untouched natural beauty, unique tribal cultures, and biodiversity. Perfect for offbeat travelers, nature lovers, and cultural explorers.",
        highlights: [
            { icon: "🌿", title: "Biodiversity", desc: "Unique flora and fauna" },
            { icon: "🎭", title: "Tribal Culture", desc: "Indigenous traditions" },
            { icon: "🏞️", title: "Natural Beauty", desc: "Pristine landscapes" },
            { icon: "🦋", title: "Wildlife", desc: "Rare species and sanctuaries" }
        ],
        bestTime: "October to April",
        duration: "7-12 days"
    },
    tamilnadu: {
        name: "Tamil Nadu - Temple Land",
        description: "Immerse in Dravidian culture, magnificent temples, and classical arts. Ideal for history buffs, culture enthusiasts, and spiritual travelers.",
        highlights: [
            { icon: "🏛️", title: "Temples", desc: "Ancient Dravidian architecture" },
            { icon: "🎭", title: "Classical Arts", desc: "Bharatanatyam and music" },
            { icon: "🏖️", title: "Hill Stations", desc: "Ooty and Kodaikanal" },
            { icon: "🍛", title: "Cuisine", desc: "Authentic South Indian food" }
        ],
        bestTime: "November to February",
        duration: "6-9 days"
    }
};

function startQuiz() {
    document.getElementById('quiz-start').style.display = 'none';
    document.getElementById('quiz-questions').style.display = 'block';
    document.getElementById('total-questions').textContent = quizQuestions.length;
    currentQuestionIndex = 0;
    userAnswers = [];
    showQuestion();
}

function showQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';
        optionDiv.innerHTML = `
            <input type="radio" name="question${currentQuestionIndex}" value="${option.value}" id="option${index}">
            <label for="option${index}">${option.text}</label>
        `;
        optionDiv.addEventListener('click', () => selectOption(optionDiv, option.value));
        optionsContainer.appendChild(optionDiv);
    });
    
    updateProgress();
    document.getElementById('next-btn').disabled = true;
}

function selectOption(optionDiv, value) {
    // Remove previous selection
    document.querySelectorAll('.option-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Add selection to clicked option
    optionDiv.classList.add('selected');
    optionDiv.querySelector('input').checked = true;
    
    // Store answer
    userAnswers[currentQuestionIndex] = value;
    
    // Enable next button
    document.getElementById('next-btn').disabled = false;
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    document.querySelector('.progress-bar').style.width = progress + '%';
}

function showResult() {
    document.getElementById('quiz-questions').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    
    const recommendedDestination = calculateDestination();
    const destination = destinations[recommendedDestination];
    
    const resultContent = document.getElementById('result-content');
    resultContent.innerHTML = `
        <div class="result-destination">
            <h4>${destination.name}</h4>
            <p>${destination.description}</p>
            <div class="result-highlights">
                ${destination.highlights.map(highlight => `
                    <div class="highlight-item">
                        <span class="icon">${highlight.icon}</span>
                        <h6>${highlight.title}</h6>
                        <p>${highlight.desc}</p>
                    </div>
                `).join('')}
            </div>
            <div class="mt-3">
                <p><strong>Best Time to Visit:</strong> ${destination.bestTime}</p>
                <p><strong>Recommended Duration:</strong> ${destination.duration}</p>
            </div>
        </div>
    `;
}

function calculateDestination() {
    const scores = {
        rajasthan: 0,
        kerala: 0,
        ladakh: 0,
        goa: 0,
        himachal: 0,
        uttarpradesh: 0,
        northeast: 0,
        tamilnadu: 0
    };
    
    userAnswers.forEach((answer, index) => {
        switch(index) {
            case 0: // Experience type
                if (answer === 'adventure') {
                    scores.ladakh += 3;
                    scores.himachal += 3;
                    scores.northeast += 2;
                } else if (answer === 'culture') {
                    scores.rajasthan += 3;
                    scores.uttarpradesh += 3;
                    scores.tamilnadu += 3;
                } else if (answer === 'beach') {
                    scores.goa += 3;
                    scores.kerala += 2;
                } else if (answer === 'spiritual') {
                    scores.uttarpradesh += 3;
                    scores.kerala += 2;
                    scores.tamilnadu += 2;
                }
                break;
            case 1: // Climate
                if (answer === 'mountain') {
                    scores.ladakh += 3;
                    scores.himachal += 3;
                    scores.northeast += 2;
                } else if (answer === 'tropical') {
                    scores.kerala += 3;
                    scores.goa += 2;
                    scores.tamilnadu += 2;
                } else if (answer === 'desert') {
                    scores.rajasthan += 3;
                    scores.ladakh += 2;
                } else if (answer === 'moderate') {
                    scores.himachal += 2;
                    scores.uttarpradesh += 2;
                    scores.northeast += 2;
                }
                break;
            case 2: // Activities
                if (answer === 'trekking') {
                    scores.ladakh += 3;
                    scores.himachal += 3;
                    scores.northeast += 2;
                } else if (answer === 'monuments') {
                    scores.rajasthan += 3;
                    scores.uttarpradesh += 3;
                    scores.tamilnadu += 3;
                } else if (answer === 'watersports') {
                    scores.goa += 3;
                    scores.kerala += 2;
                } else if (answer === 'photography') {
                    scores.ladakh += 2;
                    scores.kerala += 2;
                    scores.northeast += 3;
                }
                break;
            case 3: // Accommodation
                if (answer === 'luxury') {
                    scores.rajasthan += 3;
                    scores.kerala += 2;
                    scores.goa += 2;
                } else if (answer === 'heritage') {
                    scores.rajasthan += 3;
                    scores.uttarpradesh += 2;
                    scores.tamilnadu += 2;
                } else if (answer === 'beachresort') {
                    scores.goa += 3;
                    scores.kerala += 2;
                } else if (answer === 'lodge') {
                    scores.ladakh += 3;
                    scores.himachal += 3;
                    scores.northeast += 2;
                }
                break;
            case 4: // Cuisine
                if (answer === 'rajasthani') {
                    scores.rajasthan += 3;
                } else if (answer === 'southindian') {
                    scores.kerala += 3;
                    scores.tamilnadu += 3;
                } else if (answer === 'seafood') {
                    scores.goa += 3;
                    scores.kerala += 2;
                } else if (answer === 'streetfood') {
                    scores.uttarpradesh += 2;
                    scores.rajasthan += 2;
                    scores.tamilnadu += 2;
                }
                break;
            case 5: // Travel mode
                if (answer === 'train') {
                    scores.rajasthan += 2;
                    scores.uttarpradesh += 2;
                } else if (answer === 'road') {
                    scores.ladakh += 3;
                    scores.himachal += 2;
                    scores.northeast += 2;
                } else if (answer === 'boat') {
                    scores.kerala += 3;
                    scores.goa += 2;
                } else if (answer === 'flight') {
                    scores.northeast += 2;
                    scores.ladakh += 2;
                }
                break;
            case 6: // Budget
                if (answer === 'luxury') {
                    scores.rajasthan += 2;
                    scores.kerala += 2;
                } else if (answer === 'premium') {
                    scores.goa += 2;
                    scores.himachal += 2;
                } else if (answer === 'moderate') {
                    scores.uttarpradesh += 2;
                    scores.tamilnadu += 2;
                } else if (answer === 'budget') {
                    scores.northeast += 2;
                    scores.ladakh += 1;
                }
                break;
            case 7: // Season
                if (answer === 'winter') {
                    scores.rajasthan += 2;
                    scores.goa += 3;
                    scores.kerala += 2;
                } else if (answer === 'summer') {
                    scores.ladakh += 3;
                    scores.himachal += 3;
                } else if (answer === 'monsoon') {
                    scores.kerala += 2;
                    scores.northeast += 3;
                } else if (answer === 'postmonsoon') {
                    scores.uttarpradesh += 2;
                    scores.tamilnadu += 2;
                }
                break;
        }
    });
    
    // Find destination with highest score
    let maxScore = 0;
    let recommendedDestination = 'rajasthan';
    
    for (let destination in scores) {
        if (scores[destination] > maxScore) {
            maxScore = scores[destination];
            recommendedDestination = destination;
        }
    }
    
    return recommendedDestination;
}

function restartQuiz() {
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('quiz-start').style.display = 'block';
    currentQuestionIndex = 0;
    userAnswers = [];
}
