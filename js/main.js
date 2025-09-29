// Main JavaScript file for CodeAayu Creatives website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    initMobileNavigation();

    // Portfolio Filtering
    initPortfolioFilter();

    // Gallery Lightbox
    initGalleryLightbox();

    // Contact Form
    initContactForm();

    // Smooth Scrolling
    initSmoothScrolling();

    // Animation on Scroll
    initScrollAnimations();

    // Portfolio Preview
    initPortfolioPreview();

    // Category Filtering for Writing and Video pages
    initCategoryFilter();

    // Clickable Images (for thumbnails)
    initClickableImages();
});

// Mobile Navigation
function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Portfolio/Gallery Filtering
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length && galleryItems.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filter items
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        item.classList.add('fade-in');
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('fade-in');
                    }
                });
            });
        });
    }
}

// Category Filtering for Articles and Videos
function initCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.category-filter .filter-btn');
    const articleCards = document.querySelectorAll('.article-card');
    const videoCards = document.querySelectorAll('.video-card');

    if (categoryButtons.length) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');

                // Update active button
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filter articles
                if (articleCards.length) {
                    articleCards.forEach(card => {
                        if (filter === 'all' || card.getAttribute('data-category') === filter) {
                            card.style.display = 'block';
                            card.classList.add('fade-in');
                        } else {
                            card.style.display = 'none';
                            card.classList.remove('fade-in');
                        }
                    });
                }

                // Filter videos
                if (videoCards.length) {
                    videoCards.forEach(card => {
                        if (filter === 'all' || card.getAttribute('data-category') === filter) {
                            card.style.display = 'block';
                            card.classList.add('fade-in');
                        } else {
                            card.style.display = 'none';
                            card.classList.remove('fade-in');
                        }
                    });
                }
            });
        });
    }
}

// Gallery Lightbox
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    if (!lightbox) return;

    let currentImageIndex = 0;
    let images = Array.from(galleryItems);

    // Open lightbox
    galleryItems.forEach((img, index) => {
        img.addEventListener('click', function() {
            currentImageIndex = index;
            showLightboxImage();
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    // Close on click outside
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            showLightboxImage();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            showLightboxImage();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                showLightboxImage();
            } else if (e.key === 'ArrowRight') {
                currentImageIndex = (currentImageIndex + 1) % images.length;
                showLightboxImage();
            }
        }
    });

    function showLightboxImage() {
        const currentImg = images[currentImageIndex];
        if (currentImg && lightboxImg) {
            // Use full resolution image if available, otherwise use thumbnail
            const fullImageSrc = currentImg.getAttribute('data-full') || currentImg.src;
            lightboxImg.src = fullImageSrc;
            lightboxImg.alt = currentImg.alt;

            // Update caption
            if (lightboxCaption) {
                const overlay = currentImg.parentElement.querySelector('.gallery-overlay');
                if (overlay) {
                    const title = overlay.querySelector('h3');
                    const subtitle = overlay.querySelector('p');
                    lightboxCaption.innerHTML = title ? title.textContent : '';
                    if (subtitle && subtitle.textContent !== title?.textContent) {
                        lightboxCaption.innerHTML += subtitle ? ` - ${subtitle.textContent}` : '';
                    }
                } else {
                    lightboxCaption.innerHTML = currentImg.alt || '';
                }
            }
        }
    }
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (!data.name || !data.email || !data.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            if (!isValidEmail(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission (replace with actual form handling)
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        padding: 15px 20px;
        border-radius: 8px;
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    `;

    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: inherit;
        padding: 0;
        margin-left: 10px;
    `;

    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);

    // Add CSS animations
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed header
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
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
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements
    const elementsToObserve = document.querySelectorAll(`
        .service-item,
        .work-item,
        .gallery-item,
        .article-card,
        .video-card,
        .skill-category,
        .interest-item,
        .timeline-item,
        .testimonial-item,
        .faq-item,
        .section-item,
        .download-card,
        .service-card
    `);

    elementsToObserve.forEach(el => {
        observer.observe(el);
    });
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = '#fff';
            navbar.style.backdropFilter = 'none';
        }
    }
});

// Video thumbnail click handlers
document.querySelectorAll('.video-thumbnail').forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
        const videoCard = this.closest('.video-card');
        const videoLink = videoCard.querySelector('.video-link');
        if (videoLink) {
            window.open(videoLink.href, '_blank');
        }
    });
});

// Add loading states for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.classList.add('loaded');
    });

    // If image is already loaded (cached)
    if (img.complete) {
        img.classList.add('loaded');
    }
});

// Lazy loading for images (modern browsers)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add CSS for loaded images
const style = document.createElement('style');
style.textContent = `
    img {
        transition: opacity 0.3s ease;
        opacity: 0;
    }
    img.loaded {
        opacity: 1;
    }
    img.lazy {
        background: #f0f0f0;
    }
`;
document.head.appendChild(style);

// Performance: Debounce scroll events
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

// Optimized scroll handler
const handleScroll = debounce(() => {
    // Any additional scroll handling can go here
}, 10);

// Portfolio Preview Functionality
function initPortfolioPreview() {
    const portfolioPreview = document.querySelector('.portfolio-preview-image');

    if (portfolioPreview) {
        portfolioPreview.style.cursor = 'pointer';
        portfolioPreview.addEventListener('click', function() {
            // Option 1: Open PDF in new tab for preview
            window.open('assets/CodeAayu-Creative-Portfolio.pdf', '_blank');

            // Optional: Show a notification
            showNotification('Opening portfolio preview in new tab...', 'success');
        });

        // Add hover effect
        portfolioPreview.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.preview-overlay');
            if (overlay) {
                overlay.style.opacity = '1';
                overlay.style.transform = 'scale(1.05)';
            }
        });

        portfolioPreview.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.preview-overlay');
            if (overlay) {
                overlay.style.opacity = '0.8';
                overlay.style.transform = 'scale(1)';
            }
        });
    }
}

// Clickable Images Functionality for Thumbnails
function initClickableImages() {
    const clickableImages = document.querySelectorAll('.clickable-image');

    clickableImages.forEach(img => {
        img.style.cursor = 'pointer';

        img.addEventListener('click', function() {
            const fullImageSrc = this.getAttribute('data-full');
            console.log('Clickable image clicked. data-full:', fullImageSrc); // Debug log
            if (fullImageSrc) {
                // Create a simple image modal
                showImageModal(fullImageSrc, this.alt);
            } else {
                console.error('No data-full attribute found on clicked image');
            }
        });
    });
}

// Simple Image Modal for clickable images
function showImageModal(imageSrc, imageAlt) {
    console.log('Opening modal with image:', imageSrc); // Debug log

    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        position: relative;
        max-width: 95%;
        max-height: 95%;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    // Loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.innerHTML = 'Loading...';
    loadingDiv.style.cssText = `
        color: white;
        font-size: 18px;
        position: absolute;
    `;
    modalContent.appendChild(loadingDiv);

    const modalImg = document.createElement('img');
    modalImg.alt = imageAlt;
    modalImg.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    // Handle image load
    modalImg.onload = function() {
        console.log('Image loaded successfully:', imageSrc);
        loadingDiv.style.display = 'none';
        modalImg.style.opacity = '1';
    };

    modalImg.onerror = function() {
        console.error('Failed to load image:', imageSrc);
        loadingDiv.innerHTML = 'Failed to load image';
        loadingDiv.style.color = '#ff6b6b';
    };

    // Set image source after setting up event handlers
    modalImg.src = imageSrc;

    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 30px;
        font-weight: bold;
        cursor: pointer;
        z-index: 10001;
        user-select: none;
    `;

    // Close functionality
    function closeModal() {
        modal.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
            document.body.style.overflow = 'auto';
        }, 300);
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard escape
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);

    // Assemble and show modal
    modalContent.appendChild(modalImg);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Fade in the modal
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}