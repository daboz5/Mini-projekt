const doc = document
const log = console.log

const loader = doc.getElementById("loader-wrapper");
const contentBox = doc.getElementById("content-box");
const pagination = document.getElementById("pagination");

function enableLoader () {
    loader.style.display = "flex";
}

function disableLoader () {
    loader.style.display = "none";
}

function removeDivs () {
    while (contentBox.firstChild) {
        contentBox.removeChild(contentBox.firstChild);
    }
}

function removePagination () {
    while (pagination.firstChild) {
        pagination.removeChild(pagination.firstChild);
    }
}

function disablePagination () {
    if (doc.getElementById("next") && doc.getElementById("back")) {
        doc.getElementById("next").disabled = true;
        doc.getElementById("back").disabled = true;
    } else if (doc.getElementById("next")) {
        doc.getElementById("next").disabled = true;
    } else {
        doc.getElementById("back").disabled = true;
    }
}

function enablePagination () {
    if (doc.getElementById("next") && doc.getElementById("back")) {
        doc.getElementById("next").disabled = false;
        doc.getElementById("back").disabled = false;
    } else if (doc.getElementById("next")) {
        doc.getElementById("next").disabled = false;
    } else {
        doc.getElementById("back").disabled = false;
    }
}

export { enableLoader, disableLoader, removeDivs, removePagination, disablePagination, enablePagination };