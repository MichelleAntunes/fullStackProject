import express from "express"; //lib que auxilia na criacão de uma API
import cors from "cors"; //ele que libera o acesso a nossa API na internet
import dotenv from "dotenv"; // O dotenv é uma biblioteca popular em várias linguagens de programação que permite carregar variáveis de ambiente a partir de um arquivo .env. Essa biblioteca facilita a configuração de variáveis de ambiente em um projeto, permitindo que você armazene informações sensíveis, como chaves de API ou senhas, em um arquivo separado e não diretamente no código-fonte.

dotenv.config();

const app = express();

app.use(cors()); //aqui libera o acesso
app.use(express.json()); //trabalhando com json os arquivos sem ter que reverter manualmente

app.listen(Number(process.env.PORT) || 3003, () => {
  console.log(`Servidor rodando na porta ${Number(process.env.PORT) || 3003}`);
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

// routers das entidades
