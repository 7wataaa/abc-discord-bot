'use strict';

import { Discord } from '../discordClient';

export function ping(message: Discord.Message) {
  message.channel.send('pong');
}
