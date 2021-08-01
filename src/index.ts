'use strict';

import Discord from 'discord.js';
import dotenv from 'dotenv';
import { onMessage } from './onMessage';

dotenv.config();

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on('message', onMessage);

client.login(`${process.env.TOKEN}`);
