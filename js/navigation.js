// Navigation functionality
const sections = document.querySelectorAll('.page-section');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

export function showSection(hash) {
    const targetHash = (hash === '' || hash === '#') ? '#home' : hash;
    sections.forEach(s => s.classList.toggle('active', `#${s.id}` === targetHash));
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === targetHash));
    mobileMenu.classList.add('hidden');
    window.scrollTo(0, 0);

    if (targetHash === '#directory') {
        // Handle map initialization if needed
    }
}

export function initializeNavigation() {
    navLinks.forEach(link => link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetHash = link.getAttribute('href');
        history.pushState(null, null, targetHash);
        showSection(targetHash);
    }));

    window.addEventListener('popstate', () => showSection(window.location.hash));
    mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
}