const guidesTxt = `Useful Guides for various subjects:
Radio Sidewinder care package: <https://docs.google.com/document/d/10ENR9b7TJBD1hSQ48I356sJkFZ2ii1_-wUBHWg1n0jI/>
Day 0 Guide: <https://forums.frontier.co.uk/showthread.php/273168-Day-0-A-guide-for-brand-new-commanders>
Pristine Metallics Finder: <http://edtools.ddns.net/index.php>
Advice about engineers: <https://forums.frontier.co.uk/showthread.php/271640-All-engineers-leveled-to-grade-5-a-brag-a-guide-and-a-feedback>
Popular guide series:
Planetary landings: <https://docs.google.com/presentation/d/1rfn8iK0a2LuIjHZSEpTPtZJnOhHDwWx4nnC350lHCME/>
Exploration: <https://docs.google.com/presentation/d/1nnVPJg7aggIJUomoHQ9STmseRJkREicL2UCJ1Dox5f4/>
    <https://docs.google.com/presentation/d/1ImdW1yeReyBXQ2NzJcVjEbWHOQLkYxdWVlsJFApqMYw/>
Mining: <https://docs.google.com/presentation/d/1npzKEXpExd1aEz_hLvlQIELL1uX4gvVHtY9AhQ-CcCI/>
Powerplay: <https://docs.google.com/presentation/d/11rGAmoXjc-y3KD8veSqqGveLDEqjBTjzxWVHFw1on2w/>`;

const commando = require('discord.js-commando');

module.exports = class QuestionCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'guide',
			aliases: ['guides'],
			group: 'questions',
			memberName: 'guide',
			description: 'Useful guides.',
			examples: ['guide'],
			guildOnly: false
		});
	}

	async run(msg) {
		return msg.channel.send(guidesTxt);
	}
};
