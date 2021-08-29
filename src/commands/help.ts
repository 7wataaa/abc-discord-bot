'use strict';

import { Discord } from '../discordClient';
import { config } from '../config';

// コマンドたちを説明する埋め込みを送信するコマンド
export function help(message: Discord.Message) {
  // 埋め込みのやつ
  const embed = new Discord.MessageEmbed()
    .setTitle('acbot の つかいかた')
    .setColor('#59B862')
    .setAuthor(
      'acbot',
      'https://cdn.discordapp.com/app-icons/860135640577212426/cea28ff8a283f1dd07d52b3030b480a1.png?size=128'
    )
    .setDescription(`プレフィックスは"${config.prefix}" です。`)
    .addFields([
      { name: 'addme', value: '叩き起こすユーザーを登録できます。' },
      { name: 'removeme', value: '叩き起こすユーザーを登録解除できます。' },
      {
        name: 'changeRemindChannel',
        value: 'リマインド予定のチャンネルを変更できます。',
      },
      { name: 'ping', value: 'ピンポンができます。デバッグ用。' },
      { name: 'help', value: 'これをもう一度見たいときにどうぞ。' },
    ]);

  //埋め込みのやつを送信
  message.channel.send(embed);
}
