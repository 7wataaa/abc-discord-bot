'use strict';

import dotenv from 'dotenv';
import { client } from './discordClient';
import { onMessage } from './onMessage';
import { sendNotification } from './scheduler/sendNotification';

dotenv.config();

client.on('ready', () => {
  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on('message', onMessage);

(async () => {
  await client.login(`${process.env.TOKEN}`);

  sendNotification(client);
})();
