/**
 * @module Commands
 */
/**
 * ignore
 */
const Commando = require('discord.js-commando');
const TwitchListener = require('../../twitch');
const resetTwitch = require('../../index').resetTwitch;
const botAccessID = '417830772838367233';
const TwitchClient = require('twitch').default;
const RichEmbed = require('discord.js').RichEmbed;

const clientId = process.env.TWITCH_CLIENT_ID;
const accessToken = process.env.TWITCH_CLIENT_SECRET;
const twitchClient = TwitchClient.withCredentials(clientId, accessToken);

async function findTwitchId(userName) {
	try {
		const user = await twitchClient.users.getUserByName(userName);
		return user.id; // will reject the promise if the stream is not live
	} catch (e) {
		console.error(e.message);
		return undefined;
	}
}


module.exports = class TwitchCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'twitch',
			group: 'questions',
			memberName: 'twitch',
			description: 'Add or remove twitch announcements.',
			details: 'Add or remove twitch announcements.',
			examples: ['twitch willyb321'],

			args: [
				{
					key: 'name',
					prompt: 'Twitch username to follow / unfollow (if already followed)',
					type: 'string',
					infinite: false,
					wait: 60
				}
			]
		});
	}

	hasPermission(msg) {
		if (!msg || !msg.member) {
			return false;
		}
		return !!msg.member.roles.get(botAccessID);
	}

	async run(message, args) {
		const initTwitch = require('../../index').initTwitch;
		const resetTwitch = require('../../index').resetTwitch;
		try {

			const id = await findTwitchId(args.name);
			const settingsKey = `twitch_sub_${id}`;
			const provider = message.guild.settings;

			if (!!provider.get(settingsKey)) {
				await provider.remove(settingsKey);
				message.channel.send(`Unsubscribed from ${args.name}. No more notifications will be sent from this channel.`);
			} else {
				await provider.set(settingsKey, {id, username: args.name});
				const channelID = provider.get('twitch_channel');
				const channel = message.client.channels.get(channelID);
				if (channel) {
					message.channel.send(`Subscribed to ${args.name}. Notifications will be sent to ${channel.toString()}.`);
				} else {
					message.channel.send(`Subscribed to ${args.name}. Notifications will be sent to the channel set by the twitchchannel command.`);
				}
			}
		} catch (err) {
			console.error(err);
			return message.channel.send(`Failed. Error Message: ${err.message}`);
		} finally {
			resetTwitch();
			initTwitch(message.guild.id);

		}

	}
};
