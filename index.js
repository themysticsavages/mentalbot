const Discord = require('discord.js')
const buttons = require('discord-buttons')

const bot = new Discord.Client()
let data = []
buttons(bot)

bot.on('ready', () => {
    console.log('Bot has started!')
    bot.user.setActivity('⠀', { type: 'WATCHING' });
})

bot.on('message', (message) => {
    if (message.content === '<@!879002654045511691>') { message.reply(`Hey there! My ping is ${bot.ws.ping} ms! If you need commands, type @myusername help`) }
    else if (message.content === '<@!879002654045511691> help') {
        const embed = new Discord.MessageEmbed()
            .setTitle('Help')
            .setDescription('Always use @myusername as the prefix!\n`help`, `ask`')
        message.reply(embed)
    } else if (message.content === '<@!879002654045511691> ask') {
        data = []
        const button1 = new buttons.MessageButton().setStyle('grey').setLabel('Of course').setID('button1')
        const button2 = new buttons.MessageButton().setStyle('grey').setLabel('No?').setID('button2')

        const row = new buttons.MessageActionRow().addComponents(button1, button2)
        message.author.send("Hello! Since you ran the command `ask`, I'm assuming that you want to answer questions regarding your mental health?", row)
    }
})

bot.on('clickButton', (button) => {
    // reduce lines
    function generateButtons(id1, id2, disabled=undefined) {
        const button1 = new buttons.MessageButton().setStyle('grey').setLabel('Yes').setID(id1)
        const button2 = new buttons.MessageButton().setStyle('grey').setLabel('No').setID(id2)
        
        if (disabled) { button1.setDisabled(); button2.setDisabled() }

        const row = new buttons.MessageActionRow().addComponents(button1, button2)
        return row
    }
    // weird array iterating thing that generates score out of 10 (whole numbers)
    function generateResponse(array) {
       var res = 10
       if (array[0] === 1) res=res-1
       if (array[1] === 1) res=res-2
       if (array[2] === 1) res=res-1
       if (array[3] === 1) res=res-2
       if (array[4] === 1) res=res-2
       return res
    }
    // custom buttons so no generateButtons function is here
    if (button.id === 'button1') {
        const button1 = new buttons.MessageButton().setStyle('grey').setLabel('Of course').setID('button1').setDisabled()
        const button2 = new buttons.MessageButton().setStyle('grey').setLabel('No?').setID('button2').setDisabled()
        
        const row = new buttons.MessageActionRow().addComponents(button1, button2)
        button.message.edit('Alright then! Let us continue. \n**Please know that information here is kept private.**\n**In addition, please answer these questions honestly!**', row).then((message) => {
            setTimeout(function(){button.message.delete()}, 6000)
            button.channel.startTyping()
            setTimeout(function(){
                message.channel.stopTyping();
                message.channel.send('Question 1/5: Do you feel sad about something?', generateButtons('button3', 'button4'));
            }, 7000);
        })
    } else if (button.id === 'button2') {
        const button1 = new buttons.MessageButton().setStyle('grey').setLabel('Of course').setID('button1').setDisabled()
        const button2 = new buttons.MessageButton().setStyle('grey').setLabel('No?').setID('button2').setDisabled()
        
        const row = new buttons.MessageActionRow().addComponents(button1, button2)
        button.message.edit('Ok. Have a good day!', row)
    } else if (button.id === 'button3') {
        data.push(1)
        button.message.edit('Question 2/5: Are you demotivated to do anything you loved doing before?', generateButtons('button4', 'button5'))
    } else if (button.id === 'button4') {
        data.push(0)
        button.message.edit('Question 2/5: Are you demotivated to do anything you loved doing before?', generateButtons('button5', 'button6'))
    } else if (button.id === 'button5') {
        data.push(1)
        button.message.edit('Question 3/5: Are you traumatized by any current or previous event?', generateButtons('button7', 'button8'))
    } else if (button.id === 'button6') {
        data.push(0)
        button.message.edit('Question 3/5: Are you traumatized by any current or previous event?', generateButtons('button7', 'button8'))
    } else if (button.id === 'button7') {
        data.push(1)
        button.message.edit('Question 4/5: Have you felt nervous, anxious, or off-edge before or now?', generateButtons('button9', 'button10'))
    } else if (button.id === 'button8') {
        data.push(0)
        button.message.edit('Question 4/5: Have you felt nervous, anxious, or off-edge before or now?', generateButtons('button9', 'button10'))
    } else if (button.id === 'button9') {
        data.push(1)
        button.message.edit('Question 5/5: Have you ever felt irritable or restless?', generateButtons('button11', 'button12'))
    } else if (button.id === 'button10') {
        data.push(0)
        button.message.edit('Question 5/5: Have you ever felt irritable or restless?', generateButtons('button11', 'button12'))
    } else if (button.id === 'button11') {
        data.push(1)
        button.message.edit('Alright, that is all the data I need! I will now generate a score based on your inputs...', generateButtons('button11', 'button12', true)).then((message) => {
            setTimeout(function(){button.message.delete()}, 6000)
            button.channel.startTyping()
            setTimeout(function(){
                message.channel.stopTyping();
                message.channel.send(`Alright! Your score is **${generateResponse(data)}** out of 10. There's more to be added here, but I'm still in beta :neutral_face:`);
            }, 3000);
        })
    } else if (button.id === 'button12') {
        data.push(0)
        button.message.edit('Alright, that is all the data I need! I will now generate a score based on your inputs...', generateButtons('button11', 'button12', true)).then((message) => {
            setTimeout(function(){button.message.delete()}, 6000)
            button.channel.startTyping()
            setTimeout(function(){
                message.channel.stopTyping();
                message.channel.send(`Alright! Your score is **${generateResponse(data)}** out of 10. There's more to be added here, but I'm still in beta :neutral_face:`);
            }, 3000);
        })
    }
    button.reply.defer()
    console.log(data)
})

bot.login(require('./config.js').token)