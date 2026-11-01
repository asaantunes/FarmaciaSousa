document.querySelector('#year').textContent = new Date().getFullYear();

const contactForm = document.querySelector('#contactForm');
contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const button = contactForm.querySelector('button[type="submit"]');
  const feedback = contactForm.querySelector('.feedback');
  button.disabled = true;
  contactForm.setAttribute('aria-busy', 'true');
  feedback.textContent = 'A enviar a mensagem…';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) throw new Error('Falha no envio');

    contactForm.reset();
    feedback.textContent = 'Mensagem enviada. Obrigado pelo seu contacto.';
  } catch {
    feedback.textContent = 'Não foi possível enviar a mensagem. Tente novamente ou ligue-nos para o 281 322 242.';
  } finally {
    button.disabled = false;
    contactForm.removeAttribute('aria-busy');
  }
});
