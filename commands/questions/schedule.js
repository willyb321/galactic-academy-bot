/**
 * @module Commands
 */
/**
 * ignore
 */
const Commando = require('discord.js-commando');
const Scheduler = require('../../schedule');

module.exports = class RestartCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'schedule',
			group: 'misc',
			memberName: 'schedule',
			description: 'schedule.',
			details: 'Schedule an announcement.',
			examples: ['restart'],
			args: [
				{
					key: 'numMsg',
					prompt: 'Minimum messages gap',
					type: 'integer',
					wait: 60
				},
				{
					key: 'time',
					prompt: 'Minimum time gap (hours)',
					type: 'float',
					wait: 60
				},
				{
					key: 'text',
					prompt: 'Text to announce',
					type: 'string',
					wait: 60
				}
			]
		});
	}

	hasPermission(message) {
		return message.client.isOwner(message.author);
	}

	async run(message, args) {
		const {text, time, numMsg} = args;
		const scheduler = new Scheduler(message.client.channels.get(message.channel.id), text, time, numMsg);
	}
};
