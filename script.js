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
    initWeddingUpdates();
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
// WEDDING UPDATES
// ================================================================
function initWeddingUpdates() {
    const section = document.getElementById('updates');
    const importantUpdate = document.getElementById('weddingImportantUpdate');
    const supportGuide = document.getElementById('weddingSupportGuide');
    const weatherGuide = document.getElementById('weddingWeatherGuide');
    const stayGuide = document.getElementById('weddingStayGuide');
    const attireGuide = document.getElementById('weddingAttireGuide');
    const lastUpdated = document.getElementById('weddingUpdatesLastUpdated');
    const updatesData = window.WEDDING_UPDATES;

    if (!section || !importantUpdate || !supportGuide || !stayGuide || !attireGuide || !lastUpdated) return;

    if (!updatesData || (!updatesData.important && !Array.isArray(updatesData.notices))) {
        section.hidden = true;
        return;
    }

    if (updatesData.lastUpdated) {
        lastUpdated.textContent = `Last updated: ${updatesData.lastUpdated}`;
    }

    if (updatesData.important) {
        importantUpdate.innerHTML = '';
        importantUpdate.dataset.importantTone = updatesData.important.tone || 'default';

        const featureMeta = document.createElement('div');
        featureMeta.className = 'wedding-update-feature-meta';

        const featureTag = document.createElement('span');
        featureTag.className = 'wedding-update-feature-tag';
        featureTag.textContent = updatesData.important.tag || 'Important Update';

        const featureDate = document.createElement('span');
        featureDate.className = 'wedding-update-feature-date';
        featureDate.textContent = updatesData.important.date || '';

        featureMeta.append(featureTag, featureDate);

        const featureCopy = document.createElement('div');
        featureCopy.className = 'wedding-update-feature-copy';

        const featureTitle = document.createElement('h3');
        featureTitle.className = 'heading-medium wedding-update-feature-title';
        featureTitle.textContent = updatesData.important.title || '';

        const featureText = document.createElement('p');
        featureText.className = 'body-base wedding-update-feature-text';
        featureText.textContent = updatesData.important.message || '';

        featureCopy.append(featureTitle, featureText);

        const hasImportantLocations = Array.isArray(updatesData.important.locations)
            && updatesData.important.locations.length > 0;

        if (!hasImportantLocations && Array.isArray(updatesData.important.highlights) && updatesData.important.highlights.length > 0) {
            const featureHighlights = document.createElement('div');
            featureHighlights.className = 'wedding-update-feature-highlights';

            updatesData.important.highlights.forEach(highlight => {
                if (!highlight) return;

                const pill = document.createElement('span');
                pill.className = 'wedding-update-feature-highlight';
                pill.textContent = highlight;
                featureHighlights.appendChild(pill);
            });

            if (featureHighlights.childElementCount > 0) {
                featureCopy.appendChild(featureHighlights);
            }
        }

        if (hasImportantLocations) {
            const featureLocations = createWeddingMapTags(updatesData.important.locations, 'wedding-update-feature-locations');

            if (featureLocations) {
                featureCopy.appendChild(featureLocations);
            }
        }

        importantUpdate.append(featureMeta, featureCopy);
    }

    const notices = Array.isArray(updatesData.notices) ? updatesData.notices.slice() : [];

    if (notices.length === 0) return;

    function createWeddingMapTags(locations, className = 'wedding-update-note-locations') {
        if (!Array.isArray(locations) || locations.length === 0) return null;

        const container = document.createElement('div');
        container.className = className;

        locations.forEach(location => {
            if (!location || !location.url || !location.label) return;

            const link = document.createElement('a');
            link.className = 'wedding-location-tag';
            link.href = location.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = location.label;

            container.appendChild(link);
        });

        return container.childElementCount > 0 ? container : null;
    }

    function createWeddingActions(actions, className = 'wedding-guide-actions') {
        if (!Array.isArray(actions) || actions.length === 0) return null;

        const container = document.createElement('div');
        container.className = className;

        actions.forEach(action => {
            if (!action || !action.url || !action.label) return;

            const link = document.createElement('a');
            link.className = 'wedding-update-action';
            link.href = action.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = action.label;

            container.appendChild(link);
        });

        return container.childElementCount > 0 ? container : null;
    }

    function matchesNotice(notice, patterns) {
        const content = `${notice.title || ''} ${notice.label || ''}`.toLowerCase();
        return patterns.some(pattern => content.includes(pattern));
    }

    function renderGuideCard(root, notice, options) {
        if (!root || !notice) {
            if (root) root.hidden = true;
            return;
        }

        root.hidden = false;
        root.innerHTML = '';
        root.dataset.guideTone = options.tone || 'default';

        const header = document.createElement('div');
        header.className = 'wedding-guide-card-header';

        const headerCopy = document.createElement('div');
        headerCopy.className = 'wedding-guide-card-header-copy';

        const eyebrow = document.createElement('span');
        eyebrow.className = 'wedding-guide-card-eyebrow';
        eyebrow.textContent = options.eyebrow || notice.label || 'Guest Guide';

        const title = document.createElement('h3');
        title.className = 'heading-medium wedding-guide-card-title';
        title.textContent = options.title || notice.title || '';

        headerCopy.append(eyebrow, title);

        const date = document.createElement('span');
        date.className = 'wedding-guide-card-date';
        date.textContent = notice.date || '';

        header.append(headerCopy, date);

        const text = document.createElement('p');
        text.className = 'body-base wedding-guide-card-text';
        text.textContent = notice.message || '';

        root.append(header, text);

        const actions = createWeddingActions(notice.actions);
        if (actions) root.appendChild(actions);

        const locations = createWeddingMapTags(notice.locations, 'wedding-guide-card-locations');
        if (locations) root.appendChild(locations);
    }

    function describeWeatherCode(code, isDay) {
        const normalizedCode = Number(code);

        if (normalizedCode === 0) return isDay ? 'Clear sky' : 'Clear night';
        if ([1, 2, 3].includes(normalizedCode)) return 'Partly cloudy';
        if ([45, 48].includes(normalizedCode)) return 'Foggy';
        if ([51, 53, 55, 56, 57].includes(normalizedCode)) return 'Drizzle';
        if ([61, 63, 65, 66, 67, 80, 81, 82].includes(normalizedCode)) return 'Rain';
        if ([71, 73, 75, 77, 85, 86].includes(normalizedCode)) return 'Snow';
        if ([95, 96, 99].includes(normalizedCode)) return 'Thunderstorm';
        return 'Current conditions';
    }

    function formatWeatherTime(value) {
        if (!value || !value.includes('T')) return 'Just updated';

        const [, timePart] = value.split('T');
        const [hoursString = '0', minutesString = '00'] = timePart.split(':');
        const hours = Number(hoursString);
        const minutes = Number(minutesString);
        const meridiem = hours >= 12 ? 'PM' : 'AM';
        const displayHour = hours % 12 || 12;

        return `Updated ${displayHour}:${String(minutes).padStart(2, '0')} ${meridiem} IST`;
    }

    function renderWeatherGuide(root, state) {
        if (!root) return;

        root.hidden = false;
        root.innerHTML = '';
        root.dataset.guideTone = 'weather';

        const header = document.createElement('div');
        header.className = 'wedding-guide-card-header';

        const headerCopy = document.createElement('div');
        headerCopy.className = 'wedding-guide-card-header-copy';

        const eyebrow = document.createElement('span');
        eyebrow.className = 'wedding-guide-card-eyebrow';
        eyebrow.textContent = 'Current Weather';

        const title = document.createElement('h3');
        title.className = 'heading-medium wedding-guide-card-title';
        title.textContent = 'Pilibanga right now';

        headerCopy.append(eyebrow, title);

        const date = document.createElement('span');
        date.className = 'wedding-guide-card-date';
        date.textContent = state.updatedLabel || 'Checking live conditions';

        header.append(headerCopy, date);
        root.appendChild(header);

        const intro = document.createElement('p');
        intro.className = 'body-base wedding-guide-card-text';
        intro.textContent = state.message || 'Live conditions at the time this page is opened.';
        root.appendChild(intro);

        if (state.status === 'loading') {
            const loading = document.createElement('div');
            loading.className = 'wedding-weather-loading';
            loading.textContent = 'Loading current conditions...';
            root.appendChild(loading);
            return;
        }

        if (state.status === 'error') {
            const fallback = document.createElement('div');
            fallback.className = 'wedding-weather-fallback';
            fallback.textContent = 'Live weather is temporarily unavailable. You can refresh the page in a moment.';
            root.appendChild(fallback);
            return;
        }

        const summary = document.createElement('div');
        summary.className = 'wedding-weather-summary';

        const temperature = document.createElement('div');
        temperature.className = 'wedding-weather-temperature';
        temperature.textContent = `${Math.round(state.temperature)}°C`;

        const condition = document.createElement('div');
        condition.className = 'wedding-weather-condition';

        const conditionTitle = document.createElement('strong');
        conditionTitle.className = 'wedding-weather-condition-title';
        conditionTitle.textContent = state.condition;

        const conditionText = document.createElement('span');
        conditionText.className = 'wedding-weather-condition-text';
        conditionText.textContent = 'Live conditions at page open';

        condition.append(conditionTitle, conditionText);
        summary.append(temperature, condition);
        root.appendChild(summary);

        const stats = document.createElement('dl');
        stats.className = 'wedding-weather-stats';

        [
            { label: 'Feels like', value: `${Math.round(state.apparentTemperature)}°C` },
            { label: 'Wind', value: `${Math.round(state.windSpeed)} km/h` },
            { label: 'Time', value: state.updatedLabel.replace('Updated ', '') }
        ].forEach(item => {
            const row = document.createElement('div');
            row.className = 'wedding-weather-stat';

            const term = document.createElement('dt');
            term.className = 'wedding-weather-stat-label';
            term.textContent = item.label;

            const detail = document.createElement('dd');
            detail.className = 'wedding-weather-stat-value';
            detail.textContent = item.value;

            row.append(term, detail);
            stats.appendChild(row);
        });

        root.appendChild(stats);
    }

    async function loadWeddingWeather() {
        if (!weatherGuide) return;

        renderWeatherGuide(weatherGuide, {
            status: 'loading',
            updatedLabel: 'Checking live conditions',
            message: 'Live conditions at the time this page is opened.'
        });

        try {
            const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=29.44964&longitude=74.10093&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&timezone=Asia%2FKolkata&forecast_days=1');
            if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);

            const payload = await response.json();
            const current = payload && payload.current;
            if (!current) throw new Error('Missing current weather data');

            renderWeatherGuide(weatherGuide, {
                status: 'ready',
                updatedLabel: formatWeatherTime(current.time),
                message: 'Live conditions in Pilibanga at the moment you opened the invitation.',
                temperature: current.temperature_2m,
                apparentTemperature: current.apparent_temperature,
                windSpeed: current.wind_speed_10m,
                condition: describeWeatherCode(current.weather_code, Number(current.is_day) === 1)
            });
        } catch (error) {
            console.error(error);
            renderWeatherGuide(weatherGuide, {
                status: 'error',
                updatedLabel: 'Live update unavailable',
                message: 'Live conditions at the time this page is opened.'
            });
        }
    }

    function getAttireGuideMeta(notice) {
        const title = (notice.title || '').toLowerCase();

        if (title.includes('haldi')) {
            return {
                tone: 'haldi',
                moment: '25 April Morning',
                cue: 'Yellowish Shades',
                points: [
                    'Yellowish shades are preferred.',
                    'Choose light festive outfits that feel easy for a morning function.',
                    'The function will be in an air-conditioned indoor hall.'
                ]
            };
        }

        if (title.includes('wedding')) {
            return {
                tone: 'wedding',
                moment: '25 April Evening',
                cue: 'Festive Indian',
                points: [
                    'Gents can plan for indo-western attire.',
                    'Ladies can plan for lehengas or sarees.',
                    'The celebration is in a garden setting, so comfortable footwear will help.'
                ]
            };
        }

        return {
            tone: 'evening',
            moment: '24 April Evening',
            cue: 'Western Formals',
            points: [
                'Girls will mostly be in gowns or dresses.',
                'Boys can plan for three-piece suits or western formals.',
                'The function will be in an air-conditioned indoor hall.'
            ]
        };
    }

    function renderAttireGuide(root, summaryNotice, attireNotices) {
        if (!root || attireNotices.length === 0) {
            if (root) root.hidden = true;
            return;
        }

        root.hidden = false;
        root.innerHTML = '';

        const header = document.createElement('div');
        header.className = 'wedding-attire-guide-header';

        const eyebrow = document.createElement('span');
        eyebrow.className = 'wedding-attire-guide-eyebrow';
        eyebrow.textContent = 'Dress Code Guide';

        const title = document.createElement('h3');
        title.className = 'heading-large wedding-attire-guide-title';
        title.textContent = 'What to Wear for Each Celebration';

        const summary = document.createElement('p');
        summary.className = 'body-base wedding-attire-guide-summary';
        summary.textContent = summaryNotice && summaryNotice.message
            ? 'A quick guide to help guests plan what to wear for the 24 April celebrations, the Haldi ceremony, and the wedding evening.'
            : 'A quick guide to help guests plan what to wear for each celebration.';

        header.append(eyebrow, title, summary);

        const grid = document.createElement('div');
        grid.className = 'wedding-attire-grid';

        attireNotices.forEach(notice => {
            const attireMeta = getAttireGuideMeta(notice);
            const card = document.createElement('article');
            card.className = 'wedding-attire-card';
            card.dataset.attireTone = attireMeta.tone;

            const headerBlock = document.createElement('div');
            headerBlock.className = 'wedding-attire-card-header';

            const top = document.createElement('div');
            top.className = 'wedding-attire-card-top';

            const moment = document.createElement('span');
            moment.className = 'wedding-attire-card-moment';
            moment.textContent = attireMeta.moment;

            const cue = document.createElement('span');
            cue.className = 'wedding-attire-card-cue';
            cue.textContent = attireMeta.cue;

            top.append(moment, cue);

            const attireTitle = document.createElement('h4');
            attireTitle.className = 'heading-small wedding-attire-card-title';
            attireTitle.textContent = notice.title || '';

            headerBlock.append(top, attireTitle);
            card.appendChild(headerBlock);

            const bodyBlock = document.createElement('div');
            bodyBlock.className = 'wedding-attire-card-body';

            if (Array.isArray(attireMeta.points) && attireMeta.points.length > 0) {
                const attireList = document.createElement('ul');
                attireList.className = 'wedding-attire-points';

                attireMeta.points.forEach(point => {
                    if (!point) return;

                    const item = document.createElement('li');
                    item.className = 'wedding-attire-point';
                    item.textContent = point;
                    attireList.appendChild(item);
                });

                bodyBlock.appendChild(attireList);
            } else {
                const attireText = document.createElement('p');
                attireText.className = 'body-small wedding-attire-card-text';
                attireText.textContent = notice.message || '';
                bodyBlock.appendChild(attireText);
            }

            card.appendChild(bodyBlock);
            grid.appendChild(card);
        });

        root.append(header, grid);
    }

    const supportNotice = notices.find(notice => matchesNotice(notice, ['support', 'logistics']));
    const stayNotice = notices.find(notice => matchesNotice(notice, ['stay', 'accommodation']));
    const dressSummary = notices.find(notice => matchesNotice(notice, ['dress', 'attire']));
    const attireNoticeOrder = ['Ring Ceremony & Sangeet', 'Haldi Ceremony', 'Wedding Ceremony'];
    const attireNotices = attireNoticeOrder
        .map(title => notices.find(notice => notice.title === title))
        .filter(Boolean);

    renderGuideCard(supportGuide, supportNotice, {
        eyebrow: 'Guest Help',
        title: 'Help on arrival',
        tone: 'support'
    });

    renderGuideCard(stayGuide, stayNotice, {
        eyebrow: 'Stay Arrangements',
        title: 'Guest stay arrangements',
        tone: 'stay'
    });

    renderAttireGuide(attireGuide, dressSummary, attireNotices);
    loadWeddingWeather();
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
            heroIntro: "Together with their families, Ishita Arora and Aayush Ahuja invite you to join them in celebrating their wedding at Swarn Mahal, Rajvi Palace, Hanumangarh, Rajasthan. We would be honoured to have you with us on this special day.",
            sideStatus: "Viewing the bride's side",
            detailsEyebrow: "Bride's Invitation",
            detailsHeading: "From Ishita's Family",
            detailsIntro: 'Please join us as family and friends come together to celebrate love, blessings, and a beautiful new beginning.',
            familyNoteLabel: 'From Her Side',
            familyNoteTitle: "With love from Ishita's family",
            familyNoteText: 'Please let us know if you expect to arrive on 24th morning, 24th evening, or 25th April so we can welcome you comfortably and make the arrangements with care.',
            filmEyebrow: "Bride Side E-Invite",
            filmHeading: 'Invitation Film',
            filmIntro: "Here is the invitation film from Ishita's family.",
            filmLabel: 'Bride Side',
            filmTitle: "Invitation from Ishita's family",
            filmText: "A warm invitation from Ishita's side of the family.",
            filmSrc: 'videos/wedding/ishita-side-e-invite.mp4',
            rsvpText: 'Please share your name, phone number, and expected arrival time so we can receive you comfortably. If you are unable to join us, please still send your response with love.',
            formNote: 'We would love to hear from you. Please share your response below.',
            subject: 'Wedding RSVP | Bride Side | Ishita Arora & Aayush Ahuja',
            fromName: 'Wedding RSVP | Bride Side',
            guestSide: 'Bride Side',
            pageTitle: 'Ishita Arora & Aayush Ahuja Wedding | 25 April 2026 | Swarn Mahal, Rajvi Palace'
        },
        groom: {
            primaryName: 'Aayush Ahuja',
            secondaryLine: '& Ishita Arora',
            heroIntro: 'Together with their families, Aayush Ahuja and Ishita Arora invite you to join them in celebrating their wedding at Swarn Mahal, Rajvi Palace, Hanumangarh, Rajasthan. We would be honoured to have you with us on this special day.',
            sideStatus: "Viewing the groom's side",
            detailsEyebrow: "Groom's Invitation",
            detailsHeading: "From Aayush's Family",
            detailsIntro: 'Please join us as family and friends come together to celebrate love, blessings, and a beautiful new beginning.',
            familyNoteLabel: 'From His Side',
            familyNoteTitle: "With love from Aayush's family",
            familyNoteText: 'Please let us know if you expect to arrive on 24th morning, 24th evening, or 25th April so we can welcome you comfortably and make the arrangements with care.',
            filmEyebrow: "Groom Side E-Invite",
            filmHeading: 'Invitation Film',
            filmIntro: "Here is the invitation film from Aayush's family.",
            filmLabel: 'Groom Side',
            filmTitle: "Invitation from Aayush's family",
            filmText: "A warm invitation from Aayush's side of the family.",
            filmSrc: 'videos/wedding/aayush-side-e-invite.mp4',
            rsvpText: 'Please share your name, phone number, and expected arrival time so we can receive you comfortably. If you are unable to join us, please still send your response with love.',
            formNote: 'We would love to hear from you. Please share your response below.',
            subject: 'Wedding RSVP | Groom Side | Aayush Ahuja & Ishita Arora',
            fromName: 'Wedding RSVP | Groom Side',
            guestSide: 'Groom Side',
            pageTitle: 'Aayush Ahuja & Ishita Arora Wedding | 25 April 2026 | Swarn Mahal, Rajvi Palace'
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
