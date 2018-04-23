const commando = require('discord.js-commando');
const combatBuilds = `Combat Builds (Courtesy of Tempest):
Viper MK.III (4mil budget): https://eddp.co/u/gMkrFiEd
Cobra MK.III (10mil budget): https://eddp.co/u/AMzKhwgr
Vulture (25mil budget):  https://eddp.co/u/dFuKQaYP
Fer-De-Lance (80mil budget): https://eddp.co/u/1mft2TqS
Imperial Clipper (120mil budget): https://eddp.co/u/y6mAknEo
Fer-De-Lance (150 mil budget): https://eddp.co/u/mSp5fU5P
Python (250mil budget): https://eddp.co/u/MKxsqrgQ
`;

const explBuilds = `Exploration builds:
"My first explorer"/taxi Hauler: https://eddp.co/u/5YL26Kqu
Budget explorer Type-6e: https://eddp.co/u/Zo36FALG
DBX: https://eddp.co/u/e4ee51gg
Anaconda: https://eddp.co/u/XptjDK4x
**Note: Exploration ships generally aim for max jump range.  The optional slots are empty so you can choose extras such as srv hangars, fighter bays, or repair/refuelling limpets (don't forget the cargo racks!).  As heat is your worst enemy in the deep, using a smaller class A power plant helps for both range and ship temperature.**`;

const fullText = [combatBuilds, explBuilds].join('\n');
const mapText = {
	all: fullText,
	combat: combatBuilds,
	explore: explBuilds
};

let choices = Object.keys(mapText).join('\n');

module.exports = class BuildsCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'build',
			aliases: ['builds'],
			group: 'questions',
			memberName: 'build',
			description: 'Useful builds.',
			examples: ['build'],
			guildOnly: true,
			args: [
				{
					key: 'build',
					prompt: 'What builds do you want?',
					type: 'string',
					infinite: false,
					default: 'all'
				}
			]
		});
	}

	async run(msg, args) {
		const txt = mapText[args.build];

		if (!txt) {
			return msg.reply(`Builds not found.\nCorrect choices:\n${choices}`);
		}
		return msg.channel.send(txt);
	}
};
