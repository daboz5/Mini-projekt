import { findPageNum, enableLoader, disableLoader, removeContent, disablePagination, enablePagination, createContentTags, setPagination, finalizeContent, updatePaginationTags, removeAllContent, getInfo, finalizePagination } from "./utilities.js";

const log = console.log;
const doc = document;

function setContent (num, arr) {
    for (let i = 0; i < num; i++) {
        const {child, childContent, childBold, childLinebreak} = createContentTags();

        let boldStart1 = "Sem ";
        childBold.append(arr[i].name);
        let boldEnd1 = ",";

        var childItalic1 = doc.createElement("i");
        if (arr[i].climate == "unknown") {
            var italicStart1 = " planet";
            childItalic1.append(" neznanega podnebja");
            var italicEnd1 = "";
        } else {
            var italicStart1 = " ";
            childItalic1.append(`${arr[i].climate}`);
            var italicEnd1 = " planet";
        }

        var childItalic2 = doc.createElement("i");
        if (arr[i].population === "n/a" || arr[i].population === "unknown") {
            var italicStart2 = " na katerem živi ";
            childItalic2.append("neznano število");
            var italicEnd2 = " prebivalcev.";
        } else {
            var italicStart2 = " na katerem živi ";
            var population = `${arr[i].population}`;
            let track = 0;
            let popStr = "";
            let popStrReverse = "";
            for (let j = population.length; j > 0; j--) {
                if (track == 3) {
                    popStr = "." + popStr;
                    track = 0;
                }
                    popStrReverse = population[j-1];
                    popStr = popStrReverse + popStr;
                    track++;
            }
            childItalic2.append(`${popStr}`);
            var italicEnd2 = " prebivalcev.";
        }

        let content = [boldStart1, childBold, boldEnd1, italicStart1, childItalic1, italicEnd1, childLinebreak, italicStart2, childItalic2, italicEnd2];
        finalizeContent(child, childContent, content)
    }
}

async function updatePlanets (newPageNum) {
    disablePagination();

    const api_url = "https://swapi.dev/api/planets/"
    let api_url_planets = (api_url + `?page=${newPageNum}`);
    const {dataSizeAll, dataSizePage, rawData, api_next} = await getInfo(api_url_planets);
    
    let infoPlanets = rawData.map(({name, height, mass, gender, eye_color}) => ({name, height, mass, gender, eye_color}));   
    let numOfPages = Math.trunc(dataSizeAll / dataSizePage);

    removeContent();
    if (api_next === null) {
        doc.getElementById("next").remove();
    }

    setContent(dataSizePage, infoPlanets);
    enablePagination();
    return numOfPages;
}

async function updateAllContent (move) {
    let newPageNum = findPageNum(move);

    const {nextTag, backTag} = updatePaginationTags();
    nextTag.addEventListener("click", () => click('next'));
    backTag.addEventListener("click", () => click('back'));

    let numOfPages = await updatePlanets(newPageNum);

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

async function getPlanets (api_url_planets) {
    const {dataSizePage, rawData} = await getInfo(api_url_planets);
    let infoPlanets = rawData.map(({name, climate, population}) => ({name, climate, population}));

    removeAllContent();

    const nextTag = setPagination();
    nextTag.addEventListener("click", () => click('next'));
    
    setContent(dataSizePage, infoPlanets);
    disableLoader();
}

export {getPlanets};