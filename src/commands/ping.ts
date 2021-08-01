'use strict';

import Discord from 'discord.js';

export function ping(message: Discord.Message) {
  message.channel.send('pong');
}
