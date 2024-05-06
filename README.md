
# KrustChat

O KrustChat é uma aplicação de chat em tempo real que utiliza WebSockets para permitir comunicação instantânea, além de suportar o envio de mensagens de texto, uploads de arquivos e compartilhamento de imagens com legendas.

## Funcionalidades

- **Mensagens em Tempo Real**: Os usuários podem enviar e receber mensagens instantaneamente.
- **Uploads de Arquivos**: Suporta o envio e compartilhamento de arquivos diretamente no chat.
- **Compartilhamento de Imagens**: Os usuários podem enviar imagens acompanhadas de legendas.
- **Detecção de Links**: Converte automaticamente URLs em mensagens e legendas em links clicáveis.
- **Mensagens Persistentes**: As mensagens são armazenadas no servidor e carregadas quando o cliente se conecta.

## Tecnologias Utilizadas

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Comunicação em Tempo Real**: WebSockets
- **Armazenamento**: Sistema de arquivos local para armazenar mensagens e arquivos enviados.

## Configuração e Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/SimpleDioney/KrustChat.git
   cd KrustChat
   ```
ANUNCIO: ## Ou utilize nosso sistema que facilita clonagem de repositorios e afins:

   [GitBrowse](https://github.com/SimpleDioney/GitBrowse)
   

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Inicie o servidor:**

   ```bash
   npm start
   ```

   Isso iniciará o servidor em `http://localhost:3000`.

4. **Abra a aplicação:**

   Abra `http://localhost:3000` no seu navegador para acessar o chat.


## Uso

- **Entrar no Chat**: Insira seu nome para participar do chat.
- **Enviar Mensagens**: Digite uma mensagem na caixa de entrada e clique em "Enviar" ou pressione Enter para enviar.
- **Enviar Arquivos**:
  - Clique no botão "+" para fazer upload de um arquivo ou imagem.
  - Selecione um arquivo do seu computador.
  - Se for uma imagem, você pode adicionar uma legenda antes de enviar.
- **Visualizar Mensagens**: As mensagens, incluindo arquivos e imagens, aparecem na janela do chat.

## Contribuições

Contribuições para o aplicativo KrustChat são bem-vindas!

1. **Faça um Fork do repositório**: Clique em 'Fork' no canto superior direito da página do repositório.

2. **Crie seu Branch de Funcionalidades**:

   ```bash
   git checkout -b feature/NovaFuncionalidade
   ```

3. **Faça o Commit das suas Mudanças**:

   ```bash
   git commit -m 'Adicionar alguma NovaFuncionalidade'
   ```

4. **Envie para o Branch**:

   ```bash
   git push origin feature/NovaFuncionalidade
   ```

5. **Abra um Pull Request**

## Apoio
Para apoiar o desenvolvimento contínuo e melhorias, considere tornar-se um patrocinador no Patreon:</p>
<a href="https://patreon.com/SimpleDioney"><img src="https://patreon.com/SimpleDioney?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink" alt="Apoie no Patreon">

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
