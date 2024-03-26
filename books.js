const fs = require('fs');

function removeHeader(text){
    const term = "START OF THE PROJECT GUTENBERG EBOOK";
    var str = text.substring(text.indexOf(term) + term.length);
    str = str.substring(str.indexOf("***") + 3);
    return str;
}

function removeFooter(text){
    const term = "END OF THE PROJECT GUTENBERG EBOOK";
    var str = text.substring(0, text.indexOf(term));
    return str;
}

function clean(text){
    var str = text.replace(/\[[^\]]*\]/g, '');
    str = str.replace(/[^a-zA-Z0-9]/g, ' ');
    str = str.replace(/\s+/g, ' ');
    str = str.toLowerCase()
    return str;
}

function getStopList(collection){
    var wordlists = [];

    for (const [filename, text] of Object.entries(collection)) {
        var wordlist = [];

        var words = text.split(/\s+/);
        
        for (const word of words) {
            if (!wordlist.includes(word)) {
                wordlist.push(word);
            } 
        }

        wordlists.push(wordlist);
    }

    // TODO this part is crazy slow and has to be made quicker
    // multiple array intersection
    var stoplist = wordlists.reduce((a, b) => a.filter(c => b.includes(c))); 

    
    return stoplist;
}

function reduceCollection(collection){
    // get stoplist
    const stoplist = getStopList(collection);

    // remove words present in all documents
    for (const [filename, text] of Object.entries(collection)) {
        // split the text into words
        var words = text.split(/\s+/);
        let removed = 0;
        for (const word of words) {
            if(stoplist.includes(word)){
                // remove the word from the collection[filename]
                collection[filename] = collection[filename].replace(new RegExp('\\b'+ word +'\\b', 'g'), '');
                removed++;
            }
        }
    }
    return collection;
}

function getBookCollection(folder){
    var collection = {};

    fs.readdirSync(folder).forEach(file => {
        // raw data
        const data = fs.readFileSync(folder + '/' + file, 'utf8');
        collection[file] = data;

        // remove header
        collection[file] = removeHeader(collection[file]);

        // remove footer
        collection[file] = removeFooter(collection[file]);

        // clean
        collection[file] = clean(collection[file]);
    });
    
    //collection = reduceCollection(collection);

    return collection;
}

module.exports = {getBookCollection, getStopList};