// ================================================================
// CODEAAYU CREATIVES V2.0 - JAVASCRIPT
// Modern interactions, animations, and functionality
// ================================================================

'use strict';

// ================================================================
// INITIALIZATION
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    initLoader();
    initNavigation();
    initThemeToggle();
    initScrollAnimations();
    initBackToTop();
    initWorkFilter();
    initContactForm();
    initSmoothScroll();
});

// ================================================================
// LOADING SCREEN
// ================================================================
function initLoader() {
    // Try both old and new loader structures
    const loaderWrapper = document.getElementById('loader') || document.querySelector('.loader-wrapper');
    const loader = document.querySelector('.loader');

    window.addEventListener('load', function() {
        setTimeout(function() {
            if (loaderWrapper) {
                loaderWrapper.classList.add('hidden');
            }
            if (loader) {
                loader.classList.add('hidden');
            }
        }, 800);
    });
}

// ================================================================
// NAVIGATION
// ================================================================
function initNavigation() {
    // Support both old and new navigation structures
    const nav = document.getElementById('mainNav') || document.querySelector('.navbar') || document.querySelector('.nav');
    const navToggle = document.getElementById('navToggle') || document.querySelector('.mobile-toggle') || document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('navMenu') || document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    if (nav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Active dropdown link on scroll (only for index page sections)
    const sections = document.querySelectorAll('section[id]');
    const dropdownLinks = document.querySelectorAll('.dropdown-link');

    if (sections.length > 0 && dropdownLinks.length > 0) {
        window.addEventListener('scroll', function() {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            // Only update dropdown links, not main nav links
            dropdownLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href && href.includes('#' + current)) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Close mobile menu on link click (but not dropdown toggle)
    if (navToggle && navMenu) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Don't close menu if this is a dropdown toggle on mobile
                const isDropdownToggle = this.parentElement.classList.contains('has-dropdown');
                if (window.innerWidth <= 768 && isDropdownToggle) {
                    return; // Let the dropdown toggle handler handle this
                }
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Mobile dropdown toggle
    const dropdownToggles = document.querySelectorAll('.nav-item.has-dropdown > .nav-link');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Only prevent default on mobile
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = this.parentElement;
                const dropdown = parent.querySelector('.dropdown-menu');

                // Close other dropdowns
                document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
                    if (item !== parent) {
                        item.classList.remove('dropdown-active');
                    }
                });

                // Toggle current dropdown
                parent.classList.toggle('dropdown-active');
            }
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-item.has-dropdown')) {
            document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
                item.classList.remove('dropdown-active');
            });
        }
    });
}

// ================================================================
// THEME TOGGLE (DARK MODE)
// ================================================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle') || document.querySelector('.theme-toggle');
    const html = document.documentElement;

    // Check for saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            let theme = html.getAttribute('data-theme');

            if (theme === 'light') {
                html.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                html.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }
}

// ================================================================
// SCROLL ANIMATIONS (AOS - Animate On Scroll)
// ================================================================
function initScrollAnimations() {
    const animElements = document.querySelectorAll('[data-aos]');

    const animateOnScroll = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animElements.forEach(el => animateOnScroll.observe(el));
}

// ================================================================
// BACK TO TOP BUTTON
// ================================================================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop') || document.querySelector('.scroll-top') || document.querySelector('.back-to-top');

    if (!backToTop) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
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
// WORK FILTER
// ================================================================
function initWorkFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');

    if (filterBtns.length === 0 || workItems.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            // Filter work items
            workItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    const category = item.getAttribute('data-category');

                    if (category === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

// ================================================================
// CONTACT FORM - Web3Forms Integration
// ================================================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const buttonText = submitButton.querySelector('span');
            const originalText = buttonText.textContent;

            // Show loading state
            submitButton.disabled = true;
            buttonText.textContent = 'Sending...';

            try {
                // Get form data
                const formData = new FormData(contactForm);
                const object = Object.fromEntries(formData);
                const json = JSON.stringify(object);

                // Send to Web3Forms with JSON
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
                    // Show success message
                    showNotification('Thank you! Your message has been sent successfully.', 'success');

                    // Reset form
                    contactForm.reset();
                } else {
                    // Show error message
                    showNotification('Oops! Something went wrong. Please try again.', 'error');
                    console.error('Form submission error:', data);
                }
            } catch (error) {
                // Show error message
                showNotification('Oops! Something went wrong. Please try again.', 'error');
                console.error('Form submission error:', error);
            } finally {
                // Reset button state
                submitButton.disabled = false;
                buttonText.textContent = originalText;
            }
        });
    }
}

// ================================================================
// NOTIFICATION SYSTEM
// ================================================================
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : '✕'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;

    // Add styles inline for notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        min-width: 300px;
    `;

    // Append to body
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .notification-icon {
        font-size: 1.25rem;
        font-weight: bold;
    }

    .notification-message {
        font-weight: 500;
    }
`;
document.head.appendChild(style);

// ================================================================
// SMOOTH SCROLL
// ================================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

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

// ================================================================
// PARALLAX EFFECT FOR HERO
// ================================================================
window.addEventListener('scroll', function() {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero');

    if (hero && scrolled < window.innerHeight) {
        // Disable parallax and opacity effect on mobile devices
        if (window.innerWidth > 768) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            hero.style.opacity = 1 - (scrolled / 700);
        } else {
            // Reset styles on mobile to prevent hiding
            hero.style.transform = 'none';
            hero.style.opacity = '1';
        }
    }
});

// ================================================================
// MAGNETIC BUTTON EFFECT
// ================================================================
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousemove', function(e) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    button.addEventListener('mouseleave', function() {
        button.style.transform = '';
    });
});

// ================================================================
// CURSOR FOLLOWER (OPTIONAL - MODERN EFFECT)
// ================================================================
function initCursorFollower() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-follower';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(99, 102, 241, 0.5);
        pointer-events: none;
        z-index: 10000;
        transition: transform 0.2s ease;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Scale on clickable elements
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
        });

        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
}

// Uncomment to enable cursor follower on desktop
// if (window.innerWidth > 768) {
//     initCursorFollower();
// }

// ================================================================
// LAZY LOADING IMAGES
// ================================================================
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ================================================================
// PERFORMANCE OPTIMIZATIONS
// ================================================================

// Debounce function for scroll events
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

// Optimize scroll events
const optimizedScroll = debounce(function() {
    // Your scroll logic here
}, 10);

window.addEventListener('scroll', optimizedScroll);

// ================================================================
// CONSOLE MESSAGE
// ================================================================
console.log('%c👋 Hey there!', 'font-size: 2rem; font-weight: bold; color: #6366f1;');
console.log('%cWelcome to CodeAayu Creatives V2.0', 'font-size: 1.2rem; color: #475569;');
console.log('%cInterested in the code? Let\'s connect!', 'font-size: 1rem; color: #94a3b8;');
console.log('%c📧 codeaayu@gmail.com', 'font-size: 1rem; color: #6366f1; font-weight: bold;');
