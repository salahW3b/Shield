const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'prefix',
    aliases: [],
    run: async (client, message, args, lang, color, prefix) => {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(lang.permsAdmin);

let newPrefix = args[0]
if(!args[0]) return 
if(args[1]) return
if(db.get(` ${process.env.owner}.prefix`) === newPrefix) return message.channel.send(`${lang.prefixye} \`${db.get(` ${process.env.owner}.prefix`)}\``)
else {
    db.set(` ${process.env.owner}.prefix`, args[0])
message.channel.send(`${lang.prefixy} \`${args[0]}\``)
   }

        
    }
}