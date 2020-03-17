// dynamic sizing ---------------------------------------------------

const heartSVG = document.getElementById('heart') as HTMLImageElement;
heartSVG.onload = () => setSize();

function setSize() {
  const elements = document.querySelectorAll('.dynamic-height');
  elements.forEach((el: HTMLDivElement) => setHeightAttribute(el));
}

function setHeightAttribute(el: HTMLElement) {
  el.style.height = '100%';
  const height = el.offsetHeight;
  el.style.height = `calc(${height}px + 200vh)`;
}

window.addEventListener('resize', debounce(setSize));

// lazy load gallery images ----------------------------------------

const images = document.querySelectorAll('figure img');

const imageObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const image = entry.target as HTMLImageElement;
      fadeInImage(image);
      imageObserver.unobserve(image);
    }
  });
});

images.forEach(image => imageObserver.observe(image));

function fadeInImage(image: HTMLImageElement) {
  const duration = window.innerWidth > 750 ? Math.random() * 3 + 1 : 0;
  image.src = image.dataset.src;
  image.style.setProperty('--fade-in-duration', `${duration}s`);
  image.className = `${image.className} fade-in`;
}

// change background image -----------------------------------------

const enum ScrollDirection {
  DOWN = 'down',
  UP = 'up'
}

const enum CurrentImage {
  IMG1 = 'img1',
  IMG2 = 'img2'
}

let scrollDirection = ScrollDirection.DOWN;
let currentImage = CurrentImage.IMG1;
let lastScrollTop = 0;

const story = document.getElementById('story');
const img2 = document.getElementById('img2');
const placeholder = document.getElementById('placeholder');

const landingImage = document.createElement('img');
landingImage.src = getBgUrl(document.getElementById('landing-screen'));
landingImage.onload = () => {
  placeholder.style.zIndex = '-5';
};

function setScrollDirection() {
  const currentScrollTop = document.documentElement.scrollTop;
  if (currentScrollTop > lastScrollTop) {
    scrollDirection = ScrollDirection.DOWN;
  } else {
    scrollDirection = ScrollDirection.UP;
  }
  lastScrollTop = currentScrollTop;
}

function setBackgroundImage() {
  const boundingClientRect = story.getBoundingClientRect();
  const isScrolledPastCenter =
    boundingClientRect.bottom < boundingClientRect.height / 2;
  if (
    scrollDirection === ScrollDirection.DOWN &&
    isScrolledPastCenter &&
    currentImage === CurrentImage.IMG1
  ) {
    img2.style.zIndex = '-1';
    currentImage = CurrentImage.IMG2;
  } else if (
    scrollDirection === ScrollDirection.UP &&
    !isScrolledPastCenter &&
    currentImage === CurrentImage.IMG2
  ) {
    img2.style.zIndex = '-3';
    currentImage = CurrentImage.IMG1;
  }
}

window.addEventListener('scroll', throttle(setScrollDirection));
window.addEventListener('scroll', throttle(setBackgroundImage));

// helpers ---------------------------------------------------------

function throttle(fn: any, delay = 100) {
  let lastCall = 0;
  return function(...args: any[]) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  };
}

function debounce(callback: any, wait = 100) {
  let timeout: number;
  return (...args) => {
    const next = () => callback(...args);
    clearTimeout(timeout);
    timeout = setTimeout(next, wait);
  };
}

// https://jsfiddle.net/tovic/gmzSG/
function getBgUrl(el) {
  var bg = '';
  if (el.currentStyle) {
    // IE
    bg = el.currentStyle.backgroundImage;
  } else if (document.defaultView && document.defaultView.getComputedStyle) {
    // Firefox
    bg = document.defaultView.getComputedStyle(el, '').backgroundImage;
  } else {
    // try and get inline style
    bg = el.style.backgroundImage;
  }
  return bg.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
}
