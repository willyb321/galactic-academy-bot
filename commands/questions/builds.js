const commando = require('discord.js-commando');
const combatBuilds = `Combat Builds (Courtesy of Tempest):
Viper MK.III (4mil budget) : https://eddp.co/u/gMkrFiEd
Cobra MK.III (10mil budget) : https://eddp.co/u/AMzKhwgr
Vulture (25mil budget):  https://eddp.co/u/dFuKQaYP
Fer-De-Lance (80mil budget): https://eddp.co/u/1mft2TqS
Imperial Clipper (120mil budget): https://eddp.co/u/y6mAknEo
Fer-De-Lance (150 mil budget) : https://eddp.co/u/mSp5fU5P
Python (250mil budget) : https://eddp.co/u/MKxsqrgQ
`;
module.exports = class BuildsCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'build',
			aliases: ['builds'],
			group: 'questions',
			memberName: 'build',
			description: 'Useful builds.',
			examples: ['build'],
			guildOnly: false
		});
	}

	async run(msg, args) {
		return msg.channel.send(combatBuilds);
	}
};
