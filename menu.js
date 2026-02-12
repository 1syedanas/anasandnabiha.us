// Shared menu component for all pages
(function() {
    // Insert menu HTML into the page
    const menuHTML = `
        <h2 data-testid="mobile-page-title" class="mobile-page-title">A&amp;N</h2>

        <nav class="nav-wrapper">
            <button id="menuBtn" class="menu-btn" aria-label="Open navigation" aria-haspopup="true" aria-expanded="false">
                <span class="hamburger" aria-hidden="true"></span>
            </button>

            <div id="menuOverlay" class="menu-overlay" aria-hidden="true">
                <div class="menu-inner" role="dialog" aria-modal="true" aria-label="Site navigation">
                    <button class="menu-close" id="menuClose" aria-label="Close navigation">✕</button>
                    <a href="index.html#home" class="menu-link">Home</a>
                    <a href="events.html" class="menu-link">Photos</a>
                    <a href="index.html#travel" class="menu-link">Travel</a>
                    <a href="index.html#faq" class="menu-link">Q + A</a>
                    <a href="index.html#activities" class="menu-link">Things to Do</a>
                    <a href="registry.html" class="menu-link">Registry</a>
                </div>
            </div>
        </nav>
    `;

    // Insert menu at the beginning of body when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertMenu);
    } else {
        insertMenu();
    }

    function insertMenu() {
        document.body.insertAdjacentHTML('afterbegin', menuHTML);
        initializeMenu();
    }

    // Menu functionality
    function initializeMenu() {
        const menuBtn = document.getElementById('menuBtn');
        const menuOverlay = document.getElementById('menuOverlay');
        const menuClose = document.getElementById('menuClose');
        const menuLinks = document.querySelectorAll('.menu-link');

        function toggleMenu() {
            const isOpen = menuOverlay.classList.contains('open');
            if (isOpen) {
                menuOverlay.classList.remove('open');
                menuBtn.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
                menuOverlay.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            } else {
                menuOverlay.classList.add('open');
                menuBtn.classList.add('active');
                menuBtn.setAttribute('aria-expanded', 'true');
                menuOverlay.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        }

        if (menuBtn && menuOverlay) {
            menuBtn.addEventListener('click', toggleMenu);
            
            // Close menu when close button is clicked
            if (menuClose) {
                menuClose.addEventListener('click', toggleMenu);
            }

            // Close if clicking the backdrop itself
            menuOverlay.addEventListener('click', (e) => {
                if (e.target === menuOverlay) toggleMenu();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && menuOverlay.classList.contains('open')) {
                    toggleMenu();
                }
            });

            menuLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (!href) return;

                    // Handle hash links on same page
                    if (href.startsWith('#')) {
                        e.preventDefault();
                        toggleMenu();
                        const target = document.querySelector(href);
                        if (target) target.scrollIntoView({ behavior: 'smooth' });
                        return;
                    }

                    // Handle links to other pages with hash
                    if (href.includes('#') && !href.startsWith(window.location.pathname.split('/').pop())) {
                        e.preventDefault();
                        toggleMenu();
                        document.documentElement.classList.add('page-exit');
                        setTimeout(() => { window.location.href = href; }, 420);
                        return;
                    }

                    // For links to different pages without hash
                    if (!href.startsWith(window.location.pathname.split('/').pop().split('#')[0])) {
                        e.preventDefault();
                        toggleMenu();
                        document.documentElement.classList.add('page-exit');
                        setTimeout(() => { window.location.href = href; }, 420);
                    }
                });
            });
        }
    }
})();
