document.addEventListener('DOMContentLoaded', () => {
    // Перевірка, чи є об'єкт Telegram WebApp
    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
        const tg = Telegram.WebApp;
        tg.ready(); // Повідомляємо Telegram, що Web App готовий до відображення
        tg.expand(); // Розгортаємо Web App на повну висоту

        // Встановлюємо колір хедера Web App (опціонально, можна підібрати)
        // tg.setHeaderColor(document.documentElement.style.getPropertyValue('--header-bg-color') || '#333333');
        console.log("Telegram Web App initialized.");

        // Обробник для кнопки "Зберегти" (WIP - Work In Progress)
        const saveDataBtn = document.getElementById('save-data-btn');
        if (saveDataBtn) {
            saveDataBtn.addEventListener('click', () => {
                const data = collectTableData();
                // TODO: Потрібно реалізувати збереження даних
                // Приклад відправки даних боту:
                // if (data.length > 0) {
                //     tg.sendData(JSON.stringify(data));
                //     // Можна показати повідомлення про успіх
                //     tg.showAlert('Дані відправлено (поки що без збереження)!');
                // } else {
                //     tg.showAlert('Немає даних для збереження.');
                // }
                 tg.showAlert('Функція збереження ще не реалізована.');
                 console.log("Collected data:", data);
            });
        }

        // Можна налаштувати головну кнопку Telegram (знизу) для збереження
        // tg.MainButton.setText("Зберегти щоденник");
        // tg.MainButton.show();
        // tg.MainButton.onClick(() => {
        //     const data = collectTableData();
        //     if (data.length > 0) {
        //          tg.sendData(JSON.stringify(data));
        //     } else {
        //          tg.showAlert('Немає даних для збереження.');
        //     }
        // });


    } else {
        console.warn("Telegram Web App script not found. Running in browser mode.");
        // Тут можна додати логіку для роботи поза Telegram, якщо потрібно
    }

    const tableBody = document.getElementById('training-table-body');
    const addExerciseBtn = document.getElementById('add-exercise-btn');

    // Лічильник для нумерації нових вправ
    let exerciseCounter = tableBody.rows.length;

    if (addExerciseBtn && tableBody) {
        addExerciseBtn.addEventListener('click', () => {
            exerciseCounter++;
            const newRow = tableBody.insertRow(); // Додаємо рядок в кінець таблиці
            newRow.classList.add('new-row'); // Можна додати клас для стилізації нових рядків

            // Визначаємо кількість стовпців на основі заголовка
            const headerRow = document.querySelector('thead tr:first-child');
            // Кількість колонок = № + Вправа + (Вага + Повт.) * К-сть підходів + Примітки
            // Приклад для 4 підходів: 1 + 1 + (2 * 4) + 1 = 11
            const numCols = 11; // Розрахуйте або визначте точно на основі вашої структури

            // 1. Колонка №
            const cellNum = newRow.insertCell();
            cellNum.textContent = exerciseCounter;
            cellNum.classList.add('sticky-col', 'sticky-col-1');

            // 2. Колонка Вправа
            const cellExercise = newRow.insertCell();
            cellExercise.contentEditable = true;
            cellExercise.classList.add('sticky-col', 'sticky-col-2');
            cellExercise.textContent = "Нова вправа"; // Початкове значення

            // 3. Колонки Вага/Повт для підходів (4 підходи * 2 колонки = 8)
            for (let i = 0; i < 8; i++) {
                const cell = newRow.insertCell();
                cell.contentEditable = true;
                 // Можна додати підказки
                 cell.setAttribute('placeholder', (i % 2 === 0) ? 'Вага' : 'Повт.');
            }

            // 4. Колонка Примітки
            const cellNotes = newRow.insertCell();
            cellNotes.contentEditable = true;

            // Прокрутка до нової вправи та фокус на ній
            cellExercise.focus();
            newRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            console.log(`Added new exercise row #${exerciseCounter}`);
        });
    } else {
        console.error("Could not find table body or add button.");
    }

    // Функція для збору даних з таблиці (приклад)
    function collectTableData() {
        const data = [];
        const rows = tableBody.rows;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const cells = row.cells;
            // Перевірка, чи є достатньо комірок
            if (cells.length < 11) continue; // Пропустити некоректні рядки

            const exerciseData = {
                num: cells[0].textContent.trim(),
                name: cells[1].textContent.trim(),
                approaches: [
                    { weight: cells[2].textContent.trim(), reps: cells[3].textContent.trim() },
                    { weight: cells[4].textContent.trim(), reps: cells[5].textContent.trim() },
                    { weight: cells[6].textContent.trim(), reps: cells[7].textContent.trim() },
                    { weight: cells[8].textContent.trim(), reps: cells[9].textContent.trim() }
                    // Додайте більше підходів, якщо потрібно
                ],
                notes: cells[10].textContent.trim()
            };
            data.push(exerciseData);
        }
        return data;
    }

     // TODO: Додати функцію завантаження даних при відкритті Web App
     // function loadData() { ... }
     // loadData();

}); // Кінець DOMContentLoaded

// Всередині обробника кнопки збереження:
const data = collectTableData();
if (data && data.length > 0) {
    // Перетворюємо масив об'єктів у JSON-рядок
    const jsonData = JSON.stringify(data);
    // Відправляємо дані боту
    tg.sendData(jsonData);
    // Можна ще показати сповіщення про успіх або закрити WebApp
    // tg.close();
} else {
    tg.showAlert('Немає даних для збереження.');
}

document.addEventListener('DOMContentLoaded', () => {
    // ... (код ініціалізації tg та інші змінні) ...

    const tableBody = document.getElementById('training-table-body');
    const addExerciseBtn = document.getElementById('add-exercise-btn');
    const saveDataBtn = document.getElementById('save-data-btn');
    const addDayBtn = document.getElementById('add-day-btn'); // Отримуємо нову кнопку

    // Лічильник для нумерації нових вправ В МЕЖАХ ОДНОГО ДНЯ
    let exerciseCounter = countExercisesSinceLastDate(); // Потрібно ініціалізувати правильно

    // Функція для підрахунку вправ з останньої дати (для коректної нумерації)
    function countExercisesSinceLastDate() {
        let count = 0;
        if (!tableBody) return 0;
        const rows = tableBody.rows;
        // Йдемо з кінця таблиці
        for (let i = rows.length - 1; i >= 0; i--) {
            if (rows[i].classList.contains('date-separator-row')) {
                break; // Зупиняємось, як тільки знайшли попередню дату
            }
            // Рахуємо тільки рядки, що не є роздільниками дати
            if (!rows[i].classList.contains('date-separator-row')) {
                 count++;
            }
        }
        // Нумерація починається з 1, тому додаємо 1 до кількості знайдених
        return count;
    }


    // Обробник для кнопки "Додати тренувальний день"
    if (addDayBtn && tableBody) {
        addDayBtn.addEventListener('click', () => {
            // 1. Отримуємо поточну дату і форматуємо її
            const today = new Date();
            // Форматуємо дату як ДД.ММ.РРРР (або інший зручний формат)
            // Примітка: getMonth() повертає 0-11, тому додаємо 1
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            const formattedDate = `${day}.${month}.${year}`;

            // Можна запитати користувача іншу дату, якщо потрібно:
            // const customDate = prompt("Введіть дату тренування:", formattedDate);
            // const displayDate = customDate || formattedDate; // Використовуємо введену або поточну

            const displayDate = formattedDate; // Поки використовуємо поточну

            // 2. Створюємо новий рядок-роздільник
            const newDayRow = tableBody.insertRow(); // Вставляємо в кінець таблиці
            newDayRow.classList.add('date-separator-row');

            // 3. Додаємо одну комірку, яка охоплює всю ширину таблиці
            const cell = newDayRow.insertCell();
            // Встановлюємо colspan рівним кількості колонок у таблиці (важливо!)
            // Порахуємо на основі першого ряду заголовків thead
             const headerCells = document.querySelectorAll('thead tr:last-child th');
             const totalColumns = headerCells.length + 1; // +1 бо в заголовку немає колонки №
            cell.colSpan = totalColumns; // У нас було 11 (№ + Вправа + 4*2 + Примітки) - перевір!
            cell.textContent = displayDate; // Встановлюємо текст дати

            // 4. Скидаємо лічильник вправ для нового дня
            exerciseCounter = 0;

            // 5. Прокручуємо до нового рядка
            newDayRow.scrollIntoView({ behavior: 'smooth', block: 'center' });

            console.log(`Added new training day separator: ${displayDate}`);
        });
    }

    // Обробник для кнопки "Додати вправу"
    if (addExerciseBtn && tableBody) {
        addExerciseBtn.addEventListener('click', () => {
            // Перевіряємо, чи є хоч один рядок (чи додали день)
             if (tableBody.rows.length === 0 || !tableBody.querySelector('.date-separator-row')) {
                  if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
                     Telegram.WebApp.showAlert('Спочатку додайте тренувальний день!');
                  } else {
                      alert('Спочатку додайте тренувальний день!');
                  }
                  return; // Не додаємо вправу, якщо немає дня
             }

            exerciseCounter++; // Збільшуємо лічильник для поточного дня
            const newRow = tableBody.insertRow(); // Додаємо рядок в кінець таблиці
            // ... (решта коду для створення комірок вправи ЯК БУЛО РАНІШЕ) ...
            // ТІЛЬКИ ЗМІНИТИ ПЕРШУ КОМІРКУ:
            // 1. Колонка №
            const cellNum = newRow.insertCell();
            cellNum.textContent = exerciseCounter; // Використовуємо лічильник дня
            cellNum.classList.add('sticky-col', 'sticky-col-1');

            // ... (код для комірки Вправа, Вага/Повт, Примітки - без змін) ...
            const cellExercise = newRow.insertCell();
            cellExercise.contentEditable = true;
            cellExercise.classList.add('sticky-col', 'sticky-col-2');
            cellExercise.textContent = "Нова вправа";

            for (let i = 0; i < 8; i++) {
                const cell = newRow.insertCell();
                cell.contentEditable = true;
                cell.setAttribute('placeholder', (i % 2 === 0) ? 'Вага' : 'Повт.');
            }
            const cellNotes = newRow.insertCell();
            cellNotes.contentEditable = true;


            // Прокрутка до нової вправи та фокус на ній
            cellExercise.focus();
            // newRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); // Можливо, не потрібно, якщо день вже видно

            console.log(`Added new exercise row #${exerciseCounter} for the current day`);
        });
    } else {
        console.error("Could not find table body or add buttons.");
    }

    // --- ВАЖЛИВЕ ПОПЕРЕДЖЕННЯ ---
    // Функція collectTableData() ПОТРЕБУЄ ЗНАЧНОЇ МОДИФІКАЦІЇ
    // для коректної роботи з рядками-датами.
    // Поточна версія збереже всі дані в один "плаский" список.
    function collectTableData() {
        console.warn("Функція collectTableData не оновлена для роботи з датами!");
        const data = [];
        let currentDayData = null; // Тут буде об'єкт для поточного дня

        const rows = tableBody.rows;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const cells = row.cells;

            // Перевіряємо, чи це рядок-роздільник дати
            if (row.classList.contains('date-separator-row')) {
                 // Якщо вже є дані за попередній день, зберігаємо їх (не потрібно тут, робимо в кінці)
                 // Створюємо новий об'єкт для цього дня
                 currentDayData = {
                     date: cells[0].textContent.trim(), // Отримуємо дату з комірки
                     exercises: [] // Створюємо порожній масив для вправ
                 };
                 data.push(currentDayData); // Додаємо об'єкт дня до загального масиву
                 console.log(`Found date separator: ${currentDayData.date}`);
            } else if (currentDayData && cells.length >= 11) {
                // Це рядок з вправою І ми вже знайшли рядок з датою
                const exerciseData = {
                    num: cells[0].textContent.trim(),
                    name: cells[1].textContent.trim(),
                    approaches: [
                        { weight: cells[2].textContent.trim(), reps: cells[3].textContent.trim() },
                        { weight: cells[4].textContent.trim(), reps: cells[5].textContent.trim() },
                        { weight: cells[6].textContent.trim(), reps: cells[7].textContent.trim() },
                        { weight: cells[8].textContent.trim(), reps: cells[9].textContent.trim() }
                    ],
                    notes: cells[10].textContent.trim()
                };
                 // Додаємо вправу до поточного дня
                 currentDayData.exercises.push(exerciseData);
            } else {
                 // Пропускаємо рядок, якщо він не є датою і ми ще не зустріли дату,
                 // або якщо в ньому неправильна кількість комірок
                 console.log("Skipping row:", row);
            }
        }
         console.log("Final collected data structure:", data);
        return data; // Повертає масив об'єктів днів
    }


    // ... (решта коду, включаючи tg.MainButton.onClick, якщо використовується) ...
     // ОНОВЛЕННЯ для кнопки Зберегти (якщо вона використовується замість MainButton)
     if (saveDataBtn) {
         saveDataBtn.addEventListener('click', () => {
             const data = collectTableData(); // Викликаємо оновлену функцію
             if (data && data.length > 0) {
                 const jsonData = JSON.stringify(data);
                 console.log("Sending data:", jsonData);
                 if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
                    Telegram.WebApp.sendData(jsonData);
                    Telegram.WebApp.showAlert('Дані відправлено!');
                 } else {
                    alert('Дані для відправки (див. консоль): ' + jsonData);
                 }

             } else {
                  if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
                     Telegram.WebApp.showAlert('Немає даних для збереження.');
                  } else {
                     alert('Немає даних для збереження.');
                  }
             }
         });
     }


}); // Кінець DOMContentLoaded
