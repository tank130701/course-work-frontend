export const boardsData = [
  {
    id: 'work',
    title: "Работа",
    boards: [
      {
        id: 1,
        title: "To do",
        items: [
          { id: 1, title: 'Код Ревью', description: 'Проверить новые PRs'},
          { id: 2, title: 'Выкинуть мусор', description: 'Взять мусорные пакеты из-под раковины'}
        ]
      },
      {
        id: 2,
        title: "In Progress",
        items: [
          { id: 3, title: 'Код Ревью', description: 'Оставить комментарии'},
          { id: 4, title: 'Выкинуть мусор', description: 'Не забыть разделить перерабатываемые отходы'}
        ]
      },
      {
        id: 3,
        title: "Complete",
        items: [
          { id: 5, title: 'Код Ревью', description: 'Все задачи проверены'},
          { id: 6, title: 'Выкинуть мусор', description: 'Мусор успешно выкинут'}
        ]
      }
    ]
  },
  {
    id: 'study',
    title: "Учеба",
    boards: [
      {
        id: 4,
        title: "To Do",
        items: [
          { id: 7, title: 'Математика', description: 'Решить задачи по алгебре'},
          { id: 8, title: 'История', description: 'Прочитать главу о древней Греции'}
        ]
      },
      {
        id: 5,
        title: "In Progress",
        items: [
          { id: 9, title: 'Физика', description: 'Закончить лабораторную работу'},
          { id: 10, title: 'Литература', description: 'Написать сочинение по "Войне и миру"'}
        ]
      },
      {
        id: 6,
        title: "Done",
        items: [
          { id: 11, title: 'Химия', description: 'Запомнить таблицу Менделеева'},
          { id: 12, title: 'Биология', description: 'Сдать тест по генетике'}
        ]
      }
    ]
  },
  {
    id: 'personal',
    title: "Личное",
    boards: [
      {
        id: 7,
        title: "To Do",
        items: [
          { id: 13, title: 'Покупки', description: 'Купить продукты на неделю'},
          { id: 14, title: 'Уборка', description: 'Генеральная уборка в квартире'}
        ]
      },
      {
        id: 8,
        title: "In Progress",
        items: [
          { id: 15, title: 'Чтение', description: 'Прочитать новую книгу'},
          { id: 16, title: 'Рисование', description: 'Закончить начатую картину'}
        ]
      },
      {
        id: 9,
        title: "Done",
        items: [
          { id: 17, title: 'Фитнес', description: 'Закончить месячный курс тренировок'},
          { id: 18, title: 'Путешествие', description: 'Спланировать поездку на лето'}
        ]
      }
    ]
  }
];
