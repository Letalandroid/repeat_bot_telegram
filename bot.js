import { Telegraf } from "telegraf";
import { config } from "dotenv";
config()

const bot = new Telegraf(process.env.KEY_BOT)

// Variable para almacenar los chat IDs de los usuarios
const chatIds = new Set();

bot.start((ctx) => {
  // Guardar el chat ID del usuario
  chatIds.add(ctx.chat.id);
  ctx.reply('Welcome');
});

// Función para enviar mensaje a todos los usuarios registrados
function sendWelcomeToAll() {
  chatIds.forEach(chatId => {
    bot.telegram.sendMessage(chatId, 'Welcome')
      .catch(err => {
        console.log(`Error enviando mensaje a ${chatId}:`, err.message);
        // Remover chat IDs inválidos (usuarios que bloquearon el bot)
        if (err.response && err.response.error_code === 403) {
          chatIds.delete(chatId);
        }
      });
  });
}

// Enviar mensaje cada 5 minutos (300,000 milisegundos)
setInterval(sendWelcomeToAll, 1 * 10 * 1000);

bot.launch();

// Manejar cierre del proceso
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));