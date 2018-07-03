/**
 * @module Commands
 */
/**
 * ignore
 */
const Commando = require('discord.js-commando');
const TwitchListener = require('../../twitch');
const botAccessID = '417830772838367233';

module.exports = class TwitchSetCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'twitchchannel',
			group: 'questions',
			memberName: 'twitchchannel',
			description: 'Set twitch announcement channel.',
			details: 'Set twitch announcement channel.',
			examples: ['twitchchannel'],
			guildOnly: true

		});
	}

	hasPermission(msg) {
		if (!msg || !msg.member) {
			return false;
		}
		return !!msg.member.roles.get(botAccessID);
	}

	async run(message) {
		await message.guild.settings.set('twitch_channel', message.channel.id);
		return await message.reply(`Twitch announcement channel set to ${message.channel.toString()}`);
	}
};
