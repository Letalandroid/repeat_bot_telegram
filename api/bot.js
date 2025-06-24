
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.KEY_BOT);

const chatIds = new Set();

bot.start((ctx) => {
  chatIds.add(ctx.chat.id);
  ctx.reply('Welcome');
});