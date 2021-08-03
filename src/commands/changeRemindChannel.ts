'use strict';

import { prisma } from '../prismaClient';
import { Discord } from '../discordClient';

// リマインドする予定のチャンネルを変更
export async function changeRemindChannel(message: Discord.Message) {
  const filter: Discord.CollectorFilter = (reaction, user) =>
    ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;

  const pastRemindChannel = await prisma.send_channel.findUnique({
    where: {
      server_id: message.guild!.id,
    },
  });

  //  pastRemindChannelが正常に取得できるかによるメッセージの文章
  const verificationMessage =
    pastRemindChannel !== null
      ? `リマインドするチャンネルは現在、\n${message.guild!.channels.cache.find(
          (c) => c.id === pastRemindChannel.channel_id
        )}\nに設定されています。\nリマインドするチャンネルをこのチャンネルに再設定しますか?`
      : 'リマインドするチャンネルが正常に保存されていません。\nリマインドするチャンネルをこのチャンネルに再設定しますか?';

  const embed = (description: string) =>
    new Discord.MessageEmbed()
      .setTitle('changeRemindChannel')
      .setColor('#59B862')
      .setAuthor(
        'acbot',
        'https://cdn.discordapp.com/app-icons/860135640577212426/cea28ff8a283f1dd07d52b3030b480a1.png?size=128'
      )
      .setDescription(description);

  // リアクションをつける確認メッセージ
  const responseWaitingMessage = await message.channel.send(
    embed(verificationMessage)
  );

  // 応答してほしい絵文字の表示
  await responseWaitingMessage.react('✅');
  await responseWaitingMessage.react('❌');

  // 10秒間だけリアクションを待って、リアクションがあればDiscord.Collectionを返す
  const collected = await responseWaitingMessage
    .awaitReactions(filter, {
      max: 1,
      maxEmojis: 1,
      maxUsers: 1,
      time: 10000,
      errors: ['time'],
    })
    .catch(() => 'Error');

  responseWaitingMessage.reactions.removeAll();

  // もし正常に応答されなかったらreturn
  if (typeof collected === 'string') {
    message.channel.send(
      embed(
        '応答を確認することができませんでした。。もう一度やり直してください。'
      )
    );
    return;
  }

  // 入力されたemoji ✅ or ❌
  const emoji = collected.first()!.emoji.name;

  // ❌のリアクションだとreturn
  if (emoji === '❌') {
    message.channel.send(embed('了解しました。'));
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
