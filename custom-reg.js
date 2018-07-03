const CustomRootCommand = require('./custombase');

module.exports = function(client, guild) {
	client.provider.db.get('SELECT settings FROM settings WHERE guild = ?', guild.id)
		.then(elem => {
			try {
				if (!elem) {
					return;
				}
				elem = JSON.parse(elem.settings);
				const keys = Object.keys(elem);
				keys.forEach(key => {
					if (key.startsWith('twitch_')) {
						return;
					}
					try {
						const rootCmd = new CustomRootCommand(client, {name: key});
						client.registry.registerCommand(rootCmd)
					} catch (err) {
						if (!err.message.endsWith('is already registered.')) {
							console.error(err);
						}
					}

				});
			} catch (err) {
				if (err.message.endsWith('is already registered.')) {

				} else {
					console.error(err);

				}
			}
		})
		.catch(err => {
			console.error(err);
		});
}
