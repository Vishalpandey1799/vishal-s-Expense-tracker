let body = document.querySelector("body");
let theme = document.querySelector(".dark-theme");
const addExpense = document.querySelector(".add_expense");
const expensedataFill = document.querySelector(".add_transaction");
const expenseArea = document.querySelector(".name");
const expenseDate = document.querySelector(".date");
const expenseAmount = document.querySelector(".amount");
const graph = document.querySelector(".graph");
const saveExpense = document.querySelector(".addexpense");
const canvasContainer = document.querySelector(".cancont");

let currency_symbol = "₹";

let total = 0;
let totalExpense = 0;
let current = 0;
const total_Balance = document.querySelector(".t_balance");
const curr_Balance = document.querySelector(".curr_balance");
const total_Expense = document.querySelector(".total_expense");
const add_Balance = document.querySelector(".add_balance");
const balance_Input = document.querySelector(".user_Income");
const searchExpense = document.querySelector(".search_expense");

let expensesByCategory = {};
let pieChart = null;
let detype = "pie";

let exchangeBtn = document.querySelector(".exchange_money");

let changebtn = document.querySelector(".donut");
let symbolbtn = document.querySelector(".symbol_btn");
let toconvert = document.querySelector(".to_exchange");

changebtn.addEventListener("click", () => {
    if (changebtn.textContent === "doughnut") {
        detype = changebtn.textContent;
        changebtn.textContent = "pie"
        pieChart.destroy();
        PieChart();
        updatePieChart()
    } else if (changebtn.textContent === "pie") {
        detype = changebtn.textContent;
        pieChart.destroy();
        PieChart();
        updatePieChart()
        changebtn.textContent = "doughnut"
    }
})

function PieChart() {
    const ctx = document.getElementById('expensePieChart').getContext('2d');
    pieChart = new Chart(ctx, {
        type: detype,
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#32CD32',
                    '#BA55D3'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                }
            }
        }
    });
}

function updatePieChart() {
    if (!pieChart) return;


    const newExpensesByCategory = {};
    const rows = alldata.querySelectorAll("tbody tr");

    rows.forEach(row => {
        const category = row.children[0].textContent.trim();
        const amountText = row.children[2].textContent;
        const amount = parseFloat(amountText.replace(/[^0-9.-]+/g, ""));

        if (category) {
            newExpensesByCategory[category] =
                (newExpensesByCategory[category] || 0) + amount;
        }
    });


    expensesByCategory = newExpensesByCategory;

    const labels = Object.keys(expensesByCategory);
    const data = Object.values(expensesByCategory);

    if (labels.length === 0) {

        canvasContainer.style.display = "none";
        pieChart.data.labels = [];
        pieChart.data.datasets[0].data = [];
    } else {

        canvasContainer.style.display = "flex";
        pieChart.data.labels = labels;
        pieChart.data.datasets[0].data = data;
    }

    pieChart.update();
}

document.addEventListener('DOMContentLoaded', PieChart);

add_Balance.addEventListener("click", (e) => {
    e.preventDefault();
    let balance = Number(balance_Input.value);
    if (balance < 1) {
        balance_Input.value = 1;
    } else {
        total += balance;
        current += balance;
        curr_Balance.style.color = "";
        total_Balance.innerHTML = ` ${currency_symbol} ${total}`;
        curr_Balance.innerHTML = `${currency_symbol} ${current}`;
    }
    balance_Input.value = "";
    balancehub.classList.remove("opacity");
});

theme.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    if (body.classList.contains("dark-theme")) {
        theme.textContent = "Light";
    } else {
        theme.textContent = "Dark";
    }
});

addExpense.addEventListener("click", () => {
    expensedataFill.classList.toggle("show");
});

const balancInput = document.querySelector(".add_Income");
const balancehub = document.querySelector(".input_balance");
balancInput.addEventListener("click", () => {
    balancehub.classList.toggle("opacity");
});

const alldata = document.querySelector(".data_table");
let download = document.querySelector(".downlaod_btn");

function expense(expenseData) {
    const databody = document.createElement("tbody");
    const datarow = document.createElement("tr");

    const nameData = document.createElement("td");
    nameData.textContent = expenseData.expenseArea;

    const dateData = document.createElement("td");
    dateData.textContent = expenseData.expenseDate;

    const amountData = document.createElement("td");
    amountData.innerHTML = ` ${currency_symbol} ${expenseData.expenseAmt.toFixed(2)}`;
    amountData.classList.add("expenses");

    const actionHolder = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("deletebutton");
    deleteBtn.textContent = "Delete";

    download.href = databody;
    download.download = "";

    actionHolder.append(deleteBtn);
    datarow.append(nameData, dateData, amountData, actionHolder);
    databody.append(datarow);
    alldata.append(databody);

    deleteBtn.addEventListener("click", () => {

        databody.remove();

        totalExpense = 0;
        const rows = alldata.querySelectorAll("tbody tr");
        rows.forEach(row => {
            const amountText = row.children[2].textContent;
            const amount = parseFloat(amountText.replace(/[^0-9.-]+/g, ""));
            totalExpense += amount;

        });

        total_Expense.innerHTML = `${currency_symbol} ${totalExpense.toFixed(2)}`;
        current = total - totalExpense;
        curr_Balance.innerHTML = `${currency_symbol} ${current.toFixed(2)}`;

        curr_Balance.style.color = current < 0 ? "red" : "";



        updatePieChart();
    });








}

saveExpense.addEventListener("click", (e) => {
    e.preventDefault();

    if (expenseArea.value !== "" && !isNaN(expenseArea.value)) {
        alert("Expense Area must be a valid string, not a number.");
        return;
    }

    const amountValue = parseFloat((expenseAmount.value));


    if (amountValue === "" || Number.isNaN(amountValue)) {
        alert("Expense Amount must be a valid number.");
        return;
    }

    const data = {
        expenseArea: expenseArea.value,
        expenseDate: expenseDate.value,
        expenseAmt: amountValue,
    };

    const category = data.expenseArea.trim();

    if (expenseArea.value && amountValue) {
        canvasContainer.style.display = "flex";
        expense(data)

        totalExpense = 0;
        const rows = alldata.querySelectorAll("tbody tr");
        rows.forEach(row => {
            const amountText = row.children[2].textContent;
            const amount = parseFloat(amountText.replace(/[^0-9.-]+/g, ""));

            totalExpense += amount;

        });



        total_Expense.innerHTML = `${currency_symbol} ${(totalExpense.toFixed(2))}`;

        let updatedCurr = total - parseFloat(totalExpense);

        current = updatedCurr;
        curr_Balance.innerHTML = `${currency_symbol} ${(current).toFixed(2)}`;

        if (current < 0) {
            curr_Balance.style.color = "red";
        } else {
            curr_Balance.style.color = "";
        }


        expenseArea.value = "";
        expenseDate.value = "";
        expenseAmount.value = "";
    }
    if (category) {
        expensesByCategory[category] = (expensesByCategory[category] || 0) + data.expenseAmt;

    } else {
        alert("Kidhar shopping kiye ho ? paise kharch kiye ho ?")
    }



    updatePieChart();



});

searchExpense.addEventListener("input", (e) => {
    let search = searchExpense.value.toLowerCase().trim();
    let data = alldata.querySelectorAll("tbody tr");

    data.forEach(cell => {
        let cellone = cell.children[0];
        let celltwo = cell.children[1];
        let cellthree = cell.children[2];

        let namecell = cellone.textContent;
        let datecell = celltwo.textContent;
        let amountcell = cellthree.textContent;

        if (namecell.toLowerCase().includes(search) ||
            datecell.includes(search) ||
            amountcell === search) {
            cell.style.display = "";
        } else {
            cell.style.display = "none";
        }
    });
});

function expenseBill() {
    const mypdf = window.jspdf.jsPDF;
    const pdfbody = new mypdf();

    const tableColumn = ["Expense Area", "Date", "Amount"];
    const expenseData = [];

    let alldetails = alldata.querySelectorAll("tbody tr");

    if (alldetails.length === 0) {
        alert("No transactions found. Unable to generate PDF.");
        return;
    }

    alldetails.forEach((details) => {
        const Area = details.children[0].textContent;
        const Date = details.children[1].textContent;
        const Amount = details.children[2].textContent;

        expenseData.push([Area, Date, `${currency_symbol} ${parseFloat(Amount.replace(/[^0-9.-]+/g, "")).toFixed(2)}`]);
    })

    pdfbody.setFontSize(15);
    pdfbody.text("Vishal's Expense Tracker", 70, 10);
    pdfbody.text("Expense Bill", 150, 15);

    pdfbody.autoTable({
        head: [tableColumn],
        body: expenseData,
        startY: 20,
        theme: "grid",
    });

    pdfbody.save("Expense Bill.pdf")
}

download.addEventListener("click", (e) => {
    e.preventDefault();

    const alldetails = alldata.querySelectorAll("tbody tr");
    if (alldetails.length === 0) {
        alert("No transactions found. Please add some expenses first.");
        return;
    }

    expenseBill();
});

let from = document.querySelector(".from");
let to = document.querySelector(".to");
let getrates = document.querySelector(".curr");
let switches = document.querySelector(".switch")

const currencyConverter = async (newCurr, exchange, amount) => {
    try {
        let apiKey = "196b170bac0c4d90a5ad3fe7ac45f1db";
        let api = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;

        let res = await fetch(api);
        let data = await res.json();

        let currencySymbol = {
            "USD": "$",
            "INR": "₹",
            "EUR": "€",
            "GBP": "£",
            "JPY": "¥",
            "CNY": "¥",
            "AUD": "$",
            "CAD": "$",
            "BRL": "R$",
            "KRW": "₩",
            "MXN": "$",
            "RUB": "₽",
            "ZAR": "R",
            "ARS": "$",
            "SGD": "$",
            "THB": "฿",
            "IDR": "Rp",
            "PHP": "₱",
            "TRY": "₺",
            "CHF": "CHF",
            "PKR": "₨",
            "BDT": "৳",
            "NPR": "₨",
            "BTN": "Nu.",
            "AFN": "؋",
            "MMK": "Ks",
            "LKR": "Rs"
        };

        let fromconversion = data.rates[newCurr];
        let toConversion = data.rates[exchange];

        let firstconversion = (amount / fromconversion) * toConversion;
        let view = document.querySelector(".rate_view");

        view.innerHTML = `Exchange : ${currencySymbol[newCurr]}${amount} =    ${currencySymbol[exchange]}${firstconversion.toFixed(1)} `

    } catch {
        view.innerHTML = "No Data Found"
    }
}

async function symbolUpdation(symbol) {
    let apiKey = "196b170bac0c4d90a5ad3fe7ac45f1db";
    let api = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;

    let res = await fetch(api);
    // let data = await res.json();

    let currencySymbol = {
        "USD": "$",
        "INR": "₹",
        "EUR": "€",
        "GBP": "£",
        "JPY": "¥",
        "CNY": "¥",
        "AUD": "$",
        "CAD": "$",
        "BRL": "R$",
        "KRW": "₩",
        "MXN": "$",
        "RUB": "₽",
        "ZAR": "R",
        "ARS": "$",
        "SGD": "$",
        "THB": "฿",
        "IDR": "Rp",
        "PHP": "₱",
        "TRY": "₺",
        "CHF": "CHF",
        "PKR": "₨",
        "BDT": "৳",
        "NPR": "₨",
        "BTN": "Nu.",
        "AFN": "؋",
        "MMK": "Ks",
        "LKR": "Rs"
    };

    if (currency_symbol === currencySymbol[symbol]) {
        return;
    }

    currency_symbol = currencySymbol[symbol];

    total_Balance.innerHTML = ` ${currency_symbol} ${parseFloat(total.toFixed(2))}`;
    curr_Balance.innerHTML = `${currency_symbol} ${parseFloat(current.toFixed(2))}`;
    total_Expense.innerHTML = `${currency_symbol} ${parseFloat(totalExpense.toFixed(2))}`;

    const rows = alldata.querySelectorAll("tbody tr");
    rows.forEach(row => {
        const amountCell = row.children[2];
        let currentAmount = amountCell.textContent.trim();
        amountCell.innerHTML = `${currency_symbol} ${parseFloat(currentAmount.replace(/[^0-9.-]+/g, ""))}`;
    });

    updatePieChart()
}

symbolbtn.addEventListener("click", (e) => {
    e.preventDefault();
    let symbol = toconvert.value;
    symbolUpdation(symbol);
});

window.addEventListener("load", () => {
    currencyConverter("INR", "USD", 150)
})

let amounts = document.querySelector(".amt");

getrates.addEventListener("click", (e) => {
    e.preventDefault();
    let newCurr = from.value;
    let exchange = to.value;

    let amount = amounts.value;
    currencyConverter(newCurr, exchange, amount)
})

switches.addEventListener("click", (e) => {
    e.preventDefault();
    let tempvalue = from.value;
    from.value = to.value;
    to.value = tempvalue;

    let newCurr = from.value;
    let exchange = to.value;
    let amount = amounts.value;
    currencyConverter(newCurr, exchange, amount)
})

async function nowExchange(tocon) {
    let apiKey = "196b170bac0c4d90a5ad3fe7ac45f1db";
    let api = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;

    try {

        let res = await fetch(api);
        let data = await res.json();

        let currencySymbol = {
            "USD": "$",
            "INR": "₹",
            "EUR": "€",
            "GBP": "£",
            "JPY": "¥",
            "CNY": "¥",
            "AUD": "$",
            "CAD": "$",
            "BRL": "R$",
            "KRW": "₩",
            "MXN": "$",
            "RUB": "₽",
            "ZAR": "R",
            "ARS": "$",
            "SGD": "$",
            "THB": "฿",
            "IDR": "Rp",
            "PHP": "₱",
            "TRY": "₺",
            "CHF": "CHF",
            "PKR": "₨",
            "BDT": "৳",
            "NPR": "₨",
            "BTN": "Nu.",
            "AFN": "؋",
            "MMK": "Ks",
            "LKR": "Rs"
        };

        let updatedCurrency = Object.keys(currencySymbol).find(key => currencySymbol[key] === currency_symbol);
        let fromRate = data.rates[updatedCurrency];
        let toRate = data.rates[tocon];

        let totalInBase = (total / fromRate) * toRate;
        let currentInBase = (current / fromRate) * toRate;
        let expenseInBase = (totalExpense / fromRate) * toRate;

        total = totalInBase
        current = currentInBase
        totalExpense = expenseInBase


        currency_symbol = currencySymbol[tocon]
        total_Balance.innerHTML = `${currency_symbol} ${(totalInBase.toFixed(2))}`
        curr_Balance.innerHTML = `${currency_symbol} ${(currentInBase.toFixed(2))}`
        total_Expense.innerHTML = `${currency_symbol} ${(expenseInBase.toFixed(2))}`

        const rows = alldata.querySelectorAll("tbody tr")
        rows.forEach((child) => {
            const amountcell = child.children[2];
            let baseAmount = parseFloat(amountcell.textContent.replace(/[^\d.-]/g, '')) / fromRate;
            amountcell.innerHTML = `${currency_symbol}${(baseAmount * toRate).toFixed(2)}`;
        })


    } catch {
        alert("Something went Wrong ! Try Again")
    }

    updatePieChart()
}

exchangeBtn.addEventListener("click", () => {
    let tocon = toconvert.value;
    nowExchange(tocon)
})
