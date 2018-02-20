const commando = require('discord.js-commando');
const miningTxt = `Mining: <https://docs.google.com/presentation/d/1npzKEXpExd1aEz_hLvlQIELL1uX4gvVHtY9AhQ-CcCI/>
Pristine Metallics Finder: <http://edtools.ddns.net/index.php>`;
const explorationTxt = `Exploration: <https://docs.google.com/presentation/d/1nnVPJg7aggIJUomoHQ9STmseRJkREicL2UCJ1Dox5f4/>
<https://docs.google.com/presentation/d/1ImdW1yeReyBXQ2NzJcVjEbWHOQLkYxdWVlsJFApqMYw/>`;
const engiTxt = `Advice about engineers: <https://forums.frontier.co.uk/showthread.php/271640-All-engineers-leveled-to-grade-5-a-brag-a-guide-and-a-feedback>`;
const newTxt = `Advice for new CMDRs:\nRadio Sidewinder care package: <https://docs.google.com/document/d/10ENR9b7TJBD1hSQ48I356sJkFZ2ii1_-wUBHWg1n0jI/>
Day 0 Guide: <https://forums.frontier.co.uk/showthread.php/273168-Day-0-A-guide-for-brand-new-commanders>`;
const powerplayTxt = `Powerplay: <https://docs.google.com/presentation/d/11rGAmoXjc-y3KD8veSqqGveLDEqjBTjzxWVHFw1on2w/>`;


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
