document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functions
    loadPremiumEvents();
    initScrollAnimations();
    setupMobileMenu(); // Updated logic below
    setupNavbarScroll();
});

/**
 * 1. DYNAMIC DATA LOADING (JSON)
 */
async function loadPremiumEvents() {
    const grid = document.getElementById('events-grid');
    if (!grid) return;

    try {
        const response = await fetch('data/data.json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        grid.innerHTML = ''; 

        data.events.forEach(event => {
            const card = document.createElement('div');
            card.className = 'event-card-gold';
            card.innerHTML = `
                <div class="event-date-badge">${event.date_short}</div>
                <div class="event-info">
                    <h3 class="green-text">${event.title}</h3>
                    <p style="margin: 15px 0; color: #555; font-size: 0.9rem;">${event.description}</p>
                    <hr style="border:0; border-top: 1px solid #f1f1f1; margin-bottom: 15px;">
                    <span class="gold-text" style="font-weight:bold; cursor:pointer; font-size: 0.8rem; letter-spacing: 1px;">
                        REQUEST INVITATION →
                    </span>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Data Load Error:", error);
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; border: 1px dashed #d4af37;">
                <p class="gold-text">Our calendar is being updated with fresh seasonal events. Please check back shortly.</p>
            </div>
        `;
    }
}

/**
 * 2. SCROLL REVEAL ENGINE
 */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.pillar-item, .value-card, .dept-box, .pastor-text, .gold-frame');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(40px)";
        el.style.transition = "all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)";
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.innerHTML = `
        .active-reveal {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * 3. NAVBAR SCROLL EFFECT
 */
function setupNavbarScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = "5px 0";
            header.style.background = "rgba(255, 255, 255, 0.98)";
            header.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
        } else {
            header.style.padding = "15px 0";
            header.style.background = "#fff";
            header.style.boxShadow = "none";
        }
    });
}

/**
 * 4. MOBILE MENU HANDLER (Dynamic Creation)
 * This logic creates the hamburger button and handles the toggle
 * so you don't have to change your index.html further.
 */
function setupMobileMenu() {
    const navFlex = document.querySelector('.nav-flex');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navFlex || !navLinks) return;

    // Create the hamburger button element
    const burger = document.createElement('div');
    burger.className = 'hamburger-menu';
    burger.innerHTML = `
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
    `;

    // Insert burger before the nav-links
    navFlex.insertBefore(burger, navLinks);

    // Toggle Menu on Click
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        burger.classList.toggle('toggle-icon');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            burger.classList.remove('toggle-icon');
        });
    });
}