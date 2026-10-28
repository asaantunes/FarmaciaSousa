const button = document.querySelector('.menu-button');
const header = document.querySelector('.site-header');

button.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  button.setAttribute('aria-expanded', open);
  button.textContent = open ? 'Fechar' : 'Menu';
});

document.querySelectorAll('nav a').forEach((link) => link.addEventListener('click', () => {
  header.classList.remove('menu-open');
  button.setAttribute('aria-expanded', 'false');
  button.textContent = 'Menu';
}));

document.querySelector('#year').textContent = new Date().getFullYear();
