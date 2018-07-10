/**
 * @module Commands
 */
/**
 * ignore
 */
const commando = require('discord.js-commando');
const botAccessID = '417830772838367233';
module.exports = class PurgeCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'purge',
			group: 'misc',
			memberName: 'purge',
			description: 'Purge messages.',
			details: 'Purge messages.',
			examples: ['purge 5'],
			guildOnly: true,
			args: [
				{
					key: 'amount',
					prompt: 'How many messages to purge?',
					type: 'integer',
					validate: val => parseInt(val) >= 1 && parseInt(val) < 25
				}
			]
		});
	}

	hasPermission(msg) {
		if (!msg || !msg.member) {
			return false;
		}
		return !!msg.member.roles.get(botAccessID);

	}

	async run(message, args) {
		let limit = args.amount;
		if (!limit) {
			return;
		}
		if (limit > 25) {
			limit = 25;
		}
		return message.channel.fetchMessages({limit: limit + 1})
			.then(messages => message.channel.bulkDelete(messages))
			.catch(err => {
			});
	}
};


