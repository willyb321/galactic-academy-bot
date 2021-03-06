const Commando = require('discord.js-commando');

const roleMap = {
	background_simulation: 'BGS'
};

module.exports = class QuestionCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'question',
			aliases: ['q'],
			group: 'questions',
			memberName: 'question',
			description: 'Ask a question.',
			examples: ['question How to bind FA Off'],
			guildOnly: true,

			args: [
				{
					key: 'question',
					prompt: 'What is your question?',
					type: 'string',
					infinite: true,
					wait: 60
				}
			]
		});
	}

	async run(msg, args) {
		const qChannel = msg.client.channels.get(process.env.GALACTIC_ACADEMY_CHANNEL || '412072549057298432');
		const qGuild = msg.client.guilds.get(process.env.GALACTIC_ACADEMY || '412071767490691082');
		let roleToTag = qGuild.roles.find(elem => elem.name.toLowerCase() === msg.channel.name.toLowerCase());
		if (!roleToTag) {
			const roleExists = Boolean(roleMap[msg.channel.name]);
			if (roleExists) {
				roleToTag = qGuild.roles.find(elem => elem.name.toLowerCase() === roleMap[msg.channel.name].toLowerCase());
			}
		}
		if (!roleToTag) {
			const roleExists = Boolean(roleMap[msg.channel.name]);
			if (roleExists) {
				roleToTag = qGuild.roles.find(elem => elem.name.toLowerCase() === roleMap[msg.channel.name].toLowerCase());
			} else {
				return msg.reply('No role found to ping.');
			}
		}

		const q = args.question.join(' ').replace(/`/igm, '');
		console.log(q);

		msg.channel.send(`Question asked. ${roleToTag.name} have been pinged.`);
		const logMsg = `${roleToTag}:\nNew question from ${msg.author.tag} in ${msg.channel}:\n\`\`\`${q}\`\`\``;
		qChannel.send(logMsg);
	}
};
