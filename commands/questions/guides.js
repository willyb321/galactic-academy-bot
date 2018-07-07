const commando = require('discord.js-commando');

const miningTxt = `**Mining**:
The popular guide to mining: <http://s.willb.info/SNTIDw>
Pristine Metallics Finder: <http://s.willb.info/oGITHZ>`;

const explorationTxt = `**Exploration**:
Planetary Landing: <http://s.willb.info/CbfUOZ>
Hitchhiker's guide to the frontier: <http://s.willb.info/Hq11mQ>
The popular guide to exploration: <http://s.willb.info/oDGr2M>
Planet sounds: <http://s.willb.info/BT230J>`;

const engiTxt = `**Advice about engineers**:
Levelling Engineers: <http://s.willb.info/0GkpUa>
**Material Acquisition**:
Dav's Hope and others: <http://s.willb.info/GoCkYC>
SRV Scanner: <http://s.willb.info/neCdry>
Material List: <http://s.willb.info/Q6t9px>`;

const newTxt = `**Advice for new CMDRs**:
Radio Sidewinder care package: <http://s.willb.info/s7JZrP>
Day 0 Guide: <http://s.willb.info/uZSF8R>`;

const powerplayTxt = `**Powerplay**:
The popular guide to powerplay: <http://s.willb.info/Sz3GYJ>
Powerplay + more discords: <http://s.willb.info/m2AkOY>`;

const tradingTxt = `**Trading**:
Traders Bible: <http://s.willb.info/SjKEqN>
How to use EDDB.io to find trade routes: <http://s.willb.info/F0qIwV>
Finding Trade Routes with In-Game Tools: <http://s.willb.info/VhvjLr>`;


const fullText = [miningTxt, explorationTxt, engiTxt, newTxt, powerplayTxt, tradingTxt].join('\n');
const mapText = {
	mining: miningTxt,
	explore: explorationTxt,
	newcmdr: newTxt,
	pp: powerplayTxt,
	trade: tradingTxt,
	eng: engiTxt,
	all: fullText
};

let choices = Object.keys(mapText).join('\n');
function initDB(client, guild) {
	client.provider.db.get('SELECT settings FROM settings WHERE guild = ?', guild.id)
		.then(elem => {
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
			if (last > 0) {
				return;
			}
			for (const i in mapText) {
				const split = mapText[i].split('\n');
				split.forEach(async elem => {
					last = last + 1;
					await guild.settings.set(`guides_${i}_${last}`, elem);
				})
			}
		})
		.catch(err => {
			console.error(err);
		});
}

module.exports = class QuestionCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'guide',
			aliases: ['guides', 'g'],
			group: 'questions',
			memberName: 'guide',
			description: 'Useful guides.',
			examples: ['guide'],
			guildOnly: false,
			args: [
				{
					key: 'guide',
					prompt: 'What guide do you want?',
					type: 'string',
					infinite: false,
					default: 'all'
				}
			]
		});
	}

	async run(msg, args) {
		const txt = mapText[args.guide];
		initDB(msg.client, msg.guild);
		const guides = await getAllGuides(msg.client, msg.guild, args.guide);
		if (!guides || guides.length === 0) {
			return msg.reply(`Guide not found.\nCorrect choices:\n${choices}`, {split: true});
		}
		if (!txt) {
			return msg.reply(`Guide not found.\nCorrect choices:\n${choices}`, {split: true});
		}
		return msg.channel.send(guides.join('\n'), {split: true});
	}
};


function getAllGuides(client, guild, category) {
	let guides = [];
	if (!category) {
		category = 'all';
	}
	return client.provider.db.get('SELECT settings FROM settings WHERE guild = ?', guild.id)
		.then(elem => {
			try {
				if (!elem) {
					return;
				}
				elem = JSON.parse(elem.settings);
				const keys = Object.keys(elem);
				keys.forEach(key => {
					if (key.startsWith('twitch_')) {
						return;
					}
					if (key.startsWith('builds_')) {
						return;
					}
					if (!key.startsWith(`guides_${category}`)) {
						return;
					}
					guides.push(elem[key]);
				});
				return guides;
			} catch (err) {
				console.error(err);
			}
		})
		.catch(err => {
			console.error(err);
		});
}
