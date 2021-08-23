const Discord = require('discord.js')
const buttons = require('discord-buttons')

const bot = new Discord.Client()
buttons(bot)

bot.on('message', (message) => {
    if (message.content === '<@!879002654045511691>') { message.reply(`Hey there! My ping is ${bot.ws.ping} ms! If you need commands, type @myusername help`) }
    else if (message.content === '<@!879002654045511691> help') {
        const embed = new Discord.MessageEmbed()
            .setTitle('Help')
            .setDescription('Always use @myusername as the prefix!\n`help`, `ask`')
        message.reply(embed)
    } else if (message.content === '<@!879002654045511691> ask') {
        const button1 = new buttons.MessageButton().setStyle('grey').setLabel('Of course').setID('button1')
        const button2 = new buttons.MessageButton().setStyle('grey').setLabel('No?').setID('button2')

        const row = new buttons.MessageActionRow().addComponents(button1, button2)
        message.author.send("Hello! Since you ran the command `ask`, I'm assuming that you want to answer questions regarding your mental health?", row)
    }
})

bot.on('clickButton', (button) => {
    if (button.id === 'button1') {
        const button1 = new buttons.MessageButton().setStyle('grey').setLabel('Of course').setID('button1').setDisabled()
        const button2 = new buttons.MessageButton().setStyle('grey').setLabel('No?').setID('button2').setDisabled()
        
        const row = new buttons.MessageActionRow().addComponents(button1, button2)
        button.message.edit('Alright then! Let us continue.', row).then((message) => {
            setTimeout(function(){button.message.delete()}, 1000)
            button.channel.startTyping()
            setTimeout(function(){
                message.channel.stopTyping();
                message.channel.send('Question 1:');
            }, 1000);
        })
    } else if (button.id === 'button2') {
        const button1 = new buttons.MessageButton().setStyle('grey').setLabel('Of course').setID('button1').setDisabled()
        const button2 = new buttons.MessageButton().setStyle('grey').setLabel('No?').setID('button2').setDisabled()
        
        const row = new buttons.MessageActionRow().addComponents(button1, button2)
        button.message.edit('Ok. Have a good day!', row)
    }
    button.reply.defer()
})

bot.login('ODc5MDAyNjU0MDQ1NTExNjkx.YSJZAw.sDNu-sthKlD1njrn0-RbE6S1d3A')