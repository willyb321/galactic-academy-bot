/**
 * @module Commands
 */
/**
 * ignore
 */
const Commando = require('discord.js-commando');

const muteRoleId = '375632007365132288';
const rolesWithAccess = ['147037704142454784', '598684217249103873']; // Captains + mentors
module.exports = class MuteCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'mute',
			group: 'misc',
			memberName: 'mute',
			description: 'Mute someone for an amount of time (default 10mins).',
			details: 'Mute someone for an amount of time (default 10mins).',
			guildOnly: true,
			examples: ['mute @willyb321#2816 10'],
			args: [
				{
					label: 'user',
					key: 'user',
					type: 'member',
					prompt: 'Who to mute?'
				},
				{
					label: 'time',
					key: 'time',
					type: 'integer',
					prompt: 'How long? Minutes.',
					min: 1,
					default: 60,
					max: 1440
				}
			]
		});
	}

	hasPermission(message) {
		if (!message.member) {
			return false;
		}
		for (const i of rolesWithAccess) {
			if (message.member.roles.get(i)) {
				return true;
			}
		}
		return message.client.isOwner(message.author);
	}

	async run(message, args) {
		const muteRole = message.guild.roles.get(muteRoleId);
		let time = args.time * 60000;
		if (time > 86400000) {
			time = 86400000;
		}
		console.log(`Mins: ${args.time} = ${time}ms`);
		return args.user.roles.add(muteRole)
			.then(() => {
				setTimeout(async () => {
					await args.user.roles.remove(muteRole, `Removed mute after ${args.time} mins`);
				}, time);
			})
			.catch(err => {
				console.error(err);
			});
	}
};
