import {MessageEmbed, WebhookClient} from 'discord.js';
import Docker from 'dockerode';
import config from './config.js';

const docker = new Docker();
const {discordWebhookUrl, discordWebhookId, discordWebhookToken} = config;

// Check if either Discord Webhook URL or Discord Webhook ID and token is provided
if (!(discordWebhookUrl || (discordWebhookId !== '' && discordWebhookToken !== ''))) {
    throw new Error('You need to specify either Discord Webhook URL or both Discord Webhook ID and token!');
}

const webhookClient = discordWebhookUrl ? new WebhookClient({url: discordWebhookUrl}) : new WebhookClient({id: discordWebhookId, token: discordWebhookToken});

const embedChatColors = {
    error: '#ea5440',
    warning: '#e8bb51',
    ok: '#64e851'
};

// Send a message to the Dicord Webhook with information about the container
async function sendMessage(dockerUpdate) {
    // Create a rich embed message to send
    const embedMessage = new MessageEmbed()
        .setTitle('📦 **Container Status** 📦')
        .addField('ID', `\`${dockerUpdate.Actor.ID}\``)
        .addField('Name', `\`${dockerUpdate.Actor.Attributes.name}\``)
        .addField('Image', `\`${dockerUpdate.Actor.Attributes.image}\``);

    // Set the description of the message depending on the Docker container status
    switch (dockerUpdate.status) {
        case 'create':
            embedMessage.setColor(embedChatColors.ok)
                .setDescription('🔨 Container created');
            break;
        case 'start':
            embedMessage.setColor(embedChatColors.ok)
                .setDescription('🏁 Container started');
            break;
        case 'stop':
            embedMessage.setColor(embedChatColors.warning)
                .setDescription('✋ Container stopped');
            break;
        case 'die':
            embedMessage.setColor(embedChatColors.error)
                .setDescription(`💀 Container was killed with exit code \`${dockerUpdate.Actor.Attributes.exitCode}\``);
            break;
        case 'destroy':
            embedMessage.setColor(embedChatColors.error)
                .setDescription('🗑️ Container removed');
            break;
        default:
            // If none of these types of status do not send message
            return;
    }

    await webhookClient.send(embedMessage);
}

// Get event stream for Docker
docker.getEvents((error, readableStream) => {
    if (error) {
        console.log(error);
        return;
    }

    // Listen for new data
    readableStream.on('data', async chunk => {
        const dockerUpdate = JSON.parse(chunk);

        // Check if the update is for a container
        if (dockerUpdate.Type === 'container') {
            await sendMessage(dockerUpdate);
        }
    });
});
