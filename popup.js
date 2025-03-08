document.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.sendMessage({ action: "getStats" }, (response) => {
        const statsDiv = document.getElementById("stats");
        statsDiv.innerHTML = "";

        if (response) {
            Object.entries(response).forEach(([url, time]) => {
                let timeFormatted = (time / 60).toFixed(2);
                let entry = document.createElement("p");
                entry.textContent = `${url}: ${timeFormatted} min`;
                statsDiv.appendChild(entry);
            });
        } else {
            statsDiv.textContent = "No data available.";
        }
    });
});
