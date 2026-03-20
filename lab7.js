// Завдання 1
/* 
Першим виконається big.js, тому що браузер завантажує 
та виконує скрипти в тому порядку, в якому вони вказані в html файлі
 */

// Завдання 2
// 1
var a = 2;
var x = 1 + (a *= 2); 
// Спочатку виконується a *= 2, тому що це в дужках, що робить a = 2 * 2 = 4, потім 1 + 4
console.log(x);

// 2
// if ("0") { alert('Привіт'); }
// Будь який непорожній рядок має значення true, тому alert виведеться

// 3
let name = "Василь";
let admin = name;
console.log(admin);

// Завдання 3
let allCounties = [];

async function getCounties() {
    const url = "https://api.census.gov/data/2020/acs/acs5/profile?get=NAME&for=county:*";
    try {
        const response = await fetch(url);
        const data = await response.json();
        allCounties = data.slice(1).map(item => ({
            name: item[0],
            state: item[1],
            county: item[2]
        }));

        console.log("Дані з API США успішно завантажені");
    } catch (error) {
        console.error("Помилка при завантаженні API:", error);
    }
}
getCounties();

// Пошук коду за назвою
function findCountyCode(targetName) {
    const found = allCounties.find(c => c.name === targetName);
    if (found) {
        return found.state + found.county;
    } else {
        return "Округ не знайдено";
    }
}

// Обробка натискання кнопки пошуку
document.getElementById('getBtn').onclick = function() {
    const inputName = document.getElementById('countyName').value;
    console.log("Ви ввели:", inputName);
    console.log("Кількість округів у базі:", allCounties.length);

    const result = findCountyCode(inputName);
    document.getElementById('displayCode').innerText = "код округу: " + result;
};

// Завдання 4
document.getElementById('mainForm').onsubmit = function(event) {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    if (!firstName || !lastName || !email) {
        event.preventDefault();
        alert("Заповніть всі поля")
    } else {
        alert("Дякуємо за реєстрацію, " + firstName + " " + lastName + "!");
    }
}

// Завдання 5
let currentPosition = 0;
const box = document.getElementById('elid');
document.getElementById('left').onclick = function() {
    currentPosition -= 100;
    box.style.transform = `translateX(${currentPosition}px)`;
}
document.getElementById('right').onclick = function() {
    currentPosition += 100;
    box.style.transform = `translateX(${currentPosition}px)`;
}