const whatsappNumber='351925418749';
document.querySelector('#year').textContent=new Date().getFullYear();
document.querySelector('#contactForm').addEventListener('submit',(event)=>{
  event.preventDefault();
  const form=event.currentTarget;
  const data=new FormData(form);
  const nome=String(data.get('nome')||'').trim();
  const email=String(data.get('email')||'').trim();
  const mensagem=String(data.get('mensagem')||'').trim();
  const lines=[
    'Olá, gostaria de contactar a Farmácia Sousa.',
    `Nome: ${nome}`,
    ...(email?[`Email: ${email}`]:[]),
    `Mensagem: ${mensagem}`
  ];
  const url=`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
  window.open(url,'_blank','noopener,noreferrer');
  form.querySelector('.feedback').textContent='O WhatsApp abriu com a mensagem preparada. Confirme o envio na conversa.';
});
