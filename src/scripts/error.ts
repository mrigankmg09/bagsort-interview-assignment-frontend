const errorBoxEle: HTMLElement | null = document.querySelector(".error-box");
const errorMsgEle: HTMLElement | null = document.querySelector(".error-msg");

const handleErrorClose = (): void => {
    if(errorBoxEle) {
        errorBoxEle.style.display = "none";
    }
}

const displayErrorBox = (msg: string): void => {
    if(errorBoxEle && errorMsgEle) {
        errorMsgEle.textContent = msg;
        errorBoxEle.style.display = "block";
    }
}