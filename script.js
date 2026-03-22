document.addEventListener("DOMContentLoaded", () => {
    
    // --- Custom Cursor ---
    const cursorDot = document.getElementById("cursor-dot");
    const cursorOutline = document.getElementById("cursor-outline");


    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    if (!isTouchDevice) {
        window.addEventListener("mousemove", (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover effects for links and buttons
        const hoverables = document.querySelectorAll("a, button, .tilt-element, .hex-item, .bento-card");
        hoverables.forEach(el => {
            el.addEventListener("mouseenter", () => {
                document.body.classList.add("hover-cursor");
            });
            el.addEventListener("mouseleave", () => {
                document.body.classList.remove("hover-cursor");
            });
        });
    }

    // --- Background Canvas Matrix/Nodes Effect ---
    const canvas = document.getElementById("bg-canvas");
    const ctx = canvas.getContext("2d");
    let width, height;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const particles = [];
    const particleCount = 60;
    const connectionDistance = 150;

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 240, 255, 0.5)";
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 240, 255, ${1 - distance/connectionDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // --- Typing Effect ---
    const words = ["Developer", "System Analyst", "Problem Solver", "Tech Enthusiast"];
    let i = 0;
    let timer;

    function typingEffect() {
        const word = words[i].split("");
        const typingEl = document.getElementById("typing-text");
        
        var loopTyping = function() {
            if (word.length > 0) {
                typingEl.innerHTML += word.shift();
            } else {
                setTimeout(deletingEffect, 2000);
                return;
            }
            timer = setTimeout(loopTyping, 100);
        };
        loopTyping();
    }

    function deletingEffect() {
        const typingEl = document.getElementById("typing-text");
        const word = words[i].split("");
        
        var loopDeleting = function() {
            if (word.length > 0) {
                word.pop();
                typingEl.innerHTML = word.join("");
            } else {
                if (words.length > (i + 1)) {
                    i++;
                } else {
                    i = 0;
                }
                setTimeout(typingEffect, 500);
                return;
            }
            timer = setTimeout(loopDeleting, 50);
        };
        loopDeleting();
    }
    typingEffect();

    // --- Scroll Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animate stats
                if (entry.target.classList.contains('about-grid')) {
                    const stats = document.querySelectorAll('.stat-num');
                    stats.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'));
                        if(!target) return;
                        let count = 0;
                        const updateCount = () => {
                            const inc = target / 20;
                            if (count < target) {
                                count += inc;
                                stat.innerText = Math.ceil(count);
                                setTimeout(updateCount, 50);
                            } else {
                                stat.innerText = target;
                            }
                        };
                        updateCount();
                    });
                }
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .about-grid');
    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Navbar Stickiness & Link Highlighting ---
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('nav-active');
        menuToggle.classList.toggle('toggle');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(navMenu.classList.contains('nav-active')) {
                navMenu.classList.remove('nav-active');
                menuToggle.classList.remove('toggle');
            }
        });
    });

    // --- 3D Tilt Effect for specific elements ---
    if (!isTouchDevice) {
        const tiltCards = document.querySelectorAll('.tilt-element');
        tiltCards.forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -15; // Max 15 degree rotation
                const rotateY = ((x - centerX) / centerX) * 15;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                card.style.transition = `none`;
            });
            
            card.addEventListener("mouseleave", () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                card.style.transition = `transform 0.5s ease`;
            });
        });
    }
});
