const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

let chunks = [];
let mediaRecorder;
let streamGlobal;
let nameVideo;

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    sendResponse({ reMessage: "phản hồi lại từ option => content" });
    if (
        sender.tab.favIconUrl === "https://login.cybersoft.edu.vn/favicon.ico" &&
        request === "getIDandGetStream"
    ) {
        await getStream();
        handleMediaRecorder();
        startRecording();
    }

    if (request.title === "cutVideo") {
        console.log(request);
        console.log(request.duration);
        console.log(request.name);
        nameVideo = request.name;
        stopRecording();
        handleMediaRecorder();
        startRecording();
    }
});

async function getStream() {
    streamGlobal = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
    });
    sendMessage("bắt đầu quay");
    streamGlobal.getVideoTracks()[0].onended = function () {
        stopRecording();
    };
    return;
}

function handleMediaRecorder() {
    mediaRecorder = new MediaRecorder(streamGlobal);

    mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
    };

    mediaRecorder.onstop = handleStop;
}

function handleStop() {
    const blob = new Blob(chunks, { type: "video/webm" });

    const downloadBtn = $(".download-video-btn");

    downloadBtn.href = URL.createObjectURL(blob);
    downloadBtn.download = `${nameVideo.replace(" ", "_")}.webm`;
    downloadBtn.click();
    console.log("Recording stop .....");
}

function stopRecording() {
    mediaRecorder.stop();
    chunks = [];
    // test();
}

function sendMessage(mes) {
    chrome.runtime.sendMessage(mes, (e) => {
        console.log(e);
    });
}

function startRecording() {
    mediaRecorder.start();
}

function downloadVideo() {
    // const options = {
    //     type: "video/webm; codecs=vp9",
    //     videoBitsPerSecond: 64 * 1024,
    //     audioBitsPerSecond: 64 * 1024,
    //     audioChannels: 1,
    //     audioSampleRate: 48000,
    //     width: 1258,
    //     height: 928,
    // };

    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "recording.webm";
    a.click();
}

$(".click").addEventListener("click", function () {
    stopRecording();
    handleMediaRecorder();
    startRecording();
});
