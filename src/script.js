const menuButton = document.getElementById('menu-button');
const mobileMenu = document.getElementById('mobile-menu');
if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
        const expanded = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', String(!expanded));
        mobileMenu.classList.toggle('hidden');
    });
}

const form = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const messageError = document.getElementById('message-error');
const countEl = document.getElementById('message-count');
const submitBtn = document.getElementById('contact-submit');
const spinner = document.getElementById('submit-spinner');
const statusEl = document.getElementById('submit-status');

function setInvalid(input, errorEl, message) {
    input.setAttribute('aria-invalid', 'true');
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
}

function clearInvalid(input, errorEl) {
    input.setAttribute('aria-invalid', 'false');
    errorEl.classList.add('hidden');
}

function validateName() {
    const v = nameInput.value.trim();
    if (v.length < 2 || v.length > 60) {
        setInvalid(nameInput, nameError, 'Please enter 2–60 characters.');
        return false;
    }
    clearInvalid(nameInput, nameError);
    return true;
}

function validateEmail() {
    const v = emailInput.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(v)) {
        setInvalid(emailInput, emailError, 'Enter a valid email address.');
        return false;
    }
    clearInvalid(emailInput, emailError);
    return true;
}

function validateMessage() {
    const v = messageInput.value.trim();
    if (v.length < 10 || v.length > 500) {
        setInvalid(messageInput, messageError, 'Message must be 10–500 characters.');
        return false;
    }
    clearInvalid(messageInput, messageError);
    return true;
}

function updateCount() {
    const len = messageInput.value.length;
    countEl.textContent = `${len} / 500`;
}

if (form) {
    messageInput.addEventListener('input', updateCount);
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    messageInput.addEventListener('blur', validateMessage);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        statusEl.textContent = '';
        const ok = validateName() & validateEmail() & validateMessage();
        if (!ok) return;
        submitBtn.disabled = true;
        spinner.classList.remove('hidden');
        form.setAttribute('aria-busy', 'true');
        setTimeout(() => {
            spinner.classList.add('hidden');
            submitBtn.disabled = false;
            form.removeAttribute('aria-busy');
            statusEl.textContent = 'Message sent successfully!';
            statusEl.className = 'text-sm text-emerald-300';
            form.reset();
            updateCount();
        }, 1200);
    });

    updateCount();
}

(function () {
    const aboutA = document.getElementById('about-a');
    const aboutB = document.getElementById('about-b');
    const key = 'ab_about_variant';
    const qp = new URLSearchParams(location.search);
    const param = qp.get('variant');
    let v = (param && /about-(a|b)/.test(param)) ? param.split('-')[1] : localStorage.getItem(key);
    if (!v || !['a', 'b'].includes(v)) v = Math.random() < 0.5 ? 'a' : 'b';
    localStorage.setItem(key, v);
    if (aboutA && aboutB) {
        aboutA.classList.toggle('hidden', v !== 'a');
        aboutB.classList.toggle('hidden', v !== 'b');
        incMetric('impression', v);
    }

    function incMetric(type, variant) {
        const k = `ab_about_${type}_${variant}`;
        const n = parseInt(localStorage.getItem(k) || '0', 10) + 1;
        localStorage.setItem(k, String(n));
    }

    document.querySelectorAll('[data-about-cta]').forEach((btn) => {
        btn.addEventListener('click', () => incMetric('cta_click', v));
    });

    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.remove('opacity-0', 'translate-y-4');
                e.target.classList.add('opacity-100', 'translate-y-0');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('[data-animate]').forEach((el) => {
        el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-500');
        io.observe(el);
    });

    if (qp.get('debug_ab') === '1') {
        const panel = document.createElement('div');
        panel.className = 'fixed bottom-4 right-4 text-xs rounded-lg border border-white/10 bg-white/10 backdrop-blur p-3';
        const aImp = localStorage.getItem('ab_about_impression_a') || '0';
        const bImp = localStorage.getItem('ab_about_impression_b') || '0';
        const aCta = localStorage.getItem('ab_about_cta_click_a') || '0';
        const bCta = localStorage.getItem('ab_about_cta_click_b') || '0';
        panel.innerHTML = '<div class="font-medium mb-2">About A/B</div>' +
            `<div>A impressions: ${aImp}</div>` +
            `<div>B impressions: ${bImp}</div>` +
            `<div>A CTA clicks: ${aCta}</div>` +
            `<div>B CTA clicks: ${bCta}</div>`;
        document.body.appendChild(panel);
    }
})();

(function () {
    const duration = 650;
    const barId = 'scroll-progress';
    let bar = document.getElementById(barId);
    if (!bar) {
        bar = document.createElement('div');
        bar.id = barId;
        bar.className = 'fixed top-0 left-0 h-1 bg-indigo-500/80 w-0 z-50 pointer-events-none';
        document.body.appendChild(bar);
    }

    function ease(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function focusTarget(el) {
        let f = el;
        const lbl = el.getAttribute('aria-labelledby');
        if (lbl) {
            const h = document.getElementById(lbl);
            if (h) f = h;
        }
        const prev = f.getAttribute('tabindex');
        if (!prev) f.setAttribute('tabindex', '-1');
        f.focus({ preventScroll: true });
    }

    function animateTo(y, d) {
        const startY = window.pageYOffset;
        const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const endY = Math.min(Math.max(0, y), maxY);
        const dist = Math.abs(endY - startY);
        const dur = dist < 24 ? Math.max(120, d * 0.35) : d;
        if (dist < 2) return Promise.resolve();
        return new Promise((resolve) => {
            const t0 = performance.now();
            function step(t) {
                const p = Math.min(1, (t - t0) / dur);
                const e = ease(p);
                const cur = startY + (endY - startY) * e;
                window.scrollTo(0, cur);
                bar.style.width = `${Math.round(p * 100)}%`;
                if (p < 1) requestAnimationFrame(step);
                else {
                    bar.style.width = '0%';
                    resolve();
                }
            }
            requestAnimationFrame(step);
        });
    }

    function handle(e) {
        const a = e.currentTarget;
        const href = a.getAttribute('href') || '';
        if (!href.startsWith('#')) return;
        e.preventDefault();
        const hash = href === '#' ? '' : href.slice(1);
        const target = hash ? document.getElementById(hash) : document.body;
        if (!target) return;
        const rect = target.getBoundingClientRect();
        const y = rect.top + window.pageYOffset;
        animateTo(y, duration).then(() => {
            if (href === '#') {
                history.pushState(null, '', location.pathname);
            } else {
                history.pushState(null, '', `#${hash}`);
            }
            focusTarget(target);
        });
        const mm = document.getElementById('mobile-menu');
        const mb = document.getElementById('menu-button');
        if (mm && !mm.classList.contains('hidden')) {
            mm.classList.add('hidden');
            if (mb) mb.setAttribute('aria-expanded', 'false');
        }
    }

    const sels = ['nav a[href^="#"]', '#mobile-menu a[href^="#"]'];
    const anchors = document.querySelectorAll(sels.join(','));
    anchors.forEach((a) => {
        a.addEventListener('click', handle);
        a.addEventListener('touchstart', handle, { passive: false });
    });
})();

(function () {
    const duration = 500;

    function ease(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function getHeaderOffset() {
        const header = document.querySelector('header, nav');
        if (!header) return 0;
        const cs = window.getComputedStyle(header);
        const pos = cs.position;
        if (pos === 'fixed' || pos === 'sticky') {
            return header.offsetHeight || 0;
        }
        return 0;
    }

    function animateTo(y, d) {
        const startY = window.pageYOffset;
        const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const endY = Math.min(Math.max(0, y), maxY);
        const dist = Math.abs(endY - startY);
        const dur = dist < 24 ? Math.max(120, d * 0.35) : d;
        if (dist < 2) return Promise.resolve();
        return new Promise((resolve) => {
            const t0 = performance.now();
            function step(t) {
                const p = Math.min(1, (t - t0) / dur);
                const e = ease(p);
                const cur = startY + (endY - startY) * e;
                window.scrollTo(0, cur);
                if (p < 1) requestAnimationFrame(step);
                else resolve();
            }
            requestAnimationFrame(step);
        });
    }

    function focusTarget(el) {
        let f = el;
        const lbl = el.getAttribute('aria-labelledby');
        if (lbl) {
            const h = document.getElementById(lbl);
            if (h) f = h;
        }
        const prev = f.getAttribute('tabindex');
        if (!prev) f.setAttribute('tabindex', '-1');
        f.focus({ preventScroll: true });
    }

    const footer = document.querySelector('footer');
    if (!footer) return;
    footer.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (!a) return;
        const href = a.getAttribute('href') || '';
        if (!href.startsWith('#')) return;
        e.preventDefault();
        const hash = href === '#' ? '' : href.slice(1);
        const target = hash ? document.getElementById(hash) : document.body;
        if (!target) return;
        const rect = target.getBoundingClientRect();
        const offset = getHeaderOffset();
        const y = rect.top + window.pageYOffset - offset;
        animateTo(y, duration).then(() => {
            if (href === '#') {
                history.pushState(null, '', location.pathname);
            } else {
                history.pushState(null, '', `#${hash}`);
            }
            focusTarget(target);
        });
    });
})();

// ========== LOADING ANIMATION SYSTEM ==========
(function () {
    'use strict';

    // Track animated elements to prevent re-animation
    const animatedElements = new WeakSet();
    const animatedSections = new WeakSet();

    // Initialize page loader
    function initPageLoader() {
        const pageLoader = document.querySelector('.page-loader');
        if (pageLoader) {
            // Auto-hide after animations complete
            setTimeout(() => {
                pageLoader.style.display = 'none';
            }, 1500);
        }
    }

    // Animate elements with data-animate attribute - ONLY ONCE
    function animateElementsOnScroll() {
        const elementsToAnimate = document.querySelectorAll('[data-animate]');

        // Observer options
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        // Create intersection observer
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedElements.has(entry.target)) {
                    // Mark as animated to prevent re-animation
                    animatedElements.add(entry.target);
                    // Add animation class
                    entry.target.classList.add('animated');
                    // Unobserve after animation completes
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all elements
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }

    // Animate sections - ONLY ONCE
    function animateSectionsOnScroll() {
        const sections = document.querySelectorAll('section');

        const sectionObserverOptions = {
            threshold: 0.05,
            rootMargin: '0px 0px -50px 0px'
        };

        const sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedSections.has(entry.target)) {
                    // Mark as animated
                    animatedSections.add(entry.target);
                    // Add animation class
                    entry.target.classList.add('animated');
                    // Unobserve after animation
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, sectionObserverOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // Skeleton loader helper
    function createSkeletonLoader(type = 'card', count = 1) {
        const skeletons = [];
        for (let i = 0; i < count; i++) {
            const skeleton = document.createElement('div');
            skeleton.classList.add('skeleton', `skeleton-${type}`);
            skeletons.push(skeleton);
        }
        return skeletons;
    }

    // Show loading state for elements
    function showLoadingState(element) {
        element.classList.add('is-loading');
    }

    // Hide loading state and show element
    function hideLoadingState(element) {
        element.classList.remove('is-loading');
        element.classList.add('is-loaded');
    }

    // Stagger animation for list items
    function staggerElements(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const items = container.querySelectorAll('[data-animate]');
        items.forEach((item, index) => {
            item.style.setProperty('--animation-delay', `${index * 0.15}s`);
        });
    }

    // Initialize on DOM ready
    function init() {
        initPageLoader();
        animateElementsOnScroll();
        animateSectionsOnScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose utility functions globally
    window.LoadingAnimation = {
        createSkeletonLoader,
        showLoadingState,
        hideLoadingState,
        staggerElements,
        animateElementsOnScroll,
        animateSectionsOnScroll
    };
})();