/**
 * Skoop Agent Digital Signage Application
 * "Hello World" around the globe
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const timeDisplay = document.getElementById('time-display');
    const dateDisplay = document.getElementById('date-display');
    const uptimeDisplay = document.getElementById('uptime-display');
    const greetingTitle = document.getElementById('greeting-title');
    const languageDisplay = document.getElementById('language-display');
    const progressFill = document.getElementById('cycle-progress');
    const particleCanvas = document.getElementById('particle-canvas');

    // Multilingual Greetings Data
    const greetings = [
        { text: "Hello World", language: "English" },
        { text: "Hola Mundo", language: "Spanish" },
        { text: "Bonjour le Monde", language: "French" },
        { text: "Hallo Welt", language: "German" },
        { text: "Ciao Mondo", language: "Italian" },
        { text: "Olá Mundo", language: "Portuguese" },
        { text: "Halo Dunia", language: "Indonesian" },
        { text: "Merhaba Dünya", language: "Turkish" },
        { text: "Sveikas, Pasauli", language: "Lithuanian" },
        { text: "Hei Maailma", language: "Finnish" },
        { text: "Hej Värld", language: "Swedish" },
        { text: "Ahoj Světe", language: "Czech" }
    ];

    let currentGreetingIndex = 0;
    const CYCLE_DURATION = 5000; // 5 seconds per greeting
    let cycleStartTime = Date.now();

    // Initialize Uptime Tracker
    const appStartTime = Date.now();

    // 1. Live Clock & Date Tracker
    function updateClock() {
        const now = new Date();

        // Time with AM/PM
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const timeStr = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
        timeDisplay.textContent = timeStr;

        // Date String (e.g. "Thursday, May 21, 2026")
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = now.toLocaleDateString('en-US', options);

        // Calculate Uptime
        const diffMs = Date.now() - appStartTime;
        const diffSecs = Math.floor(diffMs / 1000) % 60;
        const diffMins = Math.floor(diffMs / (1000 * 60)) % 60;
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        uptimeDisplay.textContent = `Uptime: ${String(diffHrs).padStart(2, '0')}:${String(diffMins).padStart(2, '0')}:${String(diffSecs).padStart(2, '0')}`;
    }

    setInterval(updateClock, 1000);
    updateClock();

    // 2. Multilingual Cycle logic
    function changeGreeting() {
        // Prepare fade-out class
        greetingTitle.classList.add('fade-out');
        languageDisplay.classList.add('fade-out');

        setTimeout(() => {
            currentGreetingIndex = (currentGreetingIndex + 1) % greetings.length;
            const nextGreeting = greetings[currentGreetingIndex];

            // Swap content
            greetingTitle.textContent = nextGreeting.text;
            languageDisplay.textContent = nextGreeting.language;

            // Reset transitions & Fade in
            greetingTitle.classList.remove('fade-out');
            greetingTitle.classList.add('fade-in');
            languageDisplay.classList.remove('fade-out');

            setTimeout(() => {
                greetingTitle.classList.remove('fade-in');
            }, 50);

            // Reset start time for accurate progress bar
            cycleStartTime = Date.now();
        }, 800); // Wait for fade-out to finish
    }

    // Progress bar tick logic (smooth linear progression)
    function updateProgressBar() {
        const elapsed = Date.now() - cycleStartTime;
        const progressPercent = Math.min((elapsed / (CYCLE_DURATION - 800)) * 100, 100);
        progressFill.style.width = `${progressPercent}%`;

        if (elapsed >= CYCLE_DURATION) {
            changeGreeting();
        }
        requestAnimationFrame(updateProgressBar);
    }

    // Start progress bar / cycling logic
    requestAnimationFrame(updateProgressBar);

    // 3. Elegant Ambient Particle System Canvas Background
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 35;

    function resizeCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.radius = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.alpha = Math.random() * 0.5 + 0.1;
            this.fadeSpeed = Math.random() * 0.005 + 0.001;
            this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Boundary wrap-around
            if (this.x < 0) this.x = particleCanvas.width;
            if (this.x > particleCanvas.width) this.x = 0;
            if (this.y < 0) this.y = particleCanvas.height;
            if (this.y > particleCanvas.height) this.y = 0;

            // Ambient breathing of particles (alpha transition)
            this.alpha += this.fadeSpeed * this.fadeDirection;
            if (this.alpha <= 0.1) {
                this.alpha = 0.1;
                this.fadeDirection = 1;
            } else if (this.alpha >= 0.6) {
                this.alpha = 0.6;
                this.fadeDirection = -1;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 183, 175, ${this.alpha})`; // Skoop teal
            ctx.shadowColor = 'rgba(0, 183, 175, 0.3)';
            ctx.shadowBlur = 3;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    // Connect close particles with tiny light lines
    function drawConnections() {
        const maxDist = 150;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (dist < maxDist) {
                    const alpha = (1 - (dist / maxDist)) * 0.22;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 183, 175, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawConnections();
        requestAnimationFrame(animateParticles);
    }

    animateParticles();
});
