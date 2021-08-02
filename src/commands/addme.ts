'use strict';

import Discord from 'discord.js';

export function addme(message: Discord.Message) {
  // TODO addmeの実装(メンションを飛ばすユーザーの登録)
  message.channel.send('pong');
}
