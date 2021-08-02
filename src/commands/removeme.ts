'use strict';

import Discord from 'discord.js';

export function removeme(message: Discord.Message) {
  // TODO removemeの実装(メンションを飛ばすユーザーの登録解除)
  message.channel.send('pong');
}
