'use strict';

import { Discord } from './discordClient';
import { config } from './config';
import * as Commands from './commands/commands';

import { prisma } from './prismaClient';

export async function onMessage(message: Discord.Message) {
  // プレフィックスで始まらない文字列 or ボットからの送信は反応しない
  if (!message.content.startsWith(config.prefix) || message.author.bot) {
    return;
  }

  // リマインドを送信するチャンネル
  const targetChannel = prisma.send_channel.findUnique({
    where: {
      server_id: message.guild!.id,
    },
  });

  // 受け取ったメッセージのうち、プレフィックスのあとの単語たち
  const args = message.content.slice(config.prefix.length).split(' ');

  // pingとかのコマンド
  const command: string = args[0];

  // リマインドを送信するチャンネルを設定してなければしてもらうif
  if (!(await targetChannel)) {
    setFirstRemindChannel(message);
  }

  // コマンドごとに振り分ける
  switch (command) {
    case 'addme':
      // Commands.addme(message);
      message.channel.send('ver.2にて実装予定です。');
      break;

    case 'removeme':
      // Commands.removeme(message);
      message.channel.send('ver.2にて実装予定です。');
      break;

    case 'remindChannel':
      // TODO remindChannelの実装(現在の通知するチャンネルを確認するコマンド)
      break;

    case 'changeNotificationChannel':
      Commands.changeNotificationChannel(message);
      break;

    case 'ping':
      Commands.ping(message);
      break;

    case 'help':
      message.channel.send(`コマンド一覧はこちら↓`);
      Commands.help(message);
      break;

    default:
      // 未知のコマンドを受け取ったときの処理
      message.channel.send(`未知のコマンドです。コマンド一覧はこちら↓`);
      Commands.help(message);
      break;
  }
}

// リマインドするチャンネルを設定する関数
async function setFirstRemindChannel(message: Discord.Message) {
  // メッセージのembed
  const embed = (description: string) =>
    new Discord.MessageEmbed()
      .setTitle('Initial setting')
      .setColor('#59B862')
      .setAuthor(
        'acbot',
        'https://cdn.discordapp.com/app-icons/860135640577212426/cea28ff8a283f1dd07d52b3030b480a1.png?size=128'
      )
      .setDescription(description);

  // send_channelにリマインドする予定のチャンネルを保存する
  const createResult = await prisma.send_channel
    .create({
      data: {
        server_id: message.guild!.id,
        channel_id: message.channel.id,
      },
    })
    .catch(
      () =>
        'リマインドを送信するチャンネルidをデータベースに登録することができませんでした。'
    );

  // もし正常に作成ができていなかったらreturn
  if (typeof createResult === 'string') {
    message.channel.send(embed(`ERR: ${createResult}`));
    return;
  }

  const msg = await message.channel.send(
    embed(
      `リマインドを送信するチャンネルをこのチャンネルに設定しました。\n今後\n${message.guild!.channels.cache.find(
        (c) => c.id === createResult.channel_id
      )}\nに通知を送信します。\n変更する場合は、${
        config.prefix
      }changeNotificationChannel で変更することができます。`
    )
  );
}
