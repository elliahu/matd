const fs = require('node:fs');
const dfa = require('./dfa.js')
const hp = require('./horspool.js')
const bf = require('./bruteforce.js')
const utils = require('./utils.js')
const fuzzy = require('./fuzzy_search.js')
const ps = require('./PorterStemmer1980.js')
const book = require('./books.js')


console.log(book.getBookCollection('gutenberg')['11-0.txt'].substring(0,1000));


