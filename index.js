/* eslint-disable no-console */
const commando = require('discord.js-commando');
const path = require('path');
const registerAllCmds = require('./custom-reg');
const oneLine = require('common-tags').oneLine;
const TwitchListener = require('./twitch');
const sqlite = require('sqlite');
const TextChannel = require('discord.js').TextChannel;
const RichEmbed = require('discord.js').RichEmbed;
const client = new commando.Client({
	owner: ['121791193301385216', '387529259901517835', '183414699214241792', '120290771529236482'],
	commandPrefix: '!',
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
	.on('disconnect', () => { console.warn('Disconnected!'); })
	.on('reconnecting', () => { console.warn('Reconnecting...'); })
	.on('commandError', (cmd, err) => {
		if(err instanceof commando.FriendlyError) return;
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
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(process.env.DISCORD_TOKEN);

const twitchInstances = {
	listeners: [],
	instances: []
};

const listeners = ({ topic, endpoint, event }, i) => {
	console.log(event);
	if (event && event.data && event.data.length > 0) {
		const channel = client.channels.get(i._channel);
		const embed = new RichEmbed();
		embed.setDescription(event.data[0].title);
		embed.setTitle(`${i._username} just went live`);
		const url = `${event.data[0].thumbnail_url.replace('{width}', '1280').replace('{height}', '720')}?cache=${new Date().valueOf()}`;
		embed.setImage(url);
		embed.setURL(`https://twitch.tv/${i._username}`);
		channel.send({embed});
	}

};


function resetTwitch() {
	twitchInstances.listeners.forEach((e,i) => {
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
		const listener = i.on('streams', ({ topic, endpoint, event }) => {
			return listeners({ topic, endpoint, event }, i)
		});
		twitchInstances.listeners.push(listener);
	}
	console.log(`Instances: ${twitchInstances.instances.length}`);

	console.log(`Listeners: ${twitchInstances.listeners.length}`);

}


function initTwitch(guild) {
	twitchInstances.instances.forEach(async (e,i) => {
		await e.destroy();
		delete twitchInstances.instances[i];
		e = null;
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
						return
					}
					try {
						let data = provider.get(guild, key);
						if (!data) {
							return;
						}
						const channelId = provider.get(guild, 'twitch_channel');
						let instance = new TwitchListener(data.id, channelId, data.username);
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
	}, 3000)

});

module.exports = {
	resetTwitch,
	initTwitch,
	twitchInstances
};
