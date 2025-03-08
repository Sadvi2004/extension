let activeTabId = null;
let startTime = null;
let siteTimes = {};

// Function to update time spent on a website
function updateSiteTime(url) {
    if (!url) return;

    let endTime = new Date().getTime();
    if (activeTabId && startTime) {
        let timeSpent = (endTime - startTime) / 1000;
        siteTimes[url] = (siteTimes[url] || 0) + timeSpent;
        chrome.storage.local.set({ siteTimes });
    }

    startTime = endTime;
}

// Listener: Track tab changes
chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, tab => {
        if (tab?.url) {
            updateSiteTime(tab.url);
            activeTabId = tab.url;
            startTime = new Date().getTime();
        }
    });
});

// Listener: Track tab updates (navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        updateSiteTime(activeTabId);
        activeTabId = tab.url;
        startTime = new Date().getTime();
    }
});

// Listener: Provide stored data to popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getStats") {
        chrome.storage.local.get(["siteTimes"], (result) => {
            sendResponse(result.siteTimes || {});
        });
        return true;
    }
});
