const email='farmacia.sousa@farmaciasholon.pt';
document.querySelector('#year').textContent=new Date().getFullYear();
document.querySelector('#contactForm').addEventListener('submit',(event)=>{
  event.preventDefault();
  const data=new FormData(event.currentTarget);
  const body=['Nome: '+data.get('nome'),'Email: '+data.get('email'),'Mensagem: '+data.get('mensagem')].join('\n');
  location.href='mailto:'+email+'?subject='+encodeURIComponent('Mensagem através do site')+'&body='+encodeURIComponent(body);
  event.currentTarget.querySelector('.feedback').textContent='A sua aplicação de e-mail vai abrir. Envie a mensagem para concluir.';
});
