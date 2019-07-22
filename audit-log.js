const commando = require('discord.js-commando');
const Discord = require('discord.js');

const genEmbed = () => new Discord.MessageEmbed()
    .setFooter('Galactic Academy Bot - By Willyb321')
    .setTimestamp();

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
        if (oldMessage.content === newMessage.content) {
            return;
        }
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

    client.on('guildMemberAdd', member => {
        const guild = member.guild;
        const logChannelID = guild.settings.get('logChannel');
        const channel = guild.channels.get(logChannelID);
        if (!channel) {
            return;
        }
        const embed = genEmbed();
        embed
            .setTitle(`Someone joined ${member.guild.name}`)
            .setDescription(`Name: ${member.toString()}`)
            .addField('ID', member.user.id);
            channel.send({embed});
    });

    client.on('guildMemberRemove', member => {
        const guild = member.guild;
        const logChannelID = guild.settings.get('logChannel');
        const channel = guild.channels.get(logChannelID);
        if (!channel) {
            return;
        }
        const embed = genEmbed();
        embed
            .setTitle(`Someone left ${member.guild.name}`)
            .setDescription(`Name: ${member.user.tag}`)
            .addField('ID', member.user.id);
        channel.send({embed});
    });

}