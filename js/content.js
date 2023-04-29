const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const wait = function (seconds) {
    return new Promise(function (resolve) {
        setTimeout(resolve, seconds);
    });
};
window.onload = function () {
    const body = document.querySelector("body");
    const elementString = `
    <div class="recorder">
        <button class="btn_record start_recoding">start recoding</button> 
        <a href="" class="btn_record download-video-btn">Download</a>
        <button class="btn_record test123">click</button> 
    </div>
    `;
    body.insertAdjacentHTML("afterbegin", elementString);
    console.log(body);

    const btn = document.querySelector(".start_recoding");
    const btn2 = document.querySelector(".test123");
    btn.addEventListener("click", () => {
        startRecording();
    });

    btn2.addEventListener("click", async () => {
        console.log(123);
        const list =
            document.querySelector("#example-panel").children[0].children[0].children;

        for (let i = 0; i < list.length; i++) {
            const e = list[i];
            if (i === 1) {
                e.children[0].children[0].click();
                await wait(500);
                console.log(document.querySelector("video"));
                const durationNum = document.querySelector("video").duration;
                const duration = `${durationNum}`.replace(".", "");
                console.log(+duration);
                await wait(+duration);
                console.log("đi tiếp");
                // listenerChild(parentEl)
            }
            if (i > 0) {
                console.dir(e.children[0].children[0].innerText);
            }
            await wait(1000);
        }
    });
};

let chunks = [];
let mediaRecorder;

async function setupStream() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
        });

        return stream;
    } catch (error) {
        console.log(error);
    }
}

async function startRecording() {
    const stream = await setupStream();
    stream.getVideoTracks()[0].onended = function () {
        console.log(123);
        stopRecording();
    };
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
    };

    mediaRecorder.onstop = handleStop;

    mediaRecorder.start(200);

    return mediaRecorder;
}

function handleStop() {
    const blob = new Blob(chunks, { type: "video/webm" });

    const downloadBtn = $(".download-video-btn");

    downloadBtn.href = URL.createObjectURL(blob);
    downloadBtn.download = `recorded-video.webm`;

    chunks = [];

    console.log("Recording stop .....");
}

function stopRecording() {
    mediaRecorder.stop();
}

function listenerChild(parentEl) {
    return new Promise(function (resolve, reject) {
        const observerOptions = {
            childList: true,
        };

        const observer = new MutationObserver(callback);

        const targetNodes = parentEl;
        observer.observe(targetNodes, observerOptions);
        function callback(mutations) {
            console.log(mutations);
        }
    });
}
