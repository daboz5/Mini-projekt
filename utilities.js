const doc = document
const log = console.log

const loader = doc.getElementById("loader-wrapper");
const parent = doc.getElementById("content-box");
const pagination = document.getElementById("pagination");

const enableLoader = () => {
    loader.style.display = "flex";
}

const disableLoader = () => {
    loader.style.display = "none";
}

const removeContent = () => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const removePagination = () => {
    while (pagination.firstChild) {
        pagination.removeChild(pagination.firstChild);
    }
}

const disablePagination = () => {
    const next = doc.getElementById("next");
    const back = doc.getElementById("back");

    if (next && back) {
        next.disabled = true;
        back.disabled = true;
    } else if (next) {
        next.disabled = true;
    } else {
        back.disabled = true;
    }
}

const enablePagination = () => {
    const next = doc.getElementById("next");
    const back = doc.getElementById("back");
    
    if (next && back) {
        next.disabled = false;
        back.disabled = false;
    } else if (next) {
        next.disabled = false;
    } else {
        back.disabled = false;
    }
}

const getInfo = async (api_url) => {
    let response = await fetch(api_url);
    let data = await response.json();
    let dataSizeAll = data.count;
    let dataSizePage = data.results.length;
    let rawData = data.results;
    let api_next = data.next;

    return {dataSizeAll, dataSizePage, rawData, api_next};
};

const createContentTags = () => {
        const child = doc.createElement("div");
        const childContent = doc.createElement("p");
        const childBold = doc.createElement("b");
        const childLinebreak = doc.createElement("br");

        child.setAttribute("class", "content");
        childContent.setAttribute("class", "text");

        return {child, childContent, childBold, childLinebreak};
}

const setPagination = () => {
    const hereTag = doc.createElement("button");
    const nextTag = doc.createElement("button");
    const hereText = doc.createElement("p");
    const nextText = doc.createElement("p");

    hereText.setAttribute("id", "page-num");
    hereTag.setAttribute("id", "here");
    nextTag.setAttribute("id", "next");

    let here = "Page 1";
    let next = "Next";

    hereText.append(here);
    nextText.append(next);
    hereTag.append(hereText);
    nextTag.append(nextText);
    pagination.append(hereTag);
    pagination.append(nextTag);

    return nextTag;
}

const updatePaginationTags = () => {
    const nextTag = doc.createElement("button");
    const backTag = doc.createElement("button");
    const nextTextTag = doc.createElement("p");
    const backTextTag = doc.createElement("p");

    nextTag.setAttribute("id", "next");
    backTag.setAttribute("id", "back");

    let nextText = "Next";
    let backText = "Back";

    nextTextTag.append(nextText);
    backTextTag.append(backText);
    nextTag.append(nextTextTag);
    backTag.append(backTextTag);

    return {nextTag, backTag};
}

const finalizePagination = (numOfPages, newPageNum, move, nextTag, backTag) => {
    const here = doc.getElementById("here");
    const next = doc.getElementById("next");
    const back = doc.getElementById("back");
    let oldPageNumTag = doc.getElementById("page-num");
    
    let updatedPageNumTag = doc.createElement("p");
    updatedPageNumTag.setAttribute("id", "page-num");
    let updatedText = `Page ${newPageNum}`;
    updatedPageNumTag.append(updatedText);

    oldPageNumTag.replaceWith(updatedPageNumTag);
    if (newPageNum == 2 && move == "next") {
        pagination.insertBefore(backTag, here);
    } else if (newPageNum == 1 && move == "back") {
        back.remove();
    } else if (newPageNum > numOfPages && move == "next") {
        next.remove();
    } else if ((newPageNum + 1) > numOfPages && move == "back") {
        pagination.append(nextTag);
    }

    disableLoader();
}

const finalizeContent = (child, childContent, content) => {
    content.forEach(element => childContent.append(element));
    child.append(childContent);
    parent.appendChild(child);
}

const removeAllContent = () => {
    removePagination();
    removeContent();
}

const findPageNum = (move) => {
    let oldPageNumTag = doc.getElementById("page-num");
    let oldPageNumText = oldPageNumTag.textContent;
    let oldPageNum = parseInt(oldPageNumText[5], 10);
    if (move == "next") {
        var newPageNum = oldPageNum + 1;
    } else {
        var newPageNum = oldPageNum - 1;
    }
    return newPageNum;
}

export { enableLoader, disableLoader, removeContent, removePagination, disablePagination, enablePagination, getInfo, createContentTags, setPagination, finalizeContent, removeAllContent, updatePaginationTags, finalizePagination, findPageNum };