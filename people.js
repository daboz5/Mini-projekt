import { findPageNum, enableLoader, disableLoader, removeContent, disablePagination, enablePagination, createContentTags, setPagination, finalizeContent, updatePaginationTags, removeAllContent, getInfo, finalizePagination } from "./utilities.js";

const log = console.log;
const doc = document;

function setContent (num, arr) {
    for (let i = 0; i < num; i++) {
        const {child, childContent, childBold, childLinebreak} = createContentTags();

        let boldStart1 = "Ime mi je ";
        childBold.append(arr[i].name);
        let boldEnd1 = ".";

        const childItalic1 = doc.createElement("i");
        if (arr[i].gender == "female") {
            var italicStart1 = "Visoka sem ";
        } else {
            var italicStart1 = "Visok sem ";
        }
        childItalic1.append(`${arr[i].height} cm`);

        const childItalic2 = doc.createElement("i");
        const italicStart2 = " in imam ";
        if (arr[i].mass == "unknown") {
            childItalic2.append("neznano težo");
        } else {
            childItalic2.append(`${arr[i].mass} kg`);
        }
        const italicEnd2 = ".";

        let content = [boldStart1, childBold, boldEnd1, childLinebreak, italicStart1, childItalic1, italicStart2, childItalic2, italicEnd2];
        finalizeContent(child, childContent, content)

        childBold.style.color = `${arr[i].eye_color}`;
        childItalic1.style.fontSize = `${(arr[i].height / 10)}px`;
        childItalic1.style.textDecoration = "underline";
        childItalic2.style.fontSize = `${(arr[i].height / 10)}px`;
        childItalic2.style.textDecoration = "underline";
    }
}

async function updatePeople (newPageNum) {
    disablePagination();

    const api_url = "https://swapi.dev/api/people/"
    let api_url_people = (api_url + `?page=${newPageNum}`);
    const {dataSizeAll, dataSizePage, rawData, api_next} = await getInfo(api_url_people);
    
    let infoPeople = rawData.map(({name, height, mass, gender, eye_color}) => ({name, height, mass, gender, eye_color}));   
    let numOfPages = Math.trunc(dataSizeAll / dataSizePage);

    removeContent();
    if (api_next === null) {
        doc.getElementById("next").remove();
    }

    setContent(dataSizePage, infoPeople);
    enablePagination();
    return numOfPages;
}

async function updateAllContent (move) {
    let newPageNum = findPageNum(move);

    const {nextTag, backTag} = updatePaginationTags();
    nextTag.addEventListener("click", () => click('next'));
    backTag.addEventListener("click", () => click('back'));

    let numOfPages = await updatePeople(newPageNum);

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

async function getPeople (api_url_people) {
    const {dataSizePage, rawData} = await getInfo(api_url_people);
    let infoPeople = rawData.map(({name, height, mass, gender, eye_color}) => ({name, height, mass, gender, eye_color}));

    removeAllContent();

    const nextTag = setPagination();
    nextTag.addEventListener("click", () => click('next'));
    
    setContent(dataSizePage, infoPeople);
    disableLoader();
}

export {getPeople};