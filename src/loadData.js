const electron = require("electron");
const appendElement = require("./modules/loadTable.js");
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
    const ul = document.querySelector('ul');
    appendElement("li", ul, `Value: ${total.value}`);
    appendElement("li", ul, `Invested: ${total.invested}`);
    appendElement("li", ul, `$ Profit: ${total.$profit}`);
    appendElement("li", ul, `% Profit: ${total.percent_profit}`);
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
})