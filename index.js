import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';

const TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const SHARED_SECRET = process.env.SHARED_SECRET;

// ჩასვი შენი Application ID და სერვერის (Guild) ID
const CLIENT_ID = "1437790901442314404";
const GUILD_ID = "1437798673944805529";

const commands = [
  new SlashCommandBuilder()
    .setName('license')
    .setDescription('Generates a 5-digit license code')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

try {
  console.log('🌀 Registering slash commands...');
  await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
  console.log('✅ /license command registered!');
} catch (err) {
  console.error('❌ Command registration failed:', err);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`🤖 Bot is online as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'license') {
    const code = Math.floor(10000 + Math.random() * 90000);
    await interaction.reply(`🔑 License code: **${code}**`);
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: code, secret: SHARED_SECRET })
      });
      console.log(`✅ License ${code} sent to app`);
    } catch (e) {
      console.error('Webhook error:', e);
    }
  }
});

client.login(TOKEN);
