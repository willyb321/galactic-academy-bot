const commando = require('discord.js-commando');

const botAccessID = '417830772838367233';

module.exports = class CustomDelCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'delcustom',
			aliases: ['dc'],
			group: 'questions',
			memberName: 'delcustom',
			description: 'Delete custom commands.',
			examples: ['delcustom <name>'],
			guildOnly: true,

			args: [
				{
					key: 'name',
					prompt: 'Command name?',
					type: 'string',
					infinite: false,
					wait: 60
				}
			]
		});
	}

	hasPermission(msg) {
		if (!msg || !msg.member) {
			return false;
		}
		return Boolean(msg.member.roles.get(botAccessID));
	}

	async run(msg, args) {
		if (!msg.client) {
			return;
		}
		const provider = msg.client.provider;
		if (!provider) {
			return;
		}
		const guild = msg.guild;
		const name = args.name;
		return provider.remove(guild, name)
			.then(() => {
				console.log(`Removed custom command ${name}`);
				const cmd = msg.client.registry.findCommands(name, true, msg)[0];
				if (cmd) {
					msg.client.registry.unregisterCommand(cmd);
				}
				return msg.reply(`Removed custom command ${name}`);
			})
			.catch(err => {
				console.error(err);
				return msg.reply('Had an error! Contact willyb321#2816.');
			});
	}
};
