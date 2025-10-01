// ================================================================
// COMPONENT LOADER
// Loads reusable header and footer components
// ================================================================

(function() {
    'use strict';

    // Load component helper function
    async function loadComponent(elementId, componentPath) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Element with id "${elementId}" not found`);
            return;
        }

        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`Failed to load ${componentPath}: ${response.statusText}`);
            }
            const html = await response.text();
            element.innerHTML = html;

            // Dispatch custom event when component is loaded
            const event = new CustomEvent('componentLoaded', {
                detail: { elementId, componentPath }
            });
            document.dispatchEvent(event);
        } catch (error) {
            console.error(`Error loading component ${componentPath}:`, error);
        }
    }

    // Set active nav link based on current page
    function setActiveNavLink() {
        const currentPage = document.body.getAttribute('data-page');
        if (!currentPage) return;

        // Wait a bit for the header to be loaded
        setTimeout(() => {
            const navLinks = document.querySelectorAll('.nav-link[data-page]');
            navLinks.forEach(link => {
                const linkPage = link.getAttribute('data-page');
                if (linkPage === currentPage) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }, 100);
    }

    // Load components when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initComponents);
    } else {
        initComponents();
    }

    async function initComponents() {
        // Load header and footer
        await Promise.all([
            loadComponent('header-component', 'components/header.html'),
            loadComponent('footer-component', 'components/footer.html')
        ]);

        // Set active navigation link
        setActiveNavLink();

        // Dispatch event that all components are loaded
        document.dispatchEvent(new Event('allComponentsLoaded'));
    }
})();
