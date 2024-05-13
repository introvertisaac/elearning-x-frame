const iFrames = [...document.querySelectorAll("iframe[bypass-x-frame]")];
const bypassAPILink = "https://77.37.51.164:443/bypass/";

iFrames.forEach(async (frame) => {
    let link = frame.getAttribute("bypass-x-frame");

    frame.src = bypassAPILink + link;
});
