const fs = require('node:fs');
const dfa = require('./dfa.js')
const hp = require('./horspool.js')
const bf = require('./bruteforce.js')
const utils = require('./utils.js')
const fuzzy = require('./fuzzy_search.js')
const ps = require('./PorterStemmer1980.js')


const text = fs.readFileSync('english.50MB', 'utf8');
const chunk_size = 10000;
let total = 0;

utils.processTextInChunks(text,chunk_size, (chunk) => {
    let result = fuzzy.fuzzySearch(chunk, "survey", 0);
    if (result.length > 0){
        console.log(result);
        total += result.length;
    }
});

console.log("Found total of ", total , " matches");


