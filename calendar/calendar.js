import { Modal } from "/components/modal.js";

// Подключение к базе
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
    remove,
    onValue
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDK2Fp1iUWzZNGOCk7xaFwxqPEbvcLYTKY",
    authDomain: "freemotion-calendar.firebaseapp.com",
    databaseURL: "https://freemotion-calendar-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "freemotion-calendar",
    storageBucket: "freemotion-calendar.firebasestorage.app",
    messagingSenderId: "58789404913",
    appId: "1:58789404913:web:0aa03ab906832e7f050950"
};

const app = initializeApp(firebaseConfig);
const dataBase = getDatabase(app);

// Загрузка настроек
const settings = await (await fetch("/data/calendar.json")).json();
const times = settings.times;
const closed = settings.closed;
const users = settings.users;

// Обозначения
const monthsName = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
const weekName = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

// Где создается таблица
const cardTables = document.querySelectorAll(".card-table");

// Генерация 30 дней
const today = new Date();

const days = Array.from({ length: 30 }, (_, i) => {
    const newDate = new Date(today);

    newDate.setDate(newDate.getDate() + i);

    return {
        date: newDate,
        dateDay: `${newDate.getDate()} ${monthsName[newDate.getMonth()]}`,
        weekDay: weekName[newDate.getDay()],
    };
});

// Деление на нужные недели
const weeks = [];

for (const d of days) {
    const newWeek = d.date.getDay() === 1;

    if (newWeek || weeks.length === 0) {
        weeks.push([]);
    }

    weeks[weeks.length - 1].push(d);
}

// Создание таблицы
cardTables.forEach((cardTable, hall) => {

    // Создание недель
    weeks.forEach((w) => {
        const div = document.createElement("div");

        div.className = "table-title weeks";
        div.style.gridColumn = `span ${w.length}`;
        div.textContent =
            w.length === 1
                ? w[0].dateDay
                : `с ${w[0].dateDay} по ${w[w.length - 1].dateDay}`;

        cardTable.appendChild(div);
    });

    // Создание дней
    days.forEach((d) => {
        const div = document.createElement("div");

        div.className = "table-title days";
        div.innerHTML = `
            <div>${d.weekDay}</div>
            <div style="font-size:12.5px">${d.dateDay}</div>
        `;

        cardTable.appendChild(div);
    });

    // Создание времени
    times.forEach((t) => {
        const div = document.createElement("div");

        div.className = "table-title times";
        div.textContent = t;

        cardTable.appendChild(div);

        // Создание ячеек
        days.forEach((d) => {
            const div = document.createElement("div");

            div.className = "open";

            div.dataset.day = d.dateDay;
            div.dataset.time = t;
            div.dataset.hall = hall + 1;

            const user = users.find(u =>
                u["Зал"]?.includes(Number(div.dataset.hall)) &&
                u["Дни"]?.includes(d.weekDay) &&
                u["Время"]?.includes(t)
            );

            if (user) {
                div.style.background = user["Цвет"];
                div.textContent = user["Педагог"];
                div.classList.replace("open", "locked");
            }

            cardTable.appendChild(div);
        });
    });
});

// Попап
const popup = document.querySelector(".popup");
const popupCard = document.querySelector(".popup-card");
const popupButton = document.querySelector(".popup-button");


// Нажатия на ячейки
document.addEventListener("click", async (e) => {

    // Нажал на свободную
    const openCell = e.target.closest(".open");
    if (openCell) {
        const activeCell = document.querySelector(".active-cell");

        // Нажатие туда же
        if (activeCell === openCell) {
            openCell.classList.remove("active-cell");
            popup.style.display = "none";
            return;
        }

        // Переключение
        if (activeCell) activeCell.classList.remove("active-cell");

        // Открытие попап
        openCell.classList.add("active-cell");
        popup.style.display = "flex";

        popupButton.innerHTML = "";

        popup.querySelector(".popup-title").innerHTML = `<b>Дата:</b> ${openCell.dataset.day}`;
        popup.querySelector(".popup-subtitle").innerHTML = `<b>Время:</b> ${openCell.dataset.time}`;

        // Создание кнопок педагогов
        users
            .filter(u => u["Педагог"] !== "Закрыто")
            .forEach((user, index, array) => {
                if (array.findIndex(u => u["Педагог"] === user["Педагог"]) !== index) return;

                const button = document.createElement("button");

                button.style.background = user["Цвет"];
                button.textContent = user["Педагог"];

                button.onclick = async () => {

                    await set(ref(dataBase, `closed/${user["Педагог"]}/${openCell.dataset.hall}/${openCell.dataset.day}_${openCell.dataset.time}`), true);

                    openCell.textContent = user["Педагог"];
                    openCell.style.background = closed;

                    popup.style.display = "none";
                    openCell.classList.replace("open", "closed");
                    openCell.classList.remove("active-cell");
                };

                popupButton.appendChild(button);
            });

        // Создание кнопки отмена
        const cancel = document.createElement("button");

        cancel.className = "button";
        cancel.textContent = "Отмена";

        cancel.onclick = () => {
            popup.style.display = "none";
            openCell.classList.remove("active-cell");
        };

        popupButton.appendChild(cancel);

        const rect = openCell.getBoundingClientRect();

        // Позиция popup
        popupCard.style.left =
            rect.left + window.scrollX +
            rect.width / 2 -
            popupCard.offsetWidth / 2 + "px";

        popupCard.style.top =
            rect.bottom + window.scrollY + 6 + "px";

        return;
    }

    // Нажал на занятую
    const closedCell = e.target.closest(".closed");
    if (closedCell) {
        const activeCell = document.querySelector(".active-cell");

        if (activeCell) {
            activeCell.classList.remove("active-cell");
        }

        popup.style.display = "none";


        // Появление модалки
        if (await Modal(
            `Удалить занятие "${closedCell.textContent}"?`,
            `Вы действительно хотите удалить "<b>${closedCell.dataset.day} в ${closedCell.dataset.time}</b>" ?`,
            "Да",
            "Нет"
        )) {
            await remove(ref(dataBase, `closed/${closedCell.textContent}/${closedCell.dataset.hall}/${closedCell.dataset.day}_${closedCell.dataset.time}`));
        }
    }
});

// Скачивание и обновление
onValue(ref(dataBase, "closed"), (snapshot) => {

    document.querySelectorAll(".closed").forEach(cell => {
        cell.classList.replace("closed", "open");
        cell.textContent = "";
        cell.style.background = "";
    });

    const data = snapshot.val();

    Object.entries(data).forEach(([teacher, halls]) => {

        Object.entries(halls).forEach(([hall, times]) => {

            Object.entries(times).forEach(([day_time]) => {

                const [day, time] = day_time.split("_");

                const cell = document.querySelector(
                    `[data-hall="${hall}"][data-day="${day}"][data-time="${time}"]`
                );

                if (!cell) return;

                cell.classList.replace("open", "closed");
                cell.textContent = teacher;
                cell.style.background = closed;
            });
        });
    });


    // Загрузчик
    const loader = document.getElementById("loader");
    setTimeout(() => {
        loader.style.display = "none";
    }, 2000);

});