const menu = document.getElementById('menu');
const body = document.querySelector('body');

function toggleMenu() {
  menu.classList.toggle('open');
  body.classList.toggle('overflow');
}

function isMenuOpen() {
  return !!document.getElementsByClassName('open').length;
}

function openMenu() {
  if (!isMenuOpen()) {
    toggleMenu();
  }
}

function closeMenu() {
  if (isMenuOpen()) {
    toggleMenu();
  }
}
