const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const wait = function (seconds) {
    return new Promise(function (resolve) {
        setTimeout(resolve, seconds);
    });
};

async function loadVideo(video) {
    return new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
            resolve();
        };
    });
}

function listenerChild(parentEl) {
    return new Promise(function (resolve, reject) {
        const observerOptions = {
            childList: true,
        };

        const observer = new MutationObserver(callback);

        const targetNodes = parentEl;
        console.log(targetNodes);
        observer.observe(targetNodes, observerOptions);
        function callback(mutations) {
            console.log(mutations);
            console.log(mutations[0].target);
            console.log(mutations[0].target.children[0]);
            observer.disconnect();
            resolve(mutations[0].target.children[0]);
        }
    });
}

function sendMessage(mes) {
    chrome.runtime.sendMessage(mes, (e) => {
        console.log(e);
    });
}

async function checkElement(selector, timing) {
    let element = document.querySelector(selector);
    while (!element) {
        element = document.querySelector(selector);
        console.log("vòng while: ", element);
        await wait(timing);
    }
    return element;
}

function openFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        /* Safari */
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        /* IE11 */
        element.msRequestFullscreen();
    }
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
    }
}

async function start() {
    const sectionVideo = +document.querySelector(".section_video").value - 1;
    const chapterVideo = +document.querySelector(".chapter_video").value - 1;
    const indexVideo = +document.querySelector(".index_video").value;
    console.log("sectionVideo: ", sectionVideo);
    console.log("chapterVideo: ", chapterVideo);
    console.log("indexVideo: ", indexVideo);

    const sectionEl = document.querySelectorAll("#example-panel")[sectionVideo];
    const chapterEl = sectionEl.children[0].children[chapterVideo];
    const list = chapterEl.children;
    console.log("sectionEl: ", sectionEl);
    console.log("chapterEl: ", chapterEl);
    console.log("list: ", list);
    console.log("list[indexVideo]", list[indexVideo]);
    console.log("button", list[indexVideo].querySelector("button"));

    for (let i = indexVideo; i < list.length; i++) {
        const btn = list[i].querySelector("button");
        btn.style.outline = "1px solid red";
        btn.click();

        const video = await checkElement("video", 100);

        await loadVideo(video);

        if (!video.webkitDisplayingFullscreen) openFullscreen(video);
        video.play();

        //lấy thông tin
        const duration = `${video.duration}`.replace(".", "");
        const name = btn.innerText;
        console.log(name, +duration);

        sendMessage({ title: "info", duration, name });
        // await wait(10000);
        await wait(+duration);
        console.log("đi tiếp", i, list.length);
        if (i === list.length - 1) {
            closeFullscreen();
            video.pause();
            sendMessage({ title: "stop" });
        } else {
            sendMessage({ title: "cutVideo" });
        }
    }
}

window.onload = function () {
    const body = document.querySelector("body");
    const elementString = `
    <div class="recorder">
        <div class="recorder_group">
            <label for="">section</label>
            <input class="section_video" type="number" value="1" min="1"
            />
        </div>
        <div class="recorder_group">
            <label for="">chapter</label>
            <input class="chapter_video" type="number" value="1" min="1"
            />
        </div>
        <div class="recorder_group">
            <label for="">index</label>
            <input class="index_video" type="number" value="1" min="1"
            />
        </div>
        <button class="btn_record send">Send</button>
    </div>
    `;
    body.insertAdjacentHTML("afterbegin", elementString);
    console.log(body);

    const sendBtn = document.querySelector(".send");

    sendBtn.addEventListener("click", () => {
        // start();
        sendMessage("getIDandGetStream");
    });
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    sendResponse({ reMessage: "phản hồi lại từ content => option" });
    start();
});
