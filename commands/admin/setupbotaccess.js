/**
 * @module Commands
 */
/**
 * ignore
 */
const Commando = require('discord.js-commando');

module.exports = class SetupBotAccessRoleCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'setbotaccess',
			group: 'admin',
			memberName: 'setbotaccess',
			description: 'Set up bot access role.',
			details: 'Set up bot access role.',
			guildOnly: true,
			examples: ['mute @willyb321#2816 10'],
			args: [
				{
					key: 'lowlevel',
					prompt: 'Bot Access low level role? (everything but kick, ban, purge) (@ mention it)',
					type: 'role'
				},
				{
					key: 'highlevel',
					prompt: 'Bot Access high level role? (kick, ban, purge) (@ mention it)',
					type: 'role'
				}
			]
		});
	}

	hasPermission(message) {
		return message.client.isOwner(message.author);
	}

	async run(message, args) {
		const lowLvl = args.lowlevel;
		const highLvl = args.highlevel;
		try {
			await message.guild.settings.set('lowLvlBotAccess', lowLvl.id);
			await message.guild.settings.set('highLvlBotAccess', highLvl.id);
		} catch (err) {
			console.error(err);
			return message.channel.send('Failed to setup bot access role.');
		}
		return message.channel.send(`Setup bot access roles.`);
	}
};
