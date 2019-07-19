/* eslint-disable no-console */
const path = require('path');
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const sqlite = require('sqlite');

const {MessageEmbed} = require('discord.js');
const _ = require('lodash');
const registerAllCmds = require('./custom-reg');
const TwitchListener = require('./twitch');

const client = new commando.Client({
	owner: ['121791193301385216', '387529259901517835', '183414699214241792', '120290771529236482'],
	commandPrefix: process.env.NODE_ENV === 'production' ? '!' : '?',
	unknownCommandResponse: false
});

process.on('unhandledRejection', err => {
	console.error(err);
});

client
	.on('error', console.error)
	.on('warn', console.warn)
	.on('debug', process.env.NODE_ENV !== 'production' ? console.info : () => null)
	.on('ready', () => {
		console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
		for (const i of client.guilds.array()) {
			registerAllCmds(client, i);
		}
	})
	.on('disconnect', () => {
		console.warn('Disconnected!');
	})
	.on('reconnecting', () => {
		console.warn('Reconnecting...');
	})
	.on('commandError', (cmd, err) => {
		if (err instanceof commando.FriendlyError) {
			return;
		}
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', (msg, reason) => {
		console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	});

client.setProvider(
	sqlite.open(path.join(__dirname, 'database.sqlite3')).then(db => new commando.SQLiteProvider(db))
).catch(console.error);

client.registry
	.registerGroup('questions', 'Questions')
	.registerGroup('custom', 'Custom')
	.registerGroup('misc', 'Misc')
	.registerGroup('admin', 'Admin')
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(process.env.DISCORD_TOKEN);

const twitchInstances = {
	listeners: [],
	instances: [],
	timestamps: {},
	startTime: new Date()
};

const listeners = ({topic, endpoint, event}, i) => {
	if (process.env.NODE_ENV !== 'production') {
		// return;
	}
	if (event && event._data && event._data) {
		console.log(event._data)

		if (event._data.channel._id.toString() !== i._id) {
			console.log('Wrong ID', i._id, event._data.channel._id.toString())
			return;
		}
		// if (event._data.created_at <= twitchInstances.startTime.toISOString()) {
		// 	console.log('Already posted');
		// 	return;
		// }
		if (event._data.created_at === twitchInstances.timestamps[event._data.channel._id]) {
			return;
		}
		if (event._data.game !== 'Elite: Dangerous') {
			return;
		}
		console.log(event._data);
		const channel = client.channels.get(i._channel);
		const embed = new MessageEmbed();
		embed.setDescription(event._data.channel.status);
		embed.setTitle(`${i._username} just went live with ${event._data.game}`);
		const url = `${event._data.preview.template.replace('{width}', '1280').replace('{height}', '720')}?cache=${new Date().valueOf()}`;
		embed.setImage(url);
		embed.setURL(event._data.channel.url);
		channel.send({embed});
		twitchInstances.timestamps[event._data.channel._id] = event._data.created_at;
	}
};

function resetTwitch() {
	if (process.env.NODE_ENV !== 'production') {
		// return;
	}
	twitchInstances.listeners.forEach((e, i) => {
		e.removeAllListeners('streams');
		delete twitchInstances.listeners[i];
	});
	twitchInstances.instances = twitchInstances.instances.filter(n => n);
	twitchInstances.listeners = twitchInstances.listeners.filter(n => n);
	for (const i of twitchInstances.instances) {
		if (!i) {
			delete twitchInstances.instances[i];
			continue;
		}
		const listener = i.on('streams', ({topic, endpoint, event}) => {
			return listeners({topic, endpoint, event}, i);
		});
		twitchInstances.listeners.push(listener);
	}
	console.log(`Instances: ${twitchInstances.instances.length}`);

	console.log(`Listeners: ${twitchInstances.listeners.length}`);
}

function initTwitch(guild) {
	if (process.env.NODE_ENV !== 'production') {
		// return;
	}
	twitchInstances.instances.forEach(async (e, i) => {
		try {
			await e.destroy();
			delete twitchInstances.instances[i];
			e = null;
		} catch (e) {
			console.error(e)
		}
	});
	twitchInstances.instances = twitchInstances.instances.filter(n => n);
	twitchInstances.listeners = twitchInstances.listeners.filter(n => n);
	const provider = client.provider;
	provider.db.get('SELECT settings FROM settings WHERE guild = ?', guild)
		.then(elem => {
			try {
				if (!elem) {
					return;
				}
				elem = JSON.parse(elem.settings);
				const keys = Object.keys(elem);
				keys.forEach(async key => {
					if (!key.startsWith('twitch_sub_')) {
						return;
					}
					try {
						const data = provider.get(guild, key);
						if (!data) {
							return;
						}
						const channelId = provider.get(guild, 'twitch_channel');
						const instance = new TwitchListener(data.id, channelId, data.username);
						twitchInstances.instances.push(instance);
					} catch (err) {
						console.error(err);
					} finally {
						resetTwitch();
					}
				});
			} catch (err) {
				console.error(err.message);
			}
		})
		.catch(err => {
			console.error(err.message);
		});
}

client.on('ready', () => {
	setTimeout(() => {
		client.guilds.forEach(guild => {
			initTwitch(guild.id);
		});
	}, 3000);
});

module.exports = {
	resetTwitch,
	initTwitch,
	twitchInstances
};
