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
SRV Scanner: <http://s.willb.info/neCdry>`;
const newTxt = `**Advice for new CMDRs**:
Radio Sidewinder care package: <http://s.willb.info/s7JZrP>
Day 0 Guide: <http://s.willb.info/uZSF8R>`;
const powerplayTxt = `**Powerplay**:
The popular guide to powerplay: <http://s.willb.info/Sz3GYJ>`;
const tradingTxt = `**Trading**:
Traders Bible: <http://s.willb.info/SjKEqN>`;


const fullText = [miningTxt, explorationTxt, engiTxt, newTxt, powerplayTxt, tradingTxt].join('\n');
const mapText = {
	mining: miningTxt,
	explore: explorationTxt,
	newcmdr: newTxt,
	pp: powerplayTxt,
	trade: tradingTxt,
	all: fullText
};

let choices = Object.keys(mapText).join('\n');

module.exports = class QuestionCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'guide',
			aliases: ['guides'],
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

		if (!txt) {
			return msg.reply(`Guide not found.\nCorrect choices:\n${choices}`);
		}
		return msg.channel.send(txt);
	}
};
