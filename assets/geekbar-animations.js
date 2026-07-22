/**
 * GeekBar Animations & Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll-triggered fade-in animations
  const fadeElements = document.querySelectorAll('.gk-fade-in');
  
  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));
  }

  // 2. Hero Carousel Implementation
  class HeroCarousel {
    constructor(container) {
      this.container = container;
      this.slides = Array.from(container.querySelectorAll('.geekbar-hero__slide'));
      this.dots = Array.from(container.querySelectorAll('.geekbar-hero__dot'));
      this.prevBtn = container.querySelector('.geekbar-hero__arrow--prev');
      this.nextBtn = container.querySelector('.geekbar-hero__arrow--next');
      this.currentIndex = 0;
      this.interval = null;
      this.delay = 5000;

      if (this.slides.length === 0) return;

      this.init();
    }

    init() {
      // Event listeners
      if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
      if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
      
      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => this.goToSlide(index));
      });

      this.container.addEventListener('mouseenter', () => this.pause());
      this.container.addEventListener('mouseleave', () => this.play());

      // Keyboard support
      this.container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      });

      this.play();
    }

    goToSlide(index) {
      this.slides[this.currentIndex].classList.remove('active');
      if (this.dots[this.currentIndex]) this.dots[this.currentIndex].classList.remove('active');

      this.currentIndex = (index + this.slides.length) % this.slides.length;

      this.slides[this.currentIndex].classList.add('active');
      if (this.dots[this.currentIndex]) this.dots[this.currentIndex].classList.add('active');
    }

    next() {
      this.goToSlide(this.currentIndex + 1);
    }

    prev() {
      this.goToSlide(this.currentIndex - 1);
    }

    play() {
      if (this.slides.length <= 1) return;
      this.pause();
      this.interval = setInterval(() => this.next(), this.delay);
    }

    pause() {
      clearInterval(this.interval);
    }
  }

  const heros = document.querySelectorAll('.geekbar-hero');
  heros.forEach(hero => new HeroCarousel(hero));

  // 3. Counter Animation
  const counters = document.querySelectorAll('[data-count-to]');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count-to'), 10);
          const duration = 2000; // ms
          const start = 0;
          let startTime = null;

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            el.innerText = Math.floor(progress * target);
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              el.innerText = target;
            }
          };
          window.requestAnimationFrame(step);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    counters.forEach(c => counterObserver.observe(c));
  }

  // 4. Parallax Effect for Hero Image
  window.addEventListener('scroll', () => {
    const bgElements = document.querySelectorAll('.geekbar-hero__bg');
    bgElements.forEach(bg => {
      const scrollPos = window.scrollY;
      bg.style.transform = `translateY(${scrollPos * 0.3}px)`;
    });
  });
});
