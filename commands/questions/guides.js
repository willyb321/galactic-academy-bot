const commando = require('discord.js-commando');
const miningTxt = `Mining: <https://willb.info/s/BJh5ez5vf>
Pristine Metallics Finder: <https://willb.info/s/HJ9sefcwM>`;
const explorationTxt = `Exploration: <https://willb.info/s/rkV3efcvf>
<https://willb.info/s/BJ1pgf9wG>
<https://willb.info/s/SkkUlsgOz>`;
const engiTxt = `Advice about engineers: <https://willb.info/s/BJj6lz5vM>`;
const newTxt = `Advice for new CMDRs:\nRadio Sidewinder care package: <https://willb.info/s/BJi0efcPM>
Day 0 Guide: <https://willb.info/s/r1G1ZM5Pf>`;
const powerplayTxt = `Powerplay: <https://willb.info/s/BJuJbG9Df>`;


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
