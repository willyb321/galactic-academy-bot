const Commando = require('discord.js-commando');

module.exports = class CustomDelCommand extends Commando.Command {
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

	async run(msg, args) {
		if (!msg.client) {
			return;
		}
		const botAccessLow = await msg.guild.settings.get('settings_lowLvlBotAccess');
		if (!msg.member.roles.get(botAccessLow)) {
			return new Commando.FriendlyError('Not enough permission.');
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
