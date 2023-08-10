import { setHomePage, removeHomePage } from "./index.js";
import { enableLoader } from "./utilities.js";
import { getPeople } from "./people.js";
import { getShips } from "./starships.js";
import { getPlanets } from "./planets.js";
import { getMovies } from "./movies.js";
import { getSpecies } from "./species.js";
import { getTransport } from "./vehicles.js";

const log = console.log;
const api_url = "https://swapi.dev/api/";

const availableMoves = {
    "people": () => getPeople(api_url + "people/"),
    "planets": () => getPlanets(api_url + "planets/"),
    "movies": () => getMovies(api_url + "films/"),
    "species": () => getSpecies(api_url + "species/"),
    "vehicles": () => getTransport(api_url + "vehicles/"),
    "starships": () => getShips(api_url + "starships/")
}

const changeLocation = async (path) => {
    removeHomePage();
    enableLoader();
    if (availableMoves[path] !== undefined) {
        availableMoves[path]();
    } else {
        setHomePage();
    }
}

const route = (event, path) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", window.location.origin + "/" + path);
    changeLocation(path);
}

changeLocation(window.location.pathname?.substring(1));

window.route = route;