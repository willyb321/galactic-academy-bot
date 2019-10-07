/**
 * @module Commands
 */
/**
 * ignore
 */
const Commando = require('discord.js-commando');

module.exports = class SetupBotLogCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'setlog',
			group: 'admin',
			memberName: 'setlog',
			description: 'Set up log channel.',
			details: 'Set up log channel.',
			guildOnly: true,
			examples: ['mute @willyb321#2816 10'],
			args: [
				{
					key: 'logchannel',
					prompt: 'Channel to log to? (#channel)',
					type: 'channel'
				}
			]
		});
	}

	async run(message, args) {
		const botAccessHigh = await message.guild.settings.get('settings_highLvlBotAccess');
		if (!message.member.roles.get(botAccessHigh)) {
			return new Commando.FriendlyError('Not enough permission.');
		}
		const logChannel = args.logchannel;
		try {
			await message.guild.settings.set('settings_logChannel', logChannel.id);
		} catch (err) {
			console.error(err);
			return message.channel.send('Failed to setup log channel.');
		}
		return message.channel.send(`Logging to: ${logChannel.toString()}`);
	}
};
