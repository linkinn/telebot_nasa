import schedule from 'node-schedule'

export const rulesBot = new schedule.RecurrenceRule();
rulesBot.dayOfWeek = [1, 2, 3, 4, 5, 6];
rulesBot.hour = 7;
rulesBot.minute = 0;
