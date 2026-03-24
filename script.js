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
    initWeddingCountdown();
    initWeddingSlideshow();
    initWeddingFilmFullscreen();
    initWeddingExperience();
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
// WEB3FORMS - Shared submission handler
// ================================================================
function initContactForm() {
    const forms = document.querySelectorAll('form[action*="api.web3forms.com/submit"]');

    if (forms.length === 0) return;

    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitButton = form.querySelector('button[type="submit"]');
            if (!submitButton) return;

            const originalButtonHtml = submitButton.innerHTML;
            const loadingText = form.dataset.loadingText || 'Sending...';
            const successMessage = form.dataset.successMessage || 'Thank you! Your message has been sent successfully.';
            const errorMessage = form.dataset.errorMessage || 'Oops! Something went wrong. Please try again.';

            submitButton.disabled = true;
            submitButton.textContent = loadingText;

            try {
                const formData = new FormData(form);
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
                    showNotification(successMessage, 'success');
                    form.reset();
                } else {
                    showNotification(errorMessage, 'error');
                    console.error('Form submission error:', data);
                }
            } catch (error) {
                showNotification(errorMessage, 'error');
                console.error('Form submission error:', error);
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonHtml;
            }
        });
    });
}

// ================================================================
// WEDDING COUNTDOWN
// ================================================================
function initWeddingCountdown() {
    const countdown = document.querySelector('[data-countdown-target]');

    if (!countdown) return;

    const targetTime = Date.parse(countdown.getAttribute('data-countdown-target'));
    const daysNode = countdown.querySelector('[data-countdown-part="days"]');
    const hoursNode = countdown.querySelector('[data-countdown-part="hours"]');
    const minutesNode = countdown.querySelector('[data-countdown-part="minutes"]');
    const secondsNode = countdown.querySelector('[data-countdown-part="seconds"]');

    if (Number.isNaN(targetTime) || !daysNode || !hoursNode || !minutesNode || !secondsNode) return;

    function updateCountdown() {
        const remaining = Math.max(0, targetTime - Date.now());
        const totalSeconds = Math.floor(remaining / 1000);

        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        daysNode.textContent = String(days).padStart(2, '0');
        hoursNode.textContent = String(hours).padStart(2, '0');
        minutesNode.textContent = String(minutes).padStart(2, '0');
        secondsNode.textContent = String(seconds).padStart(2, '0');

        return remaining;
    }

    const initialRemaining = updateCountdown();
    if (initialRemaining === 0) return;

    const timer = setInterval(() => {
        const remaining = updateCountdown();
        if (remaining === 0) {
            clearInterval(timer);
        }
    }, 1000);
}

// ================================================================
// WEDDING HERO SLIDESHOW
// ================================================================
function initWeddingSlideshow() {
    const slideshow = document.querySelector('[data-wedding-slideshow]');

    if (!slideshow) return;

    const slides = Array.from(slideshow.querySelectorAll('[data-wedding-slide]'));
    const dots = Array.from(slideshow.querySelectorAll('[data-wedding-dot]'));

    if (slides.length === 0) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let activeIndex = 0;
    let timerId = null;

    function setActiveSlide(nextIndex) {
        activeIndex = (nextIndex + slides.length) % slides.length;

        slides.forEach((slide, index) => {
            slide.classList.toggle('is-active', index === activeIndex);
        });

        dots.forEach((dot, index) => {
            const isActive = index === activeIndex;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-pressed', String(isActive));
        });
    }

    function stopRotation() {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    function startRotation() {
        stopRotation();

        if (reducedMotion.matches || slides.length < 2) return;

        timerId = setInterval(() => {
            setActiveSlide(activeIndex + 1);
        }, 4200);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            setActiveSlide(index);
            startRotation();
        });
    });

    slideshow.addEventListener('mouseenter', stopRotation);
    slideshow.addEventListener('mouseleave', startRotation);
    slideshow.addEventListener('focusin', stopRotation);
    slideshow.addEventListener('focusout', function(e) {
        if (!slideshow.contains(e.relatedTarget)) {
            startRotation();
        }
    });

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopRotation();
        } else {
            startRotation();
        }
    });

    if (typeof reducedMotion.addEventListener === 'function') {
        reducedMotion.addEventListener('change', startRotation);
    } else if (typeof reducedMotion.addListener === 'function') {
        reducedMotion.addListener(startRotation);
    }

    setActiveSlide(0);
    startRotation();
}

// ================================================================
// WEDDING FILM FULLSCREEN
// ================================================================
function initWeddingFilmFullscreen() {
    const media = document.getElementById('weddingFilmMedia');
    const video = document.getElementById('weddingInviteVideo');
    const button = document.getElementById('weddingFilmFullscreenButton');

    if (!media || !video || !button) return;

    function isMediaFullscreen() {
        return document.fullscreenElement === media || document.webkitFullscreenElement === media;
    }

    function syncButtonState() {
        button.textContent = isMediaFullscreen() ? 'Exit Full Screen' : 'Open Full Screen';
        button.setAttribute('aria-pressed', String(isMediaFullscreen()));
    }

    async function enterFullscreen() {
        try {
            if (media.requestFullscreen) {
                await media.requestFullscreen();
                return;
            }

            if (media.webkitRequestFullscreen) {
                media.webkitRequestFullscreen();
                return;
            }

            if (video.requestFullscreen) {
                await video.requestFullscreen();
                return;
            }

            if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
                return;
            }

            if (typeof video.webkitEnterFullscreen === 'function') {
                video.webkitEnterFullscreen();
            }
        } catch (error) {
            console.error('Fullscreen error:', error);
        }
    }

    async function exitFullscreen() {
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
                return;
            }

            if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        } catch (error) {
            console.error('Fullscreen exit error:', error);
        }
    }

    button.addEventListener('click', async function() {
        if (isMediaFullscreen()) {
            await exitFullscreen();
        } else {
            await enterFullscreen();
        }

        syncButtonState();
    });

    document.addEventListener('fullscreenchange', syncButtonState);
    document.addEventListener('webkitfullscreenchange', syncButtonState);

    syncButtonState();
}

// ================================================================
// WEDDING PAGE SIDE EXPERIENCE
// ================================================================
function initWeddingExperience() {
    const sidePicker = document.getElementById('weddingSidePicker');

    if (!sidePicker) return;

    const primaryName = document.getElementById('weddingPrimaryName');
    const secondaryLine = document.getElementById('weddingSecondaryLine');
    const heroIntro = document.getElementById('weddingHeroIntro');
    const sideStatus = document.getElementById('weddingSideStatus');
    const detailsEyebrow = document.getElementById('weddingDetailsEyebrow');
    const detailsHeading = document.getElementById('weddingDetailsHeading');
    const detailsIntro = document.getElementById('weddingDetailsIntro');
    const familyNoteLabel = document.getElementById('weddingFamilyNoteLabel');
    const familyNoteTitle = document.getElementById('weddingFamilyNoteTitle');
    const familyNoteText = document.getElementById('weddingFamilyNoteText');
    const filmEyebrow = document.getElementById('weddingFilmEyebrow');
    const filmHeading = document.getElementById('weddingFilmHeading');
    const filmIntro = document.getElementById('weddingFilmIntro');
    const filmLabel = document.getElementById('weddingFilmLabel');
    const filmTitle = document.getElementById('weddingFilmTitle');
    const filmText = document.getElementById('weddingFilmText');
    const inviteVideo = document.getElementById('weddingInviteVideo');
    const inviteVideoSource = document.getElementById('weddingInviteVideoSource');
    const rsvpText = document.getElementById('weddingRsvpText');
    const formNote = document.getElementById('weddingFormNote');
    const rsvpSubject = document.getElementById('weddingRsvpSubject');
    const rsvpFromName = document.getElementById('weddingRsvpFromName');
    const invitationSide = document.getElementById('weddingInvitationSide');
    const guestSideField = document.getElementById('guestSideField');
    const sideSwitch = document.getElementById('weddingSideSwitch');
    const pageTitle = document.querySelector('title');
    const pageMetaTitle = document.querySelector('meta[name="title"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const sideButtons = sidePicker.querySelectorAll('[data-side-choice]');

    const sideContent = {
        bride: {
            primaryName: 'Ishita Arora',
            secondaryLine: '& Aayush Ahuja',
            heroIntro: "Together with their families, Ishita Arora and Aayush Ahuja invite you to join them in celebrating their wedding at Rajvi Palace, Hanumangarh, Rajasthan. We would be honoured to have you with us on this special day.",
            sideStatus: "Viewing the bride's invitation",
            detailsEyebrow: "Bride's Invitation",
            detailsHeading: "A note from Ishita's side.",
            detailsIntro: 'Please join us as family and friends gather together to celebrate love, blessings, and a beautiful new beginning.',
            familyNoteLabel: 'From Her Side',
            familyNoteTitle: "With love from Ishita's family",
            familyNoteText: 'Please let us know whether you plan to arrive by 24th morning, 24th evening, or 25th April so we can receive you warmly and prepare for your presence.',
            filmEyebrow: "Bride Side E-Invite",
            filmHeading: "A little glimpse from Ishita's side.",
            filmIntro: "Please watch the invitation film from Ishita's family.",
            filmLabel: 'Bride Side',
            filmTitle: "Ishita's family invite",
            filmText: "A warm invitation from Ishita's side of the family.",
            filmSrc: 'videos/wedding/ishita-side-e-invite.mp4',
            rsvpText: "Share your name, phone number, and whether you plan to arrive by 24th morning, 24th evening, or 25th April. If you cannot make it, please still let us know from Ishita's side.",
            formNote: 'We would be so happy to hear from you. Please share your response below.',
            subject: 'Wedding RSVP | Bride Side | Ishita Arora & Aayush Ahuja',
            fromName: 'Wedding RSVP | Bride Side',
            guestSide: 'Bride Side',
            pageTitle: 'Ishita Arora & Aayush Ahuja Wedding | 25 April 2026 | Rajvi Palace'
        },
        groom: {
            primaryName: 'Aayush Ahuja',
            secondaryLine: '& Ishita Arora',
            heroIntro: 'Together with their families, Aayush Ahuja and Ishita Arora invite you to join them in celebrating their wedding at Rajvi Palace, Hanumangarh, Rajasthan. We would be honoured to have you with us on this special day.',
            sideStatus: "Viewing the groom's invitation",
            detailsEyebrow: "Groom's Invitation",
            detailsHeading: "A note from Aayush's side.",
            detailsIntro: 'Please join us as family and friends gather together to celebrate love, blessings, and a beautiful new beginning.',
            familyNoteLabel: 'From His Side',
            familyNoteTitle: "With love from Aayush's family",
            familyNoteText: 'Please let us know whether you plan to arrive by 24th morning, 24th evening, or 25th April so we can receive you warmly and prepare for your presence.',
            filmEyebrow: "Groom Side E-Invite",
            filmHeading: "A little glimpse from Aayush's side.",
            filmIntro: "Please watch the invitation film from Aayush's family.",
            filmLabel: 'Groom Side',
            filmTitle: "Aayush's family invite",
            filmText: "A warm invitation from Aayush's side of the family.",
            filmSrc: 'videos/wedding/aayush-side-e-invite.mp4',
            rsvpText: "Share your name, phone number, and whether you plan to arrive by 24th morning, 24th evening, or 25th April. If you cannot make it, please still let us know from Aayush's side.",
            formNote: 'We would be so happy to hear from you. Please share your response below.',
            subject: 'Wedding RSVP | Groom Side | Aayush Ahuja & Ishita Arora',
            fromName: 'Wedding RSVP | Groom Side',
            guestSide: 'Groom Side',
            pageTitle: 'Aayush Ahuja & Ishita Arora Wedding | 25 April 2026 | Rajvi Palace'
        }
    };

    function openSidePicker() {
        sidePicker.hidden = false;
        document.body.classList.add('wedding-side-picker-open');
    }

    function closeSidePicker() {
        sidePicker.hidden = true;
        document.body.classList.remove('wedding-side-picker-open');
    }

    function syncRsvpSideMetadata(selectedSide) {
        const normalizedSide = selectedSide === sideContent.bride.guestSide
            ? sideContent.bride
            : sideContent.groom;

        if (rsvpSubject) rsvpSubject.value = normalizedSide.subject;
        if (rsvpFromName) rsvpFromName.value = normalizedSide.fromName;
        if (guestSideField) guestSideField.value = normalizedSide.guestSide;
    }

    function applyWeddingSide(side) {
        const content = sideContent[side];
        if (!content) return;

        primaryName.textContent = content.primaryName;
        secondaryLine.textContent = content.secondaryLine;
        heroIntro.textContent = content.heroIntro;
        sideStatus.textContent = content.sideStatus;
        detailsEyebrow.textContent = content.detailsEyebrow;
        detailsHeading.textContent = content.detailsHeading;
        detailsIntro.textContent = content.detailsIntro;
        familyNoteLabel.textContent = content.familyNoteLabel;
        familyNoteTitle.textContent = content.familyNoteTitle;
        familyNoteText.textContent = content.familyNoteText;
        filmEyebrow.textContent = content.filmEyebrow;
        filmHeading.textContent = content.filmHeading;
        filmIntro.textContent = content.filmIntro;
        filmLabel.textContent = content.filmLabel;
        filmTitle.textContent = content.filmTitle;
        filmText.textContent = content.filmText;
        rsvpText.textContent = content.rsvpText;
        formNote.textContent = content.formNote;
        if (invitationSide) invitationSide.value = content.guestSide;
        syncRsvpSideMetadata(content.guestSide);

        if (pageTitle) pageTitle.textContent = content.pageTitle;
        if (pageMetaTitle) pageMetaTitle.setAttribute('content', content.pageTitle);
        if (ogTitle) ogTitle.setAttribute('content', content.pageTitle);
        if (twitterTitle) twitterTitle.setAttribute('content', content.pageTitle);

        if (inviteVideo && inviteVideoSource) {
            inviteVideo.pause();
            if (inviteVideoSource.getAttribute('src') !== content.filmSrc) {
                inviteVideoSource.setAttribute('src', content.filmSrc);
                inviteVideo.load();
            }
        }

        document.body.dataset.weddingInviteSide = side;
        closeSidePicker();
    }

    sideButtons.forEach(button => {
        button.addEventListener('click', function() {
            applyWeddingSide(this.dataset.sideChoice);
        });
    });

    if (sideSwitch) {
        sideSwitch.addEventListener('click', openSidePicker);
    }

    if (guestSideField) {
        guestSideField.addEventListener('change', function() {
            syncRsvpSideMetadata(this.value);
        });
    }

    openSidePicker();
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
