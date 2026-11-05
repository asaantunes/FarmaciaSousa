document.querySelector('#year').textContent = new Date().getFullYear();

const contactForm = document.querySelector('#contactForm');
const emailField = contactForm.elements.email;
const phoneField = contactForm.elements.phone;
const feedback = contactForm.querySelector('.feedback');

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = emailField.value.trim();
  const phone = phoneField.value.trim();
  if (!email && !phone) {
    feedback.textContent = 'Indique um email ou telefone para podermos responder.';
    emailField.focus();
    return;
  }

  const formData = new FormData(contactForm);
  if (!email) formData.delete('email');
  if (!phone) formData.delete('phone');

  const button = contactForm.querySelector('button[type="submit"]');
  button.disabled = true;
  contactForm.setAttribute('aria-busy', 'true');
  feedback.textContent = 'A enviar a mensagem…';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: formData,
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
