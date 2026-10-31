# Envio de mensagens do formulário

O formulário da página principal envia a mensagem por uma Vercel Function através da API Resend. O destinatário fica numa variável de ambiente, para ser alterado após os testes sem editar o site. A mensagem contém nome, endereço de resposta e texto. O endereço do visitante é usado como `reply_to`; o remetente tem de ser um endereço autorizado no Resend.

## Teste inicial

1. Crie uma conta Resend com o endereço que deve receber as mensagens de teste. Com o remetente de teste `onboarding@resend.dev`, o Resend só permite enviar para o endereço da própria conta.
2. Crie uma API key no Resend com permissão de envio. Não a coloque no repositório.
3. No projeto Vercel, em **Settings → Environment Variables**, crie estas variáveis para **Production**:

   - `RESEND_API_KEY` — **Secret**, valor da API key.
   - `CONTACT_TO_EMAIL` — **Secret**, endereço de teste que deve receber as mensagens.
   - `CONTACT_FROM_EMAIL` — **Config**, `Farmácia Sousa <onboarding@resend.dev>` durante os testes.

4. Faça **Redeploy** do deployment de produção. Envie uma mensagem de teste sem dados pessoais reais e confirme a receção na caixa de entrada e no painel Resend.

Enquanto faltar uma destas variáveis, o formulário mantém o comportamento anterior de abrir a aplicação de email do visitante. Se o serviço estiver configurado mas rejeitar a mensagem, o formulário mostra um erro e conserva os campos preenchidos.

## Destinatário final

Para enviar para o endereço definitivo da farmácia, altere `CONTACT_TO_EMAIL` na Vercel e use um domínio de envio verificado no Resend em `CONTACT_FROM_EMAIL`. O remetente de teste não permite enviar para destinatários arbitrários. Depois de alterar variáveis, faça novo **Redeploy** e confirme com um envio de teste.

Referências: [Vercel — envio de emails](https://vercel.com/kb/guide/sending-emails-from-an-application-on-vercel), [Resend — API de envio](https://resend.com/docs/api-reference/emails/send-email), [Vercel — variáveis de ambiente](https://vercel.com/docs/environment-variables/managing-environment-variables).
