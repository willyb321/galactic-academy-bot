const commando = require('discord.js-commando');
const registerAllCmds = require('../../custom-reg');

const botAccessID = '417830772838367233';

module.exports = class CustomSetCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'setcustom',
			aliases: ['sc'],
			group: 'questions',
			memberName: 'setcustom',
			description: 'Custom commands.',
			examples: ['custom add<enter>'],
			guildOnly: true,

			args: [
				{
					key: 'name',
					prompt: 'Command name? (Will be called by ?c[ustom] <name>',
					type: 'string',
					infinite: false,
					wait: 60
				},
				{
					key: 'text',
					prompt: 'Command text? (Will be printed when called)',
					type: 'string',
					wait: 60
				}
			]
		});
	}
	async run(msg, args) {
		if (!msg.client) {
			return;
		}
		const botAccessLow = await msg.guild.settings.get('lowLvlBotAccess');
		if (!msg.member.roles.get(botAccessLow)) {
			return new Commando.FriendlyError('Not enough permission.');
		}
		const provider = msg.client.provider;
		if (!provider) {
			return;
		}
		const guild = msg.guild;
		const name = args.name.toLowerCase();
		const val = args.text;
		console.log(val);
		return provider.set(guild, name, val)
			.then(() => {
				console.log(`Added custom command ${name}`);
				registerAllCmds(msg.client, msg.guild);
				return msg.reply(`Added custom command ${name}`);
			})
			.catch(err => {
				console.error(err);
				return msg.reply('Had an error! Contact willyb321#2816.');
			});
	}
};
