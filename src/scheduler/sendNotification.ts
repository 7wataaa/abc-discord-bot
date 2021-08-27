import { client, Discord } from '../discordClient';
import { prisma } from '../prismaClient';

//=================================

(async () => {
  //await sendNotification();

  const embed = (description: string) =>
    new Discord.MessageEmbed()
      .setTitle('Initial setting')
      .setColor('#59B862')
      .setAuthor(
        'acbot',
        'https://cdn.discordapp.com/app-icons/860135640577212426/cea28ff8a283f1dd07d52b3030b480a1.png?size=128'
      )
      .setDescription(description);

  console.log(client.uptime);
  //client.channels.cache.get('876878253313384499');
})();

//=================================

const oneDateAsMillisecond = 86400 * 1000;

// TODO Heroku schedulerで10分間隔で起動させる、もし予定された時刻が10分以内だったらその時刻まで待って通知を送信する
async function sendNotification() {
  /* while (true) {
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

    // TODO ここで時間を判定する

    const nearestTimeContests = await prisma.contest.findMany({
      where: {
        date: nearestContestDate,
      },
    });

    const sendChannels = await prisma.send_channel.findMany();

    for (const sendChannel of sendChannels) {
      
    }

    await sleep(1000 * 30);
  } */
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
