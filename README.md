# Bot da Fúria

Bot do Telegram desenvolvido com Node.js e TypeScript.

## Requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto e adicione seu token do bot:
```
TELEGRAM_BOT_TOKEN=seu_token_aqui
```

## Como executar

Para desenvolvimento:
```bash
npm run dev
```

Para produção:
```bash
npm run build
npm start
```

## Comandos disponíveis

- `/start` - Inicia o bot
- `/help` - Mostra a lista de comandos disponíveis

## Como obter um token do bot

1. Abra o Telegram e procure por @BotFather
2. Inicie uma conversa e use o comando `/newbot`
3. Siga as instruções para criar seu bot
4. Copie o token fornecido e adicione ao arquivo `.env` 