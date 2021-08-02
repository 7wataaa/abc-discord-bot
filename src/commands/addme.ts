'use strict';

import Discord from 'discord.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// メンションを飛ばすユーザーの登録
export async function addme(message: Discord.Message) {
  const createResult = await prisma.send_users
    .create({
      data: {
        server_id: message.guild!.id,
        user_id: message.author.id,
      },
    })
    .catch((e) => {
      console.log(e);
      if (e.code === 'P2002') {
        return `${message.author}さんはすでに登録されています。`;
      } else {
        return 'ユーザーの追加時にデータベースへの追加ができませんでした。。';
      }
    });

  if (typeof createResult === 'string') {
    message.channel.send(`ERR: ${createResult}`);
    return;
  }

  message.channel.send(
    `わかりました！\n今後の通知時に${message.author}さんにメンションを追加します。`
  );
}
