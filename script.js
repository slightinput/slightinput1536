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