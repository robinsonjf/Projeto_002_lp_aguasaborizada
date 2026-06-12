/* ============================================================
   AQUA CAROLINE — script.js
   - Navbar scroll / active links
   - Mobile menu
   - Flavor switcher (interactive section)
   - Can label update
   - Phone mask
   - Form validation + submit via fetch
   - Scroll-reveal (Intersection Observer)
   ============================================================ */

'use strict';

// ─── DOM Refs ──────────────────────────────────────────────
const header       = document.getElementById('header');
const menuToggle   = document.getElementById('menuToggle');
const navMenu      = document.getElementById('navMenu');
const flavorPills  = document.querySelectorAll('.flavor-pill');
const flavorsBg    = document.getElementById('flavorsBg');
const flavorGlow   = document.getElementById('flavorGlow');
const flavorBadge  = document.getElementById('flavorBadge');
const flavorTitle  = document.getElementById('flavorTitle');
const flavorDesc   = document.getElementById('flavorDescription');
const nutriCal     = document.getElementById('nutri-cal');
const nutriCarb    = document.getElementById('nutri-carb');
const nutriVit     = document.getElementById('nutri-vit');
const canMockup    = document.getElementById('canMockup');
const canFlavorText= document.getElementById('canFlavorText');
const canBody      = canMockup ? canMockup.querySelector('.can-body') : null;
const leadForm     = document.getElementById('leadForm');
const submitBtn    = document.getElementById('submitBtn');
const formSuccess  = document.getElementById('formSuccess');
const successMsg   = document.getElementById('successMsg');
const celularInput = document.getElementById('celular');
const navLinks     = document.querySelectorAll('.nav-link');

// ─── Navbar — shrink on scroll ─────────────────────────────
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    updateActiveNav();
});

// ─── Mobile menu toggle ────────────────────────────────────
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const icon = menuToggle.querySelector('i');
        icon.className = navMenu.classList.contains('open')
            ? 'fa-solid fa-xmark'
            : 'fa-solid fa-bars';
    });
}

// Close menu on link click (mobile)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.querySelector('i').className = 'fa-solid fa-bars';
    });
});

// ─── Active nav link on scroll ─────────────────────────────
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
        const sTop = section.offsetTop;
        const sH   = section.offsetHeight;
        const id   = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            if (scrollY >= sTop && scrollY < sTop + sH) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

// ─── Flavor Switcher ───────────────────────────────────────
const canGradients = {
    lime:       'linear-gradient(160deg, #0f7a5a 0%, #10b981 35%, #34d399 55%, #0f7a5a 100%)',
    strawberry: 'linear-gradient(160deg, #7f1d1d 0%, #ef4444 35%, #fb7185 55%, #7f1d1d 100%)',
    passion:    'linear-gradient(160deg, #7c2d12 0%, #f97316 35%, #fbbf24 55%, #7c2d12 100%)',
};

function switchFlavor(pill) {
    // Update pills
    flavorPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const { flavor, name, desc, cal, carb, vit, tag, bg1, bg2, accent } = pill.dataset;

    // Bg gradient of section
    if (flavorsBg) {
        flavorsBg.style.background = `linear-gradient(135deg, ${bg1} 0%, ${bg2} 100%)`;
    }

    // Card glow
    if (flavorGlow) flavorGlow.style.background = accent;

    // Detail card content — animate out/in
    const targets = [flavorTitle, flavorDesc, flavorBadge, nutriCal, nutriCarb, nutriVit];
    targets.forEach(el => { if (el) { el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; } });

    setTimeout(() => {
        if (flavorBadge)  flavorBadge.textContent     = tag;
        if (flavorTitle)  flavorTitle.textContent      = name;
        if (flavorDesc)   flavorDesc.textContent       = desc;
        if (nutriCal)     nutriCal.textContent         = cal;
        if (nutriCarb)    nutriCarb.textContent        = carb + 'g';
        if (nutriVit)     nutriVit.textContent         = vit + '%';

        targets.forEach(el => {
            if (el) {
                el.style.transition = 'opacity .35s ease, transform .35s ease';
                el.style.opacity    = '1';
                el.style.transform  = 'none';
            }
        });
    }, 200);

    // Update can label & gradient
    if (canFlavorText) canFlavorText.textContent = name;
    if (canBody) {
        canBody.style.transition = 'background 0.7s ease';
        canBody.style.background = canGradients[flavor] || canGradients.lime;
    }
}

flavorPills.forEach(pill => {
    pill.addEventListener('click', () => switchFlavor(pill));
});

// ─── Phone mask (Brazilian format) ────────────────────────
if (celularInput) {
    celularInput.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 10) {
            v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
        } else if (v.length > 6) {
            v = `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
        } else if (v.length > 2) {
            v = `(${v.slice(0,2)}) ${v.slice(2)}`;
        } else if (v.length > 0) {
            v = `(${v}`;
        }
        e.target.value = v;
    });
}

// ─── Form Validation ───────────────────────────────────────
function showError(fieldId, msg) {
    const group = document.getElementById(`group-${fieldId}`);
    const error = document.getElementById(`error-${fieldId}`);
    if (group) group.classList.add('has-error');
    if (error) error.textContent = msg;
}

function clearError(fieldId) {
    const group = document.getElementById(`group-${fieldId}`);
    const error = document.getElementById(`error-${fieldId}`);
    if (group) group.classList.remove('has-error');
    if (error) error.textContent = '';
}

function validateForm(nome, email, celular) {
    let valid = true;

    if (!nome || nome.trim().length < 3) {
        showError('nome', 'Por favor, informe seu nome completo (mínimo 3 caracteres).');
        valid = false;
    } else {
        clearError('nome');
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRe.test(email.trim())) {
        showError('email', 'Por favor, informe um e-mail válido.');
        valid = false;
    } else {
        clearError('email');
    }

    const digits = celular.replace(/\D/g, '');
    if (!celular || digits.length < 10) {
        showError('celular', 'Por favor, informe um número de celular válido (DDD + número).');
        valid = false;
    } else {
        clearError('celular');
    }

    return valid;
}

// ─── Form Submit ───────────────────────────────────────────
if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome    = document.getElementById('nome').value;
        const email   = document.getElementById('email').value;
        const celular = document.getElementById('celular').value;

        if (!validateForm(nome, email, celular)) return;

        // Loading state
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-label').style.display  = 'none';
        submitBtn.querySelector('.btn-loading').style.display = 'flex';

        try {
            const res = await fetch('/reservar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: nome.trim(), email: email.trim(), celular: celular.trim() })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Show success
                leadForm.style.display = 'none';
                if (successMsg) successMsg.textContent = data.message;
                if (formSuccess) formSuccess.style.display = 'block';
            } else {
                // Restore button and show server error
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-label').style.display  = 'flex';
                submitBtn.querySelector('.btn-loading').style.display = 'none';
                alert(data.message || 'Ocorreu um erro. Tente novamente.');
            }
        } catch (err) {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-label').style.display  = 'flex';
            submitBtn.querySelector('.btn-loading').style.display = 'none';
            alert('Erro de conexão. Verifique sua internet e tente novamente.');
            console.error('Erro no envio:', err);
        }
    });

    // Real-time clear errors on input
    ['nome', 'email', 'celular'].forEach(fieldId => {
        const el = document.getElementById(fieldId);
        if (el) el.addEventListener('input', () => clearError(fieldId));
    });
}

// ─── Scroll Reveal (Intersection Observer) ─────────────────
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

// ─── Init ──────────────────────────────────────────────────
// Trigger reveal for elements already in viewport on load
setTimeout(() => {
    revealEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('visible');
        }
    });
}, 100);

updateActiveNav();
