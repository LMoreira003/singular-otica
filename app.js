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
        entranceObserver.observe(elem);
    });

    // Observa seções, títulos e cartões para efeito fade-in up
    const sectionElements = document.querySelectorAll(".section-tag, .section-title, .collection-card, .manifesto-item");
    sectionElements.forEach(el => {
        el.classList.add("fade-in");
        entranceObserver.observe(el);
    });


    // ==========================================================================
    // 5. LÓGICA DO SIMULADOR DE LENTES AUTOMATIZADO (AUTOPLAY LOOP - REALISTA)
    // ==========================================================================
    const lensStates = [
        {
            title: "Lente Padrão",
            desc: "Lente de grau comum, sem tratamentos ou filtros adicionais.",
            filterClass: "",
            statusLabel: "Lente Padrão"
        },
        {
            title: "Filtro de Luz Azul",
            desc: "Reduz o excesso de luz azul emitida por telas digitais, ajudando a diminuir a fadiga ocular no computador ou celular.",
            filterClass: "blue-filter",
            statusLabel: "Filtro de Luz Azul Ativado"
        },
        {
            title: "Lente Polarizada",
            desc: "Filtra reflexos intensos em superfícies horizontais, útil para dirigir em asfalto molhado ou diminuir o brilho da luz do sol.",
            filterClass: "polarized-filter",
            statusLabel: "Lente Polarizada Ativada"
        },
        {
            title: "Lente Fotocromática",
            desc: "Lentes que se adaptam à claridade do ambiente, escurecendo gradualmente quando expostas aos raios UV ao ar livre.",
            filterClass: "photo-filter",
            statusLabel: "Lente Fotocromática Ativada"
        }
    ];

    let currentLensIndex = 0;
    let autoplayTimer = null;
    const autoplayIntervalMs = 4500; // Tempo de exibição de cada lente

    const autoLensWindow = document.getElementById("auto-lens-window");
    const lensDisplayTitle = document.getElementById("lens-display-title");
    const lensDisplayDesc = document.getElementById("lens-display-desc");
    const lensStatusLabel = document.getElementById("lens-status-label");
    const indicatorDots = document.querySelectorAll("#lens-dots .dot");

    function updateLensSimulator(index) {
        if (!autoLensWindow) return;

        currentLensIndex = index;
        const state = lensStates[index];

        // 1. Atualizar as classes de filtro no vidro da lente
        autoLensWindow.className = "lens-window"; // reseta
        if (state.filterClass) {
            autoLensWindow.classList.add(state.filterClass);
        }

        // 2. Atualizar textos com uma sutil animação de transição de opacidade
        if (lensDisplayTitle && lensDisplayDesc) {
            // Efeito fade-out rápido
            lensDisplayTitle.style.opacity = "0.2";
            lensDisplayDesc.style.opacity = "0.2";
            
            setTimeout(() => {
                lensDisplayTitle.textContent = state.title;
                lensDisplayDesc.textContent = state.desc;
                lensStatusLabel.textContent = state.statusLabel;
                
                // Retorna opacidade
                lensDisplayTitle.style.opacity = "1";
                lensDisplayDesc.style.opacity = "1";
            }, 250);
        } else {
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

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
            let nextIndex = (currentLensIndex + 1) % lensStates.length;
            updateLensSimulator(nextIndex);
        }, autoplayIntervalMs);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
        }
    }

    // Inicializa o simulador e inicia o autoplay
    if (autoLensWindow) {
        // Estilos CSS inline básicos para transições dos textos
        if (lensDisplayTitle && lensDisplayDesc) {
            lensDisplayTitle.style.transition = "opacity 0.25s ease";
            lensDisplayDesc.style.transition = "opacity 0.25s ease";
        }
        
        updateLensSimulator(0);
        startAutoplay();

        // Permite ao usuário clicar nos pontinhos para inspecionar, resetando o timer
        indicatorDots.forEach((dot, idx) => {
            dot.addEventListener("click", () => {
                updateLensSimulator(idx);
                startAutoplay(); // Reinicia o timer para dar tempo ao usuário ler
            });
        });
    }
});
