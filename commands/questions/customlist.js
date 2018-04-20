const commando = require('discord.js-commando');
const getUrls = require('get-urls');
const truncateString = (str, num) =>
	str.length > num ? str.slice(0, num > 3 ? num - 3 : num) + '...' : str;
module.exports = class CustomGetCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'listcustom',
			aliases: ['lc'],
			group: 'questions',
			memberName: 'listcustom',
			description: 'List custom commands.',
			examples: ['listcustom', 'lc'],
			guildOnly: true
		});
	}

	async run(msg) {
		if (!msg.client || !msg.guild) {
			return;
		}
		const provider = msg.client.provider;
		if (!provider) {
			return;
		}
		if (!provider.db) {
			return;
		}

		msg.client.provider.db.get('SELECT settings FROM settings WHERE guild = ?', msg.guild.id)
			.then(elem => {
				try {
					if (!elem) {
						return msg.channel.send('No custom settings found. Add one with the !s[et]c[ustom] command');
					}
					elem = JSON.parse(elem.settings);
					const keys = Object.keys(elem);
					let reply = `Custom commands list:\n`;
					keys.forEach(key => {
						elem[key] = truncateString(elem[key].replace(/\n/, ' '), 35);
						getUrls(elem[key]).forEach(url => {
							elem[key] = elem[key].replace(url, `<${url}>`);
						});

						reply += `${key} - \`${elem[key]}\`\n`
					});
					return msg.channel.send(reply);
				} catch (err) {
					console.error(err);
					return msg.channel.send(`Had an error. Contact willyb321#2816`);
				}
			})
			.catch(err => {
				console.error(err);
				return msg.channel.send(`Had an error. Contact willyb321#2816`);
			});
	}
};
