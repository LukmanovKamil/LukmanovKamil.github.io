import { Modal } from "/components/modal.js";

// Подключение к базе
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getDatabase,
    ref,
    get,
    set,
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAv5iE_xKvPzG1sf0JEBAo5s2LtoNb2XUM",
    authDomain: "freemotion-abonements.firebaseapp.com",
    databaseURL: "https://freemotion-abonements-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "freemotion-abonements",
    storageBucket: "freemotion-abonements.firebasestorage.app",
    messagingSenderId: "967163271611",
    appId: "1:967163271611:web:aee8834c923d2f2fcdcc9e"
};

const app = initializeApp(firebaseConfig);
const dataBase = getDatabase(app);

// Загрузка настроек
const users = await (await fetch("/data/abonements.json")).json();

// Запись в local
const getUser = () => localStorage.getItem("loggedInUser");
const setUser = name => localStorage.setItem("loggedInUser", name);
const clearUser = () => {
    localStorage.removeItem("loggedInUser");
    location.replace("/login/index.html");
};

// Проверка перенаправления
const loginPage = () =>
    location.pathname === "/" ||
    location.pathname.endsWith("/login/index.html");

const currentUser = getUser();
const user = users.find(u => u.Логин === currentUser);

if (loginPage() && currentUser) {
    location.href = "/abonements/index.html";
} else if (!loginPage() && !currentUser) {
    location.replace("/login/index.html");
}

// Проверка входа
if (loginPage()) {
    const form = document.querySelector("form");
    form.addEventListener("submit", e => {
        e.preventDefault();
        const login = document.querySelector(".login").value.trim();
        const password = document.querySelector(".password").value;
        const user = users.find(u => u.Логин === login && u.Пароль === password);
        if (user) {
            setUser(user.Логин);
            location.href = "/abonements/index.html";
        } else {
            document.querySelector(".error").classList.add("show");
        }
    });

    //Исчезновение ошибки
    document.addEventListener("input", (e) => {
        if (e.target.matches(".login, .password")) {
            document.querySelector(".error").classList.remove("show");
        }
    });
};

// Логика для main
if (!loginPage() && currentUser) {
    if (user) {
        document.querySelector(".user-name").textContent = user.Логин;
        document.querySelector(".user-info").innerHTML = `Направление «<b>${user.Направление}</b>» `;
        document.querySelector(".user img").src = user.Фото;
    } else {
        clearUser();
    }
}

// Выход из аккаунта
document.querySelectorAll(".logout").forEach(log =>
    log.addEventListener("click", async () => {
        if (await Modal(
            "Выход из системы",
            "Вы действительно хотите выйти?",
            "Да",
            "Нет"
        )) {
            clearUser();
        }
    })
);

// Возращение подсказки на именах
document.addEventListener("input", e => {
    const cardTitle = e.target.closest(".card-title");
    if (cardTitle && cardTitle.textContent.trim() === "") {
        cardTitle.textContent = "";
    }

    const fio = e.target.closest(".fio");
    if (fio && fio.textContent.trim() === "") {
        fio.textContent = "";
    }
});

// Клик повсей ячейки дат
document.addEventListener("click", (e) => {
    const input = e.target.closest('input[type="date"]');
    if (input && typeof input.showPicker === "function") {
        input.showPicker();
    }
});

// Установка времени
const today = document.querySelector(".results-subtitle");
if (today) {
    today.textContent = new Date().toLocaleDateString("ru-RU", { dateStyle: "long" });
}

// Перемещение блока итогов
function motionRight() {
    const main = document.querySelector("main");
    const mainRight = document.querySelector(".main-right");
    if (!main || !mainRight) return;

    const offset = 30;
    const scrollPercentThreshold = 0.99;

    let targetTop = 0;
    let currentTop = 0;

    function updateTarget() {
        const rightHeight = mainRight.offsetHeight;
        const windowHeight = window.innerHeight;
        const parentRect = main.getBoundingClientRect();

        const scrollY = window.scrollY || window.pageYOffset;
        const pageHeight = document.documentElement.scrollHeight - windowHeight;

        const scrollThreshold = pageHeight * scrollPercentThreshold;

        if (scrollY < scrollThreshold) {
            targetTop = offset;
            return;
        }

        if (parentRect.bottom - rightHeight - offset < 0) {
            targetTop = main.offsetHeight - rightHeight;
        } else {
            targetTop = -parentRect.top + offset;

            if (targetTop < 0) targetTop = 0;

            const maxTop = windowHeight - rightHeight - offset;
            if (targetTop > maxTop) targetTop = maxTop;
        }
    }

    function animate() {
        const diff = targetTop - currentTop;
        currentTop += diff * 0.05;

        mainRight.style.top = currentTop + "px";

        requestAnimationFrame(animate);
    }

    window.addEventListener("scroll", updateTarget);
    window.addEventListener("resize", updateTarget);

    updateTarget();
    animate();
}
motionRight();

// Настройка цветов для дат
function colorDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    document.querySelectorAll('input[type="date"]').forEach(input => {
        if (!input.value) {
            input.style.color = "";
            input.style.backgroundColor = "";
            return;
        }

        const date = new Date(input.value);
        date.setHours(0, 0, 0, 0);

        if (date.getTime() === today.getTime()) {
            input.style.color = "orange";
            input.style.backgroundColor = "#fff6cc";
        } else if (date < today) {
            input.style.color = "red";
            input.style.backgroundColor = "#ffe0e0";
        } else {
            input.style.color = "green";
            input.style.backgroundColor = "#e6ffe6";
        }
    });
}

// Ограничения цифр и подсветка осталось при изменении
document.addEventListener("input", e => {
    if (e.target.type !== "number") return;
    const input = e.target;

    let v = input.value;
    v = v.replace(/\D/g, "");
    v = v.replace(/^0+/, "");
    if (v.length > 4) v = v.slice(0, 4);
    input.value = v;

    if (input.closest('.number1') || input.closest('.number2')) {
        const row = input.closest('.table-item');
        const number3 = row.querySelector('.number3 input');
        if (number3) {
            number3.classList.add("highlight");
            setTimeout(() => number3.classList.remove("highlight"), 300);
        }
    }

    calcNumber();
    calcSum();
    calcTotal();
});

// Подсчет осталось
function calcNumber() {
    document.querySelectorAll(".table-item").forEach(item => {
        const number1 = item.querySelector(".number1 input");
        const number2 = item.querySelector(".number2 input");
        const number3 = item.querySelector(".number3 input");

        const c = Number(number1.value);
        let o = Number(number2.value);

        if (o > c) {
            o = c;
            number2.value = c || "";
        }

        if (number1.value === "" && number2.value === "") {
            number3.value = "";
            return;
        }

        number3.value = c - o;
        number3.style.opacity = 1;
    });
}

// Подсчет сумм в карточке
function calcSum() {
    const n = v => parseFloat(v) || 0;

    document.querySelectorAll(".main-left .card").forEach(card => {
        const items = card.querySelectorAll(".table-item");
        let sum = [0, 0, 0, 0, 0];

        items.forEach(item => {
            sum[0] += n(item.querySelector(".number1 input")?.value);
            sum[1] += n(item.querySelector(".number2 input")?.value);
            sum[2] += n(item.querySelector(".number3 input")?.value);
            sum[3] += n(item.querySelector(".number4 input")?.value);
            sum[4] += n(item.querySelector(".number5 input")?.value);
        });

        const tableSum = card.querySelector(".table-sum");

        const cells = [
            tableSum.querySelector(".sum-number1"),
            tableSum.querySelector(".sum-number2"),
            tableSum.querySelector(".sum-number3"),
            tableSum.querySelector(".sum-number4"),
            tableSum.querySelector(".sum-number5")
        ];

        cells.forEach((cell, i) => {
            if (cell) cell.textContent = sum[i] ? sum[i] + " ₽" : "";
        });
    });
}

// Подсчет правой части
function calcTotal() {
    const n = v => parseFloat(v) || 0;

    let total = {
        учеников: document.querySelectorAll(".table-item").length,
        стоимость: 0,
        оплачено: 0,
        осталось: 0,
        расходы: 0,
        доход: 0,
        сДолгом: 0,
        долг: 0,

        налог: 0,
        аренда: user.Аренда,
        ремонт: user.Ремонт,
        арендаРемонт: 0,
        роялти: 0,
        управляющий: 0,
        роялтиУправляющий: 0
    };

    document.querySelectorAll(".table-item").forEach(item => {
        total.стоимость += n(item.querySelector(".number1 input")?.value);
        total.оплачено += n(item.querySelector(".number2 input")?.value);
        total.осталось += n(item.querySelector(".number3 input")?.value);
        total.долг += n(item.querySelector(".number4 input")?.value);
    });

    total.налог = Math.round(total.оплачено * 0.04);
    total.арендаРемонт = n(user.Аренда) + n(user.Ремонт);
    total.роялти = total.учеников * user.Абонемент * 0.05;
    total.управляющий = total.учеников * user.Абонемент * 0.05;
    total.роялтиУправляющий = total.роялти + total.управляющий;
    total.расходы = total.налог + total.арендаРемонт + total.роялтиУправляющий;
    total.сДолгом = total.стоимость + total.долг - total.расходы;
    total.доход = total.стоимость - total.расходы;

    document.querySelector(".results-number1").textContent = total.учеников;
    document.querySelector(".results-number2").textContent = total.стоимость + " ₽";
    document.querySelector(".results-number3").textContent = total.оплачено + " ₽";
    document.querySelector(".results-number4").textContent = total.осталось + " ₽";
    document.querySelector(".results-number5").textContent = total.расходы + " ₽";
    document.querySelector(".results-number6").textContent = total.доход + " ₽";
    document.querySelector(".results-number7").textContent = total.сДолгом + " ₽";
    document.querySelector(".results-number8").textContent = total.долг + " ₽";

    document.querySelector(".expenses-number1").textContent = total.налог + " ₽";
    document.querySelector(".expenses-number2").textContent = total.аренда + " ₽";
    document.querySelector(".expenses-number3").textContent = total.ремонт + " ₽";
    document.querySelector(".expenses-number4").textContent = total.арендаРемонт + " ₽";
    document.querySelector(".expenses-number5").textContent = total.роялти + " ₽";
    document.querySelector(".expenses-number6").textContent = total.управляющий + " ₽";
    document.querySelector(".expenses-number7").textContent = total.роялтиУправляющий + " ₽";
}

// Создание ученика в карточке
function createItem(card, idItem, item = {}) {
    const cardTable = card.querySelector(".card-table");
    const tableSum = cardTable.querySelector(".table-sum");

    const tableItem = document.createElement("div");
    tableItem.className = "table-item";
    tableItem.dataset.idItem = idItem;

    tableItem.innerHTML = `
        <div class="number">${idItem}</div>
        <div class="fio" contenteditable="true" data-placeholder="Введите имя">${item.fio || ''}</div>
        <div class="date1"><input type="date" required value="${item.date1 || ''}"></div>
        <div class="number1"><input type="number" inputmode="numeric" required placeholder="" value="${item.number1 ?? ''}"></div>
        <div class="number2"><input type="number" inputmode="numeric" required placeholder="" value="${item.number2 ?? ''}"></div>
        <div class="number3"><input type="number" inputmode="numeric" required placeholder="" value="" readonly></div>
        <div class="date2"><input type="date" required value="${item.date2 || ''}"></div>
        <div class="number4"><input type="number" inputmode="numeric" required placeholder="" value="${item.number4 ?? ''}"></div>
        <div class="date3"><input type="date" required value="${item.date3 || ''}"></div>
        <div class="number5"><input type="number" inputmode="numeric" required placeholder="" value="${item.number5 ?? ''}"></div>
        <button class="button del-stu">✖</button>
    `;

    tableSum.before(tableItem);

    return tableItem;
}

// Нажатие на кнопку создание ученика
document.addEventListener("click", e => {
    if (!e.target.classList.contains("add-stu")) return;

    const card = e.target.closest(".card");
    const idItem = card.querySelectorAll(".table-item").length + 1;

    const row = createItem(card, idItem);

    saveRow(row, user)
    calcTotal();
});

// Создание группы
function createCard(idCard, idItem) {
    const mainLeft = document.querySelector(".main-left");

    const card = document.createElement("div");
    card.className = "card";
    card.dataset.idCard = idCard;

    card.innerHTML = `
            <div class="card-header">
                <div class="card-title" contenteditable="true" data-placeholder="Введите название"></div>
                <div>
                    <button class="button add-stu">＋Добавить ученика</button>
                    <button class="button del-gro">✖</button>
                </div>
            </div>
            <div class="card-scroll">
                <div class="card-table">
                    <div class="table-header">
                        <div>№</div>
                        <div>ФИО</div>
                        <div>Активен до</div>
                        <div>Стоимость</div>
                        <div>Оплачено</div>
                        <div>Осталось</div>
                        <div>Оплата до</div>
                        <div>Долг</div>
                        <div>Дата долга</div>
                        <div>Предоплата</div>
                        <div></div>
                    </div>
                    <div class="table-sum">
                        <div class="sum">Сумма:</div>
                        <div class="sum-number1">0 ₽</div>
                        <div class="sum-number2">0 ₽</div>
                        <div class="sum-number3">0 ₽</div>
                        <div></div>
                        <div class="sum-number4">0 ₽</div>
                        <div></div>
                        <div class="sum-number5">0 ₽</div>
                        <div></div>
                    </div>
                </div>
            </div>
        `;

    mainLeft.append(card);

    return card;
}

// Нажатие на кнопку создание группы
document.addEventListener("click", e => {
    if (!e.target.classList.contains("add-gro")) return;

    const mainLeft = document.querySelector(".main-left");
    const idCard = mainLeft.querySelectorAll(".card").length + 1;
    const card = createCard(idCard, 1);
    const idItem = card.querySelectorAll(".table-item").length + 1;

    createItem(card, idItem);
    saveCard(card, user);
    calcSum();
    calcTotal();
});

// Удаление ученика и обновление порядка номеров
document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("del-stu")) return;

    const row = e.target.closest(".table-item");
    const fio = row.querySelector(".fio").textContent.trim() || "без имени";
    const card = row.closest(".card");

    if (await Modal(
        "Удалить ученика?",
        `Вы действительно хотите удалить "<b>${fio}</b>"?`,
        "Да",
        "Нет"
    )) {
        row.remove();
        card.querySelectorAll(".table-item").forEach((row, index) => {
            row.querySelector(".number").textContent = index + 1;
            row.dataset.idItem = index + 1;
        });
        saveCard(card, user)
        calcSum();
        calcTotal();
    }
});

// Удаление группы
document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("del-gro")) return;

    const card = e.target.closest(".card");
    const cardTitle = card.querySelector(".card-title").textContent.trim() || "без названия";

    const mainLeft = document.querySelector(".main-left");
    const tableItems = card.querySelectorAll(".table-item");

    if (tableItems.length >= 1) {
        if (await Modal(
            "Удалить группу нельзя!",
            "Сначала удалите всех учеников из группы!",
            "Понятно"
        )) { }
    } else {
        if (await Modal(
            "Удалить группу?",
            `Вы действительно хотите удалить "<b>${cardTitle}</b>"?`,
            "Да",
            "Нет"
        )) {
            card.remove();
            mainLeft.querySelectorAll(".card").forEach((card, index) => {
                card.dataset.idCard = index + 1;
            });
            saveBase(user);
        }
    }
});

// Данные строки для базы
function rowData(row) {
    return {
        fio: row.querySelector(".fio")?.textContent.trim() || "",
        date1: row.querySelector(".date1 input")?.value || "",
        number1: row.querySelector(".number1 input")?.value || "",
        number2: row.querySelector(".number2 input")?.value || "",
        date2: row.querySelector(".date2 input")?.value || "",
        number4: row.querySelector(".number4 input")?.value || "",
        date3: row.querySelector(".date3 input")?.value || "",
        number5: row.querySelector(".number5 input")?.value || ""
    };
}

// Сохранение строки
async function saveRow(row, user) {
    if (!row) return;

    const idCard = row.closest(".card").dataset.idCard;
    if (!idCard) return;

    const idItem = row.dataset.idItem;

    await set(
        ref(dataBase, `${user.Логин}/${idCard}/${idItem}`),
        rowData(row)
    );
    saveTime();
}

// Сохранение карточки
async function saveCard(card, user) {
    const idCard = card.dataset.idCard;
    const rows = card.querySelectorAll(".table-item");

    const data = {
        title: card.querySelector(".card-title")?.innerText?.trim() || ""
    };

    rows.forEach(row => {
        data[row.dataset.idItem] = rowData(row);
    });

    await set(
        ref(dataBase, `${user.Логин}/${idCard}`),
        data
    );
    saveTime();
}

// Сохранение всей страницы
async function saveBase(user) {
    const cards = document.querySelectorAll(".card");

    const data = {};

    cards.forEach(card => {
        const idCard = card.dataset.idCard;
        if (!idCard) { return };

        const cardData = {
            title: card.querySelector(".card-title")?.innerText?.trim() || ""
        };

        const rows = card.querySelectorAll(".table-item");

        rows.forEach(row => {
            cardData[row.dataset.idItem] = rowData(row);
        });

        data[idCard] = cardData;
    });

    await set(ref(dataBase, `${user.Логин}`), data);
    saveTime();
}

// Сохранение группы при редактировании имени группы
document.addEventListener("focusout", e => {
    if (!e.target.classList.contains("card-title")) return;
    const card = e.target.closest(".card");
    saveCard(card, user);
});

// Сохранение ученика при редактировании имен учеников
document.addEventListener("focusout", e => {
    if (!e.target.classList.contains("fio")) return;
    const row = e.target.closest('.table-item');
    saveRow(row, user);
});

// Сохранение ученика при выборе даты
document.addEventListener('change', e => {
    if (!e.target.type === 'date') return;
    const row = e.target.closest('.table-item');
    saveRow(row, user);
    colorDate();
    e.target.blur();
});

// Сохранение ученика при изменении цифр
document.addEventListener("focusout", e => {
    if (e.target.type !== "number") return;
    const row = e.target.closest(".table-item");
    saveRow(row, user);
});

// Показ тамерера сколько прошло с сохранения
function saveTime() {
    const saveTime = document.querySelector(".expenses-subtitle");

    if (!saveTime.lastSave) {
        saveTime.lastSave = Date.now();
    }

    if (!saveTime.timer) {
        saveTime.timer = setInterval(() => {
            const diff = Math.floor((Date.now() - saveTime.lastSave) / 1000);

            if (diff < 60) {
                saveTime.textContent = `Сохранено ${diff} сек назад`;
            } else if (diff < 3600) {
                saveTime.textContent = `Сохранено ${Math.floor(diff / 60)} мин назад`;
            } else {
                saveTime.textContent = `Сохранено ${Math.floor(diff / 3600)} ч назад`;
            }
        }, 1000);
    }

    saveTime.lastSave = Date.now();
}

// Загрузка базы
async function loadBase() {
    const snapshot = await get(ref(dataBase, user.Логин));

    const data = snapshot.val();

    for (const idCard in data) {
        const cardData = data[idCard];

        const card = createCard(idCard);

        if (cardData.title) {
            const titleEl = card.querySelector(".card-title");
            titleEl.textContent = cardData.title;
        }

        for (const idItem in cardData) {
            if (idItem === "title") continue;

            const item = cardData[idItem];

            if (!item || typeof item !== "object") continue;

            createItem(card, idItem, item);
        }
    }

    colorDate();
    calcNumber();
    calcSum();
    calcTotal();

    // Загрузчик
    const loader = document.getElementById("loader");
    setTimeout(() => {
        loader.style.display = "none";
    }, 2000);
}

// Проверка входа и загрузка
if (user) {
    loadBase();
}