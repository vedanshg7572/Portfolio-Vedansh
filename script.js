document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       Cursor Magic (Smooth Trail + Magnet)
       ========================================= */
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    // Mouse movement updates target position
    window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Dot follows instantly (centered)
        cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`; // -4 is half width
    });

    // Smooth trailing animation loop
    function animateCursor() {
        const speed = 0.15; // Delay factor

        outlineX += (mouseX - outlineX) * speed;
        outlineY += (mouseY - outlineY) * speed;

        // Outline follows with lag (centered)
        cursorOutline.style.transform = `translate(${outlineX - 20}px, ${outlineY - 20}px)`; // -20 is half width

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover Effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, .contact-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });

    // Magnetic Effect (Enhanced)
    const magnetButtons = document.querySelectorAll('.magnet-effect');
    magnetButtons.forEach(btn => {
        btn.addEventListener('mousemove', function (e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Move button towards mouse
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;

            // Optional: Move cursor outline slightly to emphasize pull (magnet feel)
            // But we keep it simple to avoid conflict with trail loop
        });

        btn.addEventListener('mouseleave', function () {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // Card Spotlight Effect
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });


    /* =========================================
       3D Hero Animation (Three.js) - Liquid Tech Sculpture
       ========================================= */
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
        // Scene setup
        const scene = new THREE.Scene();
        // Fog for depth fading
        scene.fog = new THREE.FogExp2(0x020617, 0.02);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.outputEncoding = THREE.sRGBEncoding;
        canvasContainer.appendChild(renderer.domElement);

        // --- 1. The Tech Sculpture (Black Obsidian) ---
        /* =========================================
           3D Fullscreen Background - Dark Particle Sea
           ========================================= */
        const canvasContainer = document.getElementById('canvas-container');
        if (canvasContainer) {
            // Scene setup
            const scene = new THREE.Scene();
            // Deep Black Fog to blend distance
            scene.fog = new THREE.FogExp2(0x000000, 0.002);

            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
            camera.position.z = 1000;
            camera.position.y = 200; // Elevated view

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false }); // Antialias off for performance
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            canvasContainer.appendChild(renderer.domElement);

            // --- Particle Sea ---
            const particleCount = 2000; // High count for density
            const particlesGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const scales = new Float32Array(particleCount);

            // Separation variables
            const sepX = 80;
            const sepZ = 80;

            let i = 0;
            // Create a grid of particles
            // Approx 45x45 grid = ~2000 points.

            for (let ix = 0; ix < 50; ix++) {
                for (let iy = 0; iy < 50; iy++) {
                    const x = ix * sepX - ((50 * sepX) / 2); // Center it
                    const z = iy * sepZ - ((50 * sepZ) / 2);
                    const y = 0;

                    positions[i * 3] = x;
                    positions[i * 3 + 1] = y;
                    positions[i * 3 + 2] = z;

                    scales[i] = 1;

                    i++;
                }
            }

            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

            const material = new THREE.PointsMaterial({
                color: 0xaaaaaa, // Light Gray/White
                size: 3,
                transparent: true,
                opacity: 0.6,
                sizeAttenuation: true
            });

            const particles = new THREE.Points(particlesGeometry, material);
            scene.add(particles);

            // Mouse Interactivity
            let mouseX = 0;
            let mouseY = 0;
            let windowHalfX = window.innerWidth / 2;
            let windowHalfY = window.innerHeight / 2;

            document.addEventListener('mousemove', (event) => {
                mouseX = event.clientX - windowHalfX;
                mouseY = event.clientY - windowHalfY;
            });

            // Resize
            window.addEventListener('resize', () => {
                windowHalfX = window.innerWidth / 2;
                windowHalfY = window.innerHeight / 2;
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

            // Animation
            let countTick = 0;

            const animate = () => {
                requestAnimationFrame(animate);

                // Camera subtle movement
                camera.position.x += (mouseX - camera.position.x) * 0.02;
                camera.position.y += (-mouseY + 200 - camera.position.y) * 0.02;
                camera.lookAt(scene.position);

                const positions = particles.geometry.attributes.position.array;

                // Wave Logic
                let i = 0;
                for (let ix = 0; ix < 50; ix++) {
                    for (let iy = 0; iy < 50; iy++) {
                        // Sine wave based on position and time
                        const x = ix * sepX - ((50 * sepX) / 2);
                        const z = iy * sepZ - ((50 * sepZ) / 2);

                        // Complex wave equation
                        const y = (Math.sin((ix + countTick) * 0.3) * 50) +
                            (Math.sin((iy + countTick) * 0.5) * 50);

                        positions[i * 3 + 1] = y;
                        i++;
                    }
                }

                particles.geometry.attributes.position.needsUpdate = true;
                countTick += 0.05; // Speed

                renderer.render(scene, camera);
            };

            animate();
        }      // Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            updateLayout();
        });
    }

    /* =========================================
       Mobile Nav & Other Utilities
       ========================================= */
    // (Keeping existing logic for nav, scroll, etc.)

    // Mobile Navigation
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // Sticky Navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.1)";
            navbar.classList.add('scrolled');
        } else {
            navbar.style.boxShadow = "none";
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });

    // Scroll Animations
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // Theme Toggle (Existing logic refined)
    const themeToggleBtn = document.getElementById('theme-toggle');

    // Default to dark mode if no preference
    const currentTheme = localStorage.getItem("theme");
    if (!currentTheme || currentTheme === "dark") {
        document.body.classList.add("dark-mode");
        if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove("dark-mode");
        if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
            let theme = "light";
            if (document.body.classList.contains("dark-mode")) {
                theme = "dark";
                this.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                this.innerHTML = '<i class="fas fa-moon"></i>';
            }
            localStorage.setItem("theme", theme);
        });
    }
});
