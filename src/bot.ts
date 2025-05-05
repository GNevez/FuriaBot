import TelegramBot, { Message } from "node-telegram-bot-api";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error("Token do bot não encontrado!");
}

// Configuração do bot com polling desativado
const bot = new TelegramBot(token, { polling: false });

// Arquivo para armazenar as inscrições
const subscriptionsFile = path.join(__dirname, "subscriptions.json");

// Função para carregar as inscrições
function carregarInscricoes(): Set<number> {
  try {
    if (fs.existsSync(subscriptionsFile)) {
      const data = JSON.parse(fs.readFileSync(subscriptionsFile, "utf-8"));
      return new Set(data);
    }
  } catch (error) {
    console.error("Erro ao carregar inscrições:", error);
  }
  return new Set();
}

// Função para salvar as inscrições
function salvarInscricoes(subscriptions: Set<number>) {
  try {
    fs.writeFileSync(subscriptionsFile, JSON.stringify([...subscriptions]));
  } catch (error) {
    console.error("Erro ao salvar inscrições:", error);
  }
}

// Carregar inscrições existentes
const subscriptions = carregarInscricoes();

// Função para iniciar o polling
async function startPolling() {
  try {
    await bot.startPolling();
    console.log("Bot iniciado com sucesso!");
  } catch (error) {
    console.error("Erro ao iniciar o bot:", error);
    process.exit(1);
  }
}

bot.onText(/\/start/, (msg: Message) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `
    🎮 Olá! Eu sou o bot da Fúria! 🎮

    Comandos disponíveis:
    /jogos - Ver próximos jogos
    /streamers - Lista de streamers da Fúria
    /notificar - Ativar/desativar notificações
    /help - Ajuda
  `;
  bot.sendMessage(chatId, welcomeMessage);
});

bot.onText(/\/help/, (msg: Message) => {
  const chatId = msg.chat.id;
  const helpText = `
    🎮 Comandos disponíveis 🎮

    /jogos - Ver os próximos jogos da Fúria
    /streamers - Ver lista de streamers oficiais
    /notificar - Ativar/desativar notificações de jogos
    /help - Mostra esta mensagem de ajuda
  `;
  bot.sendMessage(chatId, helpText);
});

// Função para ler o conteúdo dos jogos
function lerJogos(): string {
  try {
    const jogosFile = path.join(__dirname, "../..", "data", "jogos.txt");
    if (fs.existsSync(jogosFile)) {
      const conteudo = fs.readFileSync(jogosFile, "utf-8");
      if (conteudo.trim()) {
        return conteudo;
      }
    }
  } catch (error) {
    console.error("Erro ao ler arquivo de jogos:", error);
  }
  return "Nenhum jogo cadastrado no momento.";
}

// Função para ler o conteúdo dos streamers
function lerStreamers(): string {
  try {
    const streamersFile = path.join(
      __dirname,
      "../..",
      "data",
      "streamers.txt"
    );
    if (fs.existsSync(streamersFile)) {
      const conteudo = fs.readFileSync(streamersFile, "utf-8");
      if (conteudo.trim()) {
        return conteudo;
      }
    }
  } catch (error) {
    console.error("Erro ao ler arquivo de streamers:", error);
  }
  return "Nenhum streamer cadastrado no momento.";
}

bot.onText(/\/jogos/, async (msg: Message) => {
  const chatId = msg.chat.id;
  const jogos = lerJogos();
  bot.sendMessage(chatId, jogos);
});

bot.onText(/\/streamers/, (msg: Message) => {
  const chatId = msg.chat.id;
  const streamers = lerStreamers();
  bot.sendMessage(chatId, streamers);
});

bot.onText(/\/notificar/, (msg: Message) => {
  const chatId = msg.chat.id;
  if (subscriptions.has(chatId)) {
    subscriptions.delete(chatId);
    bot.sendMessage(chatId, "🔕 Notificações desativadas!");
  } else {
    subscriptions.add(chatId);
    bot.sendMessage(
      chatId,
      "🔔 Notificações ativadas! Você receberá atualizações sobre os jogos."
    );
  }
  // Salvar as inscrições após cada alteração
  salvarInscricoes(subscriptions);
});

// Função para enviar notificações (pode ser chamada por um scheduler)
export async function enviarNotificacao(mensagem: string): Promise<boolean> {
  console.log("=== Iniciando envio de notificações ===");
  console.log(`Número de inscritos: ${subscriptions.size}`);
  console.log(`IDs dos inscritos: ${Array.from(subscriptions).join(", ")}`);

  if (subscriptions.size === 0) {
    console.log("Nenhum usuário inscrito para receber notificações");
    return false;
  }

  const promises = Array.from(subscriptions).map(async (chatId) => {
    try {
      console.log(`Tentando enviar mensagem para ${chatId}...`);
      const result = await bot.sendMessage(chatId, mensagem);
      console.log(`✅ Mensagem enviada com sucesso para ${chatId}`);
      return result;
    } catch (error) {
      console.error(`❌ Erro ao enviar mensagem para ${chatId}:`, error);
      if (error instanceof Error) {
        if (
          error.message.includes("chat not found") ||
          error.message.includes("bot was blocked") ||
          error.message.includes("user is deactivated")
        ) {
          console.log(`Removendo ${chatId} da lista de inscritos`);
          subscriptions.delete(chatId);
          salvarInscricoes(subscriptions);
        }
      }
      return null;
    }
  });

  try {
    const results = await Promise.all(promises);
    const sucessos = results.filter((r) => r !== null).length;
    console.log(`=== Resumo do envio ===`);
    console.log(`Total de tentativas: ${subscriptions.size}`);
    console.log(`Mensagens enviadas com sucesso: ${sucessos}`);
    console.log(`Falhas: ${subscriptions.size - sucessos}`);
    return sucessos > 0;
  } catch (error) {
    console.error("Erro ao processar envio de mensagens:", error);
    return false;
  }
}

// Função para obter o número de inscritos
export function getNumeroInscritos(): number {
  return subscriptions.size;
}

bot.on("polling_error", (error: Error) => {
  console.log(error);
  process.exit(1);
});

// Exportar o bot para uso em outros arquivos
export { bot, startPolling };
