import { TextChannel } from 'discord.js';
import { client } from '../discordClient';
import { prisma } from '../prismaClient';

// TODO Heroku schedulerで10分間隔で起動させる、もし予定された時刻が10分以内だったらその時刻まで待って通知を送信する
async function sendNotification() {
  // TODO モックからDBにある日付に変更する
  const target = new Date(2021, 8, 18, 20 - 9, 14);

  // TODO 一応日付またぐ場合の処理しないといけない
  const timeDifference = target.valueOf() - new Date().valueOf();

  // 過ぎてしまった時間と、10分以上の差がある場合何もしない
  if (timeDifference < 0 || 600000 <= timeDifference) {
    console.info('予定が10分未満ではないので何もしない');
    return;
  }
  console.info(
    `予定が10分未満なので${timeDifference}ミリ秒待って通知を送信する`
  );

  // 時刻まで待つ
  await sleep(timeDifference);

  console.info(`${timeDifference}ミリ秒待ったので通知を送信`);

  // DBに登録してるサーバーのチャンネルに送信してく
  const sendChannels = await prisma.send_channel.findMany();

  for (const e of sendChannels) {
    const channel = client.channels.cache!.get(e.channel_id) as TextChannel;

    console.info(channel.name);
    channel.send(`DEBUG用: 時刻は${target}です。`);
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
