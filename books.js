const fs = require('fs').promises;
const stemmer = require('./PorterStemmer1980');

function removeHeader(text) {
    const term = "START OF THE PROJECT GUTENBERG EBOOK";
    var str = text.substring(text.indexOf(term) + term.length);
    str = str.substring(str.indexOf("***") + 3);
    return str;
}

function removeFooter(text) {
    const term = "END OF THE PROJECT GUTENBERG EBOOK";
    var str = text.substring(0, text.indexOf(term));
    return str;
}

function clean(text) {
    var str = text.replace(/\[[^\]]*\]/g, '');
    str = str.replace(/[^a-zA-Z0-9]/g, '');
    str = str.replace(/\s+/g, '');
    str = str.replace('*', '');

    var result = "";
    var words = text.split(/\s+/);
    for (const word of words) {
        if (/^[a-zA-Z0-9]+$/.test(word))
            result += stemmer.stemmer(word).replace(/\s/g, '') + " ";
    }

    return result.toLowerCase();
}

function getStopList(collection, threshold) {
    var wordCounts = {};

    for (const [filename, text] of Object.entries(collection)) {
        var wordlist = new Set();

        var words = text.split(/\s+/);

        for (const word of words) {
            if (word !== '') {
                wordlist.add(word);
            }
        }

        for (const word of wordlist) {
            if (word in wordCounts) {
                wordCounts[word]++;
            } else {
                wordCounts[word] = 1;
            }
        }
    }

    // Create stoplist based on threshold
    var stoplist = [];
    for (const [word, count] of Object.entries(wordCounts)) {
        if (count >= threshold) {
            stoplist.push(word);
        }
    }

    return stoplist;
}

function reduceCollection(collection, threshold) {
    // get stoplist
    const stoplist = getStopList(collection, threshold);
    console.log(stoplist);

    for (const stopword of stoplist) {
        for (const [filename, text] of Object.entries(collection)) {
            if (/^[a-zA-Z0-9]+$/.test(stopword))
                collection[filename] = collection[filename].replace(new RegExp('\\b' + stopword + '\\b', 'g'), '');
        }
    }

    return collection;
}

async function getBookCollection(folder) {
    var collection = {};
    const files = await fs.readdir(folder);

    for (let file of files) {
        // raw data
        const data = await fs.readFile(`${folder}/${file}`, 'utf8');
        collection[file] = data;

        // remove header
        collection[file] = removeHeader(collection[file]);

        // remove footer
        collection[file] = removeFooter(collection[file]);

        // clean
        collection[file] = clean(collection[file]);
    }

    collection = reduceCollection(collection, 53);

    return collection;
}

async function saveCollection(folder, collection) {
    // create folder if not exists
    try {
        await fs.access(folder);
    } catch (error) {
        await fs.mkdir(folder, { recursive: true });
    }

    for (const [filename, content] of Object.entries(collection)) {
        // save file filename into the folder folder and write content into it
        await fs.writeFile(`${folder}/${filename}`, content);
    }
}

function getInvertedIndex(collection) {
    const index = new Map();

    for (const [filename, text] of Object.entries(collection)) {
        var words = text.split(/\s+/);

        words.forEach(word => {
            if (index.has(word)) {
                const list = index.get(word);
                if (!list.includes(filename))
                    list.push(filename);
                index.set(word, list)
            }
            else {
                index.set(word, [filename]);
            }
        });
    }

    return index;
}

function getSearchEngine(collection, index) {

    function searchSingle(term) {
        let t = term.replace(/[^a-zA-Z0-9]/g, '');
        t = t.toLowerCase();
        t = stemmer.stemmer(t);

        console.log("Searching for ", t);

        if (index.has(t)) {
            let list = index.get(t);
            return list;
        }

        return [];
    }

    function search(term) {
        let results = [];

        let words = term.split("AND");
        words.forEach(word => {
            let s = searchSingle(word.replace(/\s/g, ""));
            results.push(s);
        });

        return results.reduce((a, b) => a.filter(c => b.includes(c)));
    }

    const engine = {
        collection: collection,
        searchSingle: searchSingle,
        search: search,
    };

    return engine;
}


module.exports = {
    getBookCollection,
    getStopList,
    saveCollection,
    getInvertedIndex,
    getSearchEngine
};