'use strict';

import dotenv from 'dotenv';
import { client } from './discordClient';
import { onMessage } from './onMessage';

dotenv.config();

client.on('ready', () => {
  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on('message', onMessage);

client.login(`${process.env.TOKEN}`);
