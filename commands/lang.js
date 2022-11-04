
 const { MessageEmbed } = require('discord.js')
 const db = require('quick.db')
module.exports = {
    name: 'lang',
    aliases: ["setlang", "setlanguage"],
    run: async (client, message, args, lang, color, prefix) => {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(lang.permsAdmin);
let guild = message.guild
        if (args[0] === db.get(`${message.guild.id}.language`)) {
            return message.channel.send(`${lang.LangAlreadySet} **${db.get(`${message.guild.id}.language`).replace("fr", lang.fr).replace("eng", lang.eng)}** !`)
        }
        if (args[0] === 'fr') {
            await  db.set(`sanction_${guild.id}`,"derank")
            await db.set(`${message.guild.id}.language`, `fr`)
            return message.channel.send(`${lang.LangSetOn} **${lang.fr}** !`)
        }
        
        if (args[0] === 'en') {
            await db.set(`${message.guild.id}.language`, `eng`)
            await  db.set(`sanction_${guild.id}`,"unrank")

            return message.channel.send(`${lang.LangSetOn} **${lang.eng}** !`)
        }
        return message.channel.send(`${lang.LangErrorBadLang}`)
       
    }
}