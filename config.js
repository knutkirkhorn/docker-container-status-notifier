import dotenv from 'dotenv';

// Load the stored variables from `.env` file into process.env
dotenv.config();

export default {
	discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
	discordWebhookId: process.env.DISCORD_WEBHOOK_ID || '',
	discordWebhookToken: process.env.DISCORD_WEBHOOK_TOKEN || ''
};
