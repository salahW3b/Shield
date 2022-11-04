const Discord = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'speed',
    aliases: ["ping"],
    run: async (client, message, args, lang, color, prefix) => {
        let embeeed = new Discord.MessageEmbed()
        embeeed.addField("Ping", `Calcule en cours`, true)
        embeeed.addField(lang.latb, `${client.ws.ping}ms`, true)
        embeeed.setColor(color)

        let msg = await message.channel.send(embeeed)
        let embed = new Discord.MessageEmbed()
        embed.addField("Ping", `${msg.createdAt - message.createdAt + "ms"}`, true)
embed.addField(lang.latb, `${client.ws.ping}ms`, true)
        embed.setColor(color)
        
        return msg.edit("", embed)

        
    }
}