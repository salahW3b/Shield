const Discord = require("discord.js");
const db = require("quick.db");
const emojis = require("../emojis.json")


module.exports = {
    name: 'antiraid',
    aliases: ["secur","config","setup"],
    run: async (client, message, args, lang, color, prefix) => {
        
        if (message.guild.ownerID === message.author.id || process.env.owner.includes(message.author.id) || db.get(`ownermd_${message.guild.id}_${message.author.id}`) === true) {
        if (args[0] === 'info') {
 
            const embed = new Discord.MessageEmbed()
            
            embed .setTitle(lang.titleconfig)
            embed.addField(`Owner`, `\`${prefix}owner <add (${lang.memb})/remove (${lang.memb})/list/clear\`>`)
            embed.addField(`Whitelist`, `\`${prefix}whitelist <add (${lang.memb})/remove (${lang.memb})/list/clear>\``)
         
            embed.addField(`Punition`, `\`${prefix}antiraid punition ${lang.derank}/kick/ban\``)
            embed.addField(`Variable`, lang.varia)

            embed.addField(`Module`, `\`logs : on/off/#channel\`\n\`antibot : on/off/max\`\n \`antiwebhook : on/off/max\`\n \`antiupdate : on/off/max\`\n \`antichannel : on/off/max\`\n \`antirole : on/off/max\` \n \`antitoken : <limit (3j)>\`\n \`antimassjoin : on/off\``)
            embed.addField(`${lang.helpexample}`, `\`${prefix}antiraid on\n${prefix}antiraid punition ban\n${prefix}antiraid logs on\n${prefix}antiraid antiban max\``)


         //   embed .setDescription(`**Logs :** ${lograid}\n**Antibot :** \`${antibot}\`\n**Antiwebhook :** \`${antiwb}\`\n**Antiupdate :** \`${antiupdate}\`\n**Antichannel :** \`${antichannel}\`\n**Antirole :** \`${antirole}\`\n**Antiunban :** \`${antiunban}\`\n**Antieveryone :** \`${antieveryone} 3 / 1h\`\n**Antilink :** \`${antilink}${antilinktype}\`\n**Antitoken :** \`${crealimit}\`\n**Antimassjoin :** \`${antitoken}\`\n**Punition :** \`${db.get(`sanction_${message.guild.id}`) || lang.derank }\``)
            embed.setColor(color)
            
            embed.setFooter(client.user.username, client.user.displayAvatarURL())
            embed.setTimestamp()
            embed.setColor(color)
            embed.setThumbnail(client.user.displayAvatarURL({size:2048}))            
               return message.channel.send(embed) 
    }else if (args[0] === 'config') {
        if(!args[1]) {
            let lograid = message.guild.channels.cache.get(db.get(`${message.guild.id}.raidlog`))
            if(!lograid) lograid = "`off`"
            let antiwb = db.get(`webhooks_${message.guild.id}`)
              if(antiwb === null) antiwb = `${emojis.off}` 
              if(antiwb === true) antiwb = `${emojis.on}`
              if(antiwb === "max") antiwb = `${emojis.on} (max)`
              let antichannel = db.get(`channels_${message.guild.id}`)
              if(antichannel === null) antichannel = `${emojis.off}` 
            if(antichannel === true) antichannel = `${emojis.on}`
            if(antichannel === "max") antichannel = `${emojis.on} (max)` 
            let antirole = db.get(`roles_${message.guild.id}`)
            if(antirole === null) antirole = `${emojis.off}` 
            if(antirole === true) antirole = `${emojis.on}`
            if(antirole === "max") antirole = `${emojis.on} (max)`
            let antibot = db.get(`bot_${message.guild.id}`)
            if(antibot === null) antibot = `${emojis.off}` 
            if(antibot === true) antibot = `${emojis.on}`
            if(antibot === "max") antibot = `${emojis.on} (max)`
            let antiupdate = db.get(`update_${message.guild.id}`)
            if(antiupdate === null) antiupdate = `${emojis.off}` 
            if(antiupdate === true) antiupdate = `${emojis.on}`
            if(antiupdate === "max") antiupdate = `${emojis.on} (max)`
            //  let antieveryone = db.get(`everyone_${message.guild.id}`)
             // if(antieveryone === null) antieveryone = `${emojis.off}` 
           //   if(antieveryone === true) antieveryone = `${emojis.on}`
              let crealimit = db.get(`crealimit_${message.guild.id}`)
              if(crealimit === null) crealimit = `${emojis.off} \`0s\``

            let antiban = db.get(`massban_${message.guild.id}`)
            if(antiban === null) antiban = `${emojis.off}` 
            if(antiban === true) antiban = `${emojis.on}`
            if(antiban === "max") antiban = `${emojis.on} (max)`
            let antiunban = db.get(`massunban_${message.guild.id}`)
            if(antiunban === null) antiunban = `${emojis.off}` 
            if(antiunban === true) antiunban = `${emojis.on}`
            if(antiunban === "max") antiunban = "max"
            let antitoken = db.get(`antitoken_${message.guild.id}`)
            if(antitoken === null) antitoken = `${emojis.off}` 
            if(antitoken === true) antitoken = `${emojis.on}`
            let antilink = db.get("antilink_" + message.guild.id)
    if(antilink === "off") antilink = `${emojis.off}` 
    if(antilink === "on") antilink = `${emojis.on}`
            
            const embed = new Discord.MessageEmbed()
            
            embed .setTitle(lang.titlesecur+` (7)`)
            embed.addField(`Logs`, lograid, true)
            embed.addField(`Punition`, `\`${db.get(`sanction_${message.guild.id}`) || lang.derank }\``, true)
            embed.addField(`AntiBot`, `${antibot}`, true)
            embed.addField(`AntiWebhook`, `${antiwb}`, true)
            embed.addField(`AntiUpdate`, `${antiupdate}`, true)
            embed.addField(`AntiChannel`, `${antichannel}`, true)
            embed.addField(`AntiRole`, `${antirole}`, true)
          //   embed.addField(`Antieveryone`, `${antieveryone} 3 / 1h`, true)
          //   embed.addField(`Antilink`, `${antilink}`, true)
            embed.addField(`AntiToken`, `${crealimit}`, true)
            embed.addField(`AntiMassJoin`, `${antitoken}`, true)

         //   embed .setDescription(`**Logs :** ${lograid}\n**Antibot :** ${antibot}\`\n**Antiwebhook :** \`${antiwb}\`\n**Antiupdate :** \`${antiupdate}\`\n**Antichannel :** \`${antichannel}\`\n**Antirole :** \`${antirole}\`\n**Antiunban :** \`${antiunban}\`\n**Antieveryone :** \`${antieveryone} 3 / 1h\`\n**Antilink :** \`${antilink}${antilinktype}\`\n**Antitoken :** \`${crealimit}\`\n**Antimassjoin :** \`${antitoken}\`\n**Punition :** \`${db.get(`sanction_${message.guild.id}`) || lang.derank }\``)
            embed.setColor(color)
            
            embed.setFooter(client.user.username, client.user.displayAvatarURL())
            embed.setTimestamp()
            embed.setColor(color)
            embed.setThumbnail(client.user.displayAvatarURL({size:2048}))            
                return message.channel.send(embed) 
            
            }

} else  if (args[0] === "on") {
    let tdata = await message.channel.send(lang.chargement)
    db.set(`sanction_${message.guild.id}`, lang.derank)    
    db.set(`crealimit_${message.guild.id}`,"3j")
    db.set(`antitoken_${message.guild.id}`,true)
    db.set(`webhooks_${message.guild.id}`,true)
    db.set(`channels_${message.guild.id}`,true)
    db.set(`roles_${message.guild.id}`,true)
    db.set(`bot_${message.guild.id}`,true)
    db.set(`update_${message.guild.id}`,true)
  //  db.set(`everyone_${message.guild.id}`,true)
    db.set(`antispam_${message.guild.id}`,true)
    db.set(`massban_${message.guild.id}`,true)
    db.set("antilink_" + message.guild.id, "on")
  //  db.set(`typelink_${message.guild.id}`, "invite")
    let lograid = message.guild.channels.cache.get(db.get(`${message.guild.id}.raidlog`))
    if(!lograid) lograid = "`off`"
       const embed = new Discord.MessageEmbed()
      embed .setTitle(lang.titlesecur+` (7)`)
            embed.addField(`Logs`, lograid, true)
            embed.addField(`Punition`, `\`${db.get(`sanction_${message.guild.id}`) || lang.derank }\``, true)
            embed.addField(`Antibot`, `${emojis.on}`, true)
            embed.addField(`Antiwebhook`, `${emojis.on}`, true)
            embed.addField(`Antiupdate`, `${emojis.on}`, true)
            embed.addField(`Antichannel`, `${emojis.on}`, true)
            embed.addField(`Antirole`, `${emojis.on}`, true)
            // embed.addField(`Antieveryone`, `\`on 3 / 1h\``, true)
            embed.addField(`Antilink`, `${emojis.on} \`All\``, true)
            embed.addField(`Antitoken`, `${emojis.on} \`3j\``, true)
            embed.addField(`Antimassjoin`, `${emojis.on}`, true)
          embed.setColor(color)
               embed.setFooter(client.user.username, client.user.displayAvatarURL())
            embed.setTimestamp()
            embed.setColor(color)
            embed.setThumbnail(client.user.displayAvatarURL({size:2048}))            
             return tdata.edit("",embed)  
              
          
}else if (args[0] === "off") {
    let tdata = await message.channel.send(lang.chargement)
    db.set(`antitoken_${message.guild.id}`,null)
    db.set(`webhooks_${message.guild.id}`,null)
    db.set(`channels_${message.guild.id}`,null)
    db.set(`roles_${message.guild.id}`,null)
    db.set(`bot_${message.guild.id}`,null)
    db.set(`update_${message.guild.id}`,null)
   // db.set(`everyone_${message.guild.id}`,null)
    db.set(`antispam_${message.guild.id}`,null)
    db.set(`massban_${message.guild.id}`,null)
    db.set(`antilink_${message.guild.id}`, "off")
  
   let lograid = message.guild.channels.cache.get(db.get(`${message.guild.id}.raidlog`))
   if(!lograid) lograid = "`off`"
       const embed = new Discord.MessageEmbed()
      embed .setTitle(lang.titlesecur+` (7)`)
            embed.addField(`Logs`, lograid, true)
            embed.addField(`Punition`, `\`${db.get(`sanction_${message.guild.id}`) || lang.derank }\``, true)
            embed.addField(`Antibot`, `${emojis.off}`, true)
            embed.addField(`Antiwebhook`, `${emojis.off}`, true)
            embed.addField(`Antiupdate`, `${emojis.off}`, true)
            embed.addField(`Antichannel`, `${emojis.off}`, true)
            embed.addField(`Antirole`, `${emojis.off}`, true)
            // embed.addField(`Antieveryone`, `\`on 3 / 1h\``, true)
             //embed.addField(`Antilink`, `${emojis.off} \`All Off\``, true)
            embed.addField(`Antitoken`, `${emojis.off} \`3j\``, true)
            embed.addField(`Antimassjoin`, `${emojis.off}`, true)
          embed.setColor(color)
               embed.setFooter(client.user.username, client.user.displayAvatarURL())
            embed.setTimestamp()
            embed.setColor(color)
            embed.setThumbnail(client.user.displayAvatarURL({size:2048}))            
            return tdata.edit("",embed)  
        } else  if (args[0] === "max"){
    let tdata = await message.channel.send(lang.chargement)
    db.set(`sanction_${message.guild.id}`, "kick")    
    db.set(`crealimit_${message.guild.id}`,"1j")
    db.set(`antitoken_${message.guild.id}`,true)
    db.set(`webhooks_${message.guild.id}`,true)
    db.set(`channels_${message.guild.id}`,true)
    db.set(`roles_${message.guild.id}`,true)
    db.set(`bot_${message.guild.id}`,true)
    db.set(`update_${message.guild.id}`,true)
   // db.set(`everyone_${message.guild.id}`,true)
    db.set(`antispam_${message.guild.id}`,true)
    db.set(`massban_${message.guild.id}`,true)
  //  db.set(`link_${message.guild.id}`,true)
  // db.set(`typelink_${message.guild.id}`, " all")
   let lograid = message.guild.channels.cache.get(db.get(`${message.guild.id}.raidlog`))
   if(!lograid) lograid = "`off`"
       const embed = new Discord.MessageEmbed()
      embed .setTitle(lang.titlesecur+` (7)`)
            embed.addField(`Logs`, lograid, true)
            embed.addField(`Punition`, `\`kick\``, true)
            embed.addField(`Antibot`, `${emojis.on} (max)`, true)
            embed.addField(`Antiwebhook`, `${emojis.on} (max)`, true)
            embed.addField(`Antiupdate`, `${emojis.on} (max)`, true)
            embed.addField(`Antichannel`, `${emojis.on} (max)`, true)
            embed.addField(`Antirole`, `${emojis.on} (max)`, true)
            // embed.addField(`Antieveryone`, `\`on 3 / 1h\``, true)
             //embed.addField(`Antilink`, `${emojis.on} \`(All)\``, true)
            embed.addField(`Antitoken`, `${emojis.on} \`1j\``, true)
            embed.addField(`Antimassjoin`, `${emojis.on}`, true)
          embed.setColor(color)
               embed.setFooter(client.user.username, client.user.displayAvatarURL())
            embed.setTimestamp()
            embed.setColor(color)
            embed.setThumbnail(client.user.displayAvatarURL({size:2048}))            
            return tdata.edit("",embed)  
         
} else  if (args[0] === "punition"){
    if(!args[1])return message.channel.send(`${lang.formatinco} \`${prefix}antiraid punition kick, ban\``)
    if(args[1] === lang.derank) {
        db.set(`sanction_${message.guild.id}`, lang.derank)
      message.channel.send(`${lang.pune} **${lang.derank}**`)
  }  else if(args[1] === "kick") {
      db.set(`sanction_${message.guild.id}`, "kick")
      message.channel.send(`${lang.pune} **kick**`)
  }   else if(args[1] === "ban") {
      db.set(`sanction_${message.guild.id}`, "ban")
      message.channel.send(`${lang.pune} **ban**`)
  }

}  else  if (args[0] === "antitoken"){

        if(args[1]) {
            if(!args[1].endsWith("d") && !args[1].endsWith("j") && !args[1].endsWith("h") && !args[1].endsWith("m")  && !args[1].endsWith("s")) return message.channel.send(`${lang.formatinco} \`${prefix}antiraid antitoken 3j (0s = off)\``)

db.set(`crealimit_${message.guild.id}`, args[1])
message.channel.send(`${lang.antitoken} ${args[1]}`)
        } else {
            return message.channel.send(`${lang.formatinco} \`${prefix}antiraid antitoken 3j (0s = off)\``)
        }
  

} else  if (args[0] === "antiwebhook"){
   if(!args[1]) return message.channel.send(`${lang.formatinco} \`${prefix}antiraid antiwebhook on\``)
    if(args[1] === "on") {
        if(db.get(`webhooks_${message.guild.id}`) === true) return message.channel.send(`${lang.antiwebhook} ${lang.actif}`)
          db.set(`webhooks_${message.guild.id}`, true)
        message.channel.send(`${lang.antiwebhook} ${lang.yesactif}`)
    }  else if(args[1] === "off") {
        if(db.get(`webhooks_${message.guild.id}`) === null) return message.channel.send(`${lang.antiwebhook} ${lang.noactif}`)
        db.set(`webhooks_${message.guild.id}`, null)
        message.channel.send(`${lang.antiwebhook} ${lang.laactif}`)
    }   else if(args[1] === "max") {
        if(db.get(`webhooks_${message.guild.id}`) === "max") return message.channel.send(`${lang.antiwebhook} ${lang.actif}`)
        db.set(`webhooks_${message.guild.id}`, "max")
        message.channel.send(`${lang.antiwebhook} ${lang.max}`)
    }

}else  if (args[0] === "antibot"){
    if(!args[1]) return message.channel.send(`${lang.formatinco} \`${prefix}antiraid antibot off\``)
    if(args[1] === "on") {
        if(db.get(`bot_${message.guild.id}`) === true) return message.channel.send(`${lang.antibot} ${lang.actif}`)
          db.set(`bot_${message.guild.id}`, true)
        message.channel.send(`${lang.antibot} ${lang.yesactif}`)
    }  else if(args[1] === "off") {
        if(db.get(`bot_${message.guild.id}`) === null) return message.channel.send(`${lang.antibot} ${lang.noactif}`)
        db.set(`bot_${message.guild.id}`, null)
        message.channel.send(`${lang.antibot} ${lang.laactif}`)
    }   else if(args[1] === "max") {
        if(db.get(`bot_${message.guild.id}`) === "max") return message.channel.send(`${lang.antibot} ${lang.actif}`)
        db.set(`bot_${message.guild.id}`, "max")
        message.channel.send(`${lang.antibot} ${lang.max}`)
    }

}else  if (args[0] === "antiupdate"){
    if(!args[1]) return message.channel.send(`${lang.formatinco} \`${prefix}antiraid antiupdate max\``)
    if(args[1] === "on") {
        if(db.get(`update_${message.guild.id}`) === true) return message.channel.send(`${lang.antiupdate} ${lang.actif}`)
          db.set(`update_${message.guild.id}`, true)
        message.channel.send(`${lang.antiupdate} ${lang.yesactif}`)
    }  else if(args[1] === "off") {
        if(db.get(`update_${message.guild.id}`) === null) return message.channel.send(`${lang.antiupdate} ${lang.noactif}`)
        db.set(`update_${message.guild.id}`, null)
        message.channel.send(`${lang.antiupdate} ${lang.laactif}`)
    }   else if(args[1] === "max") {
        if(db.get(`update_${message.guild.id}`) === "max") return message.channel.send(`${lang.antiupdate} ${lang.actif}`)
        db.set(`update_${message.guild.id}`, "max")
        message.channel.send(`${lang.antiupdate} ${lang.max}`)
    }
}else  if (args[0] === "antirole"){
    if(!args[1]) return message.channel.send(`${lang.formatinco} \`${prefix}antiraid antirole on\``)
    if(args[1] === "on") {
        if(db.get(`roles_${message.guild.id}`) === true) return message.channel.send(`${lang.antirole} ${lang.actif}`)
          db.set(`roles_${message.guild.id}`, true)
        message.channel.send(`${lang.antirole} ${lang.yesactif}`)
    }  else if(args[1] === "off") {
        if(db.get(`roles_${message.guild.id}`) === null) return message.channel.send(`${lang.antirole} ${lang.noactif}`)
        db.set(`roles_${message.guild.id}`, null)
        message.channel.send(`${lang.antirole} ${lang.laactif}`)
    }   else if(args[1] === "max") {
        if(db.get(`roles_${message.guild.id}`) === "max") return message.channel.send(`${lang.antirole} ${lang.actif}`)
        db.set(`roles_${message.guild.id}`, "max")
        message.channel.send(`${lang.antirole} ${lang.max}`)
    }

}else  if (args[0] === "antichannel"){
    if(!args[1]) return message.channel.send(`${lang.formatinco} \`${prefix}antiraid antichannel on\``)
    if(args[1] === "on") {
        if(db.get(`channels_${message.guild.id}`) === true) return message.channel.send(`${lang.antichannel} ${lang.actif}`)
          db.set(`channels_${message.guild.id}`, true)
        message.channel.send(`${lang.antichannel} ${lang.yesactif}`)
    }  else if(args[1] === "off") {
        if(db.get(`channels_${message.guild.id}`) === null) return message.channel.send(`${lang.antichannel} ${lang.noactif}`)
        db.set(`channels_${message.guild.id}`, null)
        message.channel.send(`${lang.antichannel} ${lang.laactif}`)
    }   else if(args[1] === "max") {
        if(db.get(`channels_${message.guild.id}`) === "max") return message.channel.send(`${lang.antichannel} ${lang.actif}`)
        db.set(`channels_${message.guild.id}`, "max")
        message.channel.send(`${lang.antichannel} ${lang.max}`)
    }

}else  if (args[0] === "antiban"){
    if(!args[1]) return message.channel.send(`${lang.formatinco} \`${prefix}antiraid antiban off\``)
    if(args[1] === "on") {
        if(db.get(`massban_${message.guild.id}`) === true) return message.channel.send(`${lang.antiban} ${lang.actif}`)
          db.set(`massban_${message.guild.id}`, true)
        message.channel.send(`${lang.antiban} ${lang.yesactif}`)
    }  else if(args[1] === "off") {
        if(db.get(`massban_${message.guild.id}`) === null) return message.channel.send(`${lang.antiban} ${lang.noactif}`)
        db.set(`massban_${message.guild.id}`, null)
        message.channel.send(`${lang.antiban} ${lang.laactif}`)
    }   else if(args[1] === "max") {
        if(db.get(`massban_${message.guild.id}`) === "max") return message.channel.send(`${lang.antiban} ${lang.actif}`)
        db.set(`massban_${message.guild.id}`, "max")
        message.channel.send(`${lang.antiban} ${lang.max}`)
    }
 }else  if (args[0] === "antilink"){
     if(!args[1]) return message.channel.send(`${lang.formatinco} \`${prefix}antiraid antilink on\``)
     
     if(args[1] === "on") {
         if(db.get("antilink_" + message.guild.id) === "on") return message.channel.send(`${lang.antilink} ${lang.actif}`)
           db.set(`antilink_${message.guild.id}`, "on")
         message.channel.send(`${lang.antilink} ${lang.yesactif}`)

     }  else if(args[1] === "off") {
        if(db.get("antilink_" + message.guild.id) === "off") return message.channel.send(`${lang.antilink} ${lang.noactif}`)
         db.set(`antilink_${message.guild.id}`, "off")
       message.channel.send(`${lang.antilink} ${lang.laactif}`)
    // }  else if(args[1] === "invite") {
        //  if(db.get(`typelink_${message.guild.id}`) === " invite") return message.channel.send(`${lang.antilinivt}`)
    //    db.set(`typelink_${message.guild.id}`, " invite")
    //     message.channel.send(`${lang.antiliniv}`)
    // } else if(args[1] === "all") {
    //     if(db.get(`typelink_${message.guild.id}`) === " all") return message.channel.send(`${lang.antilinlk}`)
    //     db.set(`typelink_${message.guild.id}`, " all")
    //     message.channel.send(`${lang.antilinkln}`)
   //  }

 //} else  if (args[0] === "antieveryone"){
   //  if(!args[1]) return message.channel.send(`${lang.formatinco} \`${prefix}antiraid antieveryone off\``)
 // if(args[1] === "on") {
 //     if(db.get(`everyone_${message.guild.id}`) === true) return message.channel.send(`${lang.antieveryone} ${lang.actif}`)
 //       db.set(`everyone_${message.guild.id}`, true)
 //       message.channel.send(`${lang.antieveryone} ${lang.yesactif}`)
    // }  else if(args[1] === "off") {
 //       if(db.get(`everyone_${message.guild.id}`) === null) return message.channel.send(`${lang.antieveryone} ${lang.noactif}`)
    //     db.set(`everyone_${message.guild.id}`, null)
    //     message.channel.send(`${lang.antieveryone} ${lang.laactif}`)
   //  }  

     }
}else  if (args[0] === "antimassjoin"){

    if(!args[1]) return message.channel.send(`${lang.formatinco} \`${prefix}antiraid antimassjoin on\``)
    if(args[1] === "on") {
        if(db.get(`antitoken_${message.guild.id}`) === true) return message.channel.send(`${lang.antimassjoin} ${lang.actif}`)
          db.set(`antitoken_${message.guild.id}`, true)
        message.channel.send(`${lang.antimassjoin} ${lang.yesactif}`)
    }  else if(args[1] === "off") {
        if(db.get(`antitoken_${message.guild.id}`) === null) return message.channel.send(`${lang.antimassjoin} ${lang.noactif}`)
        db.set(`antitoken_${message.guild.id}`, null)
        message.channel.send(`${lang.antimassjoin} ${lang.laactif}`)
    }  


}else  if (args[0] === "logs"){
    if(!args[1]) return message.channel.send(`${lang.formatinco} \`${prefix}antiraid logs on\`\n\`${prefix}antiraid logs off\`\n\`${prefix}antiraid logs #logs\``)

    let ss = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
    
    if(args[1] === "on") {
        const channel = message.channel

        db.set(`${message.guild.id}.raidlog`, channel.id)
        message.channel.send(`${lang.antiraidlogs} ${channel}`)
    }

    else if(args[1] === "off") {
        db.set(`${message.guild.id}.raidlog`,null)
        message.channel.send(`${lang.antiraidlogsd}`)
        
    } else 
         if(ss) {
        db.set(`${message.guild.id}.raidlog`, ss.id)
        message.channel.send(`${lang.antiraidlogs} ${ss}`)
    }
}else {

 //   let embed = new Discord.MessageEmbed()
 //   embed.setAuthor(`${message.author.displayAvatarURL({dynamic: true})}`, `${formatinco}`)
 //   embed.addField(`${prefix}antiraid info`)
//    embed.addField(`${prefix}antiraid config`)
 //   embed.addField(`${prefix}antiraid punition`)
  //  embed.addField(`${prefix}antiraid logs #channel`)
  //  embed.setTimestamp()
  // embed.setColor(color)
  // embed.setThumbnail(client.user.displayAvatarURL({size:2048}))
  // return message.channel.send(embed)
 
    return message.channel.send(`${lang.formatinco} :\n\`${prefix}antiraid info\`\n\`${prefix}antiraid config\`\n\`${prefix}antiraid punition\`\n\`${prefix}antiraid logs #logs\``)
}
} else {
    return message.channel.send(lang.permowners);
}
    }
}