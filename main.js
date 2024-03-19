const fs = require('node:fs');
const dfa = require('./dfa.js')
const hp = require('./horspool.js')
const bf = require('./bruteforce.js')
const utils = require('./utils.js')


// data
const text = fs.readFileSync('english.50MB', 'utf8');
const words = utils.generateRandomWords(text, 100);
console.log(words);


// ------------------------------
let startTime = performance.now();
words.forEach(word => {
    const position_bf = bf.bruteForceSearch(word, text)
});
let endTime = performance.now();
let elapsedTime = endTime - startTime;
console.log(`Brute force function execution took ${elapsedTime.toFixed(3)} milliseconds`);

// ------------------------------

startTime = performance.now();
words.forEach(word => {
    const _dfa = new dfa.DFA(word);
    const position_dfa = _dfa.search(text);
});
endTime = performance.now();
elapsedTime = endTime - startTime;
console.log(`DFA function execution took ${elapsedTime.toFixed(3)} milliseconds`);

// ------------------------------

startTime = performance.now();
words.forEach(word => {
    let _horspool = new hp.Horspool();
    let index = _horspool.search(text, word);
});
endTime = performance.now();
elapsedTime = endTime - startTime;
console.log(`HP algorithm execution took ${elapsedTime.toFixed(3)} milliseconds`);



// Results:
// console.log("Position BF:", position_bf);
// console.log("Position DFA:", position_dfa);
// console.log("Position HP:" , index);





