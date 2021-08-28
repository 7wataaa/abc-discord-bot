import Discord from 'discord.js';

import { prisma } from '../prismaClient';

const oneMinutesAsMillisecond = 60000;

// TODO Heroku schedulerで10分間隔で起動させる、もし予定された時刻が10分以内だったらその時刻まで待って通知を送信する
export async function sendNotification(client: Discord.Client) {
  while (true) {
    // TODO DBから一番小さい日時をみて、その時間と同じ分なら通知を送信、DBのデータを消す
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

    const timeDifference = nearestContestDate.getTime() - new Date().getTime();

    if (timeDifference > oneMinutesAsMillisecond) {
      await sleep(1000 * 30);
      continue;
    }

    const nearestContests = await prisma.contest.findMany({
      where: {
        date: nearestContestDate,
      },
    });

    const sendChannels = await prisma.send_channel.findMany();

    for (const sendChannel of sendChannels) {
      const channel = client.channels.cache.get(sendChannel.channel_id);

      if (!channel) {
        console.error(
          `ERROR: 通知が送信できませんでした。チャンネルID: ${sendChannel.channel_id}, サーバーID: ${sendChannel.server_id}`
        );

        continue;
      }

      console.log(`通知を送信 チャンネルID: ${sendChannel.channel_id}`);

      if (channel.isText()) {
        const contestInfo = nearestContests
          .map((e) => {
            return `${e.name}\n${e.url}`;
          })
          .join('\n');

        await channel.send(
          embed(`@everyone\nまもなくコンテストが開始されます！\n${contestInfo}`)
        );
      }
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
    .setTitle('Initial setting')
    .setColor('#59B862')
    .setAuthor(
      'acbot',
      'https://cdn.discordapp.com/app-icons/860135640577212426/cea28ff8a283f1dd07d52b3030b480a1.png?size=128'
    )
    .setDescription(description);
