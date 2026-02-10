// ================================================================
// CODEAAYU CREATIVES - PROFESSIONAL PORTFOLIO
// JavaScript for interactions and animations
// ================================================================

'use strict';

// ================================================================
// INITIALIZATION
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    initLoader();
    initNavigation();
    initScrollReveal();
    initBackToTop();
    initGallery();
    initContactForm();
    initSmoothScroll();
    initHeaderScroll();
    initCurrentYear();
});

// ================================================================
// LOADING SCREEN
// ================================================================
function initLoader() {
    const loading = document.getElementById('loading');

    if (!loading) return;

    window.addEventListener('load', function() {
        setTimeout(function() {
            loading.classList.add('hidden');
            document.body.style.overflow = '';
        }, 600);
    });

    // Fallback - hide loader after 3 seconds max
    setTimeout(function() {
        if (loading && !loading.classList.contains('hidden')) {
            loading.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }, 3000);
}

// ================================================================
// HEADER SCROLL EFFECT
// ================================================================
function initHeaderScroll() {
    const header = document.getElementById('header');

    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.scrollY;

        // Add scrolled class when past 50px
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ================================================================
// NAVIGATION
// ================================================================
function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// ================================================================
// SCROLL REVEAL ANIMATIONS
// ================================================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length === 0) return;

    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: stop observing after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// ================================================================
// BACK TO TOP BUTTON
// ================================================================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');

    if (!backToTop) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ================================================================
// PHOTOGRAPHY GALLERY
// ================================================================
function initGallery() {
    initFilterGroup('.gallery-filters', '.gallery-item');
    initFilterGroup('.work-filters', '.work-item');

    // Lightbox functionality
    initLightbox();
}

function initFilterGroup(groupSelector, itemSelector) {
    const filterGroup = document.querySelector(groupSelector);
    const items = document.querySelectorAll(itemSelector);
    if (!filterGroup || items.length === 0) return;

    const filterBtns = filterGroup.querySelectorAll('.filter-btn');
    if (filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            items.forEach(item => {
                const category = item.getAttribute('data-category');
                const shouldShow = filterValue === 'all' || category === filterValue;

                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';

                if (shouldShow) {
                    setTimeout(() => {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    }, 200);
                } else {
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 200);
                }
            });
        });
    });
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!lightbox || galleryItems.length === 0) return;

    let currentIndex = 0;
    let visibleItems = [];

    function updateVisibleItems() {
        visibleItems = Array.from(galleryItems).filter(item =>
            item.style.display !== 'none'
        );
    }

    function openLightbox(index) {
        updateVisibleItems();
        currentIndex = index;

        const item = visibleItems[currentIndex];
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-item-overlay');

        // Convert thumbnail path to full image path
        // thumbnails are in: images/thumbnails/portfolio/
        // full images are in: images/portfolio/
        let fullImageSrc = img.src.replace('/thumbnails/portfolio/', '/portfolio/');

        lightboxImg.src = fullImageSrc;
        lightboxCaption.textContent = overlay ? overlay.querySelector('h3')?.textContent || '' : '';

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrev() {
        updateVisibleItems();
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        openLightbox(currentIndex);
    }

    function showNext() {
        updateVisibleItems();
        currentIndex = (currentIndex + 1) % visibleItems.length;
        openLightbox(currentIndex);
    }

    // Click on gallery item to open
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            updateVisibleItems();
            const visibleIndex = visibleItems.indexOf(item);
            if (visibleIndex !== -1) {
                openLightbox(visibleIndex);
            }
        });
    });

    // Close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Navigation buttons
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function(e) {
            e.stopPropagation();
            showPrev();
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', function(e) {
            e.stopPropagation();
            showNext();
        });
    }

    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
}

// ================================================================
// CONTACT FORM - Web3Forms Integration
// ================================================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonHtml = submitButton.innerHTML;

        // Show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });

            const data = await response.json();

            if (data.success) {
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
            } else {
                showNotification('Oops! Something went wrong. Please try again.', 'error');
                console.error('Form submission error:', data);
            }
        } catch (error) {
            showNotification('Oops! Something went wrong. Please try again.', 'error');
            console.error('Form submission error:', error);
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonHtml;
        }
    });
}

// ================================================================
// NOTIFICATION SYSTEM
// ================================================================
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="ri-${type === 'success' ? 'check-line' : 'close-line'}"></i>
            <span>${message}</span>
        </div>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--color-gold)' : '#dc2626'};
        color: ${type === 'success' ? 'var(--color-ink)' : 'white'};
        padding: 1rem 1.5rem;
        border-radius: 4px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: notificationSlideIn 0.4s var(--ease-out);
        font-family: var(--font-body);
        font-size: 0.9rem;
        font-weight: 500;
        max-width: 90vw;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'notificationSlideOut 0.4s var(--ease-in)';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes notificationSlideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes notificationSlideOut {
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
        align-items: center;
        gap: 0.75rem;
    }

    .notification-content i {
        font-size: 1.25rem;
    }
`;
document.head.appendChild(notificationStyles);

// ================================================================
// SMOOTH SCROLL
// ================================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ================================================================
// YEAR IN FOOTER
// ================================================================
function initCurrentYear() {
    const currentYearNodes = document.querySelectorAll('.current-year');
    if (currentYearNodes.length === 0) return;

    const currentYear = String(new Date().getFullYear());
    currentYearNodes.forEach(node => {
        node.textContent = currentYear;
    });
}

// ================================================================
// PARALLAX EFFECT FOR HERO (Desktop only)
// ================================================================
window.addEventListener('scroll', function() {
    if (window.innerWidth <= 768) return;

    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero');
    const pageHeader = document.querySelector('.page-header');

    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }

    if (pageHeader && scrolled < window.innerHeight) {
        pageHeader.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ================================================================
// LAZY LOADING IMAGES
// ================================================================
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        }
    });
}, {
    rootMargin: '50px 0px'
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ================================================================
// DEBOUNCE UTILITY
// ================================================================
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

// ================================================================
// CONSOLE MESSAGE
// ================================================================
console.log('%c CodeAayu Creatives ', 'background: #c9a962; color: #1a1a1a; font-size: 1.5rem; font-weight: bold; padding: 0.5rem 1rem; border-radius: 4px;');
console.log('%cPhotography & Visual Storytelling', 'font-size: 1rem; color: #666; margin-top: 0.5rem;');
console.log('%cInterested in working together?', 'font-size: 0.9rem; color: #888;');
console.log('%ccodeaayu@gmail.com', 'font-size: 0.9rem; color: #c9a962; font-weight: bold;');
