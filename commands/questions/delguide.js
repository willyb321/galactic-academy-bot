const commando = require('discord.js-commando');
const getUrls = require('get-urls');
const rp = require('request-promise-native');
const _ = require('lodash');

function delGuide(client, guild, category, title) {
	return client.provider.db.get('SELECT settings FROM settings WHERE guild = ?', guild.id)
		.then(async elem => {
			if (!elem) {
				return;
			}
			let last = 0;
			elem = JSON.parse(elem.settings);
			for (const key in elem) {
				if (!elem.hasOwnProperty(key)) {
					continue;
				}
				if (key.startsWith('twitch_')) {
					continue;
				}
				if (key.startsWith('builds_')) {
					continue;
				}
				if (!key.startsWith(`guides_`)) {
					continue;
				}
				last++;
				if (elem[key].search(new RegExp(title)) >= 0) {
					const key = `guides_${category}_${last}`;
					return guild.settings.remove(key);
				}

			}
		})
		.catch(err => {
			console.error(err);
		});
}

module.exports = class AddGuideCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'delguide',
			aliases: ['dg'],
			group: 'questions',
			memberName: 'gelguide',
			description: 'Delete a guide',
			examples: ['delguide <category> <title>'],
			guildOnly: true,
			args: [
				{
					key: 'category',
					prompt: 'What category?',
					type: 'string',
					infinite: false
				},
				{
					key: 'title',
					prompt: 'Title (Displayed in bold in !guide command)?',
					type: 'string',
					infinite: false
				}
			]
		});
	}

	async run(msg, args) {
		let title = _.escapeRegExp(`**${args.title}:**`);
		await delGuide(msg.client, msg.guild, args.category, title);
		return msg.channel.send(`Tried to delete the guide ${args.title} under ${args.category}, check guide command output again.`);
	}
};
