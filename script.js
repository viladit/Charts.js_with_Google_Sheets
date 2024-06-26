// URL к вашему CSV файлу из Google Sheets
const csvUrl = 'YOUR CSV LINK';

let chart;

async function loadCsvData(url) {
    const response = await fetch(url);
    const data = await response.text();
    return data;
}

function processCsvData(csv) {
    const lines = csv.split('\n');
    const labels = [];
    const datasets = [];
    const dataMap = {};

    const headers = lines[0].split(',');
    headers.shift(); // Удаляем первый элемент (даты)

    headers.forEach(header => {
        dataMap[header] = [];
    });

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        labels.push(row[0]); // Даты
        row.shift();

        row.forEach((value, index) => {
            dataMap[headers[index]].push(parseFloat(value));
        });
    }

    headers.forEach(header => {
        datasets.push({
            label: header,
            data: dataMap[header],
            borderColor: randomColor(),
            fill: false,
            hidden: true
        });
    });

    renderChart(labels, datasets);
}

// Colors
function randomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
}

function renderChart(labels, datasets) {
    const ctx = document.getElementById('myChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Данные из Google Sheets (CSV)'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Дата'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Значения'
                    }
                }
            }
        }
    });
}

function updateData() {
    loadCsvData(csvUrl).then(processCsvData).catch(error => {
        console.error('Error: ' + error.message);
    });
}

updateData();

setInterval(updateData, 60000);

function toggleDataset(datasetIndex) {
    const isHidden = chart.data.datasets[datasetIndex].hidden;
    chart.data.datasets[datasetIndex].hidden = !isHidden;
    chart.update();
}