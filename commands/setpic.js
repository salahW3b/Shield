const db = require('quick.db');
const Discord = require('discord.js');

module.exports = {
    name: 'setpic',
    aliases: ['setavatar'],
    run: async (client, message, args, lang) => {



        if (process.env.owner.includes(message.author.id)) {
            if (db.get(`${client.user.id}.avatar`) === true) {
                return message.channel.send(`${lang.SetAvatarOneHour}`)
            }

            if (!args[0]) {
                
                return message.channel.send(`${lang.SetAvatarInvalidLink} \n \`setavatar + <link>\``)
            }
            let newavatar = args[0]
            message.delete();
                        if (!/(http|https|www):\/\/[^"]+?\.(jpg|png|gif|webp)/.test(args[0])) {
                return message.channel.send(`${lang.SetAvatarInvalidLink}`)
                
            }
           

            client.user.setAvatar(newavatar)
            
         //   let embed = new Discord.MessageEmbed()
         //   embed.setColor(color)
        //    embed.setDescription(`${lang.SetAvatarNewAvatar}`)
         //   embed.setImage(newavatar)
         //   embed.setTimestamp()
         //   embed.setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
            message.channel.send(`${lang.SetAvatarNewAvatar} ${newavatar}`)

            db.set(`${client.user.id}.avatar`, true)

            setTimeout(() => {
                db.set(`${client.user.id}.avatar`, false)
            }, 3600000);
        } else {
            return message.reply(permowners);
        }
    }
}