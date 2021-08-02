'use strict';

import { Discord } from '../discordClient';
import { prisma } from '../prismaClient';

// メンションを飛ばすユーザーの登録解除
export async function removeme(message: Discord.Message) {
  const removeResult = await prisma.send_users
    .delete({
      where: {
        server_id_user_id: {
          server_id: message.guild!.id,
          user_id: message.author.id,
        },
      },
    })
    .catch((e) => {
      console.log(e);
      if (e.meta.cause === 'Record to delete does not exist.') {
        return `データベースに${message.author}さんは登録されていません。`;
      } else {
        return 'ユーザーをデータベースから削除することができませんでした。。';
      }
    });

  if (typeof removeResult === 'string') {
    message.channel.send(`ERR: ${removeResult}`);
    return;
  }

  message.channel.send(
    `わかりました。\n${message.author}さんの通知を解除します。`
  );
}
