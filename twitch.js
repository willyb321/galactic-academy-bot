const EventEmitter = require('events').EventEmitter;
const TwitchClient = require('twitch').default;

const clientId = process.env.TWITCH_CLIENT_ID;
const accessToken = process.env.TWITCH_CLIENT_SECRET;

const twitchClient = TwitchClient.withCredentials(clientId, accessToken);

const interval = 120000;

async function isStreamLive(id) {
	try {
		const user = await twitchClient.users.getUser(id);
		await user.getStream(); // Will reject the promise if the stream is not live
		return true;
	} catch (e) {
		return false;
	}
}

process.on('SIGINT', async () => {
	// Unsubscribe from all topics
	await twitchWebhook.unsubscribe('*');

	process.exit(0);
});

class TwitchListener extends EventEmitter {
	constructor(userId, channelId, username) {
		super();
		this._id = userId;
		this._channel = channelId;
		this._username = username;
		this._interval = null;
		console.log(`Initialising twitch watcher (user: ${username}, twitch ID: ${this._id})`);
		this.initTwitch();
	}

	initTwitch() {
		this._twitch = twitchClient;
		this.sub();
	}

	async destroy() {
		// Unsubscribe from all topics
		clearInterval(this._interval);
		this._interval = null;
	}

	async getInfo() {
		try {
			return await twitchClient.streams.getStreamByChannel(this._id); // Will reject the promise if the stream is not live
		} catch (e) {
			return false;
		}
	}

	async tick() {
		this.getInfo()
			.then(data => {
				this.emit('streams', {event: data});
			})
			.catch(err => {
				console.error(err);
			});
	}

	sub() {
		// Set listener for topic
		this.tick();
		const tick = this.tick.bind(this);
		this._interval = setInterval(tick, interval);
	}

	unsub() {
		// Unsubscribe from all topics
		clearInterval(this._interval);
		this._interval = null;
	}
}

module.exports = TwitchListener;
