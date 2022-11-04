const db = require('quick.db');
const {
    MessageEmbed
} = require('discord.js');
const Discord = require('discord.js');

const emojis = require('../emojis.json')

module.exports = {
    name: 'setname',
    aliases: ['setusername'],
    run: async (client, message, args, lang) => {


        if (process.env.owner.includes(message.author.id)) {
            
            if (db.get(`${client.user.id}.username`) === true) {
                return message.channel.send(`${lang.SetUsernameFiveHour}`)
            }

            if (!args[0]) {
                return message.channel.send(`${lang.SetUsernameInvalid}`)
            }
            let newusername = args.join(' ')
            if (newusername.length > 32) {
                return message.channel.send(`${lang.SetUsernameInvalid}`)
            }
            if (newusername.length < 2) {
                return message.channel.send(`${lang.SetUsernameInvalid}`)
            }
            client.user.setUsername(newusername)
            message.reply(`${lang.SetUsernameNewName} **${newusername}**`)
            db.set(`${client.user.id}.username`, true)

            setTimeout(() => {
                db.set(`${client.user.id}.username`, false)
            }, 18000000);
        } else {
            return message.reply(permowners);
        }

    }
}