const TwitchWebhook = require('twitch-webhook');
const EventEmitter = require('events').EventEmitter;

const twitchWebhook = new TwitchWebhook({
	client_id: process.env.TWITCH_CLIENT_ID,
	callback: process.env.TWITCH_CALLBACK,
	secret: process.env.TWITCH_CLIENT_SECRET, // default: false
	listen: {
		port: 8888,           // default: 8443
		host: '0.0.0.0'    // default: 0.0.0.0
	}
});


// set listener for all topics
twitchWebhook.on('*', ({topic, options, endpoint, event}) => {
	// topic name, for example "streams"
	console.log(topic);
	// topic options, for example "{user_id: 12826}"
	console.log(options);
	// full topic URL, for example
	// "https://api.twitch.tv/helix/streams?user_id=12826"
	console.log(endpoint);
	// topic data, timestamps are automatically converted to Date
	console.log(event)
});
// subscribe to topic

twitchWebhook.on('unsubscibe', (obj) => {
	twitchWebhook.subscribe(obj['hub.topic'])
		.catch(err => {
			console.error(err.message);
		})
});

process.on('SIGINT', async () => {
	// unsubscribe from all topics
	await twitchWebhook.unsubscribe('*');

	process.exit(0)
});

class TwitchListener extends EventEmitter {
	constructor(userId, channelId, username) {
		super();
		this._id = userId;
		this._channel = channelId;
		this._username = username;
		console.log(`Initialising twitch watcher (user: ${username}, twitch ID: ${this._channel})`);
		this.initTwitch();
	}

	initTwitch() {
		this._twitch = twitchWebhook;
		this.sub()

	}

	async destroy() {
		// unsubscribe from all topics
		await this._twitch.unsubscribe('*');
	}

	sub() {
		this._twitch.subscribe(`streams`, {
			user_id: this._id
		})
		.catch(err => {
			console.error(err.message);
		});
		// set listener for topic
		this._twitch.on('streams', ({ topic, endpoint, event }) => {
			this.emit('streams', {topic, endpoint, event});
		});

	}

	unsub() {
		this._twitch.unsubscribe(`streams`, {
			user_id: this._id
		})
		.catch(err => {
			console.error(err.message);
		});
	}
}

module.exports = TwitchListener;
