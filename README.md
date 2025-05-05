# 🤖 FURIA Telegram Bot
Este é o bot do Challenge 1 do processo seletivo da FURIA Esports, desenvolvido em Node.js com TypeScript. O bot se conecta à dashboard da Arena FURIA (landing page) via uma API REST, utilizando polling para escutar mensagens no Telegram. Ele permite o envio de notificações personalizadas, atualizações de jogos e alertas de streamers online.

### 📦 Tecnologias Utilizadas
- Node.js
- TypeScript
- node-telegram-bot-api
- Express

## 🚀 Como executar o projeto
**1. Instale as dependências**
```
npm install
```
**2. Configure as variáveis de ambiente**
Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:

```
TELEGRAM_BOT_TOKEN=        # Token do bot gerado pelo @BotFather  
BOT_API_URL=  # URL da landing page/admin  
PORT=                  # Porta da API do bot
```
**3. Inicie a API em modo desenvolvimento**
```
npm run api
```
**4. Inicie o pooling do bot separado**
```
npm run bot
```

**5. Para build e produção da API**
```
npm run build
npm start
```
## 🔌 Endpoints da API
A API embutida no bot permite integração direta com o painel da Arena FURIA para envio de notificações aos usuários.

### POST /api/enviar-mensagem
Envia uma mensagem para um usuário via Telegram.

Body (JSON):
```
{
  "chatId": "123456789",
  "mensagem": "A FURIA joga hoje às 19h! Não perca!"
}
```

### POST /api/atualizar-jogos
Atualiza a lista de jogos do dia e notifica os usuários.

```
{
  "jogos": [
  {
      "horario": "19:00",
      "adversario": "Team Liquid",
      "campeonato": "ESL Pro League"
    }
  ]
}
```
### POST /api/atualizar-streamers
Recebe e envia notificações com os streamers da FURIA que estão online.

```
{
  "streamers": [
    {
      "nome": "Gaules",
      "link": "https://twitch.tv/gaules"
    },
    {
      "nome": "FalleN",
      "link": "https://twitch.tv/fallen"
    }
  ]
}
```
## ⚙️ Funcionamento
O bot usa polling para escutar mensagens dos usuários.

A API pode ser consumida pela landing page/admin para automatizar os alertas de jogos e streamers.

A estrutura do código é modular, facilitando expansão e manutenção.

## 👨‍💻 Autor
**Guilherme Neves M Ferraz**
**📧 guilhermemferraz@hotmail.com**
**🔗 LinkedIn: *https://www.linkedin.com/in/guilherme-neves-a749052a2/***

## 📄 Licença
Este projeto é open-source e está disponível sob a licença MIT.
