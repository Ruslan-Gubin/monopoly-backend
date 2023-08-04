import schedule from 'node-schedule';

// Функция, которая будет выполняться по расписанию
export function jobFunction() {
  console.log('Выполняю задачу по расписанию!');
}

// Создание расписания
const scheduleRule = new schedule.RecurrenceRule();
scheduleRule.second = 30; // Запуск каждую 30-ю секунду


// Создание задачи по расписанию
export const job = schedule.scheduleJob(scheduleRule, jobFunction);


console.log('Задача запланирована по расписанию!');
