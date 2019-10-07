/**
 * @module Commands
 */
/**
 * ignore
 */
const commando = require('discord.js-commando');

const botAccessID = '417830772838367233';
module.exports = class KickCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'kick',
			group: 'admin',
			memberName: 'kick',
			description: 'Kick someone.',
			details: 'Kick someone.',
			examples: ['kick @willyb321'],
			guildOnly: true,
			args: [
				{
					key: 'member',
					prompt: 'Who to kick?',
					type: 'member'
				},
				{
					key: 'reason',
					prompt: 'Why?',
					type: 'string'
				}
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
		let kickName = '';
		try {
			const member = args.member;
			kickName = member.user.tag;
			await member.kick(`Kick requested by ${message.author.tag} [ID: ${message.author.id}]\nReason given: ${args.reason.toString()}`)
		} catch (error) {
			console.error(error);
			return message.reply('Failed to kick.');
		}
		return message.channel.send(`Kicked ${kickName}`);
	}
};

