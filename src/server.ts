import schedule from 'node-schedule'
import dotenv from 'dotenv'

import {rulesBot} from './config/ruleSchedule'
import Bot from './bot'
dotenv.config()

const bot = new Bot()

bot.execute()

schedule.scheduleJob(rulesBot, () => {
    const users = bot.getUsers()
    bot.schedule(users)
});

// schedule.scheduleJob('1/2 * * * * *', () => {
//     const users = bot.getUsers()
//     bot.schedule(users)
// });
