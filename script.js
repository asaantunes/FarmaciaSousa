const email='farmacia.sousa@farmaciasholon.pt';
document.querySelector('#year').textContent=new Date().getFullYear();
document.querySelector('#contactForm').addEventListener('submit',async(event)=>{
  event.preventDefault();
  const form=event.currentTarget;
  const data=new FormData(form);
  const feedback=form.querySelector('.feedback');
  const button=form.querySelector('button[type="submit"]');
  button.disabled=true;
  feedback.textContent='A enviar mensagem…';
  try {
    const response=await fetch('/api/contact',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        nome:data.get('nome'),
        email:data.get('email'),
        mensagem:data.get('mensagem'),
        consentimento:form.querySelector('.consent input').checked,
        website:data.get('website')
      })
    });
    if(response.status===503){
      const body=['Nome: '+data.get('nome'),'Email: '+data.get('email'),'Mensagem: '+data.get('mensagem')].join('\n');
      location.href='mailto:'+email+'?subject='+encodeURIComponent('Mensagem através do site')+'&body='+encodeURIComponent(body);
      feedback.textContent='A sua aplicação de e-mail vai abrir. Envie a mensagem para concluir.';
      return;
    }
    if(!response.ok)throw new Error('O envio falhou. Tente novamente ou contacte-nos por telefone.');
    form.reset();
    feedback.textContent='Mensagem enviada. Obrigado pelo seu contacto.';
  }catch(error){
    feedback.textContent=error.message||'O envio falhou. Tente novamente.';
  }finally{button.disabled=false}
});
