document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       Mobile Navigation Toggle
       ========================================= */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    /* =========================================
       Sticky Navbar Shadow on Scroll
       ========================================= */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.1)";
        } else {
            navbar.style.boxShadow = "0 1px 3px rgba(0,0,0,0.12)";
        }
    });

    /* =========================================
       Smooth Scroll
       ========================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    /* =========================================
       Scroll Animations (Intersection Observer)
       ========================================= */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    /* =========================================
       Typing Effect
       ========================================= */
    const typingTextElement = document.getElementById('typing-text');
    const textsToType = [
        "CSE Student",
        "Java Developer",
        "DSA Enthusiast",
        "Cloud Computing Learner"
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentText = textsToType[textIndex];

        if (isDeleting) {
            typingTextElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Faster deletion
        } else {
            typingTextElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; // Normal typing speed
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textsToType.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    if (typingTextElement) {
        type();
    }

    /* =========================================
       Theme Toggle
       ========================================= */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Check for saved user preference, if any, on load of the website
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme == "dark") {
        document.body.classList.add("dark-mode");
        if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else if (currentTheme == "light") {
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

            // Re-init particles to update colors
            if (typeof initParticles === 'function') initParticles();
        });
    }

    /* =========================================
       Canvas Particle Animation
       ========================================= */
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1; // Size between 1 and 3
                this.speedX = Math.random() * 1.5 - 0.75; // Speed between -0.75 and 0.75
                this.speedY = Math.random() * 1.5 - 0.75;

                // Dynamic color based on theme
                const isDark = document.body.classList.contains('dark-mode');
                // Blue in light mode, Lighter Blue/Cyan in dark mode for visibility
                this.color = isDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(37, 99, 235, 0.3)';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges
                if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        window.initParticles = function () {
            particlesArray = [];
            const numberOfParticles = (canvas.width * canvas.height) / 15000; // Density
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();

                // Draw connections
                for (let j = i; j < particlesArray.length; j++) {
                    const dx = particlesArray[i].x - particlesArray[j].x;
                    const dy = particlesArray[i].y - particlesArray[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        const isDark = document.body.classList.contains('dark-mode');
                        const r = isDark ? 96 : 37;
                        const g = isDark ? 165 : 99;
                        const b = isDark ? 250 : 235;

                        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.1 - distance / 1000})`; // Fade out with distance
                        ctx.lineWidth = 1;
                        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }
});
