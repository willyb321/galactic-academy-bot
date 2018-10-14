const EventEmitter = require('events').EventEmitter;
const {Duration} = require('luxon');

class Scheduler extends EventEmitter {
	constructor(channel, text, time, numMsg) {
		super();
		this._channel = channel;
		this._text = text;
		this._intervalTime = Duration.fromObject({hours: time}).as('milliseconds');
		console.log(this._intervalTime)
		this._intervalMsg = numMsg;
		this._numMessagesSince = 0;
		this._lastMessageID = this._channel.lastMessageID;
		this._channel.lastMessageId = null;
		this._interval = null;
		console.log(`Initialising scheduler (Channel ID: ${this._channel.id})`);
		this.init();
	}

	init() {
		this.tick();
		const updateLastMsg = this.updateLastMsg.bind(this);
		this._channel.client.on('message', updateLastMsg);
		const tick = this.tick.bind(this);
		this._interval = setInterval(tick, this._intervalTime);
	}

	updateLastMsg(msg) {
		if (!this._channel) {
			return;
		}
		if (msg.channel.id !== this._channel.id) {
			return;
		}
		if (msg.author.id === msg.client.user.id) {
			this._lastMessageID = msg.id;
			return;
		}
		this._lastMessageID = msg.id;
		this._numMessagesSince++;
	}

	async destroy() {
		// Unsubscribe from all topics
		clearInterval(this._interval);
		this._interval = null;
	}

	async checkTimeAndMessages() {
		const lastMsg = await this._channel.fetchMessage(this._channel.lastMessageID)
		if (lastMsg.cleanContent === this._text) {
			return false;
		}
		if (lastMsg.author.id === this._channel.client.user.id) {
			return false;
		}
		if (this._numMessagesSince >= this._intervalMsg) {
			this._numMessagesSince = 0;
			return true;
		}
		return false;
	}

	async tick() {
		const check = await this.checkTimeAndMessages();
		if (check) {
			this._channel.send(this._text, {split: true});
		}
	}
}

module.exports = Scheduler;
