import { enableLoader, disableLoader, removeDivs, removePagination, disablePagination, enablePagination } from "./short_functions.js";

var api_url = "https://swapi.dev/api/planets/";
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

        boldNode.append(arr[i].name);
        boldNode.setAttribute("id", `${i}name`);

        const italicClimate = doc.createElement("i");
        if (arr[i].climate == "unknown") {
            var climateStart = ` planet`
            var climate = `neznanega podnebja`;
            var climateEnd = ``;
        } else {
            var climateStart = ` `
            var climate = `${arr[i].climate}`;
            var climateEnd = ` planet`;
        }
        italicClimate.append(climate);
        
        const italicPopulation = doc.createElement("i");
        if (arr[i].population === "n/a" || arr[i].population === "unknown") {
            var population = " neznano število";
            var populationStr = ` prebivalcev.`;
        } else {
            var population = `${arr[i].population}`;
            let track = 0;
            let popStr = "";
            let popStrReverse = "";
            for (let j = population.length; j > 0; j--) {
                if (track == 3) {
                    popStr = "." + popStr;
                    track = 0;
                    j++;
                } else {
                    popStrReverse = population[j-1];
                    popStr = popStrReverse + popStr;
                    track++;
                }
            }
            population = popStr;
            var populationStr = ` prebivalcev.`;
        }
        italicPopulation.append(population);

        let content = ["Sem ", boldNode, ",", climateStart, climate, climateEnd, lineBreak, " na katerem živi ", italicPopulation, populationStr];
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

async function updatePlanetsInfo () {
    disablePagination();

    let response = await fetch(api_url);
    let data = await response.json()
    let dataSize = data.results.length;
    let rawPlanets = data.results;
    let infoPlanets = rawPlanets.map(({name, climate, population}) => ({name, climate, population}));
    globalNext = data.next;
    globalBack = data.previous;
    enablePagination();
    if (globalNext === null) {
        doc.getElementById("next").remove();
    }
    removeDivs();
    setDivs(dataSize, infoPlanets);
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
    
    await updatePlanetsInfo();

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

async function getPlanetsInfo () {
    let response = await fetch(api_url);
    let data = await response.json();
    let dataSize = data.results.length;
    let rawPlanets = data.results;
    let infoPlanets = rawPlanets.map(({name, climate, population}) => ({name, climate, population}));
    globalNext = data.next;
    globalBack = data.previous;
    globalCountPages = Math.trunc(data.count / dataSize);
    removePagination();
    setPagination();
    removeDivs();
    setDivs(dataSize, infoPlanets);
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

export {getPlanetsInfo};