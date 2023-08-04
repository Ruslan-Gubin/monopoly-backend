import schedule from 'node-schedule';
export function jobFunction() {
    console.log('Выполняю задачу по расписанию!');
}
const scheduleRule = new schedule.RecurrenceRule();
scheduleRule.second = 30;
export const job = schedule.scheduleJob(scheduleRule, jobFunction);
console.log('Задача запланирована по расписанию!');
