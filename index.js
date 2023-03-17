import discordWebhookWrapper from 'discord-webhook-wrapper';
import {EmbedBuilder} from 'discord.js';
import Docker from 'dockerode';
import config from './config.js';

const docker = new Docker();
const webhookClient = discordWebhookWrapper(config);

const embedChatColors = {
	error: '#ea5440',
	warning: '#e8bb51',
	ok: '#64e851'
};

// Send a message to the Discord Webhook with information about the container
async function sendMessage(dockerUpdate) {
	// Create a embed message to send
	const embedMessage = new EmbedBuilder()
		.setTitle('📦 **Container Status** 📦')
		.addFields({name: 'ID', value: `\`${dockerUpdate.Actor.ID}\``})
		.addFields({name: 'Name', value: `\`${dockerUpdate.Actor.Attributes.name}\``})
		.addFields({name: 'Image', value: `\`${dockerUpdate.Actor.Attributes.image}\``});

	// Set the description of the message depending on the Docker container status
	switch (dockerUpdate.status) {
		case 'create': {
			embedMessage.setColor(embedChatColors.ok)
				.setDescription('🔨 Container created');
			break;
		}
		case 'start': {
			embedMessage.setColor(embedChatColors.ok)
				.setDescription('🏁 Container started');
			break;
		}
		case 'stop': {
			embedMessage.setColor(embedChatColors.warning)
				.setDescription('✋ Container stopped');
			break;
		}
		case 'die': {
			embedMessage.setColor(embedChatColors.error)
				.setDescription(`💀 Container was killed with exit code \`${dockerUpdate.Actor.Attributes.exitCode}\``);
			break;
		}
		case 'destroy': {
			embedMessage.setColor(embedChatColors.error)
				.setDescription('🗑️ Container removed');
			break;
		}
		default: {
			// If none of these types of status do not send message
			return;
		}
	}

	await webhookClient.send({embeds: [embedMessage]});
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
