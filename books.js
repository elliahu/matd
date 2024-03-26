const fs = require('fs');
const { workerData } = require('worker_threads');

function removeHeader(text){
    const term = "START OF THE PROJECT GUTENBERG EBOOK";
    var str = text.substring(text.indexOf(term) + term.length);
    str = str.substring(str.indexOf("***") + 3);
    return str;
}

function clean(text){
    var str = text.replace(/\[[^\]]*\]/g, '');
    str = str.replace(/[^a-zA-Z0-9]/g, ' ');
    str = str.replace(/\s+/g, ' ');
    str = str.toLowerCase()
    return str;
}

function intersection(o1, o2) {
    return Object.keys(o1).concat(Object.keys(o2)).sort().reduce(function (r, a, i, aa) {
        if (i && aa[i - 1] === a) {
            r.push(a);
        }
        return r;
    }, []);
}

function getStopList(collection){
    var wordlists = [];

    for (const [filename, text] of Object.entries(collection)) {
        var wordlist = {};

        // split the text into words
        var words = text.split(/\s+/);
        
        for (const word of words) {
            // if the word is present in the stoplist, increment the value of the word in stoplist by one
            if (wordlist[word]) {
                wordlist[word]++;
            } 
            // if the word is not present in the stoplist already, add it there with a 1
            else {
                wordlist[word] = 1;
            }
        }
        
        wordlists.push(wordlist);
    }

    // make intersection of the objects(maps) stored in the wordslists array
    var stoplist = {};
    for (const wordlist of wordlists) {
        for (const word in wordlist) {
            if (wordlist.hasOwnProperty(word)) {
                if (stoplist[word]) {
                    stoplist[word]++;
                } else {
                    stoplist[word] = 1;
                }
            }
        }
    }

    return stoplist;
}


function getBookCollection(folder){
    var collection = {};

    fs.readdirSync(folder).forEach(file => {
        // raw data
        const data = fs.readFileSync(folder + '/' + file, 'utf8');
        collection[file] = data;

        // remove header
        collection[file] = removeHeader(collection[file]);

        // clean
        collection[file] = clean(collection[file]);
    });
    
    // get stoplist
    const stoplist = getStopList(collection);

    // remove words present in all documents
    
    for (const [filename, text] of Object.entries(collection)) {
        // split the text into words
        var words = text.split(/\s+/);
        let removed = 0;
        for (const word of words) {
            if(word in stoplist){
                // remove the word from the collection[filename]
                collection[filename] = collection[filename].replace(new RegExp('\\b'+ word +'\\b', 'g'), '');
                removed++;
            }
        }
    }
    console.log("Removed ", removed, " words");
    return collection;
}

module.exports = {getBookCollection};