import { contest } from '@prisma/client';
import Discord from 'discord.js';

import { prisma } from '../prismaClient';

const oneMinuteAsMillisecond = 60000;
const thirtyMinuteAsMillisecond = 1800000;
const oneDayAsMillisecond = 86400000;

export async function sendNotification(client: Discord.Client) {
  while (true) {
    const nearestContestDate = (
      await prisma.contest.aggregate({
        _min: {
          date: true,
        },
      })
    )._min.date;

    if (!nearestContestDate) {
      await sleep(1000 * 30);
      continue;
    }

    const sendChannels = await prisma.send_channel.findMany();

    const nearestContests = await prisma.contest.findMany({
      where: {
        date: nearestContestDate,
      },
    });

    const contestInfo = nearestContests
      .map((e) => {
        return `${e.name}\n${e.url}`;
      })
      .join('\n');

    const timeDifference = nearestContestDate.getTime() - new Date().getTime();

    if (timeDifference < oneMinuteAsMillisecond) {
      await Promise.all([
        ...sendChannels.map((e) => {
          return async () => {
            const channel = client.channels.cache.get(e.channel_id);

            if (!channel) {
              console.error(
                `ERROR: 通知が送信できませんでした。チャンネルID: ${e.channel_id}, サーバーID: ${e.server_id}`
              );
            } else if (channel.isText()) {
              await channel.send(
                `@everyone\nまもなくコンテストが開始されます！\n${contestInfo}`
              );
              console.log(`通知を送信 チャンネルID: ${e.channel_id}`);
            }
          };
        }),
      ]);

      await prisma.contest.deleteMany({
        where: {
          date: nearestContestDate,
        },
      });

      await sleep(1000 * 30);
    } else if (timeDifference < thirtyMinuteAsMillisecond) {
      if (!nearestContests.every((e) => e.notified_times == 1)) {
        await sleep(1000 * 30);

        continue;
      }

      await Promise.all([
        ...sendChannels.map((e) => {
          return async () => {
            const channel = client.channels.cache.get(e.channel_id);

            if (!channel) {
              console.error(
                `ERROR: 通知が送信できませんでした。チャンネルID: ${e.channel_id}, サーバーID: ${e.server_id}`
              );
            } else if (channel.isText()) {
              await channel.send(
                `@everyone\n30分後にコンテストが開始されます！\n${contestInfo}`
              );
              console.log(`通知を送信 チャンネルID: ${e.channel_id}`);
            }
          };
        }),
      ]);

      await prisma.contest.updateMany({
        data: {
          notified_times: {
            increment: 1,
          },
        },
      });
    } else if (timeDifference < oneDayAsMillisecond) {
      if (!nearestContests.every((e) => e.notified_times == 0)) {
        await sleep(1000 * 30);

        continue;
      }

      await Promise.all([
        ...sendChannels.map((e) => {
          return async () => {
            const channel = client.channels.cache.get(e.channel_id);

            if (!channel) {
              console.error(
                `ERROR: 通知が送信できませんでした。チャンネルID: ${e.channel_id}, サーバーID: ${e.server_id}`
              );
            } else if (channel.isText()) {
              await channel.send(
                `明日、コンテストが開催されます！\n${contestInfo}`
              );
              console.log(`通知を送信 チャンネルID: ${e.channel_id}`);
            }
          };
        }),
      ]);

      await prisma.contest.updateMany({
        data: {
          notified_times: {
            increment: 1,
          },
        },
      });
    }

    await sleep(1000 * 30);
  }
}

/**
 * [millisecond]待つ Promiseを返す
 */
function sleep(millisecond: number) {
  return new Promise<void>((res) => [
    setTimeout(() => {
      res();
    }, millisecond),
  ]);
}

const embed = (description: string) =>
  new Discord.MessageEmbed()
    .setTitle('コンテスト通知')
    .setColor('#59B862')
    .setAuthor(
      'acbot',
      'https://cdn.discordapp.com/app-icons/860135640577212426/cea28ff8a283f1dd07d52b3030b480a1.png?size=128'
    )
    .setDescription(description);
