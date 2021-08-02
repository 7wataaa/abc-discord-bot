'use strict';

import Discord from 'discord.js';
import { config } from './config';
import * as Commands from './commands/commands';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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

    // TODO ここでreturnするか考える(コマンドの検知→初期設定のながれのあとにそのコマンドを実行するかどうか)
    return;
  }

  // コマンドごとに振り分ける
  switch (command) {
    case 'addme':
      Commands.addme(message);
      break;

    case 'changeRemindChannel':
      Commands.changeRemindChannel(message);
      break;

    case 'fetch':
      Commands.fetch(message);
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
  const filter: Discord.CollectorFilter = (reaction, user) =>
    ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;

  // リアクションをつける確認メッセージ
  const responseWaitingMessage = await message.channel.send(
    `リマインドするチャンネルが設定されていません。\nこのチャンネルに設定しますか?`
  );

  // 応答してほしい絵文字の表示
  responseWaitingMessage.react('✅');
  responseWaitingMessage.react('❌');

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

  // もし正常に応答されなかったらreturn
  if (typeof collected === 'string') {
    message.channel.send(
      '応答を確認することができませんでした。。もう一度やり直してください。'
    );
    return;
  }

  // 入力されたemoji ✅ or ❌
  const emoji = collected.first()!.emoji.name;

  // ❌のリアクションだとreturn
  if (emoji === '❌') {
    message.channel.send(
      '了解しました。他のチャンネルでもう一度やり直してください。'
    );
    return;
  }

  // send_channelにリマインドする予定のチャンネルを保存する
  const createResult = await prisma.send_channel
    .create({
      data: {
        server_id: message.guild!.id,
        channel_id: message.channel.id,
      },
    })
    .catch(() => 'Error');

  // もし正常に作成ができていなかったらreturn
  if (typeof createResult === 'string') {
    message.channel.send('ERR: データベースに登録することができませんでした。');
    return;
  }

  message.channel.send(
    `わかりました！ 今後\n${message.guild!.channels.cache.find(
      (c) => c.id === createResult.channel_id
    )}\nに通知を送信します。\n変更する場合は、${
      config.prefix
    }changeRemindChannel で変更することができます。`
  );
}
