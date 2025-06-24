export default async (req, res) => {
  try {
    if (req.method === 'POST') {
      // Procesar actualización de Telegram
      await bot.handleUpdate(req.body);
      res.status(200).json({ ok: true });
    } else if (req.method === 'GET') {
      // Endpoint para enviar mensajes programados
      chatIds.forEach(chatId => {
        bot.telegram.sendMessage(chatId, 'Welcome')
          .catch(err => console.log(`Error: ${err.message}`));
      });
      res.status(200).json({ message: 'Messages sent' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};