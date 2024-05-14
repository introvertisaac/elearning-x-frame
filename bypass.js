const iFrames = [...document.querySelectorAll("iframe[bypass-x-frame]")];
const bypassAPILink = "https://elearning-x-frame.onrender.com/bypass/";

iFrames.forEach(async (frame) => {
    let link = frame.getAttribute("bypass-x-frame");

    frame.src = bypassAPILink + link;
});
