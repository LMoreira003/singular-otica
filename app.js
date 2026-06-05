document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializa os ícones do Lucide
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    // 2. Interatividade da Navbar no Scroll
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 3. Menu Mobile Toggle
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    
    if (navToggle) {
        navToggle.addEventListener("click", () => {
            navbar.classList.toggle("nav-active");
        });
    }

    // Fecha o menu móvel ao clicar em qualquer link
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navbar.classList.remove("nav-active");
        });
    });

    // 4. Animações de Entrada (Scroll Entrance)
    const fadeElements = document.querySelectorAll(".fade-in");
    const observerOptions = {
        root: null, // viewport
        threshold: 0.1, // 10% do elemento visível
        rootMargin: "0px 0px -50px 0px"
    };

    const entranceObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("appear");
                observer.unobserve(entry.target); // para de observar após animar
            }
        });
    }, observerOptions);

    fadeElements.forEach(elem => {
        if (elem.getBoundingClientRect().top < window.innerHeight) {
            elem.classList.add("appear");
        }
        entranceObserver.observe(elem);
    });

    // Observa seções, títulos e cartões para efeito fade-in up
    const sectionElements = document.querySelectorAll(".section-tag, .section-title, .collection-card, .manifesto-item");
    sectionElements.forEach(el => {
        el.classList.add("fade-in");
        if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add("appear");
        }
        entranceObserver.observe(el);
    });


    // ==========================================================================
    // 5. LÓGICA DO SIMULADOR DE LENTES AUTOMATIZADO
    // ==========================================================================
    const lensStates = [
        {
            title: "Lente Padrão",
            desc: "Uma base neutra para comparar nitidez, reflexos e conforto visual antes de aplicar tratamentos.",
            filterClass: "",
            statusLabel: "Visão natural"
        },
        {
            title: "Filtro de Luz Azul",
            desc: "Aquece levemente a imagem e ajuda a reduzir o incômodo de telas, mantendo a leitura confortável no dia a dia.",
            filterClass: "blue-filter",
            statusLabel: "Mais conforto em telas"
        },
        {
            title: "Lente Polarizada",
            desc: "Corta reflexos fortes e deixa a cena mais definida, especialmente em direção, rua molhada e luz intensa.",
            filterClass: "polarized-filter",
            statusLabel: "Reflexos sob controle"
        },
        {
            title: "Lente Fotocromática",
            desc: "Escurece a visão quando há muita claridade e volta ao natural em ambientes internos, sem trocar de armação.",
            filterClass: "photo-filter",
            statusLabel: "Adaptação à luz"
        }
    ];

    let currentLensIndex = 0;
    let autoplayTimer = null;
    const autoplayIntervalMs = 1800; // Tempo de exibição de cada lente
    const firstAutoplayDelayMs = 800;

    const lensWindows = document.querySelectorAll(".js-lens-window");
    const lensDisplayTitle = document.getElementById("lens-display-title");
    const lensDisplayDesc = document.getElementById("lens-display-desc");
    const lensStatusLabel = document.getElementById("lens-status-label");
    const indicatorDots = document.querySelectorAll("#lens-dots .dot");

    function updateLensSimulator(index) {
        if (!lensWindows.length) return;

        currentLensIndex = index;
        const state = lensStates[index];

        // 1. Atualizar as classes de filtro na visão dentro das lentes
        lensWindows.forEach((lensWindow) => {
            lensWindow.className = "lens-vision js-lens-window";
            if (state.filterClass) {
                lensWindow.classList.add(state.filterClass);
            }
        });

        // 2. Atualizar textos junto com o filtro ativo
        if (lensDisplayTitle) {
            lensDisplayTitle.textContent = state.title;
        }

        if (lensDisplayDesc) {
            lensDisplayDesc.textContent = state.desc;
        }

        if (lensStatusLabel) {
            lensStatusLabel.textContent = state.statusLabel;
        }

        // 3. Atualizar as bolinhas indicadoras ativas
        indicatorDots.forEach((dot, idx) => {
            if (idx === index) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    }

    function advanceLens() {
        let nextIndex = (currentLensIndex + 1) % lensStates.length;
        updateLensSimulator(nextIndex);
        startAutoplay();
    }

    function startAutoplay(delay = autoplayIntervalMs) {
        stopAutoplay();
        autoplayTimer = setTimeout(advanceLens, delay);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearTimeout(autoplayTimer);
            autoplayTimer = null;
        }
    }

    // Inicializa o simulador e inicia o autoplay
    if (lensWindows.length) {
        updateLensSimulator(0);
        startAutoplay(firstAutoplayDelayMs);

        // Permite ao usuário clicar nos pontinhos para inspecionar, resetando o timer
        indicatorDots.forEach((dot, idx) => {
            dot.addEventListener("click", () => {
                updateLensSimulator(idx);
                startAutoplay(); // Reinicia o timer para dar tempo ao usuário ler
            });
        });
    }
});
