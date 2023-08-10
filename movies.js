import { disableLoader, getInfo, createContentTags, finalizeContent, removeAllContent } from "./utilities.js";

const log = console.log;
const doc = document;

function setContent (num, arr) {
    for (let i = 0; i < num; i++) {
        const {child, childContent, childBold, childLinebreak} = createContentTags();

        let boldStart1 = "Moj naslov je ";
        childBold.append(arr[i].title);
        let boldEnd1 = ".";

        let italicStart1 = "Direktor ";
        const childItalic1 = doc.createElement("i");
        childItalic1.append(arr[i].director);
        let italicEnd1 = " me je dokončal";

        let italicStart2 = " leta ";
        const childItalic2 = doc.createElement("i");
        let year = "";
        for (let j = 0; j < 4; j++) {
            year += arr[i].release_date[j];
        }
        childItalic2.append(year);
        let italicEnd2 = ".";

        let content = [boldStart1, childBold, boldEnd1, childLinebreak, italicStart1, childItalic1, italicEnd1, italicStart2, childItalic2, italicEnd2];
        finalizeContent(child, childContent, content);
    }
}

async function getMovies (api_url_movies) {
    const {dataSizePage, rawData} = await getInfo(api_url_movies);
    let infoMovies = rawData.map(({title, release_date, director}) => ({title, release_date, director}));
    removeAllContent();
    setContent(dataSizePage, infoMovies);
    disableLoader();
}

export {getMovies};