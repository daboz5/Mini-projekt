import { disableLoader, removeDivs, removePagination } from "./short_functions.js";

const log = console.log;
const doc = document;

function setHomePage () {
    const homeContent = doc.getElementById("index-loader");
    homeContent.style.display = "flex";
    removeDivs();
    removePagination();
    disableLoader();
}

function endHomePage () {
    const homeContent = doc.getElementById("index-loader");
    homeContent.style.display = "none";
}

export {setHomePage};
export {endHomePage};