(function() {
    let scene, camera, renderer, particles, count = 0;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    function init() {
        const container = document.getElementById('bg-canvas-container');
        if (!container) return;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        const SEPARATION = 100, AMOUNTX = 60, AMOUNTY = 60;
        const numParticles = AMOUNTX * AMOUNTY;
        const positions = new Float32Array(numParticles * 3);
        const scales = new Float32Array(numParticles);

        let i = 0, j = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
                positions[i + 1] = 0;
                positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
                scales[j] = 1;
                i += 3;
                j++;
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0xffffff) },
            },
            vertexShader: `
                attribute float scale;
                void main() {
                    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                    gl_PointSize = scale * ( 350.0 / - mvPosition.z );
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                void main() {
                    if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
                    gl_FragColor = vec4( color, 0.4 );
                }
            `,
            transparent: true
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        document.addEventListener('mousemove', onDocumentMouseMove);
        window.addEventListener('resize', onWindowResize);
        window.addEventListener('scroll', onWindowScroll);
        animate();
    }

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) * 0.5;
        mouseY = (event.clientY - windowHalfY) * 0.5;
        
        const glow = document.getElementById('portal-glow');
        if (glow) {
            const xPct = (event.clientX / window.innerWidth) * 100;
            const yPct = (event.clientY / window.innerHeight) * 100;
            glow.style.background = `radial-gradient(circle at ${xPct}% ${yPct}%, rgba(255,255,255,0.08) 0%, transparent 60%)`;
            glow.style.opacity = '1';
        }
    }

    function onWindowScroll() {
        const scrolled = window.pageYOffset;
        const parallaxItems = document.querySelectorAll('.parallax-target');
        parallaxItems.forEach(item => {
            const speed = item.getAttribute('data-speed') || 0.1;
            const yPos = -(scrolled * speed);
            item.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        const positions = particles.geometry.attributes.position.array;
        const scales = particles.geometry.attributes.scale.array;

        let i = 0, j = 0;
        for (let ix = 0; ix < 60; ix++) {
            for (let iy = 0; iy < 60; iy++) {
                // Classic Horizontal Wave Animation
                positions[i + 1] = (Math.sin((ix + count) * 0.3) * 50) +
                                   (Math.sin((iy + count) * 0.5) * 50);
                scales[j] = (Math.sin((ix + count) * 0.3) + 1) * 8 +
                            (Math.sin((iy + count) * 0.5) + 1) * 8;
                i += 3;
                j++;
            }
        }

        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.scale.needsUpdate = true;
        renderer.render(scene, camera);
        count += 0.1;
    }

    init();
})();
