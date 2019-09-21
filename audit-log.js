const commando = require('discord.js-commando');
const Discord = require('discord.js');
const diff = require('shallow-diff');

const genEmbed = (title, description) => new Discord.MessageEmbed()
    .setFooter('Galactic Academy Bot - By Willyb321')
    .setTitle(title || '')
    .setDescription(description || '')
    .setTimestamp();

let auditLogging = false;

module.exports = async function logEvents(client) {
    if (auditLogging === true) {
        return;
    }
    console.log('Logging');
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

    const diffBlacklist = ['_roles'];

    client.on('guildMemberUpdate', (oldMember, newMember) => {
        const guild = newMember.guild;
        const logChannelID = guild.settings.get('logChannel');
        const channel = guild.channels.get(logChannelID);
        if (!channel) {
            return;
        }
        const embed = genEmbed(`User Update`, `User Tag: ${newMember.user.tag} User ID: ${newMember.id}`);
        const oldRoles = oldMember.roles.array().map(e => `${e.name} [${e.id}]`);
        const newRoles = newMember.roles.array().map(e => `${e.name} [${e.id}]`);
        const roleDiff = diff(oldRoles, newRoles);
        if (roleDiff.added.length > 0) {
            let roles = [];
            newRoles.forEach(e => {
                if (!oldRoles.includes(e)) {
                    roles.push(e);
                }
            });
            embed.addField('Roles added', roles.join(', '))
        }
        if (roleDiff.deleted.length > 0) {
            let roles = [];
            oldRoles.forEach(e => {
                if (!newRoles.includes(e)) {
                    roles.push(e);
                }
            });
            embed.addField('Roles removed', roles.join(', '))
        }
        diff(oldMember, newMember).updated.forEach(changed => {
            if (diffBlacklist.includes(changed)) {
                return;
            }
            if (changed === 'nickname' && !oldMember.nickname) {
                embed.addField(`Field Changed: ${changed}`, `${oldMember.user.username} => ${newMember[changed]}`);
                return    
            }
            if (changed === 'nickname' && !newMember.nickname) {
                embed.addField(`Field Changed: ${changed}`, `${oldMember[changed]} => ${newMember.user.username}`);
                return    
            }
            console.log(`Field Changed: ${changed}`);
            console.log(`${oldMember[changed]} => ${newMember[changed]}`);
            embed.addField(`Field Changed: ${changed}`, `${oldMember[changed]} => ${newMember[changed]}`);
        });
        console.log(embed.fields.length);
        channel.send({embed});
    });

    auditLogging = true;
}