document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       Cursor Magic
       ========================================= */
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    // Mouse movement
    window.addEventListener('mousemove', function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with lag (animation in CSS or simple lerp here)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

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

    // Magnetic Effect for Buttons
    const magnetButtons = document.querySelectorAll('.magnet-effect');
    magnetButtons.forEach(btn => {
        btn.addEventListener('mousemove', function (e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
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

        // --- 1. The Tech Sculpture (Torus Knot) ---
        const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 150, 20);

        // Liquid/Glass Material
        const material = new THREE.MeshPhysicalMaterial({
            color: 0x3b82f6,      // Blue-ish base
            metalness: 0.9,       // Very metallic
            roughness: 0.1,       // Very smooth
            transmission: 0.0,    // Solid metal
            clearcoat: 1.0,       // High polish
            clearcoatRoughness: 0.0,
            emissive: 0x1e1b4b,   // Slight deep glow
            emissiveIntensity: 0.2
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // --- 2. Wireframe Overlay (Tech Feel) ---
        const wireGeo = new THREE.TorusKnotGeometry(1.21, 0.41, 150, 20); // Slightly larger
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0x22d3ee, // Cyan Neon
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        const wireMesh = new THREE.Mesh(wireGeo, wireMat);
        scene.add(wireMesh);

        // --- 3. Lighting (Cinematic) ---
        const ambientLight = new THREE.AmbientLight(0x020617, 1.0);
        scene.add(ambientLight);

        // Main Key Light (Blue/Violet)
        const spotLight = new THREE.SpotLight(0x8b5cf6, 10);
        spotLight.position.set(5, 10, 5);
        spotLight.angle = Math.PI / 4;
        spotLight.penumbra = 0.5;
        scene.add(spotLight);

        // Rim Light (Cyan)
        const rimLight = new THREE.PointLight(0x22d3ee, 5);
        rimLight.position.set(-5, 5, -5);
        scene.add(rimLight);

        // Fill Light (Pink)
        const fillLight = new THREE.PointLight(0xec4899, 2);
        fillLight.position.set(0, -5, 5);
        scene.add(fillLight);

        // Camera Positioning (Look slightly right)
        camera.position.z = 6;

        // Adjust object position based on screen width
        // Move object to the right for desktop, center for mobile
        function updateLayout() {
            if (window.innerWidth > 1024) {
                mesh.position.x = 2.5;
                wireMesh.position.x = 2.5;
            } else {
                mesh.position.x = 0;
                wireMesh.position.x = 0;
            }
        }
        updateLayout();

        // Mouse Interaction
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        // Window half
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX) * 0.001;
            mouseY = (event.clientY - windowHalfY) * 0.001;
        });

        // Animation Loop
        const clock = new THREE.Clock();

        const animate = () => {
            const time = clock.getElapsedTime();

            // Smooth mouse follow
            targetX = mouseX * 0.5;
            targetY = mouseY * 0.5;

            // 1. Rotation (Continuous + Mouse)
            // Main rotation
            mesh.rotation.x += 0.002;
            mesh.rotation.y += 0.005;
            wireMesh.rotation.x += 0.002;
            wireMesh.rotation.y += 0.005;

            // Parallax Tilt based on mouse
            mesh.rotation.x += (mouseY - mesh.rotation.x) * 0.05;
            mesh.rotation.y += (mouseX - mesh.rotation.y) * 0.05;

            // 2. Floating (Levitation)
            const floatY = Math.sin(time * 0.8) * 0.2; // Move up and down
            const baseY = 0; // Center Y

            // Apply layout X position plus float
            if (window.innerWidth > 1024) {
                mesh.position.y = baseY + floatY;
                wireMesh.position.y = baseY + floatY;
            } else {
                mesh.position.y = baseY + floatY;
                wireMesh.position.y = baseY + floatY;
            }

            renderer.render(scene, camera);
            window.requestAnimationFrame(animate);
        };

        animate();

        // Resize
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
