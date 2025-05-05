import express from "express";
import cors from "cors";
import { enviarNotificacao } from "./bot";
import fs from "fs";
import path from "path";

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Rota para enviar mensagens
app.post("/api/enviar-mensagem", async (req, res) => {
  try {
    const { mensagem } = req.body;

    if (!mensagem) {
      return res.status(400).json({ erro: "A mensagem é obrigatória" });
    }

    // Enviar a mensagem para todos os inscritos
    const enviada = await enviarNotificacao(mensagem);

    if (enviada) {
      console.log("Mensagem enviada com sucesso: " + mensagem);
      res.json({
        msg: "Mensagem enviada com sucesso!",
        destinatarios: "todos os usuários inscritos",
      });
    } else {
      console.log("Nenhum usuário inscrito para receber a mensagem");
      res.status(404).json({
        erro: "Nenhum usuário inscrito para receber a mensagem",
      });
    }
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

// Rota para atualizar jogos
app.post("/api/atualizar-jogos", async (req, res) => {
  try {
    const { jogos } = req.body;

    if (!jogos) {
      return res
        .status(400)
        .json({ erro: "O conteúdo dos jogos é obrigatório" });
    }

    // Salvar os jogos em um arquivo
    const jogosFile = path.join(__dirname, "..", "data", "jogos.txt");
    fs.writeFileSync(jogosFile, jogos);

    console.log("Jogos atualizados com sucesso");
    res.json({ msg: "Jogos atualizados com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar jogos:", error);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

// Rota para atualizar streamers
app.post("/api/atualizar-streamers", async (req, res) => {
  try {
    const { streamers } = req.body;

    if (!streamers) {
      return res
        .status(400)
        .json({ erro: "O conteúdo dos streamers é obrigatório" });
    }

    // Salvar os streamers em um arquivo
    const streamersFile = path.join(__dirname, "..", "data", "streamers.txt");
    fs.writeFileSync(streamersFile, streamers);

    console.log("Streamers atualizados com sucesso");
    res.json({ msg: "Streamers atualizados com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar streamers:", error);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

app.listen(port, () => {
  console.log(`API do bot rodando na porta ${port}`);
});
