const commando = require('discord.js-commando');
const miningTxt = `Mining: <http://s.willb.info/SNTIDw>
Pristine Metallics Finder: <http://s.willb.info/oGITHZ>`;
const explorationTxt = `Exploration:
<http://s.willb.info/CbfUOZ>
<http://s.willb.info/Hq11mQ>
<http://s.willb.info/oDGr2M>`;
const engiTxt = `Advice about engineers: <http://s.willb.info/0GkpUa>`;
const newTxt = `Advice for new CMDRs:\nRadio Sidewinder care package: <http://s.willb.info/s7JZrP>
Day 0 Guide: <http://s.willb.info/uZSF8R>`;
const powerplayTxt = `Powerplay: <http://s.willb.info/Sz3GYJ>`;


const fullText = [miningTxt, explorationTxt, engiTxt, newTxt, powerplayTxt].join('\n');
const mapText = {
	mining: miningTxt,
	explore: explorationTxt,
	newcmdr: newTxt,
	pp: powerplayTxt,
	all: fullText
};
let choices = '';
Object.keys(mapText).forEach(elem => choices += `${elem}\n`);
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
					wait: 60,
					default: 'all'
				}
			]
		});
	}

	async run(msg, args) {
		const txt = mapText[args.guide];

		if (!txt) {
			return msg.reply(`Guide not found.\nCorrect choices: ${choices}`);
		}
		return msg.channel.send(txt);
	}
};
