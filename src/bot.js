import { Telegraf } from "telegraf";
import { config } from "dotenv";
import http from 'http';
config()

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write("I'm alive");
  res.end();
}).listen(8080, () => {
  console.log('Keep alive server running on port 8080');
});

const bot = new Telegraf(process.env.KEY_BOT)

// Variable para almacenar los chat IDs de los usuarios
const chatIds = new Set();

bot.start((ctx) => {
  // Guardar el chat ID del usuario
  chatIds.add(ctx.chat.id);
  ctx.reply('Welcome');
});

// Comando para detener mensajes automáticos
bot.command('stop', (ctx) => {
  stopInterval();
  ctx.reply('Mensajes automáticos detenidos');
});

// Comando para reiniciar mensajes automáticos
bot.command('restart', (ctx) => {
  restartInterval();
  ctx.reply('Mensajes automáticos reiniciados');
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

const interval = 1 * 10 * 1000;

// Iniciar el intervalo y guardar la referencia
const intervalId = setInterval(sendWelcomeToAll, interval);

// Función para cancelar el intervalo
function stopInterval() {
  clearInterval(intervalId);
  console.log('Intervalo cancelado');
}

// Función para reiniciar el intervalo
function restartInterval() {
  clearInterval(intervalId);
  const newIntervalId = setInterval(sendWelcomeToAll, interval);
  console.log('Intervalo reiniciado');
  return newIntervalId;
}

bot.launch();

// Manejar cierre del proceso
process.once('SIGINT', () => {
  stopInterval(); // Cancelar el intervalo antes de cerrar
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  stopInterval(); // Cancelar el intervalo antes de cerrar
  bot.stop('SIGTERM');
});

// Exportar funciones para uso externo (opcional)
export { stopInterval, restartInterval };