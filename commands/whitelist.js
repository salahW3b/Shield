const Discord = require("discord.js");
const db = require("quick.db");

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)})}
module.exports = {
    name: 'whitelist',
    aliases: ["wl"],
    run: async (client, message, args, lang, color, prefix) => {
        if (message.guild.ownerID === message.author.id || process.env.owner.includes(message.author.id) || db.get(`ownermd_${message.guild.id}_${message.author.id}`) === true) {

        if (args[0] === 'add') {
            if(!args[1]) return message.channel.send(`${lang.precis} (\`add (${lang.memb})\`, \`remove (${lang.memb})\`, \`list\`, \`clear\`)`)

            let member = message.guild.member(message.author.id);
            if (args[1]) {
                member = message.guild.member(args[1]);
            } else {
                return  message.channel.send(`${lang.nouser}`)
            }
            if (message.mentions.members.first()) {
                member = message.guild.member(message.mentions.members.first().id);
            }
    
            if (!member)  return message.channel.send(`${lang.nouser}`)
    
            if (db.get(`wlmd_${message.guild.id}_${member.user.id}`) === true) return message.channel.send(`${member.user.tag} ${lang.yeswl}`)
    
            db.add(`${message.guild.id}.wlcount`,1)
            db.push(`${message.guild.id}.wl`,  member.user.id)
            db.set(`wlmd_${message.guild.id}_${member.user.id}`, true)
                message.channel.send(`${member.user.tag} ${lang.addwl}`)
        
            
         } else if (args[0] === "clear") {
            message.channel.send(`${db.get(`${message.guild.id}.wlcount`)} ${db.get(`${message.guild.id}.wlcount`) > 1 ?  lang.wlclear1 : lang.wlclear2}`)
            db.delete(`${message.guild.id}.wlcount`)
            db.delete(`${message.guild.id}.wl`)
            let tt = await db.all().filter(data => data.ID.startsWith(`wlmd_${message.guild.id}`));
            let ttt = 0;
            for(let i = 0; i < tt.length; i++) {
              db.delete(tt[i].ID);
              ttt++;
            }   
        } else if (args[0] === "remove") {
            if(!args[1]) return message.channel.send(`${lang.precis} (\`add (${lang.memb})\`, \`remove (${lang.memb})\`, \`list\`, \`clear\`)`)

            let member = message.guild.member(message.author.id);
            if (args[1]) {
                member = message.guild.member(args[1]);
            } else {
                return message.channel.send(`${lang.nouser}`)
            }
            if (message.mentions.members.first()) {
                member = message.guild.member(message.mentions.members.first().id);
            }
    
            if (!member) return message.channel.send(`${lang.nouser}`)
    
            if (db.get(`wlmd_${message.guild.id}_${member.user.id}`) === null)  return message.channel.send(`${member.user.tag} ${lang.nowl}`)
    
            db.subtract(`${message.guild.id}.wlcount`,1)
            db.set(`${message.guild.id}.wl`,  db.get(`${message.guild.id}.wl`).filter(s => s !== member.user.id))
            db.set(`wlmd_${message.guild.id}_${member.user.id}`, null)
                message.channel.send(`${member.user.tag} ${lang.removewl}`)
            
          
        }else if (args[0] === "list") {
            try {
                let tdata = await message.channel.send(lang.chargement)
                let own = db.get(`${message.guild.id}.wl`) 
                let ownc = db.get(`${message.guild.id}.wlcount`) 
        
                let p0 = 0;
                let p1 = 15;
                let page = 1;
    
                let embed = new Discord.MessageEmbed()
    
    
                embed.setTitle(`${lang.listwl} - (${ownc || 0})`)
                .setColor(color)
                .setDescription(!own  ? "Aucune donnée trouvée":own
                    .filter(x => message.guild.members.cache.get(x))
                    .map(r => r)
                    .map((user, i) => `${i + 1} - ${message.guild.members.cache.get(user).user.tag} (${user})`)
                    .slice(0, 15)
                    )
                    .setFooter(`${page}/${Math.ceil(ownc || 1 / 15)} • ${client.user.username}`, client.user.displayAvatarURL())
                               
                let reac1
                let reac2
                let reac3
    
                if (ownc > 15) {
                 
                    reac1 = await tdata.react("◀");
                    await sleep(250);
                    reac2 = await tdata.react("❌");
                    await sleep(250);
                    reac3 = await tdata.react("▶");
                    await sleep(250);
                }
    
                tdata.edit(" ", embed);
    
                const data_res = tdata.createReactionCollector((reaction, user) => user.id === message.author.id);
    
                data_res.on("collect", async (reaction) => {
    
                    if (reaction.emoji.name === "◀") {
    
                        p0 = p0 - 15;
                        p1 = p1 - 15;
                        page = page - 1
    
                        if (p0 < 0) {
                            return
                        }
                        if (p0 === undefined || p1 === undefined) {
                            return
                        }
    
    
                        embed.setDescription(own
                            .filter(x => message.guild.members.cache.get(x))
                            .map(r => r)
                            .map((user, i) => `${i + 1} - ${message.guild.members.cache.get(user).user.tag} (${user})`)                                                  .slice(p0, p1)
                            )
                            .setFooter(`${page}/${Math.ceil(ownc / 15)} • ${client.user.username}`, client.user.displayAvatarURL())
                        tdata.edit(embed);
    
                    }
    
                    if (reaction.emoji.name === "▶") {
    
                        p0 = p0 + 15;
                        p1 = p1 + 15;
    
                        page++;
    
                        if (p1 > ownc + 15) {
                            return
                        }
                        if (p0 === undefined || p1 === undefined) {
                            return
                        }
    
    
                        embed.setDescription(own
                            .filter(x => message.guild.members.cache.get(x))
                            .map(r => r)
                            .map((user, i) => `${i + 1} - ${message.guild.members.cache.get(user).user.tag} (${user})`)                        .slice(p0, p1)
                            )
                            .setFooter(`${page}/${Math.ceil(ownc / 15)} • ${client.user.username}`, client.user.displayAvatarURL())
                        tdata.edit(embed);
    
                    }
    
                    if (reaction.emoji.name === "❌") {
                        data_res.stop()
                        reac1.remove()
                        reac2.remove()
                        return reac3.remove()
                    }
    
                    await reaction.users.remove(message.author.id);
    
                })
    
            } catch (error) {
                console.log(error)
            }
            
            } else {
              return message.channel.send(`${lang.precis} (\`add (${lang.memb})\`, \`remove (${lang.memb})\`, \`list\`, \`clear\`)`)
    
            } } else {
                return message.channel.send(lang.permowners);
            }
       
    }
}