const Discord = require('discord.js')
const db = require('quick.db')
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)})}
      const disbut = require('discord-buttons'); 
      const { MessageActionRow, MessageButton } = require('discord-buttons');
const interaction = {}

const emojis = require("../emojis.json")
module.exports = {
    name: 'help',
    aliases: ["h"],

    run: async (client, message, args, lang, color, prefix) => {

        if (client.commands.get(args[0]) || client.commands.find(c => c.aliases && c.aliases.includes(args[0]))) {
            let command = client.commands.get(args[0]) || client.commands.find(c => c.aliases && c.aliases.includes(args[0]))
            if (!command) return message.channel.send(lang.itrouvable)
            let r = "`"+command.aliases+"`"
            if(r == "``") r = lang.alliassd
            let embed = new Discord.MessageEmbed()

            embed.setTitle(`${lang.helptitle1} ${command.name}`)
            embed.setFooter(client.user.username, client.user.displayAvatarURL())
            embed.addField(lang.helputil, `\`${lang.commands[command.name.toLowerCase()].usage}\``, )
            embed.addField(lang.helpexample, `\`${lang.commands[command.name.toLowerCase()].example}\``, )
            embed.addField(lang.helpgroup, `\`${lang.commands[command.name.toLowerCase()].group}\``, )
            embed.addField(lang.helpdescription, `\`${lang.commands[command.name.toLowerCase()].description}\``, )
            embed.addField(lang.helpaliass, `\`${lang.commands[command.name.toLowerCase()].aliases.join('\n')}\``, )
            embed.addField(lang.helpperm, `\`${lang.commands[command.name.toLowerCase()].perms}\``, )
            embed.setTimestamp()
            embed.setColor(color)
            embed.setThumbnail(client.user.displayAvatarURL({size:2048}))
            return message.channel.send(embed)
        } else {
            const B2 = new MessageButton()
            .setStyle('url')
            .setLabel(lang.invute)
           .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`);

            const B4 = new MessageButton()
            .setStyle('url')
            .setLabel('Support')
          .setURL(process.env.support);

    
            const interactiveButtons = new MessageActionRow()
            .addComponent(B2)
            .addComponent(B4)
        let embed = new Discord.MessageEmbed()
     
        embed.setTitle(`${lang.helptitle2} - (${client.commands.size-1})`)
        embed.setDescription(`${lang.helpdescription2} \`${prefix}help <${lang.helpcmd}> !\``)
        embed.setFooter(client.user.username, client.user.displayAvatarURL())
        embed.addField(`・Configuration  (3)`,"`lang`, `prefix`, `owner`")
        embed.addField(`・General  (3)`,"`botinfo`, `help`, `speed`")
        embed.addField(`・Security  (2)`,"`antiraid`, `whitelist`")

        embed.addField(`・Owner (3)`,"`server list`, `setpic`, `setname`")

        embed.setTimestamp()
        embed.setColor(color)
        embed.setThumbnail(client.user.displayAvatarURL({size:2048}))
       await message.channel.send({ components: [interactiveButtons], embed: embed });
          
        }
    }
}