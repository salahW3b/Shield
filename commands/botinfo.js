
 const { MessageEmbed } = require('discord.js')
 const db = require('quick.db')
 const { MessageActionRow, MessageButton } = require('discord-buttons');

module.exports = {
    name: 'botinfo',
    aliases: ["bi", "bot-info"],
    run: async (client, message, args, lang, color, prefix) => {

        let totalSeconds = client.uptime / 1000;
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
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
          
            let Embed = new MessageEmbed()
            .setAuthor(message.author.username , message.author.displayAvatarURL({dynamic : true }))
                    .setTitle(`${lang.bottitre}`)
            .addField(`**${lang.nom}**`, `\`${client.user.username}\``, true)
            .addField(`**${lang.id}**`, `\`${client.user.id}\``, true)
      .addField(`**${lang.crea}**`, `<@898999050320363550>`, true)
      .addField(`**${lang.ns}**`, `\`${client.guilds.cache.size.toLocaleString()}\``, true)
      .addField(`**${lang.nm}**`, `\`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}\``, true)
      // .setImage(`${message.guild.banner}`)
           // .addField("<:BadgeServerVerified:823215796624949289>・**Niveau de vérification:**", `${verificationLevels[message.guild.verificationLevel]}`, true)
         //   .addField("<:vocal:847072676731551815>・**Salon vocal:**", `${channelsGuild.filter(channel => channel.type === 'voice').size}`, true)
    
            .setFooter(client.user.username, client.user.displayAvatarURL())
                  .setTimestamp()
            .setColor(color)
            .setThumbnail(client.user.displayAvatarURL({size:2048}))
                  message.channel.send({components: [interactiveButtons], embed: Embed})
    }
}