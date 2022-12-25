import { enableLoader, disableLoader, removeDivs, removePagination, disablePagination, enablePagination } from "./short_functions.js";

var api_url = "https://swapi.dev/api/people/";
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
        newDiv.classList.add("person-box");
        infoBox.classList.add("text-box");

        let name = arr[i].name;
        boldNode.append(name);
        boldNode.setAttribute("id", `${i}name`);

        if (arr[i].gender == "female") {
            var height = `Visoka sem `;
        } else {
            var height = `Visok sem `;
        }
        const italicHeight = doc.createElement("i");
        italicHeight.append(arr[i].height + " cm");
        italicHeight.setAttribute("id", `${i}height`);

        const italicMass = doc.createElement("i");
        italicMass.append(arr[i].mass + " kg.");
        italicMass.setAttribute("id", `${i}mass`);

        let content = ["Ime mi je ", boldNode, ".", lineBreak, height, italicHeight, " in imam ", italicMass]
        content.forEach(element => infoBox.append(element))

        newDiv.append(infoBox);
        contentBox.appendChild(newDiv);

        doc.getElementById(`${i}name`).style.color = `${arr[i].eye_color}`;
        doc.getElementById(`${i}height`).style.fontSize = `${(arr[i].height / 10)}px`;
        doc.getElementById(`${i}height`).style.textDecoration = "underline";
        doc.getElementById(`${i}mass`).style.fontSize = `${(arr[i].height / 10)}px`;
        doc.getElementById(`${i}mass`).style.textDecoration = "underline";
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

async function updatePeopleInfo () {
    disablePagination();

    let response = await fetch(api_url);
    let data = await response.json()
    let dataSize = data.results.length;
    let rawPeople = data.results;
    let infoPeople = rawPeople.map(({name, height, mass, gender, eye_color}) => ({name, height, mass, gender, eye_color}));
    globalNext = data.next;
    globalBack = data.previous;
    
    enablePagination();
    if (globalNext === null) {
        doc.getElementById("next").remove();
    }
    removeDivs();
    setDivs(dataSize, infoPeople);
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

    await updatePeopleInfo();

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

async function getPeopleInfo () {
    let response = await fetch(api_url);
    let data = await response.json();
    let dataSize = data.results.length;
    let rawPeople = data.results;
    let infoPeople = rawPeople.map(({name, height, mass, gender, eye_color}) => ({name, height, mass, gender, eye_color}));
    globalNext = data.next;
    globalBack = data.previous;
    globalCountPages = Math.trunc(data.count / dataSize);
    
    removePagination();
    setPagination();
    removeDivs()
    setDivs(dataSize, infoPeople);
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

export {getPeopleInfo};