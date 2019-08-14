/**
 * @module Commands
 */
/**
 * ignore
 */
const Commando = require('discord.js-commando');

module.exports = class SetupAutoRoleCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'setautorole',
			group: 'admin',
			memberName: 'setautorole',
			description: 'Set a role to be given to users on join.',
			details: 'Set a role to be given to users on join.',
			guildOnly: true,
			examples: ['setautorole @CMDR', 'setautorole'],
			args: [
				{
					key: 'role',
					prompt: 'Role to be given to user on join?',
					type: 'role'
				}
			]
		});
	}

	hasPermission(message) {
		return message.client.isOwner(message.author);
	}

	async run(message, args) {
		const role = args.role;
		try {
			await message.guild.settings.set('autoRole', role.id);
		} catch (err) {
			console.error(err);
			return message.channel.send('Failed to setup auto role.');
		}
		return message.channel.send(`Setup auto roles.`);
	}
};
