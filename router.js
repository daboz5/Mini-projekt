import { setHomePage, endHomePage } from "./index.js";
import { enableLoader } from "./short_functions.js";
import { getPeopleInfo } from "./people.js";
import { getShipsInfo } from "./starships.js";
import { getPlanetsInfo } from "./planets.js";
import { getMoviesInfo } from "./movies.js";
import { getSpeciesInfo } from "./species.js";
import { getTransportInfo } from "./vehicles.js";

const log = console.log;

function route (event, path) {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", window.location.origin + "/" + path);
    changeLocation(path);
}

const changeLocation = async (path) => {
    endHomePage();
    enableLoader();
    if (path == "people") {
        getPeopleInfo();
    } else if (path == "planets") {
        getPlanetsInfo();
    } else if (path == "movies") {
        getMoviesInfo();
    } else if (path == "") {
        setHomePage();
    } else if (path == "species") {
        getSpeciesInfo();
    } else if (path == "vehicles") {
        getTransportInfo();
    } else if (path == "starships") {
        getShipsInfo();
        console.log('git test');
    }
}

setHomePage();

window.route = route;