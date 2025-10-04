// Lazy Loading Implementation
class LazyLoader {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(this.handleIntersect.bind(this), {
                root: null,
                rootMargin: '50px 0px',
                threshold: 0.1
            });
            this.observeLazyElements();
        } else {
            this.loadAllImages(); // Fallback para navegadores antigos
        }
    }

    handleIntersect(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                if (element.tagName === 'IMG') {
                    this.loadImage(element);
                } else if (element.tagName === 'IFRAME') {
                    this.loadIframe(element);
                }
                
                observer.unobserve(element);
            }
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src') || img.src;
        
        if (img.getAttribute('data-loading') === 'true') return;
        
        img.setAttribute('data-loading', 'true');
        
        const imageLoader = new Image();
        imageLoader.src = src;
        
        imageLoader.onload = () => {
            if (img.getAttribute('data-src')) {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
            }
            img.classList.add('loaded');
            img.removeAttribute('data-loading');
        };

        imageLoader.onerror = () => {
            console.warn('Erro ao carregar imagem:', src);
            img.removeAttribute('data-loading');
        };
    }

    loadIframe(iframe) {
        // Para iframes, apenas garantimos que estão visíveis
        iframe.classList.add('loaded');
    }

    observeLazyElements() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            this.observer.observe(img);
        });

        const lazyIframes = document.querySelectorAll('iframe[loading="lazy"]');
        lazyIframes.forEach(iframe => {
            this.observer.observe(iframe);
        });
    }

    loadAllImages() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            this.loadImage(img);
        });
    }
}

// Map Initialization Function
function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Verificar se Leaflet está carregado
    if (typeof L === 'undefined') {
        console.error('Leaflet não está carregado');
        return;
    }

    try {
        const map = L.map('map').setView([-7.884913749549813, -40.08501742303437], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const coverageAreas = [
            { coords: [-7.884913749549813, -40.08501742303437], radius: 2000, color: '#FFD700' },
            { coords: [-7.510507213934869, -39.72169733051941], radius: 1500, color: '#FFD700' },
            { coords: [-8.162862803433272, -40.614694358618024], radius: 1800, color: '#FFD700' },
            { coords: [-8.239236980070817, -40.330620585271824], radius: 2500, color: '#FFD700' }
        ];

        coverageAreas.forEach(area => {
            L.circle(area.coords, {
                color: area.color,
                fillColor: area.color,
                fillOpacity: 0.3,
                radius: area.radius
            }).addTo(map);
        });

        const radioTowers = [
            { coords: [-7.884913749549813, -40.08501742303437], name: 'Central Ouricuri' },
            { coords: [-7.510507213934869, -39.72169733051941], name: 'Filial EXU' },
            { coords: [-8.162862803433272, -40.614694358618024], name: 'Filial Santa Filomena' },
            { coords: [-8.239236980070817, -40.330620585271824], name: 'Filial Santa Cruz' }
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

        const bounds = L.latLngBounds(coverageAreas.map(area => area.coords));
        map.fitBounds(bounds.pad(0.2));

        console.log('Mapa inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar o mapa:', error);
    }
}

// Testimonials Slider
function initializeTestimonialsSlider() {
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    if (!testimonialsSlider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    testimonialsSlider.addEventListener('mousedown', (e) => {
        isDown = true;
        testimonialsSlider.classList.add('active');
        startX = e.pageX - testimonialsSlider.offsetLeft;
        scrollLeft = testimonialsSlider.scrollLeft;
    });

    testimonialsSlider.addEventListener('mouseleave', () => {
        isDown = false;
        testimonialsSlider.classList.remove('active');
    });

    testimonialsSlider.addEventListener('mouseup', () => {
        isDown = false;
        testimonialsSlider.classList.remove('active');
    });

    testimonialsSlider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - testimonialsSlider.offsetLeft;
        const walk = (x - startX) * 2;
        testimonialsSlider.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    testimonialsSlider.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - testimonialsSlider.offsetLeft;
        scrollLeft = testimonialsSlider.scrollLeft;
    });

    testimonialsSlider.addEventListener('touchend', () => {
        isDown = false;
    });

    testimonialsSlider.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - testimonialsSlider.offsetLeft;
        const walk = (x - startX) * 2;
        testimonialsSlider.scrollLeft = scrollLeft - walk;
    });
}

// Fiber Animation
function createFiberAnimation() {
    const fiberNetwork = document.getElementById('fiberNetwork');
    if (!fiberNetwork) return;

    const containerWidth = fiberNetwork.parentElement.offsetWidth;
    const containerHeight = fiberNetwork.parentElement.offsetHeight;

    const nodeCount = 15;
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
        const node = document.createElement('div');
        node.className = 'fiber-node';

        const x = 50 + Math.random() * (containerWidth - 100);
        const y = 50 + Math.random() * (containerHeight - 100);

        node.style.left = `${x}px`;
        node.style.top = `${y}px`;

        nodes.push({ element: node, x, y });
        fiberNetwork.appendChild(node);
    }

    nodes.forEach((nodeA, i) => {
        const closestNodes = nodes
            .map((nodeB, j) => ({ 
                node: nodeB, 
                distance: Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y), 
                index: j 
            }))
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

            let direction = 1;
            const pulseInterval = setInterval(() => {
                if (!document.body.contains(connection)) {
                    clearInterval(pulseInterval);
                    return;
                }
                
                const currentOpacity = parseFloat(connection.style.opacity);
                if (currentOpacity > 0.5) direction = -1;
                if (currentOpacity < 0.2) direction = 1;
                connection.style.opacity = (currentOpacity + direction * 0.01).toString();
            }, 50);
        });
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const animateOnScroll = function () {
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

    const animatedElements = document.querySelectorAll('.feature-card, .plan-card, .radio-plan-card, .testimonial-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
}

// Form Handlers
function initializeFormHandlers() {
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nome = document.getElementById('nome').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const assunto = document.getElementById('assunto').value.trim();
            const mensagem = document.getElementById('mensagem').value.trim();

            const whatsappMessage = `*Nova Mensagem do Site Ourinet*

*Nome:* ${nome}
*Telefone:* ${telefone}
*Assunto:* ${assunto}
*Mensagem:* ${mensagem}

_Esta mensagem foi enviada através do site oficial_`;

            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappNumber = '558738742613';
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            window.open(whatsappURL, '_blank');
            
            // Reset form
            this.reset();
            
            // Feedback para o usuário
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Mensagem Enviada!';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        });
    }

    // Coverage Checker Form
    const coverageForm = document.getElementById('coverage-checker');
    if (coverageForm) {
        coverageForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const cep = document.getElementById('cep').value.trim();
            const endereco = document.getElementById('endereco').value.trim();
            const numero = document.getElementById('numero').value.trim();
            const bairro = document.getElementById('bairro').value.trim();
            
            const coberturaMessage = `*Verificação de Cobertura Ourinet*

*CEP:* ${cep}
*Endereço:* ${endereco}
*Número:* ${numero}
*Bairro:* ${bairro}

Estamos verificando a disponibilidade em nossa região...`;

            const encodedMessage = encodeURIComponent(coberturaMessage);
            const whatsappNumber = '558738742613';
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            window.open(whatsappURL, '_blank');
            this.reset();
        });

        // CEP auto-complete
        const cepInput = document.getElementById('cep');
        if (cepInput) {
            cepInput.addEventListener('blur', function() {
                const cep = this.value.replace(/\D/g, '');
                
                if (cep.length === 8) {
                    this.disabled = true;
                    
                    fetch(`https://viacep.com.br/ws/${cep}/json/`)
                        .then(response => response.json())
                        .then(data => {
                            if (!data.erro) {
                                document.getElementById('endereco').value = data.logradouro || '';
                                document.getElementById('bairro').value = data.bairro || '';
                            }
                            this.disabled = false;
                        })
                        .catch(() => {
                            this.disabled = false;
                        });
                }
            });
        }
    }
}

// Main Initialization
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar Lazy Loader
    new LazyLoader();

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('.nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function () {
            nav.classList.toggle('active');
            this.classList.toggle('fa-times');
        });
    }

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (nav) nav.classList.remove('active');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('fa-times');
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 90;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Inicializar componentes
    createFiberAnimation();
    initializeMap(); // ✅ AGORA O MAPA VAI FUNCIONAR
    initializeTestimonialsSlider();
    initializeFormHandlers();
    initializeScrollAnimations();
});

// Wait for everything to load
window.addEventListener('load', function() {
    // Garantir que o mapa seja renderizado corretamente após o carregamento completo
    setTimeout(() => {
        const mapElement = document.getElementById('map');
        if (mapElement && typeof L !== 'undefined') {
            // Disparar um evento de redimensionamento para o mapa se necessário
            window.dispatchEvent(new Event('resize'));
        }
    }, 1000);
});

// Adicionar CSS para transições suaves
const style = document.createElement('style');
style.textContent = `
    img[loading="lazy"] {
        transition: opacity 0.3s ease;
    }
    
    img[loading="lazy"]:not(.loaded) {
        opacity: 0;
    }
    
    img[loading="lazy"].loaded {
        opacity: 1;
    }
    
    .testimonials-slider.active {
        cursor: grabbing;
        cursor: -webkit-grabbing;
    }
    .leaflet-container {
        height: 100%;
        width: 100%;
    }
`;
document.head.appendChild(style);