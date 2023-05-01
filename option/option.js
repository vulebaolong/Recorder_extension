const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

let chunks = [];
let mediaRecorder;
let streamGlobal;
let nameVideo;
let durationVideo;
let timer;

async function getStream() {
    streamGlobal = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
    });
    sendMessage("bắt đầu quay");
    streamGlobal.getVideoTracks()[0].onended = function () {
        stopRecording();
    };
    setupVideoFeedback();
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
    // console.log("Recording stop .....");
}

function stopRecording() {
    mediaRecorder.stop();
    chunks = [];
}

function sendMessage(mes) {
    chrome.runtime.sendMessage(mes, (e) => {
        console.log(e);
    });
}

function startRecording() {
    mediaRecorder.start();
}

function countdownTimer(milliseconds, display) {
    let timeLeft = milliseconds;
    let hours, minutes, seconds, countdown;

    function pad(number) {
        if (number < 10) {
            return "0" + number;
        }
        return number;
    }

    function formatTime() {
        hours = Math.floor(timeLeft / (1000 * 60 * 60));
        minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        hours = pad(hours);
        minutes = pad(minutes);
        seconds = pad(seconds);

        countdown = `${hours} : ${minutes} : ${seconds}`;
    }

    formatTime();

    const interval = setInterval(() => {
        timeLeft -= 1000;
        if (timeLeft < 0) {
            clearInterval(interval);
            // console.log("Countdown ended");
        } else {
            formatTime();
            // console.log(countdown);
            display.innerText = countdown;
        }
    }, 1000);

    function stopCountdown() {
        clearInterval(interval);
        // console.log("Countdown stopped");
    }

    return {
        stop: stopCountdown,
    };
}

function setupVideoFeedback() {
    if (streamGlobal) {
        const videoFeedback = $(".video-feedback");
        videoFeedback.srcObject = streamGlobal;
        videoFeedback.autoplay = true;
    } else {
        console.warn("Không có stream: ", streamGlobal);
    }
}

$(".test").addEventListener("click", function () {
    // stopRecording();
    // handleMediaRecorder();
    // startRecording();
    timer.stop();
    countdownTimer(120000, document.querySelector(".timeVideo"));
});

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

    if (request.title === "info") {
        console.log("gửi trước lấy info", request.name, request.duration);
        nameVideo = request.name;
        durationVideo = request.duration;
        $(".nameVideo").innerText = nameVideo;
        if (timer) {
            timer.stop();
        }
        timer = countdownTimer(durationVideo, $(".timeVideo"));
    }

    if (request.title === "cutVideo") {
        console.log("cắt video");
        stopRecording();
        handleMediaRecorder();
        startRecording();
    }

    if (request.title === "stop") {
        console.log("video cuối chỉ stop");
        streamGlobal.getTracks().forEach((track) => track.stop());
    }
});
