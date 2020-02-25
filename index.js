const Docker = require('dockerode');
const docker = new Docker();
const Discord = require('discord.js');
const config = require('./config');
const {discordWebhookUrl, discordWebhookID, discordWebhookToken} = config;

// Check if either Discord Webhook URL or Discord Webhook ID and token is provided
if (!(discordWebhookUrl || (discordWebhookID !== '' && discordWebhookToken !== ''))) {
    throw new Error('You need to specify either Discord Webhook URL or both Discord Webhook ID and token!');
}

// Retrieve the ID and token from the Webhook URL
// This is from the Discord Webhook URL format:
// 'https://discordapp.com/api/webhooks/<ID_HERE>/<TOKEN_HERE>'
// If the Webhook URL is empty get the values from the provided ID and token
const [webhookID, webhookToken] = discordWebhookUrl ? discordWebhookUrl.split('/').splice(5, 2) : [discordWebhookID, discordWebhookToken];

const discordHookClient = new Discord.WebhookClient(webhookID, webhookToken);

const embedChatColors = {
    error: '#ea5440',
    warning: '#e8bb51',
    ok: '#64e851'
};

// Send a message to the Dicord Webhook with information about the container
function sendMessage(dockerUpdate) {
    // Create a rich embed message to send
    const richEmbedMessage = new Discord.RichEmbed()
        .setTitle('📦 **Container Status** 📦')
        .addField('ID', `\`${dockerUpdate.Actor.ID}\``)
        .addField('Name', `\`${dockerUpdate.Actor.Attributes.name}\``)
        .addField('Image', `\`${dockerUpdate.Actor.Attributes.image}\``);

    // Set the description of the message depending on the Docker container status
    switch (dockerUpdate.status) {
        case 'create':
            richEmbedMessage.setColor(embedChatColors.ok)
                .setDescription('🔨 Container created');
            break;
        case 'start':
            richEmbedMessage.setColor(embedChatColors.ok)
                .setDescription('🏁 Container started');
            break;
        case 'stop':
            richEmbedMessage.setColor(embedChatColors.warning)
                .setDescription('✋ Container stopped');
            break;
        case 'die':
            richEmbedMessage.setColor(embedChatColors.error)
                .setDescription(`💀 Container was killed with exit code \`${dockerUpdate.Actor.Attributes.exitCode}\``);
            break;
        case 'destroy':
            richEmbedMessage.setColor(embedChatColors.error)
                .setDescription('🗑️ Container removed');
            break;
        default:
            // If none of these types of status do not send message
            return;
    }

    discordHookClient.send(richEmbedMessage);
}

// Get event stream for Docker
docker.getEvents((error, readableStream) => {
    if (error) {
        console.log(error);
        return;
    }

    // Listen for new data
    readableStream.on('data', chunk => {
        const dockerUpdate = JSON.parse(chunk);

        // Check if the update is for a container
        if (dockerUpdate.Type === 'container') {
            sendMessage(dockerUpdate);
        }
    });
});