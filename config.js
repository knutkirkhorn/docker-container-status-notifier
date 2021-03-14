const dotenv = require('dotenv');

// Load the stored variables from `.env` file into process.env
dotenv.config();

module.exports = {
    discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
    discordWebhookID: process.env.DISCORD_WEBHOOK_ID || '',
    discordWebhookToken: process.env.DISCORD_WEBHOOK_TOKEN || ''
};
