let sorted = [];
async function getData() {
    try {
        const data = await fetch("https://api.census.gov/data/2020/acs/acs5/profile?get=NAME&for=county:*")
            .then(response => response.json())
            .then(json => json.slice(1))
        sorted = data.map(item => ({
            name: item[0],
            state: item[1],
            county: item[2]
        }))
    } catch (error) {
        console.error("Помилка при завантаженні API:", error);
    }
}
getData();
function getByName(name) {
    const found = sorted.find(c => c.name === name);
    if (found) {
        return `Назва: ${found.name} код штату: ${found.state} код міста: ${found.county}`
    } else {
        return "Немає такого міста"
    }
}
getByName('Baldwin County, Alabama');

document.getElementById('searchBtn').onclick = function () {
    const input = document.getElementById('search').value;
    let info = getByName(input);
    if (sorted.length === 0) {
        document.getElementById('result').innerText = "Зачекайте, дані ще завантажуються...";
        return;
    }
    document.getElementById('result').innerText = info;
}

