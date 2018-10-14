/**
 * @module Commands
 */
/**
 * ignore
 */
const Commando = require('discord.js-commando');

module.exports = class RestartCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'restart',
			group: 'questions',
			memberName: 'restart',
			description: 'restart.',
			details: 'restart.',
			examples: ['restart']
		});
	}

	hasPermission(message) {
		return message.client.isOwner(message.author);
	}

	async run(message) {
		const client = message.client;
		console.log('Restarting');
		return message.channel.send(':wave:')
			.then(() => {
				client.destroy()
				process.exit(0);
			}).catch(err => {
				console.error(err);
				process.exit(1);
			});
	}
};
