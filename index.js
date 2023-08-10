import { disableLoader, removeContent, removePagination } from "./utilities.js";

const log = console.log;
const doc = document;

const homeContent = doc.getElementById("index-loader");

function setHomePage () {
    homeContent.style.display = "flex";
    removeContent();
    removePagination();
    disableLoader();
}

function removeHomePage () {
    homeContent.style.display = "none";
}

export { setHomePage, removeHomePage };