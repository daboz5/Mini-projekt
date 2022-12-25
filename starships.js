import { enableLoader, disableLoader, removeDivs, removePagination, disablePagination, enablePagination } from "./short_functions.js";

var api_url = "https://swapi.dev/api/starships/";
const log = console.log;
const doc = document;
const contentBox = doc.getElementById("content-box");

var pageListener = 1;
var pageCounter = 1;
var globalNext = "I am Next";
var globalBack = "I am Previous";
var globalCountPages = 0;

function setDivs (numRequest, arr) {
    for (let i = 0; i < numRequest; i++) {
        const newDiv = doc.createElement("div");
        const infoBox = doc.createElement("p");
        const boldNode = doc.createElement("b");
        const lineBreak = doc.createElement("br");
        
        newDiv.setAttribute("class", "person-box");
        infoBox.setAttribute("class", "text-box");

        let boldNodeStart = `Sem `;
        boldNode.append(`${arr[i].name}`);
        boldNode.setAttribute("id", `${i}name`);
        let boldNodeEnd = `.`

        const italicPassenger = doc.createElement("i");
        if (arr[i].passengers === 1 || arr[i].passengers === 2) {
            var passenger = `Prevažam lahko `;
            var passengerNum = `${arr[i].passengers}`;
            var passengerEnd = ` potnika`;
        } else if (arr[i].passengers === 3 || arr[i].passengers === 4) {
            var passenger = `Prevažam lahko `;
            var passengerNum = `${arr[i].passengers}`;
            var passengerEnd = ` potnike`;
        } else if (arr[i].passengers === "n/a" || arr[i].passengers === "unknown") {
            var passenger = `Prevažam lahko `;
            var passengerNum = `neznano število`;
            var passengerEnd = ` potnikov`;
        } else if (arr[i].passengers === undefined) {
            var passenger = ``;
            var passengerNum = `Ne prevažam`;
            var passengerEnd = ` potnikov`;
        } else {
            var passenger = `Prevažam lahko `;
            var passengerNum = `${arr[i].passengers}`;
            var passengerEnd = ` potnikov`;
        }
        italicPassenger.append(passengerNum);

        const italicCrew = doc.createElement("i");
        if (arr[i].crew == 1 || arr[i].crew == 2) {
            var crewNum = ` ${arr[i].crew}`;
            var crew = ` člana posadke.`;
        } else if (arr[i].crew == 3 || arr[i].crew == 4) {
            var crewNum = ` ${arr[i].crew}`;
            var crew = ` člane posadke.`;
        } else if (arr[i].crew == "n/a" || arr[i].crew == "unknown") {
            var crewNum = ` neznano število`;
            var crew = ` članov posadke.`;
        } else if (arr[i].crew === undefined) {
            var crewNum = `ne prevažam`;
            var crew = ` članov posadke.`;
        } else {
            var crewNum = ` ${arr[i].crew}`;
            var crew = ` članov posadke.`;
        }
        italicCrew.append(crewNum);

        let content = [boldNodeStart, boldNode, boldNodeEnd, lineBreak, passenger, italicPassenger, passengerEnd, " in", italicCrew, crew];
        content.forEach(element => infoBox.append(element));

        newDiv.append(infoBox);
        contentBox.appendChild(newDiv);
    }
}

function setPagination () {
    const hereButton = doc.createElement("button");
    const nextButton = doc.createElement("button");
    const hereP = doc.createElement("p");
    const nextP = doc.createElement("p");

    hereP.setAttribute("id", "page-num");
    hereButton.setAttribute("id", "here");
    nextButton.setAttribute("id", "next");
    nextButton.addEventListener("click", () => click('next'));
    
    let here = `Page ${pageCounter}`;
    let next = "Next";

    hereP.append(here);
    nextP.append(next);
    hereButton.append(hereP);
    nextButton.append(nextP);
    doc.getElementById("pagination").append(hereButton);
    doc.getElementById("pagination").append(nextButton);
}

async function updateShipInfo () {
    disablePagination();

    let response = await fetch(api_url);
    let data = await response.json()
    let dataSize = data.results.length;
    let rawStarship = data.results;
    let infoStarship = rawStarship.map(({name, passengers, crew}) => ({name, passengers, crew}));
    globalNext = data.next;
    globalBack = data.previous;

    enablePagination();
    if (globalNext === null) {
        doc.getElementById("next").remove();
    }
    removeDivs();
    setDivs(dataSize, infoStarship);
}

async function updatePage (move) {
    const makeNext = doc.createElement("button");
    const makeBack = doc.createElement("button");
    let updateP = doc.createElement("p");
    const nextP = doc.createElement("p");
    const backP = doc.createElement("p");
    makeNext.setAttribute("id", "next");
    makeNext.addEventListener("click", () => click('next'));
    makeBack.setAttribute("id", "back");
    makeBack.addEventListener("click", () => click('back'));
    updateP.setAttribute("id", "page-num");
    const loc = doc.getElementById("pagination");
    const hereId = doc.getElementById("here");
    const pageId = doc.getElementById("page-num");
    const nextId = doc.getElementById("next");
    const backId = doc.getElementById("back");
    let update = `Page ${pageCounter}`;
    let next = "Next";
    let back = "Back";
    nextP.append(next);
    backP.append(back);
    makeNext.append(nextP);
    makeBack.append(backP);
    updateP.append(update);
    
    await updateShipInfo();

    if (pageListener == 1 && move == "next") {
        pageId.replaceWith(updateP);
        loc.insertBefore(makeBack, hereId);
        pageListener++;
    } else if (pageListener == 2 && move == "back") {
        pageId.replaceWith(updateP);
        backId.remove();
        pageListener--;
    } else if (pageListener > (globalCountPages - 1) && move == "next") {
        pageId.replaceWith(updateP);
        nextId.remove();
        pageListener++;
    } else if (pageListener > globalCountPages && move == "back") {
        pageId.replaceWith(updateP);
        loc.append(makeNext);
        pageListener--;
    } else if (pageListener > 1 && pageListener <= globalCountPages && move == "next") {
        pageId.replaceWith(updateP);
        pageListener++;
    } else if (pageListener > 1 && pageListener <= globalCountPages && move == "back") {
        pageId.replaceWith(updateP);
        pageListener--;
    }

    disableLoader();
}

async function getShipsInfo () {
    let response = await fetch(api_url);
    let data = await response.json();
    let dataSize = data.results.length;
    let rawStarship = data.results;
    let infoStarship = rawStarship.map(({name, passengers, crew}) => ({name, passengers, crew}));
    globalNext = data.next;
    globalBack = data.previous;
    globalCountPages = Math.trunc(data.count / dataSize);

    removePagination();
    setPagination();
    removeDivs();
    setDivs(dataSize, infoStarship);
    disableLoader();
}

function click(value) {
    if (value == "next") {
        api_url = globalNext;
        pageCounter++;
        enableLoader();
        updatePage("next");
    } else if (value == "back") {
        api_url = globalBack;
        pageCounter--;
        enableLoader();
        updatePage("back");
    }
}

export {getShipsInfo};