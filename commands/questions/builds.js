const commando = require('discord.js-commando');

const combatBuilds = `Combat Builds: **Temporarily disabled**`;

const explBuilds = `Exploration builds:
"My first explorer"/taxi Hauler: <https://s.orbis.zone/j_4Dt8Kw>
Budget explorer Type-6e: <https://s.orbis.zone/yT2kcj4t>
DBX: <https://s.orbis.zone/4X_6meCw>
Anaconda: <https://s.orbis.zone/GALoB2op>
ASP Explorer: <https://s.orbis.zone/eR6tRpJK>
**Note: Exploration ships generally aim for max jump range.  The optional slots are empty so you can choose extras such as srv hangars, fighter bays, or repair/refuelling limpets (don't forget the cargo racks!).  As heat is your worst enemy in the deep, using a smaller class A power plant helps for both range and ship temperature.**`;

const fullText = [combatBuilds, explBuilds].join('\n');
const mapText = {
	all: fullText,
	combat: combatBuilds,
	explore: explBuilds
};

const choices = Object.keys(mapText).join('\n');

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
