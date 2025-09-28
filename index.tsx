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
    let slideWidth = slides[0].getBoundingClientRect().width;

    const updateCarousel = (targetIndex: number, isResize = false) => {
        if (!isResize) {
            if (targetIndex < 0 || targetIndex >= slides.length) return;
        }
        
        if (isResize) {
             slideWidth = slides[0].getBoundingClientRect().width;
             if (slideWidth === 0) return;
             targetIndex = currentIndex;
        }

        const currentDot = dots[currentIndex];
        const targetDot = dots[targetIndex];

        track.style.transform = `translateX(-${slideWidth * targetIndex}px)`;

        if (currentDot && targetDot) {
            currentDot.classList.remove('current-slide');
            targetDot.classList.add('current-slide');
        }

        if (targetIndex === 0) {
            prevButton.classList.add('is-hidden');
            nextButton.classList.remove('is-hidden');
        } else if (targetIndex === slides.length - 1) {
            prevButton.classList.remove('is-hidden');
            nextButton.classList.add('is-hidden');
        } else {
            prevButton.classList.remove('is-hidden');
            nextButton.classList.remove('is-hidden');
        }
        
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

    window.addEventListener('resize', () => {
        updateCarousel(currentIndex, true);
    });

    if(dots.length > 0) {
        dots[0].classList.add('current-slide');
    }
    prevButton.classList.add('is-hidden');
    
    const firstImage = slides[0]?.querySelector('img');
    if (firstImage) {
        if (firstImage.complete) {
            updateCarousel(currentIndex, true);
        } else {
            firstImage.onload = () => updateCarousel(currentIndex, true);
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
} else {
    initCarousel();
}
