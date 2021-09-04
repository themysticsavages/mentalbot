const Discord = require('discord.js')
const buttons = require('discord-buttons')
const chart = require('chart.js-image')
const cron = require('cron')
const fs = require('fs')

const bot = new Discord.Client()
buttons(bot)

let data = []

let user = ''
let userid = ''

function generateButtons(id1, id2, disabled=undefined) {
    const button1 = new buttons.MessageButton().setStyle('grey').setLabel('Yes').setID(id1)
    const button2 = new buttons.MessageButton().setStyle('grey').setLabel('No').setID(id2)

    if (disabled) { button1.setDisabled(); button2.setDisabled() }

    const row = new buttons.MessageActionRow().addComponents(button1, button2)
    return row
}

// easy graph generator
function generateGraph(val) {
    const lines = chart().chart({
        'type': 'line',
        'data': {
            'labels': [
                'Day 1',
                'Day 2',
                'Day 3',
                'Day 4',
                'Day 5',
            ],
            'datasets': [
                {
                    'label': 'Score',
                    'borderColor': 'rgb(255,+99,+132)',
                    'backgroundColor': 'rgba(255,+99,+132,+0.5)',
                    'data': [
                        val[0],
                        val[1],
                        val[2],
                        val[3],
                        val[4],
                    ]
                }
            ]
        },
        'options': {
            'title': {
                'display': true,
                'text': 'Mental status'
            }
        }
    }).backgroundColor('#404040').width('500').height('300')

    lines.toFile('./graph.png')
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

// finds users who are subscribed
function lookFor(dir) {
    var files = fs.readdirSync(dir)
    var vals = []
    files.forEach(file => {
        var json = JSON.parse(fs.readFileSync(`${dir}/${file}`, {encoding: 'utf-8'}))
        if (json['sub'] === true) vals.push(json['id'])
    })
    return vals
}

bot.on('ready', () => {
    console.log('Bot has started!')
    bot.user.setActivity('⠀', { type: 'WATCHING' });

    function sendAlert() {
        let users = lookFor('./db')

        users.forEach(user => bot.users.fetch(user, false).then(user => {
            const embed = new Discord.MessageEmbed()
                .setTitle('Alert!')
                .setDescription('Since you subscribed to receive alerts, this is just your daily reminder to run the `ask` command. If you run it at least 5 times, you will get a graph showing all your scores!')
                .setColor('BLURPLE')
                .setTimestamp()
            user.send(embed)
        }))
    }

    var job = new cron.CronJob('0 12 * * *', sendAlert)
    job.start()
})

bot.on('message', (message) => {
    if (message.content === '<@!880062178361769986>') { message.reply(`Hey there! My ping is ${bot.ws.ping} ms! If you need commands, type @myusername help`) }
    else if (message.content === '<@!880062178361769986> help') {
        const embed = new Discord.MessageEmbed()
            .setTitle('Help')
            .setDescription('Always use @myusername as the prefix!\n`help`, `ask`, `scrap`, `subscribe`, `scrap.sub`')
            .setColor('BLURPLE')
            .setTimestamp()
        message.reply(embed)
    } else if (message.content === '<@!880062178361769986> ask') {
        data = []

        user = message.author.tag
        userid = message.author.id

        const button1 = new buttons.MessageButton().setStyle('grey').setLabel('Of course').setID('button1')
        const button2 = new buttons.MessageButton().setStyle('grey').setLabel('No?').setID('button2')

        const row = new buttons.MessageActionRow().addComponents(button1, button2)
        message.author.send("Hello! Since you ran the command `ask`, I'm assuming that you want to answer questions regarding your mental health?", row)
    } else if (message.content === '<@!880062178361769986> scrap') {
        user = message.author.tag

        if (fs.existsSync(`./db/${user}.json`)) {
            message.author.send('Are you sure you want to remove the data you have entered? This also removes your subscription status.', generateButtons('buttonA', 'buttonB'))
        } else {
            message.author.send("You don't have any data created!")
        }
    } else if (message.content === '<@!880062178361769986> subscribe') {
        user = message.author.tag
        userid = message.author.id

        if (fs.existsSync(`./db/${user}.json`)) {
            message.author.send('Are you sure you want to subscribe to notifications?', generateButtons('buttonC', 'buttonD'))
        } else {
            let json = `{"id": "${userid}", "sub": false, "count": 1, "scores": [${generateResponse(data)}]}`
            fs.writeFileSync(`./db/${user}.json`, json)
            message.author.send('Are you sure you want to subscribe to notifications?', generateButtons('buttonC', 'buttonD'))
        }
    } else if (message.content === '<@!880062178361769986> scrap.sub') {
        user = message.author.tag

        if (fs.existsSync(`./db/${user}.json`)) {
            message.author.send('Are you sure you want to remove your subscription status? You can always subscribe again with `@myusername subscribe`', generateButtons('buttonE', 'buttonF'))
        } else {
            message.author.send("You don't have any data created!")
        }
    }
})

bot.on('clickButton', (button) => {
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
                button.channel.stopTyping();
                button.channel.send(`Alright! Your score is **${generateResponse(data)}** out of 10. Consider subscribing for alerts to run the \`ask\` command! Do this by running \`@myusername subscribe\`!`);
            }, 3000);

            if (fs.existsSync(`./db/${user}.json`) === true) {
                let cnt = JSON.parse(fs.readFileSync(`./db/${user}.json`, 'utf-8'))

                cnt['count']++
                cnt['scores'].push(generateResponse(data))

                fs.writeFileSync(`./db/${user}.json`, JSON.stringify(cnt))

                if (cnt['count'] === 5) {
                    generateGraph(cnt['scores'])
                    setTimeout(function(){button.channel.send('Here is a graph that contains the five times you have ran the `ask` command.', { files: ['./graph.png'] })}, 3000)
                    fs.rmSync(`./db/${user}.json`)
                }
            } else {
                let json = `{"id": "${userid}", "sub": false, "count": 1, "scores": [${generateResponse(data)}]}`
                fs.writeFileSync(`./db/${user}.json`, json)
            }

        })
    } else if (button.id === 'button12') {
        data.push(0)
        button.message.edit('Alright, that is all the data I need! I will now generate a score based on your inputs...', generateButtons('button11', 'button12', true)).then((message) => {
            setTimeout(function(){button.message.delete()}, 6000)
            button.channel.startTyping()
            setTimeout(function(){
                button.channel.stopTyping();
                button.channel.send(`Alright! Your score is **${generateResponse(data)}** out of 10. There's more to be added here, but I'm still in beta :neutral_face:`);
            }, 3000);

            if (fs.existsSync(`./db/${user}.json`) === true) {
                let cnt = JSON.parse(fs.readFileSync(`./db/${user}.json`, 'utf-8'))

                cnt['count']++
                cnt['scores'].push(generateResponse(data))

                fs.writeFileSync(`./db/${user}.json`, JSON.stringify(cnt))

                if (cnt['count'] === 5) {
                    generateGraph(cnt['scores'])
                    setTimeout(function(){button.channel.send('Here is a graph that contains the five times you have ran the `ask` command.', { files: ['./graph.png'] })}, 3000)
                    fs.rmSync(`./db/${user}.json`)
                }
            } else {
                let json = `{"id": "${userid}", "sub": false, "count": 1, "scores": [${generateResponse(data)}]}`
                fs.writeFileSync(`./db/${user}.json`, json)
            }

        })
    } else if (button.id === 'buttonA') {
        fs.rmSync(`./db/${user}.json`)
        button.message.edit('Your data was removed sucessfully!', generateButtons('buttonA', 'buttonB', true))

    } else if (button.id === 'buttonB') {
        button.message.edit('Ok then, have a nice day.', generateButtons('buttonA', 'buttonB', true))

    } else if (button.id === 'buttonC') {
        let cnt = JSON.parse(fs.readFileSync(`./db/${user}.json`, 'utf-8'))
        cnt['sub'] = true

        fs.writeFileSync(`./db/${user}.json`, JSON.stringify(cnt))
        button.message.edit('You are now subscribed! Expect notifications every day at noon.', generateButtons('buttonC', 'buttonD', true))

    } else if (button.id === 'buttonD') {
        button.message.edit('Never mind then, enjoy your day.', generateButtons('buttonC', 'buttonD', true))

    } else if (button.id === 'buttonE') {
        let cnt = JSON.parse(fs.readFileSync(`./db/${user}.json`, 'utf-8'))
        delete cnt['sub']

        fs.writeFileSync(`./db/${user}.json`, JSON.stringify(cnt))
        button.message.edit('Your subscription status has been removed sucessfully.', generateButtons('buttonE', 'buttonF', true))

    } else if (button.id === 'buttonF') {
        button.message.edit('Alright, hope you have a nice day.', generateButtons('buttonE', 'buttonF', true))

    }
    button.reply.defer()
})

bot.login(require('./config.js').token)
