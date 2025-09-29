const initCarousel = () => {
    const track = document.querySelector<HTMLElement>('.carousel-track');
    if (!track) return;

    const slides = Array.from(track.children) as HTMLElement[];
    const nextButton = document.querySelector<HTMLButtonElement>('.carousel-button--right');
    const prevButton = document.querySelector<HTMLButtonElement>('.carousel-button--left');
    const dotsNav = document.querySelector<HTMLElement>('.carousel-nav');
    
    if (!nextButton || !prevButton || !dotsNav || slides.length === 0) return;
    
    const dots = Array.from(dotsNav.children) as HTMLButtonElement[];
    
    let currentIndex = 0;

    const updateCarousel = (targetIndex: number) => {
        // Boundary check
        if (targetIndex < 0 || targetIndex >= slides.length) return;
        
        // Ensure slides are loaded and have width
        const slideWidth = slides[0].getBoundingClientRect().width;
        if (slideWidth === 0) return;

        const currentDot = dots[currentIndex];
        const targetDot = dots[targetIndex];

        track.style.transform = `translateX(-${slideWidth * targetIndex}px)`;

        if (currentDot && targetDot) {
            currentDot.classList.remove('current-slide');
            targetDot.classList.add('current-slide');
        }

        // Update button visibility
        prevButton.classList.toggle('is-hidden', targetIndex === 0);
        nextButton.classList.toggle('is-hidden', targetIndex === slides.length - 1);
        
        currentIndex = targetIndex;
    };
    
    nextButton.addEventListener('click', () => {
        updateCarousel(currentIndex + 1);
    });

    prevButton.addEventListener('click', () => {
        updateCarousel(currentIndex - 1);
    });

    dotsNav.addEventListener('click', e => {
        const targetDot = (e.target as HTMLElement).closest('button');
        if (!targetDot) return;
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        if (targetIndex !== -1) {
            updateCarousel(targetIndex);
        }
    });

    // Recalculate on resize to handle orientation changes
    window.addEventListener('resize', () => {
        // Use a small timeout to let the layout settle before recalculating
        setTimeout(() => updateCarousel(currentIndex), 100);
    });
    
    // Initial setup logic
    const setup = () => {
      if(dots.length > 0) {
          dots[0].classList.add('current-slide');
      }
      prevButton.classList.add('is-hidden');
      // Set the initial position correctly
      updateCarousel(0);
    }

    // Ensure the first image is loaded before calculating dimensions
    const firstImage = slides[0]?.querySelector('img');
    if (firstImage) {
        if (firstImage.complete) {
            setup();
        } else {
            firstImage.onload = () => setup();
        }
    } else {
        // If no images, setup immediately
        setup();
    }
};

const initHeartTrail = () => {
    // Apenas ativa em dispositivos de toque
    if (!('ontouchstart' in window)) {
        return;
    }

    let isThrottled = false;
    const throttleDuration = 50; // ms - Para não criar corações demais

    const createHeart = (x: number, y: number) => {
        const heart = document.createElement('span');
        const hearts = ['❤️', '💖', '💕'];
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        heart.classList.add('touch-heart');

        // Posição inicial
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;

        // Adiciona aleatoriedade para um efeito mais natural
        const size = Math.random() * 15 + 10; // Tamanho entre 10px e 25px
        const duration = Math.random() * 1 + 1.5; // Duração entre 1.5s e 2.5s
        const drift = (Math.random() - 0.5) * 60; // Desvio horizontal entre -30px e 30px
        const rotation = (Math.random() - 0.5) * 40; // Rotação entre -20deg e 20deg

        heart.style.fontSize = `${size}px`;
        heart.style.setProperty('--drift', `${drift}px`);
        heart.style.setProperty('--rotation', `${rotation}deg`);
        heart.style.animation = `floatUpAndAway ${duration}s ease-out forwards`;

        document.body.appendChild(heart);

        // Limpa o elemento do DOM após a animação
        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    };

    const handleTouch = (e: TouchEvent) => {
        if (isThrottled) return;
        isThrottled = true;

        setTimeout(() => {
            isThrottled = false;
        }, throttleDuration);

        // Cria um coração para cada ponto de toque
        for (const touch of Array.from(e.touches)) {
            createHeart(touch.clientX, touch.clientY);
        }
    };

    document.body.addEventListener('touchmove', handleTouch);
    document.body.addEventListener('touchstart', handleTouch); // Também no primeiro toque
};


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initCarousel();
        initHeartTrail();
    });
} else {
    initCarousel();
    initHeartTrail();
}