const electron = require("electron");
const ipc = electron.ipcRenderer;
document.addEventListener("DOMContentLoaded",  () => {
    ipc.send("mainWindowLoaded");
    ipc.on("resultSent", (evt, result) => {
        let resultEl = document.getElementById("result");
        console.log(result);
        for (let i = 0; i < result.length; i++) {
            resultEl.innerHTML += "Ticker: " + result[i].ticker.toString() + "<br>";
        }
    });
});