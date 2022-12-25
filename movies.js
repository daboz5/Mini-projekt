import { disableLoader, removeDivs, removePagination } from "./short_functions.js";

var api_url = "https://swapi.dev/api/films/";
const log = console.log;
const doc = document;
const contentBox = doc.getElementById("content-box");

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

        boldNode.append(arr[i].title);
        boldNode.setAttribute("id", `${i}title`);

        const italicDirector = doc.createElement("i");
        let directorStart = `Direktor `;
        let director = arr[i].director;
        let directorEnd = ` me je dokončal`;
        italicDirector.append(director);

        const italicYear = doc.createElement("i");
        let yearInit = arr[i].release_date;
        let yearString = ""
        for (let j = 0; j < 4; j++) {
            yearString += yearInit[j];
        }
        italicYear.append(yearString);

        let content = ["Moj naslov je ", boldNode, ".", lineBreak, directorStart, italicDirector, directorEnd, " leta ", italicYear, "."];
        content.forEach(element => infoBox.append(element));

        newDiv.append(infoBox);
        contentBox.appendChild(newDiv);
    }
}

async function getMoviesInfo () {
    let response = await fetch(api_url);
    let data = await response.json();
    let dataSize = data.results.length;
    let rawMovies = data.results;
    let infoMovies = rawMovies.map(({title, release_date, director}) => ({title, release_date, director}));
    globalNext = data.next;
    globalBack = data.previous;
    globalCountPages = Math.trunc(data.count / dataSize);
log(rawMovies)
    removePagination();
    removeDivs();
    setDivs(dataSize, infoMovies);
    disableLoader();
}

export {getMoviesInfo};