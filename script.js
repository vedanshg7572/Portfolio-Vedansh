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
       3D Hero Animation (Three.js)
       ========================================= */
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        canvasContainer.appendChild(renderer.domElement);

        // Group to hold our object
        const group = new THREE.Group();
        scene.add(group);

        // 1. Icosahedron (The "Core")
        const geometry = new THREE.IcosahedronGeometry(1.5, 1);

        // Wireframe Style
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x8b5cf6, // Violet
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
        group.add(wireframeMesh);

        // Particles on vertices
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = geometry.attributes.position.count;
        const posArray = new Float32Array(particlesCount * 3);

        // Copy vertex positions
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = geometry.attributes.position.array[i];
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.06,
            color: 0x22d3ee, // Cyan
            transparent: true,
            opacity: 0.9,
            map: null
        });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        group.add(particlesMesh);

        // 2. Floating Background Particles (Stars)
        const starGeo = new THREE.BufferGeometry();
        const starCount = 300;
        const starPos = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i++) {
            starPos[i] = (Math.random() - 0.5) * 30; // Wide spread
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({
            size: 0.03,
            color: 0xec4899, // Pink accents
            transparent: true,
            opacity: 0.3
        });
        const starMesh = new THREE.Points(starGeo, starMat);
        scene.add(starMesh);

        // Add a second wireframe for depth (Cyan)
        const innerGeo = new THREE.IcosahedronGeometry(1.0, 0);
        const innerMat = new THREE.MeshBasicMaterial({
            color: 0x22d3ee,
            wireframe: true,
            transparent: true,
            opacity: 0.05
        });
        const innerMesh = new THREE.Mesh(innerGeo, innerMat);
        group.add(innerMesh);

        camera.position.z = 5;

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Animation Loop
        const clock = new THREE.Clock();

        const animate = () => {
            const elapsedTime = clock.getElapsedTime();

            // Rotate the main group (Core)
            group.rotation.y = elapsedTime * 0.1;
            group.rotation.x = Math.sin(elapsedTime * 0.2) * 0.2;

            // Parallax the group based on mouse
            group.rotation.y += mouseX * 0.1;
            group.rotation.x += mouseY * 0.1;

            // Subtle breathing effect
            const scale = 1 + Math.sin(elapsedTime * 0.5) * 0.05;
            group.scale.set(scale, scale, scale);

            // Rotate background stars slowly
            starMesh.rotation.y = elapsedTime * 0.02;

            renderer.render(scene, camera);
            window.requestAnimationFrame(animate);
        };

        animate();

        // Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Theme update listener
        const updateColors = () => {
            const isDark = document.body.classList.contains('dark-mode');
            if (isDark) {
                wireframeMaterial.color.setHex(0x8b5cf6); // Violet
                particlesMaterial.color.setHex(0x22d3ee); // Cyan
                starMat.color.setHex(0xec4899); // Pink
                innerMat.color.setHex(0x22d3ee);
            } else {
                wireframeMaterial.color.setHex(0x2563eb);
                particlesMaterial.color.setHex(0x2563eb);
                starMat.color.setHex(0x94a3b8);
                innerMat.color.setHex(0x2563eb);
            }
        };

        // Initial check
        if (document.body.classList.contains('dark-mode')) updateColors();

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                setTimeout(updateColors, 100);
            });
        }
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
