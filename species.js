import { findPageNum, enableLoader, disableLoader, removeContent, disablePagination, enablePagination, createContentTags, setPagination, finalizeContent, updatePaginationTags, removeAllContent, getInfo, finalizePagination } from "./utilities.js";

const log = console.log;
const doc = document;

function setContent (num, arr) {
    for (let i = 0; i < num; i++) {
        const {child, childContent, childBold, childLinebreak} = createContentTags();

        let boldStart1 = "Smo ";
        childBold.append(arr[i].name);
        let boldEnd1 = " vrste";

        var childItalic1 = doc.createElement("i");
        var italicStart1 = "Sodimo med ";
        if (arr[i].classification == "unknown") {
            childItalic1.append(`neznane`);
        } else {
            var italicStart1 = "Sodimo med ";
            childItalic1.append(`${arr[i].classification}`);
        }
        var italicEnd1 = " vrste";

        var childItalic2 = doc.createElement("i");
        var italicStart2 = " in govorimo ";
        if (arr[i].language == "n/a") {
            childItalic2.append(`vsak`);
        }  else {
            childItalic2.append(`${arr[i].language}`);
        }
        var italicEnd2 = " jezik.";

        let content = [boldStart1, childBold, boldEnd1, childLinebreak, italicStart1, childItalic1, italicEnd1, italicStart2, childItalic2, italicEnd2];
        finalizeContent(child, childContent, content)
    }
}

async function updateSpecies (newPageNum) {
    disablePagination();

    const api_url = "https://swapi.dev/api/species/"
    let api_url_species = (api_url + `?page=${newPageNum}`);
    const {dataSizeAll, dataSizePage, rawData, api_next} = await getInfo(api_url_species);
    
    let infoSpecies = rawData.map(({name, classification, language}) => ({name, classification, language}));   
    let numOfPages = Math.trunc(dataSizeAll / dataSizePage);

    removeContent();
    if (api_next === null) {
        doc.getElementById("next").remove();
    }

    setContent(dataSizePage, infoSpecies);
    enablePagination();
    return numOfPages;
}

async function updateAllContent (move) {
    let newPageNum = findPageNum(move);

    const {nextTag, backTag} = updatePaginationTags();
    nextTag.addEventListener("click", () => click('next'));
    backTag.addEventListener("click", () => click('back'));

    let numOfPages = await updateSpecies(newPageNum);

    finalizePagination(numOfPages, newPageNum, move, nextTag, backTag);
}

const click = (value) => {
    enableLoader();
    if (value == "next") {
        updateAllContent("next");
    } else if (value == "back") {
        updateAllContent("back");
    }
}

async function getSpecies (api_url_species) {
    const {dataSizePage, rawData} = await getInfo(api_url_species);
    let infoSpecies = rawData.map(({name, classification, language}) => ({name, classification, language}));

    removeAllContent();

    const nextTag = setPagination();
    nextTag.addEventListener("click", () => click('next'));

    setContent(dataSizePage, infoSpecies);
    disableLoader();
}

export {getSpecies};