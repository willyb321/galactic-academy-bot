/**
 * @module Commands
 */
/**
 * ignore
 */
const Commando = require('discord.js-commando');

module.exports = class SetupMuteCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'setmute',
			group: 'admin',
			memberName: 'setmute',
			description: 'Set up a mute role and permissions.',
			details: 'Set up a mute role and permissions.',
			guildOnly: true,
			examples: ['mute @willyb321#2816 10'],
			args: [
				{
					key: 'muterole',
					prompt: 'Mute role? (@ mention it)',
					type: 'role'
				}
			]
		});
	}

	hasPermission(message) {
		return true
	}

	async run(message, args) {
		const botAccessHigh = await message.guild.settings.get('settings_highLvlBotAccess');
		if (!message.member.roles.get(botAccessHigh)) {
			return new Commando.FriendlyError('Not enough permission.');
		}
		const muteRole = args.muterole;
		try {
			await message.guild.settings.set('muteRole', muteRole.id);
		} catch (err) {
			console.error(err);
			return message.channel.send('Failed to setup mute role.');
		}
		return message.channel.send(`Added mute role: ${muteRole.toString()}`);
	}
};
