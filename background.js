let id = null;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    sendResponse("phản hồi từ background");
    if (sender.tab.title === "Recorder extension") {
        console.log("nhận tin nhắn gửi từ Recorder extension để chuyển tiếp tới content");
        if (id === null) return console.log("chưa có ID: ", id);
        senMes(id, request);
    }
    if (
        sender.tab.favIconUrl === "https://login.cybersoft.edu.vn/favicon.ico" &&
        request === "getIDandGetStream"
    ) {
        console.log("nhận tin nhắn gửi từ content để lấy ID content");
        id = sender.tab.id;
    }
});
function senMes(id, mes) {
    chrome.tabs.sendMessage(id, mes, (e) => {
        console.log(e);
    });
}
