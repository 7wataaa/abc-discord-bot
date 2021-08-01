'use strict';

import Discord from 'discord.js';

export function changeRemindChannel(message: Discord.Message) {
  // TODO channelの実装(リマインドする予定のチャンネルの変更)
  message.channel.send('changeRemindChannel');
}
