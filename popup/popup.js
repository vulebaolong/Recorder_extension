if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
} else {
    window.open(chrome.runtime.getURL("index.html"));
}
