const commando = require('discord.js-commando');

module.exports = class CustomRootCommand extends commando.Command {
	constructor(client, cmdInfo) {
		cmdInfo = {
			name: cmdInfo.name.replace(' ', ''),
			group: 'custom',
			memberName: cmdInfo.name.replace(' ', ''),
			description: 'A custom command.',
			examples: [cmdInfo.name.replace(' ', '').toString()],
			guildOnly: true
		}
		super(client, cmdInfo);
		this.cmdInfo = cmdInfo;
	}

	async run(msg, args) {
		if (!msg.client || !msg.guild) {
			return;
		}
		const provider = msg.client.provider;
		if (!provider) {
			return;
		}
		const guild = msg.guild;
		const name = this.cmdInfo.name.toLowerCase();
		const notFound = `Custom command ${this.cmdInfo.name} not found. Use !l[ist]c[ustom] to list.`;
		let val;
		try {
			val = provider.get(guild, name, notFound);
		} catch (err) {
			console.error(err);
			return msg.reply(`Had an error! Contact willyb321#2816`);
		}
		if (!val || val === notFound) {
			return msg.reply(notFound);
		}
		console.log(`Found custom command ${name} with value ${val.toString()}`);
		return msg.channel.send(val);
	}
};
