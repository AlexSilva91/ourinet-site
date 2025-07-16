document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('.nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.classList.toggle('fa-times');
    });
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            mobileMenuBtn.classList.remove('fa-times');
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 90,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Create fiber optic network animation
    const fiberNetwork = document.getElementById('fiberNetwork');
    if (fiberNetwork) {
        const containerWidth = fiberNetwork.parentElement.offsetWidth;
        const containerHeight = fiberNetwork.parentElement.offsetHeight;
        
        // Create nodes
        const nodeCount = 15;
        const nodes = [];
        
        for (let i = 0; i < nodeCount; i++) {
            const node = document.createElement('div');
            node.className = 'fiber-node';
            
            // Random position within container with padding
            const x = 50 + Math.random() * (containerWidth - 100);
            const y = 50 + Math.random() * (containerHeight - 100);
            
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            
            nodes.push({ element: node, x, y });
            fiberNetwork.appendChild(node);
        }
        
        // Create connections between nodes
        nodes.forEach((nodeA, i) => {
            // Connect to 2-3 closest nodes
            const closestNodes = nodes
                .map((nodeB, j) => ({ node: nodeB, distance: Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y), index: j }))
                .filter(item => item.index !== i)
                .sort((a, b) => a.distance - b.distance)
                .slice(0, 2 + Math.floor(Math.random() * 2));
            
            closestNodes.forEach(item => {
                const nodeB = item.node;
                
                const connection = document.createElement('div');
                connection.className = 'fiber-connection';
                
                const length = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);
                const angle = Math.atan2(nodeB.y - nodeA.y, nodeB.x - nodeA.x) * 180 / Math.PI;
                
                connection.style.width = `${length}px`;
                connection.style.left = `${nodeA.x}px`;
                connection.style.top = `${nodeA.y}px`;
                connection.style.transform = `rotate(${angle}deg)`;
                connection.style.opacity = 0.2 + Math.random() * 0.3;
                
                fiberNetwork.appendChild(connection);
                
                // Animate the connection
                let direction = 1;
                setInterval(() => {
                    const currentOpacity = parseFloat(connection.style.opacity);
                    if (currentOpacity > 0.5) direction = -1;
                    if (currentOpacity < 0.2) direction = 1;
                    connection.style.opacity = (currentOpacity + direction * 0.01).toString();
                }, 50);
            });
        });
    }
    
    // Initialize Map
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // Coordinates for the map center (example coordinates for Brazil)
        const map = L.map('map').setView([-15.7801, -47.9292], 12);
        
        // Add tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Add coverage areas (example coordinates)
        const coverageAreas = [
            { coords: [-15.78, -47.92], radius: 2000, color: '#FFD700' },
            { coords: [-15.79, -47.94], radius: 1500, color: '#FFD700' },
            { coords: [-15.77, -47.91], radius: 1800, color: '#FFD700' },
            { coords: [-15.76, -47.95], radius: 2500, color: '#FFD700' }
        ];
        
        coverageAreas.forEach(area => {
            L.circle(area.coords, {
                color: area.color,
                fillColor: area.color,
                fillOpacity: 0.3,
                radius: area.radius
            }).addTo(map);
        });
        
        // Add markers for radio towers (example coordinates)
        const radioTowers = [
            { coords: [-15.785, -47.925], name: 'Torre Centro' },
            { coords: [-15.775, -47.935], name: 'Torre Norte' },
            { coords: [-15.795, -47.915], name: 'Torre Sul' }
        ];
        
        radioTowers.forEach(tower => {
            L.marker(tower.coords, {
                icon: L.divIcon({
                    className: 'radio-tower-marker',
                    html: '<i class="fas fa-broadcast-tower" style="color: #FF6B00; font-size: 24px;"></i>',
                    iconSize: [24, 24]
                })
            }).addTo(map)
            .bindPopup(`<b>${tower.name}</b><br>Ponto de acesso rádio`);
        });
        
        // Fit map to show all coverage areas
        const bounds = L.latLngBounds(coverageAreas.map(area => area.coords));
        map.fitBounds(bounds.pad(0.2));
    }
    
    // Testimonials slider
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    if (testimonialsSlider) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        testimonialsSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - testimonialsSlider.offsetLeft;
            scrollLeft = testimonialsSlider.scrollLeft;
        });
        
        testimonialsSlider.addEventListener('mouseleave', () => {
            isDown = false;
        });
        
        testimonialsSlider.addEventListener('mouseup', () => {
            isDown = false;
        });
        
        testimonialsSlider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - testimonialsSlider.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialsSlider.scrollLeft = scrollLeft - walk;
        });
    }
    
    // Form submission handlers
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would normally send the form data to the server
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            this.reset();
        });
    }
    
    const coverageForm = document.getElementById('coverage-checker');
    if (coverageForm) {
        coverageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would normally check coverage with the server
            alert('Verificando disponibilidade para o endereço informado...');
            this.reset();
        });
    }
    
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            alert(`Obrigado por assinar nossa newsletter! Um e-mail foi enviado para ${emailInput.value}`);
            emailInput.value = '';
        });
    }
    
    // Animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .plan-card, .radio-plan-card, .testimonial-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .plan-card, .radio-plan-card, .testimonial-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
});