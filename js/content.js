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
        <button class="btn_record send">send</button> 
    </div>
    `;
    body.insertAdjacentHTML("afterbegin", elementString);
    console.log(body);

    const btn = document.querySelector(".start_recoding");
    const btn2 = document.querySelector(".test123");
    const btn3 = document.querySelector(".send");
    btn.addEventListener("click", () => {});

    btn2.addEventListener("click", async () => {});

    btn3.addEventListener("click", () => {
        sendMessage("getIDandGetStream");
    });
};

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

async function start() {
    const list =
        document.querySelector("#example-panel").children[0].children[0].children;
    // click thằng đầu tiên
    list[1].children[0].children[0].click();

    // const parentVideo1 =
    //     document.querySelector(".ant-modal-body").children[0].children[0].children[0]
    //         .children[0];
    // //lắng nghe cái div bọc thẻ video
    // const parentVideo2 = await listenerChild(parentVideo1);
    // // lắng nghe thẻ video

    // const video = await listenerChild(parentVideo2);
    const video = document.querySelector("video");
    for (let i = 0; i < list.length; i++) {
        const e = list[i];
        if (i === 1) {
        }
        if (i > 0) {
            if (i > 1) e.children[0].children[0].click();
            await loadVideo(video);
            video.play();
            const duration = `${video.duration}`.replace(".", "");
            const name = e.children[0].children[0].innerText;
            console.log(name, +duration);
            // await wait(+duration);
            await wait(+duration);
            sendMessage({ title: "cutVideo", duration, name });
            console.log("đi tiếp");
            // await wait(+duration);
        }
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    sendResponse({ reMessage: "phản hồi lại từ content => option" });
    start();
});

async function loadVideo(video) {
    return new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
            resolve(123);
        };
    });
}
