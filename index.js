
//#5865F2
// variable
const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_PRESENCES','GUILD_MEMBERS','GUILD_MESSAGES', 'GUILD_VOICE_STATES'] })
const disbut = require('discord-buttons'); 
disbut(client);
require('dotenv').config()
const db = require('quick.db')
const fs = require('fs').promises;
const fsS = require('fs');
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const ms = require('ms');
const request = require('request');
const logs = require('discord-logs');
logs(client, {debug:true})
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
 const { MessageActionRow, MessageButton } = require('discord-buttons');
client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
client.on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
client.on("error", e => {})
client.on("warn", info => {});
process.on("unhandledRejection", err => {
});
const commandFiles = fsS.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const commands = require(`./commands/${file}`)
    client.commands.set(commands.name, commands)

    console.log(`> commande charger ${commands.name}`)
}
client.on('ready', () => {
    console.log(`- Conecter ${client.user.username}`)
    if (!Array.isArray(db.get(` ${process.env.owner}.color`))) db.set(` ${process.env.owner}.color`,process.env.color)
    if (!Array.isArray(db.get(` ${process.env.owner}.prefix`))) db.set(` ${process.env.owner}.prefix`,process.env.prefix)

    let statuses = [
  
     // `${client.guilds.cache.size.toLocaleString()} server`,
      `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} users`,
      `${client.user.username}`
       
       ];
       setInterval(async function() {
 
         let STREAMING = statuses[Math.floor(Math.random() * statuses.length)]
         client.user.setActivity(STREAMING)
    
       }, 5000);
    })


client.on('message', async message => {
    if(!message.guild) return;
    if(message.author.bot) return;
    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return
    let language;
    if (db.get(`${message.guild.id}.language`) === undefined || db.get(`${message.guild.id}.language`) === null) {
        await db.set(`${message.guild.id}.language`, "fr")
        language = db.get(`${message.guild.id}.language`)
    }
    language = db.get(`${message.guild.id}.language`)
    const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))
    let prefix =  db.get(` ${process.env.owner}.prefix`) 
    if(prefix === null) prefix = process.env.prefix
    let color = db.get(` ${process.env.owner}.color`) 
    if(color === null  ) color = process.env.color
 
    if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
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
    return message.channel.send(`${lang.tag} \`${prefix}\``,interactiveButtons)
    }
    if (!message.content.startsWith(prefix)) return;
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
		if (!prefixRegex.test(message.content)) return;

		const [, matchedPrefix] = message.content.match(prefixRegex);
		const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();
 const command = client.commands.get(commandName) || client.commands.find(slm => slm.aliases && slm.aliases.includes(commandName));
if(!command) return
 
      if (command) command.run(client, message, args, lang, color, prefix);
  
     


})


try {
  // antiraid / automod

client.on("guildUpdate", async (oldGuild, newGuild) => {
  if(oldGuild === newGuild) return;
  let color = db.get(` ${process.env.owner}.color`) 
  if(color === null  ) color = process.env.color
  let guild = oldGuild
 
  if (!guild.me.hasPermission("ADMINISTRATOR")) return 
  let language;
if (db.get(`${guild.id}.language`) === undefined || db.get(`${guild.id}.language`) === null) {
    await db.set(`${guild.id}.language`, "fr")
    language = db.get(`${guild.id}.language`)
}
language = db.get(`${guild.id}.language`)
const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))
 let logChannel =  guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
 if( db.get(`update_${guild.id}`) === true ) {
 const action = await guild.fetchAuditLogs({limit: 1, type: "GUILD_UPDATE" }).then(async (audit) => audit.entries.first());
 if (action.executor.id === client.user.id) return;
  
let perm = guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  || db.get(`wlmd_${guild.id}_${action.executor.id}`) === true 
 if (perm) {
   return
} else if (!perm) {
  if(db.get(`sanction_${guild.id}`) === "ban") {
    guild.members.cache.get(action.executor.id).ban(`Antiupdate`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logsguildm} ${guild.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logsguildm} ${guild.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  } else if(db.get(`sanction_${guild.id}`) === "kick") {
    guild.members.cache.get(action.executor.id).kick(`Antiupdate`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logsguildm} ${guild.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logsguildm} ${guild.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  
  } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
  
    guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antiupdate`).then(te => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.logsguildm} ${guild.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    }).catch(err => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.logsguildm} ${guild.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    })
  
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
if(oldGuild.name === newGuild.name){

} else {
await newGuild.setName(oldGuild.name)
   
}
if(oldGuild.iconURL({dynamic:true}) === newGuild.iconURL({dynamic:true})){

} else {
await newGuild.setIcon(oldGuild.iconURL({dynamic:true}))      
 
}
if(oldGuild.bannerURL() === newGuild.bannerURL()
){

} else {
    await newGuild.setBanner(oldGuild.bannerURL())  
    
}
if(oldGuild.position === newGuild.position
){

} else {
   await newGuild.setChannelPositions([{ channel: oldGuild.id, position: oldGuild.position }])               
    
}
 
if(oldGuild.systemChannel  === newGuild.systemChannel 
    ){
    
    } else {
       await newGuild.setSystemChannel(oldGuild.systemChannel)      
        
    }
    if(oldGuild.systemChannelFlags  === newGuild.systemChannelFlags 
        ){
        
        } else {
           await newGuild.setSystemChannelFlags(oldGuild.systemChannelFlags )

            
        }
        if(oldGuild.verificationLevel  === newGuild.verificationLevel 
            ){
            
            } else {
               await newGuild.setVerificationLevel(oldGuild.verificationLevel )

                
            }
            if(oldGuild.widget  === newGuild.widget 
                ){
                
                } else {
                   await newGuild.setWidget(oldGuild.widget )

                    
                }
                if(oldGuild.splashURL  === newGuild.splashURL 
                    ){
                    
                    } else {
                       await newGuild.setSplash(oldGuild.splashURL )
 
                        
                    }
                    if(oldGuild.rulesChannel  === newGuild.rulesChannel 
                        ){
                        
                        } else {
                           await newGuild.setRulesChannel(oldGuild.rulesChannel )
     
                            
                        }
                        if(oldGuild.publicUpdatesChannel  === newGuild.publicUpdatesChannel 
                            ){
                            
                            } else {
                               await newGuild.setPublicUpdatesChannel(oldGuild.publicUpdatesChannel )
         
                                
                            }
if(oldGuild.defaultMessageNotifications  === newGuild.defaultMessageNotifications 
    ){
    
    } else {
       await newGuild.setDefaultMessageNotifications(oldGuild.defaultMessageNotifications )
             
        
    }
    if(oldGuild.afkChannel  === newGuild.afkChannel 
        ){
        
        } else {
           await newGuild.setAFKChannel(oldGuild.afkChannel )
                 
            
        }
        if(oldGuild.region  === newGuild.region 
                                        ){
                                        
                                        } else {
                                           await newGuild.setRegion(oldGuild.region )
                     
                                            
                                        }
                                      
if(oldGuild.afkTimeout  === newGuild.afkTimeout 
    ){
    
    } else {
       await newGuild.setAFKTimeout(oldGuild.afkTimeout)      
        
    }
    if(oldGuild.vanityURLCode  === newGuild.vanityURLCode 
      ){
        const settings = {
          url: `https://discord.com/api/v6/guilds/${guild.id}/vanity-url`,
          body: {
              code: oldGuild.vanityURLCode
          },
          json: true,
          method: 'PATCH',
          headers: {
              "Authorization": `Bot ${process.env.token}`
          }
      };
     await request(settings, (err, res, body) => {
          if (err) {
              return ;
          }
      });}

} else {}
 } else  if( db.get(`update_${guild.id}`) ===  "max") {
  const action = await guild.fetchAuditLogs({limit: 1, type: "GUILD_UPDATE" }).then(async (audit) => audit.entries.first());
  if (action.executor.id === client.user.id) return;
let perm =  guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  
  if (perm) {
    return
 } else if (!perm) {
   if(db.get(`sanction_${guild.id}`) === "ban") {
    guild.members.cache.get(action.executor.id).ban(`Antiupdate`).then(te => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logsguildm} ${guild.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             }).catch(err => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logsguildm} ${guild.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             })
   
   } else if(db.get(`sanction_${guild.id}`) === "kick") {
    guild.members.cache.get(action.executor.id).kick(`Antiupdate`).then(te => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logsguildm} ${guild.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             }).catch(err => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logsguildm} ${guild.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             })
   
   
   } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
   
     guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antiupdate`).then(te => {
       const embed = new Discord.MessageEmbed()
       embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.logsguildm} ${guild.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
       embed.setColor(color)
                    
                   embed.setFooter(client.user.username, client.user.displayAvatarURL())          

       if (logChannel) logChannel.send({ embed: embed })
     }).catch(err => {
       const embed = new Discord.MessageEmbed()
       embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.logsguildm} ${guild.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
       embed.setColor(color)
                    
                   embed.setFooter(client.user.username, client.user.displayAvatarURL())          

       if (logChannel) logChannel.send({ embed: embed })
     })
   
   }
   function sleep(ms) {
     return new Promise((resolve) => setTimeout(resolve, ms));
 }
 if(oldGuild.name === newGuild.name){
 
 } else {
 await newGuild.setName(oldGuild.name)
    
 }
 if(oldGuild.iconURL({dynamic:true}) === newGuild.iconURL({dynamic:true})){
 
 } else {
 await newGuild.setIcon(oldGuild.iconURL({dynamic:true}))      
  
 }
 if(oldGuild.bannerURL() === newGuild.bannerURL()
 ){
 
 } else {
     await newGuild.setBanner(oldGuild.bannerURL())  
     
 }
 if(oldGuild.position === newGuild.position
 ){
 
 } else {
    await newGuild.setChannelPositions([{ channel: oldGuild.id, position: oldGuild.position }])               
     
 }
  
 if(oldGuild.systemChannel  === newGuild.systemChannel 
     ){
     
     } else {
        await newGuild.setSystemChannel(oldGuild.systemChannel)      
         
     }
     if(oldGuild.systemChannelFlags  === newGuild.systemChannelFlags 
         ){
         
         } else {
            await newGuild.setSystemChannelFlags(oldGuild.systemChannelFlags )
 
             
         }
         if(oldGuild.verificationLevel  === newGuild.verificationLevel 
             ){
             
             } else {
                await newGuild.setVerificationLevel(oldGuild.verificationLevel )
 
                 
             }
             if(oldGuild.widget  === newGuild.widget 
                 ){
                 
                 } else {
                    await newGuild.setWidget(oldGuild.widget )
 
                     
                 }
                 if(oldGuild.splashURL  === newGuild.splashURL 
                     ){
                     
                     } else {
                        await newGuild.setSplash(oldGuild.splashURL )
  
                         
                     }
                     if(oldGuild.rulesChannel  === newGuild.rulesChannel 
                         ){
                         
                         } else {
                            await newGuild.setRulesChannel(oldGuild.rulesChannel )
      
                             
                         }
                         if(oldGuild.publicUpdatesChannel  === newGuild.publicUpdatesChannel 
                             ){
                             
                             } else {
                                await newGuild.setPublicUpdatesChannel(oldGuild.publicUpdatesChannel )
          
                                 
                             }
 if(oldGuild.defaultMessageNotifications  === newGuild.defaultMessageNotifications 
     ){
     
     } else {
        await newGuild.setDefaultMessageNotifications(oldGuild.defaultMessageNotifications )
              
         
     }
     if(oldGuild.afkChannel  === newGuild.afkChannel 
         ){
         
         } else {
            await newGuild.setAFKChannel(oldGuild.afkChannel )
                  
             
         }
         if(oldGuild.region  === newGuild.region 
                                         ){
                                         
                                         } else {
                                            await newGuild.setRegion(oldGuild.region )
                      
                                             
                                         }
                                       
 if(oldGuild.afkTimeout  === newGuild.afkTimeout 
     ){
     
     } else {
        await newGuild.setAFKTimeout(oldGuild.afkTimeout)      
         
     }
     if(oldGuild.vanityURLCode  === newGuild.vanityURLCode 
       ){
         const settings = {
           url: `https://discord.com/api/v6/guilds/${guild.id}/vanity-url`,
           body: {
               code: oldGuild.vanityURLCode
           },
           json: true,
           method: 'PATCH',
           headers: {
               "Authorization": `Bot ${process.env.token}`
           }
       };
      await request(settings, (err, res, body) => {
           if (err) {
               return ;
           }
       });}
 
 } else {}
  }
 
})

client.on("messageCreate", async (message) => {

  let perm = guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  || db.get(`wlmd_${guild.id}_${action.executor.id}`) === true 
  if(message.member.hasPermission("ADMINISTRATOR")|| message.author.bot || message.channel.type === "dm" || (perm)) return;


  let liens = ["discord.gg",".gg","discord .gg","discord gg","discord. gg","discord .gg",".gg","discord.com/invite","discordapp.com/invite","https"]
    

  if(db.get("antilink_" + message.guild.id) !== "on") return;

  let foundInText = false;
  for(var i in liens) {
  if(message.content.toLowerCase().includes(liens[i].toLowerCase())) foundInText = true;
  }
  if(foundInText) return message.delete()

        return message.channel.send("Tu ne peut pas envoyer des liens ici car l'anti-link est activé")
        .then(m => m.delete({timeout:1200}))
        


  })

  //////////////////
client.on("messageUpdate", async (oldMessage, newMessage) => {

  if(oldMessage.member.hasPermission("ADMINISTRATOR")|| message.author.bot || message.channel.type === "dm" || (perm)) return;

let perm = guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  || db.get(`wlmd_${guild.id}_${action.executor.id}`) === true 

   let liens = ["discord.gg",".gg","discord .gg","discord gg","discord. gg","discord .gg",".gg","discord.com/invite","discordapp.com/invite","https"]
    

  if(db.get("antilink_" + oldMessage.guild.id) !== "on") return;

  let foundInText = false;
  for(var i in liens) {
  if(newMessage.content.toLowerCase().includes(liens[i].toLowerCase())) foundInText = true;
  }

  if(foundInText) return newMessage.delete()


        return message.channel.send("Tu ne peut pas envoyer des liens ici car l'anti-link est activé")
        .then(m => m.delete({timeout:1200}))
      
})

/////////////////////
client.on("roleCreate", async (role) => {
  var wassim = role.guild.members.cache.filter(member => member.user.bot)
  wassim.map(r =>{if(r.username === role.name) {return}})
  let color = db.get(` ${process.env.owner}.color`) 
  if(color === null  ) color = process.env.color
  let guild = role.guild
  if (!guild.me.hasPermission("ADMINISTRATOR")) return 
  let language;
if (db.get(`${guild.id}.language`) === undefined || db.get(`${guild.id}.language`) === null) {
    await db.set(`${guild.id}.language`, "fr")
    language = db.get(`${guild.id}.language`)
}
language = db.get(`${guild.id}.language`)
const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))
 let logChannel =  guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
 if( db.get(`roles_${guild.id}`) === true ) {
 const action = await guild.fetchAuditLogs({limit: 1, type: "ROLE_CREATE" }).then(async (audit) => audit.entries.first());
 if (action.executor.id === client.user.id) return;
let perm = guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  || db.get(`wlmd_${guild.id}_${action.executor.id}`) === true 
 if (perm) {
   return
} else if (!perm) {
  if(db.get(`sanction_${guild.id}`) === "ban") {
    guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logsrolec}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logsrolec}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  } else if(db.get(`sanction_${guild.id}`) === "kick") {
    guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logsrolec}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logsrolec}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  
  } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
  
    guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antirole`).then(te => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.logsrolec}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    }).catch(err => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.logsrolec}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    })
  
  }
  role.delete(`Antirole`)


} else {}
 } else if( db.get(`roles_${guild.id}`) ===  "max") {
 
 const action = await guild.fetchAuditLogs({limit: 1, type: "ROLE_CREATE" }).then(async (audit) => audit.entries.first());
 if (action.executor.id === client.user.id) return;
let perm =  guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  
 if (perm) {
   return
} else if (!perm) {
  if(db.get(`sanction_${guild.id}`) === "ban") {
    guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logsrolec}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logsrolec}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  } else if(db.get(`sanction_${guild.id}`) === "kick") {
    guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logsrolec}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logsrolec}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  
  } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
  
    guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antirole`).then(te => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.logsrolec}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    }).catch(err => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.logsrolec}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    })
  
  }
  role.delete(`Antilink`)


} else {}
} else  if( db.get(`roles_${guild.id}`) === "max") {
  const action = await guild.fetchAuditLogs({limit: 1, type: "ROLE_DELETE" }).then(async (audit) => audit.entries.first());
  if (action.executor.id === client.user.id) return;
let perm =  guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  
  if (perm) {
    return
 } else if (!perm) {
   if(db.get(`sanction_${guild.id}`) === "ban") {
    guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             }).catch(err => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             })
   
   } else if(db.get(`sanction_${guild.id}`) === "kick") {
guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             }).catch(err => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             })
   
   
   } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
   
     guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antirole`).then(te => {
       const embed = new Discord.MessageEmbed()
       embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
       embed.setColor(color)
                    
                   embed.setFooter(client.user.username, client.user.displayAvatarURL())          

       if (logChannel) logChannel.send({ embed: embed })
     }).catch(err => {
       const embed = new Discord.MessageEmbed()
       embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
       embed.setColor(color)
                    
                   embed.setFooter(client.user.username, client.user.displayAvatarURL())          

       if (logChannel) logChannel.send({ embed: embed })
     })
   
   }
   try {
   oldRole.guild.roles.create({
     data: {
       name: oldRole.name,
       color: oldRole.hexColor,
       permissions: oldRole.permissions,
       hoist: oldRole.hoist,
       mentionable: oldRole.mentionable,
       position: oldRole.rawPosition,
       highest: oldRole.highest,
       reason: `Antilink`
     }
 
   })
   }catch(err) {
     
   }
 
 } else {}
  } else {}
})
client.on("roleDelete", async (oldRole, newRole) => {
  var wassim = oldRole.guild.members.cache.filter(member => member.user.bot)
  wassim.map(r =>{if(r.username === oldRole.name) return})
  let color = db.get(` ${process.env.owner}.color`) 
  if(color === null  ) color = process.env.color
  let guild = oldRole.guild
  if (!guild.me.hasPermission("ADMINISTRATOR")) return 
  let language;
if (db.get(`${guild.id}.language`) === undefined || db.get(`${guild.id}.language`) === null) {
    await db.set(`${guild.id}.language`, "fr")
    language = db.get(`${guild.id}.language`)
}
language = db.get(`${guild.id}.language`)
const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))
 let logChannel =  guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
 if( db.get(`roles_${guild.id}`) === true) {
 const action = await guild.fetchAuditLogs({limit: 1, type: "ROLE_DELETE" }).then(async (audit) => audit.entries.first());
 if (action.executor.id === client.user.id) return;
 let perm = guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  || db.get(`wlmd_${guild.id}_${action.executor.id}`) === true 
 if (perm) {
   return
} else if (!perm) {
  if(db.get(`sanction_${guild.id}`) === "ban") {
  guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  } else if(db.get(`sanction_${guild.id}`) === "kick") {
guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  
  } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
  
    guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antirole`).then(te => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    }).catch(err => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    })
  
  }
  try {
  oldRole.guild.roles.create({
    data: {
      name: oldRole.name,
      color: oldRole.hexColor,
      permissions: oldRole.permissions,
      hoist: oldRole.hoist,
      mentionable: oldRole.mentionable,
      position: oldRole.rawPosition,
      highest: oldRole.highest,
      reason: `Antirole`
    }

  })
  }catch(err) {
    
  }

} else {}
 } else  if( db.get(`roles_${guild.id}`) === "max") {
  const action = await guild.fetchAuditLogs({limit: 1, type: "ROLE_DELETE" }).then(async (audit) => audit.entries.first());
  if (action.executor.id === client.user.id) return;
let perm =  guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  
  if (perm) {
    return
 } else if (!perm) {
   if(db.get(`sanction_${guild.id}`) === "ban") {
    guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             }).catch(err => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             })
   
   } else if(db.get(`sanction_${guild.id}`) === "kick") {
guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             }).catch(err => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             })
   
   
   } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
   
     guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antirole`).then(te => {
       const embed = new Discord.MessageEmbed()
       embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
       embed.setColor(color)
                    
                   embed.setFooter(client.user.username, client.user.displayAvatarURL())          

       if (logChannel) logChannel.send({ embed: embed })
     }).catch(err => {
       const embed = new Discord.MessageEmbed()
       embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
       embed.setColor(color)
                    
                   embed.setFooter(client.user.username, client.user.displayAvatarURL())          

       if (logChannel) logChannel.send({ embed: embed })
     })
   
   }
   try {
   oldRole.guild.roles.create({
     data: {
       name: oldRole.name,
       color: oldRole.hexColor,
       permissions: oldRole.permissions,
       hoist: oldRole.hoist,
       mentionable: oldRole.mentionable,
       position: oldRole.rawPosition,
       highest: oldRole.highest,
       reason: `Antirole`
     }
 
   })
   }catch(err) {
     
   }
 
 } else {}
  } else {}
 })
 client.on("roleUpdate", async (oldRole, newRole) => {
   if (oldRole === newRole) return
   var wassim = oldRole.guild.members.cache.filter(member => member.user.bot)
   wassim.map(r =>{if(r.username === oldRole.name) return})
   let color = db.get(` ${process.env.owner}.color`) 
   if(color === null  ) color = process.env.color
   let guild = oldRole.guild
   if (!guild.me.hasPermission("ADMINISTRATOR")) return 
   let language;
if (db.get(`${guild.id}.language`) === undefined || db.get(`${guild.id}.language`) === null) {
    await db.set(`${guild.id}.language`, "fr")
    language = db.get(`${guild.id}.language`)
}
language = db.get(`${guild.id}.language`)
const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))
  let logChannel =  guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
  if( db.get(`roles_${guild.id}`) === true) {
  const action = await guild.fetchAuditLogs({limit: 1, type: "ROLE_UPDATE" }).then(async (audit) => audit.entries.first());
  if (action.executor.id === client.user.id) return;
let perm = guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  || db.get(`wlmd_${guild.id}_${action.executor.id}`) === true 
  if (perm) {
    return
 } else if (!perm) {
   if(db.get(`sanction_${guild.id}`) === "ban") {
    guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             }).catch(err => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             })
   
   } else if(db.get(`sanction_${guild.id}`) === "kick") {
guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             }).catch(err => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             })
   
   
   } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
   
     guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antirole`).then(te => {
       const embed = new Discord.MessageEmbed()
       embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
       embed.setColor(color)
                    
                   embed.setFooter(client.user.username, client.user.displayAvatarURL())          

       if (logChannel) logChannel.send({ embed: embed })
     }).catch(err => {
       const embed = new Discord.MessageEmbed()
       embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
       embed.setColor(color)
                    
                   embed.setFooter(client.user.username, client.user.displayAvatarURL())          

       if (logChannel) logChannel.send({ embed: embed })
     })
   
   }
   try {
     await oldRole.edit({
         data: {
           name: oldRole.name,
           color: oldRole.hexColor,
           permissions: oldRole.permissions,
           hoist: oldRole.hoist,
           mentionable: oldRole.mentionable,
           position: oldRole.rawPosition,
           highest: oldRole.highest,
           reason: `Protection: ${this.name}`
         }
       })
     } catch(err) {
 
     }
 
 } else if( db.get(`roles_${guild.id}`) ===  "max") {

 const action = await guild.fetchAuditLogs({limit: 1, type: "ROLE_UPDATE" }).then(async (audit) => audit.entries.first());
 if (action.executor.id === client.user.id) return;
let perm =  guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  
 if (perm) {
   return
} else if (!perm) {
  if(db.get(`sanction_${guild.id}`) === "ban") {
  guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  } else if(db.get(`sanction_${guild.id}`) === "kick") {
guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  
  } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
  
    guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antirole`).then(te => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    }).catch(err => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    })
  
  }
  try {
    await oldRole.edit({
        data: {
          name: oldRole.name,
          color: oldRole.hexColor,
          permissions: oldRole.permissions,
          hoist: oldRole.hoist,
          mentionable: oldRole.mentionable,
          position: oldRole.rawPosition,
          highest: oldRole.highest,
          reason: `Protection: ${this.name}`
        }
      })
    } catch(err) {

    }

}
  }}
})
client.on("guildMemberRoleRemove", async (member, role) => {

  if (!member) return;
  if (!role) return;


  let color = db.get(` ${process.env.owner}.color`) 
  if(color === null  ) color = process.env.color
  let guild = member.guild
  if (!guild.me.hasPermission("ADMINISTRATOR")) return 
  let language;
if (db.get(`${guild.id}.language`) === undefined || db.get(`${guild.id}.language`) === null) {
    await db.set(`${guild.id}.language`, "fr")
    language = db.get(`${guild.id}.language`)
}
language = db.get(`${guild.id}.language`)
const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))
 let logChannel =  guild.channels.cache.get(db.get(`${guild.id}.raidlog`))

 if( db.get(`roles_${guild.id}`) === true ) {

  const action = await guild.fetchAuditLogs({limit: 1, type: "MEMBER_ROLE_UPDATE" }).then(async (audit) => audit.entries.first());
  if (action.executor.id === client.user.id) return;
  let maxt = false
let perm = guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  || db.get(`wlmd_${guild.id}_${action.executor.id}`) === true
 if (perm) {
   return
} else if (!perm) {

  if (role.permissions.has("KICK_MEMBERS") || role.permissions.has("BAN_MEMBERS") ||  role.permissions.has("MANAGE_WEBHOOKS") ||role.permissions.has("ADMINISTRATOR") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("MANAGE_GUILD") || role.permissions.has("MENTION_EVERYONE") || role.permissions.has("MANAGE_ROLES")) {
    member.roles.add(role, `Antirole`).then(() => {
      if(db.get(`sanction_${guild.id}`) === "ban") {
guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} ${lang.removeperm} ${member}`)
                  embed.setColor(color)
                               
                              embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} ${lang.removeperm} ${member}`)
                  embed.setColor(color)
                               
                              embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                  if (logChannel) logChannel.send({ embed: embed })
                })
      
      } else if(db.get(`sanction_${guild.id}`) === "kick") {
guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} ${lang.removeperm} ${member}`)
                  embed.setColor(color)
                               
                              embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} ${lang.removeperm} ${member}`)
                  embed.setColor(color)
                               
                              embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                  if (logChannel) logChannel.send({ embed: embed })
                })
      
      
      } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
      
        guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antirole`).then(te => {
          const embed = new Discord.MessageEmbed()
          embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} ${lang.removeperm} ${member}`)
          embed.setColor(color)
                       
                      embed.setFooter(client.user.username, client.user.displayAvatarURL())          

          if (logChannel) logChannel.send({ embed: embed })
        }).catch(err => {
          const embed = new Discord.MessageEmbed()
          embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} ${lang.removeperm} ${member}`)
          embed.setColor(color)
                       
                      embed.setFooter(client.user.username, client.user.displayAvatarURL())          

          if (logChannel) logChannel.send({ embed: embed })
        })
      
      }
    }).catch(err => {})


} else {
 if(maxt === true) {
  member.roles.add(role, `Antirole`).then(() => {
    if(db.get(`sanction_${guild.id}`) === "ban") {
guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} ${lang.removerole} ${member}`)
                embed.setColor(color)
                             
                            embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                if (logChannel) logChannel.send({ embed: embed })
              }).catch(err => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} ${lang.removerole} ${member}`)
                embed.setColor(color)
                             
                            embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                if (logChannel) logChannel.send({ embed: embed })
              })
    
    } else if(db.get(`sanction_${guild.id}`) === "kick") {
guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} ${lang.removerole} ${member}`)
                embed.setColor(color)
                             
                            embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                if (logChannel) logChannel.send({ embed: embed })
              }).catch(err => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} ${lang.removerole} ${member}`)
                embed.setColor(color)
                             
                            embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                if (logChannel) logChannel.send({ embed: embed })
              })
    
    
    } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
    
      guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antirole`).then(te => {
        const embed = new Discord.MessageEmbed()
        embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} ${lang.removerole} ${member}`)
        embed.setColor(color)
                     
                    embed.setFooter(client.user.username, client.user.displayAvatarURL())          

        if (logChannel) logChannel.send({ embed: embed })
      }).catch(err => {
        const embed = new Discord.MessageEmbed()
        embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} ${lang.removerole} ${member}`)
        embed.setColor(color)
                     
                    embed.setFooter(client.user.username, client.user.displayAvatarURL())          

        if (logChannel) logChannel.send({ embed: embed })
      })
    
    }
  }).catch(err => {})
 } else {

}
}
 
}} else  if( db.get(`roles_${guild.id}`) ===  "max") {

  const action = await guild.fetchAuditLogs({limit: 1, type: "MEMBER_ROLE_UPDATE" }).then(async (audit) => audit.entries.first());
  if (action.executor.id === client.user.id) return;
  let maxt = true
let perm = guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true
 if (perm) {
   return
} else if (!perm) {

  if (role.permissions.has("KICK_MEMBERS") || role.permissions.has("BAN_MEMBERS") ||  role.permissions.has("MANAGE_WEBHOOKS") ||role.permissions.has("ADMINISTRATOR") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("MANAGE_GUILD") || role.permissions.has("MENTION_EVERYONE") || role.permissions.has("MANAGE_ROLES")) {
    member.roles.add(role, `Antirole`).then(() => {
      if(db.get(`sanction_${guild.id}`) === "ban") {
guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} ${lang.removeperm} ${member}`)
                  embed.setColor(color)
                               
                              embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} ${lang.removeperm} ${member}`)
                  embed.setColor(color)
                               
                              embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                  if (logChannel) logChannel.send({ embed: embed })
                })
      
      } else if(db.get(`sanction_${guild.id}`) === "kick") {
guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} ${lang.removeperm} ${member}`)
                  embed.setColor(color)
                               
                              embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} ${lang.removeperm} ${member}`)
                  embed.setColor(color)
                               
                              embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                  if (logChannel) logChannel.send({ embed: embed })
                })
      
      
      } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
      
        guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antirole`).then(te => {
          const embed = new Discord.MessageEmbed()
          embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} ${lang.removeperm} ${member}`)
          embed.setColor(color)
                       
                      embed.setFooter(client.user.username, client.user.displayAvatarURL())          

          if (logChannel) logChannel.send({ embed: embed })
        }).catch(err => {
          const embed = new Discord.MessageEmbed()
          embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} ${lang.removeperm} ${member}`)
          embed.setColor(color)
                       
                      embed.setFooter(client.user.username, client.user.displayAvatarURL())          

          if (logChannel) logChannel.send({ embed: embed })
        })
      
      }
    }).catch(err => {})


} else {
 if(maxt === true) {
  member.roles.add(role, `Antirole`).then(() => {
    if(db.get(`sanction_${guild.id}`) === "ban") {
guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} ${lang.removerole} ${member}`)
                embed.setColor(color)
                             
                            embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                if (logChannel) logChannel.send({ embed: embed })
              }).catch(err => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} ${lang.removerole} ${member}`)
                embed.setColor(color)
                             
                            embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                if (logChannel) logChannel.send({ embed: embed })
              })
    
    } else if(db.get(`sanction_${guild.id}`) === "kick") {
guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} ${lang.removerole} ${member}`)
                embed.setColor(color)
                             
                            embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                if (logChannel) logChannel.send({ embed: embed })
              }).catch(err => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} ${lang.removerole} ${member}`)
                embed.setColor(color)
                             
                            embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                if (logChannel) logChannel.send({ embed: embed })
              })
    
    
    } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
    
      guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antirole`).then(te => {
        const embed = new Discord.MessageEmbed()
        embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} ${lang.removerole} ${member}`)
        embed.setColor(color)
                     
                    embed.setFooter(client.user.username, client.user.displayAvatarURL())          

        if (logChannel) logChannel.send({ embed: embed })
      }).catch(err => {
        const embed = new Discord.MessageEmbed()
        embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} ${lang.removerole} ${member}`)
        embed.setColor(color)
                     
                    embed.setFooter(client.user.username, client.user.displayAvatarURL())          

        if (logChannel) logChannel.send({ embed: embed })
      })
    
    }
  }).catch(err => {})
 } else {

}}
}
 
}

  
})
client.on("guildMemberRoleAdd", async (member, role) => {

  if (!member) return;
  if (!role) return;


  let color = db.get(` ${process.env.owner}.color`) 
  if(color === null  ) color = process.env.color
  let guild = member.guild
  if (!guild.me.hasPermission("ADMINISTRATOR")) return 
  let language;
if (db.get(`${guild.id}.language`) === undefined || db.get(`${guild.id}.language`) === null) {
    await db.set(`${guild.id}.language`, "fr")
    language = db.get(`${guild.id}.language`)
}
language = db.get(`${guild.id}.language`)
const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))
 let logChannel =  guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
 if(db.get(`roles_${guild.id}`) === true) {
  const action = await guild.fetchAuditLogs({limit: 1, type: "MEMBER_ROLE_UPDATE" }).then(async (audit) => audit.entries.first());
  if (action.executor.id === client.user.id) return;
let perm = guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  || db.get(`wlmd_${guild.id}_${action.executor.id}`) === true
let maxt = false

 if (perm) {
   return
} else if (!perm) {

  if (role.permissions.has("KICK_MEMBERS") || role.permissions.has("BAN_MEMBERS") ||  role.permissions.has("MANAGE_WEBHOOKS") ||role.permissions.has("ADMINISTRATOR") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("MANAGE_GUILD") || role.permissions.has("MENTION_EVERYONE") || role.permissions.has("MANAGE_ROLES")) {
    member.roles.remove(role, `Antirole`).then(() => {
      if(db.get(`sanction_${guild.id}`) === "ban") {
guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} ${lang.addperm} ${member}`)
                  embed.setColor(color)
                               
                              embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} ${lang.addperm} ${member}`)
                  embed.setColor(color)
                               
                              embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                  if (logChannel) logChannel.send({ embed: embed })
                })
      
      } else if(db.get(`sanction_${guild.id}`) === "kick") {
guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} ${lang.addperm} ${member}`)
                  embed.setColor(color)
                               
                              embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} ${lang.addperm} ${member}`)
                  embed.setColor(color)
                               
                              embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                  if (logChannel) logChannel.send({ embed: embed })
                })
      
      
      } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
      
        guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antirole`).then(te => {
          const embed = new Discord.MessageEmbed()
          embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} ${lang.addperm} ${member}`)
          embed.setColor(color)
                       
                      embed.setFooter(client.user.username, client.user.displayAvatarURL())          

          if (logChannel) logChannel.send({ embed: embed })
        }).catch(err => {
          const embed = new Discord.MessageEmbed()
          embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} ${lang.addperm} ${member}`)
          embed.setColor(color)
                       
                      embed.setFooter(client.user.username, client.user.displayAvatarURL())          

          if (logChannel) logChannel.send({ embed: embed })
        })
      
      }
    }).catch(err => {})


} else {
 if(maxt === true) {
  member.roles.remove(role, `Antirole`).then(() => {
    if(db.get(`sanction_${guild.id}`) === "ban") {
guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} ${lang.addrole} ${member}`)
                embed.setColor(color)
                             
                            embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                if (logChannel) logChannel.send({ embed: embed })
              }).catch(err => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} ${lang.addrole} ${member}`)
                embed.setColor(color)
                             
                            embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                if (logChannel) logChannel.send({ embed: embed })
              })
    
    } else if(db.get(`sanction_${guild.id}`) === "kick") {
guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} ${lang.addrole} ${member}`)
                embed.setColor(color)
                             
                            embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                if (logChannel) logChannel.send({ embed: embed })
              }).catch(err => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} ${lang.addrole} ${member}`)
                embed.setColor(color)
                             
                            embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                if (logChannel) logChannel.send({ embed: embed })
              })
    
    
    } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
    
      guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antirole`).then(te => {
        const embed = new Discord.MessageEmbed()
        embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} ${lang.addrole} ${member}`)
        embed.setColor(color)
                     
                    embed.setFooter(client.user.username, client.user.displayAvatarURL())          

        if (logChannel) logChannel.send({ embed: embed })
      }).catch(err => {
        const embed = new Discord.MessageEmbed()
        embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} ${lang.addrole} ${member}`)
        embed.setColor(color)
                     
                    embed.setFooter(client.user.username, client.user.displayAvatarURL())          

        if (logChannel) logChannel.send({ embed: embed })
      })
    
    }
  }).catch(err => {})
 } else {

}

 
}} else{}
} else if(db.get(`roles_${guild.id}`) === "max") {
  const action = await guild.fetchAuditLogs({limit: 1, type: "MEMBER_ROLE_UPDATE" }).then(async (audit) => audit.entries.first());
  if (action.executor.id === client.user.id) return;
  let perm = guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true
  let maxt = true
  
   if (perm) {
     return
  } else if (!perm) {
  
    if (role.permissions.has("KICK_MEMBERS") || role.permissions.has("BAN_MEMBERS") ||  role.permissions.has("MANAGE_WEBHOOKS") ||role.permissions.has("ADMINISTRATOR") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("MANAGE_GUILD") || role.permissions.has("MENTION_EVERYONE") || role.permissions.has("MANAGE_ROLES")) {
      member.roles.remove(role, `Antirole`).then(() => {
        if(db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
                    const embed = new Discord.MessageEmbed()
                    embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} ${lang.addperm} ${member}`)
                    embed.setColor(color)
                                 
                                embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                    if (logChannel) logChannel.send({ embed: embed })
                  }).catch(err => {
                    const embed = new Discord.MessageEmbed()
                    embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} ${lang.addperm} ${member}`)
                    embed.setColor(color)
                                 
                                embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                    if (logChannel) logChannel.send({ embed: embed })
                  })
        
        } else if(db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
                    const embed = new Discord.MessageEmbed()
                    embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} ${lang.addperm} ${member}`)
                    embed.setColor(color)
                                 
                                embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                    if (logChannel) logChannel.send({ embed: embed })
                  }).catch(err => {
                    const embed = new Discord.MessageEmbed()
                    embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} ${lang.addperm} ${member}`)
                    embed.setColor(color)
                                 
                                embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                    if (logChannel) logChannel.send({ embed: embed })
                  })
        
        
        } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
        
          guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antirole`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} ${lang.addperm} ${member}`)
            embed.setColor(color)
                         
                        embed.setFooter(client.user.username, client.user.displayAvatarURL())          

            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} ${lang.addperm} ${member}`)
            embed.setColor(color)
                         
                        embed.setFooter(client.user.username, client.user.displayAvatarURL())          

            if (logChannel) logChannel.send({ embed: embed })
          })
        
        }
      }).catch(err => {})
  
  
  } else {
   if(maxt === true) {
    member.roles.remove(role, `Antirole`).then(() => {
      if(db.get(`sanction_${guild.id}`) === "ban") {
guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} ${lang.addrole} ${member}`)
                  embed.setColor(color)
                               
                              embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} ${lang.addrole} ${member}`)
                  embed.setColor(color)
                               
                              embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                  if (logChannel) logChannel.send({ embed: embed })
                })
      
      } else if(db.get(`sanction_${guild.id}`) === "kick") {
guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} ${lang.addrole} ${member}`)
                  embed.setColor(color)
                               
                              embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} ${lang.addrole} ${member}`)
                  embed.setColor(color)
                               
                              embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                  if (logChannel) logChannel.send({ embed: embed })
                })
      
      
      } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
      
        guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antirole`).then(te => {
          const embed = new Discord.MessageEmbed()
          embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} ${lang.addrole} ${member}`)
          embed.setColor(color)
                       
                      embed.setFooter(client.user.username, client.user.displayAvatarURL())          

          if (logChannel) logChannel.send({ embed: embed })
        }).catch(err => {
          const embed = new Discord.MessageEmbed()
          embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} ${lang.addrole} ${member}`)
          embed.setColor(color)
                       
                      embed.setFooter(client.user.username, client.user.displayAvatarURL())          

          if (logChannel) logChannel.send({ embed: embed })
        })
      
      }
    }).catch(err => {})
   } else {
  
  }
  
   
  }} else{}
  }
})
client.on("channelCreate", async (channel) => {
  if (!channel.guild) return

  let color = db.get(` ${process.env.owner}.color`) 
  if(color === null  ) color = process.env.color
  let guild = channel.guild
  if (!guild.me.hasPermission("ADMINISTRATOR")) return 
  let language;
if (db.get(`${guild.id}.language`) === undefined || db.get(`${guild.id}.language`) === null) {
    await db.set(`${guild.id}.language`, "fr")
    language = db.get(`${guild.id}.language`)
}
language = db.get(`${guild.id}.language`)
const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))
 let logChannel =  guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
 let Muted = await db.fetch(`mRole_${channel.guild.id}`);
 let muteRole = await channel.guild.roles.cache.get(Muted) || channel.guild.roles.cache.find(role => role.name === `muet`) || channel.guild.roles.cache.find(role => role.name === `Muted`) || channel.guild.roles.cache.find(role => role.name === `Mute`)
 if(muteRole )  {
 await channel.createOverwrite(muteRole, {
 SEND_channelS: false,
 CONNECT: false,
 ADD_REACTIONS: false
 }, `AutoConfig`)
 } else if( db.get(`channels_${guild.id}`) === true ) {
 const action = await guild.fetchAuditLogs({limit: 1, type: "CHANNEL_CREATE" }).then(async (audit) => audit.entries.first());
 if (action.executor.id === client.user.id) return;
 let perm = guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  || db.get(`wlmd_${guild.id}_${action.executor.id}`) === true 
 if (perm) {
   return
} else if (!perm) {
  if(db.get(`sanction_${guild.id}`) === "ban") {
guild.members.cache.get(action.executor.id).ban(`Antichannel`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logschannelc}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logschannelc}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  } else if(db.get(`sanction_${guild.id}`) === "kick") {
    guild.members.cache.get(action.executor.id).kick({
      reason: `Antichannel`
  }).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logschannelc}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logschannelc}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  
  } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
  
    guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antichannel`).then(te => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.logschannelc}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    }).catch(err => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.logschannelc}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    })
  
  }
  channel.delete(`Antichannel`)


} else {}
 } else  if( db.get(`channels_${guild.id}`) === true || "max") {
  const action = await guild.fetchAuditLogs({limit: 1, type: "CHANNEL_CREATE" }).then(async (audit) => audit.entries.first());
  if (action.executor.id === client.user.id) return;
  let perm =  guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  
  if (perm) {
    return
 } else if (!perm) {
   if(db.get(`sanction_${guild.id}`) === "ban") {
     guild.members.cache.get(action.executor.id).ban({
       reason: `Antichannel`
   }).then(te => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logschannelc}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             }).catch(err => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logschannelc}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             })
   
   } else if(db.get(`sanction_${guild.id}`) === "kick") {
     guild.members.cache.get(action.executor.id).kick({
       reason: `Antichannel`
   }).then(te => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logschannelc}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             }).catch(err => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logschannelc}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             })
   
   
   } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
   
     guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antichannel`).then(te => {
       const embed = new Discord.MessageEmbed()
       embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.logschannelc}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
       embed.setColor(color)
                    
                   embed.setFooter(client.user.username, client.user.displayAvatarURL())          

       if (logChannel) logChannel.send({ embed: embed })
     }).catch(err => {
       const embed = new Discord.MessageEmbed()
       embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.logschannelc}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
       embed.setColor(color)
                    
                   embed.setFooter(client.user.username, client.user.displayAvatarURL())          

       if (logChannel) logChannel.send({ embed: embed })
     })
   
   }
   channel.delete(`Antichannel`)
 
 
 } else {}
  } 
})
client.on("channelDelete", async (channel) => {
  let color = db.get(` ${process.env.owner}.color`) 
  if(color === null  ) color = process.env.color
  let guild = channel.guild
  if (!guild.me.hasPermission("ADMINISTRATOR")) return 
  let language;
if (db.get(`${guild.id}.language`) === undefined || db.get(`${guild.id}.language`) === null) {
    await db.set(`${guild.id}.language`, "fr")
    language = db.get(`${guild.id}.language`)
}
language = db.get(`${guild.id}.language`)
const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))
 let logChannel =  guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
 if( db.get(`channels_${guild.id}`) === true ) {
 const action = await guild.fetchAuditLogs({limit: 1, type: "CHANNEL_DELETE" }).then(async (audit) => audit.entries.first());
 if (action.executor.id === client.user.id) return;
 let  perm = guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  || db.get(`wlmd_${guild.id}_${action.executor.id}`) === true 
 if (perm) {
   return
} else if (!perm) {
  if(db.get(`sanction_${guild.id}`) === "ban") {
guild.members.cache.get(action.executor.id).ban(`Antichannel`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logschanneld} ${channel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logschanneld} ${channel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  } else if(db.get(`sanction_${guild.id}`) === "kick") {
    guild.members.cache.get(action.executor.id).kick({
      reason: `Antichannel`
  }).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logschanneld} ${channel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logschanneld} ${channel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  
  } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
  
    guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antichannel`).then(te => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.logschanneld} ${channel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    }).catch(err => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.logschanneld} ${channel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    })
  
  }
  try {
    await channel.clone({
        name: channel.name,
        permissions: channel.permissionsOverwrites,
        type: channel.type,
        topic: channel.withTopic,
        nsfw: channel.nsfw,
        birate: channel.bitrate,
        userLimit: channel.userLimit,
        rateLimitPerUser: channel.rateLimitPerUser,
        permissions: channel.withPermissions,
        position: channel.rawPosition,
        reason:  `Antichannel`  
    })
} catch (error) {
    return;
}

} else {}
 } else  if( db.get(`channels_${guild.id}`) ===  "max") {
  const action = await guild.fetchAuditLogs({limit: 1, type: "CHANNEL_DELETE" }).then(async (audit) => audit.entries.first());
  if (action.executor.id === client.user.id) return;
  let  perm =  guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  
  if (perm) {
    return
 } else if (!perm) {
   if(db.get(`sanction_${guild.id}`) === "ban") {
     guild.members.cache.get(action.executor.id).ban({
       reason: `Antichannel`
   }).then(te => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logschanneld} ${channel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             }).catch(err => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logschanneld} ${channel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             })
   
   } else if(db.get(`sanction_${guild.id}`) === "kick") {
     guild.members.cache.get(action.executor.id).kick({
       reason: `Antichannel`
   }).then(te => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logschanneld} ${channel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             }).catch(err => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logschanneld} ${channel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             })
   
   
   } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
   
     guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antichannel`).then(te => {
       const embed = new Discord.MessageEmbed()
       embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.logschanneld} ${channel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
       embed.setColor(color)
                    
                   embed.setFooter(client.user.username, client.user.displayAvatarURL())          

       if (logChannel) logChannel.send({ embed: embed })
     }).catch(err => {
       const embed = new Discord.MessageEmbed()
       embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.logschanneld} ${channel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
       embed.setColor(color)
                    
                   embed.setFooter(client.user.username, client.user.displayAvatarURL())          

       if (logChannel) logChannel.send({ embed: embed })
     })
   
   }
   try {
     await channel.clone({
         name: channel.name,
         permissions: channel.permissionsOverwrites,
         type: channel.type,
         topic: channel.withTopic,
         nsfw: channel.nsfw,
         birate: channel.bitrate,
         userLimit: channel.userLimit,
         rateLimitPerUser: channel.rateLimitPerUser,
         permissions: channel.withPermissions,
         position: channel.rawPosition,
         reason:  `Antichannel`  
     })
 } catch (error) {
     return;
 }
 
 } else {}
  }
})
client.on("channelUpdate", async (oldChannel, newChannel) => {
  if (oldChannel === newChannel) return

  let color = db.get(` ${process.env.owner}.color`) 
  if(color === null  ) color = process.env.color
  let guild = oldChannel.guild
  if (!guild.me.hasPermission("ADMINISTRATOR")) return 
  let language;
if (db.get(`${guild.id}.language`) === undefined || db.get(`${guild.id}.language`) === null) {
    await db.set(`${guild.id}.language`, "fr")
    language = db.get(`${guild.id}.language`)
}
language = db.get(`${guild.id}.language`)
const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))
 let logChannel =  guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
 if( db.get(`channels_${guild.id}`) === true) {
 const action = await guild.fetchAuditLogs({limit: 1, type: "CHANNEL_UPDATE" }).then(async (audit) => audit.entries.first());
 if (action.executor.id === client.user.id) return;
 let perm = guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  || db.get(`wlmd_${guild.id}_${action.executor.id}`) === true 
 if (perm) {
   return
} else if (!perm) {
  if(db.get(`sanction_${guild.id}`) === "ban") {
    guild.members.cache.get(action.executor.id).ban(`Antichannel`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  } else if(db.get(`sanction_${guild.id}`) === "kick") {
    guild.members.cache.get(action.executor.id).kick(`Antichannel`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  
  } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
  
    guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antichannel`).then(te => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    }).catch(err => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    })
  
  }
  try {
    newChannel.edit({
             name: oldChannel.name,
             permissions: oldChannel.permissionsOverwrites,
             type: oldChannel.type,
             topic: oldChannel.withTopic,
             nsfw: oldChannel.nsfw,
             bitrate: oldChannel.bitrate,
             userLimi: oldChannel.userLimit,
             rateLlimitPerUser: oldChannel.rateLimitPerUser,
             permissions: oldChannel.withPermissions,
             position: oldChannel.rawPosition,
             reason: `Antichannel`
           })
  
         } catch(err) {}

} else {}
 } else  if( db.get(`channels_${guild.id}`) === "max") {
  const action = await guild.fetchAuditLogs({limit: 1, type: "CHANNEL_UPDATE" }).then(async (audit) => audit.entries.first());
  if (action.executor.id === client.user.id) return;
  let  perm =  guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  
  if (perm) {
    return
 } else if (!perm) {
   if(db.get(`sanction_${guild.id}`) === "ban") {
    guild.members.cache.get(action.executor.id).ban(`Antichannel`).then(te => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             }).catch(err => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             })
   
   } else if(db.get(`sanction_${guild.id}`) === "kick") {
    guild.members.cache.get(action.executor.id).kick(`Antichannel`).then(te => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             }).catch(err => {
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             })
   
   
   } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
   
     guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antichannel`).then(te => {
       const embed = new Discord.MessageEmbed()
       embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
       embed.setColor(color)
                    
                   embed.setFooter(client.user.username, client.user.displayAvatarURL())          

       if (logChannel) logChannel.send({ embed: embed })
     }).catch(err => {
       const embed = new Discord.MessageEmbed()
       embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
       embed.setColor(color)
                    
                   embed.setFooter(client.user.username, client.user.displayAvatarURL())          

       if (logChannel) logChannel.send({ embed: embed })
     })
   
   }
   try {
     newChannel.edit({
              name: oldChannel.name,
              permissions: oldChannel.permissionsOverwrites,
              type: oldChannel.type,
              topic: oldChannel.withTopic,
              nsfw: oldChannel.nsfw,
              bitrate: oldChannel.bitrate,
              userLimi: oldChannel.userLimit,
              rateLlimitPerUser: oldChannel.rateLimitPerUser,
              permissions: oldChannel.withPermissions,
              position: oldChannel.rawPosition,
              reason: `Antichannel`
            })
   
          } catch(err) {}
 
 } else {}
  }
})
client.on("guildMemberAdd", async (member) => {
  let color = db.get(` ${process.env.owner}.color`) 
  if(color === null  ) color = process.env.color
  let logChannel =  member.guild.channels.cache.get(db.get(`${member.guild.id}.raidlog`))
  let logChannel2 =  member.guild.channels.cache.get(db.get(`${member.guild.id}.raidlog`))

if( db.get(`crealimit_${member.guild.id}`)) {
    const ms = require("ms");  
    const duration = ms(db.get(`crealimit_${member.guild.id}`).replace("j", "d"));
    let created = member.user.createdTimestamp;
    let sum = created + duration;
    let diff = Date.now() - sum;
  
if(diff < 0) {
  
    member.kick().then(() => {
      const embed = new Discord.MessageEmbed()
      .setColor(color)
        .setDescription(`${member} ${lang.crealogs}`)
      if (logChannel) logChannel.send(embed)
    }).catch(err => {})

 
    }

  } else if( db.get(`antitoken_${member.guild.id}`) === true) {
 
    let maxMembers = "10";
    let maxTime = "180000"; 
      let last10Members = guild.members.cache.filter(m => m.joinedAt <= (Date.now() - maxTime))  
    if(last10Members.size > maxMembers) return;
      console.log(last10Members.map(r => r.user.tag))
    last10Members.forEach(m => {
    m.kick({reason: "Anti token"}).then( () => {
      const embed = new Discord.MessageEmbed()
      .setColor(color)
    .setDescription(`${m} ${lang.antitokenlogs}`)
    if(logChannel) logChannel.send({ embed: embed }) 
 }).catch(err => {})
 })
    
  } else   if (member.user.bot) {
    if( db.get(`bot_${member.guild.id}`) === "max") {
      const action = await member.guild.fetchAuditLogs({limit: 1, type: "BOT_ADD" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm =  member.guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${member.guild.id}_${action.executor.id}`) === true  
      if (perm) {
       
       const constembed = new Discord.MessageEmbed()
       constembed.setDescription(`${action.executor} ${lang.antibotone} ${member} (${member.id})`)
       constembed.setColor(color)
                if (logChannel) logChannel.send({ embed: constembed }).then(async m => {
m.react("❌")
let collector = m.createReactionCollector((r, usere) => usere.id && !usere.bot);
collector.on("collect", async (r, usere) => {
  if(member.guild.owner.id == usere.id || process.env.owner == usere.id || db.get(`${usere.id}.ownermd`) === true ) {
    if(r.emoji.name === "❌") {
        member.kick()
        const embed = new Discord.MessageEmbed()
        embed.setDescription(`${lang.antibot2} ${member.username} ${lang.antibot3}`)
        embed.setColor(color)
                     
                    embed.setFooter(client.user.username, client.user.displayAvatarURL())          

        if (logChannel) logChannel.send({ embed: embed })
      } 
    }else {
      r.users.remove(usere.id)
    }
  
  })}).catch(err => {})
    
     } else if (!perm) {
       if(db.get(`sanction_${member.guild.id}`) === "ban") {
        member.guild.members.cache.get(action.executor.id).ban(`Antibot`).then(te => {
                   const embed = new Discord.MessageEmbed()
                   embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.botlog} ${member.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
                   embed.setColor(color)
                                
                               embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                   if (logChannel) logChannel.send({ embed: embed })
                 }).catch(err => {
                   const embed = new Discord.MessageEmbed()
                   embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.botlog} ${member.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
                   embed.setColor(color)
                                
                               embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                   if (logChannel) logChannel.send({ embed: embed })
                 })
       
       } else if(db.get(`sanction_${member.guild.id}`) === "kick") {
        member.guild.members.cache.get(action.executor.id).kick(`Antibot`).then(te => {
                   const embed = new Discord.MessageEmbed()
                   embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.botlog} ${member.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
                   embed.setColor(color)
                                
                               embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                   if (logChannel) logChannel.send({ embed: embed })
                 }).catch(err => {
                   const embed = new Discord.MessageEmbed()
                   embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.botlog} ${member.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
                   embed.setColor(color)
                                
                               embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                   if (logChannel) logChannel.send({ embed: embed })
                 })
       
       
       } else if(db.get(`sanction_${member.guild.id}`) === lang.derank || null) {
       
         member.guild.members.cache.get(action.executor.id).roles.remove(member.guild.members.cache.get(action.executor.id).roles.cache.array(), `Antibot`).then(te => {
           const embed = new Discord.MessageEmbed()
           embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.botlog} ${member.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
           embed.setColor(color)
                        
                       embed.setFooter(client.user.username, client.user.displayAvatarURL())          

           if (logChannel) logChannel.send({ embed: embed })
         }).catch(err => {
           const embed = new Discord.MessageEmbed()
           embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.botlog} ${member.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
           embed.setColor(color)
                        
                       embed.setFooter(client.user.username, client.user.displayAvatarURL())          

           if (logChannel) logChannel.send({ embed: embed })
         })
       
       }
       try {
       member.kick("Antibot")
              } catch(err) {}
     
     } else {}
      } else   if( db.get(`bot_${member.guild.id}`) === true) {
        const action = await member.guild.fetchAuditLogs({limit: 1, type: "BOT_ADD" }).then(async (audit) => audit.entries.first());
        if (action.executor.id === client.user.id) return;
        let perm = member.guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${member.guild.id}_${action.executor.id}`) === true  || db.get(`wlmd_${member.guild.id}_${action.executor.id}`) === true 
        if (perm) {
         
         const constembed = new Discord.MessageEmbed()
         constembed.setDescription(`${action.executor} vient d'inviter le bot ${member} (${member.id})`)
         constembed.setColor(color)
                  if (logChannel) logChannel.send({ embed: constembed }).then(async m => {
  m.react("❌")
  let collector = m.createReactionCollector((r, usere) => usere.id && !usere.bot);
  collector.on("collect", async (r, usere) => {
    if(member.guild.owner.id == usere.id || process.env.owner == usere.id || db.get(`${usere.id}.ownermd`) === true ) {
      if(r.emoji.name === "❌") {
          member.kick()
          const embed = new Discord.MessageEmbed()
          embed.setDescription(`Le bot ${member.username} a bien été ${lang.kicker}`)
          embed.setColor(color)
                       
                      embed.setFooter(client.user.username, client.user.displayAvatarURL())          

          if (logChannel) logChannel.send({ embed: embed })
        } 
      }else {
        r.users.remove(usere.id)
      }
    
    })}).catch(err => {})
      
       } else if (!perm) {
         if(db.get(`sanction_${member.guild.id}`) === "ban") {
          member.guild.members.cache.get(action.executor.id).ban(`Antibot`).then(te => {
                     const embed = new Discord.MessageEmbed()
                     embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.botlog} ${member.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
                     embed.setColor(color)
                                  
                                 embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                     if (logChannel) logChannel.send({ embed: embed })
                   }).catch(err => {
                     const embed = new Discord.MessageEmbed()
                     embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.botlog} ${member.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
                     embed.setColor(color)
                                  
                                 embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                     if (logChannel) logChannel.send({ embed: embed })
                   })
         
         } else if(db.get(`sanction_${member.guild.id}`) === "kick") {
          member.guild.members.cache.get(action.executor.id).kick(`Antibot`).then(te => {
                     const embed = new Discord.MessageEmbed()
                     embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.botlog} ${member.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
                     embed.setColor(color)
                                  
                                 embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                     if (logChannel) logChannel.send({ embed: embed })
                   }).catch(err => {
                     const embed = new Discord.MessageEmbed()
                     embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.botlog} ${member.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
                     embed.setColor(color)
                                  
                                 embed.setFooter(client.user.username, client.user.displayAvatarURL())          

                     if (logChannel) logChannel.send({ embed: embed })
                   })
         
         
         } else if(db.get(`sanction_${member.guild.id}`) === lang.derank || null) {
         
           member.guild.members.cache.get(action.executor.id).roles.remove(member.guild.members.cache.get(action.executor.id).roles.cache.array(), `Antibot`).then(te => {
             const embed = new Discord.MessageEmbed()
             embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.botlog} ${member.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
             embed.setColor(color)
                          
                         embed.setFooter(client.user.username, client.user.displayAvatarURL())          

             if (logChannel) logChannel.send({ embed: embed })
           }).catch(err => {
             const embed = new Discord.MessageEmbed()
             embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.botlog} ${member.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
             embed.setColor(color)
                          
                         embed.setFooter(client.user.username, client.user.displayAvatarURL())          

             if (logChannel) logChannel.send({ embed: embed })
           })
         
         }
         try {
         member.kick("Antibot")
                } catch(err) {}
       
       } else {}
        } else {}
  }
})
client.on("webhookUpdate", async (channel) => {
  let color = db.get(` ${process.env.owner}.color`) 
  if(color === null  ) color = process.env.color
  let guild = channel.guild
  if (!guild.me.hasPermission("ADMINISTRATOR")) return 
  let language;
if (db.get(`${guild.id}.language`) === undefined || db.get(`${guild.id}.language`) === null) {
    await db.set(`${guild.id}.language`, "fr")
    language = db.get(`${guild.id}.language`)
}
language = db.get(`${guild.id}.language`)
const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))
 let logChannel =  guild.channels.cache.get(db.get(`${guild.id}.raidlog`))

 if( db.get(`webhooks_${guild.id}`) === true ) {
  const action = await guild.fetchAuditLogs({limit: 1, type: "WEBHOOK_CREATE" }).then(async (audit) => audit.entries.first());
 if (action.executor.id === client.user.id) return;
 let perm = guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  || db.get(`wlmd_${guild.id}_${action.executor.id}`) === true 
 if (perm) {
   return
} else if (!perm) {
  if(db.get(`sanction_${guild.id}`) === "ban") {
    guild.members.cache.get(action.executor.id).ban(`Antiwebhook`).then(te => {
    const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
   channels.forEach(async channele => {
        await channele.clone({
            name: channele.name,
            permissions: channele.permissionsOverwrites,
            type: channele.type,
            topic: channele.withTopic,
            nsfw: channele.nsfw,
            birate: channele.bitrate,
            userLimit: channele.userLimit,
            rateLimitPerUser: channele.rateLimitPerUser,
            permissions: channele.withPermissions,
            position: channele.rawPosition,
            reason:  `Antiwebhook`  
        })
        .catch(err => {})
        channele.delete().catch(err => {})  })
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logswebhook}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
              channels.forEach(async channele => {
                   await channele.clone({
                       name: channele.name,
                       permissions: channele.permissionsOverwrites,
                       type: channele.type,
                       topic: channele.withTopic,
                       nsfw: channele.nsfw,
                       birate: channele.bitrate,
                       userLimit: channele.userLimit,
                       rateLimitPerUser: channele.rateLimitPerUser,
                       permissions: channele.withPermissions,
                       position: channele.rawPosition,
                       reason:  `Antiwebhook`  
                   })
                   .catch(err => {})
                   channele.delete().catch(err => {})  })
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logswebhook}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  } else if(db.get(`sanction_${guild.id}`) === "kick") {
    guild.members.cache.get(action.executor.id).kick(`Antiwebhook`).then(te => {
    const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
    channels.forEach(async channele => {
         await channele.clone({
             name: channele.name,
             permissions: channele.permissionsOverwrites,
             type: channele.type,
             topic: channele.withTopic,
             nsfw: channele.nsfw,
             birate: channele.bitrate,
             userLimit: channele.userLimit,
             rateLimitPerUser: channele.rateLimitPerUser,
             permissions: channele.withPermissions,
             position: channele.rawPosition,
             reason:  `Antiwebhook`  
         })
         .catch(err => {})
         channele.delete().catch(err => {})  })
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logswebhook}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
              channels.forEach(async channele => {
                   await channele.clone({
                       name: channele.name,
                       permissions: channele.permissionsOverwrites,
                       type: channele.type,
                       topic: channele.withTopic,
                       nsfw: channele.nsfw,
                       birate: channele.bitrate,
                       userLimit: channele.userLimit,
                       rateLimitPerUser: channele.rateLimitPerUser,
                       permissions: channele.withPermissions,
                       position: channele.rawPosition,
                       reason:  `Antiwebhook`  
                   })
                   .catch(err => {})
                   channele.delete().catch(err => {})  })
                                 const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logswebhook}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  
  } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
  
    guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antiwebhook`).then(te => {
      const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
      channels.forEach(async channele => {
           await channele.clone({
               name: channele.name,
               permissions: channele.permissionsOverwrites,
               type: channele.type,
               topic: channele.withTopic,
               nsfw: channele.nsfw,
               birate: channele.bitrate,
               userLimit: channele.userLimit,
               rateLimitPerUser: channele.rateLimitPerUser,
               permissions: channele.withPermissions,
               position: channele.rawPosition,
               reason:  `Antiwebhook`  
           })
           .catch(err => {})
           channele.delete().catch(err => {})  })
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.logswebhook}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    }).catch(err => {
      const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
      channels.forEach(async channele => {
           await channele.clone({
               name: channele.name,
               permissions: channele.permissionsOverwrites,
               type: channele.type,
               topic: channele.withTopic,
               nsfw: channele.nsfw,
               birate: channele.bitrate,
               userLimit: channele.userLimit,
               rateLimitPerUser: channele.rateLimitPerUser,
               permissions: channele.withPermissions,
               position: channele.rawPosition,
               reason:  `Antiwebhook`  
           })
           .catch(err => {})
           channele.delete().catch(err => {})  })
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.logswebhook}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    })
  
  }
  


} else {}
 } else  if( db.get(`webhooks_${guild.id}`) === "max") {
  const action = await guild.fetchAuditLogs({limit: 1, type: "WEBHOOK_CREATE" }).then(async (audit) => audit.entries.first());
  if (action.executor.id === client.user.id) return;
  let perm =  guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  
  if (perm) {
    return
 } else if (!perm) {
   if(db.get(`sanction_${guild.id}`) === "ban") {
    guild.members.cache.get(action.executor.id).ban(`Antiwebhook`).then(te => {
     const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
    channels.forEach(async channele => {
         await channele.clone({
             name: channele.name,
             permissions: channele.permissionsOverwrites,
             type: channele.type,
             topic: channele.withTopic,
             nsfw: channele.nsfw,
             birate: channele.bitrate,
             userLimit: channele.userLimit,
             rateLimitPerUser: channele.rateLimitPerUser,
             permissions: channele.withPermissions,
             position: channele.rawPosition,
             reason:  `Antiwebhook`  
         })
         .catch(err => {})
         channele.delete().catch(err => {})  })
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logswebhook}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             }).catch(err => {
              const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
              channels.forEach(async channele => {
                   await channele.clone({
                       name: channele.name,
                       permissions: channele.permissionsOverwrites,
                       type: channele.type,
                       topic: channele.withTopic,
                       nsfw: channele.nsfw,
                       birate: channele.bitrate,
                       userLimit: channele.userLimit,
                       rateLimitPerUser: channele.rateLimitPerUser,
                       permissions: channele.withPermissions,
                       position: channele.rawPosition,
                       reason:  `Antiwebhook`  
                   })
                   .catch(err => {})
                   channele.delete().catch(err => {})  })
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logswebhook}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             })
   
   } else if(db.get(`sanction_${guild.id}`) === "kick") {
    guild.members.cache.get(action.executor.id).kick(`Antiwebhook`).then(te => {
     const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
     channels.forEach(async channele => {
          await channele.clone({
              name: channele.name,
              permissions: channele.permissionsOverwrites,
              type: channele.type,
              topic: channele.withTopic,
              nsfw: channele.nsfw,
              birate: channele.bitrate,
              userLimit: channele.userLimit,
              rateLimitPerUser: channele.rateLimitPerUser,
              permissions: channele.withPermissions,
              position: channele.rawPosition,
              reason:  `Antiwebhook`  
          })
          .catch(err => {})
          channele.delete().catch(err => {})  })
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logswebhook}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             }).catch(err => {
              const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
              channels.forEach(async channele => {
                   await channele.clone({
                       name: channele.name,
                       permissions: channele.permissionsOverwrites,
                       type: channele.type,
                       topic: channele.withTopic,
                       nsfw: channele.nsfw,
                       birate: channele.bitrate,
                       userLimit: channele.userLimit,
                       rateLimitPerUser: channele.rateLimitPerUser,
                       permissions: channele.withPermissions,
                       position: channele.rawPosition,
                       reason:  `Antiwebhook`  
                   })
                   .catch(err => {})
                   channele.delete().catch(err => {})  })
               const embed = new Discord.MessageEmbed()
               embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logswebhook}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
               embed.setColor(color)
                            
                           embed.setFooter(client.user.username, client.user.displayAvatarURL())          

               if (logChannel) logChannel.send({ embed: embed })
             })
   
   
   } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
   
     guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antiwebhook`).then(te => {
       const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
       channels.forEach(async channele => {
            await channele.clone({
                name: channele.name,
                permissions: channele.permissionsOverwrites,
                type: channele.type,
                topic: channele.withTopic,
                nsfw: channele.nsfw,
                birate: channele.bitrate,
                userLimit: channele.userLimit,
                rateLimitPerUser: channele.rateLimitPerUser,
                permissions: channele.withPermissions,
                position: channele.rawPosition,
                reason:  `Antiwebhook`  
            })
            .catch(err => {})
            channele.delete().catch(err => {})  })
       const embed = new Discord.MessageEmbed()
       embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.logswebhook}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
       embed.setColor(color)
                    
                   embed.setFooter(client.user.username, client.user.displayAvatarURL())          

       if (logChannel) logChannel.send({ embed: embed })
     }).catch(err => {
      const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
      channels.forEach(async channele => {
           await channele.clone({
               name: channele.name,
               permissions: channele.permissionsOverwrites,
               type: channele.type,
               topic: channele.withTopic,
               nsfw: channele.nsfw,
               birate: channele.bitrate,
               userLimit: channele.userLimit,
               rateLimitPerUser: channele.rateLimitPerUser,
               permissions: channele.withPermissions,
               position: channele.rawPosition,
               reason:  `Antiwebhook`  
           })
           .catch(err => {})
           channele.delete().catch(err => {})  })
       const embed = new Discord.MessageEmbed()
       embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.logswebhook}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
       embed.setColor(color)
                    
                   embed.setFooter(client.user.username, client.user.displayAvatarURL())          

       if (logChannel) logChannel.send({ embed: embed })
     })
   
    }}
 }
})
client.on("guildBanAdd", async (guild, user) => {
  
  let color = db.get(` ${process.env.owner}.color`) 
  if(color === null  ) color = process.env.color
  if (!guild.me.hasPermission("ADMINISTRATOR")) return 
  let language;
if (db.get(`${guild.id}.language`) === undefined || db.get(`${guild.id}.language`) === null) {
    await db.set(`${guild.id}.language`, "fr")
    language = db.get(`${guild.id}.language`)
}
language = db.get(`${guild.id}.language`)
const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))
 let logChannel =  guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
 if( db.get(`massban_${guild.id}`) === true ) {
 const action = await guild.fetchAuditLogs({limit: 1, type: "MEMBER_BAN_ADD" }).then(async (audit) => audit.entries.first());
 if (action.executor.id === client.user.id) return;
let perm = guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  || db.get(`wlmd_${guild.id}_${action.executor.id}`) === true 
 if (perm) {
   return
} else if (!perm) {
  if(db.get(`sanction_${guild.id}`) === "ban") {
    guild.members.cache.get(action.executor.id).ban(`Antiban`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.baner} ${user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.baner} ${user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  } else if(db.get(`sanction_${guild.id}`) === "kick") {
    guild.members.cache.get(action.executor.id).kick(`Antiban`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.baner} ${user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.baner} ${user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  
  } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
  
    guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antiban`).then(te => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.baner} ${user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    }).catch(err => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.baner} ${user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    })
  
  }
  guild.members.unban(user, `Antiban`)


} else {}
 } else if( db.get(`massban_${guild.id}`) ===  "max") {
 
 const action = await guild.fetchAuditLogs({limit: 1, type: "MEMBER_BAN_ADD" }).then(async (audit) => audit.entries.first());
 if (action.executor.id === client.user.id) return;
let perm =  guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  
 if (perm) {
   return
} else if (!perm) {
  if(db.get(`sanction_${guild.id}`) === "ban") {
    guild.members.cache.get(action.executor.id).ban(`Antiban`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.baner} ${user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.baner} ${user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  } else if(db.get(`sanction_${guild.id}`) === "kick") {
    guild.members.cache.get(action.executor.id).kick(`Antiban`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.baner} ${user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.baner} ${user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  
  } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
  
    guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antiban`).then(te => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.baner} ${user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    }).catch(err => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.baner} ${user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    })
  
  }
  guild.members.unban(user, `Antiban`)

} else {}
 }
})
client.on("guildMemberRemove", async (member) => {
  let guild = member.guild
  let color = db.get(` ${process.env.owner}.color`) 
  if(color === null  ) color = process.env.color
  if (!guild.me.hasPermission("ADMINISTRATOR")) return 
  let language;
if (db.get(`${guild.id}.language`) === undefined || db.get(`${guild.id}.language`) === null) {
    await db.set(`${guild.id}.language`, "fr")
    language = db.get(`${guild.id}.language`)
}
language = db.get(`${guild.id}.language`)
const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))
 let logChannel =  guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
 if( db.get(`massban_${guild.id}`) === true ) {
 const action = await guild.fetchAuditLogs({limit: 1, type: "KICK_MEMBERS" }).then(async (audit) => audit.entries.first());
 if (action.executor.id === client.user.id) return;
let perm = guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  || db.get(`wlmd_${guild.id}_${action.executor.id}`) === true 
 if (perm) {
   return
} else if (!perm) {
  if(db.get(`sanction_${guild.id}`) === "ban") {
    guild.members.cache.get(action.executor.id).ban(`Antiban`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.kicker} ${member.user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.kicker} ${member.user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  } else if(db.get(`sanction_${guild.id}`) === "kick") {
    guild.members.cache.get(action.executor.id).kick(`Antiban`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.kicker} ${member.user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.kicker} ${member.user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  
  } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
  
    guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antiban`).then(te => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.kicker} ${member.user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    }).catch(err => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.kicker} ${member.user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    })
  
  }


} else {}
 } else if( db.get(`massban_${guild.id}`) ===  "max") {
 
 const action = await guild.fetchAuditLogs({limit: 1, type: "KICK_MEMBERS" }).then(async (audit) => audit.entries.first());
 if (action.executor.id === client.user.id) return;
let perm =  guild.owner.id == action.executor.id || process.env.owner.includes(action.executor.id) || db.get(`ownermd_${guild.id}_${action.executor.id}`) === true  
 if (perm) {
   return
} else if (!perm) {
  if(db.get(`sanction_${guild.id}`) === "ban") {
    guild.members.cache.get(action.executor.id).ban(`Antiban`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.kicker} ${member.user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.kicker} ${member.user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  } else if(db.get(`sanction_${guild.id}`) === "kick") {
    guild.members.cache.get(action.executor.id).kick(`Antiban`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.kicker} ${member.user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.kicker} ${member.user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
              embed.setColor(color)
                           
                          embed.setFooter(client.user.username, client.user.displayAvatarURL())          

              if (logChannel) logChannel.send({ embed: embed })
            })
  
  
  } else if(db.get(`sanction_${guild.id}`) === lang.derank || null) {
  
    guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Antiban`).then(te => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${action.executor} ${lang.logsyes} **${lang.derank}** ${lang.logsr} \`${lang.kicker} ${member.user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    }).catch(err => {
      const embed = new Discord.MessageEmbed()
      embed.setDescription(`${lang.logserror} **${lang.derank}** ${action.executor} ${lang.logsr} \`${lang.kicker} ${member.user.tag}\`\n${lang.le} <t:${Date.parse(new Date)/1000}>`)
      embed.setColor(color)
                   
                  embed.setFooter(client.user.username, client.user.displayAvatarURL())          

      if (logChannel) logChannel.send({ embed: embed })
    })
  
  }

} else {}
 }
})
} catch(err) {
  return 
}
client.login(process.env.token)
