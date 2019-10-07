/**
 * @module Commands
 */
/**
 * ignore
 */
const commando = require('discord.js-commando');

module.exports = class BanCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'ban',
			group: 'admin',
			memberName: 'ban',
			description: 'Ban someone.',
			details: 'Ban someone.',
			examples: ['ban @willyb321'],
			guildOnly: true,
			args: [
				{
					key: 'member',
					prompt: 'Who to ban?',
					type: 'member'
				},
				{
					key: 'reason',
					prompt: 'Why?',
					type: 'string'
				},
			]
		});
	}

	async run(message, args) {
		const botAccessHigh = await message.guild.settings.get('settings_highLvlBotAccess');
		if (!message.member.roles.get(botAccessHigh)) {
			return message.reply('Not enough permission.');
		}
		if (args.member.id === message.author.id) {
			return message.reply('You can\'t kick yourself.');
		}
		let banName = '';
		try {
			const member = args.member;
			banName = member.user.tag;
			await member.ban({reason: `Ban requested by ${message.author.tag} [ID: ${message.author.id}]\nReason given: ${args.reason.toString()}`})
		} catch (error) {
			console.error(error);
			return message.reply('Failed to ban.')
		}
		return message.channel.send(`Banned ${banName}`);

	}
};

