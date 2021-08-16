'use strict';

import { prisma } from '../prismaClient';
import { Discord } from '../discordClient';

// リマインドする予定のチャンネルを変更
export async function changeRemindChannel(message: Discord.Message) {
  const embed = (description: string) =>
    new Discord.MessageEmbed()
      .setTitle('changeRemindChannel')
      .setColor('#59B862')
      .setAuthor(
        'acbot',
        'https://cdn.discordapp.com/app-icons/860135640577212426/cea28ff8a283f1dd07d52b3030b480a1.png?size=128'
      )
      .setDescription(description);

  const permission: Discord.PermissionString[] = ['ADMINISTRATOR'];

  // メッセージ送信者がpermissionを持っていなかったらreturn
  if (!message.member.hasPermission(permission)) {
    message.channel.send(
      embed(`このコマンドを実行するための権限がありません。\n\n${permission}`)
    );
    return;
  }

  // リマインドするチャンネルを更新、なければ作成する
  const upsertResult = await prisma.send_channel.upsert({
    where: {
      server_id: message.guild!.id,
    },
    create: {
      server_id: message.guild!.id,
      channel_id: message.channel.id,
    },
    update: {
      server_id: message.guild!.id,
      channel_id: message.channel.id,
    },
  });

  message.channel.send(
    embed(
      `わかりました！ 今後\n${message.guild!.channels.cache.find(
        (c) => c.id === upsertResult.channel_id
      )}\nに通知を送信します。`
    )
  );
}
