# Configuração da administração de artigos no Vercel

O painel fica em `/admin.html`. Os artigos e imagens publicados são guardados como ficheiros no Vercel Blob. O índice JSON e as imagens são públicos, porque correspondem a conteúdo publicado no site. Apenas a escrita e o upload exigem sessão autenticada.

## 1. Ligar Vercel Blob

No projeto Vercel, abra **Storage → Create Database/Store → Blob**, crie uma store pública para os artigos e ligue-a ao projeto. A integração deve criar a variável `BLOB_READ_WRITE_TOKEN` automaticamente.

## 2. Criar as variáveis secretas

Em **Project → Settings → Environment Variables**, adicione para **Production** (e Preview, se quiser testar):

- `ADMIN_USERNAME`: nome de utilizador escolhido pela farmácia.
- `ADMIN_PASSWORD`: palavra-passe forte escolhida pela farmácia.
- `ADMIN_SESSION_SECRET`: segredo aleatório longo, diferente da palavra-passe (pode gerar um com `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`).

Não coloque estes valores em ficheiros do repositório. Depois de os guardar, faça um novo deployment para as funções receberem as variáveis.

## 3. Usar o painel

Abra `https://<domínio-do-site>/admin.html`, entre com o utilizador e palavra-passe e crie artigos. É possível carregar JPG, PNG e WebP até 3 MB. Marque **Publicado no site** e guarde para o artigo aparecer na página principal e em `/artigos.html`.

As alterações guardadas aparecem no site sem novo commit. A sessão termina automaticamente após 8 horas; o botão **Terminar sessão** fecha-a imediatamente.

## Nota sobre GitHub Pages

As funções `/api/*` são executadas pela Vercel. O GitHub Pages só hospeda ficheiros estáticos, pelo que o painel e os artigos dinâmicos devem ser usados no domínio Vercel.
