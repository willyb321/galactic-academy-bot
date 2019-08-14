const commando = require('discord.js-commando');
const Discord = require('discord.js');

const genEmbed = (title, description) => new Discord.MessageEmbed()
    .setFooter('Galactic Academy Bot - By Willyb321')
    .setTitle(title || '')
    .setDescription(description || '')
    .setTimestamp();

module.exports = async function logEvents(client) {
    client.on("messageDelete", async (messageDelete) => {
        const logChannel = await messageDelete.guild.settings.get('logChannel');
        const log = client.channels.get(logChannel);
        if (!log) {
            return;
        }
        const embed = genEmbed(`Message by ${messageDelete.author.tag} Deleted`, `Channel: ${messageDelete.channel.toString()}`);
        embed
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
        const embed = genEmbed(`Message by ${oldMessage.author.tag} Edited`, `Channel: ${oldMessage.channel.toString()}`);
        embed
            .addField('Author ID:', oldMessage.author.id)
            .addField('Old message', oldMessage.content)
            .addField('New message', newMessage.content)
        log.send({embed});
    });

    client.on('guildMemberAdd', async member => {
        const guild = member.guild;
        const logChannelID = guild.settings.get('logChannel');
        const autoRoleID = guild.settings.get('autoRole');
        const role = guild.roles.get(autoRoleID);
        if (role) {
            try {
                await member.roles.add(role);
            } catch (error) {
                console.error(error);
            }
        }
        const channel = guild.channels.get(logChannelID);
        if (!channel) {
            return;
        }
        const embed = genEmbed(`Someone joined ${member.guild.name}`, `Name: ${member.user.tag}`);
        embed
            .addField('Mention', member.toString())
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
        const embed = genEmbed(`Someone left ${member.guild.name}`, `Name: ${member.user.tag}`);
        embed
            .addField('ID', member.user.id);
        channel.send({embed});
    });

}