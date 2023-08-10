import { findPageNum, enableLoader, disableLoader, removeContent, disablePagination, enablePagination, createContentTags, setPagination, finalizeContent, updatePaginationTags, removeAllContent, getInfo, finalizePagination } from "./utilities.js";

const log = console.log;
const doc = document;

function setContent (num, arr) {
    for (let i = 0; i < num; i++) {
        const {child, childContent, childBold, childLinebreak} = createContentTags();

        let boldStart1 = "Sem ";
        childBold.append(arr[i].name);
        let boldEnd1 = ".";

        var childItalic1 = doc.createElement("i");
        if (arr[i].passengers == 1 || arr[i].passengers == 2) {
            var italicStart1 = "Prevažam lahko ";
            childItalic1.append(`${arr[i].passengers}`);
            var italicEnd1 = " potnika";
        } else if (arr[i].passengers == 3 || arr[i].passengers == 4) {
            var italicStart1 = "Prevažam lahko ";
            childItalic1.append(`${arr[i].passengers}`);
            var italicEnd1 = " potnike";
        } else if (arr[i].passengers === "n/a" || arr[i].passengers === "unknown") {
            var italicStart1 = "Prevažam lahko ";
            childItalic1.append(`neznano število`);
            var italicEnd1 = " potnikov";
        } else if (arr[i].passengers === undefined) {
            var italicStart1 = "";
            childItalic1.append(`Ne prevažam`);
            var italicEnd1 = " potnikov";
        } else {
            var italicStart1 = "Prevažam lahko ";
            childItalic1.append(`${arr[i].passengers}`);
            var italicEnd1 = " potnikov";
        }

        var childItalic2 = doc.createElement("i");
        if (arr[i].crew == 1 || arr[i].crew == 2) {
            var italicStart2 = " ter ";
            childItalic2.append(`${arr[i].crew}`);
            var italicEnd2 = " člana posadke.";
        } else if (arr[i].crew == 3 || arr[i].crew == 4) {
            var italicStart2 = " ter ";
            childItalic2.append(`${arr[i].crew}`);
            var italicEnd2 = " člane posadke.";
        } else if (arr[i].crew == "n/a" || arr[i].crew == "unknown") {
            var italicStart2 = " ter ";
            childItalic2.append(`neznano število`);
            var italicEnd2 = " članov posadke.";
        } else if (arr[i].crew === undefined) {
            var italicStart2 = " ter ";
            childItalic2.append(`ne prevažam`);
            var italicEnd2 = " članov posadke.";
        } else {
            var italicStart2 = " ter ";
            childItalic2.append(`${arr[i].crew}`);
            var italicEnd2 = " članov posadke.";
        }

        let content = [boldStart1, childBold, boldEnd1, childLinebreak, italicStart1, childItalic1, italicEnd1, italicStart2, childItalic2, italicEnd2];
        finalizeContent(child, childContent, content)
    }
}

async function updateTransport (newPageNum) {
    disablePagination();

    const api_url = "https://swapi.dev/api/vehicles/"
    let api_url_transport = (api_url + `?page=${newPageNum}`);
    const {dataSizeAll, dataSizePage, rawData, api_next} = await getInfo(api_url_transport);
    
    let infoTransport = rawData.map(({name, passengers, crew}) => ({name, passengers, crew}));   
    let numOfPages = Math.trunc(dataSizeAll / dataSizePage);

    removeContent();
    if (api_next === null) {
        doc.getElementById("next").remove();
    }

    setContent(dataSizePage, infoTransport);
    enablePagination();
    return numOfPages;
}

async function updateAllContent (move) {
    let newPageNum = findPageNum(move);

    const {nextTag, backTag} = updatePaginationTags();
    nextTag.addEventListener("click", () => click('next'));
    backTag.addEventListener("click", () => click('back'));

    let numOfPages = await updateTransport(newPageNum);

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

async function getTransport (api_url_transport) {
    const {dataSizePage, rawData} = await getInfo(api_url_transport);
    let infoTransport = rawData.map(({name, passengers, crew}) => ({name, passengers, crew}));

    removeAllContent();

    const nextTag = setPagination();
    nextTag.addEventListener("click", () => click('next'));
    
    setContent(dataSizePage, infoTransport);
    disableLoader();
}

export {getTransport};