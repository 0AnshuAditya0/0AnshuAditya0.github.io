(function() {
    function onScroll() {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.parallax-target').forEach(item => {
            const speed = item.getAttribute('data-speed') || 0.1;
            item.style.transform = `translate3d(0, ${-(scrolled * speed)}px, 0)`;
        });
    }

    function onMouseMove(event) {
        const glow = document.getElementById('portal-glow');
        if (glow) {
            const xPct = (event.clientX / window.innerWidth) * 100;
            const yPct = (event.clientY / window.innerHeight) * 100;
            glow.style.background = `radial-gradient(circle at ${xPct}% ${yPct}%, rgba(255,255,255,0.03) 0%, transparent 60%)`;
            glow.style.opacity = '1';
        }
    }

    function addInteractiveEffects() {
        const interactiveElements = document.querySelectorAll('.project-card-mini, .tech-tag, a');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.classList.add('liquid-pop');
                setTimeout(() => el.classList.remove('liquid-pop'), 400);
            });
        });
    }

    window.addEventListener('scroll', onScroll);
    document.addEventListener('mousemove', onMouseMove);
    addInteractiveEffects();
})();
