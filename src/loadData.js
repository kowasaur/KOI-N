const electron = require("electron");
const appendElement = require("./modules/loadTable.js");
require('chart.js')
const ipc = electron.ipcRenderer;

// Modified from: https://www.youtube.com/watch?v=H5vFcVdm57U
/**
 * Sorts a HTML table
 * 
 * @param {HTMLTableElement} table The table to sort
 * @param {number} column The index of the column to sort
 * @param {boolean} asc Determines if the sorting will  be in ascending order
 */
function sortTableByColumn(table, column, asc = false) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));

    // Sort each row
    const sortedRows = rows.sort((a, b) => {
        const aColText = Number(a.querySelector(`td:nth-child(${column + 1})`).dataset.number)
        const bColText = Number(b.querySelector(`td:nth-child(${column + 1})`).dataset.number)
        
        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    })

    // Remove all existing TRs from the table
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // Re-add the newly sorted rows
    tBody.append(...sortedRows);

    // Remember how the column is currently sorted
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"))
    table.querySelector(`th:nth-child(${column + 1}`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${column + 1}`).classList.toggle("th-sort-desc", !asc);
}

document.addEventListener("DOMContentLoaded",  () => ipc.send("mainWindowLoaded"));

ipc.on("totalGenerated", (evt, total) => {
    const div = document.querySelector('#portfolio');
    appendElement("div", div, `Invested: ${total.invested}`);
    appendElement("h1", div, total.value);
    const profit = appendElement("div", div)
    profit.id = 'profit'
    console.log(total.positive);
    if (total.positive) {
        plus = '+'
        className = 'positive'
    } else {
        plus = ''
        className = 'negative'
    }
    appendElement("div", profit, plus + total.$profit, undefined, undefined, className);
    appendElement("div", profit, plus + total.percent_profit, undefined, undefined, className);
})

ipc.on("portfolioGenerated", (evt, portfolio) => {
    const tbody = document.querySelector('tbody')
    for (let i = 0; i < portfolio.length; i++) {
        const row = appendElement("tr", tbody)
        const currency = portfolio[i];

        appendElement("td", row, `<div><img width=30 src="${currency.image}""><div>${currency.coin}</div></div>`, 'number', currency.coin_number)
        appendElement("td", row, currency.amount, 'number', currency.amount_number)
        appendElement("td", row, currency.value, 'number', currency.value_number)
        appendElement("td", row, currency.invested, 'number', currency.invested_number)
        appendElement("td", row, currency.$profit, 'number', currency.$profit_number, 
            currency.$profit_number < 0 ? 'negative'
                : currency.$profit_number > 0 ? 'positive'
                : undefined
        )
        appendElement("td", row, currency.percent_profit, 'number', currency.percent_profit_number, 
            currency.percent_profit_number < 0 ? 'negative'
                : currency.percent_profit_number > 0 ? 'positive'
                : undefined
        )
    }
    sortTableByColumn(document.querySelector("table"), 2)
    document.querySelectorAll("table th").forEach(headerCell => {
        headerCell.addEventListener("click", () => {
            const tableElement = headerCell.parentElement.parentElement.parentElement;
            const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
            const currentIsAscending = headerCell.classList.contains("th-sort-asc");
    
            sortTableByColumn(tableElement, headerIndex, !currentIsAscending)
        })
    })

    // Pi Chart
    const allValues = Array.from(tbody.querySelectorAll("tr"))
        .sort((a, b) => {
        const aColText = Number(a.querySelector(`td:nth-child(3)`).dataset.number)
        const bColText = Number(b.querySelector(`td:nth-child(3)`).dataset.number)
        
        return aColText > bColText ? -1 : 1;
        }).map(tr => { return {
            label: tr.querySelector('td:nth-child(1)').lastElementChild.lastElementChild.textContent,
            value: Number(tr.querySelector(`td:nth-child(3)`).dataset.number)
        }});
    let highestValues = allValues.slice(0, 10)
    highestValues.push({
        label: 'Other',
        value: allValues.slice(10).map(coin => coin.value).reduce((a, b) => a + b)
    })
    const totalValue = highestValues.map(coin => coin.value).reduce((a,b) => a + b)

    const pieChart = document.getElementById("pieChart").getContext('2d');
    new Chart(pieChart, {
        type: 'pie',
        data: {
            labels: highestValues.map(coin => coin.label),
            datasets: [{
                data: highestValues.map(coin => coin.value),
                backgroundColor: ['rgba(214, 0, 0, 0.86)', 'rgba(214, 107, 0)', 'rgb(214, 214, 0)', 'rgb(107, 214, 0)', 'rgb(0, 214, 107)', 'rgba(0, 214, 214, 0.9)', 'rgb(0, 107, 214)', 'rgba(0, 0, 214, 0.8)', 'rgba(107, 0, 214, 0.9)', 'rgba(214, 0, 214, 0.9)', 'rgba(140, 140, 140, 0.5)'],
                borderWidth: 3,
                borderColor: '#002635'
            }]
        },
        options: {
            tooltips: {
                callbacks: {
                    label: (tooltipItem, data) => {
                        let label = data.labels[tooltipItem.index] || '';
                        if (label) {
                            label += ': '
                        }
                        label += (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] / totalValue * 100).toFixed(2) + '%'
                        return label
                    }
                }
            },
            legend: {
                display: false
            },
            aspectRatio: 1,
            responsive: false
        }
    })
})