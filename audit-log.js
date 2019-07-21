const commando = require('discord.js-commando');
const Discord = require('discord.js');

const genEmbed = () => new Discord.MessageEmbed()
    .setFooter('Galactic Academy Bot - By Willyb321');

module.exports = async function logEvents(client) {
    client.on("messageDelete", async (messageDelete) => {
        const logChannel = await messageDelete.guild.settings.get('logChannel');
        const log = client.channels.get(logChannel);
        if (!log) {
            return;
        }
        const embed = genEmbed();
        embed
            .setTitle(`Message by ${messageDelete.author.tag} Deleted`)
            .setDescription(`Channel: ${messageDelete.channel.toString()}`)
            .addField('Message content', messageDelete.content)
            .addField('Author ID:', messageDelete.author.id)
        log.send({embed});
    });
    client.on("messageUpdate", async (oldMessage, newMessage) => {
        const logChannel = await oldMessage.guild.settings.get('logChannel');
        const log = client.channels.get(logChannel);
        if (!log) {
            return;
        }
        const embed = genEmbed();
        embed
            .setTitle(`Message by ${oldMessage.author.tag} Edited`)
            .setDescription(`Channel: ${oldMessage.channel.toString()}`)
            .addField('Author ID:', oldMessage.author.id)
            .addField('Old message', oldMessage.content)
            .addField('New message', newMessage.content)
        log.send({embed});
    });
}