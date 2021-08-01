'use strict';

import Discord from 'discord.js';
import { config } from './config';
import * as Commands from './commands/commands';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function onMessage(message: Discord.Message) {
  if (!message.content.startsWith(config.prefix) || message.author.bot) {
    return;
  }

  const targetChannel = prisma.send_channel.findUnique({
    where: {
      server_id: message.guild!.id,
    },
  });

  const args = message.content.slice(config.prefix.length).split(' ');

  const command: string = args[0];

  // リマインドを送信するチャンネルを設定してなければしてもらう
  if (!(await targetChannel)) {
    const filter: Discord.CollectorFilter = (reaction, user) =>
      ['✅', '❌'].includes(reaction.emoji.name) &&
      user.id === message.author.id;

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

    if (typeof collected === 'string') {
      message.channel.send(
        '応答を確認することができませんでした。。もう一度やり直してください。'
      );
      return;
    }

    const emoji = collected.first()!.emoji.name;

    // ❌のリアクションだと何もしない
    if (emoji === '❌') {
      message.channel.send(
        '了解しました。他のチャンネルでもう一度やり直してください。'
      );
      return;
    }

    // TODO ここでDBにチャンネルを保存する

    const createResult = await prisma.send_channel
      .create({
        data: {
          server_id: message.guild!.id,
          channel_id: message.channel.id,
        },
      })
      .catch(() => 'Error');

    if (typeof createResult === 'string') {
      message.channel.send(
        'ERR: データベースに登録することができませんでした。'
      );
      return;
    }

    message.channel.send(
      `わかりました！ 今後\n${message.guild!.channels.cache.find(
        (c) => c.id === createResult.channel_id
      )}\nに通知を送信します。\n変更する場合は、${
        config.prefix
      }channel [channelのid] で変更することができます。`
    );

    return;
  }

  switch (command) {
    case 'ping':
      Commands.ping(message);
      break;

    case 'fetch':
      Commands.fetch(message);
      break;

    default:
      break;
  }
}
