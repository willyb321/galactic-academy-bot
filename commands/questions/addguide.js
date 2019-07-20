const commando = require('discord.js-commando');
const getUrls = require('get-urls');
const rp = require('request-promise-native');
const _ = require('lodash');

const botAccessID = '417830772838367233';
function setGuide(client, guild, category, guide) {
	return client.provider.db.get('SELECT settings FROM settings WHERE guild = ?', guild.id)
		.then(async elem => {
			if (!elem) {
				return;
			}
			let last = 0;
			elem = JSON.parse(elem.settings);
			const keys = Object.keys(elem);
			keys.forEach(key => {
				if (key.startsWith('twitch_')) {
					return;
				}
				if (key.startsWith('builds_')) {
					return;
				}
				if (!key.startsWith('guides_')) {
					return;
				}
				last = parseInt(key.split('_')[2]);
			});
			if (last === 0) {
				return;
			}
			const key = `guides_${category}_${last + 1}`;
			return guild.settings.set(key, guide);
		})
		.catch(err => {
			console.error(err);
		});
}

module.exports = class AddGuideCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'addguide',
			aliases: ['ag'],
			group: 'questions',
			memberName: 'addguide',
			description: 'Add a guide',
			examples: ['addguide mining title link'],
			guildOnly: true,
			args: [
				{
					key: 'category',
					prompt: 'What sort of guide?',
					type: 'string',
					infinite: false
				},
				{
					key: 'title',
					prompt: 'Title (Will be displayed in bold at the front)?',
					type: 'string',
					infinite: false
				},
				{
					key: 'guide',
					prompt: 'Text for guide (Use format "description: link")?',
					type: 'string',
					infinite: false
				}
			]
		});
	}
	async run(msg, args) {
		const botAccessLow = await message.guild.settings.get('lowLvlBotAccess');
		if (!message.member.roles.get(botAccessLow)) {
			return new Commando.FriendlyError('Not enough permission.');
		}
		let text = args.guide;
		const title = `**${args.title}:**`;
		const category = args.category;
		const urls = getUrls(text, {
			stripFragment: false,
			removeTrailingSlash: false,
			sortQueryParameters: false,
			stripWWW: false
		});
		const promises = [];
		urls.forEach(url => {
			promises.push(rp('https://kutt.it/api/url/submit', {
				method: 'POST',
				body: {
					target: url,
					reuse: true
				},
				headers: {
					'X-API-Key': process.env.KUTT_API_KEY
				},
				json: true
			}));
		});
		return Promise.all(promises)
			.then(async shortened => {
				console.log(shortened);
				console.log(urls);
				shortened.forEach(res => {
					text = _.replace(text, res.target, `<${res.shortUrl}>`);
				});
				await setGuide(msg.client, msg.guild, category, `${title} ${text}`);
				return msg.channel.send(`Added new guide to ${category}`, {split: true});
			});
	}
};
