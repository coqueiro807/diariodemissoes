import { inject } from "https://aistudiocdn.com/@vercel/analytics@^1.5.0";

inject();

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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
} else {
    initCarousel();
}