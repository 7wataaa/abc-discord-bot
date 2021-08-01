'use strict';

import Discord from 'discord.js';
import { config } from '../config';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ping } from './ping';

export async function fetch(message: Discord.Message) {
  await message.reply('Starting fetch!');
  message.channel.startTyping();

  const res = await axios
    .get<string>(
      'https://script.google.com/macros/s/AKfycbwKRDUHLrdx3NsuGjkLNqVegGNPXXnJaComq9h219zJzrYkiaCGlViCdvIlv28SWmBd0w/exec'
    )
    .catch((e: AxiosError) => {
      const status = e.response?.status ?? '___';
      console.error(`ERROR: Status code is ${status}!\n${e}`);
      return e;
    });

  console.log(res);

  message.channel.stopTyping();

  if ((res as AxiosError).isAxiosError) {
    message.reply('エラーが発生したため、fetchできませんでした。。');
    return;
  } else {
    message.reply('Fetch finished!');
  }

  const comingABCData = (
    (res as AxiosResponse).data as {
      date: string;
      contestName: string;
    }[]
  ).map((e) => {
    return {
      date: new Date(e.date),
      contestName: e.contestName,
    };
  });

  if (comingABCData?.length == 0 ?? true) {
    message.reply('予定されたAtCoder Beginner Contestはありません');
  } else {
    await message.reply(
      `${comingABCData.map((e) => `${e.date} ${e.contestName}`).join('\n')}`
    );
  }
}
