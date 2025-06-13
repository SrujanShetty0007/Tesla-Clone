
const menu = document.querySelector(".Menu");
const cancel = document.querySelector(".menu-cross");
const menubar = document.querySelector(".menubar");
const body = document.querySelector(".body");

menu.addEventListener("click", () => {
  menubar.classList.toggle("active");
  body.style.backgroundColor = "#cfcfcf";
});

cancel.addEventListener("click", () => {
  menubar.classList.toggle("active");
});


document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const dots = Array.from(document.querySelectorAll('.carousel-dot'));
  
  if (!track || !slides.length || !dots.length) return;
  
  let currentIndex = 0;
  let isAnimating = false;
  const animDuration = 800;
  
  function getSlideWidth() {
    if (window.innerWidth <= 480) {
      return 100;
    } else if (window.innerWidth <= 768) {
      return 96;
    } else if (window.innerWidth <= 1200) {
      return 94;
    } else {
      return 90;
    }
  }
  
  function goToSlide(index) {
    if (isAnimating) return;
    isAnimating = true;
    
    currentIndex = index;
    const slideWidth = getSlideWidth();
    track.style.transform = `translateX(${-currentIndex * slideWidth}vw)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    
    setTimeout(() => isAnimating = false, animDuration);
  }
  
  function navigate(direction) {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % slides.length 
      : (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(newIndex);
  }
  
  track.style.transition = `transform ${animDuration}ms ease`;
  goToSlide(0);
  

  dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));
  
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') navigate('next');
    else if (e.key === 'ArrowLeft') navigate('prev');
  });
  
  let touchStartX = 0;
  track.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 'next' : 'prev');
  });
  
  const autoplayInterval = setInterval(() => {
    if (!document.hidden && !isAnimating) navigate('next');
  }, 6000);
  
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(autoplayInterval);
  });
  
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!isAnimating) {
        const slideWidth = getSlideWidth();
        track.style.transition = 'none';
        track.style.transform = `translateX(${-currentIndex * slideWidth}vw)`;
        
        void track.offsetWidth;
        
        track.style.transition = `transform ${animDuration}ms ease`;
      }
    }, 250);
  });
});
